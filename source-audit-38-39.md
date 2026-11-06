# Source audit: chapters 38–39

The curriculum source is the user's scan of *עברית בשניים לרמה ב׳*. PDF page numbers are one-based indexes of the scan, whose pages show facing printed pages. The scans are images, so the listed Hebrew was checked visually against rendered pages. The question bank includes multiple-choice adaptations of original tasks; it does not claim to reproduce every open-ended prompt.

| Trainer chapter | Printed chapter | PDF pages | Source material represented |
| --- | --- | --- | --- |
| 38 | פרק שני: יוצאים לדרך | 38–65 | Travel then and now, map and compass directions, Benjamin of Tudela, נווה שלום, noun/adjective agreement, prepositions, vocabulary matching, future and imperative forms |
| 39 | פרק שלישי: נופים | 66–101 | Landscape and Negev readings, מצפה רמון and the crater, Ramla, mosaic keeper, future-tense exercises, מלון בראשית, construct phrases, Darwin, alpaca farm dialogue, Bedouin tale, word-choice exercises |

Chapter 38 has 27 bank questions and 3 Hebrew-to-English interpretation checks. Chapter 39 has 30 bank questions and 3 interpretation checks. The bank keeps the original Hebrew terms, names, and exercise families. Several source tasks require a map, picture identification, free writing, or an open discussion; their multiple-choice versions test a concrete detail or form from that task and are labeled as adaptations. The app continues to keep independent vocabulary practice and saved chapter progress in separate browser storage.

Validation: `node validate-trainer.cjs` checks all script syntax, loaded bank schemas, source page bounds, ordering, and interpretation items. `node verify-chapters-38-39.cjs` exercises both chapters, pass/fail behavior, automatic advance, wrong-answer correction and Next, reload, and independent-practice storage. The prior chapter regression scripts are also run before publication.
