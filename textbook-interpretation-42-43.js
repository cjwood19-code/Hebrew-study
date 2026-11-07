/* Source Hebrew-to-English interpretation checks from the user's scanned textbook. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
42:[
make(152,"היהודים לא יכלו לעבוד בכל עבודה.","The Jews could not work in every occupation.","The Jews could work in every occupation.","The Jews did not want to work at all.","Everyone worked in the ghetto."),
make(160,"התלמידים המוסלמים ביקרו במחנות.","The Muslim students visited the camps.","The students built the camps.","The Jewish students visited the museum.","The teachers stayed at the school."),
make(176,"אבל הפינגווין לא התאים לאקלים.","The penguin was not suited to the climate.","The penguin liked the climate.","The penguin found food in the climate.","The penguin was not found." )],
43:[
make(182,"ערבית היא השפה שלי.","Arabic is my mother tongue.","Hebrew is my mother tongue.","I study Arabic at school.","I write in Hebrew only."),
make(186,"אני אוהבת אומנות מופשטת.","I like abstract art.","I dislike all art.","I paint abstract art.","I like street art."),
make(192,"סוף סוף אני יכול לשלוח לך את הציור.","At last I can send you the painting.","I want you to paint me.","I sent you the painting.","You want to send me a painting.")]
});
})();
