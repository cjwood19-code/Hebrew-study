# Hebrew Adaptive Trainer

A Safari-friendly Hebrew vocabulary study app designed for iPad and Apple Pencil.

- 12-question scored sessions
- Advances a level only above 85%
- Missed-word review and weighted repetition
- Apple Pencil handwriting practice
- Progress saved locally in the browser
- No account or database required for study progress

## Textbook chapters and vocabulary cards

43 of the 46 indexed textbook chapters are available. Chapters 24–25 add
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
See [source coverage and validation](source-audit-24-25.md) for the inspected
pages and the limits of the multiple-choice adaptations.

General Vocabulary Flashcards provides 57 words and phrases from these units.
Choose a chapter or all cards, select Hebrew → English or English → Hebrew,
reveal the answer, and mark “I remembered” or “Review again.” The “Cards to
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
