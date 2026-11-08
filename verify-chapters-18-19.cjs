/* Source/context regression for the first two ללמוד עברית ברמה ב׳ units. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname,context={window:{},document:{getElementById:()=>null}};vm.createContext(context);
for(const file of ['textbook-question-banks.js','textbook-question-banks-18-19.js','textbook-interpretation-checkpoints.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
for(const [level,page,count] of [[18,11,22],[19,24,24]]){
 const bank=context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level],checks=context.window.HEBREW_CHAPTER_INTERPRETATION[level];
 assert.equal(bank.length,count);assert.equal(checks.length,3);
 assert.ok(bank.every(q=>q.category!=='Reading comprehension'&&q.explanation&&q.practiceOrigin==='Adapted lesson practice'));
 assert.ok(checks.every(q=>q.sourcePage===page&&q.prompt.split('\n')[1].split(' ').length>=4));
}
console.log('PASS: chapters 18–19 retain grammar practice with explanations; detached reading recall removed; contextual Hebrew interpretations cite scanned pages.');
