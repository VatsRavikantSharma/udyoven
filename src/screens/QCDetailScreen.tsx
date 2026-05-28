import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { qcChecklist, qcInspections } from '../data/mockData';
import { colors, radius, spacing, typography } from '../theme';

export const QCDetailScreen: React.FC<{ params?: any }> = ({ params }) => {
  const q = params || qcInspections[0];
  const passed = qcChecklist.filter((c) => c.pass).length;
  const failed = qcChecklist.length - passed;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={`Inspection ${q.id}`} subtitle={`Batch ${q.batch} · ${q.product}`} rightIcon="↗" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={typography.h2}>Batch {q.batch}</Text>
              <Text style={typography.small}>{q.product} · Order #{q.order}</Text>
            </View>
            <Badge text={q.stage} tone="primary" />
          </View>
          <Divider />
          <Row label="Inspector"   value={q.inspector} />
          <Row label="Date / Time" value="22 Apr 2026 · 12:14" />
          <Row label="Quantity"    value={`${q.qty} pcs`} />
          <Row label="Status"      value={<Badge text={q.status} tone="info" />} />
        </Card>

        <SectionTitle title="Checklist & measurements" subtitle={`${passed} pass · ${failed} fail`} />
        <Card padded={false}>
          {qcChecklist.map((c, i) => (
            <View key={c.item} style={[styles.checkRow, i !== qcChecklist.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <View style={[styles.checkDot, { backgroundColor: c.pass ? colors.success : colors.danger }]}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>{c.pass ? '✓' : '✕'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={typography.body}>{c.item}</Text>
                <Text style={typography.small}>Tolerance: {c.tol}</Text>
              </View>
              <Text style={[typography.body, { color: c.pass ? colors.text : colors.danger, fontWeight: '900' }]}>{c.value}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle title="Summary" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {[
            { n: '6.0%', l: 'Defect %', tone: colors.danger },
            { n: '188', l: 'Passed' },
            { n: '12', l: 'Rejected', tone: colors.danger },
            { n: '0', l: 'Rework' },
          ].map((m) => (
            <View key={m.l} style={styles.sum}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: m.tone || colors.text }}>{m.n}</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '700' }}>{m.l}</Text>
            </View>
          ))}
        </View>

        <SectionTitle title="Defect observations" />
        <Card>
          <Text style={typography.body}>• Hardness above tolerance on 12 pcs (HRC 34 vs 28-32)</Text>
          <Text style={typography.body}>• Minor burrs on 4 pcs at OD edge</Text>
          <Text style={typography.body}>• Threading uniformly OK across sample</Text>
        </Card>

        <SectionTitle title="Linked impact" />
        <Card>
          <Row label="Order"  value={`#${q.order} · Tata Forge`} />
          <Row label="Plant" value="Plant 1 — Pune" />
          <Row label="Reschedule risk" value={<Badge text="MEDIUM" tone="warning" />} />
        </Card>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.lg }}>
          <Button label="✓ Approve" full style={{ flex: 1, marginRight: 8, marginBottom: 8 }} />
          <Button label="✕ Reject"  variant="danger" full style={{ flex: 1, marginBottom: 8 }} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button label="↻ Rework" variant="secondary" full style={{ flex: 1, marginRight: 8 }} />
          <Button label="⏸ Hold"   variant="secondary" full style={{ flex: 1 }} />
        </View>

        <Button label="Download QC Report (PDF)" variant="ghost" full style={{ marginTop: 10 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  checkDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sum: { width: '48.5%', backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
});
