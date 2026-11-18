/* Unit 2 words in the source reading and completed printed exercises. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['lilmod-2-001','אבנים','stones',24,'האיש התפלא מדוע יש כל כך הרבה אבנים בירושלים.','The man wondered why there were so many stones in Jerusalem.'],
 ['lilmod-2-002','דמעה','tear',24,'עם כל דמעה הרגישו שירדה להם אבן מהלב.','With each tear, they felt a stone fall from their heart.'],
 ['lilmod-2-003','סידרנו','we arranged / tidied',29,'ביום שישי כולנו קמנו מוקדם, סידרנו את הבית לקראת שבת.','On Friday we all got up early and tidied the house for Shabbat.'],
 ['lilmod-2-004','בהן','in them (feminine)',34,'יש לנו שתי מכוניות, ואבא שלי מרשה לי לנהוג בהן.','We have two cars, and my father lets me drive them.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Invalid card '+id);cards.push({id,he,en,chapter:19,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 2',exampleHe,exampleEn,exampleKind:'Textbook sentence or printed exercise'});}
})();
