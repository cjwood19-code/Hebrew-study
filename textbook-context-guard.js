/* Reading recall belongs with its passage, not as context-free chapter trivia. */
(function(){"use strict";
const banks=window.HEBREW_TEXTBOOK_QUESTION_BANKS||{};
const sourceDependent=/reading|dialogue|story|history|geography/i;
const passageReference=/\b(reading|passage|story|dialogue|article|advertisement|map)\b/i;
const hiddenSourceReference=/according to|source asks|source's|visit rules/i;
const hasHebrew=/[\u0590-\u05FF]/;
window.HEBREW_CONTEXT_REVIEW_QUEUE=[];
for(const [level,bank] of Object.entries(banks)){
 if(!Array.isArray(bank))continue;
 banks[level]=bank.filter(q=>{
  const needsPassage=!hasHebrew.test(q.prompt)&&(sourceDependent.test(q.category||"")||passageReference.test(q.prompt||"")||hiddenSourceReference.test(q.prompt||""));
  if(needsPassage)window.HEBREW_CONTEXT_REVIEW_QUEUE.push({level:Number(level),sourcePage:q.sourcePage,category:q.category,prompt:q.prompt});
  return !needsPassage;
 });
}
})();
