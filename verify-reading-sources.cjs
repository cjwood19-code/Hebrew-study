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
assert.equal(passages.length,39);
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
const communication=passages.find(p=>p.id==='shnayim-10-communication-language');
assert.ok(communication);
assert.match(communication.source,/עברית בשניים.*chapter 10.*PDF page 275/);
const anat=passages.find(p=>p.id==='ulpan-10-anat-completion');
assert.ok(anat);
assert.match(anat.source,/אולפן עברית.*lesson 10.*PDF page 106/);
assert.match(anat.he,/אחרי הצהריים היא נוסעת ________ במכללה/);
assert.equal(anat.questions[0].a,'ללמוד');
console.log('PASS: source readings in chapters 10, 18–29, 34–37, and 46; original Hebrew reading context; source labels and corrections present.');
