export interface CategoryMenuItem {
  id: number;
  title: Record<string, string>;
  slug: string;
  href: string;
  children: CategoryMenuItem[];
}
