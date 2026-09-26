(function(){
  if(typeof verbs==="undefined"||!Array.isArray(verbs)||!verbs.length)return;
  if(!state.conjugatedVerbMastery)state.conjugatedVerbMastery={};
  if(!state.conjugatedVerbHistory)state.conjugatedVerbHistory=[];
  save();

  const PRONOUNS={"אני":"I","אתה":"you (m.s.)","את":"you (f.s.)","הוא":"he","היא":"she","אנחנו":"we","אתם":"you (m.pl.)","אתן":"you (f.pl.)","הם":"they (m.)","הן":"they (f.)"};
  const TENSES={present:"present",past:"past",future:"future"};
  const QUIZ_LEN=20;
  let matchSession=null;

  function verbMeaning(inf){
    let d=verbDefinitions.find(function(x){return x.he===inf});
    return d&&d.en?d.en:inf;
  }
  function buildConjugatedForms(){
    let out=[];
    verbs.forEach(function(v){
      ["present","past","future"].forEach(function(tense){
        let forms=v[tense]||{},groups={};
        Object.keys(forms).forEach(function(pron){
          let he=forms[pron];if(!he)return;
          if(!groups[he])groups[he]=[];
          if(!groups[he].includes(pron))groups[he].push(pron)
        });
        Object.keys(groups).forEach(function(he){
          let prons=groups[he],id=v.infinitive+"|"+tense+"|"+he;
          out.push({id:id,he:he,infinitive:v.infinitive,tense:tense,pronouns:prons,en:verbMeaning(v.infinitive)+" — "+TENSES[tense]+" • "+prons.map(function(p){return PRONOUNS[p]||p}).join(" / ")})
        })
      })
    });
    return out
  }
  const conjugatedForms=buildConjugatedForms();

  function progress(item){
    if(!state.conjugatedVerbMastery[item.id])state.conjugatedVerbMastery[item.id]={correctCount:0,missed:0,lastSeen:null};
    return state.conjugatedVerbMastery[item.id]
  }
  function isMastered(item){return (progress(item).correctCount||0)>=10}
  function reviewWeight(item){
    let p=progress(item);
    if(!p.lastSeen)return 10;
    if((p.missed||0)>0)return 4+Math.min(18,(p.missed||0)*4)+Math.max(0,10-(p.correctCount||0));
    if((p.correctCount||0)<10)return 2+(10-(p.correctCount||0))*.7;
    return .35
  }
  function weightedPick(excludeId){
    let pool=conjugatedForms.filter(function(x){return x.id!==excludeId});
    let total=pool.reduce(function(s,x){return s+reviewWeight(x)},0),r=Math.random()*total;
    for(let i=0;i<pool.length;i++){r-=reviewWeight(pool[i]);if(r<=0)return pool[i]}
    return pool[pool.length-1]
  }
  function buildQueue(){
    let q=[],last=null;
    for(let i=0;i<QUIZ_LEN;i++){let x=weightedPick(last&&last.id);if(!x)break;q.push(x);last=x}
    return q
  }
  function choicesFor(item){
    let opts=[item.en];
    let sameTense=shuffle(conjugatedForms.filter(function(x){return x.id!==item.id&&x.tense===item.tense&&x.en!==item.en}));
    let rest=shuffle(conjugatedForms.filter(function(x){return x.id!==item.id&&x.en!==item.en}));
    sameTense.concat(rest).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
    return shuffle(opts)
  }
  function stats(){
    let mastered=conjugatedForms.filter(isMastered).length;
    let review=conjugatedForms.filter(function(x){return (progress(x).missed||0)>0&&!isMastered(x)}).length;
    return{mastered:mastered,review:review,total:conjugatedForms.length}
  }
  function renderSummary(){
    let s=stats();
    $("conjVerbMastered").textContent=s.mastered+" / "+s.total;
    $("conjVerbReview").textContent=s.review;
    $("conjVerbBadge").classList.toggle("hidden",s.review===0)
  }
  function start(){
    matchSession={queue:buildQueue(),index:0,correct:0,attempted:0,current:null};
    $("conjVerbSetup").classList.add("hidden");$("conjVerbResult").classList.add("hidden");$("conjVerbPanel").classList.remove("hidden");
    next();window.scrollTo({top:$("conjVerbCard").offsetTop-10,behavior:"smooth"})
  }
  function next(){
    if(!matchSession)return;
    if(matchSession.index>=matchSession.queue.length){finish();return}
    let item=matchSession.queue[matchSession.index];matchSession.current=item;
    let p=progress(item);
    $("conjVerbProgress").textContent=(matchSession.index+1)+" / "+matchSession.queue.length;
    $("conjVerbScore").textContent=matchSession.correct+" / "+matchSession.attempted;
    $("conjVerbPrompt").textContent=item.he;
    $("conjVerbMeta").textContent="Match the Hebrew form to its English definition. Mastery: "+Math.min(10,p.correctCount||0)+"/10"+(p.missed?" • weighted for review":"");
    $("conjVerbFeedback").classList.add("hidden");$("nextConjVerbBtn").classList.add("hidden");
    let area=$("conjVerbChoices");area.innerHTML="";
    choicesFor(item).forEach(function(opt){
      let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="ltr";b.onclick=function(){answer(b,opt)};area.appendChild(b)
    })
  }
  function answer(btn,opt){
    if(!matchSession||!$("nextConjVerbBtn").classList.contains("hidden"))return;
    let item=matchSession.current,p=progress(item),ok=norm(opt)===norm(item.en);
    matchSession.attempted++;if(ok)matchSession.correct++;
    Array.from($("conjVerbChoices").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(item.en))b.classList.add("correct")});
    if(!ok)btn.classList.add("wrong");
    if(ok){p.correctCount=Math.min(10,(p.correctCount||0)+1);p.missed=Math.max(0,(p.missed||0)-1)}else p.missed=(p.missed||0)+1;
    p.lastSeen=new Date().toISOString();save();renderSummary();
    let f=$("conjVerbFeedback");
    f.textContent=ok?(item.he+" — "+item.en+". Mastery: "+p.correctCount+"/10."):("Correct match: "+item.he+" — "+item.en+". This form is now weighted more heavily for review.");
    f.className="feedback "+(ok?"good":"bad");
    $("conjVerbScore").textContent=matchSession.correct+" / "+matchSession.attempted;
    $("nextConjVerbBtn").textContent=matchSession.index>=matchSession.queue.length-1?"Finish":"Next verb";
    $("nextConjVerbBtn").classList.remove("hidden")
  }
  function advance(){if(!matchSession)return;matchSession.index++;next()}
  function finish(){
    if(!matchSession)return;
    let s=matchSession,pct=s.attempted?Math.round(s.correct/s.attempted*100):0;
    state.conjugatedVerbHistory.push({date:new Date().toISOString(),correct:s.correct,total:s.attempted,accuracy:pct});save();
    matchSession=null;$("conjVerbPanel").classList.add("hidden");$("conjVerbSetup").classList.remove("hidden");
    let r=$("conjVerbResult");r.textContent="Conjugated verb match: "+s.correct+" / "+s.attempted+" ("+pct+"%). Missed and not-yet-mastered forms remain weighted for future quizzes.";r.className="feedback good";renderSummary()
  }
  function exit(){matchSession=null;$("conjVerbPanel").classList.add("hidden");$("conjVerbSetup").classList.remove("hidden");renderSummary()}

  function install(){
    if($("conjVerbCard"))return;
    let card=document.createElement("section");card.id="conjVerbCard";card.className="card";
    card.innerHTML='<div class="sectionTitle"><div><h2>Conjugated Verb Matching</h2><p class="compact">Match each conjugated Hebrew verb to its English definition. Past, present, and future forms from the full verb table are included.</p></div><span id="conjVerbBadge" class="badge hidden">Review weighted</span></div>'+ 
      '<div class="miniStats"><div><span>Mastered forms</span><b id="conjVerbMastered">0 / 0</b></div><div><span>Weighted review</span><b id="conjVerbReview">0</b></div></div>'+ 
      '<div id="conjVerbSetup" class="buttonRow sprintSetup"><button id="startConjVerbBtn" class="secondary">Start 20-question match</button></div>'+ 
      '<div id="conjVerbPanel" class="hidden"><div class="sprintStats"><div><span>Question</span><b id="conjVerbProgress">1 / 20</b></div><div><span>Correct</span><b id="conjVerbScore">0 / 0</b></div></div><div class="category">Conjugated verbs</div><div id="conjVerbPrompt" class="prompt" dir="rtl"></div><div id="conjVerbMeta" class="instruction"></div><div id="conjVerbChoices" class="choices"></div><div id="conjVerbFeedback" class="feedback hidden"></div><button id="nextConjVerbBtn" class="primary wide hidden">Next verb</button><button id="exitConjVerbBtn" class="secondary wide">Return to lesson</button></div>'+ 
      '<div id="conjVerbResult" class="feedback hidden"></div><p class="compact">Each distinct conjugated form reaches mastery after 10 correct matches. Incorrect forms are weighted to appear more often; mastered forms remain available at a low reinforcement weight.</p>';
    let anchor=$("verbInfinitiveCard");anchor.parentNode.insertBefore(card,anchor);
    $("startConjVerbBtn").onclick=start;$("nextConjVerbBtn").onclick=advance;$("exitConjVerbBtn").onclick=exit;
    renderSummary()
  }
  install();
})();
