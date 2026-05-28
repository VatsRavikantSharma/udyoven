import React, { useRef } from 'react';
import {
  Animated, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeDashboard } from '../screens/HomeDashboard';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OperationsScreen } from '../screens/OperationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { colors, spacing } from '../theme';
import { useNav } from '../navigation/NavContext';
import { BottomNav } from './BottomNav';
import { SideMenuDrawer } from './SideMenuDrawer';

const TAB_TITLES: Record<string, string> = {
  Operations: 'Operations',
  Alerts:     'Alerts & Notifications',
  Reports:    'Reports & Analytics',
  Profile:    'My Profile',
};

const TabContent: React.FC = () => {
  const { tab } = useNav();
  switch (tab) {
    case 'Home':       return <HomeDashboard />;
    case 'Operations': return <OperationsScreen />;
    case 'Alerts':     return <NotificationsScreen />;
    case 'Reports':    return <ReportsScreen />;
    case 'Profile':    return <ProfileScreen />;
    default:           return <HomeDashboard />;
  }
};

export const MainShell: React.FC = () => {
  const { push, sideMenuOpen, openMenu, tab } = useNav();
  const insets = useSafeAreaInsets();
  const aiScale = useRef(new Animated.Value(1)).current;

  const handleAI = () => {
    Animated.sequence([
      Animated.timing(aiScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.spring(aiScale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    push('AIAssistant');
  };

  const aiBtnBottom = 68 + Math.max(insets.bottom, 12) + 8;
  const showTabBar = tab !== 'Home';

  return (
    <View style={styles.root}>
      {/* Persistent header for non-Home tabs */}
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
            <Text style={styles.headerIconText}>🔔</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tab content area */}
      <View style={styles.content}>
        <TabContent />
      </View>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Floating AI assistant button */}
      <Animated.View
        style={[
          styles.aiBtnWrap,
          { bottom: aiBtnBottom, transform: [{ scale: aiScale }] },
        ]}
        pointerEvents={sideMenuOpen ? 'none' : 'auto'}
      >
        <TouchableOpacity style={styles.aiBtn} onPress={handleAI} activeOpacity={0.85}>
          <Text style={styles.aiIcon}>✦</Text>
          <Text style={styles.aiLabel}>AI</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Side menu (always mounted for smooth animation) */}
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
  aiBtnWrap: {
    position: 'absolute',
    right: 16,
    zIndex: 80,
  },
  aiBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 10,
  },
  aiIcon: { fontSize: 16, color: '#fff', fontWeight: '900', lineHeight: 18 },
  aiLabel: { fontSize: 8, color: 'rgba(255,255,255,0.85)', fontWeight: '800', letterSpacing: 0.5, marginTop: 1 },
});
