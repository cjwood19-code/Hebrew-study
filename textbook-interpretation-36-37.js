/* Source Hebrew-to-English checks for chapters 36–37. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
36:[
make(214,"האונייה שלנו עגנה בנמל דייגים קטן בצפון נורווגיה.","Our ship docked in a small fishing port in northern Norway.","Our ship left a large port in southern Norway.","A fishing boat docked in Israel.","We lived in a small town in northern Norway."),
make(215,"איש לא היה בו: לא חזן ולא מקהלה.","No one was there: neither a cantor nor a choir.","A cantor and a choir were there.","The choir was there, but the cantor was not.","No one knew the cantor or choir."),
make(215,"מאז אני משמיעה את התפילה בכל יום כיפורים.","Since then I play the prayer every Yom Kippur.","I have never played the prayer on Yom Kippur.","I play the prayer every New Year.","Since then I sing the prayer every day.")],
37:[
make(13,"היום כמעט אף אחד לא עומד בתור בדואר לשלוח כרטיסי ברכה.","Today almost no one stands in line at the post office to send greeting cards.","Today everyone waits at the post office for greeting cards.","Greeting cards are sent only by the post office.","No one sends cards because the post office is closed."),
make(15,"אוכלים תפוח בדבש ומבקשים שהשנה החדשה תהיה שנה מתוקה.","They eat an apple with honey and ask for a sweet new year.","They eat bread with honey and ask for a long day.","They eat an apple after the new year ends.","They ask for honey but never eat apples."),
make(20,"הסיפורים עברו במשך מאות שנים מאדם לאדם.","The stories passed from person to person over hundreds of years.","The stories were written by one person in one year.","People stopped telling the stories hundreds of years ago.","The stories traveled only by ship.")]
});
})();
