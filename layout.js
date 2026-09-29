(function(){
  function el(id){return document.getElementById(id)}
  function addStyles(){
    if(el('compactLayoutStyles'))return;
    const s=document.createElement('style');s.id='compactLayoutStyles';
    s.textContent=`
      .practiceHub{padding:16px 18px}.practiceNav{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}
      .practiceNavBtn{display:flex;align-items:center;justify-content:flex-start;gap:9px;text-align:left;background:#eef3f6;color:var(--ink);border:2px solid transparent;min-height:58px;padding:10px 12px;font-weight:700}
      .practiceNavBtn.active{background:#e5eef4;border-color:var(--blue);color:var(--navy)}.practiceNavIcon{display:flex;align-items:center;justify-content:center;width:30px;height:30px;flex:0 0 30px;border-radius:9px;background:#fff;font-size:18px;font-weight:800}
      .practiceToolCard{scroll-margin-top:88px}.referenceGuide{font-size:14px;line-height:1.55}.referenceGuide .levels{line-height:1.5}
      .reviewCardCompact{padding:13px 16px}.reviewCardCompact .sectionTitle h2{margin:0}.reviewCardCompact #practiceMissedBtn{min-height:40px;padding:8px 12px}.reviewCardCompact #reviewList:empty{display:none}.reviewCardCompact .reviewList{margin-top:8px}
      .reviewWordList{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0}.reviewWordChip{background:#eef2f5;border-radius:999px;padding:7px 10px;font-size:14px}.reviewWordChip b{margin-left:5px;color:var(--muted)}
      #quizCard{border-top:4px solid var(--blue)}
      @media(max-width:650px){
        main{padding-top:10px}.card{margin-bottom:11px;padding:15px;border-radius:15px}header{padding-bottom:10px}header h1{font-size:19px}
        .stats{gap:7px;margin-top:10px}.stats div{padding:8px}.stats b{font-size:17px}.progress{margin-top:9px}
        .practiceNav{grid-template-columns:1fr 1fr}.practiceNavBtn{font-size:14px;min-height:54px}.practiceNavIcon{width:27px;height:27px;flex-basis:27px}
        #quizCard .prompt{margin-top:13px}.reviewCardCompact .sectionTitle{align-items:center}
      }
      @media(max-width:390px){.practiceNav{grid-template-columns:1fr}.practiceNavBtn{min-height:48px}.practiceHub .compact{font-size:13px}}
    `;document.head.appendChild(s)
  }
  function makeButton(label,id,icon){const b=document.createElement('button');b.className='practiceNavBtn';b.dataset.target=id;b.innerHTML='<span class="practiceNavIcon">'+icon+'</span><span>'+label+'</span>';return b}

  function vocabReviewItems(){
    const seen={};let out=[];
    Object.keys(state.masteryReview||{}).forEach(function(key){
      if(key.indexOf('vocab:')!==0)return;let he=key.slice(6),item=vocab.find(function(v){return v.he===he}),rec=state.masteryReview[key];
      if(item&&rec&&(rec.correctCount||0)<10){seen[he]=true;out.push({item:item,rec:rec,key:key})}
    });
    Object.keys(state.missed||{}).forEach(function(he){
      if(seen[he]||(state.missed[he]||0)<=0)return;let item=vocab.find(function(v){return v.he===he});if(!item)return;
      let key='vocab:'+he,rec={key:key,level:Math.min(state.level||1,5),correctCount:0,question:{type:'typedHe',item:item,prompt:item.en,correct:item.he},date:new Date().toISOString()};
      state.masteryReview[key]=rec;out.push({item:item,rec:rec,key:key})
    });
    return out
  }
  function reviewWeight(x){let misses=(state.missed&&state.missed[x.item.he])||0,remaining=Math.max(0,10-(x.rec.correctCount||0));return 2+remaining+Math.min(15,misses*3)}
  function weightedReviewPick(pool,lastHe){
    let p=pool.filter(function(x){return x.item.he!==lastHe});if(!p.length)p=pool.slice();if(!p.length)return null;
    let total=p.reduce(function(n,x){return n+reviewWeight(x)},0),r=Math.random()*total;
    for(let i=0;i<p.length;i++){r-=reviewWeight(p[i]);if(r<=0)return p[i]}return p[p.length-1]
  }
  function reviewChoices(item,reverse){
    let correct=reverse?item.he:item.en,opts=[correct],same=shuffle(vocab.filter(function(v){return v.he!==item.he&&v.cat===item.cat})),rest=shuffle(vocab.filter(function(v){return v.he!==item.he}));
    same.concat(rest).forEach(function(v){let a=reverse?v.he:v.en;if(opts.length<4&&!opts.includes(a))opts.push(a)});return shuffle(opts)
  }
  function refreshReviewWordSummary(){
    if(!el('reviewWordsRemaining'))return;let items=vocabReviewItems();el('reviewWordsRemaining').textContent=items.length;
    let list=el('reviewWordsList');list.innerHTML='';
    if(!items.length){list.innerHTML='<span class="empty">No vocabulary words are waiting for review.</span>';return}
    items.sort(function(a,b){return (a.rec.correctCount||0)-(b.rec.correctCount||0)}).slice(0,30).forEach(function(x){let c=document.createElement('span');c.className='reviewWordChip';c.dir='rtl';c.innerHTML=x.item.he+' <b>'+Math.min(10,x.rec.correctCount||0)+'/10</b>';list.appendChild(c)})
  }
  function createReviewWordsCard(){
    if(el('reviewWordsCard'))return el('reviewWordsCard');
    const card=document.createElement('section');card.id='reviewWordsCard';card.className='card';
    card.innerHTML='<div class="sectionTitle"><div><h2>Review Words</h2><p class="compact">Practice only vocabulary currently in your review queue. Weaker and more frequently missed words appear more often.</p></div><span class="badge"><span id="reviewWordsRemaining">0</span> words</span></div><div id="reviewWordsList" class="reviewWordList"></div><div id="reviewWordsSetup" class="buttonRow"><button id="startReviewWordsBtn" class="secondary">Start 20-question review</button></div><div id="reviewWordsPanel" class="hidden"><div class="sprintStats"><div><span>Question</span><b id="reviewWordsProgress">1 / 20</b></div><div><span>Correct</span><b id="reviewWordsScore">0 / 0</b></div></div><div id="reviewWordsDirection" class="category"></div><div id="reviewWordsPrompt" class="prompt"></div><div id="reviewWordsMastery" class="instruction"></div><div id="reviewWordsChoices" class="choices"></div><div id="reviewWordsFeedback" class="feedback hidden"></div><button id="nextReviewWordBtn" class="primary wide hidden">Next word</button><button id="exitReviewWordsBtn" class="secondary wide">Return to Practice Library</button></div><div id="reviewWordsResult" class="feedback hidden"></div><p class="compact">This practice does not change your level score. Each correct answer advances that word toward the same 10-correct mastery target used by the main review system.</p>';
    document.querySelector('main').appendChild(card);refreshReviewWordSummary();return card
  }
  let reviewSession=null;
  function startReviewWords(){
    let pool=vocabReviewItems();let result=el('reviewWordsResult');result.classList.add('hidden');
    if(!pool.length){result.textContent='Your vocabulary review queue is clear.';result.className='feedback good';return}
    reviewSession={index:0,correct:0,attempted:0,total:20,lastHe:null,current:null,reverse:false};el('reviewWordsSetup').classList.add('hidden');el('reviewWordsPanel').classList.remove('hidden');nextReviewWord()
  }
  function nextReviewWord(){
    if(!reviewSession)return;if(reviewSession.index>=reviewSession.total){finishReviewWords();return}
    let pool=vocabReviewItems();if(!pool.length){finishReviewWords(true);return}
    let x=weightedReviewPick(pool,reviewSession.lastHe);if(!x){finishReviewWords(true);return}reviewSession.current=x;reviewSession.lastHe=x.item.he;reviewSession.reverse=Math.random()<.5;
    let reverse=reviewSession.reverse,item=x.item;el('reviewWordsProgress').textContent=(reviewSession.index+1)+' / '+reviewSession.total;el('reviewWordsScore').textContent=reviewSession.correct+' / '+reviewSession.attempted;
    el('reviewWordsDirection').textContent=reverse?'English → Hebrew':'Hebrew → English';el('reviewWordsPrompt').textContent=reverse?item.en:item.he;el('reviewWordsPrompt').dir=reverse?'ltr':'rtl';el('reviewWordsMastery').textContent='Mastery: '+Math.min(10,x.rec.correctCount||0)+'/10';
    el('reviewWordsFeedback').classList.add('hidden');el('nextReviewWordBtn').classList.add('hidden');let area=el('reviewWordsChoices');area.innerHTML='';
    reviewChoices(item,reverse).forEach(function(opt){let b=document.createElement('button');b.className='choice';b.textContent=opt;b.dir=reverse?'rtl':'ltr';b.onclick=function(){answerReviewWord(b,opt)};area.appendChild(b)})
  }
  function answerReviewWord(btn,opt){
    if(!reviewSession||!el('nextReviewWordBtn').classList.contains('hidden'))return;let x=reviewSession.current,item=x.item,correct=reviewSession.reverse?item.he:item.en,ok=norm(opt)===norm(correct);
    reviewSession.attempted++;if(ok)reviewSession.correct++;Array.from(el('reviewWordsChoices').children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(correct))b.classList.add('correct')});if(!ok)btn.classList.add('wrong');
    if(ok){x.rec.correctCount=Math.min(10,(x.rec.correctCount||0)+1);if(x.rec.correctCount>=10){delete state.masteryReview[x.key];if(state.missed)delete state.missed[item.he]}}else{state.missed[item.he]=(state.missed[item.he]||0)+1}
    save();refreshReviewWordSummary();let f=el('reviewWordsFeedback');f.textContent=ok?(item.he+' — '+item.en+(x.rec.correctCount>=10?' • mastered and cleared from review.':' • mastery '+x.rec.correctCount+'/10.')):('Correct answer: '+item.he+' — '+item.en+'. This word remains weighted for review.');f.className='feedback '+(ok?'good':'bad');
    el('reviewWordsScore').textContent=reviewSession.correct+' / '+reviewSession.attempted;el('nextReviewWordBtn').textContent=reviewSession.index>=reviewSession.total-1?'Finish':'Next word';el('nextReviewWordBtn').classList.remove('hidden')
  }
  function advanceReviewWord(){if(!reviewSession)return;reviewSession.index++;nextReviewWord()}
  function finishReviewWords(cleared){
    if(!reviewSession)return;let s=reviewSession,pct=s.attempted?Math.round(s.correct/s.attempted*100):0;reviewSession=null;el('reviewWordsPanel').classList.add('hidden');el('reviewWordsSetup').classList.remove('hidden');let r=el('reviewWordsResult');r.textContent=(cleared?'Review queue cleared. ':'')+'Review score: '+s.correct+' / '+s.attempted+' ('+pct+'%).';r.className='feedback good';refreshReviewWordSummary()
  }
  function exitReviewWords(){reviewSession=null;el('reviewWordsPanel').classList.add('hidden');el('reviewWordsSetup').classList.remove('hidden');refreshReviewWordSummary()}

  function install(){
    addStyles();const main=document.querySelector('main'),quiz=el('quizCard');if(!main||!quiz||el('practiceHub'))return;
    const message=el('message');if(message)message.insertAdjacentElement('afterend',quiz);
    const reviewCard=Array.from(main.querySelectorAll(':scope > section.card')).find(function(s){return s.querySelector('#reviewList')});if(reviewCard){reviewCard.classList.add('reviewCardCompact');quiz.insertAdjacentElement('afterend',reviewCard)}
    const hub=document.createElement('section');hub.id='practiceHub';hub.className='card practiceHub';hub.innerHTML='<div class="sectionTitle"><div><h2>Practice Library</h2><p class="compact">Choose an activity. The rest stay tucked away until you need them.</p></div><span class="badge">Practice</span></div><div id="practiceNav" class="practiceNav"></div><button id="closePracticeTool" class="secondary wide hidden">Close practice activity</button>';(reviewCard||quiz).insertAdjacentElement('afterend',hub);
    createReviewWordsCard();
    const tools=[['Review Words','reviewWordsCard','✓'],['Rapid Recognition','rapidCard','⚡'],['Reading','readingLibraryCard','א'],['Conjugated Verbs','conjVerbCard','↔'],['Infinitives','verbInfinitiveCard','ל'],['Script Practice','scriptPracticeCard','✍︎']];const nav=el('practiceNav');
    tools.forEach(function(t){const card=el(t[1]);if(!card)return;card.classList.add('practiceToolCard','hidden');hub.insertAdjacentElement('afterend',card);nav.appendChild(makeButton(t[0],t[1],t[2]))});
    const guide=Array.from(main.querySelectorAll(':scope > section.card')).find(function(s){const h=s.querySelector('h2');return h&&h.textContent.trim()==='Difficulty progression'});if(guide){guide.id='progressionGuide';guide.classList.add('practiceToolCard','referenceGuide','hidden');hub.insertAdjacentElement('afterend',guide);nav.appendChild(makeButton('Progression Guide','progressionGuide','?'))}
    function closeAll(){document.querySelectorAll('.practiceToolCard').forEach(function(c){c.classList.add('hidden')});document.querySelectorAll('.practiceNavBtn').forEach(function(b){b.classList.remove('active')});el('closePracticeTool').classList.add('hidden')}
    nav.addEventListener('click',function(e){const b=e.target.closest('.practiceNavBtn');if(!b)return;const target=el(b.dataset.target),already=b.classList.contains('active');closeAll();if(already)return;if(target){if(target.id==='reviewWordsCard')refreshReviewWordSummary();target.classList.remove('hidden');b.classList.add('active');el('closePracticeTool').classList.remove('hidden');target.scrollIntoView({behavior:'smooth',block:'start'})}});
    el('closePracticeTool').addEventListener('click',function(){closeAll();hub.scrollIntoView({behavior:'smooth',block:'start'})});el('startReviewWordsBtn').onclick=startReviewWords;el('nextReviewWordBtn').onclick=advanceReviewWord;el('exitReviewWordsBtn').onclick=exitReviewWords;document.body.classList.add('compactTrainerLayout')
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();

// Load the manual answer-correction extension after the main trainer is ready.
(function(){
  if(document.querySelector('script[data-answer-override]'))return;
  const s=document.createElement('script');s.src='answer-override.js';s.dataset.answerOverride='1';document.body.appendChild(s)
})();
