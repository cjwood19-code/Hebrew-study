/* Scan-checked lessons 5–6 of אולפן עברית, First Part. PDF pages are one-based. */
(function(){'use strict';
const rows={
5:[
[50,'direction.dialogue.1','Direction • source dialogue','השלימו מן השיחה: אני נוסע _____ העבודה.','ל','ב','על','עם','בשיחה יוסי אומר שהוא נוסע לעבודה; ל־ מציינת יעד.'],
[51,'direction.exercise.1','Direction • printed completion','השלימו: התלמידים לומדים _____ אולפן. מחר הם נוסעים _____ טיול.','ב, ל','ל, ב','ב, ב','ל, ל','באולפן מציין מקום; לטיול מציין יעד.'],
[51,'direction.exercise.3','Direction • printed completion','השלימו: דניאל לומד _____ בית־ספר. הוא הולך _____ בית הספר ברגל.','ב, ל','ל, ב','ב, ב','ל, ל','בבית־ספר מציין מקום לימודים; לבית הספר מציין יעד הליכה.'],
[52,'question.exercise.2','Question word • printed exercise','כתבו שאלה לפי התרגיל: חנה נוסעת לתל־אביב. → _____ חנה נוסעת?','לאן','איפה','מתי','מי','תל־אביב היא יעד הנסיעה של חנה; מילת השאלה על יעד היא לאן.'],
[54,'possessive.model.1','Possessive • printed model','השלימו לפי הדוגמה: הספר של התלמיד = הספר _____.','שלו','שלה','שלי','שלנו','שלו מחליף את של התלמיד, זכר יחיד.'],
[54,'possessive.model.2','Possessive • printed model','השלימו לפי הדוגמה: הספר של רחל = הספר _____.','שלה','שלו','שלי','שלכם','שלה מחליף את של רחל, נקבה יחידה.'],
[56,'family.exercise.b1','Family • printed completion','השלימו לפי הקריאה: יעקב — ה_____ של רינה.','בעל','בן','אח','אבא','בתרגיל אחרי משפחת גולן משלימים בעל: יעקב הוא הבעל של רינה.'],
[60,'adjective.exercise.2','Adjective agreement • printed completion','השלימו: הסבא של דניאל בן 85. הוא _____ וחכם.','זקן','זקנה','זקנים','זקנות','בתרגיל הסבא בן 85; הצורה המתאימה לזכר יחיד היא זקן.']
],
6:[
[63,'infinitive.dialogue.1','Infinitive • source dialogue','השלימו מן השיחה: אני רוצה _____ מיץ תפוזים קר ולאכול עוגה.','לשתות','שותה','שתתה','שותים','גדי אומר שהוא רוצה לשתות מיץ תפוזים קר ולאכול עוגה; אחרי רוצה בא שם הפועל.'],
[64,'infinitive.table.1','Infinitive • printed table','השלימו מן הטבלה: גר → _____.','לגור','גרה','גרים','גרות','בטבלת שם הפועל הצורה של גר היא לגור.'],
[64,'infinitive.table.2','Infinitive • printed table','השלימו מן הטבלה: באה → _____.','לבוא','באה','באים','באות','בטבלת שם הפועל הצורה של באה היא לבוא.'],
[64,'infinitive.table.3','Infinitive • printed table','השלימו מן הטבלה: כותבים → _____.','לכתוב','כותב','כותבות','לומדים','בטבלה כותבים שייך לשם הפועל לכתוב.'],
[65,'infinitive.exercise.1','Infinitive • printed completion','השלימו לפי הדוגמה: הוא רוצה _____ במקצוע שלו. עכשיו הוא _____ כשומר.','לעבוד, עובד','עובד, לעבוד','לעבוד, עובדים','עובדת, עובד','אחרי רוצה בא שם הפועל לעבוד; עכשיו הוא עובד בהווה.'],
[65,'infinitive.exercise.2','Infinitive • printed completion','השלימו: אני _____ עם הפקידה. אני רוצה _____ גם עם המנהל.','מדבר, לדבר','מדבר, מדבר','לדבר, מדבר','מדברת, לדבר','הפועל בהווה הוא מדבר; אחרי רוצה בא שם הפועל לדבר.'],
[71,'student.dialogue.1','Need and ability • source dialogue','השלימו מן הדיאלוג: אני רוצה לבוא, אבל אני לא _____.','יכולה','יכול','יכולים','יכולות','דינה מדברת על עצמה בנקבה יחידה: אני לא יכולה.'],
[71,'student.dialogue.2','Need and ability • source dialogue','השלימו מן הדיאלוג: אני _____ להישאר בבית.','צריכה','צריך','צריכים','צריכות','דינה אומרת אני צריכה להישאר בבית, בנקבה יחידה.']
]};
for(const [level,items] of Object.entries(rows))window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]=items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Textbook exercise or source model with adapted choices'}));
const checks={
5:[
[50,'direction.dialogue','אני נוסע לעבודה.','I am traveling to work.',['I am traveling to work.','I am working at home.','I am traveling with my family.','I am at work.'],'לעבודה מציין יעד: to work.'],
[56,'family.reading','יעקב בן 36. הוא רופא.','Yaakov is 36. He is a doctor.',['Yaakov is 36. He is a doctor.','Yaakov is 36. He is a teacher.','Yaakov is 32. He is a doctor.','Yaakov has 36 children.'],'בקריאה על משפחת גולן יעקב בן 36 ורופא.'],
[58,'weekend.reading','בסוף השבוע הם נוסעים למשפחות שלהם.','On the weekend they travel to their families.',['On the weekend they travel to their families.','On the weekend they study at the university.','Their families travel to Jerusalem every day.','They work with their families on the weekend.'],'בקטע מיכאל, דינה ושרה נוסעים בסוף השבוע למשפחות שלהם.']
],
6:[
[63,'infinitive.dialogue','אני רוצה לשתות מיץ תפוזים קר ולאכול עוגה.','I want to drink cold orange juice and eat cake.',['I want to drink cold orange juice and eat cake.','I want to drink coffee and eat cake.','I drink cold juice every morning.','I want to buy orange juice and cake.'],'גדי אומר שהוא רוצה לשתות מיץ תפוזים קר ולאכול עוגה.'],
[67,'jerusalem.reading','ירושלים, הבירה של ישראל.','Jerusalem, the capital of Israel.',['Jerusalem, the capital of Israel.','Jerusalem, a city near Israel.','Israel, the capital of Jerusalem.','Jerusalem, a city in Egypt.'],'בפתיחת הקריאה ירושלים מוצגת כבירה של ישראל.'],
[71,'student.dialogue','אני צריכה להישאר בבית.','I need to stay at home.',['I need to stay at home.','I want to travel home.','I can study at home.','I need to leave home.'],'בדיאלוג דינה אומרת שהיא צריכה להישאר בבית.']
]};
for(const [level,items] of Object.entries(checks))window.HEBREW_CHAPTER_INTERPRETATION[level]=items.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
