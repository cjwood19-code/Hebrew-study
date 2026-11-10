/* Units 3–4 of ללמוד עברית ברמה ב׳: source context and chapter bank regression. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname,context={window:{},document:{getElementById:()=>null}};vm.createContext(context);
for(const file of ['textbook-question-banks.js','textbook-question-banks-20-21.js','textbook-interpretation-checkpoints.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
for(const [level,page] of [[20,35],[21,48]]){
 const bank=context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level],checks=context.window.HEBREW_CHAPTER_INTERPRETATION[level];
 assert.equal(bank.length,17);assert.equal(checks.length,3);
 assert.ok(bank.every(q=>q.category!=='Reading with context'&&q.explanation&&q.practiceOrigin==='Adapted lesson practice'));
 assert.ok(checks.every(q=>q.sourcePage===page&&q.prompt.split('\n')[1].split(' ').length>=5));
}
assert.ok(!context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[20].some(q=>q.prompt.includes('בחנות המכולת לוקחים עגלה')));
console.log('PASS: chapters 20–21 keep explained grammar/vocabulary; detached reading removed; supermarket/cart mismatch corrected; contextual interpretation cites scans.');
