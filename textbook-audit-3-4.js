/* Source audit of אולפן עברית First Part lessons 3–4; one-based PDF page indices. */
(function(){'use strict';
const rows={
3:[
[31,'noun.chart.1','Noun number • chart','מהי צורת הרבים של סֵפֶר?','ספרים','ספרות','ספריות','ספריים','בטבלת שם עצם סֵפֶר הוא יחיד וסְפָרִים הוא רבים.'],
[31,'noun.chart.2','Noun number • chart','מהי צורת הרבות של תְּמוּנָה?','תמונות','תמונים','תמונית','תמונאים','בטבלת שם עצם תְּמוּנָה נעשית תְּמוּנוֹת.'],
[31,'noun.exercise.1','Noun number • printed exercise','השלימו: שאלה ← _____.','שאלות','שאלים','שואלים','שאלהים','הסיומת ות היא צורת הרבות של שאלה.'],
[31,'noun.exercise.2','Noun number • printed exercise','השלימו: רחוב ← _____.','רחובות','רחובים','רחוביות','רחובה','בתרגיל שם העצם רחוב נעשה רחובות.'],
[32,'adjective.example.1','Adjective agreement • model','השלימו לפי הדוגמה: זה ספר טוב ← אלה _____.','ספרים טובים','ספרים טובות','ספר טובים','ספרות טובים','ספרים הוא רבים זכר, ולכן גם שם התואר טובים.'],
[32,'adjective.example.2','Adjective agreement • model','השלימו לפי הדוגמה: זאת תמונה טובה ← אלה _____.','תמונות טובות','תמונות טובים','תמונים טובות','תמונה טובות','תמונות הוא רבות נקבה, ולכן גם שם התואר טובות.'],
[32,'adjective.exercise.1','Adjective agreement • printed exercise','השלימו: כיתה גדולה ← כיתות _____.','גדולות','גדולים','גדולה','גדול','כיתות הוא רבות נקבה, ולכן שם התואר גדולות.'],
[34,'verb.table.1','Present verb • printed completion','השלימו: דן _____ סיפור נחמד. (קורא)','קורא','קוראת','קוראים','קוראות','דן הוא זכר יחיד; בטבלה הצורה קורא.'],
[34,'verb.table.2','Present verb • printed completion','השלימו: רחל _____ ספר על דוד בן־גוריון. (כותב)','כותבת','כותב','כותבים','כותבות','רחל היא נקבה יחידה; בטבלה הצורה כותבת.'],
[34,'verb.table.3','Present verb • printed completion','השלימו: הן _____ תשובות במחברת. (כותב)','כותבות','כותבים','כותבת','כותב','הן הוא רבות נקבה; לכן כותבות.'],
[34,'verb.table.4','Present verb • printed completion','השלימו: הם _____ ספרים בספרייה. (קורא)','קוראים','קוראות','קורא','קוראת','הם הוא רבים זכר; לכן קוראים.'],
[35,'profession.story.1','Profession • source sentence','מהו המקצוע במשפט ״דן פקיד״?','פקיד','רופא','סופר','מורה','פתיחת הטקסט אומרת במפורש: דן פקיד.'],
[35,'profession.story.2','Profession • source sentence','השלימו מן הטקסט: רבקה לוין _____ מפורסמת.','סופרת','סופר','רופאה','פקידה','הטקסט מציג את רבקה לוין כסופרת מפורסמת.']
],
4:[
[39,'definite.model.1','Definiteness • source model','השלימו: ירושלים היא עיר _____ של ישראל.','הבירה','בירה','לבירה','העיר','הקטע בעמוד 39 כותב עיר הבירה של ישראל; ה״א הידיעה צמודה לבירה.'],
[39,'possessive.model.1','Possessive • source model','השלימו לפי השיחה: זה התיק _____ רחל.','של','על','עם','אל','בשיחת התיק משתמשים בשל כדי לציין שייכות: התיק של רחל.'],
[41,'possessive.exercise.1','Possessive • printed exercise','הפכו לשאלה לפי הדוגמה: הספר של דניאל ← _____?','של מי הספר','איפה הספר','מה הספר','מי הספר','בתרגיל מי ה... של שואלים של מי הספר כדי לברר בעלות.'],
[43,'definite.adjective.1','Definite noun and adjective • source','השלימו מן הדוגמה: העירייה על־יד התחנה _____.','המרכזית','מרכזית','המרכזי','מרכזיים','כאשר התחנה מיודעת, גם שם התואר מיודע: התחנה המרכזית.'],
[43,'definite.adjective.2','Definite noun and adjective • source','השלימו מן הדוגמה: הספרייה _____ על־יד הקניון החדש.','החדשה','חדשה','החדש','חדשים','הספרייה מיודעת ונקבה יחידה, ולכן הספרייה החדשה.'],
[44,'demonstrative.model.1','Demonstratives • source model','זה שולחן חדש ← אלה שולחנות _____.','חדשים','חדשות','חדש','חדשה','במודל המודפס שולחנות מקבל את שם התואר חדשים.'],
[44,'demonstrative.model.2','Demonstratives • source model','זה רחוב יפה ← אלה רחובות _____.','יפים','יפות','יפה','יפָה','רחובות הוא רבים זכר, ולכן יפים.'],
[44,'demonstrative.exercise.1','Demonstratives • printed exercise','השלימו: זה ספר מעניין ← אלה ספרים _____.','מעניינים','מעניינות','מעניין','מעניינת','ספרים הוא רבים זכר; שם התואר הוא מעניינים.'],
[45,'relation.model.1','Relations • source model','מה פירוש מילת היחס של בצירוף ״הספר של דניאל״?','שייכות','מקום','זמן','מספר','הדוגמה הספר של דניאל מציינת למי הספר שייך.'],
[46,'existence.text.1','יש / אין • source sentence','השלימו מן הקטע: במשרד _____ טלוויזיה.','אין','יש','הם','של','הקטע אומר במפורש שבמשרד אין טלוויזיה.'],
[47,'existence.exercise.1','יש / אין • printed completion','השלימו: בישראל _____ נפט.','אין','יש','נמצא','נמצאים','בתרגיל בעמוד 47 המשפט הוא בישראל אין נפט.'],
[47,'existence.exercise.2','יש / אין • printed completion','השלימו: בקניון _____ חנויות יפות ומסעדות טובות.','יש','אין','נמצא','נמצאת','בתרגיל בעמוד 47 משתמשים ביש לקיום החנויות והמסעדות.']
]};
for(const [level,items] of Object.entries(rows))window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]=items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Textbook exercise or source model with adapted choices'}));
const checks={
3:[
[32,'adjective.model','אלה ספרים טובים.','These are good books.',['These are good books.','This is a good book.','These are good pictures.','Those are new books.'],'אלה מציין רבים; ספרים טובים הוא צירוף זכר רבים.'],
[32,'adjective.model','אלה תמונות טובות.','These are good pictures.',['These are good pictures.','These are good books.','This is a good picture.','These pictures are new.'],'תמונות טובות הוא צירוף נקבה רבות.'],
[35,'profession.story','דן עובד בבנק.','Dan works at a bank.',['Dan works at a bank.','Dan works in a hospital.','Dan studies at a bank.','Dan lives near a bank.'],'בטקסט העבודה נאמר שדן עובד בבנק.']
],
4:[
[39,'definite.model','ירושלים היא עיר הבירה של ישראל.','Jerusalem is the capital of Israel.',['Jerusalem is the capital of Israel.','Jerusalem is a small city in Israel.','Israel is the capital of Jerusalem.','Jerusalem is near the capital.'],'במודל ירושלים מתוארת כעיר הבירה של ישראל.'],
[43,'definite.adjective','העירייה על־יד התחנה המרכזית.','The city hall is beside the central station.',['The city hall is beside the central station.','The library is beside the central station.','The city hall is in the mall.','The station is beside the library.'],'העירייה היא בית העירייה; על־יד מציין קרבה לתחנה המרכזית.'],
[46,'existence.text','במשרד אין טלוויזיה.','There is no television in the office.',['There is no television in the office.','There is a television in the office.','The office has no telephone.','The television is beside the office.'],'אין מציין שהטלוויזיה איננה במשרד.']
]};
for(const [level,items] of Object.entries(checks))window.HEBREW_CHAPTER_INTERPRETATION[level]=items.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
