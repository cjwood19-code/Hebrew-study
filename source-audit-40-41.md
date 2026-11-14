# Source audit: chapters 40–41

The source is the user's scan of *עברית בשניים לרמה ב׳*. PDF indexes are one-based; each PDF page is a two-page spread. The app keeps the established 46 chapter IDs while the user's later 39 chapter note remains unresolved. The likely omission of the seven *אולפן עברית* fourth-book lessons is a mapping hypothesis, not a decision to renumber or discard progress.

| Trainer chapter | Printed chapter | PDF pages | Audit status |
| --- | --- | --- | --- |
| 40 | פרק רביעי: בית | 102–125 (printed 90–113) | Rebuilt against the scan in this run: 13 Chapter Test items, 3 Hebrew interpretation checks, 7 Reading Practice activities with 14 contextual questions, 4 flashcards with examples |
| 41 | פרק חמישי: חינוך | 126–151 | Existing bank remains pending line-by-line re-audit; it is indexed ready but not newly source-verified in this run |

## Chapter 40 corrections

The former bank included 13 passage-dependent questions without the passage beside them. Those items were removed from the Chapter Test and replaced with seven visible source excerpts and questions in Reading Practice. The excerpts cover *בתים פתוחים*, *תמונה מספרת*, the Mount Scopus synagogue, Zaha Hadid, the architect's original fill-in monologue, *בית השנטי*, and *איש חכם*. Omitted text is marked `[...]`; selected source Hebrew and printed blanks are retained. Questions adapted to choices and supplemental comprehension are labeled separately.

The scan on PDF page 104 (printed 93) permits photographing rooms and furniture and forbids smoking inside; the former rule item misrepresented the permissions. The synagogue reading on PDF page 114 (printed 102) names רם כרמי as the architect; מאיר יעקב שיק is associated with the synagogue's name. The housing dialogue's elderly speaker is דפנה. The compound בית matching task appears on PDF page 125 (printed 113), not page 124. The rebuilt bank corrects all four points.

Every remaining chapter 40 bank item has a source exercise ID, an in-range page, an item-specific explanation, and a practice-origin label. The three interpretation checks cite PDF pages 104, 114, and 120. The four flashcard examples are labeled supplemental practice sentences built from this chapter's vocabulary, not textbook quotations.

Chapter 41's prior count or source description does not establish a current line-by-line audit. Saved chapter progress and independent adaptive practice retain their storage keys. Run `node validate-trainer.cjs`, `node verify-reading-sources.cjs`, `node verify-reading-progression.cjs`, `node verify-flashcards.cjs`, and `node verify-chapters-40-41.cjs` to check the active bank, context placement, page bounds, examples, and quiz flow.
