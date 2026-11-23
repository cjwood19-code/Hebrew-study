/* Unit 17 checked against the user's scan, indexed PDF pages 197–205. */
(function(){'use strict';
const all=window.HEBREW_TEXTBOOK_QUESTION_BANKS[34];if(!Array.isArray(all)||all.length!==17)throw Error('Unexpected unit 17 bank');
const bank=all.filter(q=>!q.sourceExercise.startsWith('infinitive.')&&!q.sourceExercise.startsWith('habitual.'));
if(bank.length!==9)throw Error('Unit 17 connected exercise move');
for(const q of bank){
 if(q.sourceExercise.startsWith('noun.')){
  q.practiceOrigin='Original verb-to-noun exercise A, PDF 199 (printed page 195); choices adapted';
  q.explanation=`בעמוד 195 מתאימים לפועל שם עצם. הצורה של ${q.prompt.split(' — ')[0]} היא ${q.answer}.`;
 }else if(q.sourceExercise.startsWith('opposite.')){
  q.practiceOrigin='Original opposite-word exercise D1, PDF 203 (printed page 199); choices adapted';
  q.explanation=`התרגיל מבקש את ההפך של ${q.prompt.split(' — ')[0]}. המילה המתאימה היא ${q.answer}.`;
 }else{
  q.practiceOrigin='Original choose-the-word exercise D3, PDF 204 (printed page 200); one additional scoring distractor';
  q.explanation=q.sourceExercise==='choice.1'?'המלך שמע על חכמתו של סולון; כינוי השייכות מציין את חכמת סולון.':q.sourceExercise==='choice.2'?'יוון העתיקה: שם התואר הידוע מתאים לשם הארץ המיודע.':'את בתו היפה: שם התואר בא אחרי שם העצם המיודע ומתאים לו.';
 }
 if(q.sourceExercise==='choice.2'){
  q.prompt='סולון חי ביוון _____. (עתיק / עתיקה / העתיקה)';
  q.options=['העתיקה','עתיק','עתיקה','העתיקים'];
 }
 if(!q.sourcePage||q.sourcePage<199||q.sourcePage>204||!q.sourceExercise||!q.explanation||!q.practiceOrigin||q.options.length!==4||new Set(q.options).size!==4||!q.options.includes(q.answer))throw Error('Unit 17 schema: '+q.sourceExercise);
}
window.HEBREW_TEXTBOOK_QUESTION_BANKS[34]=bank;
const checks=window.HEBREW_CHAPTER_INTERPRETATION[34];if(!Array.isArray(checks)||checks.length!==3)throw Error('Unit 17 interpretation');
checks.forEach((q,i)=>{q.sourceExercise='solon.interpretation.'+(i+1);if(!q.explanation)throw Error('Interpretation explanation '+i);});
})();
