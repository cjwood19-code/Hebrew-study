/* Context cards from unit 14 source sentences, PDF pages 165–166. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['לצוד ציד','to hunt game','אריה, זאב ושועל יצאו יחד לצוד ציד.','A lion, wolf, and fox went out together to hunt.',165],
 ['חלק את השלל','divide the spoils','עכשיו, חלק את השלל בינינו!','Now divide the spoils among us!',165],
 ['נסתפק בשפן','we will be content with the rabbit','אני והזאב נסתפק בשפן.','The wolf and I will be content with the rabbit.',165],
 ['הארנבת רצה על חייה','the rabbit runs for its life','כי השועל רץ עבור ארוחת ערב, והארנבת רצה על חייה.','The fox runs for dinner, but the rabbit runs for its life.',166]
];
rows.forEach(([he,en,exampleHe,exampleEn,sourcePage],i)=>{const id='lilmod-14-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 14 card '+id);cards.push({id,he,en,chapter:31,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 14',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
