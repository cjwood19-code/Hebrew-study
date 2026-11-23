/* Chapter 38 context checked against the user's scan, PDF pages 38 and 62. */
(function(){'use strict';
const cards=window.HEBREW_GENERAL_FLASHCARDS;
const rows={
 'shnayim-2-001':['מחר כדאי לצאת לדרך ארוכה.','Tomorrow it is worthwhile to set out on a long journey.','Supplemental example from chapter 2 vocabulary'],
 'shnayim-2-002':['ואפילו שלחו הביתה מכתבים.','They even sent letters home.','Textbook excerpt • PDF 38'],
 'shnayim-2-003':['קהילה — קבוצה של אנשים שחיים ביחד.','Community: a group of people who live together.','Textbook matching pair • PDF 62'],
 'shnayim-2-004':['תושב — מישהו שגר וחי במקום מסוים.','Resident: someone who lives in a particular place.','Textbook matching pair • PDF 62']
};
for(const [id,[exampleHe,exampleEn,exampleKind]] of Object.entries(rows)){
 const card=cards.find(c=>c.id===id);
 if(!card||!exampleHe.includes(card.he))throw Error('Chapter 38 card '+id);
 Object.assign(card,{exampleHe,exampleEn,exampleKind});
}
})();
