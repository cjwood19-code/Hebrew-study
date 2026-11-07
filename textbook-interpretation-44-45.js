/* Source Hebrew-to-English interpretation checks from the user's scanned textbook. */
(function(){"use strict";
const make=(sourcePage,he,answer,a,b,c)=>({category:"Interpretation • Hebrew to English",sourcePage,prompt:"What does this Hebrew mean?\n"+he,answer,options:[answer,a,b,c],interpretation:true});
Object.assign(window.HEBREW_CHAPTER_INTERPRETATION||{}, {
44:[
make(212,"בשנת 1912 לא הסכים הפרלמנט הבריטי לתת לנשים זכות לבחור.","In 1912 the British Parliament did not agree to give women the right to vote.","In 1912 women voted in the British Parliament.","The British Parliament closed in 1912.","Women refused to vote in Britain in 1912."),
make(218,"מלאלה יוספזאי מפקיסטן הייתה רק בת 11.","Malala Yousafzai of Pakistan was only 11 years old.","Malala Yousafzai arrived in Pakistan at age 11.","Malala taught 11 students in Pakistan.","Malala left Pakistan 11 years earlier."),
make(232,"רוזלינד פרנקלין נולדה באנגליה למשפחה יהודית.","Rosalind Franklin was born in England to a Jewish family.","Rosalind Franklin moved from England to Israel.","Rosalind Franklin taught a Jewish family in England.","Rosalind Franklin was born in France.")],
45:[
make(240,"אני מבין שאת האישה שקיבלה פרס נובל לשלום.","I understand that you are the woman who received the Nobel Peace Prize.","I understand that you gave a woman the Nobel Peace Prize.","You understand why I received the Nobel Peace Prize.","The woman refused the Nobel Peace Prize."),
make(260,"האדריכלים צופים היום מה יהיה עתיד הערים המודרניות.","Architects today look ahead to the future of modern cities.","Architects today build only old cities.","Modern cities will have no architects.","Architects watched a film about ancient cities."),
make(268,"האקליפטוס הוא עץ שהגיע לכאן מאוסטרליה.","The eucalyptus is a tree that came here from Australia.","The eucalyptus is a tree sent from here to Australia.","Australia is named for the eucalyptus tree.","A eucalyptus tree cannot grow here.")]
});
})();
