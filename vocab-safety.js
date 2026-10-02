(function(){
  if(!window.TRAINER_DATA||!Array.isArray(window.TRAINER_DATA.vocab))return;

  const vocab=window.TRAINER_DATA.vocab;

  // Verified vocabulary policy:
  // 1. Keep all meanings supported by the user's study materials.
  // 2. Keep distinct Hebrew synonyms as separate vocabulary entries.
  // 3. Do not force an ambiguous unpointed form into a single isolated meaning.
  // 4. Recycle high-frequency conversational vocabulary throughout later study.

  function findWord(he){
    return vocab.find(function(item){return item&&item.he===he});
  }
  function upsert(he,en,cat){
    let item=findWord(he);
    if(item){
      item.en=en;
      if(cat&&!item.cat)item.cat=cat;
      return item;
    }
    item={he:he,en:en,cat:cat||"Verified vocabulary"};
    vocab.push(item);
    return item;
  }

  // Meanings and synonyms explicitly supported by the uploaded books/notes.
  upsert("מבחן","exam / test","Book B · Study");
  upsert("בחינה","exam / test","School / Work · Study");
  upsert("חשבון","account / bill / check","School / Work · Money");
  upsert("דרך","road / way / through","Places / Travel · Daily conversation");
  upsert("ארץ","land / country","Places / Travel · Daily conversation");
  upsert("תפקיד","job / role","School / Work · Daily conversation");
  upsert("מחקר","research","School / Work · Study");
  upsert("חקירה","investigation / inquiry","School / Work · Study");
  upsert("מקצוע","profession / occupation / field","School / Work · Daily conversation");
  upsert("מזומן","cash","School / Work · Money");

  // Unpointed Hebrew can contain forms whose meaning cannot be determined
  // without sentence context. Do not grade those as a single isolated
  // Hebrew→English vocabulary item. They remain available in contextual
  // sentence and conjugated-verb exercises.
  //
  // אוכל can be:
  //   ochel = food / eats (m.s., present of לאכול)
  //   uchal = I will be able to (future of יכול)
  // The uploaded study material uses these senses, so isolated אוכל is unsafe.
  const ambiguousIsolated=new Set(["אוכל"]);
  window.TRAINER_DATA.vocab=window.TRAINER_DATA.vocab.filter(function(item){
    return item&&item.he&&!ambiguousIsolated.has(item.he.trim());
  });

  // Persistent conversational core. These words remain in circulation even
  // after the learner moves into advanced chapters. Weighting is implemented
  // by adding extra references to the verified item; scoring/mastery still
  // uses the Hebrew key, so progress is not split across duplicates.
  const conversationalCore=[
    "מי","מה","איפה","מאיפה","כמה","מתי","למה","איך",
    "אני","אתה","את","הוא","היא","אנחנו","אתם","אתן","הם","הן",
    "שלום","בית","משפחה","אבא","אמא","בן","בת","אח","אחות","ילדים",
    "מים","קפה","לחם","טלפון","מחשב","ספר","עבודה",
    "רוצה","לומד","עובד","קורא","כותב","שותה","הולך","נוסע","קונה","רואה","עושה","גר",
    "תמיד","בדרך כלל","לפעמים","אף פעם לא","יש","אין","של","שלי","שלך","שלו","שלה","שלנו",
    "צפון","דרום","מזרח","מערב","דרך","ארץ","חשבון","מזומן","מקצוע","תפקיד",
    "מבחן","בחינה"
  ];
  conversationalCore.forEach(function(he){
    let item=window.TRAINER_DATA.vocab.find(function(x){return x.he===he});
    if(item){window.TRAINER_DATA.vocab.push(item);window.TRAINER_DATA.vocab.push(item)}
  });

  // Metadata for future/context-sensitive grading. The current trainer can use
  // these groups as the vocabulary engine is expanded chapter-by-chapter.
  window.TRAINER_DATA.meaningGroups=Object.assign({},window.TRAINER_DATA.meaningGroups||{}, {
    exam:{english:["exam","test"],hebrew:["מבחן","בחינה"]},
    account:{english:["account","bill","check"],hebrew:["חשבון"]},
    profession:{english:["profession","occupation","field"],hebrew:["מקצוע"]},
    investigation:{english:["investigation","inquiry"],hebrew:["חקירה"]}
  });
})();
