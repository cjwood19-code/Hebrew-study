/* Four contextual examples from unit 18's original whale reading, PDF 206. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['ריאות','lungs','יש לו ריאות, וכדי לנשום הוא חייב לעלות על פני המים כל 20 דקות בערך.','It has lungs, and to breathe it must come to the surface about every 20 minutes.'],
 ['לנשום','to breathe','יש לו ריאות, וכדי לנשום הוא חייב לעלות על פני המים כל 20 דקות בערך.','It has lungs, and to breathe it must come to the surface about every 20 minutes.'],
 ['יונק','nurses','הלווייתן התינוק יונק ממש כמו חיות היבשה.','The baby whale nurses just like land animals.'],
 ['פלנקטון','plankton','הלווייתן הענק אוכל צמחים קטנים (פלנקטון) שצפים במים.','The giant whale eats small plants (plankton) that float in the water.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-18-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 18 card '+id);cards.push({id,he,en,chapter:35,sourcePage:206,book:'ללמוד עברית ברמה ב׳ • unit 18',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
