# Source audit: chapters 1–2

Source: user-supplied `ULPAN IVRIT FIRST PART.pdf`, one-based PDF pages 1–30 (printed pages 13–42). Chapter 1 is האלפבית העברי on PDF 1–14. Chapter 2 is אני • אתה • את • הוא • היא on PDF 15–30.

| App chapter | Scan pages | Chapter Test | Interpretation | Reading Practice | Flashcards |
|---|---:|---:|---:|---:|---:|
| 1 | 1–14 | 31 letter/name forms from the printed alphabet chart | 3 source words | No prose passage in the source lesson | 0 |
| 2 | 15–30 | 15 standalone pronoun, adjective, verb, and age completions | 3 source sentences | 2 activities, 7 questions | 4 with source sentences |

The first lesson teaches the printed and written alphabet, vowel marks, word recognition, and map/place-name reading. The existing letter exercise matched the chart but had no question-level page labels or interpretation gate. Letters now cite PDF 1 or 2, and three interpretation checks use בית, מים, and שלום from PDF 1–3. The alphabet handwriting and word-search tasks cannot be faithfully reproduced as four-choice questions, so they remain in the scan.

The old chapter 2 bank had 23 standalone items and no item-specific explanations or exercise labels. I compared every item with PDF 15–30 and replaced the bank with 15 scan-backed items. The unsupported Rita sentence and other page-mismatched recall are no longer scored. The remaining items adapt the printed pronoun table, completions, present-tense forms, and age forms, with source page, exercise identifier, and correction.

The original dialogue בבנק from PDF 19 and reading חברים טובים from PDF 22 are shown beside adapted printed comprehension questions in Reading Practice. The text is selected source Hebrew, with omissions marked in the dialogue; it is not presented as a complete passage. The four chapter 2 flashcards quote sentences from חברים טובים, giving each term a visible example.

A chapter 1 or 2 test now requires at least two of three Hebrew interpretation checks plus 85% overall. Correct answers advance automatically; an incorrect answer shows the correction and waits for Next. The existing progress key and separate adaptive-practice data were retained.

Validation: `node validate-trainer.cjs`, `node verify-reading-sources.cjs`, `node verify-reading-progression.cjs`, `node verify-flashcards.cjs`, and `node verify-chapters-1-2.cjs` check schemas, page ranges, passage context, examples, corrections, progression, and saved data.

The app has 46 stable chapter IDs; the user's later 39-chapter note seems to omit seven אולפן עברית Fourth Part chapters but that mapping is not confirmed. This audit verifies chapters 1–2 only, not all chapters or the independent adaptive pools.
