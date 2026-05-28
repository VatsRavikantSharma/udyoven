import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Card, Progress, SectionTitle, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { productionJobs, productionSummary } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Daily', 'Weekly', 'Monthly'];
const READY_TONE: Record<string, string> = {
  'Material OK': 'success', 'Awaiting Sand': 'warning', 'Material Pending': 'danger',
};

export const ProductionPlanScreen: React.FC = () => {
  const { push } = useNav();
  const [tab, setTab] = useState('Daily');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Production Planning" subtitle="6 batches scheduled today" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Tabs options={TABS} value={tab} onChange={setTab} />

        <Card style={{ marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row' }}>
            <Mini n={`${productionSummary.activeLines}`} l="Active lines" />
            <Mini n={`${productionSummary.runningJobs}`} l="Jobs running" />
            <Mini n={`${productionSummary.delayedJobs}`} l="Delayed" tone={colors.danger} />
            <Mini n={`${productionSummary.utilization}%`} l="Utilization" />
          </View>
        </Card>

        <SectionTitle title={`${tab} planning`} subtitle="Tap a day to expand" />
        <Card padded={false}>
          <View style={styles.calRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
              const active = i === 2;
              const load = [60, 78, 90, 72, 85, 40, 0][i];
              return (
                <View key={d} style={[styles.calCell, active && styles.calCellActive]}>
                  <Text style={[styles.calDay, active && { color: '#fff' }]}>{d}</Text>
                  <Text style={[styles.calDate, active && { color: '#fff' }]}>{20 + i}</Text>
                  <View style={[styles.calBar, active && { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                    <View style={{
                      width: `${load}%`, height: '100%',
                      backgroundColor: active ? '#fff' : load > 80 ? colors.danger : load > 60 ? colors.warning : colors.success,
                      borderRadius: 4,
                    }} />
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        <SectionTitle title="Job queue" subtitle="Drag-equivalent reorder · tap to manage" />

        {productionJobs.map((j) => (
          <Card key={j.id} style={{ marginBottom: 10 }} onPress={() => push('ProductionLive')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.batch}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>{j.id}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={typography.h3}>{j.item}</Text>
                <Text style={typography.small}>Order #{j.order} · {j.qty} pcs · Required by 24 Apr</Text>
              </View>
              <Badge text={j.readiness} tone={READY_TONE[j.readiness] || 'steel'} />
            </View>
            <View style={styles.metaRow}>
              <Meta l="Machine" v={j.machine} />
              <Meta l="Line" v={j.line} />
              <Meta l="Shift" v={j.shift} />
              <Meta l="Supervisor" v={j.supervisor} />
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={typography.small}>Target {j.target} · Output {j.output}</Text>
                <Text style={[typography.small, { fontWeight: '800', color: colors.text }]}>{j.progress}%</Text>
              </View>
              <Progress value={j.progress} color={j.progress > 0 ? colors.primary : colors.divider} />
            </View>
          </Card>
        ))}

        <SectionTitle title="Capacity & target" />
        <Card>
          <Row2 a={['Plant capacity', '8,400 pcs/day']} b={['Today plan', '6,012 pcs']} />
          <Row2 a={['Booked', '5,820 pcs']} b={['Ach. so far', '4,128 pcs']} />
          <Row2 a={['Worker shifts', '2 (A, B)']} b={['Open positions', '3 operators']} />
        </Card>

        <SectionTitle title="Quick actions" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {['Plan batch', 'Reassign line', 'Split batch', 'Hold production', 'Expedite order', 'Print sheet'].map((a) => (
            <TouchableOpacity key={a} style={styles.qa}>
              <Text style={styles.qaText}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Open live production tracker" full style={{ marginTop: spacing.lg }} onPress={() => push('ProductionLive')} />
      </ScrollView>
    </View>
  );
};

const Mini: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 18, fontWeight: '900', color: tone || colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 2 }}>{l}</Text>
  </View>
);
const Meta: React.FC<{ l: string; v: string }> = ({ l, v }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{l}</Text>
    <Text style={{ fontSize: 12, color: colors.text, fontWeight: '700', marginTop: 2 }}>{v}</Text>
  </View>
);
const Row2: React.FC<{ a: [string, string]; b: [string, string] }> = ({ a, b }) => (
  <View style={{ flexDirection: 'row', paddingVertical: 6 }}>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '700' }}>{a[0]}</Text>
      <Text style={{ fontSize: 13, color: colors.text, fontWeight: '800', marginTop: 2 }}>{a[1]}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '700' }}>{b[0]}</Text>
      <Text style={{ fontSize: 13, color: colors.text, fontWeight: '800', marginTop: 2 }}>{b[1]}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  calRow: { flexDirection: 'row', padding: 10 },
  calCell: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, marginHorizontal: 2 },
  calCellActive: { backgroundColor: colors.primary },
  calDay: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  calDate: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 2 },
  calBar: { width: '70%', height: 4, backgroundColor: colors.divider, marginTop: 8, borderRadius: 4, overflow: 'hidden' },
  batch: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row', marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  qa: {
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    marginRight: 8, marginBottom: 8,
  },
  qaText: { fontSize: 12, fontWeight: '700', color: colors.text },
});
