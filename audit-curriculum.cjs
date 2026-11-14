/* Inventory both scored chapter tests and Reading Practice without treating metadata as proof of transcription. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname,html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script src="([^"?]+)(?:\?[^" ]*)?"><\/script>/g)].map(m=>m[1]);
const context={window:{},document:{getElementById:()=>null}};vm.createContext(context);
for(const file of scripts.filter(f=>f.startsWith('textbook-')||f==='general-vocabulary-cards.js'||f==='general-flashcard-examples.js'||f==='data.js'||f==='book-exercises.js'))
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const {HEBREW_TEXTBOOK_CHAPTERS:chapters,HEBREW_TEXTBOOK_QUESTION_BANKS:banks,HEBREW_CHAPTER_INTERPRETATION:checks,HEBREW_CONTEXT_REVIEW_QUEUE:held,HEBREW_GENERAL_FLASHCARDS:cards,TRAINER_DATA:data}=context.window;
assert.equal(chapters.length,46);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const start=app.indexOf('const readingPassages=['),end=app.indexOf('\nlet readingSession=null;',start);
assert.ok(start>=0&&end>start);
const reading=vm.runInNewContext(app.slice(start,end)+'\nreadingPassages',{D:{readingPassages:data.readingPassages||[]}});
const passageChapters={'ulpan-10-nahalal':10,'ulpan-10-anat-completion':10,'lilmod-1-slowly-surely':18,'lilmod-2-many-stones':19,'lilmod-3-anywhere':20,'lilmod-4-credulous':21,'lilmod-5-mothers-medicine':22,'lilmod-6-sherlock-holmes':23,'lilmod-7-transport':24,'lilmod-8-swedish-ad':25,'lilmod-9-school-on-wheels':26,'lilmod-10-western-wall-legend':27,'lilmod-11-dangerous-trip':28,'lilmod-11-rich-happy':28,'lilmod-12-colors':29,'lilmod-12-locker-room':29,'lilmod-13-free-woman':30,'lilmod-14-spoils':31,'lilmod-14-rabbit':31,'lilmod-14-kruger':31,'lilmod-15-real-story':32,'lilmod-15-cake':32,'lilmod-16-ducklings':33,'lilmod-16-nurit':33,'lilmod-16-police-order':33,'lilmod-16-caption':33,'lilmod-17-solon':34,'lilmod-17-prepositions':34,'lilmod-18-whale':35,'lilmod-18-rescue':35,'lilmod-19-kol-nidrei':36,'shnayim-10-communication-language':46};
const names={ulpan:'אולפן עברית 1',ulpan4:'אולפן עברית 4',lilmod:'ללמוד עברית ב׳',shnayim:'עברית בשניים ב׳'};
const rows=[];let missingExercise=0,missingInterpretationPage=0;
for(const ch of chapters){
  const bank=banks[ch.level]||[],interpretation=checks[ch.level]||[],queue=held.filter(q=>q.level===ch.level),readings=reading.filter(p=>passageChapters[p.id]===ch.level),deck=cards.filter(c=>c.chapter===ch.level);
  for(const q of bank)assert.ok(Number.isInteger(q.sourcePage)&&q.sourcePage>=ch.firstPage&&q.sourcePage<=ch.lastPage,`Chapter ${ch.level}: invalid source page`);
  for(const q of interpretation)if(q.sourcePage!=null)assert.ok(q.sourcePage>=ch.firstPage&&q.sourcePage<=ch.lastPage,`Chapter ${ch.level}: interpretation page`);
  const noExercise=bank.filter(q=>!q.sourceExercise).length,noPage=interpretation.filter(q=>q.sourcePage==null).length;
  missingExercise+=noExercise;missingInterpretationPage+=noPage;
  rows.push({level:ch.level,book:names[ch.book],unit:ch.unit,pages:`${ch.firstPage}–${ch.lastPage}`,bank:bank.length,interpretation:interpretation.length,readingQuestions:readings.reduce((n,p)=>n+p.questions.length,0),held:queue.length,flashcards:deck.length,noExercise,noPage,explained:bank.filter(q=>q.explanation).length});
}
for(const p of reading){
  assert.ok(p.id&&p.he&&p.source&&p.questions.length,`Incomplete passage ${p.id}`);
  for(const q of p.questions)assert.ok(q.q&&q.a&&q.opts.length===4&&q.opts.includes(q.a),`Invalid reading question ${p.id}`);
}
const unassigned=reading.filter(p=>!passageChapters[p.id]);
const vocab=data.vocab||[],sentences=data.sentences||[],exercises=data.bookExercises||[];
const report=[
  '# Hebrew Trainer curriculum reconciliation audit',
  '',
  'Generated from the scripts loaded by `index.html` with `node audit-curriculum.cjs`. PDF page ranges and quiz schemas are checked automatically. A page number alone is **not** proof that the exact Hebrew, answer, or exercise is transcribed correctly; scan comparison is a separate editorial review.',
  '',
  '| Chapter | Book | Lesson/unit | PDF pages | Chapter bank | Bank with rationale | Hebrew interpretation | Reading Practice questions | Held for passage | Flashcards | Bank without exercise label | Interpretation without page |',
  '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...rows.map(r=>`| ${r.level} | ${r.book} | ${r.unit} | ${r.pages} | ${r.bank} | ${r.explained} | ${r.interpretation} | ${r.readingQuestions} | ${r.held} | ${r.flashcards} | ${r.noExercise} | ${r.noPage} |`),
  '',
  `**Loaded totals:** ${rows.reduce((n,r)=>n+r.bank,0)} active chapter-bank questions; ${rows.reduce((n,r)=>n+r.interpretation,0)} Hebrew interpretation checks; ${reading.length} Reading Practice activities with ${reading.reduce((n,p)=>n+p.questions.length,0)} questions; ${held.length} context-dependent bank items held out of chapter tests; ${cards.length} flashcards. ${chapters.filter(c=>c.ready).length}/46 chapters are indexed ready.`,
  '',
  '## Reading Practice placement',
  '',
  ...reading.map(p=>`- ${p.id}: ${p.questions.length} questions; ${passageChapters[p.id]?`chapter ${passageChapters[p.id]}`:'not assigned to an approved textbook chapter'}; ${p.source}.`),
  '',
  '## Reconciliation findings',
  '',
  '- The current app index contains 46 chapters: 10 from אולפן עברית First Part, 7 from its Fourth Part, 19 from ללמוד עברית ברמה ב׳, and 10 from עברית בשניים לרמה ב׳. The later 39-chapter note equals 10 + 19 + 10 and appears to omit the seven Fourth Part chapters, but that intent has not been confirmed. Keep the 46 stable chapter IDs and saved progress until the intended mapping is resolved; 46 indexed ready does not mean 46 source-verified.',
  '',
  `- ${held.length} passage-dependent chapter items are held out of scoring and still await passage transcription and comparison. The Reading Practice activities do not automatically replace these individual questions.`,
  `- ${missingExercise} active bank questions lack a specific source-exercise label (though they have in-range PDF page metadata); ${missingInterpretationPage} interpretation questions lack PDF page metadata. Those items need source-by-source editorial verification before claiming exact correspondence.`,
  `- ${rows.reduce((n,r)=>n+r.explained,0)} active bank questions have item-specific explanations. The remaining ${rows.reduce((n,r)=>n+r.bank-r.explained,0)} currently show the correct answer and a source reference; their rationale still needs authoring and review against the lesson.`,
  unassigned.length?`- ${unassigned.length} Reading Practice activities (${unassigned.reduce((n,p)=>n+p.questions.length,0)} questions) are not mapped to an approved textbook chapter and need source review.`:'- Every visible Reading Practice activity maps to a chapter in one of the three approved textbooks. Older intermediate-note material remains in the separate adaptive data without changing saved progress.',
  `- The earlier independent adaptive practice is a separate progression. It has ${vocab.length} vocabulary entries (${vocab.filter(x=>x.source).length} with source), ${sentences.length} sentences (${sentences.filter(x=>x.source).length} with source), and ${exercises.length} book exercises. Its level numbers are not the textbook chapter numbers, so these pools cannot be counted as reconciled chapter questions. Saved adaptive progress is preserved.`,
  '- Chapters 18–19 (ללמוד עברית ברמה ב׳ units 1–2): all 14 former reading-category bank prompts were removed from scoring; their English recall questions no longer appear without a passage. The scanned Hebrew stories on PDF pages 11 and 24 now appear with 11 contextual questions in Reading Practice, including the printed completion/comprehension structures and labeled supplemental checks.',
  '- Chapters 24–25 (ללמוד עברית ברמה ב׳ units 7–8): nine isolated reading prompts were removed from scored chapter tests and replaced by two visible source passages with ten contextual questions in Reading Practice. The unit 8 interpretation sentence was corrected from ענו למודעה to the scanned ענו לבחורה. The 57 remaining chapter questions have lesson explanations; their multiple-choice wording is labeled supplemental unless the reading question adapts a printed prompt.',
  '- Chapters 26–27 (ללמוד עברית ברמה ב׳ units 9–10): 15 excerpt-only reading prompts and 13 story-linked fill-ins were removed from scoring. Two visible Hebrew source excerpts with 28 contextual questions now appear in Reading Practice, including adapted printed comprehension, original fill-in structures with adapted choices, and labeled supplemental checks. The 123 remaining chapter-bank questions retain exercise identifiers and now have lesson-based explanations. The Western Wall account remains explicitly labeled as a legend.',
  '- Chapters 28–29 (ללמוד עברית ברמה ב׳ units 11–12): 28 reading-category questions moved from chapter tests into four visible Reading Practice activities with 25 contextual questions. The island-company answer was corrected to no house and no food. Two malformed possessive prompts were reconstructed from PDF 134; the second story and locker-room article were corrected against PDF 142 and 153. The 60 remaining grammar questions have source-exercise identifiers and lesson explanations.',
  '- Chapters 22–23 (ללמוד עברית ברמה ב׳ units 5–6): 21 isolated reading prompts and one unsupported infinitive item were removed from scored chapter tests. Two scan-backed reading excerpts and 11 contextual questions now appear in Reading Practice; two unit 5 prompts adapt printed questions. The false statement that the driver called Conan Doyle Italian was removed: the scan says the barber was Italian. All remaining chapter-bank questions have lesson explanations, and six interpretation checks cite their source pages.',
  '- Chapters 20–21 (ללמוד עברית ברמה ב׳ units 3–4): 11 excerpt-only reading prompts were removed from scoring and replaced with 11 questions beside original Hebrew reading excerpts in Reading Practice. The unit 3 supermarket/cart error was corrected against PDF page 35. Six interpretation checks now use longer source sentences and cite PDF pages 35 and 48; the remaining 34 chapter checks have lesson-specific explanations.',
  '- Chapters 34–35 (ללמוד עברית ברמה ב׳ units 17–18): the Solon story, preposition cloze, whale reading and number questions, and whale-rescue report now appear in four Reading Practice activities with 28 questions and visible source Hebrew. Their 31 remaining Chapter Test questions have exercise identifiers and lesson explanations. Unsupported and malformed source claims were removed or corrected as recorded in source-audit-34-35.md.',
  '- The source scan for ללמוד עברית ברמה ב׳ PDF page 96 shows a transport crossword. Its clue טסים בו supports מטוס; the previous מסוק card and question had no visible support there. The card was removed without reusing its stable ID, and the question now uses the original Hebrew clue. The bicycle clue also now appears in Hebrew.',
  '',
  '## Next source review',
  '',
  'Compare the held items against the printed Hebrew passages and migrate only source-confirmed questions into Reading Practice; inspect every item lacking an exercise label or interpretation page. Map independent adaptive entries to an approved lesson only where the uploaded source supports that mapping. Do not treat these counts as a completed line-by-line source audit.'
].join('\n')+'\n';
fs.writeFileSync(path.join(root,'curriculum-reconciliation-audit.md'),report);
console.log(JSON.stringify({chapters:chapters.length,activeBank:rows.reduce((n,r)=>n+r.bank,0),explained:rows.reduce((n,r)=>n+r.explained,0),interpretation:rows.reduce((n,r)=>n+r.interpretation,0),readingActivities:reading.length,readingQuestions:reading.reduce((n,p)=>n+p.questions.length,0),held:held.length,flashcards:cards.length,missingExercise,missingInterpretationPage,unassignedReading:unassigned.length,adaptive:{vocab:vocab.length,sentences:sentences.length,bookExercises:exercises.length}}));
