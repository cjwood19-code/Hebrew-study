/* Deterministic chapter interaction tests. Run: node verify-chapters-13-14.cjs.
   Loads the production chapter scripts with a minimal DOM and controlled timers. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
class Classes{
 constructor(){this.values=new Set()}
 add(...v){v.forEach(x=>this.values.add(x))}
 remove(...v){v.forEach(x=>this.values.delete(x))}
 contains(v){return this.values.has(v)}
}
class Element{
 constructor(){this.classList=new Classes();this.children=[];this.style={};this.textContent='';this.value='';this.disabled=false}
 appendChild(child){this.children.push(child);return child}
 set innerHTML(value){this.children=[]}
 click(){if(!this.disabled&&this.onclick)this.onclick()}
}
const elements=new Map();
const get=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)};
get('chapterQuiz').classList.add('hidden');
const storage=new Map([
 ['hebrewTextbookProgressV1',JSON.stringify({level:13,best:{1:100,2:100},history:[{level:11,correct:11,attempted:11,passed:true},{level:12,correct:11,attempted:11,passed:true}]})],
 ['hebrewGeneralFlashcardsV1','{"review":["existing-card"]}'],
 ['existingAdaptiveProgress','{"level":12,"correct":99}']
]);
const previousCards=storage.get('hebrewGeneralFlashcardsV1'),previousAdaptive=storage.get('existingAdaptiveProgress');
let timers=new Map(),timerId=0;
const context={window:{},document:{getElementById:get,createElement:()=>new Element()},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 setTimeout:fn=>{timers.set(++timerId,fn);return timerId},clearTimeout:id=>timers.delete(id),confirm:()=>true};
vm.createContext(context);
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(m=>m[1]);
for(const script of scripts.filter(s=>s.startsWith('textbook-')))vm.runInContext(fs.readFileSync(path.join(__dirname,script),'utf8'),context,{filename:script});
function tick(){const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn())}
function saved(){return JSON.parse(storage.get('hebrewTextbookProgressV1'))}
function begin(level){get('chapterSelect').value=String(level);get('chapterSelect').onchange();assert.equal(get('chapterStart').disabled,false);get('chapterStart').click()}
function answer(level,wrong=false){const pool=[...context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level],...context.window.HEBREW_CHAPTER_INTERPRETATION[level]];const q=pool.find(q=>q.prompt===get('chapterPrompt').textContent);assert.ok(q);const b=get('chapterOptions').children.find(b=>wrong?b.textContent!==q.answer:b.textContent===q.answer);assert.ok(b);b.click();b.click()}
assert.equal(get('textbookCurrent').textContent,'13 / 46');
begin(13);assert.equal(get('chapterQuestion').textContent,'Question 1 of 13');assert.match(get('chapterDirection').textContent,/lesson 32.*PDF page 19/);
answer(13);tick();assert.match(get('chapterQuestion').textContent,/^Question 2 /);
for(let i=1;i<10;i++){answer(13);tick()}
for(let i=0;i<3;i++){let before=get('chapterQuestion').textContent;answer(13,true);tick();assert.equal(get('chapterQuestion').textContent,before);assert.match(get('chapterFeedback').textContent,/^Correct answer:/);assert.equal(get('chapterNext').classList.contains('hidden'),false);get('chapterNext').click()}
assert.equal(saved().level,13);assert.equal(saved().history.at(-1).passed,false);assert.match(get('chapterOutcome').textContent,/Interpretation checkpoint not passed/);
begin(13);for(let i=0;i<13;i++){answer(13);tick()}
assert.equal(saved().level,14);assert.equal(saved().history.at(-1).passed,true);assert.equal(saved().history.at(-1).interpretationCorrect,3);
begin(14);assert.equal(get('chapterQuestion').textContent,'Question 1 of 13');assert.match(get('chapterDirection').textContent,/lesson 33.*PDF page 23/);
for(let i=0;i<13;i++){answer(14);tick()}
assert.equal(saved().level,15);assert.equal(saved().history.at(-1).passed,true);assert.equal(saved().history.at(-1).interpretationCorrect,3);
vm.runInContext(fs.readFileSync(path.join(__dirname,'textbook-curriculum.js'),'utf8'),context);assert.equal(get('textbookCurrent').textContent,'15 / 46');assert.equal(storage.get('hebrewGeneralFlashcardsV1'),previousCards);assert.equal(storage.get('existingAdaptiveProgress'),previousAdaptive);
console.log('PASS: chapters 13–14 source banks; interpretation gate; auto-advance; correction and Next; reload; saved progress and independent practice.');
