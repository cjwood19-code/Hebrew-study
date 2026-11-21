/* ללמוד עברית ברמה ב׳ unit 7: source exercise audit, PDF pages 86–98. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[24];if(!Array.isArray(bank)||bank.length!==29)throw Error('Unexpected unit 7 bank');
const keep=bank.filter((_,i)=>i!==8&&i<25);
const sourceExercises=[
 'reading.vocab.road','reading.vocab.fuel','reading.vocab.rest','reading.vocab.price',
 'construct.example.school','construct.exercise.2.driver','construct.exercise.2.stories','construct.exercise.2.waiting',
 'future.chart.buy.i','future.chart.buy.you.f','future.chart.build.we','future.chart.drink.they',
 'action.noun.buy','action.noun.build','action.noun.park','action.noun.health',
 'relative.exercise.1','relative.exercise.2.people','relative.exercise.2.student','relative.exercise.2.doyle',
 'reading.vocab.of-course','transport.crossword.train','transport.crossword.bicycle','transport.crossword.plane'];
if(keep.length!==sourceExercises.length)throw Error('Unit 7 source mapping');
keep.forEach((q,i)=>{q.sourceExercise=sourceExercises[i];q.practiceOrigin='Supplemental recognition from unit 7 reading or printed exercise; choices adapted';});
const reading=keep.slice(0,4);
reading[0].prompt='כבישים לא היו, כמובן, והדרכים היו צרות מאוד. What does כבישים mean here?';
reading[0].answer='roads';reading[0].options=['roads','bridges','rivers','stations'];reading[0].explanation='כבישים היא צורת הרבים של כביש; הקריאה אומרת שלא היו כבישים והדרכים היו צרות.';
reading[1].prompt='אבל מחיר הדלק עולה כל הזמן. What does דלק mean here?';
reading[2].prompt='שם אפשר היה לנוח, לאכול ולהאכיל את הסוסים. What does לנוח mean here?';
reading[3].prompt='אבל מחיר הדלק עולה כל הזמן. What does מחיר mean here?';
keep[14].prompt='מגרש ה___ שלנו פתוח 24 שעות ביממה.';
keep[20].sourcePage=86;keep[20].prompt='כבישים לא היו, כמובן, והדרכים היו צרות מאוד. What does כמובן mean here?';
keep.sort((a,b)=>a.sourcePage-b.sourcePage);
for(const q of keep)if(!q.sourcePage||!q.sourceExercise||!q.explanation||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 7 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[24]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[24];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 7 interpretation');
const explanations=['הקריאה משווה את הנסיעה הארוכה מיפו לירושלים לנסיעה המהירה כיום.','שם מתייחס לחאן, שבו הנוסעים יכלו לנוח, לאכול ולהאכיל את הסוסים.','בתחילת הקריאה מסופר שהשתמשו בסוסים ובחמורים כדי לעבור ממקום למקום.'];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
