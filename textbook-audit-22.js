/* ללמוד עברית ברמה ב׳ unit 5. Scanned PDF pages 61, 63, 65, 72. */
(function(){'use strict';
const q=(sourcePage,sourceExercise,category,prompt,answer,others,explanation,practiceOrigin)=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,...others],explanation,practiceOrigin});
const story='Supplemental vocabulary from the unit 5 reading; choices adapted for scoring';
const printed='Printed exercise or chart; answer choices adapted for scoring';
const bank=[
 q(61,'reading.vocab.clinic','Vocabulary in context','הלכתי לקופת חולים כדי לקבל תוצאות של בדיקת דם. What is קופת חולים?','health clinic',['post office','school','market'],'המספר הולך לקופת חולים כדי לקבל תוצאות של בדיקת דם.',story),
 q(61,'reading.vocab.waiting-room','Vocabulary in context','בחדר ההמתנה ישבו כבר עשרה אנשים וחיכו בתור. What is חדר ההמתנה?','waiting room',['operating room','classroom','kitchen'],'בחדר ההמתנה אנשים מחכים לתור שלהם.',story),
 q(61,'reading.vocab.results','Vocabulary in context','כדי לקבל תוצאות של בדיקת דם. What does תוצאות mean?','results',['tickets','appointments','letters'],'תוצאות הן מה שמקבלים אחרי בדיקת הדם.',story),
 q(61,'reading.vocab.silent','Vocabulary in context','לי יש באמת מחלה רצינית — ואני שותקת. What does שותקת mean?','I am silent',['I am singing','I am walking','I am writing'],'האישה אומרת שהיא שותקת ואינה מספרת על מחלתה.',story),
 q(61,'reading.vocab.heart','Vocabulary in context','אני חולה במחלת לב קשה. What is מחלת לב?','heart disease',['stomachache','flu','toothache'],'מחלת לב היא המחלה שהאישה הזקנה טוענת שיש לה.',story),
 q(63,'definite.construct.waiting-room','שם עצם וסמיכות • printed exercise','הוסיפו ה׳ הידיעה לצירוף מן התרגיל: חדר המתנה','חדר ההמתנה',['החדר המתנה','החדר ההמתנה','חדר מתנה'],'בסמיכות מיידעים את שם העצם השני: חדר ההמתנה.',printed),
 q(63,'definite.construct.heart','שם עצם וסמיכות • printed exercise','הוסיפו ה׳ הידיעה לצירוף מן התרגיל: מחלת לב','מחלת הלב',['המחלת לב','המחלת הלב','מחלה הלב'],'בסמיכות מחלת נשארת לפני לב, וה׳ הידיעה באה בשם השני: מחלת הלב.',printed),
 q(63,'definite.construct.patient-talk','שם עצם וסמיכות • printed exercise','הוסיפו ה׳ הידיעה לצירוף מן התרגיל: שיחת חולים','שיחת החולים',['השיחת חולים','שיחה החולים','שיחת חולים'],'בסמיכות ה׳ הידיעה נוספת לשם העצם השני: שיחת החולים.',printed),
 q(63,'definite.adjective.interesting','שם ותואר • printed exercise','הוסיפו ה׳ הידיעה לצירוף מן התרגיל: שיחה מעניינת','השיחה המעניינת',['השיחה מעניינת','שיחה המעניינת','השיחת מעניינת'],'בשם ותואר מיודעים את שניהם: השיחה המעניינת.',printed),
 q(65,'future.tell.i','עתיד • printed verb chart','בטבלת לספר, מה הצורה של אני בעתיד?','אספר',['תספר','יספר','נספר'],'בטבלת העתיד של לספר, אני = אספר.',printed),
 q(65,'future.tell.he','עתיד • printed verb chart','בטבלת לספר, מה הצורה של הוא בעתיד?','יספר',['אספר','תספר','נספר'],'בטבלת העתיד של לספר, הוא = יספר.',printed),
 q(65,'future.tell.she','עתיד • printed verb chart','בטבלת לספר, מה הצורה של היא בעתיד?','תספר',['יספר','אספר','נספר'],'בטבלת העתיד של לספר, היא = תספר.',printed),
 q(65,'future.tell.we','עתיד • printed verb chart','בטבלת לספר, מה הצורה של אנחנו בעתיד?','נספר',['אספר','יספרו','תספרו'],'בטבלת העתיד של לספר, אנחנו = נספר.',printed),
 q(65,'future.tell.they','עתיד • printed verb chart','בטבלת לספר, מה הצורה של הם בעתיד?','יספרו',['נספר','תספרו','יספר'],'בטבלת העתיד של לספר, הם = יספרו.',printed),
 q(72,'for.students','מילת יחס • printed fill-in','המורה מכינה תרגילים ___ התלמידות שלה.','בשביל',['אצלי','אצלה','אצלנו'],'בשביל מציין למען מי המורה מכינה את התרגילים: בשביל התלמידות שלה.',printed),
 q(72,'for.juliet','מילת יחס • printed fill-in','רומיאו אמר ליוליה: אני מוכן לעשות ___ הכול.','בשבילך',['בשבילי','בשבילו','בשבילם'],'רומיאו פונה ליוליה, לכן הוא אומר בשבילך.',printed),
 q(72,'for.romeo','מילת יחס • printed fill-in','ענתה לו יוליה: אני מוכנה גם למות ___.','בשבילך',['בשבילי','בשבילנו','בשבילה'],'יוליה פונה לרומיאו, ולכן גם בתשובתה הצורה היא בשבילך.',printed)
];
for(const item of bank)if(item.options.length!==4||new Set(item.options).size!==4||!item.options.includes(item.answer))throw Error('Unit 5 invalid options: '+item.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[22]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[22];if(checks.length!==3)throw Error('Unit 5 interpretation count');
const notes=[
 'כדי לקבל תוצאות של בדיקת דם מסביר מדוע המספר הלך לקופת חולים.',
 'בחדר ההמתנה ישבו עשרה אנשים וחיכו בתור; זהו מקום ההמתנה במרפאה.',
 'אחרי דברי האישה הזקנה, האנשים הפסיקו לדבר על מחלות.'
];
checks.forEach((item,i)=>{item.sourceExercise='reading.interpretation.'+(i+1);item.explanation=notes[i];});
})();
