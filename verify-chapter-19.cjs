/* Source, schema, contextual reading, and scored progression regression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const html=read('index.html');
assert.match(html,/app\.js\?v=\d{8}-lilmod-\d+-audit-v\d+/);
const scripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(m=>m[1]);
const store=new Map([['hebrewTextbookProgressV1',JSON.stringify({level:19,best:{18:100},history:[{level:18,correct:16,attempted:16,passed:true}]})],['hebrewGeneralFlashcardsV1','{"version":1,"cards":{"existing":{"status":"review"}}}'],['existingAdaptiveProgress','{"level":5}']]);
class E{constructor(){this.textContent='';this.value='';this.children=[];this.classList={s:new Set(),add(v){this.s.add(v)},remove(v){this.s.delete(v)},contains(v){return this.s.has(v)}};this.style={};this.disabled=false}set innerHTML(v){this.children=[]}appendChild(x){this.children.push(x)}click(){if(!this.disabled&&this.onclick)this.onclick()}}
const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new E());return els.get(id)};
get('chapterQuiz').classList.add('hidden');
let timers=new Map(),tid=0;
const ctx={window:{},document:{getElementById:get,createElement:()=>new E()},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setTimeout:fn=>{timers.set(++tid,fn);return tid},clearTimeout:id=>timers.delete(id),confirm:()=>true};
vm.createContext(ctx);
for(const f of scripts.filter(x=>x.startsWith('textbook-')))vm.runInContext(read(f),ctx,{filename:f});
const ch=ctx.window.HEBREW_TEXTBOOK_CHAPTERS,b=ctx.window.HEBREW_TEXTBOOK_QUESTION_BANKS,c=ctx.window.HEBREW_CHAPTER_INTERPRETATION;
assert.equal(ch.length,46);
for(const level of [19]){
 assert.equal(b[level].length,24);assert.equal(c[level].length,3);
 for(const q of [...b[level],...c[level]]){assert.ok(q.sourcePage>=ch[level-1].firstPage&&q.sourcePage<=ch[level-1].lastPage);assert.ok(q.sourceExercise&&q.explanation&&q.options.length===4&&q.options.includes(q.answer));}
 assert.ok(!b[level].some(q=>/Reading comprehension|Self-contained reading/.test(q.category)));
}
const app=read('app.js'),from=app.indexOf('const readingPassages=['),to=app.indexOf('\nlet readingSession=null;',from);
assert.ok(from>=0&&to>from);
const reading=vm.runInNewContext(app.slice(from,to)+'\nreadingPassages',{D:{readingPassages:[]}});
for(const [id,count,page] of [['lilmod-2-many-stones',5,24],['lilmod-2-shabbat-cloze',6,29]]){
 const passage=reading.find(x=>x.id===id);assert.ok(passage,id);assert.equal(passage.questions.length,count);assert.match(passage.source,new RegExp('PDF page '+page));assert.ok(passage.he.length>300);
 for(const q of passage.questions)assert.ok(q.kind&&q.explanation&&q.opts.includes(q.a)&&new Set(q.opts).size===4);
}
assert.ok(reading.find(x=>x.id==='lilmod-2-shabbat-cloze').he.includes('סבא של דני גר בירושלים.'));
for(const f of ['general-vocabulary-cards.js','general-flashcard-examples.js','ulpan4-cards-15-16.js','ulpan4-cards-17.js','lilmod-cards-18.js','lilmod-cards-19.js'])vm.runInContext(read(f),ctx,{filename:f});
const cards=ctx.window.HEBREW_GENERAL_FLASHCARDS;
assert.equal(cards.length,157);
for(const level of [19])assert.equal(cards.filter(x=>x.chapter===level&&x.exampleHe?.includes(x.he)&&x.exampleEn&&x.sourcePage>=ch[level-1].firstPage&&x.sourcePage<=ch[level-1].lastPage).length,4);
const saved=()=>JSON.parse(store.get('hebrewTextbookProgressV1'));
const tick=()=>{const f=[...timers.values()];timers.clear();f.forEach(x=>x())};
function begin(level){get('chapterSelect').value=String(level);get('chapterSelect').onchange();get('chapterStart').click()}
function answer(level,wrong=false){const pool=[...b[level],...c[level]],q=pool.find(x=>x.prompt===get('chapterPrompt').textContent);assert.ok(q);const button=get('chapterOptions').children.find(x=>wrong?x.textContent!==q.answer:x.textContent===q.answer);button.click();}
begin(19);assert.equal(get('chapterQuestion').textContent,'Question 1 of 27');
answer(19,true);tick();assert.equal(get('chapterQuestion').textContent,'Question 1 of 27');assert.match(get('chapterFeedback').textContent,/^Correct answer:/);assert.equal(get('chapterNext').classList.contains('hidden'),false);get('chapterNext').click();
for(let i=1;i<27;i++){answer(19);tick()}
assert.equal(saved().level,20);assert.equal(saved().history.at(-1).interpretationCorrect,3);
assert.equal(saved().history.at(-1).interpretationCorrect,3);
assert.equal(store.get('existingAdaptiveProgress'),'{"level":5}');
assert.equal(JSON.parse(store.get('hebrewGeneralFlashcardsV1')).cards.existing.status,'review');
console.log('PASS: chapter 19 source schemas, two contextual readings, four flashcards, interpretation gate, auto-advance, correction and Next, saved progress.');
