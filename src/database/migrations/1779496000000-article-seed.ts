import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticleSeed1779496000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Skip seed if no categories exist (fresh DB with no category data)
    const [{ count }] = await queryRunner.query(`SELECT COUNT(*)::int AS count FROM "category"`);
    if (count === 0) return;

    // ─── Articles ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "article"
        (title, slug, short_description, body, thumbnail, status, read_time, view_count, sort_order, published_at, category_id, author_id, "createdAt", "updatedAt")
      VALUES
      (
        'راهنمای جامع JavaScript مدرن: از ES6 تا ES2024',
        'modern-javascript-guide',
        'در این مقاله با مهم‌ترین ویژگی‌های JavaScript مدرن از ES6 به بعد آشنا می‌شوید؛ از Arrow Function و Destructuring گرفته تا Optional Chaining، Nullish Coalescing و Top-Level Await.',
        E'<h2>مقدمه</h2>
<p>JavaScript در طول سال‌های گذشته تحول عظیمی داشته است. نسخه ES6 که در سال ۲۰۱۵ منتشر شد، نقطه عطف بزرگی بود و از آن به بعد هر سال ویژگی‌های جدیدی به این زبان اضافه شده است.</p>

<h2>Arrow Functions</h2>
<p>Arrow Function یکی از مهم‌ترین ویژگی‌های ES6 است. این نوع تابع علاوه بر سینتکس کوتاه‌تر، <code>this</code> را از scope بیرونی به ارث می‌برد.</p>
<pre><code>// تابع معمولی
function add(a, b) {
  return a + b;
}

// Arrow Function
const add = (a, b) => a + b;</code></pre>

<h2>Destructuring</h2>
<p>Destructuring به شما اجازه می‌دهد مقادیر را از آرایه‌ها و آبجکت‌ها به راحتی استخراج کنید.</p>
<pre><code>const user = { name: "علی", age: 25, city: "تهران" };
const { name, age } = user;

const numbers = [1, 2, 3];
const [first, second] = numbers;</code></pre>

<h2>Optional Chaining و Nullish Coalescing</h2>
<p>این دو ویژگی که در ES2020 اضافه شدند، کار با مقادیر null و undefined را بسیار ساده‌تر کرده‌اند.</p>
<pre><code>const city = user?.address?.city ?? "نامشخص";</code></pre>

<h2>Async/Await و Top-Level Await</h2>
<p>با Async/Await می‌توانید کد ناهمزمان را به شکل همزمان بنویسید. در ES2022 قابلیت Top-Level Await نیز اضافه شد که اجازه می‌دهد در سطح ماژول از await بدون async استفاده کنید.</p>

<h2>جمع‌بندی</h2>
<p>JavaScript مدرن ابزارهای قدرتمندی در اختیار توسعه‌دهندگان قرار داده که کدنویسی را لذت‌بخش‌تر و قابل نگهداری‌تر می‌کند. توصیه می‌کنیم این ویژگی‌ها را در پروژه‌های واقعی تمرین کنید.</p>',
        '/assets/images/courses/01.jpg',
        'published',
        8,
        245,
        1,
        NOW() - INTERVAL '5 days',
        2,
        1,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
      ),
      (
        'آموزش React Hooks: useState، useEffect و useContext',
        'react-hooks-tutorial',
        'Hooks انقلابی در نوشتن کامپوننت‌های React ایجاد کرد. در این مقاله سه هوک اصلی useState، useEffect و useContext را با مثال‌های کاربردی یاد می‌گیریم.',
        E'<h2>Hooks چیست؟</h2>
<p>Hooks در React 16.8 معرفی شد و به ما اجازه می‌دهد بدون نیاز به Class Component از state و سایر ویژگی‌های React استفاده کنیم. این تغییر بزرگ نحوه نوشتن کامپوننت‌ها را متحول کرد.</p>

<h2>useState</h2>
<p>هوک <code>useState</code> برای مدیریت state محلی یک کامپوننت استفاده می‌شود.</p>
<pre><code>import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;div&gt;
      &lt;p&gt;تعداد: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;افزایش&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>useEffect</h2>
<p>هوک <code>useEffect</code> برای مدیریت side effects مانند فراخوانی API، تنظیم تایمر و subscription استفاده می‌شود.</p>
<pre><code>useEffect(() => {
  fetch("/api/users")
    .then(res => res.json())
    .then(data => setUsers(data));

  return () => {
    // cleanup function
  };
}, [dependency]);</code></pre>

<h2>useContext</h2>
<p>هوک <code>useContext</code> به ما امکان می‌دهد بدون prop drilling به مقادیر Context دسترسی داشته باشیم.</p>
<pre><code>const theme = useContext(ThemeContext);</code></pre>

<h2>قوانین Hooks</h2>
<p>دو قانون مهم وجود دارد: اول اینکه Hooks را فقط در سطح بالای تابع صدا بزنید، نه داخل حلقه یا شرط. دوم اینکه Hooks را فقط در Function Component یا Custom Hook صدا بزنید.</p>

<h2>جمع‌بندی</h2>
<p>Hooks ابزار قدرتمندی است که کد React شما را تمیزتر و قابل نگهداری‌تر می‌کند. با تسلط بر این سه هوک اصلی، آماده یادگیری هوک‌های پیشرفته‌تر مانند useReducer و useMemo خواهید بود.</p>',
        '/assets/images/courses/02.jpg',
        'published',
        10,
        312,
        2,
        NOW() - INTERVAL '10 days',
        4,
        1,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days'
      ),
      (
        'Node.js و Express: ساخت REST API حرفه‌ای',
        'nodejs-express-rest-api',
        'در این مقاله یاد می‌گیریم چگونه با Node.js و Express یک REST API کامل و حرفه‌ای بسازیم؛ شامل مسیریابی، middleware، اعتبارسنجی، و مدیریت خطا.',
        E'<h2>مقدمه</h2>
<p>Node.js با موتور V8 گوگل امکان اجرای JavaScript در سمت سرور را فراهم می‌کند. Express محبوب‌ترین فریم‌ورک Node.js است که ساخت وب‌سرور و API را بسیار ساده می‌کند.</p>

<h2>راه‌اندازی پروژه</h2>
<pre><code>mkdir my-api && cd my-api
npm init -y
npm install express cors helmet morgan
npm install -D nodemon</code></pre>

<h2>ایجاد سرور</h2>
<pre><code>const express = require("express");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/users", async (req, res) => {
  try {
    const users = await UserService.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));</code></pre>

