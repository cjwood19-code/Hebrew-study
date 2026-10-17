(function(){
"use strict";
const chapters=[
["ulpan",1,"האלפבית העברי",1,14],["ulpan",2,"אני • אתה • את • הוא • היא",15,30],["ulpan",3,"שם עצם",31,38],["ulpan",4,"ה״א הידיעה",39,49],["ulpan",5,"לאן? ל־ / ל...",50,62],["ulpan",6,"שם הפועל",63,72],["ulpan",7,"הפתק",73,80],["ulpan",8,"ל־... יש / אין",81,89],["ulpan",9,"מה השעה?",90,101],["ulpan",10,"לכן",102,112],
["lilmod",1,"לאט אבל בטוח",11,23],["lilmod",2,"כל כך הרבה אבנים",24,34],["lilmod",3,"בכל מקום אפשר ללמוד עברית",35,47],["lilmod",4,"מרי מאמין לכל דבר",48,60],["lilmod",5,"התרופה הטובה של אימא",61,72],["lilmod",6,"שרלוק הולמס",73,85],["lilmod",7,"סוס וחמור – כלי התחבורה",86,98],["lilmod",8,"השודדת הבלונדינית",99,108],["lilmod",9,"בית ספר על גלגלים",109,118],["lilmod",10,"כך נגלה הכותל המערבי",119,131],["lilmod",11,"טיול מסוכן",132,142],["lilmod",12,"הצבעים",143,154],["lilmod",13,"אישה משוחררת",155,164],["lilmod",14,"חלוקת השלל",165,177],["lilmod",15,"סיפור המציאות",178,185],["lilmod",16,"השודדים והברווזים הקטנים",186,195],["lilmod",17,"העבודה והבטלה",196,204],["lilmod",18,"התינוק הגדול ביותר בעולם",205,213],["lilmod",19,"כל נדרי בארץ רחוקה",214,227],
["shnayim",1,"ברכות",13,37],["shnayim",2,"יוצאים לדרך",38,65],["shnayim",3,"נופים",66,101],["shnayim",4,"בית",102,125],["shnayim",5,"חינוך",126,151],["shnayim",6,"אדם לאדם",152,180],["shnayim",7,"אומנות",181,211],["shnayim",8,"נשים",212,239],["shnayim",9,"אדם וטבע",240,274],["shnayim",10,"שפה",275,308]
].map((x,i)=>({level:i+1,book:x[0],unit:x[1],title:x[2],firstPage:x[3],lastPage:x[4],ready:i===0}));
const names={ulpan:"אולפן עברית",lilmod:"ללמוד עברית ברמה ב׳",shnayim:"עברית בשניים לרמה ב׳"};
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
let questions=[],idx=0,score=0,chosen=false;
function selected(){return chapters[Math.min(chapters.length-1,Math.max(0,Number($("chapterSelect").value)-1))]}
function renderMenu(){
 const ch=selected();
 $("chapterTitle").textContent="Level "+ch.level+" • "+names[ch.book]+" • "+(ch.book==="ulpan"?"שיעור ":ch.book==="lilmod"?"יחידה ":"פרק ")+ch.unit;
 $("chapterTopic").textContent=ch.title;
 $("chapterPages").textContent="PDF pages "+ch.firstPage+"–"+ch.lastPage;
 $("chapterBest").textContent=state.best[ch.level]===undefined?"Not attempted":state.best[ch.level]+"% best";
 $("chapterAvailability").textContent=ch.ready?"Chapter-matched practice is ready. Start with the alphabet and letter forms from the book.":"This chapter is indexed in the correct order, but its exercises have not yet been verified against the book. Earlier-level or unrelated exercises will not be substituted.";
 $("chapterStart").disabled=!ch.ready;
 $("chapterStart").textContent=ch.ready?"Practice this chapter":"Chapter content not mapped yet";
 $("chapterIndex").textContent="Chapter "+ch.level+" of "+chapters.length+" • "+(ch.ready?"ready":"awaiting exercise mapping");
}
function initMenu(){
 const sel=$("chapterSelect");sel.innerHTML="";
 for(const book of ["ulpan","lilmod","shnayim"]){
  let group=document.createElement("optgroup");group.label=names[book];
  chapters.filter(c=>c.book===book).forEach(ch=>{
   let option=document.createElement("option");option.value=String(ch.level);
   option.textContent="Level "+ch.level+" — "+(ch.book==="ulpan"?"שיעור ":ch.book==="lilmod"?"יחידה ":"פרק ")+ch.unit+" • "+ch.title+(ch.ready?"":" (index only)");
   group.appendChild(option)
  });sel.appendChild(group)
 }
 sel.value=String(state.level);sel.onchange=renderMenu;renderMenu()
}
function begin(){
 if(!selected().ready)return;
 // Every question uses the printed Hebrew alphabet and letter-name variants
 // on PDF pages 1–2 of the uploaded אולפן עברית scan.
 questions=shuffle(letters).map((x,i)=>({letter:x[0],name:x[1],reverse:i%2===1}));
 idx=0;score=0;
 $("chapterMenu").classList.add("hidden");
 $("chapterQuiz").classList.remove("hidden");
 next()
}
function next(){
 if(idx>=questions.length){finish();return}
 chosen=false;const q=questions[idx],answer=q.reverse?q.letter:q.name;
 $("chapterQuestion").textContent="Question "+(idx+1)+" of "+questions.length;
 $("chapterScore").textContent=score+" / "+idx;
 $("chapterDirection").textContent=q.reverse?"Choose the Hebrew letter":"Identify the Hebrew letter";
 $("chapterPrompt").textContent=q.reverse?q.name:q.letter;
 $("chapterPrompt").dir=q.reverse?"ltr":"rtl";
 $("chapterOptions").innerHTML="";
 $("chapterFeedback").textContent="";$("chapterFeedback").className="feedback hidden";
 $("chapterNext").classList.add("hidden");
 const pool=shuffle(letters.filter(x=>x[0]!==q.letter)).slice(0,3).map(x=>q.reverse?x[0]:x[1]);
 shuffle([answer,...pool]).forEach(opt=>{
  let btn=document.createElement("button");btn.type="button";btn.className="choice";btn.textContent=opt;btn.dir=q.reverse?"rtl":"ltr";
  btn.onclick=()=>choose(btn,opt,answer,q);$("chapterOptions").appendChild(btn)
 })
}
function choose(btn,opt,answer,q){
 if(chosen)return;chosen=true;let ok=opt===answer;if(ok)score++;
 Array.from($("chapterOptions").children).forEach(b=>{b.disabled=true;if(b.textContent===answer)b.classList.add("correct")});
 if(!ok)btn.classList.add("wrong");
 $("chapterFeedback").textContent=(ok?"Correct. ":"Correct answer: "+answer+". ")+q.letter+" — "+q.name;
 $("chapterFeedback").className="feedback "+(ok?"good":"bad");
 $("chapterNext").classList.remove("hidden")
}
function finish(){
 $("chapterQuiz").classList.add("hidden");$("chapterMenu").classList.remove("hidden");
 const pct=Math.round(score/questions.length*100),level=selected().level;
 state.best[level]=Math.max(state.best[level]||0,pct);
 state.history.push({level,correct:score,attempted:questions.length,date:new Date().toISOString()});
 if(pct>=85&&state.level===level)state.level=Math.min(39,level+1);
 save();$("chapterOutcome").textContent="Chapter "+level+": "+score+"/"+questions.length+" ("+pct+"%). "+(pct>=85?"Checkpoint passed.":"85% required to pass.")+(state.level>level?" The next chapter will open when its content is mapped.":"");
 $("chapterOutcome").className="feedback "+(pct>=85?"good":"bad");
 $("chapterSelect").value=String(level);renderMenu()
}
$("chapterStart").onclick=begin;
$("chapterNext").onclick=()=>{idx++;next()};
$("chapterExit").onclick=()=>{$("chapterQuiz").classList.add("hidden");$("chapterMenu").classList.remove("hidden");renderMenu()};
$("chapterLegacy").onclick=()=>{let quiz=$("quizCard");if(!quiz)return;let wasHidden=quiz.classList.contains("hidden");["quizCard","statusCard","resetBtn"].forEach(id=>{let e=$(id);if(e){if(wasHidden)e.classList.remove("hidden");else e.classList.add("hidden")}});$("chapterLegacy").textContent=wasHidden?"Hide previous adaptive practice":"Open previous adaptive practice"};
initMenu();
})();