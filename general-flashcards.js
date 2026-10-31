(function(){
"use strict";
const $=id=>document.getElementById(id);
const host=$("generalFlashcardsCard");
if(!host)return;
const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const KEY="hebrewGeneralFlashcardsV1";
let reviews={};
try{
  const saved=JSON.parse(localStorage.getItem(KEY)||"null");
  if(saved&&saved.version===1&&saved.cards&&typeof saved.cards==="object"&&!Array.isArray(saved.cards))reviews=saved.cards;
}catch(e){}
let deck=[],index=0,revealed=false,graded=false;
const shuffle=items=>{
  const result=items.slice();
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
};
function eligible(){
  const filter=$("flashcardSet").value;
  return cards.filter(c=>filter==="all"||filter==="review"&&reviews[c.id]?.status==="review"||String(c.chapter)===filter);
}
function summary(){
  const known=cards.filter(c=>reviews[c.id]?.status==="known").length;
  const review=cards.filter(c=>reviews[c.id]?.status==="review").length;
  $("flashcardSummary").textContent=cards.length+" cards · "+known+" remembered · "+review+" to review";
  $("flashcardStart").disabled=eligible().length===0;
  $("flashcardEmpty").textContent=eligible().length?"":"No cards in this set. Choose all cards or mark a card ‘Review again’.";
}
function show(){
  const c=deck[index],reverse=$("flashcardDirection").value==="en-he";
  revealed=false;graded=false;
  $("flashcardPosition").textContent="Card "+(index+1)+" of "+deck.length;
  $("flashcardFront").textContent=reverse?c.en:c.he;
  $("flashcardFront").dir=reverse?"ltr":"rtl";
  $("flashcardBack").textContent=reverse?c.he:c.en;
  $("flashcardBack").dir=reverse?"rtl":"ltr";
  $("flashcardBack").hidden=true;
  $("flashcardSource").textContent=c.book+" · Chapter "+c.chapter+" · PDF page "+c.sourcePage;
  $("flashcardReveal").hidden=false;
  $("flashcardRating").hidden=true;
  $("flashcardNext").hidden=true;
  $("flashcardNext").textContent=index===deck.length-1?"Finish set":"Next card";
  $("flashcardFeedback").textContent="";
}
function begin(){
  deck=shuffle(eligible());if(!deck.length){summary();return;}
  index=0;
  $("flashcardSetup").hidden=true;
  $("flashcardPanel").hidden=false;
  $("flashcardResult").textContent="";
  show();$("flashcardReveal").focus();
}
function end(completed){
  $("flashcardPanel").hidden=true;
  $("flashcardSetup").hidden=false;
  $("flashcardResult").textContent=completed?"Set complete. Choose ‘Cards to review’ to revisit words you missed.":"Session closed. Your card ratings are retained.";
  deck=[];revealed=false;graded=false;summary();$("flashcardStart").focus();
}
function grade(status){
  if(!deck.length||!revealed||graded)return;
  graded=true;
  const c=deck[index],old=reviews[c.id]||{};
  reviews[c.id]={status,seen:(Number.isFinite(old.seen)?old.seen:0)+1,lastReviewed:new Date().toISOString()};
  let stored=true;
  try{localStorage.setItem(KEY,JSON.stringify({version:1,cards:reviews}));}catch(e){stored=false;}
  $("flashcardFeedback").textContent=(status==="known"?"Marked remembered.":"Added to cards to review.")+(stored?"":" Browser storage is unavailable; this rating is kept for this visit only.");
  $("flashcardRating").hidden=true;
  $("flashcardNext").hidden=false;
  summary();$("flashcardNext").focus();
}
$("flashcardStart").onclick=begin;
$("flashcardSet").onchange=summary;
$("flashcardReveal").onclick=()=>{
  if(!deck.length||revealed)return;
  revealed=true;$("flashcardBack").hidden=false;$("flashcardReveal").hidden=true;
  $("flashcardRating").hidden=false;$("flashcardReview").focus();
};
$("flashcardKnown").onclick=()=>grade("known");
$("flashcardReview").onclick=()=>grade("review");
$("flashcardNext").onclick=()=>{
  if(!graded||!deck.length)return;
  index++;if(index>=deck.length){end(true);return;}
  show();$("flashcardReveal").focus();
};
$("flashcardExit").onclick=()=>end(false);
summary();
})();
