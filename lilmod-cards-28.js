/* Context cards from unit 11's original travel reading. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['מקומות מיוחדים','unusual places','יותר ויותר תיירים מעוניינים לבקר במקומות מיוחדים בעולם.','More and more tourists want to visit unusual places in the world.'],
 ['אנשי השבט','the tribe members','אנשי השבט הראו לתיירים את כפרם, רקדו לכבודם, ואף הגישו להם לארוחה בשר צלוי.','The tribe members showed the tourists their village, danced for them, and served roasted meat.'],
 ['תייר בודד','a lone tourist','היא מביאה תייר בודד לאי שאין בו אנשים.','It takes a lone tourist to an island without people.'],
 ['מים ומזון','water and food','הוא צריך למצוא מים ומזון ואף לבנות בעצמו את ביתו.','He must find water and food and even build his own house.'],
 ['בסכנה','in danger','רק אם התייר יחשוב שהחיים שלו בסכנה, הוא יכול לבקש מאנשי החברה שיעזרו לו.','Only if the tourist thinks his life is in danger may he ask the company staff for help.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-11-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 11 card '+id);cards.push({id,he,en,chapter:28,sourcePage:132,book:'ללמוד עברית ברמה ב׳ • unit 11',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
