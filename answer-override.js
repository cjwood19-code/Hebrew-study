(function(){
  if(typeof state==="undefined"||typeof record!=="function")return;

  if(!state.answerOverrides)state.answerOverrides=[];
  let questionSnapshot=null;
  let pendingWrong=null;

  function clone(x){return JSON.parse(JSON.stringify(x))}
  function captureQuestionState(){
    if(!state.session)return null;
    return {
      session:clone(state.session),
      runningAccuracy:clone(state.runningAccuracy||{attempted:0,correct:0}),
      levelAccuracy:clone(state.levelAccuracy||{}),
      masteryReview:clone(state.masteryReview||{}),
      missed:clone(state.missed||{}),
      blockMissed:clone((state.blockTests&&state.blockTests.missed)||[]),
      sentenceProgress:clone(state.sentenceProgress||{}),
      generatedSentences:clone(state.generatedSentences||[])
    }
  }
  function currentUserAnswer(){
    let input=document.getElementById("answerInput");
    if(input&&input.value)return input.value;
    if(typeof tileAnswer!=="undefined"&&tileAnswer.length)return tileAnswer.join(" ");
    return "Manual correction";
  }
  function removeOverrideButton(){
    let old=document.getElementById("answerOverrideBtn");if(old)old.remove()
  }
  function showOverrideButton(){
    removeOverrideButton();
    let next=document.getElementById("nextBtn"),feedback=document.getElementById("feedback");
    if(!next||!feedback)return;
    let b=document.createElement("button");
    b.id="answerOverrideBtn";b.className="secondary wide answerOverrideBtn";
    b.textContent="My answer should count as correct";
    b.onclick=applyOverride;
    next.parentNode.insertBefore(b,next);
  }
  function restoreSnapshot(s){
    state.session=clone(s.session);
    state.runningAccuracy=clone(s.runningAccuracy);
    state.levelAccuracy=clone(s.levelAccuracy);
    state.masteryReview=clone(s.masteryReview);
    state.missed=clone(s.missed);
    if(!state.blockTests)state.blockTests={passed:{},best:{},history:[],missed:[]};
    state.blockTests.missed=clone(s.blockMissed);
    state.sentenceProgress=clone(s.sentenceProgress);
    state.generatedSentences=clone(s.generatedSentences)
  }
  function applyCorrectResult(){
    let sourceLevel=questionLevel(current),isTest=state.session&&state.session.isTest;
    state.session.answered++;state.session.correct++;
    state.runningAccuracy.attempted++;state.runningAccuracy.correct++;
    updateLevelAccuracy(sourceLevel,true);

    if(current.type==="sentence2"){
      let s=current.sentenceObj||{he:current.fullHebrew,en:current.translation};
      markSentencePart(s,1,true);markSentencePart(s,2,true)
    }else updateMastery(current,true,sourceLevel);

    if(current.item){
      let k=current.item.he;state.missed[k]=Math.max(0,(state.missed[k]||0)-1)
    }
    if(isTest&&typeof clearRememberedTestMiss==="function")clearRememberedTestMiss(current);
  }
  function applyOverride(){
    if(!pendingWrong||!pendingWrong.snapshot)return;
    let userAnswer=pendingWrong.userAnswer,expected=current&&current.correct?current.correct:"";
    restoreSnapshot(pendingWrong.snapshot);
    applyCorrectResult();
    state.answerOverrides.push({date:new Date().toISOString(),prompt:current&&current.prompt||"",userAnswer:userAnswer,expected:expected,type:current&&current.type||""});
    state.answerOverrides=state.answerOverrides.slice(-250);
    save();renderHeader();
    let f=document.getElementById("feedback");
    if(f){f.textContent="Marked correct by override. This attempt now counts as correct for score and mastery.";f.className="feedback good"}
    removeOverrideButton();
    let next=document.getElementById("nextBtn");
    if(next){next.textContent=state.session.answered>=sessionLength()?"Finish":"Next";next.classList.remove("hidden")}
    pendingWrong=null
  }

  const originalNextQuestion=nextQuestion;
  nextQuestion=function(){
    removeOverrideButton();pendingWrong=null;
    originalNextQuestion();
    questionSnapshot=captureQuestionState()
  };

  const originalRecord=record;
  record=function(ok){
    let snap=questionSnapshot?clone(questionSnapshot):captureQuestionState();
    let userAnswer=currentUserAnswer();
    originalRecord(ok);
    if(!ok&&snap){pendingWrong={snapshot:snap,userAnswer:userAnswer};showOverrideButton()}
    else{pendingWrong=null;removeOverrideButton()}
  };

  // Capture the first question already rendered by app.js before this extension loads.
  questionSnapshot=captureQuestionState();
  save();
})();
