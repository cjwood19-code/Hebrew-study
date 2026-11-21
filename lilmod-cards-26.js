/* Unit 9 contextual flashcards: examples are original sentences from the scanned reading. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['נודדים','nomadic / move from place to place','יש עדיין כמה שבטים שקשה להגיע אליהם, מפני שהם נודדים ממקום למקום.','There are still tribes difficult to reach because they move from place to place.'],
 ['מדבר','desert','ממשלת אוסטרליה החליטה ללמד אותם, ופתחה בית ספר באמצע המדבר.','The Australian government decided to teach them and opened a school in the middle of the desert.'],
 ['מחברות','notebooks','פעם בשבועיים מגיעה למקום מכונית שמביאה מחברות, עפרונות, מזון ותרופות.','Every two weeks a vehicle arrives carrying notebooks, pencils, food, and medicine.'],
 ['להתרחץ','to wash oneself','כל בוקר חייבים הילדים להתרחץ לפני תחילת הלימודים.','Every morning the children must wash before classes begin.'],
 ['תנינים','crocodiles','לא יכול היה לעבור את הנחל, מפני שהיו בו תנינים רבים.','He could not cross the stream because there were many crocodiles in it.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-9-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 9 card '+id);cards.push({id,he,en,chapter:26,sourcePage:109,book:'ללמוד עברית ברמה ב׳ • unit 9',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
