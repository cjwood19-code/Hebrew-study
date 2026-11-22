/* Unit 14 source check: scanned PDF pages 165–178, printed pages 161–174. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[31];
if(!Array.isArray(bank)||bank.length!==32)throw Error('Unexpected unit 14 bank');
const by=id=>{const q=bank.find(x=>x.sourceExercise===id);if(!q)throw Error('Missing '+id);return q};
for(const id of ['possessive.pl.5','possessive.pl.6','possessive.pl.7'])by(id).sourcePage=167;
for(const id of ['classification.1','classification.2']){
 const q=by(id);q.category='Verb meaning • supplemental from printed vocabulary list';
 q.practiceOrigin='Supplemental interpretation of unit 14 vocabulary list, PDF 176';
 q.explanation='בתרגיל אוצר המילים בעמוד 172, '+q.answer+' היא הצורה המתאימה למשמעות שבשאלה.';
}
for(const q of bank){
 if(!q.sourcePage||q.sourcePage<165||q.sourcePage>178||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 14 schema: '+q.sourceExercise);
}
const checks=window.HEBREW_CHAPTER_INTERPRETATION[31];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 14 interpretation');
const explanations=['בסיפור, אריה, זאב ושועל יצאו יחד לצוד ציד.','השועל אומר שהוא והזאב יסתפקו בשפן, כלומר יהיו מרוצים מהשפן.','האריה שואל את השועל ממי למד לחלק שלל. השועל מצביע על מה שקרה לזאב.'];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
