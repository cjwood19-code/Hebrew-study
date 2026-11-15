/* Source Hebrew-to-English interpretation checks from the user's scanned textbook. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
42:[
make(152,"היהודים לא יכלו לעבוד בכל עבודה.","The Jews could not work in every occupation.","The Jews could work in every occupation.","The Jews did not want to work at all.","Everyone worked in the ghetto."),
make(160,"התלמידים המוסלמים ביקרו במחנות.","The Muslim students visited the camps.","The students built the camps.","The Jewish students visited the museum.","The teachers stayed at the school."),
make(176,"במשך 11 חודשים הוא נשאר לגור עם ז׳ואאו.","For 11 months he stayed to live with João.","For 11 days he lived with João.","João lived in the sea for 11 months.","He returned to the sea after 11 months.")],
43:[
make(182,"ערבית היא השפה שלי.","Arabic is my language.","Hebrew is my language.","I study Arabic at school.","I write in Hebrew only."),
make(186,"אני אוהבת אומנות פיגורטיבית.","I like figurative art.","I dislike all art.","I paint abstract art.","I like street art."),
make(192,"סוף סוף אני יכול לשלוח לך את הציור.","At last I can send you the painting.","I want you to paint me.","I sent you the painting.","You want to send me a painting.")]
});
window.HEBREW_CHAPTER_INTERPRETATION[42].forEach((q,i)=>{q.sourceExercise=["גטו — קריאה","ריאיון עם מנהל בית הספר","פינגווין מיוחד — בחירה"][i];q.explanation=["בקריאת הגטו כתוב שהיהודים לא יכלו לעבוד בכל עבודה.","בריאיון על הביקור במחנות מדובר בתלמידים מוסלמים שביקרו שם.","בקריאה על דינדין נאמר שנשאר לגור עם ז׳ואאו במשך 11 חודשים."][i]});
window.HEBREW_CHAPTER_INTERPRETATION[43].forEach((q,i)=>{q.sourceExercise=["ריאיון עם אניסה אשקר","לא כל מה שמוצא חן בעיניי — קריאה","מכתב ואן גוך"][i];q.explanation=["אניסה אומרת במפורש: ״ערבית היא השפה שלי״.","הכותבת אומרת שהיא אוהבת אומנות פיגורטיבית, בניגוד לחבריה שאוהבים אומנות אבסטרקטית.","בפתיחת מכתבו לתיאו, ואן גוך אומר שיוכל סוף סוף לשלוח לו את הציור."][i]});
})();
