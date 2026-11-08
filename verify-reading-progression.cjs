/* Reading Practice regression: source passage, correction, Next, and saved result. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const from=app.indexOf('const readingPassages=['),to=app.indexOf('\nrenderReadingLibrary();',from);
assert.ok(from>=0&&to>from);
const elements=new Map();
function el(){
  const classes=new Set();
  return {textContent:'',innerHTML:'',children:[],offsetTop:0,onclick:null,
    classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,force)=>{if(force===undefined?classes.has(x):!force)classes.delete(x);else classes.add(x)}},
    appendChild(child){this.children.push(child)},focus(){}};
}
function get(id){if(!elements.has(id))elements.set(id,el());return elements.get(id)}
const state={readingHistory:[]},context={state,save(){},norm:s=>s.trim(),shuffle:a=>a,window:{scrollTo(){}},document:{createElement:el}};
context.$=get;vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'data.js'),'utf8'),context,{filename:'data.js'});
context.D=context.window.TRAINER_DATA;
vm.runInContext(app.slice(from,to+'\nrenderReadingLibrary();'.length),context,{filename:'reading-excerpt.js'});
const buttons=get('readingStoryButtons').children;
assert.equal(buttons.length,7);
const button=buttons.find(b=>b.textContent==='שפת תקשורת');assert.ok(button);button.onclick();
assert.match(get('readingSource').textContent,/PDF page 275/);
assert.match(get('readingPassage').textContent,/האספרנטו לא הצליחה/);
assert.match(get('readingQuestion').textContent,/האספרנטו/);
let choices=get('readingChoices').children,wrong=choices.find(b=>b.textContent==='כן');assert.ok(wrong);wrong.onclick();
assert.match(get('readingQuestionFeedback').textContent,/Correct answer: לא/);
assert.equal(get('readingQuestionProgress').textContent,'Question 1 of 2');
get('nextReadingQuestionBtn').onclick();
assert.equal(get('readingQuestionProgress').textContent,'Question 2 of 2');
choices=get('readingChoices').children.slice(4);const correct=choices.find(b=>b.textContent==='אנגלית');assert.ok(correct);correct.onclick();
get('nextReadingQuestionBtn').onclick();
assert.equal(state.readingHistory.length,1);
assert.equal(state.readingHistory[0].id,'shnayim-10-communication-language');
assert.equal(state.readingHistory[0].correct,1);assert.equal(state.readingHistory[0].total,2);
console.log('PASS: Reading Practice source passage, Hebrew comprehension, wrong correction and Next, completed result.');
