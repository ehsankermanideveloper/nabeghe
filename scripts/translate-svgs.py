#!/usr/bin/env python3
"""Translate SVG thumbnails for courses and articles to English and Pashto."""

import re
import os

COURSES_DIR = "src/common/view/assets/images/courses"
ARTICLES_DIR = "src/common/view/assets/images/articles"

# ── Translation dictionaries ────────────────────────────────────────────────

SUBJECTS_EN = {
    "زبان دری": "Dari Language",
    "بیولوژی": "Biology",
    "ریاضی": "Mathematics",
    "فیزیک": "Physics",
    "فزیک": "Physics",
    "کیمیا": "Chemistry",
    "تاریخ": "History",
    "جغرافیه": "Geography",
    "اجتماعی": "Social Studies",
    "علوم طبیعی": "Natural Sciences",
    "قرآن و دیانت": "Quran & Religion",
    "انگلیسی": "English Language",
}

SUBJECTS_PS = {
    "زبان دری": "د دری ژبه",
    "بیولوژی": "بیولوژي",
    "ریاضی": "ریاضي",
    "فیزیک": "فزیک",
    "فزیک": "فزیک",
    "کیمیا": "کیمیا",
    "تاریخ": "تاریخ",
    "جغرافیه": "جغرافیه",
    "اجتماعی": "ټولنیز زده‌کړه",
    "علوم طبیعی": "طبیعي علوم",
    "قرآن و دیانت": "قرآن او دیانت",
    "انگلیسی": "انګلیسي ژبه",
}

GRADES_EN = {
    "پایه اول": "Grade 1",
    "پایه دوم": "Grade 2",
    "پایه سوم": "Grade 3",
    "پایه چهارم": "Grade 4",
    "پایه پنجم": "Grade 5",
    "پایه ششم": "Grade 6",
    "پایه هفتم": "Grade 7",
    "پایه هشتم": "Grade 8",
    "پایه نهم": "Grade 9",
    "پایه دهم": "Grade 10",
    "پایه یازدهم": "Grade 11",
    "پایه دوازدهم": "Grade 12",
}

GRADES_PS = {
    "پایه اول": "لومړی ټولګی",
    "پایه دوم": "دویم ټولګی",
    "پایه سوم": "دریم ټولګی",
    "پایه چهارم": "څلورم ټولګی",
    "پایه پنجم": "پنځم ټولګی",
    "پایه ششم": "شپږم ټولګی",
    "پایه هفتم": "اوم ټولګی",
    "پایه هشتم": "اتم ټولګی",
    "پایه نهم": "نهم ټولګی",
    "پایه دهم": "لسم ټولګی",
    "پایه یازدهم": "یوولسم ټولګی",
    "پایه دوازدهم": "دولسم ټولګی",
}

ACADEMY_EN = "Liyan Amiri Academy"
ACADEMY_PS = "د لیان امیري اکاډمي"
ARTICLE_LABEL_EN = "Article"
ARTICLE_LABEL_PS = "مقاله"

# Article titles: [line1, line2] per locale
ARTICLE_TRANSLATIONS = {
    "adad-sahih-amaliyat": {
        "en": ["Integers and Operations", "on Them"],
        "ps": ["صحیح اعداد او عملیات", "پر هغوی باندې"],
    },
    "azmayesh-elmi-sadeh": {
        "en": ["Simple Science Experiments", "for Elementary Students"],
        "ps": ["ساده علمي تجربې", "د ابتدایي زده‌کوونکو لپاره"],
    },
    "cell-wahid-hayat": {
        "en": ["Cell — The Basic", "Unit of Life"],
        "ps": ["حجره — د ژوند", "بنسټیز واحد"],
    },
    "chgona-kodakan-khandan": {
        "en": ["How to Get Children", "Interested in Reading?"],
        "ps": ["څنګه ماشومان د لوستلو", "سره علاقه‌مند کړو؟"],
    },
    "chtor-maqaleh-englisi-benevesim": {
        "en": ["How to Write", "an English Essay?"],
        "ps": ["د انګلیسي مقاله", "څنګه وليکو؟"],
    },
    "energy-tajdidpazir-afghanistan": {
        "en": ["Renewable Energy", "in Afghanistan"],
        "ps": ["د افغانستان", "نوي انرژي"],
    },
    "eshtebahate-raij-alfaba": {
        "en": ["Common Mistakes in Learning", "the Dari Alphabet"],
        "ps": ["د دری الفبا زده‌کولو", "کې عام غلطۍ"],
    },
    "genetics-qavanin-mendel": {
        "en": ["Genetics and", "Mendel's Laws"],
        "ps": ["جنیتیک او", "د مندل قوانین"],
    },
    "ghaznaviyan-asr-talai": {
        "en": ["Ghaznavid Era —", "Afghanistan's Golden Age"],
        "ps": ["د غزنویانو دوره —", "د افغانستان سرزرین عصر"],
    },
    "jadval-dawreyi-elements": {
        "en": ["Periodic Table — A", "Complete Guide for Beginners"],
        "ps": ["د عناصرو دوره‌ای جدول —", "د پیلونکو بشپړ لارښود"],
    },
    "jonbesh-mashruteh-afghanistan": {
        "en": ["The Constitutional", "Movement in Afghanistan"],
        "ps": ["د افغانستان", "مشروطه غورځنګ"],
    },
    "moqaddameh-hisab-difaransil": {
        "en": ["Introduction to", "Differential Calculus"],
        "ps": ["د ډیفرنشل حساب", "سره پیژندنه"],
    },
    "qavanin-newton-zaban-sadeh": {
        "en": ["Newton's Laws", "in Simple Terms"],
        "ps": ["د نیوټن قوانین", "ساده ژبه کې"],
    },
    "rahnama-moadelat-khatti": {
        "en": ["Guide to Solving Linear", "Equations for Grade 7"],
        "ps": ["د خطي معادلاتو حل", "د اوم ټولګي لارښود"],
    },
    "raveshhaye-jadval-zarb": {
        "en": ["Methods for Teaching", "Multiplication Tables"],
        "ps": ["د ماشومانو ته د ضرب", "جدول د زده‌کړې لارې"],
    },
    "ravesh-tajwid-kodakan": {
        "en": ["Proper Method of", "Teaching Tajweed to Children"],
        "ps": ["ماشومانو ته د", "تجوید صحیح درسول"],
    },
    "riazi-ba-bazi": {
        "en": ["Learn Mathematics", "through Play"],
        "ps": ["د لوبو له لارې", "ریاضي زده کړو"],
    },
    "rudkhane-haye-afghanistan": {
        "en": ["Major Rivers", "of Afghanistan"],
        "ps": ["د افغانستان", "لوی سیندونه"],
    },
    "tabdilate-abo-hawai-afghanistan": {
        "en": ["Climate Change and Its", "Impact on Afghanistan"],
        "ps": ["هوایي بدلونونه او", "د افغانستان باندې یې اغیزه"],
    },
    "torfand-vocabulary-english": {
        "en": ["Quick Vocabulary", "Learning Tips for English"],
        "ps": ["د انګلیسي واژګانو", "د چټک زده‌کړې لارچارې"],
    },
}

