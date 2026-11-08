/* Supplemental example sentences built from the vocabulary and grammar in units 7–8.
   They are practice examples, not quotations from the textbook. */
(function(){"use strict";
const rows=[
 ["סוס","הסוס הולך בדרך.","The horse walks along the road."],
 ["חמור","החמור עומד ליד הסוס.","The donkey stands next to the horse."],
 ["כביש","המכונית נוסעת על הכביש.","The car travels on the road."],
 ["דרך","זאת דרך ארוכה.","This is a long way."],
 ["נסיעה","הנסיעה ברכבת ארוכה.","The train journey is long."],
 ["רכבת","הרכבת נוסעת לחיפה.","The train goes to Haifa."],
 ["מכונית","יש להם מכונית חדשה.","They have a new car."],
 ["אוטובוס","אני מחכה לאוטובוס.","I am waiting for the bus."],
 ["דלק","המכונית צריכה דלק.","The car needs fuel."],
 ["מחיר","מה המחיר של הכרטיס?","What is the price of the ticket?"],
 ["תחנת דלק","יש תחנת דלק ליד הכביש.","There is a gas station near the road."],
 ["לנוח","אחרי הנסיעה אני רוצה לנוח.","After the journey, I want to rest."],
 ["להאכיל","צריך להאכיל את הסוס.","The horse needs to be fed."],
 ["מאה","במאה ה־19 אנשים נסעו בסוסים.","In the 19th century, people traveled by horse."],
 ["משקפי שמש","היא קנתה משקפי שמש.","She bought sunglasses."],
 ["כרטיסים","קנינו כרטיסים לרכבת.","We bought train tickets."],
 ["חדרי המתנה","יש בתחנה חדרי המתנה.","The station has waiting rooms."],
 ["עבודות בית","הילדים עושים עבודות בית.","The children do household chores."],
 ["לקנות","אני רוצה לקנות כרטיס.","I want to buy a ticket."],
 ["לבנות","הם רוצים לבנות בית.","They want to build a house."],
 ["הנחה","יש היום הנחה בחנות.","There is a discount at the store today."],
 ["קנייה","הקנייה הזאת הייתה חשובה.","This purchase was important."],
 ["בנייה","הבנייה של הגשר התחילה.","Construction of the bridge has started."],
 ["חנייה","יש חנייה ליד הבית.","There is parking near the house."],
 ["בריאות","הבריאות חשובה לכולם.","Health is important to everyone."],
 ["מוזאון","ביקרנו במוזאון בירושלים.","We visited a museum in Jerusalem."],
 ["כמובן","כמובן, אני יכול לעזור.","Of course, I can help."],
 ["אופניים","הילד נוסע באופניים.","The boy rides a bicycle."],
 ["אונייה","האונייה נוסעת בים.","The ship travels at sea."],
 ["גשר","הגשר נמצא מעל הנהר.","The bridge is over the river."],
 ["נהר","הנהר עובר ליד העיר.","The river passes near the city."],
 ["מודעה","קראתי מודעה בעיתון.","I read an advertisement in the newspaper."],
 ["מכתב","כתבתי מכתב לחבר.","I wrote a letter to a friend."],
 ["בקשה","היא שלחה בקשה בכתב.","She sent a written request."],
 ["התכתבות","ההתכתבות ביניהם התחילה אתמול.","Their correspondence began yesterday."],
 ["פגישה","יש לי פגישה מחר.","I have a meeting tomorrow."],
 ["דמי נסיעה","דמי נסיעה ברכבת יכולים להיות גבוהים.","Train fares can be high."],
 ["עושר","עושר אינו הדבר החשוב ביותר.","Wealth is not the most important thing."],
 ["נישואין","הם דיברו על נישואין.","They talked about marriage."],
 ["משכיל","האיש המשכיל קורא הרבה.","The educated man reads a lot."],
 ["ביישנית","היא ביישנית ולא אוהבת לדבר בקבוצה.","She is shy and does not like to speak in a group."],
 ["צעירה","האישה הצעירה לומדת עברית.","The young woman studies Hebrew."],
 ["עשירה","היא עשירה, אבל היא עובדת קשה.","She is rich, but she works hard."],
 ["רציני","הוא אדם רציני.","He is a serious person."],
 ["רגישה","היא רגישה לדברים האלה.","She is sensitive to these things."],
 ["מנומס","הוא אדם מנומס.","He is a polite person."],
 ["לכעוס","אני לא רוצה לכעוס עליך.","I do not want to be angry with you."],
 ["לחכות","אני צריך לחכות לאוטובוס.","I need to wait for the bus."],
 ["להחזיר","אני צריך להחזיר את הספר.","I need to return the book."],
 ["לדרוש","היא רוצה לדרוש תשובה.","She wants to demand an answer."],
 ["הוכחה","יש הוכחה למה שהוא אמר.","There is evidence for what he said."],
 ["להאמין","אני רוצה להאמין לך.","I want to believe you."],
 ["לגרום","מה יכול לגרום לבעיה?","What can cause a problem?"],
 ["ביקור","הביקור היה קצר.","The visit was short."],
 ["הצעה","יש לי הצעה חדשה.","I have a new suggestion."],
 ["ספה","הספה נמצאת ליד החלון.","The sofa is next to the window."]
];
const cards=window.HEBREW_GENERAL_FLASHCARDS||[];
if(cards.length!==rows.length)throw new Error("Flashcard example count does not match the deck");
cards.forEach((card,i)=>{
 const [word,he,en]=rows[i];
 if(card.he!==word||!he.includes(word)||!en)throw new Error("Flashcard example mismatch: "+card.id);
 card.exampleHe=he;card.exampleEn=en;card.exampleKind="Supplemental practice example";
});
})();
