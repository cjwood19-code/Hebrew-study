(function(){
"use strict";
const mount=document.getElementById("verbPatternCard");
if(!mount)return;
const $=id=>document.getElementById(id);
const STORAGE="hebrewVerbPatternsV1";
let progress={attempted:0,correct:0,missed:{}};
try{let p=JSON.parse(localStorage.getItem(STORAGE)||"null");if(p&&typeof p==="object")progress=Object.assign(progress,p)}catch(e){}
const save=()=>{try{localStorage.setItem(STORAGE,JSON.stringify(progress))}catch(e){}};
const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
const binyanim=[
 {he:"פָּעַל / קַל",en:"Pa'al / Qal",pattern:"פָּעַל",note:"Simple active pattern; vowels are important."},
 {he:"נִפְעַל",en:"Nif'al",pattern:"נִפְעַל",note:"Typically shows נִ־ in the past; not every נ־ verb is Nif'al."},
 {he:"פִּעֵל",en:"Pi'el",pattern:"פִּעֵל",note:"The past pattern uses i–e vowels; often active."},
 {he:"פֻּעַל",en:"Pu'al",pattern:"פֻּעַל",note:"The past pattern uses u–a vowels; typically passive of Pi'el."},
 {he:"הִפְעִיל",en:"Hif'il",pattern:"הִפְעִיל",note:"Often has הִ־ in past and an i vowel in the stem."},
 {he:"הֻפְעַל",en:"Huf'al",pattern:"הֻפְעַל",note:"Typically passive of Hif'il, with הֻ־ in the past."},
 {he:"הִתְפַּעֵל",en:"Hitpa'el",pattern:"הִתְפַּעֵל",note:"Recognize the הִתְ־ sequence; meanings vary by verb."}
];
const past=[
 ["___תִּי","אני — I (singular)","The ־תִּי ending marks first-person singular past."],
 ["___נוּ","אנחנו — we","The ־נוּ ending marks first-person plural past."],
 ["___תָּ","אתה — you (masculine singular)","Niqqud distinguishes ־תָּ from ־תְּ; both look like ת without vowels."],
 ["___תְּ","את — you (feminine singular)","Niqqud distinguishes ־תְּ from ־תָּ; both look like ת without vowels."],
 ["___תֶּם","אתם — you (masculine plural)","The ־תם ending marks masculine plural second-person past."],
 ["___תֶּן","אתן — you (feminine plural)","The ־תן ending marks feminine plural second-person past."],
 ["___","הוא — he","Past third-person masculine singular typically uses the unmodified base form; the template alone does not identify the binyan."],
 ["___ה","היא — she","The ־ה ending is common for third-person feminine singular past (some weak roots differ)."],
 ["___וּ","הם / הן — they","The ־וּ ending marks third-person plural past."]
];
const future=[
 ["א___","אני — I (singular)","א־ marks first-person singular future."],
 ["נ___","אנחנו — we","נ־ marks first-person plural future."],
 ["י___","הוא — he","י־ without a plural ending can mark third-person masculine singular future."],
 ["ת___","אתה / היא — you (masculine singular) OR she","ת־ without a suffix is shared by 2ms and 3fs; context is needed."],
 ["ת___י","את — you (feminine singular)","ת־ ... ־י marks second-person feminine singular future."],
 ["ת___וּ","אתם — you (masculine plural)","ת־ ... ־ו marks second-person masculine plural future."],
 ["י___וּ","הם — they (masculine plural)","י־ ... ־ו marks third-person masculine plural future."],
 ["ת___נָה","אתן / הן — you (feminine plural) OR they (feminine plural)","The ־נה feminine plural future is mainly formal/literary in modern Hebrew."]
];
const roots=[
 ["כָּתַב","כ־ת־ב","Past Pa'al; identify the three root consonants."],
 ["נִכְתַּב","כ־ת־ב","The initial נ belongs to the Nif'al pattern."],
 ["הִכְתִּיב","כ־ת־ב","The initial ה belongs to the Hif'il pattern; the root is כ־ת־ב."],
 ["הִתְכַּתֵּב","כ־ת־ב","The הת sequence belongs to the Hitpa'el pattern."],
 ["לָמַד","ל־מ־ד","The consonants of the root are ל־מ־ד."],
 ["שָׁמַר","ש־מ־ר","The consonants of the root are ש־מ־ר."],
 ["דִּבֵּר","ד־ב־ר","Pi'el pattern; the consonants of the root are ד־ב־ר."],
 ["הִתְלַבֵּשׁ","ל־ב־שׁ","Hitpa'el prefix הת is not part of the root."]
];
function buildPool(mode){
 const pool=[];
 if(mode==="all"||mode==="binyan")binyanim.forEach((b,i)=>pool.push({id:"b"+i,cat:"Identify the binyan • past 3ms",prompt:b.pattern,answer:b.he,options:binyanim.map(x=>x.he),why:b.en+": "+b.note}));
 if(mode==="all"||mode==="past")past.forEach((x,i)=>pool.push({id:"p"+i,cat:"Identify person / number • past",prompt:x[0],answer:x[1],options:past.map(y=>y[1]),why:x[2]}));
 if(mode==="all"||mode==="future")future.forEach((x,i)=>pool.push({id:"f"+i,cat:"Identify person / number • future",prompt:x[0],answer:x[1],options:future.map(y=>y[1]),why:x[2]}));
 if(mode==="all"||mode==="root")roots.forEach((x,i)=>pool.push({id:"r"+i,cat:"Find the root (שורש)",prompt:x[0],answer:x[1],options:["כ־ת־ב","ל־מ־ד","ש־מ־ר","ד־ב־ר","ל־ב־שׁ"],why:x[2]}));
 return pool
}
let deck=[],idx=0,sessionCorrect=0,selected=false,current=null;
function renderStats(){
 $("patternTotal").textContent=progress.correct+" / "+progress.attempted;
 $("patternAccuracy").textContent=progress.attempted?Math.round(100*progress.correct/progress.attempted)+"%":"—";
 $("patternReview").textContent=Object.values(progress.missed).filter(Boolean).length
}
function begin(){
 const mode=$("patternMode").value;
 const pool=buildPool(mode);
 const missed=pool.filter(q=>progress.missed[q.id]>0);
 const picked=shuffle(missed).slice(0,5);
 shuffle(pool).forEach(q=>{if(picked.length<10&&!picked.some(x=>x.id===q.id))picked.push(q)});
 deck=picked;idx=0;sessionCorrect=0;
 $("patternSetup").classList.add("hidden");
 $("patternSession").classList.remove("hidden");
 showQuestion()
}
function showQuestion(){
 if(idx>=deck.length){
   $("patternQuestion").textContent="Practice complete";
   $("patternLabel").textContent="Session result";
   $("patternPrompt").textContent=sessionCorrect+" / "+deck.length+" correct";
   $("patternOptions").innerHTML="";
   $("patternFeedback").textContent="Missed patterns will be prioritized next time. This exercise does not change your main lesson level.";
   $("patternFeedback").className="feedback good";
   $("patternNext").classList.add("hidden");
   $("patternDone").classList.remove("hidden");
   return
 }
 selected=false;current=deck[idx];
 $("patternQuestion").textContent="Question "+(idx+1)+" of "+deck.length;
 $("patternLabel").textContent=current.cat;
 $("patternPrompt").textContent=current.prompt;
 $("patternPrompt").dir="rtl";
 $("patternOptions").innerHTML="";
 $("patternFeedback").textContent="";
 $("patternFeedback").className="feedback hidden";
 $("patternNext").classList.add("hidden");
 $("patternDone").classList.add("hidden");
 const other=shuffle([...new Set(current.options.filter(x=>x!==current.answer))]).slice(0,3);
 shuffle([current.answer,...other]).forEach(opt=>{
   let btn=document.createElement("button");btn.type="button";btn.className="choice";
   btn.textContent=opt;btn.dir=/[\u0590-\u05ff]/.test(opt)?"rtl":"ltr";
   btn.onclick=()=>choose(opt,btn);$("patternOptions").appendChild(btn)
 })
}
function choose(opt,btn){
 if(selected)return;selected=true;
 const ok=opt===current.answer;
 progress.attempted++;if(ok){progress.correct++;sessionCorrect++;if(progress.missed[current.id])progress.missed[current.id]--}else progress.missed[current.id]=(progress.missed[current.id]||0)+1;
 save();renderStats();
 Array.from($("patternOptions").children).forEach(b=>{b.disabled=true;if(b.textContent===current.answer)b.classList.add("correct")});
 if(!ok)btn.classList.add("wrong");
 $("patternFeedback").textContent=(ok?"Correct. ":"Correct: "+current.answer+". ")+current.why;
 $("patternFeedback").className="feedback "+(ok?"good":"bad");
 $("patternNext").classList.remove("hidden")
}
function finish(){
 $("patternSession").classList.add("hidden");
 $("patternSetup").classList.remove("hidden");
 renderStats()
}
$("patternStart").onclick=begin;
$("patternNext").onclick=()=>{idx++;showQuestion()};
$("patternDone").onclick=finish;
$("patternExit").onclick=finish;
renderStats()
})();