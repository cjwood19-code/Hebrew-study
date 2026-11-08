# Source audit: chapter 46

Source: the user-supplied scanned PDF `עברית בשניים_לרמת בי(1).pdf`. `sourcePage` is a one-based PDF page index. The scan contains facing-page spreads.

| Trainer chapter | Printed chapter | PDF pages | Bank items | Interpretation checks | Source coverage |
|---|---|---:|---:|---:|---|
| 46 | 10, שפה | 275–308 | 45 | 3 | Esperanto and communication; disappearing languages; idioms; Hebrew learning dialogue; להבין and other verb forms; bilingual education; changing professions; occupation matching and job ads; Hebrew writing reform; numbers; comparisons; sign language and performance; Hebrew and Arabic; conditional יכול; בין; Babel; Louis Braille; final review and generations. |

The bank adapts printed readings, dialogue, idioms, matching, completions, advertisements, grammar tables, and review exercises to four-choice practice. Source Hebrew is retained in prompts and answer choices. Three Hebrew-to-English interpretation checks use sentences from the source pages. Open writing and discussion exercises remain available in the textbook.

The source-context guard currently holds reading-recall items that ask about an unseen passage. Chapter 46 has 25 active bank questions plus three interpretation checks; the held items remain queued for Reading Practice transcription. A short original excerpt from PDF page 275 is now shown with comprehension practice in Reading Practice.

Validation: `node validate-trainer.cjs` checks syntax, bank schemas, unique prompts, page references, ordering, and chapter activation. `node verify-chapter-46.cjs` checks interpretation gating, automatic advance, correction and Next, saved progress, and independent practice. The Pages workflow runs these checks before deployment.
