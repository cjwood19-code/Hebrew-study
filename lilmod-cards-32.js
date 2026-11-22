/* Four context cards from unit 15's original reading, PDF page 179. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['להינשא','to marry','השניים התאהבו זה בזה, ורצו להינשא.','The two fell in love and wanted to marry.',179],
 ['על אף התנגדות משפחתה','despite her family’s opposition','הצעירה התחתנה עם הסטודנט על אף התנגדות משפחתה.','The young woman married the student despite her family’s opposition.',179],
 ['עברו לקנדה','moved to Canada','ולכן הם עזבו את אנגליה ועברו לקנדה.','So they left England and moved to Canada.',179],
 ['בית המשפט','the court','סיפר לכתבים שהוא מתכונן לפנות אל בית המשפט כדי להחזיר אליו את אשתו.','He told reporters he planned to turn to the court to bring his wife back.',179]
];
rows.forEach(([he,en,exampleHe,exampleEn,sourcePage],i)=>{const id='lilmod-15-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 15 card '+id);cards.push({id,he,en,chapter:32,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 15',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
