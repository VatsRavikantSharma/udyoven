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
import { Card, Button } from '../components/UI';
import { roles } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing } from '../theme';

export const LoginScreen: React.FC = () => {
  const { reset, setRole } = useNav();
  const [id, setId] = useState('owner@udyoven.com');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [selectedRole, setSelectedRoleLocal] = useState(roles[0]);

  const submit = () => {
    setRole(selectedRole);
    reset('Main');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoLetter}>U</Text>
          </View>
          <Text style={styles.brandName}>Udyoven Trade</Text>
          <Text style={styles.brandTag}>B2B Factory & Vendor Marketplace</Text>
          <Text style={styles.brandSub}>
            Professional Quotation & Product Negotiation Platform
          </Text>
        </View>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statN}>1,200+</Text>
            <Text style={styles.statL}>Factories</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCell}>
            <Text style={styles.statN}>8,400+</Text>
            <Text style={styles.statL}>Products</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCell}>
            <Text style={styles.statN}>Rs.240Cr+</Text>
            <Text style={styles.statL}>Deals Closed</Text>
          </View>
        </View>

        {/* Login Card */}
        <Card style={styles.card}>
          <Text style={styles.formTitle}>Sign in to continue</Text>
          <Text style={styles.formSub}>Access your quotation dashboard</Text>

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
          <TextInput
            value={pw}
            onChangeText={setPw}
            style={styles.input}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor={colors.textSubtle}
          />

          {/* Role Selector */}
          <Text style={styles.lbl}>Login As</Text>
          <View style={styles.roleRow}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setSelectedRoleLocal(r)}
                style={[
                  styles.roleChip,
                  selectedRole === r && styles.roleChipActive,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.roleChipText,
                    selectedRole === r && styles.roleChipTextActive,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.rememberRow}>
            <Switch
              value={remember}
              onValueChange={setRemember}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={remember ? colors.primary : '#ccc'}
            />
            <Text style={styles.rememberText}>Keep me signed in</Text>
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={submit} activeOpacity={0.88}>
            <Text style={styles.loginBtnText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            New to Udyoven?{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>Register your business</Text>
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
  },
  brandSection: { alignItems: 'center', marginBottom: spacing.xxl },
  logoWrap: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  logoLetter: { fontSize: 36, fontWeight: '900', color: '#fff' },
  brandName: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  brandTag: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  brandSub: {
    fontSize: 11, fontWeight: '500', color: 'rgba(255,255,255,0.55)',
    marginTop: 6, textAlign: 'center', maxWidth: 260, lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statN: { fontSize: 16, fontWeight: '900', color: '#fff' },
  statL: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginTop: 3 },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  card: { borderRadius: radius.xl, padding: spacing.xl, ...shadow.raised },
  formTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
  formSub: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xl },
  lbl: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  roleChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: colors.border,
    marginRight: 8, marginBottom: 8,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleChipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  roleChipTextActive: { color: '#fff' },
  rememberRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl,
  },
  rememberText: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginLeft: 8 },
  forgotText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  loginBtnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  signupText: { textAlign: 'center', fontSize: 13, color: colors.textMuted, fontWeight: '500' },
});
