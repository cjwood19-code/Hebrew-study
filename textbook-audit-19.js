/* ללמוד עברית ברמה ב׳, unit 2. Checked against indexed PDF pages 24–34. */
(function(){'use strict';
const old=window.HEBREW_TEXTBOOK_QUESTION_BANKS[19];
const singular=['שולחן','מקום','חלון','רחוב','ארון','שנה','עיר','אבן','אישה','מילה','עין','יד','שן','רגל'];
const pluralIds=['masculine.1','masculine.2','masculine.3','masculine.7','masculine.9','feminine.2','feminine.3','feminine.5','feminine.9','feminine.8','feminine.12','feminine.14','feminine.11','feminine.13'];
const plurals=old.filter(q=>q.category==='Plural nouns');
if(plurals.length!==singular.length)throw Error('Unit 2 plural source changed');
const bank=plurals.map((q,i)=>({sourcePage:28,sourceExercise:'plurals.'+pluralIds[i],category:'רבים • printed transformation',prompt:'כתבו את צורת הרבים: '+singular[i],answer:q.answer,options:q.options,explanation:q.explanation,practiceOrigin:'Printed plural exercise; answer choices adapted for scoring'}));
const rows=[
 [29,'past.story.1','עבר • printed story completion','סבא של דני גר בירושלים. הוא _____ לדני: ״כשאני הייתי ילד...״ (מספר)','סיפר','מספר','סיפרו','סיפרנו','הסיפור מתאר את העבר של הסבא; הוא סיפר לדני.'],
 [29,'past.story.2','עבר • printed story completion','ביום שישי כולנו קמנו מוקדם, _____ את הבית לקראת שבת. (מסדר)','סידרנו','סידרו','סידרתי','מסדרים','כולנו מציין אנחנו; בעבר של לסדר הצורה היא סידרנו.'],
 [29,'past.story.3','עבר • printed story completion','אמא _____ מאכלים מיוחדים לשבת. (מבשל)','בישלה','בישלו','בישלנו','מבשלת','אמא היא נקבה יחידה; בעבר של לבשל הצורה היא בישלה.'],
 [29,'past.story.4','עבר • printed story completion','אחרי הצהריים אנחנו התרחצנו ו_____ יפה. (מתלבש)','התלבשנו','התלבשו','התלבשתי','מתלבשים','אנחנו דורש סיומת ־נו בעבר: התלבשנו.'],
 [29,'past.story.5','עבר • printed story completion','אחרי ארוחת הערב _____ במשחקים שונים. (משחק)','שיחקנו','שיחקו','שיחקתי','משחקים','הסבא מספר מה עשו בני המשפחה יחד; בעבר של שיחק עם אנחנו: שיחקנו.'],
 [29,'past.story.6','עבר • printed story completion','בשבת בבוקר _____ בהרים. (מטייל)','טיילנו','טיילו','טיילתי','מטיילים','הדובר מתאר את המשפחה בלשון אנחנו; לכן טיילנו בהרים.'],
 [34,'preposition.b.2.1','מילת היחס ב־ • printed completion','יש לנו שתי מכוניות, ואבא שלי מרשה לי לנהוג _____.','בהן','בו','בה','בנו','שתי מכוניות הן נקבה רבות; ב־ עם כינוי הנקבה רבות הוא בהן.'],
 [34,'preposition.b.2.2','מילת היחס ב־ • printed completion','הילד אמר לאמו: ״לא אני שברתי את הצלחת. מדוע את מסתכלת _____ כך?״','בי','בו','בה','בנו','הילד שואל מדוע האם מסתכלת בו עצמו; אחרי ב־ עם אני אומרים בי.'],
 [34,'preposition.table.m','מילת היחס ב־ • printed form table','לפי הטבלה: ב־ + הוא = _____.','בו','בה','בי','בהן','בטבלת מילת היחס ב־ הצורה לזכר יחיד היא בו.'],
 [34,'preposition.table.f','מילת היחס ב־ • printed form table','לפי הטבלה: ב־ + היא = _____.','בה','בו','בנו','בהן','בטבלת מילת היחס ב־ הצורה לנקבה יחידה היא בה.']
];
for(const [sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation] of rows)bank.push({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:sourceExercise.includes('table')?'Printed grammar table; answer choices adapted':'Printed completion; answer choices adapted'});
window.HEBREW_TEXTBOOK_QUESTION_BANKS[19]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[19];
for(let i=0;i<checks.length;i++){
 checks[i].sourceExercise='stones.reading.'+(i+1);
 checks[i].explanation=[
  'תייר אחד ביקר בירושלים says one tourist visited Jerusalem.',
  'הסתכל מסביב means looked around; אבנים על ההרים ואבנים בדרכים names stones on hills and roads.',
  'כאשר חזר אל העיר means when he returned to the city; פנה אל זקן אחד ושאל אותו means he turned to an elder and asked him.'
 ][i];
}
})();
