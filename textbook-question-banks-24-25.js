/* ללמוד עברית ברמה ב׳ units 7–8. Verified rotated scans: PDF 86–108.
   Selected source exercises adapted to multiple choice; reading excerpts are supplied. */
(function(){'use strict';
const additions={
  "24": [
    {
      "category": "Reading • passage supplied",
      "sourcePage": 86,
      "prompt": "Read: עד סוף המאה ה־19 השתמשו בסוסים ובחמורים כדי לעבור ממקום למקום. How did people travel?",
      "answer": "בסוסים ובחמורים",
      "options": [
        "בסוסים ובחמורים",
        "במטוסים",
        "ברכבות מהירות",
        "באופנועים"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 86,
      "prompt": "Read: הנסיעה מיפו לירושלים נמשכה שש עשרה שעות. How long was this journey in the passage?",
      "answer": "שש עשרה שעות",
      "options": [
        "שש עשרה שעות",
        "שש שעות",
        "ארבע שעות",
        "שעה אחת"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 86,
      "prompt": "Read: שם אפשר היה לנוח, לאכול ולהאכיל את הסוסים. What could travelers do at the inns?",
      "answer": "לנוח ולאכול",
      "options": [
        "לנוח ולאכול",
        "לקנות מכוניות",
        "לנסוע ברכבת",
        "ללמוד נהיגה"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 86,
      "prompt": "Read: אבל מחיר הדלק עולה כל הזמן. What keeps rising in the passage?",
      "answer": "מחיר הדלק",
      "options": [
        "מחיר הדלק",
        "מספר הסוסים",
        "מחיר הספרים",
        "מספר המלונות"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 86,
      "prompt": "What does כביש mean?",
      "answer": "road",
      "options": [
        "road",
        "bridge",
        "river",
        "station"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 86,
      "prompt": "What does דלק mean?",
      "answer": "fuel",
      "options": [
        "fuel",
        "food",
        "money",
        "rain"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 86,
      "prompt": "What does לנוח mean?",
      "answer": "to rest",
      "options": [
        "to rest",
        "to buy",
        "to send",
        "to turn"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 86,
      "prompt": "What does מחיר mean?",
      "answer": "price",
      "options": [
        "price",
        "journey",
        "horse",
        "century"
      ]
    },
    {
      "category": "Plural construct",
      "sourcePage": 88,
      "prompt": "Choose the plural of בית ספר.",
      "answer": "בתי ספר",
      "options": [
        "בתי ספר",
        "בית ספרים",
        "בתים ספר",
        "בתי ספרים"
      ]
    },
    {
      "category": "Plural construct",
      "sourcePage": 88,
      "prompt": "Turn נהגים של אוטובוס into a construct phrase.",
      "answer": "נהגי אוטובוס",
      "options": [
        "נהגי אוטובוס",
        "נהגים אוטובוס",
        "נהג אוטובוסים",
        "נהגי אוטובוסות"
      ]
    },
    {
      "category": "Definite construct",
      "sourcePage": 88,
      "prompt": "Make סיפורי ילדים definite.",
      "answer": "סיפורי הילדים",
      "options": [
        "סיפורי הילדים",
        "הסיפורי ילדים",
        "הסיפורים ילדים",
        "סיפורים הילד"
      ]
    },
    {
      "category": "Plural construct",
      "sourcePage": 88,
      "prompt": "Turn חדרים להמתנה into a construct phrase.",
      "answer": "חדרי המתנה",
      "options": [
        "חדרי המתנה",
        "חדרים המתנה",
        "חדר המתנות",
        "חדרי ממתין"
      ]
    },
    {
      "category": "Definite object",
      "sourcePage": 90,
      "prompt": "Complete: קניתי ___ חולצות הצמר.",
      "answer": "את",
      "options": [
        "את",
        "על",
        "עם",
        "אל"
      ]
    },
    {
      "category": "Future • ל״ה verbs",
      "sourcePage": 90,
      "prompt": "Complete in the future: מחר אני ___ ספר (לקנות).",
      "answer": "אקנה",
      "options": [
        "אקנה",
        "קניתי",
        "קונה",
        "קנו"
      ]
    },
    {
      "category": "Future • ל״ה verbs",
      "sourcePage": 90,
      "prompt": "Complete in the future: מחר את ___ ספר (לקנות).",
      "answer": "תקני",
      "options": [
        "תקני",
        "תקנה",
        "אקנה",
        "קנית"
      ]
    },
    {
      "category": "Future • ל״ה verbs",
      "sourcePage": 90,
      "prompt": "Complete in the future: מחר אנחנו ___ בית (לבנות).",
      "answer": "נבנה",
      "options": [
        "נבנה",
        "בניתי",
        "יבנו",
        "בונה"
      ]
    },
    {
      "category": "Future • ל״ה verbs",
      "sourcePage": 90,
      "prompt": "Complete in the future: מחר הם ___ מים (לשתות).",
      "answer": "ישתו",
      "options": [
        "ישתו",
        "שתו",
        "שותים",
        "תשתי"
      ]
    },
    {
      "category": "Action nouns",
      "sourcePage": 92,
      "prompt": "Choose the action noun related to לקנות.",
      "answer": "קנייה",
      "options": [
        "קנייה",
        "קונה",
        "קניתי",
        "יקנה"
      ]
    },
    {
      "category": "Action nouns",
      "sourcePage": 92,
      "prompt": "Complete: חברת ה___ בונה דירות.",
      "answer": "בנייה",
      "options": [
        "בנייה",
        "בנה",
        "יבנה",
        "בונים"
      ]
    },
    {
      "category": "Action nouns",
      "sourcePage": 92,
      "prompt": "Complete: מגרש ה___ פתוח כל היום.",
      "answer": "חנייה",
      "options": [
        "חנייה",
        "חונה",
        "חניתי",
        "יחנו"
      ]
    },
    {
      "category": "Action nouns",
      "sourcePage": 92,
      "prompt": "Complete: השתייה טובה ל___.",
      "answer": "בריאות",
      "options": [
        "בריאות",
        "בריאים",
        "בריאה",
        "בריא"
      ]
    },
    {
      "category": "Relative clause",
      "sourcePage": 94,
      "prompt": "Combine using ש־: האיש סיפר לי על ירושלים. האיש עבד במוזאון.",
      "answer": "האיש שעבד במוזאון סיפר לי על ירושלים.",
      "options": [
        "האיש שעבד במוזאון סיפר לי על ירושלים.",
        "האיש כי עבד במוזאון סיפר לי על ירושלים.",
        "האיש אבל עבד במוזאון סיפר לי על ירושלים.",
        "האיש או עבד במוזאון סיפר לי על ירושלים."
      ]
    },
    {
      "category": "Relative clause",
      "sourcePage": 94,
      "prompt": "Replace ש־ with ה־ where possible: אנשים ___ מטיילים ברחובות ירושלים.",
      "answer": "ה",
      "options": [
        "ה",
        "כי",
        "אם",
        "או"
      ]
    },
    {
      "category": "Relative clause",
      "sourcePage": 94,
      "prompt": "Choose the relative marker: סטודנט ___ אינו לומד כל השנה, נכשל בבחינותיו.",
      "answer": "ש",
      "options": [
        "ש",
        "ה",
        "אבל",
        "או"
      ]
    },
    {
      "category": "Relative clause",
      "sourcePage": 94,
      "prompt": "Choose the relative marker: קונן דויל ___ כתב את הסיפורים, חי באנגליה.",
      "answer": "ש",
      "options": [
        "ש",
        "ה",
        "אם",
        "או"
      ]
    },
    {
      "category": "Parenthetical expression",
      "sourcePage": 96,
      "prompt": "What does כמובן mean?",
      "answer": "of course",
      "options": [
        "of course",
        "perhaps",
        "suddenly",
        "yesterday"
      ]
    },
    {
      "category": "Transport vocabulary",
      "sourcePage": 96,
      "prompt": "Which vehicle has a locomotive and carriages (קטר וקרונות)?",
      "answer": "רכבת",
      "options": [
        "רכבת",
        "אופניים",
        "סוס",
        "סירה"
      ]
    },
    {
      "category": "Transport vocabulary",
      "sourcePage": 96,
      "prompt": "יש להם שני גלגלים, והילדים אוהבים לרכב עליהם. איזו מילה מתאימה?",
      "answer": "אופניים",
      "options": [
        "אופניים",
        "רכבת",
        "אונייה",
        "מטוס"
      ]
    },
    {
      "category": "Transport vocabulary",
      "sourcePage": 96,
      "prompt": "טסים בו. איזו מילה מתאימה?",
      "answer": "מטוס",
      "options": [
        "מטוס",
        "אופניים",
        "אונייה",
        "רכבת"
      ]
    },
    {
      "category": "Prepositions",
      "sourcePage": 98,
      "prompt": "Complete: כדי לעבור מעיר אחת ___ עיר שנייה...",
      "answer": "אל",
      "options": [
        "אל",
        "את",
        "עם",
        "על"
      ]
    },
    {
      "category": "Prepositions",
      "sourcePage": 98,
      "prompt": "Complete: התושבים השתמשו ___ סירות קטנות.",
      "answer": "ב",
      "options": [
        "ב",
        "את",
        "אל",
        "על"
      ]
    },
    {
      "category": "Prepositions",
      "sourcePage": 98,
      "prompt": "Complete: הם יצאו ___ בודה בבוקר.",
      "answer": "מ",
      "options": [
        "מ",
        "את",
        "עם",
        "על"
      ]
    },
    {
      "category": "Prepositions",
      "sourcePage": 98,
      "prompt": "Complete: המלך החליט לבנות גשר ארוך שיחבר ___ שתי הערים.",
      "answer": "בין",
      "options": [
        "בין",
        "את",
        "על",
        "אצל"
      ]
    }
  ],
  "25": [
    {
      "category": "Reading • passage supplied",
      "sourcePage": 99,
      "prompt": "Read: באחד מעיתוני שוודיה התפרסמה המודעה הזאת. Where was the advertisement published?",
      "answer": "בעיתון",
      "options": [
        "בעיתון",
        "ברדיו",
        "בטלוויזיה",
        "על רכבת"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 99,
      "prompt": "Read: מאות גברים צעירים ענו למודעה. Who answered the advertisement?",
      "answer": "גברים צעירים",
      "options": [
        "גברים צעירים",
        "ילדים קטנים",
        "נהגי אוטובוס",
        "מורות לעברית"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 99,
      "prompt": "Read: האם אתה יכול לשלוח לי חצי מדמי הנסיעה ברכבת מן העיר שלי לשטוקהולם? How much did she request in her letter?",
      "answer": "חצי מדמי הנסיעה",
      "options": [
        "חצי מדמי הנסיעה",
        "את כל העושר",
        "שתי קרונות",
        "מאה ספרים"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 99,
      "prompt": "Read: וכולם שלחו את כל דמי הנסיעה. What did the men actually send?",
      "answer": "את כל דמי הנסיעה",
      "options": [
        "את כל דמי הנסיעה",
        "רק חצי מדמי הנסיעה",
        "כרטיסי קולנוע",
        "מכתבים בלי כסף"
      ]
    },
    {
      "category": "Reading • passage supplied",
      "sourcePage": 99,
      "prompt": "Read: הם חיכו לבלונדינית העשירה, אך היא לא הגיעה. Did she arrive?",
      "answer": "לא, היא לא הגיעה",
      "options": [
        "לא, היא לא הגיעה",
        "כן, היא הגיעה ברכבת",
        "כן, היא הגיעה במונית",
        "כן, היא הגיעה ברגל"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 99,
      "prompt": "What does מודעה mean?",
      "answer": "advertisement",
      "options": [
        "advertisement",
        "station",
        "request",
        "meeting"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 99,
      "prompt": "What does מכתב mean?",
      "answer": "letter",
      "options": [
        "letter",
        "newspaper",
        "ticket",
        "bridge"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 99,
      "prompt": "What does בקשה mean?",
      "answer": "request",
      "options": [
        "request",
        "wealth",
        "journey",
        "station"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 99,
      "prompt": "What does התכתבות mean?",
      "answer": "correspondence",
      "options": [
        "correspondence",
        "transport",
        "construction",
        "rest"
      ]
    },
    {
      "category": "Vocabulary",
      "sourcePage": 99,
      "prompt": "What does דמי נסיעה mean?",
      "answer": "travel fare",
      "options": [
        "travel fare",
        "wedding guests",
        "train wheels",
        "fuel station"
      ]
    },
    {
      "category": "Adjectives",
      "sourcePage": 100,
      "prompt": "Choose the feminine form of ביישן.",
      "answer": "ביישנית",
      "options": [
        "ביישנית",
        "ביישנים",
        "ביישניות",
        "ביישנות"
      ]
    },
    {
      "category": "Adjectives",
      "sourcePage": 100,
      "prompt": "Choose the feminine form of עשיר.",
      "answer": "עשירה",
      "options": [
        "עשירה",
        "עשירים",
        "עשירות",
        "עושר"
      ]
    },
    {
      "category": "Adjectives",
      "sourcePage": 100,
      "prompt": "Choose the feminine form of רגיש.",
      "answer": "רגישה",
      "options": [
        "רגישה",
        "רגישים",
        "רגישות",
        "רגיש"
      ]
    },
    {
      "category": "Adjectives",
      "sourcePage": 100,
      "prompt": "Which word means 'polite' in the personal advertisements?",
      "answer": "מנומס",
      "options": [
        "מנומס",
        "עצלן",
        "נמוך",
        "עצוב"
      ]
    },
    {
      "category": "Letter vocabulary",
      "sourcePage": 102,
      "prompt": "Which word means 'to demand'?",
      "answer": "לדרוש",
      "options": [
        "לדרוש",
        "לחכות",
        "לכעוס",
        "להחזיר"
      ]
    },
    {
      "category": "Existence • future",
      "sourcePage": 102,
      "prompt": "Change to the future: יש בקשה.",
      "answer": "תהיה בקשה",
      "options": [
        "תהיה בקשה",
        "יהיה בקשה",
        "יהיו בקשה",
        "הייתה בקשה"
      ]
    },
    {
      "category": "Existence • past",
      "sourcePage": 102,
      "prompt": "Change to the past: יש ספרים.",
      "answer": "היו ספרים",
      "options": [
        "היו ספרים",
        "היה ספרים",
        "הייתה ספרים",
        "יהיו ספרים"
      ]
    },
    {
      "category": "Possession • past",
      "sourcePage": 102,
      "prompt": "Complete in the past: לשכן ___ מנורת כסף.",
      "answer": "הייתה",
      "options": [
        "הייתה",
        "היה",
        "היו",
        "תהיה"
      ]
    },
    {
      "category": "Possession • future",
      "sourcePage": 102,
      "prompt": "Complete in the future: לצעירה ___ הרבה כסף.",
      "answer": "יהיה",
      "options": [
        "יהיה",
        "תהיה",
        "יהיו",
        "היה"
      ]
    },
    {
      "category": "Negative existence",
      "sourcePage": 102,
      "prompt": "Change to the past: אין מפלצות בעולם.",
      "answer": "לא היו מפלצות בעולם.",
      "options": [
        "לא היו מפלצות בעולם.",
        "לא היה מפלצות בעולם.",
        "לא הייתה מפלצות בעולם.",
        "לא יהיו מפלצות בעולם."
      ]
    },
    {
      "category": "Adjectival predicate • past",
      "sourcePage": 104,
      "prompt": "Change to the past: החיים קשים.",
      "answer": "החיים היו קשים.",
      "options": [
        "החיים היו קשים.",
        "החיים היה קשים.",
        "החיים הייתה קשים.",
        "החיים יהיו קשים."
      ]
    },
    {
      "category": "Adjectival predicate • future",
      "sourcePage": 104,
      "prompt": "Complete in the future: את ___ סופרת מפורסמת.",
      "answer": "תהיי",
      "options": [
        "תהיי",
        "תהיה",
        "יהיה",
        "היית"
      ]
    },
    {
      "category": "Indirect speech",
      "sourcePage": 104,
      "prompt": "Complete: הסטודנט שאל: האם מספיק ללמוד חודש אחד? → הסטודנט שאל ___ מספיק ללמוד חודש אחד.",
      "answer": "אם",
      "options": [
        "אם",
        "את",
        "אבל",
        "או"
      ]
    },
    {
      "category": "Indirect speech",
      "sourcePage": 104,
      "prompt": "The professor tells a student: אתה צריך ללמוד. Complete: הפרופסור אמר לסטודנט ___ צריך ללמוד.",
      "answer": "שהוא",
      "options": [
        "שהוא",
        "שאני",
        "שאנחנו",
        "שהם"
      ]
    },
    {
      "category": "Indirect speech",
      "sourcePage": 104,
      "prompt": "The woman says: אני רוצה להיות בטוחה. Complete: היא אמרה ___ רוצה להיות בטוחה.",
      "answer": "שהיא",
      "options": [
        "שהיא",
        "שהוא",
        "שאתה",
        "שאני"
      ]
    },
    {
      "category": "Vocabulary in context",
      "sourcePage": 106,
      "prompt": "In the story, נישואין is closest in meaning to...",
      "answer": "חתונה",
      "options": [
        "חתונה",
        "נסיעה",
        "בקשה",
        "תחנה"
      ]
    },
    {
      "category": "Vocabulary in context",
      "sourcePage": 106,
      "prompt": "In the story, משכיל is closest in meaning to...",
      "answer": "מלומד",
      "options": [
        "מלומד",
        "עשיר",
        "מסכים",
        "נמוך"
      ]
    },
    {
      "category": "Vocabulary in context",
      "sourcePage": 106,
      "prompt": "What does עושר mean in the story?",
      "answer": "wealth",
      "options": [
        "wealth",
        "poverty",
        "advertisement",
        "request"
      ]
    },
    {
      "category": "Vocabulary in context",
      "sourcePage": 106,
      "prompt": "In אני בטוחה, בטוחה means...",
      "answer": "certain / sure",
      "options": [
        "certain / sure",
        "shy",
        "wealthy",
        "polite"
      ]
    },
    {
      "category": "Prepositions • אל",
      "sourcePage": 108,
      "prompt": "Complete: אמרתי למיכאל שיבוא ___ לביקור (to me).",
      "answer": "אליי",
      "options": [
        "אליי",
        "עליי",
        "ממני",
        "אותי"
      ]
    },
    {
      "category": "Prepositions • על",
      "sourcePage": 108,
      "prompt": "Complete: חשבתי ___ כל היום (about you, masculine singular).",
      "answer": "עליך",
      "options": [
        "עליך",
        "אליך",
        "אותך",
        "ממך"
      ]
    },
    {
      "category": "Prepositions • על",
      "sourcePage": 108,
      "prompt": "Complete: הכיסא הזה שבור. אסור לשבת ___.",
      "answer": "עליו",
      "options": [
        "עליו",
        "אליו",
        "אותו",
        "ממנו"
      ]
    },
    {
      "category": "Prepositions • על",
      "sourcePage": 108,
      "prompt": "Complete: הספה חדשה, ואפשר לשבת ___.",
      "answer": "עליה",
      "options": [
        "עליה",
        "אליה",
        "אותה",
        "ממנה"
      ]
    }
  ]
};
const explanations={
  24:[
    'כביש הוא הדרך למכוניות; הקריאה משווה כבישים רחבים לדרכים הצרות בעבר.',
    'דלק משמש מכוניות; בסוף הקריאה נזכר מחיר הדלק.',
    'לנוח פירושו לנוח מן הדרך; הנוסעים יכלו לעשות זאת בחאן.',
    'מחיר הוא העלות של דבר, כמו מחיר הדלק בקריאה.',
    'בסמיכות רבים בית ספר נעשה בתי ספר; המילה השנייה נשארת ספר.',
    'נהגים בצירוף סמיכות נעשים נהגי; לכן נהגי אוטובוס.',
    'בצירוף סמיכות היידוע מופיע בשם השני: סיפורי הילדים.',
    'חדרים נעשים חדרי לפני שם עצם נוסף: חדרי המתנה.',
    'את באה לפני מושא ישיר מיודע: חולצות הצמר.',
    'מחר ואני מחייבים עתיד גוף ראשון יחיד: אקנה.',
    'מחר ואת מחייבים עתיד גוף שני נקבה יחידה: תקני.',
    'מחר ואנחנו מחייבים עתיד גוף ראשון רבים: נבנה.',
    'מחר והם מחייבים עתיד גוף שלישי רבים: ישתו.',
    'קנייה היא שם הפעולה של לקנות.',
    'בנייה היא שם הפעולה של לבנות; חברת בנייה בונה דירות.',
    'חנייה היא שם הפעולה של לחנות; מגרש חנייה מיועד למכוניות חונות.',
    'בריאות היא שם עצם; השתייה יכולה להיות טובה לבריאות.',
    'ש־ מחברת את האיש עם הפסוקית שעבד במוזאון.',
    'ה־ לפני בינוני יכולה להחליף ש־: האנשים המטיילים ברחובות.',
    'ש־ מציגה את הפסוקית המתארת את הסטודנט: שאינו לומד.',
    'ש־ מציגה את הפסוקית המתארת את דויל: שכתב את הסיפורים.',
    'כמובן פירושו מובן מאליו, כלומר of course.',
    'קטר וקרונות הם חלקי רכבת בתרגיל התחבורה.',
    'שני גלגלים ורכיבה עליהם הם רמזים לאופניים.',
    'החידה טסים בו בתרגיל התחבורה מצביעה על מטוס.',
    'אל מציינת יעד: מעיר אחת אל עיר שנייה.',
    'ב־ מציינת את כלי השיט שבו השתמשו: בסירות קטנות.',
    'מ־ מציינת מוצא: יצאו מבודה.',
    'בין קושרת שתי ערים: גשר שיחבר בין שתי הערים.'
  ],
  25:[
    'מודעה היא פרסום בעיתון; כך נפתח הסיפור על היורשת.',
    'מכתב הוא מסר כתוב; היורשת שלחה מכתב לכל אחד.',
    'בקשה היא דבר שמבקשים; היא ביקשה כסף לנסיעה.',
    'התכתבות היא חילופי מכתבים; היא באה לפני בקשת הנסיעה.',
    'דמי נסיעה הם התשלום על נסיעה ברכבת.',
    'ביישן בזכר נעשה ביישנית בנקבה.',
    'עשיר בזכר נעשה עשירה בנקבה.',
    'רגיש בזכר נעשה רגישה בנקבה.',
    'מנומס מתאר אדם שמתנהג בנימוס במודעות האישיות.',
    'לדרוש פירושו לבקש בתוקף או לתבוע דבר.',
    'יש בקשה בזמן עתיד נעשה תהיה בקשה, כי בקשה נקבה יחידה.',
    'יש ספרים בזמן עבר נעשה היו ספרים, כי ספרים רבים.',
    'מנורת כסף היא נקבה יחידה, ולכן בעבר הייתה לשכן מנורה.',
    'הרבה כסף הוא זכר יחיד, ולכן בעתיד יהיה לצעירה כסף.',
    'אין מפלצות בזמן עבר נעשה לא היו מפלצות.',
    'החיים הם רבים, ולכן בעבר החיים היו קשים.',
    'את בעתיד של להיות מקבלת תהיי.',
    'שאל אם משמש להצגת שאלת כן או לא בדיבור עקיף.',
    'הפרופסור מדבר על הסטודנט בגוף שלישי: שהוא צריך ללמוד.',
    'בדיבור עקיף של דברי האישה אני משתנה לגוף שלישי: שהיא רוצה.',
    'נישואין הם קשר נישואין, כלומר חתונה בהקשר הסיפור.',
    'משכיל מתאר אדם בעל השכלה, ולכן מלומד הוא הקרוב במשמעות.',
    'עושר פירושו wealth; בסיפור היא אומרת שאינה רוצה גבר המתעניין רק בעושרה.',
    'בטוחה פירושו certain או sure; היא רוצה להיות בטוחה בכוונת הגבר.',
    'אליי הוא אל + אני, יעד התנועה: שיבוא אליי.',
    'עליך הוא על + אתה במשמעות about you: חשבתי עליך.',
    'עליו הוא על + הוא: אסור לשבת על הכיסא השבור.',
    'עליה הוא על + היא: אפשר לשבת על הספה החדשה.'
  ]
};
for(const level of ['24','25']){
 additions[level]=additions[level].filter(q=>!q.category.startsWith('Reading'));
 if(additions[level].length!==explanations[level].length)throw Error('Explanation count mismatch '+level);
 additions[level].forEach((q,i)=>{q.practiceOrigin='Supplemental lesson practice';q.explanation=explanations[level][i]});
}
const banks=window.HEBREW_TEXTBOOK_QUESTION_BANKS||(window.HEBREW_TEXTBOOK_QUESTION_BANKS={});
for(const [level,items] of Object.entries(additions)) banks[level]=items;
})();

