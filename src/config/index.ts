const APP_NAME: string = "InverTRO";

const BACKEND_URL: string = "http://localhost:8080/api";

const NAV_ITEMS: any[] = [{
    title: 'Home',
    href: '/',
},
{
    title: 'Supplier',
    href: "/view/supplier",
}, {
    title: 'Product',
    href: '/view/product',
}, {
    title: 'Purchase Orders',
    href: '/view/purchase',
}, {
    title: 'Sales Order',
    href: '/view/sales',
},

];




export { APP_NAME, NAV_ITEMS, BACKEND_URL }