import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Badge, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { company, roles } from '../data/mockData';
import { colors, radius, spacing, typography } from '../theme';

export const CompanyProfileScreen: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScreenHeader title="Company Profile" subtitle={company.name} rightIcon="✎" />
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <Card>
        <Text style={typography.h2}>{company.name}</Text>
        <Text style={typography.small}>Manufacturing · MSME · Est. 1998</Text>
        <Divider />
        <Row label="GSTIN"     value="27ABCDE1234F1Z5" />
        <Row label="PAN"       value="ABCDE1234F" />
        <Row label="Email"     value="ops@udyoven.com" />
        <Row label="Phone"     value="+91 20 4000 1234" />
        <Row label="Plants"    value={`${company.units.length}`} />
        <Row label="Workforce" value="248" />
      </Card>

      <SectionTitle title="Plants" />
      {company.units.map((u) => (
        <Card key={u} style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={typography.body}>{u}</Text>
            <Badge text="Active" tone="success" />
          </View>
        </Card>
      ))}

      <SectionTitle title="Branding" />
      <Card>
        <Row label="Brand color"  value={<View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary }} />} />
        <Row label="Logo"  value="logo.png" />
        <Row label="Invoice template" value="Premium · v3" />
      </Card>

      <SectionTitle title="Compliance" />
      <Card>
        <Row label="ISO 9001:2015" value={<Badge text="Valid" tone="success" />} />
        <Row label="ISO 14001"     value={<Badge text="Valid" tone="success" />} />
        <Row label="MSME Udyam"     value={<Badge text="Registered" tone="accent" />} />
      </Card>
    </ScrollView>
  </View>
);

export const UserRolesScreen: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScreenHeader title="User Roles" subtitle="8 roles · 24 users" rightIcon="＋" />
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      {roles.map((r) => (
        <Card key={r} style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={typography.h3}>{r}</Text>
              <Text style={typography.small}>3 users · access scope: {r === 'Owner' ? 'Full' : 'Module'}</Text>
            </View>
            <Badge text={r === 'Owner' ? 'ADMIN' : 'STD'} tone={r === 'Owner' ? 'danger' : 'primary'} />
          </View>
        </Card>
      ))}
    </ScrollView>
  </View>
);

export const PreferencesScreen: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScreenHeader title="Preferences" />
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <Card>
        <PrefRow label="Language" value="English (India)" />
        <PrefRow label="Currency" value="INR (₹)" />
        <PrefRow label="Date format" value="DD MMM YYYY" />
        <PrefRow label="Theme" value="Light" />
      </Card>
      <SectionTitle title="Behavior" />
      <Card>
        <PrefRow label="Show AI insights on home" toggle />
        <PrefRow label="Auto-export daily report" toggle />
        <PrefRow label="Sound on critical alert" toggle defaultOn />
        <PrefRow label="Haptics" toggle defaultOn />
      </Card>
    </ScrollView>
  </View>
);

const PrefRow: React.FC<{ label: string; value?: string; toggle?: boolean; defaultOn?: boolean }> = ({ label, value, toggle, defaultOn }) => {
  const [on, set] = React.useState(!!defaultOn);
  return (
    <View style={prStyles.row}>
      <Text style={typography.body}>{label}</Text>
      {toggle ? <Switch value={on} onValueChange={set} /> : <Text style={typography.bodyMuted}>{value}</Text>}
    </View>
  );
};
const prStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
});

export const DevicesScreen: React.FC = () => (
  <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <ScreenHeader title="Devices & Sensors" subtitle="IoT integrations · 14 connected" rightIcon="＋" />
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <SectionTitle title="Connected systems" />
      {[
        { n: 'MES Gateway',         t: 'OPC-UA', s: 'Online', tone: 'success' },
        { n: 'Energy Meter (Plant 1)', t: 'Modbus', s: 'Online', tone: 'success' },
        { n: 'CNC Sensor Pack',     t: 'MQTT',  s: 'Online', tone: 'success' },
        { n: 'Furnace Thermocouple',t: 'Modbus',s: 'Drift detected', tone: 'warning' },
        { n: 'Vibration Sensor LAT-02', t: 'BLE', s: 'Offline', tone: 'danger' },
        { n: 'CCTV Stream',          t: 'RTSP', s: 'Online', tone: 'success' },
      ].map((d) => (
        <Card key={d.n} style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={dvStyles.icon}><Text style={{ fontSize: 18 }}>📡</Text></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={typography.h3}>{d.n}</Text>
              <Text style={typography.small}>Protocol: {d.t}</Text>
            </View>
            <Badge text={d.s} tone={d.tone} />
          </View>
        </Card>
      ))}
    </ScrollView>
  </View>
);

const dvStyles = StyleSheet.create({
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
});
