/* Context cards from original unit 13 reading, PDF pages 155–156. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['עבודה מעניינת','interesting work','אתה יוצא כל בוקר מהבית, עוסק בעבודה מעניינת, פוגש אנשים, מקבל כוס קפה ממזכירתך, משוחח, חוזר הביתה אחר הצהריים ובא לבית נקי ומסודר, מקבל ארוחה חמה וטעימה, קורא עיתון, מספר לאשתך מה עשית כל היום, רואה בטלוויזיה חדשות וגם סרטים, והולך לישון.','You leave home each morning, work, meet people, and come home to a tidy house.',155],
 ['עקרת בית','homemaker','ואני - רק עקרת בית.','And I am only a homemaker.',155],
 ['אני חוזרת הביתה','I return home','אני חוזרת הביתה בשעה 2.00.','I return home at two o’clock.',155],
 ['הטלוויזיה פתוחה','the television is on','הוא נכנס הביתה וראה שהטלוויזיה פתוחה, הרדיו מנגן, המנורה זרוקה על הרצפה, והשטיח מלא בוץ.','He came home and saw the television on, the radio playing, the lamp on the floor, and the carpet muddy.',156]
];
rows.forEach(([he,en,exampleHe,exampleEn,sourcePage],i)=>{const id='lilmod-13-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 13 card '+id);cards.push({id,he,en,chapter:30,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 13',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
