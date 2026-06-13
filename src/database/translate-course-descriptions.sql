BEGIN;

-- Dari Language Elementary (grades 1-6)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This Dari language course is designed for elementary school students based on the Afghan Ministry of Education curriculum. Students become familiar with Dari grammar fundamentals, reading and writing skills, comprehension of simple texts, and elementary literature. Each lesson includes concept explanations, practical examples, and applied exercises to make learning easier.',
  'ps', 'دا دري ژبې کورس د افغانستان د معارف وزارت د درسي نصاب پر بنسټ د لومړني زده کوونکو لپاره ډیزاین شوی دی. زده کوونکي د دري ژبې د ګرامر اصولو، د لوستلو او لیکلو مهارتونو، د ساده متونو د پوهیدو، او د لومړني ادب سره آشنا کیږي. هر درس مفهوم توضیحات، عملي مثالونه، او کاربردي تمرینونه لري چې زده کړه اسانوي.'
) WHERE description->>'fa' LIKE '%زبان دری%ابتدایی%';

-- Dari Language Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This Dari language course is designed for lower secondary school students (grades 7–9). Topics include advanced grammar, analysis of classical literary texts, various writing styles, and introduction to great Dari poets. This course provides a solid foundation for moving into upper secondary school.',
  'ps', 'دا دري ژبې کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. موضوعات پکې پرمختللی ګرامر، د کلاسیک ادبي متونو تحلیل، د لیکلو ډول ډول ډولونه، او د لوی دري شاعرانو سره آشنایي شامله ده. دا کورس د لوړو منځنیو ښوونځیو ته د تلو لپاره محکم بنسټ برابروي.'
) WHERE description->>'fa' LIKE '%زبان دری%متوسطه اول%';

-- Dari Language Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This Dari language course is designed for upper secondary students (grades 10–12) and university entrance exam preparation. It covers deep literary topics, poetry and prose criticism, stylistics, history of Dari and Pashto literature, and academic writing skills. After completing this course, you will be fully prepared for the university entrance exam.',
  'ps', 'دا دري ژبې کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره ډیزاین شوی دی. ژورې ادبي موضوعات، د شعر او نثر نقد، سبک پیژندنه، د دري او پښتو ادبیاتو تاریخ، او اکاډمیک لیکنه پوښي. د دې کورس د بشپړولو وروسته به د کانکور امتحان لپاره بشپړه آمادګي ولرئ.'
) WHERE description->>'fa' LIKE '%زبان دری%متوسطه دوم (پایه ۱۰%';

-- Mathematics Elementary
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This mathematics course is designed for elementary school students. Basic concepts ranging from simple addition and subtraction to fractions, percentages, and elementary geometry are taught step by step. The teaching method focuses on solving real-life problems so students understand the connection between mathematics and daily life.',
  'ps', 'دا ریاضي کورس د لومړني ښوونځي زده کوونکو لپاره ډیزاین شوی دی. د ساده جمع او تفریق نه تر کسرونو، سلنو، او لومړني هندسې پورې بنسټیزه مفاهیم ګام پر ګام ښودل کیږي. د تدریس میتود د واقعي ژوند مسایلو حلولو ته تمرکز کوي ترڅو زده کوونکي د ریاضي او ورځني ژوند ترمنځ اړیکه وپیژني.'
) WHERE description->>'fa' LIKE '%ریاضی%ابتدایی%';

-- Mathematics Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This mathematics course is designed for lower secondary students (grades 7–9). Topics include integers, algebraic expressions, linear equations, plane geometry, powers and roots, introductory trigonometry, and statistics. Challenging problem-solving and various solution methods are covered throughout this course.',
  'ps', 'دا ریاضي کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. موضوعات پکې صحیح اعداد، الجبري عبارتونه، خطي معادلې، مسطح هندسه، ځواکونه او ریښې، لومړني مثلثات، او احصایه شامله ده. ستونزمنو مسایلو حلولو او مختلفو حل لارو پوښي.'
) WHERE description->>'fa' LIKE '%ریاضی%متوسطه اول%';

