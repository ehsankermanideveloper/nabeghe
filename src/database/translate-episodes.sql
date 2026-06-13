-- Remaining episode translations (120 unique patterns across subject-specific prefixes)
BEGIN;

-- Mathematics: توضیح مفهوم / تمرین‌های تکمیلی / حل مسئله
UPDATE course_episode SET title = title || '{"en":"Concept Explanation — Numbers & Operations","ps":"د مفهوم تشریح — شمیرې او عملیات"}'::jsonb WHERE title->>'fa' = 'توضیح مفهوم — اعداد و عملیات';
UPDATE course_episode SET title = title || '{"en":"Supplementary Exercises — Numbers & Operations","ps":"بشپړ تمرینونه — شمیرې او عملیات"}'::jsonb WHERE title->>'fa' = 'تمرین‌های تکمیلی — اعداد و عملیات';
UPDATE course_episode SET title = title || '{"en":"Problem Solving — Numbers & Operations","ps":"د مسئلې حل — شمیرې او عملیات"}'::jsonb WHERE title->>'fa' = 'حل مسئله — اعداد و عملیات';
UPDATE course_episode SET title = title || '{"en":"Concept Explanation — Algebra & Equations","ps":"د مفهوم تشریح — الجبر او معادلې"}'::jsonb WHERE title->>'fa' = 'توضیح مفهوم — جبر و معادله';
UPDATE course_episode SET title = title || '{"en":"Supplementary Exercises — Algebra & Equations","ps":"بشپړ تمرینونه — الجبر او معادلې"}'::jsonb WHERE title->>'fa' = 'تمرین‌های تکمیلی — جبر و معادله';
UPDATE course_episode SET title = title || '{"en":"Problem Solving — Algebra & Equations","ps":"د مسئلې حل — الجبر او معادلې"}'::jsonb WHERE title->>'fa' = 'حل مسئله — جبر و معادله';
UPDATE course_episode SET title = title || '{"en":"Concept Explanation — Geometry","ps":"د مفهوم تشریح — هندسه"}'::jsonb WHERE title->>'fa' = 'توضیح مفهوم — هندسه';
UPDATE course_episode SET title = title || '{"en":"Supplementary Exercises — Geometry","ps":"بشپړ تمرینونه — هندسه"}'::jsonb WHERE title->>'fa' = 'تمرین‌های تکمیلی — هندسه';
UPDATE course_episode SET title = title || '{"en":"Problem Solving — Geometry","ps":"د مسئلې حل — هندسه"}'::jsonb WHERE title->>'fa' = 'حل مسئله — هندسه';
UPDATE course_episode SET title = title || '{"en":"Concept Explanation — Statistics & Probability","ps":"د مفهوم تشریح — احصائیه او احتمال"}'::jsonb WHERE title->>'fa' = 'توضیح مفهوم — آمار و احتمال';
UPDATE course_episode SET title = title || '{"en":"Supplementary Exercises — Statistics & Probability","ps":"بشپړ تمرینونه — احصائیه او احتمال"}'::jsonb WHERE title->>'fa' = 'تمرین‌های تکمیلی — آمار و احتمال';
UPDATE course_episode SET title = title || '{"en":"Problem Solving — Statistics & Probability","ps":"د مسئلې حل — احصائیه او احتمال"}'::jsonb WHERE title->>'fa' = 'حل مسئله — آمار و احتمال';

