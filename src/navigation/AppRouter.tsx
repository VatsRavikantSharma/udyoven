// Central screen router. Maps RouteName values from NavContext to screen components.
import React from 'react';
import { MainShell } from '../components/MainShell';
import { NavProvider, useNav } from './NavContext';

// ── Screens ──
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { QuotationsScreen } from '../screens/QuotationsScreen';
import { QuotationCreateScreen } from '../screens/QuotationCreateScreen';
import { QuotationDetailScreen } from '../screens/QuotationDetailScreen';
import { ProductionPlanScreen } from '../screens/ProductionPlanScreen';
import { ProductionLiveScreen } from '../screens/ProductionLiveScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { InventoryItemScreen } from '../screens/InventoryItemScreen';
import { ProcurementScreen } from '../screens/ProcurementScreen';
import { VendorsScreen } from '../screens/VendorsScreen';
import { VendorDetailScreen } from '../screens/VendorDetailScreen';
import { DispatchLogisticsScreen } from '../screens/DispatchLogisticsScreen';
import { AccountsPaymentsScreen } from '../screens/AccountsPaymentsScreen';
import { ApprovalCenterScreen } from '../screens/ApprovalCenterScreen';
import { TeamTasksScreen } from '../screens/TeamTasksScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { ReportDetailScreen } from '../screens/ReportDetailScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { QCScreen } from '../screens/QCScreen';
import { QCDetailScreen } from '../screens/QCDetailScreen';
import { MachinesScreen } from '../screens/MachinesScreen';
import { MaintenanceScreen } from '../screens/MaintenanceScreen';
import { AIAssistantScreen } from '../screens/AIAssistantScreen';
import {
  CompanyProfileScreen,
  UserRolesScreen,
  PreferencesScreen,
  DevicesScreen,
} from '../screens/SettingsScreens';

function RootNavigator() {
  const { stack } = useNav();
  const current = stack[stack.length - 1];
  const name = current.name;
  const params = current.params;

  // Main tab shell — includes BottomNav, SideMenuDrawer, floating AI button
  if (name === 'Main') {
    return <MainShell />;
  }

  // Push routes (full-screen, no bottom nav)
  switch (name) {
    case 'Splash':           return <SplashScreen />;
    case 'Login':            return <LoginScreen />;
    case 'Orders':           return <OrdersScreen />;
    case 'OrderDetail':      return <OrderDetailScreen params={params} />;
    case 'Quotations':       return <QuotationsScreen />;
    case 'QuotationCreate':  return <QuotationCreateScreen />;
    case 'QuotationDetail':  return <QuotationDetailScreen params={params} />;
    case 'ProductionPlan':   return <ProductionPlanScreen />;
    case 'ProductionLive':   return <ProductionLiveScreen />;
    case 'Inventory':        return <InventoryScreen />;
    case 'InventoryItem':    return <InventoryItemScreen params={params} />;
    case 'Procurement':      return <ProcurementScreen />;
    case 'Vendors':          return <VendorsScreen />;
    case 'VendorDetail':     return <VendorDetailScreen params={params} />;
    case 'Dispatch':         return <DispatchLogisticsScreen />;
    case 'Invoices':         return <AccountsPaymentsScreen />;
    case 'Approvals':        return <ApprovalCenterScreen />;
    case 'Tasks':            return <TeamTasksScreen />;
    case 'Reports':          return <ReportsScreen />;
    case 'ReportDetail':     return <ReportDetailScreen params={params} />;
    case 'Notifications':    return <NotificationsScreen />;
    case 'QC':               return <QCScreen />;
    case 'QCDetail':         return <QCDetailScreen params={params} />;
    case 'Machines':         return <MachinesScreen />;
    case 'Maintenance':      return <MaintenanceScreen />;
    case 'AIAssistant':      return <AIAssistantScreen />;
    case 'CompanyProfile':   return <CompanyProfileScreen />;
    case 'UserRoles':        return <UserRolesScreen />;
    case 'Preferences':      return <PreferencesScreen />;
    case 'Devices':          return <DevicesScreen />;
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
