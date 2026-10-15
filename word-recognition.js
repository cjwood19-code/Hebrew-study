(function(){
"use strict";
const $=id=>document.getElementById(id);
if(!$("standaloneVocabCard")||!window.TRAINER_DATA||!window.HEBREW_OPENING_WORDS)return;
const full=window.TRAINER_DATA.vocab,openings=window.HEBREW_OPENING_WORDS;
const KEY="hebrewStandaloneRecognitionV1";
let stats={attempted:0,correct:0,missed:{}};
try{const old=JSON.parse(localStorage.getItem(KEY)||"null");if(old&&typeof old==="object")stats=Object.assign(stats,old)}catch(e){}
const shuffle=a=>a.slice().sort(()=>Math.random()-.5);
const norm=x=>String(x||"").normalize("NFKD").replace(/[\u0591-\u05C7]/g,"").replace(/\s+/g," ").trim().toLowerCase();
const uniq=items=>{let used=new Set();return items.filter(x=>{let key=norm(x.he);if(!key||used.has(key))return false;used.add(key);return true})};
const standard=uniq(full.filter(x=>!openings.some(y=>norm(y.he)===norm(x.he))&&x.he&&x.en));
const phrasePool=uniq(openings);
const combined=uniq([...phrasePool,...standard]);
// These are short expression + verb-form pairs, not sentence-completion tasks.
// Most of these expressions also have other legitimate constructions.
const infinitivePairs=[
 ["כדאי","ללמוד","לומד","למד","ילמד"],
 ["אסור","לעשן","מעשן","עישן","יעשן"],
 ["מותר","להיכנס","נכנס","נכנסתי","ייכנס"],
 ["אפשר","ללכת","הולך","הלך","ילך"],
 ["צריך","לעבוד","עובד","עבד","יעבוד"],
 ["צריכה","לקרוא","קוראת","קראה","תקרא"],
 ["חייב","לשלם","משלם","שילם","ישלם"],
 ["חייבת","ללמוד","לומדת","למדה","תלמד"],
 ["רצוי","לבדוק","בודק","בדק","יבדוק"],
 ["מומלץ","לנסות","מנסה","ניסה","ינסה"],
 ["עדיף","לחכות","מחכה","חיכה","יחכה"],
 ["חשוב","להקשיב","מקשיב","הקשיב","יקשיב"],
 ["לא כדאי","לוותר","מוותר","ויתר","יוותר"],
 ["אין צורך","למהר","ממהר","מיהר","ימהר"]
];
const grammarPool=infinitivePairs.map(function(x,i){
 return {id:"grammar:"+i,he:x[0],prompt:x[0]+" + ___",en:"infinitive (שם פועל)",correct:x[1],choices:x.slice(1),why:x[0]+" + "+x[1]+". When this expression introduces an action directly, use an infinitive (ל־ + verb). It can have other constructions too."}
});
grammarPool.push({id:"grammar:clause",he:"כדאי ש־",prompt:"כדאי ש־ + ___",en:"finite verb after ש־",correct:"תלמד",choices:["תלמד","ללמוד","לומד","למד"],why:"כדאי ש־ takes a conjugated verb, not an infinitive: כדאי שתלמד. This is different from כדאי ללמוד."});
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(stats))}catch(e){}};
let deck=[],index=0,correct=0,answered=false,current=null;
function updateStats(){
 $("standaloneOverall").textContent=stats.correct+" / "+stats.attempted;
 $("standaloneAccuracy").textContent=stats.attempted?Math.round(stats.correct/stats.attempted*100)+"%":"—";
 $("standaloneReview").textContent=Object.values(stats.missed).filter(n=>n>0).length
}
function getPool(){
 const mode=$("standaloneMode").value;
 return mode==="openings"?phrasePool:mode==="general"?standard:mode==="grammar"?grammarPool:combined
}
function begin(){
 const mode=$("standaloneMode").value,pool=getPool();
 if(pool.length<4){$("standaloneResult").textContent="Not enough vocabulary for this mode.";return}
 const count=Math.min(15,pool.length),chosen=[];
 if(mode==="grammar"){
   shuffle(pool.filter(x=>stats.missed[x.id]>0)).forEach(x=>{if(chosen.length<5)chosen.push(x)});
   shuffle(pool).forEach(x=>{if(chosen.length<count&&!chosen.some(y=>y.id===x.id))chosen.push(x)});
   deck=shuffle(chosen);index=0;correct=0;
   $("standaloneSetup").classList.add("hidden");
   $("standalonePanel").classList.remove("hidden");
   $("standaloneResult").classList.add("hidden");
   next();return
 }
 // Mixed practice always includes both opening expressions and regular words.
 if(mode==="mixed"){
   const openingMissed=shuffle(phrasePool.filter(x=>stats.missed[x.he]>0));
   const generalMissed=shuffle(standard.filter(x=>stats.missed[x.he]>0));
   chosen.push(...openingMissed.slice(0,3),...generalMissed.slice(0,3));
   shuffle(phrasePool).forEach(x=>{if(chosen.filter(y=>phrasePool.some(z=>z.he===y.he)).length<7&&!chosen.some(y=>y.he===x.he))chosen.push(x)});
   shuffle(standard).forEach(x=>{if(chosen.length<count&&!chosen.some(y=>y.he===x.he))chosen.push(x)})
 }else{
   shuffle(pool.filter(x=>stats.missed[x.he]>0)).forEach(x=>{if(chosen.length<6)chosen.push(x)});
   shuffle(pool).forEach(x=>{if(chosen.length<count&&!chosen.some(y=>y.he===x.he))chosen.push(x)})
 }
 deck=shuffle(chosen.slice(0,count));index=0;correct=0;
 $("standaloneSetup").classList.add("hidden");
 $("standalonePanel").classList.remove("hidden");
 $("standaloneResult").classList.add("hidden");
 next()
}
function options(item,reverse){
 const target=reverse?item.he:item.en;
 // For opening expressions, prefer close semantic distractors.
 const same=phrasePool.some(x=>x.he===item.he);
 const source=same?phrasePool:standard;
 const used=new Set([norm(target)]),opts=[target];
 shuffle(source.filter(x=>x.he!==item.he)).concat(shuffle(combined)).forEach(x=>{
   let value=reverse?x.he:x.en;
   if(opts.length<4&&!used.has(norm(value))){opts.push(value);used.add(norm(value))}
 });
 return shuffle(opts)
}
function next(){
 if(index>=deck.length){finish();return}
 current=deck[index];answered=false;
 const grammar=!!current.id&&current.id.startsWith("grammar:");
 const reverse=!grammar&&index%2===1;
 $("standaloneProgress").textContent=(index+1)+" / "+deck.length;
 $("standaloneScore").textContent=correct+" / "+index;
 $("standaloneDirection").textContent=grammar?"Select the correct verb form after the expression (שם פועל)":reverse?"English → Hebrew • select the word":"Hebrew → English • select the meaning";
 $("standalonePrompt").textContent=grammar?current.prompt:reverse?current.en:current.he;
 $("standalonePrompt").dir=reverse?"ltr":"rtl";
 $("standaloneChoices").innerHTML="";
 $("standaloneFeedback").className="feedback hidden";
 $("standaloneNext").classList.add("hidden");
 const expected=grammar?current.correct:reverse?current.he:current.en;
 (grammar?shuffle(current.choices):options(current,reverse)).forEach(value=>{
   const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=value;b.dir=reverse?"rtl":"ltr";
   b.onclick=()=>choose(b,value,expected);
   $("standaloneChoices").appendChild(b)
 })
}
function choose(btn,value,expected){
 if(answered)return;answered=true;
 const ok=norm(value)===norm(expected);
 const key=current.id||current.he;
 stats.attempted++;if(ok){stats.correct++;correct++;stats.missed[key]=Math.max(0,(stats.missed[key]||0)-1)}else stats.missed[key]=(stats.missed[key]||0)+1;
 persist();updateStats();
 Array.from($("standaloneChoices").children).forEach(b=>{b.disabled=true;if(norm(b.textContent)===norm(expected))b.classList.add("correct")});
 if(!ok)btn.classList.add("wrong");
 $("standaloneFeedback").textContent=(ok?"Correct. ":"Review: ")+(current.why||current.he+" — "+current.en);
 $("standaloneFeedback").className="feedback "+(ok?"good":"bad");
 $("standaloneNext").classList.remove("hidden")
}
function finish(){
 $("standalonePanel").classList.add("hidden");
 $("standaloneSetup").classList.remove("hidden");
 $("standaloneResult").textContent="Practice complete: "+correct+" / "+deck.length+" correct. Missed words will be prioritized next time. Main lesson progress is unchanged.";
 $("standaloneResult").className="feedback "+(correct===deck.length?"good":"bad");
 updateStats()
}
$("standaloneStart").onclick=begin;
$("standaloneNext").onclick=()=>{index++;next()};
$("standaloneExit").onclick=finish;
updateStats()
})();