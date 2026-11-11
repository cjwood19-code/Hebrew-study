/* Source-sentence interpretation checks for units 13–14. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
  30:[
    make(155,"בעלי הסכים איתי.","My husband agreed with me.","My husband argued with me.","My husband left with me.","My husband worked for me."),
    make(155,"אני חוזרת הביתה בשעה 2.00.","I return home at two o’clock.","I leave home at two o’clock.","I return home at eight o’clock.","She returns home at two o’clock."),
    make(156,"היום לא עשיתי את זה.","Today I did not do that.","I did that today.","You did that yesterday.","I will do that tomorrow.")
  ],
  31:[
    make(165,"אריה, זאב ושועל יצאו יחד לצוד ציד.","A lion, a wolf, and a fox went out together to hunt.","A lion and a wolf hunted a fox.","A fox went out alone to hunt.","A lion, a wolf, and a fox ate together."),
    make(165,"אני והזאב נסתפק בשפן.","The wolf and I will be content with the rabbit.","I caught the rabbit.","The lion and I will take the boar.","We do not want the rabbit."),
    make(165,"ממי למדת לחלק שלל?","From whom did you learn to divide the spoils?","Why did you divide the spoils?","Who took all the spoils?","When did you learn to hunt?")
  ]
});
})();