-- Chemistry: مفاهیم نظری / آزمایش‌های عملی / مسائل و تمرین
UPDATE course_episode SET title = title || '{"en":"Theoretical Concepts — Matter & Atomic Structure","ps":"نظري مفاهیم — مادې او د اتوم جوړښت"}'::jsonb WHERE title->>'fa' = 'مفاهیم نظری — مواد و ساختار اتم';
UPDATE course_episode SET title = title || '{"en":"Practical Experiments — Matter & Atomic Structure","ps":"عملي آزمایشونه — مادې او د اتوم جوړښت"}'::jsonb WHERE title->>'fa' = 'آزمایش‌های عملی — مواد و ساختار اتم';
UPDATE course_episode SET title = title || '{"en":"Problems & Practice — Matter & Atomic Structure","ps":"مسائل او تمرین — مادې او د اتوم جوړښت"}'::jsonb WHERE title->>'fa' = 'مسائل و تمرین — مواد و ساختار اتم';
UPDATE course_episode SET title = title || '{"en":"Theoretical Concepts — Chemical Reactions","ps":"نظري مفاهیم — کیمیاوي غبرګونونه"}'::jsonb WHERE title->>'fa' = 'مفاهیم نظری — واکنش‌های کیمیاوی';
UPDATE course_episode SET title = title || '{"en":"Practical Experiments — Chemical Reactions","ps":"عملي آزمایشونه — کیمیاوي غبرګونونه"}'::jsonb WHERE title->>'fa' = 'آزمایش‌های عملی — واکنش‌های کیمیاوی';
UPDATE course_episode SET title = title || '{"en":"Problems & Practice — Chemical Reactions","ps":"مسائل او تمرین — کیمیاوي غبرګونونه"}'::jsonb WHERE title->>'fa' = 'مسائل و تمرین — واکنش‌های کیمیاوی';
UPDATE course_episode SET title = title || '{"en":"Theoretical Concepts — Solutions & Acids","ps":"نظري مفاهیم — محلولونه او اسیدونه"}'::jsonb WHERE title->>'fa' = 'مفاهیم نظری — محلول‌ها و اسیدها';
UPDATE course_episode SET title = title || '{"en":"Practical Experiments — Solutions & Acids","ps":"عملي آزمایشونه — محلولونه او اسیدونه"}'::jsonb WHERE title->>'fa' = 'آزمایش‌های عملی — محلول‌ها و اسیدها';
UPDATE course_episode SET title = title || '{"en":"Problems & Practice — Solutions & Acids","ps":"مسائل او تمرین — محلولونه او اسیدونه"}'::jsonb WHERE title->>'fa' = 'مسائل و تمرین — محلول‌ها و اسیدها';
UPDATE course_episode SET title = title || '{"en":"Theoretical Concepts — Organic Chemistry","ps":"نظري مفاهیم — عضوي کیمیا"}'::jsonb WHERE title->>'fa' = 'مفاهیم نظری — کیمیای عضوی';
UPDATE course_episode SET title = title || '{"en":"Practical Experiments — Organic Chemistry","ps":"عملي آزمایشونه — عضوي کیمیا"}'::jsonb WHERE title->>'fa' = 'آزمایش‌های عملی — کیمیای عضوی';
UPDATE course_episode SET title = title || '{"en":"Problems & Practice — Organic Chemistry","ps":"مسائل او تمرین — عضوي کیمیا"}'::jsonb WHERE title->>'fa' = 'مسائل و تمرین — کیمیای عضوی';

