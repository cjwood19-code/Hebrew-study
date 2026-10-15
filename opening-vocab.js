(function(){
"use strict";
// High-frequency stand-alone expressions for word recognition. These are
// supplementary standard Hebrew vocabulary, not extracted course quotations.
const items=[
 ["כדאי","worthwhile / advisable"],
 ["כדאי ל־","it is worth it to / worthwhile to"],
 ["אסור","forbidden / not allowed"],
 ["מותר","allowed / permitted"],
 ["אפשר","possible / can"],
 ["אי אפשר","impossible / cannot"],
 ["צריך","need to / must (masculine singular)"],
 ["צריכה","need to / must (feminine singular)"],
 ["חייב","must / obligated (masculine singular)"],
 ["חייבת","must / obligated (feminine singular)"],
 ["רצוי","desirable / advisable"],
 ["מומלץ","recommended"],
 ["עדיף","preferable / better to"],
 ["חשוב","important"],
 ["לא כדאי","not advisable / not worth it"],
 ["אין צורך","there is no need"],
 ["כדאי ש־","it is advisable that"],
 ["מותר ל־","allowed to"],
 ["אסור ל־","forbidden to"],
 ["אפשר ל־","possible to / can"],
 ["צריך ל־","need to / must"],
 ["חשוב ל־","important to"]
];
const D=window.TRAINER_DATA;
if(!D||!Array.isArray(D.vocab))return;
const norm=x=>String(x||"").normalize("NFKD").replace(/[\u0591-\u05C7]/g,"").replace(/\s+/g," ").trim();
items.forEach(function(pair){
 if(!D.vocab.some(function(x){return norm(x.he)===norm(pair[0])}))
   D.vocab.push({he:pair[0],en:pair[1],cat:"Opening words & expressions"});
});
window.HEBREW_OPENING_WORDS=items.map(function(pair){
 const found=D.vocab.find(function(x){return norm(x.he)===norm(pair[0])});
 return {he:found.he,en:found.en,cat:"Opening words & expressions"}
});
})();