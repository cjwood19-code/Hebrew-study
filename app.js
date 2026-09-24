const D=window.TRAINER_DATA,vocab=D.vocab,sentences=D.sentences,verbs=D.verbs||[],connectors=D.connectors||[],matches=D.matches||[],opposites=D.opposites||[],grammarQuestions=D.grammarQuestions||[],classVerbQuestions=D.classVerbQuestions||[],verbDefinitions=D.verbDefinitions||[],SESSION_LEN=15,PASS=85,TEST_LEN=20,TEST_PASS=85;
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
  return{type:"tiles",cat:"בניית משפטים",prompt:s.en,correct:s.he,words:shuffle(s.he.split(" "))}
}
function matchQuestion(){let useOpp=opposites.length&&Math.random()<.5,src=useOpp?opposites:matches,m=rand(src),opts=[m.answer];shuffle(src.filter(function(x){return x.answer!==m.answer})).forEach(function(x){if(opts.length<4&&!opts.includes(x.answer))opts.push(x.answer)});return{type:"match",cat:useOpp?"מילים הפוכות":"התאמה בעברית",prompt:m.prompt,correct:m.answer,options:shuffle(opts)}}
function connectorTranslationChoices(c){
  let opts=[c.en];shuffle(connectors.filter(function(x){return x.sentence!==c.sentence&&x.en})).forEach(function(x){if(opts.length<4&&!opts.includes(x.en))opts.push(x.en)});
  return shuffle(opts)
}
function connectorQuestion(){
  let c=rand(connectors),opts=[c.answer];shuffle(connectors.filter(function(x){return x.answer!==c.answer})).forEach(function(x){if(opts.length<4&&!opts.includes(x.answer))opts.push(x.answer)});
  let full=c.sentence.replace("___",c.answer);
  return{type:"connector2",cat:"מילות קישור • שני חלקים",prompt:c.sentence,correct:c.answer+"||"+c.en,correctConnector:c.answer,fullHebrew:full,translation:c.en,options:shuffle(opts),translationOptions:connectorTranslationChoices(c),part1Correct:null}
}
function grammarQuestion(){let g=rand(grammarQuestions);return{type:"grammar",cat:g.cat||"דקדוק",prompt:g.prompt,correct:g.answer,options:shuffle(g.options||[g.answer])}}
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
function makeQuestion(levelOverride){let actualLevel=levelOverride||state.level,L=exerciseLevel(actualLevel),item=pickItem();if(L===12&&state.blockTests.missed.length&&Math.random()<.16){let rq=reviveTestMiss(rand(state.blockTests.missed));if(rq)return rq}if(L===1)return mc(item,false);if(L===2)return mc(item,true);if(L===3)return mc(item,Math.random()<.5);if(L===4)return{type:"typedEn",item:item,prompt:item.he,correct:item.en};if(L===5)return{type:"typedHe",item:item,prompt:item.en,correct:item.he};if(L===6)return sentenceQuestion();if(L===7)return matchQuestion();if(L===8)return Math.random()<.52?connectorQuestion():grammarQuestion();if(L===9)return verbQuestion(Math.random()<.45);if(L===10){let s=rand(practiceSentences());return sentenceTilesQuestion(s)}if(L===11)return{type:"hand",item:item,prompt:item.en,correct:item.he};let r=Math.random();if(r<.10)return mc(item,Math.random()<.5);if(r<.18)return{type:"typedHe",item:item,prompt:item.en,correct:item.he};if(r<.26)return{type:"typedEn",item:item,prompt:item.he,correct:item.en};if(r<.38)return sentenceQuestion();if(r<.48)return matchQuestion();if(r<.56)return connectorQuestion();if(r<.64)return grammarQuestion();if(r<.82)return verbQuestion(Math.random()<.5);if(r<.90)return{type:"hand",item:item,prompt:item.en,correct:item.he};let s=rand(practiceSentences());return sentenceTilesQuestion(s)}
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
  if(q&&(q.type==="sentence2"||q.type==="connector2"))return false;
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
  let q=JSON.parse(JSON.stringify(rec.question));q.part1Correct=null;q._reviewLevel=rec.level||state.level;
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
  let q=JSON.parse(JSON.stringify(rec.question));q.part1Correct=null;
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
function makeUniqueQuestion(){
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
  if(isTest){
    let startLevel=s.testBlockEnd-4;
    $("levelBadge").textContent="Block Test";
    $("modeLabel").textContent="Levels "+startLevel+"–"+s.testBlockEnd+" • 85% required";
    $("best").textContent=state.blockTests.best[String(s.testBlockEnd)]!==undefined?state.blockTests.best[String(s.testBlockEnd)]+"%":"—";
    levelPct=blockAccuracyPercent(s.testBlockEnd);$("levelAccuracyLabel").textContent="Block accuracy"
  }else if(!state.session&&state.blockTestDue){
    $("levelBadge").textContent="Test Due";$("modeLabel").textContent="20-question checkpoint required";$("best").textContent="—";
    levelPct=levelAccuracyPercent(state.level);$("levelAccuracyLabel").textContent="Level accuracy"
  }else{
    $("levelBadge").textContent="Level "+state.level;$("modeLabel").textContent=levelName(state.level);
    $("best").textContent=state.best[state.level]!==undefined?state.best[state.level]+"%":"—";
    levelPct=levelAccuracyPercent(state.level);$("levelAccuracyLabel").textContent="Level accuracy"
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
function hideAll(){["choiceArea","typedArea","tilesArea","handArea","selfGrade","feedback","nextBtn"].forEach(function(id){$(id).classList.add("hidden")});$("choiceArea").innerHTML="";$("answerInput").value="";$("answerLine").innerHTML="";$("wordTiles").innerHTML="";tileAnswer=[];locked=false;clearPad()}
function nextQuestion(){if(!state.session||state.session.answered>=sessionLength()){finishSession();return}hideAll();current=makeUniqueQuestion();$("prompt").textContent=current.prompt;$("prompt").dir=/[\u0590-\u05FF]/.test(current.prompt)?"rtl":"ltr";$("category").textContent=current.cat||(current.item?current.item.cat:"Sentence");if(current.type==="sentence2"){renderSentenceWordPart()}else if(current.type==="connector2"){renderConnectorPart()}else if(["mc","reading","match","connector","grammar","verbMC","verbDefMC"].includes(current.type)){let a=$("choiceArea");a.classList.remove("hidden");current.options.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir=/[\u0590-\u05FF]/.test(opt)?"rtl":"ltr";b.onclick=function(){answerMC(b,opt)};a.appendChild(b)});$("instruction").textContent=current.type==="reading"?"Read the Hebrew sentence and choose the meaning.":current.type==="match"?"Choose the matching Hebrew word or opposite.":current.type==="connector"?"Choose the connector that completes the Hebrew sentence.":current.type==="grammar"?"Choose the grammatically correct Hebrew form.":current.type==="verbMC"?"Choose the correct Hebrew verb form.":current.type==="verbDefMC"?"Identify the verb meaning quickly.":"Tap the best answer."}else if(current.type==="typedEn"||current.type==="typedHe"||current.type==="verbTyped"){$("typedArea").classList.remove("hidden");$("answerInput").dir=current.type==="typedEn"?"ltr":"rtl";$("answerInput").placeholder=current.type==="typedEn"?"Type English meaning":"הקלד/י בעברית";$("instruction").textContent=current.type==="verbTyped"?"Type the correct Hebrew verb form.":current.type==="typedHe"?"Recall the Hebrew word.":"Give the English meaning."}else if(current.type==="tiles"){$("tilesArea").classList.remove("hidden");$("instruction").textContent="Tap the Hebrew words in the correct order.";current.words.forEach(addTile)}else{$("handArea").classList.remove("hidden");$("instruction").textContent="Write the Hebrew answer with Apple Pencil, then reveal and self-grade.";sizeCanvas()}}
function renderConnectorPart(){
  let a=$("choiceArea");a.innerHTML="";a.classList.remove("hidden");$("instruction").textContent="Part 1 of 2: Choose the connector that completes the Hebrew sentence.";
  current.options.forEach(function(opt){let b=document.createElement("button");b.className="choice";b.textContent=opt;b.dir="rtl";b.onclick=function(){answerConnectorPart(b,opt)};a.appendChild(b)})
}
function answerConnectorPart(btn,opt){
  if(locked)return;
  let ok=norm(opt)===norm(current.correctConnector);current.part1Correct=ok;
  Array.from($("choiceArea").children).forEach(function(b){b.disabled=true;if(norm(b.textContent)===norm(current.correctConnector))b.classList.add("correct")});
  if(!ok)btn.classList.add("wrong");
  $("prompt").textContent=current.fullHebrew;$("prompt").dir="rtl";
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
  $("prompt").textContent=current.fullHebrew;$("prompt").dir="rtl";
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
  if(q&&q.prompt){
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
function showFeedback(ok,msg){let f=$("feedback");f.textContent=msg;f.className="feedback "+(ok?"good":"bad")}
function record(ok){
  if(locked)return;locked=true;let isTest=state.session&&state.session.isTest,sourceLevel=questionLevel(current);
  state.session.answered++;if(ok)state.session.correct++;
  state.runningAccuracy.attempted++;if(ok)state.runningAccuracy.correct++;
  updateLevelAccuracy(sourceLevel,ok);updateMastery(current,ok,sourceLevel);
  if(current.item){let k=current.item.he;if(ok)state.missed[k]=Math.max(0,(state.missed[k]||0)-1);else state.missed[k]=(state.missed[k]||0)+1}
  if(isTest&&!ok)rememberTestMiss(current,current._testLevel,state.session.testBlockEnd);
  save();renderHeader();$("nextBtn").textContent=state.session.answered>=sessionLength()?"Finish":"Next";$("nextBtn").classList.remove("hidden")
}
function answerMC(btn,opt){if(locked)return;let ok=norm(opt)===norm(current.correct);Array.from(document.querySelectorAll(".choice")).forEach(function(b){if(norm(b.textContent)===norm(current.correct))b.classList.add("correct")});if(!ok)btn.classList.add("wrong");showFeedback(ok,ok?"Correct.":"Correct answer: "+answerWithEnglish(current.correct,current));record(ok)}
function englishMatch(a,c){let aa=norm(a);if(!aa)return false;let parts=c.split("/").map(norm);return parts.some(function(p){return aa===p||aa.includes(p)||p.includes(aa)})}
function checkTyped(){if(locked)return;let a=$("answerInput").value;if(!norm(a)){showFeedback(false,"No answer entered. Correct answer: "+answerWithEnglish(current.correct,current));record(false);return}let ok=current.type==="typedEn"?englishMatch(a,current.correct):norm(a)===norm(current.correct);showFeedback(ok,ok?"Correct.":"Correct answer: "+answerWithEnglish(current.correct,current));record(ok)}
function checkTiles(){
  if(locked)return;let a=tileAnswer.join(" "),ok=norm(a)===norm(current.correct);
  showFeedback(ok,ok?"Correct.":"Correct Hebrew sentence: "+current.correct+" — "+current.prompt);record(ok)
}
function revealHand(){if(locked)return;$("revealedAnswer").textContent=current.correct;$("selfGrade").classList.remove("hidden")}
function gradeHand(ok){if(locked)return;showFeedback(ok,ok?"Marked correct.":"Correct answer: "+answerWithEnglish(current.correct,current)+". Added to your review list.");record(ok)}
function showSessionComplete(msg,buttonLabel){
  $("message").textContent=msg;$("message").classList.remove("hidden");
  $("quizCard").innerHTML='<div style="text-align:center"><h2>Session complete</h2><p>'+msg+'</p><button class="primary" id="newSessionBtn">'+buttonLabel+'</button></div>';
  $("newSessionBtn").onclick=function(){location.reload()};renderHeader();window.scrollTo({top:0,behavior:"smooth"})
}
function finishBlockTest(){
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
function finishSession(){
  let s=state.session;if(s&&s.isTest){finishBlockTest();return}
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
$("checkTypedBtn").onclick=checkTyped;$("checkTilesBtn").onclick=checkTiles;$("clearTilesBtn").onclick=clearTiles;$("revealBtn").onclick=revealHand;$("missedBtn").onclick=function(){gradeHand(false)};$("correctBtn").onclick=function(){gradeHand(true)};$("nextBtn").onclick=nextQuestion;$("resetBtn").onclick=function(){if(confirm("Reset all scores, levels, and missed-word history?")){localStorage.removeItem("hebrewTrainerState");location.reload()}};$("practiceMissedBtn").onclick=function(){if(masteryReviewCount()){state.focus=true;save();alert("Focused review is on. Items awaiting mastery will be heavily weighted until they reach 10 correct answers.")}else alert("You have no items awaiting mastery.")};
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
if(!state.session)startSession();else{renderHeader();nextQuestion()};