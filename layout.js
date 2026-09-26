(function(){
  function el(id){return document.getElementById(id)}
  function makeButton(label,id,icon){
    const b=document.createElement('button');
    b.className='practiceNavBtn';
    b.dataset.target=id;
    b.innerHTML='<span class="practiceNavIcon">'+icon+'</span><span>'+label+'</span>';
    return b
  }
  function install(){
    const main=document.querySelector('main'),quiz=el('quizCard');
    if(!main||!quiz||el('practiceHub'))return;

    // Keep the active lesson where it belongs: immediately after progress/status messaging.
    const message=el('message');
    if(message)message.insertAdjacentElement('afterend',quiz);

    // Make the review list compact and keep it close to the lesson.
    const reviewCard=Array.from(main.querySelectorAll(':scope > section.card')).find(function(s){return s.querySelector('#reviewList')});
    if(reviewCard){reviewCard.classList.add('reviewCardCompact');quiz.insertAdjacentElement('afterend',reviewCard)}

    const hub=document.createElement('section');
    hub.id='practiceHub';hub.className='card practiceHub';
    hub.innerHTML='<div class="sectionTitle"><div><h2>Practice Library</h2><p class="compact">Choose one activity. Only the activity you are using opens, keeping the main screen uncluttered.</p></div><span class="badge">Practice</span></div><div id="practiceNav" class="practiceNav"></div><button id="closePracticeTool" class="secondary wide hidden">Close practice activity</button>';
    (reviewCard||quiz).insertAdjacentElement('afterend',hub);

    const tools=[
      ['Rapid Recognition','rapidCard','⚡'],
      ['Reading','readingLibraryCard','א'],
      ['Conjugated Verbs','conjVerbCard','↔'],
      ['Infinitives','verbInfinitiveCard','ל'],
      ['Script Practice','scriptPracticeCard','✍︎']
    ];
    const nav=el('practiceNav');
    tools.forEach(function(t){
      const card=el(t[1]);if(!card)return;
      card.classList.add('practiceToolCard','hidden');
      hub.insertAdjacentElement('afterend',card);
      nav.appendChild(makeButton(t[0],t[1],t[2]));
    });

    // Put the long explanation behind a single reference button.
    const guide=Array.from(main.querySelectorAll(':scope > section.card')).find(function(s){const h=s.querySelector('h2');return h&&h.textContent.trim()==='Difficulty progression'});
    if(guide){
      guide.id='progressionGuide';guide.classList.add('practiceToolCard','referenceGuide','hidden');
      hub.insertAdjacentElement('afterend',guide);
      nav.appendChild(makeButton('Progression Guide','progressionGuide','?'));
    }

    function closeAll(){
      document.querySelectorAll('.practiceToolCard').forEach(function(c){c.classList.add('hidden')});
      document.querySelectorAll('.practiceNavBtn').forEach(function(b){b.classList.remove('active')});
      el('closePracticeTool').classList.add('hidden')
    }
    nav.addEventListener('click',function(e){
      const b=e.target.closest('.practiceNavBtn');if(!b)return;
      const target=el(b.dataset.target),already=b.classList.contains('active');
      closeAll();if(already)return;
      if(target){target.classList.remove('hidden');b.classList.add('active');el('closePracticeTool').classList.remove('hidden');target.scrollIntoView({behavior:'smooth',block:'start'})}
    });
    el('closePracticeTool').addEventListener('click',function(){closeAll();hub.scrollIntoView({behavior:'smooth',block:'start'})});

    // Shorter header copy on small screens; full title remains intact.
    document.body.classList.add('compactTrainerLayout');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
