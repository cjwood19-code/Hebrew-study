/* ללמוד עברית ברמה ב׳ unit 4; indexed PDF pages 48, 50, 52–53. */
(function(){'use strict';
const make=(sourcePage,sourceExercise,category,prompt,answer,others,explanation,practiceOrigin)=>({sourcePage,sourceExercise,category,prompt,answer,options:[answer,...others],explanation,practiceOrigin});
const reading='Supplemental vocabulary from the cited reading; choices adapted for scoring';
const chart='Supplemental form recognition from the printed future-tense chart';
const printed='Printed exercise; answer choices adapted for scoring';
const bank=[
 make(48,'reading.vocab.fork','Vocabulary in context','ביום הראשון לקח ממנו מזלג. What does מזלג mean?','fork',['spoon','bowl','lamp'],'מזלג הוא הכלי שהאיש שאל מן השכן ביום הראשון.',reading),
 make(48,'reading.vocab.pot','Vocabulary in context','ביום השני שאל ממנו סיר. What does סיר mean?','pot',['plate','knife','fork'],'סיר הוא הכלי שהאיש שאל ביום השני והחזיר ממנו שני סירים.',reading),
 make(48,'reading.vocab.bowl','Vocabulary in context','ביום השלישי לקח מהשכן קערת עץ. What does קערה mean?','bowl',['cup','chair','spoon'],'קערה היא bowl; בסיפור האיש שאל קערת עץ.',reading),
 make(48,'reading.vocab.lamp','Vocabulary in context','האיש ביקש מנורת כסף לשבת. What does מנורה mean?','lamp',['table','door','window'],'מנורה היא lamp; האיש ביקש מנורת כסף מן השכן.',reading),
 make(48,'reading.vocab.neighbor','Vocabulary in context','התפלא השכן מאוד. What does השכן mean?','the neighbor',['the teacher','the student','the buyer'],'השכן הוא האדם שנתן לאיש את הכלים ואת מנורת הכסף.',reading),
 make(52,'feel.future.root','שורש • printed verb chart','מה השורש של להרגיש בטבלת הפועל?','רגש',['גרש','רגל','רגיל'],'בטבלת להרגיש השורש במרכז הוא ר־ג־ש.',chart),
 make(52,'feel.future.he','עתיד • printed verb chart','לפי טבלת להרגיש: הוא _____ בעתיד.','ירגיש',['תרגיש','נרגיש','הרגיש'],'בטבלת העתיד של להרגיש, הצורה של הוא היא ירגיש.',chart),
 make(52,'feel.future.she','עתיד • printed verb chart','לפי טבלת להרגיש: היא _____ בעתיד.','תרגיש',['ירגיש','נרגיש','הרגישה'],'בטבלת העתיד של להרגיש, הצורה של היא היא תרגיש.',chart),
 make(52,'feel.future.we','עתיד • printed verb chart','לפי טבלת להרגיש: אנחנו _____ בעתיד.','נרגיש',['תרגישו','ירגישו','הרגשנו'],'בטבלת העתיד של להרגיש, הצורה של אנחנו היא נרגיש.',chart),
 make(52,'feel.future.they','עתיד • printed verb chart','לפי טבלת להרגיש: הם _____ בעתיד.','ירגישו',['תרגישו','נרגיש','הרגישו'],'בטבלת העתיד של להרגיש, הצורה של הם היא ירגישו.',chart),
 make(50,'construct.2.1','סמיכות • printed transformation','כתבו בסמיכות: מנורה לשולחן','מנורת שולחן',['מנורה שולחן','מנורת השולחן','מנורות שולחן'],'מנורה נעשית מנורת לפני שם העצם השני: מנורת שולחן.',printed),
 make(50,'construct.2.4','סמיכות • printed transformation','כתבו בסמיכות: קערה מעץ','קערת עץ',['קערה עץ','קערת העץ','קערות עץ'],'קערה נעשית קערת בצירוף הסמיכות קערת עץ.',printed),
 make(53,'feel.infinitive','Vocabulary in context','בטבלת הפועל כתוב להרגיש. What does להרגיש mean?','to feel',['to arrange','to buy','to believe'],'להרגיש הוא שם הפועל של השורש ר־ג־ש שבטבלת היחידה.',chart),
 make(48,'reading.vocab.believe','Vocabulary in context','מדוע אינך מאמין שמנורה יכולה למות? What does מאמין mean?','believes',['arranges','sells','returns'],'מאמין פירושו believes; האיש מזכיר לשכן במה האמין קודם.',reading),
 make(52,'construct.3.1','סמיכות • printed completion','האיש ביקש משכנו את _____ לכבוד שבת.','מנורת הכסף',['מנורת כסף','מנורה כסף','מנורות הכסף'],'אחרי את יש צירוף מיודע: מנורת הכסף. כך מורה הערת התרגיל על ה׳ הידיעה.',printed),
 make(52,'construct.3.8','סמיכות • printed completion','לכבוד האורחים פתחתי _____ חדש.','בקבוק יין',['בקבוקי יין','בקבוקים יין','בקבוק היין'],'הצירוף בקבוק יין נלקח מרשימת התרגיל; חדש מתאים לבקבוק היחיד.',printed),
 make(52,'construct.3.9','סמיכות • printed completion','הנסיך מצא על המדרגות את _____ של סינדרלה.','נעל הזכוכית',['נעל זכוכית','נעלי הזכוכית','נעל זכוכיות'],'אחרי את נדרש צירוף מיודע: נעל הזכוכית של סינדרלה.',printed)
];
for(const q of bank)if(q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 4 option schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[21]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[21];if(checks.length!==3)throw Error('Unit 4 interpretation checks changed');
const notes=[
 'ביום הראשון מציין את היום הראשון; לקח ממנו מזלג והחזיר שני מזלגות.',
 'ביום השני מציין את היום השני; שאל סיר והחזיר שני סירים.',
 'ביום השלישי מציין את היום השלישי; לקח קערת עץ והחזיר שתי קערות.'
];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=notes[i];});
})();
