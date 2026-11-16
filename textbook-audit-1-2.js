/* Source audit of אולפן עברית First Part lessons 1–2. PDF pages are one-based scan indices. */
(function(){'use strict';
const rows=[
 [15,'completion.a.1','Pronouns • completion','מי הוא? — _____ דניאל.','הוא','היא','אני','אתם','הדוגמה בעמוד 15 משיבה הוא דניאל לשאלה מי הוא.'],
 [15,'completion.a.2','Pronouns • completion','מאין היא? — _____ מאנגליה.','היא','הוא','אני','הם','הדוגמה בעמוד 15 משתמשת בהיא למי שמגיעה מאנגליה.'],
 [18,'read.complete.a.1','Adjectives • completion','רוברטו עולה _____ מברזיל.','חדש','חדשה','חדשים','חדשות','רוברטו הוא זכר יחיד; בתרגיל המודפס הצורה היא עולה חדש.'],
 [18,'read.complete.b.1','Prepositions • completion','היא גרה _____ כרמיאל.','ב','ל','מ','על','בתרגיל ההשלמה כותבים גרה בכרמיאל; ב־ מסמנת מקום.'],
 [21,'pronoun.table.1','Pronouns • table','מה שמך? — _____ שרה.','אני','הוא','הם','אתן','בדוגמת הטבלה שרה מדברת על עצמה ולכן אומרת אני שרה.'],
 [21,'pronoun.table.2','Pronouns • table','מה שמך? — _____ דניאל.','אני','היא','הם','אתם','בדוגמת הטבלה דניאל מציג את עצמו: אני דניאל.'],
 [22,'plural.pronoun.1','Pronouns • plural table','בטבלת הרבים: הוא ← _____.','הם','הן','אתם','אנחנו','הטבלה בעמוד 22 מציגה הוא ביחיד והם ברבים.'],
 [22,'plural.pronoun.2','Pronouns • plural table','בטבלת הרבים: היא ← _____.','הן','הם','אתן','אנחנו','הטבלה בעמוד 22 מציגה היא ביחיד והן ברבות.'],
 [22,'plural.pronoun.3','Pronouns • plural table','בטבלת הרבים: את ← _____.','אתן','אתם','הם','הן','הטבלה בעמוד 22 מציגה את ביחידה ואתן ברבות.'],
 [25,'verb.table.1','Verbs • present table','השלימו לפי טבלת הפועל: הן _____ על פוליטיקה.','מדברות','מדברים','מדברת','מדבר','הן מסמן רבות נקבה, ולכן מדברות.'],
 [25,'verb.table.2','Verbs • present table','השלימו לפי הטבלה: אתם _____ עברית?','מבינים','מבינות','מבין','מבינה','אתם הוא רבים זכר; בטבלה הצורה מבינים.'],
 [27,'age.completion.1','Age • printed completion','הוא _____ עשרים ואחת.','בן','בת','בני','בנות','בתרגיל בן כמה משתמשים בבן לזכר יחיד.'],
 [27,'age.completion.2','Age • printed completion','הן _____ חמש עשרה.','בנות','בנים','בן','בת','בתרגיל בת כמה משתמשים בבנות לרבות נקבה.'],
 [29,'verb.think.1','Verbs • printed completion','הוא _____ אני בן שלושים ושבע.','חושב ש־','חושבת ש־','חושבים ש־','חושבות ש־','בתרגיל שבעמוד 29 הוא מקבל את צורת הזכר היחיד חושב ש־.'],
 [29,'verb.think.2','Verbs • printed completion','אתן _____ דן תלמיד טוב?','חושבות ש־','חושבים ש־','חושבת ש־','חושב ש־','אתן הוא רבות נקבה, ולכן חושבות ש־.']
];
window.HEBREW_TEXTBOOK_QUESTION_BANKS[2]=rows.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Printed exercise with adapted choices'}));
window.HEBREW_CHAPTER_INTERPRETATION[1]=[
 [1,'alphabet.word.1','בית','house',['house','water','peace','book'],'בית מופיע כמילת דוגמה ליד האות ב בעמוד 1.'],
 [2,'alphabet.word.2','מים','water',['water','house','peace','book'],'מים מופיע כמילת דוגמה ליד האות מ בעמוד 2.'],
 [3,'alphabet.word.3','שלום','peace / hello',['peace / hello','water','house','book'],'שלום מופיע בדוגמאות הקריאה בעמוד 3.']
].map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
window.HEBREW_CHAPTER_INTERPRETATION[2]=[
 [21,'pronoun.table','אני שרה.','I am Sarah.',['I am Sarah.','She is Sarah.','You are Sarah.','Sarah is new.'],'אני מציין את הדוברת; הדוגמה בעמוד 21 היא אני שרה.'],
 [22,'plural.pronoun.table','אנחנו עובדים.','We work.',['We work.','They work.','You work.','I work.'],'אנחנו הוא גוף ראשון רבים, ועובדים היא צורת הרבים בקטע.'],
 [22,'good.friends','מיכאל עובד במסעדה.','Michael works in a restaurant.',['Michael works in a restaurant.','Michael works in a library.','Michael studies in a restaurant.','Michael lives in a restaurant.'],'בסיפור חברים טובים נאמר שמיכאל עובד במסעדה.']
].map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
