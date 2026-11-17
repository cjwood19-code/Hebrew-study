/* אולפן עברית Fourth Part lessons 30–31, checked against PDF pages 1–18. */
(function(){'use strict';
const rows={
11:[
[2,'possession.exercise.1','בעל / חסר • printed transformation','כתבו לפי הדוגמה: הם בעלי מפעל בצפון.','יש להם מפעל בצפון.','אין להם מפעל בצפון.','יש לה מפעל בצפון.','יש לנו מפעל בצפון.','בעלי מציין שיש להם מפעל; הם מתאים ל־להם.'],
[2,'possession.exercise.3','בעל / חסר • printed transformation','כתבו לפי הדוגמה: הן חסרות סבלנות.','אין להן סבלנות.','יש להן סבלנות.','אין להם סבלנות.','יש לנו סבלנות.','חסרות מציין היעדר; הן מתאים ל־להן.'],
[2,'possession.exercise.9','בעל / חסר • printed transformation','כתבו לפי הדוגמה: הם חסרי ידע במחשבים.','אין להם ידע במחשבים.','יש להם ידע במחשבים.','אין להן ידע במחשבים.','אין לי ידע במחשבים.','חסרי פירושו שאין להם את הידע.'],
[4,'obligation.exercise.1','חייב / זקוק • printed completion','השלימו: היא חולה. היא _____ לקבל תרופות.','זקוקה','זקוק','חייבים','זקוקים','היא נקבה יחידה; זקוקה ל־ מציין צורך.'],
[4,'obligation.exercise.3','חייב / זקוק • printed completion','השלימו: היא חולה. היא _____ לאנטיביוטיקה.','זקוקה','זקוק','זקוקים','חייב','היא זקוקה לאנטיביוטיקה, לפי התרגיל; נקבה יחידה דורשת זקוקה.'],
[4,'obligation.exercise.7','חייב / זקוק • printed completion','השלימו: יש לו כאב שיניים. הוא _____ ללכת לרופא שיניים.','חייב','חייבת','חייבים','זקוקה','הוא זכר יחיד; חייב ללכת לרופא שיניים.'],
[7,'reflexive.exercise.1','מילת היחס • printed completion','השלימו: הוא יצליח בחיים מפני שהוא בטוח _____.','בעצמו','בעצמה','בעצמי','בעצמנו','הוא מתאים ל־עצמו, ואחרי בטוח באה ב־: בעצמו.'],
[7,'reflexive.exercise.3','מילת היחס • printed completion','השלימו: היא לא רק דואגת למשפחתה, אלא גם _____.','לעצמה','לעצמו','לעצמי','בעצמה','דואגת ל־; היא נקבה יחידה, לכן לעצמה.'],
[7,'reflexive.exercise.8','מילת היחס • printed completion','השלימו: את לא צריכה לאהוב רק אחרים, את צריכה לאהוב גם _____.','את עצמך','את עצמי','את עצמו','את עצמה','לאהוב את־; לנוכחת נקבה יחידה מתאים את עצמך.']
],
12:[
[8,'future.table.1','Future tense • printed table','השלימו מן הטבלה: ללכת, אני _____.','אלך','ילך','תלך','נלך','בטבלת העתיד ללכת בגוף אני הוא אלך.'],
[8,'future.table.2','Future tense • printed table','השלימו מן הטבלה: ללכת, אנחנו _____.','נלך','אלך','ילך','תלכי','בטבלת העתיד אנחנו מקבל נ־: נלך.'],
[8,'future.table.3','Future tense • printed table','השלימו מן הטבלה: לדעת, אתה _____.','תדע','אדע','ידע','נדע','בטבלת העתיד אתה מתאים לתדע.'],
[9,'future.table.1','Future tense • printed table','השלימו מן הטבלה: לאכול, היא _____.','תאכל','יאכל','אוכל','נאכל','בטבלת העתיד היא מתאימה לתאכל.'],
[9,'future.table.2','Future tense • printed table','השלימו מן הטבלה: לנסוע, הם _____.','ייסעו','ניסע','תיסע','אסע','בטבלת העתיד הם מתאימים לייסעו.'],
[9,'future.table.3','Future tense • printed table','השלימו מן הטבלה: ליפול, הוא _____.','ייפול','תיפול','אפול','ניפול','בטבלת העתיד הוא מתאים לייפול.'],
[10,'future.table.1','Future tense • printed table','השלימו מן הטבלה: לקנות, היא _____.','תקנה','יקנה','אקנה','נקנה','בטבלת העתיד היא מתאימה לתקנה.'],
[10,'future.table.2','Future tense • printed table','השלימו מן הטבלה: לעשות, אנחנו _____.','נעשה','אעשה','יעשה','תעשי','בטבלת העתיד אנחנו מתאימים לנעשה.'],
[14,'keday.exercise.1','כדאי • printed completion','השלימו: רותי, כבר מאוחר, כדאי ש_____ לישון אצלנו. (להישאר)','תישארי','תישאר','אשאר','נישאר','כדאי ש־ מקבל פועל עתיד; רותי היא נוכחת נקבה, לכן תישארי.'],
[14,'keday.exercise.3','כדאי • printed completion','השלימו: יוסי, כדאי שהרופא _____ אותך. (לבדוק)','יבדוק','תבדוק','אבדוק','נבדוק','הרופא הוא זכר יחיד; כדאי שיבדוק אותך.']
]};
for(const [level,items] of Object.entries(rows))window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]=items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Textbook exercise or source model with adapted choices'}));
const checks={
11:[
[1,'job.reading','מיכאל מצא הרבה מודעות, אבל רק במודעה אחת הוא מצא את מה שהוא חיפש.','Michael found many ads, but only one had what he sought.',['Michael found many ads, but only one had what he sought.','Michael found no job ads.','Michael wrote one ad for a manager.','Michael found a job in every ad.'],'בקטע חיפוש עבודה, אבל רק במודעה אחת מגביל את התוצאה למודעה אחת.'],
[4,'mirina.reading','היא מחפשת עבודה במשרה חלקית מפני שהיא עדיין לומדת באולפן.','She seeks part-time work because she still studies at ulpan.',['She seeks part-time work because she still studies at ulpan.','She already works full time at an ulpan.','She stopped studying to find work.','She studies part time because she is ill.'],'בקטע על מרינה, משרה חלקית היא part-time position; מפני שהיא עדיין לומדת מסביר למה.'],
[5,'miri.dialogue','אני מסתדרת מצוין. אני עובדת...','I am managing very well. I am working...',['I am managing very well. I am working...','I quit my job yesterday.','I am not managing at work.','I need to find another job.'],'מרי עונה לארז שהיא מסתדרת מצוין בעבודה.']
],
12:[
[10,'omelet.dialogue','אני אגיע בעוד כ-20 דקות.','I will arrive in about twenty minutes.',['I will arrive in about twenty minutes.','I arrived twenty minutes ago.','I will leave in two minutes.','I am waiting for twenty hours.'],'בדיאלוג העתיד אגיע מציין I will arrive; בעוד כ־20 דקות הוא in about twenty minutes.'],
[11,'omelet.dialogue','אני מציע שאקנה שתי עוגות מוכנות.','I suggest that I buy two ready-made cakes.',['I suggest that I buy two ready-made cakes.','I suggest that we buy two cakes.','I made two cakes yesterday.','I suggest that you prepare two cakes.'],'ש־אקנה הוא I should buy; שתי הוא two לנקבה.'],
[15,'future.fable','באחרית הימים יהיה צדק בעולם.','In the end of days there will be justice in the world.',['In the end of days there will be justice in the world.','There was justice in the world yesterday.','There will be war in the world.','There is no justice in the world.'],'בקטע חזון אחרית הימים, יהיה הוא עתיד של להיות.']
]};
for(const [level,items] of Object.entries(checks))window.HEBREW_CHAPTER_INTERPRETATION[level]=items.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
