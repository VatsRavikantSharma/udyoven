import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card, SectionTitle } from '../components/UI';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing } from '../theme';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Edit Profile', icon: 'P', route: 'Profile' },
      { label: 'Company Settings', icon: 'C', route: null },
      { label: 'Change Password', icon: 'K', route: null },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { label: 'Quotation Alerts', icon: 'Q', toggle: true, defaultOn: true },
      { label: 'Chat Notifications', icon: 'C', toggle: true, defaultOn: true },
      { label: 'Deal Updates', icon: 'D', toggle: true, defaultOn: true },
      { label: 'Product Inquiries', icon: 'I', toggle: true, defaultOn: false },
    ],
  },
  {
    title: 'App Preferences',
    items: [
      { label: 'Language: English', icon: 'L', route: null },
      { label: 'Currency: INR (Rs.)', icon: '$', route: null },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', icon: '?', route: null },
      { label: 'Contact Support', icon: 'S', route: null },
      { label: 'About Udyoven', icon: 'A', route: null },
      { label: 'Terms & Privacy Policy', icon: 'T', route: null },
    ],
  },
];

export const SettingsScreen: React.FC = () => {
  const { pop, reset, push } = useNav();
  const [toggles, setToggle] = React.useState<Record<string, boolean>>({
    'Quotation Alerts': true,
    'Chat Notifications': true,
    'Deal Updates': true,
    'Product Inquiries': false,
  });

  const flipToggle = (label: string) => {
    setToggle((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Settings" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: spacing.lg }}>
            <SectionTitle title={section.title} />
            <Card padded={false} style={{ marginHorizontal: spacing.xl }}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingRow,
                    i < section.items.length - 1 && styles.settingBorder,
                  ]}
                  onPress={() => {
                    if ('route' in item && item.route) push(item.route as any);
                  }}
                  activeOpacity={'toggle' in item && item.toggle ? 1 : 0.8}
                >
                  <View style={styles.settingIcon}>
                    <Text style={styles.settingIconText}>{item.icon}</Text>
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  {'toggle' in item && item.toggle ? (
                    <Switch
                      value={toggles[item.label] ?? false}
                      onValueChange={() => flipToggle(item.label)}
                      trackColor={{ false: colors.border, true: colors.primary + '60' }}
                      thumbColor={toggles[item.label] ? colors.primary : colors.textSubtle}
                    />
                  ) : (
                    <Text style={styles.chevron}>{'>'}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout */}
        <View style={{ paddingHorizontal: spacing.xl, marginTop: spacing.sm, marginBottom: spacing.xl }}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => reset('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.lg,
  },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  settingIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingIconText: { fontSize: 14, fontWeight: '900', color: colors.primary },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  chevron: { fontSize: 16, fontWeight: '700', color: colors.textSubtle },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.lg, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.danger + '30',
  },
  logoutText: { fontSize: 15, fontWeight: '800', color: colors.danger },
});
