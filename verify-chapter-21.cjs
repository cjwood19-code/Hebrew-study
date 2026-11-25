/* Unit 4 source schemas, reading context, flashcards, and chapter progression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),html=read('index.html');
assert.match(html,/app\.js\?v=\d{8}-(?:lilmod|shnayim|ulpan)-\d+-audit-v\d+/);
const scripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(m=>m[1]);
const store=new Map([['hebrewTextbookProgressV1',JSON.stringify({level:21,best:{20:100},history:[{level:20,correct:20,attempted:20,passed:true}]})],['hebrewGeneralFlashcardsV1','{"version":1,"cards":{"existing":{"status":"review"}}}'],['existingAdaptiveProgress','{"level":5}']]);
class E{constructor(){this.textContent='';this.value='';this.children=[];this.classList={s:new Set(),add(v){this.s.add(v)},remove(v){this.s.delete(v)},contains(v){return this.s.has(v)}};this.style={};this.disabled=false}set innerHTML(v){this.children=[]}appendChild(x){this.children.push(x)}click(){if(!this.disabled&&this.onclick)this.onclick()}}
const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new E());return els.get(id)};get('chapterQuiz').classList.add('hidden');
let timers=new Map(),tid=0;
const ctx={window:{},document:{getElementById:get,createElement:()=>new E()},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setTimeout:fn=>{timers.set(++tid,fn);return tid},clearTimeout:id=>timers.delete(id),confirm:()=>true};
vm.createContext(ctx);for(const f of scripts.filter(x=>x.startsWith('textbook-')))vm.runInContext(read(f),ctx,{filename:f});
const chapters=ctx.window.HEBREW_TEXTBOOK_CHAPTERS,bank=ctx.window.HEBREW_TEXTBOOK_QUESTION_BANKS[21],checks=ctx.window.HEBREW_CHAPTER_INTERPRETATION[21];
assert.equal(chapters.length,46);assert.equal(bank.length,17);assert.equal(checks.length,3);
for(const q of [...bank,...checks]){assert.ok(q.sourcePage>=48&&q.sourcePage<=60);assert.ok(q.sourceExercise&&q.explanation&&q.options.length===4&&q.options.includes(q.answer));assert.equal(new Set(q.options).size,4)}
assert.equal(bank.filter(q=>q.category==='עתיד • printed verb chart').length,4);
assert.ok(!bank.some(q=>q.answer==='הצעצוע'||q.prompt.includes('טוב היום')));
const app=read('app.js'),from=app.indexOf('const readingPassages=['),to=app.indexOf('\nlet readingSession=null;',from);assert.ok(from>=0&&to>from);
const reading=vm.runInNewContext(app.slice(from,to)+'\nreadingPassages',{D:{readingPassages:[]}});
for(const [id,count,page] of [['lilmod-4-credulous',6,48],['lilmod-4-ordinal-cloze',6,56]]){
 const p=reading.find(x=>x.id===id);assert.ok(p,id);assert.equal(p.questions.length,count);assert.match(p.source,new RegExp('PDF pages? '+page));assert.ok(p.he.length>300);
 for(const q of p.questions)assert.ok(q.kind&&q.explanation&&q.opts.includes(q.a)&&new Set(q.opts).size===4);
}
const cloze=reading.find(x=>x.id==='lilmod-4-ordinal-cloze');assert.ok(cloze.he.includes('התלמיד ה_____ (1)'));
assert.ok(cloze.questions.every(q=>q.kind.startsWith('Printed ordinal fill-in')));
for(const f of ['general-vocabulary-cards.js','general-flashcard-examples.js','ulpan4-cards-15-16.js','ulpan4-cards-17.js','lilmod-cards-18.js','lilmod-cards-19.js','lilmod-cards-20.js','lilmod-cards-21.js'])vm.runInContext(read(f),ctx,{filename:f});
const cards=ctx.window.HEBREW_GENERAL_FLASHCARDS;assert.equal(cards.length,165);
assert.equal(cards.filter(x=>x.chapter===21&&x.exampleHe?.includes(x.he)&&x.exampleEn&&x.sourcePage===48).length,4);
const tick=()=>{const f=[...timers.values()];timers.clear();f.forEach(x=>x())};
get('chapterSelect').value='21';get('chapterSelect').onchange();get('chapterStart').click();assert.equal(get('chapterQuestion').textContent,'Question 1 of 20');
function answer(wrong=false){const pool=[...bank,...checks],q=pool.find(x=>x.prompt===get('chapterPrompt').textContent);assert.ok(q);const button=get('chapterOptions').children.find(x=>wrong?x.textContent!==q.answer:x.textContent===q.answer);button.click()}
answer(true);tick();assert.equal(get('chapterQuestion').textContent,'Question 1 of 20');assert.match(get('chapterFeedback').textContent,/^Correct answer:/);assert.equal(get('chapterNext').classList.contains('hidden'),false);get('chapterNext').click();
for(let i=1;i<20;i++){answer();tick()}
const progress=JSON.parse(store.get('hebrewTextbookProgressV1'));assert.equal(progress.level,22);assert.equal(progress.history.at(-1).interpretationCorrect,3);
assert.equal(store.get('existingAdaptiveProgress'),'{"level":5}');assert.equal(JSON.parse(store.get('hebrewGeneralFlashcardsV1')).cards.existing.status,'review');
console.log('PASS: chapter 21 source schemas, two visible readings and 12 questions, four cards, interpretation, correction and Next, auto-advance, saved progress.');
