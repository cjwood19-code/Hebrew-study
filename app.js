const D=window.TRAINER_DATA,vocab=D.vocab,sentences=D.sentences,verbs=D.verbs||[],connectors=D.connectors||[],matches=D.matches||[],opposites=D.opposites||[],grammarQuestions=D.grammarQuestions||[],classVerbQuestions=D.classVerbQuestions||[],verbDefinitions=D.verbDefinitions||[],bookExercises=D.bookExercises||[],SESSION_LEN=15,PASS=85,TEST_LEN=20,TEST_PASS=85;
const levelNames=["","Hebrew → English","English → Hebrew","Mixed recognition","Typed English meaning","Typed Hebrew recall","Sentence reading & comprehension","Hebrew matching & opposites","Grammar in context: connectors, agreement & היה","Verbs: infinitive + שם פעולה + past/present/future","Sentence building","Apple Pencil handwriting","Mixed cumulative challenge"];
const advancedFocusNames=["Sentence reading & comprehension","Hebrew matching & opposites","Grammar in context: connectors, agreement & היה","Verbs: infinitive + שם פעולה + past/present/future","Sentence building","Apple Pencil handwriting","Mixed cumulative challenge"];
function levelName(level){
  if(level<=12)return levelNames[level]||"Practice";
  let cycle=Math.floor((level-13)/7)+1,focus=advancedFocusNames[(level-13)%7];
  return focus+" • Advanced cycle "+cycle
}
function exerciseLevel(level){
  if(level<=12)return level;
  return 6+((level-13)%7)
}
let state=JSON.parse(localStorage.getItem("hebrewTrainerState")||"null")||{level:1,best:{},missed:{},history:[],session:null,focus:false};
let current=null,locked=false,tileAnswer=[],sprint=null,sprintTimer=null;
const $=function(id){return document.getElementById(id)};
const HEBREW_TEXT_RE=/[\u0590-\u05FF]/;
function hebrewVoice(){
  if(!("speechSynthesis" in window))return null;
  let voices=window.speechSynthesis.getVoices()||[];
  return voices.find(function(v){return (v.lang||"").toLowerCase()==="he-il"})||
         voices.find(function(v){return (v.lang||"").toLowerCase().startsWith("he")})||null
}
function speakHebrewText(text){
  text=(text||"").trim();
  if(!text||!HEBREW_TEXT_RE.test(text))return;
  if(!("speechSynthesis" in window)){alert("Hebrew audio is not available in this browser.");return}
  window.speechSynthesis.cancel();
  let u=new SpeechSynthesisUtterance(text);
  u.lang="he-IL";u.rate=.82;u.pitch=1;
  let v=hebrewVoice();if(v)u.voice=v;
  window.speechSynthesis.speak(u)
}
function pronunciationTextForQuestion(q,revealAnswer){
  if(!q)return null;
  let visible=$("prompt")?$("prompt").textContent:"";
  if(!revealAnswer&&HEBREW_TEXT_RE.test(visible)&&!visible.includes("___"))return visible;
  if(!revealAnswer)return null;
  if(q.fullHebrew&&HEBREW_TEXT_RE.test(q.fullHebrew))return q.fullHebrew;
  if(q.item&&q.item.he)return q.item.he;
  if(q.correctWord&&HEBREW_TEXT_RE.test(q.correctWord))return q.correctWord;
  if(q.correctConnector&&HEBREW_TEXT_RE.test(q.correctConnector))return q.correctConnector;
  if(q.correctGrammar&&HEBREW_TEXT_RE.test(q.correctGrammar))return q.correctGrammar;
  let correct=String(q.correct||"").split("||")[0];
  return HEBREW_TEXT_RE.test(correct)?correct:null
}
function practiceSource(q){
  if(q.bookSource)return q.bookSource;
  if(q.item&&q.item.source)return q.item.source.document+(q.item.source.pdfPage?" • PDF page "+q.item.source.pdfPage:"");
  if(q.sentenceObj&&q.sentenceObj.generated)return "Supplemental sentence practice";
  return null
}
function updatePronunciationButton(text){
  let b=$("pronounceBtn");if(!b)return;
  let usable=(text||"").trim();
  let show=!!usable&&HEBREW_TEXT_RE.test(usable)&&!usable.includes("___")&&("speechSynthesis" in window);
  b.classList.toggle("hidden",!show);
  if(show)b.dataset.speech=usable;else delete b.dataset.speech
}
function save(){localStorage.setItem("hebrewTrainerState",JSON.stringify(state))}
if(state.sprintDue===undefined)state.sprintDue=false;if(!state.sprintHistory)state.sprintHistory=[];if(!state.sprintBest)state.sprintBest={};
if(!state.blockTests)state.blockTests={passed:{},best:{},history:[],missed:[]};
if(!state.blockTests.passed)state.blockTests.passed={};if(!state.blockTests.best)state.blockTests.best={};if(!state.blockTests.history)state.blockTests.history=[];if(!state.blockTests.missed)state.blockTests.missed=[];
if(state.blockTestDue===undefined)state.blockTestDue=null;
if(!state.endlessLevelMigration){
  if(state.level>15){
    for(let b=15;b<state.level;b+=5)state.blockTests.passed[String(b)]=true
  }
  state.endlessLevelMigration=true;save()
}
if(!state.blockTests.migrated){if(state.level>5)state.blockTests.passed["5"]=true;if(state.level>10)state.blockTests.passed["10"]=true;state.blockTests.migrated=true;save()}
if(!state.appVersion){if(state.level>=7){state.level=state.level+3;state.session=null}state.appVersion=2;save()}
if(!state.runningAccuracy){
  let attempted=0,correct=0;
  (state.history||[]).forEach(function(h){
    if(Number.isFinite(h.score)){attempted+=SESSION_LEN;correct+=Math.round((h.score/100)*SESSION_LEN)}
  });
  ((state.blockTests&&state.blockTests.history)||[]).forEach(function(h){
    let total=Number.isFinite(h.total)?h.total:TEST_LEN;
    attempted+=total;
    correct+=Number.isFinite(h.correct)?h.correct:Math.round(((h.score||0)/100)*total)
  });
  if(state.session&&state.session.answered){attempted+=state.session.answered;correct+=state.session.correct||0}
  state.runningAccuracy={attempted:attempted,correct:correct};save()
}
if(!state.levelAccuracy){
  state.levelAccuracy={};
  (state.history||[]).forEach(function(h){
    if(!Number.isFinite(h.level)||!Number.isFinite(h.score))return;
    let k=String(h.level),rec=state.levelAccuracy[k]||{attempted:0,correct:0};
    rec.attempted+=SESSION_LEN;rec.correct+=Math.round((h.score/100)*SESSION_LEN);state.levelAccuracy[k]=rec
  });
  save()
}
if(!state.sentenceProgress)state.sentenceProgress={};
if(!state.generatedSentences)state.generatedSentences=[];
if(!state.infinitiveMastery)state.infinitiveMastery={};
if(!state.infinitiveQuizHistory)state.infinitiveQuizHistory=[];
if(!state.readingHistory)state.readingHistory=[];

