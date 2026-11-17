/* Scan-checked אולפן עברית First Part lessons 7–8; one-based PDF page indices. */
(function(){'use strict';
const rows={
7:[
[76,'verb.exercise.1','Present verb • printed completion','השלימו: היא לא _____ בשבת מפני שהיא דתייה. (נוסע)','נוסעת','נוסע','נוסעים','נוסעות','היא נקבה יחידה; לכן נוסעת.'],
[76,'verb.exercise.2','Present verb • printed completion','השלימו: הדתיים _____ בבית הכנסת כל יום. (מתפלל)','מתפללים','מתפללות','מתפלל','מתפללת','הדתיים הוא רבים זכר; הצורה היא מתפללים.'],
[76,'verb.exercise.5','Present verb • printed completion','השלימו: הם תמיד _____ ביום הכיפורים. (צם)','צמים','צמות','צם','צמה','הם מציין רבים זכר; לכן צמים.'],
[76,'verb.exercise.8','Present verb • printed completion','השלימו: חנה _____ בדרך כלל קפה בבוקר. (שותה)','שותה','שותים','שותות','לשתות','חנה היא נקבה יחידה; בטבלה הצורה שותה.'],
[78,'number.table.2','Number agreement • printed table','השלימו מן הטבלה: _____ ספרים. (2)','שני','שתי','שניים','שתיים','לפני שם עצם זכר רבים ספרים משתמשים בשני.'],
[78,'number.table.3','Number agreement • printed table','השלימו מן הטבלה: _____ דירות. (3)','שלוש','שלושה','שלושים','שלישי','דירות הוא נקבה רבות; בטבלה שלוש דירות.'],
[79,'number.exercise.1','Number agreement • printed completion','השלימו: בכיתה לומדים _____ (8) תלמידים ו_____ (9) תלמידות.','שמונה, תשע','שמונָה, תשעה','תשע, שמונה','שמונה, תשעה','בתרגיל שמונה תלמידים ותשע תלמידות.'],
[79,'number.exercise.7','Number agreement • printed completion','השלימו: למשפחת גולן יש דירה גדולה. בדירה יש _____ (5) חדרים ו_____ (2) מרפסות.','חמישה, שתי','חמש, שני','חמישה, שני','חמש, שתי','חדרים הוא זכר, מרפסות נקבה: חמישה חדרים ושתי מרפסות.']
],
8:[
[84,'possession.table.1','Possession • source table','השלימו לפי הטבלה: אני → _____ זמן.','יש לי','יש לו','יש לה','יש לנו','אני מתאים ליש לי בטבלת השייכות.'],
[84,'possession.dialogue.1','Possession • source dialogue','השלימו מן השיחה: אימא, יש _____ זמן?','לך','לי','לו','לה','רוני פונה לאימא בגוף שני נקבה: יש לך זמן?'],
[85,'possession.exercise.1','Possession • printed completion','השלימו: הם גרים בדירה קטנה. אין _____ בית גדול.','להם','להן','לנו','לו','הם הוא רבים זכר; אין להם בית גדול.'],
[85,'possession.exercise.3','Possession • printed completion','השלימו: _____ דני יש הרבה חברים. יש _____ הרבה חברים.','ל, לו','לו, ל','ל, לה','להם, לו','ל + שם פרטי: לדני; הכינוי המתאים לדני הוא לו.'],
[85,'possession.exercise.7','Possession • printed completion','השלימו: דניאל עסוק. אין _____ זמן.','לו','לה','לי','להם','דניאל הוא זכר יחיד; אין לו זמן.'],
[87,'verb.table.1','Present verb • printed table','השלימו מן הטבלה: יוצא → _____.','לצאת','לשבת','לישון','ללכת','בטבלת שם הפועל יוצא מתאים ללצאת.'],
[87,'verb.table.2','Present verb • printed table','השלימו מן הטבלה: שולחת → _____.','לשלוח','ללמוד','לחזור','לקום','בטבלת שם הפועל שולחת מתאים ללשלוח.'],
[88,'verb.exercise.3','Present verb • printed completion','השלימו: יוסף צריך _____ מחיפה מחר. (חוזר)','לחזור','חוזר','חוזרת','חוזרים','אחרי צריך בא שם הפועל לחזור.']
]};
for(const [level,items] of Object.entries(rows))window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]=items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Textbook exercise or source model with adapted choices'}));
const checks={
7:[
[73,'note.sarah','אני צריכה ללכת לבית הספר לדבר עם המורה של דן.','I need to go to school to speak with Dan’s teacher.',['I need to go to school to speak with Dan’s teacher.','Dan needs to go to school with his teacher.','I need to speak with Dan at home.','I am going to the school party.'],'בפתק שרה כותבת שהיא צריכה לדבר עם המורה של דן.'],
[75,'tradition.reading','הוא אף פעם לא אוכל לחם.','He never eats bread.',['He never eats bread.','He always eats bread.','He sometimes buys bread.','He never drinks wine.'],'אף פעם לא מציין never; לחם הוא bread.'],
[78,'apartment.dialogue','יש שני שירותים ואמבטיה אחת.','There are two toilets and one bathtub.',['There are two toilets and one bathtub.','There is one toilet and two bathtubs.','There are two rooms and one bathroom.','There are three toilets.'],'בדיאלוג על הדירה שני מציין שני שירותים ואחת אמבטיה.']
],
8:[
[81,'myth.reading','לספינקס המצרי אין כנפיים.','The Egyptian sphinx has no wings.',['The Egyptian sphinx has no wings.','The Egyptian sphinx has wings.','The Greek sphinx has no wings.','The Egyptian sphinx has no head.'],'אין כנפיים מציין היעדר כנפיים.'],
[84,'possession.dialogue','אין לי זמן עכשיו.','I do not have time now.',['I do not have time now.','I have time now.','She does not have time tomorrow.','I have no computer now.'],'אימא אומרת אין לי זמן עכשיו; אין לי מבטא חוסר.'],
[86,'notice.1','אני לא יכול להגיע היום.','I cannot come today.',['I cannot come today.','I can come today.','I cannot come tomorrow.','I am leaving today.'],'בפתק של שלומי לא יכול להגיע היום מציין שאינו יכול לבוא היום.']
]};
for(const [level,items] of Object.entries(checks))window.HEBREW_CHAPTER_INTERPRETATION[level]=items.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
