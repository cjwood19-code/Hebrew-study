/* אולפן עברית חלק רביעי, lessons 34–35; checked against PDF pages 32–43. */
(function(){'use strict';
const rows={
15:[
[32,'passive.table.1','פועל • source table','השלימו מן הטבלה: הוא מטפל → הוא _____.','מטופל','מטופלת','מטופלים','טופל','מטופל הוא סביל בהווה, זכר יחיד.'],
[32,'passive.table.2','פועל • source table','השלימו מן הטבלה: היא טיפלה → היא _____.','טופלה','טופל','מטופלת','תטופל','טופלה היא צורת עבר סביל לנקבה יחידה.'],
[32,'passive.table.3','פועל • source table','השלימו מן הטבלה: הם יטפלו → הם _____.','יטופלו','טופלו','מטופלים','יטופל','יטופלו היא צורת עתיד סביל לרבים.'],
[33,'st-louis.verb.1','פועל • printed completion','השלימו: השלטון בקובה _____ (לבטל) את אשרות הכניסה.','ביטל','בוטל','מבטל','יבוטל','הנושא הוא השלטון שעשה את הפעולה; לכן הצורה הפעילה היא ביטל.'],
[33,'st-louis.verb.2','פועל • printed completion','השלימו: השלטון בקובה ביטל את אשרות הכניסה ולא _____ (לאשר) את כניסת היהודים למדינה.','אישר','אושרה','אישרה','מאשר','הנושא הוא השלטון, זכר יחיד; בפועל הפעיל בעבר: אישר.'],
[33,'st-louis.verb.3','פועל • printed completion','השלימו: אנגליה, צרפת, בלגיה והולנד _____ (לקלוט) את היהודים.','קלטו','נקלטו','קלטה','יקלטו','ארבע המדינות הן נושא ברבים; בפועל הפעיל בעבר: קלטו.'],
[34,'past.passive.1','פועל • printed transformation','השלימו: הממשלה אישרה את התקציב. התקציב _____.','אושר','אישר','מאושר','יאושר','התקציב זכר יחיד; סביל בעבר של אישר הוא אושר.'],
[34,'past.passive.2','פועל • printed transformation','השלימו: הרופאה טיפלה בחולים. החולים _____.','טופלו','טיפלו','מטופלים','יטופלו','החולים רבים, ולכן בעבר הסביל טופלו.'],
[34,'future.passive.1','פועל • printed transformation','השלימו: הטיול בוטל. בעתיד: הטיול _____.','יבוטל','בוטל','מבוטל','תבוטל','הטיול זכר יחיד; בעתיד הסביל יבוטל.'],
[34,'future.passive.2','פועל • printed transformation','השלימו: הבחינה בוטלה. בעתיד: הבחינה _____.','תבוטל','יבוטל','בוטלה','מבוטלת','הבחינה נקבה יחידה; בעתיד הסביל תבוטל.'],
[36,'contrast.exercise.1','לעומת • printed completion','השלימו: ישראל ענייה במים, _____ אירופה עשירה מאוד במים.','ואילו','בגלל','לכן','כדי','ואילו מציג ניגוד בין ישראל לאירופה.'],
[36,'contrast.exercise.2','לעומת • printed completion','השלימו: הוא גר בדירה קטנה, _____ הם גרים בבית גדול.','ואילו','מפני','כדי','גם','ואילו מחבר שני מצבים מנוגדים.']
],
16:[
[40,'hofal.table.1','הופעל • source table','השלימו מן הטבלה: דן מוזמן → רחל _____.','מוזמנת','מוזמן','מזמינה','הוזמנה','מוזמנת היא צורת הווה סביל לנקבה יחידה.'],
[40,'hofal.table.2','הופעל • source table','השלימו מן הטבלה: הוא הזמין → הוא _____.','הוזמן','מוזמן','יוזמן','הזמין','הוזמן היא צורת עבר סביל לזכר יחיד.'],
[40,'hofal.table.3','הופעל • source table','השלימו מן הטבלה: הוא יזמין → הוא _____.','יוזמן','מוזמן','הוזמן','יזמין','יוזמן היא צורת עתיד סביל לזכר יחיד.'],
[40,'present.passive.1','הופעל • printed transformation','השלימו: הטלוויזיה משפיעה על הילדים. הילדים _____.','מושפעים','משפיעים','הושפעו','יושפעו','הילדים רבים; בהווה סביל של להשפיע: מושפעים.'],
[40,'present.passive.2','הופעל • printed transformation','השלימו: המורה מסביר את התרגיל. התרגיל _____.','מוסבר','מסביר','הוסבר','יוסבר','התרגיל זכר יחיד; בהווה סביל של להסביר: מוסבר.'],
[40,'past.passive.1','הופעל • printed transformation','השלימו: יוסי לא הזמין את רחל למסיבה. רחל לא _____.','הוזמנה','הוזמן','מוזמנת','תוזמן','רחל נקבה יחידה; העבר הסביל הוא הוזמנה.'],
[40,'past.passive.2','הופעל • printed transformation','השלימו: רחל הפקידה את הכסף בבנק. הכסף _____.','הופקד','הפקיד','מופקד','יופקד','הכסף זכר יחיד; העבר הסביל של הפקידה הוא הופקד.'],
[40,'future.passive.1','הופעל • printed transformation','השלימו: אדליק נרות לכבוד שבת. הנרות _____.','יודלקו','הודלקו','מודלקים','ידליקו','הנרות רבים; עתיד סביל של להדליק הוא יודלקו.'],
[41,'housewarming.verb.1','הופעל • printed completion','השלימו לפי השיחה: הסופר _____ זמן רב בכתיבת ספרו.','השקיע','הושקע','משקיע','יושקע','התרגיל מציב את הסופר כעושה הפעולה בעבר: השקיע.'],
[41,'housewarming.verb.2','הופעל • printed completion','השלימו לפי השיחה: לפני שנה _____ את דירתנו.','שיפצנו','שופצה','משופצת','נשפץ','הדוברים מדברים על פעולה שעשו לפני שנה: שיפצנו.']
]};
for(const [level,items] of Object.entries(rows))window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]=items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Textbook exercise or source table with adapted choices'}));
const checks={
15:[
[32,'passive.table','היא מטופלת.','She is being treated.',['She is being treated.','She treated him.','She will treat them.','He was treated.'],'מטופלת היא הווה סביל לנקבה יחידה.'],
[33,'st-louis.reading','ארצות הברית וקנדה סירבו לתת ליהודים מקלט.','The United States and Canada refused to give the Jews refuge.',['The United States and Canada refused to give the Jews refuge.','The United States and Canada offered the Jews refuge.','Germany and Cuba welcomed the ship.','The Jews refused to travel.'],'סירבו פירושו refused; לתת מקלט הוא to give refuge.'],
[36,'contrast.exercise','ישראל ענייה במים, לעומת זאת אירופה עשירה מאוד במים.','Israel has little water; by contrast, Europe has abundant water.',['Israel has little water; by contrast, Europe has abundant water.','Israel and Europe both have abundant water.','Europe has less water than Israel.','Israel sells water to Europe.'],'לעומת זאת מציג ניגוד; ענייה במים לעומת עשירה במים.']
],
16:[
[40,'hofal.table','היא מוזמנת.','She is invited.',['She is invited.','She invites.','She was invited.','He is invited.'],'מוזמנת היא סביל בהווה לנקבה יחידה.'],
[41,'housewarming.dialogue','יש לנו חדשות טובות! חתמנו אתמול על החוזה, קנינו את הדירה שרצינו...','We have good news! Yesterday we signed the contract and bought the apartment we wanted.',['We have good news! Yesterday we signed the contract and bought the apartment we wanted.','Tomorrow we will rent an apartment.','We sold the apartment we wanted.','We signed a contract for a new job.'],'חתמנו וקנינו הן צורות עבר של אנחנו.'],
[42,'invitation.notice','נשמח לארחכם בין אורחינו!','We will be happy to host you among our guests!',['We will be happy to host you among our guests!','We are unable to invite guests.','Please find a new apartment.','Our guests have left.'],'נשמח הוא עתיד של לשמוח; לארחכם פירושו to host you.']
]};
for(const [level,items] of Object.entries(checks))window.HEBREW_CHAPTER_INTERPRETATION[level]=items.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
