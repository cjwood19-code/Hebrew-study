/* Source Hebrew-to-English interpretation checks from the user's scan. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
40:[
make(104,"אסור לעשן בתוך הבתים.","Smoking inside the houses is forbidden.","Visitors may smoke inside the houses.","It is forbidden to enter the houses.","People must build houses."),
make(114,"בית הכנסת נמצא בלב הקמפוס של מדעי הרוח בהר הצופים.","The synagogue is in the heart of the humanities campus on Mount Scopus.","The synagogue is near a London museum.","The humanities campus is inside a synagogue in London.","Mount Scopus is next to the Ramon Crater."),
make(120,"בית השנטי הוא ארגון שעוזר לנערים ולנערות שעזבו את הבית ועברו לגור ברחוב.","Beit Hashanti helps boys and girls who left home and moved to the street.","Beit Hashanti helps only visitors to the city.","The boys and girls left the street and moved home.","Beit Hashanti is a school for architects.")],
41:[
make(126,"בבתי הספר האלה לומדים ילדים יהודים, מוסלמים ונוצרים ביחד.","Jewish, Muslim, and Christian children learn together in these schools.","Only Jewish children learn in these schools.","The schools are for adults from three cities.","Children from these schools study separately."),
make(136,"ספרטה הייתה עיר חשובה ביוון העתיקה.","Sparta was an important city in ancient Greece.","Sparta is a new city in Greece.","Sparta was a city in ancient Israel.","Greece was a city in ancient Sparta."),
make(144,"היא גם כתבה שירים וסיפורים לילדים.","She also wrote poems and stories for children.","She only read stories to children.","She wrote books about children but no poems.","Children wrote poems and stories for her.")]
});
})();
