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
  {"id":"ulpan4-32-health","title":"נפש בריאה בגוף בריא — הציווי","source":"אולפן עברית — חלק רביעי • lesson 32 • PDF page 19 (printed page 367) • selected original Hebrew; omissions marked; supplemental comprehension of the source commands","he":"איך לחיות חיים טובים, בריאים וארוכים?\nאל תיקח ללב! קח הכול בקלות.\nאל תכעס, אל תתרגז ואל תתעצבן!\nשמע בדיחות, ראה סרטים מצחיקים, צחק הרבה, הצחוק טוב לבריאות!\nאל תפסיק ללמוד, קרא הרבה, וכל הזמן למד דברים חדשים!\nאכול במידה, ואל תגזים. אכול מזון טבעי כגון (למשל) פירות וירקות.\n…\nאל תשתה הרבה קפה, עדיף (טוב יותר) לשתות תה מצמחים.\nעבוד! והשתדל לאהוב את עבודתך. העבודה טובה לחיים בריאים.\n…\nעסוק בפעילות גופנית. הספורט מועיל לגוף ולנפש.\nאל תעשן, הסיגריות מזיקות לבריאות.\nהשתדל לטייל באוויר הפתוח לפחות שעה ביום.\n…\nוהעיקר - היה שמח! ושמור על עצמך!","en":"The lesson uses commands and prohibitions to give advice about healthy living. Omitted lines are marked in the Hebrew excerpt.","vocab":[["הציווי","imperative"],["קח","take (to one male)"],["שמור","keep / protect"],["אל תעשן","do not smoke"]],"questions":[{"q":"איזו צורה היא ציווי חיובי בקטע?","a":"קח הכול בקלות.","opts":["קח הכול בקלות.","אל תכעס.","אל תעשן.","אל תפסיק ללמוד."],"kind":"Supplemental source comprehension · positive command","explanation":"קח הוא ציווי חיובי; אל לפני הפועל מסמן איסור."},{"q":"מה אומר הקטע על לימוד?","a":"אל תפסיק ללמוד.","opts":["אל תפסיק ללמוד.","הפסק ללמוד.","קרא פחות.","למד רק בבית הספר."],"kind":"Supplemental source comprehension","explanation":"בקטע כתוב אל תפסיק ללמוד, קרא הרבה."},{"q":"לפי הקטע, מה מועיל לגוף ולנפש?","a":"ספורט","opts":["ספורט","סיגריות","כעס","חוסר שינה"],"kind":"Supplemental source comprehension","explanation":"הקטע אומר: הספורט מועיל לגוף ולנפש."},{"q":"איזו עצה מופיעה בסוף הקטע?","a":"היה שמח ושמור על עצמך.","opts":["היה שמח ושמור על עצמך.","הפסק לעבוד.","אל תאכל פירות.","שתה הרבה קפה."],"kind":"Supplemental source comprehension","explanation":"המשפט האחרון הוא והעיקר - היה שמח! ושמור על עצמך!"}]},
  {"id":"ulpan4-33-three-books","title":"שלושה ספרים — קריאה והשלמה","source":"אולפן עברית — חלק רביעי • lesson 33 • PDF page 24 (printed page 372) • original reading and printed fill-in; choices adapted","he":"ראש השנה נקרא גם ״יום הדין״, יום של משפט.\nבראש השנה אלוהים שופט את בני האדם וקובע מי יחיה ומי ימות.\nאמר רבי יוחנן: ״שלושה ספרים נפתחים בראש השנה - אחד של צדיקים גמורים, ואחד של רשעים גמורים, ואחד של בינוניים.\nצדיקים - נכתבים ונחתמים מיד לחיים. רשעים - נכתבים ונחתמים מיד למיתה.\nובינוניים - תלויים ועומדים מראש השנה עד יום הכיפורים.\nזכו - נכתבים לחיים. לא זכו - נכתבים למיתה״.\nלכן בראש השנה מברכים זה את זה: ״לשנה טובה תיכתבו ותיחתמו״,\nוביום הכיפורים מאחלים זה לזה: ״גמר חתימה טובה״.","en":"The textbook explains a traditional Rosh Hashanah account of three books and the wishes exchanged during the High Holidays.","vocab":[["נפתחים","are opened"],["נכתבים","are written"],["נחתמים","are sealed"],["יום הדין","Day of Judgment"]],"questions":[{"q":"בראש השנה _____ פותח שלושה ספרים.","a":"אלוהים","opts":["אלוהים","רבי יוחנן","הבינוניים","הצדיקים"],"kind":"Printed fill-in · item 1","explanation":"הקטע אומר שאלוהים שופט את בני האדם ושלושה ספרים נפתחים בראש השנה."},{"q":"בספר אחד הוא מיד כותב וחותם את ה_____ לחיים.","a":"צדיקים","opts":["צדיקים","רשעים","בינוניים","חכמים"],"kind":"Printed fill-in · item 2","explanation":"צדיקים נכתבים ונחתמים מיד לחיים."},{"q":"בספר השני הוא כותב וחותם את הרשעים ל_____.","a":"מיתה","opts":["מיתה","חיים","שלום","לימודים"],"kind":"Printed fill-in · item 3","explanation":"הרשעים נכתבים ונחתמים מיד למיתה."},{"q":"את הבינוניים אלוהים כותב וחותם ביום ה_____.","a":"כיפורים","opts":["כיפורים","שבת","חנוכה","פורים"],"kind":"Printed fill-in · item 4","explanation":"בקטע הבינוניים תלויים ועומדים עד יום הכיפורים."}]},
  {"id":"ulpan4-33-soldier","title":"אהבתו של חייל — אילו","source":"אולפן עברית — חלק רביעי • lesson 33 • PDF page 27 (printed page 375) • original poem and printed conditional transformations; choices adapted","he":"אילו הייתי עשיר, הייתי מקשט את צווארך במחרוזת פנינים.\nאילו ניגנתי בפסנתר, הייתי מנעים את יומך בצלילים רכים.\nאילו ידעתי לספר, הייתי ממלא את לילך באגדות וסיפורים.\nלו ציורים ציירתי - הייתי מצייר רק אותך.\nלו רקדן הייתי - ולס וְטַנְגוֹ הייתי רוקד אתך.\nלו לשיר ידעתי - שירי אהבה הייתי שר לך.\nלו לשמים להגיע יכולתי - כוכבים הייתי מביא רק בשבילך...\nלולא שרתי בצבא - הייתי נמצא תמיד לצדך...\nלולא חייל הייתי - הכול הייתי עושה למענך...\nאך רק באהבתי יכול אני לבקש את לבך...","en":"A soldier imagines what he would do for someone he loves under unreal conditions. The exercise changes the first-person lines into third-person sentences.","vocab":[["אילו","if (unreal condition)"],["הייתי","I would / I was"],["פנינים","pearls"],["מחרוזת","necklace"]],"questions":[{"q":"אילו הוא _____ עשיר, הוא היה _____ את צווארה במחרוזת פנינים.","a":"היה, מקשט","opts":["היה, מקשט","יהיה, יקשט","הייתי, מקשט","היה, יקשט"],"kind":"Printed transformation · item 1","explanation":"התרגיל משנה הייתי עשיר, הייתי מקשט לגוף שלישי: היה, היה מקשט."},{"q":"אילו הוא _____ בפסנתר, הוא _____ מנעים את יומה בצלילים רכים.","a":"ניגן, היה","opts":["ניגן, היה","ינגן, יהיה","ניגנתי, הייתי","מנגן, היה"],"kind":"Printed transformation · item 2","explanation":"אילו ניגנתי נעשה אילו הוא ניגן; הייתי מנעים נעשה הוא היה מנעים."},{"q":"אילו הוא ידע לספר, בסיפורים ואגדות הוא היה _____ את לילה.","a":"ממלא","opts":["ממלא","ימלא","מילא","למלא"],"kind":"Printed transformation · item 3","explanation":"הייתי ממלא הופך לגוף שלישי: הוא היה ממלא."},{"q":"אילו ציורים הוא צייר, הוא _____ _____ רק אותה.","a":"היה מצייר","opts":["היה מצייר","יצייר","מצייר","הייתי מצייר"],"kind":"Printed transformation · item 4","explanation":"הייתי מצייר הופך להיה מצייר בגוף שלישי."}]},
  {"id":"ulpan4-30-ads","title":"מודעות דרושים — קריאה ושאלות","source":"אולפן עברית — חלק רביעי • lesson 30 • PDF page 3 (printed page 351) • original advertisements and printed questions; contact details omitted; choices adapted","he":"למרפאה בפתח-תקווה דרוש/ה רופא/ת שיניים לילדים בעל/ת ניסיון של שנתיים לפחות. נא לשלוח קורות חיים.\nלפארמה - חברה לתרופות דרושה מזכירה רפואית. דרישות התפקיד: ידיעת מושגים רפואיים; אנגלית ברמת שפת אם; שליטה ב״אופיס״. ניסיון - חובה! תואר בביולוגיה - יתרון! נא לפנות בכתב לכתובת.\nלבית-ספר תיכון באזור ירושלים דרושים/ות מורים/ות מנוסים/ות למקצועות: ספרות, היסטוריה, תנ״ך. תנאים טובים למועמדים מתאימים. לפרטים נוספים נא להתקשר ליעקב.","en":"Three job ads seek a pediatric dentist, a medical secretary, and experienced secondary-school teachers. Contact details are omitted.","vocab":[["דרוש/ה","wanted"],["ניסיון","experience"],["קורות חיים","résumé"],["מזכירה רפואית","medical secretary"]],"questions":[{"q":"לאיזו חברה דרושה מזכירה רפואית?","a":"לפארמה - חברה לתרופות","opts":["לפארמה - חברה לתרופות","לבית-הספר בירושלים","למרפאה בפתח-תקווה","לאוניברסיטה"],"kind":"Printed comprehension · question 1","explanation":"המודעה האמצעית פותחת: לפארמה - חברה לתרופות דרושה מזכירה רפואית."},{"q":"לאילו מקצועות דרושים מורים?","a":"ספרות, היסטוריה ותנ״ך","opts":["ספרות, היסטוריה ותנ״ך","מתמטיקה ופיזיקה","אנגלית ומחשבים","כימיה וביולוגיה"],"kind":"Printed comprehension · question 2","explanation":"במודעת בית-הספר רשומים ספרות, היסטוריה ותנ״ך."},{"q":"אילו מורים דרושים לבית-ספר תיכון באזור ירושלים?","a":"מורים/ות מנוסים/ות","opts":["מורים/ות מנוסים/ות","מורים מתחילים בלבד","רופאי שיניים","מזכירות רפואיות"],"kind":"Printed comprehension · question 3","explanation":"המודעה דורשת במפורש מורים/ות מנוסים/ות."},{"q":"מי צריך לשלוח קורות חיים?","a":"רופא/ת שיניים לילדים","opts":["רופא/ת שיניים לילדים","מורה לספרות","מזכירה רפואית","יעקב"],"kind":"Printed comprehension · question 4","explanation":"במודעה למרפאה מופיעה ההוראה נא לשלוח קורות חיים."},{"q":"איך צריכות לפנות מזכירות רפואיות?","a":"בכתב","opts":["בכתב","בטלפון בלבד","בריאיון אישי בלבד","דרך בית-הספר"],"kind":"Printed comprehension · question 5","explanation":"מודעת פארמה אומרת: נא לפנות בכתב."}]},
  {"id":"ulpan4-30-job","title":"חיפוש עבודה — מיכאל","source":"אולפן עברית — חלק רביעי • lesson 30 • PDF page 1 (printed page 349) • original reading; printed completion adapted to choices","he":"מיכאל עזב את עבודתו הקבועה בחיפה ועבר לגור בבאר-שבע משום שהתחתן.\nאחרי שמיכאל ואשתו הסתדרו בדירתם החדשה, הוא התחיל לחפש עבודה באזור הדרום, בסביבות באר-שבע. הוא חיפש במודעות ״דרושים״ בעיתונים ובאתרים באינטרנט.\nהוא שלח קורות חיים לחברות מתאימות. מיכאל מצא הרבה מודעות, אבל רק במודעה אחת הוא מצא את מה שהוא חיפש: תפקיד מעניין, תנאים טובים ומשרה מצוינת.\nמיכאל היה מעוניין במשרה הזאת!\nלפי המודעה דרוש היה מהנדס מחשבים בעל ניסיון של 5 שנים לפחות, ולמיכאל היה רק ניסיון של שנתיים... בכל זאת הוא התקשר לחברה וביקש לשוחח עם המנהל.\nהוא שוחח עם המנהל, שכנע אותו שהוא מועמד מתאים וקבע אתו פגישה לריאיון.","en":"Michael moved from Haifa to Beersheba after marrying. He looked for work, found one appealing ad, and arranged an interview despite having less experience than the ad requested.","vocab":[["מודעות דרושים","job ads"],["קורות חיים","résumé"],["בעל ניסיון","experienced"],["ריאיון","interview"]],"questions":[{"q":"מיכאל חיפש עבודה במודעות _____ בעיתונים ובאתרים באינטרנט.","a":"״דרושים״","opts":["״דרושים״","״דירות״","״טיולים״","״לימודים״"],"kind":"Printed completion · page 1","explanation":"הקטע אומר במפורש: במודעות ״דרושים״."},{"q":"הוא שלח _____ _____ לחברות מתאימות.","a":"קורות חיים","opts":["קורות חיים","ספרי לימוד","מכתבי תודה","תנאים טובים"],"kind":"Printed completion · page 1","explanation":"מיכאל שלח קורות חיים לחברות מתאימות."},{"q":"לפי המודעה היה דרוש מהנדס מחשבים בעל ניסיון של _____ שנים לפחות.","a":"5","opts":["5","2","3","10"],"kind":"Printed completion · page 1","explanation":"המודעה דרשה חמש שנות ניסיון; למיכאל היו שנתיים."},{"q":"הוא שוחח עם המנהל וקבע אתו פגישה ל_____.","a":"ריאיון","opts":["ריאיון","טיול","שיעור","ארוחה"],"kind":"Printed completion · page 1","explanation":"בסוף הקטע מיכאל קובע פגישה לריאיון."}]},
  {"id":"ulpan4-30-marina","title":"יש לה הרבה הוצאות — מרינה","source":"אולפן עברית — חלק רביעי • lesson 30 • PDF page 4 (printed page 352) • original reading and printed comprehension; choices adapted","he":"מרינה - עולה חדשה מרוסיה, אחות במקצועה, גרושה ואם לבת בת שמונה עשרה.\nבתה התחילה ללמוד באוניברסיטה, ולמרינה יש הרבה הוצאות:\nשכר דירה, חשמל, טלפון, גז, מים ועוד. יש לה הרבה חשבונות לשלם...\nמרינה זקוקה לכסף. היא חייבת לעבוד כדי להרוויח כסף.\nהיא מחפשת עבודה (כל עבודה) במשרה חלקית מפני שהיא עדיין לומדת באולפן.","en":"Marina is a divorced nurse from Russia with an eighteen-year-old daughter. She has many expenses and seeks part-time work while continuing her ulpan studies.","vocab":[["הוצאות","expenses"],["זקוקה","needs"],["חייבת","must"],["משרה חלקית","part-time position"]],"questions":[{"q":"מה המצב המשפחתי של מרינה?","a":"גרושה ואם לבת בת שמונה עשרה","opts":["גרושה ואם לבת בת שמונה עשרה","נשואה ואם לשני בנים","רווקה בלי ילדים","אלמנה ואם לתינוק"],"kind":"Printed comprehension · question 1","explanation":"במשפט הראשון מרינה מתוארת כגרושה ואם לבת בת שמונה עשרה."},{"q":"אילו הוצאות יש למרינה?","a":"שכר דירה, חשמל, טלפון, גז ומים","opts":["שכר דירה, חשמל, טלפון, גז ומים","רק כרטיסי טיסה","רק ספרי לימוד","רק בגדים"],"kind":"Printed comprehension · question 2","explanation":"הקטע מונה את החשבונות: שכר דירה, חשמל, טלפון, גז ומים."},{"q":"למה היא זקוקה?","a":"לכסף","opts":["לכסף","למכונית","לכרטיס טיסה","למחשב"],"kind":"Printed comprehension · question 3","explanation":"בקטע נאמר: מרינה זקוקה לכסף."},{"q":"מדוע היא חייבת לעבוד?","a":"כדי להרוויח כסף","opts":["כדי להרוויח כסף","כדי ללמוד באוניברסיטה","כדי לטייל בדרום","כדי לעבור דירה"],"kind":"Printed comprehension · question 4","explanation":"הטקסט אומר שהיא חייבת לעבוד כדי להרוויח כסף."}]},
  {"id":"ulpan4-31-omelet","title":"צמד חמד — שיחה והשלמה","source":"אולפן עברית — חלק רביעי • lesson 31 • PDF pages 10–11 (printed pages 358–359) • selected original dialogue; original future-tense completion adapted to choices","he":"רונית: היי אמיר, מתי תגיע הביתה?\nאמיר: אני בדרך הביתה, אגיע בעוד כ-20 דקות.\nרונית: אמיר, תעשה לי טובה, תיכנס לסופרמרקט ותקנה קמח. בא לי לאפות עוגה.\nאמיר: אין בעיה. אכנס לסופרמרקט ואקנה קמח. איזו עוגה בא לך לאפות?\nרונית: עוד לא החלטתי אם לאפות עוגת גבינה או עוגת שוקולד.\nאמיר: תפתחי את המקרר ותסתכלי אם יש מספיק גבינות.\nרונית: אוי, גמרנו כל הגבינות, אז תקנה גם גבינות...\nאמיר: תקשיבי רונית, אני מציע שאקנה שתי עוגות מוכנות. מה דעתך?\nרונית: אני מסכימה אתך! אתה אף פעם לא טועה!","en":"Ronit asks Amir to buy flour on his way home. They discuss baking a cake, but realize they have no cheese. Amir suggests buying two ready-made cakes.","vocab":[["אגיע","I will arrive"],["תיכנס","you will enter"],["תקנה","you will buy"],["אכין","I will prepare"]],"questions":[{"q":"אמיר _____ הביתה בעוד כ-20 דקות.","a":"יגיע","opts":["יגיע","הגיע","מגיע","תגיע"],"kind":"Printed future completion · page 11","explanation":"התרגיל משנה את דברי אמיר לגוף שלישי: אמיר יגיע."},{"q":"רונית מבקשת מאמיר ש_____ לסופרמרקט ו_____ קמח.","a":"ייכנס, יקנה","opts":["ייכנס, יקנה","נכנס, קנה","אכנס, אקנה","תיכנס, תקנה"],"kind":"Printed future completion · page 11","explanation":"בדיווח על אמיר בגוף שלישי: ייכנס ויקנה."},{"q":"בסוף של דבר אמיר _____ שתי עוגות מוכנות.","a":"יקנה","opts":["יקנה","קנה","קונה","תקנה"],"kind":"Printed future completion · page 11","explanation":"אמיר מציע שאקנה; בדיווח עליו הצורה היא יקנה."}]},
  {"id":"ulpan4-31-vision","title":"חזון אחרית הימים — על פי הנביא ישעיהו","source":"אולפן עברית — חלק רביעי • lesson 31 • PDF page 15 (printed page 363) • original reading and printed true/false; choices adapted","he":"בעתיד, כאשר יבוא המשיח, יהיה שלום - ולא יהיו מלחמות.\nהעמים לא יילחמו זה בזה ולא יהרגו זה את זה.\nהם יהפכו את כלי המלחמה לכלי עבודה חקלאיים.\nירושלים תהיה מרכז העולם, והתורה תצא מירושלים.\nבית המקדש יעמוד על הר גבוה, ומכל העולם יבואו לירושלים כדי ללמוד את תורת האלוהים.\nבאחרית הימים יהיה צדק בעולם. העשירים והחזקים לא ינצלו את העניים ואת החלשים.\nבאחרית הימים הזאב יגור עם הכבש, והנמר ישכב בשדה וינוח עם הגדי.\nהאריה יאכל עשב כמו פרה, וילד קטן ישחק קרוב למקום שבו חי נחש ארסי - ולא יפחד.","en":"This textbook passage describes Isaiah’s vision of future peace and justice, with images of former enemies living together.","vocab":[["יהיה","there will be"],["מלחמות","wars"],["צדק","justice"],["ינצלו","will exploit"]],"questions":[{"q":"באחרית הימים העמים יילחמו זה בזה.","a":"לא נכון","opts":["לא נכון","נכון","לא ידוע","אולי"],"kind":"Printed true/false · item 1","explanation":"הקטע אומר: העמים לא יילחמו זה בזה."},{"q":"כלי עבודה חקלאיים יהפכו לכלי מלחמה.","a":"לא נכון","opts":["לא נכון","נכון","לא ידוע","אולי"],"kind":"Printed true/false · item 2","explanation":"הכיוון בקטע הפוך: כלי המלחמה יהפכו לכלי עבודה חקלאיים."},{"q":"התורה תצא מירושלים.","a":"נכון","opts":["נכון","לא נכון","לא ידוע","אולי"],"kind":"Printed true/false · item 3","explanation":"המשפט מופיע בקטע: התורה תצא מירושלים."},{"q":"יהיה צדק בעולם.","a":"נכון","opts":["נכון","לא נכון","לא ידוע","אולי"],"kind":"Printed true/false · item 4","explanation":"בקטע כתוב: באחרית הימים יהיה צדק בעולם."}]},
  {"id":"ulpan-9-ilana","title":"מידע על אילנה דגן","source":"אולפן עברית • First Part, lesson 9 • PDF page 98 (printed page 110) • original reading and printed comprehension; choices adapted","he":"אילנה דגן ותיקה מאוד בארץ. היא נולדה בברזיל. היא חיה בישראל עשרים שנה.\nאילנה עובדת בבית-ספר ברמת-גן. היא מורה לחינוך גופני.\nאילנה גרה ברמת-גן עם ההורים שלה, ברחוב ביאליק מספר 9.\nאילנה בחורה צעירה ויפה.\nהיא לא גבוהה ולא נמוכה. היא לא שמנה ולא רזה. היא חתיכה!\nאילנה – רווקה בת 25.\nהיא מחפשת חבר. היא רוצה להכיר בחור לקשר רציני.\nהיא נכנסת לאינטרנט, לאתר ההיכרויות ״קופידון״.\nבאתר היא מכירה בחור מקסים בשם יצחק פרידמן.","en":"Ilana Dagan was born in Brazil and has lived in Israel for twenty years. She teaches physical education in Ramat Gan, lives with her parents, and wants a serious relationship. She meets Yitzhak Friedman on a dating site.","vocab":[["ותיקה","long established"],["חינוך גופני","physical education"],["רווקה","single woman"],["קשר רציני","serious relationship"]],"questions":[{"q":"איפה נולדה אילנה דגן?","a":"בברזיל","opts":["בברזיל","בישראל","ברמת-גן","בחיפה"],"kind":"Printed comprehension · question 1","explanation":"המשפט הראשון אומר: היא נולדה בברזיל."},{"q":"כמה שנים היא חיה בישראל?","a":"עשרים שנה","opts":["עשרים שנה","עשר שנים","עשרים וחמש שנה","שנתיים"],"kind":"Printed comprehension · question 2","explanation":"בקטע כתוב: היא חיה בישראל עשרים שנה."},{"q":"מה המקצוע שלה?","a":"מורה לחינוך גופני","opts":["מורה לחינוך גופני","מורה למוזיקה","רופאה","עורכת דין"],"kind":"Printed comprehension · question 3","explanation":"הקטע אומר שאילנה מורה לחינוך גופני."},{"q":"מה אילנה רוצה?","a":"להכיר בחור לקשר רציני","opts":["להכיר בחור לקשר רציני","לעבוד בחקלאות","ללמוד באוניברסיטה","לעבור לברזיל"],"kind":"Printed comprehension · question 4","explanation":"בפרופיל כתוב: היא רוצה להכיר בחור לקשר רציני."},{"q":"מה היא עושה באינטרנט?","a":"נכנסת לאתר ההיכרויות ״קופידון״","opts":["נכנסת לאתר ההיכרויות ״קופידון״","קוראת עיתון","שומעת מוזיקה","מזמינה כרטיסים"],"kind":"Printed comprehension · question 5","explanation":"היא נכנסת לאתר ההיכרויות קופידון, ושם מכירה את יצחק."}]},
  {"id":"ulpan-7-notes","title":"הפתק — שרה ודני","source":"אולפן עברית • lesson 7 • PDF pages 73–74 (printed pages 85–86) • original note excerpts and printed comprehension adapted to choices","he":"יוסי חוזר הביתה מהעבודה. אף אחד לא נמצא בבית. על השולחן הוא רואה פתק. הוא קורא...\nהיי יוסי, אני צריכה ללכת לבית הספר לדבר עם המורה של דן. המורה רוצה לדבר עם ההורים של הילדים על המסיבה לחג החנוכה. אני מקווה להיות בבית בשבע בערב (19:00). להתראות, שרה.\n[...]\nאימא, אני נמצא בגן הציבורי. אני משחק כדורגל עם החברים מהכיתה. אני חוזר הביתה בשש בערב (18:00). אל תדאגי! דני.","en":"Sarah and Danny leave separate notes explaining where they are and when they will return.","vocab":[],"questions":[{"q":"למי הפתק?","a":"ליוסי","opts":["ליוסי","לשרה","לדני","למורה"],"kind":"Printed comprehension · PDF 73 · adapted choices","explanation":"שרה פותחת את הפתק: היי יוסי."},{"q":"ממי הפתק הראשון?","a":"משרה","opts":["משרה","מיוסי","מדני","מהמורה"],"kind":"Printed comprehension · PDF 73 · adapted choices","explanation":"הפתק הראשון נחתם בשם שרה."},{"q":"לאן שרה צריכה ללכת?","a":"לבית הספר","opts":["לבית הספר","לבנק","לשוק","לגן הציבורי"],"kind":"Printed comprehension · PDF 73 · adapted choices","explanation":"שרה כותבת שהיא צריכה ללכת לבית הספר לדבר עם המורה של דן."},{"q":"איפה דני נמצא?","a":"בגן הציבורי","opts":["בגן הציבורי","בבית הספר","בבית","בבנק"],"kind":"Printed comprehension · PDF 74 · adapted choices","explanation":"דני כותב לאימא: אני נמצא בגן הציבורי."},{"q":"מתי דני חוזר הביתה?","a":"בשש בערב","opts":["בשש בערב","בשבע בערב","בחמש בערב","בשמונה בערב"],"kind":"Printed comprehension · PDF 74 · adapted choices","explanation":"דני כותב: אני חוזר הביתה בשש בערב (18:00)."}]},
  {"id":"ulpan-7-tradition","title":"בחור שומר מסורת — מילות זמן","source":"אולפן עברית • lesson 7 • PDF page 75 (printed page 87) • selected original reading; frequency exercise adapted to choices","he":"יצחק פרידמן – בחור נחמד מאוד. הוא לא דתי. הוא שומר מסורת. יצחק אף פעם לא עובד בשבת. הוא אף פעם לא אוכל בשר וחלב יחד. בפסח הוא אף פעם לא אוכל לחם. בפסח – הוא תמיד אוכל מצות. [...] ביום הכיפורים – הוא תמיד צם, ותמיד הוא מתפלל בבית הכנסת. בדרך כלל יצחק הולך לבית כנסת בחגים. לפעמים הוא מתפלל בבית הכנסת גם בשבת. יצחק אף פעם לא שותה ויסקי או וודקה. לפעמים הוא שותה בירה. בדרך כלל יצחק שותה יין בחגים. לפעמים הוא שותה יין אדום, ולפעמים הוא שותה יין לבן.","en":"The reading uses תמיד, בדרך כלל, לפעמים, and אף פעם לא to describe Yitzhak’s habits.","vocab":[],"questions":[{"q":"בפסח, מה יצחק תמיד אוכל?","a":"מצות","opts":["מצות","לחם","בשר וחלב","עוגה"],"kind":"Supplemental comprehension · PDF 75","explanation":"בקטע כתוב: בפסח – הוא תמיד אוכל מצות."},{"q":"ביום הכיפורים, מה יצחק עושה?","a":"צם ומתפלל בבית הכנסת","opts":["צם ומתפלל בבית הכנסת","עובד בבית","אוכל לחם","שותה בירה"],"kind":"Supplemental comprehension · PDF 75","explanation":"בקטע כתוב שביום הכיפורים הוא תמיד צם ומתפלל בבית הכנסת."},{"q":"השלימו מן הקטע: יצחק _____ עובד בשבת.","a":"אף פעם לא","opts":["אף פעם לא","תמיד","לפעמים","בדרך כלל"],"kind":"Source sentence fill-in · PDF 75","explanation":"הקריאה אומרת: יצחק אף פעם לא עובד בשבת."}]},
  {"id":"ulpan-7-apartment","title":"יש חדש! — דירה ומספרים","source":"אולפן עברית • lesson 7 • PDF page 78 (printed page 90) • original dialogue; printed number questions on PDF page 79 adapted to choices","he":"דינה: היי יוסי, מה נשמע? מה חדש?\nיוסי: יש חדש! אני גר בדירה שכורה על־יד האוניברסיטה.\nדינה: כמה חדרים יש בדירה?\nיוסי: בדירה יש שלושה חדרים גדולים, מטבח אחד, שני שירותים ואמבטיה אחת.\nדינה: אתה גר לבד?\nיוסי: לא, אני גר עם שני חברים.\n[...]\nדינה: יש מרפסת בדירה?\nיוסי: יש שתיים!\nדינה: יש רהיטים בדירה?\nיוסי: כן. יש שלוש מיטות, שלושה שולחנות, שני ארונות, חמישה כיסאות, טלוויזיה אחת ושלושה מחשבים.\nדינה: איזה יופי! מתי אני יכולה לבוא לשתות כוס קפה?\nיוסי: תמיד!","en":"Yossi describes his apartment with the lesson’s cardinal numbers.","vocab":[],"questions":[{"q":"כמה חדרים יש בדירה?","a":"שלושה","opts":["שלושה","שניים","חמישה","אחד"],"kind":"Printed dialogue question · adapted choices","explanation":"יוסי אומר: בדירה יש שלושה חדרים גדולים."},{"q":"כמה חברים גרים עם יוסי?","a":"שניים","opts":["שניים","שלושה","אחד","חמישה"],"kind":"Printed dialogue question · adapted choices","explanation":"יוסי אומר: אני גר עם שני חברים."},{"q":"כמה מרפסות יש בדירה?","a":"שתיים","opts":["שתיים","אחת","שלוש","חמש"],"kind":"Printed dialogue question · adapted choices","explanation":"דינה שואלת על מרפסת ויוסי עונה: יש שתיים!"}]},
  {"id":"ulpan-8-mythology","title":"מן המיתולוגיה — יש / אין","source":"אולפן עברית • lesson 8 • PDF page 81 (printed page 93) • original reading and printed comprehension adapted to choices","he":"לספינקס היווני יש ראש של אישה, גוף של כלב וכנפיים. או: ראש של אישה, חזה של אישה, גוף של אריה וכנפיים. לספינקס המצרי יש גוף של אריה וראש של המלך פרעה. לספינקס המצרי אין כנפיים. בת הים חיה במים. לבת הים יש חצי גוף של אישה וחצי גוף של דג.","en":"A short reading compares the Greek and Egyptian sphinx and the mermaid using יש and אין.","vocab":[],"questions":[{"q":"למי יש ראש של אישה?","a":"לספינקס היווני","opts":["לספינקס היווני","לספינקס המצרי","למלך פרעה","לבת הים"],"kind":"Printed comprehension · adapted choices","explanation":"הקריאה פותחת: לספינקס היווני יש ראש של אישה."},{"q":"למי אין כנפיים?","a":"לספינקס המצרי","opts":["לספינקס המצרי","לספינקס היווני","לבת הים","לכלב"],"kind":"Printed comprehension · adapted choices","explanation":"בקטע נאמר: לספינקס המצרי אין כנפיים."},{"q":"למי יש חצי גוף של דג?","a":"לבת הים","opts":["לבת הים","לספינקס היווני","למלך פרעה","לספינקס המצרי"],"kind":"Printed comprehension · adapted choices","explanation":"המשפט האחרון אומר שלבת הים יש חצי גוף של דג."}]},
  {"id":"ulpan-8-roni","title":"יש לי • אין לי — השיחה","source":"אולפן עברית • lesson 8 • PDF page 84 (printed page 96) • selected original dialogue; printed questions adapted to choices","he":"לרוני יש בעיה... הוא מתקשר לאימא שלו...\nרוני: אימא, יש לך זמן?\nאימא: לא, אין לי זמן עכשיו. אני עסוקה.\nרוני: אבל יש לי בעיה...\nאימא: מה הבעיה שלך?\nרוני: יש בעיה במחשב, ואני לא יכול לשחק...\nאימא: יש לך סבלנות?\nרוני: כן, יש לי סבלנות.\nאימא: יופי! אני יוצאת מהעבודה עוד מעט. אל תדאג! הכול יהיה בסדר!","en":"Roni asks his mother for help with his computer and practices יש לי/אין לי.","vocab":[],"questions":[{"q":"למי יש בעיה?","a":"לרוני","opts":["לרוני","לאימא","ליוסי","לדני"],"kind":"Printed comprehension · adapted choices","explanation":"פתיחת השיחה אומרת: לרוני יש בעיה."},{"q":"למי אין זמן?","a":"לאימא","opts":["לאימא","לרוני","ליוסי","לשרה"],"kind":"Printed comprehension · adapted choices","explanation":"אימא אומרת: אין לי זמן עכשיו."},{"q":"מה הבעיה של רוני?","a":"יש בעיה במחשב","opts":["יש בעיה במחשב","אין לו סבלנות","הוא לא בבית","אין לו ספר"],"kind":"Printed comprehension · adapted choices","explanation":"רוני אומר: יש בעיה במחשב, ואני לא יכול לשחק."}]},
  {"id":"ulpan-5-golan-family","title":"משפחת גולן — קריאה ושאלות","source":"אולפן עברית • lesson 5 • PDF page 56 (printed page 68) • original reading; printed comprehension adapted to choices","he":"שמי רינה גולן. אני בת 32. אני נשואה. הבעל שלי, יעקב, נחמד וחכם. יעקב בן 36. הוא רופא. הוא עובד בקופת־חולים. הוא מטפל בחולים. המקצוע שלי – אחות. אבל עכשיו אני לא עובדת בבית חולים, ואני לא מטפלת בחולים. אני נשארת בבית ומטפלת בילדים שלי מפני שהילדים שלי קטנים. הבן שלי, גדי, הולך לגן ילדים. הוא בן 4. הבת שלי, דנה, לומדת בבית־ספר, היא הולכת לכיתה א׳. דנה בת 6. הילדים שלי טובים מאוד. המשפחה שלי קטנה ונחמדה מאוד.","en":"Rina introduces her husband, children, and current work at home.","vocab":[],"questions":[{"q":"בת כמה דנה?","a":"בת 6","opts":["בת 6","בת 4","בת 32","בת 36"],"kind":"Printed comprehension · adapted choices","explanation":"בסוף הקריאה נאמר: דנה בת 6."},{"q":"בן כמה גדי?","a":"בן 4","opts":["בן 4","בן 6","בן 32","בן 36"],"kind":"Printed comprehension · adapted choices","explanation":"בקטע כתוב על גדי: הוא בן 4."},{"q":"למה רינה נשארת בבית?","a":"מפני שהילדים שלה קטנים","opts":["מפני שהילדים שלה קטנים","מפני שהיא לומדת באולפן","מפני שיעקב נשאר בבית","מפני שדנה רופאה"],"kind":"Printed comprehension · adapted choices","explanation":"רינה אומרת: אני נשארת בבית ומטפלת בילדים שלי מפני שהילדים שלי קטנים."},{"q":"מה המקצוע של יעקב?","a":"רופא","opts":["רופא","אחות","מורה","סופר"],"kind":"Printed comprehension · adapted choices","explanation":"רינה אומרת על יעקב: הוא רופא."}]},
  {"id":"ulpan-5-weekend-travel","title":"לאן הם נוסעים בסוף השבוע? — קריאה","source":"אולפן עברית • lesson 5 • PDF page 58 (printed page 70) • selected original reading with marked omission; printed questions adapted to choices","he":"מיכאל, דינה ושרה סטודנטים. הם לומדים באוניברסיטה העברית בירושלים. הם גרים בדירה שכורה על־יד האוניברסיטה, הדירה שלהם גדולה. בדירה יש 3 חדרים. [...] בסוף השבוע הם נוסעים למשפחות שלהם. המשפחה של מיכאל גרה בקיבוץ דגניה. ההורים שלו עובדים בקיבוץ. [...] המשפחה של דינה גרה בפתח־תקווה. אבא שלה מהנדס, ואימא שלה עובדת כמזכירה במשרד של עורך־דין מפורסם בתל־אביב. [...] ההורים שלה גרושים. אבא שלה גר בחיפה, ואימא שלה גרה באילת. לפעמים היא נוסעת לאבא, ולפעמים לאימא. בדרך כלל היא נוסעת לסבא ולסבתא שלה מפני שהם גרים בירושלים.","en":"Three students travel to their families over the weekend.","vocab":[],"questions":[{"q":"לאן הם נוסעים בסוף השבוע?","a":"למשפחות שלהם","opts":["למשפחות שלהם","לאוניברסיטה","למשרד","לבית הספר"],"kind":"Printed comprehension · adapted choices","explanation":"בקטע כתוב: בסוף השבוע הם נוסעים למשפחות שלהם."},{"q":"איפה עובדים ההורים של מיכאל?","a":"בקיבוץ","opts":["בקיבוץ","באוניברסיטה","בבית חולים","באילת"],"kind":"Printed comprehension · adapted choices","explanation":"הקריאה אומרת: ההורים שלו עובדים בקיבוץ."},{"q":"לאן שרה נוסעת בדרך כלל?","a":"לסבא ולסבתא שלה בירושלים","opts":["לסבא ולסבתא שלה בירושלים","לאבא שלה בחיפה","לאימא שלה באילת","לקיבוץ דגניה"],"kind":"Printed comprehension · adapted choices","explanation":"בסוף הקטע כתוב שבדרך כלל שרה נוסעת לסבא ולסבתא שלה בירושלים."}]},
  {"id":"ulpan-6-good-student","title":"תלמידה טובה — דיאלוג והשלמה","source":"אולפן עברית • lesson 6 • PDF page 71 (printed page 83) • original dialogue and printed fill-in; choices adapted","he":"אבא: אנחנו נוסעים לטייל בצפון, את רוצה לבוא?\nדינה: אני רוצה לבוא, אבל אני לא יכולה. אני צריכה להישאר בבית.\nאבא: למה את צריכה להישאר בבית?\nדינה: מפני שאני צריכה ללמוד לבחינה באנגלית.\nאבא: אין בעיה. את יכולה להישאר בבית. יש אוכל במקרר.\nדינה: מתי אתם חוזרים הביתה?\nאבא: אנחנו מקווים להיות בבית בערב. להתראות...\nדינה: להתראות בערב!\n\nא. השלימו לפי הדיאלוג:\nדינה רוצה _____ לטיול, אבל היא לא יכולה. היא צריכה _____ בבית מפני שהיא צריכה _____ לבחינה באנגלית. ההורים של דינה מקווים _____ בבית בערב.","en":"Dina wants to travel but needs to study for an English exam.","vocab":[],"questions":[{"q":"דינה רוצה _____ לטיול, אבל היא לא יכולה.","a":"לבוא","opts":["לבוא","ללמוד","להישאר","להיות"],"kind":"Printed fill-in · adapted choices","explanation":"דינה אומרת: אני רוצה לבוא, אבל אני לא יכולה."},{"q":"היא צריכה _____ בבית","a":"להישאר","opts":["להישאר","לבוא","לאכול","לנסוע"],"kind":"Printed fill-in · adapted choices","explanation":"דינה אומרת: אני צריכה להישאר בבית."},{"q":"מפני שהיא צריכה _____ לבחינה באנגלית.","a":"ללמוד","opts":["ללמוד","לשתות","להישאר","לטייל"],"kind":"Printed fill-in · adapted choices","explanation":"דינה צריכה ללמוד לבחינה באנגלית."},{"q":"ההורים של דינה מקווים _____ בבית בערב.","a":"להיות","opts":["להיות","ללמוד","לבוא","לשתות"],"kind":"Printed fill-in · adapted choices","explanation":"אבא אומר: אנחנו מקווים להיות בבית בערב."}]},
  {"id": "ulpan-3-eilat-dialogue", "title": "על חוף הים באילת — דיאלוג והשלמה", "source": "אולפן עברית • lesson 3 • PDF page 33 (printed page 45) • selected original dialogue with marked omissions; printed completion adapted to choices", "he": "יונתן: שלום, שמי יונתן, מה שמך?\nסימה: שלום, אני מצטערת. אני לא מבינה.\n[...]\nיונתן: את עולה חדשה?\nסימה: לא, אני תיירת.\n[...]\nיונתן: עכשיו אני לא עובד ולא לומד. אני ב״חופש״! אני מטייל באילת, ומדבר עם בחורה נחמדה...", "en": "Yonatan meets Sima on the beach in Eilat; he is on vacation.", "vocab": [], "questions": [{"q": "השלימו מן הדיאלוג: עכשיו הוא _____ לומד ולא עובד.", "a": "לא", "opts": ["לא", "כן", "גם", "רק"], "kind": "Printed dialogue completion · adapted choices", "explanation": "יונתן אומר: עכשיו אני לא עובד ולא לומד."}, {"q": "השלימו מן הדיאלוג: עכשיו הוא ב״_____״.", "a": "חופש", "opts": ["חופש", "בנק", "משרד", "בית ספר"], "kind": "Printed dialogue completion · adapted choices", "explanation": "יונתן אומר במפורש שהוא ב״חופש״."}, {"q": "איפה יונתן מטייל?", "a": "באילת", "opts": ["באילת", "בחיפה", "בירושלים", "בכרמיאל"], "kind": "Supplemental comprehension", "explanation": "הוא אומר: אני מטייל באילת."}]} ,
  {"id": "ulpan-3-work-professions", "title": "על עבודה ומקצוע", "source": "אולפן עברית • lesson 3 • PDF page 35 (printed page 47) • selected original Hebrew with marked omissions; printed comprehension adapted to choices", "he": "דן פקיד. הוא עובד בבנק. הוא עובד כפקיד. [...] יצחק עובד כשומר בקניון. חנה עובדת כמוכרת בחנות. דנה עובדת כמלצרית במסעדה. [...] בוריס עובד כרופא בבית־חולים.", "en": "The reading introduces people, their jobs, and where they work.", "vocab": [], "questions": [{"q": "מי עובד כשומר?", "a": "יצחק", "opts": ["יצחק", "דן", "בוריס", "דנה"], "kind": "Printed comprehension · adapted choices", "explanation": "הקטע אומר שיצחק עובד כשומר בקניון."}, {"q": "איפה דנה עובדת?", "a": "במסעדה", "opts": ["במסעדה", "בבנק", "בקניון", "בבית־חולים"], "kind": "Printed comprehension · adapted choices", "explanation": "דנה עובדת כמלצרית במסעדה."}, {"q": "מי רופא?", "a": "בוריס", "opts": ["בוריס", "יצחק", "דן", "חנה"], "kind": "Printed comprehension · adapted choices", "explanation": "בוריס עובד כרופא בבית־חולים."}]} ,
  {"id": "ulpan-4-kfar-saba", "title": "כפר־סבא — מקומות בעיר", "source": "אולפן עברית • lesson 4 • PDF page 41 (printed page 53) • selected original Hebrew with marked omissions; place questions adapted", "he": "העיר כפר־סבא נוסדה ב־1903. היא עיר קטנה ויפה מאוד. בכפר־סבא הכול במרכז. השוק על־יד העירייה. העירייה על־יד התחנה המרכזית. הספרייה מול הקניון. ואיפה האולפן? האולפן בין השוק ובין הקניון.", "en": "The short reading locates the market, city hall, library, and ulpan in Kfar Saba.", "vocab": [], "questions": [{"q": "איפה השוק?", "a": "על־יד העירייה", "opts": ["על־יד העירייה", "מול הקניון", "בין השוק ובין הקניון", "בתוך הספרייה"], "kind": "Supplemental place comprehension", "explanation": "בקטע כתוב: השוק על־יד העירייה."}, {"q": "איפה האולפן?", "a": "בין השוק ובין הקניון", "opts": ["בין השוק ובין הקניון", "על־יד התחנה המרכזית", "מול הספרייה", "בתוך העירייה"], "kind": "Supplemental place comprehension", "explanation": "הקטע אומר שהאולפן בין השוק ובין הקניון."}]} ,
  {"id": "ulpan-4-office", "title": "יש ב... • אין ב... • נמצא", "source": "אולפן עברית • lesson 4 • PDF page 46 (printed page 58) • selected original reading; printed comprehension adapted to choices", "he": "יוסף כהן עורך־דין. הוא עובד במשרד גדול בתל־אביב. במשרד יש שולחן גדול ויפה. על השולחן יש טלפון. על־יד הטלפון יש מחשב יקר. יש גם פקס במשרד. במשרד אין טלוויזיה. היום מר כהן לא נמצא במשרד, הוא נמצא בבית משפט. רק המזכירה, גברת לוי, נמצאת היום במשרד.", "en": "An office reading practices existence, absence, and location.", "vocab": [], "questions": [{"q": "מה יש במשרד של מר כהן?", "a": "שולחן, טלפון ומחשב", "opts": ["שולחן, טלפון ומחשב", "טלוויזיה בלבד", "כיתה וקניון", "ספרייה וים"], "kind": "Printed comprehension · adapted choices", "explanation": "הקריאה מציינת שולחן, טלפון ומחשב במשרד."}, {"q": "מה אין במשרד?", "a": "טלוויזיה", "opts": ["טלוויזיה", "טלפון", "מחשב", "שולחן"], "kind": "Printed comprehension · adapted choices", "explanation": "בקטע נאמר במפורש: במשרד אין טלוויזיה."}, {"q": "איפה נמצא היום מר כהן?", "a": "בבית משפט", "opts": ["בבית משפט", "במשרד", "בספרייה", "בקניון"], "kind": "Printed comprehension · adapted choices", "explanation": "מר כהן אינו במשרד היום; הוא נמצא בבית משפט."}, {"q": "מי נמצאת היום במשרד?", "a": "גברת לוי", "opts": ["גברת לוי", "מר כהן", "דנה", "רחל"], "kind": "Printed comprehension · adapted choices", "explanation": "רק המזכירה, גברת לוי, נמצאת היום במשרד."}]} ,
  {"id": "ulpan-4-karmiel-cloze", "title": "האולפן בכרמיאל — השלמה", "source": "אולפן עברית • lesson 4 • PDF page 48 (printed page 60) • selected original fill-in with blanks preserved; choices adapted", "he": "באולפן לומדים עברית. בכרמיאל יש אולפן. באולפן בכרמיאל יש _____ כיתות. [...] אין בכיתה טלוויזיה, _____ רדיו, ואין מחשב. [...] היום לא כל התלמידים _____ בכיתה.", "en": "The printed passage asks learners to fill blanks about the ulpan in Karmiel.", "vocab": [], "questions": [{"q": "באולפן בכרמיאל יש _____ כיתות.", "a": "הרבה", "opts": ["הרבה", "אין", "חדש", "חלו"], "kind": "Printed fill-in · adapted choices", "explanation": "ברשימת המילים הרבה מתאים לכמות הכיתות."}, {"q": "אין בכיתה טלוויזיה, _____ רדיו, ואין מחשב.", "a": "אין", "opts": ["אין", "יש", "הרבה", "חדש"], "kind": "Printed fill-in · adapted choices", "explanation": "המשפט מונה דברים שאינם בכיתה; לכן גם לפני רדיו בא אין."}, {"q": "היום לא כל התלמידים _____ בכיתה.", "a": "נמצאים", "opts": ["נמצאים", "נמצאות", "נמצא", "נמצאת"], "kind": "Printed fill-in · adapted choices", "explanation": "התלמידים הוא רבים זכר; הצורה המתאימה היא נמצאים."}]} ,
  {"id": "ulpan-2-bank-dialogue", "title": "בבנק — יעקב לוי", "source": "אולפן עברית • lesson 2 • PDF page 19 (printed page 31) • selected original dialogue with marked omissions; printed comprehension adapted to choices", "he": "פקידה: שלום, מה שמך?\nיעקב: שלום, אני יעקב לוי.\nפקידה: איפה אתה גר?\nיעקב: אני גר ברחוב ויצמן מספר 3 (שלוש).\n[...]\nפקידה: למה אתה עובד רק בערב?\nיעקב: כי בבוקר אני לומד עברית באולפן. אני עולה חדש.", "en": "At the bank, Yaakov explains that he works in the evening because he studies Hebrew at the ulpan in the morning.", "vocab": [], "questions": [{"q": "מתי יעקב עובד?", "a": "בערב", "opts": ["בערב", "בבוקר", "בשבת", "בלילה"], "kind": "Printed comprehension · adapted choices", "explanation": "הפקידה אומרת שהוא עובד רק בערב."}, {"q": "למה יעקב עובד בערב?", "a": "כי בבוקר הוא לומד עברית באולפן", "opts": ["כי בבוקר הוא לומד עברית באולפן", "כי הוא גר בחיפה", "כי הוא עובד בספרייה", "כי הוא לומד בלילה"], "kind": "Printed comprehension · adapted choices", "explanation": "יעקב מסביר שבבוקר הוא לומד עברית באולפן."}, {"q": "מתי יעקב לומד באולפן?", "a": "בבוקר", "opts": ["בבוקר", "בערב", "בשבת", "בלילה"], "kind": "Printed comprehension · adapted choices", "explanation": "יעקב אומר: כי בבוקר אני לומד עברית באולפן."}]} ,
  {"id": "ulpan-2-good-friends", "title": "חברים טובים", "source": "אולפן עברית • lesson 2 • PDF page 22 (printed page 34) • selected original reading; printed comprehension adapted to choices", "he": "מיכאל ואני סטודנטים. אנחנו לומדים באוניברסיטה בתל־אביב. אנחנו גרים בתל־אביב על־יד הים. מיכאל לומד היסטוריה, ואני לומדת גאוגרפיה. אנחנו גם עובדים. מיכאל עובד במסעדה, ואני עובדת בספרייה. בשבת אנחנו מטיילים על חוף הים. אנחנו חברים טובים מאוד.", "en": "Two friends study, work, and walk on the beach in Tel Aviv.", "vocab": [], "questions": [{"q": "איפה הם לומדים?", "a": "באוניברסיטה בתל־אביב", "opts": ["באוניברסיטה בתל־אביב", "בבית ספר בחיפה", "באולפן בירושלים", "במסעדה"], "kind": "Printed comprehension · adapted choices", "explanation": "הקריאה אומרת שהם לומדים באוניברסיטה בתל־אביב."}, {"q": "איפה הם גרים?", "a": "בתל־אביב על־יד הים", "opts": ["בתל־אביב על־יד הים", "בחיפה", "בירושלים", "בכרמיאל"], "kind": "Printed comprehension · adapted choices", "explanation": "הם גרים בתל־אביב על־יד הים."}, {"q": "איפה הם עובדים? — מיכאל", "a": "במסעדה", "opts": ["במסעדה", "בספרייה", "בבנק", "בבית ספר"], "kind": "Printed comprehension · adapted choices", "explanation": "מיכאל עובד במסעדה; המספרת עובדת בספרייה."}, {"q": "איפה הם עובדים? — המספרת", "a": "בספרייה", "opts": ["בספרייה", "במסעדה", "בבנק", "באולפן"], "kind": "Printed comprehension · adapted choices", "explanation": "המספרת אומרת: ואני עובדת בספרייה."}]} ,
  {"id": "shnayim-10-communication-language", "title": "שפת תקשורת", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 275 (printed page 263) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "אליעזר זמנהוף (1859–1917) [...] לכן הוא החליט להמציא שפה שתהיה שפת תקשורת בין העמים השונים. [...] האספרנטו לא הצליחה להיות השפה של כל העולם. היא היום שפתם של שני מיליון איש בערך. היום האנגלית היא שפת התקשורת בין עמים רבים.", "en": "Zamenhof proposes Esperanto for communication among peoples; English later becomes a common communication language.", "vocab": [], "questions": [{"q": "מי החליט להמציא שפת תקשורת בין עמים?", "a": "אליעזר זמנהוף", "opts": ["אליעזר זמנהוף", "אליעזר בן־יהודה", "זאב ז׳בוטינסקי", "לואי ברייל"], "kind": "Supplemental comprehension", "explanation": "הפתיחה מציגה את זמנהוף והקטע מתאר את החלטתו."}, {"q": "למה רצה זמנהוף להמציא שפה חדשה?", "a": "כדי שתהיה שפת תקשורת בין העמים", "opts": ["כדי שתהיה שפת תקשורת בין העמים", "כדי להחליף רק את העברית", "כדי שלא יקראו ספרים", "כדי ללמד רק רופאים"], "kind": "Supplemental comprehension", "explanation": "המשפט שבקטע מגדיר את מטרת השפה החדשה."}, {"q": "האם האספרנטו נעשתה שפת העולם כולו?", "a": "לא", "opts": ["לא", "כן", "רק באירופה", "רק בישראל"], "kind": "Adapted from printed choice on PDF 277", "explanation": "הקטע אומר במפורש שלא הצליחה להיות השפה של כל העולם."}, {"q": "מהי היום שפת התקשורת בין עמים רבים לפי הקטע?", "a": "אנגלית", "opts": ["אנגלית", "אספרנטו", "עברית", "לטינית"], "kind": "Supplemental comprehension", "explanation": "המשפט האחרון מציין את האנגלית."}]},
  {"id": "shnayim-10-disappearing-languages", "title": "שפות נעלמות", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 277 (printed page 265) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "יש בעולם כ־7,000 שפות, ובין השפות האלה כ־3,000 שפות נעלמות לאט לאט. רוב הדוברים שלהן מבוגרים שלא מדברים בשפה שלהם עם ילדיהם. [...] השפות האלה נעלמו ונשכחו ממפת השפות ואף אחד לא מדבר בהן.", "en": "The reading describes thousands of languages and why some disappear.", "vocab": [], "questions": [{"q": "כמה שפות יש בעולם לפי הקריאה?", "a": "כ־7,000", "opts": ["כ־7,000", "כ־700", "כ־70", "כ־70,000"], "kind": "Supplemental comprehension", "explanation": "המשפט הראשון נותן את המספר כ־7,000."}, {"q": "כמה מן השפות נעלמות לאט לאט?", "a": "כ־3,000", "opts": ["כ־3,000", "כ־30", "כ־300", "כ־30,000"], "kind": "Supplemental comprehension", "explanation": "במשפט הפתיחה מופיע המספר כ־3,000."}]},
  {"id": "shnayim-10-hotel-dialogue", "title": "הוא בא ליומיים ויישאר יומיים־שלושה", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 281 (printed page 268–269) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "– מלון ״אספרנטו״?\n– כן.\n– אני רוצה לבוא יומיים למלון שלכם. שבועיים זה טוב?\n– אני לא מבין.\n[...]\n– רגע, קודם שיעור בעברית, בחינם. מעכשיו אתה אומר: אני רוצה לבוא ליומיים, ואולי אני אשאר יומיים או שלושה ימים.", "en": "A hotel caller discusses how many days he will stay and receives a brief Hebrew lesson.", "vocab": [], "questions": [{"q": "לכמה זמן רצה האורח לבוא בתחילת השיחה?", "a": "יומיים", "opts": ["יומיים", "שבועיים", "שנה", "חודשיים"], "kind": "Supplemental comprehension", "explanation": "הוא אומר ״אני רוצה לבוא יומיים״; השיחה מתקנת את הצורה ל־ליומיים."}, {"q": "איזה שיעור מוצע לו בחינם?", "a": "שיעור בעברית", "opts": ["שיעור בעברית", "שיעור בציור", "שיעור במחשבים", "שיעור ברפואה"], "kind": "Supplemental comprehension", "explanation": "הדובר אומר ״קודם שיעור בעברית, בחינם״."}]},
  {"id": "shnayim-10-bilingual", "title": "חינוך דו־לשוני", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 283 (printed page 271) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "ילדים דוברי ערבית ודוברי עברית צריכים ללמוד את שתי השפות כבר בגן הילדים. אנשי חינוך מדברים על בתי ספר דו־לשוניים.", "en": "The printed discussion bubble proposes learning both Hebrew and Arabic in bilingual education.", "vocab": [], "questions": [{"q": "אילו שתי שפות מציעים לילדים ללמוד?", "a": "עברית וערבית", "opts": ["עברית וערבית", "לטינית וספרדית", "רק עברית", "רק ערבית"], "kind": "Supplemental comprehension from printed discussion bubble", "explanation": "הבועה אומרת שילדים דוברי עברית וערבית צריכים ללמוד את שתי השפות."}]},
  {"id": "shnayim-10-cheese-book", "title": "רוצה לפתוח עסק? — מי הזיז את הגבינה שלי", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 285 (printed page 272) • selected original fill-in lines with blanks preserved; choices adapted", "he": "בשנת 1998 פרסם הסופר ספנסר ג׳ונסון ספר בשם: ״מי ______ (להזיז, עבר) את הגבינה שלי?״ בספר הוא מספר על שני עכברים ושני גמדים. העכברים והגמדים רגילים לאכול גבינה, שנמצאת תמיד במקום קבוע. אבל יום אחד מישהו ______ (להזיז, עבר) את הגבינה ושם אותה במקום אחר.", "en": "The printed verb fill-in introduces the moving-cheese story.", "vocab": [], "questions": [{"q": "מי _____ את הגבינה שלי? (להזיז, עבר)", "a": "הזיז", "opts": ["הזיז", "מזיז", "יזיז", "הזיזה"], "kind": "Printed fill-in with adapted choices", "explanation": "בשם הספר נדרש עבר זכר יחיד: הזיז."}, {"q": "מה הועבר למקום אחר בסיפור?", "a": "הגבינה", "opts": ["הגבינה", "הספרים", "המכונית", "השולחן"], "kind": "Supplemental comprehension", "explanation": "בסיפור מישהו הזיז את הגבינה ממקומה."}]},
  {"id": "shnayim-10-professions", "title": "מקצועות נעלמים", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 285 (printed page 273) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "מי שמע על מקצועות כמו חלבן, דוור, מדליק פנסים או כותב מכתבים? אלה מקצועות שעברו מן העולם, ובמקומם ״נולדו״ מקצועות אחרים, כמו טכנאי חשמל, מתווך דירות, סוכן נסיעות וסוכן ביטוח.", "en": "The reading contrasts older occupations with newer ones.", "vocab": [], "questions": [{"q": "איזה מקצוע נזכר כמקצוע שעבר מן העולם?", "a": "חלבן", "opts": ["חלבן", "סוכן ביטוח", "מתווך דירות", "טכנאי חשמל"], "kind": "Supplemental comprehension", "explanation": "חלבן מופיע ברשימת המקצועות הישנים."}]},
  {"id": "shnayim-10-ads", "title": "מודעות דרושים", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 289 (printed page 276) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "דרוש חלבן\nשיכול לקום מוקדם, לחלוב פרה אחרי פרה, למלא בקבוקים ולמכור בשווקים.\n[...]\nדרושה כובסת\nנקייה וחרוצה, עם כוח בידיים, יכולה לעמוד שעות על הרגליים, לכבס ולתלות בלי כפפות.", "en": "Two printed job advertisements describe a milkman and a laundress.", "vocab": [], "questions": [{"q": "איזו מודעה מחפשת אדם לחלוב פרות?", "a": "דרוש חלבן", "opts": ["דרוש חלבן", "דרושה כובסת", "דרוש מתכנת", "דרוש שופט"], "kind": "Supplemental comprehension", "explanation": "במודעה ״דרוש חלבן״ מוזכר לחלוב פרה."}, {"q": "איזו מודעה מחפשת אדם לכבס ולתלות?", "a": "דרושה כובסת", "opts": ["דרושה כובסת", "דרוש חלבן", "דרוש מתכנת", "דרוש נהג"], "kind": "Supplemental comprehension", "explanation": "המודעה ״דרושה כובסת״ מזכירה לכבס ולתלות."}]},
  {"id": "shnayim-10-hebrew-script", "title": "שניים ניסו ואחד הצליח", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 291 (printed page 278) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "זאב ז׳בוטינסקי, שאהב מאוד את העברית, הציע שבמקום לכתוב את העברית באותיות עבריות, נכתוב אותה באותיות לטיניות. [...] גם איתמר בן אב״י, הבן של אליעזר בן יהודה, מחייה השפה העברית, הציע הצעה דומה. [...] היום קוראים בטורקיה טורקית באותיות לטיניות, אבל מי שלומד עברית, ממשיך עדיין לחשוב איך קוראים את המילים בעברית.", "en": "The reading compares proposals to write Hebrew and Turkish in Latin letters.", "vocab": [], "questions": [{"q": "מי הציע לכתוב עברית באותיות לטיניות?", "a": "זאב ז׳בוטינסקי", "opts": ["זאב ז׳בוטינסקי", "אליעזר זמנהוף", "לואי ברייל", "ג׳יימס ווטסון"], "kind": "Supplemental comprehension", "explanation": "הקטע מייחס את ההצעה לזאב ז׳בוטינסקי."}, {"q": "מי עוד הציע הצעה דומה?", "a": "איתמר בן אב״י", "opts": ["איתמר בן אב״י", "לואי ברייל", "מלאלה יוספזאי", "ואנגרי מאתאי"], "kind": "Adapted from printed comprehension", "explanation": "הקטע אומר שגם איתמר בן אב״י הציע הצעה דומה."}, {"q": "באילו אותיות קוראים היום טורקית לפי הקטע?", "a": "אותיות לטיניות", "opts": ["אותיות לטיניות", "אותיות סיניות", "כתב ברייל", "כתב יתדות"], "kind": "Supplemental comprehension", "explanation": "המשפט האחרון מזכיר אותיות לטיניות בטורקית."}]},
  {"id": "shnayim-10-sign-performance", "title": "קשה להאמין — סיפורים מהחיים", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 297 and 299 (printed page 285–286) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "השחקנים בהצגה ״אור שומעים בדממה״ לא שומעים קול אדם, רק הידיים זזות באוויר והקהל שומע את צלילי הפסנתר. [...] ההצגה ״אור שומעים בדממה״ היא אוסף של סיפורים מהחיים על שחקנים חירשים־אילמים או עיוורים. [...] משתתפי ההצגה למדו את מילות השיר בתנועות ידיים.", "en": "A performance uses sign language and movement by deaf and blind actors.", "vocab": [], "questions": [{"q": "באיזו שפה משתמשים המשתתפים כדי להביע מילים?", "a": "שפת הסימנים", "opts": ["שפת הסימנים", "אספרנטו", "לטינית", "ארמית"], "kind": "Supplemental comprehension", "explanation": "הקריאה מתארת תנועות ידיים ושפת סימנים."}, {"q": "מי מופיעים בהצגה?", "a": "שחקנים חירשים־אילמים או עיוורים", "opts": ["שחקנים חירשים־אילמים או עיוורים", "רק מורים", "רק רופאים", "רק ספורטאים"], "kind": "Supplemental comprehension", "explanation": "הקטע מתאר את השחקנים כחירשים־אילמים או עיוורים."}]},
  {"id": "shnayim-10-arbrabit", "title": "ערברבית", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 301 (printed page 289) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "אבל גם הערבית הישראלית שינתה את פניה. ד״ר עבד אל־רחמן מעיו אומר ש״נולדה״ כאן בארץ ערבית חדשה: ״ערברבית״ או ״אלעברביה״. זאת ערבית שקיבלה השפעה מהעברית.", "en": "The reading describes Hebrew influence on Arabic spoken in Israel.", "vocab": [], "questions": [{"q": "מאיזו שפה הושפעה ה״ערברבית״?", "a": "מעברית", "opts": ["מעברית", "מלטינית", "מאספרנטו", "מצרפתית"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר שהערבית הזאת קיבלה השפעה מהעברית."}]},
  {"id": "shnayim-10-babel", "title": "כך באו שפות שונות לעולם", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 303 and 305 (printed page 291–292) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "בספר בראשית (פרק יא, פסוקים א–ט) מספרים לנו שכל העולם דיבר שפה אחת. יום אחד אנשים רצו לבנות מגדל גבוה שיגיע עד השמיים. [...] כעס אלוהים על בני האדם, והחליט לבלבל את שפתם. [...] כך באו שפות שונות לעולם.", "en": "The textbook retells the Babel story as a story about the origin of different languages.", "vocab": [], "questions": [{"q": "מה רצו האנשים לבנות?", "a": "מגדל גבוה", "opts": ["מגדל גבוה", "בית ספר", "מוזאון", "בית חולים"], "kind": "Supplemental comprehension", "explanation": "בתחילת הסיפור האנשים רוצים לבנות מגדל שיגיע לשמיים."}, {"q": "מה השתנה אחרי בלבול השפה בסיפור?", "a": "בני האדם לא הבינו זה את זה", "opts": ["בני האדם לא הבינו זה את זה", "כולם דיברו שפה אחת", "כולם למדו כתב ברייל", "הם הפסיקו לבנות בתים"], "kind": "Supplemental comprehension", "explanation": "בלבול השפה מפריע לתקשורת, ולכן הם רבים ונפרדים."}]},
  {"id": "shnayim-10-braille", "title": "בין אור לחושך, בין חושך לאור", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 305 (printed page 293) • selected original choose-the-word reading with printed alternatives; choices adapted", "he": "לואי ברייל (1809–1852), שנולד / חי בצרפת, היה ילד צעיר כאשר הוא התעוור. [...] בגיל 12 שלחו אותו ללמוד בבית ספר לעיוורים. [...] ברייל חשב שהשיטה הזאת מתאימה לעיוורים. הוא פיתח אותה והמציא כתב חדש, שבו לכל אות יש שש נקודות בסדר ובצורה שונים.", "en": "The printed choice reading describes Louis Braille and his six-dot writing system.", "vocab": [], "questions": [{"q": "מי פיתח כתב חדש המבוסס על נקודות?", "a": "לואי ברייל", "opts": ["לואי ברייל", "אליעזר זמנהוף", "זאב ז׳בוטינסקי", "אליעזר בן־יהודה"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר שברייל פיתח כתב שבו לכל אות שש נקודות."}, {"q": "באיזה גיל שלחו את ברייל לבית ספר לעיוורים?", "a": "12", "opts": ["12", "3", "21", "30"], "kind": "Supplemental comprehension", "explanation": "הקריאה מציינת במפורש: בגיל 12."}]},
  {"id": "shnayim-10-xyz", "title": "XYZ — דורות ושפה", "source": "עברית בשניים לרמה ב׳ • chapter 10 • PDF page 307 and 308 (printed page 295–296) • selected original Hebrew with marked omissions; comprehension choices adapted", "he": "מי שנולד בשנות ה־80 של המאה ה־20, הוא חלק מדור ה־Y. [...] ילדים שנולדו בין שנת 1965 לשנת 1976 בערך, שייכים לדור ה־X. [...] דור ה־Y הוא דור שמחליף עבודה כמו שמחליפים גרביים.", "en": "The final reading compares generations X and Y.", "vocab": [], "questions": [{"q": "איזה דור כולל, לפי הקטע, ילדים שנולדו בערך בשנים 1965–1976?", "a": "דור ה־X", "opts": ["דור ה־X", "דור ה־Y", "דור ה־Z", "דור הבייבי בום"], "kind": "Supplemental comprehension", "explanation": "הקטע מייחס את השנים 1965–1976 לדור ה־X."}]},
  {"id": "shnayim-9-maathai", "title": "ואנגרי מאתאי — מגיע לה פרס", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 240 (printed page 229) • selected original Hebrew with marked omissions; choices adapted", "he": "ואנגרי מאתאי נולדה בשנת 1940 בקניה. [...] היא שתלה עצים בחצר שלה והזמינה נשים אחרות ללמוד ממנה ולשתול עצים בחצרות שלהן. [...] בשנת 2004 קיבלה מאתאי פרס נובל לשלום.", "en": "Wangari Maathai encouraged women to plant trees and received the Nobel Peace Prize.", "vocab": [], "questions": [{"q": "מי נולדה בקניה בשנת 1940?", "a": "ואנגרי מאתאי", "opts": ["ואנגרי מאתאי", "מלאלה יוספזאי", "רוזלינד פרנקלין", "קתרין סוויצר"], "kind": "Supplemental comprehension", "explanation": "הקטע פותח בשם ואנגרי מאתאי ובמקום לידתה."}, {"q": "מה הזמינה מאתאי נשים אחרות לשתול?", "a": "עצים", "opts": ["עצים", "ספרים", "אקליפטוסים בלבד", "קופסאות"], "kind": "Supplemental comprehension", "explanation": "היא הזמינה אותן ללמוד ממנה ולשתול עצים."}, {"q": "מתי קיבלה מאתאי פרס נובל לשלום?", "a": "בשנת 2004", "opts": ["בשנת 2004", "בשנת 1940", "בשנת 2012", "בשנת 1967"], "kind": "Supplemental comprehension", "explanation": "המשפט האחרון מציין את שנת 2004."}]},
  {"id": "shnayim-9-population", "title": "אסון דמוגרפי", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 242 (printed page 231) • selected original Hebrew with marked omissions; choices adapted", "he": "הדמוגרפים, שחוקרים את האוכלוסיות בעולם, לא אוהבים את השורה הזאת. הם אומרים שכל בעיה חדשה, שינסו לפתור, לא רק תהיה גדולה מזו שחשבו, גם תביא אתה עוד בעיות לכל אוכלוסיית העולם. [...] בשנת 2012 מספר האנשים בעולם הגיע ל־7.2 מיליארד.", "en": "A demographic reading discusses the growing world population.", "vocab": [], "questions": [{"q": "כמה אנשים היו בעולם בשנת 2012 לפי הקריאה?", "a": "7.2 מיליארד", "opts": ["7.2 מיליארד", "900 אלף", "21 מיליון", "30 מיליון"], "kind": "Supplemental comprehension", "explanation": "בקריאה מופיע המספר 7.2 מיליארד לשנת 2012."}, {"q": "מה חוקרים הדמוגרפים?", "a": "אוכלוסיות בעולם", "opts": ["אוכלוסיות בעולם", "צבעים בבגדים", "ציורי קליגרפיה", "זכויות בחירה בלבד"], "kind": "Supplemental comprehension", "explanation": "הקטע מגדיר דמוגרפים כאנשים שחוקרים אוכלוסיות."}]},
  {"id": "shnayim-9-dog-nose", "title": "האף של פרופ׳ חאיק", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 246 and 248 (printed page 235–236) • selected original Hebrew with marked omissions; choices adapted", "he": "ד״ר קלייר גסט, אמריקנית שחוקרת התנהגות בעלי חיים, הבריאה ממחלה קשה בגלל דייזי, הכלבה שלה. [...] ערב אחד, אחרי שהיא חזרה מהעבודה, דייזי לא הייתה רגועה וכל הזמן דחפה אותה ביד. [...] פרופ׳ חאיק, שקיבל הצעות עבודה מאוניברסיטאות רבות בעולם, החליט להישאר בטכניון ולפתח שם את ההמצאה שלו. 27 חוקרים צעירים עובדים במעבדה שהוא הקים. [...] עד היום, עוד לפני שהוא סיים לפתח את האף האלקטרוני, הוא זכה בפרסים רבים על עבודתו.", "en": "Daisy’s behavior alerts Claire Guest to illness; Professor Haick develops an electronic nose.", "vocab": [], "questions": [{"q": "מי הייתה דייזי?", "a": "הכלבה של ד״ר גסט", "opts": ["הכלבה של ד״ר גסט", "עוזרת במעבדה", "מנהלת בית הספר", "אדריכלית"], "kind": "Supplemental comprehension", "explanation": "הקריאה מציגה את דייזי ככלבה של ד״ר קלייר גסט."}, {"q": "איזו המצאה עבד פרופ׳ חאיק לפתח?", "a": "אף אלקטרוני", "opts": ["אף אלקטרוני", "מחשב מדבר", "טלפון ציבורי", "מכונת כתיבה"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר שפרופ׳ חאיק עבד על פיתוח אף אלקטרוני."}]},
  {"id": "shnayim-9-pluto", "title": "יגלו או לא יגלו...", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 256 (printed page 245) • selected original Hebrew with marked omissions; choices adapted", "he": "סטודנט ב: הוא לא אמר שום דבר מיוחד, וחוץ מזה, עדיין לא גילו את הכוכב הזה. הוא סיפר שישנם אסטרונומים באוניברסיטה בקליפורניה שחושבים שבעתיד יגלו את הכוכב הזה, אבל אף אחד לא יודע מתי זה יקרה. [...] ", "en": "Students discuss a possible planet and what astronomers may discover.", "vocab": [], "questions": [{"q": "לפי הסטודנט, האם כבר גילו את הכוכב?", "a": "עדיין לא", "opts": ["עדיין לא", "כן, לפני שנים", "כן, אתמול", "הוא לא מדבר על כוכב"], "kind": "Adapted from printed comprehension on PDF 258", "explanation": "הדובר אומר במפורש שעדיין לא גילו את הכוכב."}, {"q": "מי חושבים שבעתיד יגלו את הכוכב?", "a": "אסטרונומים בקליפורניה", "opts": ["אסטרונומים בקליפורניה", "רצים בבוסטון", "נשים בקניה", "חקלאים בעיר"], "kind": "Adapted from printed comprehension on PDF 258", "explanation": "הדובר מזכיר אסטרונומים באוניברסיטה בקליפורניה."}]},
  {"id": "shnayim-9-roofs", "title": "גינות על הגגות — טבע עירוני", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 260 (printed page 249) • selected original Hebrew with marked omissions; choices adapted", "he": "בגלל הפחד מעתיד עירוני ״שחור״, יותר ויותר אדריכלי נוף וסביבה מתכננים היום בניינים עם גינות מיוחדות על הגגות האלה שותלים פרחים וירקות. [...] החקלאים העירוניים יודעים לנצל את כל שטח הגגות הקטנים והגדולים.", "en": "Urban farmers and architects use rooftops for gardens.", "vocab": [], "questions": [{"q": "מה שותלים על הגגות לפי הקטע?", "a": "פרחים וירקות", "opts": ["פרחים וירקות", "מחשבים ומכוניות", "אורז בלבד", "עצי אקליפטוס בלבד"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר שעל הגגות שותלים פרחים וירקות."}, {"q": "איזה שטח מנצלים החקלאים העירוניים?", "a": "את שטח הגגות", "opts": ["את שטח הגגות", "את חוף הים", "את המדבר בלבד", "את מערות בבל"], "kind": "Supplemental comprehension", "explanation": "בקריאה נאמר שהם מנצלים את שטח הגגות, קטנים וגדולים."}]},
  {"id": "shnayim-9-gardens", "title": "הגנים התלויים בבבל", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 262 (printed page 251) • selected original Hebrew with marked omissions; choices adapted", "he": "הגנים התלויים בבבל הם אחד משבעת פלאי עולם. [...] שם בנה המלך נבוכדנצר השני (המאה ה־6–7 לפני הספירה) מרפסות שעליהן שמו אדמה וגידלו בה עצים וצמחים. [...] אך ארכיאולוגים טענו שהמלך בנה את הגנים התלויים לכבוד אשתו הנסיכה, כדי שלא תתגעגע מאוד לנופי ילדותה.", "en": "A historical account describes the Hanging Gardens and one explanation for their construction.", "vocab": [], "questions": [{"q": "מי בנה את הגנים לפי הסיפור שבקריאה?", "a": "נבוכדנצר השני", "opts": ["נבוכדנצר השני", "אלכסנדר מוקדון", "נפוליאון", "ואנגרי מאתאי"], "kind": "Adapted from printed completion on PDF 262", "explanation": "הקטע מייחס את הגנים למלך נבוכדנצר השני."}, {"q": "לכבוד מי נבנו הגנים לפי הטענה המתוארת?", "a": "אשתו הנסיכה", "opts": ["אשתו הנסיכה", "תלמידי בית הספר", "חיילי העיר", "החקלאים העירוניים"], "kind": "Supplemental comprehension", "explanation": "לפי הקטע, המלך בנה אותם לכבוד אשתו הנסיכה."}]},
  {"id": "shnayim-9-self-sufficient", "title": "הכול בעצמנו — השלמה", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 266 (printed page 255) • selected original fill-in lines with blank preserved; choices adapted", "he": "עוד יותר משפחות בישראל רוצות לחיות חיים עצמאיים. אלה משפחות שרוצות לבנות ______ את הבית שלהן, משום שהן מאמינות שבנייה ירוקה טובה יותר לבריאות. המשפחות האלה לא משתמשות בחומרים כימיים.", "en": "A printed fill-in about families seeking independent, environmentally conscious lives.", "vocab": [], "questions": [{"q": "אלה משפחות שרוצות לבנות _____ את הבית שלהן.", "a": "בעצמן", "opts": ["בעצמן", "בעצמו", "בעצמי", "בעצמם"], "kind": "Printed fill-in with adapted choices", "explanation": "משפחות הן רבות בנקבה, לכן מילת היחס היא בעצמן."}, {"q": "איזה סוג חיים רוצות המשפחות?", "a": "חיים עצמאיים", "opts": ["חיים עצמאיים", "חיים במלון", "חיים בלי בית", "חיים בבית ספר"], "kind": "Supplemental comprehension", "explanation": "הקריאה פותחת ברצון לחיות חיים עצמאיים."}]},
  {"id": "shnayim-9-healthy", "title": "ד״ר ירקוני — אנחנו רוצים להיות בריאים", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 266 (printed page 255) • selected original Hebrew with marked omissions; choices adapted", "he": "קנו פירות וירקות אורגניים, שהחקלאים גידלו בעצמם בלי חומרים כימיים. [...] כדאי ללמד את הילדים לשטוף בעצמם את הפירות והירקות.", "en": "Dr. Yarkoni’s advice includes organic produce and teaching children to wash it.", "vocab": [], "questions": [{"q": "מה מציעה ד״ר ירקוני לקנות?", "a": "פירות וירקות אורגניים", "opts": ["פירות וירקות אורגניים", "ממתקים", "משקאות ממותקים", "מזון מהיר"], "kind": "Supplemental comprehension", "explanation": "העצה הראשונה היא לקנות פירות וירקות אורגניים."}, {"q": "מה כדאי ללמד את הילדים לעשות בעצמם?", "a": "לשטוף את הפירות והירקות", "opts": ["לשטוף את הפירות והירקות", "לכרות עצים", "לסגור בית ספר", "לצייר גגות"], "kind": "Supplemental comprehension", "explanation": "העצה המודפסת היא ללמד את הילדים לשטוף בעצמם את הפירות והירקות."}]},
  {"id": "shnayim-9-eucalyptus", "title": "לכרות או לא לכרות — זאת השאלה", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 268 (printed page 256) • selected original Hebrew with marked omissions; choices adapted", "he": "האקליפטוס הוא עץ שהגיע לכאן מאוסטרליה. [...] בשנת 1921 הבינו כולם שעצי האקליפטוס לא עזרו ליבוש הביצות. [...] לכן שתלו החלוצים אלפי עצי אקליפטוס במקומות רבים. [...] הרשות החליטה לכרות חלק גדול מהעצים האלה.", "en": "The reading discusses eucalyptus trees and a dispute about cutting some down.", "vocab": [], "questions": [{"q": "איזה עץ עומד במרכז הקריאה?", "a": "האקליפטוס", "opts": ["האקליפטוס", "עץ הזית", "עץ התפוח", "הדקל"], "kind": "Supplemental comprehension", "explanation": "הפסקה הראשונה מציגה את האקליפטוס."}, {"q": "על מה הייתה המחלוקת?", "a": "האם לכרות חלק מהעצים", "opts": ["האם לכרות חלק מהעצים", "האם לבנות בית ספר", "האם לצייר על הקיר", "האם לנסוע לאנגליה"], "kind": "Adapted from printed completion on PDF 268", "explanation": "הטקסט מתאר החלטה לכרות חלק מהעצים והתנגדות לכך."}]},
  {"id": "shnayim-9-green-families", "title": "משפחות ירוקות — בחירת מילים", "source": "עברית בשניים לרמה ב׳ • chapter 9 • PDF page 270 (printed page 259) • selected original choose-the-word text, with printed alternatives visible; choices adapted", "he": "הרבה הורים בישראל רוצים להתחיל לחיות / להפסיד חיים ״ירוקים״. [...] במשפחות ירוקות מחליפים בגדים עם משפחות אחרות. [...] המשפחות האלה לא קונות בגדים אלא / ואילו מקבלות אותם ממשפחות אחרות.", "en": "A printed choice reading about families reducing waste and exchanging clothes.", "vocab": [], "questions": [{"q": "הרבה הורים בישראל רוצים להתחיל _____ חיים ״ירוקים״.", "a": "לחיות", "opts": ["לחיות", "להפסיד", "לכרות", "לכבות"], "kind": "Printed choose-the-word exercise with adapted choices", "explanation": "האפשרות המתאימה היא לחיות חיים ירוקים."}, {"q": "מה עושות משפחות ירוקות עם בגדים?", "a": "מחליפות אותם עם משפחות אחרות", "opts": ["מחליפות אותם עם משפחות אחרות", "שורפות אותם", "קונות רק בגדים חדשים", "זורקות אותם לים"], "kind": "Supplemental comprehension", "explanation": "הקריאה אומרת שהמשפחות מחליפות בגדים זו עם זו."}]},
  {"id": "shnayim-8-women-history", "title": "נשים וזכות הבחירה", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 212 (printed page 200) • selected original reading; comprehension adapted to choices", "he": "במאה ה־14, אחרי המגפה השחורה באירופה, היה שינוי במצבן. [...] בשנת 1912 לא הסכים הפרלמנט הבריטי לתת לנשים זכות לבחור. [...] באותה שנה הפרלמנט הבריטי נתן לנשים מגיל 30 זכות לבחור לפרלמנט.", "en": "A short account of women’s changing position and voting rights in Britain.", "vocab": [], "questions": [{"q": "מה השתנה אחרי המגפה השחורה באירופה?", "a": "מצבן של הנשים", "opts": ["מצבן של הנשים", "שמה של אנגליה", "גיל ההצבעה של הגברים", "שפת הפרלמנט"], "kind": "Supplemental comprehension", "explanation": "הקטע מציין שינוי במצבן של הנשים."}, {"q": "מה לא הסכים הפרלמנט הבריטי לתת לנשים בשנת 1912?", "a": "זכות לבחור", "opts": ["זכות לבחור", "זכות לנסוע", "זכות ללמוד עברית", "זכות לעבוד במעבדה"], "kind": "Supplemental comprehension", "explanation": "המשפט המודפס אומר שהפרלמנט לא הסכים לתת לנשים זכות לבחור."}, {"q": "מאיזה גיל ניתנה לנשים זכות לבחור לפי הקטע?", "a": "30", "opts": ["30", "11", "18", "50"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר לנשים מגיל 30."}]} ,
  {"id": "shnayim-8-moses", "title": "מרים, יוכבד ובת פרעה", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 212 (printed page 201) • selected original reading; comprehension adapted to choices", "he": "מרים, האחות של משה רבנו, עמדה קרוב לנהר, לא רחוק מהתיבה של משה התינוק. [...] כאשר בת פרעה התקרבה ורצתה לקחת את משה, סיפרה לה מרים על אישה שיכולה לטפל בתינוק. ה״מטפלת״ הייתה יוכבד, אימא של משה.", "en": "Miriam arranges for her mother Yocheved to care for baby Moses.", "vocab": [], "questions": [{"q": "מי עמדה קרוב לנהר?", "a": "מרים", "opts": ["מרים", "יוכבד", "בת פרעה", "מלאלה"], "kind": "Supplemental comprehension", "explanation": "מרים, אחות משה, עמדה סמוך לנהר ולתיבה."}, {"q": "מי הייתה ה״מטפלת״?", "a": "יוכבד, אימא של משה", "opts": ["יוכבד, אימא של משה", "מרים", "בת פרעה", "רוזלינד פרנקלין"], "kind": "Supplemental comprehension", "explanation": "הקטע מזהה את יוכבד כאימו של משה וכמטפלת."}, {"q": "על מי סיפרה מרים לבת פרעה?", "a": "על אישה שיכולה לטפל בתינוק", "opts": ["על אישה שיכולה לטפל בתינוק", "על אישה שיכולה לצלם", "על אישה שרצה במרתון", "על אישה שכותבת בבלוג"], "kind": "Supplemental comprehension", "explanation": "מרים הציעה אישה שתטפל במשה התינוק."}]} ,
  {"id": "shnayim-8-dorothea", "title": "דורוטיאה לאנג — האם הנודדת", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 216 (printed page 205) • selected original reading; comprehension adapted to choices", "he": "דורותיאה לאנג הייתה צלמת אמריקנית. [...] בתמונה הייתה אם ל־7 ילדים.", "en": "The photographer Dorothea Lange and the mother pictured in her photograph.", "vocab": [], "questions": [{"q": "כמה ילדים היו לאם בתמונה?", "a": "שבעה", "opts": ["שבעה", "שניים", "שלושה", "אחד עשר"], "kind": "Supplemental comprehension", "explanation": "בקטע נאמר שהייתה אם ל־7 ילדים."}]} ,
  {"id": "shnayim-8-malala", "title": "מלאלה יוספזאי", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 218 (printed page 207) • selected original reading; comprehension adapted to choices", "he": "מלאלה יוספזאי מפקיסטן הייתה רק בת 11, כאשר התחילה לכתוב בבלוג שלה נגד הטליבאן ובעד ה_________ ללימודים של כל ילד, ובמיוחד של כל ילדה. [...] הטליבאן סגר בתי ספר לילדים ואסר על בנות לצאת מהבית ללימודים. [...] ובשנת 2014 היא קיבלה _____ _____ נובל לשלום.", "en": "Malala writes against Taliban restrictions on girls’ education.", "vocab": [], "questions": [{"q": "בת כמה הייתה מלאלה כאשר התחילה לכתוב בבלוג?", "a": "11", "opts": ["11", "7", "30", "18"], "kind": "Supplemental comprehension", "explanation": "הפתיחה אומרת שהייתה בת 11."}, {"q": "מה אסר הטליבאן על בנות?", "a": "לצאת מהבית ללימודים", "opts": ["לצאת מהבית ללימודים", "לכתוב ספרי קומיקס", "לנסוע ברכבת", "לבקר במוזאון"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר שנאסר על הבנות לצאת ללימודים."}, {"q": "איזה פרס קיבלה מלאלה בשנת 2014?", "a": "פרס נובל לשלום", "opts": ["פרס נובל לשלום", "פרס צילום", "פרס ריצה", "פרס לספרות"], "kind": "Supplemental comprehension", "explanation": "בסיום מצוין פרס נובל לשלום."}]} ,
  {"id": "shnayim-8-get-film", "title": "הסרט גט — ביקורת", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 220 (printed page 208) • selected original reading; comprehension adapted to choices", "he": "הסרט גט — ביקורת. [...] כבר ימים היא מגיעה לבית הדין כדי לקבל גט.", "en": "A film review centers on Viviane’s attempt to obtain a divorce.", "vocab": [], "questions": [{"q": "לאן מגיעה ויויאן?", "a": "לבית הדין", "opts": ["לבית הדין", "למרתון", "למערה", "למעבדה"], "kind": "Supplemental comprehension", "explanation": "בקריאה ויויאן מגיעה לבית הדין כדי לקבל גט."}]} ,
  {"id": "shnayim-8-laqiya", "title": "נשים בלקיה", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 222 (printed page 210) • selected original choose-the-word text; comprehension adapted", "he": "הארגון לקידום מעמד / מטרה האישה בכפר הבדואי לקיה קם בשנת 1996. המטרה של הארגון / פרס היא לשפר את המעמד של הנשים הבדואיות בחברה הבדואית ובחברה / אופנה הישראלית.", "en": "A women’s organization in the Bedouin village of Laqiya.", "vocab": [], "questions": [{"q": "מתי קם הארגון בלקיה?", "a": "בשנת 1996", "opts": ["בשנת 1996", "בשנת 1912", "בשנת 1967", "בשנת 2014"], "kind": "Supplemental comprehension", "explanation": "המשפט הראשון מציין 1996."}, {"q": "מה מטרת הארגון?", "a": "לשפר את מעמד הנשים הבדואיות", "opts": ["לשפר את מעמד הנשים הבדואיות", "לסגור בתי ספר", "לארגן מרתון", "לפתוח מערה"], "kind": "Supplemental comprehension", "explanation": "הקטע מציין במפורש את שיפור מעמד הנשים הבדואיות."}]} ,
  {"id": "shnayim-8-ali-baba", "title": "עלי באבא והמערה", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 224 (printed page 213) • selected original reading; comprehension adapted to choices", "he": "כאשר עלי באבא רצה להיכנס למערה, הוא אמר: ״סומסום, בבקשה להיפתח!״ [...] הוא ידע שהוא צריך לקחת קצת מהאוצר ולמכור.", "en": "Ali Baba asks the cave to open and seeks the treasure.", "vocab": [], "questions": [{"q": "מה אמר עלי באבא כדי להיכנס למערה?", "a": "סומסום, בבקשה להיפתח!", "opts": ["סומסום, בבקשה להיפתח!", "סומסום, בבקשה להיסגר!", "בבקשה ללכת!", "אני איפגש במערה"], "kind": "Supplemental comprehension", "explanation": "אלה המילים המצוטטות בקריאת הפרק."}, {"q": "מה ידע עלי באבא שהוא צריך לקחת מן המערה?", "a": "קצת מהאוצר", "opts": ["קצת מהאוצר", "את הצלחת", "את המחשב", "את התיבה"], "kind": "Supplemental comprehension", "explanation": "הקטע אומר שהוא צריך לקחת קצת מהאוצר ולמכור."}]} ,
  {"id": "shnayim-8-franklin", "title": "רוזלינד פרנקלין וה־DNA", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 232 (printed page 220) • selected original reading; comprehension adapted to choices", "he": "בשנת 1962 קיבלו שני מדענים — פרנסיס קריק וג׳יימס ווטסון — פרס נובל על מחקרים שעשו בנושא ה־DNA. [...] רוזלינד פרנקלין נולדה באנגליה למשפחה יהודית.", "en": "Rosalind Franklin’s work is discussed alongside Crick and Watson’s Nobel Prize.", "vocab": [], "questions": [{"q": "מי קיבלו פרס נובל בשנת 1962 לפי הקטע?", "a": "פרנסיס קריק וג׳יימס ווטסון", "opts": ["פרנסיס קריק וג׳יימס ווטסון", "רוזלינד פרנקלין ומלאלה", "מרים ויוכבד", "עלי באבא וג׳וק סמפל"], "kind": "Supplemental comprehension", "explanation": "הקריאה מונה את פרנסיס קריק וג׳יימס ווטסון."}, {"q": "באיזה נושא עסקו המחקרים המתוארים?", "a": "ה־DNA", "opts": ["ה־DNA", "מרתון בוסטון", "קליגרפיה", "זכות בחירה"], "kind": "Supplemental comprehension", "explanation": "המשפט הפותח מציין מחקרים בנושא ה־DNA."}]} ,
  {"id": "shnayim-8-marathon", "title": "קתרין סוויצר ומרתון בוסטון", "source": "עברית בשניים לרמה ב׳ • chapter 8 • PDF page 238 (printed page 227) • selected original reading; comprehension adapted to choices", "he": "ג׳וק סמפל ארגן את מרתון הריצה בעיר בוסטון בשנת 1967. [...] האישה הזאת הייתה קתרין סוויצר. [...] סמפל רצה לקרוע את המספרים, שהיו על חולצתה. [...] אבל החליטה להמשיך לרוץ למרות המהומה / איסור.", "en": "Kathrine Switzer continues running the 1967 Boston Marathon.", "vocab": [], "questions": [{"q": "באיזו שנה נערך המרתון המתואר?", "a": "1967", "opts": ["1967", "1912", "1962", "2014"], "kind": "Supplemental comprehension", "explanation": "הקריאה מציינת את בוסטון בשנת 1967."}, {"q": "מה החליטה קתרין סוויצר לעשות?", "a": "להמשיך לרוץ", "opts": ["להמשיך לרוץ", "לעצור מיד", "לצלם את הרצים", "להיכנס למערה"], "kind": "Supplemental comprehension", "explanation": "למרות המעשה של סמפל, היא החליטה להמשיך לרוץ."}]} ,
  {"id": "shnayim-7-art", "title": "לא פסל ולא מסכה — קריאה ונכון/לא נכון", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF pages 181–182 (printed pages 169–170) • selected original Hebrew; printed true/false structure and adapted comprehension choices", "he": "כל מאמין מוסלמי או יהודי מכיר את האיסור לעשות פסל או מסכה. בבתי הכנסת ובמסגדים אין בדרך כלל אומנות פיגורטיבית, כלומר אין ציורים ופסלים של בעלי חיים וכמובן לא של בני אדם. [...] גם בכתבי־יד יהודיים יש דמויות של אנשים ושל מלאכים. [...] הקליגרפיה היא כתיבה אומנותית.", "en": "The chapter contrasts a general rule about images in places of worship with examples in Jewish manuscripts, then introduces calligraphy. Omissions are marked.", "vocab": [["אומנות פיגורטיבית", "figurative art"], ["קליגרפיה", "calligraphy"]], "questions": [{"q": "איזו אומנות היא כתיבה אומנותית?", "a": "קליגרפיה", "opts": ["קליגרפיה", "פיסול", "גאולוגיה", "חקלאות"], "kind": "Original reading · adapted comprehension choices", "explanation": "המשפט האחרון מגדיר קליגרפיה ככתיבה אומנותית."}, {"q": "לפי הקטע, מה אין בדרך כלל בבתי הכנסת ובמסגדים?", "a": "ציורים ופסלים של בעלי חיים ובני אדם", "opts": ["ציורים ופסלים של בעלי חיים ובני אדם", "ספרים", "אותיות", "צורות גאומטריות"], "kind": "Original reading · adapted comprehension choices", "explanation": "הקטע אומר שבדרך כלל אין בהם אומנות פיגורטיבית של בעלי חיים ובני אדם."}, {"q": "נכון או לא נכון: בבתי תפילה של מוסלמים ויהודים יש ציורים ופסלים.", "a": "לא נכון", "opts": ["לא נכון", "נכון", "לא מוזכר", "רק באיטליה"], "kind": "Printed true/false · adapted choices", "explanation": "הקריאה אומרת שבבתי הכנסת ובמסגדים אין בדרך כלל אומנות פיגורטיבית."}, {"q": "נכון או לא נכון: בכתבי־יד יהודיים אפשר לראות דמויות של אנשים.", "a": "נכון", "opts": ["נכון", "לא נכון", "לא מוזכר", "רק בספרי ילדים"], "kind": "Printed true/false · adapted choices", "explanation": "בקריאה כתוב שבכתבי־יד יהודיים יש דמויות של אנשים ושל מלאכים."}]},
  {"id": "shnayim-7-anisa", "title": "ריאיון עם אניסה אשקר", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 182 (printed page 171) • selected original Hebrew interview answers; adapted comprehension choices", "he": "כשהייתי סטודנטית במכללת בית ברל לא היו לי חברים, אף אחד לא דיבר איתי, והרגשתי זרה. התגעגעתי לשפה הערבית, כי כולם מסביב דיברו עברית. ערבית היא השפה שלי. [...] למדתי קליגרפיה מגיל תשע. זה מצא חן בעיניי.", "en": "Anisa describes her mother tongue and learning calligraphy as a child. Selected interview sentences are shown.", "vocab": [["שפה", "language"], ["קליגרפיה", "calligraphy"]], "questions": [{"q": "איזו אומנות למדה אניסה כדי לכתוב על פנים?", "a": "קליגרפיה", "opts": ["קליגרפיה", "פיסול", "גרפיטי", "אדריכלות"], "kind": "Original interview · adapted comprehension choices", "explanation": "אניסה אומרת שלמדה קליגרפיה מגיל תשע ושהיא כותבת על פני אנשים."}, {"q": "מהי השפה של אניסה לפי דבריה?", "a": "ערבית", "opts": ["ערבית", "עברית", "אנגלית", "איטלקית"], "kind": "Original interview · adapted comprehension choices", "explanation": "אניסה אומרת במפורש: ״ערבית היא השפה שלי״."}]},
  {"id": "shnayim-7-found", "title": "לא כל מה שמוצא חן בעיניי — קריאה", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 186 (printed page 174) • selected original Hebrew; adapted comprehension choices", "he": "הציור הזה מוצא חן בעיני אנשים רבים, אבל הוא בכלל לא מוצא חן בעיניי. אני אוהבת אומנות פיגורטיבית, שרואים בה דמויות ברורות. החברים שלי אוהבים דווקא אומנות אבסטרקטית, למשל התמונות של קנדינסקי, צייר רוסי מפורסם. [...] אני דווקא אוהבת את הציורים של זאב רבן.", "en": "The narrator explains her preference for figurative art while her friends prefer abstract art. Omissions are marked.", "vocab": [["מוצא חן בעיניי", "I like it"], ["אומנות פיגורטיבית", "figurative art"]], "questions": [{"q": "איזו אומנות אוהבת הכותבת?", "a": "אומנות פיגורטיבית", "opts": ["אומנות פיגורטיבית", "אומנות אבסטרקטית", "רק פיסול", "רק גרפיטי"], "kind": "Original reading · adapted comprehension choices", "explanation": "הכותבת אומרת ״אני אוהבת אומנות פיגורטיבית״; חבריה אוהבים דווקא אומנות אבסטרקטית."}, {"q": "מה היא אומרת על הציורים של זאב רבן?", "a": "היא אוהבת אותם", "opts": ["היא אוהבת אותם", "הם מכוערים בעיניה", "הם פסלים יווניים", "הם ציורים של ואן גוך"], "kind": "Original reading · adapted comprehension choices", "explanation": "בסוף הקטע היא אומרת ״אני דווקא אוהבת את הציורים של זאב רבן״."}]},
  {"id": "shnayim-7-graffiti-interview", "title": "ריאיון עם דניאל — אומנות רחוב", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 188 (printed page 176) • selected original Hebrew interview answers; adapted comprehension choices", "he": "במקומות שהרבה אנשים יכולים לראות אותו, למשל בתחנת רכבת או על קיר של סופרמרקט. [...] אם יתפסו אותי, אני יכול להתקשר להוריי. אבל אני לא רוצה לחשוב על זה.", "en": "Daniel describes where he paints graffiti and what he could do if caught. Omissions are marked.", "vocab": [["גרפיטי", "graffiti"], ["יתפסו", "they catch"]], "questions": [{"q": "איפה דניאל מצייר כדי שאנשים יראו את הגרפיטי?", "a": "בתחנת רכבת או על קיר של סופרמרקט", "opts": ["בתחנת רכבת או על קיר של סופרמרקט", "רק במוזאון", "רק בבית הספר", "רק בבית"], "kind": "Original interview · adapted comprehension choices", "explanation": "דניאל נותן דוגמאות: תחנת רכבת וקיר של סופרמרקט."}, {"q": "מה דניאל אומר שיוכל לעשות אם יתפסו אותו?", "a": "להתקשר להוריו", "opts": ["להתקשר להוריו", "לבקש פרס", "לקנות כרטיס", "להפסיק ללמוד"], "kind": "Original interview · adapted comprehension choices", "explanation": "בתשובה לשאלה ״ואם יתפסו אותך?״ הוא אומר שיוכל להתקשר להוריו."}]},
  {"id": "shnayim-7-vangogh", "title": "מכתב ואן גוך — החדר שלי", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 192 (printed page 180) • selected original Hebrew letter sentences; adapted comprehension choices", "he": "תיאו היקר, 16 אוקטובר 1888\nסוף סוף אני יכול לשלוח לך את הציור. היום אני מרגיש טוב יותר. העיניים שלי עייפות, אבל יש לי רעיון חדש לציור. אני שולח לך את הציור של החדר שלי. [...]", "en": "Van Gogh writes to Theo about sending a painting of his room. The heading and opening sentences are shown.", "vocab": [["ציור", "painting"], ["חדר", "room"]], "questions": [{"q": "מה התאריך בראש המכתב?", "a": "16 באוקטובר 1888", "opts": ["16 באוקטובר 1888", "24 באוגוסט 1979", "בשנת 1907", "בשנת 1950"], "kind": "Original letter · adapted comprehension choices", "explanation": "התאריך מופיע בכותרת המכתב: 16 אוקטובר 1888."}, {"q": "מה מתאר ואן גוך בציור שהוא שולח?", "a": "החדר שלו", "opts": ["החדר שלו", "חומת העיר", "גן החיות", "בית הכנסת"], "kind": "Original letter · adapted comprehension choices", "explanation": "בפתיחת המכתב הוא כותב ״הציור של החדר שלי״."}]},
  {"id": "shnayim-7-street-art", "title": "אומנות רחוב — קריאה", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 192 (printed page 181) • selected original Hebrew reading sentence; adapted comprehension choices", "he": "ההיסטוריונים של התרבות הפופולרית טוענים שאומנות הגרפיטי התחילה בארצות הברית בסוף שנות ה־60 ובתחילת שנות ה־70 של המאה ה־20.", "en": "The reading introduces the history of graffiti in the United States.", "vocab": [["גרפיטי", "graffiti"]], "questions": [{"q": "איפה התחילה אומנות הגרפיטי לפי ההיסטוריונים בקטע?", "a": "בארצות הברית", "opts": ["בארצות הברית", "באיטליה", "בצרפת", "בישראל"], "kind": "Original reading · adapted comprehension choices", "explanation": "המשפט מציין במפורש ״התחילה בארצות הברית״."}]},
  {"id": "shnayim-7-maabarot-cloze", "title": "תקופת המעברות — השלמה", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 194 (printed page 183) • original Hebrew past-tense fill-in; adapted choices", "he": "המעברות ________ מחנות אוהלים לעולים שהגיעו לישראל בשנות ה־50 של המאה ה־20.\nמספר העולים שהגיע אז לארץ ________ יותר מ־900,000 איש.", "en": "Complete the original past-tense blanks about the transit camps and number of immigrants.", "vocab": [["מעברות", "transit camps"], ["עולים", "immigrants"]], "questions": [{"q": "המעברות ________ מחנות אוהלים לעולים שהגיעו לישראל.", "a": "היו", "opts": ["היו", "היה", "תהיה", "יהיו"], "kind": "Original fill-in · adapted choices", "explanation": "הנושא המעברות הוא ברבים, והקטע עוסק בעבר: היו."}, {"q": "מספר העולים שהגיע אז לארץ ________ יותר מ־900,000 איש.", "a": "היה", "opts": ["היה", "היו", "יהיה", "יהיו"], "kind": "Original fill-in · adapted choices", "explanation": "הנושא מספר הוא יחיד, והקטע עוסק בעבר: היה."}]},
  {"id": "shnayim-7-klimt", "title": "גוסטב קלימט — האישה בזהב", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 204 (printed page 192) • selected original Hebrew reading sentences; adapted comprehension choices", "he": "גוסטב קלימט היה צייר אוסטרי ידוע, שצייר ב־1907 את אדלה בלוך־באואר. אדלה הייתה אשת חברה ידועה בעיר וינה שבאוסטריה. [...] לאישה בתמונה הם קראו ״האישה בזהב״, מפני שהם רצו להסתיר את המוצא היהודי שלה.", "en": "The reading identifies Klimt and Adele Bloch-Bauer in the painting later called The Woman in Gold. Omissions are marked.", "vocab": [["צייר", "painter"], ["זהב", "gold"]], "questions": [{"q": "מי צייר את ״האישה בזהב״?", "a": "גוסטב קלימט", "opts": ["גוסטב קלימט", "וינסנט ואן גוך", "אניסה אשקר", "זאב רבן"], "kind": "Original reading · adapted comprehension choices", "explanation": "המשפט הראשון מזהה את גוסטב קלימט כצייר."}, {"q": "מי מופיעה בציור?", "a": "אדלה בלוך־באואר", "opts": ["אדלה בלוך־באואר", "מנהל בית הספר", "דניאל", "הנרייטה סאלד"], "kind": "Original reading · adapted comprehension choices", "explanation": "במשפט הראשון קלימט מצייר את אדלה בלוך־באואר."}]},
  {"id": "shnayim-7-pompeii", "title": "פומפיי — קריאה ובחירת מילים", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 210 (printed page 198) • selected original Hebrew choice-exercise sentence; adapted comprehension choices", "he": "ב־24 באוגוסט בשנת 79 לספירה, בשעה 4 בבוקר, יצא מהר הגעש ענן כבד של אבנים גדולות וסלעים וכיסה את העיר.", "en": "The textbook describes the eruption that covered Pompeii. The adapted question follows the source’s description.", "vocab": [["הר געש", "volcano"], ["סלעים", "rocks"]], "questions": [{"q": "מה כיסה את פומפיי לפי המשפט?", "a": "ענן כבד של אבנים וסלעים", "opts": ["ענן כבד של אבנים וסלעים", "חול מדברי", "שלג", "מי ים"], "kind": "Original choice exercise · adapted comprehension choices", "explanation": "המשפט אומר שמהר הגעש יצא ענן כבד של אבנים וסלעים וכיסה את העיר."}]},
  {"id": "shnayim-7-comics", "title": "ספרות קומיקס — קריאה", "source": "עברית בשניים לרמה ב׳ • chapter 7, אומנות • PDF page 210 (printed pages 198–199) • selected original Hebrew reading sentences; adapted comprehension choices", "he": "אבל לא כמו ההורים האלה, יותר ויותר הורים ומחנכים ממליצים לילדים לקרוא ספרי קומיקס. [...] בספרי הקומיקס יש ציורים שעוזרים לילד להבין את משמעות הסיפור. [...] בספר הזה אין הרבה מילים, כמו בספר רגיל.", "en": "The reading describes how drawings and fewer words help children follow comics. Omissions are marked.", "vocab": [["קומיקס", "comics"], ["ציורים", "drawings"]], "questions": [{"q": "מה יש בספרי הקומיקס לפי הקטע?", "a": "ציורים ומעט מילים", "opts": ["ציורים ומעט מילים", "רק מילים בלי ציורים", "רק פיסול", "רק מוזיקה"], "kind": "Original reading · adapted comprehension choices", "explanation": "הקטע אומר שיש ציורים ושבספר המתואר אין הרבה מילים כמו בספר רגיל."}]},
  {"id": "shnayim-6-ghetto", "title": "גטו — קריאה ושאלות", "source": "עברית בשניים לרמה ב׳ • chapter 6, אדם לאדם • PDF page 152 (printed page 140) • selected original Hebrew sentences; adapted comprehension choices", "he": "מי שמטייל בגטו ברחובות העיר ונציה שבאיטליה, אוהב את הבתים העתיקים ואת האווירה המיוחדת של העיר, אבל אנשים מעטים יודעים שמספר רחובות היו בעבר חלק מהגטו – שכונת מגורים סגורה, שיהודים גרו בה משנת 1516 עד 1797. השליטים של ונציה אפשרו ליהודים להישאר בעיר ולחיות רק בשכונה הזאת. השכונה נסגרה בלילה ובחגים של הנוצרים. היהודים בגטו לא יכלו לעבוד בכל עבודה. [...] במאה ה־18 נפוליון כבש את איטליה, שחרר את היהודים ונתן להם חופש לגור ולחיות בכל מקום באיטליה, בצרפת ובארצות אחרות שהוא כבש.", "en": "The reading describes the Venice ghetto, its restrictions, and Napoleon’s later release of the Jews. Selected textbook sentences are shown; omitted text is marked.", "vocab": [["גטו", "ghetto"], ["שכונה", "neighborhood"], ["למרות", "despite"]], "questions": [{"q": "באיזו עיר נמצא הגטו המתואר?", "a": "ונציה", "opts": ["ונציה", "ברלין", "ירושלים", "ורשה"], "kind": "Original reading · adapted comprehension choices", "explanation": "במשפט הראשון כתוב ״ברחובות העיר ונציה שבאיטליה״."}, {"q": "מה אפשרו שליטי ונציה ליהודים?", "a": "להישאר בעיר ולחיות רק בשכונת הגטו", "opts": ["להישאר בעיר ולחיות רק בשכונת הגטו", "לעבוד בכל עבודה", "לגור בכל מקום באיטליה", "לפתוח את השכונה בלילה"], "kind": "Original reading · adapted comprehension choices", "explanation": "המשפט השני אומר שהותר להם להישאר בעיר רק בשכונה הזאת."}, {"q": "מי שחרר את היהודים לאחר שכבש את איטליה?", "a": "נפוליון", "opts": ["נפוליון", "שליטי ונציה", "הציירים", "תלמידי בית הספר"], "kind": "Original reading · adapted comprehension choices", "explanation": "הקטע אומר שנפוליון כבש את איטליה ושחרר את היהודים."}]} ,
  {"id": "shnayim-6-righteous", "title": "חסידי אומות העולם — קריאה ושאלות", "source": "עברית בשניים לרמה ב׳ • chapter 6, אדם לאדם • PDF pages 154–156 (printed pages 143–145) • selected original Hebrew sentences; adapted comprehension choices", "he": "בשנת 1953 החליטה ממשלת ישראל לתת תעודת ״חסידי אומות העולם״ לאנשים לא יהודים, בעיקר נוצרים, כמו ראול ולנברג משוודיה, שסיכנו את חייהם כדי להציל יהודים בשואה. אחד מחסידי אומות העולם הוא ד״ר מוחמד חלמי (Mohamed Helmy), רופא מוסלמי, שחי בגרמניה. [...] ד״ר חלמי הציל אותנו משום שהיה בן אדם נדיב, אמיץ וטוב לב.", "en": "The textbook describes Israel’s recognition of non-Jews who risked their lives to save Jews during the Holocaust, including Dr. Mohamed Helmy.", "vocab": [["להציל", "to save"], ["תעודה", "certificate"]], "questions": [{"q": "מי החליט לתת את התעודה בשנת 1953?", "a": "ממשלת ישראל", "opts": ["ממשלת ישראל", "אונסקו", "הדסה", "בית הספר"], "kind": "Original reading · adapted comprehension choices", "explanation": "המשפט הראשון מציין במפורש את ממשלת ישראל."}, {"q": "מה עשה ד״ר מוחמד חלמי?", "a": "עזר להציל יהודים", "opts": ["עזר להציל יהודים", "בנה את הגטו", "צייר בוונציה", "לימד בפינלנד"], "kind": "Original reading · adapted comprehension choices", "explanation": "הקטע מתאר את ד״ר חלמי כאדם שסייע להציל יהודים בשואה."}]} ,
  {"id": "shnayim-6-roma", "title": "הצוענים — משפטי המקור", "source": "עברית בשניים לרמה ב׳ • chapter 6, אדם לאדם • PDF page 158 (printed page 146) • selected original Hebrew contrast-exercise sentences; adapted choices", "he": "הצוענים הגיעו מצפון הודו למזרח התיכון ולאירופה כבר במאה ה־10 לספירה. [...] האנגלים קוראים להם ״ג׳יפסי״, כלומר אנשים שבאו ממצרים. [...] עד היום גרמניה לא שילמה כסף למשפחות הצוענים שנהרגו בשואה.", "en": "Three original contrast-exercise statements about Roma history and the word Gypsy; omissions are marked.", "vocab": [["הצוענים", "Roma"], ["למרות זאת", "nevertheless"]], "questions": [{"q": "מתי הגיעו הצוענים לאירופה לפי משפט המקור?", "a": "במאה ה־10", "opts": ["במאה ה־10", "במאה ה־20", "בשנת 1939", "בשנת 1797"], "kind": "Original contrast exercise · adapted comprehension choices", "explanation": "המשפט הראשון אומר ״כבר במאה ה־10 לספירה״."}, {"q": "איך קוראים להם האנגלים לפי משפט המקור?", "a": "ג׳יפסי", "opts": ["ג׳יפסי", "וונציה", "יד ושם", "אביטל"], "kind": "Original contrast exercise · adapted comprehension choices", "explanation": "המשפט השני מביא את המילה ״ג׳יפסי״."}, {"q": "מי נהרגו בשואה לפי משפט המקור?", "a": "צוענים", "opts": ["צוענים", "אדריכלים", "ציירים", "מנהלי בתי ספר"], "kind": "Original contrast exercise · adapted comprehension choices", "explanation": "המשפט האחרון מדבר על משפחות הצוענים שנהרגו בשואה."}]} ,
  {"id": "shnayim-6-school-interview", "title": "ריאיון עם מנהל בית הספר", "source": "עברית בשניים לרמה ב׳ • chapter 6, אדם לאדם • PDF page 160 (printed page 148) • selected original Hebrew interview answers; adapted comprehension choices", "he": "בטח. התלמידים נסעו לקיבוץ גבעת חביבה, כדי ללמוד על מלחמת העולם השנייה ועל כל מה שקרה לעם היהודי. [...] ההורים רצו מאוד שהילדים יבקרו במחנות. הם רצו שהילדים שלהם יבינו את השואה ואת סבלם של היהודים.", "en": "The school director explains why Muslim pupils traveled to learn about the Holocaust and why their parents wanted them to visit the camps.", "vocab": [["מחנות", "camps"], ["ללמוד", "to learn"]], "questions": [{"q": "למה נסעו התלמידים לגבעת חביבה?", "a": "כדי ללמוד על מלחמת העולם השנייה ועל מה שקרה לעם היהודי", "opts": ["כדי ללמוד על מלחמת העולם השנייה ועל מה שקרה לעם היהודי", "כדי ללמוד ציור רחוב", "כדי לבנות גן חיות", "כדי להשתתף בספורט"], "kind": "Original interview · adapted comprehension choices", "explanation": "בתשובה הראשונה המנהל אומר ״כדי ללמוד על מלחמת העולם השנייה״."}, {"q": "למה רצו ההורים שהילדים יבקרו במחנות?", "a": "כדי שיבינו את השואה ואת סבלם של היהודים", "opts": ["כדי שיבינו את השואה ואת סבלם של היהודים", "כדי ללמוד ציור רחוב", "כדי להשתתף בספורט", "כדי לבנות גן חיות"], "kind": "Original interview · adapted comprehension choices", "explanation": "בתשובת המנהל כתוב שההורים רצו שילדיהם יבינו את השואה ואת סבלם של היהודים."}]} ,
  {"id": "shnayim-6-animal-cloze", "title": "לחיות עם חיות — השלמת סיפור", "source": "עברית בשניים לרמה ב׳ • chapter 6, אדם לאדם • PDF page 166 (printed page 154) • selected original Hebrew fill-in sentences; adapted choices", "he": "לפני שנה נולדו לשנדי הכלבה שני כלבלבים חמודים. היא לא ________ (לצאת) מהבית במשך חודש ורק ________ (לטפל) בגורים הקטנים. אביטל ________ (להזמין) את הילדים לראות את הכלבה ואת שני הגורים שלה.", "en": "Complete the textbook’s past-tense blanks in the story of Shendi the dog and her puppies.", "vocab": [["כלבלבים", "puppies"], ["טיפלה", "cared for"]], "questions": [{"q": "היא לא ________ מהבית במשך חודש ורק ________ בגורים הקטנים.", "a": "יצאה; טיפלה", "opts": ["יצאה; טיפלה", "תצא; תטפל", "יוצאת; מטפלת", "יצאו; טיפלו"], "kind": "Original fill-in · adapted choices", "explanation": "הסיפור מתחיל ״לפני שנה״, ולכן פעלי העבר המתאימים הם יצאה וטיפלה."}, {"q": "באילו גורים טיפלה שנדי?", "a": "גורי כלבים", "opts": ["גורי כלבים", "גורי אריות", "ציפורים", "סוסים"], "kind": "Original story · adapted comprehension choices", "explanation": "הטקסט קורא לשנדי כלבה ולגורים כלבלבים."}]} ,
  {"id": "shnayim-6-penguin", "title": "פינגווין מיוחד — בחירה מתוך קריאה", "source": "עברית בשניים לרמה ב׳ • chapter 6, אדם לאדם • PDF page 176 (printed page 164) • selected original Hebrew choice-exercise sentences; adapted comprehension choices", "he": "לפני מספר שנים מצא ז׳ואאו פררה ד׳ סוזה, דייג בברזיל, פינגווין עייף ורעב מלא בשמן. במשך שבוע ימים הוא השתתף / טיפל בו, נתן לו אוכל / עור ובית חם, וגם נתן לו שם: דינדין. [...]", "en": "The original exercise asks the reader to choose words in the story of a Brazilian fisherman who cared for a penguin.", "vocab": [["פינגווין", "penguin"], ["טיפל", "cared for"]], "questions": [{"q": "מי מצא את הפינגווין?", "a": "ז׳ואאו פררה ד׳ סוזה", "opts": ["ז׳ואאו פררה ד׳ סוזה", "פאוזי אבו גוש", "אמין אל־חוסייני", "נפוליון"], "kind": "Original choice exercise · adapted comprehension choices", "explanation": "השם מופיע בתחילת הקטע לצד ״מצא״."}, {"q": "מה עשה ז׳ואאו לפינגווין?", "a": "טיפל בו ונתן לו אוכל", "opts": ["טיפל בו ונתן לו אוכל", "מכר אותו", "צייר אותו", "שלח אותו לבית ספר"], "kind": "Original choice exercise · adapted comprehension choices", "explanation": "האפשרויות הנכונות במשפט המקור הן ״טיפל״ ו״אוכל״."}]} ,
  {"id":"shnayim-5-bilingual","title":"בית ספר דו־לשוני","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 126 (printed page 114) • selected original Hebrew with marked omissions; choices adapted","he":"בישראל יש מספר בתי ספר דו־לשוניים: בירושלים, בחיפה, בבאר שבע, בנווה שלום, בכפר קרע, ביפו ועוד. בבתי הספר האלה לומדים ילדים יהודים, מוסלמים ונוצרים ביחד. בכל כיתה יש שני מורים: מורה דובר עברית ומורה דובר ערבית. המורים בכיתה מלמדים בשתי השפות. [...] בבית הספר חוגגים את החגים של כל הדתות.","en":"Bilingual schools bring children and two teaching languages together.","vocab":[["דו־לשוני","bilingual"],["חגים","holidays"]],"questions":[{"q":"אילו ילדים לומדים יחד בבתי הספר האלה?","a":"ילדים יהודים, מוסלמים ונוצרים","opts":["ילדים יהודים, מוסלמים ונוצרים","רק ילדים יהודים","רק ילדים מוסלמים","רק ילדים נוצרים"],"kind":"Supplemental comprehension · PDF 126","explanation":"הקטע מונה ילדים יהודים, מוסלמים ונוצרים יחד."},{"q":"באילו שפות מלמדים המורים?","a":"בעברית ובערבית","opts":["בעברית ובערבית","רק בעברית","באנגלית ובערבית","ברוסית ובעברית"],"kind":"Supplemental comprehension · PDF 126","explanation":"בכל כיתה מורה דובר עברית ומורה דובר ערבית, וההוראה בשתי השפות."}]},
  {"id":"shnayim-5-facebook","title":"דעות על חינוך דו־לשוני","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 128 (printed page 117) • selected original Hebrew with marked omissions; choices adapted","he":"מורה בבית הספר הדו־לשוני: מצד אחד, כל מקצוע דורש הכנה רבה ומתאימה לאוכלוסייה של בית הספר. איך מלמדים תנ״ך? איך מלמדים קוראן? האם הילדים מספיקים ללמוד בשתי השפות? [...] מצד שני, יש מפגש יום־יומי. התלמידים הם חברים אמיתיים, והריבים הם ריבים של ילדים רגילים אחרים: מי לקח לי את הספר? מי לקח את המשחק שלי? [...]","en":"The printed discussion weighs the work of teaching in two languages against daily contact among pupils.","vocab":[["מקצוע","subject"],["שפות","languages"]],"questions":[{"q":"איזו שאלה שואלת המורה על הלימוד?","a":"האם הילדים מספיקים ללמוד בשתי השפות?","opts":["האם הילדים מספיקים ללמוד בשתי השפות?","האם בונים בית ספר חדש?","האם הילדים נוסעים ללונדון?","האם יש להם מצלמה?"],"kind":"Supplemental comprehension · PDF 128","explanation":"המורה שואלת במפורש אם הילדים מספיקים ללמוד בשתי השפות."},{"q":"מה מתארת המורה בצד החיובי?","a":"מפגש יום־יומי בין התלמידים","opts":["מפגש יום־יומי בין התלמידים","אין חברים בבית הספר","אין מורים בכיתה","לימוד בלי שפות"],"kind":"Supplemental comprehension · PDF 128","explanation":"היא כותבת: מצד שני, יש מפגש יום־יומי והתלמידים חברים."}]},
  {"id":"shnayim-5-szold","title":"הנרייטה סאלד — אישה מיוחדת","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 132 (printed page 121) • selected original Hebrew with marked omissions; choices adapted","he":"הנרייטה סאלד נולדה בארצות הברית בשנת 1860. ב־1909 היא ביקרה בארץ ישראל יחד עם אמא שלה. בביקור זה היא הבינה שמצב הבריאות והחינוך בארץ קשה מאוד. כאשר היא חזרה לארצות הברית, היא הקימה את ארגון הבריאות הדסה. [...] עלתה לארץ ישראל והקימה את כפר הילדים שנקרא גם כפר סאלד. כולם קראו לה ״אם הילדים״.","en":"Henrietta Szold founded Hadassah and later helped children in Israel.","vocab":[["הדסה","Hadassah"],["בריאות","health"]],"questions":[{"q":"איזה ארגון הקימה הנרייטה סאלד?","a":"הדסה","opts":["הדסה","בית השנטי","אונסקו","האוניברסיטה העברית"],"kind":"Supplemental comprehension · PDF 132","explanation":"הקריאה אומרת שהקימה את ארגון הבריאות הדסה."},{"q":"איך קראו לה?","a":"אם הילדים","opts":["אם הילדים","מלכת המדבר","שומרת הפסיפסים","אם המכתשים"],"kind":"Supplemental comprehension · PDF 132","explanation":"בסוף הקטע כתוב שכולם קראו לה ״אם הילדים״."}]},
  {"id":"shnayim-5-father","title":"הכול תלוי בחינוך — שיחה","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 134 (printed page 122) • selected original Hebrew with marked omissions; choices adapted","he":"אם המורה שלכם אמרה את זה, היא ממש טועה. אני שונא להגיד לך את זה, מפני שאת אוהבת אותה, אבל היא טועה, ואני חושב שהיא אפילו לא יודעת את זה. אין גזע או גזעים. יש אנשים בצבעים שונים, אנשים נמוכים ואנשים גבוהים, עם כוח או בלי כוח. אפשר להשתמש במילה ״גזע״ להבדיל בין בני אדם, משום שלמילה גזע אין בסיס מדעי. [...] הכול תלוי בחינוך שתקבלו.","en":"A father and daughter discuss differences among people and the role of education.","vocab":[["חינוך","education"],["שונה","different"]],"questions":[{"q":"במה תלוי היחס בין הילדים, לפי השיחה?","a":"בחינוך שיקבלו","opts":["בחינוך שיקבלו","בגובה הבית","במפת העיר","בשם בית הספר"],"kind":"Supplemental dialogue comprehension · PDF 134","explanation":"בשיחה נאמר: הכול תלוי בחינוך שתקבלו."},{"q":"מה האב אומר על ״גזע״?","a":"אין לו בסיס מדעי","opts":["אין לו בסיס מדעי","יש לו בסיס מדעי ברור","זה שם של בית ספר","זה סוג של בניין"],"kind":"Supplemental dialogue comprehension · PDF 134","explanation":"האב אומר שלמילה גזע אין בסיס מדעי."}]},
  {"id":"shnayim-5-sparta","title":"חינוך ספרטני","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 136 (printed page 124) • selected original Hebrew with marked omissions; choices adapted","he":"ספרטה הייתה עיר (פוליס ביוונית) חשובה ביוון העתיקה. [...] איך בונים צבא חזק? אומרים שהספרטנים לא השאירו בחיים תינוקות חלשים או לא בריאים. כל הילדים מגיל שבע גדלו במחנות צבא, ורק בגיל 30 יכלו לחזור למשפחה שלהם. בחינוך הספרטני המשמעת הייתה חזקה מאוד, ולא היה חופש לאהבה. [...]","en":"The reading describes military education in ancient Sparta.","vocab":[["ספרטה","Sparta"],["משמעת","discipline"]],"questions":[{"q":"באיזו ארץ עתיקה הייתה ספרטה?","a":"ביוון","opts":["ביוון","בישראל","באנגליה","בנורווגיה"],"kind":"Supplemental comprehension · PDF 136","explanation":"המשפט הראשון מציב את ספרטה ביוון העתיקה."},{"q":"באיזה גיל יכלו הילדים לחזור למשפחה שלהם?","a":"בגיל 30","opts":["בגיל 30","בגיל 7","בגיל 13","בגיל 50"],"kind":"Supplemental comprehension · PDF 136","explanation":"הקריאה אומרת שחזרו למשפחה רק בגיל 30."}]},
  {"id":"shnayim-5-finland","title":"חינוך בזמן המודרני — פינלנד","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 138 (printed page 126) • selected original Hebrew with marked omissions; choices adapted","he":"שלום אדוני השר, כולם מקנאים בחינוך שמקבלים הילדים בפינלנד, חינוך לחשיבה, לעצמאות... איך אתה מסביר את זה? [...] התלמידים בפינלנד מקבלים מהמורים הרבה תפקידים, לכן הם הופכים לתלמידים עצמאיים. [...] למורים חשוב ללמד בדרכים מעניינות וחדשות, ולכן ההורים והתלמידים מרוצים מאוד.","en":"A dialogue with Finland’s education minister links classroom tasks with independence.","vocab":[["פינלנד","Finland"],["עצמאיים","independent"]],"questions":[{"q":"מה נעשים התלמידים בפינלנד, לפי השיחה?","a":"תלמידים עצמאיים","opts":["תלמידים עצמאיים","אדריכלים","חיילים","מורים בלבד"],"kind":"Supplemental dialogue comprehension · PDF 138","explanation":"השר אומר שהתפקידים שמקבלים התלמידים עוזרים להם להיות עצמאיים."},{"q":"למה ההורים והתלמידים מרוצים?","a":"כי המורים מלמדים בדרכים מעניינות וחדשות","opts":["כי המורים מלמדים בדרכים מעניינות וחדשות","כי אין מורים","כי אין לימודים","כי אין בית ספר"],"kind":"Supplemental dialogue comprehension · PDF 138","explanation":"השיחה קושרת את שביעות הרצון לדרכי הוראה מעניינות וחדשות."}]},
  {"id":"shnayim-5-goldberg","title":"לאה גולדברג — השלמת פעלים","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 144 (printed page 132) • selected original Hebrew with marked omissions; choices adapted","he":"לאה גולדברג הייתה לא רק משוררת, אלא גם סופרת, מתרגמת וחוקרת ספרות. הרבה אנשים בארץ מכירים את _____ (שירים) ואוהבים לקרוא ולשיר אותם. [...] בשנת 1935 היא הגיעה לבדה לארץ ישראל, ואחרי שנה עלו _____ (אם) ו_____ (אחות). [...] היא גם כתבה שירים וסיפורים לילדים, ותרגמה שירים וסיפורים רבים.","en":"The printed biography contains possessive noun blanks and describes Goldberg’s writing.","vocab":[["משוררת","poet"],["תרגמה","translated"]],"questions":[{"q":"בשנת 1935 היא הגיעה _____ לארץ ישראל.","a":"לבדה","opts":["לבדה","עם כל משפחתה","עם תלמידיה","עם המורה שלה"],"kind":"Printed biography detail · PDF 144 · adapted choices","explanation":"הקריאה אומרת שהגיעה לבדה בשנת 1935."},{"q":"מה כתבה לאה גולדברג לילדים?","a":"שירים וסיפורים","opts":["שירים וסיפורים","רק מפות","רק כתבות ספורט","רק מאמרים על גאולוגיה"],"kind":"Supplemental comprehension · PDF 144","explanation":"הקטע אומר שכתבה שירים וסיפורים לילדים."}]},
  {"id":"shnayim-5-yalan","title":"מרים ילן־שטקליס","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 144 (printed page 132) • selected original Hebrew with marked omissions; choices adapted","he":"סיפור החיים של מרים ילן־שטקליס דומה לסיפור חייה של לאה גולדברג. שתיהן עלו לארץ ישראל, שתיהן גרו בירושלים, שתיהן קיבלו את פרס ישראל על _____ (עבודה) הספרותית, ושתיהן עבדו באוניברסיטה העברית. מרים ילן־שטקליס הייתה ספרנית בספרייה הלאומית באוניברסיטה. [...]","en":"The textbook compares two writers for children and mentions the Israel Prize.","vocab":[["פרס ישראל","Israel Prize"],["ספרנית","librarian"]],"questions":[{"q":"באיזו עיר גרו שתי הסופרות?","a":"בירושלים","opts":["בירושלים","בלונדון","ברמלה","באוסלו"],"kind":"Supplemental comprehension · PDF 144","explanation":"הטקסט אומר ששתיהן גרו בירושלים."},{"q":"איזה פרס קיבלו שתיהן?","a":"פרס ישראל","opts":["פרס ישראל","פרס נובל","פרס ספיר","פרס אוסקר"],"kind":"Supplemental comprehension · PDF 144","explanation":"הקטע אומר ששתיהן קיבלו את פרס ישראל על עבודתן הספרותית."}]},
  {"id":"shnayim-5-harlow","title":"אימא ברזל ואימא בד","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 146 (printed page 134) • selected original Hebrew with marked omissions; choices adapted","he":"הארי הארלו, פסיכולוג שפעל במאה ה־20, רצה לדעת אם חום ואהבה שנותנות אימהות, חשובים לתינוקות ולילדים קטנים יותר ממזון. [...] הקופים הלכו לאם מברזל רק בגלל הרעב, ובגללו הם ישבו לידה, אבל רק בשעות האוכל. רוב הזמן הם היו קרובים לאם מבד. [...]","en":"The reading describes Harlow’s comparison of cloth and wire surrogate mothers.","vocab":[["חום","warmth"],["מזון","food"]],"questions":[{"q":"מה רצה הארי הארלו לבדוק?","a":"אם חום ואהבה חשובים יותר ממזון","opts":["אם חום ואהבה חשובים יותר ממזון","איך לבנות בית ספר","איך לצלם בניין","איזה שיר נכתב באנגליה"],"kind":"Supplemental comprehension · PDF 146","explanation":"משפט הפתיחה מציג את שאלת המחקר על חום, אהבה ומזון."},{"q":"לאיזו ״אימא״ הלכו הקופים הקטנים בדרך כלל?","a":"לאימא מבד","opts":["לאימא מבד","לאימא מברזל בלבד","למורה בבית הספר","לכלוב ריק"],"kind":"Supplemental comprehension · PDF 146","explanation":"הקריאה אומרת שפנו לאימא מבד, וקיבלו מזון מן הברזל כשהיו רעבים."}]},
  {"id":"shnayim-5-darwish","title":"מותו של מחמוד דרוויש","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 148 (printed page 136) • selected original Hebrew with marked omissions; choices adapted","he":"כאשר הייתי מורה בבית הספר התיכון בכפר הערבי יסיף, למדו אצלי תלמידים ערבים מ־28 כפרים, מהגליל ועד הכרמל. רק שלושה בתי ספר תיכוניים היו אז בגליל: בנצרת, ברמה ובכפר יסיף. באחת הכיתות ישב מחמוד דרוויש, ילד בלונדיני, ששערותיו קצת אדמדמות ועיניו בהירות. עוד לנער הזה היה גוף רזה מאוד. [...] מאז שהוא היה תלמיד עברו 44 שנים. [...] (על פי עוזי אורנן, 19 באוגוסט 2008)","en":"A teacher remembers Mahmoud Darwish as a school pupil and later poet.","vocab":[["מחמוד דרוויש","Mahmoud Darwish"],["תלמידים","pupils"]],"questions":[{"q":"מי היה מחמוד דרוויש למספר בתחילת הסיפור?","a":"תלמיד שלו","opts":["תלמיד שלו","המורה שלו","אדריכל בית הספר","מנהל המלון"],"kind":"Supplemental comprehension · PDF 148","explanation":"המספר פותח בזיכרון מתקופתו כמורה, כאשר מחמוד ישב באחת הכיתות."},{"q":"כמה שנים עברו עד פגישתם המאוחרת?","a":"44 שנים","opts":["44 שנים","4 שנים","14 שנים","80 שנים"],"kind":"Printed writing prompt context · PDF 148 · adapted choices","explanation":"ההוראה בתחתית העמוד מזכירה פגישה אחרי 44 שנים."}]},
  {"id":"shnayim-5-robin","title":"רובין הוד — אגדה או מציאות היסטורית?","source":"עברית בשניים לרמה ב׳ • chapter 5 • PDF page 150 (printed page 138) • selected original Hebrew with marked omissions; choices adapted","he":"״האם אתה רוצה ש_____ (לספר, אני) לך את הסיפור על רובין הוד הגיבור?״, שואלים הורים רבים את ילדיהם _____ (קטנים / הקטנים). אך לא בטוח שפסיכולוגים _____ (להסכים, עתיד) שזה סיפור טוב. אולי הם יגידו ״אסור שהילד _____ (לשמוע) סיפורים כאלה״ או ״זה תלוי _____ (על / ב) גיל של הילד״. [...]","en":"The original word-choice and verb fill-in asks whether the Robin Hood story suits young children.","vocab":[["אגדה","legend"],["סיפורים","stories"]],"questions":[{"q":"״האם אתה רוצה ש_____ (לספר, אני) לך את הסיפור על רובין הוד?״","a":"אספר","opts":["אספר","ספרתי","מספר","יספר"],"kind":"Printed verb fill-in · PDF 150 · adapted choices","explanation":"אחרי רוצה ש־, גוף אני בעתיד של לספר הוא אספר."},{"q":"״זה תלוי _____ גיל של הילד״.","a":"ב","opts":["ב","על","עם","אל"],"kind":"Printed preposition choice · PDF 150 · adapted choices","explanation":"הצירוף הנלמד הוא תלוי ב־; התרגיל מציע על או ב."}]},
  {"id":"shnayim-4-open-houses","title":"בתים פתוחים — קריאה ושאלות","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF page 102 (printed pages 90–91) • selected original Hebrew with marked omissions; printed questions adapted to choices","he":"כל שנה מגיעים ללונדון מיליוני תיירים. כ־300,000 מגיעים במיוחד להשתתף בפסטיבל ״בית פתוח״. פעם בשנה, במשך סוף שבוע ארוך, מבקרים כל האנשים האלה בבתים של אחרים, בבניינים ציבוריים, בבניינים היסטוריים או מודרניים ואפילו ברחובות מיוחדים. [...] ויקטוריה תורנטון, אדריכלית ידועה באנגליה שהתחילה את הפרויקט בשנת 1992, הרגישה שאין קשר בין אנשי המקצוע שמתכננים בניינים – האדריכלים – לבין הציבור.","en":"The London Open House reading introduces the festival and its founder.","vocab":[["אדריכלית","architect"],["ציבור","public"],["בניינים","buildings"]],"questions":[{"q":"איפה מתקיים פסטיבל ״בית פתוח״?","a":"בלונדון","opts":["בלונדון","בירושלים","ברמלה","בחיפה"],"kind":"Supplemental comprehension · PDF 102","explanation":"משפט הפתיחה אומר שהתיירים מגיעים ללונדון."},{"q":"מי התחילה את הפרויקט בשנת 1992?","a":"ויקטוריה תורנטון","opts":["ויקטוריה תורנטון","זאהא חדיד","דפנה","מרים ילן־שטקליס"],"kind":"Supplemental comprehension · PDF 102","explanation":"בקטע כתוב שוויקטוריה תורנטון התחילה את הפרויקט בשנת 1992."}]},
  {"id":"shnayim-4-photo","title":"תמונה מספרת — עובדי הבניין","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF pages 106–107 (printed pages 94–95) • selected original Hebrew with marked omissions; comprehension adapted","he":"בשנות ה־30 של המאה הקודמת בעיר ניו יורק שבארצות הברית בנו הרבה מאוד בניינים גבוהים. התמונה – ארוחת צוהריים על גורד שחקים – הפכה להיות סמל של העיר ניו יורק. בתמונה רואים קבוצה של בנאים בהפסקה יושבת על קורה בגובה עשרות מטרים מהאדמה. מתחת לרגלי הבנאים יש בניינים גבוהים, אבל הם קוראים עיתון, מדברים זה עם זה ולא פוחדים ליפול ולא דואגים. [...] לא, אי אפשר היה לשאול את הצלם, מפני שלא ידענו מי הוא.","en":"The photographed workers sit high over New York City; the reading asks who took the picture.","vocab":[["גורד שחקים","skyscraper"],["קורה","beam"],["צלם","photographer"]],"questions":[{"q":"באיזו עיר צולמה התמונה?","a":"בניו יורק","opts":["בניו יורק","בלונדון","בירושלים","ברמלה"],"kind":"Supplemental comprehension · PDF 106","explanation":"הקטע מציין שבנייני ניו יורק מופיעים בתמונה."},{"q":"למה אי אפשר היה לשאול את הצלם?","a":"מפני שלא ידעו מי הוא","opts":["מפני שלא ידעו מי הוא","מפני שהיה בלונדון","מפני שלא הייתה מצלמה","מפני שהבנאים הלכו הביתה"],"kind":"Supplemental comprehension · PDF 106","explanation":"הקטע אומר שלא ידעו מי היה הצלם."}]},
  {"id":"shnayim-4-synagogue","title":"בית הכנסת בהר הצופים","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF pages 114–115 (printed pages 102–103) • selected original Hebrew with marked omissions; questions adapted","he":"האדריכל הידוע רם כרמי, שבנה בניינים רבים בישראל, כמו בית המשפט העליון בירושלים, תכנן את בית הכנסת. מה מיוחד בבית הכנסת הזה? מול המתפללים יש חלון גדול מאוד, ומשם אפשר לצפות בנוף של ירושלים העתיקה. [...]","en":"The synagogue is named for a donor; Ram Karmi designed it with a view of old Jerusalem.","vocab":[["בית הכנסת","synagogue"],["אדריכל","architect"],["הנוף","the view"]],"questions":[{"q":"מי תכנן את בית הכנסת?","a":"רם כרמי","opts":["רם כרמי","מאיר יעקב שיק","ויקטוריה תורנטון","זאהא חדיד"],"kind":"Supplemental comprehension · PDF 114","explanation":"הטקסט מייחס את התכנון לאדריכל רם כרמי; מאיר יעקב שיק הוא האדם שעל שמו נקרא בית הכנסת."},{"q":"מה רואים דרך החלון הגדול?","a":"את ירושלים העתיקה","opts":["את ירושלים העתיקה","את לונדון","את ים המלח","את מכתש רמון"],"kind":"Supplemental comprehension · PDF 114","explanation":"מול המתפללים יש חלון שממנו אפשר לצפות בירושלים העתיקה."}]},
  {"id":"shnayim-4-hadid","title":"זאהא חדיד — אדריכלית","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF pages 114–116 (printed pages 103–104) • selected original Hebrew with marked omissions; questions adapted","he":"זאהא חדיד הייתה אדריכלית בריטית ממוצא עיראקי, שפעלה בבריטניה עד שמתה ב־2016. היא נולדה בעיראק, למדה שם מתמטיקה ואחר כך אדריכלות. [...] אדריכלים רבים אומרים היום שחדיד הייתה אחת האדריכליות המשפיעות בעולם. היא תכננה מוזיאונים, גשרים, בריכות שחייה, תחנות רכבת ועוד בסגנון טכנולוגי מיוחד. [...]","en":"Zaha Hadid was an Iraqi-born British architect whose designs included museums and bridges.","vocab":[["אדריכלית","architect"],["גשרים","bridges"],["מוזיאונים","museums"]],"questions":[{"q":"איפה נולדה זאהא חדיד?","a":"בעיראק","opts":["בעיראק","באנגליה","בנורווגיה","בישראל"],"kind":"Supplemental comprehension · PDF 114","explanation":"הקטע אומר במפורש שהיא נולדה בעיראק."},{"q":"מה תכננה חדיד לפי הקטע?","a":"מוזיאונים וגשרים","opts":["מוזיאונים וגשרים","רק בתי ספר","רק בתי מלון","רק חדרי ילדים"],"kind":"Supplemental comprehension · PDF 116","explanation":"הקריאה מונה מוזיאונים וגשרים בין עבודותיה."}]},
  {"id":"shnayim-4-architect-cloze","title":"מונולוג של אדריכל — השלמת מילים","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF page 118 (printed page 106) • selected original fill-in text with marked omissions; choices adapted","he":"העשירים, שקונים דירות במגדלים, לא חיים בעיר. הם לא _____ בבתי קפה, לא _____ בחנויות בשכונה ולא נכנסים לסופרמרקט הקטן בעיר. הילדים שלהם לא _____ לגן או לבית הספר, והם לא _____ את הכלב שלהם לטיול. [...] האנשים שחיים בעיר כל הזמן, משלמים _____ לעירייה, וזה הכסף הגדול.","en":"The original fill-in monologue contrasts tower residents with street life.","vocab":[["מגדלים","towers"],["עירייה","municipality"],["דירות","apartments"]],"questions":[{"q":"העשירים, שקונים דירות במגדלים, לא חיים בעיר. הם לא _____ בבתי קפה.","a":"יושבים","opts":["יושבים","יושב","ישבו","יושבת"],"kind":"Printed fill-in · PDF 118 · adapted choices","explanation":"הנושא הם דורש רבים: יושבים בבתי קפה."},{"q":"האנשים שחיים בעיר כל הזמן, משלמים _____ לעירייה.","a":"מיסים","opts":["מיסים","בתים","גשרים","חלונות"],"kind":"Printed fill-in · PDF 118 · adapted choices","explanation":"מיסים הוא שם העצם שמתאים לפועל משלמים ולעירייה."}]},
  {"id":"shnayim-4-shanti","title":"בית השנטי — בית לנערים בסיכון","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF pages 120–121 (printed pages 108–109) • selected original Hebrew with marked omissions; printed question adapted","he":"בית השנטי הוא ארגון שעוזר לנערים ולנערות שעזבו את הבית ועברו לגור ברחוב, כי קשה היה להם להישאר עם המשפחה שלהם בגלל אלימות או בגלל מצב כלכלי קשה ביותר. לבית השנטי בתל אביב ולבית השנטי בדרום שהקימה מריומה בן יוסף, מגיעים נערים מכל הקבוצות ומכל הדתות. שם הם מקבלים ארוחה חמה ומיטה לישון בה. [...] רבים מהנערים, שקיבלו עזרה מבית השנטי, חוזרים לשם אחרי מספר שנים כדי לעזור לנערים החדשים.","en":"Beit Hashanti helps young people who left home; some later return to help others.","vocab":[["נערים","youths"],["ארוחה חמה","warm meal"],["אלימות","violence"]],"questions":[{"q":"למי עוזר בית השנטי?","a":"לנערים ולנערות שעזבו את הבית","opts":["לנערים ולנערות שעזבו את הבית","לאדריכלים בלבד","לתיירים בלונדון","למורים בלבד"],"kind":"Supplemental comprehension · PDF 120","explanation":"המשפט הראשון מתאר נערים ונערות שעזבו את הבית."},{"q":"מה עושים חלק מהנערים אחרי מספר שנים?","a":"חוזרים לעזור לנערים החדשים","opts":["חוזרים לעזור לנערים החדשים","נוסעים ללונדון","בונים בית כנסת","קונים דירות במגדל"],"kind":"Supplemental comprehension · PDF 120","explanation":"בסוף הפסקה כתוב שרבים מהם חוזרים לעזור לנערים החדשים."}]},
  {"id":"shnayim-4-wise-man","title":"איש חכם — סיפור","source":"עברית בשניים לרמה ב׳ • chapter 4 • PDF pages 122–123 (printed pages 110–111) • selected original Hebrew with marked omissions; source completion adapted","he":"פעם גר בבית גדול ורחב בן שלוש קומות וחדרים רבים איש עשיר, ידוע, וחכם. הייתה לו אישה והיו לו ילדים גדולים ונכדים, וכל השכנים והקרובים אהבו אותו וכיבדו אותו מאוד. [...] יום אחד מתה אשתו האהובה והוא נשאר לבדו בין ארבע קירות במשך שנה ארוכה. [...] יום אחד הוא אמר לבן הבכור שלו: ״תאסוף את כל האחים שלך, יש לי משהו חשוב להגיד לכם.״ [...] ״אתם יודעים שמכרתי את הבית ואת האדמות שלי. אבל לא סיפרתי לכם על האוצר האחרון שנשאר לי. הנה המפתח לארגז שבו נמצא האוצר שלי – כסף ויהלומים רבים. [...]״","en":"A wealthy father tells his children of a hidden chest; the story continues on the next printed page.","vocab":[["אוצר","treasure"],["ארגז","chest"],["יהלומים","diamonds"]],"questions":[{"q":"מה אמר האב שנמצא בארגז?","a":"כסף ויהלומים רבים","opts":["כסף ויהלומים רבים","מכתבים מלונדון","כרטיסי ברכה","ספרי לימוד"],"kind":"Supplemental comprehension · PDF 122","explanation":"האב מתאר את האוצר ככסף ויהלומים רבים."},{"q":"למי אמר האב לאסוף את האחים?","a":"לבן הבכור","opts":["לבן הבכור","לראש העיר","לאדריכל","לשכן"],"kind":"Supplemental comprehension · PDF 122","explanation":"הוא פונה לבן הבכור ואומר לו לאסוף את האחים."}]},
  {"id":"shnayim-3-landscapes","title":"תמונות נוף","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 66 (printed pages 54–55) • selected original Hebrew with marked omissions; choices adapted","he":"יש בעולם ארצות ״ירוקות״ עם שדות ירוקים בלי סוף, ארצות ״צהובות״ עם מדבריות, ארצות ״כחולות״ עם ימים ואגמים רבים או ארצות ״לבנות״ עם שלג אין־סופי. ישראל היא קצת ירוקה, קצת צהובה, קצת כחולה וקצת לבנה. בנוף של ישראל יש הכול: שדות עם חקלאות, קצת ים — הכנרת, ים המלח, הים התיכון, הים האדום, הר אחד עם שלג כמעט כל החורף — החרמון, ומדבר אחד גדול בדרום הארץ — הנגב. [...]","en":"The opening reading compares green, yellow, blue and white landscapes and names the varied geography of Israel.","vocab":[["נוף","landscape"],["מדבריות","deserts"],["החרמון","Mount Hermon"]],"questions":[{"q":"בישראל יש לא רק אזורים ירוקים, אלא גם נוף מדברי. נכון או לא נכון?","a":"נכון","opts":["נכון","לא נכון","אין בקטע אזורים ירוקים","המדבר נמצא בים"],"kind":"Printed true/false · PDF 66 · adapted choices","explanation":"הקטע מתאר גם שדות ירוקים וגם את הנגב המדברי."},{"q":"אילו שני ימים מוזכרים בקטע?","a":"ים המלח והים התיכון","opts":["ים המלח והים התיכון","הים השחור והים הבלטי","ים סוף והים השחור","ים הכנרת והים השחור"],"kind":"Supplemental comprehension · PDF 66","explanation":"ברשימת הימים נמצאים ים המלח והים התיכון."}]},
  {"id":"shnayim-3-mitzpe","title":"מצפה רמון","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 66 (printed page 55); original questions PDF 68 (printed page 56) • selected original Hebrew with marked omissions; choices adapted","he":"מי שנוסע בנגב יכול להגיע לעיר באר שבע וליישובים קטנים אחרים. אחד היישובים הקטנים בנגב הוא מצפה רמון. השם רמון בא מהמילה רומאים בארמית. קראו לו כך מפני שהרומאים עברו בדרך ליד המכתש הגדול והמכתש הקטן. [...] במשך שנים רבות אף אחד לא רצה להתיישב שם בגלל החום הכבד ובגלל המרחק ממרכז הארץ, אך בסוף שנות ה־90 הגיעו לעיר שני רקדנים מפורסמים: ליאת דרור וניר בן גל. [...]","en":"Mitzpe Ramon is a small Negev settlement; the reading explains its name and why settlement was once difficult.","vocab":[["להתיישב","to settle"],["מכתש","crater"],["מרחק","distance"]],"questions":[{"q":"״קראו לו כך״ — למי קראו כך?","a":"למצפה רמון","opts":["למצפה רמון","לבאר שבע","לנגב","לים המלח"],"kind":"Printed referent question א1 · PDF 68 · adapted choices","explanation":"המשפט הקודם אומר שאחד היישובים הקטנים בנגב הוא מצפה רמון."},{"q":"״אף אחד לא רצה להתיישב שם״ — איפה?","a":"במצפה רמון","opts":["במצפה רמון","בים המלח","בבית המלון","בתל אביב"],"kind":"Printed referent question א2 · PDF 68 · adapted choices","explanation":"שם חוזר למצפה רמון, היישוב שהקטע מתאר."}]},
  {"id":"shnayim-3-crater","title":"הגאולוגים מסבירים — מכתש רמון","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 70 (printed page 58) • selected original Hebrew with marked omissions; choices adapted","he":"מה זה מכתש? מים נכנסו לחלק התחתון והמרכזי של הר ועשו בור שגדל עוד ועוד, עד שהרס את ההר. כך קרה למספר הרים קרובים, אבל לא להרים אחרים מסביב. אורך מכתש רמון הוא 40 קילומטרים, הרוחב שלו כ־9 קילומטרים והעומק שלו כ־350 מטרים. [...] גאולוגים חוקרים את האדמה ואת הימים של כדור הארץ.","en":"The passage explains the crater and gives Ramon Crater’s length, width and depth.","vocab":[["גאולוגים","geologists"],["אורך","length"],["עומק","depth"]],"questions":[{"q":"מה אורך מכתש רמון לפי הקטע?","a":"40 קילומטרים","opts":["40 קילומטרים","9 מטרים","350 קילומטרים","4 קילומטרים"],"kind":"Supplemental comprehension · PDF 70","explanation":"הפסקה מודדת את אורך המכתש ב־40 קילומטרים."},{"q":"לפי הקטע, מה חוקרים גאולוגים?","a":"את האדמה ואת הימים של כדור הארץ","opts":["את האדמה ואת הימים של כדור הארץ","רק את הרכבות","רק את האותיות","רק את המוזיקה"],"kind":"Supplemental comprehension · PDF 70","explanation":"הבועה לצד הקטע מתארת את עבודת הגאולוגים."}]},
  {"id":"shnayim-3-ramla","title":"העיר רמלה — נוף עירוני","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 70 (printed page 59) • selected original Hebrew with marked omissions; choices adapted","he":"במאה השמינית לספירה החליט סלימאן עבד אל־מלכ להקים עיר חדשה. זאת הייתה העיר הראשונה שהמוסלמים הקימו בארץ ושמה היה ״רמלה״. משמעות השם בערבית היא חול או חולות. [...] ברמלה לא היו מים מתוקים, ולכן בנו שם בריכות מים. את המים לבריכות לקחו ממעיינות מסביב לעיר. [...]","en":"The reading explains Ramla’s founding, the meaning of its name, and its water pools.","vocab":[["להקים","to establish"],["חולות","sands"],["בריכות מים","water pools"]],"questions":[{"q":"מי החליט להקים את רמלה?","a":"סלימאן עבד אל־מלכ","opts":["סלימאן עבד אל־מלכ","צ׳רלס דרווין","בנימין מטודלה","ליאת דרור"],"kind":"Supplemental comprehension · PDF 70","explanation":"המשפט הראשון נותן את שמו של סלימאן עבד אל־מלכ."},{"q":"למה בנו ברמלה בריכות מים?","a":"כי לא היו בעיר מים מתוקים","opts":["כי לא היו בעיר מים מתוקים","כי רצו ללמד שחייה","כי רצו לבנות מלון","כי היה שלג"],"kind":"Supplemental comprehension · PDF 70","explanation":"הקטע אומר: ברמלה לא היו מים מתוקים, ולכן בנו שם בריכות מים."}]},
  {"id":"shnayim-3-mosaic","title":"שומר הפסיפסים — בחירת מילים","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 74 (printed pages 62–63) • selected original Hebrew with marked omissions; choices adapted","he":"ע׳אלב אבו דיאב היה ילד _____ (כאשר / אחרי) הוא התנדב לעבוד בעבודות שונות במוזיאון רוקפלר בירושלים. ב־1980 הוא סיים ללמוד לימודי דת בעיר חברון, ו_____ (במשך / אחרי כן) הוא התחיל לעבוד במוזיאון. [...] במשך הזמן הוא התאהב בפסיפסים, למד על ההיסטוריה שלהם וחקר אותם. [...]","en":"The printed word-choice reading follows a worker at the Rockefeller Museum and his work with mosaics.","vocab":[["פסיפסים","mosaics"],["מוזיאון","museum"],["במשך הזמן","over time"]],"questions":[{"q":"ע׳אלב אבו דיאב היה ילד _____ הוא התנדב לעבוד.","a":"כאשר","opts":["כאשר","אחרי","למרות","כדי"],"kind":"Printed word choice · PDF 74 · adapted choices","explanation":"כאשר מחברת את היותו ילד לזמן שבו התנדב לעבוד."},{"q":"מה חקר ע׳אלב במשך הזמן?","a":"את הפסיפסים","opts":["את הפסיפסים","את התחבורה","את ההרים","את שירי החג"],"kind":"Supplemental comprehension · PDF 74","explanation":"הקטע אומר שהתאהב בפסיפסים ולמד על ההיסטוריה שלהם."}]},
  {"id":"shnayim-3-hotel","title":"מלון בראשית — ראיון עם עיתונאי","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 82 (printed page 70) • selected original Hebrew with marked omissions; choices adapted","he":"מלון בראשית, שקם בשנת 2011, נמצא על יד מכתש רמון. העיתונאי מיכאל בן חיים היה בין האורחים הראשונים של המלון.\nמנהל המלון: _____ (לפתוח, עתיד) את הדלת למרפסת, _____ (לעמוד) פה ו_____ (לנשום) את האוויר. עכשיו אתה רואה את כל המכתש. איזה נוף! אין נוף כזה בכל העולם.\n[...]\nמנהל המלון: את הנוף הזה אני _____ (למכור, עתיד) לתיירים ישראלים ולא ישראלים.","en":"The printed hotel dialogue uses verb fill-ins while the manager describes the crater view.","vocab":[["מרפסת","balcony"],["מכתש","crater"],["נוף","view"]],"questions":[{"q":"מנהל המלון: _____ (לפתוח, עתיד) את הדלת למרפסת.","a":"תפתח","opts":["תפתח","יפתח","פתחתי","פותחים"],"kind":"Printed verb fill-in · PDF 82 · adapted choices","explanation":"המנהל פונה לעיתונאי בלשון אתה; עתיד של לפתוח הוא תפתח."},{"q":"איפה נמצא מלון בראשית?","a":"על יד מכתש רמון","opts":["על יד מכתש רמון","ליד ים הכנרת","במרכז תל אביב","בגליל העליון"],"kind":"Supplemental comprehension · PDF 82","explanation":"משפט הפתיחה מציין שהמלון נמצא על יד מכתש רמון."}]},
  {"id":"shnayim-3-darwin","title":"אב קדמון משותף","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 90 (printed pages 78–79) • selected original Hebrew with marked omissions; choices adapted","he":"דרווין יצא למסע ארוך וחקר את הצמחייה ואת הגאולוגיה של דרום אמריקה. הוא היה סקרן מאוד וחיפש תשובות לשאלות שהיו לו. בכל נמל הוא ירד ואסף דוגמות של צמחים ואבנים. [...]\nדרווין לא הבין איך יכול להיות שבאיים האלה חיים במשך אלפי שנים בעלי חיים מיוחדים, שלא נמצאים בשום מקום אחר בעולם. [...] אחרי שנים של מחקר הוא ענה על השאלה הזאת בספר ״מוצא המינים״.","en":"The reading describes Darwin’s voyage, his samples, and the book in which he presented his answer.","vocab":[["סקרן","curious"],["מוצא המינים","On the Origin of Species"],["אב קדמון","common ancestor"]],"questions":[{"q":"מה חקר דרווין במסע לדרום אמריקה?","a":"את הצמחייה ואת הגאולוגיה","opts":["את הצמחייה ואת הגאולוגיה","רק את התחבורה","רק את כלי הנגינה","רק את תולדות רמלה"],"kind":"Supplemental comprehension · PDF 90","explanation":"משפט הפתיחה מתאר את הצמחייה ואת הגאולוגיה."},{"q":"איך נקרא הספר שבו ענה דרווין על השאלה שלו?","a":"מוצא המינים","opts":["מוצא המינים","מסעות בנימין מטודלה","אשת לוט","כל נדרי"],"kind":"Supplemental comprehension · PDF 90","explanation":"בסוף הקטע המוצג מופיע שם הספר מוצא המינים."}]},
  {"id":"shnayim-3-alpacas","title":"חוות האלפקות — שיחה","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 94 (printed page 83) • selected original Hebrew with marked omissions; choices adapted","he":"— שלום, אנחנו רוצים לבקר בחווה שלכם.\n— ברוכים הבאים!\n— אפשר לקבל קצת מידע?\n— מה אתה רוצה לדעת?\n— יש לי שלושה ילדים. יש _____ משהו שהילדים יכולים לעשות?\n— יש לנו אלפקות. עכשיו אביב, הם יכולים לבקר את האלפקות ולראות איך אנחנו מטפלים בהן.\n[...]\n— גם חמורים. הם יכולים לרכוב על חמורים. אתם יכולים ללון כאן או _____ השכנים שלנו.\n— ואיך מזג האוויר _____?\n— כמו במדבר.","en":"The printed farm dialogue includes fill-ins and describes alpacas, donkey rides, and desert weather.","vocab":[["אלפקות","alpacas"],["חמורים","donkeys"],["מזג האוויר","weather"]],"questions":[{"q":"על אילו בעלי חיים אפשר לרכוב לפי השיחה?","a":"על חמורים","opts":["על חמורים","על אלפקות","על דגים","על פרפרים"],"kind":"Supplemental dialogue comprehension · PDF 94","explanation":"המדריך אומר: הם יכולים לרכוב על חמורים."},{"q":"איך מזג האוויר, לפי תשובת המדריך?","a":"כמו במדבר","opts":["כמו במדבר","כמו בים","כמו בשלג","כמו בעיר גשומה"],"kind":"Supplemental dialogue comprehension · PDF 94","explanation":"התשובה הקצרה בשיחה היא כמו במדבר."}]},
  {"id":"shnayim-3-bedouin","title":"אגדה בדווית","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 98 (printed page 86) • selected original Hebrew with marked omissions; choices adapted","he":"אלוהים ברא את העולם ואחר כך ביקש מהשרים שלו לבוא לקבל תפקיד. השר הראשון קיבל את תפקיד הים והאגמים. הוא שלט בדגים הגדולים ובדגים הקטנים, בטייפונים ובהוריקנים הנוראים.\nלשר השני אמר אלוהים: אתה תהיה שר היערות. אתה תשלוט בג׳ונגל, באקלים הטרופי, בפרפרים ובפרחים הצבעוניים, בנחשים ובאריות. [...]\nואז נשאר רק המדבר. מי יהיה שר המדבר?","en":"The Bedouin tale assigns domains to ministers and leaves the desert for the last one.","vocab":[["אגדה","legend"],["שר היערות","minister of forests"],["מדבר","desert"]],"questions":[{"q":"מה קיבל השר הראשון?","a":"את תפקיד הים והאגמים","opts":["את תפקיד הים והאגמים","את תפקיד המדבר","את תפקיד הרכבות","את תפקיד העיר"],"kind":"Supplemental story comprehension · PDF 98","explanation":"הפסקה הראשונה אומרת שהשר הראשון קיבל את תפקיד הים והאגמים."},{"q":"מה נשאר אחרי שהשרים קיבלו את התפקידים האחרים?","a":"המדבר","opts":["המדבר","הים","היערות","האגמים"],"kind":"Supplemental story comprehension · PDF 98","explanation":"לפני השאלה האחרונה כתוב: ואז נשאר רק המדבר."}]},
  {"id":"shnayim-3-bialik","title":"חיים נחמן ביאליק — בחירת מילים","source":"עברית בשניים לרמה ב׳ • chapter 3 • PDF page 100 (printed page 89) • selected original Hebrew with marked omissions; choices adapted","he":"חיים נחמן ביאליק היה אדם ידוע וחשוב בתרבות הישראלית של המאה הקודמת. הוא היה לא רק משורר שכתב שירים רבים, _____ (ואילו / אלא גם) סופר שכתב סיפורים מיוחדים. [...] הוא פרסם שירים רבים, כמו שירי אהבה, שירי ילדים, בלדות, שירים ארוכים ושירים קצרים. [...] שם הוא לא רק המשיך לכתוב שירים וסיפורים, _____ (ואילו / אלא גם) תרגם ספרים רבים לעברית.","en":"The printed word-choice passage describes Bialik as a poet, writer, and translator.","vocab":[["משורר","poet"],["סופר","writer"],["תרגם","translated"]],"questions":[{"q":"הוא היה לא רק משורר שכתב שירים רבים, _____ סופר שכתב סיפורים מיוחדים.","a":"אלא גם","opts":["אלא גם","ואילו","לכן","אחרי"],"kind":"Printed word choice · PDF 100 · adapted choices","explanation":"הביטוי לא רק ... אלא גם מוסיף את עבודתו כסופר."},{"q":"מה עוד עשה ביאליק חוץ מכתיבת שירים וסיפורים?","a":"תרגם ספרים רבים לעברית","opts":["תרגם ספרים רבים לעברית","בנה את רמלה","חקר את מכתש רמון","ניהל את המלון"],"kind":"Supplemental comprehension · PDF 100","explanation":"בסוף הקטע כתוב שגם תרגם ספרים רבים לעברית."}]},
  {"id":"shnayim-2-travel","title":"היום קל יותר","source":"עברית בשניים לרמה ב׳ • chapter 2 • PDF page 38 (printed page 26) original reading; PDF page 38 (printed page 27) original questions • selected original Hebrew with marked omissions; choices adapted","he":"במשך מאות שנים עזבו אנשים את הבית, ויצאו לדרך ארוכה כי הם רצו לבקר במקומות רחוקים מאוד. בעבר יציאה כזאת הייתה קשה, כי לא היו כלי תחבורה כמו היום: מכוניות, רכבות, אוטובוסים, או מטוסים, וגם האוניות לא היו מודרניות כמו האוניות של היום. [...]\n\nחלק מהאנשים האלה הצליחו לחזור הביתה בשלום, וחלק נעלם בדרך. כמעט כולם כתבו יומן על הטיול שלהם, ואפילו שלחו הביתה מכתבים. [...]\n\nהיום הרבה יותר קל להגיע למקומות רחוקים, ולא צריך לתכנן הרבה זמן לפני הטיול. גם לא צריך לקום מהכיסא ולרוץ לקנות כרטיסים לאונייה או למטוס. אפשר להיכנס לאתר באינטרנט ולקבל מידע, לקנות כרטיסים ולצאת למקומות מעניינים, כמו איי גלפגוס, נהר האמזונס בברזיל, ארץ האש בארגנטינה, דרך המשי, ומשם לכתוב מיילים למשפחה ולחברים.","en":"The passage contrasts difficult travel in the past with modern transport and online planning.","vocab":[["לצאת לדרך","to set out"],["כלי תחבורה","means of transport"],["מכתבים","letters"]],"questions":[{"q":"מה אפשר ללמוד על המטיילים בעבר?","a":"חלקם חזרו הביתה וחלקם נעלמו בדרך","opts":["חלקם חזרו הביתה וחלקם נעלמו בדרך","כולם טסו במטוסים","כולם קנו כרטיסים באינטרנט","איש מהם לא כתב יומן"],"kind":"Printed comprehension question א · PDF 38 · adapted choices","explanation":"בפסקה השנייה כתוב שחלק חזרו בשלום וחלק נעלמו בדרך."},{"q":"״היום הרבה יותר קל״ — לפי הקטע, למה?","a":"אפשר למצוא מידע ולקנות כרטיסים באינטרנט","opts":["אפשר למצוא מידע ולקנות כרטיסים באינטרנט","האוניות בעבר היו מהירות יותר","צריך לצאת חודשים מראש","אי אפשר לכתוב למשפחה"],"kind":"Printed explanation question ב · PDF 38 · adapted choices","explanation":"הפסקה האחרונה מתארת חיפוש מידע וקניית כרטיסים באתר באינטרנט."},{"q":"מה שלחו המטיילים בעבר הביתה?","a":"מכתבים","opts":["מכתבים","מיילים","כרטיסי טיסה","מחשבים"],"kind":"Supplemental comprehension · PDF 38","explanation":"בפסקה השנייה כתוב: ואפילו שלחו הביתה מכתבים."}]},
  {"id":"shnayim-2-ruthie","title":"יוצאת או לא יוצאת לדרך? — פעלים","source":"עברית בשניים לרמה ב׳ • chapter 2 • PDF page 50 (printed page 38) original dialogue verb fill-in • selected original Hebrew with blanks; choices adapted","he":"דינה: רותי, לאן _____ לפני שנה? לאן _____ בשנה הבאה? כל שנה את _____? (לטוס)\nרותי: כמה שאלות את שואלת בדקה אחת? לאט לאט. לפני שנה לא _____ אבל בשנה הבאה _____ למקסיקו. אני לא _____ כל שנה, מפני שה_____ יקרות. (לטוס)\n[...]\nדינה: נו... רותי, _____ (לבוא, עתיד) לטייל ו_____ (לנוח) אחר כך.","en":"Dina asks Ruthie about last year and next year; the printed task supplies infinitives to conjugate in the dialogue.","vocab":[["לטוס","to fly"],["בשנה הבאה","next year"],["לנוח","to rest"]],"questions":[{"q":"דינה: רותי, לאן _____ לפני שנה? (לטוס)","a":"טסת","opts":["טסת","טסתי","טסתם","תטוס"],"kind":"Printed verb fill-in · PDF 50 · adapted choices","explanation":"דינה פונה לרותי בלשון את, והנסיעה הייתה לפני שנה: טסת."},{"q":"רותי: אני לא _____ כל שנה. (לטוס)","a":"טסה","opts":["טסה","טס","טסתי","טסתם"],"kind":"Printed verb fill-in · PDF 50 · adapted choices","explanation":"רותי מדברת על הרגל בהווה; אני טסה היא נקבה יחידה."},{"q":"דינה: נו... רותי, _____ לטייל. (לבוא, עתיד)","a":"תבואי","opts":["תבואי","אבוא","באת","יבוא"],"kind":"Printed verb fill-in · PDF 50 · adapted choices","explanation":"דינה פונה לרותי בלשון את; עתיד של לבוא הוא תבואי."}]},
  {"id":"shnayim-2-benjamin","title":"בנימין מטודלה — השלמה","source":"עברית בשניים לרמה ב׳ • chapter 2 • PDF page 46 (printed page 34) original biography fill-in • selected original Hebrew with blanks; choices adapted","he":"בנימין מטודלה, יהודי שחי במאה ה־12 בעיר טודלה בדרום ספרד, היה איש מאמין וידע גדול. יום אחד הוא החליט _____ את ספרד ולנסוע מזרחה לארץ ישראל. בדרך הוא ביקר בארצות רבות: צרפת, איטליה, יוון, טורקיה, סוריה, ולבסוף הוא הגיע לארץ ישראל. אבל הוא לא עצר שם. הוא _____ לפרס, טיבט, הודו, סין ומצרים. משם הוא חזר לאיטליה ולטודלה, העיר שלו. בספר ״מסעות בנימין מטודלה״ אנחנו קוראים על ה_____ היהודיות שהוא פגש בכל המקומות האלה.","en":"The original cloze follows Benjamin of Tudela’s travels and asks for missing verb and noun forms.","vocab":[["מסעות","journeys"],["מזרחה","eastward"],["קהילות","communities"]],"questions":[{"q":"יום אחד הוא החליט _____ את ספרד ולנסוע מזרחה. (לעזוב)","a":"לעזוב","opts":["לעזוב","עזבנו","יעזבו","עוזבת"],"kind":"Printed biography fill-in · PDF 46 · adapted choices","explanation":"אחרי החליט בא שם הפועל: החליט לעזוב."},{"q":"בספר ״מסעות בנימין מטודלה״ קוראים על ה_____ היהודיות. (קהילה)","a":"קהילות","opts":["קהילות","קהילה","קהילתי","קהילתו"],"kind":"Printed biography fill-in · PDF 46 · adapted choices","explanation":"הצורה המתאימה ליהודיות היא שם עצם ברבות: קהילות."},{"q":"לאן נסע בנימין מטודלה אחרי שעזב את ספרד?","a":"מזרחה לארץ ישראל","opts":["מזרחה לארץ ישראל","מערבה לאמריקה","רק לעיר אחרת בספרד","לצפון נורווגיה"],"kind":"Supplemental comprehension · PDF 46","explanation":"הקטע אומר שהחליט לנסוע מזרחה לארץ ישראל."}]},
  {"id":"shnayim-2-neve","title":"נווה שלום — דרך חיים אחרת","source":"עברית בשניים לרמה ב׳ • chapter 2 • PDF page 54 (printed page 43) original reading; PDF page 54 (printed page 43) original question • selected original Hebrew with marked omission; choices adapted","he":"נווה שלום הוא כפר של יהודים, מוסלמים ונוצרים. הכפר, שנמצא בין ירושלים לתל אביב, קם בשנת 1970 והיום גרות שם כ־60 משפחות. הנזיר ברונו הוסאר (1911–1996), שהגיע ממצרים, חשב על הרעיון לבנות כפר אחד ליהודים ולערבים. ״הם צריכים לחיות חיים משותפים״, הוא אמר. הוא האמין שהמטרה בחיים היא אהבה בין אנשים ושלום אמיתי בין עמים. [...]\n\nהילדים בנווה שלום לומדים בבית ספר שמתאים לאידיאולוגיה של ברונו הוסאר. בבית הספר החינוך הוא דו־לשוני — התלמידים לומדים בשתי שפות: בערבית ובעברית.","en":"Neve Shalom is a shared village; the school teaches in Arabic and Hebrew.","vocab":[["חיים משותפים","shared life"],["דו־לשוני","bilingual"],["בערבית ובעברית","in Arabic and Hebrew"]],"questions":[{"q":"במה האמין ברונו הוסאר?","a":"באהבה בין אנשים ובשלום אמיתי בין עמים","opts":["באהבה בין אנשים ובשלום אמיתי בין עמים","שרק קבוצה אחת צריכה לגור בכפר","שיש ללמד רק שפה אחת","שהכפר צריך להיות שדה תעופה"],"kind":"Printed comprehension question א · PDF 54 · adapted choices","explanation":"הקטע אומר במפורש שהאמין באהבה בין אנשים ובשלום אמיתי בין עמים."},{"q":"באילו שפות לומדים הילדים בבית הספר?","a":"בערבית ובעברית","opts":["בערבית ובעברית","בצרפתית ובעברית","ברוסית ובערבית","רק באנגלית"],"kind":"Supplemental comprehension · PDF 54","explanation":"המשפט האחרון מציין חינוך דו־לשוני בערבית ובעברית."},{"q":"מתי קם הכפר?","a":"בשנת 1970","opts":["בשנת 1970","בשנת 1996","במאה ה־12","בשנת 1960"],"kind":"Supplemental comprehension · PDF 54","explanation":"בפתיחת הקריאה נאמר: קם בשנת 1970."}]},
  {"id":"shnayim-1-greeting-cards","title":"כרטיסי ברכה","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF page 13 (printed page 1) reading; PDF page 15 (printed page 2) questions • selected original Hebrew; choices adapted","he":"במאה ה־14 בגרמניה ובאוסטריה התחילו לשלוח כרטיסי ברכה לכבוד הכריסמס, חג המולד. בכרטיסים האלה היו ציורים של משפחה, של עץ ושל כוכב. המנהג הזה השפיע על היהודים באירופה, וגם הם שלחו זה לזה כרטיסי ברכה לשנה החדשה. [...] \n\nעד שנות ה־50 של המאה ה־20 המשיכו יהודים בארץ ישראל ובכל מקום בעולם לשלוח כרטיסי ברכה. [...] היום כמעט אף אחד לא עומד בתור בדואר לשלוח כרטיסי ברכה – לא יהודים, לא מוסלמים וגם לא נוצרים. בערב החג כולם מברכים בטלפונים ניידים – מדברים, מסמסים או שולחים דואר אלקטרוני.","en":"Greeting cards began as a Christmas custom in Germany and Austria, later spread to Jewish New Year greetings, and today many greetings are sent by phone or email.","vocab":[["כרטיסי ברכה","greeting cards"],["מנהג","custom"],["דואר אלקטרוני","email"]],"questions":[{"q":"לפי הקריאה, היכן התחילו לשלוח כרטיסי ברכה לכבוד הכריסמס?","a":"בגרמניה ובאוסטריה","opts":["בגרמניה ובאוסטריה","בישראל ובקנדה","בנורווגיה וביוון","באוסטרליה בלבד"],"kind":"Supplemental comprehension · PDF 13","explanation":"המשפט הראשון מציין את גרמניה ואוסטריה."},{"q":"היהודים היו הראשונים שהתחילו את מנהג כרטיסי הברכה. נכון או לא נכון?","a":"לא נכון","opts":["לא נכון","נכון","אין מידע","רק במאה ה־20"],"kind":"Printed true/false · PDF 15 · adapted choices","explanation":"הקטע מתאר תחילה את המנהג הנוצרי בגרמניה ובאוסטריה, ואחר כך את השפעתו על היהודים."},{"q":"מה שלחו היהודים זה לזה לשנה החדשה?","a":"כרטיסי ברכה","opts":["כרטיסי ברכה","תקליטים","ספרי לימוד","הזמנות לחתונה"],"kind":"Supplemental comprehension · PDF 13","explanation":"בפסקה הראשונה כתוב ששלחו כרטיסי ברכה לשנה החדשה."},{"q":"איך רבים מברכים בערב החג היום לפי הקטע?","a":"בטלפונים ניידים ובדואר אלקטרוני","opts":["בטלפונים ניידים ובדואר אלקטרוני","רק בדואר רגיל","רק על כרזות","רק בבית הספר"],"kind":"Supplemental comprehension · PDF 13","explanation":"הפסקה האחרונה מזכירה דיבור, מסרונים ודואר אלקטרוני."}]},
  {"id":"shnayim-1-holiday-dialogue","title":"עיד אל־פיטר וראש השנה","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF page 15 (printed page 3) dialogue; PDF page 17 (printed page 4) action exercise • selected original Hebrew; choices adapted","he":"דני: מה עושים בעיד אל־פיטר?\nחנין: קמים מוקדם בבוקר, מדליקים את האור, לובשים בגדים יפים ומלבישים את הילדים בבגדים חדשים, הולכים למסגד ומתפללים. במסגד נותנים לילדים הרבה ממתקים. [...]\nחנין: מי שצם כל חודש הרמדאן אומר תודה לאלוהים. [...]\nדני: בראש השנה לובשים בגדים חדשים, מדליקים נרות חג, הולכים לתפילה בבית הכנסת, ואחר כך חוזרים הביתה. [...] אנחנו אוכלים תפוח בדבש ומבקשים שהשנה החדשה תהיה שנה מתוקה.","en":"Hanin describes Eid al-Fitr after Ramadan; Danny describes Rosh Hashanah customs, including candles and apple with honey.","vocab":[["מסגד","mosque"],["ממתקים","sweets"],["תפוח בדבש","apple with honey"]],"questions":[{"q":"לפי השיחה, מי מדליקים נרות חג?","a":"יהודים","opts":["יהודים","מוסלמים בלבד","נוצרים בלבד","אף אחד"],"kind":"Printed action classification · PDF 17 · adapted choices","explanation":"דני אומר שבראש השנה מדליקים נרות חג."},{"q":"לפי השיחה, מי צמים חודש שלם?","a":"מוסלמים","opts":["מוסלמים","יהודים","נוצרים","כל הקבוצות"],"kind":"Printed action classification · PDF 17 · adapted choices","explanation":"חנין מדברת על מי שצם בכל חודש הרמדאן."},{"q":"לפי השיחה, מי אוכלים תפוח בדבש?","a":"יהודים","opts":["יהודים","מוסלמים","נוצרים","אף אחד"],"kind":"Printed action classification · PDF 17 · adapted choices","explanation":"דני מתאר אכילת תפוח בדבש בראש השנה."},{"q":"לפי חנין, מה נותנים לילדים במסגד?","a":"ממתקים","opts":["ממתקים","כרטיסי ברכה","ספרי לימוד","תקליטים"],"kind":"Supplemental dialogue comprehension · PDF 15","explanation":"חנין אומרת שבמסגד נותנים לילדים הרבה ממתקים."}]},
  {"id":"shnayim-1-childhood-cloze","title":"סיפורי ילדות — היה + בינוני","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF page 19 (printed page 6) original verb fill-in • selected lines with blanks; choices adapted","he":"הסופרת האיטלקייה מריסה מדיירי (1938–1996) והסופר הצרפתי ז׳ול ואלס (1832–1885) כתבו סיפורים על החיים שלהם בתקופת הילדות. [...]\nכל יום אבא שלה היה _____ (לחפש) עבודה. אימא _____ _____ (לטפל) בילדים ו_____ (לשמור) על הבית. מדיירי והאחיות שלה תמיד _____ _____ (לבוא) לבית הספר רעבות ועצובות, אבל הן _____ _____ (לשחק) בין הרבה ילדים במצב דומה.","en":"A printed fill-in about childhood memoirs practices repeated past actions with היה and a present participle.","vocab":[["ילדות","childhood"],["לחפש","to look for"],["לשמור","to guard or keep"]],"questions":[{"q":"כל יום אבא שלה היה _____ עבודה.","a":"מחפש","opts":["מחפש","חיפש","יחפש","מחפשת"],"kind":"Printed verb fill-in · PDF 19 · adapted choices","explanation":"אחרי היה בא הפועל בהווה: היה מחפש."},{"q":"אימא _____ _____ בילדים. (לטפל)","a":"היתה מטפלת","opts":["היתה מטפלת","היה מטפל","טיפלה","תטפל"],"kind":"Printed verb fill-in · PDF 19 · adapted choices","explanation":"אימא היא נקבה יחידה, ולכן הצורה החוזרת בעבר היא היתה מטפלת."},{"q":"מדיירי והאחיות שלה תמיד _____ _____ לבית הספר. (לבוא)","a":"היו באות","opts":["היו באות","היתה באה","באו","יבואו"],"kind":"Printed verb fill-in · PDF 19 · adapted choices","explanation":"הנושא ברבות; היה + בינוני נעשה היו באות."}]},
  {"id":"shnayim-1-myth","title":"מהו מיתוס?","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF page 21 (printed page 9) original reading and questions • selected Hebrew; choices adapted","he":"מיתוס הוא מילה יוונית שהמשמעות שלה היא סיפור עם. המספרים ידעו איך לספר את הסיפורים האלה, ולכן אנשים הקשיבו להם. הסיפורים עברו במשך מאות שנים מאדם לאדם, מדור לדור, וכאשר המציאו את אותיות האלף בית, כתבו אותם וקראו אותם גם אנשים אחרים מחוץ לקהילה. [...] האנתרופולוגים חושבים שבכל מיתוס יש גרעין של אמת, וכל המיתוסים ביחד נותנים תמונה חברתית על הקהילה, על החיים ועל הערכים שלה.","en":"A myth is a folk story passed between people and generations; the passage says myths together give a social picture of a community, its life, and its values.","vocab":[["מיתוס","myth"],["סיפור עם","folk story"],["מדור לדור","from generation to generation"]],"questions":[{"q":"מה משמעות המילה מיתוס לפי הקטע?","a":"סיפור עם","opts":["סיפור עם","ברכת חג","שיעור דקדוק","מכתב"],"kind":"Supplemental comprehension · PDF 21","explanation":"המשפט הראשון מסביר שמיתוס פירושו סיפור עם."},{"q":"לפי הקטע, איך עברו הסיפורים במשך מאות שנים?","a":"מאדם לאדם ומדור לדור","opts":["מאדם לאדם ומדור לדור","רק ברדיו","רק במכתב","רק בבית הספר"],"kind":"Supplemental comprehension · PDF 21","explanation":"הקטע אומר במפורש: מאדם לאדם, מדור לדור."},{"q":"לפי האנתרופולוגים, מה נותנים המיתוסים ביחד?","a":"תמונה חברתית על הקהילה, החיים והערכים שלה","opts":["תמונה חברתית על הקהילה, החיים והערכים שלה","רק תאריכים","רק מחירים","רק תחבורה"],"kind":"Supplemental comprehension · PDF 21","explanation":"הפסקה האחרונה אומרת שהמיתוסים ביחד נותנים תמונה חברתית על הקהילה, על החיים ועל הערכים שלה."}]},
  {"id":"shnayim-1-thousand-nights","title":"סיפור אלף לילה ולילה — השלמה","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF page 23 (printed page 10) original story fill-in • selected Hebrew with blanks; choices adapted","he":"כתבו את המילים במקום המתאים בסיפור.\nמלך / להרוג / חתונה / פחדו / שקט / ראשון / כלה / לשמוע / ארמון / דרש / סיפור\n\nהמלך שהריאר, שלא אהב נשים, החליט להרוג את כל הנשים שלו. [...] כל הנשים בממלכה _____ מאוד מהמלך שלהן וברחו מהעיר.\n\nיום אחד החליטה שחרזדה, הבת של אחד השרים, להתחתן עם ה_____. ב_____ היא התחילה לספר למלך _____. במשך שעות רבות היא סיפרה עד שהגיע אור ראשון של בוקר. אז היא שתקה ולא המשיכה את הסיפור. [...] כך, במשך אלף לילות, היא היתה גומרת סיפור והיתה מתחילה סיפור חדש.","en":"The printed cloze tells how Scheherazade continued a story night after night, keeping the king interested.","vocab":[["מלך","king"],["כלה","bride"],["סיפור","story"]],"questions":[{"q":"כל הנשים בממלכה _____ מאוד מהמלך שלהן.","a":"פחדו","opts":["פחדו","דרשו","שמעו","ברחו"],"kind":"Printed story fill-in · PDF 23 · adapted choices","explanation":"הנשים פחדו מן המלך, ולכן ברחו מן העיר."},{"q":"שחרזדה החליטה להתחתן עם ה_____.","a":"מלך","opts":["מלך","ארמון","סיפור","שקט"],"kind":"Printed story fill-in · PDF 23 · adapted choices","explanation":"שחרזדה, בתו של שר, החליטה להתחתן עם המלך."},{"q":"היא התחילה לספר למלך _____.","a":"סיפור","opts":["סיפור","חתונה","ארמון","שקט"],"kind":"Printed story fill-in · PDF 23 · adapted choices","explanation":"הפועל לספר מקבל כאן את שם העצם סיפור."},{"q":"מה עשתה שחרזדה בכל לילה?","a":"גמרה סיפור והתחילה סיפור חדש","opts":["גמרה סיפור והתחילה סיפור חדש","שלחה כרטיס ברכה","עזבה את הארמון","הפסיקה לדבר לתמיד"],"kind":"Supplemental story comprehension · PDF 23","explanation":"סוף הקטע אומר שגמרה סיפור והתחילה סיפור חדש במשך אלף לילות."}]},
  {"id":"shnayim-1-animal-names","title":"כך התחיל הכול — שמות בעלי החיים","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF pages 33–35 (printed pages 21–22) selected original story; choices adapted","he":"אחרי שאלוהים ברא את כל בעלי החיים, הוא קרא לכל המלאכים ואמר להם בשמחה: ״סוף סוף סיימתי לברוא את העולם ואת בעלי החיים. עכשיו הזמן לברוא אדם.״ [...]\nמה עשה אלוהים? קודם כול הוא ברא את האדם, אחר כך קרא לכל בעלי החיים ולמלאכים: ״עכשיו אתם צריכים לתת שם מתאים לכל בעל חיים!״\n[...] אמר האדם לאלוהים: ״זה ממש קל לתת שמות לבעלי חיים. אני יכול להמשיך?״","en":"The story asks the angels, then the first human, to name the animals.","vocab":[["בעלי חיים","animals"],["מלאכים","angels"],["שם מתאים","suitable name"]],"questions":[{"q":"מי התבקשו תחילה לתת שם לכל בעל חיים?","a":"המלאכים","opts":["המלאכים","המלך","התלמידים","הימאים"],"kind":"Supplemental story comprehension · PDF 35","explanation":"אלוהים פנה קודם אל המלאכים וביקש שמות מתאימים."},{"q":"מי אמר: ״זה ממש קל לתת שמות לבעלי חיים״?","a":"האדם","opts":["האדם","המלאכים","המלך","המספרת"],"kind":"Supplemental story comprehension · PDF 35","explanation":"האדם אומר זאת אחרי שהוא נותן שמות לבעלי החיים."},{"q":"מה היה עליהם לתת לבעלי החיים?","a":"שם מתאים","opts":["שם מתאים","כרטיס ברכה","תקליט","ארוחה"],"kind":"Supplemental story comprehension · PDF 35","explanation":"ההוראה היא לתת שם מתאים לכל בעל חיים."}]},
  {"id":"shnayim-1-wedding-cloze","title":"טקסי חתונה בתרבויות שונות — בחירת מילים","source":"עברית בשניים לרמה ב׳ • chapter 1 • PDF page 37 (printed page 24) original word-choice passage • selected Hebrew with blanks; choices adapted","he":"בחרו במילה המתאימה.\nאנתרופולוגים רבים ש_____ (נוסעים / מפנים) מסביב לעולם וחוקרים תרבויות שונות, אוהבים לחקור טקסי חתונה. בכל מקום בעולם בני זוג מתחתנים והחברים _____ (משתמשים / חוגגים) את האירוע. [...] הכלה והחתן לובשים בגדים מיוחדים. היא לובשת שמלה והוא לובש חליפה. [...] לפעמים ההורים בוכים, אבל כולם אומרים _____ (כלות / ברכות), כמו ״מזל טוב״.","en":"A printed word-choice passage compares wedding customs in different cultures.","vocab":[["טקסי חתונה","wedding ceremonies"],["תרבויות","cultures"],["ברכות","greetings or blessings"]],"questions":[{"q":"אנתרופולוגים רבים ש_____ מסביב לעולם חוקרים תרבויות שונות.","a":"נוסעים","opts":["נוסעים","מפנים","חוגגים","מפסיקים"],"kind":"Printed word choice · PDF 37 · adapted choices","explanation":"נוסעים מסביב לעולם means travel around the world."},{"q":"החברים _____ את האירוע.","a":"חוגגים","opts":["חוגגים","משתמשים","מפסיקים","מבינים"],"kind":"Printed word choice · PDF 37 · adapted choices","explanation":"חוגגים את האירוע means celebrate the event."},{"q":"כולם אומרים _____, כמו ״מזל טוב״.","a":"ברכות","opts":["ברכות","כלות","שמלות","תפילות"],"kind":"Printed word choice · PDF 37 · adapted choices","explanation":"מזל טוב is a greeting or blessing, so ברכות fits."}]},
  {
    id:"lilmod-19-kol-nidrei",title:"כל נדרי בארץ רחוקה",
    source:"ללמוד עברית ברמה ב׳ • unit 19 • PDF page 214 (printed page 211) story; PDF page 216 (printed page 212) printed questions • selected original Hebrew with marked omissions; printed questions adapted to choices",
    he:"זה היה בחודש ספטמבר 1966. האונייה שלנו עגנה בנמל דייגים קטן בצפון נורווגיה. ירדתי מהאונייה כדי לבקר בעירייה. השעה הייתה חמש לפנות ערב. השמים היו מעוננים, וטפטף גשם דק. טיילתי ברחובות הריקים של העירייה, ולא פגשתי איש. כבר רציתי לשוב אל האונייה, כאשר שמעתי קול שירה: חזן ומקהלה שרו את 'כל נדרי'.\n\nנדהמתי. האם גם בעירייה הקטנה והרחוקה הזו חיים יהודים? ואם כן - מדוע הם הקדימו את יום הכיפורים? הרי רק בעוד שבוע יהיה ראש השנה?!\n\nקולות השירה נשמעו מהקומה העליונה של אחד הבתים. בצעדים מהירים עליתי במדרגות הבית. אישה זקנה פתחה לי את הדלת, ושאלה משהו בנורווגית. רציתי להסביר לה שאני יהודי, אבל איך עושים זאת? 'כל נדרי' אמרתי, אבל היא לא הבינה... לבסוף הזמינה אותי פנימה.\n\nהחדר היה ריק. איש לא היה בו: לא חזן ולא מקהלה. על השולחן עמד פטיפון, והשירה נשמעה מתוך תקליט. האישה ראתה שאני מתפלא מאוד. היא הזמינה אותי לשבת, ובמעט המילים שידעה באנגלית הסבירה: 'בשנת 1943 הגיעה אלינו אישה יהודייה שברחה מגרמניה הנאצית. כל בני משפחתה נהרגו בגרמניה ביום הקדוש ליהודים. כל שנה ביום זה היא היתה משמיעה את התקליט לזכר בני משפחתה. לפני עשר שנים מתה האישה, והשאירה לנו את התקליט. מאז אני משמיעה את התפילה בכל יום כיפורים.'\n\n[...]\n\n'אינני יודעת בדיוק', אמרה האישה, 'אבל אני יודעת שיום הכיפורים חל בסתיו. אלוהים יסלח לי אם אני טועה בתאריך. הוא יודע שאני מתכוונת ליום הקדוש.'",
    en:"In September 1966 a Jewish ship passenger hears Kol Nidrei in a Norwegian town before Rosh Hashanah. An elderly woman explains that she plays a record in memory of a Jewish refugee and her family. She knows Yom Kippur falls in autumn, though she does not know its exact date.",
    vocab:[["עגנה","docked"],["נדהמתי","I was astonished"],["תקליט","record"],["לזכר","in memory of"]],
    questions:[
      {q:"מי הוא המספר?",a:"איש יהודי שירד מן האונייה",opts:["איש יהודי שירד מן האונייה","האישה הנורווגית","החזן מן המקהלה","הדייג בנמל"],kind:"Printed question 1 · PDF 216 · adapted choices",explanation:"המספר ירד מן האונייה ואמר לאישה שהוא יהודי."},
      {q:"מה הדהים אותו?",a:"לשמוע כל נדרי בנורווגיה לפני ראש השנה",opts:["לשמוע כל נדרי בנורווגיה לפני ראש השנה","לראות את משפחתו בנמל","לשמוע שיר ילדים באונייה","לגלות שאין עירייה"],kind:"Printed question 2 · PDF 216 · adapted choices",explanation:"הוא שמע כל נדרי בעיר רחוקה אף שעוד שבוע עד ראש השנה."},
      {q:"מדוע הוא נמשך לקול השירה?",a:"חשב שחזן ומקהלה שרים כל נדרי",opts:["חשב שחזן ומקהלה שרים כל נדרי","רצה לקנות תקליט","חיפש את הקברניט","שמע קריאה לעזרה"],kind:"Printed question 3 · PDF 216 · adapted choices",explanation:"הקריאה אומרת ששמע קול שירה של חזן ומקהלה שעלתה מן הקומה העליונה."},
      {q:"מדוע הוא התפלא כשנכנס לחדר?",a:"לא היה שם חזן או מקהלה; השירה באה מתקליט",opts:["לא היה שם חזן או מקהלה; השירה באה מתקליט","החדר היה מלא אנשים","הפליטה חיכתה לו","הוא מצא את משפחתו"],kind:"Printed question 4 · PDF 216 · adapted choices",explanation:"בחדר לא היה חזן ולא מקהלה; היה פטיפון והשירה נשמעה מן התקליט."},
      {q:"לפי הסיפור, מדוע הזקנה הנורווגית משמיעה את התקליט ביום הכיפורים?",a:"לזכר האישה היהודייה ובני משפחתה",opts:["לזכר האישה היהודייה ובני משפחתה","כדי לאמן מקהלה","כדי למכור את התקליט","מפני שכבר הגיע ראש השנה"],kind:"Printed discussion question 5 · PDF 216 · evidence choice",explanation:"הפליטה נהגה להשמיע את התקליט לזכר בני משפחתה, והזקנה ממשיכה את המנהג."},
      {q:"מי הגיעה לנורווגיה בשנת 1943?",a:"אישה יהודייה שברחה מגרמניה הנאצית",opts:["אישה יהודייה שברחה מגרמניה הנאצית","חזן מאוסטרליה","הקברניט","קבוצת תיירים"],kind:"Supplemental comprehension · PDF 214",explanation:"האישה מספרת שבשנת 1943 הגיעה פליטה יהודייה מגרמניה הנאצית."},
      {q:"מה היה מקור השירה בחדר?",a:"תקליט שניגן בפטיפון",opts:["תקליט שניגן בפטיפון","רדיו מקומי","מקהלה בחדר","ילדים בחוץ"],kind:"Supplemental comprehension · PDF 214",explanation:"בחדר עמד פטיפון על השולחן והשירה נשמעה מתוך תקליט."},
      {q:"למה לא ידעה הזקנה את התאריך המדויק של יום הכיפורים?",a:"היא ידעה רק שהוא חל בסתיו",opts:["היא ידעה רק שהוא חל בסתיו","היא שכחה את חודש ינואר","היה כתוב תאריך על התקליט","המספר לא ידע את השנה"],kind:"Supplemental comprehension · PDF 214",explanation:"האישה אומרת שאינה יודעת בדיוק, אבל יודעת שיום הכיפורים חל בסתיו."}
    ]
  },
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
    source:"ללמוד עברית ברמה ב׳ • unit 1 • PDF page 11 (printed page 7) • original reading and printed questions 1–2; answer choices adapted",
    he:"סטודנט לרפואה לא למד במשך כל השנה. בסוף השנה, כאשר התקרבו המבחנים, נבהל הסטודנט הצעיר, כי פחד להיכשל.\nהוא פנה אל הפרופסור שלו ושאל: \"אדוני הפרופסור, האם מספיק ללמוד במשך חודש אחד כדי להצליח במבחנים?\"\nענה הפרופסור הזקן: \"אתה רוצה להיות רופא. הרבה פעמים מגיעים למרפאה אנשים שמנים מאוד. אתה יכול לתת להם דיאטה ארוכה וקלה או להציע להם לצום כמה ימים כדי לרזות. מה אתה בוחר להציע להם?\"",
    en:"A medical student did not study all year. Near the exams he feared failing and asked his professor whether one month of study was enough. The professor answered with a comparison: would a doctor offer a long, easy diet or a few days of fasting?",
    vocab:[["רפואה","medicine"],["בחינות","exams"],["להיכשל","to fail"],["לצום","to fast"]],
    questions:[
      {q:"בסיפור מדברים על סטודנט ל______.",a:"רפואה",opts:["רפואה","היסטוריה","אומנות","מוזיקה"],kind:"Printed completion · answer choices adapted",explanation:"הפתיחה אומרת: סטודנט לרפואה."},
      {q:"הסטודנט לא למד ______ כל השנה.",a:"במשך",opts:["במשך","אחרי","לפני","בלי"],kind:"Printed completion · answer choices adapted",explanation:"המשפט הראשון אומר: לא למד במשך כל השנה."},
      {q:"הוא שאל את ה______ שלו.",a:"פרופסור",opts:["פרופסור","נהג","מוכר","חבר"],kind:"Printed completion · answer choices adapted",explanation:"בקטע כתוב שהוא פנה אל הפרופסור שלו ושאל."},
      {q:"כדי ______ במבחנים.",a:"להצליח",opts:["להצליח","לנסוע","לשחות","לבשל"],kind:"Printed completion · answer choices adapted",explanation:"השאלה של הסטודנט מסתיימת במילים כדי להצליח במבחנים."},
      {q:"האם לדעתכם הפרופסור באמת ענה על שאלת הסטודנט?",a:"הוא ענה בעקיפין בעזרת השוואה בין דיאטה ארוכה לצום קצר",opts:["הוא ענה בעקיפין בעזרת השוואה בין דיאטה ארוכה לצום קצר","הוא אמר במפורש שחודש מספיק","הוא אמר שהמבחן בוטל","הוא סירב לדבר עם הסטודנט"],kind:"Printed question 2 · interpretive answer choices adapted",explanation:"הפרופסור לא אומר כן או לא; הוא משווה בין תהליך ארוך לצום קצר כדי שהסטודנט יסיק את התשובה."},
      {q:"מה הציע הפרופסור כאפשרויות לאנשים שרוצים לרזות?",a:"דיאטה ארוכה וקלה או צום של כמה ימים",opts:["דיאטה ארוכה וקלה או צום של כמה ימים","לימוד במשך חודש","נסיעה לירושלים","שינה במשך כל היום"],kind:"Supplemental comprehension from the visible passage",explanation:"הפרופסור משווה דיאטה ארוכה וקלה לצום של כמה ימים."}
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
    id:"lilmod-2-shabbat-cloze",title:"שבת בירושלים — השלמת סיפור בעבר",
    source:"ללמוד עברית ברמה ב׳ • unit 2 • PDF page 29 (printed page 25) • original past-tense story completion; six blanks use adapted answer choices",
    he:"השלימו את הסיפור בעבר: מטייל, מתלבש, מסדר, מספר, מסתכל, מבקר, מדבר, מתרחץ, ממהר, מברך, משחק, מבשל.\nסבא של דני גר בירושלים. הוא _____ לדני:\nכשאני הייתי ילד, יום שבת בירושלים היה אחר לגמרי. ביום שישי כולנו קמנו מוקדם, _____ את הבית לקראת שבת, ואמא _____ מאכלים מיוחדים לשבת. אחרי הצהריים אנחנו _____ ו_____ יפה. יצאנו מהבית ו_____ בשכונה. הלכנו לאט, אף אחד לא _____ לשום מקום ו_____ כל הדרך. _____ את כל האנשים שפגשנו ב׳שבת שלום׳. אחרי ארוחת הערב _____ במשחקים שונים, וכל אחד _____ מה הוא עשה במשך השבוע. בשבת בבוקר _____ בהרים ואחרי הצהריים _____ את החברים שלנו. דבר אחד לא עשינו אז: לא _____ בטלוויזיה.",
    en:"Danny's grandfather recalls Shabbat in Jerusalem when he was a child. Complete the printed story using past forms of the listed verbs. The passage remains visible while you answer.",
    vocab:[["סבא","grandfather"],["לקראת שבת","in preparation for Shabbat"],["מאכלים","foods"],["בשכונה","in the neighborhood"]],
    questions:[
      {q:"סבא של דני גר בירושלים. הוא _____ לדני: (מספר)",a:"סיפר",opts:["סיפר","מספר","סיפרו","סיפרנו"],kind:"Printed past-tense fill-in · choices adapted",explanation:"סבא הוא זכר יחיד והסיפור מתאר את העבר: סיפר."},
      {q:"ביום שישי כולנו קמנו מוקדם, _____ את הבית לקראת שבת. (מסדר)",a:"סידרנו",opts:["סידרנו","סידרו","סידרתי","מסדרים"],kind:"Printed past-tense fill-in · choices adapted",explanation:"כולנו פירושו אנחנו; הצורה בעבר היא סידרנו."},
      {q:"ואמא _____ מאכלים מיוחדים לשבת. (מבשל)",a:"בישלה",opts:["בישלה","בישלו","בישלנו","מבשלת"],kind:"Printed past-tense fill-in · choices adapted",explanation:"אמא היא נקבה יחידה; בעבר היא בישלה."},
      {q:"אחרי הצהריים אנחנו התרחצנו ו_____ יפה. (מתלבש)",a:"התלבשנו",opts:["התלבשנו","התלבשו","התלבשתי","מתלבשים"],kind:"Printed past-tense fill-in · choices adapted",explanation:"אחרי התרחצנו בא פועל נוסף לאנחנו: התלבשנו."},
      {q:"אחרי ארוחת הערב _____ במשחקים שונים. (משחק)",a:"שיחקנו",opts:["שיחקנו","שיחקו","שיחקתי","משחקים"],kind:"Printed past-tense fill-in · choices adapted",explanation:"הסבא מדבר על מה שהמשפחה עשתה יחד: שיחקנו."},
      {q:"בשבת בבוקר _____ בהרים. (מטייל)",a:"טיילנו",opts:["טיילנו","טיילו","טיילתי","מטיילים"],kind:"Printed past-tense fill-in · choices adapted",explanation:"המשפחה מתוארת בלשון אנחנו; בעבר של לטייל: טיילנו."}
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
  {id:"ulpan4-34-st-louis",title:"הטרגדיה של ״סנט לואיס״",
   source:"אולפן עברית — חלק רביעי • lesson 34 • PDF pages 32–33 (printed pages 380–381) • selected original Hebrew; printed questions and verb completions adapted to choices",
   he:"ב־13 במאי 1939 יצאה מנמל המבורג שבגרמניה הספינה ״סנט לואיס״, ועליה כ־930 יהודים שברחו מגרמניה הנאצית. הספינה הייתה בדרכה לקובה. ליהודים היו אשרות כניסה (ויזות) לקובה, אף על פי כן כאשר הגיעה הספינה לחופי קובה, לא אושרה כניסתם על־ידי השלטונות, ואשרות הכניסה שלהם בוטלו. ארצות הברית וקנדה סירבו (לא הסכימו) גם הן לתת ליהודים מקלט.",
   en:"In May 1939 the St. Louis sailed from Hamburg with about 930 Jewish refugees toward Cuba. Cuba canceled their entry permits, and the United States and Canada refused them refuge.",
   vocab:[["אשרות כניסה","entry permits"],["בוטלו","were canceled"],["מקלט","refuge"]],
   questions:[
    {q:"מאין יצאה הספינה ״סנט לואיס״?",a:"מנמל המבורג שבגרמניה",opts:["מנמל המבורג שבגרמניה","מקובה","מבריטניה","מצרפת"],kind:"Printed comprehension · PDF 32 · choices adapted",explanation:"בתחילת הקטע כתוב: יצאה מנמל המבורג שבגרמניה."},
    {q:"אילו מדינות סירבו לתת מקלט ליהודים?",a:"ארצות הברית וקנדה",opts:["ארצות הברית וקנדה","בריטניה וצרפת","בלגיה והולנד","גרמניה וקובה"],kind:"Printed comprehension · PDF 32 · choices adapted",explanation:"הקטע אומר שארצות הברית וקנדה סירבו לתת מקלט."},
    {q:"השלימו מן הקטע: אשרות הכניסה שלהם _____.",a:"בוטלו",opts:["בוטלו","ביטלו","יבוטלו","מבוטלות"],kind:"Printed verb completion · PDF 33 · choices adapted",explanation:"השלטונות ביטלו את האשרות; בצורת הסביל: האשרות בוטלו."}
   ]},
  {id:"ulpan4-34-seas",title:"ים המלח וים כנרת",
   source:"אולפן עברית — חלק רביעי • lesson 34 • PDF page 35 (printed page 383) • selected original Hebrew; printed comprehension adapted to choices",
   he:"שני ימים יש בישראל, אולם (אבל) הבדל גדול קיים (יש) ביניהם. הכנרת נמצאת בחלק הצפוני של נהר הירדן, לעומתה ים המלח נמצא בדרום הירדן. ים כנרת נמצא כ־200 מטר מתחת לפני הים, ואילו ים המלח נמצא כ־400 מטר מתחת לפני הים. שיעור (אחוז) המלח בים המלח הוא כ־33% לעומת כ־3.5% בים התיכון. ים המלח נקרא בעולם ״ים המוות״ משום שאין בו חיים.",
   en:"The Sea of Galilee and the Dead Sea differ in location, elevation, and salinity. The Dead Sea is about 33% salt, compared with about 3.5% in the Mediterranean.",
   vocab:[["לעומתה","by contrast with it"],["ואילו","whereas"],["שיעור המלח","salt concentration"]],
   questions:[
    {q:"מהו אחוז המלח בים התיכון?",a:"כ־3.5%",opts:["כ־3.5%","כ־33%","כ־20%","כ־50%"],kind:"Printed comprehension · PDF 35 · choices adapted",explanation:"בסוף הקטע נאמר כ־3.5% בים התיכון."},
    {q:"מדוע ים המלח נקרא ״ים המוות״?",a:"משום שאין בו חיים",opts:["משום שאין בו חיים","משום שיש בו הרבה דגים","משום שהוא בצפון","משום שהוא עמוק מן האוקיינוס"],kind:"Printed comprehension · PDF 35 · choices adapted",explanation:"המשך הקטע בעמוד 35 מסביר שאין בו חיים; התשובה נתמכת בפסקה המלאה בסריקה."}
   ]},
  {id:"ulpan4-35-housewarming",title:"חנוכת בית — שיחה",
   source:"אולפן עברית — חלק רביעי • lesson 35 • PDF page 41 (printed page 389) • selected original dialogue; printed questions adapted to choices",
   he:"רותי: יש לנו חדשות טובות! חתמנו אתמול על החוזה, קנינו את הדירה שרצינו...\nאורן: בשעה טובה! מתי הפינוי?\nרותי: הפינוי מידי. כבר קיבלנו את המפתח...\nאורן: הדירה גדולה?\nרותי: כן, היא גדולה ומרווחת, אבל ישנה וזקוקה לשיפוץ.\nרותי: אנחנו מקווים שניכנס לדירה בעוד חודשיים, משום שאנחנו רוצים לשפץ את הדירה ולהשקיע בשיפוץ.",
   en:"Ruthie and Oren discuss the apartment Ruthie bought. They have the key immediately, but the large apartment needs renovation.",
   vocab:[["חוזה","contract"],["פינוי מידי","immediate vacancy"],["זקוקה לשיפוץ","needs renovation"]],
   questions:[
    {q:"מה החדשות הטובות שיש לרותי לספר?",a:"הם קנו את הדירה שרצו",opts:["הם קנו את הדירה שרצו","הם מכרו את הבית","הם מצאו עבודה","הם נוסעים לחוץ לארץ"],kind:"Printed comprehension · PDF 41 · choices adapted",explanation:"רותי אומרת שחתמו על החוזה וקנו את הדירה שרצו."},
    {q:"מתי הם ייכנסו לדירה?",a:"בעוד חודשיים",opts:["בעוד חודשיים","בעוד שנה","אחרי החגים","בעוד שבועיים"],kind:"Printed comprehension · PDF 41 · choices adapted",explanation:"למרות הפינוי המידי, רותי מקווה להיכנס לדירה בעוד חודשיים אחרי השיפוץ."},
    {q:"מדוע הדירה זקוקה לשיפוץ?",a:"היא ישנה",opts:["היא ישנה","היא קטנה","אין בה מפתח","היא רחוקה"],kind:"Printed comprehension · PDF 41 · choices adapted",explanation:"רותי אומרת שהדירה גדולה ומרווחת, אבל ישנה וזקוקה לשיפוץ."}
   ]},
  {id:"ulpan4-35-invitation",title:"הזמנה לחנוכת בית",
   source:"אולפן עברית — חלק רביעי • lesson 35 • PDF page 42 (printed page 390) • selected original invitation; printed questions adapted to choices",
   he:"בשעה טובה ומוצלחת נכנסנו לביתנו החדש!\nאתם מוזמנים לחנוכת בית שתיערך ביום שלישי, 21.7.08, בשעה 19:30 בדירתנו – ברחוב הרצל 3 אשדוד.\nנשמח לארחכם בין אורחינו!\nרותי ודויד צור",
   en:"Ruthie and David Tzur invite guests to their new home in Ashdod on Tuesday at 19:30.",
   vocab:[["הזמנה","invitation"],["חנוכת בית","housewarming"],["תיערך","will be held"]],
   questions:[
    {q:"מי מזמין לחנוכת בית?",a:"רותי ודויד צור",opts:["רותי ודויד צור","אורן ורותי כהן","הילדים בבית הספר","המורה והתלמידים"],kind:"Printed comprehension · PDF 42 · choices adapted",explanation:"בסוף ההזמנה חתומים רותי ודויד צור."},
    {q:"איפה תיערך חנוכת הבית?",a:"ברחוב הרצל 3 באשדוד",opts:["ברחוב הרצל 3 באשדוד","ברחוב הרצל 3 בחיפה","בבית הספר","במסעדה"],kind:"Printed comprehension · PDF 42 · choices adapted",explanation:"הכתובת מופיעה בהזמנה: רחוב הרצל 3 באשדוד."},
    {q:"מתי תיערך חנוכת הבית?",a:"ביום שלישי בשעה 19:30",opts:["ביום שלישי בשעה 19:30","ביום ראשון בבוקר","ביום שישי בשעה 19:30","ביום שלישי בשעה 9:30"],kind:"Printed comprehension · PDF 42 · choices adapted",explanation:"בהזמנה מצוינים יום שלישי והשעה 19:30."}
   ]},

  {id:"ulpan4-36-jonathan",title:"מבצע יונתן — קטע קריאה",
   source:"אולפן עברית — חלק רביעי • lesson 36 • PDF page 49 (printed page 397) • selected original reading; printed comprehension questions adapted to choices",
   he:"ב־27 ביוני 1976 נחטף מטוס של החברה הצרפתית ״אייר פראנס״, שהיה בדרכו מישראל לצרפת. במטוס היו 246 נוסעים. ארבעה מחבלים (טרוריסטים), שעלו למטוס בתחנת ביניים באתונה, חטפו את המטוס לאלג׳יר, ומאלג׳יר לאנטבה שבאוגנדה. באוגנדה הצטרפו לחוטפים עוד ארבעה מחבלים, והם דרשו שישראל תשחרר מחבלים פלסטינאים.\nכתוצאה מהמשא ומתן שהיה בין ישראל לבין אוגנדה, שחררו המחבלים חלק מהנוסעים. 98 נוסעים, שהיו ישראלים או יהודים, לא שוחררו, והם הוחזקו בידי המחבלים בנמל התעופה הישן של אנטבה.",
   en:"The passage describes the 1976 hijacking, the passengers taken to Entebbe, and the passengers who remained captive there.",
   vocab:[["נחטף","was hijacked"],["שוחררו","were released"],["הוחזקו","were held"]],
   questions:[
    {q:"איזה מטוס נחטף?",a:"מטוס של חברת אייר פראנס",opts:["מטוס של חברת אייר פראנס","מטוס של חברת אל על","מטוס של חיל האוויר","מטוס של חברת לופטהנזה"],kind:"Printed comprehension · PDF 49 · choices adapted",explanation:"במשפט הראשון נאמר שמטוס של החברה הצרפתית ״אייר פראנס״ נחטף."},
    {q:"מה דרשו המחבלים?",a:"שישראל תשחרר מחבלים פלסטינאים",opts:["שישראל תשחרר מחבלים פלסטינאים","שישראל תבנה שדה תעופה","שהנוסעים יגיעו לצרפת","שאוגנדה תסגור את הנמל"],kind:"Printed comprehension · PDF 49 · choices adapted",explanation:"בסוף הפסקה הראשונה נאמר שזו הייתה דרישת המחבלים."},
    {q:"מדוע שוחררו חלק מהנוסעים?",a:"כתוצאה מהמשא ומתן בין ישראל לאוגנדה",opts:["כתוצאה מהמשא ומתן בין ישראל לאוגנדה","כי המטוס הגיע לצרפת","כי כולם ברחו מהנמל","כי נבנה נמל חדש"],kind:"Printed comprehension · PDF 49 · choices adapted",explanation:"הפסקה השנייה מתחילה: כתוצאה מהמשא ומתן שהיה בין ישראל לבין אוגנדה."}
   ]},
  {id:"ulpan4-36-jerusalem",title:"ירושלים — בירת ישראל — קטע קריאה",
   source:"אולפן עברית — חלק רביעי • lesson 36 • PDF page 53 (printed page 401) • selected original reading; printed passive transformations on PDF 54 adapted to choices",
   he:"ירושלים נמצאת בהרי יהודה, בגובה של 800 מטר מעל פני הים.\nהעיר ירושלים נכבשה על־ידי דוד המלך בשנת 1000 לפני הספירה ונקבעה על־ידיו לבירת ישראל. בית המקדש הראשון נבנה על־ידי שלמה המלך, בנו של דוד המלך.\nבשנת 586 לפני הספירה הרס נבוכדנאצר, מלך בבל, את העיר ואת בית המקדש, ועם ישראל גורש מארצו לבבל.",
   en:"The excerpt locates Jerusalem and recounts the city under David, the first Temple under Solomon, and the Babylonian conquest.",
   vocab:[["נכבשה","was conquered"],["נקבעה","was established"],["נבנה","was built"]],
   questions:[
    {q:"הפכו לפעיל: ירושלים נכבשה על־ידי דוד המלך. דוד המלך _____ את ירושלים.",a:"כבש",opts:["כבש","נכבש","כובש","יכבוש"],kind:"Printed transformation · PDF 54 · choices adapted",explanation:"במשפט הסביל ירושלים היא הנושא; במשפט הפעיל דוד המלך עשה את הפעולה: כבש."},
    {q:"הפכו לפעיל: בית המקדש הראשון נבנה על־ידי שלמה המלך. שלמה המלך _____ את בית המקדש הראשון.",a:"בנה",opts:["בנה","נבנה","בונה","ייבנה"],kind:"Printed transformation · PDF 54 · choices adapted",explanation:"הצורה הפעילה בעבר של נבנה היא בנה; שלמה המלך הוא עושה הפעולה."}
   ]},

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
