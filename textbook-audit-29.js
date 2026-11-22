/* ללמוד עברית ברמה ב׳ unit 12, checked against PDF pages 143–154. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[29];
if(!Array.isArray(bank)||bank.length!==33)throw Error('Unexpected unit 12 bank');
const moved=new Set(['action.noun.3','action.noun.4','action.noun.5','action.noun.6','roots.1','roots.2','roots.3']);
const keep=bank.filter(q=>!moved.has(q.sourceExercise));
if(keep.length!==26)throw Error('Unit 12 bank mapping');
const by=id=>{const q=keep.find(x=>x.sourceExercise===id);if(!q)throw Error('Missing '+id);return q};
for(const id of ['verb.pairs.1','verb.pairs.2','verb.pairs.3','verb.pairs.4'])by(id).category='Past-tense subject changes';
for(const id of ['future.1','future.2','future.3'])by(id).category='Future-tense transformations';
for(const id of ['action.noun.1','action.noun.2'])by(id).category='Action nouns';
for(const id of ['contrast.1','contrast.2','contrast.3'])by(id).category='Ability and necessity • יכול / צריך';
const first=by('negation.1');first.prompt='האיכרים עובדים את האדמה. כתבו בשלילה עם אינם.';
const purpose=by('purpose.3');purpose.prompt='השודדת פרסמה בעיתון מודעה כדי לקבל כסף. כתבו עם כדי ש לפי התרגיל.';
for(const q of keep)if(!q.sourcePage||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 12 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[29]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[29];
if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 12 Hebrew interpretation');
const explanations=[
 'המשפט הראשון אומר שצבעים משפיעים על מצב הרוח וההתנהגות של בני אדם ובעלי חיים.',
 'לירוק יש השפעה מרגיעה: green has a calming effect.',
 'הרעל נצבע בצבעים שהציפורים אינן אוהבות כדי שלא יאכלו אותו.'
];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
