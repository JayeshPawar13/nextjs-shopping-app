'use client';

import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { createContext, ReactNode, useContext, useState } from 'react';

import { Cart } from './cart/cart.interface';
import { User } from './user.interface';
import { Product } from './products/products.interface';

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

interface ContextProps {
  cart: Cart;
  products: Product[];
  user?: User;
  setCart: (cart: Cart) => void;
  setProducts: (products: Product[]) => void;
  setUser: (user: User | undefined) => void;
}

const defaultContextValues: ContextProps = {
  cart: {
    userId: '',
    items: [],
  },
  products: [],
  setCart: () => {},
  setProducts: () => {},
  setUser: () => {},
};

const AppContext = createContext<ContextProps>(defaultContextValues);

export const useAppContext = () => useContext(AppContext);

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  const [cart, setCart] = useState<Cart>(defaultContextValues.cart);
  const [products, setProducts] = useState<Product[]>(
    defaultContextValues.products
  );
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <AppContext.Provider
      value={{ cart, setCart, products, setProducts, user, setUser }}
    >
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </NextUIProvider>
    </AppContext.Provider>
  );
}
