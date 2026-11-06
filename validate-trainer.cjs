/* Run with node validate-trainer.cjs. No third-party packages required. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const assert=require('node:assert/strict');
const root=__dirname;
for(const file of fs.readdirSync(root).filter(f=>/\.(js|cjs)$/.test(f))){execFileSync(process.execPath,['--check',path.join(root,file)]);}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(m=>m[1]);
for(const f of scripts)assert.ok(fs.existsSync(path.join(root,f)),'Missing script '+f);
const context={window:{},document:{getElementById:()=>null}};vm.createContext(context);
for(const f of scripts.filter(f=>f.startsWith('textbook-')||f==='general-vocabulary-cards.js'))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
const banks=context.window.HEBREW_TEXTBOOK_QUESTION_BANKS,chapters=context.window.HEBREW_TEXTBOOK_CHAPTERS,cards=context.window.HEBREW_GENERAL_FLASHCARDS;
assert.equal(chapters.length,46);assert.equal(chapters.filter(c=>c.ready).length,35);
let count=0;
for(const [level,bank] of Object.entries(banks)){
  assert.ok(Array.isArray(bank)&&bank.length,'Empty bank '+level);
  const chapter=chapters[+level-1];const prompts=new Set();
  for(const q of bank){
    const label='Chapter '+level+': '+q.prompt;
    for(const key of ['category','prompt','answer'])assert.ok(typeof q[key]==='string'&&q[key].trim(),label+' / '+key);
    assert.equal(q.options.length,4,label+' / option count');
    assert.equal(new Set(q.options).size,4,label+' / duplicate options');
    assert.ok(q.options.every(o=>typeof o==='string'&&o.trim()),label+' / empty option');
    assert.ok(q.options.includes(q.answer),label+' / missing answer');
    assert.ok(Number.isInteger(q.sourcePage)&&q.sourcePage>=chapter.firstPage&&q.sourcePage<=chapter.lastPage,label+' / source page');
    assert.ok(!prompts.has(q.prompt),label+' / duplicate prompt');prompts.add(q.prompt);count++;
  }
}
for(const ch of chapters)if(ch.ready&&ch.level>1)assert.ok(banks[ch.level]?.length);
for(const level of [24,25]){
  assert.equal(banks[level].length,33);
  assert.ok(banks[level].some(q=>q.category.startsWith('Reading')));
  assert.ok(banks[level].filter(q=>q.category.startsWith('Reading')).every(q=>q.prompt.startsWith('Read: ')));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage),'New bank source ordering');
}
for(const level of [26,27]){
  assert.equal(banks[level].length,level===26?65:86);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].filter(q=>q.category.startsWith('Reading')).every(q=>q.prompt.startsWith('Read')));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [28,29]){
  assert.equal(banks[level].length,level===28?41:47);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].filter(q=>q.category.startsWith('Reading')).every(q=>q.prompt.startsWith('Read')||q.category.startsWith('Reading completion')||q.category.startsWith('Reading choice')));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [30,31]){
  assert.equal(banks[level].length,level===30?41:44);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [32,33]){
  assert.equal(banks[level].length,level===32?30:38);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [34,35]){
  assert.equal(banks[level].length,level===34?32:32);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.equal(chapters[32].lastPage,196);
assert.equal(chapters[33].firstPage,197);assert.equal(chapters[33].lastPage,205);
assert.equal(chapters[34].firstPage,206);assert.equal(chapters[34].lastPage,213);
const checks=context.window.HEBREW_CHAPTER_INTERPRETATION;
for(const ch of chapters.filter(ch=>ch.ready&&ch.level>1)){
  assert.equal(checks[ch.level]?.length,3,'Missing interpretation checkpoint '+ch.level);
  for(const q of checks[ch.level]){
    assert.equal(q.interpretation,true);assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);assert.ok(q.options.includes(q.answer));
    assert.ok(/[\u0590-\u05FF]/.test(q.prompt));
    if(ch.level>=26)assert.ok(q.sourcePage>=ch.firstPage&&q.sourcePage<=ch.lastPage);
  }
}
assert.equal(cards.length,57);assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);assert.equal(new Set(cards.map(c=>c.he)).size,cards.length);
for(const c of cards){assert.ok(c.he&&c.en&&c.book);const ch=chapters[c.chapter-1];assert.ok(ch.ready&&c.sourcePage>=ch.firstPage&&c.sourcePage<=ch.lastPage);}
console.log(JSON.stringify({syntax:'PASS',bankValidation:'PASS',chaptersReady:35,totalChapters:46,bankQuestions:count,newQuestions:456,flashcards:cards.length}));

