# Chapters 24–25 and general vocabulary flashcards

Source: the user-uploaded 228-page scanned `ללמוד עברית ברמה ב'(2).pdf`.
The original `/mnt/data/` path was unavailable in the desktop session; the same
named attachment was recovered through the referenced conversation and its
228-page count verified. Page images were rendered and rotated 180 degrees for
reading. Page citations in the app are one-based PDF page numbers.

## Inspected pages and scope

The scans repeat two-page spreads. Both printed pages of each listed spread were
visually inspected. PDF 87 repeats the 86 spread; PDF 99 repeats the 98 spread.
The existing chapter ranges (24: 86–98; 25: 99–108) are retained.

| PDF page inspected | Printed pages | Material used |
|---|---|---|
| 86, 87 | 82–83 | Horse/donkey transport passage and comprehension |
| 88 | 84–85 | Plural construct phrases and definiteness |
| 90 | 86–87 | Definite objects and future ל״ה verbs |
| 92 | 88–89 | Action nouns, advertisements and tense forms |
| 94 | 90–91 | Relative clauses, ש־ and present-participle ה־ |
| 96 | 92–93 | כמובן and transport vocabulary |
| 98 | 94–95 | Unit 7 prepositions; unit 8 passage begins on printed 95 |
| 99 | 94–95 | Unit 8 advertisement/correspondence passage |
| 100 | 96–97 | Comprehension and adjective forms in personal ads |
| 102 | 98–99 | Letter-writing vocabulary, existence and possession |
| 104 | 100–101 | Adjectival predicates and indirect speech |
| 106 | 102–103 | Indirect speech and contextual vocabulary |
| 108 | 104–105 | Unit 8 אל / על; unit 9 on printed 105 excluded |

Each new chapter contains 33 multiple-choice questions. Reading questions supply
the relevant excerpt, so answers do not depend on a hidden passage. Grammar
prompts are selected exercises adapted to multiple choice or short examples of
the forms explicitly taught on the cited page. English glosses are editorial
translations. Historical journey times are asked only as statements in the
passage, not presented as current travel advice.

These are selected source-based practice banks, not a reproduction of every
exercise. Free composition, whole-letter writing, crosswords as layouts, and full
story rewrites are not graded. No claim of exhaustive exercise coverage is made.
Chapters 26–46 remain unavailable.

## Vocabulary cards

57 unique general-vocabulary cards from units 7–8, including useful everyday
words and short phrases. Ambiguous senses are qualified (for example מאה as
century and הנחה as discount). Gender is supplied for selected adjective forms.
Each card carries its chapter, book and source PDF page. Stable card IDs support
future additions without clearing reviews.

Users can choose all cards, either chapter, or cards marked for review; reveal
Hebrew/English in either direction and self-rate. Ratings use the new
`hebrewGeneralFlashcardsV1` storage key. Chapter and adaptive-practice storage,
thresholds and advancement logic are unchanged.

## Existing defect repaired

Chapter 11's “Miriam's profession is...” had 34 options because unrelated row
fragments were concatenated onto its fourth option. The original prompt and
answer אחות are retained; options are restored to אחות, מורה, נהגת, מהנדסת.
No missing questions or source claims were reconstructed.

## Verification

`node validate-trainer.cjs` checks all JavaScript syntax, all loaded bank schemas,
four distinct choices, answer membership, duplicate prompts, source-page bounds,
script presence, 25/46 readiness, and flashcard IDs/content. Result: 511 bank
questions validated, including 66 new questions; 57 cards validated.

Browser simulation additionally checks advancement 24 → 25 → unavailable 26,
passing 28/33 at the existing rounded 85% threshold, failed replay, retained best
scores/history, session restart/exit, both flashcard directions, reveal/rating,
review persistence after reload, empty review sets, complete card-set traversal,
malformed card-storage recovery and a 390px mobile layout. Existing adaptive
practice draws a prompt on reload, so its transient `session.seen` list is
excluded from the durable-progress comparison; scores, mastery, history and
session counters are compared unchanged.
