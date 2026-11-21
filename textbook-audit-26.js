/* ללמוד עברית ברמה ב׳, unit 9; compared with supplied scan PDF 109–118. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[26];
if(!Array.isArray(bank)||bank.length!==52)throw Error('Unexpected unit 9 test bank');
// Six page-114 completions already appear beside the reading; move the four remaining ones.
const keep=bank.filter(q=>q.sourcePage!==118);
if(keep.length!==48)throw Error('Unit 9 test mapping changed');
for(const q of keep){
 if(!q.sourceExercise||!q.explanation||!q.practiceOrigin||!q.sourcePage||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 9 test schema: '+q.sourceExercise);
}
window.HEBREW_TEXTBOOK_QUESTION_BANKS[26]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[26];
if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 9 Hebrew interpretation');
const explanations=[
 'בקריאה כתוב שהילדים מגיעים אל בית הספר ברגל, כלומר on foot.',
 'פעם בשבועיים פירושו once every two weeks; המכונית מגיעה למקום.',
 'אינם מביאים פירושו do not bring; הספרים, המחברות והאוכל ניתנים בבית הספר.'
];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
