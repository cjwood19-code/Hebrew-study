/* Unit 4 words with context from the original reading. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['lilmod-4-001','מזלג','fork',48,'ביום הראשון לקח ממנו מזלג, והחזיר לו שני מזלגות.','On the first day he borrowed a fork and returned two forks.'],
 ['lilmod-4-002','סיר','pot',48,'ביום השני שאל ממנו סיר, והחזיר לו שני סירים.','On the second day he borrowed a pot and returned two pots.'],
 ['lilmod-4-003','קערת עץ','wooden bowl',48,'ביום השלישי לקח מהשכן קערת עץ, והחזיר לו שתי קערות.','On the third day he borrowed a wooden bowl and returned two bowls.'],
 ['lilmod-4-004','מנורת כסף','silver lamp',48,'ביום שישי אחרי הצהריים נכנס האיש אל השכן, וביקש ממנו מנורת כסף לשבת.','On Friday afternoon the man asked the neighbor for a silver lamp for Shabbat.']
];
for(const [id,he,en,sourcePage,exampleHe,exampleEn] of rows){if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Invalid card '+id);cards.push({id,he,en,chapter:21,sourcePage,book:'ללמוד עברית ברמה ב׳ • unit 4',exampleHe,exampleEn,exampleKind:'Textbook sentence'});}
})();
