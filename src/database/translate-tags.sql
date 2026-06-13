BEGIN;

-- ============================================================
-- article_tag translations (update by fa value)
-- ============================================================
UPDATE article_tag SET title = title || '{"en":"Dari Language","ps":"دري ژبه"}'::jsonb WHERE title->>'fa' = 'زبان دری';
UPDATE article_tag SET title = title || '{"en":"Reading","ps":"لوستل"}'::jsonb WHERE title->>'fa' = 'مطالعه';
UPDATE article_tag SET title = title || '{"en":"Elementary","ps":"ابتدایی"}'::jsonb WHERE title->>'fa' = 'ابتدایی';
UPDATE article_tag SET title = title || '{"en":"Alphabet","ps":"الفبا"}'::jsonb WHERE title->>'fa' = 'الفبا';
UPDATE article_tag SET title = title || '{"en":"Education","ps":"تعلیم"}'::jsonb WHERE title->>'fa' = 'آموزش';
UPDATE article_tag SET title = title || '{"en":"Mathematics","ps":"ریاضی"}'::jsonb WHERE title->>'fa' = 'ریاضی';
UPDATE article_tag SET title = title || '{"en":"Multiplication Table","ps":"د ضرب جدول"}'::jsonb WHERE title->>'fa' = 'جدول ضرب';
UPDATE article_tag SET title = title || '{"en":"Game","ps":"لوبه"}'::jsonb WHERE title->>'fa' = 'بازی';
UPDATE article_tag SET title = title || '{"en":"Learning","ps":"زده کړه"}'::jsonb WHERE title->>'fa' = 'یادگیری';
UPDATE article_tag SET title = title || '{"en":"Science","ps":"ساینس"}'::jsonb WHERE title->>'fa' = 'علوم';
UPDATE article_tag SET title = title || '{"en":"Experiment","ps":"آزمایښت"}'::jsonb WHERE title->>'fa' = 'آزمایش';
UPDATE article_tag SET title = title || '{"en":"Child","ps":"ماشوم"}'::jsonb WHERE title->>'fa' = 'کودک';
UPDATE article_tag SET title = title || '{"en":"Tajweed","ps":"تجوید"}'::jsonb WHERE title->>'fa' = 'تجوید';
UPDATE article_tag SET title = title || '{"en":"Quran","ps":"قرآن"}'::jsonb WHERE title->>'fa' = 'قرآن';
UPDATE article_tag SET title = title || '{"en":"Religion","ps":"دین"}'::jsonb WHERE title->>'fa' = 'دیانت';
UPDATE article_tag SET title = title || '{"en":"Algebra","ps":"الجبر"}'::jsonb WHERE title->>'fa' = 'جبر';
UPDATE article_tag SET title = title || '{"en":"Equation","ps":"معادله"}'::jsonb WHERE title->>'fa' = 'معادله';
UPDATE article_tag SET title = title || '{"en":"Integers","ps":"صحیح اعداد"}'::jsonb WHERE title->>'fa' = 'اعداد صحیح';
UPDATE article_tag SET title = title || '{"en":"Intermediate","ps":"منځنی"}'::jsonb WHERE title->>'fa' = 'متوسطه';
UPDATE article_tag SET title = title || '{"en":"Physics","ps":"فیزیک"}'::jsonb WHERE title->>'fa' = 'فیزیک';
UPDATE article_tag SET title = title || '{"en":"Mechanics","ps":"مکانیک"}'::jsonb WHERE title->>'fa' = 'مکانیک';
UPDATE article_tag SET title = title || '{"en":"Newton","ps":"نیوټن"}'::jsonb WHERE title->>'fa' = 'نیوتون';
UPDATE article_tag SET title = title || '{"en":"Ghaznavids","ps":"غزنویان"}'::jsonb WHERE title->>'fa' = 'غزنویان';
UPDATE article_tag SET title = title || '{"en":"History","ps":"تاریخ"}'::jsonb WHERE title->>'fa' = 'تاریخ';
UPDATE article_tag SET title = title || '{"en":"Afghanistan","ps":"افغانستان"}'::jsonb WHERE title->>'fa' = 'افغانستان';
UPDATE article_tag SET title = title || '{"en":"River","ps":"سیند"}'::jsonb WHERE title->>'fa' = 'رودخانه';
UPDATE article_tag SET title = title || '{"en":"Geography","ps":"جغرافیه"}'::jsonb WHERE title->>'fa' = 'جغرافیه';
UPDATE article_tag SET title = title || '{"en":"Periodic Table","ps":"د دورې جدول"}'::jsonb WHERE title->>'fa' = 'جدول دوره‌ای';
UPDATE article_tag SET title = title || '{"en":"Chemistry","ps":"کیمیا"}'::jsonb WHERE title->>'fa' = 'کیمیا';
UPDATE article_tag SET title = title || '{"en":"Elements","ps":"عناصر"}'::jsonb WHERE title->>'fa' = 'عناصر';
UPDATE article_tag SET title = title || '{"en":"Cell","ps":"حجره"}'::jsonb WHERE title->>'fa' = 'سلول';
UPDATE article_tag SET title = title || '{"en":"Biology","ps":"بیولوژي"}'::jsonb WHERE title->>'fa' = 'بیولوژی';
UPDATE article_tag SET title = title || '{"en":"Life","ps":"ژوند"}'::jsonb WHERE title->>'fa' = 'حیات';
UPDATE article_tag SET title = title || '{"en":"English","ps":"انګلیسي"}'::jsonb WHERE title->>'fa' = 'انگلیسی';
UPDATE article_tag SET title = title || '{"en":"Vocabulary","ps":"واژه ګانې"}'::jsonb WHERE title->>'fa' = 'واژگان';
UPDATE article_tag SET title = title || '{"en":"Calculus","ps":"کالکولس"}'::jsonb WHERE title->>'fa' = 'دیفرانسیل';
UPDATE article_tag SET title = title || '{"en":"Energy","ps":"انرژي"}'::jsonb WHERE title->>'fa' = 'انرژی';
UPDATE article_tag SET title = title || '{"en":"Environment","ps":"چاپیریال"}'::jsonb WHERE title->>'fa' = 'محیط‌زیست';
UPDATE article_tag SET title = title || '{"en":"Constitutional Movement","ps":"مشروطیت غورځنګ"}'::jsonb WHERE title->>'fa' = 'امانی';
UPDATE article_tag SET title = title || '{"en":"Genetics","ps":"جینیتیک"}'::jsonb WHERE title->>'fa' = 'ژنتیک';
UPDATE article_tag SET title = title || '{"en":"Mendel","ps":"مندل"}'::jsonb WHERE title->>'fa' = 'مندل';
UPDATE article_tag SET title = title || '{"en":"Writing","ps":"لیکل"}'::jsonb WHERE title->>'fa' = 'نگارش';
UPDATE article_tag SET title = title || '{"en":"University Entrance","ps":"کانکور"}'::jsonb WHERE title->>'fa' = 'کانکور';

