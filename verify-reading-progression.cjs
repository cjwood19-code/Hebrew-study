/* Reading Practice regression: source passage, correction, Next, and saved result. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
const from=app.indexOf('const readingPassages=['),to=app.indexOf('\nrenderReadingLibrary();',from);
assert.ok(from>=0&&to>from);
const elements=new Map();
function el(){
  const classes=new Set();
  const e={textContent:'',children:[],offsetTop:0,onclick:null,
    classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,force)=>{if(force===undefined?classes.has(x):!force)classes.delete(x);else classes.add(x)}},
    appendChild(child){this.children.push(child)},focus(){}};
  Object.defineProperty(e,'innerHTML',{get(){return ''},set(v){if(v==='')this.children=[]}});
  return e;
}
function get(id){if(!elements.has(id))elements.set(id,el());return elements.get(id)}
const timers=new Map();let timerId=0;
const state={readingHistory:[]},context={state,save(){},norm:s=>s.trim(),shuffle:a=>a,window:{scrollTo(){}},document:{createElement:el},setTimeout(fn){timers.set(++timerId,fn);return timerId},clearTimeout(id){timers.delete(id)}};
context.$=get;vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'data.js'),'utf8'),context,{filename:'data.js'});
context.D=context.window.TRAINER_DATA;
vm.runInContext(app.slice(from,to+'\nrenderReadingLibrary();'.length),context,{filename:'reading-excerpt.js'});
const buttons=get('readingStoryButtons').children;
assert.equal(buttons.length,27);
assert.ok(buttons.some(b=>b.textContent==='לאט אבל בטוח'));
assert.ok(buttons.some(b=>b.textContent==='כל כך הרבה אבנים'));
assert.ok(buttons.some(b=>b.textContent==='בכל מקום אפשר ללמוד עברית'));
assert.ok(buttons.some(b=>b.textContent==='פתי מאמין לכל דבר'));
assert.ok(buttons.some(b=>b.textContent==='התרופה הטובה של אמא'));
assert.ok(buttons.some(b=>b.textContent==='שרלוק הולמס'));
assert.ok(buttons.some(b=>b.textContent==='סוס וחמור - כלי תחבורה'));
assert.ok(buttons.some(b=>b.textContent==='השודדת הבלונדינית'));
assert.ok(buttons.some(b=>b.textContent==='בית ספר על גלגלים'));
assert.ok(buttons.some(b=>b.textContent==='כך נתגלה הכותל המערבי — אגדה'));
assert.ok(buttons.some(b=>b.textContent==='טיול מסוכן'));
assert.ok(buttons.some(b=>b.textContent==='עשיר ומאושר'));
assert.ok(buttons.some(b=>b.textContent==='הצבעים'));
assert.ok(buttons.some(b=>b.textContent==='צבע הקירות של חדר ההלבשה'));
const button=buttons.find(b=>b.textContent==='שפת תקשורת');assert.ok(button);button.onclick();
assert.match(get('readingSource').textContent,/PDF page 275/);
assert.match(get('readingPassage').textContent,/האספרנטו לא הצליחה/);
assert.match(get('readingQuestion').textContent,/האספרנטו/);
let choices=get('readingChoices').children,wrong=choices.find(b=>b.textContent==='כן');assert.ok(wrong);wrong.onclick();
assert.match(get('readingQuestionFeedback').textContent,/Correct answer: לא/);
assert.equal(get('readingQuestionProgress').textContent,'Question 1 of 2');
get('nextReadingQuestionBtn').onclick();
assert.equal(get('readingQuestionProgress').textContent,'Question 2 of 2');
choices=get('readingChoices').children;const correct=choices.find(b=>b.textContent==='אנגלית');assert.ok(correct);correct.onclick();correct.onclick();
assert.equal(timers.size,1);assert.equal(get('nextReadingQuestionBtn').classList.contains('hidden'),true);
const [id,callback]=timers.entries().next().value;timers.delete(id);callback();
assert.equal(state.readingHistory.length,1);
assert.equal(state.readingHistory[0].id,'shnayim-10-communication-language');
assert.equal(state.readingHistory[0].correct,1);assert.equal(state.readingHistory[0].total,2);
console.log('PASS: Reading Practice source passage, wrong correction and Next, correct auto-advance, double-tap guard, saved result.');