if(!state.masteryReview){
  state.masteryReview={};
  Object.keys(state.missed||{}).forEach(function(he){
    if((state.missed[he]||0)<=0)return;
    let v=vocab.find(function(x){return x.he===he});if(!v)return;
    let q={type:"typedHe",item:v,prompt:v.en,correct:v.he};
    state.masteryReview["vocab:"+he]={key:"vocab:"+he,level:Math.min(state.level||1,5),correctCount:0,question:q,date:new Date().toISOString()}
  });
  ((state.blockTests&&state.blockTests.missed)||[]).forEach(function(rec){
    if(!rec||!rec.question)return;let q=rec.question,key=masteryKey(q);
    if(!state.masteryReview[key])state.masteryReview[key]={key:key,level:rec.level||state.level||1,correctCount:0,question:cleanQuestionForMemory(q),date:rec.date||new Date().toISOString()}
  });
  save()
}
function norm(s){return(s||"").normalize("NFKD").replace(/[\u0591-\u05C7]/g,"").replace(/[.,!?;:'"״׳]/g,"").replace(/\s+/g," ").trim().toLowerCase()}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function rand(a){return a[Math.floor(Math.random()*a.length)]}
const extraInfinitives=["לטייל","לדבר","ללמד","לנוח","לבדוק","לשמח","לפגוש","להחזיר","לבקש","להבין","לסדר","לפרסם","להקשיב","להפריע","להאמין","להסביר","להחליט","להציע","להלביש","לנקות","לכבס","לשטוף","לרחוץ","להגיש","לגהץ","לתקן","להירדם","לצאת","לעסוק","להספיק","לזרוק","לשוחח","לחקור","לגלות","להרגיע","למנוע","לסכן","לפזר","להחליף","לרוץ","להמשיך","להבריא","להתפלל","לבלות","לזכור","לחגוג","לתלות","לסגור","להסתכל","לברך","לסמס","לעמוד","לשמוע","לברוח","לחכות","לשתוק","להעדיף","להאכיל","להעביר","להרגיש"];
function isInfinitiveToken(w){let clean=(w||"").replace(/[.,!?;:״׳"]/g,"");return verbs.some(function(v){return v.infinitive===clean})||extraInfinitives.includes(clean)}
function hasBackToBackInfinitives(he){let t=(he||"").split(/\s+/);for(let i=0;i<t.length-1;i++){if(isInfinitiveToken(t[i])&&isInfinitiveToken(t[i+1]))return true}return false}
const generatedSentenceSubjects=[
  {he:"אני",en:"I",pron:"אני",third:false},
  {he:"הוא",en:"He",pron:"הוא",third:true},
  {he:"היא",en:"She",pron:"היא",third:true},
  {he:"אנחנו",en:"We",pron:"אנחנו",third:false},
  {he:"הם",en:"They",pron:"הם",third:false}
];
const generatedSentenceFrames=[
  {inf:"לכתוב",tailHe:"בבית",tailEn:"at home",verb:"write",third:"writes"},
  {inf:"לקרוא",tailHe:"ספר בבית",tailEn:"a book at home",verb:"read",third:"reads"},
  {inf:"לאכול",tailHe:"לחם בבית",tailEn:"bread at home",verb:"eat",third:"eats"},
  {inf:"לשתות",tailHe:"מים בבית",tailEn:"water at home",verb:"drink",third:"drinks"},
  {inf:"ללכת",tailHe:"לתל אביב",tailEn:"to Tel Aviv",verb:"go",third:"goes"},
  {inf:"ללמוד",tailHe:"עברית בבית",tailEn:"Hebrew at home",verb:"study",third:"studies"},
  {inf:"לעבוד",tailHe:"בבית",tailEn:"at home",verb:"work",third:"works"},
  {inf:"לגור",tailHe:"בירושלים",tailEn:"in Jerusalem",verb:"live",third:"lives"},
  {inf:"לנסוע",tailHe:"לחיפה",tailEn:"to Haifa",verb:"travel",third:"travels"},
  {inf:"לקנות",tailHe:"ספר חדש",tailEn:"a new book",verb:"buy",third:"buys"},
  {inf:"לראות",tailHe:"את המשפחה",tailEn:"the family",verb:"see",third:"sees"},
  {inf:"לעשות",tailHe:"עבודה בבית",tailEn:"work at home",verb:"do",third:"does"}
];
function sentenceProgressFor(he){
  if(!state.sentenceProgress[he])state.sentenceProgress[he]={wordCorrect:0,translationCorrect:0,missed:false,retired:false};
  return state.sentenceProgress[he]
}
function sentenceIsMastered(he){let p=state.sentenceProgress[he];return !!(p&&p.wordCorrect>=5&&p.translationCorrect>=5)}
function sentenceCandidateBank(){
  let bank=[];
  generatedSentenceSubjects.forEach(function(sub){
    generatedSentenceFrames.forEach(function(frame){
      let v=verbs.find(function(x){return x.infinitive===frame.inf});if(!v||!v.present||!v.present[sub.pron])return;
      let he=sub.he+" "+v.present[sub.pron]+" "+frame.tailHe;
      let en=sub.en+" "+(sub.third?frame.third:frame.verb)+" "+frame.tailEn+".";
      bank.push({he:he,en:en,generated:true})
    })
  });
  return bank
}
function ensureGeneratedSentences(count){
  let known=new Set(sentences.concat(state.generatedSentences).map(function(s){return s.he}));
  let retired=new Set(Object.keys(state.sentenceProgress).filter(function(he){return state.sentenceProgress[he].retired}));
  let choices=shuffle(sentenceCandidateBank().filter(function(s){return !known.has(s.he)&&!retired.has(s.he)}));
  for(let i=0;i<count&&i<choices.length;i++)state.generatedSentences.push(choices[i])
}
function practiceSentences(){
  let combined=sentences.concat(state.generatedSentences||[]).filter(function(s){return !hasBackToBackInfinitives(s.he)&&!sentenceIsMastered(s.he)});
  if(!combined.length){ensureGeneratedSentences(8);combined=sentences.concat(state.generatedSentences||[]).filter(function(s){return !sentenceIsMastered(s.he)})}
  return combined.length?combined:sentences
}
function sentenceReviewItems(){
  return Object.keys(state.sentenceProgress||{}).map(function(he){
    let p=state.sentenceProgress[he],s=sentences.concat(state.generatedSentences||[]).find(function(x){return x.he===he});
    return s&&p.missed&&!p.retired?{sentence:s,progress:p}:null
  }).filter(Boolean)
}
function markSentencePart(s,part,ok){
  let p=sentenceProgressFor(s.he);
  if(ok){
    if(part===1)p.wordCorrect=Math.min(5,(p.wordCorrect||0)+1);
    else p.translationCorrect=Math.min(5,(p.translationCorrect||0)+1)
  }else p.missed=true;
  let mastered=p.wordCorrect>=5&&p.translationCorrect>=5;
  if(mastered&&!p.retired){p.retired=true;p.missed=false;ensureGeneratedSentences(1);save();return true}
  save();return false
}
function reviewWords(){return Object.entries(state.missed).filter(function(x){return x[1]>0}).sort(function(a,b){return b[1]-a[1]})}
function pickItem(){let r=reviewWords();if(r.length&&(state.focus||Math.random()<.45)){let item=rand(r),v=vocab.find(function(x){return x.he===item[0]});if(v)return v}return rand(vocab)}
function mc(item,reverse){let correct=reverse?item.he:item.en,pool=shuffle(vocab.filter(function(v){return v.he!==item.he&&v.cat===item.cat})),fallback=shuffle(vocab.filter(function(v){return v.he!==item.he})),opts=[correct];[...pool,...fallback].forEach(function(v){let x=reverse?v.he:v.en;if(opts.length<4&&!opts.includes(x))opts.push(x)});return{type:"mc",item:item,prompt:reverse?item.en:item.he,correct:correct,options:shuffle(opts)}}
function translationChoicesFor(s,pool){
  let opts=[s.en];shuffle(pool.filter(function(x){return x.he!==s.he})).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
  if(opts.length<4)shuffle(sentences.filter(function(x){return x.he!==s.he})).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
  return shuffle(opts)
}
function sentenceQuestionFrom(s){
  let poolSentences=practiceSentences(),words=s.he.split(" "),candidates=words.map(function(w,i){return{w:w,i:i}}).filter(function(x){return x.w.length>1&&!["אני","אתה","את","הוא","היא","אנחנו","הם","הן","יש"].includes(x.w)});
  let chosen=rand(candidates.length?candidates:words.map(function(w,i){return{w:w,i:i}})),blanked=[...words];blanked[chosen.i]="___";
  let allWords=[];poolSentences.forEach(function(x){x.he.split(" ").forEach(function(w){if(w!==chosen.w&&!allWords.includes(w))allWords.push(w)})});
  let wordOptions=[chosen.w];shuffle(allWords).forEach(function(w){if(wordOptions.length<4&&!wordOptions.includes(w))wordOptions.push(w)});
  return{type:"sentence2",cat:"קריאה והבנה • שני חלקים",prompt:blanked.join(" "),correct:chosen.w+"||"+s.en,correctWord:chosen.w,fullHebrew:s.he,translation:s.en,sentenceObj:s,wordOptions:shuffle(wordOptions),translationOptions:translationChoicesFor(s,poolSentences),part1Correct:null}
}
function sentenceQuestion(){
  let poolSentences=practiceSentences(),reviews=sentenceReviewItems().map(function(x){return x.sentence}).filter(function(s){return poolSentences.some(function(p){return p.he===s.he})});
  let s=reviews.length&&(state.focus?Math.random()<.75:Math.random()<.30)?rand(reviews):rand(poolSentences);
  return sentenceQuestionFrom(s)
}
function sentenceTilesQuestion(s){
  return{type:"tiles",cat:"בניית משפטים",prompt:s.en,correct:s.he,words:shuffle(s.he.split(" ")),translation:s.en,translationOptions:translationChoicesFor(s,practiceSentences()),fullHebrew:s.he,part1Correct:null}
}
function matchQuestion(){let useOpp=opposites.length&&Math.random()<.5,src=useOpp?opposites:matches,m=rand(src),opts=[m.answer];shuffle(src.filter(function(x){return x.answer!==m.answer})).forEach(function(x){if(opts.length<4&&!opts.includes(x.answer))opts.push(x.answer)});return{type:"match",cat:useOpp?"מילים הפוכות":"התאמה בעברית",prompt:m.prompt,correct:m.answer,options:shuffle(opts)}}
function upgradeTwoPartQuestion(q){
  if(!q)return q;
  if(q.type==="connector2"||q.type==="grammar2"||q.type==="sentence2")return q;
  let c=connectors.find(function(x){return x.sentence===q.prompt&&x.en});
  if(c){
    let opts=q.options&&q.options.length?q.options.slice():[c.answer];
    if(!opts.includes(c.answer))opts.unshift(c.answer);
    return Object.assign({},q,{type:"connector2",cat:"מילות קישור • שני חלקים",correct:c.answer+"||"+c.en,correctConnector:c.answer,fullHebrew:c.sentence.replace("___",c.answer),translation:c.en,options:shuffle(opts),translationOptions:connectorTranslationChoices(c),part1Correct:null})
  }
  let g=grammarQuestions.find(function(x){return x.prompt===q.prompt&&x.en});
  if(g){
    let opts=q.options&&q.options.length?q.options.slice():(g.options||[g.answer]).slice();
    if(!opts.includes(g.answer))opts.unshift(g.answer);
    return Object.assign({},q,{type:"grammar2",cat:(g.cat||"דקדוק")+" • שני חלקים",correct:g.answer+"||"+g.en,correctGrammar:g.answer,fullHebrew:g.prompt.replace("___",g.answer),translation:g.en,options:shuffle(opts),translationOptions:grammarTranslationChoices(g),part1Correct:null})
  }
  return q
}
function connectorTranslationChoices(c){
  let opts=[c.en];shuffle(connectors.filter(function(x){return x.sentence!==c.sentence&&x.en})).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
  return shuffle(opts)
}
function connectorQuestion(){
  let c=rand(connectors),opts=[c.answer];shuffle(connectors.filter(function(x){return x.answer!==c.answer})).forEach(function(x){if(opts.length<4&&!opts.includes(x.answer))opts.push(x.answer)});
  let full=c.sentence.replace("___",c.answer);
  return{type:"connector2",cat:"מילות קישור • שני חלקים",prompt:c.sentence,correct:c.answer+"||"+c.en,correctConnector:c.answer,fullHebrew:full,translation:c.en,options:shuffle(opts),translationOptions:connectorTranslationChoices(c),part1Correct:null}
}
function grammarTranslationChoices(g){
  let opts=[g.en];shuffle(grammarQuestions.filter(function(x){return x.en&&x.prompt!==g.prompt})).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
  return shuffle(opts)
}
function grammarQuestion(){
  let g=rand(grammarQuestions),opts=shuffle(g.options||[g.answer]);
  if(!g.en)return{type:"grammar",cat:g.cat||"דקדוק",prompt:g.prompt,correct:g.answer,options:opts};
  return{type:"grammar2",cat:(g.cat||"דקדוק")+" • שני חלקים",prompt:g.prompt,correct:g.answer+"||"+g.en,correctGrammar:g.answer,fullHebrew:g.prompt.replace("___",g.answer),translation:g.en,options:opts,translationOptions:grammarTranslationChoices(g),part1Correct:null}
}
function classVerbQuestion(typed){let q=rand(classVerbQuestions);return{type:typed?"verbTyped":"verbMC",cat:q.cat||"פעלים מהשיעור",prompt:q.prompt,correct:q.answer,options:typed?null:shuffle(q.options)}}
function verbDefinitionQuestion(){
  let v=rand(verbDefinitions),reverse=Math.random()<.5,correct=reverse?v.he:v.en,prompt=reverse?v.en:v.he,pool=[];
  verbDefinitions.filter(function(x){return x.he!==v.he}).forEach(function(x){pool.push(reverse?x.he:x.en)});
  let opts=[correct];shuffle(pool).forEach(function(x){if(opts.length<4&&!opts.includes(x))opts.push(x)});
  return{type:"verbDefMC",cat:"פעלים • משמעות",prompt:prompt,correct:correct,options:shuffle(opts)}
}
function verbQuestion(typed){let mix=Math.random();if(verbDefinitions.length&&mix<.35)return verbDefinitionQuestion();if(classVerbQuestions.length&&mix<.72)return classVerbQuestion(typed);let v=rand(verbs),r=Math.random();
if(r<.18){let pres=v.present["הוא"],prompt="מה שם הפועל של: "+pres+" ?";return{type:typed?"verbTyped":"verbMC",cat:"פעלים • שם הפועל",prompt:prompt,correct:v.infinitive,options:typed?null:shuffle([v.infinitive,...shuffle(verbs.filter(function(x){return x.infinitive!==v.infinitive})).slice(0,3).map(function(x){return x.infinitive})])}}
if(r<.40&&v.actionNoun){let reverse=Math.random()<.35,correct=reverse?v.infinitive:v.actionNoun,prompt=reverse?"מה שם הפועל של שם הפעולה: "+v.actionNoun+" ?":"מה שם הפעולה של: "+v.infinitive+" ?",pool=verbs.filter(function(x){return x.infinitive!==v.infinitive&&x.actionNoun}).map(function(x){return reverse?x.infinitive:x.actionNoun});return{type:typed?"verbTyped":"verbMC",cat:"פעלים • שם פעולה",prompt:prompt,correct:correct,options:typed?null:shuffle([correct,...shuffle(pool).slice(0,3)])}}
let tense=rand(["present","past","future"]),pron=rand(["אני","אתה","את","הוא","היא","אנחנו","אתם","הם"]),correct=v[tense][pron],label=tense==="present"?"הווה":tense==="past"?"עבר":"עתיד",prompt=label+" • "+pron+" • "+v.infinitive;let pool=[];verbs.forEach(function(x){if(x[tense]&&x[tense][pron]&&x[tense][pron]!==correct)pool.push(x[tense][pron])});Object.keys(v[tense]).forEach(function(p){if(v[tense][p]!==correct)pool.push(v[tense][p])});let opts=[correct];shuffle(pool).forEach(function(x){if(opts.length<4&&!opts.includes(x))opts.push(x)});return{type:typed?"verbTyped":"verbMC",cat:"פעלים • "+label,prompt:prompt,correct:correct,options:typed?null:shuffle(opts)}}
function bookExercisePoolFor(L){
  // Full book reading exercises belong in the dedicated Reading Practice library.
  // Keep them out of ordinary scored levels; Level 6 continues to use short
  // sentence-comprehension questions, not full source reading exercises.
  let skills=L===6?[]:
    L===7?["meaning"]:
    L===8?["context","number","smichut"]:
    L===9?["tense","actionNoun"]:
    L===10?["transformation","tense","number","smichut"]:
    L===12?["context","meaning","number","smichut","tense","actionNoun","transformation"]:[];
  return bookExercises.filter(function(e){return (!e.levelMin||state.level>=e.levelMin)&&skills.includes(e.skill)})
}
function bookTranslationChoices(e){
  if(!e.en)return null;
  let opts=[e.en],base=e.id.replace(/-(past|future)$/,"");
  let pool=bookExercises.filter(function(x){return x.id!==e.id&&x.en});
  // Prefer the opposite tense of the SAME sentence so comprehension really
  // tests past vs. future, rather than just matching familiar vocabulary.
  pool.sort(function(a,b){
    let aa=a.id.replace(/-(past|future)$/,"")===base?0:1;
    let bb=b.id.replace(/-(past|future)$/,"")===base?0:1;
    return aa-bb
  });
  pool.filter(function(x){return x.skill===e.skill}).forEach(function(x){
    if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)
  });
  shuffle(pool).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
  return shuffle(opts)
}
function bookExerciseQuestion(L){
  let pool=bookExercisePoolFor(L);if(!pool.length)return null;
  let e=rand(pool),answers=(e.answers&&e.answers.length?e.answers:[e.answer]).slice(),comprehension=e.en?{translation:e.en,translationOptions:bookTranslationChoices(e),fullHebrew:e.skill==="context"?e.prompt.replace("___",e.answer).replace(/^השלימו מתוך ההקשר:\s*/,""):e.answer,part1Correct:null}:{};
  if(e.options&&e.options.length){
    return{type:"bookMC",cat:e.cat||"תרגיל מהספר",prompt:e.prompt,correct:e.answer,acceptedAnswers:answers,options:shuffle(e.options),bookSource:e.source,bookId:e.id,...comprehension}
  }
  // Short textbook answers use multiple choice; longer sentence transformations
  // use the existing tappable word-bank interface. No book exercise requires typing.
  let answerWords=e.answer.trim().split(/\s+/);
  if(answerWords.length<=3){
    let distractors=shuffle(bookExercises.filter(function(x){
      return x.id!==e.id&&x.skill===e.skill&&x.answer&&
        x.answer.trim().split(/\s+/).length<=3
    }).map(function(x){return x.answer}).filter(function(x){
      return !answers.some(function(a){return norm(a)===norm(x)})
    }));
    let choices=[e.answer];
    distractors.forEach(function(x){if(choices.length<4&&!choices.includes(x))choices.push(x)});
    if(choices.length>=3)return{type:"bookMC",cat:e.cat||"תרגיל מהספר",prompt:e.prompt,correct:e.answer,acceptedAnswers:answers,options:shuffle(choices),bookSource:e.source,bookId:e.id,...comprehension}
  }
  // Keep the answer's exact word tokens (including duplicates) as separate tiles.
  // Add up to three source-sentence tokens as plausible distractors.
  let sourceSentence=(e.prompt.split(":").slice(1).join(":")||"").replace(/[?!.,:;״"']/g,"");
  let extras=shuffle(sourceSentence.trim().split(/\s+/).filter(function(w){
    return w&&/[\u0590-\u05FF]/.test(w)&&!answerWords.some(function(a){return norm(a)===norm(w)})
  })).slice(0,3);
  return{type:"bookTiles",cat:e.cat||"תרגיל מהספר",prompt:e.prompt,correct:e.answer,acceptedAnswers:answers,words:shuffle(answerWords.concat(extras)),bookSource:e.source,bookId:e.id,...comprehension}
}
function makeQuestion(levelOverride){let actualLevel=levelOverride||state.level,L=exerciseLevel(actualLevel),item=pickItem();let bq=bookExercisePoolFor(L).length&&Math.random()<.62?bookExerciseQuestion(L):null;if(bq)return bq;if(L===12&&state.blockTests.missed.length&&Math.random()<.16){let rq=reviveTestMiss(rand(state.blockTests.missed));if(rq)return rq}if(L===1)return mc(item,false);if(L===2)return mc(item,true);if(L===3)return mc(item,Math.random()<.5);if(L===4)return{type:"typedEn",item:item,prompt:item.he,correct:item.en};if(L===5)return{type:"typedHe",item:item,prompt:item.en,correct:item.he};if(L===6)return sentenceQuestion();if(L===7)return matchQuestion();if(L===8)return Math.random()<.52?connectorQuestion():grammarQuestion();if(L===9)return verbQuestion(Math.random()<.45);if(L===10){let s=rand(practiceSentences());return sentenceTilesQuestion(s)}if(L===11)return{type:"hand",item:item,prompt:item.en,correct:item.he};let r=Math.random();if(r<.10)return mc(item,Math.random()<.5);if(r<.18)return{type:"typedHe",item:item,prompt:item.en,correct:item.he};if(r<.26)return{type:"typedEn",item:item,prompt:item.he,correct:item.en};if(r<.38)return sentenceQuestion();if(r<.48)return matchQuestion();if(r<.56)return connectorQuestion();if(r<.64)return grammarQuestion();if(r<.82)return verbQuestion(Math.random()<.5);if(r<.90)return{type:"hand",item:item,prompt:item.en,correct:item.he};let s=rand(practiceSentences());return sentenceTilesQuestion(s)}
function questionSignature(q){return [q.type,q.prompt,q.correct].join("||")}
function masteryKey(q){
  if(q&&q.item&&q.item.he)return "vocab:"+q.item.he;
  if(q&&q.fullHebrew)return "sentence:"+q.fullHebrew;
  if(q&&q.type==="tiles"&&q.correct)return "sentence:"+q.correct;
  if(q&&q.prompt)return (q.type||"question")+":"+q.prompt+"||"+(q.correct||"");
  return questionSignature(q||{})
}
function masteryItems(){return Object.values(state.masteryReview||{}).filter(function(x){return (x.correctCount||0)<10})}
function masteryReviewCount(){return masteryItems().length+sentenceReviewItems().length}
function questionLevel(q){
  if(q&&Number.isFinite(q._testLevel))return q._testLevel;
  if(q&&Number.isFinite(q._reviewLevel))return q._reviewLevel;
  return state.session&&Number.isFinite(state.session.level)?state.session.level:state.level
}
function updateLevelAccuracy(level,ok){
  let k=String(level||state.level),rec=state.levelAccuracy[k]||{attempted:0,correct:0};
  rec.attempted++;if(ok)rec.correct++;state.levelAccuracy[k]=rec
}
function levelAccuracyPercent(level){
  let rec=state.levelAccuracy[String(level)]||{attempted:0,correct:0};
  return rec.attempted?Math.round(rec.correct/rec.attempted*100):null
}
function blockAccuracyPercent(blockEnd){
  let attempted=0,correct=0,start=blockEnd-4;
  for(let l=start;l<=blockEnd;l++){let r=state.levelAccuracy[String(l)];if(r){attempted+=r.attempted||0;correct+=r.correct||0}}
  return attempted?Math.round(correct/attempted*100):null
}
function updateMastery(q,ok,level){
  if(q&&(q.type==="sentence2"||q.type==="connector2"||q.type==="grammar2"))return false;
  let key=masteryKey(q),rec=state.masteryReview[key];
  if(!ok){
    if(!rec)state.masteryReview[key]={key:key,level:level||state.level,correctCount:0,question:cleanQuestionForMemory(q),date:new Date().toISOString()};
    else{rec.question=cleanQuestionForMemory(q);rec.level=rec.level||level||state.level;rec.date=new Date().toISOString()}
    return false
  }
  if(!rec)return false;
  rec.correctCount=(rec.correctCount||0)+1;
  if(rec.correctCount>=10){
    delete state.masteryReview[key];
    if(q&&q.item&&q.item.he)state.missed[q.item.he]=0;
    if(state.blockTests&&state.blockTests.missed)state.blockTests.missed=state.blockTests.missed.filter(function(x){return !x.question||masteryKey(x.question)!==key});
    return true
  }
  return false
}
function reviveMasteryReview(rec){
  if(!rec||!rec.question)return null;
  let q=upgradeTwoPartQuestion(JSON.parse(JSON.stringify(rec.question)));q.part1Correct=null;q._reviewLevel=rec.level||state.level;
  if(q.type==="tiles2"){q.type="tiles";q.cat="בניית משפטים";delete q.translationOptions;delete q.sentenceObj;delete q.fullHebrew;delete q.translation}
  if(q.options)q.options=shuffle(q.options);if(q.wordOptions)q.wordOptions=shuffle(q.wordOptions);if(q.translationOptions)q.translationOptions=shuffle(q.translationOptions);if(q.words)q.words=shuffle(q.words);
  return q
}
function pickMasteryReviewQuestion(seen){
  let sentencePool=shuffle(sentenceReviewItems()).filter(function(x){let q=sentenceQuestionFrom(x.sentence);return !seen.includes(questionSignature(q))});
  if(sentencePool.length&&Math.random()<.5){let q=sentenceQuestionFrom(sentencePool[0].sentence);q._reviewLevel=Math.max(6,Math.min(state.level,12));return q}
  let pool=shuffle(masteryItems()).filter(function(rec){let q=rec.question;return q&&!seen.includes(questionSignature(q))});
  return pool.length?reviveMasteryReview(pool[0]):null
}
function masteryLabel(rec){
  let q=rec.question||{},base="";
  if(q.item)base=q.item.he+" — "+q.item.en;
  else if(q.fullHebrew)base=q.fullHebrew+" — "+(q.translation||"sentence");
  else if(q.correct)base=answerWithEnglish(q.correct,q);
  else base=q.prompt||"Review item";
  return base+" · "+(rec.correctCount||0)+"/10"
}
function cleanQuestionForMemory(q){
  let c=JSON.parse(JSON.stringify(q));delete c._testLevel;delete c._reviewLevel;c.part1Correct=null;
  return c
}
function reviveTestMiss(rec){
  if(!rec||!rec.question)return null;
  let q=upgradeTwoPartQuestion(JSON.parse(JSON.stringify(rec.question)));q.part1Correct=null;
  if(q.type==="tiles2"){q.type="tiles";q.cat="בניית משפטים";delete q.translationOptions;delete q.sentenceObj;delete q.fullHebrew;delete q.translation}
  if(q.options)q.options=shuffle(q.options);if(q.wordOptions)q.wordOptions=shuffle(q.wordOptions);if(q.translationOptions)q.translationOptions=shuffle(q.translationOptions);if(q.words)q.words=shuffle(q.words);
  return q
}
function rememberTestMiss(q,level,blockEnd){
  let sig=questionSignature(q);state.blockTests.missed=state.blockTests.missed.filter(function(x){return x.sig!==sig});
  state.blockTests.missed.unshift({sig:sig,level:level,blockEnd:blockEnd,question:cleanQuestionForMemory(q),date:new Date().toISOString()});
  state.blockTests.missed=state.blockTests.missed.slice(0,80)
}
function clearRememberedTestMiss(q){
  let sig=questionSignature(q);state.blockTests.missed=state.blockTests.missed.filter(function(x){return x.sig!==sig})
}
function rememberedMissForLevel(level){
  if(!state.session||!state.session.isTest)return null;
  let used=state.session.rememberedUsed||[],seen=state.session.seen||[];
  return state.blockTests.missed.find(function(x){return x.level===level&&!used.includes(x.sig)&&!seen.includes(x.sig)})
}
function testPlan(blockEnd){
  let startLevel=blockEnd-4,plan=[];
  for(let l=startLevel;l<=blockEnd;l++)for(let i=0;i<4;i++)plan.push(l);
  return shuffle(plan)
}
function sessionLength(){return state.session&&state.session.isTest?TEST_LEN:SESSION_LEN}
function reviewOnlyQuestion(){
 let q=pickMasteryReviewQuestion(state.session.seen||[]);
 if(!q){
  state.session.seen=[];
  q=pickMasteryReviewQuestion([]);
 }
 return q;
}
function beginFocusedReview(){
 if(!masteryReviewCount()){alert("Your review list is clear.");return}
 state.focus=true;
 state.session={answered:0,correct:0,level:state.level,reviewOnly:true,seen:[],rememberedUsed:[]};
 save();
 ["quizCard","statusCard"].forEach(function(id){$(id).classList.remove("hidden")});
 $("message").classList.add("hidden");
 renderHeader();nextQuestion();
 $("quizCard").scrollIntoView({behavior:"smooth",block:"start"});
}
function restartPracticeSession(){cancelAdaptiveAdvance();
 if(!confirm("Restart this practice session? Saved scores, progress and review items will remain."))return;
 state.session=null;save();
 try{sessionStorage.setItem("hebrewTrainerLaunch","normal")}catch(e){}
 location.reload();
}
function makeUniqueQuestion(){
  if(state.session.reviewOnly)return reviewOnlyQuestion();
  if(!state.session.seen)state.session.seen=[];
  if(!state.session.rememberedUsed)state.session.rememberedUsed=[];
  let q=null,sig="",levelOverride=null;
  for(let i=0;i<80;i++){
    if(state.session.isTest){
      levelOverride=state.session.plan[Math.min(state.session.answered,state.session.plan.length-1)];
      let remembered=rememberedMissForLevel(levelOverride);
      if(remembered){
        q=reviveTestMiss(remembered);state.session.rememberedUsed.push(remembered.sig)
      }else q=makeQuestion(levelOverride);
      q._testLevel=levelOverride
    }else{
      let useReview=masteryReviewCount()&&(state.focus?Math.random()<.72:Math.random()<.28);
      q=useReview?pickMasteryReviewQuestion(state.session.seen):null;
      if(!q)q=makeQuestion()
    }
    sig=questionSignature(q);
    if(!state.session.seen.includes(sig))break
  }
  if(sig&&!state.session.seen.includes(sig))state.session.seen.push(sig);
  save();return q
}
function startBlockTest(blockEnd){
  state.blockTestDue=blockEnd;
  state.session={answered:0,correct:0,level:blockEnd,isTest:true,testBlockEnd:blockEnd,plan:testPlan(blockEnd),seen:[],rememberedUsed:[]};
  save();renderHeader();nextQuestion()
}
function startSession(){
  if(state.blockTestDue){startBlockTest(Number(state.blockTestDue));return}
  state.session={answered:0,correct:0,level:state.level,seen:[],rememberedUsed:[]};save();renderHeader();nextQuestion()
}
function renderHeader(){
  let s=state.session||{answered:0,correct:0},len=sessionLength(),isTest=!!s.isTest,levelPct=null;
  if(s.reviewOnly){
    $("levelBadge").textContent="Focused review";$("modeLabel").textContent="Review items only • "+masteryReviewCount()+" remaining";
    $("best").textContent="—";levelPct=s.answered?Math.round(s.correct/s.answered*100):null;
    $("levelAccuracyLabel").textContent="Review session accuracy";
  }else if(isTest){
    let startLevel=s.testBlockEnd-4;
    $("levelBadge").textContent="Block Test";
    $("modeLabel").textContent="Levels "+startLevel+"–"+s.testBlockEnd+" • 85% required";
    $("best").textContent=state.blockTests.best[String(s.testBlockEnd)]!==undefined?state.blockTests.best[String(s.testBlockEnd)]+"%":"—";
    levelPct=s.answered?Math.round(s.correct/s.answered*100):null;$("levelAccuracyLabel").textContent="Block accuracy (this test)"
  }else if(!state.session&&state.blockTestDue){
    $("levelBadge").textContent="Test Due";$("modeLabel").textContent="20-question checkpoint required";$("best").textContent="—";
    levelPct=levelAccuracyPercent(state.level);$("levelAccuracyLabel").textContent="Level accuracy (history)"
  }else{
    $("levelBadge").textContent="Level "+state.level;$("modeLabel").textContent=levelName(state.level);
    $("best").textContent=state.best[state.level]!==undefined?state.best[state.level]+"%":"—";
    levelPct=s.answered?Math.round(s.correct/s.answered*100):null;$("levelAccuracyLabel").textContent="Level accuracy (this session)"
  }
  $("reviewCount").textContent=masteryReviewCount();
  $("levelAccuracy").textContent=levelPct===null?"—":levelPct+"%";
  $("sessionCount").textContent=(isTest?"Test question ":"Question ")+Math.min(s.answered+1,len)+" of "+len;
  $("score").textContent=s.correct+" / "+s.answered;
  let ra=state.runningAccuracy||{correct:0,attempted:0};
  $("accuracy").textContent=(ra.attempted?Math.round(ra.correct/ra.attempted*100):0)+"%";
  $("progressBar").style.width=Math.min(100,s.answered/len*100)+"%";renderReview();renderSprintDue();if($("verbMasteredCount"))renderVerbInfinitiveSummary()
}
function renderReview(){
  let box=$("reviewList"),generic=masteryItems().sort(function(a,b){return (a.correctCount||0)-(b.correctCount||0)}).map(function(rec){return{kind:"generic",rec:rec}}),
      sentenceItems=sentenceReviewItems().map(function(x){return{kind:"sentence",rec:x}});
  let items=generic.concat(sentenceItems).slice(0,24);box.innerHTML="";
  if(!items.length){box.innerHTML='<span class="empty">No items awaiting mastery.</span>';return}
  items.forEach(function(item){
    let e=document.createElement("span");e.className="reviewChip";e.dir="auto";
    if(item.kind==="generic")e.textContent=masteryLabel(item.rec);
    else e.textContent=item.rec.sentence.he+" — "+item.rec.sentence.en+" · word "+(item.rec.progress.wordCorrect||0)+"/5 · translation "+(item.rec.progress.translationCorrect||0)+"/5";
    box.appendChild(e)
  })
}
function hideAll(){if("speechSynthesis" in window)window.speechSynthesis.cancel();["choiceArea","typedArea","tilesArea","handArea","selfGrade","feedback","nextBtn"].forEach(function(id){$(id).classList.add("hidden")});$("choiceArea").innerHTML="";$("answerInput").value="";$("answerLine").innerHTML="";$("wordTiles").innerHTML="";tileAnswer=[];locked=false;clearPad()}
let adaptiveAdvanceTimer=null;
function cancelAdaptiveAdvance(){if(adaptiveAdvanceTimer!==null){clearTimeout(adaptiveAdvanceTimer);adaptiveAdvanceTimer=null}}
function nextQuestion(){cancelAdaptiveAdvance();if(!state.session||state.session.answered>=sessionLength()){finishSession();return}hideAll();current=upgradeTwoPartQuestion(makeUniqueQuestion());if(!current){finishSession();return}$("prompt").textContent=current.prompt;$("prompt").dir=/[\u0590-\u05FF]/.test(current.prompt)?"rtl":"ltr";updatePronunciationButton(pronunciationTextForQuestion(current,false));$("category").textContent=(current.cat||(current.item?current.item.cat:"Sentence"))+(practiceSource(current)?" • "+practiceSource(current):" • Supplemental practice");if(current.type==="sentence2"){renderSentenceWordPart()}else if(current.type==="connector2"){renderConnectorPart()}else if(current.type==="grammar2"){renderGrammarSentencePart()}else if(["mc","reading","match","connector","grammar","verbMC","verbDefMC","bookMC"].includes(current.type)){let a=$("choiceArea");a.classList.remove("hidden");current.options.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir=/[\u0590-\u05FF]/.test(opt)?"rtl":"ltr";b.onclick=function(){answerMC(b,opt)};a.appendChild(b)});$("instruction").textContent=current.type==="reading"?"Read the Hebrew sentence and choose the meaning.":current.type==="match"?"Choose the matching Hebrew word or opposite.":current.type==="connector"?"Choose the connector that completes the Hebrew sentence.":current.type==="grammar"?"Choose the grammatically correct Hebrew form.":current.type==="verbMC"?"Choose the correct Hebrew verb form.":current.type==="verbDefMC"?"Identify the verb meaning quickly.":current.type==="bookMC"?(current.translation?"Part 1 of 2: Complete the Hebrew exercise.":"Complete the exercise from your course material."):"Tap the best answer."}else if(current.type==="typedEn"||current.type==="typedHe"||current.type==="verbTyped"||current.type==="bookTyped"){$("typedArea").classList.remove("hidden");$("answerInput").dir=current.type==="typedEn"?"ltr":"rtl";$("answerInput").placeholder=current.type==="typedEn"?"Type English meaning":"הקלד/י בעברית";$("instruction").textContent=current.type==="bookTyped"?"Complete the exercise from your course material in Hebrew.":current.type==="verbTyped"?"Type the correct Hebrew verb form.":current.type==="typedHe"?"Recall the Hebrew word.":"Give the English meaning."}else if(current.type==="tiles"||current.type==="bookTiles"){$("tilesArea").classList.remove("hidden");$("instruction").textContent=current.type==="bookTiles"?"Part 1"+(current.translation?" of 2":"")+": Tap words to build the Hebrew answer. Extra words may be included.":current.translation?"Part 1 of 2: Build the Hebrew sentence.":"Tap the Hebrew words in the correct order.";current.words.forEach(addTile)}else{$("handArea").classList.remove("hidden");$("instruction").textContent="Write the Hebrew answer with Apple Pencil, then reveal and self-grade.";sizeCanvas()}}
function renderGrammarSentencePart(){
  let a=$("choiceArea");a.innerHTML="";a.classList.remove("hidden");$("instruction").textContent="Part 1 of 2: Complete the Hebrew sentence.";
  current.options.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="rtl";b.onclick=function(){answerGrammarSentencePart(b,opt)};a.appendChild(b)})
}
function answerGrammarSentencePart(btn,opt){
  if(locked)return;let ok=norm(opt)===norm(current.correctGrammar);current.part1Correct=ok;
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.correctGrammar))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  $("prompt").textContent=current.fullHebrew;$("prompt").dir="rtl";updatePronunciationButton(current.fullHebrew);
  showFeedback(ok,ok?"Part 1 correct. Now translate the sentence.":"Correct answer: "+answerWithEnglish(current.correctGrammar,current)+". Now translate the sentence.");
  renderGrammarTranslationPart()
}
function renderGrammarTranslationPart(){
  let a=$("choiceArea");a.innerHTML="";$("instruction").textContent="Part 2 of 2: Choose the correct English translation.";
  current.translationOptions.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="ltr";b.onclick=function(){answerGrammarTranslation(b,opt)};a.appendChild(b)})
}
function answerGrammarTranslation(btn,opt){
  if(locked)return;let ok=norm(opt)===norm(current.translation);
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.translation))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  let overall=!!current.part1Correct&&ok;
  showFeedback(overall,overall?"Both parts correct.":(!current.part1Correct&&!ok?"Both parts need review. Correct translation: "+current.translation:!current.part1Correct?"Translation correct; review the Hebrew answer: "+answerWithEnglish(current.correctGrammar,current)+".":"Hebrew answer correct; correct English translation: "+current.translation));
  record(overall)
}
function renderConnectorPart(){
  let a=$("choiceArea");a.innerHTML="";a.classList.remove("hidden");$("instruction").textContent="Part 1 of 2: Choose the connector that completes the Hebrew sentence.";
  current.options.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="rtl";b.onclick=function(){answerConnectorPart(b,opt)};a.appendChild(b)})
}
function answerConnectorPart(btn,opt){
  if(locked)return;
  let ok=norm(opt)===norm(current.correctConnector);current.part1Correct=ok;
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.correctConnector))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  $("prompt").textContent=current.fullHebrew;$("prompt").dir="rtl";updatePronunciationButton(current.fullHebrew);
  showFeedback(ok,ok?"Part 1 correct. Now translate the sentence.":"Correct connector: "+answerWithEnglish(current.correctConnector,current)+". Now translate the sentence.");
  renderConnectorTranslationPart()
}
function renderConnectorTranslationPart(){
  let a=$("choiceArea");a.innerHTML="";$("instruction").textContent="Part 2 of 2: Choose the correct English translation.";
  current.translationOptions.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="ltr";b.onclick=function(){answerConnectorTranslation(b,opt)};a.appendChild(b)})
}
function answerConnectorTranslation(btn,opt){
  if(locked)return;
  let ok=norm(opt)===norm(current.translation);
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.translation))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  let overall=!!current.part1Correct&&ok;
  showFeedback(overall,overall?"Both parts correct.":(!current.part1Correct&&!ok?"Both parts need review. Correct translation: "+current.translation:!current.part1Correct?"Translation correct; review the connector: "+answerWithEnglish(current.correctConnector,current)+".":"Connector correct; correct English translation: "+current.translation));
  record(overall)
}
function renderSentenceWordPart(){
  let a=$("choiceArea");a.innerHTML="";a.classList.remove("hidden");$("instruction").textContent="Part 1 of 2: Choose the Hebrew word that completes the sentence.";
  current.wordOptions.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="rtl";b.onclick=function(){answerSentenceWord(b,opt)};a.appendChild(b)})
}
function answerSentenceWord(btn,opt){
  if(locked)return;
  let ok=norm(opt)===norm(current.correctWord);current.part1Correct=ok;
  markSentencePart(current.sentenceObj||{he:current.fullHebrew,en:current.translation},1,ok);
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.correctWord))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  $("prompt").textContent=current.fullHebrew;$("prompt").dir="rtl";updatePronunciationButton(current.fullHebrew);
  showFeedback(ok,ok?"Part 1 correct. Now translate the sentence.":"The missing word was "+answerWithEnglish(current.correctWord,current)+". Now translate the sentence.");
  renderSentenceTranslationPart()
}
function renderSentenceTranslationPart(){
  let a=$("choiceArea");a.innerHTML="";$("instruction").textContent="Part 2 of 2: Choose the correct English translation.";
  current.translationOptions.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="ltr";b.onclick=function(){answerSentenceTranslation(b,opt)};a.appendChild(b)})
}
function answerSentenceTranslation(btn,opt){
  if(locked)return;
  let ok=norm(opt)===norm(current.translation);
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.translation))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  let mastered=markSentencePart(current.sentenceObj||{he:current.fullHebrew,en:current.translation},2,ok),overall=!!current.part1Correct&&ok;
  let msg=overall?"Both parts correct.":(!current.part1Correct&&!ok?"Both parts need review. Correct translation: "+current.translation:!current.part1Correct?"Translation correct; review the missing Hebrew word: "+answerWithEnglish(current.correctWord,current)+".":"Word correct; correct English translation: "+current.translation);
  if(mastered)msg+=" Sentence mastered at 5/5 for both parts; it has been retired and a new sentence was added.";
  showFeedback(overall,msg);record(overall)
}
function addTile(word){let b=document.createElement("button");b.className="tile";b.textContent=word;b.onclick=function(){tileAnswer.push(word);b.disabled=true;renderTileAnswer()};$("wordTiles").appendChild(b)}
function renderTileAnswer(){$("answerLine").innerHTML="";tileAnswer.forEach(function(w){let s=document.createElement("span");s.className="answerPiece";s.textContent=w;$("answerLine").appendChild(s)})}
function clearTiles(){tileAnswer=[];renderTileAnswer();Array.from($("wordTiles").children).forEach(function(b){b.disabled=false})}
const answerEnglish={
"הזמינו":"they invited (in this sentence; also: they ordered)",
"כי":"because","לכן":"therefore / so","או":"or","וגם":"and also","אבל":"but","אם":"if","אז":"then","ואחר כך":"and afterward","לפני שאני":"before I","אחרי שאני":"after I","כשאני":"when I","אחרי שאנחנו":"after we","לפני שאנחנו":"before we","כדי":"in order to","כאשר":"when","משום ש":"because","מפני ש":"because","בגלל זה":"because of this / therefore","אך":"but / however","ואילו":"whereas","כדי ש":"so that",
"ימין":"right","שמאל":"left","צפון":"north","דרום":"south","מזרח":"east","מערב":"west","ישן":"old","רע":"bad","גדול":"big / large","קטן":"small","חם":"hot","קר":"cold","מהר":"fast","לאט":"slowly","פתוח":"open","סגור":"closed","קרוב":"near / close","רחוק":"far","מוקדם":"early","מאוחר":"late","יש":"there is / there are","אין":"there is not / there are not","קצר":"short","ארוך":"long","קל":"easy / light","קשה":"difficult / hard","שמן":"fat / overweight","רזה":"thin","מצליח":"succeeds / successful","נכשל":"fails",
"דבר שאפשר לקרוא":"something that can be read","אדם שמלמד":"a person who teaches","אדם שלומד":"a person who studies / learns","רהיט שיושבים עליו":"a piece of furniture you sit on","רהיט שישנים עליו":"a piece of furniture you sleep on","פתח בבית שרואים דרכו החוצה":"an opening in a house through which you can see outside","דבר שפותחים כדי להיכנס":"something you open in order to enter","מכשיר שמדברים איתו":"a device used for speaking / calling","מכשיר שעובדים ולומדים איתו":"a device used for work and study","קבוצה של הורים וילדים":"a group of parents and children","דבר שבודק מה למדנו":"something that checks what we learned","מקום שבו רופא מטפל באנשים":"a place where a doctor treats people","אדם שמלמד וחוקר באוניברסיטה":"a person who teaches and researches at a university","כרטיס ששולחים בחג או באירוע":"a card sent for a holiday or event","השנים שבהן אדם היה ילד":"the years when a person was a child","הרגשה כשרוצים להיות שוב עם אדם או במקום":"the feeling of wanting to be with a person or in a place again","הזמן שבו השמש עולה":"the time when the sun rises","הזמן שבו השמש יורדת":"the time when the sun sets","הרגשה של שמחה גדולה":"a feeling of great happiness",
"הייתי":"I was","היה":"he was / there was","הייתה":"she was","היינו":"we were","הייתם":"you (plural) were","הייתן":"you (feminine plural) were","היו":"they were",
"חדש":"new","חדשה":"new (feminine)","חדשים":"new (masculine plural)","חדשות":"new (feminine plural)","חרוץ":"diligent / hardworking","חרוצה":"diligent / hardworking (feminine)","חרוצים":"diligent / hardworking (masculine plural)","חרוצות":"diligent / hardworking (feminine plural)","קצרה":"short (feminine)","קצרים":"short (masculine plural)","קצרות":"short (feminine plural)","גדולה":"big / large (feminine)","גדולים":"big / large (masculine plural)","גדולות":"big / large (feminine plural)","החדש":"the new (masculine)","החדשה":"the new (feminine)","הגדול":"the big / large (masculine)","הגדולה":"the big / large (feminine)",
"אל תקשיב":"do not listen (masculine singular)","אל תאמיני":"do not believe (feminine singular)","אל תדליקו":"do not turn on / light (plural)",
"כתיבה":"writing","קריאה":"reading","אכילה":"eating","שתייה":"drinking","הליכה":"walking","למידה":"learning / studying","עבודה":"work / working","מגורים":"residence / living","נסיעה":"travel / traveling","קנייה":"buying / purchase","ראייה":"seeing / sight","עשייה":"doing / making","הפסקה":"stopping / a break","הקשבה":"listening","הפרעה":"interruption / disturbance","אמונה":"belief / faith","הסבר":"explanation","החלטה":"decision","הפתעה":"surprise","כישלון":"failure"
};
const pronounEnglish={"אני":"I","אתה":"you (masculine singular)","את":"you (feminine singular)","הוא":"he","היא":"she","אנחנו":"we","אתם":"you (masculine plural)","אתן":"you (feminine plural)","הם":"they","הן":"they"};
const tenseEnglish={present:"present",past:"past",future:"future"};
function baseVerbEnglish(inf){let d=verbDefinitions.find(function(x){return norm(x.he)===norm(inf)});return d?d.en:null}
function verbFormEnglish(value,q){
  let matchesFound=[];
  verbs.forEach(function(v){["present","past","future"].forEach(function(t){Object.keys(v[t]||{}).forEach(function(p){if(norm(v[t][p])===norm(value))matchesFound.push({v:v,tense:t,pron:p})})})});
  if(matchesFound.length){
    let hit=matchesFound.find(function(x){return q&&q.prompt&&q.prompt.includes(x.v.infinitive)})||matchesFound[0],base=baseVerbEnglish(hit.v.infinitive);
    if(base)return base+" ("+tenseEnglish[hit.tense]+", "+(pronounEnglish[hit.pron]||hit.pron)+")"
  }
  if(q&&q.prompt&&/^(עבר|עתיד|הווה)\s*•/.test(q.prompt)){
    // Only infer an English meaning from an infinitive in an explicit verb drill.
    // Reading/cloze sentences may contain a DIFFERENT infinitive (e.g. להתפלל)
    // from the answer verb (e.g. הזמינו), so inferring there is incorrect.
    let inf=verbDefinitions.find(function(x){return q.prompt.includes(x.he)});
    if(inf){
      let t=q.prompt.includes("עבר")?"past":q.prompt.includes("עתיד")?"future":q.prompt.includes("הווה")?"present":null;
      let p=Object.keys(pronounEnglish).find(function(k){return q.prompt.includes("• "+k+" •")});
      return inf.en+(t||p?" ("+[t,p?pronounEnglish[p]:null].filter(Boolean).join(", ")+")":"")
    }
  }
  return null
}
function englishMeaningFor(value,q){
  if(!value||!/[\u0590-\u05FF]/.test(value))return null;
  if(q&&q.item&&norm(value)===norm(q.item.he))return q.item.en;
  if(answerEnglish[value])return answerEnglish[value];
  let vd=verbDefinitions.find(function(x){return norm(x.he)===norm(value)});if(vd)return vd.en;
  let action=verbs.find(function(v){return v.actionNoun&&norm(v.actionNoun)===norm(value)});if(action){let b=baseVerbEnglish(action.infinitive);if(b)return "action noun: "+b.replace(/^to\s+/,"")}
  let vf=verbFormEnglish(value,q);if(vf)return vf;
  let vv=vocab.find(function(x){return norm(x.he)===norm(value)});if(vv)return vv.en;
  return null
}
function answerWithEnglish(value,q){
  let en=englishMeaningFor(value,q);return en?value+" — "+en:value
}
function showFeedback(ok,msg){let f=$("feedback");f.textContent=msg+(!ok&&current&&practiceSource(current)?" Source: "+practiceSource(current)+".":"");f.className="feedback "+(ok?"good":"bad")}
function record(ok){
  if(locked)return;locked=true;let isTest=state.session&&state.session.isTest,sourceLevel=questionLevel(current);
  state.session.answered++;if(ok)state.session.correct++;
  state.runningAccuracy.attempted++;if(ok)state.runningAccuracy.correct++;
  updateLevelAccuracy(sourceLevel,ok);updateMastery(current,ok,sourceLevel);
  if(current.item){let k=current.item.he;if(ok)state.missed[k]=Math.max(0,(state.missed[k]||0)-1);else state.missed[k]=(state.missed[k]||0)+1}
  if(isTest&&!ok)rememberTestMiss(current,current._testLevel,state.session.testBlockEnd);
  updatePronunciationButton(pronunciationTextForQuestion(current,true));
  save();renderHeader();$("nextBtn").textContent=state.session.answered>=sessionLength()?"Finish":"Next";
  if(ok){
    // Preserve existing question selection, review weighting, and mastery counters.
    adaptiveAdvanceTimer=setTimeout(function(){adaptiveAdvanceTimer=null;nextQuestion()},650)
  }else{
    // Incorrect answers remain visible with the correction until Next is pressed.
    $("nextBtn").classList.remove("hidden")
  }
}
function beginComprehensionPart(ok){
  current.part1Correct=ok;
  $("tilesArea").classList.add("hidden");
  $("choiceArea").classList.remove("hidden");
  $("choiceArea").innerHTML="";
  $("prompt").textContent=current.fullHebrew||current.correct;
  $("prompt").dir="rtl";
  updatePronunciationButton(current.fullHebrew||current.correct);
  $("instruction").textContent="Part 2 of 2: What does this completed Hebrew sentence mean?";
  showFeedback(ok,ok?"Hebrew answer correct. Now check comprehension.":"Correct Hebrew: "+current.correct+". Now check comprehension.");
  current.translationOptions.forEach(function(opt){
    let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="ltr";
    b.onclick=function(){answerComprehensionPart(b,opt)};$("choiceArea").appendChild(b)
  })
}
function answerComprehensionPart(btn,opt){
  if(locked)return;
  let ok=norm(opt)===norm(current.translation);
  Array.from($("choiceArea").children).forEach(function(b){
    b.disabled=true;if(norm(b.textContent)===norm(current.translation))b.classList.add("correct")
  });
  if(!ok)btn.classList.add("wrong");
  let overall=!!current.part1Correct&&ok;
  showFeedback(overall,overall?"Both grammar and comprehension correct.":!ok?"Correct meaning: "+current.translation+(current.part1Correct?"":" The Hebrew answer also needs review."):"Meaning correct; review the Hebrew answer: "+current.correct);
  record(overall)
}
function answerMC(btn,opt){
  if(locked)return;let ok=norm(opt)===norm(current.correct);
  Array.from(document.querySelectorAll(".choice")).forEach(function(b){if(norm(b.textContent)===norm(current.correct))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  if(current.translation&&(current.type==="bookMC")){beginComprehensionPart(ok);return}
  showFeedback(ok,ok?"Correct.":"Correct answer: "+answerWithEnglish(current.correct,current));record(ok)
}
function englishMatch(a,c){let aa=norm(a);if(!aa)return false;let parts=c.split("/").map(norm);return parts.some(function(p){return aa===p||aa.includes(p)||p.includes(aa)})}
function checkTyped(){if(locked)return;let a=$("answerInput").value;if(!norm(a)){showFeedback(false,"No answer entered. Correct answer: "+answerWithEnglish(current.correct,current));record(false);return}let accepted=(current.acceptedAnswers&&current.acceptedAnswers.length?current.acceptedAnswers:[current.correct]);let ok=current.type==="typedEn"?englishMatch(a,current.correct):accepted.some(function(x){return norm(a)===norm(x)});showFeedback(ok,ok?"Correct.":"Correct answer: "+answerWithEnglish(current.correct,current));record(ok)}
function checkTiles(){
  if(locked)return;let a=tileAnswer.join(" "),accepted=current.acceptedAnswers&&current.acceptedAnswers.length?current.acceptedAnswers:[current.correct],ok=accepted.some(function(x){return norm(a)===norm(x)});
  if(current.translation&&(current.type==="bookTiles"||current.type==="tiles")){beginComprehensionPart(ok);return}
  showFeedback(ok,ok?"Correct.":"Correct Hebrew answer: "+current.correct);record(ok)
}
function revealHand(){if(locked)return;$("revealedAnswer").textContent=current.correct;$("selfGrade").classList.remove("hidden")}
function gradeHand(ok){if(locked)return;showFeedback(ok,ok?"Marked correct.":"Correct answer: "+answerWithEnglish(current.correct,current)+". Added to your review list.");record(ok)}
function showSessionComplete(msg,buttonLabel){
  $("message").textContent=msg;$("message").classList.remove("hidden");
  $("quizCard").innerHTML='<div style="text-align:center"><h2>Session complete</h2><p>'+msg+'</p><button class="primary" id="newSessionBtn">'+buttonLabel+'</button></div>';
  $("newSessionBtn").onclick=function(){if(msg.startsWith("Focused review:")&&masteryReviewCount()){try{sessionStorage.setItem("hebrewTrainerLaunch","review")}catch(e){}}location.reload()};renderHeader();window.scrollTo({top:0,behavior:"smooth"})
}
function finishBlockTest(){cancelAdaptiveAdvance();
  let s=state.session,p=Math.round(s.correct/TEST_LEN*100),blockEnd=s.testBlockEnd,key=String(blockEnd),passed=p>=TEST_PASS;
  state.blockTests.best[key]=Math.max(state.blockTests.best[key]||0,p);
  state.blockTests.history.push({date:new Date().toISOString(),blockEnd:blockEnd,score:p,correct:s.correct,total:TEST_LEN,passed:passed});
  let msg,buttonLabel;
  if(passed){
    state.blockTests.passed[key]=true;state.blockTestDue=null;state.focus=false;
    state.level=blockEnd+1;
    msg=p+"% ("+s.correct+"/20) — block test passed. Level "+state.level+" is now unlocked.";
    buttonLabel="Start Level "+state.level
  }else{
    state.blockTestDue=blockEnd;state.level=blockEnd;
    msg=p+"% ("+s.correct+"/20) — block test not yet passed. You need at least 85% (17/20). Missed questions have been saved for later review.";
    buttonLabel="Retake block test"
  }
  state.session=null;save();showSessionComplete(msg,buttonLabel)
}
function finishSession(){cancelAdaptiveAdvance();
  let s=state.session;
  if(s&&s.reviewOnly){
    const remaining=masteryReviewCount();
    const msg="Focused review: "+s.correct+"/"+s.answered+" correct. "+remaining+" item(s) still awaiting mastery. Correct responses count toward removing items from the list.";
    state.session=null;state.focus=false;save();showSessionComplete(msg,remaining?"Continue focused review":"Return to practice");return
  }
  if(s&&s.isTest){finishBlockTest();return}
  let p=Math.round(s.correct/s.answered*100),oldLevel=state.level;state.best[oldLevel]=Math.max(state.best[oldLevel]||0,p);state.history.push({date:new Date().toISOString(),level:oldLevel,score:p});let msg,buttonLabel="Start next session";
  if(p>PASS){
    state.focus=false;if(oldLevel%3===0)state.sprintDue=true;
    if(oldLevel%5===0){
      state.blockTestDue=oldLevel;
      msg=p+"% — Level "+oldLevel+" cleared. Before Level "+(oldLevel+1)+", you must pass the 20-question review test for Levels "+(oldLevel-4)+"–"+oldLevel+".";
      buttonLabel="Start 20-question block test"
    }else{
      state.level++;msg=p+"% — advanced to Level "+state.level+": "+levelName(state.level)+"."
    }
  }else if(p>=70){
    state.focus=false;msg=p+"% — staying at Level "+state.level+". Missed words will appear more often."
  }else{
    state.focus=true;reviewWords().forEach(function(x){state.missed[x[0]]=x[1]+1});msg=p+"% — focused review at Level "+state.level+"."
  }
  state.session=null;save();showSessionComplete(msg,buttonLabel)
}
$("checkTypedBtn").onclick=checkTyped;$("checkTilesBtn").onclick=checkTiles;$("clearTilesBtn").onclick=clearTiles;$("revealBtn").onclick=revealHand;$("missedBtn").onclick=function(){gradeHand(false)};$("correctBtn").onclick=function(){gradeHand(true)};$("nextBtn").onclick=nextQuestion;if($("pronounceBtn"))$("pronounceBtn").onclick=function(){speakHebrewText(this.dataset.speech||"")};$("resetBtn").onclick=function(){if(confirm("Reset all scores, levels, and missed-word history?")){localStorage.removeItem("hebrewTrainerState");location.reload()}};$("practiceMissedBtn").onclick=function(){try{sessionStorage.setItem("hebrewTrainerLaunch","review")}catch(e){}state.session=null;save();location.reload()};if($("restartPracticeBtn"))$("restartPracticeBtn").onclick=restartPracticeSession;
function renderSprintDue(){
  let badge=$("sprintDueLabel");if(!badge)return;
  badge.classList.toggle("hidden",!state.sprintDue);
}
function sprintQuestion(){
  let q;
  for(let tries=0;tries<40;tries++){
    let r=Math.random();
    if(r<.34&&verbDefinitions.length)q=verbDefinitionQuestion();
    else if(r<.68&&classVerbQuestions.length){let c=rand(classVerbQuestions);q={type:"sprint",cat:c.cat||"פעלים",prompt:c.prompt,correct:c.answer,options:shuffle(c.options)}}
    else{let item=rand(vocab),reverse=Math.random()<.35,m=mc(item,reverse);q={type:"sprint",cat:item.cat,prompt:m.prompt,correct:m.correct,options:m.options}}
    let sig=[q.prompt,q.correct].join("||");
    if(!sprint.seen.includes(sig)){sprint.seen.push(sig);return q}
  }
  return q
}
function updateSprintStats(){
  if(!sprint)return;
  let m=Math.floor(sprint.seconds/60),s=sprint.seconds%60;
  $("sprintTime").textContent=m+":"+String(s).padStart(2,"0");
  $("sprintScore").textContent=sprint.correct+" / "+sprint.attempted;
}
function nextSprintQuestion(){
  if(!sprint||sprint.seconds<=0)return finishSprint();
  let q=sprintQuestion();sprint.current=q;
  $("sprintPrompt").textContent=q.prompt;$("sprintPrompt").dir=/[\u0590-\u05FF]/.test(q.prompt)?"rtl":"ltr";
  $("sprintInstruction").textContent="Say the answer aloud first, then tap.";
  let area=$("sprintChoices");area.innerHTML="";
  q.options.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir=/[\u0590-\u05FF]/.test(opt)?"rtl":"ltr";b.onclick=function(){answerSprint(b,opt)};area.appendChild(b)})
}
function answerSprint(btn,opt){
  if(!sprint)return;
  let q=sprint.current,ok=norm(opt)===norm(q.correct);sprint.attempted++;if(ok)sprint.correct++;
  Array.from($("sprintChoices").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(q.correct))b.classList.add("correct")});
  if(!ok){btn.classList.add("wrong");$("sprintInstruction").textContent="Correct: "+answerWithEnglish(q.correct,q)}else $("sprintInstruction").textContent="Correct.";updateSprintStats();
  setTimeout(function(){if(sprint&&sprint.seconds>0)nextSprintQuestion()},ok?220:950)
}
function startSprint(minutes){
  if(sprint)return;if(infinitiveQuiz||scriptPractice){alert("Finish the other optional practice first.");return}
  state.sprintDue=false;save();renderSprintDue();
  sprint={minutes:minutes,seconds:minutes*60,attempted:0,correct:0,seen:[],current:null};
  $("sprintSetup").classList.add("hidden");$("sprintPanel").classList.remove("hidden");$("sprintResult").classList.add("hidden");$("quizCard").classList.add("hidden");$("verbInfinitiveCard").classList.add("hidden");$("scriptPracticeCard").classList.add("hidden");
  updateSprintStats();nextSprintQuestion();
  sprintTimer=setInterval(function(){if(!sprint)return;sprint.seconds--;updateSprintStats();if(sprint.seconds<=0)finishSprint()},1000)
}
function finishSprint(){
  if(!sprint)return;
  clearInterval(sprintTimer);sprintTimer=null;
  let done=sprint,accuracy=done.attempted?Math.round(done.correct/done.attempted*100):0,rate=done.minutes?Math.round(done.correct/done.minutes):0;
  state.sprintHistory.push({date:new Date().toISOString(),minutes:done.minutes,attempted:done.attempted,correct:done.correct,accuracy:accuracy});
  let key=String(done.minutes),best=state.sprintBest[key]||0;state.sprintBest[key]=Math.max(best,done.correct);save();
  sprint=null;$("sprintPanel").classList.add("hidden");$("sprintSetup").classList.remove("hidden");$("quizCard").classList.remove("hidden");$("verbInfinitiveCard").classList.remove("hidden");$("scriptPracticeCard").classList.remove("hidden");
  let result=$("sprintResult");result.textContent="Rapid review: "+done.correct+" correct out of "+done.attempted+" attempts ("+accuracy+"%). About "+rate+" correct per minute. No pass/fail — this does not affect your level.";result.classList.remove("hidden")
}
$("sprint2Btn").onclick=function(){startSprint(2)};$("sprint3Btn").onclick=function(){startSprint(3)};$("stopSprintBtn").onclick=finishSprint;


