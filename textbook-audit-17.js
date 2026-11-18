/* אולפן עברית חלק רביעי, שיעור 36; checked against indexed PDF pages 44–55. */
(function(){'use strict';
const rows=[
 [44,'passive.a.1','משפט סביל • printed transformation','הפכו לסביל: שיפצו את הבנק. הבנק _____.','שופץ','שיפץ','משפץ','ישפץ','הבנק מקבל את פעולת השיפוץ; בעבר הסביל: שופץ.'],
 [44,'passive.a.2','משפט סביל • printed transformation','הפכו לסביל: שלחו את המסמכים בדואר. המסמכים _____ בדואר.','נשלחו','שלחו','שולחים','ישלחו','המסמכים הם הנושא הסביל ברבים; נשלחו היא צורת העבר.'],
 [44,'passive.a.3','משפט סביל • printed transformation','הפכו לסביל: מכרו את כל הדירות בבניין. כל הדירות בבניין _____.','נמכרו','מכרו','מוכרות','יימכרו','כל הדירות הן רבות; בעבר הסביל של מכרו: נמכרו.'],
 [44,'passive.a.5','משפט סביל • printed transformation','הפכו לסביל: ביצעו את העבודה. העבודה _____.','בוצעה','ביצעה','מבצעת','תבצע','העבודה היא נקבה יחידה והפעולה כבר נעשתה: בוצעה.'],
 [44,'passive.a.8','משפט סביל • printed transformation','הפכו לסביל: אישרו את התקציב בכנסת. התקציב _____ בכנסת.','אושר','אישר','מאשר','יאשר','התקציב הוא זכר יחיד; בעבר הסביל של אישרו: אושר.'],
 [44,'passive.b.1','משפט פעיל • printed transformation','הפכו לפעיל: הבית נמכר. _____ את הבית.','מכרו','נמכרו','מוכרים','יימכר','במשפט הפעיל מישהו עושה את הפעולה: מכרו את הבית.'],
 [44,'passive.b.2','משפט פעיל • printed transformation','הפכו לפעיל: הפגישה עם השר בוטלה. _____ את הפגישה עם השר.','ביטלו','בוטלה','מבוטלת','תבוטל','ביטלו הוא פועל פעיל בעבר; הפגישה היא מושא הפעולה.'],
 [47,'nifal.b.1','נפעל • printed transformation','השלימו בסביל: איפה _____ הקורס? (יפתחו את הקורס?)','ייפתח','יפתחו','נפתחו','פותח','הקורס הוא זכר יחיד; בעתיד הסביל בבניין נפעל: ייפתח.'],
 [47,'nifal.b.2','נפעל • printed transformation','השלימו בסביל: התינוקת _____ על שם סבתה. (יקראו לתינוקת על שם סבתה.)','תיקרא','תקרא','נקראה','קוראת','התינוקת היא נקבה יחידה; בעתיד הסביל: תיקרא.'],
 [47,'nifal.b.3','נפעל • printed transformation','השלימו בסביל: צריכים לשלוח את המכתב. המכתב צריך _____.','להישלח','לשלוח','נשלח','ישלח','צריך ואחריו שם פועל; בסביל של לשלוח: להישלח.'],
 [51,'nifal.a.3','נפעל • printed completion','השלימו: בית המקדש הראשון _____ ע״י שלמה המלך. (להיבנות)','נבנה','בנה','נבנית','ייבנה','בית המקדש הוא זכר יחיד; הפעולה בעבר, ולכן נבנה.'],
 [51,'nifal.a.5','נפעל • printed completion','השלימו: שכונה חדשה _____ בשנה הבאה בדרום העיר. (להיבנות)','תיבנה','נבנתה','בונה','נבנית','בשנה הבאה מציין עתיד; שכונה נקבה יחידה, ולכן תיבנה.']
];
window.HEBREW_TEXTBOOK_QUESTION_BANKS[17]=rows.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Printed transformation or completion; four choices adapted for scoring'}));
const checks=[
 [44,'passive.a.1','שיפצו את הבנק.','They renovated the bank.',['They renovated the bank.','The bank was renovated.','They will renovate the bank.','They sold the bank.'],'שיפצו הוא פעיל בעבר: מישהו עשה את השיפוץ.'],
 [49,'jonathan.reading','הנוסעים שוחררו והוחזרו במטוסי ההרקולס לישראל.','The passengers were released and returned to Israel on Hercules planes.',['The passengers were released and returned to Israel on Hercules planes.','The passengers were sent to France by ship.','The planes were returned to Uganda.','The passengers remained in the airport.'],'שוחררו והוחזרו הן צורות סבילות ברבים; לישראל מציין את יעד החזרה.'],
 [53,'jerusalem.reading','העיר נעשתה מאוחדת.','The city became united.',['The city became united.','The city was destroyed.','The city was divided again.','The city was abandoned.'],'נעשתה היא צורה סבילה בעבר לנקבה יחידה; מאוחדת מתארת את העיר.']
];
window.HEBREW_CHAPTER_INTERPRETATION[17]=checks.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
