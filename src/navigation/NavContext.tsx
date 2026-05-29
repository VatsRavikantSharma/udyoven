// Lightweight in-app stack navigator. Avoids extra native deps so the app
// runs on the existing React Native install with no setup.

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type RouteName =
  | 'Splash'
  | 'Login'
  | 'Register'
  | 'Main'
  | 'ProductDetail'
  | 'QuotationCreate'
  | 'QuotationDetail'
  | 'DealTracking'
  | 'DealDetail'
  | 'ChatDetail'
  | 'Vendors'
  | 'VendorDetail'
  | 'Notifications'
  | 'Profile'
  | 'Settings'
  | 'Help';

export type Tab = 'Home' | 'Products' | 'Quotations' | 'Chat' | 'Profile';

export type Frame = { name: RouteName; params?: any };

type NavCtx = {
  stack: Frame[];
  push: (name: RouteName, params?: any) => void;
  replace: (name: RouteName, params?: any) => void;
  pop: () => void;
  reset: (name: RouteName, params?: any) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  role: string;
  setRole: (r: string) => void;
  sideMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const Ctx = createContext<NavCtx | null>(null);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stack, setStack] = useState<Frame[]>([{ name: 'Splash' }]);
  const [tab, setTab] = useState<Tab>('Home');
  const [role, setRole] = useState<string>('Plant Manager');
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const openMenu = useCallback(() => setSideMenuOpen(true), []);
  const closeMenu = useCallback(() => setSideMenuOpen(false), []);

  const push = useCallback((name: RouteName, params?: any) => {
    setStack((s) => [...s, { name, params }]);
  }, []);
  const replace = useCallback((name: RouteName, params?: any) => {
    setStack((s) => [...s.slice(0, -1), { name, params }]);
  }, []);
  const pop = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);
  const reset = useCallback((name: RouteName, params?: any) => {
    setStack([{ name, params }]);
  }, []);

  const value = useMemo<NavCtx>(
    () => ({ stack, push, replace, pop, reset, tab, setTab, role, setRole, sideMenuOpen, openMenu, closeMenu }),
    [stack, push, replace, pop, reset, tab, role, sideMenuOpen, openMenu, closeMenu],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useNav = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useNav must be used within NavProvider');
  return c;
};
