# Source audit: chapters 44–45

Source: the user-supplied scanned PDF `עברית בשניים_לרמת בי(1).pdf`. `sourcePage` values are one-based PDF page indices, not printed page numbers. Each PDF image is a facing-page spread.

| Trainer chapter | Printed chapter | PDF pages | Bank items | Interpretation checks | Source coverage |
|---|---|---:|---:|---:|---|
| 44 | 8, נשים | 212–239 | 32 | 3 | Women's history and כדי; Exodus women; Dorothea Lange; Malala; film reading and לא... אלא; Lakya women's organization; נפעל table; Ali Baba and passive conversion; בשביל pronouns; Rosalind Franklin; Kathrine Switzer; plural nouns. |
| 45 | 9, אדם וטבע | 240–274 | 35 | 3 | Wangari Maathai; population and matching; environmental vocabulary; Stephen Hawking; superlatives; ל״ה future and past forms; astronomy and negative expressions; green roofs; Hanging Gardens; עצמי pronouns; independent families and healthy eating; eucalyptus dilemma; green families. |

Questions adapt printed readings, matching, completion, grammar tables, and discussion prompts to four-choice practice. The bank keeps Hebrew vocabulary and verb forms and identifies the PDF spread for each adaptation. Three separate Hebrew-to-English interpretation checks per chapter use source Hebrew. Free-form writing and discussion activities remain in the textbook and are not presented as automatically graded questions.

Validation: `node validate-trainer.cjs` checks script syntax, loaded banks, options, unique prompts, source page ranges and ordering, and interpretation checks. `node verify-chapters-44-45.cjs` checks automatic advance, wrong-answer correction plus Next, the interpretation gate, saving progress, and independent practice state. The Pages workflow runs these before deployment.
