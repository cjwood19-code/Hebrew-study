/* Source schema, reading context, and scored progression for unit 3. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),html=read('index.html');
assert.match(html,/app\.js\?v=\d{8}-lilmod-\d+-audit-v\d+/);
const scripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(m=>m[1]);
const store=new Map([['hebrewTextbookProgressV1',JSON.stringify({level:20,best:{19:100},history:[{level:19,correct:27,attempted:27,passed:true}]})],['hebrewGeneralFlashcardsV1','{"version":1,"cards":{"existing":{"status":"review"}}}'],['existingAdaptiveProgress','{"level":5}']]);
class E{constructor(){this.textContent='';this.value='';this.children=[];this.classList={s:new Set(),add(v){this.s.add(v)},remove(v){this.s.delete(v)},contains(v){return this.s.has(v)}};this.style={};this.disabled=false}set innerHTML(v){this.children=[]}appendChild(x){this.children.push(x)}click(){if(!this.disabled&&this.onclick)this.onclick()}}
const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new E());return els.get(id)};get('chapterQuiz').classList.add('hidden');
let timers=new Map(),tid=0;
const ctx={window:{},document:{getElementById:get,createElement:()=>new E()},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setTimeout:fn=>{timers.set(++tid,fn);return tid},clearTimeout:id=>timers.delete(id),confirm:()=>true};
vm.createContext(ctx);for(const f of scripts.filter(x=>x.startsWith('textbook-')))vm.runInContext(read(f),ctx,{filename:f});
const chapters=ctx.window.HEBREW_TEXTBOOK_CHAPTERS,bank=ctx.window.HEBREW_TEXTBOOK_QUESTION_BANKS[20],checks=ctx.window.HEBREW_CHAPTER_INTERPRETATION[20];
assert.equal(chapters.length,46);assert.equal(bank.length,17);assert.equal(checks.length,3);
for(const q of [...bank,...checks]){assert.ok(q.sourcePage>=35&&q.sourcePage<=47);assert.ok(q.sourceExercise&&q.explanation&&q.options.length===4&&q.options.includes(q.answer));assert.equal(new Set(q.options).size,4);}
assert.equal(bank.filter(q=>q.category==='שם הפועל • printed completion').length,3);
assert.ok(!bank.some(q=>q.prompt.includes('הם ___ שירים')));
const app=read('app.js'),from=app.indexOf('const readingPassages=['),to=app.indexOf('\nlet readingSession=null;',from);assert.ok(from>=0&&to>from);
const reading=vm.runInNewContext(app.slice(from,to)+'\nreadingPassages',{D:{readingPassages:[]}}),passage=reading.find(x=>x.id==='lilmod-3-anywhere');
assert.ok(passage&&passage.he.includes('בסופרמרקט לוקחים עגלה')&&passage.source.includes('PDF pages 35–36'));assert.equal(passage.questions.length,4);
for(const q of passage.questions)assert.ok(q.kind&&q.explanation&&q.opts.includes(q.a)&&new Set(q.opts).size===4);
assert.ok(!passage.questions.some(q=>q.q.includes('מה כדאי לקנות בחנות')));
for(const f of ['general-vocabulary-cards.js','general-flashcard-examples.js','ulpan4-cards-15-16.js','ulpan4-cards-17.js','lilmod-cards-18.js','lilmod-cards-19.js','lilmod-cards-20.js'])vm.runInContext(read(f),ctx,{filename:f});
const cards=ctx.window.HEBREW_GENERAL_FLASHCARDS;assert.equal(cards.length,161);
assert.equal(cards.filter(x=>x.chapter===20&&x.exampleHe?.includes(x.he)&&x.exampleEn&&x.sourcePage>=35&&x.sourcePage<=47).length,4);
const tick=()=>{const f=[...timers.values()];timers.clear();f.forEach(x=>x())};
get('chapterSelect').value='20';get('chapterSelect').onchange();get('chapterStart').click();assert.equal(get('chapterQuestion').textContent,'Question 1 of 20');
function answer(wrong=false){const pool=[...bank,...checks],q=pool.find(x=>x.prompt===get('chapterPrompt').textContent);assert.ok(q);const button=get('chapterOptions').children.find(x=>wrong?x.textContent!==q.answer:x.textContent===q.answer);button.click()}
answer(true);tick();assert.equal(get('chapterQuestion').textContent,'Question 1 of 20');assert.match(get('chapterFeedback').textContent,/^Correct answer:/);assert.equal(get('chapterNext').classList.contains('hidden'),false);get('chapterNext').click();
for(let i=1;i<20;i++){answer();tick()}
const progress=JSON.parse(store.get('hebrewTextbookProgressV1'));assert.equal(progress.level,21);assert.equal(progress.history.at(-1).interpretationCorrect,3);
assert.equal(store.get('existingAdaptiveProgress'),'{"level":5}');assert.equal(JSON.parse(store.get('hebrewGeneralFlashcardsV1')).cards.existing.status,'review');
console.log('PASS: chapter 20 source schemas, four contextual reading questions, four cards, interpretation gate, answer progression, correction and Next, saved progress.');
