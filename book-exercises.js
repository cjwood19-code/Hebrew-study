(function(){
const D=window.TRAINER_DATA||(window.TRAINER_DATA={});
const exercises=[
  {id:"l2-being-1-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: החיים קשים.",answer:"החיים היו קשים.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-1-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: החיים קשים.",answer:"החיים יהיו קשים.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-2-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: הספר איטלקי.",answer:"הספר היה איטלקי.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-2-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: הספר איטלקי.",answer:"הספר יהיה איטלקי.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-3-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: אני שמן ואת רזה.",answer:"הייתי שמן ואת היית רזה.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-3-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: אני שמן ואת רזה.",answer:"אני אהיה שמן ואת תהיי רזה.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-4-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: את סופרת מפורסמת.",answer:"את היית סופרת מפורסמת.",answers:["את היית סופרת מפורסמת.","היית סופרת מפורסמת."],levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-4-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: את סופרת מפורסמת.",answer:"תהיי סופרת מפורסמת.",answers:["תהיי סופרת מפורסמת.","את תהיי סופרת מפורסמת."],levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-5-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: אתה עצוב מאוד.",answer:"היית עצוב מאוד.",answers:["היית עצוב מאוד.","אתה היית עצוב מאוד."],levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-5-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: אתה עצוב מאוד.",answer:"אתה תהיה עצוב מאוד.",answers:["אתה תהיה עצוב מאוד.","תהיה עצוב מאוד."],levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-6-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: גבי ויורם הם התלמידים הטובים ביותר בכיתה.",answer:"גבי ויורם היו התלמידים הטובים ביותר בכיתה.",answers:["גבי ויורם היו התלמידים הטובים ביותר בכיתה.","גבי ויורם הם היו התלמידים הטובים ביותר בכיתה."],levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-6-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: גבי ויורם הם התלמידים הטובים ביותר בכיתה.",answer:"גבי ויורם יהיו התלמידים הטובים ביותר בכיתה.",answers:["גבי ויורם יהיו התלמידים הטובים ביותר בכיתה.","גבי ויורם הם יהיו התלמידים הטובים ביותר בכיתה."],levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-7-past",skill:"tense",cat:"מהספר • כתבו בעבר",prompt:"כתבו בעבר: יעל עשירה, אבל האחים שלה עניים.",answer:"יעל הייתה עשירה, אבל האחים שלה היו עניים.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},
  {id:"l2-being-7-future",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: יעל עשירה, אבל האחים שלה עניים.",answer:"יעל תהיה עשירה, אבל האחים שלה יהיו עניים.",levelMin:8,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 100"},

  {id:"l2-indirect-1",skill:"transformation",cat:"מהספר • דיבור עקיף",prompt:"כתבו בדיבור עקיף: הסטודנט שאל: \"האם מספיק ללמוד במשך חודש אחד כדי להצליח?\"",answer:"הסטודנט שאל אם מספיק ללמוד במשך חודש אחד כדי להצליח.",levelMin:10,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 102"},
  {id:"l2-indirect-2",skill:"transformation",cat:"מהספר • דיבור עקיף",prompt:"כתבו בדיבור עקיף: הפרופסור הזקן ענה לסטודנט: \"אתה צריך ללמוד במשך כל השנה.\"",answer:"הפרופסור הזקן ענה לסטודנט שהוא צריך ללמוד במשך כל השנה.",levelMin:10,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 102"},
  {id:"l2-indirect-3",skill:"transformation",cat:"מהספר • דיבור עקיף",prompt:"כתבו בדיבור עקיף: השכן שאל: \"מדוע אתה מחזיר לי תמיד שניים במקום אחד?\"",answer:"השכן שאל מדוע הוא מחזיר לו תמיד שניים במקום אחד.",levelMin:10,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 102"},
  {id:"l2-indirect-4",skill:"transformation",cat:"מהספר • דיבור עקיף",prompt:"כתבו בדיבור עקיף: האיש ענה: \"אני מחזיר לך שניים במקום אחד מפני שהכלים הם כמו בעלי חיים.\"",answer:"האיש ענה שהוא מחזיר לו שניים במקום אחד מפני שהכלים הם כמו בעלי חיים.",levelMin:10,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 102"},

  {id:"l2-future-1",skill:"tense",cat:"מהספר • כתבו את המשפטים בעתיד",prompt:"כתבו בעתיד: כעסת על חברך וצעקת עליו.",answer:"תכעס על חברך ותצעק עליו.",answers:["תכעס על חברך ותצעק עליו.","אתה תכעס על חברך ותצעק עליו."],levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 143"},
  {id:"l2-future-2",skill:"tense",cat:"מהספר • כתבו את המשפטים בעתיד",prompt:"כתבו בעתיד: דני שמח כאשר מצא עט ברחוב.",answer:"דני ישמח כאשר ימצא עט ברחוב.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 143"},
  {id:"l2-future-3",skill:"tense",cat:"מהספר • כתבו את המשפטים בעתיד",prompt:"כתבו בעתיד: לבשתי ג'ינס ונעלתי מגפיים.",answer:"אלבש ג'ינס ואנעל מגפיים.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 143"},
  {id:"l2-future-4",skill:"tense",cat:"מהספר • כתבו את המשפטים בעתיד",prompt:"כתבו בעתיד: הילדה למדה בבית ספר חדש.",answer:"הילדה תלמד בבית ספר חדש.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 143"},
  {id:"l2-future-5",skill:"tense",cat:"מהספר • כתבו את המשפטים בעתיד",prompt:"כתבו בעתיד: המלך שכב לנוח.",answer:"המלך ישכב לנוח.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 143"},
  {id:"l2-future-6",skill:"tense",cat:"מהספר • כתבו את המשפטים בעתיד",prompt:"כתבו בעתיד: את דאגת לבנך כי הוא נהג במכונית חדשה.",answer:"את תדאגי לבנך כי הוא ינהג במכונית חדשה.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 143"},
  {id:"l2-future-7",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: משה פגש את חנה ומסר לה חבילה מההורים שלה.",answer:"משה יפגוש את חנה וימסור לה חבילה מההורים שלה.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 144"},
  {id:"l2-future-8",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: האישה צעקה על הילדה כאשר היא שפכה את התה.",answer:"האישה תצעק על הילדה כאשר היא תשפוך את התה.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 144"},
  {id:"l2-future-9",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: את פתחת את החלון וסגרת את הדלת.",answer:"את תפתחי את החלון ותסגרי את הדלת.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 144"},
  {id:"l2-future-10",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: אני למדתי למבחן, ואתה שכבת לישון.",answer:"אני אלמד למבחן ואתה תשכב לישון.",answers:["אני אלמד למבחן ואתה תשכב לישון.","אלמד למבחן ואתה תשכב לישון."],levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 144"},
  {id:"l2-future-11",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: אתה עזרת לי כאשר נהגתי במכונית בפעם הראשונה.",answer:"אתה תעזור לי כאשר אנהג במכונית בפעם הראשונה.",levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 144"},
  {id:"l2-future-12",skill:"tense",cat:"מהספר • כתבו בעתיד",prompt:"כתבו בעתיד: שמענו את הסיפור המעניין וכתבנו אותו במחברת.",answer:"אנחנו נשמע את הסיפור המעניין ונכתוב אותו במחברת.",answers:["אנחנו נשמע את הסיפור המעניין ונכתוב אותו במחברת.","נשמע את הסיפור המעניין ונכתוב אותו במחברת."],levelMin:9,source:"CHRIS_ YEHUDA HEBREW LEVEL 2 • עמוד 144"},

  {id:"i2-action-1",skill:"actionNoun",cat:"מהספר • שם הפעולה",prompt:"כתבו את שם הפעולה: לכתוב",answer:"כתיבה",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-action-2",skill:"actionNoun",cat:"מהספר • שם הפעולה",prompt:"כתבו את שם הפעולה: לשמוע",answer:"שמיעה",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-action-3",skill:"actionNoun",cat:"מהספר • שם הפעולה",prompt:"כתבו את שם הפעולה: לעבוד",answer:"עבודה",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-action-4",skill:"actionNoun",cat:"מהספר • שם הפעולה",prompt:"כתבו את שם הפעולה: לשאול",answer:"שאלה",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-action-5",skill:"actionNoun",cat:"מהספר • שם הפעולה",prompt:"כתבו את שם הפעולה: לפחוד",answer:"פחד",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-action-6",skill:"actionNoun",cat:"מהספר • שם הפעולה",prompt:"כתבו את שם הפעולה: לחקור",answer:"מחקר",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},

  {id:"i2-future-1",skill:"tense",cat:"מהספר • לכתוב בעתיד",prompt:"השלימו בעתיד: שר החינוך והעוזר שלו: ___ לשמוע ששנת הלימודים ___ בלי בעיות. (לשמוח, להתחיל)",answer:"נשמח לשמוע ששנת הלימודים תתחיל בלי בעיות.",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-future-2",skill:"tense",cat:"מהספר • לכתוב בעתיד",prompt:"כתבו בעתיד: חברי הכנסת ___ על דברי העיתונאי. (לכעוס)",answer:"חברי הכנסת יכעסו על דברי העיתונאי.",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-future-3",skill:"tense",cat:"מהספר • לכתוב בעתיד",prompt:"שר החינוך לתלמיד: אתה ___ לתחרות העולמית בפיזיקה? (ללמוד)",answer:"אתה תלמד לתחרות העולמית בפיזיקה?",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-future-4",skill:"tense",cat:"מהספר • לכתוב בעתיד",prompt:"שרת התרבות ___ מרכז לשמירה על מסורות עתיקות? (לפתוח)",answer:"שרת התרבות תפתח מרכז לשמירה על מסורות עתיקות?",levelMin:9,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},

  {id:"i2-double-1",skill:"meaning",cat:"מהספר • דו-משמעות",prompt:"בסינדרלה: תנעל את נעל הזכוכית במסיבה. מה פירוש לנעול כאן?",answer:"ללבוש נעליים",options:["ללבוש נעליים","לנעול דלת","לשאול שאלה","לחקור נושא"],levelMin:7,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-double-2",skill:"meaning",cat:"מהספר • דו-משמעות",prompt:"אני אנעל את הדלת. מה פירוש לנעול כאן?",answer:"לנעול / לסגור במפתח",options:["לנעול / לסגור במפתח","ללבוש נעליים","לשאול ספר","לחקור נושא"],levelMin:7,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-double-3",skill:"meaning",cat:"מהספר • דו-משמעות",prompt:"אנחנו נשאל את המרצה את כל השאלות החשובות. מה פירוש לשאול כאן?",answer:"לשאול שאלה",options:["לשאול שאלה","לשאול / ללוות ספר","לנעול דלת","לחקור פשע"],levelMin:7,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-double-4",skill:"meaning",cat:"מהספר • דו-משמעות",prompt:"התלמידות ישאלו ספרים מהספרייה. מה פירוש לשאול כאן?",answer:"לשאול / ללוות ספר",options:["לשאול / ללוות ספר","לשאול שאלה","לחקור נושא","לנעול נעליים"],levelMin:7,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 66"},
  {id:"i2-double-5",skill:"meaning",cat:"מהספר • דו-משמעות",prompt:"הסטודנטים לתואר שלישי יחקרו תרבויות של שבטים אפריקניים. מה פירוש לחקור כאן?",answer:"לחקור / לעשות מחקר",options:["לחקור / לעשות מחקר","לחקור אדם בחקירה","לשאול ספר","לנעול דלת"],levelMin:7,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 67"},
  {id:"i2-double-6",skill:"meaning",cat:"מהספר • דו-משמעות",prompt:"השוטרת תחקור את הנהג אחרי התאונה בכביש. מה פירוש לחקור כאן?",answer:"לחקור / לתשאל בחקירה",options:["לחקור / לתשאל בחקירה","לעשות מחקר אקדמי","לשאול ספר","לנעול נעליים"],levelMin:7,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 67"},

  {id:"i2-number-1",skill:"number",cat:"מהספר • רבים ליחיד",prompt:"הפכו ליחיד: ראינו את השדות הירוקים ואת הדרכים החדשות.",answer:"ראיתי את השדה הירוק ואת הדרך החדשה.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-number-2",skill:"number",cat:"מהספר • רבים ליחיד",prompt:"הפכו ליחיד: אלה הצמחים היבשים שמצאתם במדבר?",answer:"זה הצמח היבש שמצאת במדבר?",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-number-4",skill:"number",cat:"מהספר • רבים ליחיד",prompt:"הפכו ליחיד: האומנים שמו פסלים מיוחדים ליד הבניינים הגבוהים.",answer:"האומן שם פסל מיוחד ליד הבניין הגבוה.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-number-5",skill:"number",cat:"מהספר • רבים ליחיד",prompt:"הפכו ליחיד: המרצים סיפרו על תרבויות רחוקות ועתיקות.",answer:"המרצה סיפר על תרבות רחוקה ועתיקה.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-number-7",skill:"number",cat:"מהספר • רבים ליחיד",prompt:"הפכו ליחיד: זהירות! הבורות העמוקים נמצאים ליד הכבישים המסוכנים.",answer:"זהירות! הבור העמוק נמצא ליד הכביש המסוכן.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-number-8",skill:"number",cat:"מהספר • רבים ליחיד",prompt:"הפכו ליחיד: הארכיאולוגים אומרים שהאבנים האלה יקרות.",answer:"הארכיאולוג אומר שהאבן הזאת יקרה.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},

  {id:"i2-plural-1",skill:"number",cat:"מהספר • יחיד לרבים",prompt:"הפכו לרבים: איזו מילה חדשה אתה מתרגם?",answer:"אילו מילים חדשות אתם מתרגמים?",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-plural-3",skill:"number",cat:"מהספר • יחיד לרבים",prompt:"הפכו לרבים: המדריכה תסביר לתיירת על הדרך לעיר העתיקה.",answer:"המדריכות יסבירו לתיירות על הדרכים לערים העתיקות.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-plural-5",skill:"number",cat:"מהספר • יחיד לרבים",prompt:"הפכו לרבים: תושב יקר, אתה צריך לשים את השלט עם השם של הרחוב על קיר גבוה.",answer:"תושבים יקרים, אתם צריכים לשים את השלטים עם השמות של הרחובות על קירות גבוהים.",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},

  {id:"i2-smichut-1",skill:"smichut",cat:"מהספר • סמיכות",prompt:"כתבו בסמיכות: תלמיד שלומד באולפן",answer:"תלמיד אולפן",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-smichut-2",skill:"smichut",cat:"מהספר • סמיכות",prompt:"כתבו בסמיכות: תלמידה שלומדת באולפן",answer:"תלמידת אולפן",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-smichut-3",skill:"smichut",cat:"מהספר • סמיכות",prompt:"כתבו בסמיכות: תלמידים שלומדים באולפן",answer:"תלמידי אולפן",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},
  {id:"i2-smichut-4",skill:"smichut",cat:"מהספר • סמיכות",prompt:"כתבו בסמיכות: תלמידות שלומדות באולפן",answer:"תלמידות אולפן",levelMin:8,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 74"},

  {id:"i2-cloze-1",skill:"context",cat:"מהספר • השלמה מתוך ההקשר",prompt:"השלימו מתוך ההקשר: לפני ששותלים עצים בבוסתן ___ בית.",answer:"בונים",options:["בונים","הזמינו","שומעים","חיו"],levelMin:6,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 60"},
  {id:"i2-cloze-2",skill:"context",cat:"מהספר • השלמה מתוך ההקשר",prompt:"השלימו מתוך ההקשר: אחרי שבנו את המסגד הגדול, ___ אנשים להתפלל שם.",answer:"הזמינו",options:["בונים","הזמינו","שומעים","חיו"],levelMin:6,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 60"},
  {id:"i2-cloze-3",skill:"context",cat:"מהספר • השלמה מתוך ההקשר",prompt:"השלימו מתוך ההקשר: כאשר מטיילים בעיר רמלה, ___ עברית וערבית.",answer:"שומעים",options:["בונים","הזמינו","שומעים","חיו"],levelMin:6,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 60"},
  {id:"i2-cloze-4",skill:"context",cat:"מהספר • השלמה מתוך ההקשר",prompt:"השלימו מתוך ההקשר: השומרונים חיים כיום בהר גריזים ובחולון. לפני כן הם ___ בשומרון.",answer:"חיו",options:["בונים","הזמינו","שומעים","חיו"],levelMin:6,source:"CHRIS WOOD-HEBREW-INTERMEDIATE 2 • עמוד 60"}
];
D.bookExercises=(D.bookExercises||[]).concat(exercises.filter(function(e){
  return !(D.bookExercises||[]).some(function(x){return x.id===e.id});
}));
})();