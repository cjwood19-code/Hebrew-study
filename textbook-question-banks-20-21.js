/* Source-checked ללמוד עברית ברמה ב׳ units 3–4, PDF pages 35–60. Reading prompts include the excerpt needed to answer. */
(function(){'use strict';
const rows={"20":"Vocabulary|35|What does מצרכים mean?|groceries / supplies|teachers|letters|mountains\nVocabulary|35|What does מדפים mean?|shelves|streets|days|books\nVocabulary|35|What does שכונה mean?|neighborhood|market basket|classroom|letter\nVocabulary|35|What does לשוחח mean?|to converse|to close|to arrive|to build\nVocabulary|35|What does להתיידד mean?|to become friends|to be late|to sleep|to travel\nPlural agreement|38|Complete the plural: פרי טעים → ___.|פירות טעימים|פרים טעימות|פרי טעימים|פירות טעים\nPlural agreement|38|Complete the plural: כוס גבוהה → ___.|כוסות גבוהות|כוסים גבוהים|כוסות גבוהים|כוס גבוהה\nPlural agreement|38|Complete the plural: עין כחולה → ___.|עיניים כחולות|עינים כחולים|עין כחולות|עיניים כחולים\nPlural agreement|38|Complete the plural: ציפור קטנה → ___.|ציפורים קטנות|ציפורות קטנים|ציפור קטנות|ציפורים קטן\nPlural agreement|38|Complete the plural: שנה טובה → ___.|שנים טובות|שנות טובים|שנה טובות|שנים טוב\nVerb conjugation|40|Complete: הוא ___ על יד בית הספר (לגור).|גר|גרים|גרה|תגור\nVerb conjugation|40|Complete: הם ___ שירים חדשים (לשיר).|שרים|שר|שרה|שרנו\nVerb conjugation|40|Complete: אתם ___ מאוד בשמים (לעוף).|עפים|עף|עפה|עפות\nModal + infinitive|43|Complete: ___ ללמוד עברית בחנות המכולת.|אפשר|אתמול|על־ידי|בשבוע\nModal + infinitive|43|Complete: ___ לקנות מצרכים בשוק.|כדאי|כדאיות|קשים|קשה\nGrammar recognition|43|Which word means 'forbidden / not allowed' before an infinitive?|אסור|קל|טוב|נעים\nGrammar recognition|43|Which word means 'difficult' in קשה ללמוד?|קשה|אפשר|כדאי|מותר","21":"Vocabulary|48|What does מזלג mean?|fork|spoon|bowl|lamp\nVocabulary|48|What does סיר mean?|pot|plate|knife|fork\nVocabulary|48|What does קערה mean?|bowl|cup|chair|spoon\nVocabulary|48|What does מנורה mean?|lamp|table|door|window\nVocabulary|48|What does השכן mean?|the neighbor|the teacher|the student|the buyer\nRoot recognition|53|Which root is shown for להרגיש?|רגש|גרש|רגל|רגיל\nVerb conjugation|53|Complete: אני ___ טוב היום (להרגיש).|מרגיש|מרגישים|תרגיש|הרגישו\nVerb conjugation|53|Complete: היא ___ טוב היום (להרגיש).|מרגישה|מרגיש|מרגישים|הרגיש\nVerb conjugation|53|Complete: הם ___ טוב היום (להרגיש).|מרגישים|מרגישה|מרגיש|תרגיש\nVerb conjugation|53|Complete: מחר אנחנו ___ טוב (להרגיש).|נרגיש|מרגישים|הרגשנו|תרגיש\nFuture tense|53|Complete: המורה הסביר לי את התרגיל, ואני ___ אותו מחר.|אבין|הבנתי|מבין|הבינו\nFuture tense|53|Complete: הרופא הציע לך לנסוע לחופשה. מחר אתה ___ על ההצעה.|תחשוב|חשבתי|חושבת|חושבים\nVocabulary|53|What does להרגיש mean?|to feel|to arrange|to buy|to believe\nVocabulary|48|What does מאמין mean?|believes|arranges|sells|returns\nGrammar|52|Which word completes: האיש ביקש מהשכן ___ מנורת כסף.|את|על|עם|ל־\nGrammar|52|Complete: הילד שבר את ___ של התינוק.|הצעצוע|צעצועים|צעצוע|צעצועות\nGrammar|52|Complete: לכבוד האורחים פתחתי ___ חדש.|בקבוק יין|בקבוקי יין|בקבוקים יין|בקבוק היין"};
const banks=window.HEBREW_TEXTBOOK_QUESTION_BANKS||(window.HEBREW_TEXTBOOK_QUESTION_BANKS={});
for(const [level,raw] of Object.entries(rows)){
 banks[level]=raw.split('\n').filter(line=>!line.startsWith('Reading with context|')).map(line=>{const [category,page,prompt,answer,...other]=line.split('|');const options=[answer,...other];if(options.length!==4||new Set(options).size!==4||!prompt||!answer)throw Error('Invalid question '+level);return {category,sourcePage:Number(page),prompt,answer,options};});
}
})();
/* The remaining checks practice vocabulary and patterns shown on the cited pages.
   Passage questions live with the actual readings in Reading Practice. */
