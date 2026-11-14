/* Source-based adaptations of the user's scans: ללמוד עברית ברמה ב׳ unit 19
   and עברית בשניים לרמה ב׳, chapter 1. PDF pages are one-based. */
(function(){"use strict";
const rows={
36:[
[214,"vocab.1","Lesson vocabulary • כל נדרי בארץ רחוקה","האונייה שלנו _____ בנמל דייגים קטן בצפון נורווגיה. Choose the verb from the opening sentence.","עגנה","טסה","ישנה","נולדה"],
[214,"vocab.2","Lesson vocabulary • כל נדרי בארץ רחוקה","טיילתי ברחובות הריקים של העירייה. What does הריקים describe?","רחובות בלי אנשים","רחובות מלאים","רחובות חדשים","רחובות רחוקים"],
[214,"verb.1","Narrative verb • כל נדרי בארץ רחוקה","קולות השירה _____ מהקומה העליונה של אחד הבתים. Complete the printed story sentence.","נשמעו","נשמע","נשמעה","ישמעו"],
[214,"verb.2","Habitual past • כל נדרי בארץ רחוקה","כל שנה ביום זה היא _____ את התקליט לזכר בני משפחתה. Complete the repeated past action.","היתה משמיעה","משמיעה","תשמיע","השמיעה"],
[214,"vocab.3","Lesson vocabulary • כל נדרי בארץ רחוקה","האישה ביקשה לשבת, ובמעט המילים שידעה באנגלית _____: ... Choose the verb for 'explained'.","הסבירה","הקשיבה","הזמינה","שאלה"],
[214,"meaning.1","Sentence meaning • כל נדרי בארץ רחוקה","מה פירוש 'לפני עשר שנים מתה האישה, והשאירה לנו את התקליט' בהקשר הסיפור?","האישה נפטרה והשאירה את התקליט","האישה קנתה אונייה","האישה שרה במקהלה","האישה חזרה לגרמניה"]
],
37:[
[13,"reading.1","Reading • כרטיסי ברכה","Read: במאה ה־14 בגרמניה ובאוסטריה התחילו לשלוח כרטיסי ברכה לכבוד הכריסמס. Where did this custom begin in the passage?","בגרמניה ובאוסטריה","בישראל ובקנדה","באנגליה ובצרפת","בנורווגיה וביוון"],
[13,"reading.2","Reading • כרטיסי ברכה","Read: במאה ה־19 ... שלחו אלה לאלה כרטיסי ברכה לשנה החדשה. What were they sending?","כרטיסי ברכה לשנה החדשה","תקליטים","מכתבי עבודה","הזמנות לחתונה"],
[13,"reading.3","Reading • כרטיסי ברכה","Read: לפעמים היה בהם שיר שכבר אהבו את המנגינה. What could appear on the cards?","שיר מוכר","מחיר של מתנה","כתובת של חנות","תפריט של חג"],
[13,"reading.4","Reading • כרטיסי ברכה","Read: עד שנות ה־50 של המאה ה־20 המשיכו יהודים בארץ ישראל ובכל מקום בעולם לשלוח כרטיסי ברכה. How long did the practice continue?","עד שנות החמישים של המאה העשרים","רק עד המאה הארבע עשרה","רק שנה אחת","עד שנת 1943 בלבד"],
[13,"reading.5","Reading • כרטיסי ברכה","Read: היום כמעט אף אחד לא עומד בתור בדואר לשלוח כרטיסי ברכה. What changed?","כמעט לא שולחים בדואר","כולם עומדים בתור בדואר","אין ברכות כלל","החג בוטל"],
[14,"questions.1","Questions • כרטיסי ברכה","מי המציא את התמונות האלה על כרטיסי הברכה? Choose the group suggested by the reading.","נוצרים","יהודים","מוסלמים","ימאים"],
[14,"questions.2","Questions • כרטיסי ברכה","בכרטיסי הברכה העתיקים מאמריקה יש רק מילים. נכון או לא נכון?","לא נכון","נכון","אין כרטיסים באמריקה","הקטע אינו מזכיר כרטיסים"],
[14,"greeting.2","Greeting writing • ברכה אישית","What does the source ask learners to write after reading a shared greeting?","ברכה לחבר או לחברה","תשובה על לווייתנים","דוח משטרה","מתכון לסעודה"],
[15,"dialogue.1","Dialogue • עיד אל־פיטר וראש השנה","Read: קמים מוקדם בבוקר, מדליקים את האור, לובשים בגדים יפים ומלבישים את הילדים בבגדים חדשים. What do families do?","לובשים בגדים יפים","סוגרים את הבית","הולכים לים","עובדים כל הלילה"],
[15,"dialogue.2","Dialogue • עיד אל־פיטר וראש השנה","Read: מי שצם כל חודש הרמדאן אומר תודה לאלוהים. Which month is mentioned?","רמדאן","אלול","ספטמבר","ינואר"],
[15,"dialogue.3","Dialogue • עיד אל־פיטר וראש השנה","Read: אוכלים תפוח בדבש ומבקשים שהשנה החדשה תהיה שנה מתוקה. What symbolizes a sweet year?","תפוח בדבש","מלח ומים","לחם יבש","דג קטן"],
[16,"action.1","Actions • ברכה","According to the dialogue, who lights the holiday candles?","יהודים","מוסלמים בלבד","נוצרים בלבד","אף אחד"],
[16,"action.2","Actions • ברכה","According to the dialogue, who fasts for a whole month?","מוסלמים","יהודים","נוצרים","כל הקבוצות"],
[16,"action.3","Actions • ברכה","According to the dialogue, who eats an apple with honey?","יהודים","מוסלמים","נוצרים","אף אחד"],
[17,"habitual.1","Habitual past • היה + הווה","סיפרתי לשכנים על משמעות החג. כל פעם _____ לשכנים על משמעות החג.","הייתי מספר","היה מספר","אספר","מספרים"],
[17,"habitual.2","Habitual past • היה + הווה","סבא נתן לנכדים ממתקים. בכל חג _____ לנכדים ממתקים.","היה נותן","נתן","ייתן","הייתה נותנת"],
[17,"habitual.3","Habitual past • היה + הווה","אחותי שרה אחרי הארוחה. תמיד אחרי הארוחה _____.","הייתה שרה","היה שר","תשיר","שרתי"],
[18,"verb.1","Verb forms • סיפור ילדות","Choose the habitual past for 'הסופרים מספרים סיפורים לילדים'.","היו מספרים","היה מספר","הייתה מספרת","יספרו"],
[18,"verb.2","Verb forms • סיפור ילדות","Choose the habitual past for 'מדי יום אנחנו שומעים סיפורים'.","היינו שומעים","היה שומע","שמעתי","נשמע"],
[20,"myth.1","Reading • מהו מיתוס?","Read: מיתוס הוא מילה יוונית שהמשמעות שלה היא סיפור עם. What does מיתוס mean here?","סיפור עם","ברכת חג","שיעור דקדוק","מכתב אהבה"],
[20,"myth.2","Reading • מהו מיתוס?","Read: המיתוסים נותנים תמונה והבנה על העולם, על החיים ועל הרגשות שלנו. What do myths help explain?","העולם, החיים והרגשות","רק תאריכים","רק תחבורה","רק מחירים"],
[20,"myth.3","Reading • מהו מיתוס?","Read: הסיפורים עברו במשך מאות שנים מאדם לאדם. How were they passed on?","מאדם לאדם","רק ברדיו","רק בכתב סודי","במכוניות"],
[22,"story.1","Story cloze • סיפור אלף לילה ולילה","Read: המלך שהריאר, שלא אהב נשים, החליט להרוג את כל הנשים שלו. Who is the king?","שהריאר","סולון","דני","אלוהים"],
[22,"story.2","Story cloze • סיפור אלף לילה ולילה","Read: שחרזדה החליטה להתחתן עם המלך. Who decided to marry him?","שחרזדה","האישה מנורווגיה","מריסה מאייר","אשת המלך הראשונה"],
[22,"story.3","Story cloze • סיפור אלף לילה ולילה","Read: בכל לילה היא התחילה סיפור חדש, וכך במשך אלף לילה ולילה. How did she keep his interest?","התחילה סיפור חדש בכל לילה","נתנה לו כרטיסי ברכה","הפסיקה לדבר","נסעה לאוסטרליה"],
[24,"tense.1","Verb tense • עבר / הווה / עתיד","אני רוצה להזמין חברים למסיבת יום ההולדת. Choose the future form of להזמין for אני.","אזמין","הזמנתי","מזמין","יזמין"],
[24,"tense.2","Verb tense • עבר / הווה / עתיד","אתה צריך להקשיב. Choose the past form of להקשיב for אתה.","הקשבת","מקשיב","תקשיב","הקשיבה"],
[24,"tense.3","Verb tense • עבר / הווה / עתיד","את יכולה להחליט. Choose the future form for את.","תחליטי","החלטת","מחליטה","יחליט"],
[26,"negation.1","Negation • ציווי בשלילה","אל _____ את אחותך! (להפריע)","תפריע","הפרעת","מפריע","יפריע"],
[26,"negation.2","Negation • ציווי בשלילה","אל _____ את התרגילים! (להפסיק)","תפסיק","הפסקת","מפסיק","יפסיק"],
[26,"negation.3","Negation • ציווי בשלילה","אל _____ את האור! (להדליק)","תדליק","הדלקת","מדליק","ידליק"],
[28,"future.1","Future • שנה חדשה","מורה: אני רוצה שהתלמידים החדשים לא יפריעו. Which verb expresses 'will interrupt'?","יפריעו","הפריעו","מפריעים","להפריע"],
[28,"future.2","Future • שנה חדשה","רופא: אני דורש שהחולים שלי יקשיבו כל הזמן. Which verb expresses 'will listen'?","יקשיבו","הקשיבו","מקשיבים","להקשיב"],
[30,"relations.1","Prepositions • דרך היחס","Choose the first-person singular form of ל־ from the printed relation table.","לי","לך","לו","לנו"],
[30,"relations.2","Prepositions • דרך היחס","Choose the first-person plural form of עם from the printed relation table.","איתנו","איתי","איתם","איתך"],
[32,"relations.3","Prepositions • של / ל / עם / את","אתם אוכלים ארוחה _____ חברים בבית _____? Choose the forms meaning with / yours.","עם; שלכם","את; שלהם","של; איתנו","ל; אותם"],
[32,"relations.4","Prepositions • של / ל / עם / את","של / את – ההורים _____ מברכים _____. Choose the pair meaning 'our parents bless us'.","שלנו; אותנו","שלהם; אותם","שלי; אותי","שלך; אותך"],
[34,"name.1","Reading • כך התחיל הכול","Read: הוא קרא לכל בעלי החיים ואמר למלאכים: 'עכשיו אתם צריכים לתת שם מתאים לכל בעל חיים!' Who was asked to name the animals?","המלאכים","המלך","התלמידים","הימאים"],
[34,"name.2","Reading • כך התחיל הכול","Read: אני יכול להמשיך? Why did the first human want to continue?","לתת שמות לבעלי החיים","לשלוח כרטיסי ברכה","ללמוד נורווגית","לספר סיפור אהבה"],
[36,"wedding.1","Word choice • טקסי חתונה בתרבויות שונות","אנשים רבים ש_____ (נוסעים / מפנים) מסביב לעולם חוקרים תרבויות שונות.","נוסעים","מפנים","נעים","מספרים"],
[36,"wedding.2","Word choice • טקסי חתונה בתרבויות שונות","החברים _____ (משתמשים / חוגגים) את האירוע.","חוגגים","משתמשים","מפסיקים","מבינים"],
[36,"wedding.3","Word choice • טקסי חתונה בתרבויות שונות","בסוף הטקס כולם אומרים _____ (כלות / ברכות), כמו 'מזל טוב'.","ברכות","כלות","תפילות","מילים"]
]};
const explanations={"vocab.1":"עגנה means docked; the opening sentence says the ship docked in a small fishing port.","vocab.2":"ריקים means empty; the narrator walked the empty streets and met no one.","verb.1":"קולות is plural, so the story uses נשמעו: the sounds were heard from upstairs.","verb.2":"כל שנה marks repetition; היתה משמיעה is the story's habitual past form.","vocab.3":"הסבירה means she explained; the woman explained the record in the little English she knew.","meaning.1":"The woman died ten years earlier and left the record; the Norwegian woman plays it in her memory."};
window.HEBREW_TEXTBOOK_QUESTION_BANKS=Object.assign(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{},Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],...(Number(level)===36?{practiceOrigin:"Supplemental lesson practice · source sentence on PDF 214",explanation:explanations[sourceExercise]}:{})}))])));
})();