-- ============================================================
-- course_tag translations (update by fa value)
-- ============================================================
UPDATE course_tag SET name = name || '{"en":"Mathematics","ps":"ریاضی"}'::jsonb WHERE name->>'fa' = 'ریاضی';
UPDATE course_tag SET name = name || '{"en":"Physics","ps":"فیزیک"}'::jsonb WHERE name->>'fa' = 'فیزیک';
UPDATE course_tag SET name = name || '{"en":"Chemistry","ps":"کیمیا"}'::jsonb WHERE name->>'fa' = 'کیمیا';
UPDATE course_tag SET name = name || '{"en":"Biology","ps":"بیولوژي"}'::jsonb WHERE name->>'fa' = 'بیولوژی';
UPDATE course_tag SET name = name || '{"en":"Algebra","ps":"الجبر"}'::jsonb WHERE name->>'fa' = 'جبر';
UPDATE course_tag SET name = name || '{"en":"Mechanics","ps":"مکانیک"}'::jsonb WHERE name->>'fa' = 'مکانیک';
UPDATE course_tag SET name = name || '{"en":"Dari Language","ps":"دري ژبه"}'::jsonb WHERE name->>'fa' = 'زبان دری';
UPDATE course_tag SET name = name || '{"en":"Literature","ps":"ادبیات"}'::jsonb WHERE name->>'fa' = 'ادبیات';
UPDATE course_tag SET name = name || '{"en":"Map","ps":"نقشه"}'::jsonb WHERE name->>'fa' = 'نقشه';
UPDATE course_tag SET name = name || '{"en":"History","ps":"تاریخ"}'::jsonb WHERE name->>'fa' = 'تاریخ';
UPDATE course_tag SET name = name || '{"en":"Intermediate","ps":"منځنی"}'::jsonb WHERE name->>'fa' = 'متوسطه';
UPDATE course_tag SET name = name || '{"en":"Quran","ps":"قرآن"}'::jsonb WHERE name->>'fa' = 'قرآن';
UPDATE course_tag SET name = name || '{"en":"Society","ps":"ټولنه"}'::jsonb WHERE name->>'fa' = 'جامعه';
UPDATE course_tag SET name = name || '{"en":"University Entrance","ps":"کانکور"}'::jsonb WHERE name->>'fa' = 'کانکور';
UPDATE course_tag SET name = name || '{"en":"Language","ps":"ژبه"}'::jsonb WHERE name->>'fa' = 'زبان';
UPDATE course_tag SET name = name || '{"en":"Reaction","ps":"عکس العمل"}'::jsonb WHERE name->>'fa' = 'واکنش';
UPDATE course_tag SET name = name || '{"en":"Geography","ps":"جغرافیه"}'::jsonb WHERE name->>'fa' = 'جغرافیه';
UPDATE course_tag SET name = name || '{"en":"Elementary","ps":"ابتدایی"}'::jsonb WHERE name->>'fa' = 'ابتدایی';
UPDATE course_tag SET name = name || '{"en":"Nature","ps":"طبیعت"}'::jsonb WHERE name->>'fa' = 'طبیعت';
UPDATE course_tag SET name = name || '{"en":"Grammar","ps":"ګرامر"}'::jsonb WHERE name->>'fa' = 'گرامر';

COMMIT;
