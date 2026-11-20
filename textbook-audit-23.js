/* ללמוד עברית ברמה ב׳ unit 6; scan-backed reading vocabulary and לחכות chart. */
(function(){'use strict';
const make=(sourcePage,sourceExercise,category,prompt,answer,others,explanation,practiceOrigin)=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,...others],explanation,practiceOrigin});
const reading='Supplemental vocabulary from the printed Sherlock Holmes reading; choices adapted for scoring';
const chart='Form recognition from the printed לחכות chart; choices adapted for scoring';
const bank=[
 make(73,'reading.vocab.detective','Vocabulary in context','שרלוק הולמס הוא בלש אנגלי מפורסם. What does בלש mean?','detective',['driver','teacher','doctor'],'בלש חוקר תעלומות; כך הספר מציג את שרלוק הולמס.',reading),
 make(73,'reading.vocab.driver','Vocabulary in context','כאשר שילם דויל לנהג המונית, שמע אותו אומר: תודה רבה, מר דויל. What does נהג המונית mean?','taxi driver',['train conductor','hotel guest','writer'],'נהג המונית הוא האדם שהסיע את דויל למלון.',reading),
 make(73,'reading.vocab.accent','Vocabulary in context','לפי הבגדים ולפי המבטא שלך אפשר לדעת כי אתה אנגלי. What does מבטא mean?','accent',['suitcase','shoe','newspaper'],'המבטא הוא אופן הדיבור שהנהג שמע אצל דויל.',reading),
 make(73,'reading.vocab.suitcase','Vocabulary in context','השם שלך כתוב על המזוודה. What does מזוודה mean?','suitcase',['newspaper','shoe','taxi'],'בסוף הסיפור השם כתוב על המזוודה, התיק של דויל.',reading),
 make(73,'reading.vocab.surprised','Vocabulary in context','איך הכרת אותי? התפלא הסופר. What does התפלא mean?','was surprised',['was tired','was hungry','was late'],'דויל התפלא כי הנהג ידע את שמו.',reading),
 make(73,'reading.vocab.newspapers','Vocabulary in context','קראתי בעיתונים שהגעת היום מאיטליה. What does עיתונים mean?','newspapers',['letters','books','tickets'],'הנהג קרא בעיתונים על בואו של דויל מאיטליה.',reading),
 make(76,'wait.past.he','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של הוא בעבר?','חיכה',['חיכתה','חיכו','יחכה'],'בטבלת לחכות, הצורה בעבר של הוא היא חיכה.',chart),
 make(76,'wait.past.she','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של היא בעבר?','חיכתה',['חיכה','חיכו','תחכה'],'בטבלת לחכות, הצורה בעבר של היא היא חיכתה.',chart),
 make(76,'wait.past.they','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של הם בעבר?','חיכו',['חיכה','מחכים','יחכו'],'בטבלת לחכות, הצורה בעבר של הם היא חיכו.',chart),
 make(76,'wait.present.he','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של הוא בהווה?','מחכה',['מחכים','חיכה','יחכה'],'בטבלת לחכות, הצורה בהווה של הוא היא מחכה.',chart),
 make(76,'wait.present.they','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של הם בהווה?','מחכים',['מחכה','חיכו','יחכו'],'בטבלת לחכות, הצורה בהווה של הם היא מחכים.',chart),
 make(76,'wait.future.i','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של אני בעתיד?','אחכה',['תחכה','יחכה','נחכה'],'בטבלת לחכות, הצורה בעתיד של אני היא אחכה.',chart),
 make(76,'wait.future.they','פעלים • printed chart','לפי טבלת לחכות: מה הצורה של הם בעתיד?','יחכו',['חיכו','מחכים','תחכו'],'בטבלת לחכות, הצורה בעתיד של הם היא יחכו.',chart)
];
for(const item of bank)if(item.options.length!==4||new Set(item.options).size!==4||!item.options.includes(item.answer))throw Error('Unit 6 option schema: '+item.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[23]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[23];if(checks.length!==3)throw Error('Unit 6 interpretation count');
const notes=[
 'במשפט הראשון שרלוק הולמס מתואר כבלש אנגלי מפורסם.',
 'הספר אומר שקונן דויל הוא הסופר שכתב את הסיפורים על שרלוק הולמס.',
 'בסוף הקריאה הנהג מגלה ששמו של דויל היה כתוב על המזוודה.'
];
checks.forEach((item,i)=>{item.sourceExercise='reading.interpretation.'+(i+1);item.explanation=notes[i];});
})();
