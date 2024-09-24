'use client';
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@nextui-org/navbar';
import { link as linkStyles } from '@nextui-org/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { Logo } from '@/components/icons';
import { useAppContext } from '@/app/providers';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const router = useRouter();
  const { cart } = useAppContext();
  const totalQuantity = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [totalQuantity]);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Shopperz</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color="foreground"
                href={item.href}
                onClick={() => router.refresh()}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="relative flex gap-2 transform transition-transform duration-300 hover:scale-110">
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/cart"
          >
            <Image
              alt="cart image"
              height={18}
              src="/icons/cart.svg"
              width={18}
              className={clsx(
                'transition-transform duration-300',
                animate ? 'scale-125' : 'scale-100'
              )}
            />
            {totalQuantity > 0 && (
              <span
                className={`absolute -top-4 -right-0.5 bg-orange-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center ${clsx(
                  'transition-transform duration-300',
                  animate ? 'scale-110' : 'scale-100'
                )}`}
              >
                {totalQuantity}
              </span>
            )}
          </NextLink>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
