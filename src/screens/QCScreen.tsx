import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, BarChart, Card, SearchBar, SectionTitle, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { qcInspections } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Pending Inspection', 'In Inspection', 'Passed', 'Rejected', 'Rework', 'Hold'];
const TONE: Record<string, string> = {
  'Pending Inspection': 'steel', 'In Inspection': 'info', Passed: 'success',
  Rejected: 'danger', Rework: 'warning', Hold: 'orange',
};

export const QCScreen: React.FC = () => {
  const { push } = useNav();
  const [tab, setTab] = useState(TABS[1]);
  const list = useMemo(() => qcInspections.filter((q) => q.status === tab), [tab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Quality Control" subtitle="Today: 4 hold · 2 rework · 6 passed" rightIcon="＋" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <SearchBar placeholder="Search batch, order, product, inspector…" />
        <View style={{ height: spacing.md }} />
        <Tabs options={TABS} value={tab} onChange={setTab} />

        <View style={styles.summary}>
          <Mini n="98.4%" l="Acceptance" tone={colors.success} />
          <Mini n="1.7%"  l="Reject %" tone={colors.danger} />
          <Mini n="42"    l="Inspections" />
          <Mini n="3"     l="Defect cats." tone={colors.warning} />
        </View>

        <SectionTitle title="Rejection trend" subtitle="Last 7 days" />
        <Card>
          <BarChart data={[2.1, 1.8, 2.4, 1.2, 1.9, 1.5, 1.7]} color={colors.danger} labels={['M','T','W','T','F','S','S']} height={90} />
        </Card>

        <SectionTitle title={`${tab} · ${list.length}`} action="Filters" />
        {list.length === 0 ? (
          <Card><Text style={typography.bodyMuted}>No inspections under this tab.</Text></Card>
        ) : list.map((q) => (
          <Card key={q.id} style={{ marginBottom: 10 }} onPress={() => push('QCDetail', q)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.batchTag}>
                <Text style={styles.batchTagTxt}>{q.batch}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={typography.h3}>{q.id} · {q.product}</Text>
                <Text style={typography.small}>Order #{q.order} · Qty {q.qty} · {q.stage}</Text>
              </View>
              <Badge text={q.status} tone={TONE[q.status]} />
            </View>
            <View style={styles.row}>
              <Cell l="Inspector" v={q.inspector} />
              <Cell l="Defects" v={`${q.defects}`} tone={colors.danger} />
              <Cell l="Reject %" v={`${q.rejectPct}%`} tone={q.rejectPct > 5 ? colors.danger : q.rejectPct > 2 ? colors.warning : colors.success} />
            </View>
          </Card>
        ))}

        <SectionTitle title="Defect heatmap by product" />
        <Card>
          {['CNC Bracket', 'Sheet Cover', 'Brake Drum', 'Sprocket', 'Pinion'].map((p, i) => (
            <View key={p} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={[typography.small, { width: 110 }]}>{p}</Text>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {Array.from({ length: 10 }).map((_, j) => {
                  const v = (i * 13 + j * 7) % 10; // pseudo
                  const c = v > 7 ? colors.danger : v > 4 ? colors.warning : v > 2 ? colors.accent : colors.divider;
                  return <View key={j} style={{ flex: 1, height: 14, backgroundColor: c, marginHorizontal: 1, borderRadius: 3 }} />;
                })}
              </View>
            </View>
          ))}
        </Card>

        <SectionTitle title="AI quality alerts" />
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.danger, marginBottom: 10 }}>
          <Text style={typography.body}>{'🚨 Repeated defect pattern: hardness > 32 HRC on Batch B17 & B12. Suggest furnace recalibration.'}</Text>
        </Card>
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.warning }}>
          <Text style={typography.body}>⚠️ Vendor "Pune Castings" quality dropping over last 3 lots. Review.</Text>
        </Card>
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
const Cell: React.FC<{ l: string; v: string; tone?: string }> = ({ l, v, tone }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{l}</Text>
    <Text style={{ fontSize: 13, color: tone || colors.text, fontWeight: '800', marginTop: 2 }}>{v}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  batchTag: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  batchTagTxt: { color: '#fff', fontWeight: '900' },
  row: { flexDirection: 'row', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.divider },
});
