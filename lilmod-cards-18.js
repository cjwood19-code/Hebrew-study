/* Unit 1 words shown inside sentences from the reading and printed exercises. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['lilmod-1-001','להיכשל','to fail',11,'נבהל הסטודנט הצעיר, כי פחד להיכשל.','The young student was frightened because he feared failing.'],
 ['lilmod-1-002','לצום','to fast',11,'אתה יכול לתת להם דיאטה ארוכה וקלה או להציע להם לצום כמה ימים כדי לרזות.','You can give them a long, easy diet or suggest fasting for a few days to lose weight.'],
 ['lilmod-1-003','נכשלנו','we failed',16,'אנחנו עצובים! נכשלנו במבחן.','We are sad! We failed the exam.'],
 ['lilmod-1-004','כדאי','it is advisable',20,'כדאי לעשות דיאטה.','It is advisable to go on a diet.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Invalid card '+id);cards.push({id,he,en,chapter:18,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 1',exampleHe,exampleEn,exampleKind:'Textbook sentence or printed exercise'});}
})();
