/* Original contextual sentences from the scanned unit 10 legend. */
(function(){'use strict';const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
const rows=[
 ['האגדה','the legend','האגדה מספרת שסולימן הוא שחשף את הכותל המערבי, שעד אז היה מכוסה עפר.','The legend says Suleiman uncovered the Western Wall, which until then had been covered with earth.'],
 ['ערמות אשפה','piles of refuse','הוא הסתכל החוצה, וראה ערמות אשפה ענקיות.','He looked outside and saw enormous piles of refuse.'],
 ['מטבעות זהב','gold coins','הוא פיזר מטבעות זהב על ערמות האשפה.','He scattered gold coins on the refuse piles.'],
 ['הנוצצים','the shining ones','בבוקר אספו אנשים את מטבעות הזהב הנוצצים, והתחילו לחפור כדי למצוא מטבעות נוספים.','In the morning people collected the shining gold coins and began digging for more.'],
 ['לחשוף','to uncover','הסולטן שהצטער על המנהג המכוער, החליט לחשוף את החומה.','The sultan, distressed by the ugly custom, decided to uncover the wall.']
];
rows.forEach(([he,en,exampleHe,exampleEn],i)=>{const id='lilmod-10-'+String(i+1).padStart(3,'0');if(cards.some(c=>c.id===id)||!exampleHe.includes(he))throw Error('Unit 10 card '+id);cards.push({id,he,en,chapter:27,sourcePage:119,book:'ללמוד עברית ברמה ב׳ • unit 10',exampleHe,exampleEn,exampleKind:'Textbook sentence'});});
})();