-- Mathematics Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This advanced mathematics course is for upper secondary students (grades 10–12) and university entrance exam preparation. Topics include differential calculus, integrals, matrices, complex numbers, advanced functions, and probability. This course prepares students for engineering, medicine, and natural science programs.',
  'ps', 'دا پرمختللی ریاضي کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره دی. موضوعات پکې دیفرانسیل حساب، انتگرال، ماتریس، مختلط اعداد، پرمختللي دندې، او احتمال شامله ده. دا کورس زده کوونکي د انجنیري، طب، او طبیعي علومو برنامو لپاره چمتو کوي.'
) WHERE description->>'fa' LIKE '%ریاضی%متوسطه دوم%';

-- Natural Sciences Elementary
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This natural sciences course is designed for elementary school students. Students become familiar with their surroundings, plants, animals, the human body, weather, and natural phenomena. Teaching is conducted through observation, simple experiments, and class discussions to strengthen students'' scientific curiosity.',
  'ps', 'دا د طبیعي علومو کورس د لومړني ښوونځي زده کوونکو لپاره ډیزاین شوی دی. زده کوونکي د خپل چاپیریال، نباتاتو، حیواناتو، د بشر بدن، هوا او اقلیم، او طبیعي پدیدو سره آشنا کیږي. تدریس د مشاهدې، ساده آزمایښتونو، او د ټولګي بحثونو له لارې ترسره کیږي ترڅو د زده کوونکو علمي کنجکاوي پیاوړې شي.'
) WHERE description->>'fa' LIKE '%علوم طبیعی%ابتدایی%';

-- Physics Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This physics course is designed for lower secondary students (grades 7–9). Concepts of measurement, force, pressure, heat, sound, light, magnetism, and electricity are explained with simple experiments. Each lesson includes proof of physical laws through experiments that can be done at home.',
  'ps', 'دا فیزیک کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. د اندازه ګیرۍ، ځواک، فشار، تودوخه، غږ، رڼا، مقناطیس، او برښنا مفاهیم د ساده آزمایښتونو سره توضیح کیږي. هر درس د فیزیکي قوانینو د اثبات آزمایښتونه لري چې کور کې کیدای شي.'
) WHERE description->>'fa' LIKE '%فیزیک%متوسطه اول%';

-- Physics Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This advanced physics course is for upper secondary students (grades 10–12) and university entrance exam preparation. Classical mechanics, Newton''s laws, thermodynamics, electromagnetism, waves, optics, and modern physics are fully covered. After completing this course you will be fully prepared for engineering and natural science programs.',
  'ps', 'دا پرمختللی فیزیک کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره دی. کلاسیک مکانیک، د نیوټن قوانین، ترموداینامیک، الکترومقناطیس، موجونه، اوپتیک، او مدرن فیزیک بشپړ پوښل کیږي. د دې کورس د بشپړولو وروسته به د انجنیري او طبیعي علومو لپاره بشپړه آمادګي ولرئ.'
) WHERE description->>'fa' LIKE '%فیزیک%متوسطه دوم%';

-- Chemistry Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This chemistry course is designed for lower secondary students (grades 7–9). Topics range from the structure of matter, atoms, the periodic table, and chemical bonding to acid-base reactions. Safe experiments that can be done at home are included in each chapter.',
  'ps', 'دا کیمیا کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. موضوعات د مواد جوړښت، اتوم، د دورې جدول، او کیمیاوي پیوند نه تر اسید-قلیا واکنشونو پورې رسیږي. د هر فصل کې خوندي آزمایښتونه شامل دي چې کور کې کیدای شي.'
) WHERE description->>'fa' LIKE '%کیمیا%متوسطه اول%';

-- Chemistry Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This advanced chemistry course is for upper secondary students (grades 10–12) and university entrance exam preparation. Atomic structure, chemical thermodynamics, reaction rates, organic chemistry, polymers, and basic biochemistry are covered. This course is essential for entering medicine, pharmacy, and chemical engineering programs.',
  'ps', 'دا پرمختللی کیمیا کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره دی. د اتوم جوړښت، کیمیاوي ترموداینامیک، د واکنش سرعت، آلي کیمیا، پالیمرونه، او لومړني بایوکیمیا پوښل کیږي. دا کورس د طب، دوا، او کیمیاوي انجنیري برنامو ته د ورتګ لپاره اړین دی.'
) WHERE description->>'fa' LIKE '%کیمیا%متوسطه دوم%';

