/* Unit 6 flashcards with the original Sherlock Holmes reading in context. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['lilmod-6-001','בלש','detective',73,'שרלוק הולמס הוא בלש אנגלי מפורסם.','Sherlock Holmes is a famous English detective.'],
 ['lilmod-6-002','מונית','taxi',73,'פעם נסע הסופר במונית לבית מלון בפריס.','Once the writer rode in a taxi to a hotel in Paris.'],
 ['lilmod-6-003','מבטא','accent',73,'לפי הבגדים ולפי המבטא שלך אפשר לדעת כי אתה אנגלי.','Your clothes and accent show that you are English.'],
 ['lilmod-6-004','מזוודה','suitcase',73,'השם שלך כתוב על המזוודה.','Your name is written on the suitcase.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Invalid unit 6 card '+id);cards.push({id,he,en,chapter:23,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 6',exampleHe,exampleEn,exampleKind:'Textbook sentence'});}
})();
