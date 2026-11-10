/* Deterministic chapter interaction tests. Run: node verify-chapters-24-25.cjs.
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
 ['hebrewTextbookProgressV1',JSON.stringify({level:24,best:{23:92},history:[{level:23,correct:86,attempted:89,passed:true}]})],
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
function bankCount(level){return context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level].length}
function total(level){return bankCount(level)+3}
function begin(level){get('chapterSelect').value=String(level);get('chapterSelect').onchange();assert.equal(get('chapterStart').disabled,false);get('chapterStart').click()}
function answer(wrong=false){
 const level=+get('chapterSelect').value;
 const pool=[...context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level],...context.window.HEBREW_CHAPTER_INTERPRETATION[level]];
 const q=pool.find(q=>q.prompt===get('chapterPrompt').textContent);assert.ok(q);
 const button=get('chapterOptions').children.find(b=>wrong?b.textContent!==q.answer:b.textContent===q.answer);
 button.click();button.click();return get('chapterScore').textContent;
}
assert.equal(get('textbookCurrent').textContent,'24 / 46');
begin(24);assert.equal(get('chapterQuestion').textContent,'Question 1 of '+total(24));
assert.equal(answer(),'1 / 1');assert.equal(get('chapterNext').classList.contains('hidden'),true);tick();
assert.match(get('chapterQuestion').textContent,/^Question 2 /);
for(let i=1;i<total(24);i++){answer();tick()}
assert.equal(saved().level,25);assert.equal(saved().best[24],100);assert.equal(saved().history.at(-1).interpretationCorrect,3);
assert.equal(get('chapterSelect').value,'25');
begin(25);assert.equal(get('chapterQuestion').textContent,'Question 1 of '+total(25));
for(let i=0;i<bankCount(25);i++){answer();tick()}
for(let i=0;i<3;i++){
 const before=get('chapterQuestion').textContent;answer(true);tick();
 assert.equal(get('chapterQuestion').textContent,before);
 assert.match(get('chapterFeedback').textContent,/^Correct answer:/);
 assert.equal(get('chapterNext').classList.contains('hidden'),false);
 get('chapterNext').click();
}
assert.equal(saved().level,25);assert.equal(saved().history.at(-1).passed,false);
assert.match(get('chapterOutcome').textContent,/Interpretation checkpoint not passed/);
begin(25);for(let i=0;i<total(25);i++){answer();tick()}
assert.equal(saved().level,26);assert.equal(saved().best[25],100);
assert.equal(get('chapterSelect').value,'26');assert.equal(get('chapterStart').disabled,false);
vm.runInContext(fs.readFileSync(path.join(__dirname,'textbook-curriculum.js'),'utf8'),context);
assert.equal(get('textbookCurrent').textContent,'26 / 46');
assert.equal(storage.get('hebrewGeneralFlashcardsV1'),previousCards);
assert.equal(storage.get('existingAdaptiveProgress'),previousAdaptive);
begin(24);answer();get('chapterExit').click();tick();
assert.equal(get('chapterMenu').classList.contains('hidden'),false);
begin(24);answer();get('chapterRestart').click();tick();
assert.equal(get('chapterScore').textContent,'0 / 0');
storage.set('hebrewTextbookProgressV1',JSON.stringify({level:24,best:{},history:[]}));
vm.runInContext(fs.readFileSync(path.join(__dirname,'textbook-curriculum.js'),'utf8'),context);
begin(24);for(let i=0;i<total(24);i++){const wrong=i===bankCount(24);answer(wrong);if(wrong)get('chapterNext').click();else tick()}
assert.equal(saved().history.at(-1).interpretationCorrect,2);assert.equal(saved().history.at(-1).passed,true);
console.log('PASS: 24 → 25 → ready 26; correct auto-advance; wrong correction and Next; interpretation gate; reload; progress and independent practice preserved.');