-- Biology Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This biology course is designed for lower secondary students (grades 7–9). From cells and their structure to body systems, reproduction, heredity, and ecology — all taught in simple language with helpful illustrations. Awareness of the human body and the surrounding nature is one of the main goals of this course.',
  'ps', 'دا بیولوژي کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. له حجرو او د دوی جوړښت نه تر بدن سیسټمونو، تولیدمثل، وراثت، او اکولوژۍ پورې — ټول د ساده ژبې او مرستیالو انځورونو سره ښودل کیږي. د بشر د بدن او د چاپیریال طبیعت پوهیدل د دې کورس د اصلي موخو یوه ده.'
) WHERE description->>'fa' LIKE '%بیولوژی%متوسطه اول%';

-- Biology Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This advanced biology course is for upper secondary students (grades 10–12) and university entrance exam preparation for medicine. Molecular genetics, DNA, genetic engineering, Darwin''s evolution, advanced physiology, microbiology, and biochemistry are covered. This course provides the necessary scientific foundation for entering medicine, dentistry, and biological science programs.',
  'ps', 'دا پرمختللی بیولوژي کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د طب د کانکور آمادګۍ لپاره دی. ملیکولي جینیتیک، DNA، جینیتیک انجنیري، د ډارون تکامل، پرمختللی فیزیولوژي، مایکروبیولوژي، او بایوکیمیا پوښل کیږي. دا کورس د طب، دندان پزشکي، او بیولوژیکي علومو برنامو ته د ورتګ لازمي علمي بنسټ برابروي.'
) WHERE description->>'fa' LIKE '%بیولوژی%متوسطه دوم%';

-- History Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This history course is designed for lower secondary students (grades 7–9). The history of Afghanistan from ancient times, Aryana and Khorasan, the Islamic period, the Ghaznavids and Timurids through the modern era is covered. The goal of this course is to familiarize students with the national identity and rich history of Afghanistan.',
  'ps', 'دا تاریخ کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. د افغانستان تاریخ د لرغوني دور، آریانا او خراسان، اسلامي دور، غزنویان، تیموریانو نه تر معاصر دور پورې پوښل کیږي. د دې کورس موخه د زده کوونکو د ملي هویت او د افغانستان د غني تاریخ سره آشنا کول دي.'
) WHERE description->>'fa' LIKE '%تاریخ%متوسطه اول%';

-- History Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This history course is for upper secondary students (grades 10–12) and university entrance exam preparation. Contemporary Afghan history, 20th-century developments, World Wars, the Cold War and their effects on Afghanistan are taught. Critical analysis of historical events and historical research methods are features of this course.',
  'ps', 'دا تاریخ کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره دی. د افغانستان معاصر تاریخ، د شلمې پیړۍ پرمختیاوې، نړیوالې جګړې، سړه جګړه او د افغانستان پر وخت د دوی اغیزې ښودل کیږي. د تاریخي پیښو انتقادي تحلیل او د تاریخي تحقیق میتودونه د دې کورس ځانګړتیاوې دي.'
) WHERE description->>'fa' LIKE '%تاریخ%متوسطه دوم%';

-- Geography Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This geography course is designed for lower secondary students (grades 7–9). The physical and human geography of Afghanistan, all 34 provinces, rivers, mountains, climate, and natural resources are taught in detail. Map reading and understanding the geography of the Central Asian region are also part of this course.',
  'ps', 'دا جغرافیه کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. د افغانستان طبیعي او انساني جغرافیه، ۳۴ ولایتونه، سیندونه، غرونه، هوا او اقلیم، او طبیعي سرچینې په تفصیل سره ښودل کیږي. د نقشې لوستل او د منځنۍ اسیا سیمې جغرافیه پوهیدل هم د دې کورس برخه ده.'
) WHERE description->>'fa' LIKE '%جغرافیه%متوسطه اول%';

