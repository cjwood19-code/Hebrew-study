/* ללמוד עברית ברמה ב׳, unit 3; compared with indexed PDF pages 35, 36, 38, 40, 43. */
(function(){'use strict';
const make=(page,id,category,prompt,answer,others,explanation,origin)=>({sourcePage:page,sourceExercise:id,category,prompt,answer,options:[answer,...others],explanation,practiceOrigin:origin});
const supplemental='Supplemental practice from the cited lesson; choices adapted for scoring';
const printed='Printed exercise; choices adapted for scoring';
const bank=[
 make(35,'reading.vocab.1','Vocabulary in context','בסופרמרקט שמים מצרכים בעגלה. What does מצרכים mean?','groceries / supplies',['teachers','letters','mountains'],'מצרכים הם הדברים שהקונים שמים בעגלה בסופרמרקט.',supplemental),
 make(35,'reading.vocab.2','Vocabulary in context','מסתובבים בין המדפים. What does מדפים mean?','shelves',['streets','days','books'],'מדפים הם shelves; הקונים מסתובבים ביניהם בסופרמרקט.',supplemental),
 make(35,'reading.vocab.3','Vocabulary in context','אפשר לפגוש הרבה אנשים מהשכונה. What does שכונה mean?','neighborhood',['market basket','classroom','letter'],'שכונה היא neighborhood; המכולת היא מקום לפגוש אנשים מהשכונה.',supplemental),
 make(35,'reading.vocab.4','Vocabulary in context','אפשר לשוחח אתם. What does לשוחח mean?','to converse',['to close','to arrive','to build'],'לשוחח פירושו לדבר עם האנשים שפוגשים במכולת.',supplemental),
 make(35,'reading.vocab.5','Vocabulary in context','אולי גם להתיידד אתם. What does להתיידד mean?','to become friends',['to be late','to sleep','to travel'],'אחרי שמשוחחים ומכירים אנשים, אפשר להתיידד אתם.',supplemental),
 make(38,'plurals.2.m.1','רבים • printed transformation','כתבו ברבים לפי הדוגמה: פרי טעים','פירות טעימים',['פרים טעימות','פרי טעימים','פירות טעים'],'פרי נעשה פירות, והתואר טעים נעשה טעימים ברבים.',printed),
 make(38,'plurals.2.f.1','רבים • printed transformation','כתבו ברבים לפי הדוגמה: כוס גבוהה','כוסות גבוהות',['כוסים גבוהים','כוסות גבוהים','כוס גבוהה'],'כוס נעשית כוסות, והתואר גבוהה נעשה גבוהות.',printed),
 make(38,'plurals.2.f.3','רבים • printed transformation','כתבו ברבים לפי הדוגמה: עין כחולה','עיניים כחולות',['עינים כחולים','עין כחולות','עיניים כחולים'],'עין נעשית עיניים; כחולה נעשית כחולות.',printed),
 make(38,'plurals.2.f.2','רבים • printed transformation','כתבו ברבים לפי הדוגמה: ציפור קטנה','ציפורים קטנות',['ציפורות קטנים','ציפור קטנות','ציפורים קטן'],'ציפור נעשית ציפורים, אבל התואר נשאר נקבה ברבים: קטנות.',printed),
 make(38,'plurals.2.right.4','רבים • printed transformation','כתבו ברבים לפי הדוגמה: שנה טובה','שנים טובות',['שנות טובים','שנה טובות','שנים טוב'],'שנה נעשית שנים, והתואר טובה נעשה טובות.',printed),
 make(40,'infinitives.b.1','שם הפועל • printed completion','גרתי על יד בית ספר. טוב _____ על יד בית ספר.','לגור',['גר','גרתי','גרים'],'גרתי היא צורת עבר; אחרי טוב נדרש שם הפועל לגור.',printed),
 make(40,'infinitives.b.2','שם הפועל • printed completion','הציפור עפה בשמים. נעים מאוד _____ בשמים.','לעוף',['עפה','עפים','עף'],'עפה היא צורת עבר; אחרי נעים מאוד נדרש שם הפועל לעוף.',printed),
 make(40,'infinitives.b.3','שם הפועל • printed completion','את רצת לשיעור והם רצו הביתה. קל _____ בבוקר.','לרוץ',['רצת','רצו','רצים'],'רצת ורצו הן צורות עבר; אחרי קל נדרש שם הפועל לרוץ.',printed),
 make(43,'modal.table.1','מודאלי + שם הפועל','לא הפרעתי בשיעור. אסור _____ בשיעור.','להפריע',['הפרעתי','מפריע','הפריע'],'אסור מציין איסור, ואחריו בא שם הפועל להפריע.',printed),
 make(43,'modal.table.2','מודאלי + שם הפועל','דיברנו בהפסקה. מותר _____ רק בהפסקה.','לדבר',['דיברנו','מדברים','דיבר'],'מותר בא לפני שם הפועל; לדַבֵּר הוא שם הפועל של דיברנו.',printed),
 make(43,'modal.table.3','מודאלי + שם הפועל','עבדתי בקיבוץ בחופשה. כדאי _____ בקיבוץ בחופשה.','לעבוד',['עבדתי','עובדים','עבד'],'כדאי בא לפני שם הפועל; לעבוד הוא שם הפועל של עבדתי.',printed),
 make(43,'modal.table.4','מודאלי + שם הפועל','לא הפרעתי בשיעור. _____ להפריע בשיעור.','אסור',['אפשר','כדאי','נעים'],'לפי התרגיל, לא הפרעתי בשיעור כי אסור להפריע בו.',supplemental)
];
for(const q of bank)if(q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 3 option schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[20]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[20];
if(checks.length!==3)throw Error('Unit 3 interpretation checks changed');
const explanations=[
 'לאולפן באים כדי ללמוד עברית, אבל גם מחוץ לכיתה אפשר ללמוד מילים חדשות: הלמידה אינה מוגבלת לכיתה.',
 'כדאי לקנות במכולת כי קל ללמוד שם עברית; הקטע משווה אותה לסופרמרקט.',
 'בסופרמרקט לוקחים עגלה, הולכים בין המדפים ושמים מצרכים בעגלה.'
];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
