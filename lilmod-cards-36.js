/* Context cards from the scanned Kol Nidrei reading, PDF 215. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['עגנה','docked','האונייה שלנו עגנה בנמל דייגים קטן בצפון נורווגיה.','Our ship docked in a small fishing port in northern Norway.'],
 ['הריקים','empty','טיילתי ברחובות הריקים של העיירה, ולא פגשתי איש.','I walked through the empty streets of the town and met no one.'],
 ['תקליט','record','על השולחן עמד פטיפון, והשירה נשמעה מתוך תקליט.','A record player stood on the table, and the singing came from a record.'],
 ['לזכר','in memory of','כל שנה ביום זה היא היתה משמיעה את התקליט לזכר בני משפחתה.','Every year on that day she would play the record in memory of her family.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-19-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 19 card '+id);cards.push({id,he,en,chapter:36,sourcePage:215,book:'ללמוד עברית ברמה ב׳ • unit 19',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
