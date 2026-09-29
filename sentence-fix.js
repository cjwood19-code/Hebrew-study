(function(){
  if(typeof upgradeTwoPartQuestion!=="function"||typeof sentences==="undefined")return;

  function syncSentence(q){
    if(!q||q.type!=="sentence2")return q;
    const full=(q.fullHebrew||(q.sentenceObj&&q.sentenceObj.he)||"").trim();
    if(!full)return q;
    const canonical=sentences.find(function(s){return (s.he||"").trim()===full});
    if(!canonical)return q;

    q.sentenceObj=canonical;
    q.fullHebrew=canonical.he;
    q.translation=canonical.en;
    if(q.correctWord)q.correct=q.correctWord+"||"+canonical.en;

    let opts=Array.isArray(q.translationOptions)?q.translationOptions.slice():[];
    opts=opts.filter(function(x){return x&&x!==canonical.en});
    opts.unshift(canonical.en);
    q.translationOptions=typeof shuffle==="function"?shuffle(opts.slice(0,4)):opts.slice(0,4);
    return q
  }

  const baseUpgrade=upgradeTwoPartQuestion;
  upgradeTwoPartQuestion=function(q){return syncSentence(baseUpgrade(q))};

  // app.js renders the first question before this extension loads. Repair that
  // already-visible question too, rather than waiting for the next question.
  if(typeof current!=="undefined"&&current&&current.type==="sentence2"){
    current=syncSentence(current);
    const instruction=document.getElementById("instruction");
    if(instruction&&/Part 2 of 2/.test(instruction.textContent||"")&&typeof renderSentenceTranslationPart==="function"){
      renderSentenceTranslationPart()
    }
  }
})();
