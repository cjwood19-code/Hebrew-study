/* Context cards from the original unit 12 colors reading, PDF page 143. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['השפעה מרגיעה','a calming effect','לירוק, למשל, יש השפעה מרגיעה, לכן החליפו את הלוחות השחורים בבתי הספר בלוחות ירוקים, ובאמת, הילדים לומדים טוב יותר.','Green has a calming effect; after schools replaced blackboards with green boards, the children learned better.'],
 ['צבעו את הקירות','they painted the walls','במסעדה אחת ערכו ניסוי: צבעו את הקירות בירוק, ושמו לב כי אנשים שבאו למסעדה, נשארו לשבת גם אחרי שגמרו לאכול.','In one restaurant they conducted an experiment: they painted the walls green and noticed that people stayed after eating.'],
 ['הציפורים','the birds','רעל זה מסכן גם את הציפורים, וכדי שהן לא יאכלו את הרעל, צובעים אותו בצבעים שהן אינן אוהבות.','This poison also endangers the birds, so it is colored in colors they dislike to keep them from eating it.'],
 ['מפני סכנה','of danger','יוצא מזה שלאדום יש השפעה הפוכה, כלומר הוא מעורר, ולכן נוהגים להשתמש בו, כאשר רוצים להזהיר מפני סכנה.','Red has the opposite effect: it stimulates, so it is used to warn of danger.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-12-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 12 card '+id);cards.push({id,he,en,chapter:29,sourcePage:143,book:'ללמוד עברית ברמה ב׳ • unit 12',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