(function(){'use strict';
const notes={
  20:{
    'groceries / supplies':'מצרכים are the things shoppers put in the cart in the unit 3 supermarket passage.',
    shelves:'מדפים are the shelves shoppers walk between in the supermarket passage.',
    neighborhood:'שכונה means neighborhood; the small grocery lets shoppers meet people מהשכונה.',
    'to converse':'לשוחח means to converse; the passage says shoppers can speak with neighbors.',
    'to become friends':'להתיידד means to become friends; it follows להכיר אותם in the reading.',
    'פירות טעימים':'פרי becomes פירות, and the adjective agrees in masculine plural as טעימים.',
    'כוסות גבוהות':'כוס becomes כוסות; גבוהה becomes גבוהות to agree with the feminine plural.',
    'עיניים כחולות':'עין becomes עיניים; כחולה becomes כחולות to agree in feminine plural.',
    'ציפורים קטנות':'ציפור becomes ציפורים; קטנה becomes קטנות to agree with the feminine plural.',
    'שנים טובות':'שנה becomes שנים; טובה becomes טובות to agree with the plural noun.',
    גר:'הוא takes the masculine singular present form גר of לגור.',
    שרים:'הם takes the masculine plural present form שרים of לשיר.',
    עפים:'אתם takes the masculine plural present form עפים of לעוף.',
    אפשר:'אפשר plus an infinitive means that an action is possible: אפשר ללמוד.',
    כדאי:'כדאי plus an infinitive expresses that an action is advisable: כדאי לקנות.',
    אסור:'אסור before an infinitive means the action is forbidden.',
    קשה:'קשה ללמוד means it is difficult to learn; קשה describes the difficulty.'
  },
  21:{
    fork:'מזלג is the fork borrowed on the first day of the unit 4 story.',
    pot:'סיר is the pot borrowed on the second day of the story.',
    bowl:'קערה is a bowl; the story specifies קערת עץ, a wooden bowl.',
    lamp:'מנורה is a lamp; the neighbor later lends a מנורת כסף.',
    'the neighbor':'השכן means the neighbor, the person lending the utensils.',
    רגש:'The unit shows להרגיש with the three-letter root ר־ג־ש.',
    מרגיש:'With אני, the present form of להרגיש is מרגיש for a masculine speaker.',
    מרגישה:'With היא, the present form of להרגיש is מרגישה.',
    מרגישים:'With הם, the present form of להרגיש is מרגישים.',
    נרגיש:'מחר calls for the future; with אנחנו, להרגיש becomes נרגיש.',
    אבין:'מחר calls for the future; with אני, להבין becomes אבין.',
    תחשוב:'מחר calls for the future; with אתה, לחשוב becomes תחשוב.',
    'to feel':'להרגיש is the infinitive “to feel,” shown with its conjugation chart.',
    believes:'מאמין means believes; the story contrasts belief that utensils can have children with disbelief that a lamp can die.',
    את:'את marks the definite direct object: ביקש מהשכן את מנורת הכסף.',
    הצעצוע:'The direct object is definite, so את הצעצוע של התינוק completes the sentence.',
    'בקבוק יין':'בקבוק יין חדש is a new bottle of wine; חדש agrees with masculine singular בקבוק.'
  }
};
for(const level of [20,21])for(const q of window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]){
 q.practiceOrigin='Adapted lesson practice';q.explanation=notes[level][q.answer];
 if(!q.explanation)throw Error('Missing unit explanation: '+level+' / '+q.prompt);
}
})();
