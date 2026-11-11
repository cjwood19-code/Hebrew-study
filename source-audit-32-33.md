# Chapters 32–33: textbook audit and rebuild (2026-11-11)

Source: user-supplied `ללמוד עברית ברמה ב'(2).pdf`, PDF pages 179–196. Page 178 still belongs to unit 14. Unit 15 starts on page 179 and unit 16 on page 187. The scans are not part of the public repository. Original Hebrew excerpts in Reading Practice use `[...]` where material was omitted; English summaries, four-choice answers, and supplemental questions are adaptations.

| App chapter | Textbook unit | PDF pages | Active Chapter Test exercises | Hebrew interpretation | Reading Practice |
|---|---|---:|---:|---:|---:|
| 32 | 15, סיפור מהמציאות | 179–186 | 19 | 3 | 2 activities, 11 questions |
| 33 | 16, השודדים והברווזים הקטנים | 187–196 | 17 | 3 | 4 activities, 21 questions |

## Corrections and placement

- Unit 15's family story, comprehension, and story sequence now appear with the passage in Reading Practice. The matchmaker's cake dialogue is a separate short activity. The prior bank mislabeled three questions about the family story as the printed ordering exercise on page 184; that page contains a different matchmaker story. Those questions are now marked supplemental and tied to page 179.
- Unit 16's robbery, ducklings, and printed event-ordering material appear together. The Nurit break-in narrative, police sentence-ordering exercise, and photo-caption fill-in are separate activities with their Hebrew source context visible.
- Removed the unsupported claim that the young man stole money from an office in the police ordering question. Corrected the interpretation sentence to the scan's `אך ג׳ק לא רצה לדרוס את הברווזונים הקטנים ועצר`. Corrected a unit 15 expression question that duplicated the five-year phrase and changed three infinitive prompts to name the source verbs in Hebrew.
- Each remaining active bank item has a source page, exercise identifier, four answer choices, a practice-origin label, and an explanation tied to its grammar or vocabulary task. Source-dependent reading questions are absent from Chapter Test. The six Hebrew interpretation checks remain in the chapter tests.

## Curriculum and verification limits

The 46-chapter app index is 10 First Part אולפן עברית lessons, 7 Fourth Part lessons, 19 ללמוד עברית ברמה ב׳ units, and 10 עברית בשניים לרמה ב׳ chapters. The later 39-chapter note differs by seven but does not specify which lessons to omit. The existing 46 IDs and saved progress remain unchanged pending reconciliation.

The 36 active non-reading bank items in chapters 32–33 were checked for lesson page range, exercise ID, Hebrew prompt, answer choices, and explanation. The scan review found and corrected the specific content issues above. This is not a claim that every adapted distractor and every other question in the app has passed a full source audit. Independent practice remains a separate pool awaiting question-level reconciliation; do not count either chapter as fully source-verified yet.

The app has 46/46 indexed chapters with loaded banks. That is an availability count, not a source-verification count. The wider audit still lists 134 held context-dependent items, 449 active items without an exercise label, and 48 interpretation items without a page reference in other chapters.

## Validation

`node --check app.js`, `node --check textbook-question-banks-32-33.js`, `node --check textbook-interpretation-32-33.js`, `node verify-chapters-32-33.cjs`, `node verify-reading-sources.cjs`, `node verify-reading-progression.cjs`, `node verify-flashcards.cjs`, `node validate-trainer.cjs`, `node audit-curriculum.cjs`.
