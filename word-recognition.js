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
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(stats))}catch(e){}};
let deck=[],index=0,correct=0,answered=false,current=null;
function updateStats(){
 $("standaloneOverall").textContent=stats.correct+" / "+stats.attempted;
 $("standaloneAccuracy").textContent=stats.attempted?Math.round(stats.correct/stats.attempted*100)+"%":"—";
 $("standaloneReview").textContent=Object.values(stats.missed).filter(n=>n>0).length
}
function getPool(){
 const mode=$("standaloneMode").value;
 return mode==="openings"?phrasePool:mode==="general"?standard:combined
}
function begin(){
 const mode=$("standaloneMode").value,pool=getPool();
 if(pool.length<4){$("standaloneResult").textContent="Not enough vocabulary for this mode.";return}
 const count=Math.min(15,pool.length),chosen=[];
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
 const reverse=index%2===1;
 $("standaloneProgress").textContent=(index+1)+" / "+deck.length;
 $("standaloneScore").textContent=correct+" / "+index;
 $("standaloneDirection").textContent=reverse?"English → Hebrew • select the word":"Hebrew → English • select the meaning";
 $("standalonePrompt").textContent=reverse?current.en:current.he;
 $("standalonePrompt").dir=reverse?"ltr":"rtl";
 $("standaloneChoices").innerHTML="";
 $("standaloneFeedback").className="feedback hidden";
 $("standaloneNext").classList.add("hidden");
 const expected=reverse?current.he:current.en;
 options(current,reverse).forEach(value=>{
   const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=value;b.dir=reverse?"rtl":"ltr";
   b.onclick=()=>choose(b,value,expected);
   $("standaloneChoices").appendChild(b)
 })
}
function choose(btn,value,expected){
 if(answered)return;answered=true;
 const ok=norm(value)===norm(expected);
 stats.attempted++;if(ok){stats.correct++;correct++;stats.missed[current.he]=Math.max(0,(stats.missed[current.he]||0)-1)}else stats.missed[current.he]=(stats.missed[current.he]||0)+1;
 persist();updateStats();
 Array.from($("standaloneChoices").children).forEach(b=>{b.disabled=true;if(norm(b.textContent)===norm(expected))b.classList.add("correct")});
 if(!ok)btn.classList.add("wrong");
 $("standaloneFeedback").textContent=(ok?"Correct. ":"Review: ")+current.he+" — "+current.en;
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