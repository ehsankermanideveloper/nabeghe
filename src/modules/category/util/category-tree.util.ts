import type { CategoryEntity } from '@modules/category/entity/category.entity';
import type { CategoryMenuItem } from '@modules/category/interfaces/category-menu.interface';

const CATEGORY_PATH_PREFIX = '/courses/category';

export function buildCategoryHref(slug: string): string {
  return `${CATEGORY_PATH_PREFIX}/${slug}`;
}

export function buildCategoryMenuTree(
  rows: CategoryEntity[],
): CategoryMenuItem[] {
  const byParent = new Map<number | null, CategoryEntity[]>();

  for (const row of rows) {
    const key = row.parentId;
    const list = byParent.get(key) ?? [];
    list.push(row);
    byParent.set(key, list);
  }

  const roots = byParent.get(null) ?? [];

  return roots.map((root) => {
    const children = byParent.get(root.id) ?? [];
    return {
      id: root.id,
      title: root.title,
      slug: root.slug,
      href: buildCategoryHref(root.slug),
      children: children.map((child) => ({
        id: child.id,
        title: child.title,
        slug: child.slug,
        href: buildCategoryHref(child.slug),
        children: [],
      })),
    };
  });
}
