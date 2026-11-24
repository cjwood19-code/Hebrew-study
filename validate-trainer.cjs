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
for(const f of scripts.filter(f=>f.startsWith('textbook-')||f==='general-vocabulary-cards.js'||f==='general-flashcard-examples.js'||f.startsWith('ulpan4-cards-')||f.startsWith('lilmod-cards-')))vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
const banks=context.window.HEBREW_TEXTBOOK_QUESTION_BANKS,chapters=context.window.HEBREW_TEXTBOOK_CHAPTERS,cards=context.window.HEBREW_GENERAL_FLASHCARDS;
const reviewQueue=context.window.HEBREW_CONTEXT_REVIEW_QUEUE;
assert.ok(Array.isArray(reviewQueue)&&reviewQueue.length===0);
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
assert.equal(banks[2].length,15);assert.equal(context.window.HEBREW_CHAPTER_INTERPRETATION[1].length,3);assert.equal(context.window.HEBREW_CHAPTER_INTERPRETATION[2].length,3);
for(const level of [1,2])assert.ok(context.window.HEBREW_CHAPTER_INTERPRETATION[level].every(q=>q.sourcePage&&q.sourceExercise&&q.explanation&&q.interpretation));
assert.ok(banks[2].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&/[\u0590-\u05ff]/.test(q.prompt)));
for(const [level,size] of [[3,13],[4,12]]){assert.equal(banks[level].length,size);assert.ok(banks[level].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&/[\u0590-\u05ff]/.test(q.prompt)));assert.ok(context.window.HEBREW_CHAPTER_INTERPRETATION[level].length===3&&context.window.HEBREW_CHAPTER_INTERPRETATION[level].every(q=>q.sourcePage&&q.sourceExercise&&q.explanation));}
for(const level of [5,6]){assert.equal(banks[level].length,8);assert.ok(banks[level].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&/[\u0590-\u05ff]/.test(q.prompt)));assert.ok(context.window.HEBREW_CHAPTER_INTERPRETATION[level].length===3&&context.window.HEBREW_CHAPTER_INTERPRETATION[level].every(q=>q.sourcePage&&q.sourceExercise&&q.explanation&&q.interpretation));}
for(const level of [7,8]){assert.equal(banks[level].length,8);assert.ok(banks[level].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&/[\u0590-\u05ff]/.test(q.prompt)));assert.ok(context.window.HEBREW_CHAPTER_INTERPRETATION[level].length===3&&context.window.HEBREW_CHAPTER_INTERPRETATION[level].every(q=>q.sourcePage&&q.sourceExercise&&q.explanation&&q.interpretation));}
for(const level of [20,21,22]){assert.equal(banks[level].length,17);assert.ok(banks[level].every(q=>q.category!=='Reading with context'&&q.explanation&&q.practiceOrigin));}
assert.equal(banks[23].length,13);assert.ok(banks[23].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&/[\u0590-\u05FF]/.test(q.prompt)));
assert.ok(context.window.HEBREW_CHAPTER_INTERPRETATION[23].every(q=>q.sourcePage===73&&q.sourceExercise&&q.explanation));
for(const level of [24,25]){
  assert.equal(banks[level].length,24);
  if(level===24){assert.ok(banks[level].some(q=>q.sourcePage===96&&q.prompt.startsWith('טסים בו')&&q.answer==='מטוס'));assert.ok(!banks[level].some(q=>q.sourcePage===96&&/מסוק/.test(q.prompt)));}
  assert.ok(banks[level].every(q=>!q.category.startsWith('Reading')&&q.explanation&&q.practiceOrigin&&q.sourceExercise&&/[\u0590-\u05FF]/.test(q.prompt)));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage),'New bank source ordering');
}
for(const level of [26,27]){
  assert.equal(banks[level].length,level===26?48:65);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>!q.category.startsWith('Reading')&&q.explanation&&q.practiceOrigin));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [28,29]){
  assert.equal(banks[level].length,level===28?23:26);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>!q.category.startsWith('Reading')&&q.explanation&&q.practiceOrigin));
  assert.ok(banks[level].filter(q=>q.category.startsWith('Reading')).every(q=>q.prompt.startsWith('Read')||q.category.startsWith('Reading completion')||q.category.startsWith('Reading choice')));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [30,31]){
  assert.equal(banks[level].length,level===30?29:32);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>q.sourcePage>=(level===30?157:167)&&q.sourcePage<=(level===30?164:176)));
  assert.ok(banks[level].every(q=>q.explanation&&q.practiceOrigin&&q.options.length===4&&q.options.includes(q.answer)));
  assert.ok(banks[level].every(q=>/[\u0590-\u05ff]/.test(q.prompt)&&!q.category.startsWith('Reading')));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [32,33]){
  assert.equal(banks[level].length,level===32?16:12);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every(q=>q.sourcePage>=(level===32?181:187)&&q.sourcePage<=(level===32?186:195)));
  assert.ok(banks[level].every(q=>q.explanation&&q.practiceOrigin&&q.options.length===4&&q.options.includes(q.answer)));
  assert.ok(banks[level].every(q=>/[\u0590-\u05ff]/.test(q.prompt)&&!/(Reading|Sequence|Past narrative|Police narrative|Story cloze)/.test(q.category)));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [34,35]){
  assert.equal(banks[level].length,level===34?9:6);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(context.window.HEBREW_CHAPTER_INTERPRETATION[level].length===3&&context.window.HEBREW_CHAPTER_INTERPRETATION[level].every(q=>q.explanation&&q.sourcePage));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.equal(chapters[32].lastPage,196);
assert.equal(chapters[33].firstPage,197);assert.equal(chapters[33].lastPage,205);
assert.equal(chapters[34].firstPage,206);assert.equal(chapters[34].lastPage,214);
for(const level of [36,37]){
  assert.equal(banks[level].length,level===36?6:17);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [38,39]){
  assert.equal(banks[level].length,level===38?7:6);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
for(const level of [40,41]){
  assert.equal(banks[level].length,level===40?13:12);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.ok(banks[40].every(q=>q.explanation&&q.practiceOrigin&&/[\u0590-\u05FF]/.test(q.prompt)));
assert.ok(banks[41].every(q=>q.explanation&&q.practiceOrigin&&/[\u0590-\u05FF]/.test(q.prompt)));
assert.ok(!banks[41].some(q=>/reading|dialogue|story/i.test(q.category)));
assert.ok(!banks[40].some(q=>q.category.startsWith('Reading')));
assert.equal(banks[40].find(q=>q.sourceExercise==='matching.1').sourcePage,125);
for(const level of [42,43]){
  assert.equal(banks[level].length,level===42?10:8);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.equal(chapters[41].firstPage,152);assert.equal(chapters[41].lastPage,180);
assert.equal(chapters[42].firstPage,181);assert.equal(chapters[42].lastPage,211);
for(const level of [44,45]){
  assert.equal(banks[level].length,level===44?13:17);
  assert.ok(banks[level].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise&&q.explanation&&q.practiceOrigin&&/[\u0590-\u05FF]/.test(q.prompt)));
  assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
}
assert.equal(chapters[43].firstPage,212);assert.equal(chapters[43].lastPage,239);
assert.equal(chapters[44].firstPage,240);assert.equal(chapters[44].lastPage,274);
assert.equal(banks[46].length,21);
assert.ok(banks[46].every(q=>typeof q.sourceExercise==='string'&&q.sourceExercise));
assert.ok(banks[46].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));
assert.equal(chapters[45].firstPage,275);assert.equal(chapters[45].lastPage,308);
assert.equal(chapters[39].firstPage,102);assert.equal(chapters[39].lastPage,125);
assert.equal(chapters[40].firstPage,126);assert.equal(chapters[40].lastPage,151);
assert.equal(chapters[37].firstPage,38);assert.equal(chapters[37].lastPage,65);
assert.equal(chapters[38].firstPage,66);assert.equal(chapters[38].lastPage,101);
assert.equal(chapters[35].firstPage,215);assert.equal(chapters[35].lastPage,216);
assert.equal(chapters[36].firstPage,13);assert.equal(chapters[36].lastPage,37);
for(const level of [9,10]){assert.equal(banks[level].length,level===9?8:7);assert.ok(banks[level].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&q.sourcePage>=chapters[level-1].firstPage&&q.sourcePage<=chapters[level-1].lastPage));}
for(const level of [11,12]){assert.equal(banks[level].length,level===11?9:10);assert.ok(banks[level].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&q.sourcePage>=chapters[level-1].firstPage&&q.sourcePage<=chapters[level-1].lastPage));assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));}
for(const level of [13,14]){assert.equal(banks[level].length,10);assert.ok(banks[level].every(q=>q.sourceExercise&&q.explanation&&q.practiceOrigin&&q.sourcePage>=chapters[level-1].firstPage&&q.sourcePage<=chapters[level-1].lastPage));assert.ok(banks[level].every((q,i,b)=>i===0||q.sourcePage>=b[i-1].sourcePage));}
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
assert.equal(cards.length,220);assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);assert.equal(new Set(cards.map(c=>c.he)).size,cards.length);
assert.ok(!cards.some(c=>c.he==='מסוק'));
for(const c of cards){assert.ok(c.he&&c.en&&c.book);const ch=chapters[c.chapter-1];assert.ok(ch.ready&&c.sourcePage>=ch.firstPage&&c.sourcePage<=ch.lastPage);assert.ok(c.exampleHe.includes(c.he)&&c.exampleEn&&['Supplemental practice example','Textbook sentence','Textbook sentence or printed exercise'].includes(c.exampleKind),c.id+' / context example');}
console.log(JSON.stringify({syntax:'PASS',bankValidation:'PASS',chaptersReady:46,totalChapters:46,activeBankQuestions:count,contextQuestionsAwaitingPassages:reviewQueue.length,flashcards:cards.length}));

