/* Unit 12 source mapping and reading-context regression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=__dirname,c={window:{HEBREW_CHAPTER_INTERPRETATION:{}}};vm.createContext(c);
for(const f of ['textbook-question-banks-28-29.js','textbook-interpretation-28-29.js','textbook-audit-29.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const bank=c.window.HEBREW_TEXTBOOK_QUESTION_BANKS[29],checks=c.window.HEBREW_CHAPTER_INTERPRETATION[29];
assert.equal(bank.length,26);assert.equal(checks.length,3);assert.ok(checks.every(q=>q.interpretation&&q.sourcePage===143&&q.explanation));
assert.ok(!bank.some(q=>/^(action\.noun\.[3-6]|roots\.[1-3])$/.test(q.sourceExercise)));
assert.ok(bank.every(q=>q.sourcePage>=143&&q.sourcePage<=154&&q.explanation&&q.sourceExercise&&q.options.includes(q.answer)));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),start=app.indexOf('const readingPassages=['),end=app.indexOf('\nlet readingSession=null;',start);const reading=vm.runInNewContext(app.slice(start,end)+'\nreadingPassages',{D:{readingPassages:[]}});
for(const [id,count,phrase] of [['lilmod-12-colors',10,'לצבעים שונים'],['lilmod-12-archaeology-forms',4,'יוסי ______'],['lilmod-12-investigation-root',5,'בעיתון ״מעריב״'],['lilmod-12-locker-room',3,'צבע חדר ההלבשה']]){const p=reading.find(x=>x.id===id);assert.ok(p,id);assert.equal(p.questions.length,count,id);assert.ok(p.he.includes(phrase),id);assert.ok(p.questions.every(q=>q.explanation&&q.opts.length===4&&q.opts.includes(q.a)),id);}
assert.ok(!reading.find(p=>p.id==='lilmod-12-investigation-root').he.includes('חוקרי המשטרה'));
console.log('PASS: chapter 29 scan-linked bank, interpretation, visible archaeology and root exercises, and reading questions.');
