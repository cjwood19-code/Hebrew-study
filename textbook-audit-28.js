/* ללמוד עברית ברמה ב׳ unit 11, compared with scanned PDF pages 132–142. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[28];
if(!Array.isArray(bank)||bank.length!==27)throw Error('Unexpected unit 11 bank');
// The possessive endings in the connected accident story are displayed beside that story.
const keep=bank.filter(q=>!q.sourceExercise.startsWith('possessive.story.'));
if(keep.length!==23)throw Error('Unit 11 bank mapping');
const by=id=>{const q=keep.find(x=>x.sourceExercise===id);if(!q)throw Error('Missing '+id);return q};
const conditional=by('conditional.2');
conditional.prompt='התייר יבקש עזרה, רק אם _____. Complete the printed condition.';
conditional.answer='יחשוב שהחיים שלו בסכנה';
conditional.options=['יחשוב שהחיים שלו בסכנה','ימצא מזון ומים','יחזור מן האי','יבקר בכפר'];
conditional.explanation='בקריאה כתוב שרק אם התייר יחשוב שהחיים שלו בסכנה, הוא יכול לבקש עזרה. רק אם מציג תנאי הכרחי.';
const reflexives=[
 ['reflexive.1','אנחנו הכנו את השיעורים _____.','בעצמנו',['בעצמנו','בעצמם','על עצמנו','את עצמנו'],'אנחנו הוא גוף ראשון רבים; עשינו את העבודה בעצמנו.'],
 ['reflexive.2','אתם חושבים כל הזמן רק _____.','על עצמכם',['על עצמכם','על עצמם','בעצמכם','את עצמכם'],'חושבים על מישהו; אחרי אתם משתמשים בצורת הגוף השני רבים: על עצמכם.'],
 ['reflexive.3','התינוקת כבר גדולה. היא יודעת לאכול _____.','בעצמה',['בעצמה','בעצמם','על עצמה','את עצמה'],'התינוקת אוכלת בעצמה, ללא עזרה. צורת הנקבה היחידה היא בעצמה.']
];
for(const [id,prompt,answer,options,explanation] of reflexives){const q=by(id);q.prompt=prompt;q.answer=answer;q.options=options;q.explanation=explanation;}
for(const q of keep)if(!q.sourcePage||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 11 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[28]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[28];
if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 11 Hebrew interpretation');
const explanations=[
 'המשפט מתאר תיירים המעוניינים לבקר במקומות מיוחדים: tourists want to visit unusual places.',
 'היא מביאה תייר בודד לאי שאין בו אנשים: the company takes one tourist to an uninhabited island.',
 'התייר צריך לדאוג לעצמו: the tourist must take care of himself.'
];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
