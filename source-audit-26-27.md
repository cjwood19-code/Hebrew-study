# Chapters 26–27: units 9–10

Source: the user-supplied 228-page `ללמוד עברית ברמה ב'(2).pdf`.
All PDF pages 109–131 were rendered, rotated 180 degrees and visually read.
These are single printed pages in this file, not two-page spreads. One-based
PDF page numbers are four greater than the printed page numbers in this range.
The source PDF is not included in the public repository.

## Coverage

| Chapter | Unit | PDF pages | Bank questions | Interpretation checks |
|---|---|---|---|---|
| 26 | 9: בית ספר על גלגלים | 109–118 | 65 | 3 |
| 27 | 10: כך נתגלה הכותל המערבי | 119–131 | 86 | 3 |

Questions are ordered by source page. Each bank question stores `sourcePage`
and `sourceExercise`. Exercise-family identifiers identify the adaptation;
their final numeric suffix is the order in the adapted family, not necessarily
the original printed item number.

| PDF page | Printed page | Material represented |
|---|---|---|
| 109–110 | 105–106 | School passage; supplied reading excerpts and comprehension |
| 111 | 107 | All 17 noun/adjective and construct-phrase entries: plural and definite forms |
| 112 | 108 | Selected plural and definite sentence transformations |
| 113 | 109 | Future hitpael; selected clauses from the wedding narrative |
| 114 | 110 | Infinitives and action nouns from the fill-in exercise |
| 115–116 | 111–112 | Time expressions; selected sentence completions from page 115 |
| 117 | 113 | חייב / מוכרח: three editorial model completions for source situations |
| 118 | 114 | All seven vocabulary choices and selected preposition completions |
| 119–120 | 115–116 | Western Wall legend; supplied reading excerpts and comprehension |
| 121 | 117 | All six definite sentence transformations, with את where required |
| 122 | 118 | Selected plural transformations of phrases from the preceding exercise |
| 123 | 119 | יכול in the past, from the classroom dialogue |
| 124 | 120 | All four pictured situations, with editorial verb cues replacing pictures |
| 125 | 121 | All five source sentences, each transformed into past and future |
| 126 | 122 | All six time-expression transformations |
| 127 | 123 | Seven first-exercise selections and all six לגלות / למצוא / לחשוף items |
| 128 | 124 | Selected preposition completions |
| 129–130 | 125–126 | All 16 review sentences transformed into future tense |
| 131 | 127 | Nine action-noun completions |

The textbook supplies the curriculum, vocabulary, situations and target forms.
Multiple-choice distractors, English instructions/glosses, segmentation of long
exercises and the six interpretation checks are editorial adaptations. Reading
excerpts contain the information necessary to answer each comprehension item.
The Western Wall text is explicitly identified as a legend; its narrative is
not asserted to be verified history.

This release does not claim exhaustive reproduction of the two units. Free
composition, opinion questions, full narrative rewrites, the full time-expression
story, the word-classification activity and the camp schedule remain outside
automatic grading. Partial exercise families are identified above. Chapter 28
and later remain unavailable until their source exercises are mapped.

## Integration and progress

- 27/46 chapters available; 662 bank questions and 78 interpretation checks.
- Existing bank questions and flashcards retained.
- New chapters each require at least two of three interpretation answers and
  the existing rounded 85% overall score to pass.
- Correct answers retain the 650 ms automatic advance. Wrong answers retain
  the correction until Next is tapped.
- Saved keys and scores are retained. The passed-chapter counter now uses
  explicit historical pass outcomes; a high score with failed interpretation
  is not counted as a pass. Legacy scores without pass outcomes remain supported.

## Validation

`node validate-trainer.cjs`: all JavaScript syntax, script existence, bank
schemas, four distinct nonempty choices, answer membership, unique prompts,
source page bounds/order, source-family metadata, all ready chapters/checkpoints,
and the existing 57 flashcards.

`node verify-chapters-26-27.cjs`: executes the production chapter scripts with
a minimal DOM and controlled timers. Covers full 26 → 27 → unavailable 28
progression, correct-answer timing, wrong-answer Next, repeated taps,
interpretation failure at a high overall score, 2/3 interpretation success,
actual passed-chapter counts, prior scores, reload, exit/restart timer cleanup,
separate storage preservation and original alphabet-mode startup.

Both commands passed. A full browser render was not completed in this environment:
Chromium startup was blocked by its socket permissions. The interaction harness
does not establish visual layout or device-specific Safari behavior.
