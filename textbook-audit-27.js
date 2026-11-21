/* ללמוד עברית ברמה ב׳ unit 10, compared with supplied scan PDF 119–131. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[27];
if(!Array.isArray(bank)||bank.length!==71)throw Error('Unexpected unit 10 bank');
// The page-124 preposition cloze belongs next to the legend in Reading Practice.
// The Columbus sentence is withheld: it adds unrelated historical recall.
const keep=bank.filter(q=>q.sourcePage!==128&&q.sourceExercise!=='ד2.2');
if(keep.length!==65)throw Error('Unit 10 exercise mapping');
for(const q of keep)if(!q.sourcePage||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 10 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[27]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[27];
if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 10 Hebrew interpretation');
const explanations=[
 'הוא הסתכל החוצה וראה ערמות אשפה ענקיות: he looked outside and saw enormous piles of refuse.',
 'הנשים עמדו ושתקו: the women stood and remained silent.',
 'הוא פיזר מטבעות זהב על ערמות האשפה: he scattered gold coins on the refuse piles.'
];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
