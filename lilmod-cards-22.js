/* Unit 5 flashcards with sentences from the printed clinic reading. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['lilmod-5-001','קופת חולים','health clinic',61,'הלכתי לקופת חולים כדי לקבל תוצאות של בדיקת דם.','I went to the clinic to get blood test results.'],
 ['lilmod-5-002','חדר ההמתנה','waiting room',61,'בחדר ההמתנה ישבו כבר עשרה אנשים וחיכו בתור.','Ten people were already in the waiting room.'],
 ['lilmod-5-003','שותקת','is silent',61,'לי יש באמת מחלה רצינית - ואני שותקת.','I really have a serious illness, and I am silent.'],
 ['lilmod-5-004','מחלת לב','heart disease',61,'אני חולה במחלת לב קשה, ואני צריכה לעבור ניתוח בבית חולים.','I have a serious heart disease and need surgery in a hospital.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Invalid unit 5 card '+id);cards.push({id,he,en,chapter:22,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 5',exampleHe,exampleEn,exampleKind:'Textbook sentence'});}
})();
