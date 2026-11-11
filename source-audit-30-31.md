# Chapters 30–31: source audit and rebuild (2026-11-11)

Source: user-supplied `ללמוד עברית ברמה ב'(2).pdf`, PDF pages 155–178. The public app references but does not bundle the scans. PDF page numbers run four ahead of the printed pages here.

| Chapter | Textbook unit | PDF range | Active Chapter Test exercises | Interpretation checks | Reading Practice |
|---|---|---:|---:|---:|---:|
| 30 | 13: אישה משוחררת | 155–164 | 35 | 3 | 1 passage, 6 questions |
| 31 | 14: חלוקת השלל | 165–178 | 36 | 3 | 2 passages, 7 questions |

The indexed textbook runs from 46 app chapters: 10 from אולפן עברית First Part, 7 from אולפן עברית Fourth Part, 19 from ללמוד עברית ברמה ב׳, and 10 from עברית בשניים לרמה ב׳. The user's later 39-chapter note differs by seven. It does not identify seven chapters to omit, so the stable 46-chapter index and saved progress remain intact. Curriculum reconciliation is unresolved.

## Corrections

- Moved all seven unit 13–14 reading questions out of Chapter Test into Reading Practice alongside source excerpts; added a source paragraph from the unit 14 rabbit passage and a related question. The short Kruger Park fill-in from PDF page 177 also remains a source exercise that needs its passage presented; it was removed from the context-free test for this run and is not counted as completed reading practice.
- Corrected the unit 13 opening: the wife addresses her husband as **אתה יוצא**, not **הוא יוצא**. Removed a salary claim absent from the passage.
- Corrected the unit 13 interpretation to **היום לא עשיתי את זה** and the unit 14 interpretation to **אני והזאב נסתפק בשפן**, both checked against PDF pages 156 and 165.
- Added lesson-linked explanations, source page, exercise identifier, and practice origin to each remaining Chapter Test question. Changed five English-only vocabulary prompts to ask in Hebrew while retaining the textbook exercise targets.
- Reading Practice shows the passage with each question and explains incorrect answers. Chapter Test retains Hebrew interpretation checks, correct-answer auto-advance, and incorrect-answer correction followed by Next. Existing local progress and independent practice storage are unchanged.

## Audit limits

The active 71 non-reading questions in these two chapters have valid unit page ranges, exercise IDs, Hebrew prompts, four answer choices, and explanations. This structural pass does **not** prove that every adapted distractor, answer, or sentence is an exact textbook transcription. The room-picture word practice is a word-list adaptation because the image is not displayed. Some unit 14 story-based reason prompts in Chapter Test depend on the Reading Practice passage being read first; the current app does not enforce that prerequisite. The original park cloze from PDF page 177 needs a displayed passage before it can be restored. These points keep chapters 30–31 from being called fully source-verified.

The app still has 46/46 indexed chapters with loaded banks, but this is a readiness count, not a source-verification count. The repository audit reports 134 held context-dependent bank questions and 449 active bank questions without an exercise label elsewhere in the curriculum. No global source-verified count has been established.

## Validation

`node --check app.js`, `node --check textbook-question-banks-30-31.js`, `node --check textbook-interpretation-30-31.js`, `node verify-chapters-30-31.cjs`, `node verify-reading-sources.cjs`, `node verify-reading-progression.cjs`, `node verify-flashcards.cjs`, `node validate-trainer.cjs`, `node audit-curriculum.cjs`.
