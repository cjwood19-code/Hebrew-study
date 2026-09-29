(function(){
  if(typeof upgradeTwoPartQuestion!=="function"||typeof sentences==="undefined")return;
  const baseUpgrade=upgradeTwoPartQuestion;
  upgradeTwoPartQuestion=function(q){
    q=baseUpgrade(q);
    if(!q||q.type!=="sentence2")return q;

    // Saved sessions can contain an older copy of a sentence question. Always
    // re-bind the answer and translation to the current canonical sentence.
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
    // Keep four choices where possible, but never allow the stored correct
    // answer to point to a translation belonging to another sentence.
    q.translationOptions=typeof shuffle==="function"?shuffle(opts.slice(0,4)):opts.slice(0,4);
    return q
  };
})();
