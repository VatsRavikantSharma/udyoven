import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, BarChart, Card, Progress, SectionTitle, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { machines, maintenanceLog } from '../data/mockData';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Live Machines', 'Maintenance', 'Breakdowns', 'Sensor Alerts', 'Energy'];
const TONE: Record<string, string> = {
  Running: 'success', Idle: 'steel', Maintenance: 'warning',
  Overheating: 'danger', 'Sensor Fault': 'danger',
};

export const MachinesScreen: React.FC = () => {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Machines" subtitle="Industry 4.0 monitoring" rightIcon="⟳" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Tabs options={TABS} value={tab} onChange={setTab} />

        <View style={styles.summary}>
          <Mini n="6" l="Machines" />
          <Mini n="3" l="Running" tone={colors.success} />
          <Mini n="2" l="Faults" tone={colors.danger} />
          <Mini n="64%" l="Avg util" />
        </View>

        {tab === 'Live Machines' && (
          <>
            <SectionTitle title="Machine status" subtitle="Real-time IoT readings" />
            {machines.map((m) => (
              <Card key={m.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.idTag, { backgroundColor: TONE[m.status] === 'danger' ? colors.danger : TONE[m.status] === 'warning' ? colors.warning : TONE[m.status] === 'success' ? colors.success : colors.steel }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{m.id}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={typography.h3}>{m.name}</Text>
                    <Text style={typography.small}>{m.line} · Maint due {m.due}</Text>
                  </View>
                  <Badge text={m.status} tone={TONE[m.status]} />
                </View>
                <View style={styles.statRow}>
                  <Stat n={`${m.temp}°C`} l="Temp" tone={m.temp > 80 ? colors.danger : colors.text} />
                  <Stat n={m.vib}        l="Vibration" tone={m.vib === 'High' ? colors.danger : m.vib === 'Sensor!' ? colors.danger : colors.text} />
                  <Stat n={`${m.runtime}h`} l="Runtime" />
                  <Stat n={`${m.downtime}h`} l="Downtime" />
                </View>
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={typography.small}>Utilization</Text>
                    <Text style={[typography.small, { fontWeight: '800', color: colors.text }]}>{m.util}%</Text>
                  </View>
                  <Progress value={m.util} color={m.util < 50 ? colors.danger : m.util < 80 ? colors.warning : colors.success} />
                </View>
                {m.status === 'Overheating' ? (
                  <View style={[styles.banner, { backgroundColor: colors.dangerBg }]}>
                    <Text style={[styles.bannerText, { color: colors.danger }]}>🔥 Temperature exceeded threshold (85°C). Auto-stop in 5 min.</Text>
                  </View>
                ) : m.status === 'Sensor Fault' ? (
                  <View style={[styles.banner, { backgroundColor: colors.dangerBg }]}>
                    <Text style={[styles.bannerText, { color: colors.danger }]}>📡 Vibration sensor reading abnormal. Schedule field inspection.</Text>
                  </View>
                ) : null}
              </Card>
            ))}

            <SectionTitle title="Predictive maintenance" />
            <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.accent, marginBottom: 10 }}>
              <Text style={typography.body}>🤖 CNC-03 spindle bearing predicted failure in ~120 hrs. Schedule preventive service this weekend.</Text>
            </Card>
            <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.warning }}>
              <Text style={typography.body}>⚠️ Furnace #2 thermocouple drift detected — recalibrate within 7 days.</Text>
            </Card>
          </>
        )}

        {tab === 'Maintenance' && (
          <>
            <SectionTitle title="This week" />
            <Card padded={false}>
              {[
                { d: 'Mon 22', m: 'CNC-03', t: 'Lubrication',   tech: 'R. Patil' },
                { d: 'Wed 24', m: 'PRS-04', t: 'Inspection',    tech: 'S. Kale' },
                { d: 'Fri 26', m: 'FUR-02', t: 'Recalibration', tech: 'A. Khan' },
              ].map((s, i, a) => (
                <View key={s.d} style={[styles.calRow, i !== a.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                  <View style={styles.calDate}><Text style={{ fontSize: 11, fontWeight: '800', color: colors.text }}>{s.d}</Text></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={typography.body}>{s.m} · {s.t}</Text>
                    <Text style={typography.small}>Assigned to {s.tech}</Text>
                  </View>
                  <Badge text="Scheduled" tone="info" />
                </View>
              ))}
            </Card>

            <SectionTitle title="Service history" />
            {maintenanceLog.map((l) => (
              <Card key={l.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={typography.h3}>{l.machine} · {l.type}</Text>
                    <Text style={typography.small}>{l.date} · {l.tech} · {l.hours}h</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>₹{l.cost.toLocaleString('en-IN')}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'Breakdowns' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Downtime reasons (this week)</Text>
            <View style={{ height: 8 }} />
            <BarChart data={[42, 28, 14, 6, 18]} color={colors.danger} labels={['Material', 'Maint', 'Break', 'Power', 'Other']} />
          </Card>
        )}

        {tab === 'Sensor Alerts' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Live sensor stream</Text>
            <Text style={typography.small}>3 abnormal readings in last 60 min</Text>
            <View style={{ height: 8 }} />
            {['CNC-03 · Temp 86°C', 'LAT-02 · Vibration sensor offline', 'PRS-04 · Hyd. pressure dip 4.2bar→3.8bar'].map((s) => (
              <Card key={s} style={{ marginBottom: 8, borderLeftWidth: 4, borderLeftColor: colors.danger }}>
                <Text style={typography.body}>{s}</Text>
              </Card>
            ))}
          </Card>
        )}

        {tab === 'Energy' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Energy consumption</Text>
            <Text style={typography.small}>kWh · 7 days</Text>
            <View style={{ height: 8 }} />
            <BarChart data={[3200, 3450, 3380, 3700, 3520, 3600, 3800]} color={colors.primary} labels={['M','T','W','T','F','S','S']} />
            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <Stat n="₹84k" l="Spend" />
              <Stat n="0.78" l="Spec/pcs" />
              <Stat n="−4%" l="vs LW" tone={colors.success} />
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const Mini: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={{ width: '23.5%', backgroundColor: colors.surface, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
    <Text style={{ fontSize: 14, fontWeight: '900', color: tone || colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 2 }}>{l}</Text>
  </View>
);
const Stat: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 16, fontWeight: '900', color: tone || colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{l}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: spacing.md },
  idTag: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  statRow: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  banner: { padding: 10, borderRadius: radius.sm, marginTop: 10 },
  bannerText: { fontSize: 11, fontWeight: '700' },
  calRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  calDate: { width: 56, height: 44, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
});