-- Physics: تئوری و قانون / آزمایش و کاربرد / محاسبات عددی
UPDATE course_episode SET title = title || '{"en":"Theory & Laws — Mechanics & Motion","ps":"تیوري او قوانین — میخانیک او حرکت"}'::jsonb WHERE title->>'fa' = 'تئوری و قانون — مکانیک و حرکت';
UPDATE course_episode SET title = title || '{"en":"Experiment & Application — Mechanics & Motion","ps":"آزمایش او کارونه — میخانیک او حرکت"}'::jsonb WHERE title->>'fa' = 'آزمایش و کاربرد — مکانیک و حرکت';
UPDATE course_episode SET title = title || '{"en":"Numerical Calculations — Mechanics & Motion","ps":"عددي محاسبات — میخانیک او حرکت"}'::jsonb WHERE title->>'fa' = 'محاسبات عددی — مکانیک و حرکت';
UPDATE course_episode SET title = title || '{"en":"Theory & Laws — Heat & Energy","ps":"تیوري او قوانین — تودوخه او انرژي"}'::jsonb WHERE title->>'fa' = 'تئوری و قانون — گرما و انرژی';
UPDATE course_episode SET title = title || '{"en":"Experiment & Application — Heat & Energy","ps":"آزمایش او کارونه — تودوخه او انرژي"}'::jsonb WHERE title->>'fa' = 'آزمایش و کاربرد — گرما و انرژی';
UPDATE course_episode SET title = title || '{"en":"Numerical Calculations — Heat & Energy","ps":"عددي محاسبات — تودوخه او انرژي"}'::jsonb WHERE title->>'fa' = 'محاسبات عددی — گرما و انرژی';
UPDATE course_episode SET title = title || '{"en":"Theory & Laws — Light & Waves","ps":"تیوري او قوانین — رڼا او امواج"}'::jsonb WHERE title->>'fa' = 'تئوری و قانون — نور و امواج';
UPDATE course_episode SET title = title || '{"en":"Experiment & Application — Light & Waves","ps":"آزمایش او کارونه — رڼا او امواج"}'::jsonb WHERE title->>'fa' = 'آزمایش و کاربرد — نور و امواج';
UPDATE course_episode SET title = title || '{"en":"Numerical Calculations — Light & Waves","ps":"عددي محاسبات — رڼا او امواج"}'::jsonb WHERE title->>'fa' = 'محاسبات عددی — نور و امواج';
UPDATE course_episode SET title = title || '{"en":"Theory & Laws — Electricity & Magnetism","ps":"تیوري او قوانین — برښنا او مقناطیس"}'::jsonb WHERE title->>'fa' = 'تئوری و قانون — الکتریسیته و مغناطیس';
UPDATE course_episode SET title = title || '{"en":"Experiment & Application — Electricity & Magnetism","ps":"آزمایش او کارونه — برښنا او مقناطیس"}'::jsonb WHERE title->>'fa' = 'آزمایش و کاربرد — الکتریسیته و مغناطیس';
UPDATE course_episode SET title = title || '{"en":"Numerical Calculations — Electricity & Magnetism","ps":"عددي محاسبات — برښنا او مقناطیس"}'::jsonb WHERE title->>'fa' = 'محاسبات عددی — الکتریسیته و مغناطیس';

-- Biology: آموزش مفهوم / تصویر و توضیح / سوالات و مرور
UPDATE course_episode SET title = title || '{"en":"Concept Teaching — Cell & Genetics","ps":"د مفهوم درس — حجره او جینیتیک"}'::jsonb WHERE title->>'fa' = 'آموزش مفهوم — سلول و ژنتیک';
UPDATE course_episode SET title = title || '{"en":"Illustration & Explanation — Cell & Genetics","ps":"انځور او تشریح — حجره او جینیتیک"}'::jsonb WHERE title->>'fa' = 'تصویر و توضیح — سلول و ژنتیک';
UPDATE course_episode SET title = title || '{"en":"Questions & Review — Cell & Genetics","ps":"پوښتنې او بیاکتنه — حجره او جینیتیک"}'::jsonb WHERE title->>'fa' = 'سوالات و مرور — سلول و ژنتیک';
UPDATE course_episode SET title = title || '{"en":"Concept Teaching — Human Body Systems","ps":"د مفهوم درس — د انسان د بدن سیسټمونه"}'::jsonb WHERE title->>'fa' = 'آموزش مفهوم — دستگاه‌های بدن انسان';
UPDATE course_episode SET title = title || '{"en":"Illustration & Explanation — Human Body Systems","ps":"انځور او تشریح — د انسان د بدن سیسټمونه"}'::jsonb WHERE title->>'fa' = 'تصویر و توضیح — دستگاه‌های بدن انسان';
UPDATE course_episode SET title = title || '{"en":"Questions & Review — Human Body Systems","ps":"پوښتنې او بیاکتنه — د انسان د بدن سیسټمونه"}'::jsonb WHERE title->>'fa' = 'سوالات و مرور — دستگاه‌های بدن انسان';
UPDATE course_episode SET title = title || '{"en":"Concept Teaching — Organisms & Evolution","ps":"د مفهوم درس — ژوندي موجودات او تکامل"}'::jsonb WHERE title->>'fa' = 'آموزش مفهوم — جانداران و تکامل';
UPDATE course_episode SET title = title || '{"en":"Illustration & Explanation — Organisms & Evolution","ps":"انځور او تشریح — ژوندي موجودات او تکامل"}'::jsonb WHERE title->>'fa' = 'تصویر و توضیح — جانداران و تکامل';
UPDATE course_episode SET title = title || '{"en":"Questions & Review — Organisms & Evolution","ps":"پوښتنې او بیاکتنه — ژوندي موجودات او تکامل"}'::jsonb WHERE title->>'fa' = 'سوالات و مرور — جانداران و تکامل';
UPDATE course_episode SET title = title || '{"en":"Concept Teaching — Ecology & Environment","ps":"د مفهوم درس — اکولوژي او چاپیریال"}'::jsonb WHERE title->>'fa' = 'آموزش مفهوم — اکولوژی و محیط';
UPDATE course_episode SET title = title || '{"en":"Illustration & Explanation — Ecology & Environment","ps":"انځور او تشریح — اکولوژي او چاپیریال"}'::jsonb WHERE title->>'fa' = 'تصویر و توضیح — اکولوژی و محیط';
UPDATE course_episode SET title = title || '{"en":"Questions & Review — Ecology & Environment","ps":"پوښتنې او بیاکتنه — اکولوژي او چاپیریال"}'::jsonb WHERE title->>'fa' = 'سوالات و مرور — اکولوژی و محیط';

