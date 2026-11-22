/* ללמוד עברית ברמה ב׳ unit 15; compare connected source work with PDF pages 179–186. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[32];if(!Array.isArray(bank)||bank.length!==19)throw Error('Unexpected unit 15 bank');
const moved=new Set(['possessive.family.1','possessive.family.2','possessive.family.3']);
const keep=bank.filter(q=>!moved.has(q.sourceExercise));if(keep.length!==16)throw Error('Unit 15 move');
const by=id=>{const q=keep.find(x=>x.sourceExercise===id);if(!q)throw Error('Missing '+id);return q};
for(const id of ['verb.table.1','verb.table.2','verb.table.3','verb.table.4','verb.table.5','verb.table.6','verb.table.7']){
 const q=by(id);q.practiceOrigin='Supplemental tense interpretation from printed verb table, PDF 182';
 q.explanation='בטבלת הפועל בעמוד 178 הצורה המבוקשת מותאמת לגוף ולזמן: '+q.answer+'.';
}
by('place.1').practiceOrigin='Printed replace-with-shorter-expression exercise, PDF 185; options adapted';
for(const q of keep)if(!q.sourcePage||q.sourcePage<179||q.sourcePage>186||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 15 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[32]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[32];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 15 interpretation');
const explanations=['הצעירה נישאה לסטודנט על אף התנגדות משפחתה: המשפחה התנגדה לנישואין.','בני הזוג חששו מן המשפחה; לכן עזבו את אנגליה ועברו לקנדה.','החטיפה של הצעירה זעזעה אנשים רבים בקנדה.'];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
