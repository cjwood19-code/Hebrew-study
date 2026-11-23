/* Unit 18 checked against the supplied scan, indexed PDF pages 206–213. */
(function(){'use strict';
const all=window.HEBREW_TEXTBOOK_QUESTION_BANKS[35];if(!Array.isArray(all)||all.length!==14)throw Error('Unexpected unit 18 bank');
// The printed completion exercises belong beside their source lines in Reading Practice.
const bank=all.filter(q=>q.sourceExercise.startsWith('kaf.'));
if(bank.length!==3)throw Error('Unit 18 connected exercise move');
for(const q of bank){q.practiceOrigin='Original meaning-of-כ exercise D, PDF 211 (printed page 207); English choices adapted';q.explanation=q.sourceExercise==='kaf.3'?'כשל האדם means like that of a human; this כ marks likeness.':'In this sentence כ gives an approximate quantity or duration.';}
const extra=[
 [206,'vocab.1','הוא אינו דג. What does אינו mean here?','is not','is','wants','has','אינו שולל את השייכות לדגים: הוא אינו דג.'],
 [206,'vocab.2','כדי לנשום הוא חייב לעלות על פני המים. What does חייב mean here?','must','may','once','never','חייב מציין צורך: הלווייתן צריך לעלות כדי לנשום.'],
 [206,'vocab.3','המים עוזרים לה ודוחפים את גופה הכבד למעלה. What does עוזרים mean?','help','sink','follow','remember','עוזרים פירושו מסייעים; המים מסייעים לאם להעלות את גופה.']
];
for(const [sourcePage,sourceExercise,prompt,answer,a,b,c,explanation] of extra)bank.push({sourcePage,sourceExercise,category:'Vocabulary in source context • אוצר מילים',prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Supplemental interpretation of an original sentence, PDF 206'});
bank.sort((a,b)=>a.sourcePage-b.sourcePage);
for(const q of bank)if(q.sourcePage<206||q.sourcePage>213||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 18 schema '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[35]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[35];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 18 interpretation');checks.forEach((q,i)=>{q.sourceExercise='whale.interpretation.'+(i+1);if(!q.explanation)throw Error('Missing explanation');});
})();
