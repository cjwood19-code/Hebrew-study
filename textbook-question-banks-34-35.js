/* Units 17–18 of the scanned ללמוד עברית ברמה ב׳, PDF pages 197–213.
   Passage-dependent exercises are shown with source Hebrew in Reading Practice. */
(function(){"use strict";
const rows={
34:[
[199,"noun.1","Nouns • שם עצם","לברך — _____. Choose the noun requested in the printed exercise.","ברכה","עבודה","מנוחה","דאגה"],
[199,"noun.2","Nouns • שם עצם","לעבוד — _____. Choose the noun requested in the printed exercise.","עבודה","ברכה","מנוחה","עצה"],
[199,"noun.4","Nouns • שם עצם","לחסל — _____. Choose the noun requested in the printed exercise.","חיסול","עבודה","עצה","התחלה"],
[200,"infinitive.1","Verb forms • שם הפועל","בוקר טוב כיפה אדומה. סבתא חולה מאוד. _____ מהר. (לקום)","קומי","קום","קמים","קמת"],
[200,"infinitive.2","Verb forms • שם הפועל","סל, _____ בו אוכל ויין לסבתא. (לשים)","שימי","שים","שמו","שמים"],
[200,"infinitive.3","Verb forms • שם הפועל","כיפה אדומה, _____ בדרך. (להיזהר)","היזהרי","היזהר","נזהר","הזהירו"],
[200,"infinitive.4","Verb forms • שם הפועל","כיפה אדומה, _____ את החלונות. (לפתוח)","פתחי","פתח","פותחת","תפתחו"],
[200,"infinitive.5","Verb forms • שם הפועל","כיפה אדומה, _____ את הדלת. (לסגור)","סגרי","סגור","סוגרת","סגרו"],
[202,"habitual.1","Habitual action • היה + בינוני","כל שבוע _____ עם יוסי לטייל בכפר. (ללכת)","הייתי הולך","הלכתי","אלך","הולך"],
[202,"habitual.2","Habitual action • היה + בינוני","משם _____ אל המספרה. (להמשיך)","היינו ממשיכים","נמשיך","המשכנו","ממשיכים"],
[202,"habitual.3","Habitual action • היה + בינוני","את הטיול _____ תמיד בבית של יוסי. (לגמור)","היינו גומרים","נגמור","גמרנו","גומרים"],
[203,"opposite.1","Opposites • כתבו את ההפך","עושר — _____. Choose the opposite in the printed exercise.","עוני","עבודה","עצה","עונה"],
[203,"opposite.2","Opposites • כתבו את ההפך","שבע — _____. Choose the opposite.","רעב","שבוע","שביתה","שובע"],
[203,"opposite.3","Opposites • כתבו את ההפך","קללה — _____. Choose the opposite.","ברכה","עבודה","עוני","דאגה"],
[204,"choice.1","Word choice • בחרו במילה הנכונה","קרזוס אמר לסולון, שהוא שמע על _____ הרבה. (החכמה / חכמתו / חכמה)","חכמתו","החכמה","חכמה","חכמים"],
[204,"choice.2","Word choice • בחרו במילה הנכונה","סולון חי ביוון _____. (העתק / עתיקה / העתיקה)","העתיקה","העתק","עתיקה","עתקים"],
[204,"choice.3","Word choice • בחרו במילה הנכונה","הצעיר ביקש מהמלך את בתו _____. (יפה / היפה / יופיה)","היפה","יפה","יופיה","יפי"],
],
35:[
[208,"comparison.1","Comparison • שמות עצם","הלווייתן הוא התינוק הארוך ביותר בעולם. _____ גופו מגיע לכמה מטרים.","אורך","גובה","עומק","רוחב"],
[208,"comparison.2","Comparison • שמות עצם","האוקיינוס השקט הוא האוקיינוס העמוק ביותר בעולם. במספר מקומות מגיע _____ המים לכמה ק״מ.","עומק","גובה","אורך","רוחב"],
[208,"measurement.1","Measurement • מידות","כדי למצוא את הנפח של עצם, צריך להכפיל: _____ × _____ × _____.","אורך × רוחב × גובה","גובה × גיל × זמן","רוחב × משקל × גיל","עומק × זמן × מהירות"],
[209,"notice.1","Notice • בינוני פעול","המסעדה _____ כל יום מ־11.00 עד 23.00. (לפתוח)","פתוחה","פותחת","נפתחת","פתחה"],
[209,"notice.2","Notice • בינוני פעול","הכלים אינם _____. (לשטוף)","שטופים","שוטפים","שטפו","ישטפו"],
[210,"comparison.1","Comparison • דומה ל / שונה מ","הלווייתן _____, כי הוא חי במים כמוהם, אבל הוא אינו דג.","דומה לדגים","שונה מדגים","שווה דגים","גדול מדגים"],
[210,"comparison.2","Comparison • דומה ל / שונה מ","מערכת הנשימה של הלווייתן _____ הדגים.","שונה מזו של","דומה לכל","גדולה בתוך","שווה כמו"],
[210,"comparison.3","Comparison • דומה ל / שונה מ","דני אוהב לטייל בעולם. אתה _____. אתה אוהב להישאר בבית.","שונה ממנו","דומה לו","גדול ממנו","אוכל כמוהו"],
[211,"kaf.1","Comparison • כ","הלווייתן הקטן שוקל כחצי טון. What does כ mean here?","approximately","because","toward","without"],
[211,"kaf.2","Comparison • כ","תקופת ההיריון אצל הלווייתן נמשכת כשנה. What does כ mean here?","about","like","when","from"],
[211,"kaf.3","Comparison • כ","מערכת הנשימה של הלווייתן היא כשל האדם. What does כ mean here?","like that of","approximately","before","instead of"],
[212,"choice.1","Word choice • המילה הנכונה","ה_____ של הלווייתן נמשך כשנה. (תינוק / היריון / משקל)","היריון","תינוק","משקל","אורך"],
[212,"choice.2","Word choice • המילה הנכונה","האם מניקה את התינוק, והתינוק _____ מאמו.","יונק","אוכל","שותה","עף"],
[212,"choice.3","Word choice • המילה הנכונה","מערכת הנשימה שלו שונה מזו של הדגים. Which answer has the same meaning?","מערכת הנשימה שלו אינה כמו זו של הדגים","מערכת הנשימה שלו היא כמו זו של הדגים","הוא אינו נושם","הדגים אינם חיים במים"]
]};
const explanations={
  noun:"The unit 17 noun exercise changes a verb into its related noun.",
  infinitive:"The Red Riding Hood exercise addresses כיפה אדומה directly, so use the feminine singular imperative.",
  habitual:"The unit 17 exercise uses היה plus a present participle for a repeated past action.",
  opposite:"The unit 17 opposite exercise asks for the contrasting word.",
  choice:"Choose the word that fits the Hebrew sentence and the unit's word exercise.",
  comparison:"The unit 18 exercise compares likeness or difference; keep the Hebrew preposition with the comparison.",
  measurement:"The measurement exercise gives volume as length times width times height.",
  notice:"The restaurant notice distinguishes a resulting state from an active action.",
  kaf:"In the unit 18 כ exercise, its meaning depends on the phrase: approximation or likeness."
};
window.HEBREW_TEXTBOOK_QUESTION_BANKS=Object.assign(window.HEBREW_TEXTBOOK_QUESTION_BANKS||{},Object.fromEntries(Object.entries(rows).map(([level,items])=>[level,items.map(([sourcePage,sourceExercise,category,prompt,answer,a,b,c])=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,a,b,c],practiceOrigin:"Supplemental lesson practice · adapted choices",explanation:explanations[sourceExercise.split('.')[0]]||"The answer follows the Hebrew sentence and the cited unit exercise."}))])));
})();
