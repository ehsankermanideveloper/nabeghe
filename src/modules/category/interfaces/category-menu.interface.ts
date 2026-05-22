export interface CategoryMenuItem {
  id: number;
  title: string;
  slug: string;
  href: string;
  children: CategoryMenuItem[];
}
