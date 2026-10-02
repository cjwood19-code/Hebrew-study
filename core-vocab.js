(function(){
  if(typeof pickItem!=="function"||typeof vocab==="undefined")return;

  // High-frequency words already present in the verified trainer vocabulary.
  // Keep this list to existing canonical entries so reinforcement never creates
  // a second translation or an unverified synonym.
  const coreConversationHebrew=new Set([
    "שלום","מי","מה","איפה","מאיפה","כמה","מתי","למה","איך",
    "אני","אתה","את","הוא","היא","אנחנו","אתם","אתן","הם","הן",
    "יש","אין","של","שלי","שלך","שלו","שלה","שלנו",
    "בית","חדר","שולחן","כיסא","דלת","חלון","טלפון","מחשב","ספר","ספרים",
    "מים","קפה","לחם",
    "אבא","אמא","בן","בת","אח","אחות","ילדים","משפחה",
    "רוצה","לומד","עובד","קורא","כותב","שותה","הולך","נוסע","קונה","רואה","עושה","גר",
    "תמיד","בדרך כלל","לפעמים","אף פעם לא",
    "טוב","חדש"
  ]);

  const coreConversationVocab=vocab.filter(function(v){return coreConversationHebrew.has(v.he)});
  const basePickItem=pickItem;

  // Missed/review material remains the first priority. Outside focused review,
  // roughly half of ordinary vocabulary draws come from the conversation core.
  // The rest still comes from the full course bank, so class vocabulary keeps
  // expanding while everyday words stay automatic.
  pickItem=function(){
    let review=typeof reviewWords==="function"?reviewWords():[];
    if(review.length&&(state.focus||Math.random()<.45)){
      let rec=rand(review),item=vocab.find(function(v){return v.he===rec[0]});
      if(item)return item
    }
    if(coreConversationVocab.length&&Math.random()<.55)return rand(coreConversationVocab);
    return basePickItem()
  };

  window.CORE_CONVERSATION_VOCAB=coreConversationVocab;
})();