-- Natural Sciences: معرفی موضوع / آزمایش و مشاهده / مرور و نتیجه‌گیری
UPDATE course_episode SET title = title || '{"en":"Topic Introduction — Living Organisms & Environment","ps":"د موضوع معرفي — ژوندي موجودات او چاپیریال"}'::jsonb WHERE title->>'fa' = 'معرفی موضوع — جانداران و محیط‌زیست';
UPDATE course_episode SET title = title || '{"en":"Experiment & Observation — Living Organisms & Environment","ps":"آزمایش او مشاهده — ژوندي موجودات او چاپیریال"}'::jsonb WHERE title->>'fa' = 'آزمایش و مشاهده — جانداران و محیط‌زیست';
UPDATE course_episode SET title = title || '{"en":"Review & Conclusion — Living Organisms & Environment","ps":"بیاکتنه او پایله — ژوندي موجودات او چاپیریال"}'::jsonb WHERE title->>'fa' = 'مرور و نتیجه‌گیری — جانداران و محیط‌زیست';
UPDATE course_episode SET title = title || '{"en":"Topic Introduction — Matter & Energy","ps":"د موضوع معرفي — مادې او انرژي"}'::jsonb WHERE title->>'fa' = 'معرفی موضوع — مواد و انرژی';
UPDATE course_episode SET title = title || '{"en":"Experiment & Observation — Matter & Energy","ps":"آزمایش او مشاهده — مادې او انرژي"}'::jsonb WHERE title->>'fa' = 'آزمایش و مشاهده — مواد و انرژی';
UPDATE course_episode SET title = title || '{"en":"Review & Conclusion — Matter & Energy","ps":"بیاکتنه او پایله — مادې او انرژي"}'::jsonb WHERE title->>'fa' = 'مرور و نتیجه‌گیری — مواد و انرژی';
UPDATE course_episode SET title = title || '{"en":"Topic Introduction — Earth & Space","ps":"د موضوع معرفي — ځمکه او فضا"}'::jsonb WHERE title->>'fa' = 'معرفی موضوع — زمین و فضا';
UPDATE course_episode SET title = title || '{"en":"Experiment & Observation — Earth & Space","ps":"آزمایش او مشاهده — ځمکه او فضا"}'::jsonb WHERE title->>'fa' = 'آزمایش و مشاهده — زمین و فضا';
UPDATE course_episode SET title = title || '{"en":"Review & Conclusion — Earth & Space","ps":"بیاکتنه او پایله — ځمکه او فضا"}'::jsonb WHERE title->>'fa' = 'مرور و نتیجه‌گیری — زمین و فضا';
UPDATE course_episode SET title = title || '{"en":"Topic Introduction — Human Body","ps":"د موضوع معرفي — د انسان بدن"}'::jsonb WHERE title->>'fa' = 'معرفی موضوع — بدن انسان';
UPDATE course_episode SET title = title || '{"en":"Experiment & Observation — Human Body","ps":"آزمایش او مشاهده — د انسان بدن"}'::jsonb WHERE title->>'fa' = 'آزمایش و مشاهده — بدن انسان';
UPDATE course_episode SET title = title || '{"en":"Review & Conclusion — Human Body","ps":"بیاکتنه او پایله — د انسان بدن"}'::jsonb WHERE title->>'fa' = 'مرور و نتیجه‌گیری — بدن انسان';

