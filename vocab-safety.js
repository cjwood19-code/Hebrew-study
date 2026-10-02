(function(){
  if(!window.TRAINER_DATA||!Array.isArray(window.TRAINER_DATA.vocab))return;

  // Unpointed Hebrew can contain forms whose meaning cannot be determined
  // without sentence context. Do not grade those as a single isolated
  // Hebrew→English vocabulary item. They remain available in contextual
  // sentence and conjugated-verb exercises.
  //
  // אוכל can be:
  //   ochel  = food / eats (m.s., present of לאכול)
  //   uchal  = I will be able to (future of יכול)
  // The uploaded study material uses all of these senses, so treating אוכל
  // alone as only "eats" can teach the wrong meaning.
  const ambiguousIsolated=new Set(["אוכל"]);
  window.TRAINER_DATA.vocab=window.TRAINER_DATA.vocab.filter(function(item){
    return item&&item.he&&!ambiguousIsolated.has(item.he.trim());
  });
})();
