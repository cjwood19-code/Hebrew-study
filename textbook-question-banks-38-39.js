/* Source-based multiple-choice adaptations of עברית בשניים לרמה ב׳, chapters 2–3.
   Source pages are one-based PDF indexes of the user's scan. */
(function(){"use strict";
const rows={
38:[
[39,"connective.1","Connectives • ואילו","בצפון מדברים אנגלית, _____ בדרום אמריקה מדברים ספרדית.","ואילו","מפני ש","לכן","כדי"],
[50,"verb-cloze.1","Verb fill-in • שם הפועל","דינה: רותי, לאן _____ לפני שנה? (לטוס)","טסת","טסתי","טסתם","יטוס"],
[50,"verb-cloze.2","Verb fill-in • שם הפועל","רותי: אני לא _____ כל שנה, מפני שהטיסות יקרות. (לטוס)","טסה","טס","טסתי","טסתם"],
[54,"noun-adjective.1","Noun and adjective • התאמה","שם עצם ושם תואר: אורח נחמד → אורחת _____.","נחמדה","נחמד","נחמדים","נחמדות"],
[58,"preposition.1","Prepositions • ב־","בשיחה: ״התאהבתי בו ברגע שראיתי אותו״. איזו מילת יחס באה אחרי התאהבתי?","ב־","על","אל","מן"],
[62,"odd-one-out.1","Odd one out • אוצר מילים","סמנו בקו מה לא שייך: אונייה / מכונית / רכבת / אחר.","אחר","אונייה","מכונית","רכבת"],
[62,"matching.1","Vocabulary matching • קהילה","התאימו להגדרה: קהילה — _____.","קבוצה של אנשים שחיים ביחד","כלי תחבורה בים","פתח בהר","קבוצת שרים ושרות"],
[62,"matching.2","Vocabulary matching • תושב","התאימו להגדרה: תושב — _____.","מישהו שגר וחי במקום מסוים","איש דת שלא התחתן","כלי תחבורה בים","מישהו שמוכר מזון"],
[64,"connective.2","Connective choice • ואילו / אבל","ישראל נמצאת במזרח הים התיכון, _____ ספרד נמצאת במערב הים התיכון.","ואילו","מפני ש","כדי","לכן"],
[64,"future.1","Future tense • להחליט","מתי _____ (להחליט) לזרוק את כל הדברים שאת לא משתמשת בהם?","תחליטי","תחליט","החלטתם","מחליט"],
[64,"future.2","Future tense • להמשיך","אתם _____ (להמשיך) לגור בירושלים?","תמשיכו","ימשיכו","המשכתם","ממשיך"]
],
39:[
[66,"reading.1","Reading • תמונות נוף","Which landscapes are contrasted in the opening passage?","שדות ירוקים ונוף מדבר","שלג וקרח בלבד","רק ערים וכבישים","רק הרים מושלגים"],
[66,"reading.2","Reading • תמונות נוף","Which two seas are named in the geography passage?","ים המלח והים התיכון","ים הכנרת וים סוף","הים השחור והים התיכון","ים המלח והים השחור"],
[66,"reading.3","Reading • מצפה רמון","Where is מצפה רמון?","בנגב","בגליל","במרכז תל אביב","באירופה"],
[66,"reading.4","Reading • מצפה רמון","What natural feature is near מצפה רמון?","מכתש רמון","ים הכנרת","הר החרמון","נחל הירקון"],
[66,"grammar.1","True or false • לא רק... אלא גם","בנגב נמצא לא רק מכתש רמון, אלא גם עוד ארבעה מכתשים. נכון או לא נכון?","נכון","לא נכון","הקטע אינו עוסק במכתשים","המכתשים נמצאים רק בים"],
[70,"reading.5","Reading • המכתשים","What are geologists studying in the crater scene?","את האדמה והסלעים","את הרכבות","את שירי החג","את בתי הכנסת"],
[70,"reading.6","Reading • העיר רמלה","Who decided to establish רמלה?","סלימאן עבד אל־מלך","צ'רלס דרווין","בנימין מטודלה","שימעון פרס"],
[70,"reading.7","Reading • העיר רמלה","What does רמלה mean in Arabic according to the text?","חול","הר","ים","בית"],
[70,"reading.8","Reading • העיר רמלה","What structures brought water to the city?","בריכות מים","רכבות","מנהרות רכבת","גשרים"],
[74,"reading.9","Reading • שומר הפסיפסים","What did שואלב אבו דיאב protect?","פסיפסים","כרטיסי ברכה","סוסים","מפות"],
[74,"reading.10","Reading • שומר הפסיפסים","Where did he work in the 1980s?","במוזיאון","בבית ספר","בחברת תעופה","בבנק"],
[74,"grammar.2","Temporal choice • לפני / אחרי","_____ שהתחיל לעבוד במוזיאון, הוא למד על ההיסטוריה של הפסיפסים.","אחרי","לפני ש","כאשר לא","מפני"],
[74,"grammar.3","Future binyan • אפעל","Choose the future form of לכתוב for אני.","אכתוב","יכתוב","כתבתי","כותבים"],
[78,"future.1","Future practice • שם הפועל","שר החינוך הודיע: שנת הלימודים התחילה בלי בעיות. Rewrite the verb in future tense for היא.","תתחיל","התחילה","מתחילים","אתחיל"],
[78,"future.2","Future practice • שם הפועל","Choose the future form of לפתח for החברה.","תפתח","פיתחה","מפתחים","אפתח"],
[78,"future.3","Future practice • שם הפועל","Choose the future form of לפנות for אתם.","תפנו","פניתם","פונים","יפנו"],
[82,"reading.11","Reading • מלון בראשית","Where was מלון בראשית built?","על יד מכתש רמון","ליד ים הכנרת","בתוך תל אביב","בגליל העליון"],
[82,"reading.12","Reading • מלון בראשית","Which animals did the hotel manager mention near the site?","יעלים","דובים","סוסים","גמלים"],
[82,"reading.13","Reading • מלון בראשית","What did the manager say the hotel would give tourists?","נוף של המכתש","כרטיסי רכבת","ספרי דקדוק","מפת אירופה"],
[86,"smikhut.1","Construct state • סמיכות","Choose the construct phrase for 'desert plants'.","צמחי מדבר","צמחים מדבר","צמח המדברים","מדבר צמחים"],
[86,"smikhut.2","Construct state • סמיכות","Choose the plural construct phrase for 'residents of the city'.","תושבי עיר","תושבים עיר","תושב ערים","עיר תושבים"],
[90,"reading.14","Reading • אב קדמון משותף","What did Charles Darwin study on his voyage?","בעלי חיים וצמחים","מפות רכבת בלבד","שפות עתיקות בלבד","בניית ערים"],
[90,"reading.15","Reading • אב קדמון משותף","What is the title of Darwin's book mentioned in the text?","מוצא המינים","כל נדרי","אשת לוט","אי אפשר אחרת"],
[94,"dialogue.1","Dialogue • חוות האלפקות","Which animals can visitors ride in the dialogue?","חמורים","אלפקות","דגים","פרפרים"],
[94,"dialogue.2","Dialogue • חוות האלפקות","How does the guide answer the question about the weather?","כמו במדבר","כמו בים","כמו בחורף אירופי","כמו בצפון הקפוא"],
[98,"reading.16","Reading • אגדה בדווית","What did the first angel receive in the Bedouin tale?","תפקיד להכין את המדבר","תפקיד לבנות רכבת","תפקיד ללמד עברית","תפקיד לצייר מפות"],
[98,"matching.1","Picture matching • בעלי חיים","Which Hebrew word names the pictured camel?","גמל","צבי","נחש","סוס"],
[100,"word-choice.1","Word choice • נופים","הבחורים הצעירים האלה _____ עכשיו על קירות גבוהים.","מטפסים","נוסעים","יושבים","מסתתרים"],
[100,"word-choice.2","Word choice • כל אחד יכול להצליח","Which word completes the contrast in the Bialik passage: הוא לא רק כתב שירים, _____ גם תרגם ספרים לעברית.","אלא","מפני ש","לכן","אחרי"],
[100,"reading.17","Reading • חיים נחמן ביאליק","Who was חיים נחמן ביאליק?","משורר עברי","גאולוג","מנהל מלון","ממציא המטוס"]
]};
const explanations38=[
"בעמוד 27 ואילו מחברת שני משפטים ומדגישה ניגוד בין אזורים ושפות.",
"בשיחה בעמוד 38 דינה פונה לרותי בלשון את ושואלת על השנה שעברה, ולכן טסת.",
"רותי מדברת על הרגל בהווה: אני לא טסה כל שנה.",
"בעמוד 42 הדוגמה משנה אורח נחמד לנקבה יחידה: אורחת נחמדה.",
"בשיחה בעמוד 47 כתוב התאהבתי בו; ב־ היא מילת היחס המצורפת.",
"בעמוד 50 שלוש המילים הראשונות הן כלי תחבורה; אחר פירושו שונה.",
"בעמוד 51 קהילה מותאמת להגדרה קבוצה של אנשים שחיים ביחד.",
"בעמוד 51 תושב מותאם להגדרה מישהו שגר וחי במקום מסוים.",
"בעמוד 53 יש ניגוד בין מזרח הים התיכון למערב; ואילו היא מילת הניגוד.",
"בעמוד 53 הנושא את מצריך את צורת העתיד תחליטי.",
"בעמוד 53 הנושא אתם מצריך תמשיכו בעתיד."
];
window.HEBREW_TEXTBOOK_QUESTION_BANKS=Object.assign(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{},Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c],i)=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],...(Number(level)===38?{explanation:explanations38[i],practiceOrigin:"Printed exercise • choices adapted"}:{})}))])));
})();