-- Quran & Religion: آموزش تئوری / تمرین تلاوت / مرور و حفظ
UPDATE course_episode SET title = title || '{"en":"Theoretical Teaching — Quran & Tajweed","ps":"نظري تدریس — قرآن او تجوید"}'::jsonb WHERE title->>'fa' = 'آموزش تئوری — قرآن و تجوید';
UPDATE course_episode SET title = title || '{"en":"Recitation Practice — Quran & Tajweed","ps":"د تلاوت تمرین — قرآن او تجوید"}'::jsonb WHERE title->>'fa' = 'تمرین تلاوت — قرآن و تجوید';
UPDATE course_episode SET title = title || '{"en":"Review & Memorization — Quran & Tajweed","ps":"بیاکتنه او حفظ — قرآن او تجوید"}'::jsonb WHERE title->>'fa' = 'مرور و حفظ — قرآن و تجوید';
UPDATE course_episode SET title = title || '{"en":"Theoretical Teaching — Islamic Beliefs","ps":"نظري تدریس — اسلامي عقیدې"}'::jsonb WHERE title->>'fa' = 'آموزش تئوری — عقاید اسلامی';
UPDATE course_episode SET title = title || '{"en":"Recitation Practice — Islamic Beliefs","ps":"د تلاوت تمرین — اسلامي عقیدې"}'::jsonb WHERE title->>'fa' = 'تمرین تلاوت — عقاید اسلامی';
UPDATE course_episode SET title = title || '{"en":"Review & Memorization — Islamic Beliefs","ps":"بیاکتنه او حفظ — اسلامي عقیدې"}'::jsonb WHERE title->>'fa' = 'مرور و حفظ — عقاید اسلامی';
UPDATE course_episode SET title = title || '{"en":"Theoretical Teaching — Islamic Jurisprudence & Rulings","ps":"نظري تدریس — فقه او احکام"}'::jsonb WHERE title->>'fa' = 'آموزش تئوری — فقه و احکام';
UPDATE course_episode SET title = title || '{"en":"Recitation Practice — Islamic Jurisprudence & Rulings","ps":"د تلاوت تمرین — فقه او احکام"}'::jsonb WHERE title->>'fa' = 'تمرین تلاوت — فقه و احکام';
UPDATE course_episode SET title = title || '{"en":"Review & Memorization — Islamic Jurisprudence & Rulings","ps":"بیاکتنه او حفظ — فقه او احکام"}'::jsonb WHERE title->>'fa' = 'مرور و حفظ — فقه و احکام';
UPDATE course_episode SET title = title || '{"en":"Theoretical Teaching — Islamic Ethics","ps":"نظري تدریس — اسلامي اخلاق"}'::jsonb WHERE title->>'fa' = 'آموزش تئوری — اخلاق اسلامی';
UPDATE course_episode SET title = title || '{"en":"Recitation Practice — Islamic Ethics","ps":"د تلاوت تمرین — اسلامي اخلاق"}'::jsonb WHERE title->>'fa' = 'تمرین تلاوت — اخلاق اسلامی';
UPDATE course_episode SET title = title || '{"en":"Review & Memorization — Islamic Ethics","ps":"بیاکتنه او حفظ — اسلامي اخلاق"}'::jsonb WHERE title->>'fa' = 'مرور و حفظ — اخلاق اسلامی';

