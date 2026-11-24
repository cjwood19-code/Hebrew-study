/* Chapter 39 examples checked against the user's scan. */
(function(){'use strict';
const rows={
 'shnayim-3-001':['בנוף של ישראל יש הכול: שדות עם חקלאות, ...','Israel’s landscape has everything, including cultivated fields and more.','Selected textbook excerpt • PDF 66'],
 'shnayim-3-002':['אורך מכתש רמון הוא 40 קילומטרים.','The length of Makhtesh Ramon is 40 kilometers.','Textbook excerpt • PDF 70'],
 'shnayim-3-003':['במשך הזמן הוא התאהב בפסיפסים, למד על ההיסטוריה שלהם וחקר אותם.','Over time, he fell in love with mosaics, learned their history, and studied them.','Completed textbook cloze • PDF 74'],
 'shnayim-3-004':['גאולוגים חוקרים את האדמה ואת הימים של כדור הארץ.','Geologists study the earth and the seas of the planet.','Textbook excerpt • PDF 70']
};
for(const [id,[exampleHe,exampleEn,exampleKind]] of Object.entries(rows)){
 const card=window.HEBREW_GENERAL_FLASHCARDS.find(c=>c.id===id);
 if(!card||!exampleHe.includes(card.he))throw Error('Chapter 39 card '+id);
 Object.assign(card,{exampleHe,exampleEn,exampleKind});
}
})();
