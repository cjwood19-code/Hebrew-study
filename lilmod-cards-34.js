/* Source-sentence examples from unit 17's printed Solon reading, PDF 197. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['סולון','Solon','חכם גדול היה ביוון העתיקה ושמו סולון.','There was a great wise man in ancient Greece named Solon.'],
 ['עצות','advice','הוא היה עובר ממקום למקום, ונותן עצות לכל דורש.','He would travel from place to place and give advice to anyone who asked.'],
 ['העוני','poverty','הוא יחסל את העוני ואת הרעב מן הארץ.','He would eliminate poverty and hunger from the land.'],
 ['המנוחה','rest','כי רק אחרי עבודה קשה יודע האדם ליהנות מהמנוחה.','Only after hard work does a person know how to enjoy rest.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-17-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 17 card '+id);cards.push({id,he,en,chapter:34,sourcePage:197,book:'ללמוד עברית ברמה ב׳ • unit 17',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
