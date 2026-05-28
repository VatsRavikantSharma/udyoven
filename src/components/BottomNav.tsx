import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Tab, useNav } from '../navigation/NavContext';

const { width: SW } = Dimensions.get('window');
const TAB_COUNT = 5;

const TABS: { key: Tab; label: string; icon: string; activeIcon: string }[] = [
  { key: 'Home',       label: 'Home',    icon: '⌂',  activeIcon: '⌂'  },
  { key: 'Operations', label: 'Ops',     icon: '⚙',  activeIcon: '⚙'  },
  { key: 'Alerts',     label: 'Alerts',  icon: '⚑',  activeIcon: '⚑'  },
  { key: 'Reports',    label: 'Reports', icon: '⊞',  activeIcon: '⊞'  },
  { key: 'Profile',    label: 'Profile', icon: '◎',  activeIcon: '◎'  },
];

export const BottomNav: React.FC = () => {
  const { tab, setTab } = useNav();
  const insets = useSafeAreaInsets();

  const tabWidth = SW / TAB_COUNT;
  const indicatorX = useRef(new Animated.Value(0)).current;
  const scales = useRef(TABS.map(() => new Animated.Value(1))).current;

  const activeIndex = TABS.findIndex((t) => t.key === tab);

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      tension: 160,
      friction: 14,
    }).start();
  }, [activeIndex, indicatorX, tabWidth]);

  const handlePress = (t: Tab, i: number) => {
    Animated.sequence([
      Animated.timing(scales[i], { toValue: 0.88, duration: 70, useNativeDriver: true }),
      Animated.spring(scales[i], { toValue: 1, tension: 220, friction: 10, useNativeDriver: true }),
    ]).start();
    setTab(t);
  };

  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      {/* Sliding top-edge indicator bar */}
      <Animated.View
        style={[
          styles.indicator,
          { width: tabWidth, transform: [{ translateX: indicatorX }] },
        ]}
      />

      {/* Glass surface overlay */}
      <View style={styles.glass} pointerEvents="none" />

      {TABS.map((t, i) => {
        const active = tab === t.key;
        return (
          <Animated.View
            key={t.key}
            style={[styles.tabWrapper, { transform: [{ scale: scales[i] }] }]}
          >
            <TouchableOpacity
              onPress={() => handlePress(t.key, i)}
              style={styles.tabBtn}
              activeOpacity={0.9}
            >
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Text style={[styles.icon, active && styles.iconActive]}>{t.icon}</Text>
                {/* Active glow dot */}
                {active && <View style={styles.glowDot} />}
              </View>
              <Text style={[styles.label, active && styles.labelActive]}>{t.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229,233,242,0.7)',
    paddingTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 16,
    position: 'relative',
  },
  glass: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  tabWrapper: { flex: 1, alignItems: 'center' },
  tabBtn: { alignItems: 'center', paddingTop: 2, paddingBottom: 2 },
  iconWrap: {
    width: 42,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  glowDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  icon: { fontSize: 17, color: colors.textMuted, fontWeight: '700', lineHeight: 20 },
  iconActive: { color: '#fff' },
  label: { fontSize: 10, color: colors.textMuted, marginTop: 4, fontWeight: '700', letterSpacing: 0.3 },
  labelActive: { color: colors.primary },
});
