/* Hebrew-to-English interpretation checks from the user's scanned textbook. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c,explanation)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true,...(explanation?{explanation}:{} )});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
38:[
make(54,"נווה שלום הוא כפר של יהודים, מוסלמים ונוצרים.","Neve Shalom is a village of Jews, Muslims, and Christians.","Neve Shalom is a city of only Jewish residents.","The village is in northern Europe.","Neve Shalom is a school for travelers.","כפר is village; the reading names Jews, Muslims, and Christians."),
make(58,"יש לי חלומות רבים.", "I have many dreams.", "I have many tickets.", "I had one dream.", "I have many maps.","יש לי means I have, חלומות means dreams, and רבים means many."),
make(64,"ישראל נמצאת במזרח הים התיכון, ואילו ספרד נמצאת במערב הים התיכון.","Israel is in the eastern Mediterranean, whereas Spain is in the western Mediterranean.","Israel and Spain are both east of the Mediterranean.","Spain is east of Israel on the Mediterranean.","Israel is west of Spain on the Mediterranean.","מזרח is east, מערב is west, and ואילו marks a contrast. The printed exercise asks the student to choose ואילו or אבל.")],
39:[
make(66,"בנגב נמצא לא רק מכתש רמון, אלא גם עוד ארבעה מכתשים.","The Negev has not only the Ramon Crater but four other craters too.","The Negev has only the Ramon Crater.","The Ramon Crater is one of four seas.","There are four cities inside the Ramon Crater."),
make(70,"אורך מכתש רמון הוא 40 קילומטרים.","The Ramon Crater is 40 kilometers long.","The Ramon Crater is 40 meters deep.","Ramon is 40 kilometers from the sea.","The crater has 40 cities."),
make(82,"אין נוף כזה בכל העולם.","There is no landscape like this anywhere in the world.","This landscape is found all over the world.","There is no view from the hotel.","The whole world can be seen here.")]
});
})();
