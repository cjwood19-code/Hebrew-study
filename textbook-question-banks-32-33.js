/* Units 15–16 from the user's scanned textbook. PDF pages are one-based.
   Original Hebrew and exercise families are retained; closed options adapt
   open writing tasks for automatic grading. */
(function(){"use strict";
const rows={
32:[
[181,"possessive.family.1","Possessive • הכל נשאר במשפחה","רון כבר מבוגר. הוא בן 43. הוא התחתן עם אישה בת 39 בשם שולמית. _____ של רון היא שולמית. (האישה שלו)","אשתו","אשתה","אשתי","אשתם"],
[181,"possessive.family.2","Possessive • הכל נשאר במשפחה","לשולמית יש בת מן _____ הקודם. (הבעל שלה)","בעלה","בעלו","בעלי","בעלם"],
[181,"possessive.family.3","Possessive • הכל נשאר במשפחה","היא התחתנה עם _____ של רון. (האב שלו)","אביו","אביה","אבי","אבינו"],
[182,"verb.table.1","Verb table • פועל","הם למדו → they will learn. Choose the future form from the table.","ילמדו","למדו","לומדים","ללמוד"],
[182,"verb.table.2","Verb table • פועל","הוא חטף → he will snatch. Choose the future form.","יחטוף","חטף","חוטף","לחטוף"],
[182,"verb.table.3","Verb table • פועל","אתה יודע → you will know. Choose the future form.","תדע","ידע","יודע","לדעת"],
[182,"verb.table.4","Verb table • פועל","אני למדתי → I will learn. Choose the future form.","אלמד","ילמד","תלמד","נלמד"],
[182,"verb.table.5","Verb table • פועל","אתם מכירים → you will recognize. Choose the future form.","תכירו","יכירו","אכיר","נכיר"],
[182,"verb.table.6","Verb table • פועל","היא תסכים → she agreed. Choose the past form.","הסכימה","הסכים","הסכמתי","הסכימו"],
[182,"verb.table.7","Verb table • פועל","את מתחשבת → you will consider. Choose the future form.","תתחשבי","תתחשב","אתחשב","יתחשב"],
[183,"concession.1","Concession • אף על פי ש","יוסי טיפש ומכוער. רחל אוהבת אותו. Join with אף על פי ש.","אף על פי שיוסי טיפש ומכוער, רחל אוהבת אותו.","מפני שיוסי טיפש ומכוער, רחל אוהבת אותו.","יוסי טיפש ומכוער כי רחל אוהבת אותו.","רחל אוהבת אותו כדי שיוסי טיפש ומכוער."],
[183,"concession.2","Concession • אף על פי ש","ארז נמוך ויעל גבוהה. יעל מתחתנת אתו. Join with אף על פי ש.","אף על פי שארז נמוך ויעל גבוהה, יעל מתחתנת אתו.","מפני שארז נמוך, יעל מתחתנת אתו.","יעל גבוהה כי ארז מתחתן אתה.","ארז נמוך כדי שיעל תתחתן אתו."],
[183,"concession.3","Concession • אף על פי ש","השיעורים משעממים ומעייפים. התלמידים ממשיכים לבוא לכיתה. Join with אף על פי ש.","אף על פי שהשיעורים משעממים ומעייפים, התלמידים ממשיכים לבוא לכיתה.","מפני שהשיעורים משעממים, התלמידים ממשיכים לבוא.","התלמידים באים כדי שהשיעורים משעממים.","השיעורים משעממים כי התלמידים באים."],
[183,"concession.4","Concession • אף על פי ש","בית המשפט לא העניש את האיש. הוא עבר על החוק. Join with אף על פי ש.","אף על פי שהוא עבר על החוק, בית המשפט לא העניש אותו.","מפני שעבר על החוק, בית המשפט לא העניש אותו.","בית המשפט לא העניש אותו כדי שיעבור על החוק.","הוא עבר על החוק ולכן לא הענישו אותו."],
[185,"place.1","Place • כתוב בטקסט במקום","איך אומרים בקיצור: אחרי שעברו חמש שנים?","כעבור חמש שנים","לפני חמש שנים","במשך חמש שנים","כל חמש שנים"],
[186,"preposition.1","Prepositions • original exercise","הצעירה התנגדה _____ רצון המשפחה. (אל / את / ל)","ל־","אל","את","על"],
[186,"preposition.2","Prepositions • original exercise","היא פגשה רופא צעיר, ורצתה להתחתן _____. (אתו / אתה / אתם)","אתו","אתה","אתם","אותו"],
[186,"preposition.3","Prepositions • original exercise","הצעירה הכירה את אחיה, וחששה _____. (אותו / עליו / ממנו)","ממנו","אותו","עליו","אתו"],
[186,"preposition.4","Prepositions • original exercise","כדאי להתחשב _____ אנשים, ולא לפגוע _____. (ב / להם)","ב־; בהם","עם; אותם","על; מהם","את; להם"]
],
33:[
[189,"noun.gender.1","Noun gender • שם עצם / שם תואר","החברה שלו + חדשה — choose the possessive noun and adjective.","חברתו החדשה","חברו החדש","חברותיו החדשות","חברתי החדשה"],
[189,"noun.gender.2","Noun gender • שם עצם / שם תואר","האחיות שלהם + גדולות — choose the possessive noun and adjective.","אחיותיהם הגדולות","אחיהם הגדולים","אחותו הגדולה","אחיותינו הגדולות"],
[189,"noun.gender.3","Noun gender • שם עצם / שם תואר","השמלה שלך (masculine you) + יפה — choose the possessive noun and adjective.","שמלתך היפה","שמלתו היפה","שמלתי היפה","שמלותיך היפות"],
[189,"noun.gender.4","Noun gender • שם עצם / שם תואר","המזכירה שלנו + חרוצה — choose the possessive noun and adjective.","מזכירתנו החרוצה","מזכירתו החרוצה","מזכירתם החרוצה","מזכירותינו החרוצות"],
[189,"noun.plural.1","Plural possessive • שם עצם / שם תואר","הבתים שלנו + גדולים — choose the possessive noun and adjective.","בתינו הגדולים","בתיהם הגדולים","ביתנו הגדול","בתיכן הגדולים"],
[189,"noun.plural.2","Plural possessive • שם עצם / שם תואר","המשחקים שלהם + מעניינים — choose the possessive noun and adjective.","משחקיהם המעניינים","משחקינו המעניינים","משחקיו המעניינים","משחקם המעניין"],
[189,"noun.plural.3","Plural possessive • שם עצם / שם תואר","העפרונות שלי + חדשים — choose the possessive noun and adjective.","עפרונותיי החדשים","עפרונותיו החדשים","עפרוננו החדש","עפרונותינו החדשים"],
[190,"future.passive.1","Future passive • נפעל","הנהג ניסה לעצור את המכונית, אבל פגע בעמוד חשמל. המכונית _____, אבל הנהג לא _____. (להיעצר; להיפגע)","תיעצר; ייפגע","תעצור; יפגע","נעצרה; נפגע","ייעצר; תיפגע"],
[190,"future.passive.2","Future passive • נפעל","הילדים פתחו את החלון ושברו את הזכוכית. החלון _____, והזכוכית _____. (להיפתח; להישבר)","ייפתח; תישבר","יפתח; תשבור","נפתח; נשברה","תיפתח; יישבר"],
[190,"future.passive.3","Future passive • נפעל","הזכוכית _____, אבל הם לא _____ קשה. (להישבר; להיפצע)","תישבר; ייפצעו","תשבור; יפצעו","נשברה; נפצעו","יישבר; תיפצע"],
[190,"future.passive.4","Future passive • נפעל","השוטר עצר ברחוב שני בחורים. עוד פעם הם _____, הם _____ לתחנת המשטרה. (להיעצר; להילקח)","ייעצרו; יילקחו","יעצרו; ייקחו","נעצרו; נלקחו","תיעצר; תילקח"],
[190,"future.passive.5","Future passive • נפעל","בעוד שבועיים הבית _____ והמגרש _____. (להיהרס; להימכר)","ייהרס; יימכר","יהרוס; ימכור","נהרס; נמכר","תיהרס; תימכר"],
[191,"infinitive.1","Infinitive • שם הפועל","בסיפור השודדים מופיע הפועל נמלטו. מה שם הפועל?","להימלט","למלט","לנמול","ללטף"],
[191,"infinitive.2","Infinitive • שם הפועל","בסיפור נורית מופיע הפועל נעצרה. מה שם הפועל?","להיעצר","לעצור","להצטרף","להישאר"],
[191,"infinitive.3","Infinitive • שם הפועל","בסיפור נורית מופיע הפועל נפרצה. מה שם הפועל?","להיפרץ","לפרוץ","לרוץ","להפציע"],
[194,"sign.1","Signs • שלטים על מכוניות","Read the sign: אם אתה מצליח לקרוא, אתה קרוב מדי. What is the driver saying?","You are following too closely.","You are driving too slowly.","You cannot read this sign.","You are at the wrong address."],
[194,"sign.2","Signs • שלטים על מכוניות","Read the sign: כשאהיה גדולה, אני רוצה להיות רולס־רויס. What is personified?","A car","A child","A book","A bird"],
]};
const explain=(category,answer)=>{
 if(category.startsWith('Possessive')||category.startsWith('Noun gender')||category.startsWith('Plural possessive'))return `הכינוי המצורף לשם העצם מבטא שייכות, ושם התואר מתאים למין ולמספר. הצורה הנכונה היא ${answer}.`;
 if(category.startsWith('Verb table')||category.startsWith('Future passive')||category.startsWith('Infinitive'))return `יש להתאים את השורש לזמן, לגוף ולבניין שנדרשו בתרגיל. כאן הצורה היא ${answer}.`;
 if(category.startsWith('Concession'))return `אף על פי ש מציג ניגוד בין שני המשפטים. הניסוח המתאים הוא ${answer}.`;
 if(category.startsWith('Prepositions'))return `מילת היחס נקבעת לפי הפועל והמשלים במשפט. כאן מתאים ${answer}.`;
 return `בתרגיל היחידה, ההקשר והביטוי העברי מובילים אל ${answer}.`;
};
window.HEBREW_TEXTBOOK_QUESTION_BANKS=Object.assign(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{},Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],explanation:explain(category,answer),practiceOrigin:'Textbook exercise adapted to choices'}))])));
})();
