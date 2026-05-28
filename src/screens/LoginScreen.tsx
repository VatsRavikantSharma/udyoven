import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Chips, Card } from '../components/UI';
import { roles } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing } from '../theme';

export const LoginScreen: React.FC = () => {
  const { reset, setRole } = useNav();
  const [id, setId] = useState('owner@udyoven.com');
  const [pw, setPw] = useState('••••••••');
  const [remember, setRemember] = useState(true);
  const [role, setRoleLocal] = useState(roles[1]);

  const submit = () => {
    setRole(role);
    reset('Main');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Brand */}
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <View>
            <Text style={styles.brand}>FactoryOps ERP</Text>
            <Text style={styles.tagline}>Udyoven Industries</Text>
          </View>
        </View>

        {/* Hero illustration card (abstract) */}
        <Card style={{ marginBottom: spacing.lg, padding: 0, overflow: 'hidden' }}>
          <View style={styles.hero}>
            <View style={styles.heroGrid}>
              {Array.from({ length: 6 }).map((_, r) => (
                <View key={r} style={styles.heroRow}>
                  {Array.from({ length: 8 }).map((__, c) => (
                    <View
                      key={c}
                      style={[
                        styles.heroDot,
                        (r + c) % 5 === 0 && { backgroundColor: colors.accent, opacity: 0.6 },
                        (r + c) % 7 === 0 && { backgroundColor: colors.primaryLight, opacity: 0.7 },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.heroText}>
              <Badge text="LIVE PLANT" tone="accent" dot />
              <Text style={styles.heroTitle}>Welcome back,</Text>
              <Text style={styles.heroSub}>Secure access to your factory operations.</Text>
              <View style={styles.heroStats}>
                <View>
                  <Text style={styles.statN}>17</Text>
                  <Text style={styles.statL}>Active Jobs</Text>
                </View>
                <View style={styles.statDiv} />
                <View>
                  <Text style={styles.statN}>96%</Text>
                  <Text style={styles.statL}>Uptime</Text>
                </View>
                <View style={styles.statDiv} />
                <View>
                  <Text style={styles.statN}>42</Text>
                  <Text style={styles.statL}>Orders</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <Card style={{ marginBottom: spacing.lg }}>
          <Text style={styles.formTitle}>Sign in to continue</Text>

          <Text style={styles.lbl}>Email or Phone</Text>
          <TextInput
            value={id}
            onChangeText={setId}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@company.com"
            placeholderTextColor={colors.textSubtle}
          />

          <Text style={styles.lbl}>Password</Text>
          <View style={styles.pwRow}>
            <TextInput
              value={pw}
              onChangeText={setPw}
              style={[styles.input, { flex: 1, marginRight: 8, marginBottom: 0 }]}
              secureTextEntry
              placeholderTextColor={colors.textSubtle}
            />
            <TouchableOpacity style={styles.bioBtn}>
              <Text style={{ fontSize: 18 }}>👆</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <View style={styles.rememberRow}>
              <Switch value={remember} onValueChange={setRemember} />
              <Text style={styles.rememberTxt}>Remember device</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: spacing.md }} />
          <Text style={styles.lbl}>Select your role</Text>
          <Chips options={roles} value={role} onChange={setRoleLocal} />

          <View style={{ height: spacing.md }} />
          <Button label="Sign in securely  →" onPress={submit} full />

          <View style={styles.secureRow}>
            <Text style={styles.secureIcon}>🔒</Text>
            <Text style={styles.secureText}>
              Secure access to your factory operations
            </Text>
          </View>
        </Card>

        <Card>
          <View style={styles.bioCard}>
            <View style={styles.bioIcon}><Text style={{ fontSize: 22 }}>🪪</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bioTitle}>Biometric Login</Text>
              <Text style={styles.bioSub}>Use Face ID / Fingerprint on this device</Text>
            </View>
            <Switch value={true} />
          </View>
        </Card>

        <Text style={styles.footer}>
          By continuing you agree to our Terms & Privacy.{'\n'}
          © Udyoven Industries · ISO 27001 · SOC 2
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingTop: spacing.xxl + 8, paddingBottom: spacing.xxl },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
    ...shadow.card,
  },
  logoText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  brand: { fontSize: 18, fontWeight: '900', color: colors.text },
  tagline: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  hero: { padding: spacing.lg, backgroundColor: colors.primary },
  heroGrid: { position: 'absolute', top: 12, right: 12, opacity: 0.4 },
  heroRow: { flexDirection: 'row' },
  heroDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)', margin: 4,
  },
  heroText: {},
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 10 },
  heroSub: { color: '#CBD5E1', fontSize: 12, marginTop: 4, fontWeight: '500' },
  heroStats: {
    flexDirection: 'row', alignItems: 'center', marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.08)', padding: 12, borderRadius: radius.md,
  },
  statN: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statL: { color: '#CBD5E1', fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  statDiv: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.18)', marginHorizontal: 14 },
  formTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  lbl: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 6, marginTop: 4, letterSpacing: 0.3 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: colors.text, marginBottom: spacing.md,
  },
  pwRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  bioBtn: {
    width: 46, height: 46, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  rememberTxt: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginLeft: 6 },
  link: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  secureRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, justifyContent: 'center' },
  secureIcon: { fontSize: 12, marginRight: 6 },
  secureText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  bioCard: { flexDirection: 'row', alignItems: 'center' },
  bioIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  bioTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  bioSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  footer: { textAlign: 'center', fontSize: 10, color: colors.textSubtle, marginTop: spacing.xl, lineHeight: 16 },
});