# ── Helpers ─────────────────────────────────────────────────────────────────

def replace_text(content: str, old: str, new: str) -> str:
    """Replace text node content in SVG."""
    return content.replace(f">{old}</text>", f">{new}</text>")


def translate_course_svg(content: str, locale: str) -> str:
    subjects = SUBJECTS_EN if locale == "en" else SUBJECTS_PS
    grades = GRADES_EN if locale == "en" else GRADES_PS
    academy = ACADEMY_EN if locale == "en" else ACADEMY_PS

    for fa, translated in subjects.items():
        content = replace_text(content, fa, translated)
    for fa, translated in grades.items():
        content = replace_text(content, fa, translated)
    content = replace_text(content, "آکادمی لیان امیری", academy)
    return content


def translate_article_svg(content: str, slug: str, locale: str) -> str:
    academy = ACADEMY_EN if locale == "en" else ACADEMY_PS
    article_label = ARTICLE_LABEL_EN if locale == "en" else ARTICLE_LABEL_PS
    subjects = SUBJECTS_EN if locale == "en" else SUBJECTS_PS

    content = replace_text(content, "آکادمی لیان امیری", academy)
    content = replace_text(content, "مقاله", article_label)

    # Replace subject label
    for fa, translated in subjects.items():
        content = replace_text(content, fa, translated)

    # Replace article-specific title lines
    if slug in ARTICLE_TRANSLATIONS:
        trans = ARTICLE_TRANSLATIONS[slug][locale]
        # Extract original lines from fa SVG text nodes (lines 2 and 3 of 5 total text nodes)
        texts = re.findall(r">([^<]+)</text>", content)
        # texts order: [label, line1, line2, subject, academy] (after replacements above)
        # We need to find the original title lines and replace them
        # The title lines are the ones NOT matching label, subject, academy
        known = set(subjects.values()) | {academy, article_label}
        title_lines = [t for t in texts if t not in known]
        if len(title_lines) >= 1 and len(trans) >= 1:
            content = replace_text(content, title_lines[0], trans[0])
        if len(title_lines) >= 2 and len(trans) >= 2:
            content = replace_text(content, title_lines[1], trans[1])

    return content


# ── Main ─────────────────────────────────────────────────────────────────────

def process_dir(directory: str, is_article: bool):
    svgs = [f for f in os.listdir(directory)
            if f.endswith(".svg") and not f.endswith("-en.svg") and not f.endswith("-ps.svg")]

    for filename in sorted(svgs):
        slug = filename[:-4]  # strip .svg
        src_path = os.path.join(directory, filename)

        with open(src_path, "r", encoding="utf-8") as fh:
            original = fh.read()

        for locale in ("en", "ps"):
            if is_article:
                translated = translate_article_svg(original, slug, locale)
            else:
                translated = translate_course_svg(original, locale)

            out_path = os.path.join(directory, f"{slug}-{locale}.svg")
            with open(out_path, "w", encoding="utf-8") as fh:
                fh.write(translated)

        print(f"  {slug}")


print("Translating course thumbnails...")
process_dir(COURSES_DIR, is_article=False)

print("Translating article thumbnails...")
process_dir(ARTICLES_DIR, is_article=True)

print("Done.")