-- Social Studies: آشنایی اولیه / بحث و گفتگو / مرور و ارزیابی
UPDATE course_episode SET title = title || '{"en":"Initial Introduction — Society & Family","ps":"لومړنۍ اشنایي — ټولنه او کورنۍ"}'::jsonb WHERE title->>'fa' = 'آشنایی اولیه — جامعه و خانواده';
UPDATE course_episode SET title = title || '{"en":"Discussion & Dialogue — Society & Family","ps":"بحث او خبرې اترې — ټولنه او کورنۍ"}'::jsonb WHERE title->>'fa' = 'بحث و گفتگو — جامعه و خانواده';
UPDATE course_episode SET title = title || '{"en":"Review & Evaluation — Society & Family","ps":"بیاکتنه او ارزونه — ټولنه او کورنۍ"}'::jsonb WHERE title->>'fa' = 'مرور و ارزیابی — جامعه و خانواده';
UPDATE course_episode SET title = title || '{"en":"Initial Introduction — Geography of Afghanistan","ps":"لومړنۍ اشنایي — د افغانستان جغرافیه"}'::jsonb WHERE title->>'fa' = 'آشنایی اولیه — جغرافیای افغانستان';
UPDATE course_episode SET title = title || '{"en":"Discussion & Dialogue — Geography of Afghanistan","ps":"بحث او خبرې اترې — د افغانستان جغرافیه"}'::jsonb WHERE title->>'fa' = 'بحث و گفتگو — جغرافیای افغانستان';
UPDATE course_episode SET title = title || '{"en":"Review & Evaluation — Geography of Afghanistan","ps":"بیاکتنه او ارزونه — د افغانستان جغرافیه"}'::jsonb WHERE title->>'fa' = 'مرور و ارزیابی — جغرافیای افغانستان';
UPDATE course_episode SET title = title || '{"en":"Initial Introduction — National History","ps":"لومړنۍ اشنایي — ملي تاریخ"}'::jsonb WHERE title->>'fa' = 'آشنایی اولیه — تاریخ ملی';
UPDATE course_episode SET title = title || '{"en":"Discussion & Dialogue — National History","ps":"بحث او خبرې اترې — ملي تاریخ"}'::jsonb WHERE title->>'fa' = 'بحث و گفتگو — تاریخ ملی';
UPDATE course_episode SET title = title || '{"en":"Review & Evaluation — National History","ps":"بیاکتنه او ارزونه — ملي تاریخ"}'::jsonb WHERE title->>'fa' = 'مرور و ارزیابی — تاریخ ملی';
UPDATE course_episode SET title = title || '{"en":"Initial Introduction — Rights & Law","ps":"لومړنۍ اشنایي — حقوق او قانون"}'::jsonb WHERE title->>'fa' = 'آشنایی اولیه — حقوق و قانون';
UPDATE course_episode SET title = title || '{"en":"Discussion & Dialogue — Rights & Law","ps":"بحث او خبرې اترې — حقوق او قانون"}'::jsonb WHERE title->>'fa' = 'بحث و گفتگو — حقوق و قانون';
UPDATE course_episode SET title = title || '{"en":"Review & Evaluation — Rights & Law","ps":"بیاکتنه او ارزونه — حقوق او قانون"}'::jsonb WHERE title->>'fa' = 'مرور و ارزیابی — حقوق و قانون';

