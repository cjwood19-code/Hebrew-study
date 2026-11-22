/* ללמוד עברית ברמה ב׳ unit 13, checked against PDF pages 155–164. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[30];if(!Array.isArray(bank)||bank.length!==35)throw Error('Unexpected unit 13 bank');
const moved=new Set(['possessive.story.1','possessive.story.2','possessive.story.3','preposition.1','preposition.2','preposition.3','preposition.4']);
const keep=bank.filter(q=>!moved.has(q.sourceExercise));if(keep.length!==28)throw Error('Unit 13 mapping');
const by=id=>{const q=keep.find(x=>x.sourceExercise===id);if(!q)throw Error('Missing '+id);return q};
const dishes=by('verb.choice.2');
dishes.prompt='אתמול לא _____ את הכלים אחרי ארוחת הערב. (רחצת / ניקית / שטפת)';
dishes.answer='שטפת';dishes.options=['שטפת','רחצת','ניקית','שוטפים'];
dishes.explanation='בתרגיל המודפס אתמול קובע זמן עבר. שוטפים כלים, ולכן הצורה בגוף שני היא שטפת.';
const clothes=by('verb.choice.4');
clothes.prompt='אני _____ את הבגדים, ובעלי _____ את הרצפה. (כיבסתי / שטפתי / רחצתי; שטף / כיבס / רחץ)';
clothes.answer='כיבסתי; שטף';clothes.options=['כיבסתי; שטף','מכבסת; שוטף','רחצתי; כיבס','שטפתי; רחץ'];
clothes.explanation='המקור משתמש בעבר: אני כיבסתי את הבגדים, ובעלי שטף את הרצפה.';
for(const id of ['room.words.1','room.words.2','room.words.3']){const q=by(id);q.category='Room vocabulary • supplemental from pictured word list';q.practiceOrigin='Supplemental vocabulary from unit 13 pictured word list, PDF 163';q.explanation+=' The term appears in the printed room word list.';}
const option={sourcePage:164,sourceExercise:'verb.choice.5',category:'Verb choice • שיעור חוזר',prompt:'יעל _____ צ׳יפס, _____ אורז, וגם _____ עוגת שוקולד. (בישלה / טיגנה / אפתה)',answer:'טיגנה; בישלה; אפתה',options:['טיגנה; בישלה; אפתה','בישלה; טיגנה; אפתה','אפתה; בישלה; טיגנה','טיגנה; אפתה; בישלה'],explanation:'בטקסט המודפס טיגנה מתאימה לצ׳יפס, בישלה לאורז, ואפתה לעוגה.',practiceOrigin:'Printed verb-choice exercise, PDF page 164'};
keep.push(option);
for(const q of keep)if(!q.sourcePage||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 13 schema: '+q.sourceExercise);
window.HEBREW_TEXTBOOK_QUESTION_BANKS[30]=keep;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[30];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 13 interpretation');
const explanations=['בעלי הסכים איתי פירושו שבעלי קיבל את דעתי.','אני חוזרת הביתה בשעה 2.00 מתאר את שעת החזרה של האישה.','היום לא עשיתי את זה: האישה לא עשתה באותו יום את עבודות הבית הרגילות.'];
checks.forEach((q,i)=>{q.sourceExercise='reading.interpretation.'+(i+1);q.explanation=explanations[i];});
})();
