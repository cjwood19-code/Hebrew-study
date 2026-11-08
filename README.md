# Hebrew Adaptive Trainer

A Safari-friendly Hebrew vocabulary study app designed for iPad and Apple Pencil.

- 12-question scored sessions
- Advances a level only above 85%
- Missed-word review and weighted repetition
- Apple Pencil handwriting practice
- Progress saved locally in the browser
- No account or database required for study progress

## Textbook chapters and vocabulary cards

The [curriculum reconciliation audit](curriculum-reconciliation-audit.md) lists
the active chapter questions, interpretation checks, Reading Practice items,
held passage-dependent questions, and flashcards for every chapter. Run
`node audit-curriculum.cjs` to regenerate it. The audit distinguishes page
metadata from line-by-line verification against the scanned source.

The textbook track keeps its established 46-chapter order: 10 lessons from
*אולפן עברית* First Part, 7 from its Fourth Part, 19 from *ללמוד עברית ברמה ב׳*,
and 10 from *עברית בשניים לרמה ב׳*. Chapter numbering and saved progress are
preserved. The chapter result now records cumulative mastery by vocabulary,
verbs, grammar, reading, sentence construction, and Hebrew interpretation.
Every chapter question displays its textbook, lesson or unit, and PDF page
when known. Adapted multiple-choice questions are identified as practice,
not as verbatim textbook exercises.

Reading Practice includes the original *אולפן עברית* lesson 10 passage about
Nahalal (PDF page 105), its six printed comprehension questions with adapted
answer choices, and the original Anat fill-in passage (PDF page 106). The
original *ללמוד עברית ברמה ב׳* readings in units 1–2 (PDF pages 11 and 24)
now accompany their printed exercise structures and labeled supplemental
comprehension questions. Earlier note-only readings remain outside this
chapter-mapped Reading Practice. A
context guard removes reading-recall questions from chapter tests when their
Hebrew passage is not displayed in the question. These questions are queued
for source-backed Reading Practice rather than presented as context-free trivia.
A short verified
excerpt from *עברית בשניים* chapter 10 (PDF page 275) is also available in
Reading Practice. Existing separate practice and saved progress remain intact.

The chapter counts below describe the source-bank entries written during each
build. The context guard currently holds 137 entries until their passages are
available in Reading Practice; those entries are not active quiz questions.

All 46 indexed textbook chapters are available. Chapters 24–25 add
66 source-based questions from ללמוד עברית ברמה ב׳ units 7–8.
Chapters 26–27 add 151 source-based questions from units 9–10, plus six
Hebrew interpretation checks. See [units 9–10 coverage](source-audit-26-27.md).
Chapters 28–29 add 88 source-based questions from units 11–12, plus six
interpretation checks. See [units 11–12 coverage](source-audit-28-29.md).
Chapters 30–31 add 85 source-based questions from units 13–14, plus six
interpretation checks. See [units 13–14 coverage](source-audit-30-31.md).
Chapters 32–33 add 68 source-based questions from units 15–16, plus six
interpretation checks. See [units 15–16 coverage](source-audit-32-33.md).
Chapters 34–35 add source-based questions from units 17–18, plus six
interpretation checks. See [units 17–18 coverage](source-audit-34-35.md).
Chapters 36–37 add 67 source-based questions from the final unit of
*ללמוד עברית ברמה ב׳* and the first unit of *עברית בשניים לרמה ב׳*, plus
six interpretation checks. See [units 19 and 1 coverage](source-audit-36-37.md).
Chapters 38–39 add 57 source-based questions from *עברית בשניים לרמה ב׳*
chapters 2–3, plus six interpretation checks. See [chapters 2–3 coverage](source-audit-38-39.md).
Chapters 40–41 add 59 source-based questions from *עברית בשניים לרמה ב׳*
chapters 4–5, plus six interpretation checks. See [chapters 4–5 coverage](source-audit-40-41.md).
Chapters 42–43 add 49 source-based questions from the same book, chapters 6–7,
plus six interpretation checks. See [chapters 6–7 coverage](source-audit-42-43.md).
Chapters 44–45 add 67 source-based questions from the same book, chapters 8–9,
plus six interpretation checks. See [chapters 8–9 coverage](source-audit-44-45.md).
Chapter 46 adds 45 source-based questions from chapter 10, שפה, plus three
Hebrew interpretation checks. See [chapter 10 coverage](source-audit-46.md).
See [source coverage and validation](source-audit-24-25.md) for the inspected
pages and the limits of the multiple-choice adaptations.

General Vocabulary Flashcards provides 57 words and phrases from these units.
Choose a chapter or all cards, select Hebrew → English or English → Hebrew,
reveal the answer with a Hebrew example sentence and English translation, and
mark “I remembered” or “Review again.” These are labeled supplemental practice
examples written with the unit vocabulary, not quotations from the textbook.
The “Cards to
review” set contains the latter. Card ratings persist on this browser and are
independent of chapter scores and the previous adaptive-practice modes.

Run `node validate-trainer.cjs` to check script syntax, loaded question banks,
chapter activation and flashcard data before publishing.

Run `node verify-chapters-26-27.cjs` for deterministic chapter interaction and
saved-progress regression checks. It uses the production chapter scripts with
a minimal DOM and controlled timers; no extra packages are required.

Run `node verify-chapters-28-29.cjs` to check the new chapters, interpretation
gate, automatic advance, correction and Next flow, and saved progress.

Run `node verify-chapters-30-31.cjs` to check units 13–14 and the same
chapter-flow and progress safeguards.

Run `node verify-chapters-32-33.cjs` to check units 15–16, including the
interpretation gate and the next unavailable chapter.



Run `node verify-chapters-34-35.cjs` to check units 17–18, including the
interpretation gate, correction and Next, and saved progress.

Run `node verify-chapters-36-37.cjs` to check the new textbook transition,
interpretation gate, correction and Next, and saved progress.

Run `node verify-chapters-38-39.cjs` to check these chapters, quiz progression,
interpretation gate, and saved independent practice.

Run `node verify-chapters-40-41.cjs` to check these chapters, automatic advance,
wrong-answer correction and Next, interpretation, and saved progress.

Run `node verify-chapters-42-43.cjs` to check the next two chapters and the same progression rules.

Run `node verify-chapters-44-45.cjs` to check chapters 44–45 and the same progression rules.

Run `node verify-chapter-46.cjs` to check the final chapter, the interpretation
gate, automatic advance, wrong-answer correction and Next, saved progress,
and independent practice.

Run `node verify-reading-sources.cjs` to check that context-dependent lesson
10 recall is excluded from its chapter test and that the original readings,
questions, source pages, and explanations are available in Reading Practice.

Run `node verify-flashcards.cjs` to check all context examples, reveal timing,
both card directions, and saved review ratings.
