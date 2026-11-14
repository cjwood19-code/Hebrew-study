/* Source-based adaptations of the user's עברית בשניים לרמה ב׳ scan, chapters 4–5.
   sourcePage is a one-based PDF page index. */
(function(){"use strict";
const rows={
40:[
[102,"reported-question.1","Reported questions","מנהל האירוע שאל: ״האם יבואו אנשים לביקור בבתים הפתוחים?״ השלימו: מנהל האירוע שאל _____ יבואו אנשים לביקור בבתים הפתוחים.","אם","למה","מתי","כמה","משפט שאלה בלי מילת שאלה מקבל אם בדיבור עקיף.","Printed transformation • adapted to choices"],
[104,"modal-rule.1","Home visit rules","השלימו את הכלל: _____ לעשן בתוך הבתים.","אסור","אפשר","כדאי","קל","בעמוד 93 הכלל אוסר לעשן בתוך הבתים.","Printed rule • adapted to choices"],
[104,"modal-rule.2","Home visit rules","השלימו את הכלל: _____ לצלם את החדרים ואת הרהיטים.","אפשר","אסור","לא כדאי","קשה","הכללים בעמוד 93 מתירים לצלם את החדרים ואת הרהיטים.","Printed rule • adapted to choices"],
[104,"modal-rule.3","Home visit rules","השלימו את הכלל: _____ לכבד את בעלי הבית.","צריך","אסור","אי אפשר","לא כדאי","הכללים בעמוד 93 אומרים שצריך לכבד את בעלי הבית.","Printed rule • adapted to choices"],
[106,"future-table.1","Future • ל״ה verbs","אני _____ לקנות מצלמה חדשה מחר. (לקנות)","אקנה","קניתי","קונים","יקנו","לפי טבלת לקנות בעמוד 95, עתיד בגוף אני הוא אקנה.","Printed conjugation table • supplemental sentence"],
[108,"future-exercise.7","Future • ל״ה verbs","אנחנו _____ ימינה. (לפנות)","נפנה","פנינו","פונים","יפנו","בתרגיל העתיד בעמוד 96, אנחנו + לפנות מקבל נ׳: נפנה.","Printed fill-in • adapted to choices"],
[108,"future-exercise.4","Future • להיות","הוא _____ בישיבה. (להיות)","יהיה","היה","הווה","יהיו","טבלת להיות בעמוד 96 נותנת הוא יהיה.","Printed fill-in • adapted to choices"],
[108,"future-exercise.3","Future • ל״ה verbs","את _____ ארמון מזהב. (לבנות)","תבני","בנינו","בונים","יבנו","בתרגיל בעמוד 96 הנושא את עם לבנות דורש תבני.","Printed fill-in • adapted to choices"],
[110,"housing-dialogue.1","Housing dialogue • future","דפנה: ״אני רוצה בית עם גינה אחת בלי מדרגות. כש_____ זקנה, אני לא _____ כל יום למעלה.״","אהיה; אעלה","הייתי; עליתי","תהיי; תעלי","יהיו; יעלו","בדברי דפנה בעמוד 98, כשאהיה זקנה מתאר עתיד; לא אעלה למעלה.","Printed dialogue fill-in • adapted to choices"],
[112,"personal-sentence.1","Personal modal sentences","אפשר לשאול את המדריך שאלות. כתבו בגוף אתם: _____","אתם יכולים לשאול את המדריך שאלות.","אתם שאלתם את המדריך אתמול.","המדריך שואל אתכם שאלות.","אסור לכם לשאול שאלות.","הכלל בעמוד 100 ממיר אפשר ל־אתם יכולים.","Printed transformation • adapted to choices"],
[112,"personal-sentence.2","Personal modal sentences","כדאי לדעת את שמות האומנים. כתבו בגוף אתן: _____","כדאי לכן לדעת את שמות האומנים.","אסור לכן לדעת את שמות האומנים.","אתן ידעתן את שמות האומנים.","האומנים צריכים לדעת את שמכן.","כדאי הוא המלצה; עם אתן אפשר לכתוב כדאי לכן. אין כאן חובה של צריכות.","Supplemental transformation • lesson pattern"],
[125,"matching.1","Compound בית names","בתרגיל שמות הבתים: בית ספר הוא _____","בית שלומדים בו","בית של יהודים מתפללים בו","בית של שופטים","בית לתיירים","עמוד 113 מתאים בית ספר לבית שלומדים בו.","Printed matching • adapted to choices"],
[125,"matching.2","Compound בית names","בתרגיל שמות הבתים: בית משפט הוא _____","בית שבו שופטים מחליטים מי יהיה בבית כלא","בית שלומדים בו","בית לתיירים","בית של אנשים מתים","עמוד 113 מתאים בית משפט לבית שבו שופטים מחליטים מי יהיה בבית כלא.","Printed matching • adapted to choices"]
],
41:[
[126,"reading.1","Reading • בית ספר דו־לשוני","Which two languages do pupils learn at the bilingual school?","עברית וערבית","עברית ואנגלית","ערבית ורוסית","אנגלית וצרפתית"],
[126,"reading.2","Reading • בית ספר דו־לשוני","Which groups of children study together in these schools?","יהודים, מוסלמים ונוצרים","רק יהודים","רק מוסלמים","רק נוצרים"],
[126,"reading.3","Reading • בית ספר דו־לשוני","What do the teachers teach about during holidays?","חגי כל הדתות","רק חג אחד","רק חופשות הקיץ","חגי מדינות אירופה"],
[126,"questions.1","Questions • בית ספר דו־לשוני","The source asks learners to describe lines 1–3. What is the main feature of the schools?","למידה משותפת בשתי שפות","למידה רק מרחוק","לימודים בשפה אחת בלבד","בתי ספר רק למבוגרים"],
[128,"reading.4","Views • חינוך דו־לשוני","What question does the teacher in the Facebook discussion raise?","האם התלמידים לומדים מספיק בכל שפה","כמה עולה לבנות בית ספר","מי צילם את בית הספר","האם יש שיעורי ספורט"],
[128,"reading.5","Views • חינוך דו־לשוני","What do some parents support in the discussion?","לימוד שתי השפות והתרבויות","לימוד בלי מורים","ביטול כל השפות","לימוד רק בבית"],
[128,"pronoun.1","Pronoun suffix • אותם","Complete the source pattern: התלמידים משתמשים _____ מילונים.","באותם","באותה","באותו","באותן"],
[130,"dialogue.1","Dialogue • במחלקת אבדות ומציאות","What did Shuki lose?","התיק שלו","הספר שלו","המכונית שלו","הכרטיס שלו"],
[130,"dialogue.2","Dialogue • זה הרחוב","What does אילה say about the street?","אין בו בתים ואין בו עצים","יש בו בתים רבים","יש בו ים","יש בו בית ספר חדש"],
[130,"verb.1","Future • לבקש","Choose the future form of לבקש for אני.","אבקש","ביקשתי","מבקשים","יבקש"],
[132,"verb.2","Past tense • שיפור","אנחנו _____ את רמת הידע שלנו בהיסטוריה. (לשפר)","שיפרנו","נשפר","משפרים","שיפרו"],
[132,"verb.3","Future • לתרגם","אתן _____ את הסיפורים של הסופרת. (לתרגם)","תתרגמו","תרגמתן","מתרגמות","נתרגם"],
[132,"reading.6","Reading • הנרייטה סאלד","What organization did Henrietta Szold establish?","הדסה","בית השנטי","אונסקו","האוניברסיטה העברית"],
[132,"reading.7","Reading • הנרייטה סאלד","What name did people give Henrietta Szold?","אם הילדים","שומרת הפסיפסים","אם המכתשים","מלכת המדבר"],
[134,"dialogue.3","Dialogue • הכול תלוי בחינוך","What does the father argue helps people live with differences?","חינוך טוב","בניין גבוה","מפה טובה","טיול ארוך"],
[136,"reading.8","Reading • חינוך ספרטני","What ancient city does the section discuss?","ספרטה","רמלה","לונדון","תל אביב"],
[136,"reading.9","Reading • חינוך ספרטני","At what age could the children return to their families, according to the text?","30","7","13","50"],
[136,"reason.1","Reason words • בגלל / משום ש","Choose the source's cause word: _____ החינוך הספרטני, ילדים לא חזרו הביתה עד גיל שלושים.","בגלל","ואילו","אבל","כדי"],
[138,"reading.10","Reading • חינוך בזמן המודרני","Which country does the modern education dialogue discuss?","פינלנד","יוון","נורווגיה","אנגליה"],
[138,"reading.11","Reading • חינוך בזמן המודרני","According to the dialogue, what do Finnish pupils become?","תלמידים עצמאיים","אדריכלים","מורים בלבד","חיילים"],
[138,"reason.2","Reason words • תירוצים של תלמידים","לא הגעתי בזמן לאוניברסיטה _____ שביתת נהגי הרכבות.","בגלל","לכן","מפני ש","ואילו"],
[140,"names.1","Noun forms • שם העצם בנטייה","What is the masculine plural of דוד in the source table?","דודים","דודות","דודי","דודה"],
[142,"suffix.1","Possessive suffixes • שם עצם בנטייה","The exercise starts with כיתותיי. What does it mean?","my classrooms","their classrooms","your classroom","her class"],
[144,"reading.12","Reading • לאה גולדברג","In what year did Leah Goldberg arrive in Israel, according to the reading?","1935","1911","1970","1984"],
[144,"reading.13","Reading • לאה גולדברג","What did Leah Goldberg write for children?","שירים וסיפורים","רק מאמרים על גאולוגיה","רק כתבות על ספורט","רק מפות"],
[144,"reading.14","Reading • מרים ילן־שטקליס","What award did Miriam Yalan-Shteklis receive for her children's writing?","פרס ישראל","פרס נובל","פרס ספיר","פרס אוסקר"],
[146,"reading.15","Reading • אימא ברזל ואימא בד","Who studied what children need besides food, in the reading?","הארי הארלו","צ'רלס דרווין","דודו אריאל","מאיר יעקב שיק"],
[146,"reading.16","Reading • אימא ברזל ואימא בד","What did the baby monkeys prefer in the experiment?","אימא בד שנתנה להם חום","אימא ברזל בלבד","להישאר לבד תמיד","רק אוכל בלי מגע"],
[148,"reading.17","Reading • מותו של מחמוד דרוויש","What job did מחמוד דרוויש do?","משורר","אדריכל","גאולוג","רופא"],
[148,"reading.18","Reading • מותו של מחמוד דרוויש","In what year did Mahmoud Darwish die, according to the reading?","2008","1935","1970","2016"],
[150,"reading.19","Reading • רובין הוד","What does the text call the Robin Hood story?","אגדה או מציאות היסטורית?","סיפור מדעי על קופים","סיפור על בית ספר","אגדה על מכתש רמון"],
[150,"grammar.1","Sequence • הקטעים","Which group in the source sequence is called האספסוף?","הקבוצה הראשונה","הקבוצה השנייה","הקבוצה השלישית","אף קבוצה"]
]};
window.HEBREW_TEXTBOOK_QUESTION_BANKS=Object.assign(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{},Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c,explanation,practiceOrigin])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],...(explanation?{explanation,practiceOrigin}: {})}))])));
})();
