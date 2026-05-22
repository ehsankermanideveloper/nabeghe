export interface CategorySeedNode {
  title: string;
  slug: string;
  sortOrder: number;
  children?: CategorySeedNode[];
}

export const CATEGORY_SEED_TREE: CategorySeedNode[] = [
  {
    title: 'برنامه نویسی وب',
    slug: 'web-development',
    sortOrder: 10,
    children: [
      { title: 'جاوااسکریپت', slug: 'javascript', sortOrder: 10 },
      { title: 'نود جی اس', slug: 'nodejs', sortOrder: 20 },
      { title: 'ریکت جی اس', slug: 'react', sortOrder: 30 },
      { title: 'ویو جی اس', slug: 'vue', sortOrder: 40 },
      { title: 'تیلویند', slug: 'tailwind', sortOrder: 50 },
      { title: 'لاراول', slug: 'laravel', sortOrder: 60 },
    ],
  },
  {
    title: 'دیتا ساینس',
    slug: 'data-science',
    sortOrder: 20,
    children: [
      { title: 'پایتون', slug: 'python-ds', sortOrder: 10 },
      { title: 'یادگیری ماشین', slug: 'machine-learning', sortOrder: 20 },
      { title: 'تحلیل داده', slug: 'data-analysis', sortOrder: 30 },
    ],
  },
  {
    title: 'زبانهای برنامه نویسی',
    slug: 'programming-languages',
    sortOrder: 30,
    children: [
      { title: 'پایتون', slug: 'python', sortOrder: 10 },
      { title: 'جاوا', slug: 'java', sortOrder: 20 },
      { title: 'سی شارپ', slug: 'csharp', sortOrder: 30 },
    ],
  },
  {
    title: 'توسعه بازی',
    slug: 'game-development',
    sortOrder: 40,
    children: [
      { title: 'یونیتی', slug: 'unity', sortOrder: 10 },
      { title: 'آنریل', slug: 'unreal', sortOrder: 20 },
    ],
  },
  {
    title: 'برنامه نویسی موبایل',
    slug: 'mobile-development',
    sortOrder: 50,
    children: [
      { title: 'اندروید', slug: 'android', sortOrder: 10 },
      { title: 'iOS', slug: 'ios', sortOrder: 20 },
      { title: 'فلاتر', slug: 'flutter', sortOrder: 30 },
    ],
  },
  {
    title: 'طراحی دیتابیس',
    slug: 'database-design',
    sortOrder: 60,
    children: [
      { title: 'PostgreSQL', slug: 'postgresql', sortOrder: 10 },
      { title: 'MySQL', slug: 'mysql', sortOrder: 20 },
    ],
  },
  {
    title: 'تست نویسی',
    slug: 'software-testing',
    sortOrder: 70,
    children: [
      { title: 'Jest', slug: 'jest', sortOrder: 10 },
      { title: 'E2E Testing', slug: 'e2e-testing', sortOrder: 20 },
    ],
  },
];