const readingPassages=[
  {
    id:"lilmod-17-solon",title:"העבודה והבטלה",
    source:"ללמוד עברית ברמה ב׳ • unit 17 • PDF pages 197–198 (printed pages 193–194) • selected original reading; printed questions adapted to choices; supplemental comprehension labeled",
    he:"חכם גדול היה ביוון העתיקה ושמו סולון. הוא היה עובר ממקום למקום, ונותן עצות לכל דורש. הרבה מלכים נהגו לפנות אליו כדי להקשיב לחוכמתו ולקבל את עצותיו.\n[...]\nהוא יחסל את העוני ואת הרעב מן הארץ, ולא יהיו עוד עניים ורעבים בעולם.\n[...]\nהצעיר סיים לדבר - ויצא מן החדר.\n[...]\nפנה המלך אל סולון: ״הנה, שמעת את דבריו. האם לתת לו את בתי לאישה?״\n[...]\nהסביר סולון: ״הוא אומר כי מצא דרך להוציא לחם מן הארץ ללא עמל, אך העבודה היא ברכת אלוהים, כי רק אחרי עבודה קשה יודע האדם ליהנות מהמנוחה. כאשר יפסיק האדם לעבוד - איזו הנאה תהיה לו? האנשים יהיו שבעים ויחיו חיי בטלה, אך הם לא יהיו מאושרים.״",
    en:"Solon, a wise man in ancient Greece, hears a young man's proposal to end hunger without labor. He argues that work lets people appreciate rest and that idleness would not bring happiness.",
    vocab:[["עצות","advice"],["עוני","poverty"],["עמל","labor"],["בטלה","idleness"]],
    questions:[
      {q:"מי היה סולון?",a:"חכם ביוון העתיקה",opts:["חכם ביוון העתיקה","מלך אנגליה","רופא בקנדה","שודד בחנות"],kind:"Supplemental comprehension · PDF 197",explanation:"הפתיחה מציגה את סולון כחכם ביוון העתיקה."},
      {q:"מה נתן סולון לכל דורש?",a:"עצות",opts:["עצות","כסף","לחם","עבודה"],kind:"Supplemental comprehension · PDF 197",explanation:"הטקסט אומר שהוא נתן עצות לכל דורש."},
      {q:"מה הציע הצעיר למלך?",a:"להוציא לחם מן הארץ בלי עמל",opts:["להוציא לחם מן הארץ בלי עמל","לסגור את הארמון","לנסוע לארץ אחרת","לצאת למלחמה"],kind:"Printed comprehension · PDF 198 · adapted choices",explanation:"סולון מסביר שהצעיר טען כי מצא דרך להוציא לחם מן הארץ ללא עמל."},
      {q:"מה ביקש הצעיר מהמלך?",a:"לתת לו את בתו לאישה",opts:["לתת לו את בתו לאישה","לתת לו סוס","למנות אותו לשופט","לבנות לו בית"],kind:"Printed comprehension · PDF 198 · adapted choices",explanation:"השיחה עם המלך בעמוד 193 מזכירה את הבקשה לתת לצעיר את בתו לאישה."},
      {q:"מה היה הסוד של הצעיר?",a:"להוציא לחם מן הארץ בלי עמל",opts:["להוציא לחם מן הארץ בלי עמל","כל בני האדם כבר עשירים","המלך יודע לאפות","אין צורך במים"],kind:"Printed comprehension · PDF 198 · adapted choices",explanation:"לפי הסבר סולון, הסוד לכאורה היה לחם מן הארץ ללא עמל."},
      {q:"מה הצעיר קיווה לחסל?",a:"את העוני ואת הרעב",opts:["את העוני ואת הרעב","את בתי הספר","את המכוניות","את החגים"],kind:"Supplemental comprehension · PDF 197",explanation:"הקטע אומר שיחסל את העוני ואת הרעב מן הארץ."},
      {q:"מתי יודע האדם ליהנות מהמנוחה, לפי סולון?",a:"אחרי עבודה קשה",opts:["אחרי עבודה קשה","לפני העבודה","כשאינו עובד לעולם","לפני ארוחה"],kind:"Supplemental comprehension · PDF 197",explanation:"סולון אומר שרק אחרי עבודה קשה יודע האדם ליהנות מהמנוחה."},
      {q:"האם חיי בטלה יעשו את האנשים מאושרים?",a:"לא",opts:["לא","כן","רק את המלך","הטקסט אינו אומר"],kind:"Supplemental comprehension · PDF 197",explanation:"סולון אומר שהאנשים יהיו שבעים אך לא יהיו מאושרים."}
    ]
  },
  {
    id:"lilmod-17-prepositions",title:"החכמים בכיכר הכפר — מילות יחס",
    source:"ללמוד עברית ברמה ב׳ • unit 17 • PDF page 205 (printed page 201) • selected original cloze lines with blanks; answer choices adapted",
    he:"השלימו את מילות היחס החסרות בנפרד או בנטייה (היעזרו בטקסט):\nשמעתי _____ החכמים היושבים בכיכר הכפר. שמעתי _____ הרבה סיפורים, ולכן פניתי _____ כדי לקבל _____ עצתם.\n[...]\nראש הממשלה קרא לכל השרים ואמר _____: ״האזרחים מתקוממים _____. מה אנחנו צריכים לעשות?״\n[...]\nענה _____ אחד השרים: ״אדוני, אנחנו יכולים לתת _____ לחם, אבל זה לא יפסיק _____ ההתקהלויות.״",
    en:"Complete the preposition blanks in the source exercise about village sages and a government discussing unemployed citizens.",
    vocab:[["מילות יחס","prepositions"],["התקהלויות","gatherings"]],
    questions:[
      {q:"שמעתי _____ החכמים היושבים בכיכר הכפר.",a:"על",opts:["על","אל","את","מן"],kind:"Printed fill-in · PDF 205 · adapted choices",explanation:"שמעתי על means 'I heard about'; the following phrase names the sages heard about."},
      {q:"ראש הממשלה קרא לכל השרים ואמר _____.",a:"להם",opts:["להם","אותם","עליהם","מהם"],kind:"Printed fill-in · PDF 205 · adapted choices",explanation:"אמר להם means 'said to them'; להם refers back to the ministers."},
      {q:"אנחנו יכולים לתת _____ לחם, אבל זה לא יפסיק _____ ההתקהלויות.",a:"להם; את",opts:["להם; את","אותם; על","מהם; אל","להן; של"],kind:"Printed fill-in · PDF 205 · adapted choices",explanation:"לתת להם לחם means give them bread; להפסיק את ההתקהלויות takes the object marker את."}
    ]
  },
  {
    id:"lilmod-18-whale",title:"התינוק הגדול ביותר בעולם",
    source:"ללמוד עברית ברמה ב׳ • unit 18 • PDF pages 206–207 (printed pages 202–203) • selected original reading; printed comprehension and number questions adapted to choices",
    he:"הלווייתן הוא בעל החיים הגדול ביותר בעולם. אף על פי שהוא חי בים, הוא אינו דג. הוא שייך למשפחת היונקים, וגם האדם שייך למשפחה זו. הלווייתן הענק חי במים עמוקים וקרים. לפעמים, כנראה בטעות, מגיעים לווייתנים גדולים אל החוף, ואז הם אינם מצליחים לחזור לים הפתוח ומתים.\nמערכת הנשימה של הלווייתן שונה מזו של הדגים. יש לו ריאות, וכדי לנשום הוא חייב לעלות על פני המים כל 20 דקות בערך.\n[...]\nלפעמים מגיע אורך גופו לחצי מאורך גופה של האם. [...] המים עוזרים לה ודוחפים את גופה הכבד למעלה.\nהלווייתן הקטן מתפתח במהירות עצומה. [...] הלווייתן התינוק יונק ממש כמו חיות היבשה.\n[...]\nהלווייתן הענק אוכל צמחים קטנים (פלנקטון) שצפים במים. [...] הוא אינו יכול לבלוע בן אדם.",
    en:"The whale is a marine mammal, not a fish. It surfaces to breathe, its calf nurses, and the adult feeds on plankton rather than people.",
    vocab:[["יונקים","mammals"],["מערכת הנשימה","respiratory system"],["יונק","nurses"],["פלנקטון","plankton"]],
    questions:[
      {q:"מהו בעל החיים הגדול ביותר בעולם?",a:"הלווייתן",opts:["הלווייתן","הפיל","הדג הקטן","האדם"],kind:"Supplemental comprehension · PDF 206",explanation:"המשפט הראשון מזהה את הלווייתן."},
      {q:"לאיזו משפחה שייכים הלווייתן והאדם?",a:"יונקים",opts:["יונקים","ציפורים","צמחים","דגים"],kind:"Supplemental comprehension · PDF 206",explanation:"שניהם שייכים למשפחת היונקים."},
      {q:"איפה חי הלווייתן?",a:"במים עמוקים וקרים",opts:["במים עמוקים וקרים","במדבר","ביער","במערה"],kind:"Supplemental comprehension · PDF 206",explanation:"הקטע מתאר אותו כיצור ימי החי במים עמוקים וקרים."},
      {q:"במה שונה הלווייתן מהדגים?",a:"מערכת הנשימה שלו שונה",opts:["מערכת הנשימה שלו שונה","אין לו גוף","הוא אינו חי במים","הוא קטן מכל דג"],kind:"Printed comprehension · PDF 207 · adapted choices",explanation:"מערכת הנשימה של הלווייתן שונה מזו של הדגים; יש לו ריאות."},
      {q:"למה הלווייתן עולה על פני המים?",a:"כדי לנשום",opts:["כדי לנשום","כדי לישון","כדי לאכול דגים","כדי ללדת"],kind:"Supplemental comprehension · PDF 206",explanation:"הוא חייב לעלות על פני המים כדי לנשום."},
      {q:"איך הלווייתן התינוק ניזון?",a:"יונק",opts:["יונק","אוכל אבנים","צד עופות","שותה מי ים"],kind:"Supplemental comprehension · PDF 206",explanation:"הטקסט אומר שהתינוק יונק כמו חיות היבשה."},
      {q:"מה אוכל הלווייתן הענק?",a:"פלנקטון",opts:["פלנקטון","אנשים","ציפורים","אבנים"],kind:"Supplemental comprehension · PDF 206",explanation:"הקריאה מציינת צמחים קטנים, פלנקטון."},
      {q:"האם הלווייתן יכול לבלוע בן אדם לפי הקטע?",a:"לא",opts:["לא","כן","רק תינוק","רק דייג"],kind:"Supplemental comprehension · PDF 206",explanation:"בסוף הקטע נאמר במפורש שאינו יכול לבלוע בן אדם."},
      {q:"במה דומה הלווייתן לאדם?",a:"שניהם יונקים",opts:["שניהם יונקים","שניהם דגים","שניהם גרים ביבשה","שניהם אוכלים בני אדם"],kind:"Printed comprehension · PDF 207 · adapted choices",explanation:"האדם והלווייתן שייכים למשפחת היונקים."},
      {q:"למה מתייחס המספר 20?",a:"לדקות בין העליות לנשימה",opts:["לדקות בין העליות לנשימה","לשנות החיים","לגיל התינוק","למספר לווייתנים"],kind:"Printed number question · PDF 207 · adapted choices",explanation:"הקריאה אומרת כל 20 דקות בערך כדי לנשום."},
      {q:"למה מתייחס השבר 1/2?",a:"לאורך גופו של התינוק לעומת אמו",opts:["לאורך גופו של התינוק לעומת אמו","למשך החיים","לכמות הפלנקטון","לגובה המים"],kind:"Printed number question · PDF 207 · adapted choices",explanation:"הקריאה מתארת את אורך גוף התינוק כחצי מאורך גופה של האם."},
      {q:"מערכת הנשימה שלו שונה מזו של הדגים. מה הפירוש?",a:"מערכת הנשימה שלו אינה כמו זו של הדגים",opts:["מערכת הנשימה שלו אינה כמו זו של הדגים","מערכת הנשימה שלו זהה לזו של הדגים","הוא אינו נושם","הדגים אינם חיים במים"],kind:"Printed word choice · PDF 212 · adapted choices",explanation:"שונה מזו של means different from that of; the whale has lungs."},
      {q:"מצאו בטקסט את ההפך של למטה.",a:"למעלה",opts:["למעלה","קדימה","קטן","מעט"],kind:"Printed opposite · PDF 212 · adapted choices",explanation:"הטקסט אומר שהמים דוחפים את גופה הכבד למעלה; זה ההפך של למטה."},
      {q:"מצאו בטקסט את ההפך של באיטיות.",a:"במהירות",opts:["במהירות","למטה","בשקט","ברחוק"],kind:"Printed opposite · PDF 212 · adapted choices",explanation:"הטקסט אומר שהלווייתן הקטן מתפתח במהירות; זה ההפך של באיטיות."}
    ]
  },
  {
    id:"lilmod-18-rescue",title:"מבצע להצלת הלווייתנים",
    source:"ללמוד עברית ברמה ב׳ • unit 18 • PDF page 212 (printed page 208) • selected original fill-in passage and printed questions; choices adapted",
    he:"השלימו את המילים החסרות בידיעה מהעיתון:\nמבצע להצלת הלווייתנים\nאנשים טובים עשו במשך שבועיים מאמץ בלתי רגיל להציל את _____ של שלושה לווייתנים.\nה_____ נלכדו (=נתפסו) במלכודת קרח ליד חופי אלסקה שבארה״ב. הם _____ יכלו לנשום, והיתה צפויה להם סכנת _____.\nמתנדבים אמריקנים, בעזרת תושבים אסקימוסים מהאזור, החלו במבצע ל_____ חיי הלווייתנים.\n[...]\nהמבצע עלה מיליון דולר.",
    en:"A newspaper fill-in reports a two-week rescue of three whales trapped in ice near Alaska, helped by local Eskimo residents; the operation cost a million dollars.",
    vocab:[["מבצע","operation"],["להציל","to save"],["מלכודת קרח","ice trap"]],
    questions:[
      {q:"מה קרה ללווייתנים ואיפה?",a:"נלכדו בקרח ליד חופי אלסקה",opts:["נלכדו בקרח ליד חופי אלסקה","נלכדו בנהר בישראל","הגיעו למדבר","נשארו ליד לונדון"],kind:"Printed comprehension · PDF 212 · adapted choices",explanation:"הידיעה אומרת שנלכדו במלכודת קרח ליד חופי אלסקה."},
      {q:"מי עזר למתנדבים האמריקנים?",a:"תושבים אסקימוסים מהאזור",opts:["תושבים אסקימוסים מהאזור","רופאים מאנגליה","שוטרים מיוון","דייגים מקנדה"],kind:"Printed comprehension · PDF 212 · adapted choices",explanation:"הקטע מציין עזרה של תושבים אסקימוסים מהאזור."},
      {q:"כמה עלה המבצע?",a:"מיליון דולר",opts:["מיליון דולר","עשרה שקלים","חצי טון","עשרים דולר"],kind:"Printed comprehension · PDF 212 · adapted choices",explanation:"השורה האחרונה בידיעה אומרת שהמבצע עלה מיליון דולר."}
    ]
  },
  {"id":"lilmod-15-real-story","title":"סיפור מהמציאות","source":"ללמוד עברית ברמה ב׳ • unit 15 • PDF page 179 (printed page 175) • selected original reading and printed questions adapted to choices","he":"לפני מספר שנים פגשה צעירה עברייה סטודנט אנגלי שלמד רפואה. השניים התאהבו זה בזה, ורצו להינשא. משפחתה של הצעירה, שהיא אחת המשפחות העשירות באנגליה, התנגדה לצעיר העני, ורצתה שהבת תתחתן עם קרוב משפחה מבוגר ועשיר. הצעירה התחתנה עם הסטודנט על אף התנגדות משפחתה.\nגם אחרי הנישואין לא הסכימה המשפחה להכיר בבעלה של הבת. בני הזוג חששו מהמשפחה, ולכן הם עזבו את אנגליה ועברו לקנדה.\nכעבור חמש שנים ביקר אחיה של הצעירה בקנדה. [...] הוא חטף אותה, אף על פי שידע כי הוא עובר על החוק הקנדי.\nסיפור החטיפה זעזע רבים בקנדה. הבעל הצעיר שהוא רופא בבית חולים במונטריאול, סיפר לכתבים שהוא מתכונן לפנות אל בית המשפט כדי להחזיר אליו את אשתו.","en":"A young Jewish woman marries a medical student despite her wealthy family’s opposition. They move to Canada. Five years later her brother visits, abducts her, and the husband seeks legal help.","vocab":[["להינשא","to marry"],["התנגדות","opposition"],["חטיפה","abduction"]],"questions":[{"q":"את מי פגשה הצעירה?","a":"סטודנט אנגלי שלמד רפואה","opts":["סטודנט אנגלי שלמד רפואה","שופט קנדי","רופא איטלקי","עורך דין"],"kind":"Supplemental comprehension","explanation":"משפט הפתיחה מציג סטודנט אנגלי שלמד רפואה."},{"q":"למה התנגדה המשפחה לחתן?","a":"הוא היה עני","opts":["הוא היה עני","הוא היה קנדי","הוא היה רופא","הוא היה מבוגר"],"kind":"Printed comprehension · adapted","explanation":"המשפחה התנגדה לצעיר העני ורצתה חתן עשיר."},{"q":"מה קרה גם אחרי הנישואין?","a":"המשפחה לא הסכימה להכיר בבעל","opts":["המשפחה לא הסכימה להכיר בבעל","המשפחה הזמינה אותו","הם חזרו לאנגליה","הבעל עזב לבדו"],"kind":"Supplemental comprehension","explanation":"הקטע אומר שהמשפחה לא הסכימה להכיר בו."},{"q":"לאן עברו בני הזוג?","a":"לקנדה","opts":["לקנדה","לאיטליה","לישראל","לצרפת"],"kind":"Supplemental comprehension","explanation":"לכן הם עזבו את אנגליה ועברו לקנדה."},{"q":"כעבור כמה שנים ביקר אחיה בקנדה?","a":"חמש שנים","opts":["חמש שנים","חמש שעות","עשר שנים","חודש"],"kind":"Supplemental comprehension","explanation":"בקטע נאמר כעבור חמש שנים."},{"q":"על איזה חוק ידע האח שהוא עובר?","a":"החוק הקנדי","opts":["החוק הקנדי","החוק האיטלקי","חוקי התנועה","החוק הישראלי"],"kind":"Supplemental comprehension","explanation":"הטקסט אומר במפורש החוק הקנדי."},{"q":"מהי עבודתו של הבעל במונטריאול?","a":"רופא בבית חולים","opts":["רופא בבית חולים","שופט","סופר","נהג"],"kind":"Supplemental comprehension","explanation":"הבעל הצעיר הוא רופא בבית חולים במונטריאול."},{"q":"מה קרה קודם: הנישואין או המעבר לקנדה?","a":"הנישואין","opts":["הנישואין","המעבר לקנדה","החטיפה","המשפט"],"kind":"Supplemental sequence · adapted from unit 15","explanation":"אחרי הנישואין בני הזוג חששו מן המשפחה ועברו לקנדה."},{"q":"מה בא אחרי שהמשפחה לא הסכימה להכיר בבעל?","a":"בני הזוג עברו לקנדה","opts":["בני הזוג עברו לקנדה","בני הזוג חזרו לאנגליה","האב הזמין את הצעיר","הבת נעשתה שופטת"],"kind":"Supplemental sequence · adapted from unit 15","explanation":"המעבר לקנדה מתואר מיד אחרי סירוב המשפחה."},{"q":"מה התכוון הבעל לעשות אחרי החטיפה?","a":"לפנות אל בית המשפט","opts":["לפנות אל בית המשפט","לחזור לאנגליה","להפסיק לעבוד","להזמין את האח"],"kind":"Supplemental sequence · adapted from unit 15","explanation":"הבעל אמר לכתבים שהוא מתכונן לפנות אל בית המשפט."}]},
  {"id":"lilmod-15-cake","title":"השדכן והכלה — קטע קצר","source":"ללמוד עברית ברמה ב׳ • unit 15 • PDF page 180 (printed page 176) • original short dialogue excerpt; supplemental comprehension","he":"שדכן אחד הציע כלה לבחור צעיר. אמר השדכן: היא טובה, ישרה ונחמדה מאוד. יש לה רק שני חסרונות: יש לה אף ארוך, והיא צולעת מעט.\n[...]\n״אתה יכול לדבר בקול רם,״ ענה השדכן. ״היא אינה שומעת.״","en":"A matchmaker describes a prospective bride and eventually admits she cannot hear well.","vocab":[["שדכן","matchmaker"],["כלה","bride"]],"questions":[{"q":"למה הציע השדכן לדבר בקול רם?","a":"היא אינה שומעת","opts":["היא אינה שומעת","היא אינה רואה","היא צעירה מאוד","היא אינה מדברת אנגלית"],"kind":"Supplemental comprehension","explanation":"בסיום הקטע השדכן אומר: היא אינה שומעת."}]},
  {"id":"lilmod-16-ducklings","title":"השודדים והברווזים הקטנים","source":"ללמוד עברית ברמה ב׳ • unit 16 • PDF page 187 (printed page 183) • selected original reading; comprehension and ordering adapted to choices","he":"זה קרה בעיר אחת בארה״ב: שני אנשים נכנסו לחנות גדולה, ורצו לשדוד את הקופה. הקופאי התנגד להם, ואז הוציא אחד השודדים אקדח, וירה בקופאי. אחר כך לקחו השודדים את הכסף, ונמלטו מן המקום במכונית.\nהקופאי לא נהרג, הוא רק נפצע. הוא הצליח להתקשר אל המשטרה, והשוטרים התחילו לרדוף אחרי השודדים. [...]\nבבית המשפט סיפר אחד השודדים: ״כל זה קרה בגלל ג׳ק שנהג במכונית. כאשר השוטרים רדפו אחרינו, הופיעה פתאום בכביש ברווזה עם שבעה ברווזונים קטנים. [...] אך ג׳ק לא רצה לדרוס את הברווזונים הקטנים ועצר. וכך נפלנו בידי השוטרים.״\nגם השוטרים העידו: ״תפסנו את השודדים הודות לברווזים הקטנים.״\nהשופט פסק להם עשר שנות מאסר.","en":"Two robbers flee a store by car. A duck and seven ducklings appear in the road; the driver stops, and police catch the robbers.","vocab":[["לשדוד","to rob"],["קופאי","cashier"],["ברווזונים","ducklings"]],"questions":[{"q":"מה רצו שני האנשים לשדוד?","a":"את הקופה בחנות","opts":["את הקופה בחנות","את תחנת המשטרה","את בית המשפט","את המכונית"],"kind":"Supplemental comprehension","explanation":"בפתיחה כתוב שהם רצו לשדוד את הקופה."},{"q":"במי ירה אחד השודדים?","a":"בקופאי","opts":["בקופאי","בשופט","בשוטר","בנהג"],"kind":"Supplemental comprehension","explanation":"הקופאי התנגד והשודד ירה בו."},{"q":"איך נמלטו השודדים מן המקום?","a":"במכונית","opts":["במכונית","ברכבת","ברגל","באוטובוס"],"kind":"Supplemental comprehension","explanation":"הטקסט אומר שנמלטו במכונית."},{"q":"מי הצליח להתקשר אל המשטרה?","a":"הקופאי שנפצע","opts":["הקופאי שנפצע","ג׳ק","השופט","בעל החנות"],"kind":"Supplemental comprehension","explanation":"הקופאי לא נהרג והצליח להתקשר למשטרה."},{"q":"מי הופיעו פתאום בכביש?","a":"ברווזה ושבעה ברווזונים","opts":["ברווזה ושבעה ברווזונים","ארנבת","צבי","עכברים"],"kind":"Supplemental comprehension","explanation":"הטקסט מונה ברווזה ושבעה ברווזונים."},{"q":"בזכות מי נתפסו השודדים, לפי השוטרים?","a":"הברווזונים הקטנים","opts":["הברווזונים הקטנים","הטלוויזיה","הרכבת","המלון"],"kind":"Supplemental comprehension","explanation":"השוטרים אומרים שתפסו אותם הודות לברווזים הקטנים."},{"q":"מה פסק השופט לשודדים?","a":"עשר שנות מאסר","opts":["עשר שנות מאסר","חמש שנות מאסר","קנס בלבד","שחרור"],"kind":"Supplemental comprehension","explanation":"בסיום נאמר עשר שנות מאסר."},{"q":"מה קרה קודם: השוד או הופעת הברווזונים?","a":"השוד","opts":["השוד","הופעת הברווזונים","פסק הדין","המעצר"],"kind":"Supplemental sequence · adapted from printed ordering exercise","explanation":"הברווזונים הופיעו בעת המרדף שאחרי השוד."},{"q":"מה קרה מיד אחרי התנגדות הקופאי?","a":"השודד ירה בו","opts":["השודד ירה בו","השופט הגיע","הם הלכו למלון","השוטרים עצרו ברווזים"],"kind":"Supplemental sequence · adapted from printed ordering exercise","explanation":"במשפט הראשון, אחרי ההתנגדות השודד הוציא אקדח וירה."},{"q":"באיזה כלי רכב ברחו השודדים?","a":"במכונית","opts":["במכונית","ברכבת","במטוס","באופניים"],"kind":"Supplemental sequence · adapted from printed ordering exercise","explanation":"הם נמלטו מן המקום במכונית."},{"q":"מה גרם לג׳ק לעצור במהלך המרדף?","a":"הברווזונים שעל הכביש","opts":["הברווזונים שעל הכביש","זאב","צעירה מאנגליה","רכבת"],"kind":"Supplemental sequence · adapted from printed ordering exercise","explanation":"ג׳ק לא רצה לדרוס את הברווזונים הקטנים, ולכן עצר."}]},
  {"id":"lilmod-16-nurit","title":"נורית והפריצה","source":"ללמוד עברית ברמה ב׳ • unit 16 • PDF page 191 (printed page 187) • selected original narrative exercise; comprehension adapted to choices","he":"נורית נכנסה הביתה, הסתכלה מסביב ונבהלה מאוד. היא ראתה שהדלת נפרצה, הארונות נפתחו וכל הבגדים נזרקו על הרצפה. השעון הגדול נשבר, וכלי הכסף נעלמו. היא נעצרה באמצע החדר ולא ידעה מה לעשות.\nפתאום נשמע בחדר קול מוזר: ״איפה נמצא הכסף שלך?״ נורית הסתובבה. מאחורי הווילון נראה איש מחזיק באקדח, ומאיים עליה.","en":"Nurit enters a broken-in home, sees signs of a robbery, and then discovers an armed man behind the curtain.","vocab":[["נפרצה","was broken into"],["נזרקו","were thrown"],["נעלמו","disappeared"]],"questions":[{"q":"מה ראתה נורית כשנכנסה הביתה?","a":"דלת שנפרצה ובגדים על הרצפה","opts":["דלת שנפרצה ובגדים על הרצפה","בית נקי","שוטרים מחכים","ברווזים"],"kind":"Supplemental comprehension","explanation":"הטקסט מתאר דלת שנפרצה ובגדים שנזרקו על הרצפה."},{"q":"מה קרה לבגדים?","a":"נזרקו על הרצפה","opts":["נזרקו על הרצפה","נשארו בארון","נמכרו","נשלחו בדואר"],"kind":"Supplemental comprehension","explanation":"הנרטיב אומר שכל הבגדים נזרקו על הרצפה."},{"q":"מה נשמע פתאום בחדר?","a":"קול ששאל איפה הכסף","opts":["קול ששאל איפה הכסף","צלצול מהמשטרה","שיר ברדיו","קריאת ברווזים"],"kind":"Supplemental comprehension","explanation":"הטקסט מצטט קול ששואל על הכסף."},{"q":"מה נעלם מן הבית?","a":"כלי הכסף","opts":["כלי הכסף","המיטה","המכונית","הספרים"],"kind":"Supplemental comprehension","explanation":"כתוב שכלי הכסף נעלמו."}]},
  {"id":"lilmod-16-police-order","title":"השוטרת והצעיר — סדר כרונולוגי","source":"ללמוד עברית ברמה ב׳ • unit 16 • PDF page 193 (printed page 189) • original sentence-ordering exercise excerpts; choices adapted","he":"סדרו את המשפטים בסדר כרונולוגי:\nהיא ראתה איש זקן רץ אחרי איש צעיר.\nהיא התחילה לרוץ אחרי הצעיר.\nהיא ביקשה מאנשים שיעזרו לה.\nהזקן צעק שיעזרו לו לתפוס את הצעיר.\nהיא הצליחה לתפוס אותו.","en":"The printed task asks learners to put a police story in chronological order. A policewoman sees an older man chasing a young man, gets help, and catches him.","vocab":[["שוטרת","policewoman"],["לתפוס","to catch"]],"questions":[{"q":"מה ראתה השוטרת לפני שהתחילה לרוץ?","a":"איש זקן רץ אחרי איש צעיר","opts":["איש זקן רץ אחרי איש צעיר","הצעיר גנב כסף ממשרד","ברווזים על הכביש","הזקן נסע"],"kind":"Printed ordering · adapted to choices","explanation":"ברשימת המקור היא ראתה איש זקן רץ אחרי איש צעיר."},{"q":"מה ביקשה השוטרת מן האנשים?","a":"שיעזרו לה","opts":["שיעזרו לה","שימשיכו לנסוע","שייכנסו לחנות","שיקראו ספר"],"kind":"Printed ordering · adapted to choices","explanation":"במשפט המקור כתוב: היא ביקשה מאנשים שיעזרו לה."},{"q":"מה הצליחה השוטרת לעשות בסוף?","a":"לתפוס את הצעיר","opts":["לתפוס את הצעיר","לנסוע לשדה התעופה","להחביא את הכסף","לשחרר אותו"],"kind":"Printed ordering · adapted to choices","explanation":"אחד ממשפטי המקור אומר: היא הצליחה לתפוס אותו."}]},
  {"id":"lilmod-16-caption","title":"תמונה מן החיים — השלמה","source":"ללמוד עברית ברמה ב׳ • unit 16 • PDF pages 194–195 (printed page 191) • original photo-caption fill-in excerpts; choices adapted","he":"התמונה שלפניכם נראית כתמונה מסרט; אבל זה קרה בחיים. זה _____ בעיר סאן-פאולו שבבראזיל.\nצעיר _____ חנות בגדים גדולה. הוא החזיק במוכרת בת ה־14 שבחנות כבת ערובה (שבויה).\nשוטר שהתחפש ל_____ טלוויזיה, הצליח להתקרב אל ה_____.","en":"A photograph shows a real incident in São Paulo: a robber held a 14-year-old shop assistant hostage, and a disguised police officer approached.","vocab":[["בת ערובה","hostage"],["התחפש","disguised himself"]],"questions":[{"q":"איזו מילת ניגוד מופיעה במשפט הפתיחה?","a":"אבל","opts":["אבל","כי","לכן","כאשר"],"kind":"Printed fill-in · source sentence","explanation":"המשפט משווה תמונה מסרט למקרה שקרה בחיים ומשתמש באבל."},{"q":"את מי החזיק הצעיר כבת ערובה?","a":"מוכרת בת 14","opts":["מוכרת בת 14","שוטרת","נהג","אחותו"],"kind":"Printed fill-in · source sentence","explanation":"בקטע כתוב: המוכרת בת ה־14 שבחנות."},{"q":"למי התחפש השוטר?","a":"לצלם טלוויזיה","opts":["לצלם טלוויזיה","לנהג","לרופא","לשופט"],"kind":"Printed fill-in · adapted choices","explanation":"משפט המקור אומר שהשוטר התחפש לצלם טלוויזיה."}]},
  {
    id:"lilmod-13-free-woman",title:"אישה משוחררת",
    source:"ללמוד עברית ברמה ב׳ • unit 13 • PDF pages 155–156 (printed pages 151–152) • selected original reading excerpts; comprehension adapted to choices",
    he:"אמרתי לבעלי: ראה אילו חיים יש לך, ואילו חיים יש לי. אתה יוצא כל בוקר מהבית, עוסק בעבודה מעניינת, פוגש אנשים, מקבל כוס קפה ממזכירתך, משוחח, חוזר הביתה אחר הצהריים ובא לבית נקי ומסודר, מקבל ארוחה חמה וטעימה, קורא עיתון, מספר לאשתך מה עשית כל היום, רואה בטלוויזיה חדשות וגם סרטים, והולך לישון.\nואני - רק עקרת בית. אני קמה בבוקר, מכינה לך קפה, מכינה לילדים ארוחת בוקר וכריכים לגן ולבית הספר, מסדרת את הבית, מכבסת, מנקה, מבשלת, מגהצת, סוחבת סלי ירקות ופירות מהשוק, מתקנת גרביים, מגישה ארוחות, שוטפת כלים.\n[...]\nבעלי הסכים איתי, והחלטנו שגם אני אצא כל יום מן הבית, ואעסוק גם אני בעבודה מעניינת.\n[...]\nאני חוזרת הביתה בשעה 2.00.\n[...]\nהוא נכנס הביתה וראה שהטלוויזיה פתוחה, הרדיו מנגן, המנורה דולקת על הרצפה.\n[...]\n״אז זהו״, ענתה האישה. היום לא עשיתי את זה...",
    en:"A wife contrasts her husband's working day with her repeated housework. They agree she will take a job, but she still does the household work afterward. One day her husband returns to a disorderly home; she explains that this is what she did not do that day.",
    vocab:[["עקרת בית","homemaker"],["משוחררת","liberated"],["מכבסת","does laundry"],["מסדרת","tidies"]],
    questions:[
      {q:"מי יוצא כל בוקר מהבית ועוסק בעבודה מעניינת בתחילת הסיפור?",a:"הבעל",opts:["הבעל","האישה","הילדים","הדודה"],kind:"Supplemental comprehension · PDF 155",explanation:"האישה פונה לבעלה בלשון אתה ומתארת את יום העבודה שלו."},
      {q:"מה עושה האישה בבית בתחילת הסיפור?",a:"מכינה אוכל, מסדרת, מכבסת ומנקה",opts:["מכינה אוכל, מסדרת, מכבסת ומנקה","עובדת רק במשרד","נוסעת כל יום","ישנה כל הבוקר"],kind:"Printed comparison · adapted to choices",explanation:"הרשימה בקטע מתארת הכנת אוכל, סידור הבית, כביסה וניקיון."},
      {q:"מה החליטו האישה ובעלה?",a:"שגם היא תצא לעבוד מחוץ לבית",opts:["שגם היא תצא לעבוד מחוץ לבית","שהבעל יפסיק לעבוד","שהילדים יעבדו","שיעזבו את העיר"],kind:"Supplemental comprehension",explanation:"היא אומרת: החלטנו שגם אני אצא כל יום מן הבית ואעסוק בעבודה מעניינת."},
      {q:"באיזו שעה חוזרת האישה הביתה?",a:"בשעה 2.00",opts:["בשעה 2.00","בשעה 8.00","בשעה 5.00","בחצות"],kind:"Supplemental comprehension",explanation:"בקטע נאמר: אני חוזרת הביתה בשעה 2.00."},
      {q:"מה ראה הבעל כשחזר לבית באותו יום?",a:"הבית היה מבולגן ורועש",opts:["הבית היה מבולגן ורועש","הבית היה מסודר ושקט","הילדים ישנו","הדלת הייתה סגורה"],kind:"Supplemental comprehension · PDF 156",explanation:"בקטע ההמשך הטלוויזיה פתוחה, הרדיו מנגן והחפצים מפוזרים."},
      {q:"למה התכוונה האישה כשאמרה שלא עשתה את זה היום?",a:"לעבודות הבית שהיא עושה בדרך כלל",opts:["לעבודות הבית שהיא עושה בדרך כלל","ליום העבודה במשרד","לארוחת הבוקר של בעלה","לנסיעה לעיר"],kind:"Supplemental comprehension · PDF 156",explanation:"הבלגן מגלה לבעל כמה עבודות בית היא עושה בדרך כלל."}
    ]
  },
  {
    id:"lilmod-14-spoils",title:"חלוקת השלל",
    source:"ללמוד עברית ברמה ב׳ • unit 14 • PDF page 165 (printed page 161) • selected original reading; comprehension adapted to choices",
    he:"אריה, זאב ושועל יצאו יחד לצוד ציד. אחרי מסע ארוך הצליחו לצוד צבי, חזיר ושפן.\nפנה האריה אל הזאב ואמר: ״עכשיו, חלק את השלל בינינו!״\nאמר הזאב: ״אתה, מלך החיות, תיקח את הצבי, אני אקבל את החזיר, והשועל יסתפק בשפן.״\nשמע האריה את דברי הזאב - ורתח מכעס. הוא זינק על הזאב, שבר את רגליו, תלש את אוזניו, וכמעט הרג אותו.\n[...]\nלקח השועל את הצבי, שם אותו לרגלי האריה, ואמר: ״הנה ארוחת הבוקר שלך, מלך החיות.״ לקח את החזיר, שם גם אותו לרגלי האריה ואמר: ״זו ארוחת הצהריים שלך. אני והזאב נסתפק בשפן.״\n[...]\nהסתכל השועל לעבר הזאב הפצוע ואמר: ״מלכי, למדתי זאת מרגליו ומאוזניו של הזאב.״",
    en:"A lion, wolf, and fox hunt together. The lion asks the wolf to divide their catch, then angrily attacks him. The fox sees the consequence and gives most of the catch to the lion.",
    vocab:[["שלל","spoils"],["להסתפק","to be content with"],["רתח מכעס","seethed with anger"],["לזנק","to leap"]],
    questions:[
      {q:"אילו חיות יצאו יחד לצוד?",a:"אריה, זאב ושועל",opts:["אריה, זאב ושועל","אריה, שור וסוס","זאב, צבי ושור","שועל, סוס וחמור"],kind:"Supplemental comprehension",explanation:"משפט הפתיחה מונה אריה, זאב ושועל."},
      {q:"מה הצליחו החיות לצוד?",a:"צבי, חזיר ושפן",opts:["צבי, חזיר ושפן","דגים וציפורים","כבשים ועזים","אריה וזאב"],kind:"Supplemental comprehension",explanation:"המשפט הראשון מונה צבי, חזיר ושפן."},
      {q:"למי אמר האריה לחלק תחילה את השלל?",a:"לזאב",opts:["לזאב","לשועל","לצבי","לחזיר"],kind:"Supplemental comprehension",explanation:"פנה האריה אל הזאב ואמר: חלק את השלל בינינו."},
      {q:"למה תקף האריה את הזאב?",a:"החלוקה של הזאב הכעיסה אותו",opts:["החלוקה של הזאב הכעיסה אותו","השועל לקח את הצבי","הזאב לא צד דבר","החזיר ברח"],kind:"Supplemental comprehension",explanation:"אחרי ששמע את הצעת החלוקה של הזאב, האריה רתח מכעס."},
      {q:"מי שם את החזיר לרגלי האריה?",a:"השועל",opts:["השועל","הזאב","הצבי","השפן"],kind:"Supplemental comprehension",explanation:"הקטע אומר שהשועל לקח את החזיר ושם אותו לרגלי האריה."},
      {q:"ממי למד השועל לחלק את השלל?",a:"ממה שקרה לזאב",opts:["ממה שקרה לזאב","מספר בבית ספר","מעצת הצבי","מן השפן"],kind:"Supplemental comprehension",explanation:"תשובתו היא שלמד מרגליו ומאוזניו של הזאב הפצוע."},
      {q:"האריה פנה אל הזאב, מפני ש_____.",a:"רצה שיחלק את השלל",opts:["רצה שיחלק את השלל","הזאב ברח מן היער","השועל אכל את הצבי","הצבי ביקש ממנו"],kind:"Supplemental reason practice · adapted from unit 14",explanation:"האריה אמר לזאב לחלק את השלל ביניהם."},
      {q:"מכיוון ש_____, הזאב נתן לאריה את הצבי.",a:"האריה ביקש ממנו לחלק את השלל",opts:["האריה ביקש ממנו לחלק את השלל","השועל נתן לו כסף","הצבי היה חברו","הזאב לא ידע לצוד"],kind:"Supplemental reason practice · adapted from unit 14",explanation:"הזאב מחלק את הציד אחרי שהאריה מבקש ממנו."},
      {q:"האריה רתח מכעס, כי _____.",a:"לא אהב את החלוקה של הזאב",opts:["לא אהב את החלוקה של הזאב","השועל לא חזר","הם לא מצאו מזון","הצבי ברח מן היער"],kind:"Supplemental reason practice · adapted from unit 14",explanation:"מיד אחרי תשובת הזאב על חלוקת הציד, האריה רתח מכעס."},
      {q:"משום ש_____, השועל למד מן הטעות של הזאב.",a:"ראה מה קרה לזאב",opts:["ראה מה קרה לזאב","לא ראה את הזאב","קרא את הספר","נסע לעיר"],kind:"Supplemental reason practice · adapted from unit 14",explanation:"השועל אומר שלמד מרגליו ומאוזניו של הזאב הפצוע."}
    ]
  },
  {
    id:"lilmod-14-rabbit",title:"השועל והארנבת — קטע המשך",
    source:"ללמוד עברית ברמה ב׳ • unit 14 • PDF page 166 (printed page 162) • original short passage; supplemental comprehension",
    he:"כפי שמדגים סיפור זן: מורה זן צעד בדרך עם אחד מתלמידיו. לפתע ראו שועל רודף אחרי ארנבת.\n״על פי אגדה עתיקה, הארנבת תצליח לחמוק מן השועל,״ אמר המורה.\n״אני חושב כך,״ השיב התלמיד, ״השועל מהיר יותר.״",
    en:"A teacher and student see a fox chasing a rabbit. The teacher predicts the rabbit will escape; the student thinks the fox is faster.",
    vocab:[["ארנבת","rabbit"],["לחמוק","to escape"]],
    questions:[{q:"ממי תצליח הארנבת לחמוק, לפי המורה?",a:"מן השועל",opts:["מן השועל","מן הזאב","מן האריה","מן הצבי"],kind:"Supplemental comprehension",explanation:"המורה אומר שהארנבת תצליח לחמוק מן השועל."}]
  },
  {
    id:"lilmod-14-kruger",title:"הפילים בפארק קרוגר — השלמה",
    source:"ללמוד עברית ברמה ב׳ • unit 14 • PDF page 177 (printed page 173) • selected original fill-in passage; answer choices adapted",
    he:"בדרום אפריקה יש פארק לאומי גדול על שם קרוגר. זהו אחד הפארקים המפורסמים בדרום אפריקה. שטחו עצום.\n[...]\nבין החיות נמצאים _____ פילים רבים. בדרך כלל מתנהגים הפילים בסדר, ו_____ פוגעים בתיירים שבאו לבקר בפארק.",
    en:"A national park in South Africa is named for Kruger. Complete the source sentence about elephants among the animals in the park.",
    vocab:[["פארק לאומי","national park"],["פילים","elephants"]],
    questions:[{q:"בין החיות נמצאים _____ פילים רבים.",a:"גם",opts:["גם","רק","אין","את"],kind:"Printed fill-in · answer choices adapted",explanation:"גם מוסיף את הפילים לשאר החיות המתוארות בקטע."}]
  },
  {
    id:"lilmod-1-slowly-surely",title:"לאט אבל בטוח",
    source:"ללמוד עברית ברמה ב׳ • unit 1 • PDF page 11 (printed page 7) • original reading; printed completion exercise adapted to answer choices; additional comprehension marked supplemental",
    he:"סטודנט לרפואה לא למד במשך כל השנה. בסוף השנה, כאשר התקרבו המבחנים, נבהל הסטודנט הצעיר, כי פחד להיכשל.\nהוא פנה אל הפרופסור שלו ושאל: \"אדוני הפרופסור, האם מספיק ללמוד במשך חודש אחד כדי להצליח במבחנים?\"\nענה הפרופסור הזקן: \"אתה רוצה להיות רופא. הרבה פעמים מגיעים למרפאה אנשים שמנים מאוד. אתה יכול לתת להם דיאטה ארוכה וקלה או להציע להם לצום כמה ימים כדי לרזות. מה אתה בוחר להציע להם?\"",
    en:"A medical student did not study all year. Near the exams he feared failing and asked his professor whether one month of study was enough. The professor answered with a comparison: would a doctor offer a long, easy diet or a few days of fasting?",
    vocab:[["רפואה","medicine"],["בחינות","exams"],["להיכשל","to fail"],["לצום","to fast"]],
    questions:[
      {q:"בסיפור מדברים על סטודנט ל______.",a:"רפואה",opts:["רפואה","היסטוריה","אומנות","מוזיקה"],kind:"Printed completion · answer choices adapted",explanation:"הפתיחה אומרת: סטודנט לרפואה."},
      {q:"הסטודנט לא למד ______ כל השנה.",a:"במשך",opts:["במשך","אחרי","לפני","בלי"],kind:"Printed completion · answer choices adapted",explanation:"המשפט הראשון אומר: לא למד במשך כל השנה."},
      {q:"הוא שאל את ה______ שלו.",a:"פרופסור",opts:["פרופסור","נהג","מוכר","חבר"],kind:"Printed completion · answer choices adapted",explanation:"בקטע כתוב שהוא פנה אל הפרופסור שלו ושאל."},
      {q:"כדי ______ במבחנים.",a:"להצליח",opts:["להצליח","לנסוע","לשחות","לבשל"],kind:"Printed completion · answer choices adapted",explanation:"השאלה של הסטודנט מסתיימת במילים כדי להצליח במבחנים."},
      {q:"מתי נבהל הסטודנט?",a:"כאשר התקרבו המבחנים",opts:["כאשר התקרבו המבחנים","בתחילת השנה","בחופשה","אחרי שסיים ללמוד"],kind:"Supplemental comprehension",explanation:"המשפט הראשון קושר את הפחד להתקרבות המבחנים."},
      {q:"מה הציע הפרופסור כאפשרויות לאנשים שרוצים לרזות?",a:"דיאטה ארוכה וקלה או צום של כמה ימים",opts:["דיאטה ארוכה וקלה או צום של כמה ימים","לימוד במשך חודש","נסיעה לירושלים","שינה במשך כל היום"],kind:"Supplemental comprehension",explanation:"הפרופסור משווה דיאטה ארוכה וקלה לצום של כמה ימים."}
    ]
  },
  {
    id:"lilmod-2-many-stones",title:"כל כך הרבה אבנים",
    source:"ללמוד עברית ברמה ב׳ • unit 2 • PDF page 24 (printed page 20) • original reading and printed comprehension/completion prompts; answer choices adapted; additional comprehension marked supplemental",
    he:"תייר אחד ביקר בירושלים. האיש טייל ברחובות, וראה שבנו את הבתים ואת הגדרות מאבן.\nהוא התקרב אל החומה של העיר העתיקה, וראה שגם היא מאבן. האיש המשיך לטייל, ויצא אל ההרים מחוץ לעיר. הוא הסתכל מסביב ובכל מקום ראה אבנים: אבנים על ההרים ואבנים בדרכים. האיש התפלא מדוע יש כל כך הרבה אבנים בירושלים.\nכאשר חזר אל העיר, פנה התייר אל זקן אחד ושאל אותו: \"אולי אתה יכול להסביר לי מדוע יש כל כך הרבה אבנים בירושלים?\"\nענה לו הזקן: \"בכל הדורות באו יהודים לירושלים כדי להתפלל ולבכות ליד הכותל המערבי. עם כל דמעה הרגישו שירדה להם אבן מהלב ... וכך יש בירושלים הרבה אבנים.\"",
    en:"A tourist in Jerusalem saw stone houses, fences, the Old City wall, hills, and roads. He asked an elder why there were so many stones. The elder answered with an image of generations praying at the Western Wall and feeling a stone lifted from the heart with each tear.",
    vocab:[["חומה","wall"],["אבן","stone"],["דמעה","tear"],["ירדה אבן מהלב","felt relief"]],
    questions:[
      {q:"בירושלים יש הרבה אבנים. איפה?",a:"בבתים, בגדרות, בחומה, על ההרים ובדרכים",opts:["בבתים, בגדרות, בחומה, על ההרים ובדרכים","רק בבתים","רק ליד הנהר","רק במרפאה"],kind:"Printed comprehension · answer choices adapted",explanation:"הקטע מונה בתים, גדרות, חומה, הרים ודרכים."},
      {q:"למה פנה התייר אל הזקן?",a:"כדי לשאול מדוע יש כל כך הרבה אבנים בירושלים",opts:["כדי לשאול מדוע יש כל כך הרבה אבנים בירושלים","כדי לקנות בית","כדי ללמוד רפואה","כדי להזמין נסיעה"],kind:"Printed comprehension · answer choices adapted",explanation:"התייר התפלא על האבנים ופנה אל הזקן בשאלה הזאת."},
      {q:"הזקן הסביר לתייר ש______.",a:"בכל הדורות באו יהודים לירושלים להתפלל ולבכות",opts:["בכל הדורות באו יהודים לירושלים להתפלל ולבכות","אין אבנים בעיר העתיקה","התייר בנה את החומה","האבנים הגיעו מן הים"],kind:"Printed completion · answer choices adapted",explanation:"הזקן מספר על יהודים שבאו לירושלים במשך הדורות."},
      {q:"איפה התפללו היהודים לפי דברי הזקן?",a:"ליד הכותל המערבי",opts:["ליד הכותל המערבי","בתחנת הרכבת","במרפאה","על החוף"],kind:"Supplemental comprehension",explanation:"הזקן אומר: להתפלל ולבכות ליד הכותל המערבי."},
      {q:"מה הרגישו עם כל דמעה?",a:"שירדה להם אבן מהלב",opts:["שירדה להם אבן מהלב","שהם בנו עוד בית","שהחומה נפלה","שהדרך נסגרה"],kind:"Supplemental comprehension",explanation:"המשפט האחרון של הזקן משתמש בביטוי ירדה להם אבן מהלב."}
    ]
  },
  {
    id:"lilmod-3-anywhere",title:"בכל מקום אפשר ללמוד עברית",
    source:"ללמוד עברית ברמה ב׳ • unit 3 • PDF pages 35–36 (printed pages 31–32) • original reading excerpt; printed questions adapted to answer choices; supplemental comprehension labeled",
    he:"לאולפן באים כדי ללמוד עברית, אבל גם מחוץ לכיתה אפשר ללמוד הרבה מילים חדשות.\nבחנות המכולת, למשל, שומעים הרבה משפטים כמו: \"האם הגבינה טרייה?\" \"תן לי חמש ביצים, בבקשה\", \"כבר הגיעו התפוזים?\", \"אבא שוב שכח לקנות לחם\".\nכדאי לקנות בחנות המכולת ולא בסופרמרקט, כי במכולת קל ללמוד עברית. בסופרמרקט לוקחים עגלה, מסתובבים בין המדפים, מסתכלים סביב, ושמים מצרכים בעגלה. אחר כך עומדים בתור, משלמים והולכים הביתה. כמעט לא מדברים ולא לומדים מילים חדשות.\n[…]\nכאן אפשר לפגוש הרבה אנשים מהשכונה, לשוחח אתם, להכיר אותם ואולי גם להתיידד אתם.",
    en:"People come to the ulpan to learn Hebrew, but they can learn words outside class too. A small grocery offers conversations with the shopkeeper and neighbors. In a supermarket, shoppers take a cart, move among the shelves, pay, and leave with little conversation.",
    vocab:[["מכולת","small grocery"],["סופרמרקט","supermarket"],["עגלה","cart"],["מדפים","shelves"],["לשוחח","to converse"]],
    questions:[
      {q:"איפה אפשר ללמוד עברית?",a:"באולפן וגם מחוץ לכיתה",opts:["באולפן וגם מחוץ לכיתה","רק באולפן","רק בסופרמרקט","רק בבית"],kind:"Printed comprehension · answer choices adapted",explanation:"המשפט הראשון אומר שאפשר ללמוד גם מחוץ לכיתה."},
      {q:"למה קשה ללמוד עברית בסופרמרקט?",a:"כי כמעט לא מדברים שם",opts:["כי כמעט לא מדברים שם","כי אין שם מצרכים","כי אין שם עגלות","כי כולם לומדים שם"],kind:"Printed comprehension · answer choices adapted",explanation:"בסופרמרקט עומדים בתור ומשלמים; לפי הקטע, כמעט לא מדברים."},
      {q:"איפה לוקחים עגלה ומסתובבים בין המדפים?",a:"בסופרמרקט",opts:["בסופרמרקט","בחנות המכולת","באולפן","בבית הספר"],kind:"Supplemental comprehension",explanation:"הקטע אומר במפורש: בסופרמרקט לוקחים עגלה ומסתובבים בין המדפים."},
      {q:"מה אפשר לעשות בחנות המכולת עם אנשים מהשכונה?",a:"לשוחח ולהתיידד אתם",opts:["לשוחח ולהתיידד אתם","לישון בכיתה","לנסוע ברכבת","לשחות בים"],kind:"Supplemental comprehension",explanation:"בסוף הקטע נאמר שאפשר לשוחח עם אנשים מהשכונה ואולי להתיידד אתם."},
      {q:"מה כדאי לקנות בחנות המכולת לפי הקטע?",a:"מצרכים",opts:["מצרכים","כרטיסי טיסה","ספרי לימוד","מכוניות"],kind:"Supplemental comprehension",explanation:"הקטע משווה קניית מצרכים בחנות המכולת לקנייה בסופרמרקט."}
    ]
  },
  {
    id:"lilmod-4-credulous",title:"פתי מאמין לכל דבר",
    source:"ללמוד עברית ברמה ב׳ • unit 4 • PDF pages 48–49 (printed pages 44–45) • original reading excerpt and printed completion structure; answer choices adapted; supplemental comprehension labeled",
    he:"איש אחד שאל מהשכן שלו כלים. ביום הראשון לקח ממנו מזלג, והחזיר לו שני מזלגות. ביום השני שאל ממנו סיר, והחזיר לו שני סירים. ביום השלישי לקח מהשכן קערת עץ, והחזיר לו שתי קערות. כך גם ביום הרביעי והחמישי.\nהתפלא השכן מאוד, ושאל את האיש: \"מדוע אתה מחזיר לי תמיד שניים במקום אחד?\" ענה האיש: \"אני מחזיר לך לא כלי אחד אלא שניים, מפני שכלים הם כמו בעלי חיים. כל כלי שנתת לי ילד בביתי כלי אחר, וגם הכלי החדש שייך לך.\"\nביום שישי אחרי הצהריים נכנס האיש אל השכן, וביקש ממנו מנורת כסף לשבת. נתן לו השכן את מנורת הכסף, ושמח, מפני שחשב שהאיש יחזיר לו שתי מנורות.\nביום ראשון לא החזיר האיש את המנורה. כאשר ביקש השכן את המנורה, אמר האיש שהיא מתה. צחק השכן ואמר: \"האם אתה חושב שאני טיפש? מדוע אתה מספר לי דברים כאלה? במנורה אין חיים, ולכן אינה יכולה למות!\"\nהשיב האיש: \"האמנת שמזלג, סיר וקערה יכולים ללדת. מדוע אינך מאמין שמנורה יכולה למות?\"",
    en:"A man borrowed utensils from his neighbor and returned two for every one, claiming the utensils had children. The neighbor then lent him a silver lamp, expecting two lamps back. When the borrower said the lamp had died, he pointed out that the neighbor had believed the earlier claim.",
    vocab:[["מזלג","fork"],["סיר","pot"],["קערת עץ","wooden bowl"],["מנורת כסף","silver lamp"],["מאמין","believes"]],
    questions:[
      {q:"השכן חשב שהאיש יחזיר לו שתי מנורות, כי ______.",a:"הוא החזיר שני כלים בכל פעם לפני כן",opts:["הוא החזיר שני כלים בכל פעם לפני כן","המנורה הייתה שבורה","השכן קנה מנורה שנייה","המנורה הייתה עשויה עץ"],kind:"Printed completion · answer choices adapted",explanation:"לפני המנורה החזיר האיש שני מזלגות, שני סירים ושתי קערות במקום אחד."},
      {q:"ביום הראשון, מה שאל האיש מן השכן?",a:"מזלג",opts:["מזלג","סיר","קערת עץ","מנורת כסף"],kind:"Supplemental comprehension",explanation:"המשפט הראשון מציין מזלג."},
      {q:"מה שאל האיש ביום השני?",a:"סיר",opts:["סיר","מזלג","קערת עץ","מנורה"],kind:"Supplemental comprehension",explanation:"ביום השני שאל ממנו סיר והחזיר שני סירים."},
      {q:"מה לקח האיש מהשכן ביום השלישי?",a:"קערת עץ",opts:["קערת עץ","מנורת כסף","סיר","ספר"],kind:"Supplemental comprehension",explanation:"ביום השלישי לקח מהשכן קערת עץ."},
      {q:"למה שמח השכן כשנתן לאיש את מנורת הכסף?",a:"כי חשב שיקבל שתי מנורות",opts:["כי חשב שיקבל שתי מנורות","כי האיש שילם לו כסף","כי רצה למסור אותה במתנה","כי קיבל סיר חדש"],kind:"Supplemental comprehension",explanation:"הוא חשב שהאיש יחזיר לו שתי מנורות, כמו שעשה עם הכלים האחרים."},
      {q:"מה אמר השכן על המנורה?",a:"אין בה חיים ולכן אינה יכולה למות",opts:["אין בה חיים ולכן אינה יכולה למות","היא ילדה מנורה חדשה","היא נשברה ביום הראשון","היא שייכת לרופא"],kind:"Supplemental comprehension",explanation:"השכן טען במפורש: במנורה אין חיים, ולכן אינה יכולה למות."}
    ]
  },
  {
    id:"lilmod-5-mothers-medicine",title:"התרופה הטובה של אמא",
    source:"ללמוד עברית ברמה ב׳ • unit 5 • PDF page 61 (printed page 57) reading; printed questions on PDF page 62 (printed page 58), answer choices adapted; other questions supplemental",
    he:"הלכתי לקופת חולים כדי לקבל תוצאות של בדיקת דם. בחדר ההמתנה ישבו כבר עשרה אנשים וחיכו בתור. גם אני ישבתי וחיכיתי אתם.\nהאנשים דיברו. ועל מה מדברים במקום כזה? על מחלות, כמובן. זה מספר על כאב בטן, זו אומרת שיש לה חום גבוה, ואחר מספר על שפעת קשה. וכך סיפר כל אחד בקול עצוב על הבעיות שלו.\nפתאום אמרה אישה זקנה: \"למה אתם עצובים כל כך? אפשר לחשוב שאתם הולכים למות. לי יש באמת מחלה רצינית - ואני שותקת. אני חולה במחלת לב קשה, ואני צריכה לעבור ניתוח בבית חולים\". כאשר שמעו את דברי הזקנה - הפסיקו לדבר על מחלות.\nכעבור שעה הגיע התור שלי, ונכנסתי לרופא. סיפרתי לו על שיחת החולים ועל האישה הזקנה. הרופא שמע את הסיפור ופרץ בצחוק. הוא אמר: \"שוב אמא שלי! כל בוקר היא יושבת בין החולים, ומספרת להם על מחלת הלב שלה. אין לה בכלל מחלת לב. היא בריאה לגמרי. היא מספרת זאת, כי היא רוצה שאנשים לא ידברו על המחלות שלהם.\"",
    en:"At the clinic, patients discussed their illnesses. An elderly woman claimed to have a severe heart disease, and the others stopped talking about their own troubles. The doctor laughed: she was his healthy mother, trying to quiet the patients.",
    vocab:[["קופת חולים","health clinic"],["חדר ההמתנה","waiting room"],["שותקת","is silent"],["מחלת לב","heart disease"]],
    questions:[
      {q:"האישה הזקנה רוצה שאנשים לא ידברו על המחלות שלהם, ולכן ______.",a:"היא מספרת להם על מחלת הלב שלה",opts:["היא מספרת להם על מחלת הלב שלה","היא עוזבת את חדר ההמתנה","היא נותנת להם תרופות","היא שואלת על בדיקת דם"],kind:"Printed comprehension · answer choices adapted",explanation:"בסוף הקריאה הרופא מסביר שאמו מספרת על מחלת הלב כדי שיפסיקו לדבר על מחלותיהם."},
      {q:"למה צחק הרופא?",a:"כי האישה היא אמו הבריאה",opts:["כי האישה היא אמו הבריאה","כי תוצאות הבדיקה אבדו","כי לא היו חולים בחדר","כי מישהו קנה תרופות"],kind:"Printed comprehension · answer choices adapted",explanation:"הרופא אומר שאמו יושבת בין החולים אבל אין לה מחלת לב; היא בריאה לגמרי."},
      {q:"למה הלך המספר לקופת חולים?",a:"כדי לקבל תוצאות של בדיקת דם",opts:["כדי לקבל תוצאות של בדיקת דם","כדי לבקר את אמו","כדי לקנות תרופות","כדי לעבוד שם"],kind:"Supplemental comprehension",explanation:"המשפט הראשון אומר: כדי לקבל תוצאות של בדיקת דם."},
      {q:"כמה אנשים ישבו בחדר ההמתנה?",a:"עשרה",opts:["עשרה","שניים","חמישה","שלושים"],kind:"Supplemental comprehension",explanation:"בקריאה כתוב שבחדר ההמתנה ישבו כבר עשרה אנשים."},
      {q:"על מה דיברו האנשים בחדר ההמתנה?",a:"על מחלות",opts:["על מחלות","על נסיעות","על ספורט","על מוזיקה"],kind:"Supplemental comprehension",explanation:"המספר שואל על מה מדברים במקום כזה ומשיב: על מחלות."},
      {q:"מה עשו החולים אחרי ששמעו את דברי הזקנה?",a:"הפסיקו לדבר על מחלות",opts:["הפסיקו לדבר על מחלות","הלכו הביתה","התחילו לשיר","קראו עיתונים"],kind:"Supplemental comprehension",explanation:"הקריאה אומרת במפורש: הפסיקו לדבר על מחלות."}
    ]
  },
  {
    id:"lilmod-6-sherlock-holmes",title:"שרלוק הולמס",
    source:"ללמוד עברית ברמה ב׳ • unit 6 • PDF page 73 (printed page 69) • original reading excerpt; supplemental comprehension adapted for practice",
    he:"שרלוק הולמס הוא בלש אנגלי מפורסם. הוא אמר שהבגדים וצורת הדיבור של האנשים מספרים לו מאין הם ומה המקצוע שלהם. את הסיפורים על שרלוק הולמס כתב הסופר קונן דויל.\nפעם נסע הסופר במונית לבית מלון בפריס. המונית נעצרה לפני פתח המלון, וכאשר שילם דויל לנהג המונית, שמע אותו אומר: \"תודה רבה, מר דויל\".\n\"איך הכרת אותי?\" התפלא הסופר.\n\"הדבר פשוט מאוד\", ענה הנהג. \"קראתי בעיתונים שהגעת היום מאיטליה. לפי הבגדים ולפי המבטא שלך אפשר לדעת כי אתה אנגלי. את סוג הנעליים שלך אפשר לקנות רק בלונדון. הסתפרת לא מזמן, ואני בטוח כי הספר הוא איטלקי\".\n\"נפלא!\" קרא הסופר. \"האם הייתה לך הוכחה נוספת?\"\n\"כן\", השיב הנהג. \"השם שלך כתוב על המזוודה.\"",
    en:"Conan Doyle, the author of Sherlock Holmes, arrived at a Paris hotel by taxi. The driver recognized him and listed clever clues from his clothes, accent, and arrival from Italy, then admitted that Doyle's name was on his suitcase.",
    vocab:[["בלש","detective"],["מונית","taxi"],["מבטא","accent"],["מזוודה","suitcase"]],
    questions:[
      {q:"מי כתב את הסיפורים על שרלוק הולמס?",a:"קונן דויל",opts:["קונן דויל","נהג המונית","שרלוק הולמס","דוקטור ווטסון"],kind:"Supplemental comprehension",explanation:"הפתיחה אומרת שאת הסיפורים כתב הסופר קונן דויל."},
      {q:"איך נסע הסופר אל המלון?",a:"במונית",opts:["במונית","ברכבת","באוטובוס","באופניים"],kind:"Supplemental comprehension",explanation:"בקריאה כתוב: נסע הסופר במונית לבית מלון בפריס."},
      {q:"מאיזו ארץ הגיע דויל לפי העיתונים?",a:"מאיטליה",opts:["מאיטליה","מישראל","מגרמניה","מצרפת"],kind:"Supplemental comprehension",explanation:"הנהג אומר שקרא בעיתונים שדויל הגיע מאיטליה."},
      {q:"מה אמר הנהג על הספר של דויל?",a:"שהוא איטלקי",opts:["שהוא איטלקי","שהוא אנגלי","שהוא צרפתי","שהוא בלש"],kind:"Supplemental comprehension",explanation:"הנהג מדבר על הספר שסיפר את שערו של דויל, לא על הסופר עצמו: הספר הוא איטלקי."},
      {q:"איך באמת ידע הנהג את שמו של הסופר?",a:"השם היה כתוב על המזוודה",opts:["השם היה כתוב על המזוודה","השם היה כתוב על המונית","הסופר אמר לו","שרלוק הולמס סיפר לו"],kind:"Supplemental comprehension",explanation:"בסוף הסיפור הנהג מגלה: השם שלך כתוב על המזוודה."}
    ]
  },
  {
    id:"lilmod-7-transport",title:"סוס וחמור - כלי תחבורה",
    source:"ללמוד עברית ברמה ב׳ • unit 7 • PDF page 86 (printed page 82) original reading excerpt; printed comprehension on printed page 83, adapted to choices",
    he:"למשל, עד סוף המאה ה־19 השתמשו בסוסים ובחמורים כדי לעבור ממקום למקום. כבישים לא היו, כמובן, והדרכים היו צרות מאוד. הנסיעה מיפו לירושלים נמשכה שש עשרה שעות, ומירושלים לצפת נסעו חמישה ימים, ולכן היו מוכרחים לעצור בדרך. הטורקים ששלטו אז בארץ, בנו בתי מלון (חאן). שם אפשר היה לנוח, לאכול ולהאכיל את הסוסים.\nאף אחד לא האמין שבתוך פחות ממאה שנה יהיו כבישים רחבים ורכבות מהירות.\nהיום נמשכת הנסיעה ברכבת מתל־אביב לחיפה כשעה. במכונית הנוסעת בכביש המהיר, מגיעים מירושלים לתל־אביב בתוך 45 דקות. במקום חאן בונים תחנות דלק, ובמקום להשתמש בבעלי חיים משתמשים באוטובוסים ובמכוניות. אבל מחיר הדלק עולה כל הזמן, ובוודאי יעלה גם בעתיד, ואולי בעוד זמן לא רב נהיה מוכרחים לשוב לסוס ולחמור.",
    en:"The reading contrasts slow journeys by horse and donkey with trains, cars, and highways. Inns served travelers and horses. Modern journeys are faster, but the rising cost of fuel leads to a playful suggestion of returning to horse and donkey.",
    vocab:[["סוסים","horses"],["חמורים","donkeys"],["חאן","inn"],["דלק","fuel"]],
    questions:[
      {q:"הנסיעה לירושלים נמשכה זמן רב, מפני ש______.",a:"הדרכים היו צרות ולא היו כבישים",opts:["הדרכים היו צרות ולא היו כבישים","הרכבת נסעה לאט","מחיר הדלק היה גבוה","הנוסעים חיכו למטוס"],kind:"Printed comprehension · answer choices adapted",explanation:"בקריאה נאמר שלא היו כבישים והדרכים היו צרות מאוד."},
      {q:"הטורקים ששלטו אז בארץ בנו בתי מלון. מדוע?",a:"כדי שהנוסעים יוכלו לנוח, לאכול ולהאכיל את הסוסים",opts:["כדי שהנוסעים יוכלו לנוח, לאכול ולהאכיל את הסוסים","כדי למכור מכוניות","כדי לבנות רכבות","כדי ללמד נהיגה"],kind:"Printed comprehension · answer choices adapted",explanation:"אחרי תיאור החאן כתוב: שם אפשר היה לנוח, לאכול ולהאכיל את הסוסים."},
      {q:"״אולי בעוד זמן לא רב נהיה מוכרחים לשוב לסוס ולחמור״ - מדוע?",a:"כי מחיר הדלק עולה כל הזמן",opts:["כי מחיר הדלק עולה כל הזמן","כי אין עוד כבישים","כי רכבות אינן קיימות","כי הסוסים מהירים ממכוניות"],kind:"Printed comprehension · answer choices adapted",explanation:"המשפט הקודם אומר שמחיר הדלק עולה כל הזמן ואולי יעלה גם בעתיד."},
      {q:"כמה זמן נמשכה הנסיעה מיפו לירושלים בסיפור?",a:"שש עשרה שעות",opts:["שש עשרה שעות","45 דקות","חמישה ימים","שעה אחת"],kind:"Supplemental comprehension",explanation:"הקריאה אומרת: הנסיעה מיפו לירושלים נמשכה שש עשרה שעות."},
      {q:"מה החליף את החאן בהשוואה של הקטע?",a:"תחנות דלק",opts:["תחנות דלק","בתי ספר","מרפאות","ספריות"],kind:"Supplemental comprehension",explanation:"הקטע אומר במפורש: במקום חאן בונים תחנות דלק."}
    ]
  },
  {
    id:"lilmod-8-swedish-ad",title:"השודדת הבלונדינית",
    source:"ללמוד עברית ברמה ב׳ • unit 8 • PDF page 99 (printed page 95) original reading and advertisement; printed questions on PDF page 100 (printed page 96), adapted to choices",
    he:"באחד מעיתוני שוודיה התפרסמה המודעה הזאת:\nיורשת עשירה, צעירה, יפה וביישנית, מחפשת בחור נאה, משכיל ורציני - לנישואין\nמאות גברים צעירים ענו לבחורה.\nאחרי התכתבות ארוכה כתבה היורשת הבלונדינית מכתב לכל אחד: \"אני מעוניינת לפגוש אותך. אני אבוא אליך לשטוקהולם. יש לי רק בקשה אחת - האם אתה יכול לשלוח לי חצי מדמי הנסיעה ברכבת מן העיר שלי לשטוקהולם? אני רוצה להיות בטוחה שאתה מעוניין בי ולא בעושר שלי.\"\nהגברים הסכימו לבקשה זו, וכולם שלחו את כל דמי הנסיעה. ביום הפגישה חיכו באחת מתחנות הרכבת של שטוקהולם כ־250 גברים צעירים. הם חיכו לבלונדינית העשירה, אך היא לא הגיעה. היא קיבלה את מה שהיא רצתה: אלפי קרונות (=מטבע שוודי) של דמי הנסיעה.",
    en:"A Swedish newspaper carried a marriage advertisement. A woman corresponded with many young men and asked each for half a train fare as proof of interest. They sent the full fare and waited at the station; she never appeared and kept the money.",
    vocab:[["מודעה","advertisement"],["התכתבות","correspondence"],["דמי נסיעה","fare"],["עושר","wealth"]],
    questions:[
      {q:"״מאות גברים ענו למודעה.״ מדוע?",a:"כי המודעה תיארה יורשת עשירה המחפשת בן זוג",opts:["כי המודעה תיארה יורשת עשירה המחפשת בן זוג","כי ביקשו מהם לקנות רכבת","כי כולם גרו באותו בית","כי המודעה הציעה עבודה"],kind:"Printed comprehension · answer choices adapted",explanation:"המודעה מציגה יורשת עשירה, צעירה ויפה המחפשת בחור לנישואין."},
      {q:"״הגברים הסכימו לבקשה זו.״ לאיזו בקשה?",a:"לשלוח לה כסף לדמי הנסיעה ברכבת",opts:["לשלוח לה כסף לדמי הנסיעה ברכבת","לקנות לה מכונית","לכתוב מודעה חדשה","לנסוע לעיר אחרת"],kind:"Printed comprehension · answer choices adapted",explanation:"במכתב היא ביקשה חצי מדמי הנסיעה ברכבת; אחר כך הגברים שלחו את כל דמי הנסיעה."},
      {q:"מדוע הייתה הצעירה מעוניינת בהתכתבות ארוכה עם הגברים הצעירים?",a:"כדי לקבל דמי נסיעה מרבים מהם",opts:["כדי לקבל דמי נסיעה מרבים מהם","כדי ללמוד עברית","כדי למצוא עבודה","כדי לבקר את כולם"],kind:"Printed comprehension · answer choices adapted",explanation:"סוף הסיפור מגלה שהיא לא באה וקיבלה אלפי קרונות מדמי הנסיעה."},
      {q:"באיזה מקום התפרסמה המודעה?",a:"בעיתון בשוודיה",opts:["בעיתון בשוודיה","בתחנת הרכבת","בבית ספר","במכתב פרטי"],kind:"Supplemental comprehension",explanation:"הקריאה נפתחת במילים: באחד מעיתוני שוודיה התפרסמה המודעה."},
      {q:"כמה גברים חיכו בתחנת הרכבת?",a:"כ־250",opts:["כ־250","עשרה","חמישים","אלף"],kind:"Supplemental comprehension",explanation:"בסוף הקריאה כתוב שכ־250 גברים צעירים חיכו בתחנת הרכבת."}
    ]
  },
  {
    id:"lilmod-9-school-on-wheels",title:"בית ספר על גלגלים",
    source:"ללמוד עברית ברמה ב׳ • unit 9 • PDF page 109 (printed page 105) • original reading excerpts; printed comprehension on PDF page 110 (printed page 106), adapted to choices",
    he:"לא בכל מדינה אפשר ללמד את כל התושבים לקרוא ולכתוב. חלק מתושבי העולם חיים ביערות או במדבריות, וצורת החיים שלהם לא השתנתה במשך אלפי שנים. במדבריות אוסטרליה, למשל, יש עדיין כמה שבטים שקשה להגיע אליהם, מפני שהם נודדים ממקום למקום. ממשלת אוסטרליה החליטה ללמד אותם, ופתחה בית ספר באמצע המדבר.\nבית הספר נמצא בארבע מכוניות גדולות, והילדים מגיעים אליו ברגל. הם אינם מביאים אתם ספרים, מחברות או אוכל, ובית הספר נותן להם הכול. פעם בשבועיים מגיעה למקום מכונית שמביאה מחברות, עפרונות, מזון ותרופות.\nכל בוקר חייבים הילדים להתרחץ לפני תחילת הלימודים. בכיתות לומדים ילדים וילדות מכל הגילים. אפשר לראות בכיתה אחת ילדים בני עשר ונערות בגיל חמש עשרה–שש עשרה.\nהאם יש איחורים או חיסורים? ״כן״ אומרת המנהלת, ״אבל תמיד יש סיבות רציניות לכך. כאשר ילד לא בא לבית הספר, אני יודעת שקרה משהו: או שנחש הכיש אותו בדרך, או שלא יכול היה לעבור את הנחל, מפני שהיו בו תנינים רבים.״",
    en:"In the Australian desert, a school in four large vehicles serves children who arrive on foot. It provides supplies and food. The children wash before lessons and study in mixed age classes. A teacher describes dangers that may keep a child from school.",
    vocab:[["מדבר","desert"],["מחברות","notebooks"],["להתרחץ","to wash oneself"],["תנינים","crocodiles"]],
    questions:[
      {q:"ממשלת אוסטרליה שלחה את המכוניות למדבר כדי לעשות מה?",a:"ללמד את הילדים",opts:["ללמד את הילדים","לקנות רכבות","לבנות תחנת דלק","לחפש מטבעות"],kind:"Printed comprehension · answer choices adapted",explanation:"הקטע אומר שהממשלה החליטה ללמד את הילדים ופתחה בית ספר באמצע המדבר."},
      {q:"כיצד הילדים מגיעים אל בית הספר?",a:"ברגל",opts:["ברגל","ברכבת","במטוס","באונייה"],kind:"Supplemental comprehension",explanation:"המשפט על ארבע המכוניות מוסיף: הילדים מגיעים אליו ברגל."},
      {q:"מי נותן לילדים ספרים, מחברות ואוכל?",a:"בית הספר",opts:["בית הספר","ההורים","הילדים עצמם","נהג הרכבת"],kind:"Supplemental comprehension",explanation:"כתוב שהילדים אינם מביאים את הדברים האלה ובית הספר נותן להם הכול."},
      {q:"כל כמה זמן מגיעה מכונית עם מחברות, מזון ותרופות?",a:"פעם בשבועיים",opts:["פעם בשבועיים","פעמיים ביום","פעם בשנה","בכל שעה"],kind:"Supplemental comprehension",explanation:"הקריאה אומרת: פעם בשבועיים מגיעה למקום מכונית."},
      {q:"מה הילדים חייבים לעשות לפני תחילת הלימודים?",a:"להתרחץ",opts:["להתרחץ","לנסוע ברכבת","לקנות עיתון","לכתוב מכתב"],kind:"Printed comprehension · answer choices adapted",explanation:"הקטע אומר: כל בוקר חייבים הילדים להתרחץ לפני תחילת הלימודים."},
      {q:"מה מיוחד בהרכב הגילים בכיתה?",a:"לומדים בה ילדים וילדות בגילים שונים",opts:["לומדים בה ילדים וילדות בגילים שונים","לומדים בה רק בני עשר","לומדים בה רק מבוגרים","אין בה תלמידים"],kind:"Supplemental comprehension",explanation:"הקטע מתאר ילדים בני עשר ונערות בנות חמש עשרה עד שש עשרה באותה כיתה."},
      {q:"לפי המורה, מה עלול למנוע מילד לעבור את הנחל?",a:"תנינים רבים",opts:["תנינים רבים","רכבות מהירות","תחנת דלק","תור ארוך"],kind:"Printed comprehension · answer choices adapted",explanation:"המורה אומרת שלא יכול היה לעבור את הנחל מפני שהיו בו תנינים רבים."},
      {q:"הבדווים ____ ממקום למקום.",a:"נודדים",opts:["נודדים","נמצאים","נותנים","מתרחצים"],kind:"Printed fill-in · PDF 118, answer choices adapted",explanation:"הקריאה מסבירה שהשבטים נודדים ממקום למקום; לכן נודדים משלים את משפט המקור."},
      {q:"הילד לא בא לבית הספר, מפני ש____ הכיש אותו.",a:"נחש",opts:["נחש","תנין","מורה","רופא"],kind:"Printed fill-in · PDF 118, answer choices adapted",explanation:"המנהלת מתארת אפשרות שנחש הכיש את הילד בדרך."},
      {q:"בית הספר ____ בארבע מכוניות.",a:"נמצא",opts:["נמצא","נודד","נותן","מגלה"],kind:"Printed fill-in · PDF 118, answer choices adapted",explanation:"בקריאה: בית הספר נמצא בארבע מכוניות גדולות."},
      {q:"בית הספר ____ לילדים מחברות.",a:"נותן",opts:["נותן","מוצא","מכיש","שוכח"],kind:"Printed fill-in · PDF 118, answer choices adapted",explanation:"הילדים אינם מביאים מחברות; בית הספר נותן להם הכול."},
      {q:"הילדים מתרחצים ____ תחילת הלימודים.",a:"לפני",opts:["לפני","אחרי","בגלל","עד"],kind:"Printed fill-in · PDF 118, answer choices adapted",explanation:"הקטע קובע שהם מתרחצים לפני תחילת הלימודים."},
      {q:"תמיד יש סיבה ____ לאיחורים.",a:"רצינית",opts:["רצינית","גדול","מהירים","ישן"],kind:"Printed fill-in · PDF 118, answer choices adapted",explanation:"המנהלת אומרת שיש סיבות רציניות לאיחורים או לחיסורים; ביחיד סיבה רצינית."}
    ]
  },
  {
    id:"lilmod-10-western-wall-legend",title:"כך נתגלה הכותל המערבי — אגדה",
    source:"ללמוד עברית ברמה ב׳ • unit 10 • PDF page 119 (printed page 115) • original legend excerpts; printed comprehension on PDF page 120 (printed page 116), adapted to choices; presented as a legend",
    he:"בשנת 1517 כבשו הטורקים את ארץ ישראל. בראש הצבא הטורקי עמד הסולטן סולימן. האגדה מספרת שסולימן הוא שחשף את הכותל המערבי, שעד אז היה מכוסה עפר.\nכאשר שכב בחדרו, הגיע לאפו ריח רע. הוא הסתכל החוצה, וראה ערמות אשפה ענקיות. באותו רגע התקרבו שתי נשים זקנות אל המקום, ושפכו אשפה על אחת הערמות.\nקרא לנשים הזקנות וצעק עליהן: ״מה אתן עושות!? אתן שופכות אשפה ליד המסגד הקדוש!״ הנשים עמדו ושתקו.\n״מתחת לערמות קבורה חומת המקדש היהודי. הרומאים הרסו את ירושלים, ורצו לשפוך אשפה במקום הזה, כי הם רצו שאנשים ישכחו את המקדש.״\nהסולטן החליט לחשוף את החומה. מה עשה? הוא פיזר מטבעות זהב על ערמות האשפה. בבוקר אספו האנשים את מטבעות הזהב הנוצצים, והתחילו לחפור כדי למצוא מטבעות נוספים. כל לילה פיזר סולימן כסף, וכל בוקר חפרו האנשים. כך חפרו וחפרו, עד שחשפו את הכותל.",
    en:"In the textbook's legend, Sultan Suleiman finds piles of refuse near a holy site. He is told that a wall lies underneath. He scatters coins so people will dig through the piles, and the Wall is uncovered. This is the story told by the book, not a claim of verified history.",
    vocab:[["האגדה","the legend"],["ערמות אשפה","piles of refuse"],["מטבעות","coins"],["לחשוף","to uncover"]],
    questions:[
      {q:"לפי האגדה, מי חשף את הכותל המערבי?",a:"סולימן",opts:["סולימן","קולומבוס","הרומאים","נהג המונית"],kind:"Supplemental comprehension",explanation:"משפט הפתיחה מייחס את חשיפת הכותל לסולימן, בתוך האגדה."},
      {q:"מה ראה הסולטן כשהסתכל החוצה?",a:"ערמות אשפה ענקיות",opts:["ערמות אשפה ענקיות","מטבעות כסף","ספרי לימוד","חומות חדשות"],kind:"Supplemental comprehension",explanation:"בקטע כתוב שהוא הסתכל החוצה וראה ערמות אשפה ענקיות."},
      {q:"מה עשו שתי הנשים הזקנות?",a:"שפכו אשפה",opts:["שפכו אשפה","חפרו באדמה","אספו מטבעות","בנו חומה"],kind:"Supplemental comprehension",explanation:"שתי הנשים התקרבו ושפכו אשפה על אחת הערמות."},
      {q:"מדוע התרגז הסולטן על הנשים?",a:"כי הן שפכו אשפה ליד המסגד",opts:["כי הן שפכו אשפה ליד המסגד","כי הן לקחו את המטבעות","כי הן סגרו את השער","כי הן לא למדו עברית"],kind:"Printed comprehension · answer choices adapted",explanation:"הסולטן צעק שהן שופכות אשפה ליד המסגד הקדוש."},
      {q:"לפי ההסבר באגדה, מה היה קבור מתחת לערמות?",a:"חומת המקדש היהודי",opts:["חומת המקדש היהודי","תחנת רכבת","ספרייה","מטמון של הרומאים"],kind:"Supplemental comprehension",explanation:"הדברים שנאמרים לסולטן הם שמתחת לערמות קבורה חומת המקדש היהודי."},
      {q:"מה פיזר הסולטן על ערמות האשפה?",a:"מטבעות זהב",opts:["מטבעות זהב","ספרים","מזון","אבנים"],kind:"Printed comprehension · answer choices adapted",explanation:"הקריאה אומרת שהסולטן פיזר מטבעות זהב על ערמות האשפה."},
      {q:"מדוע התחילו האנשים לחפור?",a:"כדי למצוא מטבעות נוספים",opts:["כדי למצוא מטבעות נוספים","כדי לשתול עצים","כדי לבנות מכוניות","כדי להסתתר"],kind:"Supplemental comprehension",explanation:"אחרי שאספו את המטבעות הנוצצים, הם חפרו כדי למצוא מטבעות נוספים."},
      {q:"מה חשפו האנשים בסוף האגדה?",a:"את הכותל",opts:["את הכותל","בית ספר","רכבת","נחל"],kind:"Printed comprehension · answer choices adapted",explanation:"המשפט האחרון אומר: כך חפרו וחפרו, עד שחשפו את הכותל."},
      {q:"הסולטן פיזר מטבעות, ____ רצה לחשוף את הכותל.",a:"כי",opts:["כי","לכן","אבל","עד"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"כי נותן את הסיבה לפיזור המטבעות: רצונו לחשוף את הכותל."},
      {q:"הסולטן ראה ערמות אשפה ____.",a:"ענקיות",opts:["ענקיות","עתיקים","קטן","שקטים"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"בקריאה כתוב שראה ערמות אשפה ענקיות; התואר מתאים לערמות בלשון נקבה רבות."},
      {q:"הטורקים ____ את א״י בשנת אלף חמש מאות ושבע עשרה.",a:"כבשו",opts:["כבשו","חשפו","שתקו","פיזרו"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"פתיחת סיפור המקור אומרת: בשנת 1517 כבשו הטורקים את ארץ ישראל."},
      {q:"האנשים המשיכו לחפור באשפה ____ הם חשפו את הכותל.",a:"עד ש",opts:["עד ש","לפני ש","מפני ש","אף על פי ש"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"עד ש מציין את נקודת הסיום: חפרו עד שחשפו את הכותל."},
      {q:"חומת המקדש ____ קבורה כאן.",a:"היהודי",opts:["היהודי","היהודית","הגדולים","החדש"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"הקריאה מדברת על חומת המקדש היהודי; היהודי מתאר את המקדש."},
      {q:"האנשים אספו את מטבעות הזהב ____.",a:"הנוצצים",opts:["הנוצצים","הנוצצות","הנוצץ","נוצץ"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"בקריאה המטבעות הם הנוצצים; התואר מתאים למטבעות רבים ומיודעים."},
      {q:"הרומאים ____ הרסו את ירושלים ____ לשפוך כאן אשפה.",a:"ש / רצו",opts:["ש / רצו","ה / קברו","אחרי / חשפו","כי / קברו"],kind:"Printed fill-in · PDF 127, answer choices adapted",explanation:"הצירוף מן הסיפור הוא הרומאים שהרסו את ירושלים רצו לשפוך כאן אשפה. המקור מבקש להשלים שני מקומות."}
    ]
  },
  {
    id:"lilmod-11-dangerous-trip",title:"טיול מסוכן",
    source:"ללמוד עברית ברמה ב׳ • unit 11 • PDF pages 132–133 (printed pages 128–129) • original reading excerpt; printed comprehension PDF 132 and multiple-choice PDF 140 adapted to choices",
    he:"יותר ויותר תיירים מעוניינים לבקר במקומות מיוחדים בעולם. בעבר נסעו בעיקר לאירופה ולאמריקה הצפונית, היום רוצים אנשים רבים לבקר באפריקה, באוסטרליה או באמריקה הדרומית. הם חושבים שזה מעניין יותר.\nחברת נסיעות גרמנית ארגנה ביקור אצל שבטי קניבלים בגיניאה החדשה. לטיול יצאו גם נשים וילדים. אנשי השבט הראו לתיירים את כפרם, רקדו לכבודם, ואף הגישו להם לארוחה בשר צלוי. התיירים נהנו מאוד מביקורם בכפר, והבטיחו שיחזרו בשנה הבאה. (המארגנים לא גילו לתיירים שבני השבט הפסיקו לאכול בשר אדם, והתחילו לגדל חזירים).\n״בילוי״ אחר מציעה חברת נסיעות קנדית. היא מביאה תייר בודד לאי שאין בו אנשים. התייר צריך לדאוג לעצמו: הוא צריך למצוא מים ומזון ואף לבנות בעצמו את ביתו. רק אם התייר יחשוב שהחיים שלו בסכנה, הוא יכול לבקש מאנשי החברה שיעזרו לו. מספר התיירים הרוצים לצאת אל האי גדול ממספר האנשים שהחברה יכולה לשלוח במשך עשר השנים הבאות.",
    en:"The textbook describes unusual tourist trips: a visit to a New Guinea village and a solo island stay. On the island the tourist must find food and water and build shelter; the company provides help only if the tourist believes his life is in danger.",
    vocab:[["תיירים","tourists"],["שבט","tribe"],["אי בודד","isolated island"],["סכנה","danger"]],
    questions:[
      {q:"לאילו מקומות רוצים תיירים רבים לנסוע היום?",a:"לאפריקה, לאוסטרליה או לאמריקה הדרומית",opts:["לאפריקה, לאוסטרליה או לאמריקה הדרומית","רק לאירופה","רק לאמריקה הצפונית","רק לירושלים"],kind:"Printed comprehension · adapted choices",explanation:"הפתיחה משווה את היעדים בעבר עם אפריקה, אוסטרליה ואמריקה הדרומית כיום."},
      {q:"מה עשו אנשי השבט לכבוד התיירים?",a:"הראו להם את הכפר ורקדו",opts:["הראו להם את הכפר ורקדו","סגרו את הכפר","לימדו אותם לנהוג","שלחו אותם לאי"],kind:"Supplemental comprehension",explanation:"בקטע כתוב: אנשי השבט הראו לתיירים את כפרם ורקדו לכבודם."},
      {q:"מה הפסיקו בני השבט לאכול, לפי הסוגריים בסיפור?",a:"בשר אדם",opts:["בשר אדם","ירקות","לחם","אורז"],kind:"Supplemental comprehension",explanation:"המידע בסוגריים אומר שבני השבט הפסיקו לאכול בשר אדם והתחילו לגדל חזירים."},
      {q:"לאן מביאה החברה הקנדית תייר בודד?",a:"לאי שאין בו אנשים",opts:["לאי שאין בו אנשים","לבית מלון בעיר","לכפר מלא אנשים","לבית ספר"],kind:"Supplemental comprehension",explanation:"המשפט על החברה הקנדית אומר שהיא מביאה אותו לאי שאין בו אנשים."},
      {q:"מה התייר צריך למצוא בעצמו?",a:"מים ומזון",opts:["מים ומזון","ספרים ועיתונים","מטבעות זהב","כרטיסי רכבת"],kind:"Supplemental comprehension",explanation:"התייר צריך למצוא מים ומזון ואף לבנות בעצמו את ביתו."},
      {q:"מתי התייר יכול לבקש עזרה מהחברה?",a:"אם יחשוב שחייו בסכנה",opts:["אם יחשוב שחייו בסכנה","בכל ארוחת בוקר","כשהוא קונה מתנה","לפני כל טיול"],kind:"Supplemental comprehension",explanation:"רק אם התייר יחשוב שהחיים שלו בסכנה הוא יכול לבקש עזרה."},
      {q:"מה גדול ממספר המקומות שהחברה יכולה לספק בעשר השנים הבאות?",a:"מספר התיירים שרוצים לצאת אל האי",opts:["מספר התיירים שרוצים לצאת אל האי","מחיר המזון","מספר בתי הספר","מספר הכפרים"],kind:"Supplemental comprehension",explanation:"סוף הקטע אומר שמספר המעוניינים גדול ממספר האנשים שהחברה יכולה לשלוח."},
      {q:"לפי התרגיל המודפס, מהו המשפט הנכון על יעדי הטיול?",a:"הרבה אנשים מעוניינים לבקר היום באמריקה הדרומית.",opts:["הרבה אנשים מעוניינים לבקר היום באמריקה הדרומית.","כל האנשים רוצים לבקר רק באירופה.","אין תיירים שמעוניינים לטייל.","מעט מאוד אנשים נוסעים לאמריקה הדרומית."],kind:"Printed multiple-choice · PDF 140, adapted choices",explanation:"הפתיחה אומרת שהיום אנשים רבים רוצים לבקר גם באמריקה הדרומית."},
      {q:"מה החברה הקנדית נותנת לתייר באי?",a:"לא בית ולא מזון",opts:["לא בית ולא מזון","גם בית וגם מזון","בית אך לא מזון","מזון אך לא בית"],kind:"Printed multiple-choice · PDF 140, corrected answer",explanation:"התייר צריך למצוא מים ומזון ואף לבנות בעצמו את ביתו. לכן החברה אינה מספקת לו בית או מזון."},
      {q:"מה נכון על מספר המבקשים לנסוע לאי?",a:"החברה אינה יכולה לשלוח את כולם",opts:["החברה אינה יכולה לשלוח את כולם","אין אנשים שמעוניינים לנסוע","כולם חוזרים מיד","רק ילדים מבקשים לנסוע"],kind:"Printed multiple-choice · PDF 140, adapted wording",explanation:"מספר המעוניינים גדול ממספר האנשים שהחברה יכולה לשלוח במשך עשר השנים הבאות."}
    ]
  },
  {
    id:"lilmod-11-rich-happy",title:"עשיר ומאושר",
    source:"ללמוד עברית ברמה ב׳ • unit 11 • PDF page 142 (printed page 138) • original story excerpt; supplemental comprehension",
    he:"היה איש עשיר שהיו לו בנות רבות, אך בן זכר לא נולד לו. האיש רצה מאוד בן. הוא שאל חכמים רבים, אך העצות שלהם לא עזרו לו.\nבסוף פגש האיש איכר עני שעבד בשדה. שאל אותו: ״האם אתה מאושר?״ ענה לו האיכר: ״כן! אני מאושר! אני עובד את האדמה, מגדל לחם לי ולבני ביתי, וזה מספיק לי.״",
    en:"A wealthy man longed for a son. He met a poor farmer who said he was happy working the land and growing enough food for his household.",
    vocab:[["עשיר","wealthy"],["איכר","farmer"],["מאושר","happy"]],
    questions:[
      {q:"מה רצה האיש העשיר, על אף שהיו לו בנות רבות?",a:"בן זכר",opts:["בן זכר","עוד כסף","בית חדש","נסיעה לאי"],kind:"Supplemental comprehension",explanation:"הסיפור אומר שהיו לו בנות רבות, אך בן זכר לא נולד לו."},
      {q:"מה עשה האיכר שסיפק לו את צרכיו?",a:"עבד את האדמה וגידל לחם",opts:["עבד את האדמה וגידל לחם","שמר על כסף בבנק","נסע לאי בודד","למד בבית ספר"],kind:"Supplemental comprehension",explanation:"האיכר אומר שהוא עובד את האדמה ומגדל לחם לו ולבני ביתו."}
    ]
  },
  {
    id:"lilmod-12-colors",title:"הצבעים",
    source:"ללמוד עברית ברמה ב׳ • unit 12 • PDF page 143 (printed page 139) original reading; printed completion on PDF 144 (printed page 140), answer choices adapted",
    he:"לצבעים שונים יש השפעה על מצב רוחם ועל התנהגותם של בני אדם ושל בעלי חיים. לירוק, למשל, יש השפעה מרגיעה, לכן החליפו את הלוחות השחורים בבתי הספר בלוחות ירוקים, ובאמת, הילדים לומדים טוב יותר. משתמשים בצבעים ירוקים גם בבתי חולים ובבתי מרגוע.\nבמסעדה אחת ערכו ניסוי: צבעו את הקירות בירוק, ושמו לב כי אנשים שבאו למסעדה, נשארו לשבת גם אחרי שגמרו לאכול. פשוט היה להם נעים. אחר כך צבעו את הקירות באדום, וראו שהאורחים עזבו את המקום מיד עם סיום הארוחה. יוצא מזה שלאדום יש השפעה הפוכה, כלומר הוא מעורר, ולכן נוהגים להשתמש בו, כאשר רוצים להזהיר מפני סכנה.\nהנדסת צבעים חשובה גם בחקלאות. החקלאים נוהגים לפזר רעל בשדות כדי להרוג עכברים. רעל זה מסכן גם את הציפורים, וכדי שהן לא יאכלו את הרעל, צובעים אותו בצבעים שהן אינן אוהבות.",
    en:"The reading connects colors with mood and behavior. Green is described as calming in schools and restaurants; red encourages diners to leave sooner and can warn of danger. Farmers color poison in ways birds dislike.",
    vocab:[["השפעה","effect"],["מרגיעה","calming"],["מעורר","stimulating"],["ציפורים","birds"]],
    questions:[
      {q:"על מה יש השפעה לצבעים שונים?",a:"על מצב הרוח ועל ההתנהגות",opts:["על מצב הרוח ועל ההתנהגות","על גיל האנשים","על מחיר הספרים","על זמן הנסיעה"],kind:"Supplemental comprehension",explanation:"משפט הפתיחה מדבר על מצב רוחם והתנהגותם של בני אדם ובעלי חיים."},
      {q:"באיזה צבע החליפו את הלוחות השחורים?",a:"בירוק",opts:["בירוק","באדום","בצהוב","בשחור"],kind:"Supplemental comprehension",explanation:"הקריאה אומרת שהחליפו אותם בלוחות ירוקים."},
      {q:"מדוע נשארו האורחים לשבת אחרי הארוחה כשהקירות היו ירוקים?",a:"כי היה להם נעים",opts:["כי היה להם נעים","כי האוכל היה חינם","כי הקירות היו אדומים","כי המסעדה נסגרה"],kind:"Supplemental comprehension",explanation:"הטקסט אומר בפירוש: פשוט היה להם נעים."},
      {q:"מה עשו האורחים כשהקירות נצבעו באדום?",a:"עזבו מיד בסיום הארוחה",opts:["עזבו מיד בסיום הארוחה","נשארו זמן רב","צבעו את הקירות","חזרו לבית הספר"],kind:"Supplemental comprehension",explanation:"הקריאה מספרת שעזבו את המקום מיד עם סיום הארוחה."},
      {q:"מדוע מפזרים החקלאים רעל בשדות?",a:"כדי להרוג עכברים",opts:["כדי להרוג עכברים","כדי לצבוע קירות","כדי להכין אוכל","כדי לנקות בית ספר"],kind:"Supplemental comprehension",explanation:"בפסקה האחרונה נאמר שהחקלאים מפזרים רעל כדי להרוג עכברים."},
      {q:"מדוע צובעים החקלאים את הרעל בצבעים שהציפורים אינן אוהבות?",a:"כדי שהציפורים לא יאכלו אותו",opts:["כדי שהציפורים לא יאכלו אותו","כדי שהעכברים יראו אותו","כדי שהאנשים יאכלו אותו","כדי למכור אותו"],kind:"Supplemental comprehension",explanation:"הטקסט אומר שהרעל מסכן ציפורים ולכן צובעים אותו כדי שלא יאכלו אותו."},
      {q:"בבתי הספר החליפו את הלוחות השחורים בלוחות ירוקים, כי _____.",a:"לירוק יש השפעה מרגיעה",opts:["לירוק יש השפעה מרגיעה","אדום מרגיע את הילדים","אין לוחות שחורים","הצבעים אינם חשובים"],kind:"Printed completion · PDF 144, answer choices adapted",explanation:"הפסקה הראשונה אומרת שלירוק יש השפעה מרגיעה."},
      {q:"בבתי הספר החליפו את הלוחות השחורים בלוחות ירוקים, כדי ש_____.",a:"הילדים ילמדו טוב יותר",opts:["הילדים ילמדו טוב יותר","האורחים יעזבו מהר","הציפורים יאכלו רעל","הקירות יהיו אדומים"],kind:"Printed completion · PDF 144, answer choices adapted",explanation:"אחרי שינוי הלוחות, הקריאה אומרת שהילדים לומדים טוב יותר."},
      {q:"לאנשים שבאו למסעדה היה נעים, כי _____.",a:"הקירות היו ירוקים",opts:["הקירות היו ירוקים","האוכל היה חינם","הם היו עייפים","לא היו צבעים"],kind:"Printed completion · PDF 144, answer choices adapted",explanation:"הניסוי מתאר קירות ירוקים ואורחים שנשארו כי היה להם נעים."},
      {q:"החקלאים _____, כדי שהציפורים לא יאכלו רעל.",a:"צובעים את הרעל בצבעים שהן אינן אוהבות",opts:["צובעים את הרעל בצבעים שהן אינן אוהבות","צובעים את הציפורים","שמים רעל באוכל האנשים","משאירים את הרעל בלי צבע"],kind:"Printed completion · PDF 144, answer choices adapted",explanation:"בפסקה האחרונה הרעל נצבע בצבעים שהציפורים אינן אוהבות."}
    ]
  },
  {
    id:"lilmod-12-locker-room",title:"צבע הקירות של חדר ההלבשה",
    source:"ללמוד עברית ברמה ב׳ • unit 12 • PDF page 153 (printed page 149) • original newspaper excerpt; comprehension supplemental",
    he:"צבע חדר ההלבשה של קבוצת כדורגל יכול להיות כל ההבדל בין הצלחה לבין כישלון במשחק. צבע חדר ההלבשה של הקבוצה הביתית צריך להיות כתום או צהוב, כדי לתת לשחקנים הרגשה של אנרגיה ושל אינטליגנציה.\nמצד שני כדאי לצבוע את חדר ההלבשה של הקבוצה האורחת בשחור, בחום או בלבן: הצבע השחור יפחיד את השחקנים, הצבע החום יגרום להם להיות עצבניים, והצבע הלבן יגרום להם להרגיש בודדים.",
    en:"The article claims that locker-room colors can influence a football match. It recommends orange or yellow for the home team and says black, brown, and white may unsettle the visiting team.",
    vocab:[["חדר הלבשה","locker room"],["הצלחה","success"],["כישלון","failure"],["יפחיד","will frighten"]],
    questions:[
      {q:"על מה צבע חדר ההלבשה עשוי להשפיע, לפי הכתבה?",a:"על הצלחה או כישלון במשחק",opts:["על הצלחה או כישלון במשחק","על מחיר הכרטיסים","על מספר הכדורים","על זמן הנסיעה"],kind:"Supplemental comprehension",explanation:"הכותרת והמשפט הראשון אומרים שהצבע יכול להיות ההבדל בין הצלחה לכישלון."},
      {q:"אילו צבעים מוצעים לקבוצה הביתית?",a:"כתום או צהוב",opts:["כתום או צהוב","שחור או חום","רק אדום","רק לבן"],kind:"Supplemental comprehension",explanation:"המאמר מציע לקבוצה הביתית כתום או צהוב."},
      {q:"מה אומרת הכתבה על הצבע השחור בחדר האורחים?",a:"הוא יפחיד את השחקנים",opts:["הוא יפחיד את השחקנים","הוא ירגיע אותם","הוא יעורר התלהבות","הוא יגרום להם ללמוד"],kind:"Supplemental comprehension · corrected from scan",explanation:"במאמר כתוב במפורש: הצבע השחור יפחיד את השחקנים."}
    ]
  },
  {
    id:"ulpan-10-nahalal",title:"מושב נהלל",
    source:"אולפן עברית • First Part, lesson 10 • PDF page 105 (printed page 117) • original passage and questions; answer choices adapted",
    he:"מושב נהלל, מושב העובדים הראשון בישראל, נוסד ב-1921.\nהשם \"נהלל\" נמצא בתנ״ך (יהושע יט, טו; כא, לה)\nהמושב נמצא בצפון עמק יזרעאל.\nבמושב חיים כ-730 אנשים.\nבמושב יש בית כנסת, בתי ספר, גני ילדים, ספרייה, מרפאה, דואר, מינימרקט וברכת שחייה.\nרוב האנשים שחיים במושב עובדים בחקלאות.\nבמושב יש:\nשדות ועצים, פרות לחלב, עופות לבשר ולביצים ועוד.\nבמרכז המושב יש מסעדה גדולה ויפה.\nהאנשים שמטיילים בצפון הארץ יכולים להיכנס למסעדה, לאכול אוכל מצוין ולראות את הנוף היפה של עמק יזרעאל.",
    en:"Nahalal, the first workers' moshav in Israel, was founded in 1921. Its name appears in the Bible. It is in the north of the Jezreel Valley, with about 730 residents. The moshav has community services, and most residents work in agriculture. There is a large restaurant in its center where visitors can eat and see the valley.",
    vocab:[["מושב","moshav / cooperative village"],["נוסד","was founded"],["חקלאות","agriculture"],["עמק יזרעאל","Jezreel Valley"]],
    questions:[
      {q:"מתי נוסד המושב?",a:"ב-1921",opts:["ב-1921","ב-1948","ב-1905","ב-1967"],explanation:"בשורה הראשונה כתוב: נוסד ב-1921."},
      {q:"איפה נמצא המושב?",a:"בצפון עמק יזרעאל",opts:["בצפון עמק יזרעאל","בדרום הארץ","בירושלים","ליד אילת"],explanation:"הקטע אומר שהמושב נמצא בצפון עמק יזרעאל."},
      {q:"איפה נמצא השם ״נהלל״?",a:"בתנ״ך",opts:["בתנ״ך","בעיתון","במילון","במפה בלבד"],explanation:"השם ״נהלל״ נמצא בתנ״ך, לפי המשפט השני."},
      {q:"כמה אנשים חיים במושב?",a:"כ-730 אנשים",opts:["כ-730 אנשים","כ-73 אנשים","כ-7,300 אנשים","כ-30 אנשים"],explanation:"בקטע כתוב: במושב חיים כ-730 אנשים."},
      {q:"איפה עובדים רוב האנשים שחיים במושב?",a:"בחקלאות",opts:["בחקלאות","בבית חולים","בשדה התעופה","בבנק"],explanation:"הקטע אומר שרוב האנשים שחיים במושב עובדים בחקלאות."},
      {q:"מה יכולים לעשות אנשים שמטיילים בצפון?",a:"להיכנס למסעדה ולאכול",opts:["להיכנס למסעדה ולאכול","לנסוע ברכבת","ללמוד באוניברסיטה","ללכת לקולנוע"],explanation:"בסוף הקטע נאמר שמטיילים יכולים להיכנס למסעדה, לאכול ולראות את הנוף."}
    ]
  },
  {
    id:"shnayim-10-communication-language",title:"שפת תקשורת",
    source:"עברית בשניים לרמה ב׳ • chapter 10, שפה • PDF page 275 • textbook excerpt; comprehension choices adapted for practice",
    he:"האספרנטו לא הצליחה להיות השפה של כל העולם. היא היום שפתם של שני מיליון איש בערך. היום האנגלית היא שפת התקשורת בין עמים רבים.",
    en:"Esperanto did not succeed in becoming the language of the whole world. Today it is the language of approximately two million people. Today English is the language of communication among many peoples.",
    vocab:[["שפת תקשורת","language of communication"],["עמים","peoples"],["בערך","approximately"]],
    questions:[
      {q:"האם האספרנטו הצליחה להיות השפה של כל העולם?",a:"לא",opts:["לא","כן","רק באירופה","רק בישראל"],explanation:"הקטע אומר: האספרנטו לא הצליחה להיות השפה של כל העולם."},
      {q:"מהי היום שפת התקשורת בין עמים רבים?",a:"אנגלית",opts:["אנגלית","אספרנטו","עברית","לטינית"],explanation:"המשפט האחרון בקטע מציין שהאנגלית היא שפת התקשורת בין עמים רבים."}
    ]
  },
  {
    id:"ulpan-10-anat-completion",title:"היא רוצה להיות מורה...",
    source:"אולפן עברית • First Part, lesson 10 • PDF page 106 (printed page 118) • original fill-in passage; answer choices adapted",
    he:"ענת גרה במושב נהלל, שנמצא בצפון עמק יזרעאל.\nענת בת 22.\nכל בוקר היא קמה מוקדם ועוזרת להורים שלה בעבודה.\nהיא עוזרת להורים שלה בעבודה בשדה.\nאחרי הצהריים היא נוסעת ________ במכללה (קולג').\nענת רוצה ________ מורה, לכן היא לומדת חינוך.\nענת אומרת: \"אני מחכה לשבת. בשבת אני מרגישה נפלא.\nבשבת אני יכולה ________.\nאני לא צריכה ________ מוקדם,\nאני לא צריכה ________ להורים שלי בעבודה,\nואני לא צריכה ________ בשדה.\nאני יכולה ________ ספר טוב. אני יכולה ________ מוזיקה.\nבקיץ אני יכולה ________ בברכת השחייה.\nבחורף, בימים יפים של שמש, אני יכולה ________ בשדות עם מיכאל.\nבשבת אני יכולה ________ מה שאני רוצה!\"",
    en:"Anat lives in Nahalal, is 22, and helps her parents in the fields. In the afternoon she goes to study at college because she wants to be a teacher. She looks forward to Shabbat and describes what she can do then. Complete the original Hebrew blanks using the source vocabulary.",
    vocab:[["ללמוד","to study"],["להיות","to be"],["לקום","to get up"],["לקרוא","to read"]],
    questions:[
      {q:"אחרי הצהריים היא נוסעת ________ במכללה (קולג').",a:"ללמוד",opts:["ללמוד","לשחות","לעבוד","לנוח"],explanation:"היא נוסעת למכללה כדי ללמוד; לכן שם הפועל הוא ללמוד."},
      {q:"ענת רוצה ________ מורה, לכן היא לומדת חינוך.",a:"להיות",opts:["להיות","לקרוא","לשמוע","לשחות"],explanation:"היא לומדת חינוך מפני שהיא רוצה להיות מורה."},
      {q:"אני לא צריכה ________ מוקדם,",a:"לקום",opts:["לקום","לקרוא","לשמוע","לטייל"],explanation:"בשבת ענת לא צריכה לקום מוקדם, בניגוד לימי העבודה."}
    ]
  },

];
let readingSession=null;
let readingAdvanceTimer=null;
function cancelReadingAdvance(){if(readingAdvanceTimer!==null){clearTimeout(readingAdvanceTimer);readingAdvanceTimer=null}}
function renderReadingLibrary(){
  if(!$("readingStoryButtons"))return;
  let box=$("readingStoryButtons");box.innerHTML="";
  readingPassages.slice().sort(function(a,b){const fromBook=p=>/^(אולפן עברית|ללמוד עברית|עברית בשניים)/.test(p.source||"");return Number(fromBook(b))-Number(fromBook(a))}).forEach(function(p){let b=document.createElement("button");b.className="secondary";b.textContent=p.title;b.onclick=function(){openReadingPassage(p.id)};box.appendChild(b)})
}
function openReadingPassage(id){
  cancelReadingAdvance();
  let p=readingPassages.find(function(x){return x.id===id});if(!p)return;
  readingSession={passage:p,index:0,correct:0,answered:0,chosen:false};
  $("readingSetup").classList.add("hidden");$("readingPanel").classList.remove("hidden");$("readingResult").classList.add("hidden");
  $("readingTitle").textContent=p.title;$("readingSource").textContent=p.source;$("readingPassage").textContent=p.he;
  $("readingTranslation").textContent=p.en;$("readingTranslation").classList.add("hidden");$("toggleReadingTranslationBtn").textContent="Show English translation";
  let v=$("readingVocab");v.innerHTML="";p.vocab.forEach(function(x){let chip=document.createElement("span");chip.className="reviewChip";chip.textContent=x[0]+" — "+x[1];v.appendChild(chip)});
  nextReadingQuestion();window.scrollTo({top:$("readingLibraryCard").offsetTop-10,behavior:"smooth"})
}
function nextReadingQuestion(){
  cancelReadingAdvance();
  if(!readingSession)return;
  if(readingSession.index>=readingSession.passage.questions.length){finishReadingPassage();return}
  readingSession.chosen=false;
  let q=readingSession.passage.questions[readingSession.index];
  $("readingQuestionProgress").textContent=(q.kind?q.kind+" • ":"")+"Question "+(readingSession.index+1)+" of "+readingSession.passage.questions.length;
  $("readingQuestion").textContent=q.q;$("readingQuestionFeedback").classList.add("hidden");$("nextReadingQuestionBtn").classList.add("hidden");
  let a=$("readingChoices");a.innerHTML="";
  shuffle(q.opts).forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="rtl";b.onclick=function(){answerReadingQuestion(b,opt)};a.appendChild(b)})
}
function answerReadingQuestion(btn,opt){
  if(!readingSession||readingSession.chosen)return;
  readingSession.chosen=true;
  let q=readingSession.passage.questions[readingSession.index],ok=norm(opt)===norm(q.a);
  readingSession.answered++;if(ok)readingSession.correct++;
  Array.from($("readingChoices").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(q.a))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  let f=$("readingQuestionFeedback");f.textContent=ok?"Correct.":"Correct answer: "+q.a+". "+(q.explanation||"Read the passage above again for the answer.");f.className="feedback "+(ok?"good":"bad");
  if(ok)readingAdvanceTimer=setTimeout(function(){readingAdvanceTimer=null;advanceReadingQuestion()},650);
  else $("nextReadingQuestionBtn").classList.remove("hidden")
}
function advanceReadingQuestion(){cancelReadingAdvance();if(!readingSession||!readingSession.chosen)return;readingSession.index++;nextReadingQuestion()}
function finishReadingPassage(){
  let s=readingSession,pct=s.answered?Math.round(s.correct/s.answered*100):0;
  state.readingHistory.push({date:new Date().toISOString(),id:s.passage.id,correct:s.correct,total:s.answered,score:pct});save();
  $("readingChoices").innerHTML="";$("readingQuestion").textContent="Reading complete";$("readingQuestionProgress").textContent="";
  $("nextReadingQuestionBtn").classList.add("hidden");let f=$("readingQuestionFeedback");f.textContent=s.correct+" / "+s.answered+" correct ("+pct+"%).";f.className="feedback good"
}
function closeReadingPassage(){cancelReadingAdvance();readingSession=null;$("readingPanel").classList.add("hidden");$("readingSetup").classList.remove("hidden");$("readingResult").classList.add("hidden")}
function toggleReadingTranslation(){
  let t=$("readingTranslation"),show=t.classList.contains("hidden");t.classList.toggle("hidden",!show);$("toggleReadingTranslationBtn").textContent=show?"Hide English translation":"Show English translation"
}
$("nextReadingQuestionBtn").onclick=advanceReadingQuestion;$("closeReadingBtn").onclick=closeReadingPassage;$("toggleReadingTranslationBtn").onclick=toggleReadingTranslation;
renderReadingLibrary();

const INFINITIVE_QUIZ_TARGET=20;
const infinitiveQuizVerbs=verbDefinitions.filter(function(v,i,a){return v&&v.he&&v.en&&a.findIndex(function(x){return x.he===v.he})===i});
let infinitiveQuiz=null;

function localDateKey(d){
  d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")
}
function addCalendarDaysKey(days){
  let d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return localDateKey(d)
}
function formatDateKey(key){
  if(!key)return "—";let p=key.split("-").map(Number),d=new Date(p[0],p[1]-1,p[2],12);
  return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})
}
function infinitiveProgress(he){
  if(!state.infinitiveMastery[he])state.infinitiveMastery[he]={correctCount:0,mastered:false,nextDue:null,lastSeen:null};
  return state.infinitiveMastery[he]
}
function infinitiveIsDue(v){
  let p=infinitiveProgress(v.he);return p.mastered&&(!p.nextDue||p.nextDue<=localDateKey())
}
function infinitiveEligible(){
  return infinitiveQuizVerbs.filter(function(v){let p=infinitiveProgress(v.he);return !p.mastered||infinitiveIsDue(v)})
}
function renderVerbInfinitiveSummary(){
  if(!$("verbMasteredCount"))return;
  let mastered=infinitiveQuizVerbs.filter(function(v){return infinitiveProgress(v.he).mastered}).length;
  let due=infinitiveQuizVerbs.filter(infinitiveIsDue).length;
  $("verbMasteredCount").textContent=mastered+" / "+infinitiveQuizVerbs.length;
  $("verbDueCount").textContent=due;
  $("verbDueBadge").classList.toggle("hidden",due===0)
}
function buildInfinitiveQuizQueue(){
  let due=shuffle(infinitiveQuizVerbs.filter(infinitiveIsDue)),unmastered=shuffle(infinitiveQuizVerbs.filter(function(v){return !infinitiveProgress(v.he).mastered}));
  let q=due.slice(0,INFINITIVE_QUIZ_TARGET);
  if(q.length<INFINITIVE_QUIZ_TARGET&&unmastered.length){
    let focus=unmastered.slice(0,Math.min(10,unmastered.length)),last=null,guard=0;
    while(q.length<INFINITIVE_QUIZ_TARGET&&guard<200){
      let choices=focus.filter(function(v){return !last||v.he!==last.he}),v=rand(choices.length?choices:focus);
      q.push(v);last=v;guard++
    }
  }
  return shuffle(q)
}
function infinitiveOptions(v){
  let opts=[v.he];shuffle(infinitiveQuizVerbs.filter(function(x){return x.he!==v.he})).forEach(function(x){if(opts.length<4&&!opts.includes(x.he))opts.push(x.he)});
  return shuffle(opts)
}
function startVerbInfinitiveQuiz(){
  if(sprint||scriptPractice){alert("Finish the other optional practice first.");return}
  let queue=buildInfinitiveQuizQueue();
  if(!queue.length){
    let dates=infinitiveQuizVerbs.map(function(v){return infinitiveProgress(v.he).nextDue}).filter(Boolean).sort();
    $("verbInfinitiveResult").textContent=dates.length?"All infinitives are mastered and none are due today. Next reinforcement: "+formatDateKey(dates[0])+".":"No infinitive verbs are available yet.";
    $("verbInfinitiveResult").className="feedback good";return
  }
  infinitiveQuiz={queue:queue,index:0,attempted:0,correct:0,current:null};
  $("verbInfinitiveSetup").classList.add("hidden");$("verbInfinitiveResult").classList.add("hidden");$("verbInfinitivePanel").classList.remove("hidden");
  $("quizCard").classList.add("hidden");$("rapidCard").classList.add("hidden");$("scriptPracticeCard").classList.add("hidden");
  nextVerbInfinitiveQuestion();window.scrollTo({top:$("verbInfinitiveCard").offsetTop-10,behavior:"smooth"})
}
function nextVerbInfinitiveQuestion(){
  if(!infinitiveQuiz)return;
  while(infinitiveQuiz.index<infinitiveQuiz.queue.length){
    let candidate=infinitiveQuiz.queue[infinitiveQuiz.index],p=infinitiveProgress(candidate.he);
    if(!p.mastered||infinitiveIsDue(candidate))break;
    infinitiveQuiz.index++
  }
  if(infinitiveQuiz.index>=infinitiveQuiz.queue.length){finishVerbInfinitiveQuiz();return}
  let v=infinitiveQuiz.queue[infinitiveQuiz.index];infinitiveQuiz.current=v;
  $("verbInfinitiveProgress").textContent=(infinitiveQuiz.attempted+1)+" / "+infinitiveQuiz.queue.length;
  $("verbInfinitiveScore").textContent=infinitiveQuiz.correct+" / "+infinitiveQuiz.attempted;
  $("verbInfinitivePrompt").textContent=v.en;
  let p=infinitiveProgress(v.he);
  $("verbInfinitiveInstruction").textContent=p.mastered?"Weekly reinforcement: choose the Hebrew infinitive.":"Choose the Hebrew infinitive. Mastery: "+p.correctCount+"/10";
  $("verbInfinitiveFeedback").classList.add("hidden");$("nextVerbInfinitiveBtn").classList.add("hidden");
  let area=$("verbInfinitiveChoices");area.innerHTML="";
  infinitiveOptions(v).forEach(function(opt){
    let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="rtl";b.onclick=function(){answerVerbInfinitive(b,opt)};area.appendChild(b)
  })
}
function answerVerbInfinitive(btn,opt){
  if(!infinitiveQuiz||$("nextVerbInfinitiveBtn").classList.contains("hidden")===false)return;
  let v=infinitiveQuiz.current,p=infinitiveProgress(v.he),wasMastered=p.mastered,ok=norm(opt)===norm(v.he),today=localDateKey();
  infinitiveQuiz.attempted++;if(ok)infinitiveQuiz.correct++;
  Array.from($("verbInfinitiveChoices").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(v.he))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  p.lastSeen=today;
  let msg;
  if(wasMastered){
    p.nextDue=addCalendarDaysKey(7);
    msg=(ok?"Reinforcement correct. ":"Correct infinitive: "+v.he+" — "+v.en+". ")+"Mastery remains active. Next reinforcement: "+formatDateKey(p.nextDue)+"."
  }else if(ok){
    p.correctCount=Math.min(10,(p.correctCount||0)+1);
    if(p.correctCount>=10){
      p.mastered=true;p.nextDue=addCalendarDaysKey(7);
      msg=v.he+" — "+v.en+". Mastered at 10/10. Next reinforcement: "+formatDateKey(p.nextDue)+"."
    }else msg=v.he+" — "+v.en+". Mastery progress: "+p.correctCount+"/10."
  }else{
    msg="Correct infinitive: "+v.he+" — "+v.en+". Mastery remains "+(p.correctCount||0)+"/10."
  }
  save();renderVerbInfinitiveSummary();
  $("verbInfinitiveScore").textContent=infinitiveQuiz.correct+" / "+infinitiveQuiz.attempted;
  let f=$("verbInfinitiveFeedback");f.textContent=msg;f.className="feedback "+(ok?"good":"bad");
  $("nextVerbInfinitiveBtn").textContent=infinitiveQuiz.index>=infinitiveQuiz.queue.length-1?"Finish":"Next verb";
  $("nextVerbInfinitiveBtn").classList.remove("hidden")
}
function advanceVerbInfinitiveQuiz(){
  if(!infinitiveQuiz)return;infinitiveQuiz.index++;nextVerbInfinitiveQuestion()
}
function finishVerbInfinitiveQuiz(){
  if(!infinitiveQuiz)return;
  let done=infinitiveQuiz,accuracy=done.attempted?Math.round(done.correct/done.attempted*100):0;
  state.infinitiveQuizHistory.push({date:new Date().toISOString(),attempted:done.attempted,correct:done.correct,accuracy:accuracy});save();
  infinitiveQuiz=null;$("verbInfinitivePanel").classList.add("hidden");$("verbInfinitiveSetup").classList.remove("hidden");
  $("quizCard").classList.remove("hidden");$("rapidCard").classList.remove("hidden");$("scriptPracticeCard").classList.remove("hidden");
  let r=$("verbInfinitiveResult");r.textContent="Infinitive quiz: "+done.correct+" correct out of "+done.attempted+" ("+accuracy+"%). This quiz is separate from level scoring.";r.className="feedback good";
  renderVerbInfinitiveSummary()
}
function exitVerbInfinitiveQuiz(){
  infinitiveQuiz=null;$("verbInfinitivePanel").classList.add("hidden");$("verbInfinitiveSetup").classList.remove("hidden");
  $("quizCard").classList.remove("hidden");$("rapidCard").classList.remove("hidden");$("scriptPracticeCard").classList.remove("hidden");
  renderVerbInfinitiveSummary()
}
$("startVerbInfinitiveBtn").onclick=startVerbInfinitiveQuiz;$("nextVerbInfinitiveBtn").onclick=advanceVerbInfinitiveQuiz;$("exitVerbInfinitiveBtn").onclick=exitVerbInfinitiveQuiz;
renderVerbInfinitiveSummary();

const scriptLetters=[
  {letter:"א",name:"Alef",file:"Hebrew letter Alef handwriting.svg"},
  {letter:"ב",name:"Bet",file:"Hebrew letter Bet handwriting.svg"},
  {letter:"ג",name:"Gimel",file:"Hebrew letter Gimel handwriting.svg"},
  {letter:"ד",name:"Dalet",file:"Hebrew letter Daled handwriting.svg"},
  {letter:"ה",name:"He",file:"Hebrew letter He handwriting.svg"},
  {letter:"ו",name:"Vav",file:"Hebrew letter Vav handwriting.svg"},
  {letter:"ז",name:"Zayin",file:"Hebrew letter Zayin handwriting.svg"},
  {letter:"ח",name:"Het",file:"Hebrew letter Het handwriting.svg"},
  {letter:"ט",name:"Tet",file:"Hebrew letter Tet handwriting.svg"},
  {letter:"י",name:"Yod",file:"Hebrew letter Yud handwriting.svg"},
  {letter:"כ",name:"Kaf",file:"Hebrew letter Kaf handwriting.svg"},
  {letter:"ך",name:"Final Kaf",file:"Hebrew letter Kaf-final handwriting.svg"},
  {letter:"ל",name:"Lamed",file:"Hebrew letter Lamed handwriting.svg"},
  {letter:"מ",name:"Mem",file:"Hebrew letter Mem handwriting.svg"},
  {letter:"ם",name:"Final Mem",file:"Hebrew letter Mem-final handwriting.svg"},
  {letter:"נ",name:"Nun",file:"Hebrew letter Nun handwriting.svg"},
  {letter:"ן",name:"Final Nun",file:"Hebrew letter Nun-final handwriting.svg"},
  {letter:"ס",name:"Samekh",file:"Hebrew letter Samekh handwriting.svg"},
  {letter:"ע",name:"Ayin",file:"Hebrew letter Ayin handwriting.svg"},
  {letter:"פ",name:"Pe",file:"Hebrew letter Pe handwriting.svg"},
  {letter:"ף",name:"Final Pe",file:"Hebrew letter Pe-final handwriting.svg"},
  {letter:"צ",name:"Tsadi",file:"Hebrew letter Tsadik handwriting.svg"},
  {letter:"ץ",name:"Final Tsadi",file:"Hebrew letter Tsadik-final handwriting.svg"},
  {letter:"ק",name:"Qof",file:"Hebrew letter Kuf handwriting.svg"},
  {letter:"ר",name:"Resh",file:"Hebrew letter Resh handwriting.svg"},
  {letter:"ש",name:"Shin",file:"Hebrew letter Shin handwriting.svg"},
  {letter:"ת",name:"Tav",file:"Hebrew letter Taf handwriting.svg"}
];
let scriptPractice=null,scriptDrawing=false,scriptLast=null;
function scriptImageUrl(file){return "https://commons.wikimedia.org/wiki/Special:Redirect/file/"+encodeURIComponent(file)}
function makeScriptImage(entry,altPrefix){
  let img=document.createElement("img");img.src=scriptImageUrl(entry.file);img.alt=(altPrefix||"Handwritten script form of ")+entry.name;img.loading="eager";return img
}
function buildScriptReference(){
  let box=$("scriptReference");if(box.dataset.ready==="1")return;
  scriptLetters.forEach(function(entry){
    let cell=document.createElement("div");cell.className="scriptRefItem";
    let block=document.createElement("div");block.className="scriptRefBlock";block.textContent=entry.letter;block.dir="rtl";
    let img=makeScriptImage(entry);img.loading="lazy";
    let name=document.createElement("div");name.className="scriptRefName";name.textContent=entry.name;
    cell.appendChild(block);cell.appendChild(img);cell.appendChild(name);box.appendChild(cell)
  });
  box.dataset.ready="1"
}
function toggleScriptReference(){
  buildScriptReference();let box=$("scriptReference"),show=box.classList.contains("hidden");
  box.classList.toggle("hidden",!show);$("toggleScriptRefBtn").textContent=show?"Hide script reference":"Show script reference"
}
function startScriptPractice(){
  if(sprint||infinitiveQuiz){alert("Finish the other optional practice first.");return}
  scriptPractice={queue:shuffle(scriptLetters).slice(0,12),index:0,correct:0,attempted:0,current:null};
  $("scriptSetup").classList.add("hidden");$("scriptResult").classList.add("hidden");$("scriptPanel").classList.remove("hidden");
  $("quizCard").classList.add("hidden");$("rapidCard").classList.add("hidden");$("verbInfinitiveCard").classList.add("hidden");
  nextScriptQuestion();window.scrollTo({top:$("scriptPracticeCard").offsetTop-10,behavior:"smooth"})
}
function nextScriptQuestion(){
  if(!scriptPractice)return;
  if(scriptPractice.index>=scriptPractice.queue.length){finishScriptPractice();return}
  let entry=scriptPractice.queue[scriptPractice.index];scriptPractice.current=entry;
  $("scriptProgress").textContent=(scriptPractice.index+1)+" / "+scriptPractice.queue.length;
  $("scriptScore").textContent=scriptPractice.correct+" / "+scriptPractice.attempted;
  $("scriptBlockLetter").textContent=entry.letter;$("scriptLetterName").textContent=entry.name;
  $("scriptFeedback").classList.add("hidden");$("scriptCopyArea").classList.add("hidden");clearScriptPad();
  $("scriptInstruction").textContent="Choose the matching handwritten script form.";
  let choices=[entry];shuffle(scriptLetters.filter(function(x){return x.letter!==entry.letter})).slice(0,3).forEach(function(x){choices.push(x)});
  let area=$("scriptChoices");area.innerHTML="";
  shuffle(choices).forEach(function(choice){
    let b=document.createElement("button");b.className="choice scriptChoice";b.type="button";b.appendChild(makeScriptImage(choice));
    b.setAttribute("aria-label","Choose handwritten form "+choice.name);b.onclick=function(){answerScriptChoice(b,choice)};area.appendChild(b)
  })
}
function answerScriptChoice(btn,choice){
  if(!scriptPractice||$("scriptCopyArea").classList.contains("hidden")===false)return;
  let currentLetter=scriptPractice.current,ok=choice.letter===currentLetter.letter;scriptPractice.attempted++;if(ok)scriptPractice.correct++;
  Array.from($("scriptChoices").children).forEach(function(b,i){
    b.disabled=true;
    let img=b.querySelector("img");
    if(img&&img.alt.endsWith(currentLetter.name))b.classList.add("correct")
  });
  if(!ok)btn.classList.add("wrong");
  $("scriptScore").textContent=scriptPractice.correct+" / "+scriptPractice.attempted;
  let f=$("scriptFeedback");f.textContent=ok?"Correct. Copy the script form below if you want.":"That was not the match. The correct script form is shown below.";f.className="feedback "+(ok?"good":"bad");
  let model=$("scriptCorrectModel");model.innerHTML="";model.appendChild(makeScriptImage(currentLetter));
  $("scriptCopyArea").classList.remove("hidden");setTimeout(sizeScriptCanvas,0)
}
function finishScriptPractice(){
  if(!scriptPractice)return;
  let done=scriptPractice,percent=done.attempted?Math.round(done.correct/done.attempted*100):0;scriptPractice=null;
  $("scriptPanel").classList.add("hidden");$("scriptSetup").classList.remove("hidden");$("quizCard").classList.remove("hidden");$("rapidCard").classList.remove("hidden");$("verbInfinitiveCard").classList.remove("hidden");$("verbInfinitiveCard").classList.remove("hidden");
  let result=$("scriptResult");result.textContent="Script matching: "+done.correct+" correct out of "+done.attempted+" ("+percent+"%). This practice does not affect your lesson level.";result.className="feedback good"
}
function exitScriptPractice(){
  scriptPractice=null;$("scriptPanel").classList.add("hidden");$("scriptSetup").classList.remove("hidden");$("quizCard").classList.remove("hidden");$("rapidCard").classList.remove("hidden");$("verbInfinitiveCard").classList.remove("hidden");clearScriptPad()
}
$("startScriptBtn").onclick=startScriptPractice;$("toggleScriptRefBtn").onclick=toggleScriptReference;$("nextScriptBtn").onclick=function(){if(!scriptPractice)return;scriptPractice.index++;nextScriptQuestion()};$("exitScriptBtn").onclick=exitScriptPractice;
const scriptCanvas=$("scriptPad"),scriptCtx=scriptCanvas.getContext("2d");
function sizeScriptCanvas(){let r=scriptCanvas.getBoundingClientRect(),d=window.devicePixelRatio||1;if(!r.width)return;scriptCanvas.width=Math.round(r.width*d);scriptCanvas.height=Math.round(220*d);scriptCtx.setTransform(d,0,0,d,0,0);scriptCtx.lineCap="round";scriptCtx.lineJoin="round";scriptCtx.strokeStyle="#111"}
function clearScriptPad(){if(scriptCanvas.width)scriptCtx.clearRect(0,0,scriptCanvas.width,scriptCanvas.height)}
function scriptPt(e){let r=scriptCanvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
scriptCanvas.addEventListener("pointerdown",function(e){scriptDrawing=true;scriptLast=scriptPt(e);scriptCanvas.setPointerCapture(e.pointerId)});
scriptCanvas.addEventListener("pointermove",function(e){if(!scriptDrawing)return;let p=scriptPt(e),pressure=e.pressure||.5;scriptCtx.lineWidth=2.2+pressure*3;scriptCtx.beginPath();scriptCtx.moveTo(scriptLast.x,scriptLast.y);scriptCtx.lineTo(p.x,p.y);scriptCtx.stroke();scriptLast=p});
scriptCanvas.addEventListener("pointerup",function(){scriptDrawing=false;scriptLast=null});scriptCanvas.addEventListener("pointercancel",function(){scriptDrawing=false;scriptLast=null});$("clearScriptPadBtn").onclick=clearScriptPad;window.addEventListener("resize",sizeScriptCanvas);

const canvas=$("pad"),ctx=canvas.getContext("2d");let drawing=false,last=null;
function sizeCanvas(){let r=canvas.getBoundingClientRect(),d=window.devicePixelRatio||1;if(!r.width)return;canvas.width=Math.round(r.width*d);canvas.height=Math.round(270*d);ctx.setTransform(d,0,0,d,0,0);ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#111"}
function clearPad(){if(canvas.width)ctx.clearRect(0,0,canvas.width,canvas.height)}
function pt(e){let r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
canvas.addEventListener("pointerdown",function(e){drawing=true;last=pt(e);canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",function(e){if(!drawing)return;let p=pt(e),pressure=e.pressure||.5;ctx.lineWidth=2.2+pressure*3;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p});
canvas.addEventListener("pointerup",function(){drawing=false;last=null});canvas.addEventListener("pointercancel",function(){drawing=false;last=null});$("clearPadBtn").onclick=clearPad;window.addEventListener("resize",sizeCanvas);
let launchMode=null;try{launchMode=sessionStorage.getItem("hebrewTrainerLaunch");sessionStorage.removeItem("hebrewTrainerLaunch")}catch(e){}
if(launchMode==="review"&&masteryReviewCount()){beginFocusedReview()}
else if(!state.session||launchMode==="normal")startSession();
else{renderHeader();nextQuestion()};
