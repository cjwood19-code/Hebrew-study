/* Unit 19 source audit: printed pages 211–212, indexed PDF pages 215–216. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[36];if(!Array.isArray(bank)||bank.length!==6)throw Error('Unexpected unit 19 bank');
for(const q of bank){
 q.sourcePage=215;
 q.practiceOrigin='Supplemental question from an original Kol Nidrei story sentence, PDF 215 (printed page 211)';
 if(q.sourceExercise==='vocab.2'){
  q.prompt='טיילתי ברחובות הריקים של העיירה. What does הריקים describe?';
  q.explanation='הריקים פירושו empty; המספר טייל ברחובות העיירה ולא פגש איש.';
 }
 if(q.sourceExercise==='verb.1')q.prompt='קולות השירה _____ מהקומה העליונה של אחד הבתים. Complete the story sentence.';
 if(q.sourceExercise==='vocab.3'){
  q.prompt='האישה הזמינה אותי לשבת, ובמעט המילים שידעה באנגלית _____: ... Choose the verb for “explained”.';
  q.explanation='בסיפור האישה הזמינה את המספר לשבת ואז הסבירה לו על התקליט באנגלית.';
 }
 if(q.sourceExercise==='verb.2')q.explanation='כל שנה ביום זה מתארת פעולה חוזרת בעבר. הצורה בסיפור היא היתה משמיעה.';
 if(!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 19 question '+q.sourceExercise);
}
const checks=window.HEBREW_CHAPTER_INTERPRETATION[36];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 19 interpretation');checks.forEach((q,i)=>{q.sourcePage=215;q.sourceExercise='kol-nidrei.interpretation.'+(i+1);if(!q.explanation)throw Error('Unit 19 explanation');});
})();
