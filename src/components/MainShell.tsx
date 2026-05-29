import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeDashboard } from '../screens/HomeDashboard';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { QuotationsScreen } from '../screens/QuotationsScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { colors, spacing } from '../theme';
import { useNav } from '../navigation/NavContext';
import { BottomNav } from './BottomNav';
import { SideMenuDrawer } from './SideMenuDrawer';

const TAB_TITLES: Record<string, string> = {
  Products:   'Marketplace',
  Quotations: 'Quotations',
  Chat:       'Messages',
  Profile:    'My Profile',
};

const TabContent: React.FC = () => {
  const { tab } = useNav();
  switch (tab) {
    case 'Home':       return <HomeDashboard />;
    case 'Products':   return <ProductsScreen />;
    case 'Quotations': return <QuotationsScreen />;
    case 'Chat':       return <ChatScreen />;
    case 'Profile':    return <ProfileScreen />;
    default:           return <HomeDashboard />;
  }
};

export const MainShell: React.FC = () => {
  const { push, tab, openMenu } = useNav();
  const insets = useSafeAreaInsets();
  const showTabBar = tab !== 'Home';

  return (
    <View style={styles.root}>
      {showTabBar && (
        <View style={[styles.tabHeader, { paddingTop: insets.top + 6 }]}>
          <TouchableOpacity onPress={openMenu} style={styles.hamburgerBtn} activeOpacity={0.7}>
            <View style={styles.hamburgerBar} />
            <View style={[styles.hamburgerBar, { width: 18 }]} />
            <View style={styles.hamburgerBar} />
          </TouchableOpacity>
          <Text style={styles.tabHeaderTitle} numberOfLines={1}>
            {TAB_TITLES[tab] ?? tab}
          </Text>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => push('Notifications')} activeOpacity={0.7}>
            <Text style={styles.headerIconText}>&#128276;</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <TabContent />
      </View>

      <BottomNav />
      <SideMenuDrawer />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  hamburgerBar: { width: 22, height: 2, backgroundColor: colors.text, borderRadius: 2, marginVertical: 2 },
  tabHeaderTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginHorizontal: spacing.md,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: { fontSize: 16 },
  content: { flex: 1 },
});
