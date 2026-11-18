/* Unit 3 examples quote the visible reading or complete a printed transformation. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['lilmod-3-001','מכולת','small grocery',35,'כדאי לקנות בחנות המכולת ולא בסופרמרקט.','It is better to shop at the small grocery rather than the supermarket.'],
 ['lilmod-3-002','מדפים','shelves',35,'בסופרמרקט לוקחים עגלה, מסתובבים בין המדפים.','In the supermarket, shoppers take a cart and walk among the shelves.'],
 ['lilmod-3-003','לשוחח','to converse',35,'כאן אפשר לפגוש הרבה אנשים מהשכונה, לשוחח אתם.','Here one can meet many people from the neighborhood and converse with them.'],
 ['lilmod-3-004','לעוף','to fly',40,'נעים מאוד לעוף בשמים.','It is very pleasant to fly in the sky.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Invalid card '+id);cards.push({id,he,en,chapter:20,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 3',exampleHe,exampleEn,exampleKind:'Textbook sentence or printed exercise'});}
})();
