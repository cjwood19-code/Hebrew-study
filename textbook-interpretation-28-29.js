/* Three source-sentence translation gates for each new chapter. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
  28:[
    make(132,"יותר ויותר תיירים מעוניינים לבקר במקומות מיוחדים בעולם.","More and more tourists want to visit unusual places around the world.","Fewer tourists want to visit familiar places.","Tourists want to live in unusual places.","More tourists are working in other countries."),
    make(132,"היא מביאה תייר בודד לאי שאין בו אנשים.","It takes a lone tourist to an island with no people on it.","It takes a group of tourists to a crowded island.","A tourist brings people to an island.","It brings an island to a lone tourist."),
    make(132,"התייר צריך לדאוג לעצמו.","The tourist must take care of himself.","The tourist must take care of other people.","The tourist wants to travel alone.","The company will take care of the tourist.")
  ],
  29:[
    make(143,"לצבעים שונים יש השפעה על מצב רוחם ועל התנהגותם של בני אדם ושל בעלי חיים.","Different colors affect the mood and behavior of people and animals.","People and animals affect the colors around them.","Colors affect animals but not people.","Different colors change the age of people and animals."),
    make(143,"לירוק, למשל, יש השפעה מרגיעה.","Green, for example, has a calming effect.","Green, for example, has an exciting effect.","Red, for example, has a calming effect.","Green, for example, has no effect."),
    make(143,"צובעים אותו בצבעים שהן אינן אוהבות.","They color it in colors the birds do not like.","They color the birds in colors people do not like.","They color it in colors the birds like.","The birds color it themselves.")
  ]
});
})();
