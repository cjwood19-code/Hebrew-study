/* Source Hebrew-to-English interpretation checks from the user's scanned textbook. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
46:[
make(275,"הוא החליט להמציא שפה שתהיה שפת תקשורת בין העמים השונים.","He decided to invent a language for communication among different peoples.","He decided to learn only the languages of his own people.","The different peoples refused to communicate.","He decided to stop people from inventing languages."),
make(291,"הרבה אנשים רוצים ללמוד עברית, אבל קשה להם לקרוא בלי ניקוד.","Many people want to learn Hebrew, but reading without vowel marks is hard for them.","Many people want to write Hebrew without letters.","Hebrew is easy for everyone to read without vowel marks.","People prefer reading Hebrew to studying it."),
make(305,"בגיל 12 שלחו אותו ללמוד בבית ספר לעיוורים.","At age 12 they sent him to study at a school for blind pupils.","At age 12 he taught blind pupils at home.","They sent him away from school when he was 12.","He opened a school for blind pupils at age 12.")]
});
})();
