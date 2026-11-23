/* Chapter 38: keep connected printed fill-ins beside their source in Reading Practice. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[38];
if(!Array.isArray(bank)||bank.length!==11)throw Error('Unexpected chapter 38 bank');
const moved=new Set(['verb-cloze.1','verb-cloze.2','future.1','future.2']);
const retained=bank.filter(q=>!moved.has(q.sourceExercise));
if(retained.length!==7||new Set(bank.filter(q=>moved.has(q.sourceExercise)).map(q=>q.sourceExercise)).size!==4)throw Error('Chapter 38 transfer mismatch');
for(const q of retained){
 if(q.sourceExercise==='connective.1')q.practiceOrigin='Supplemental completion from the printed ואילו example, PDF 39 (printed page 27)';
 if(q.sourceExercise==='noun-adjective.1')q.practiceOrigin='Supplemental transformation from the printed noun–adjective pairs, PDF 54 (printed page 42)';
 if(q.sourceExercise==='preposition.1')q.practiceOrigin='Supplemental question from the printed dialogue, PDF 58 (printed page 47)';
 if(!q.sourcePage||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Chapter 38 question '+q.sourceExercise);
}
window.HEBREW_TEXTBOOK_QUESTION_BANKS[38]=retained;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[38];
if(!Array.isArray(checks)||checks.length!==3||checks.some(q=>!q.sourcePage||!q.explanation))throw Error('Chapter 38 interpretation');
checks.forEach((q,i)=>q.sourceExercise='chapter2.interpretation.'+(i+1));
})();