<h2>Middleware</h2>
<p>Middleware توابعی هستند که قبل از رسیدن درخواست به route handler اجرا می‌شوند. می‌توان از آن‌ها برای احراز هویت، لاگ‌گیری، و اعتبارسنجی استفاده کرد.</p>

<h2>مدیریت خطا</h2>
<p>در Express می‌توانید یک Error Handler مرکزی تعریف کنید که تمام خطاها را مدیریت کند.</p>
<pre><code>app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});</code></pre>

<h2>جمع‌بندی</h2>
<p>با Node.js و Express می‌توانید API های قدرتمند و مقیاس‌پذیر بسازید. توصیه می‌شود برای پروژه‌های بزرگ‌تر به NestJS مهاجرت کنید که ساختار بهتری ارائه می‌دهد.</p>',
        '/assets/images/courses/03.jpg',
        'published',
        12,
        189,
        3,
        NOW() - INTERVAL '15 days',
        3,
        1,
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days'
      ),
      (
        'Python برای داده‌کاوی: NumPy و Pandas از صفر تا صد',
        'python-numpy-pandas-data-science',
        'NumPy و Pandas دو کتابخانه اصلی Python برای تحلیل داده هستند. در این مقاله کامل، با عملیات اصلی این دو کتابخانه قدرتمند آشنا می‌شویم.',
        E'<h2>مقدمه</h2>
<p>Python به زبان اصلی علم داده تبدیل شده است. دو کتابخانه NumPy و Pandas ستون فقرات تحلیل داده در Python هستند و هر دانشمند داده‌ای باید با آن‌ها آشنا باشد.</p>

<h2>NumPy: محاسبات عددی</h2>
<p>NumPy آرایه‌های چندبعدی و توابع ریاضی سرعت بالا را فراهم می‌کند.</p>
<pre><code>import numpy as np

# ایجاد آرایه
arr = np.array([1, 2, 3, 4, 5])
matrix = np.zeros((3, 3))

# عملیات ریاضی
print(arr.mean())  # میانگین
print(arr.std())   # انحراف معیار
print(np.dot(arr, arr))  # ضرب داخلی</code></pre>

<h2>Pandas: تحلیل داده</h2>
<p>Pandas ساختار DataFrame را فراهم می‌کند که مانند جدول Excel یا SQL عمل می‌کند.</p>
<pre><code>import pandas as pd

df = pd.read_csv("data.csv")

# بررسی اولیه
print(df.head())
print(df.info())
print(df.describe())

# فیلتر کردن
young_users = df[df["age"] < 30]

# گروه‌بندی
dept_avg = df.groupby("department")["salary"].mean()</code></pre>

<h2>پاک‌سازی داده</h2>
<p>یکی از مهم‌ترین مراحل داده‌کاوی، پاک‌سازی داده است.</p>
<pre><code># مقادیر null
df.dropna()
df.fillna(df.mean())

# حذف تکراری
df.drop_duplicates()</code></pre>

<h2>ویژوالیزیشن</h2>
<p>با Matplotlib و Seaborn می‌توانید نمودارهای زیبا از داده‌ها رسم کنید.</p>

<h2>جمع‌بندی</h2>
<p>تسلط بر NumPy و Pandas پایه اصلی هر مسیر شغلی در علم داده است. توصیه می‌کنیم روی دیتاست‌های واقعی تمرین کنید.</p>',
        '/assets/images/courses/04.jpg',
        'published',
        15,
        278,
        4,
        NOW() - INTERVAL '20 days',
        13,
        1,
        NOW() - INTERVAL '20 days',
        NOW() - INTERVAL '20 days'
      ),
      (
        'TypeScript پیشرفته: Generic Types، Utility Types و Decorators',
        'typescript-advanced-generics-decorators',
        'در این مقاله به مباحث پیشرفته TypeScript می‌پردازیم؛ از Generic Types و Utility Types مانند Partial، Required و Pick گرفته تا Decorators که پایه NestJS هستند.',
        E'<h2>مقدمه</h2>
<p>TypeScript نسخه‌ای از JavaScript است که type system قوی به آن اضافه کرده. بعد از یادگیری مبانی، زمان آن است که به ویژگی‌های پیشرفته بپردازیم.</p>

<h2>Generic Types</h2>
<p>Generic ها به ما اجازه می‌دهند کدهایی بنویسیم که با هر نوع داده‌ای کار کنند.</p>
<pre><code>function identity<T>(arg: T): T {
  return arg;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

// استفاده
const response: ApiResponse<User[]> = await fetchUsers();</code></pre>

<h2>Utility Types</h2>
<p>TypeScript Utility Types های آماده‌ای دارد که کار با type ها را ساده می‌کنند.</p>
<pre><code>interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserPublic = Omit<User, "password">;
type UserUpdate = Partial<Pick<User, "name" | "email">>;
type RequiredUser = Required<User>;
type ReadonlyUser = Readonly<User>;</code></pre>

<h2>Conditional Types</h2>
<pre><code>type IsArray<T> = T extends any[] ? "array" : "not array";
type NonNullable<T> = T extends null | undefined ? never : T;</code></pre>

<h2>Decorators</h2>
<p>Decorator ها ویژگی‌هایی هستند که به کلاس‌ها، متدها، و property ها اضافه می‌شوند. NestJS به شدت از Decorator استفاده می‌کند.</p>
<pre><code>function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(\`Calling \${key} with\`, args);
    return original.apply(this, args);
  };
  return descriptor;
}

class UserService {
  @Log
  findUser(id: number) {
    return { id, name: "علی" };
  }
}</code></pre>

<h2>جمع‌بندی</h2>
<p>این ویژگی‌های پیشرفته TypeScript به شما کمک می‌کنند کد type-safe و قابل نگهداری‌تری بنویسید. تسلط بر Decorator ها برای کار با فریم‌ورک‌هایی مثل NestJS ضروری است.</p>',
        '/assets/images/features/01.jpg',
        'published',
        13,
        203,
        5,
        NOW() - INTERVAL '3 days',
        2,
        1,
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '3 days'
      )
      RETURNING id
    `);

    // ─── Fetch inserted article IDs ───────────────────────────────────────────
    const articles = await queryRunner.query(`
      SELECT id, slug FROM "article"
      WHERE slug IN (
        'modern-javascript-guide',
        'react-hooks-tutorial',
        'nodejs-express-rest-api',
        'python-numpy-pandas-data-science',
        'typescript-advanced-generics-decorators'
      )
      ORDER BY sort_order ASC
    `);

    const bySlug: Record<string, number> = {};
    for (const a of articles) bySlug[a.slug] = Number(a.id);

    const jsId = bySlug['modern-javascript-guide'];
    const reactId = bySlug['react-hooks-tutorial'];
    const nodeId = bySlug['nodejs-express-rest-api'];
    const pythonId = bySlug['python-numpy-pandas-data-science'];
    const tsId = bySlug['typescript-advanced-generics-decorators'];

    // ─── Article Tags ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO "article_tag" (article_id, title, slug, "createdAt", "updatedAt") VALUES
      -- JS
      (${jsId}, 'جاوااسکریپت', 'javascript', NOW(), NOW()),
      (${jsId}, 'ES6', 'es6', NOW(), NOW()),
      (${jsId}, 'وب', 'web', NOW(), NOW()),
      -- React
      (${reactId}, 'ری‌اکت', 'react', NOW(), NOW()),
      (${reactId}, 'Hooks', 'hooks', NOW(), NOW()),
      (${reactId}, 'فرانت‌اند', 'frontend', NOW(), NOW()),
      -- Node
      (${nodeId}, 'نود جی‌اس', 'nodejs', NOW(), NOW()),
      (${nodeId}, 'Express', 'express', NOW(), NOW()),
      (${nodeId}, 'REST API', 'rest-api', NOW(), NOW()),
      (${nodeId}, 'بک‌اند', 'backend', NOW(), NOW()),
      -- Python
      (${pythonId}, 'پایتون', 'python', NOW(), NOW()),
      (${pythonId}, 'علم داده', 'data-science', NOW(), NOW()),
      (${pythonId}, 'Pandas', 'pandas', NOW(), NOW()),
      (${pythonId}, 'NumPy', 'numpy', NOW(), NOW()),
      -- TypeScript
      (${tsId}, 'تایپ‌اسکریپت', 'typescript', NOW(), NOW()),
      (${tsId}, 'Generic', 'generic', NOW(), NOW()),
      (${tsId}, 'Decorator', 'decorator', NOW(), NOW()),
      (${tsId}, 'NestJS', 'nestjs', NOW(), NOW())
    `);

    // ─── Article Comments ─────────────────────────────────────────────────────
    // Root comments first, then replies
    await queryRunner.query(`
      INSERT INTO "article_comment" (article_id, user_id, parent_id, body, status, "createdAt", "updatedAt") VALUES
      -- JS article comments
      (${jsId}, 1, NULL, 'مقاله خیلی خوبی بود! Optional Chaining واقعاً کار رو راحت کرده. ممنون از توضیحات کامل.', 'approved', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
      (${jsId}, 1, NULL, 'آیا می‌تونید در مورد WeakMap و WeakSet هم مقاله بنویسید؟ خیلی گیج‌کننده‌ست.', 'approved', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

      -- React article comments
      (${reactId}, 1, NULL, 'بهترین توضیح useEffect که تا حالا خوندم! مخصوصاً بخش cleanup function خیلی مفید بود.', 'approved', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
      (${reactId}, 1, NULL, 'ممنون از مقاله. یه سوال: فرق useContext با Redux چیه و کی باید از کدوم استفاده کرد؟', 'approved', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
      (${reactId}, 1, NULL, 'مقاله عالی بود. لطفاً در مورد useReducer هم بنویسید.', 'approved', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

      -- Node article comments
      (${nodeId}, 1, NULL, 'دقیقاً همین مقاله رو نیاز داشتم. پیاده‌سازی Error Handler مرکزی خیلی مفید بود.', 'approved', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
      (${nodeId}, 1, NULL, 'آیا Fastify از Express بهتره؟ تفاوت عملکردیشون چقدره؟', 'approved', NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),

      -- Python article comments
      (${pythonId}, 1, NULL, 'این مقاله رو تازه شروع کردم به یادگیری علم داده و خیلی به دردم خورد. مرسی.', 'approved', NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
      (${pythonId}, 1, NULL, 'آیا برای یادگیری ماشین هم باید حتماً NumPy بلد باشم یا TensorFlow کافیه؟', 'approved', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
      (${pythonId}, 1, NULL, 'مثال‌های کد خیلی واقعی و کاربردی بودن. ممنون که وقت گذاشتید.', 'approved', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),

      -- TypeScript article comments
      (${tsId}, 1, NULL, 'Generic Types رو خیلی ساده و کامل توضیح دادید. بالاخره فهمیدم!', 'approved', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
      (${tsId}, 1, NULL, 'بخش Decorator واقعاً چشم‌گشا بود. حالا می‌فهمم چرا NestJS اینقدر تمیزه.', 'approved', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
    `);

    // ─── Add replies from team ────────────────────────────────────────────────
    const rootComments = await queryRunner.query(`
      SELECT id, article_id FROM "article_comment"
      WHERE parent_id IS NULL AND status = 'approved'
      ORDER BY id ASC
    `);

    // Map article_id to comment ids
    const commentsByArticle: Record<number, number[]> = {};
    for (const c of rootComments) {
      const aid = Number(c.article_id);
      if (!commentsByArticle[aid]) commentsByArticle[aid] = [];
      commentsByArticle[aid].push(Number(c.id));
    }

    const replies: string[] = [];

    // JS: reply to second comment about WeakMap
    if (commentsByArticle[jsId]?.[1]) {
      replies.push(`(${jsId}, 1, ${commentsByArticle[jsId][1]}, 'سوال خوبیه! WeakMap و WeakSet برای نگه‌داشتن مراجع ضعیف استفاده می‌شن و جلوی memory leak رو می‌گیرن. حتماً در مقاله‌های بعدی بهشون می‌پردازیم.', 'approved', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')`);
    }

    // React: reply to useContext question
    if (commentsByArticle[reactId]?.[1]) {
      replies.push(`(${reactId}, 1, ${commentsByArticle[reactId][1]}, 'useContext برای state های ساده و سبک مناسبه. Redux وقتی state پیچیده، shared بین کامپوننت‌های زیاد، یا نیاز به debugging قوی داشته باشید انتخاب بهتریه.', 'approved', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days')`);
    }

    // Node: reply to Fastify question
    if (commentsByArticle[nodeId]?.[1]) {
      replies.push(`(${nodeId}, 1, ${commentsByArticle[nodeId][1]}, 'Fastify در تست‌های benchmark سریع‌تر از Express هست، اما Express اکوسیستم بزرگ‌تری داره. برای پروژه‌های جدید و performance-critical، Fastify گزینه خوبیه.', 'approved', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days')`);
    }

    // Python: reply to ML question
    if (commentsByArticle[pythonId]?.[1]) {
      replies.push(`(${pythonId}, 1, ${commentsByArticle[pythonId][1]}, 'بله، NumPy پایه TensorFlow و PyTorch هست. حتی اگه از این فریم‌ورک‌ها استفاده کنید، درک NumPy به شما کمک زیادی می‌کنه در debug کردن مشکلات.', 'approved', NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days')`);
    }

    // TS: reply to Decorators comment
    if (commentsByArticle[tsId]?.[1]) {
      replies.push(`(${tsId}, 1, ${commentsByArticle[tsId][1]}, 'دقیقاً! NestJS با استفاده هوشمندانه از Decorator ها معماری بسیار تمیزی ایجاد کرده. اگه با NestJS کار کنید این مفاهیم خیلی کاربردی می‌شن.', 'approved', NOW() - INTERVAL '23 hours', NOW() - INTERVAL '23 hours')`);
    }

    if (replies.length > 0) {
      await queryRunner.query(`
        INSERT INTO "article_comment" (article_id, user_id, parent_id, body, status, "createdAt", "updatedAt") VALUES
        ${replies.join(',\n        ')}
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "article_comment"
      WHERE article_id IN (
        SELECT id FROM "article"
        WHERE slug IN (
          'modern-javascript-guide',
          'react-hooks-tutorial',
          'nodejs-express-rest-api',
          'python-numpy-pandas-data-science',
          'typescript-advanced-generics-decorators'
        )
      )
    `);

    await queryRunner.query(`
      DELETE FROM "article_tag"
      WHERE article_id IN (
        SELECT id FROM "article"
        WHERE slug IN (
          'modern-javascript-guide',
          'react-hooks-tutorial',
          'nodejs-express-rest-api',
          'python-numpy-pandas-data-science',
          'typescript-advanced-generics-decorators'
        )
      )
    `);

    await queryRunner.query(`
      DELETE FROM "article"
      WHERE slug IN (
        'modern-javascript-guide',
        'react-hooks-tutorial',
        'nodejs-express-rest-api',
        'python-numpy-pandas-data-science',
        'typescript-advanced-generics-decorators'
      )
    `);
  }
}
