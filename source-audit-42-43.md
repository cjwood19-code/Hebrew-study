# Source audit: chapters 42–43

Source: the user-supplied scanned PDF `עברית בשניים_לרמת בי(1).pdf`. `sourcePage` values are one-based PDF page indices, not printed page numbers. Each PDF image is a facing-page spread.

| Trainer chapter | Printed chapter | PDF pages | Bank items | Interpretation checks | Source coverage |
|---|---|---:|---:|---:|---|
| 42 | 6, אדם לאדם | 152–180 | 24 | 3 | Venice ghetto reading; למרות / אף על פי ש choice; Righteous Among the Nations; Roma reading; school director interview; לרדת and לתת tables; animal-story completion; מן forms; penguin reading; vocabulary sorting. |
| 43 | 7, אומנות | 181–211 | 25 | 3 | Jewish art and calligraphy readings; true/false; Anisa Ashkar interview; מוצא חן בעיניי; Daniel's street-art interview; conditional completion; Van Gogh's letter; street art; המעברות past-tense completion; התפעל matching; shared-space reading; Klimt; אל forms; Pompeii and comics readings. |

The bank adapts the printed readings and exercises to four-choice questions, retaining their Hebrew terms and intended exercise types. The interpretation checks present Hebrew from the readings and require English meaning. Questions needing free-form art or discussion have not been represented as graded multiple choice.

Validation: `node validate-trainer.cjs` checks all script syntax, loaded banks, option schemas, unique prompts, PDF page bounds, ordering, and interpretation checks. `node verify-chapters-42-43.cjs` checks automatic advance, wrong-answer correction plus Next, the interpretation gate, saving progress, and independent practice state. The Pages workflow runs these checks before deployment.
