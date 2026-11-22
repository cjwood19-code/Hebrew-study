/* Context flashcards from unit 16's scanned original readings. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['הקופאי','the cashier','הקופאי לא נהרג, הוא רק נפצע.','The cashier was not killed; he was only injured.',187],
 ['ונמלטו','and they escaped','אחר כך לקחו השודדים את הכסף, ונמלטו מן המקום במכונית.','Afterward the robbers took the money and escaped from the place by car.',187],
 ['הברווזונים','the ducklings','אך ג׳ק לא רצה לדרוס את הברווזונים הקטנים ועצר.','But Jack did not want to run over the little ducklings and stopped.',187],
 ['נפרצה','was broken into','היא ראתה שהדלת נפרצה, הארונות נפתחו, וכל הבגדים נזרקו על הרצפה.','She saw that the door had been forced open, the cupboards opened, and the clothes thrown on the floor.',191]
];
rows.forEach(([he,en,exampleHe,exampleEn,sourcePage],i)=>{const id='lilmod-16-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 16 card '+id);cards.push({id,he,en,chapter:33,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 16',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
