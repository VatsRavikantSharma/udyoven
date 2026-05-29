import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { company } from '../data/mockData';
import { RouteName, Tab, useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing } from '../theme';

const DRAWER_W = 280;
const { height: SH } = Dimensions.get('window');

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  route?: RouteName;
  tab?: Tab;
  action?: 'logout';
  badge?: string;
};

const GROUPS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'DASHBOARD',
    items: [
      { id: 'dashboard', label: 'Home',             icon: 'H', tab: 'Home' },
      { id: 'notif',     label: 'Notifications',    icon: 'N', route: 'Notifications', badge: '3' },
    ],
  },
  {
    title: 'MARKETPLACE',
    items: [
      { id: 'products',  label: 'Products',         icon: 'P', tab: 'Products' },
      { id: 'vendors',   label: 'Vendors',          icon: 'V', route: 'Vendors' },
    ],
  },
  {
    title: 'QUOTATION SYSTEM',
    items: [
      { id: 'quotes',    label: 'All Quotations',   icon: 'Q', tab: 'Quotations', badge: '6' },
      { id: 'new_q',     label: 'Create Quotation', icon: '+', route: 'QuotationCreate' },
    ],
  },
  {
    title: 'DEAL TRACKING',
    items: [
      { id: 'deals',     label: 'Deal Tracking',    icon: 'D', route: 'DealTracking', badge: '4' },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { id: 'chat',      label: 'Chat',             icon: 'C', tab: 'Chat', badge: '3' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: 'prof',      label: 'Profile',          icon: 'U', tab: 'Profile' },
      { id: 'settings',  label: 'Settings',         icon: 'S', route: 'Settings' },
      { id: 'logout',    label: 'Logout',           icon: 'L', action: 'logout' },
    ],
  },
];

export const SideMenuDrawer: React.FC = () => {
  const { sideMenuOpen, closeMenu, push, reset, setTab, role } = useNav();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_W)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: sideMenuOpen ? 0 : -DRAWER_W,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [sideMenuOpen, slideAnim]);

  const handlePress = (item: MenuItem) => {
    closeMenu();
    if (item.action === 'logout') {
      reset('Login');
    } else if (item.tab) {
      setTab(item.tab);
    } else if (item.route) {
      push(item.route);
    }
  };

  return (
    <>
      {sideMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        />
      )}
      <Animated.View style={[styles.drawer, { 
        paddingTop: insets.top,
        transform: [{ translateX: slideAnim }] 
      }]}>
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{company.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{company.name}</Text>
            <View style={styles.roleChip}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {GROUPS.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.item}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconBox}>
                    <Text style={styles.icon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Text style={styles.footerText}>Udyoven Trade v1.2.0</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 900,
  },
  drawer: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: DRAWER_W,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.primary,
  },
  headerAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  headerAvatarText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  headerName: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  roleChip: { 
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 2,
    borderRadius: radius.pill,
  },
  roleText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  scroll: { flex: 1, paddingVertical: spacing.lg },
  group: { marginBottom: spacing.xl },
  groupTitle: {
    fontSize: 11, fontWeight: '800', color: colors.textSubtle,
    letterSpacing: 1, paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
  },
  iconBox: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 14, fontWeight: '700', color: colors.primary },
  label: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  footerText: { fontSize: 12, fontWeight: '600', color: colors.textSubtle },
});
