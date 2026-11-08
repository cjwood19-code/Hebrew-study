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
assert.equal(passages.length,5);
for(const [id,page,count] of [['lilmod-1-slowly-surely',11,6],['lilmod-2-many-stones',24,5]]){
 const p=passages.find(x=>x.id===id);assert.ok(p);
 assert.match(p.source,new RegExp('PDF page '+page));assert.equal(p.questions.length,count);
 assert.ok(p.questions.every(q=>q.kind&&q.explanation&&/[\u0590-\u05FF]/.test(q.q)));
}
const interpretations={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'textbook-interpretation-checkpoints.js'),'utf8'),interpretations);
for(const [level,id,page] of [[18,'lilmod-1-slowly-surely',11],[19,'lilmod-2-many-stones',24]]){
 const p=passages.find(x=>x.id===id);
 for(const q of interpretations.window.HEBREW_CHAPTER_INTERPRETATION[level]){
  assert.equal(q.sourcePage,page);
  assert.ok(p.he.includes(q.prompt.split('\n')[1]),`Interpretation not in chapter ${level} reading`);
 }
}
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
console.log('PASS: source readings in chapters 10, 18, 19, and 46; original Hebrew reading context; source labels and corrections present.');
