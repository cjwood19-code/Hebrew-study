/* Source-checked vocabulary and context from lessons 34–35. Stable existing card IDs untouched. */
(function(){'use strict';
const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['ulpan4-34-001','מטופלת','is treated (feminine singular)',15,32,'היא מטופלת.','She is being treated.'],
 ['ulpan4-34-002','בוטלו','were canceled',15,32,'אשרות הכניסה שלהם בוטלו.','Their entry permits were canceled.'],
 ['ulpan4-34-003','לעומת','compared with',15,35,'שיעור (אחוז) המלח בים המלח הוא כ־33% לעומת כ־3.5% בים התיכון.','The Dead Sea is about 33% salt, compared with about 3.5% in the Mediterranean.'],
 ['ulpan4-35-001','מוזמנת','is invited (feminine singular)',16,40,'רחל מוזמנת לכוס קפה.','Rachel is invited for a cup of coffee.'],
 ['ulpan4-35-002','חוזה','contract',16,41,'חתמנו אתמול על החוזה.','We signed the contract yesterday.'],
 ['ulpan4-35-003','שיפוץ','renovation',16,41,'אנחנו רוצים לשפץ את הדירה ולהשקיע בשיפוץ.','We want to renovate the apartment and invest in the renovation.']
];
for(const [id,he,en,chapter,sourcePage,exampleHe,exampleEn] of rows){
 if(cards.some(c=>c.id===id))throw Error('Duplicate card '+id);
 if(!exampleHe.includes(he))throw Error('Example missing word '+id);
 cards.push({id,he,en,chapter,sourcePage,book:'אולפן עברית — חלק רביעי',exampleHe,exampleEn,exampleKind:'Textbook sentence'});
}
})();
