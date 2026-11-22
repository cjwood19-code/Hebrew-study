/* Unit 16 checked against the supplied scan, indexed PDF pages 187–195. */
(function(){'use strict';
const all=window.HEBREW_TEXTBOOK_QUESTION_BANKS[33];
if(!Array.isArray(all)||all.length!==17)throw Error('Unexpected unit 16 bank');
// The printed passive-voice task is a connected four-part cloze. It appears
// with its original sentences and blanks in Reading Practice.
const bank=all.filter(q=>!q.sourceExercise.startsWith('future.passive.'));
if(bank.length!==12)throw Error('Unit 16 cloze move');
for(const q of bank){
 if(q.sourceExercise==='infinitive.1'){
  q.sourcePage=187;q.practiceOrigin='Supplemental infinitive form from the unit 16 robber story, PDF 187';
  q.explanation='בסיפור השודדים כתוב ״ונמלטו מן המקום״. שם הפועל של נמלטו הוא להימלט.';
 }else if(q.sourceExercise.startsWith('infinitive.')){
  q.practiceOrigin='Selected verb from printed infinitive exercise B3, PDF 191';
  q.explanation=q.sourceExercise==='infinitive.2'?'בסיפור נורית כתוב ״היא נעצרה באמצע החדר״. שם הפועל הוא להיעצר.':'בסיפור נורית כתוב ״שהדלת נפרצה״. שם הפועל הוא להיפרץ.';
 }else if(q.sourceExercise.startsWith('sign.')){
  q.practiceOrigin='Original automobile sign interpreted in English; PDF 195 (printed page 190)';q.sourcePage=195;
  q.explanation=q.sourceExercise==='sign.1'?'קרוב מדי פירושו too close. השלט פונה לנהג שנוסע קרוב מדי למכונית.':'״כשאהיה גדולה״ הוא ביטוי של המכונית המדברת כאילו הייתה אדם.';
 }else{
  q.practiceOrigin='Selected original possessive-noun and adjective exercise, PDF 189 (printed page 185); choices adapted';
 }
 if(!q.sourcePage||q.sourcePage<187||q.sourcePage>195||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 16 schema: '+q.sourceExercise);
}
bank.sort((a,b)=>a.sourcePage-b.sourcePage);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[33]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[33];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 16 interpretation');
const explanations=['הקופאי נפצע בלבד; לא נהרג.','ג׳ק עצר משום שלא רצה לדרוס את הברווזונים שבכביש.','השופט גזר על השודדים עשר שנות מאסר.'];
checks.forEach((q,i)=>{q.sourceExercise='ducklings.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
