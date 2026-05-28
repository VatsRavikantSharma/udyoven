import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Card, Progress, SearchBar, SectionTitle, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { Stock, stocks } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Raw Material', 'Finished Goods', 'Packaging', 'WIP', 'Spare Parts'];

const HEALTH_TONE: Record<string, string> = { OK: 'success', Low: 'warning', Over: 'info', Blocked: 'danger' };

export const InventoryScreen: React.FC = () => {
  const { push } = useNav();
  const [tab, setTab] = useState(TABS[0]);
  const list = useMemo(() => stocks.filter((s) => s.category === tab), [tab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Inventory" subtitle={`${stocks.length} SKUs across 3 warehouses`} rightIcon="＋" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <SearchBar placeholder="Search SKU, item, warehouse…" />
        <View style={{ height: spacing.md }} />
        <Tabs options={TABS} value={tab} onChange={setTab} />

        <View style={styles.summary}>
          <Mini n="₹86 L" l="Stock value" />
          <Mini n="9" l="Low stock" tone={colors.warning} />
          <Mini n="3" l="Overstock" tone={colors.info} />
          <Mini n="2" l="Dead stock" tone={colors.danger} />
        </View>

        <Card style={{ marginTop: spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={typography.h3}>Inventory health score</Text>
              <Text style={typography.small}>Composite: rotation × accuracy × availability</Text>
            </View>
            <Text style={{ fontSize: 26, fontWeight: '900', color: colors.primary }}>81</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Progress value={81} color={colors.primary} />
          </View>
        </Card>

        <SectionTitle title={`${tab} · ${list.length} items`} action="Filters" />
        {list.map((s) => (
          <StockCard key={s.id} stock={s} onPress={() => push('InventoryItem', s)} />
        ))}

        <SectionTitle title="Smart insights" subtitle="Auto-detected" />
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.alertOrange, marginBottom: 10 }}>
          <Text style={typography.body}>📉 Steel Coil 4mm: predicted stock-out in 3 days at current consumption.</Text>
        </Card>
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.warning, marginBottom: 10 }}>
          <Text style={typography.body}>🐢 Aluminium Sheet 6mm overstocked — 940 kg vs 300 kg reorder.</Text>
        </Card>
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.accent }}>
          <Text style={typography.body}>🤖 Suggested reorder: 1,000 kg Steel Coil from Jindal (best ETA: 5 days).</Text>
        </Card>

        <SectionTitle title="Quick actions" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {['Add stock', 'Transfer', 'Adjust', 'Issue to prod', 'Return material', 'Raise PR'].map((a) => (
            <TouchableOpacity key={a} style={styles.qa}>
              <Text style={styles.qaText}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const StockCard: React.FC<{ stock: Stock; onPress?: () => void }> = ({ stock, onPress }) => {
  const ratio = Math.min(100, (stock.qty / Math.max(1, stock.reorder * 2)) * 100);
  const available = stock.qty - stock.reserved;
  return (
    <Card style={{ marginBottom: 10 }} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.thumb}><Text style={{ fontSize: 18 }}>📦</Text></View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={typography.h3}>{stock.name}</Text>
          <Text style={typography.small}>{stock.sku} · {stock.warehouse}</Text>
        </View>
        <Badge text={stock.health} tone={HEALTH_TONE[stock.health]} />
      </View>
      <View style={styles.row}>
        <Cell label="Qty" value={`${stock.qty} ${stock.unit}`} bold />
        <Cell label="Reorder" value={`${stock.reorder}`} />
        <Cell label="Reserved" value={`${stock.reserved}`} />
        <Cell label="Available" value={`${available}`} />
      </View>
      <View style={{ marginTop: 10 }}>
        <Progress value={ratio} color={stock.health === 'Low' ? colors.danger : stock.health === 'Over' ? colors.info : colors.success} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={typography.small}>Last move {stock.movement}</Text>
          <Text style={typography.small}>{stock.velocity} mover</Text>
        </View>
      </View>
    </Card>
  );
};

const Mini: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={styles.miniCard}>
    <Text style={{ fontSize: 16, fontWeight: '900', color: tone || colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 2 }}>{l}</Text>
  </View>
);
const Cell: React.FC<{ label: string; value: string; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{label}</Text>
    <Text style={{ fontSize: 13, color: colors.text, fontWeight: bold ? '900' : '700', marginTop: 2 }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  miniCard: { width: '23.5%', backgroundColor: colors.surface, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  thumb: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  qa: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  qaText: { fontSize: 12, fontWeight: '700', color: colors.text },
});
