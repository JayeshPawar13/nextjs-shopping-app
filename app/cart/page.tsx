import CartListItems from '@/components/cartItemList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Cart',
    template: '',
  },
  description: 'View Your Cart',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function CartPage() {
  return <CartListItems />;
}
