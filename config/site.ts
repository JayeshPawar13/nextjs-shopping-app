export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Shopperz',
  description: 'Shopping App',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Products',
      href: '/products',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
};
