import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Card, Chips, SearchBar, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { Order, orders } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['New Inquiry', 'Confirmed', 'In Production', 'Ready to Dispatch', 'Completed', 'Cancelled'];

const PRIORITY_TONE: Record<string, string> = { High: 'danger', Medium: 'warning', Low: 'steel' };
const PAYMENT_TONE:  Record<string, string> = { Paid: 'success', Partial: 'warning', Pending: 'danger' };
const DISPATCH_TONE: Record<string, string> = {
  Pending: 'steel', Scheduled: 'info', 'In Transit': 'primary', Delivered: 'success',
};

export const OrdersScreen: React.FC = () => {
  const { push } = useNav();
  const [tab, setTab] = useState(TABS[2]);
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'High', 'Medium', 'Low'];

  const list = useMemo(
    () => orders.filter((o) => o.status === tab && (filter === 'All' || o.priority === filter)),
    [tab, filter],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Orders & Inquiries" subtitle="42 today · 18 in production" rightIcon="＋" onRightPress={() => push('QuotationCreate')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl + 60 }}>
        <SearchBar placeholder="Search by Order ID, client, item, phone…" />
        <View style={{ height: spacing.md }} />
        <Tabs options={TABS} value={tab} onChange={setTab} />
        <View style={{ height: spacing.md }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          <Text style={[typography.small, { marginRight: 10 }]}>Priority</Text>
          <Chips options={filters} value={filter} onChange={setFilter} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
          <FilterPill label="📅 Date: Apr 22" />
          <FilterPill label="🏭 Plant 1 — Pune" />
          <FilterPill label="📦 All Categories" />
          <FilterPill label="↧ Export" tone="primary" />
        </View>

        <View style={{ marginTop: spacing.md }}>
          {list.length === 0 ? (
            <Card><Text style={typography.bodyMuted}>No orders match these filters.</Text></Card>
          ) : list.map((o) => (
            <OrderCard key={o.id} order={o} onPress={() => push('OrderDetail', o)} />
          ))}
        </View>

        <Button
          label="Convert Inquiry to Quote"
          icon="✦"
          variant="secondary"
          full
          style={{ marginTop: spacing.md }}
          onPress={() => push('QuotationCreate')}
        />
      </ScrollView>

      <TouchableOpacity activeOpacity={0.85} style={styles.fab} onPress={() => push('QuotationCreate')}>
        <Text style={styles.fabText}>＋ New Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const FilterPill: React.FC<{ label: string; tone?: 'primary' }> = ({ label, tone }) => (
  <View
    style={{
      paddingHorizontal: 12, paddingVertical: 7,
      borderRadius: radius.pill, marginRight: 8, marginTop: 8,
      backgroundColor: tone === 'primary' ? colors.primary : colors.surface,
      borderWidth: 1, borderColor: tone === 'primary' ? colors.primary : colors.border,
    }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: tone === 'primary' ? '#fff' : colors.text }}>{label}</Text>
  </View>
);

const OrderCard: React.FC<{ order: Order; onPress?: () => void }> = ({ order, onPress }) => (
  <Card style={{ marginBottom: 10 }} onPress={onPress}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
      <Text style={typography.h3}>#{order.id}</Text>
      <Text style={[typography.small, { marginLeft: 8 }]}>· {order.client}</Text>
      <View style={{ flex: 1 }} />
      <Badge text={order.priority} tone={PRIORITY_TONE[order.priority]} />
    </View>
    <Text style={typography.body}>{order.product}</Text>
    <Text style={[typography.small, { marginTop: 2 }]}>
      {order.qty} {order.unit} · ₹{order.rate} · Plant: {order.unitAssigned}
    </Text>

    <View style={styles.metaRow}>
      <View style={styles.metaCell}>
        <Text style={styles.metaLbl}>Committed</Text>
        <Text style={styles.metaVal}>{order.committed}</Text>
      </View>
      <View style={styles.metaCell}>
        <Text style={styles.metaLbl}>Age</Text>
        <Text style={styles.metaVal}>{order.ageDays}d</Text>
      </View>
      <View style={styles.metaCell}>
        <Text style={styles.metaLbl}>Payment</Text>
        <Badge text={order.payment} tone={PAYMENT_TONE[order.payment]} />
      </View>
      <View style={styles.metaCell}>
        <Text style={styles.metaLbl}>Dispatch</Text>
        <Badge text={order.dispatch} tone={DISPATCH_TONE[order.dispatch]} />
      </View>
    </View>

    {order.delayRisk ? (
      <View style={styles.delayBanner}>
        <Text style={{ fontSize: 12 }}>⚠️</Text>
        <Text style={styles.delayText}> Expected delay risk · reschedule production</Text>
      </View>
    ) : null}
  </Card>
);

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
  metaCell: { flex: 1 },
  metaLbl: { fontSize: 10, color: colors.textMuted, fontWeight: '700', marginBottom: 4, letterSpacing: 0.3 },
  metaVal: { fontSize: 13, color: colors.text, fontWeight: '700' },
  delayBanner: {
    flexDirection: 'row', alignItems: 'center', marginTop: 10,
    backgroundColor: colors.alertOrangeBg, paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: radius.sm,
  },
  delayText: { color: '#9A3412', fontSize: 12, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14, paddingHorizontal: 18,
    borderRadius: radius.pill,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: '800' },
});
