/* Chapter 39: connected fill-ins belong beside their printed Hebrew context. */
(function(){'use strict';
const bank=window.HEBREW_TEXTBOOK_QUESTION_BANKS[39];
const moved=new Set(['temporal.1','temporal.2','word-choice.1','word-choice.2','word-choice.3','future.4']);
if(!bank||bank.length!==12||bank.filter(q=>moved.has(q.sourceExercise)).length!==6)throw Error('Unexpected chapter 39 bank');
window.HEBREW_TEXTBOOK_QUESTION_BANKS[39]=bank.filter(q=>!moved.has(q.sourceExercise));
})();
