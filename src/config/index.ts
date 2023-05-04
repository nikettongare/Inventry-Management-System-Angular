const APP_NAME: string = 'InverTRO';

const BACKEND_URL: string = 'http://localhost:8080/api';

const NAV_ITEMS: any[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Supplier',
    href: '/supplier',
  },
  {
    title: 'Product',
    href: '/product',
  },
  {
    title: 'Purchase Orders',
    href: '/purchase',
  },
  {
    title: 'Sales Order',
    href: '/sales',
  },
];

export { APP_NAME, NAV_ITEMS, BACKEND_URL };
