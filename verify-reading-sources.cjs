/* Verify context-dependent lesson questions and the source-backed Reading Practice. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=__dirname;
const banks={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-10.js'),'utf8'),banks);
assert.ok(banks.window.HEBREW_TEXTBOOK_QUESTION_BANKS[10].length>0);
assert.ok(banks.window.HEBREW_TEXTBOOK_QUESTION_BANKS[10].every(q=>!["Nahalal","Anat","Kindergarten","Telephone"].includes(q.category)));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const start=app.indexOf('const readingPassages=['),end=app.indexOf('\nlet readingSession=null;',start);
assert.ok(start>=0&&end>start);
const passages=vm.runInNewContext(app.slice(start,end)+'\nreadingPassages',{D:{readingPassages:[]}});
assert.equal(passages.length,118);
for(const [id,page,count,phrase] of [
 ['shnayim-9-maathai',240,3,'ואנגרי מאתאי'],
 ['shnayim-9-population',242,2,'7.2 מיליארד'],
 ['shnayim-9-dog-nose',246,2,'דייזי'],
 ['shnayim-9-pluto',256,2,'עדיין לא גילו את הכוכב'],
 ['shnayim-9-roofs',260,2,'על הגגות'],
 ['shnayim-9-gardens',262,2,'נבוכדנצר השני'],
 ['shnayim-9-self-sufficient',266,2,'לבנות ______ את הבית'],
 ['shnayim-9-healthy',266,2,'פירות וירקות אורגניים'],
 ['shnayim-9-eucalyptus',268,2,'האקליפטוס'],
 ['shnayim-9-green-families',270,2,'לחיות / להפסיד']
]){const p=passages.find(x=>x.id===id);assert.ok(p,id);assert.match(p.source,new RegExp('chapter 9.*PDF page '+page));assert.equal(p.questions.length,count);assert.ok(p.he.includes(phrase),id);assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.length===4&&q.opts.includes(q.a)),id);}
for(const [id,page,count,phrase] of [
 ['shnayim-8-women-history',212,3,'הפרלמנט הבריטי'],
 ['shnayim-8-moses',212,3,'יוכבד'],
 ['shnayim-8-dorothea',216,1,'אם ל־7 ילדים'],
 ['shnayim-8-malala',218,3,'מלאלה יוספזאי'],
 ['shnayim-8-get-film',220,1,'הסרט גט'],
 ['shnayim-8-laqiya',222,2,'לקיה'],
 ['shnayim-8-ali-baba',224,2,'סומסום, בבקשה להיפתח!'],
 ['shnayim-8-franklin',232,2,'רוזלינד פרנקלין'],
 ['shnayim-8-marathon',238,2,'קתרין סוויצר']
]){const p=passages.find(x=>x.id===id);assert.ok(p,id);assert.match(p.source,new RegExp('chapter 8.*PDF page '+page));assert.equal(p.questions.length,count);assert.ok(p.he.includes(phrase),id);assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)),id);}
for(const [id,page,count,phrase] of [
 ['shnayim-6-ghetto',152,3,'אפשרו ליהודים להישאר בעיר'],
 ['shnayim-6-righteous',154,2,'החליטה ממשלת ישראל'],
 ['shnayim-6-roma',158,3,'הגיעו מצפון הודו'],
 ['shnayim-6-school-interview',160,2,'התלמידים נסעו לקיבוץ גבעת חביבה'],
 ['shnayim-6-animal-cloze',166,2,'שנדי הכלבה שני כלבלבים'],
 ['shnayim-6-penguin',176,2,'מצא ז׳ואאו פררה ד׳ סוזה']
]){const p=passages.find(x=>x.id===id);assert.ok(p,id);assert.match(p.source,new RegExp('chapter 6.*PDF pages? '+page));assert.equal(p.questions.length,count);assert.ok(p.he.includes(phrase));assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)));}
const bank42={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-42-43.js'),'utf8'),bank42);
assert.equal(bank42.window.HEBREW_TEXTBOOK_QUESTION_BANKS[42].length,10);
assert.ok(bank42.window.HEBREW_TEXTBOOK_QUESTION_BANKS[42].every(q=>q.explanation&&q.practiceOrigin&&q.sourceExercise&&/[\u0590-\u05FF]/.test(q.prompt)));
assert.ok(!bank42.window.HEBREW_TEXTBOOK_QUESTION_BANKS[42].some(q=>/^(Reading|Interview|Completion)/.test(q.category)||q.sourceExercise.startsWith('choice.penguin')));
for(const [id,page,count,phrase] of [
 ['shnayim-7-art',181,4,'הקליגרפיה היא כתיבה אומנותית'],
 ['shnayim-7-anisa',182,2,'ערבית היא השפה שלי'],
 ['shnayim-7-found',186,2,'אומנות פיגורטיבית'],
 ['shnayim-7-graffiti-interview',188,2,'להתקשר להוריי'],
 ['shnayim-7-vangogh',192,2,'הציור של החדר שלי'],
 ['shnayim-7-street-art',192,1,'אומנות הגרפיטי'],
 ['shnayim-7-maabarot-cloze',194,2,'המעברות ________ מחנות אוהלים'],
 ['shnayim-7-klimt',204,2,'אדלה בלוך־באואר'],
 ['shnayim-7-pompeii',210,1,'אבנים גדולות וסלעים'],
 ['shnayim-7-comics',210,1,'בספרי הקומיקס יש ציורים']
]){const p=passages.find(x=>x.id===id);assert.ok(p,id);assert.match(p.source,new RegExp('chapter 7.*PDF pages? '+page));assert.equal(p.questions.length,count);assert.ok(p.he.includes(phrase),id);assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)),id);}
assert.ok(passages.find(p=>p.id==='shnayim-7-found').he.includes('זאב רבן'));
assert.ok(!passages.find(p=>p.id==='shnayim-7-pompeii').questions.some(q=>q.a==='אפר געשי'));
const bank43={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-42-43.js'),'utf8'),bank43);
assert.equal(bank43.window.HEBREW_TEXTBOOK_QUESTION_BANKS[43].length,8);
assert.ok(bank43.window.HEBREW_TEXTBOOK_QUESTION_BANKS[43].every(q=>q.explanation&&q.practiceOrigin&&q.sourceExercise&&/[\u0590-\u05FF]/.test(q.prompt)));
assert.ok(!bank43.window.HEBREW_TEXTBOOK_QUESTION_BANKS[43].some(q=>/^(Reading|Interview|Past tense|True or false)/.test(q.category)));
const interpretation43={window:{HEBREW_CHAPTER_INTERPRETATION:{}}};vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-interpretation-42-43.js'),'utf8'),interpretation43);
for(const [i,id,page] of [[0,'shnayim-7-anisa',182],[1,'shnayim-7-found',186],[2,'shnayim-7-vangogh',192]]){
 const x=interpretation43.window.HEBREW_CHAPTER_INTERPRETATION[43][i],p=passages.find(v=>v.id===id);
 const normalize=v=>v.replace(/[.,:!?״]/g,'').replace(/\s+/g,' ').trim();
 assert.equal(x.sourcePage,page);assert.ok(x.sourceExercise&&x.explanation);
 assert.ok(normalize(p.he).includes(normalize(x.prompt.split('\n')[1])),id);
}
for(const [id,page,phrase] of [
 ['shnayim-3-landscapes',66,'ישראל היא קצת ירוקה, קצת צהובה, קצת כחולה וקצת לבנה'],
 ['shnayim-3-mitzpe',66,'אחד היישובים הקטנים בנגב הוא מצפה רמון'],
 ['shnayim-3-crater',70,'אורך מכתש רמון הוא 40 קילומטרים'],
 ['shnayim-3-ramla',70,'משמעות השם בערבית היא חול או חולות'],
 ['shnayim-3-mosaic',74,'ע׳אלב אבו דיאב היה ילד'],
 ['shnayim-3-hotel',82,'אין נוף כזה בכל העולם'],
 ['shnayim-3-darwin',90,'הוא היה סקרן מאוד'],
 ['shnayim-3-alpacas',94,'הם יכולים לרכוב על חמורים'],
 ['shnayim-3-bedouin',98,'ואז נשאר רק המדבר'],
 ['shnayim-3-bialik',100,'הוא היה לא רק משורר']
]){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);
 assert.match(p.source,new RegExp(`chapter 3.*PDF page ${page}`));
 assert.equal(p.questions.length,2);assert.ok(p.he.includes(phrase),id);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.length===4&&q.opts.includes(q.a)),id);
}
const bank39={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-38-39.js'),'utf8'),bank39);
assert.equal(bank39.window.HEBREW_TEXTBOOK_QUESTION_BANKS[39].length,12);
assert.ok(bank39.window.HEBREW_TEXTBOOK_QUESTION_BANKS[39].every(q=>q.explanation&&q.sourceExercise&&q.practiceOrigin&&q.sourcePage>=66&&q.sourcePage<=101));
assert.ok(!bank39.window.HEBREW_TEXTBOOK_QUESTION_BANKS[39].some(q=>/^(Reading|Dialogue|Story)/.test(q.category)));
for(const [id,page,questions,phrase] of [
 ['shnayim-2-travel',38,3,'חלק מהאנשים האלה הצליחו לחזור הביתה בשלום'],
 ['shnayim-2-ruthie',50,3,'דינה: רותי, לאן _____ לפני שנה?'],
 ['shnayim-2-benjamin',46,3,'מסעות בנימין מטודלה'],
 ['shnayim-2-neve',54,3,'התלמידים לומדים בשתי שפות: בערבית ובעברית']
]){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);
 assert.match(p.source,new RegExp(`chapter 2.*PDF page ${page}`));
 assert.equal(p.questions.length,questions);assert.ok(p.he.includes(phrase),id);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.length===4&&q.opts.includes(q.a)),id);
}
const bank38={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-38-39.js'),'utf8'),bank38);
assert.equal(bank38.window.HEBREW_TEXTBOOK_QUESTION_BANKS[38].length,11);
assert.ok(bank38.window.HEBREW_TEXTBOOK_QUESTION_BANKS[38].every(q=>q.explanation&&q.sourceExercise&&q.practiceOrigin&&q.sourcePage>=38&&q.sourcePage<=65));
assert.ok(!bank38.window.HEBREW_TEXTBOOK_QUESTION_BANKS[38].some(q=>/^(Reading|Dialogue)/.test(q.category)));
const shnayimOne=[
 ['shnayim-1-greeting-cards',13,4,'היום כמעט אף אחד לא עומד בתור בדואר'],
 ['shnayim-1-holiday-dialogue',15,4,'אוכלים תפוח בדבש'],
 ['shnayim-1-childhood-cloze',19,3,'היה _____ (לחפש) עבודה'],
 ['shnayim-1-myth',21,3,'הסיפורים עברו במשך מאות שנים'],
 ['shnayim-1-thousand-nights',23,4,'שחרזדה'],
 ['shnayim-1-animal-names',33,3,'לתת שם מתאים לכל בעל חיים'],
 ['shnayim-1-wedding-cloze',37,3,'כולם אומרים _____ (כלות / ברכות)']
];
for(const [id,page,count,phrase] of shnayimOne){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);
 assert.match(p.source,new RegExp(`chapter 1.*PDF page(?:s)? ${page}`));
 assert.equal(p.questions.length,count);assert.ok(p.he.includes(phrase),id);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.length===4&&q.opts.includes(q.a)),id);
}
const myth=passages.find(p=>p.id==='shnayim-1-myth');
assert.ok(myth.he.includes('תמונה חברתית על הקהילה, על החיים ועל הערכים שלה'));
assert.ok(!myth.he.includes('על הרגשות והבעיות שלנו'));
const checked37={window:{HEBREW_CHAPTER_INTERPRETATION:{}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-36-37.js'),'utf8'),checked37);
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-interpretation-36-37.js'),'utf8'),checked37);
assert.equal(checked37.window.HEBREW_TEXTBOOK_QUESTION_BANKS[37].length,17);
assert.ok(checked37.window.HEBREW_TEXTBOOK_QUESTION_BANKS[37].every(q=>q.sourcePage>=13&&q.sourcePage<=37&&q.sourceExercise&&q.explanation&&q.practiceOrigin));
assert.deepEqual(Array.from(checked37.window.HEBREW_CHAPTER_INTERPRETATION[37],q=>q.sourcePage),[13,15,21]);
assert.ok(checked37.window.HEBREW_CHAPTER_INTERPRETATION[37].every(q=>q.explanation));
const kol=passages.find(p=>p.id==='lilmod-19-kol-nidrei');
assert.ok(kol);
assert.match(kol.source,/unit 19.*PDF page 214.*PDF page 216/);
assert.equal(kol.questions.length,8);
assert.ok(kol.he.includes('קולות השירה נשמעו מהקומה העליונה'));
assert.ok(kol.he.includes('מאז אני משמיעה את התפילה בכל יום כיפורים'));
assert.ok(!kol.he.includes('חשבתי על משפחתי'));
assert.ok(kol.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)));
const chapter36={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-36-37.js'),'utf8'),chapter36);
assert.equal(chapter36.window.HEBREW_TEXTBOOK_QUESTION_BANKS[36].length,6);
assert.ok(chapter36.window.HEBREW_TEXTBOOK_QUESTION_BANKS[36].every(q=>q.sourcePage===214&&q.explanation&&q.practiceOrigin));
const chapter36Interpretation={window:{HEBREW_CHAPTER_INTERPRETATION:{}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-interpretation-36-37.js'),'utf8'),chapter36Interpretation);
for(const q of chapter36Interpretation.window.HEBREW_CHAPTER_INTERPRETATION[36]){
 assert.equal(q.sourcePage,214);assert.ok(q.explanation);
 assert.ok(kol.he.includes(q.prompt.split('\n')[1]));
}
for(const [id,unit,page,count] of [['lilmod-17-solon',17,197,8],['lilmod-17-prepositions',17,205,3],['lilmod-18-whale',18,206,14],['lilmod-18-rescue',18,212,3]]){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);
 assert.match(p.source,new RegExp(`unit ${unit}.*PDF page(?:s)? ${page}`));
 assert.equal(p.questions.length,count);
 assert.ok(p.he.length>300&&p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)&&q.opts.includes(q.a)));
}
assert.match(passages.find(p=>p.id==='lilmod-17-prepositions').he,/שמעתי _____ החכמים/);
assert.match(passages.find(p=>p.id==='lilmod-18-rescue').he,/השלימו את המילים החסרות/);
assert.ok(!passages.find(p=>p.id==='lilmod-17-solon').he.includes('התרגז המלך על עצתך'));
const newBank={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-question-banks-34-35.js'),'utf8'),newBank);
for(const [level,expected] of [[34,17],[35,14]]){
 const questions=newBank.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level];assert.equal(questions.length,expected);
 assert.ok(questions.every(q=>q.sourcePage>=({34:197,35:206})[level]&&q.sourcePage<=({34:205,35:213})[level]&&q.sourceExercise&&q.explanation&&q.practiceOrigin));
 assert.ok(questions.every(q=>!/^(reading|questions|cloze|rescue|numbers|opposite)\./.test(q.sourceExercise)||level===34&&q.sourceExercise.startsWith('opposite.')));
}
assert.ok(!newBank.window.HEBREW_TEXTBOOK_QUESTION_BANKS[34].some(q=>q.sourceExercise==='noun.3'));
assert.ok(!newBank.window.HEBREW_TEXTBOOK_QUESTION_BANKS[35].some(q=>q.sourceExercise==='notice.3'));
for(const [id,page,count] of [['lilmod-15-real-story',179,10],['lilmod-15-cake',180,1],['lilmod-16-ducklings',187,11],['lilmod-16-nurit',191,4],['lilmod-16-police-order',193,3],['lilmod-16-caption',194,3]]){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);
 assert.match(p.source,new RegExp(`PDF page(?:s)? ${page}`));
 assert.equal(p.questions.length,count);
 assert.ok(p.he.length>80&&p.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)));
}
assert.ok(!passages.find(p=>p.id==='lilmod-16-police-order').he.includes('גנב כסף מן המשרד'));
assert.ok(passages.find(p=>p.id==='lilmod-16-ducklings').he.includes('שבעה ברווזונים'));
const checks={32:'lilmod-15-real-story',33:'lilmod-16-ducklings'};
const checkpoints={window:{HEBREW_CHAPTER_INTERPRETATION:{}}};
for(const file of ['textbook-interpretation-32-33.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),checkpoints);
for(const [level,id] of Object.entries(checks)){
 const passage=passages.find(p=>p.id===id);
 for(const question of checkpoints.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  const phrase=question.prompt.split('\n')[1].replace(/[.,]/g,'');
  assert.ok(passage.he.replace(/[.,]/g,'').includes(phrase),`chapter ${level} interpretation missing from reading`);
 }
}
for(const [id,unit,page,count] of [['lilmod-13-free-woman',13,155,6],['lilmod-14-spoils',14,165,10],['lilmod-14-rabbit',14,166,1],['lilmod-14-kruger',14,177,1]]){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);
 assert.match(p.source,new RegExp(`unit ${unit}.*PDF page(?:s)? ${page}`));
 assert.equal(p.questions.length,count);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)));
}
assert.ok(passages.find(p=>p.id==='lilmod-13-free-woman').he.includes('אתה יוצא כל בוקר מהבית'));
assert.ok(!passages.find(p=>p.id==='lilmod-13-free-woman').he.includes('הוא יוצא כל בוקר מהבית'));
assert.ok(passages.find(p=>p.id==='lilmod-14-spoils').he.includes('אני והזאב נסתפק בשפן'));
for(const [id,page,count] of [['lilmod-1-slowly-surely',11,6],['lilmod-2-many-stones',24,5],['lilmod-3-anywhere',35,5],['lilmod-4-credulous',48,6]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF pages? '+page));assert.equal(p.questions.length,count);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)));
}
const interpretations={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-interpretation-checkpoints.js'),'utf8'),interpretations);
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-interpretation-28-29.js'),'utf8'),interpretations);
for(const [level,id,page] of [[18,'lilmod-1-slowly-surely',11],[19,'lilmod-2-many-stones',24],[20,'lilmod-3-anywhere',35],[21,'lilmod-4-credulous',48]]){
 const p=passages.find(x=>x.id===id);
 for(const q of interpretations.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  assert.equal(q.sourcePage,page);
  const normalized=s=>s.replace(/[.,:!?״]/g,'').replace(/\s+/g,' ').trim();
  assert.ok(normalized(p.he).includes(normalized(q.prompt.split('\n')[1])),`Interpretation not in chapter ${level} reading`);
 }
}
for(const [level,id,page,count] of [[22,'lilmod-5-mothers-medicine',61,6],[23,'lilmod-6-sherlock-holmes',73,5]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF page '+page));assert.equal(p.questions.length,count);
 assert.ok(p.he.length>400&&p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)));
 for(const q of interpretations.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  assert.equal(q.sourcePage,page);
  assert.ok(p.he.includes(q.prompt.split('\n')[1]),`Interpretation not in chapter ${level} reading`);
 }
}
for(const [level,id,page,count] of [[24,'lilmod-7-transport',86,5],[25,'lilmod-8-swedish-ad',99,5]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF page '+page));assert.equal(p.questions.length,count);
 assert.ok(p.he.length>500&&p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)));
 for(const q of interpretations.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  assert.equal(q.sourcePage,page);
  assert.ok(p.he.includes(q.prompt.split('\n')[1]),`Interpretation not in chapter ${level} reading`);
 }
}
for(const [level,id,page,count] of [[26,'lilmod-9-school-on-wheels',109,13],[27,'lilmod-10-western-wall-legend',119,15]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF page '+page));assert.equal(p.questions.length,count);
 assert.ok(p.he.length>500&&p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)));
 for(const q of interpretations.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  assert.equal(q.sourcePage,page);
  const normalized=s=>s.replace(/[.,:!?״]/g,'').replace(/\s+/g,' ').trim();
  assert.ok(normalized(p.he).includes(normalized(q.prompt.split('\n')[1])),`Interpretation not in chapter ${level} reading`);
 }
}
for(const [level,id,page,count] of [[28,'lilmod-11-dangerous-trip',132,10],[29,'lilmod-12-colors',143,10]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF page(?:s)? '+page));assert.equal(p.questions.length,count);
 assert.ok(p.he.length>700&&p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)));
 for(const q of interpretations.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  assert.equal(q.sourcePage,page);
  const normalized=s=>s.replace(/[.,:!?״]/g,'').replace(/\s+/g,' ').trim();
  assert.ok(normalized(p.he).includes(normalized(q.prompt.split('\n')[1])),`Interpretation not in chapter ${level} reading`);
 }
}
for(const [id,page,count] of [['lilmod-11-rich-happy',142,2],['lilmod-12-locker-room',153,3]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF page '+page));assert.equal(p.questions.length,count);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation));
}
assert.ok(!passages.find(p=>p.id==='lilmod-12-locker-room').he.includes('הצבע השחור ירגיע'));
assert.ok(!passages.some(p=>/Uploaded intermediate Hebrew notes|Intermediate 2 PDF/.test(p.source)));
const nahalal=passages.find(p=>p.id==='ulpan-10-nahalal');
assert.ok(nahalal);
assert.match(nahalal.source,/אולפן עברית.*lesson 10.*PDF page 105/);
assert.match(nahalal.he,/מושב נהלל, מושב העובדים הראשון בישראל, נוסד ב-1921/);
assert.deepEqual(Array.from(nahalal.questions,q=>q.q),[
  'מתי נוסד המושב?','איפה נמצא המושב?','איפה נמצא השם ״נהלל״?',
  'כמה אנשים חיים במושב?','איפה עובדים רוב האנשים שחיים במושב?',
  'מה יכולים לעשות אנשים שמטיילים בצפון?'
]);
for(const p of passages.filter(p=>/^(אולפן עברית|עברית בשניים)/.test(p.source))){
 assert.ok(p.he.trim()&&p.source.includes('PDF page'));
 for(const q of p.questions){assert.equal(q.opts.length,4);assert.ok(q.opts.includes(q.a));assert.ok(q.explanation)}
}
for(const id of ['shnayim-4-open-houses','shnayim-4-photo','shnayim-4-synagogue','shnayim-4-hadid','shnayim-4-architect-cloze','shnayim-4-shanti','shnayim-4-wise-man']){
 const p=passages.find(x=>x.id===id);assert.ok(p,id);assert.match(p.source,/chapter 4.*PDF page/);assert.ok(p.questions.every(q=>q.explanation&&q.kind));
}
assert.ok(passages.find(p=>p.id==='shnayim-4-synagogue').questions.some(q=>q.a==='רם כרמי'));
assert.ok(passages.find(p=>p.id==='shnayim-4-architect-cloze').he.includes('_____ בבתי קפה'));
for(const id of ['bilingual','facebook','szold','father','sparta','finland','goldberg','yalan','harlow','darwish','robin']){
 const p=passages.find(x=>x.id==='shnayim-5-'+id);assert.ok(p,id);assert.match(p.source,/chapter 5.*PDF page/);assert.ok(p.questions.every(q=>q.explanation&&q.kind));
}
assert.ok(passages.find(p=>p.id==='shnayim-5-harlow').he.includes('לאם מבד'));
assert.ok(passages.find(p=>p.id==='shnayim-5-robin').he.includes('(לספר, אני)'));
const communication=passages.find(p=>p.id==='shnayim-10-communication-language');
assert.ok(communication);
assert.match(communication.source,/עברית בשניים.*chapter 10.*PDF page 275/);
for(const [id,page,count,phrase] of [
 ['disappearing-languages',277,2,'7,000'],['hotel-dialogue',281,2,'יומיים'],['bilingual',283,1,'שתי השפות'],['cheese-book',285,2,'______'],['professions',285,1,'חלבן'],['ads',289,2,'דרוש חלבן'],['hebrew-script',291,3,'אותיות לטיניות'],['sign-performance',297,2,'תנועות ידיים'],['arbrabit',301,1,'ערברבית'],['babel',303,2,'מגדל גבוה'],['braille',305,2,'שש נקודות'],['xyz',307,1,'דור ה־X']]){
 const p=passages.find(x=>x.id==='shnayim-10-'+id);assert.ok(p,id);assert.match(p.source,new RegExp('chapter 10.*PDF page '+page));assert.equal(p.questions.length,count,id);assert.ok(p.he.includes(phrase),id);assert.ok(p.questions.every(q=>q.kind&&q.explanation&&q.opts.includes(q.a)),id);
}
const anat=passages.find(p=>p.id==='ulpan-10-anat-completion');
assert.ok(anat);
assert.match(anat.source,/אולפן עברית.*lesson 10.*PDF page 106/);
assert.match(anat.he,/אחרי הצהריים היא נוסעת ________ במכללה/);
assert.equal(anat.questions[0].a,'ללמוד');
console.log('PASS: source readings in chapters 10, 18–29, 34–46; original Hebrew reading context; source labels and corrections present.');
