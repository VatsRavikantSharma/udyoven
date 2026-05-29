import React, { useState } from 'react';
import {
  FlatList, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Deal, DealStatus, deals } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ─── mini drawn icons ──────────────────────────────────────────────────────
const ChevronRight = () => (
  <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 6, height: 6, borderRightWidth: 2, borderTopWidth: 2, borderColor: colors.textMuted, transform: [{ rotate: '45deg' }] }} />
  </View>
);
const FilterIcon = () => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
    {[12, 8, 4].map((w, i) => (
      <View key={i} style={{ width: w, height: 2, backgroundColor: colors.textMuted, borderRadius: 1 }} />
    ))}
  </View>
);

// ─── status config ─────────────────────────────────────────────────────────
const STATUS_CFG: Record<DealStatus, { bg: string; fg: string; dot: string }> = {
  Active:           { bg: '#EFF6FF', fg: colors.primary,  dot: colors.primary  },
  Negotiating:      { bg: '#FFF7ED', fg: '#C2410C',       dot: '#F97316'       },
  'Payment Pending':{ bg: '#FEFCE8', fg: '#854D0E',       dot: '#EAB308'       },
  Confirmed:        { bg: '#F0FDF4', fg: colors.success,  dot: colors.success  },
  Closed:           { bg: '#F8FAFC', fg: colors.textMuted,dot: '#94A3B8'       },
  Cancelled:        { bg: '#FFF1F2', fg: colors.danger,   dot: colors.danger   },
};

const TABS: { key: DealStatus | 'All'; label: string }[] = [
  { key: 'All',             label: 'All'        },
  { key: 'Active',          label: 'Active'     },
  { key: 'Negotiating',     label: 'Negotiating'},
  { key: 'Payment Pending', label: 'Payment'    },
  { key: 'Confirmed',       label: 'Confirmed'  },
  { key: 'Closed',          label: 'Closed'     },
  { key: 'Cancelled',       label: 'Cancelled'  },
];

const fmt = (n: number) =>
  n >= 100000 ? `Rs.${(n / 100000).toFixed(1)}L` : `Rs.${n.toLocaleString()}`;

// ─── Stats bar ─────────────────────────────────────────────────────────────
const StatBox: React.FC<{ n: number; label: string; color: string }> = ({ n, label, color }) => (
  <View style={styles.statBox}>
    <Text style={[styles.statN, { color }]}>{n}</Text>
    <Text style={styles.statL}>{label}</Text>
  </View>
);

// ─── Deal Card ─────────────────────────────────────────────────────────────
const DealCard: React.FC<{ deal: Deal; onPress: () => void }> = ({ deal, onPress }) => {
  const cfg = STATUS_CFG[deal.status];
  const progress = ((deal.phaseIndex + 1) / 8) * 100;
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={styles.cardIdRow}>
          <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
          <Text style={styles.dealId}>{deal.id}</Text>
          <Text style={styles.quoteRef}> · {deal.quotationId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusText, { color: cfg.fg }]}>{deal.status}</Text>
        </View>
      </View>

      {/* Vendor + product */}
      <Text style={typography.h3} numberOfLines={1}>{deal.vendor}</Text>
      <Text style={[typography.small, { marginTop: 2 }]} numberOfLines={1}>
        {deal.product} · {deal.qty.toLocaleString()} {deal.unit}
      </Text>

      {/* Phase progress */}
      <View style={styles.phaseRow}>
        <Text style={styles.phaseLabel}>{deal.currentPhase}</Text>
        <Text style={styles.phaseStep}>Step {deal.phaseIndex + 1}/8</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any, backgroundColor: cfg.dot }]} />
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.footerLabel}>Deal Value</Text>
          <Text style={styles.footerVal}>{fmt(deal.finalAmount)}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.footerLabel}>Delivery</Text>
          <Text style={styles.footerVal}>{deal.deliveryDate}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.indicatorRow}>
            <View style={[styles.indicator, { backgroundColor: deal.paymentReady ? colors.success : '#E2E8F0' }]} />
            <Text style={styles.indicatorLabel}>Pay</Text>
          </View>
          <View style={[styles.indicatorRow, { marginLeft: 8 }]}>
            <View style={[styles.indicator, { backgroundColor: deal.deliveryReady ? colors.success : '#E2E8F0' }]} />
            <Text style={styles.indicatorLabel}>Del</Text>
          </View>
          <ChevronRight />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────
export const DealTrackingScreen: React.FC = () => {
  const { push } = useNav();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<DealStatus | 'All'>('All');

  const filtered = tab === 'All' ? deals : deals.filter(d => d.status === tab);

  const stats = {
    active:    deals.filter(d => d.status === 'Active' || d.status === 'Negotiating').length,
    payment:   deals.filter(d => d.status === 'Payment Pending').length,
    confirmed: deals.filter(d => d.status === 'Confirmed').length,
    closed:    deals.filter(d => d.status === 'Closed').length,
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Deal Tracking</Text>
          <Text style={styles.headerSub}>{deals.length} deals · {stats.active} in progress</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
          <FilterIcon />
        </TouchableOpacity>
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsRow}>
        <StatBox n={stats.active}    label="Active"    color={colors.primary} />
        <StatBox n={stats.payment}   label="Payment"   color="#D97706" />
        <StatBox n={stats.confirmed} label="Confirmed" color={colors.success} />
        <StatBox n={stats.closed}    label="Closed"    color={colors.textMuted} />
      </View>

      {/* ── Tab filter ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}
      >
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabChip, tab === t.key && styles.tabChipActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabChipText, tab === t.key && styles.tabChipTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Deal list ── */}
      <FlatList
        data={filtered}
        keyExtractor={d => d.id}
        renderItem={({ item }) => (
          <DealCard deal={item} onPress={() => push('DealDetail', item)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No deals in this category</Text>
          </View>
        }
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl + insets.bottom }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#F0F4FA' },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md, backgroundColor: '#fff' },
  headerTitle:  { fontSize: 22, fontWeight: '900', color: colors.text },
  headerSub:    { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  filterBtn:    { width: 40, height: 40, backgroundColor: '#F1F5F9', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statsRow:     { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  statBox:      { flex: 1, alignItems: 'center' },
  statN:        { fontSize: 22, fontWeight: '900' },
  statL:        { fontSize: 10, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  tabScroll:    { flexGrow: 0, backgroundColor: '#fff' },
  tabChip:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: '#F1F5F9', marginRight: 8 },
  tabChipActive:{ backgroundColor: colors.primary },
  tabChipText:  { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tabChipTextActive: { color: '#fff' },
  card:         { backgroundColor: '#fff', borderRadius: 16, padding: spacing.lg, marginBottom: 14, ...shadow.card },
  cardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardIdRow:    { flexDirection: 'row', alignItems: 'center' },
  statusDot:    { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dealId:       { fontSize: 13, fontWeight: '800', color: colors.text },
  quoteRef:     { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  statusBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  statusText:   { fontSize: 11, fontWeight: '700' },
  phaseRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 6 },
  phaseLabel:   { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  phaseStep:    { fontSize: 11, fontWeight: '700', color: colors.textSubtle },
  progressTrack:{ height: 5, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', borderRadius: 4 },
  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  footerLabel:  { fontSize: 10, color: colors.textMuted, fontWeight: '600', marginBottom: 2 },
  footerVal:    { fontSize: 13, fontWeight: '800', color: colors.text },
  indicatorRow: { flexDirection: 'row', alignItems: 'center' },
  indicator:    { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  indicatorLabel:{ fontSize: 10, fontWeight: '700', color: colors.textMuted },
  empty:        { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText:    { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
});
