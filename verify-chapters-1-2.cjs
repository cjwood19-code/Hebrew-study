/* Deterministic chapter interaction tests. Run: node verify-chapters-26-27.cjs.
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
 ['hebrewTextbookProgressV1',JSON.stringify({level:1,best:{},history:[]})],
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
const curriculum=fs.readFileSync(path.join(__dirname,'textbook-curriculum.js'),'utf8');
const letterText=curriculum.slice(curriculum.indexOf('const letters=['),curriculum.indexOf('];',curriculum.indexOf('const letters=[')));
const letters=[...letterText.matchAll(/\["([^"]+)","([^"]+)"\]/g)].map(m=>[m[1],m[2]]);assert.equal(letters.length,31);
function answer(level,wrong=false){
 const prompt=get('chapterPrompt').textContent;
 const pool=[...(context.window.HEBREW_TEXTBOOK_QUESTION_BANKS[level]||[]),...context.window.HEBREW_CHAPTER_INTERPRETATION[level]];
 const q=pool.find(q=>q.prompt===prompt);
 let expected=q?.answer;
 if(!expected){const pair=letters.find(x=>x.includes(prompt));assert.ok(pair,'Unmapped letter '+prompt);expected=pair[0]===prompt?pair[1]:pair[0]}
 const button=get('chapterOptions').children.find(b=>wrong?b.textContent!==expected:b.textContent===expected);assert.ok(button,prompt);button.click();button.click();
}
assert.equal(get('textbookCurrent').textContent,'1 / 46');
begin(1);assert.equal(get('chapterQuestion').textContent,'Question 1 of 34');assert.match(get('chapterDirection').textContent,/PDF page 1/);
const first=get('chapterQuestion').textContent;answer(1,true);tick();assert.equal(get('chapterQuestion').textContent,first);assert.match(get('chapterFeedback').textContent,/Correct answer:/);assert.equal(get('chapterNext').classList.contains('hidden'),false);get('chapterNext').click();
for(let i=1;i<31;i++){answer(1);tick()}
for(let i=0;i<3;i++){const before=get('chapterQuestion').textContent;answer(1,true);tick();assert.equal(get('chapterQuestion').textContent,before);get('chapterNext').click()}
assert.equal(saved().level,1);assert.equal(saved().history.at(-1).passed,false);assert.equal(saved().history.at(-1).interpretationAttempted,3);assert.match(get('chapterOutcome').textContent,/Interpretation checkpoint not passed/);
begin(1);for(let i=0;i<34;i++){answer(1);tick()}
assert.equal(saved().level,2);assert.equal(saved().history.at(-1).passed,true);assert.equal(saved().history.at(-1).interpretationCorrect,3);
begin(2);assert.equal(get('chapterQuestion').textContent,'Question 1 of 18');assert.match(get('chapterDirection').textContent,/lesson 2.*PDF page 15/);
for(let i=0;i<18;i++){answer(2);tick()}
assert.equal(saved().level,3);assert.equal(saved().history.at(-1).passed,true);assert.equal(saved().history.at(-1).interpretationCorrect,3);
vm.runInContext(curriculum,context);assert.equal(get('textbookCurrent').textContent,'3 / 46');assert.equal(storage.get('hebrewGeneralFlashcardsV1'),previousCards);assert.equal(storage.get('existingAdaptiveProgress'),previousAdaptive);
console.log('PASS: chapters 1–2 alphabet and source bank, interpretation gate, correct auto-advance, wrong correction and Next, reload, saved progress and independent practice.');
