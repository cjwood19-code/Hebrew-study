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
[19, "habitual.1", "Habitual past • היה + בינוני", "סבא נתן לנכדים ממתקים. בכל חג _____ לנכדים ממתקים.", "היה נותן", "היתה נותנת", "ייתן", "נותנים"],
[19, "habitual.2", "Habitual past • היה + בינוני", "סבתא קראה לנכדים סיפורים מצחיקים. בכל חג _____ לנכדים סיפורים מצחיקים.", "היתה קוראת", "היה קורא", "תקרא", "קוראים"],
[19, "habitual.3", "Habitual past • היה + בינוני", "בני הדודים הקטנים ציירו כרטיסי ברכה. לפני כל חג _____ כרטיסי ברכה.", "היו מציירים", "היה מצייר", "יציירו", "מצייר"],
[23, "future.1", "Verb table • עתיד", "להקשיב — אני _____. Choose the future form from the printed table.", "אקשיב", "הקשבתי", "מקשיב", "יקשיב"],
[23, "future.2", "Verb table • עתיד", "להקשיב — את _____. Choose the future form from the printed table.", "תקשיבי", "הקשבת", "מקשיבה", "אקשיב"],
[25, "tense.1", "Verb tense • עבר / הווה / עתיד", "אני רוצה להזמין חברים למסיבת יום ההולדת. בעתיד: אני _____ חברים.", "אזמין", "הזמנתי", "מזמין", "יזמין"],
[25, "tense.2", "Verb tense • עבר / הווה / עתיד", "אתה צריך להתאים את הצבע של החולצה לצבע של הסוודר. בעבר: אתה _____ את הצבע.", "התאמת", "מתאים", "תתאים", "התאימה"],
[25, "tense.3", "Verb tense • עבר / הווה / עתיד", "את יכולה להחליט במהירות. בעתיד: את _____ במהירות.", "תחליטי", "החלטת", "מחליטה", "יחליט"],
[27, "negation.1", "Negative imperative • אל + עתיד", "אל _____ בזמן השיעור! (להפריע)", "תפריע", "הפרעת", "מפריע", "יפריע"],
[27, "negation.2", "Negative imperative • אל + עתיד", "אל _____ את המחשב, אם אתה לא צריך. (להדליק)", "תדליק", "הדלקת", "מדליק", "ידליק"],
[27, "negation.3", "Negative imperative • אל + עתיד", "אל _____ פתקים לתלמידים אחרים. (להעביר)", "תעביר", "העברת", "מעביר", "יעביר"],
[29, "wish.1", "Future wishes • שנה חדשה", "מורה: אני רוצה שהתלמידים החדשים לא _____. (להפריע)", "יפריעו", "הפריעו", "מפריעים", "להפריע"],
[29, "wish.2", "Future wishes • שנה חדשה", "רופא: אני דורש שהחולים שלי _____ כל הזמן. (להקשיב)", "יקשיבו", "הקשיבו", "מקשיבים", "להקשיב"],
[31, "relations.1", "Preposition table • דרך היחס", "ל־ בגוף ראשון יחיד: _____", "לי", "לך", "לו", "לנו"],
[31, "relations.2", "Preposition table • דרך היחס", "עם בגוף ראשון רבים: _____", "איתנו", "איתי", "איתם", "איתך"],
[33, "relations.3", "Prepositions • של / ל / עם / את", "אתם אוכלים ארוחה _____ חברים בבית _____? Choose “with / yours.”", "עם; שלכם", "את; שלהם", "של; איתנו", "ל; אותם"],
[33, "relations.4", "Prepositions • של / ל / עם / את", "ההורים _____ מברכים _____. Choose the forms for (אנחנו, אתם).", "שלנו; אתכם", "שלהם; אותם", "שלי; אותי", "שלך; אותך"]
]
};
const explanations={
  36:{"vocab.1":"עגנה means docked; the opening sentence says the ship docked in a small fishing port.","vocab.2":"ריקים means empty; the narrator walked the empty streets and met no one.","verb.1":"קולות is plural, so the story uses נשמעו: the sounds were heard from upstairs.","verb.2":"כל שנה marks repetition; היתה משמיעה is the story's habitual past form.","vocab.3":"הסבירה means she explained; the woman explained the record in the little English she knew.","meaning.1":"The woman died ten years earlier and left the record; the Norwegian woman plays it in her memory."},
  37:{"habitual.1":"בכל חג marks a repeated past event. סבא is masculine singular, so use היה נותן.","habitual.2":"בכל חג marks repetition. סבתא is feminine singular, so use היתה קוראת.","habitual.3":"לפני כל חג marks repetition. בני הדודים is masculine plural, so use היו מציירים.","future.1":"The printed future table gives אני אקשיב for להקשיב.","future.2":"The printed future table gives את תקשיבי for להקשיב.","tense.1":"The unit's three-tense exercise changes להזמין to אזמין with אני in the future.","tense.2":"The past form for אתה of להתאים is התאמת.","tense.3":"The future form for את of להחליט is תחליטי.","negation.1":"The printed אל + future pattern uses אל תפריע for a masculine singular addressee.","negation.2":"The printed אל + future pattern uses אל תדליק for a masculine singular addressee.","negation.3":"The printed אל + future pattern uses אל תעביר for a masculine singular addressee.","wish.1":"The teacher wishes that the new students will not interrupt: לא יפריעו.","wish.2":"The doctor demands that the patients listen: יקשיבו.","relations.1":"The printed relation table gives לי for ל־ with אני.","relations.2":"The printed relation table gives איתנו for עם with אנחנו.","relations.3":"עם means with; שלכם means yours for plural addressees in the lesson's relation exercise.","relations.4":"In the printed pair (אנחנו, אתם), שלנו means our and אתכם is the direct object you (plural)."}
};
window.HEBREW_TEXTBOOK_QUESTION_BANKS=Object.assign(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{},Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],practiceOrigin:Number(level)===37?(sourceExercise==="relations.3"?"Supplemental grammar from lesson relation table · PDF 33":"Printed grammar exercise · choices adapted"):"Supplemental lesson practice · source sentence on PDF 214",explanation:explanations[level][sourceExercise]}))])));
})();
