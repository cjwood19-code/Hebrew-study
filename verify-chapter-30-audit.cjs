/* Unit 13 source correction and connected-context regression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=__dirname,c={window:{HEBREW_CHAPTER_INTERPRETATION:{}}};vm.createContext(c);
for(const f of ['textbook-question-banks-30-31.js','textbook-interpretation-30-31.js','textbook-audit-30.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
const bank=c.window.HEBREW_TEXTBOOK_QUESTION_BANKS[30],checks=c.window.HEBREW_CHAPTER_INTERPRETATION[30],by=id=>bank.find(q=>q.sourceExercise===id);
assert.equal(bank.length,29);assert.equal(checks.length,3);assert.ok(checks.every(q=>q.interpretation&&q.explanation&&q.sourceExercise));
assert.ok(!bank.some(q=>/^(possessive\.story\.[1-3]|preposition\.[1-4])$/.test(q.sourceExercise)));
assert.equal(by('verb.choice.2').answer,'שטפת');assert.equal(by('verb.choice.4').answer,'כיבסתי; שטף');assert.equal(by('verb.choice.5').answer,'טיגנה; בישלה; אפתה');
assert.ok(bank.every(q=>q.sourcePage>=155&&q.sourcePage<=164&&q.explanation&&q.practiceOrigin&&q.options.includes(q.answer)));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),start=app.indexOf('const readingPassages=['),end=app.indexOf('\nlet readingSession=null;',start);const reading=vm.runInNewContext(app.slice(start,end)+'\nreadingPassages',{D:{readingPassages:[]}});
for(const [id,count,phrase] of [['lilmod-13-free-woman',6,'אני לא יושבת לקרוא עיתון'],['lilmod-13-family-possessives',2,'רבקה ______ של יוסף'],['lilmod-13-soccer-future',4,'המשחק לא']]){const p=reading.find(x=>x.id===id);assert.ok(p,id);assert.equal(p.questions.length,count,id);assert.ok(p.he.includes(phrase),id);assert.ok(p.questions.every(q=>q.explanation&&q.opts.length===4&&q.opts.includes(q.a)),id);}
assert.equal(reading.find(p=>p.id==='lilmod-13-soccer-future').questions[3].a,'ילך');
console.log('PASS: chapter 30 scan-linked bank, corrected verb choices, interpretation, and visible connected exercises.');
