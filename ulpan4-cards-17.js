/* Lesson 36 source sentences; existing card IDs and review state stay intact. */
(function(){'use strict';
const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['ulpan4-36-001','שופץ','was renovated',44,'הבנק שופץ.','The bank was renovated.'],
 ['ulpan4-36-002','נחטף','was hijacked',49,'ב־27 ביוני 1976 נחטף מטוס של החברה הצרפתית ״אייר פראנס״.','On June 27, 1976, an Air France plane was hijacked.'],
 ['ulpan4-36-003','שוחררו','were released',49,'98 נוסעים, שהיו ישראלים או יהודים, לא שוחררו.','Ninety-eight passengers who were Israeli or Jewish were not released.'],
 ['ulpan4-36-004','נבנה','was built',53,'בית המקדש הראשון נבנה על־ידי שלמה המלך, בנו של דוד המלך.','The First Temple was built by King Solomon, King David’s son.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){
 if(cards.some(c=>c.id===id))throw Error('Duplicate card '+id);
 if(!exampleHe.includes(he))throw Error('Example missing word '+id);
 cards.push({id,he,en,chapter:17,sourcePage,book:'אולפן עברית — חלק רביעי',exampleHe,exampleEn,exampleKind:'Textbook sentence or printed exercise'});
}
})();
