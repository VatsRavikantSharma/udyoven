import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, Chips, Progress, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { productionJobs, productionSummary } from '../data/mockData';
import { colors, radius, spacing, typography } from '../theme';

const STATUS_TONE: Record<string, string> = {
  Running: 'success', Idle: 'steel', Maintenance: 'warning',
  Hold: 'danger', 'QC Wait': 'info', Completed: 'primary',
};

export const ProductionLiveScreen: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Running', 'Hold', 'Idle', 'QC Wait', 'Maintenance'];

  const list = filter === 'All' ? productionJobs : productionJobs.filter((j) => j.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Live Production" subtitle="Smart Factory Control Room" rightIcon="⟳" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>

        {/* Top summary */}
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {[
              { n: productionSummary.activeLines, l: 'Active lines' },
              { n: productionSummary.runningJobs, l: 'Running jobs' },
              { n: productionSummary.delayedJobs, l: 'Delayed', tone: colors.danger },
              { n: `${productionSummary.output}`, l: 'Output now' },
              { n: `${productionSummary.rejection}%`, l: 'Reject %' },
              { n: `${productionSummary.utilization}%`, l: 'Plant util' },
            ].map((k) => (
              <View key={k.l} style={styles.kpi}>
                <Text style={[styles.kpiVal, { color: k.tone || colors.text }]}>{k.n}</Text>
                <Text style={styles.kpiLbl}>{k.l}</Text>
              </View>
            ))}
          </View>
        </Card>

        <SectionTitle title="Live plant heatmap" subtitle="Lines × Machines · status" />
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {productionJobs.map((j) => (
              <View key={j.id} style={[styles.heat, {
                backgroundColor:
                  j.status === 'Running' ? colors.success
                  : j.status === 'Hold' ? colors.danger
                  : j.status === 'QC Wait' ? colors.info
                  : j.status === 'Maintenance' ? colors.warning
                  : colors.steelLight,
              }]}>
                <Text style={styles.heatTxt}>{j.machine}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12, flexWrap: 'wrap' }}>
            {[
              ['Running', colors.success],
              ['Hold', colors.danger],
              ['QC Wait', colors.info],
              ['Maintenance', colors.warning],
              ['Idle', colors.steelLight],
            ].map(([l, c]) => (
              <View key={l as string} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 6 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c as string, marginRight: 4 }} />
                <Text style={typography.small}>{l}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ marginTop: spacing.md }}>
          <Chips options={filters} value={filter} onChange={setFilter} />
        </View>

        <SectionTitle title="Live batches" subtitle={`${list.length} batches`} />
        {list.map((j) => (
          <Card key={j.id} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.statusDot, { backgroundColor:
                j.status === 'Running' ? colors.success
                : j.status === 'Hold' ? colors.danger
                : j.status === 'QC Wait' ? colors.info
                : j.status === 'Maintenance' ? colors.warning
                : colors.steelLight,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>Batch {j.id} · {j.item}</Text>
                <Text style={typography.small}>{j.machine} · {j.line} · Shift {j.shift} · {j.supervisor}</Text>
              </View>
              <Badge text={j.status} tone={STATUS_TONE[j.status]} />
            </View>

            <View style={styles.statRow}>
              <Stat n={`${j.output}`} l="Output" />
              <Stat n={`${j.rejects}`} l="Rejects" tone={colors.danger} />
              <Stat n={`${j.eff}%`} l="Eff." />
              <Stat n={`${j.target}`} l="Target" />
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={typography.small}>Progress</Text>
                <Text style={[typography.small, { fontWeight: '800', color: colors.text }]}>{j.progress}%</Text>
              </View>
              <Progress value={j.progress} color={j.status === 'Hold' ? colors.danger : colors.primary} />
            </View>

            {j.status === 'Hold' ? (
              <View style={[styles.banner, { backgroundColor: colors.dangerBg }]}>
                <Text style={[styles.bannerText, { color: colors.danger }]}>
                  ⚠️ Anomaly: output below threshold · awaiting material (Sand). Reason logged.
                </Text>
              </View>
            ) : j.status === 'Running' && j.eff < 85 ? (
              <View style={[styles.banner, { backgroundColor: colors.warningBg }]}>
                <Text style={[styles.bannerText, { color: '#92400E' }]}>
                  💡 Recommendation: increase feed rate by 6% to recover ~10 pcs/hr.
                </Text>
              </View>
            ) : null}
          </Card>
        ))}

        <SectionTitle title="Downtime today" subtitle="By reason" />
        <Card>
          {[
            { r: 'Material wait', m: 42, c: colors.warning },
            { r: 'Maintenance',   m: 28, c: colors.info },
            { r: 'Operator break',m: 14, c: colors.steel },
            { r: 'Power dip',     m: 6,  c: colors.danger },
          ].map((d) => (
            <View key={d.r} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={typography.body}>{d.r}</Text>
                <Text style={typography.body}>{d.m} min</Text>
              </View>
              <View style={{ height: 6 }} />
              <Progress value={(d.m / 90) * 100} color={d.c} />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const Stat: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 16, fontWeight: '900', color: tone || colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{l}</Text>
  </View>
);

const styles = StyleSheet.create({
  kpi: { width: '33.3%', paddingVertical: 8 },
  kpiVal: { fontSize: 18, fontWeight: '900' },
  kpiLbl: { fontSize: 10, color: colors.textMuted, fontWeight: '700', marginTop: 2 },
  heat: {
    width: '15%', aspectRatio: 1, margin: '0.83%',
    borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  heatTxt: { color: '#fff', fontSize: 9, fontWeight: '800' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statRow: {
    flexDirection: 'row', marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  banner: { padding: 10, borderRadius: radius.sm, marginTop: 10 },
  bannerText: { fontSize: 11, fontWeight: '700' },
});
