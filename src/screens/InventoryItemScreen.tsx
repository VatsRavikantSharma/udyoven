import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, BarChart, Button, Card, Divider, Row, SectionTitle, Sparkline, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { Stock, stocks } from '../data/mockData';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Overview', 'Movements', 'Purchases', 'Consumption', 'Linked Orders', 'Alerts'];

export const InventoryItemScreen: React.FC<{ params?: Stock }> = ({ params }) => {
  const s = params || stocks[0];
  const [tab, setTab] = useState(TABS[0]);
  const available = s.qty - s.reserved;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={s.name} subtitle={s.sku} rightIcon="↗" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.thumb}><Text style={{ fontSize: 36 }}>📦</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={typography.h2}>{s.qty} {s.unit}</Text>
              <Text style={typography.small}>{s.warehouse}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Badge text={s.health} tone={s.health === 'OK' ? 'success' : s.health === 'Low' ? 'warning' : 'info'} />
                <View style={{ width: 6 }} />
                <Badge text={s.velocity + ' mover'} tone="primary" />
              </View>
            </View>
          </View>
          <Divider />
          <Row label="Reserved" value={`${s.reserved} ${s.unit}`} />
          <Row label="Available" value={`${available} ${s.unit}`} bold />
          <Row label="Reorder level" value={`${s.reorder} ${s.unit}`} />
          <Row label="Avg purchase price" value={`₹${(s.value / Math.max(1, s.qty)).toFixed(0)} / ${s.unit}`} />
          <Row label="Stock value" value={`₹${s.value.toLocaleString('en-IN')}`} bold />
        </Card>

        <View style={{ marginTop: spacing.md }}>
          <Tabs options={TABS} value={tab} onChange={setTab} />
        </View>

        {tab === 'Overview' && (
          <>
            <SectionTitle title="Usage trend" subtitle="Last 7 days" />
            <Card>
              <Text style={typography.h3}>Daily consumption</Text>
              <View style={{ height: 8 }} />
              <BarChart data={[40, 55, 48, 60, 52, 65, 58]} color={colors.primary} labels={['M','T','W','T','F','S','S']} />
            </Card>

            <SectionTitle title="Suppliers" />
            {[
              { v: 'Jindal Steel', lt: '5 d', p: 78, r: 4.6 },
              { v: 'Bombay Metals', lt: '7 d', p: 82, r: 4.2 },
              { v: 'Sahyadri Iron', lt: '6 d', p: 80, r: 4.0 },
            ].map((sup) => (
              <Card key={sup.v} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={typography.h3}>{sup.v}</Text>
                    <Text style={typography.small}>Lead time {sup.lt} · Rating {sup.r}</Text>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: colors.text }}>₹{sup.p}/kg</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'Movements' && (
          <Card padded={false} style={{ marginTop: spacing.md }}>
            {[
              { d: '22 Apr 10:14', t: 'Issue to Production', q: '-180 kg', ref: 'Batch B17' },
              { d: '21 Apr 18:02', t: 'Stock In',            q: '+500 kg', ref: 'PO-1051' },
              { d: '20 Apr 09:30', t: 'Issue to Production', q: '-120 kg', ref: 'Batch B16' },
              { d: '19 Apr 14:05', t: 'Adjustment',          q: '-2 kg',   ref: 'Cycle count' },
            ].map((m, i, a) => (
              <View key={i} style={{ flexDirection: 'row', padding: spacing.lg, borderBottomWidth: i !== a.length - 1 ? 1 : 0, borderBottomColor: colors.divider }}>
                <View style={{ flex: 1 }}>
                  <Text style={typography.body}>{m.t}</Text>
                  <Text style={typography.small}>{m.d} · {m.ref}</Text>
                </View>
                <Text style={{
                  fontWeight: '900', color: m.q.startsWith('+') ? colors.success : colors.danger,
                }}>{m.q}</Text>
              </View>
            ))}
          </Card>
        )}

        {tab === 'Purchases' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Last 6 purchases</Text>
            <View style={{ height: 8 }} />
            <Sparkline data={[78, 80, 79, 81, 78, 82]} color={colors.primary} />
            <Divider />
            {[
              ['PO-1051', 'Jindal Steel', '500 kg', '₹78/kg'],
              ['PO-1042', 'Sahyadri Iron', '300 kg', '₹80/kg'],
              ['PO-1031', 'Bombay Metals', '400 kg', '₹82/kg'],
            ].map((p) => (
              <Row key={p[0]} label={`${p[0]} · ${p[1]}`} value={`${p[2]} · ${p[3]}`} />
            ))}
          </Card>
        )}

        {tab === 'Consumption' && (
          <Card style={{ marginTop: spacing.md }}>
            <Text style={typography.h3}>Used by</Text>
            {[
              ['Batch B17 / CNC Bracket', '180 kg'],
              ['Batch B16 / Mounting Plate', '120 kg'],
              ['Batch B12 / Pinion Gear', '60 kg'],
            ].map(([a, b]) => <Row key={a} label={a} value={b} />)}
          </Card>
        )}

        {tab === 'Linked Orders' && (
          <Card style={{ marginTop: spacing.md }}>
            <Row label="Order #A102" value="240 kg required" />
            <Row label="Order #A106" value="180 kg required" />
            <Row label="Order #A108" value="80 kg required" />
          </Card>
        )}

        {tab === 'Alerts' && (
          <Card style={{ marginTop: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.danger }}>
            <Text style={typography.body}>⚠️ Stock below reorder · Predicted out in 3 days.</Text>
            <Text style={[typography.small, { marginTop: 4 }]}>Recommend raising PR for 1,000 kg.</Text>
          </Card>
        )}

        <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
          <Button label="Raise PR" full style={{ flex: 1, marginRight: 8 }} />
          <Button label="Transfer" variant="secondary" full style={{ flex: 1, marginRight: 8 }} />
          <Button label="Edit" variant="ghost" full style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  thumb: {
    width: 80, height: 80, borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
});
