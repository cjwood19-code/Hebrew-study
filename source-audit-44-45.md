# Source audit: chapters 44–45

Source: the user-supplied scanned PDF `עברית בשניים_לרמת בי(1).pdf`. `sourcePage` is the one-based PDF spread index. The printed number on the right page is usually 11 less than the PDF index; the left page is usually 12 less.

| Trainer chapter | Printed chapter | PDF pages | Scored bank | Reading Practice | Interpretation | Editorial status |
|---|---|---:|---:|---:|---:|---|
| 44 | 8, נשים | 212–239 | 13 | 9 activities, 19 questions | 3 | Audited against the supplied scan this run; corrections below. |
| 45 | 9, אדם וטבע | 240–274 | 17 active, 18 held | 0 | 3 | Indexed and loaded; line-by-line scan audit pending. Do not count as source verified. |

Chapter 44’s 32 original bank rows comprised 13 scored rows and 19 passage-dependent rows held by the context guard. The 19 held prompts have been replaced by 19 questions in Reading Practice beside nine selected Hebrew excerpts. The source text is presented with omissions marked `[...]`; multiple-choice comprehension is supplemental and identified as such. Lakya’s printed choice structure and Malala’s blanks remain visible. The film title is **גט**, the Ali Baba line is **סומסום, בבקשה להיפתח!**, and the Boston Marathon passage is on PDF page **238** (printed 227), not 236. The passive examples were replaced with the actual transformations on PDF page 228; the לא...אלא examples were checked against page 220. Thirteen scored items have page and exercise IDs, Hebrew prompts, and lesson-based explanations. Three interpretation checks retain Hebrew source sentences and now have source labels and explanations. Four chapter flashcards have clearly labeled supplemental examples in context.

Validation: `node validate-trainer.cjs` checks syntax, loaded schemas, options, unique prompts, source page ranges, and interpretation checks. `node verify-chapters-44-45.cjs` checks correct auto advance, correction and Next after a wrong answer, Hebrew interpretation gating, reload, saved progress, and independent practice. `node verify-reading-sources.cjs`, `node verify-reading-progression.cjs`, and `node verify-flashcards.cjs` check context and interaction. These tests are necessary checks, not proof that chapter 45 or earlier chapters have been source audited.
