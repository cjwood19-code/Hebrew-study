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
for(const f of scripts.filter(f=>f.startsWith('textbook-')||f==='general-vocabulary-cards.js'||f==='general-flashcard-examples.js'))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
const banks=context.window.HEBREW_TEXTBOOK_QUESTION_BANKS,chapters=context.window.HEBREW_TEXTBOOK_CHAPTERS,cards=context.window.HEBREW_GENERAL_FLASHCARDS;
const reviewQueue=context.window.HEBREW_CONTEXT_REVIEW_QUEUE;
assert.ok(Array.isArray(reviewQueue)&&reviewQueue.length===134);
assert.equal(chapters.length,46);assert.equal(chapters.filter(c=>c.ready).length,46);
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
    assert.ok(/[\u0590-\u05FF]/.test(q.prompt)||!(/reading|dialogue|story|history|geography/i.test(q.category)||/\b(reading|passage|story|dialogue|article|advertisement|map)\b|according to|source asks|source's|visit rules/i.test(q.prompt)),label+' / source context missing');
  }
}
for(const ch of chapters)if(ch.ready&&ch.level>1)assert.ok(banks[ch.level]?.length);
for(const level of [20,21]){assert.equal(banks[level].length,17);assert.ok(banks[level].every(q=>q.category!=='Reading with context'&&q.explanation&&q.practiceOrigin));}
for(const level of [24,25]){
  assert.equal(banks[level].length,level===24?29:28);
  if(level===24){assert.ok(banks[level].some(q=>q.sourcePage===96&&q.prompt.startsWith('טסים בו')&&q.answer==='מטוס'));assert.ok(!banks[level].some(q=>q.sourcePage===96&&/מסוק/.test(q.prompt)));}
  assert.ok(banks[level].every(q=>!q.category.startsWith('Reading')&&q.explanation&&q.practiceOrigin==='Supplemental lesson practice'));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage),'New bank source ordering');
}
for(const level of [26,27]){
  assert.equal(banks[level].length,level===26?52:71);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>!q.category.startsWith('Reading')&&q.explanation&&q.practiceOrigin));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [28,29]){
  assert.equal(banks[level].length,level===28?27:33);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>!q.category.startsWith('Reading')&&q.explanation&&q.practiceOrigin));
  assert.ok(banks[level].filter(q=>q.category.startsWith('Reading')).every(q=>q.prompt.startsWith('Read')||q.category.startsWith('Reading completion')||q.category.startsWith('Reading choice')));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [30,31]){
  assert.equal(banks[level].length,level===30?35:32);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>q.sourcePage>=(level===30?157:167)&&q.sourcePage<=(level===30?164:176)));
  assert.ok(banks[level].every(q=>q.explanation&&q.practiceOrigin&&q.options.length===4&&q.options.includes(q.answer)));
  assert.ok(banks[level].every(q=>/[\u0590-\u05ff]/.test(q.prompt)&&!q.category.startsWith('Reading')));
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
for(const level of [36,37]){
  assert.equal(banks[level].length,level===36?23:38);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [38,39]){
  assert.equal(banks[level].length,level===38?22:18);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [40,41]){
  assert.equal(banks[level].length,level===40?14:13);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [42,43]){
  assert.equal(banks[level].length,level===42?15:12);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.equal(chapters[41].firstPage,152);assert.equal(chapters[41].lastPage,180);
assert.equal(chapters[42].firstPage,181);assert.equal(chapters[42].lastPage,211);
for(const level of [44,45]){
  assert.equal(banks[level].length,level===44?13:17);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.equal(chapters[43].firstPage,212);assert.equal(chapters[43].lastPage,239);
assert.equal(chapters[44].firstPage,240);assert.equal(chapters[44].lastPage,274);
assert.equal(banks[46].length,25);
assert.ok(banks[46].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
assert.ok(banks[46].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
assert.equal(chapters[45].firstPage,275);assert.equal(chapters[45].lastPage,308);
assert.equal(chapters[39].firstPage,102);assert.equal(chapters[39].lastPage,125);
assert.equal(chapters[40].firstPage,126);assert.equal(chapters[40].lastPage,151);
assert.equal(chapters[37].firstPage,38);assert.equal(chapters[37].lastPage,65);
assert.equal(chapters[38].firstPage,66);assert.equal(chapters[38].lastPage,101);
assert.equal(chapters[35].firstPage,214);assert.equal(chapters[35].lastPage,217);
assert.equal(chapters[36].firstPage,13);assert.equal(chapters[36].lastPage,37);
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
assert.equal(cards.length,56);assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);assert.equal(new Set(cards.map(c=>c.he)).size,cards.length);
assert.ok(!cards.some(c=>c.he==='מסוק'));
for(const c of cards){assert.ok(c.he&&c.en&&c.book);const ch=chapters[c.chapter-1];assert.ok(ch.ready&&c.sourcePage>=ch.firstPage&&c.sourcePage<=ch.lastPage);assert.ok(c.exampleHe.includes(c.he)&&c.exampleEn&&c.exampleKind==='Supplemental practice example',c.id+' / context example');}
console.log(JSON.stringify({syntax:'PASS',bankValidation:'PASS',chaptersReady:46,totalChapters:46,activeBankQuestions:count,contextQuestionsAwaitingPassages:reviewQueue.length,flashcards:cards.length}));

