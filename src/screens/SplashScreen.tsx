import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';
import { useNav } from '../navigation/NavContext';

export const SplashScreen: React.FC = () => {
  const { replace } = useNav();
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(lift, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
    const t = setTimeout(() => replace('Login'), 2000);
    return () => clearTimeout(t);
  }, [fade, lift, pulse, replace]);

  // Build subtle factory grid pattern via positioned dots.
  const dots = [];
  for (let r = 0; r < 14; r++) {
    for (let c = 0; c < 8; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            top: 30 + r * 50,
            left: 24 + c * 50,
            width: 3,
            height: 3,
            borderRadius: 2,
            backgroundColor: colors.border,
          }}
        />,
      );
    }
  }

  return (
    <View style={styles.root}>
      {dots}
      <Animated.View
        style={[
          styles.brandWrap,
          { opacity: fade, transform: [{ translateY: lift }] },
        ]}
      >
        <View style={styles.logoOuter}>
          <Animated.View
            style={[
              styles.logoPulse,
              {
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.45] }),
                transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }],
              },
            ]}
          />
          <View style={styles.logoCore}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>
        <Text style={styles.brand}>FactoryOps ERP</Text>
        <Text style={styles.tagline}>Smart Manufacturing. Smarter Operations.</Text>

        <View style={styles.loaderRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.loaderDot,
                {
                  opacity: pulse.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: i === 0 ? [0.3, 1, 0.3] : i === 1 ? [0.6, 0.3, 1] : [1, 0.6, 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0 · Enterprise · Secure</Text>
        <Text style={styles.footerSub}>by Udyoven Industries</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  brandWrap: { alignItems: 'center' },
  logoOuter: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logoPulse: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryLight,
  },
  logoCore: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.raised,
  },
  logoText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },
  brand: { fontSize: 26, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  tagline: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  loaderRow: { flexDirection: 'row', marginTop: spacing.xxl },
  loaderDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.accent, marginHorizontal: 4,
  },
  footer: { position: 'absolute', bottom: 32, alignItems: 'center' },
  footerText: { fontSize: 11, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5 },
  footerSub: { fontSize: 10, color: colors.textSubtle, marginTop: 2 },
});
