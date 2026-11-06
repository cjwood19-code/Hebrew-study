/* Source-sentence Hebrew interpretation checks for units 15–16. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
  32:[
    make(179,"הצעירה התחתנה עם הסטודנט על אף התנגדות משפחתה.","The young woman married the student despite her family's opposition.","The young woman married the student with her family's approval.","The student's family opposed the young woman.","The young woman refused to marry the student."),
    make(179,"ולכן הם עזבו את אנגליה ועברו לקנדה.","So they left England and moved to Canada.","So they left Canada and moved to England.","They stayed in England and visited Canada.","They left England but did not move."),
    make(179,"סיפור החטיפה זעזע רבים בקנדה.","The kidnapping story shocked many people in Canada.","The wedding story delighted many people in Canada.","The kidnapping happened to many people in Canada.","Many people in Canada wrote the story.")
  ],
  33:[
    make(187,"הקופאי לא נהרג, הוא רק נפצע.","The cashier was not killed; he was only injured.","The cashier was killed, not injured.","The robber was not killed; he was only injured.","The cashier was neither killed nor injured."),
    make(187,"אבל ג׳ק לא רצה לדרוס את הברווזים הקטנים ועצר.","But Jack did not want to run over the little ducklings, so he stopped.","Jack wanted to run over the little ducklings and stopped.","Jack stopped because he wanted to catch the ducks.","Jack did not see the ducklings and kept driving."),
    make(187,"השופט פסק להם עשר שנות מאסר.","The judge sentenced them to ten years in prison.","The judge sentenced them to two years in prison.","The judge released them from prison.","The police sentenced the judge to ten years.")
  ]
});
})();
