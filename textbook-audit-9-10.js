/* Scan-checked אולפן עברית First Part lessons 9–10; PDF page indices are one-based. */
(function(){'use strict';
const rows={
9:[
[90,'clock.exercise.1','Time • printed completion','כתבו את השעה במילים: 7:05 (בבוקר)','שבע וחמש בבוקר','שבע ורבע בבוקר','חמש ושבע בבוקר','שבע וחצי בבוקר','7:05 היא השעה שבע וחמש בבוקר.'],
[90,'clock.exercise.2','Time • printed completion','כתבו את השעה במילים: 19:15 (בערב)','שבע ורבע בערב','שבע ורבע בבוקר','תשע ורבע בערב','שבע וחצי בערב','19:15 היא שבע ורבע בערב.'],
[92,'question.exercise.1','Questions • printed transformation','כתבו שאלה לתשובה: יש לנו מכונית ישנה.','איזו מכונית יש לכם?','איפה המכונית שלכם?','מתי המכונית שלכם?','מי המכונית שלכם?','איזו שואלת על סוג המכונית: ישנה.'],
[94,'preference.choice.1','Preferences • printed choice','רוני לא אוהב לאכול... מה הוא לא אוהב?','דגים','אורז','עוף','סודה','בשיחה רוני אומר: אני לא אוהב דגים!'],
[94,'preference.choice.2','Preferences • printed choice','רוני מעדיף לשתות...','קולה','מים','סודה','קפה','רוני אומר בסוף השיחה: אני מעדיף לשתות קולה.'],
[95,'verb.exercise.1','Present verb • printed completion','השלימו: הוא אוהב _____ בטלוויזיה תוכניות ספורט.','לראות','רואה','לשמוע','לקרוא','אחרי אוהב בא שם הפועל לראות; התרגיל מדבר על תוכניות ספורט.'],
[95,'verb.exercise.3','Present verb • printed completion','השלימו: הוא אוהב _____ עיתונים, היא מעדיפה _____ ספרים.','לקרוא, לקרוא','קורא, קוראת','לראות, לראות','לשמוע, לשמוע','אחרי אוהב ומעדיפה בא שם הפועל לקרוא.'],
[99,'verb.exercise.1','Present verb • printed completion','השלימו: התלמידים _____ לכיתה בבוקר. (מגיע)','מגיעים','מגיע','מגיעה','מגיעות','התלמידים הוא רבים זכר; לכן מגיעים.']
],
10:[
[103,'construct.exercise.1','Construct state • printed transformation','כתבו בסמיכות: כוס של קפה','כוס קפה','קפה כוס','כוס של הקפה','כוסות קפה','כוס קפה היא סמיכות של כוס של קפה.'],
[103,'construct.exercise.2','Construct state • printed transformation','כתבו בסמיכות: עיתון של ספורט','עיתון ספורט','ספורט עיתון','עיתון של הספורט','עיתוני ספורט','עיתון ספורט היא צורת הסמיכות של עיתון של ספורט.'],
[104,'construct.exercise.1','Construct state • printed transformation','כתבו בסמיכות: תחנות של אוטובוס','תחנות אוטובוס','תחנה אוטובוסים','אוטובוס תחנות','תחנות של אוטובוס','תחנות אוטובוס היא צורת הסמיכות של תחנות של אוטובוס.'],
[104,'construct.exercise.2','Construct state • printed transformation','כתבו בסמיכות: ארוחות שאוכלים בערב','ארוחות ערב','ארוחות בוקר','ארוחת ערב','ערב ארוחות','ארוחות ערב הוא הצירוף המתאים לארוחות שאוכלים בערב.'],
[110,'dialogue.choice.1','Dialogue • printed choice','רותי רואה...','תוכנית בטלוויזיה על חיות באפריקה.','סרט קולנוע בטלוויזיה.','תוכנית ספורט בטלוויזיה.','תוכנית על מוזיקה.','בשיחת הטלפון רותי אומרת שהיא רואה תוכנית בטלוויזיה על חיות באפריקה.'],
[110,'dialogue.choice.3','Dialogue • printed choice','רותי מחכה...','לסוף השבוע','למכתב חשוב מחו״ל','בתחנה לאוטובוס','לסוף החודש','בשיחה רותי אומרת שהיא כבר מחכה לסוף השבוע.'],
[111,'verb.table.1','Verb form • printed table','השלימו מן הטבלה: רוקד → _____ (נקבה יחידה)','רוקדת','רוקדים','רוקדות','לרקוד','בטבלת הפועל הצורה לנקבה יחידה היא רוקדת.']
]};
for(const [level,items] of Object.entries(rows))window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]=items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation,practiceOrigin:'Textbook exercise or source model with adapted choices'}));
const checks={
9:[
[92,'cat.dialogue','איזה חברים יש לך?','What friends do you have?',['What friends do you have?','Where are your friends?','Do your friends have cats?','What do your friends want?'],'איזה שואל איזה סוג; חברים פירושו friends.'],
[94,'roni.dialogue','אני לא אוהב דגים!','I do not like fish!',['I do not like fish!','I like fish!','I do not like chicken!','I want fish!'],'רוני אומר לא אוהב, ו־דגים הם fish.'],
[98,'ilana.profile','היא רוצה להכיר בחור לקשר רציני.','She wants to meet a man for a serious relationship.',['She wants to meet a man for a serious relationship.','She has a serious job at school.','She does not want to meet anyone.','She wants to travel with a friend.'],'בפרופיל אילנה, רוצה להכיר הוא wants to meet, וקשר רציני הוא serious relationship.']
],
10:[
[105,'nahalal.reading','רוב האנשים שחיים במושב עובדים בחקלאות.','Most people who live in the moshav work in agriculture.',['Most people who live in the moshav work in agriculture.','All people in the city work in schools.','Few people in the moshav work in agriculture.','Most people visit the moshav for dinner.'],'בקטע נהלל, רוב פירושו most וחקלאות היא agriculture.'],
[106,'anat.reading','ענת רוצה להיות מורה, לכן היא לומדת חינוך.','Anat wants to be a teacher, so she studies education.',['Anat wants to be a teacher, so she studies education.','Anat is a teacher who studies music.','Anat wants to leave the school.','Anat teaches her parents on Shabbat.'],'לכן קושר את רצונה להיות מורה ללימודי חינוך.'],
[107,'daniel.dialogue','אני לא יכול לענות...','I cannot answer...',['I cannot answer...','I can answer now.','I do not want to ask.','I can leave now.'],'בדיאלוג דניאל אומר איני יכול לענות לאמו.']
]};
for(const [level,items] of Object.entries(checks))window.HEBREW_CHAPTER_INTERPRETATION[level]=items.map(([sourcePage,sourceExercise,he,answer,options,explanation])=>({sourcePage,sourceExercise,category:'Interpretation • Hebrew to English',prompt:'What does this Hebrew mean?\n'+he,answer,options,explanation,interpretation:true}));
})();
