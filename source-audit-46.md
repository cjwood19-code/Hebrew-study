# Source audit: chapter 46

Source: the user-supplied scanned PDF `עברית בשניים_לרמת בי(1).pdf`. `sourcePage` is a one-based PDF page index. The scan contains facing-page spreads; chapter 10, שפה, begins on printed page 263 at PDF page 275.

| Trainer chapter | Printed chapter | PDF pages | Standalone Chapter Test items | Interpretation checks | Reading Practice |
|---|---|---:|---:|---:|---:|
| 46 | 10, שפה | 275–308 | 21 | 3 | 13 activities, 25 questions |

I compared the loaded bank and interpretation prompts with the scan. The 21 remaining scored questions draw on printed proverbs, grammar tables, verb completions, occupation matching, number forms, comparisons, prepositions, and final review. Each has a page, exercise identifier, Hebrew prompt, and lesson explanation. Twenty passage-dependent items that had been held from scoring and four other context-dependent prompts were removed from the bank. Their lesson topics are now practiced with visible excerpts in Reading Practice; the new questions are not a one-to-one transcription of every former prompt.

Reading Practice shows selected source Hebrew, with omissions marked, for Esperanto and disappearing languages; the hotel dialogue; bilingual education; the printed cheese-book fill-in; changing professions and job ads; Hebrew script; the sign-language performance; ערברבית; Babel; Braille; and generations. The original blank and word-choice structure is retained where used, with adapted answer choices clearly labeled. Supplemental comprehension questions stay within the shown chapter text. Four chapter flashcards have Hebrew examples in context.

Corrections against the scan: the dialogue is about a hotel guest who first says **יומיים**, not two weeks at an ulpan. The להבין table on PDF 281 displays present forms, not the unsupported future form previously tested. The Esperanto and Babel excerpts were checked for transcription errors. The Hebrew script interpretation line uses **אנשים רבים** as printed. The three interpretation checks cite the scan and remain required in the Chapter Test.

Validation: `node validate-trainer.cjs`, `node verify-reading-sources.cjs`, `node verify-reading-progression.cjs`, `node verify-flashcards.cjs`, and `node verify-chapter-46.cjs` cover syntax, bank schemas, source page ranges, visible reading context, corrections, automatic advance, wrong-answer Next, saved progress, and separate practice. The Pages workflow runs project checks before deployment.

This is a chapter 46 audit, not a claim that all 46 chapters or the independent adaptive practice are source-verified. The curriculum note says 39 chapters; the established app index has 46 because it includes seven אולפן עברית Fourth Part lessons. That mapping remains unresolved.
