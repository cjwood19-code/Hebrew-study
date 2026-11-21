/* ללמוד עברית ברמה ב׳ unit 8: source exercise audit, PDF pages 99–108. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[25];if(!Array.isArray(bank)||bank.length!==28)throw Error('Unexpected unit 8 bank');
const keep=bank.slice(0,24);
const exercises=[
 'reading.vocab.ad','reading.vocab.letter','reading.vocab.request','reading.vocab.correspondence','reading.vocab.fare',
 'ads.adjective.shy','ads.adjective.rich','ads.adjective.sensitive','ads.adjective.polite',
 'letter.instructions.demand','existence.future.request','existence.past.books','existence.past.lamp','existence.future.money','existence.past.monsters',
 'predicate.past.life','predicate.future.writer','indirect.question.if','indirect.professor.he','indirect.woman.she',
 'meaning.marriage','meaning.educated','meaning.wealth','meaning.sure'];
if(keep.length!==exercises.length)throw Error('Unit 8 mapping');
keep.forEach((q,i)=>{q.sourceExercise=exercises[i];q.practiceOrigin='Supplemental recognition from the printed unit 8 reading or exercise; choices adapted';});
const reading=keep.slice(0,5);
reading[0].prompt='באחד מעיתוני שוודיה התפרסמה המודעה הזאת. What does מודעה mean here?';
reading[1].prompt='כתבה היורשת הבלונדינית מכתב לכל אחד. What does מכתב mean here?';
reading[2].prompt='יש לי רק בקשה אחת. What does בקשה mean here?';
reading[3].prompt='אחרי התכתבות ארוכה כתבה היורשת הבלונדינית מכתב לכל אחד. What does התכתבות mean here?';
reading[4].prompt='האם אתה יכול לשלוח לי חצי מדמי הנסיעה ברכבת? What does דמי נסיעה mean here?';
keep[8].prompt='במודעות ההיכרות מופיע התיאור מנומס. What does מנומס mean?';
keep[9].prompt='התרגיל מזכיר את הפועל לדרוש. What does לדרוש mean?';
keep[20].prompt='יורשת עשירה, צעירה, יפה וביישנית, מחפשת בחור נאה, משכיל ורציני - לנישואין. Which word is closest to נישואין?';
keep[21].prompt='מחפשת בחור נאה, משכיל ורציני. Which word is closest to משכיל?';
keep[22].prompt='אני רוצה להיות בטוחה שאתה מעוניין בי ולא בעושר שלי. What does עושר mean here?';
keep[23].prompt='אני רוצה להיות בטוחה שאתה מעוניין בי. What does בטוחה mean here?';
for(const q of keep)if(!q.sourcePage||!q.sourceExercise||!q.explanation||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 8 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[25]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[25];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 8 interpretation');
const explanations=['המשפט הראשון אומר שהמודעה התפרסמה בעיתון שוודי.','הקריאה מספרת שמאות גברים ענו לבחורה שהופיעה במודעה.','במכתב היא ביקשה חצי מדמי הנסיעה ברכבת.'];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
