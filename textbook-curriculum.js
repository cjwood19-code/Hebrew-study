(function(){
"use strict";
const chapters=[
["ulpan",1,"האלפבית העברי",1,14],["ulpan",2,"אני • אתה • את • הוא • היא",15,30],["ulpan",3,"שם עצם",31,38],["ulpan",4,"ה״א הידיעה",39,49],["ulpan",5,"לאן? ל־ / ל...",50,62],["ulpan",6,"שם הפועל",63,72],["ulpan",7,"הפתק",73,80],["ulpan",8,"ל־... יש / אין",81,89],["ulpan",9,"מה השעה?",90,101],["ulpan",10,"לכן",102,112],
["ulpan4",30,"חיפוש עבודה",1,7],["ulpan4",31,"זמן עתיד",8,18],["ulpan4",32,"הציווי",19,22],["ulpan4",33,"הסביל • בניין נפעל",23,31],["ulpan4",34,"הסביל • בניין פועל",32,39],["ulpan4",35,"הסביל • בניין הופעל",40,43],["ulpan4",36,"המשפט הסביל",44,55],
["lilmod",1,"לאט אבל בטוח",11,23],["lilmod",2,"כל כך הרבה אבנים",24,34],["lilmod",3,"בכל מקום אפשר ללמוד עברית",35,47],["lilmod",4,"פתי מאמין לכל דבר",48,60],["lilmod",5,"התרופה הטובה של אימא",61,72],["lilmod",6,"שרלוק הולמס",73,85],["lilmod",7,"סוס וחמור – כלי התחבורה",86,98],["lilmod",8,"השודדת הבלונדינית",99,108],["lilmod",9,"בית ספר על גלגלים",109,118],["lilmod",10,"כך נגלה הכותל המערבי",119,131],["lilmod",11,"טיול מסוכן",132,142],["lilmod",12,"הצבעים",143,154],["lilmod",13,"אישה משוחררת",155,164],["lilmod",14,"חלוקת השלל",165,178],["lilmod",15,"סיפור מהמציאות",179,186],["lilmod",16,"השודדים והברווזים הקטנים",187,196],["lilmod",17,"העבודה והבטלה",197,205],["lilmod",18,"התינוק הגדול ביותר בעולם",206,213],["lilmod",19,"כל נדרי בארץ רחוקה",214,217],
["shnayim",1,"ברכות",13,37],["shnayim",2,"יוצאים לדרך",38,65],["shnayim",3,"נופים",66,101],["shnayim",4,"בית",102,125],["shnayim",5,"חינוך",126,151],["shnayim",6,"אדם לאדם",152,180],["shnayim",7,"אומנות",181,211],["shnayim",8,"נשים",212,239],["shnayim",9,"אדם וטבע",240,274],["shnayim",10,"שפה",275,308]
].map((x,i)=>({level:i+1,book:x[0],unit:x[1],title:x[2],firstPage:x[3],lastPage:x[4],ready:i<=40}));
const names={ulpan:"אולפן עברית",ulpan4:"אולפן עברית — חלק רביעי",lilmod:"ללמוד עברית ברמה ב׳",shnayim:"עברית בשניים לרמה ב׳"};
window.HEBREW_TEXTBOOK_CHAPTERS=chapters;
const $=id=>document.getElementById(id);
const host=$("textbookCurriculumCard");if(!host)return;
const key="hebrewTextbookProgressV1";
let state={level:1,best:{},history:[]};
try{let old=JSON.parse(localStorage.getItem(key)||"null");if(old&&typeof old==="object")state=Object.assign(state,old)}catch(e){}
const letters=[
 ["א","alef"],["בּ","bet"],["ב","vet"],["ג","gimel"],["ד","dalet"],["ה","he"],["ו","vav"],["ז","zayin"],["ח","chet / het"],["ט","tet"],["י","yod / yud"],["כּ","kaf"],["כ","chaf"],["ך","chaf sofit"],["ל","lamed"],["מ","mem"],["ם","mem sofit"],["נ","nun"],["ן","nun sofit"],["ס","samech"],["ע","ayin"],["פּ","pe"],["פ","fe"],["ף","fe sofit"],["צ","tsadi"],["ץ","tsadi sofit"],["ק","qof / kuf"],["ר","resh"],["שׁ","shin"],["שׂ","sin"],["ת","tav"]
];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}};
let questions=[],idx=0,score=0,chosen=false,interpretationCorrect=0,interpretationAttempted=0;
function selected(){return chapters[Math.min(chapters.length-1,Math.max(0,Number($("chapterSelect").value)-1))]}
function renderProgress(){
 const history=Array.isArray(state.history)?state.history:[];
 const correct=history.reduce((n,h)=>n+(Number(h.correct)||0),0);
 const attempted=history.reduce((n,h)=>n+(Number(h.attempted)||0),0);
 const passed=Object.entries(state.best||{}).filter(([level,pct])=>{
  const attempts=history.filter(h=>Number(h.level)===Number(level));
  if(attempts.some(h=>h.passed===true))return true;
  if(attempts.some(h=>typeof h.passed==="boolean"))return false;
  return Number(pct)>=85; // Preserve legacy scores recorded before explicit pass outcomes.
 }).length;
 $("textbookCurrent").textContent=state.level+" / "+chapters.length;
 $("textbookPassed").textContent=passed+" / "+chapters.length;
 $("textbookSessions").textContent=String(history.length);
 $("textbookAccuracy").textContent=attempted?Math.round(100*correct/attempted)+"%":"—";
 $("textbookProgressBar").style.width=(100*passed/chapters.length)+"%";
 const last=history[history.length-1];
 $("textbookLatest").textContent=last?"Latest: chapter "+last.level+" — "+last.correct+"/"+last.attempted+" correct ("+Math.round(100*last.correct/last.attempted)+"%).":"No completed chapter sessions yet.";
}
function renderSession(){
 const answered=idx+(chosen?1:0);
 $("chapterScore").textContent=score+" / "+answered;
 $("chapterSessionAccuracy").textContent="Session accuracy: "+(answered?Math.round(score*100/answered)+"%":"—");
 $("chapterSessionBar").style.width=(questions.length?100*answered/questions.length:0)+"%";
}
function renderMenu(){
 renderProgress();
 const ch=selected();
 $("chapterTitle").textContent="Level "+ch.level+" • "+names[ch.book]+" • "+((ch.book==="ulpan"||ch.book==="ulpan4")?"שיעור ":ch.book==="lilmod"?"יחידה ":"פרק ")+ch.unit;
 $("chapterTopic").textContent=ch.title;
 $("chapterPages").textContent="PDF pages "+ch.firstPage+"–"+ch.lastPage;
 $("chapterBest").textContent=state.best[ch.level]===undefined?"Not attempted":state.best[ch.level]+"% best";
 const bank=(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{})[ch.level];
 const available=ch.ready&&(ch.level===1||(Array.isArray(bank)&&bank.length>0));
 $("chapterAvailability").textContent=available?(ch.level===1?"Chapter-matched alphabet practice is ready.":"Source-matched vocabulary, grammar and comprehension: "+bank.length+" questions plus 3 Hebrew-to-English interpretation checks. At least 2 of 3 interpretation answers and 85% overall are required to pass. PDF pages "+ch.firstPage+"–"+ch.lastPage+"."):"This chapter is indexed in the correct order, but its exercises have not yet been verified against the book. Earlier-level or unrelated exercises will not be substituted.";
 $("chapterStart").disabled=!available;
 $("chapterStart").textContent=available?"Practice this chapter":"Chapter content not mapped yet";
 $("chapterIndex").textContent="Chapter "+ch.level+" of "+chapters.length+" • "+(available?"ready":"awaiting exercise mapping");
}
function initMenu(){
 const sel=$("chapterSelect");sel.innerHTML="";
 for(const book of ["ulpan","ulpan4","lilmod","shnayim"]){
  let group=document.createElement("optgroup");group.label=names[book];
  chapters.filter(c=>c.book===book).forEach(ch=>{
   let option=document.createElement("option");option.value=String(ch.level);
   option.textContent="Level "+ch.level+" — "+((ch.book==="ulpan"||ch.book==="ulpan4")?"שיעור ":ch.book==="lilmod"?"יחידה ":"פרק ")+ch.unit+" • "+ch.title+(ch.ready?"":" (index only)");
   group.appendChild(option)
  });sel.appendChild(group)
 }
 sel.value="1";sel.onchange=renderMenu;renderMenu()
}
let chapterAdvanceTimer=null;
function cancelChapterAdvance(){if(chapterAdvanceTimer!==null){clearTimeout(chapterAdvanceTimer);chapterAdvanceTimer=null}}
function advanceChapter(){cancelChapterAdvance();idx++;next()}
function begin(){
 cancelChapterAdvance();
 const ch=selected();if(!ch.ready)return;
 if(ch.level===1){questions=letters.map((x,i)=>({letter:x[0],name:x[1],reverse:i%2===1}));}
 else{const bank=(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{})[ch.level];if(!Array.isArray(bank)||!bank.length)return;const checks=(window.HEBREW_CHAPTER_INTERPRETATION||{})[ch.level];if(!Array.isArray(checks)||checks.length!==3)return;questions=[...bank,...checks];}
 idx=0;score=0;interpretationCorrect=0;interpretationAttempted=0;
 $("chapterMenu").classList.add("hidden");
 $("chapterQuiz").classList.remove("hidden");
 next()
}
function next(){
 cancelChapterAdvance();
 if(idx>=questions.length){finish();return}
 chosen=false;const q=questions[idx],isBank=Array.isArray(q.options),answer=isBank?q.answer:(q.reverse?q.letter:q.name);
 $("chapterQuestion").textContent="Question "+(idx+1)+" of "+questions.length;
 renderSession();
 $("chapterDirection").textContent=isBank?q.category+(q.sourcePage?" • Source PDF page "+q.sourcePage:""):(q.reverse?"Choose the Hebrew letter":"Identify the Hebrew letter");
 $("chapterPrompt").textContent=isBank?q.prompt:(q.reverse?q.name:q.letter);
 $("chapterPrompt").dir=isBank?(/[\u0590-\u05FF]/.test(q.prompt)?"rtl":"ltr"):(q.reverse?"ltr":"rtl");
 $("chapterOptions").innerHTML="";
 $("chapterFeedback").textContent="";$("chapterFeedback").className="feedback hidden";
 $("chapterNext").classList.add("hidden");
 const pool=isBank?q.options.filter(x=>x!==answer):shuffle(letters.filter(x=>x[0]!==q.letter)).slice(0,3).map(x=>q.reverse?x[0]:x[1]);
 shuffle([answer,...pool]).forEach(opt=>{
  let btn=document.createElement("button");btn.type="button";btn.className="choice";btn.textContent=opt;btn.dir=isBank?(/[\u0590-\u05FF]/.test(opt)?"rtl":"ltr"):(q.reverse?"rtl":"ltr");
  btn.onclick=()=>choose(btn,opt,answer,q);$("chapterOptions").appendChild(btn)
 })
}
function choose(btn,opt,answer,q){
 if(chosen)return;chosen=true;const isBank=Array.isArray(q.options);let ok=opt===answer;if(ok)score++;if(q.interpretation){interpretationAttempted++;if(ok)interpretationCorrect++}renderSession();
 Array.from($("chapterOptions").children).forEach(b=>{b.disabled=true;if(b.textContent===answer)b.classList.add("correct")});
 if(!ok)btn.classList.add("wrong");
 $("chapterFeedback").textContent=(ok?"Correct. ":"Correct answer: "+answer+". ")+(isBank?q.category+(q.sourcePage?" • PDF page "+q.sourcePage:""):q.letter+" — "+q.name);
 $("chapterFeedback").className="feedback "+(ok?"good":"bad");
 if(ok){
  // Correct answers advance automatically. The existing chapter question order and scoring stay unchanged.
  chapterAdvanceTimer=setTimeout(()=>{chapterAdvanceTimer=null;advanceChapter()},650)
 }else{
  // Leave the correct answer visible until the learner chooses Next.
  $("chapterNext").classList.remove("hidden")
 }
}
function finish(){
 cancelChapterAdvance();
 $("chapterQuiz").classList.add("hidden");$("chapterMenu").classList.remove("hidden");
 const pct=Math.round(score/questions.length*100),level=selected().level,understood=interpretationAttempted===0||interpretationCorrect>=2,passed=pct>=85&&understood;
 state.best[level]=Math.max(state.best[level]||0,pct);
 state.history.push({level,correct:score,attempted:questions.length,interpretationCorrect,interpretationAttempted,passed,date:new Date().toISOString()});
 if(passed&&level===state.level)state.level=Math.min(chapters.length,level+1);
 save();renderProgress();$("chapterOutcome").textContent="Chapter "+level+": "+score+"/"+questions.length+" ("+pct+"%). "+(passed?"Checkpoint passed.":!understood?"Interpretation checkpoint not passed (2 of 3 required).":"85% overall required to pass.")+(interpretationAttempted?" Interpretation: "+interpretationCorrect+"/"+interpretationAttempted+".":"")+(state.level>level?" The next chapter will open when its content is mapped.":"");
 $("chapterOutcome").className="feedback "+(passed?"good":"bad");
 $("chapterSelect").value=String(passed&&level<chapters.length?level+1:level);renderMenu()
}
function selectAndBegin(level){
 $("chapterSelect").value=String(level);
 renderMenu();
 if(!$("chapterStart").disabled)begin();
}
const fromStart=$("chapterFromStart");
if(fromStart)fromStart.onclick=()=>selectAndBegin(1);
const continueBtn=$("chapterContinue");
if(continueBtn)continueBtn.onclick=()=>selectAndBegin(Math.min(state.level,chapters.length));
$("chapterStart").onclick=begin;
$("chapterNext").onclick=advanceChapter;
$("chapterRestart").onclick=()=>{if(!confirm("Restart this chapter session? Your previously saved chapter scores will remain."))return;begin()};
$("chapterExit").onclick=()=>{cancelChapterAdvance();$("chapterQuiz").classList.add("hidden");$("chapterMenu").classList.remove("hidden");renderMenu()};
$("chapterLegacy").onclick=()=>{let quiz=$("quizCard");if(!quiz)return;let wasHidden=quiz.classList.contains("hidden");["quizCard","statusCard","resetBtn"].forEach(id=>{let e=$(id);if(e){if(wasHidden)e.classList.remove("hidden");else e.classList.add("hidden")}});$("chapterLegacy").textContent=wasHidden?"Hide previous adaptive practice":"Open previous adaptive practice"};
initMenu();
})();

