/* Source Hebrew-to-English checks for chapters 36–37. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c,explanation)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true,...(explanation?{explanation}:{})});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
36:[
make(214,"האונייה שלנו עגנה בנמל דייגים קטן בצפון נורווגיה.","Our ship docked in a small fishing port in northern Norway.","Our ship left a large port in southern Norway.","A fishing boat docked in Israel.","We lived in a small town in northern Norway.","עגנה means docked; בנמל דייגים קטן is a small fishing port, and בצפון נורווגיה locates it in northern Norway."),
make(214,"איש לא היה בו: לא חזן ולא מקהלה.","No one was there: neither a cantor nor a choir.","A cantor and a choir were there.","The choir was there, but the cantor was not.","No one knew the cantor or choir.","איש לא היה בו says no person was in the room; לא חזן ולא מקהלה excludes both a cantor and a choir."),
make(214,"מאז אני משמיעה את התפילה בכל יום כיפורים.","Since then I play the prayer every Yom Kippur.","I have never played the prayer on Yom Kippur.","I play the prayer every New Year.","Since then I sing the prayer every day.","מאז means since then; בכל יום כיפורים means every Yom Kippur. The record plays the prayer.")],
37:[
make(13,"היום כמעט אף אחד לא עומד בתור בדואר לשלוח כרטיסי ברכה.","Today almost no one stands in line at the post office to send greeting cards.","Today everyone waits at the post office for greeting cards.","Greeting cards are sent only by the post office.","No one sends cards because the post office is closed.","כמעט אף אחד means almost no one; עומד בתור בדואר means stands in line at the post office."),
make(15,"אוכלים תפוח בדבש ומבקשים שהשנה החדשה תהיה שנה מתוקה.","They eat an apple with honey and ask for a sweet new year.","They eat bread with honey and ask for a long day.","They eat an apple after the new year ends.","They ask for honey but never eat apples.","תפוח בדבש is apple with honey; שנה מתוקה means a sweet year."),
make(21,"הסיפורים עברו במשך מאות שנים מאדם לאדם, מדור לדור.","The stories passed from person to person and generation to generation over hundreds of years.","The stories were written by one person in one year.","People stopped telling the stories hundreds of years ago.","The stories traveled only by ship.","במשך מאות שנים means over hundreds of years; מאדם לאדם means from person to person; מדור לדור means from generation to generation.")]
});
})();