-- Geography Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This advanced geography course is for upper secondary students (grades 10–12) and university entrance exam preparation. Continental geography, global climate, environmental problems, political geography, and international organizations are covered. This course gives students a deep understanding of today''s world and geographical issues.',
  'ps', 'دا پرمختللی جغرافیه کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره دی. د قارو جغرافیه، نړیواله هوا، چاپیریالي ستونزې، سیاسي جغرافیه، او نړیوالې سازمانونه پوښل کیږي. دا کورس زده کوونکو ته د نن ورځ نړۍ او جغرافیاوي مسایلو ژوره پوهه ورکوي.'
) WHERE description->>'fa' LIKE '%جغرافیه%متوسطه دوم%';

-- Social Studies Elementary (grades 4-6)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This social studies course is designed for elementary students (grades 4–6). Students become familiar with society, family, social institutions, the geography of Afghanistan, national history, and the culture of the country. The goal is to nurture informed and responsible citizens for Afghan society.',
  'ps', 'دا اجتماعي کورس د لومړني ښوونځي زده کوونکو (۴-۶ ټولګی) لپاره ډیزاین شوی دی. زده کوونکي د ټولنې، کورنۍ، ټولنیزو بنسټونو، د افغانستان جغرافیې، ملي تاریخ، او د هیواد کلتور سره آشنا کیږي. موخه د افغان ټولنې لپاره د خبر او مسئولیت لرونکي شهروند روزل دي.'
) WHERE description->>'fa' LIKE '%اجتماعی%ابتدایی%';

-- Quran and Religion Elementary
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This Quran and religion course is designed for elementary school students. Correct recitation of the Holy Quran, Tajweed rules, Islamic beliefs, acts of worship, and Islamic ethics are comprehensively covered. The goal is to nurture Islamic values and proper religious upbringing in students.',
  'ps', 'دا قرآن او دیانت کورس د لومړني ښوونځي زده کوونکو لپاره ډیزاین شوی دی. د قرآن کریم سم تلاوت، د تجوید قواعد، اسلامي عقیدې، د عبادت احکام، او اسلامي اخلاق جامع پوښل کیږي. موخه د زده کوونکو کې د اسلامي ارزښتونو روزل او سم دیني تربیه ده.'
) WHERE description->>'fa' LIKE '%قرآن%';

-- English Intermediate (grades 7-9)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This English language course is designed for lower secondary students (grades 7–9). From the alphabet and basic vocabulary to grammar, everyday conversation, reading, and basic writing — all taught step by step. The communicative teaching method uses real conversation practice and comprehension of simple English texts.',
  'ps', 'دا انګلیسي ژبې کورس د لومړني منځني ښوونځي زده کوونکو (۷-۹ ټولګی) لپاره ډیزاین شوی دی. له الفبا او بنسټیزو واژه ګانو نه تر ګرامر، ورځني خبرو اترو، لوستلو، او لومړني لیکلو پورې — ټول ګام پر ګام ښودل کیږي. د ارتباطاتو د تدریس میتود د واقعي خبرو اترو تمرین او د ساده انګلیسي متونو درک کاروي.'
) WHERE description->>'fa' LIKE '%انگلیسی%متوسطه اول%';

-- English Advanced (grades 10-12)
UPDATE course SET description = description || jsonb_build_object(
  'en', 'This advanced English language course is for upper secondary students (grades 10–12) and university entrance exam preparation. Advanced grammar, academic writing, comprehension of scientific texts, listening skills, and advanced conversation are covered. This course prepares students for the English university entrance exam and international environments.',
  'ps', 'دا پرمختللی انګلیسي ژبې کورس د لوړو منځنیو ښوونځیو زده کوونکو (۱۰-۱۲ ټولګی) او د کانکور آمادګۍ لپاره دی. پرمختللی ګرامر، اکاډمیک لیکنه، د علمي متونو درک، د اورولو مهارت، او پرمختللي خبرې اترې پوښل کیږي. دا کورس زده کوونکي د انګلیسي کانکور امتحان او نړیوالو چاپیریالونو لپاره چمتو کوي.'
) WHERE description->>'fa' LIKE '%انگلیسی%متوسطه دوم%';

COMMIT;
