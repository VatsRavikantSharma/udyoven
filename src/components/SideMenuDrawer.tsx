import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { company } from '../data/mockData';
import { RouteName, Tab, useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

const DRAWER_W = 290;
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
    title: 'COMMAND CENTER',
    items: [
      { id: 'dashboard', label: 'Dashboard',         icon: '⌂',  tab: 'Home' },
      { id: 'orders',    label: 'Orders',             icon: '📋', route: 'Orders', badge: '42' },
      { id: 'quotes',    label: 'Quotations',         icon: '📄', route: 'Quotations', badge: '12' },
    ],
  },
  {
    title: 'PRODUCTION & INVENTORY',
    items: [
      { id: 'prod',      label: 'Production',         icon: '⚙',  route: 'ProductionPlan' },
      { id: 'inv',       label: 'Inventory',          icon: '📦', route: 'Inventory' },
      { id: 'maint',     label: 'Maintenance',        icon: '🔧', route: 'Maintenance' },
      { id: 'machines',  label: 'Machine Monitoring', icon: '⚡', route: 'Machines' },
    ],
  },
  {
    title: 'PROCUREMENT & VENDORS',
    items: [
      { id: 'proc',      label: 'Procurement',        icon: '🛒', route: 'Procurement' },
      { id: 'vendors',   label: 'Vendors',            icon: '🏭', route: 'Vendors' },
      { id: 'qc',        label: 'Quality Control',    icon: '🔬', route: 'QC', badge: '4' },
    ],
  },
  {
    title: 'LOGISTICS & FINANCE',
    items: [
      { id: 'disp',      label: 'Dispatch',           icon: '🚚', route: 'Dispatch', badge: '6' },
      { id: 'acc',       label: 'Accounts & Payments',icon: '💰', route: 'Invoices' },
      { id: 'rep',       label: 'Reports',            icon: '📊', tab: 'Reports' },
    ],
  },
  {
    title: 'WORKFLOW & TEAM',
    items: [
      { id: 'appr',      label: 'Approval Center',    icon: '🛡', route: 'Approvals', badge: '4' },
      { id: 'tasks',     label: 'Team Tasks',         icon: '✅', route: 'Tasks', badge: '5' },
      { id: 'notif',     label: 'Notifications',      icon: '🔔', route: 'Notifications' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: 'pref',      label: 'Settings',           icon: '⚙',  route: 'Preferences' },
      { id: 'help',      label: 'Help & Support',     icon: '?',  route: 'Profile' },
      { id: 'logout',    label: 'Logout',             icon: '⏻',  action: 'logout' },
    ],
  },
];

const SHORTCUTS: MenuItem[] = [
  { id: 'sc_ai',   label: 'AI Assistant', icon: '✦', route: 'AIAssistant' },
  { id: 'sc_notif',label: 'Alerts',       icon: '⚑', tab: 'Alerts' },
  { id: 'sc_prof', label: 'Profile',      icon: '◎', tab: 'Profile' },
];

export const SideMenuDrawer: React.FC = () => {
  const { sideMenuOpen, closeMenu, push, setTab, reset, tab, role } = useNav();
  const insets = useSafeAreaInsets();
  const drawerX = useRef(new Animated.Value(-DRAWER_W - 10)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toX = sideMenuOpen ? 0 : -DRAWER_W - 10;
    const toOp = sideMenuOpen ? 1 : 0;
    Animated.parallel([
      Animated.spring(drawerX, {
        toValue: toX,
        useNativeDriver: true,
        tension: 120,
        friction: 14,
      }),
      Animated.timing(overlayOpacity, {
        toValue: toOp,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [sideMenuOpen, drawerX, overlayOpacity]);

  const handleItem = (item: MenuItem) => {
    closeMenu();
    if (item.action === 'logout') {
      setTimeout(() => reset('Login'), 200);
      return;
    }
    if (item.tab) {
      setTimeout(() => setTab(item.tab!), 200);
      return;
    }
    if (item.route) {
      if (item.route === 'Reports') {
        setTimeout(() => setTab('Reports'), 200);
      } else {
        setTimeout(() => push(item.route!), 200);
      }
    }
  };

  return (
    <>
      {/* Dim overlay */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents={sideMenuOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeMenu} />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            paddingTop: insets.top,
            height: SH,
            transform: [{ translateX: drawerX }],
          },
        ]}
      >
        {/* ── Company header ── */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.companyName} numberOfLines={1}>{company.name}</Text>
            <Text style={styles.unitName} numberOfLines={1}>{company.unit}</Text>
          </View>
          <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Role badge */}
        <View style={styles.roleBadgeRow}>
          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>{role}</Text>
          </View>
          <Text style={styles.shiftText}>{company.shift}</Text>
        </View>

        {/* ── Menu groups ── */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {GROUPS.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.items.map((item) => {
                const isActive =
                  (item.tab && tab === item.tab) ||
                  false;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => handleItem(item)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIcon, isActive && styles.menuIconActive]}>
                      <Text style={[styles.menuIconText, isActive && { color: '#fff' }]}>{item.icon}</Text>
                    </View>
                    <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                      {item.label}
                    </Text>
                    {item.badge ? (
                      <View style={styles.badgePill}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                    {!item.badge && item.action !== 'logout' && (
                      <Text style={styles.chevron}>›</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* ── Quick shortcuts footer ── */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.divider} />
          <Text style={styles.groupTitle}>QUICK ACCESS</Text>
          <View style={styles.shortcutRow}>
            {SHORTCUTS.map((sc) => (
              <TouchableOpacity
                key={sc.id}
                style={styles.shortcut}
                onPress={() => handleItem(sc)}
                activeOpacity={0.7}
              >
                <Text style={styles.shortcutIcon}>{sc.icon}</Text>
                <Text style={styles.shortcutLabel}>{sc.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.version}>FactoryOps ERP · v1.0.0</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.52)',
    zIndex: 90,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DRAWER_W,
    backgroundColor: colors.surface,
    zIndex: 100,
    ...shadow.raised,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  companyName: { fontSize: 13, fontWeight: '800', color: colors.text },
  unitName: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: { fontSize: 14, color: colors.textMuted, fontWeight: '700' },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  roleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: 6 },
  roleText: { fontSize: 11, fontWeight: '800', color: colors.primary, letterSpacing: 0.3 },
  shiftText: { fontSize: 10, fontWeight: '600', color: colors.textMuted },
  group: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  groupTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSubtle,
    letterSpacing: 1.4,
    marginBottom: 6,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    marginBottom: 2,
  },
  menuItemActive: { backgroundColor: '#EEF2FF' },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconActive: { backgroundColor: colors.primary },
  menuIconText: { fontSize: 15, color: colors.text },
  menuLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.text },
  menuLabelActive: { color: colors.primary },
  chevron: { fontSize: 18, color: colors.textSubtle },
  badgePill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  footer: {
    paddingHorizontal: spacing.md,
  },
  divider: { height: 1, backgroundColor: colors.divider, marginBottom: spacing.md },
  shortcutRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  shortcut: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  shortcutIcon: { fontSize: 18, marginBottom: 4, color: colors.text },
  shortcutLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  version: { fontSize: 10, color: colors.textSubtle, textAlign: 'center', marginTop: 4, fontWeight: '600' },
});