-- History: روایت تاریخی / شخصیت‌های مهم / سوالات تحلیلی
UPDATE course_episode SET title = title || '{"en":"Historical Narrative — Ancient Period","ps":"تاریخي روایت — لرغوني دوره"}'::jsonb WHERE title->>'fa' = 'روایت تاریخی — دوره باستان';
UPDATE course_episode SET title = title || '{"en":"Key Figures — Ancient Period","ps":"مهم شخصیتونه — لرغوني دوره"}'::jsonb WHERE title->>'fa' = 'شخصیت‌های مهم — دوره باستان';
UPDATE course_episode SET title = title || '{"en":"Analytical Questions — Ancient Period","ps":"تحلیلي پوښتنې — لرغوني دوره"}'::jsonb WHERE title->>'fa' = 'سوالات تحلیلی — دوره باستان';
UPDATE course_episode SET title = title || '{"en":"Historical Narrative — Islamic Period","ps":"تاریخي روایت — اسلامي دوره"}'::jsonb WHERE title->>'fa' = 'روایت تاریخی — دوره اسلامی';
UPDATE course_episode SET title = title || '{"en":"Key Figures — Islamic Period","ps":"مهم شخصیتونه — اسلامي دوره"}'::jsonb WHERE title->>'fa' = 'شخصیت‌های مهم — دوره اسلامی';
UPDATE course_episode SET title = title || '{"en":"Analytical Questions — Islamic Period","ps":"تحلیلي پوښتنې — اسلامي دوره"}'::jsonb WHERE title->>'fa' = 'سوالات تحلیلی — دوره اسلامی';
UPDATE course_episode SET title = title || '{"en":"Historical Narrative — Contemporary Period","ps":"تاریخي روایت — معاصره دوره"}'::jsonb WHERE title->>'fa' = 'روایت تاریخی — دوره معاصر';
UPDATE course_episode SET title = title || '{"en":"Key Figures — Contemporary Period","ps":"مهم شخصیتونه — معاصره دوره"}'::jsonb WHERE title->>'fa' = 'شخصیت‌های مهم — دوره معاصر';
UPDATE course_episode SET title = title || '{"en":"Analytical Questions — Contemporary Period","ps":"تحلیلي پوښتنې — معاصره دوره"}'::jsonb WHERE title->>'fa' = 'سوالات تحلیلی — دوره معاصر';
UPDATE course_episode SET title = title || '{"en":"Historical Narrative — Analysis of Events","ps":"تاریخي روایت — پیښو تحلیل"}'::jsonb WHERE title->>'fa' = 'روایت تاریخی — تحلیل رویدادها';
UPDATE course_episode SET title = title || '{"en":"Key Figures — Analysis of Events","ps":"مهم شخصیتونه — پیښو تحلیل"}'::jsonb WHERE title->>'fa' = 'شخصیت‌های مهم — تحلیل رویدادها';
UPDATE course_episode SET title = title || '{"en":"Analytical Questions — Analysis of Events","ps":"تحلیلي پوښتنې — پیښو تحلیل"}'::jsonb WHERE title->>'fa' = 'سوالات تحلیلی — تحلیل رویدادها';

-- Geography: توضیح پدیده / مطالعه نقشه / تمرین و ارزیابی
UPDATE course_episode SET title = title || '{"en":"Phenomenon Explanation — Physical Geography","ps":"د پدیدې تشریح — طبیعي جغرافیه"}'::jsonb WHERE title->>'fa' = 'توضیح پدیده — جغرافیای طبیعی';
UPDATE course_episode SET title = title || '{"en":"Map Study — Physical Geography","ps":"د نقشې مطالعه — طبیعي جغرافیه"}'::jsonb WHERE title->>'fa' = 'مطالعه نقشه — جغرافیای طبیعی';
UPDATE course_episode SET title = title || '{"en":"Practice & Evaluation — Physical Geography","ps":"تمرین او ارزونه — طبیعي جغرافیه"}'::jsonb WHERE title->>'fa' = 'تمرین و ارزیابی — جغرافیای طبیعی';
UPDATE course_episode SET title = title || '{"en":"Phenomenon Explanation — Human Geography","ps":"د پدیدې تشریح — انساني جغرافیه"}'::jsonb WHERE title->>'fa' = 'توضیح پدیده — جغرافیای انسانی';
UPDATE course_episode SET title = title || '{"en":"Map Study — Human Geography","ps":"د نقشې مطالعه — انساني جغرافیه"}'::jsonb WHERE title->>'fa' = 'مطالعه نقشه — جغرافیای انسانی';
UPDATE course_episode SET title = title || '{"en":"Practice & Evaluation — Human Geography","ps":"تمرین او ارزونه — انساني جغرافیه"}'::jsonb WHERE title->>'fa' = 'تمرین و ارزیابی — جغرافیای انسانی';
UPDATE course_episode SET title = title || '{"en":"Phenomenon Explanation — Natural Resources","ps":"د پدیدې تشریح — طبیعي سرچینې"}'::jsonb WHERE title->>'fa' = 'توضیح پدیده — منابع طبیعی';
UPDATE course_episode SET title = title || '{"en":"Map Study — Natural Resources","ps":"د نقشې مطالعه — طبیعي سرچینې"}'::jsonb WHERE title->>'fa' = 'مطالعه نقشه — منابع طبیعی';
UPDATE course_episode SET title = title || '{"en":"Practice & Evaluation — Natural Resources","ps":"تمرین او ارزونه — طبیعي سرچینې"}'::jsonb WHERE title->>'fa' = 'تمرین و ارزیابی — منابع طبیعی';
UPDATE course_episode SET title = title || '{"en":"Phenomenon Explanation — Political Geography","ps":"د پدیدې تشریح — سیاسي جغرافیه"}'::jsonb WHERE title->>'fa' = 'توضیح پدیده — جغرافیای سیاسی';
UPDATE course_episode SET title = title || '{"en":"Map Study — Political Geography","ps":"د نقشې مطالعه — سیاسي جغرافیه"}'::jsonb WHERE title->>'fa' = 'مطالعه نقشه — جغرافیای سیاسی';
UPDATE course_episode SET title = title || '{"en":"Practice & Evaluation — Political Geography","ps":"تمرین او ارزونه — سیاسي جغرافیه"}'::jsonb WHERE title->>'fa' = 'تمرین و ارزیابی — جغرافیای سیاسی';

