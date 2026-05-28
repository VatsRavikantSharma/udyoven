import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { Order, orderTimeline, orders } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

export const OrderDetailScreen: React.FC<{ params?: Order }> = ({ params }) => {
  const order = params || orders[0];
  const { push } = useNav();
  const total = order.qty * order.rate;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={`Order #${order.id}`} subtitle={order.client} rightIcon="↗" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>

        {/* Hero */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={typography.h2}>{order.product}</Text>
              <Text style={[typography.small, { marginTop: 4 }]}>
                {order.qty} {order.unit} · ₹{order.rate.toLocaleString('en-IN')} per {order.unit}
              </Text>
              <Text style={[typography.h2, { marginTop: 10, color: colors.primary }]}>
                ₹{total.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Badge text={order.priority + ' Priority'} tone={order.priority === 'High' ? 'danger' : 'warning'} />
              <View style={{ height: 6 }} />
              <Badge text={order.status} tone="primary" />
            </View>
          </View>
          <Divider />
          <Row label="Plant assigned"  value={order.unitAssigned} />
          <Row label="Committed date"  value={order.committed} />
          <Row label="Order age"       value={`${order.ageDays} days`} />
          <Row label="Payment"         value={<Badge text={order.payment} tone={order.payment === 'Paid' ? 'success' : order.payment === 'Partial' ? 'warning' : 'danger'} />} />
          <Row label="Dispatch"        value={<Badge text={order.dispatch} tone={order.dispatch === 'Delivered' ? 'success' : 'info'} />} />
        </Card>

        {/* Quick actions */}
        <View style={styles.qaRow}>
          {[
            { l: 'Edit',     i: '✎', screen: 'OrderDetail' },
            { l: 'Quote',    i: '📄', screen: 'QuotationCreate' },
            { l: 'Plan',     i: '🗓', screen: 'ProductionPlan' },
            { l: 'Material', i: '📦', screen: 'Procurement' },
            { l: 'Dispatch', i: '🚚', screen: 'Dispatch' },
            { l: 'Invoice',  i: '🧾', screen: 'Invoices' },
          ].map((a) => (
            <View key={a.l} style={styles.qaCell}>
              <Card padded={false} style={styles.qaCard} onPress={() => push(a.screen as any)}>
                <Text style={{ fontSize: 18 }}>{a.i}</Text>
                <Text style={styles.qaLabel}>{a.l}</Text>
              </Card>
            </View>
          ))}
        </View>

        {/* Timeline */}
        <SectionTitle title="Order journey" subtitle="Inquiry → Delivered" />
        <Card>
          {orderTimeline.map((step, i) => {
            const last = i === orderTimeline.length - 1;
            const tone = step.done ? colors.success : (step as any).current ? colors.primary : colors.divider;
            return (
              <View key={step.step} style={styles.tlRow}>
                <View style={styles.tlGutter}>
                  <View style={[styles.tlDot, { backgroundColor: tone }]} />
                  {!last ? <View style={[styles.tlLine, { backgroundColor: step.done ? colors.success : colors.divider }]} /> : null}
                </View>
                <View style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[typography.body, !step.done && { color: colors.textMuted }]}>{step.step}</Text>
                    {(step as any).current ? <Badge text="CURRENT" tone="primary" style={{ marginLeft: 8 }} /> : null}
                  </View>
                  <Text style={typography.small}>{step.date}</Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Sub-sections */}
        <SectionTitle title="Operational status" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <SubCard title="Material Requirement" badge="2 short" tone="warning"
            lines={['Steel Coil 4mm — 220kg short', 'Bearing 6203 — OK', 'Bolts M12 — OK']} />
          <SubCard title="Production Batch" badge="B17 · 64%" tone="primary"
            lines={['Line A · CNC-03', 'Supervisor R. Kulkarni', 'Eff 88% · Reject 1.5%']} />
          <SubCard title="QC Status" badge="Hold" tone="danger"
            lines={['Hardness HRC 34 (target 28-32)', 'Awaiting metallurgist review']} />
          <SubCard title="Logistics" badge="Scheduled" tone="info"
            lines={['Vehicle MH14 BR 4412', 'Driver R. Singh', 'ETA tomorrow 11:00']} />
          <SubCard title="Invoice" badge="Partial" tone="warning"
            lines={['INV-7701 ₹2,48,400', 'Received ₹1,00,000', 'Balance ₹1,48,400']} />
          <SubCard title="Approvals" badge="2 cleared" tone="success"
            lines={['Order > Owner ✓', 'Production > PM ✓', 'Dispatch > Pending']} />
        </View>

        <SectionTitle title="Notes & attachments" />
        <Card>
          <Text style={typography.body}>“Customer requires zinc-plated finish, wooden pallet packing, dispatch by EOD 24th.”</Text>
          <Divider />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['drawing-A102.pdf', 'finish-spec.pdf', 'PO-TF-3211.pdf'].map((f) => (
              <View key={f} style={styles.attach}>
                <Text style={{ fontSize: 14 }}>📎</Text>
                <Text style={styles.attachText}>{f}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
          <Button label="Download PDF" variant="secondary" full style={{ flex: 1, marginRight: 10 }} />
          <Button label="Share details" full style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const SubCard: React.FC<{ title: string; badge: string; tone: string; lines: string[] }> = ({ title, badge, tone, lines }) => (
  <Card style={styles.subCard}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={typography.h3}>{title}</Text>
      <Badge text={badge} tone={tone} />
    </View>
    <View style={{ height: 8 }} />
    {lines.map((l) => (
      <Text key={l} style={[typography.small, { marginVertical: 1 }]}>• {l}</Text>
    ))}
  </Card>
);

const styles = StyleSheet.create({
  qaRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.md },
  qaCell: { width: '32%', marginBottom: 10 },
  qaCard: { padding: 14, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 6 },
  tlRow: { flexDirection: 'row' },
  tlGutter: { width: 24, alignItems: 'center' },
  tlDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  tlLine: { width: 2, flex: 1, marginTop: 2 },
  subCard: { width: '48.5%', marginBottom: 10 },
  attach: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceAlt, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radius.sm, marginRight: 8, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  attachText: { fontSize: 11, color: colors.text, fontWeight: '700', marginLeft: 6 },
});
