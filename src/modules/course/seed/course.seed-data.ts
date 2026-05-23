import { CourseLevel } from '@modules/course/enum/course-level.enum';

const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_VIDEO_2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
const SAMPLE_VIDEO_3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

export interface EpisodeSeedData {
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  isFree: boolean;
  sortOrder: number;
}

export interface ChapterSeedData {
  title: string;
  sortOrder: number;
  episodes: EpisodeSeedData[];
}

export interface CourseSeedData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  previewVideo: string;
  price: number;
  discountPrice: number | null;
  level: CourseLevel;
  categorySlug: string;
  chapters: ChapterSeedData[];
}

export const COURSE_SEED_DATA: CourseSeedData[] = [
  {
    title: 'جاوااسکریپت از صفر تا پیشرفته',
    slug: 'javascript-zero-to-hero',
    shortDescription: 'یادگیری جامع جاوا اسکریپت از مبتدی تا پیشرفته با پروژه‌های عملی',
    description: 'در این دوره جامع، تمام مفاهیم جاوا اسکریپت را از پایه تا سطح پیشرفته یاد می‌گیرید. از متغیرها و توابع تا async/await، Promises و مفاهیم مدرن ES6+.',
    thumbnail: 'https://picsum.photos/seed/javascript/800/450',
    previewVideo: SAMPLE_VIDEO,
    price: 1200000,
    discountPrice: 980000,
    level: CourseLevel.BEGINNER,
    categorySlug: 'javascript',
    chapters: [
      {
        title: 'مقدمات جاوااسکریپت',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی دوره و نصب ابزارها', slug: 'js-intro-tools', description: 'آشنایی با دوره و نصب VS Code و Node.js', videoUrl: SAMPLE_VIDEO, videoDuration: 540, isFree: true, sortOrder: 10 },
          { title: 'متغیرها و انواع داده', slug: 'js-variables-types', description: 'var، let، const و انواع داده در جاوا اسکریپت', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: true, sortOrder: 20 },
          { title: 'عملگرها و عبارات', slug: 'js-operators', description: 'انواع عملگرها در جاوا اسکریپت', videoUrl: SAMPLE_VIDEO, videoDuration: 600, isFree: false, sortOrder: 30 },
          { title: 'ساختارهای شرطی', slug: 'js-conditionals', description: 'if/else، switch و اپراتور ternary', videoUrl: SAMPLE_VIDEO, videoDuration: 660, isFree: false, sortOrder: 40 },
        ],
      },
      {
        title: 'توابع و اسکوپ',
        sortOrder: 20,
        episodes: [
          { title: 'توابع در جاوا اسکریپت', slug: 'js-functions', description: 'تعریف و فراخوانی توابع', videoUrl: SAMPLE_VIDEO_2, videoDuration: 780, isFree: false, sortOrder: 10 },
          { title: 'Arrow Functions', slug: 'js-arrow-functions', description: 'توابع پیکانی و تفاوت با توابع معمولی', videoUrl: SAMPLE_VIDEO_2, videoDuration: 600, isFree: false, sortOrder: 20 },
          { title: 'Closure و اسکوپ', slug: 'js-closure-scope', description: 'مفهوم closure و اسکوپ در جاوا اسکریپت', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'برنامه‌نویسی ناهمزمان',
        sortOrder: 30,
        episodes: [
          { title: 'Callbacks و Event Loop', slug: 'js-callbacks', description: 'درک event loop و callback pattern', videoUrl: SAMPLE_VIDEO_3, videoDuration: 720, isFree: false, sortOrder: 10 },
          { title: 'Promises', slug: 'js-promises', description: 'کار با Promises در جاوا اسکریپت', videoUrl: SAMPLE_VIDEO_3, videoDuration: 780, isFree: false, sortOrder: 20 },
          { title: 'Async/Await', slug: 'js-async-await', description: 'نوشتن کد ناهمزمان با async/await', videoUrl: SAMPLE_VIDEO_3, videoDuration: 840, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'آموزش ری‌اکت جی‌اس',
    slug: 'reactjs-complete-guide',
    shortDescription: 'یادگیری React.js از مبتدی تا ساخت اپلیکیشن‌های حرفه‌ای',
    description: 'در این دوره آموزش کامل React.js را از اصول اولیه تا Hooks، Context API، React Router و مدیریت State با Redux یاد می‌گیرید.',
    thumbnail: 'https://picsum.photos/seed/reactjs/800/450',
    previewVideo: SAMPLE_VIDEO,
    price: 980000,
    discountPrice: null,
    level: CourseLevel.INTERMEDIATE,
    categorySlug: 'react',
    chapters: [
      {
        title: 'آشنایی با React',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی React و نصب محیط', slug: 'react-intro-setup', description: 'نصب Node.js، Create React App و آشنایی با JSX', videoUrl: SAMPLE_VIDEO, videoDuration: 600, isFree: true, sortOrder: 10 },
          { title: 'کامپوننت‌ها و Props', slug: 'react-components-props', description: 'ساخت کامپوننت و ارسال داده با Props', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: true, sortOrder: 20 },
          { title: 'State و رویدادها', slug: 'react-state-events', description: 'مدیریت State و هندل کردن رویدادها', videoUrl: SAMPLE_VIDEO, videoDuration: 780, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'Hooks پیشرفته',
        sortOrder: 20,
        episodes: [
          { title: 'useState و useEffect', slug: 'react-usestate-useeffect', description: 'استفاده از هوک‌های اصلی React', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 10 },
          { title: 'useContext و useReducer', slug: 'react-usecontext-usereducer', description: 'مدیریت State پیچیده با هوک‌ها', videoUrl: SAMPLE_VIDEO_2, videoDuration: 900, isFree: false, sortOrder: 20 },
          { title: 'هوک‌های سفارشی', slug: 'react-custom-hooks', description: 'ساخت Custom Hooks', videoUrl: SAMPLE_VIDEO_2, videoDuration: 660, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'پروژه عملی',
        sortOrder: 30,
        episodes: [
          { title: 'ساخت اپ Todo', slug: 'react-todo-app', description: 'پروژه عملی Todo با React', videoUrl: SAMPLE_VIDEO_3, videoDuration: 1200, isFree: false, sortOrder: 10 },
          { title: 'React Router', slug: 'react-router', description: 'مسیریابی در React با React Router v6', videoUrl: SAMPLE_VIDEO_3, videoDuration: 780, isFree: false, sortOrder: 20 },
        ],
      },
    ],
  },
  {
    title: 'نود جی‌اس و اکسپرس',
    slug: 'nodejs-express-masterclass',
    shortDescription: 'ساخت API‌های حرفه‌ای با Node.js و Express',
    description: 'در این دوره یاد می‌گیرید چطور با Node.js و Express یک API RESTful کامل بسازید. شامل احراز هویت، پایگاه داده و deploy.',
    thumbnail: 'https://picsum.photos/seed/nodejs/800/450',
    previewVideo: SAMPLE_VIDEO_2,
    price: 850000,
    discountPrice: null,
    level: CourseLevel.INTERMEDIATE,
    categorySlug: 'nodejs',
    chapters: [
      {
        title: 'مقدمات Node.js',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی Node.js', slug: 'node-intro', description: 'آشنایی با Node.js و معماری آن', videoUrl: SAMPLE_VIDEO, videoDuration: 540, isFree: true, sortOrder: 10 },
          { title: 'ماژول‌های داخلی', slug: 'node-built-in-modules', description: 'کار با fs، path، http و سایر ماژول‌ها', videoUrl: SAMPLE_VIDEO, videoDuration: 780, isFree: false, sortOrder: 20 },
          { title: 'NPM و مدیریت پکیج', slug: 'node-npm', description: 'کار با NPM و package.json', videoUrl: SAMPLE_VIDEO, videoDuration: 600, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'Express.js',
        sortOrder: 20,
        episodes: [
          { title: 'ساخت اولین سرور', slug: 'express-first-server', description: 'راه‌اندازی اولین سرور با Express', videoUrl: SAMPLE_VIDEO_2, videoDuration: 660, isFree: false, sortOrder: 10 },
          { title: 'Middleware و Router', slug: 'express-middleware-router', description: 'کار با Middleware و تنظیم Routeها', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 20 },
          { title: 'CRUD API', slug: 'express-crud-api', description: 'ساخت API کامل با عملیات CRUD', videoUrl: SAMPLE_VIDEO_2, videoDuration: 1080, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'پایتون برای همه',
    slug: 'python-for-everyone',
    shortDescription: 'یادگیری پایتون از صفر بدون نیاز به دانش قبلی',
    description: 'دوره‌ای کاملاً ساده و جامع برای یادگیری زبان برنامه‌نویسی پایتون. مناسب برای کسانی که هیچ تجربه‌ای در برنامه‌نویسی ندارند.',
    thumbnail: 'https://picsum.photos/seed/python/800/450',
    previewVideo: SAMPLE_VIDEO_3,
    price: 0,
    discountPrice: null,
    level: CourseLevel.BEGINNER,
    categorySlug: 'python',
    chapters: [
      {
        title: 'شروع با پایتون',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی پایتون و نصب', slug: 'python-intro-install', description: 'نصب پایتون و آشنایی با IDLE', videoUrl: SAMPLE_VIDEO, videoDuration: 480, isFree: true, sortOrder: 10 },
          { title: 'متغیرها و ورودی/خروجی', slug: 'python-variables-io', description: 'متغیرها و تابع print و input', videoUrl: SAMPLE_VIDEO, videoDuration: 600, isFree: true, sortOrder: 20 },
          { title: 'شرط‌ها و حلقه‌ها', slug: 'python-conditions-loops', description: 'if/else، for و while در پایتون', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: true, sortOrder: 30 },
        ],
      },
      {
        title: 'ساختارهای داده',
        sortOrder: 20,
        episodes: [
          { title: 'لیست‌ها', slug: 'python-lists', description: 'کار با List در پایتون', videoUrl: SAMPLE_VIDEO_2, videoDuration: 660, isFree: true, sortOrder: 10 },
          { title: 'دیکشنری‌ها', slug: 'python-dicts', description: 'کار با Dictionary در پایتون', videoUrl: SAMPLE_VIDEO_2, videoDuration: 600, isFree: false, sortOrder: 20 },
          { title: 'توابع', slug: 'python-functions', description: 'تعریف و استفاده از توابع', videoUrl: SAMPLE_VIDEO_2, videoDuration: 720, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'فلاتر و دارت برای مبتدی',
    slug: 'flutter-dart-beginner',
    shortDescription: 'ساخت اپلیکیشن موبایل برای iOS و Android با Flutter',
    description: 'در این دوره یاد می‌گیرید چطور با Flutter و Dart اپلیکیشن‌های موبایل زیبا و کارآمد برای iOS و Android بسازید.',
    thumbnail: 'https://picsum.photos/seed/flutter/800/450',
    previewVideo: SAMPLE_VIDEO,
    price: 1100000,
    discountPrice: 890000,
    level: CourseLevel.BEGINNER,
    categorySlug: 'flutter',
    chapters: [
      {
        title: 'شروع با Flutter',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی Flutter و نصب SDK', slug: 'flutter-intro-sdk', description: 'نصب Flutter SDK و راه‌اندازی محیط توسعه', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: true, sortOrder: 10 },
          { title: 'اصول زبان Dart', slug: 'flutter-dart-basics', description: 'متغیرها، توابع و کلاس‌ها در Dart', videoUrl: SAMPLE_VIDEO, videoDuration: 840, isFree: true, sortOrder: 20 },
          { title: 'Widgetهای پایه', slug: 'flutter-basic-widgets', description: 'Text، Container، Row، Column', videoUrl: SAMPLE_VIDEO, videoDuration: 780, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'رابط کاربری',
        sortOrder: 20,
        episodes: [
          { title: 'Layout Widgetها', slug: 'flutter-layout-widgets', description: 'Scaffold، AppBar، ListView', videoUrl: SAMPLE_VIDEO_2, videoDuration: 900, isFree: false, sortOrder: 10 },
          { title: 'State Management', slug: 'flutter-state', description: 'StatefulWidget و setState', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 20 },
          { title: 'Navigation', slug: 'flutter-navigation', description: 'مسیریابی بین صفحات', videoUrl: SAMPLE_VIDEO_2, videoDuration: 660, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'یادگیری ماشین با پایتون',
    slug: 'machine-learning-python',
    shortDescription: 'آموزش جامع Machine Learning با scikit-learn و TensorFlow',
    description: 'دوره کامل یادگیری ماشین از مفاهیم آماری تا پیاده‌سازی مدل‌های پیشرفته با پایتون، scikit-learn و TensorFlow.',
    thumbnail: 'https://picsum.photos/seed/machinelearning/800/450',
    previewVideo: SAMPLE_VIDEO_2,
    price: 1500000,
    discountPrice: 1200000,
    level: CourseLevel.ADVANCED,
    categorySlug: 'machine-learning',
    chapters: [
      {
        title: 'مقدمات یادگیری ماشین',
        sortOrder: 10,
        episodes: [
          { title: 'مفاهیم پایه ML', slug: 'ml-basics-concepts', description: 'Supervised، Unsupervised و Reinforcement Learning', videoUrl: SAMPLE_VIDEO, videoDuration: 840, isFree: true, sortOrder: 10 },
          { title: 'NumPy و Pandas', slug: 'ml-numpy-pandas', description: 'ابزارهای پردازش داده در پایتون', videoUrl: SAMPLE_VIDEO, videoDuration: 960, isFree: false, sortOrder: 20 },
          { title: 'Matplotlib و Seaborn', slug: 'ml-visualization', description: 'نمودارسازی و تجسم داده', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'الگوریتم‌های کلاسیک',
        sortOrder: 20,
        episodes: [
          { title: 'رگرسیون خطی', slug: 'ml-linear-regression', description: 'پیاده‌سازی Linear Regression با scikit-learn', videoUrl: SAMPLE_VIDEO_2, videoDuration: 900, isFree: false, sortOrder: 10 },
          { title: 'Decision Trees', slug: 'ml-decision-trees', description: 'درخت‌های تصمیم‌گیری', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 20 },
          { title: 'شبکه‌های عصبی', slug: 'ml-neural-networks', description: 'ساخت شبکه عصبی با TensorFlow', videoUrl: SAMPLE_VIDEO_2, videoDuration: 1200, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'PostgreSQL پیشرفته',
    slug: 'postgresql-advanced',
    shortDescription: 'تسلط بر PostgreSQL برای توسعه‌دهندگان حرفه‌ای',
    description: 'در این دوره با مفاهیم پیشرفته PostgreSQL از جمله ایندکس‌گذاری، بهینه‌سازی Query، تراکنش‌ها و Stored Procedures آشنا می‌شوید.',
    thumbnail: 'https://picsum.photos/seed/postgresql/800/450',
    previewVideo: SAMPLE_VIDEO_3,
    price: 750000,
    discountPrice: null,
    level: CourseLevel.INTERMEDIATE,
    categorySlug: 'postgresql',
    chapters: [
      {
        title: 'مبانی PostgreSQL',
        sortOrder: 10,
        episodes: [
          { title: 'نصب و راه‌اندازی', slug: 'pg-install-setup', description: 'نصب PostgreSQL و pgAdmin', videoUrl: SAMPLE_VIDEO, videoDuration: 480, isFree: true, sortOrder: 10 },
          { title: 'دستورات DDL', slug: 'pg-ddl-commands', description: 'CREATE، ALTER، DROP', videoUrl: SAMPLE_VIDEO, videoDuration: 600, isFree: false, sortOrder: 20 },
          { title: 'دستورات DML', slug: 'pg-dml-commands', description: 'SELECT، INSERT، UPDATE، DELETE', videoUrl: SAMPLE_VIDEO, videoDuration: 780, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'بهینه‌سازی',
        sortOrder: 20,
        episodes: [
          { title: 'ایندکس‌گذاری', slug: 'pg-indexing', description: 'انواع ایندکس و زمان استفاده', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 10 },
          { title: 'EXPLAIN ANALYZE', slug: 'pg-explain-analyze', description: 'بررسی و بهینه‌سازی پلان اجرایی Query', videoUrl: SAMPLE_VIDEO_2, videoDuration: 900, isFree: false, sortOrder: 20 },
        ],
      },
    ],
  },
  {
    title: 'تیلویند CSS از صفر',
    slug: 'tailwindcss-from-scratch',
    shortDescription: 'یادگیری Tailwind CSS و ساخت رابط‌های کاربری زیبا',
    description: 'در این دوره یاد می‌گیرید چطور با Tailwind CSS رابط‌های کاربری مدرن، ریسپانسیو و زیبا بسازید بدون نوشتن CSS سفارشی.',
    thumbnail: 'https://picsum.photos/seed/tailwind/800/450',
    previewVideo: SAMPLE_VIDEO,
    price: 0,
    discountPrice: null,
    level: CourseLevel.BEGINNER,
    categorySlug: 'tailwind',
    chapters: [
      {
        title: 'آشنایی با Tailwind',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی Tailwind CSS', slug: 'tw-intro', description: 'فلسفه utility-first و مزایای Tailwind', videoUrl: SAMPLE_VIDEO, videoDuration: 480, isFree: true, sortOrder: 10 },
          { title: 'نصب و پیکربندی', slug: 'tw-install-config', description: 'نصب Tailwind با CLI و Vite', videoUrl: SAMPLE_VIDEO, videoDuration: 540, isFree: true, sortOrder: 20 },
          { title: 'Typography و رنگ‌ها', slug: 'tw-typography-colors', description: 'کلاس‌های متن و رنگ‌بندی', videoUrl: SAMPLE_VIDEO, videoDuration: 600, isFree: true, sortOrder: 30 },
        ],
      },
      {
        title: 'Layout و Flexbox',
        sortOrder: 20,
        episodes: [
          { title: 'Flexbox در Tailwind', slug: 'tw-flexbox', description: 'flex، items-center، justify-between و سایر کلاس‌ها', videoUrl: SAMPLE_VIDEO_2, videoDuration: 720, isFree: false, sortOrder: 10 },
          { title: 'Grid Layout', slug: 'tw-grid', description: 'grid، grid-cols و gap', videoUrl: SAMPLE_VIDEO_2, videoDuration: 660, isFree: false, sortOrder: 20 },
          { title: 'Responsive Design', slug: 'tw-responsive', description: 'پیشوندهای sm، md، lg، xl', videoUrl: SAMPLE_VIDEO_2, videoDuration: 720, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'یونیتی برای مبتدی‌ها',
    slug: 'unity-for-beginners',
    shortDescription: 'ساخت اولین بازی با Unity و C#',
    description: 'در این دوره با محیط Unity آشنا می‌شوید و اولین بازی‌های دوبعدی و سه‌بعدی خود را می‌سازید. مناسب برای افرادی که هیچ تجربه‌ای در ساخت بازی ندارند.',
    thumbnail: 'https://picsum.photos/seed/unity/800/450',
    previewVideo: SAMPLE_VIDEO_2,
    price: 900000,
    discountPrice: null,
    level: CourseLevel.BEGINNER,
    categorySlug: 'unity',
    chapters: [
      {
        title: 'آشنایی با Unity',
        sortOrder: 10,
        episodes: [
          { title: 'نصب Unity Hub', slug: 'unity-install-hub', description: 'دانلود و نصب Unity Hub و Unity Editor', videoUrl: SAMPLE_VIDEO, videoDuration: 540, isFree: true, sortOrder: 10 },
          { title: 'رابط کاربری Unity', slug: 'unity-ui-overview', description: 'آشنایی با Scene، Game، Inspector و Hierarchy', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: true, sortOrder: 20 },
          { title: 'Game Object و Component', slug: 'unity-gameobject-component', description: 'مفاهیم پایه معماری Unity', videoUrl: SAMPLE_VIDEO, videoDuration: 660, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'برنامه‌نویسی با C#',
        sortOrder: 20,
        episodes: [
          { title: 'مقدمات C#', slug: 'unity-csharp-basics', description: 'متغیرها، توابع و کلاس‌ها در C#', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 10 },
          { title: 'حرکت شخصیت', slug: 'unity-character-movement', description: 'کنترل حرکت با کیبورد و ماوس', videoUrl: SAMPLE_VIDEO_2, videoDuration: 900, isFree: false, sortOrder: 20 },
          { title: 'برخورد و Physics', slug: 'unity-collision-physics', description: 'Rigidbody و Collider', videoUrl: SAMPLE_VIDEO_2, videoDuration: 780, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'سی شارپ از صفر',
    slug: 'csharp-from-scratch',
    shortDescription: 'یادگیری زبان C# برای توسعه نرم‌افزار و بازی',
    description: 'دوره جامع آموزش زبان برنامه‌نویسی C# از مبتدی تا پیشرفته. این دوره شامل OOP، LINQ، async/await و کار با .NET است.',
    thumbnail: 'https://picsum.photos/seed/csharp/800/450',
    previewVideo: SAMPLE_VIDEO_3,
    price: 800000,
    discountPrice: 650000,
    level: CourseLevel.BEGINNER,
    categorySlug: 'csharp',
    chapters: [
      {
        title: 'مبانی C#',
        sortOrder: 10,
        episodes: [
          { title: 'معرفی .NET و C#', slug: 'cs-intro-dotnet', description: 'آشنایی با اکوسیستم .NET', videoUrl: SAMPLE_VIDEO, videoDuration: 540, isFree: true, sortOrder: 10 },
          { title: 'انواع داده و متغیر', slug: 'cs-types-variables', description: 'int، string، bool و سایر انواع داده', videoUrl: SAMPLE_VIDEO, videoDuration: 660, isFree: true, sortOrder: 20 },
          { title: 'حلقه‌ها و شرط‌ها', slug: 'cs-loops-conditions', description: 'for، while، if/else در C#', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'برنامه‌نویسی شیءگرا',
        sortOrder: 20,
        episodes: [
          { title: 'کلاس‌ها و اشیاء', slug: 'cs-classes-objects', description: 'تعریف کلاس، سازنده و ویژگی‌ها', videoUrl: SAMPLE_VIDEO_2, videoDuration: 780, isFree: false, sortOrder: 10 },
          { title: 'وراثت و Polymorphism', slug: 'cs-inheritance-polymorphism', description: 'مفاهیم OOP در C#', videoUrl: SAMPLE_VIDEO_2, videoDuration: 840, isFree: false, sortOrder: 20 },
          { title: 'Interface و Abstract', slug: 'cs-interface-abstract', description: 'برنامه‌نویسی با Interface', videoUrl: SAMPLE_VIDEO_2, videoDuration: 720, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'تحلیل داده با پایتون',
    slug: 'data-analysis-python',
    shortDescription: 'تحلیل و پردازش داده با Pandas، NumPy و Matplotlib',
    description: 'در این دوره یاد می‌گیرید چطور داده‌های واقعی را با Pandas پاکسازی و تحلیل کنید و نتایج را با Matplotlib و Seaborn نمایش دهید.',
    thumbnail: 'https://picsum.photos/seed/dataanalysis/800/450',
    previewVideo: SAMPLE_VIDEO,
    price: 1200000,
    discountPrice: null,
    level: CourseLevel.INTERMEDIATE,
    categorySlug: 'data-analysis',
    chapters: [
      {
        title: 'پایه‌های تحلیل داده',
        sortOrder: 10,
        episodes: [
          { title: 'NumPy پایه', slug: 'da-numpy-basics', description: 'آرایه‌ها، عملیات و توابع NumPy', videoUrl: SAMPLE_VIDEO, videoDuration: 720, isFree: true, sortOrder: 10 },
          { title: 'Pandas DataFrame', slug: 'da-pandas-dataframe', description: 'ایجاد و کار با DataFrame', videoUrl: SAMPLE_VIDEO, videoDuration: 840, isFree: false, sortOrder: 20 },
          { title: 'پاکسازی داده', slug: 'da-data-cleaning', description: 'مدیریت مقادیر null و داده‌های ناقص', videoUrl: SAMPLE_VIDEO, videoDuration: 780, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'نمودارسازی',
        sortOrder: 20,
        episodes: [
          { title: 'Matplotlib', slug: 'da-matplotlib', description: 'نمودارهای خطی، میله‌ای و دایره‌ای', videoUrl: SAMPLE_VIDEO_2, videoDuration: 720, isFree: false, sortOrder: 10 },
          { title: 'Seaborn', slug: 'da-seaborn', description: 'نمودارهای آماری پیشرفته', videoUrl: SAMPLE_VIDEO_2, videoDuration: 660, isFree: false, sortOrder: 20 },
          { title: 'پروژه تحلیل داده واقعی', slug: 'da-real-project', description: 'تحلیل یک دیتاست واقعی از Kaggle', videoUrl: SAMPLE_VIDEO_2, videoDuration: 1500, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
  {
    title: 'تست نویسی با Jest',
    slug: 'testing-with-jest',
    shortDescription: 'نوشتن تست‌های حرفه‌ای با Jest برای پروژه‌های JavaScript',
    description: 'یاد بگیرید چطور تست‌های واحد، یکپارچه‌سازی و E2E بنویسید. این دوره شامل Jest، Testing Library و Cypress است.',
    thumbnail: 'https://picsum.photos/seed/jesttest/800/450',
    previewVideo: SAMPLE_VIDEO_3,
    price: 650000,
    discountPrice: null,
    level: CourseLevel.INTERMEDIATE,
    categorySlug: 'jest',
    chapters: [
      {
        title: 'مقدمات تست',
        sortOrder: 10,
        episodes: [
          { title: 'فلسفه تست نویسی', slug: 'jest-philosophy', description: 'چرا تست مهم است و انواع تست', videoUrl: SAMPLE_VIDEO, videoDuration: 480, isFree: true, sortOrder: 10 },
          { title: 'نصب و پیکربندی Jest', slug: 'jest-install-config', description: 'راه‌اندازی Jest در پروژه', videoUrl: SAMPLE_VIDEO, videoDuration: 540, isFree: true, sortOrder: 20 },
          { title: 'اولین تست‌ها', slug: 'jest-first-tests', description: 'describe، it، expect', videoUrl: SAMPLE_VIDEO, videoDuration: 660, isFree: false, sortOrder: 30 },
        ],
      },
      {
        title: 'تست‌های پیشرفته',
        sortOrder: 20,
        episodes: [
          { title: 'Mock و Spy', slug: 'jest-mock-spy', description: 'شبیه‌سازی وابستگی‌ها', videoUrl: SAMPLE_VIDEO_2, videoDuration: 780, isFree: false, sortOrder: 10 },
          { title: 'تست async', slug: 'jest-async-tests', description: 'تست کدهای ناهمزمان', videoUrl: SAMPLE_VIDEO_2, videoDuration: 720, isFree: false, sortOrder: 20 },
          { title: 'Code Coverage', slug: 'jest-code-coverage', description: 'بررسی پوشش تست', videoUrl: SAMPLE_VIDEO_2, videoDuration: 600, isFree: false, sortOrder: 30 },
        ],
      },
    ],
  },
];
