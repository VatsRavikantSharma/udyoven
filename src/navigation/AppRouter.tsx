// Central screen router for B2B Factory-Vendor Marketplace.
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { MainShell } from '../components/MainShell';
import { NavProvider, useNav } from './NavContext';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { QuotationsScreen } from '../screens/QuotationsScreen';
import { QuotationCreateScreen } from '../screens/QuotationCreateScreen';
import { DealTrackingScreen } from '../screens/DealTrackingScreen';
import { DealDetailScreen } from '../screens/DealDetailScreen';
import { QuotationDetailScreen } from '../screens/QuotationDetailScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { ChatDetailScreen } from '../screens/ChatDetailScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { VendorsScreen } from '../screens/VendorsScreen';
import { VendorDetailScreen } from '../screens/VendorDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

function RootNavigator() {
  const { stack, pop } = useNav();
  const current = stack[stack.length - 1];
  const name = current.name;
  const params = current.params;

  // Handle hardware back button on Android
  useEffect(() => {
    const onBackPress = () => {
      if (stack.length > 1) {
        pop();
        return true; 
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [stack, pop]);

  if (name === 'Main') {
    return <MainShell />;
  }

  switch (name) {
    case 'Splash':           return <SplashScreen />;
    case 'Login':            return <LoginScreen />;
    case 'Products':         return <ProductsScreen />;
    case 'ProductDetail':    return <ProductDetailScreen params={params} />;
    case 'Quotations':       return <QuotationsScreen />;
    case 'QuotationCreate':  return <QuotationCreateScreen params={params} />;
    case 'QuotationDetail':  return <QuotationDetailScreen params={params} />;
    case 'DealTracking':     return <DealTrackingScreen />;
    case 'DealDetail':       return <DealDetailScreen params={params} />;
    case 'Chat':             return <ChatScreen />;
    case 'ChatDetail':       return <ChatDetailScreen params={params} />;
    case 'Notifications':    return <NotificationsScreen />;
    case 'Vendors':          return <VendorsScreen />;
    case 'VendorDetail':     return <VendorDetailScreen params={params} />;
    case 'Profile':          return <ProfileScreen />;
    case 'Settings':         return <SettingsScreen />;
    default:                 return <MainShell />;
  }
}

export function AppRouter() {
  return (
    <NavProvider>
      <RootNavigator />
    </NavProvider>
  );
}