-- English chapters (fa field is already English; add en=same + ps translation)
UPDATE course_episode SET title = title || '{"en":"Lesson Introduction — Vocabulary & Pronunciation","ps":"د درس پیژندنه — لغات او تلفظ"}'::jsonb WHERE title->>'fa' = 'Lesson Introduction — Vocabulary & Pronunciation';
UPDATE course_episode SET title = title || '{"en":"Practice & Examples — Vocabulary & Pronunciation","ps":"تمرین او مثالونه — لغات او تلفظ"}'::jsonb WHERE title->>'fa' = 'Practice & Examples — Vocabulary & Pronunciation';
UPDATE course_episode SET title = title || '{"en":"Review & Assessment — Vocabulary & Pronunciation","ps":"بیاکتنه او ارزونه — لغات او تلفظ"}'::jsonb WHERE title->>'fa' = 'Review & Assessment — Vocabulary & Pronunciation';
UPDATE course_episode SET title = title || '{"en":"Lesson Introduction — Grammar Essentials","ps":"د درس پیژندنه — لازمي ګرامر"}'::jsonb WHERE title->>'fa' = 'Lesson Introduction — Grammar Essentials';
UPDATE course_episode SET title = title || '{"en":"Practice & Examples — Grammar Essentials","ps":"تمرین او مثالونه — لازمي ګرامر"}'::jsonb WHERE title->>'fa' = 'Practice & Examples — Grammar Essentials';
UPDATE course_episode SET title = title || '{"en":"Review & Assessment — Grammar Essentials","ps":"بیاکتنه او ارزونه — لازمي ګرامر"}'::jsonb WHERE title->>'fa' = 'Review & Assessment — Grammar Essentials';
UPDATE course_episode SET title = title || '{"en":"Lesson Introduction — Reading Comprehension","ps":"د درس پیژندنه — د لوستلو پوهاوی"}'::jsonb WHERE title->>'fa' = 'Lesson Introduction — Reading Comprehension';
UPDATE course_episode SET title = title || '{"en":"Practice & Examples — Reading Comprehension","ps":"تمرین او مثالونه — د لوستلو پوهاوی"}'::jsonb WHERE title->>'fa' = 'Practice & Examples — Reading Comprehension';
UPDATE course_episode SET title = title || '{"en":"Review & Assessment — Reading Comprehension","ps":"بیاکتنه او ارزونه — د لوستلو پوهاوی"}'::jsonb WHERE title->>'fa' = 'Review & Assessment — Reading Comprehension';
UPDATE course_episode SET title = title || '{"en":"Lesson Introduction — Writing Skills","ps":"د درس پیژندنه — لیکلو مهارتونه"}'::jsonb WHERE title->>'fa' = 'Lesson Introduction — Writing Skills';
UPDATE course_episode SET title = title || '{"en":"Practice & Examples — Writing Skills","ps":"تمرین او مثالونه — لیکلو مهارتونه"}'::jsonb WHERE title->>'fa' = 'Practice & Examples — Writing Skills';
UPDATE course_episode SET title = title || '{"en":"Review & Assessment — Writing Skills","ps":"بیاکتنه او ارزونه — لیکلو مهارتونه"}'::jsonb WHERE title->>'fa' = 'Review & Assessment — Writing Skills';

COMMIT;
