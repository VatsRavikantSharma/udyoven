import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, SearchBar, SectionTitle, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { purchaseOrders, purchaseRequests, rfqs } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Requests', 'RFQ', 'Orders', 'Pending Receipts', 'Completed'];

export const ProcurementScreen: React.FC = () => {
  const { push } = useNav();
  const [tab, setTab] = useState(TABS[0]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Procurement" subtitle="3 pending · 2 RFQs open" rightIcon="＋" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <SearchBar placeholder="Search PR / RFQ / PO / vendor / item…" />
        <View style={{ height: spacing.md }} />
        <Tabs options={TABS} value={tab} onChange={setTab} />

        <View style={styles.summary}>
          <Mini n="₹4.2 L" l="Open spend" />
          <Mini n="6.8d" l="Avg lead time" />
          <Mini n="3" l="Late suppliers" tone={colors.danger} />
          <Mini n="₹68k" l="Q2 savings" tone={colors.success} />
        </View>

        {tab === 'Requests' && (
          <>
            <SectionTitle title="Purchase requests" subtitle="Awaiting your approval" />
            {purchaseRequests.map((p) => (
              <Card key={p.id} style={{ marginBottom: 10 }} onPress={() => push('Approvals')}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.h3}>{p.id} · {p.item}</Text>
                    <Text style={typography.small}>{p.qty} · By {p.requester} ({p.dept}) · Need {p.required}</Text>
                  </View>
                  <Badge text={p.urgency} tone={p.urgency === 'High' ? 'danger' : p.urgency === 'Medium' ? 'warning' : 'steel'} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' }}>
                  <Badge text={p.status} tone="primary" />
                  <Text style={typography.small}>Approval chain: Stores → Mgr → Owner</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'RFQ' && (
          <>
            <SectionTitle title="Open RFQs" subtitle="Compare supplier quotes" />
            {rfqs.map((r) => (
              <Card key={r.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={typography.h3}>{r.id} · {r.item}</Text>
                    <Text style={typography.small}>{r.vendors} vendors · status {r.status}</Text>
                  </View>
                  <Badge text="Compare →" tone="primary" />
                </View>
                <View style={styles.compare}>
                  {[
                    { v: 'Jindal Steel',   p: 78, lt: 5, sel: true },
                    { v: 'Bombay Metals',  p: 82, lt: 7 },
                    { v: 'Sahyadri Iron',  p: 80, lt: 6 },
                    { v: 'Essar Hot',      p: 84, lt: 4 },
                  ].slice(0, r.vendors).map((v) => (
                    <View key={v.v} style={[styles.compareRow, v.sel && { backgroundColor: colors.accentSoft }]}>
                      <Text style={[typography.body, { flex: 1 }]}>{v.v}</Text>
                      <Text style={[typography.body, { width: 70, textAlign: 'right' }]}>₹{v.p}/kg</Text>
                      <Text style={[typography.small, { width: 50, textAlign: 'right' }]}>{v.lt}d</Text>
                      {v.sel ? <Badge text="BEST" tone="accent" style={{ marginLeft: 8 }} /> : null}
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'Orders' && (
          <>
            <SectionTitle title="Purchase orders" />
            {purchaseOrders.map((p) => (
              <Card key={p.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.h3}>{p.id} · {p.vendor}</Text>
                    <Text style={typography.small}>{p.item} · {p.qty} · ₹{p.value.toLocaleString('en-IN')}</Text>
                  </View>
                  <Badge text={p.status} tone={p.status === 'In Transit' ? 'info' : p.status === 'Partial Receipt' ? 'warning' : 'primary'} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={typography.small}>ETA {p.eta}</Text>
                  <Text style={[typography.small, { color: colors.primary, fontWeight: '800' }]}>Track shipment →</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'Pending Receipts' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Awaiting goods receipt</Text>
            <Text style={typography.small}>3 vehicles inbound today</Text>
          </Card>
        )}

        {tab === 'Completed' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Recently completed</Text>
            <Text style={typography.small}>42 POs closed this month · ₹38.4 L spend</Text>
          </Card>
        )}

        <SectionTitle title="Procurement insights" subtitle="AI suggestions" />
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.accent, marginBottom: 10 }}>
          <Text style={typography.body}>💡 Best supplier for Steel Coil 4mm: Jindal Steel (price + lead time + reliability).</Text>
        </Card>
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.alertOrange, marginBottom: 10 }}>
          <Text style={typography.body}>⚠️ Bombay Metals predicted to be late on PO-1053 — alternate Jindal Steel ready.</Text>
        </Card>
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.warning }}>
          <Text style={typography.body}>📈 Brass prices up 4% MoM — consider booking Q3 requirement now.</Text>
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

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, marginBottom: spacing.md },
  compare: { marginTop: 10, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 10 },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: radius.sm, marginBottom: 4 },
});
