/* Hebrew-to-English meaning checks from the user's scanned units 17–18. */
(function(){"use strict";
const explanations={
 "הוא היה עובר ממקום למקום, ונותן עצות לכל דורש.":"בסיפור על סולון, עובר ממקום למקום מתאר את נסיעותיו, ונותן עצות לכל דורש מתאר את עצותיו.",
 "כי רק אחרי עבודה קשה יודע האדם ליהנות מהמנוחה.":"סולון מסביר שרק אחרי עבודה קשה האדם יודע להעריך מנוחה.",
 "אך הם לא יהיו מאושרים.":"בסיום דברי סולון, אף שהאנשים יהיו שבעים, הם לא יהיו מאושרים.",
 "הלווייתן הוא בעל החיים הגדול ביותר בעולם.":"משפט הפתיחה מזהה את הלווייתן כבעל החיים הגדול ביותר, לא כדג הגדול ביותר.",
 "מערכת הנשימה של הלווייתן שונה מזו של הדגים.":"הקטע מסביר שללווייתן יש ריאות, ולכן מערכת הנשימה שלו שונה מזו של הדגים.",
 "כדי לנשום הוא חייב לעלות על פני המים כל 20 דקות בערך.":"כדי לנשום מציין את המטרה; כל 20 דקות בערך מציין זמן משוער בין עליות לפני המים."
};
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true,explanation:explanations[he]});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
34:[
make(197,"הוא היה עובר ממקום למקום, ונותן עצות לכל דורש.","He would travel from place to place and give advice to anyone who asked.","He stayed in one place and refused to give advice.","He asked everyone for advice before traveling.","He traveled only when the king ordered him to."),
make(197,"כי רק אחרי עבודה קשה יודע האדם ליהנות מהמנוחה.","Only after hard work does a person know how to enjoy rest.","A person should rest before beginning hard work.","Hard work prevents a person from resting.","People enjoy work only after a long rest."),
make(197,"אך הם לא יהיו מאושרים.","But they will not be happy.","And they will be very happy.","They were happy before.","They will not be hungry.")],
35:[
make(206,"הלווייתן הוא בעל החיים הגדול ביותר בעולם.","The whale is the largest animal in the world.","The whale is the smallest animal in the world.","The whale is the largest fish in the ocean.","The whale lives longer than any animal."),
make(206,"מערכת הנשימה של הלווייתן שונה מזו של הדגים.","The whale's respiratory system differs from that of fish.","The whale breathes exactly like fish.","Fish do not have a respiratory system.","The whale's digestive system differs from that of fish."),
make(206,"כדי לנשום הוא חייב לעלות על פני המים כל 20 דקות בערך.","To breathe, it must come to the surface about every 20 minutes.","It must eat at the surface for 20 minutes.","It can stay underwater for exactly 20 hours.","It breathes only when it leaves the water.")]
});
})();
