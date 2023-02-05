export interface MenuItem {
  title: string;
  icon: string;
  url?: string;
  submenu: MenuItem[];
}
