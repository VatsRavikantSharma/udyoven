import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Badge, Chips } from '../components/UI';
import { RouteName, useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low';
type Category =
  | 'stock'
  | 'production'
  | 'qc'
  | 'machine'
  | 'dispatch'
  | 'payment'
  | 'approval'
  | 'vendor';
type Day = 'today' | 'yesterday' | 'earlier';
type FilterChip =
  | 'All'
  | 'Critical'
  | 'Operational'
  | 'Financial'
  | 'Maintenance'
  | 'Quality';

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  day: Day;
  severity: Severity;
  category: Category;
  read: boolean;
  refId?: string;
  route?: RouteName;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOTIFICATIONS: Notification[] = [
  // Today
  {
    id: 'n1',
    title: 'Machine Overheat — Critical',
    body: 'CNC Machine #3 temperature at 86 °C — above safe limit of 75 °C. Shut down recommended.',
    time: '09:14',
    day: 'today',
    severity: 'critical',
    category: 'machine',
    read: false,
    route: 'Machines',
  },
  {
    id: 'n2',
    title: 'Low Stock Alert',
    body: 'Steel Coil 4mm below reorder level — only 210 kg remaining (threshold: 500 kg).',
    time: '08:52',
    day: 'today',
    severity: 'high',
    category: 'stock',
    read: false,
    refId: 's1',
    route: 'Inventory',
  },
  {
    id: 'n3',
    title: 'Payment Overdue — INV-1021',
    body: 'Tata Forge Ltd. invoice overdue by 12 days — ₹2,20,800 pending.',
    time: '08:30',
    day: 'today',
    severity: 'critical',
    category: 'payment',
    read: false,
    route: 'Invoices',
  },
  {
    id: 'n4',
    title: 'Dispatch Delay — Order A102',
    body: 'CNC Bracket 220mm dispatch delayed by 1 day. Client: Tata Forge Ltd.',
    time: '07:45',
    day: 'today',
    severity: 'high',
    category: 'dispatch',
    read: true,
    refId: 'A102',
    route: 'Dispatch',
  },
  {
    id: 'n5',
    title: 'QC Rejection Alert — Batch B17',
    body: '6.2% rejection rate detected — above acceptable 3% limit. Inspector: M. Joshi.',
    time: '07:20',
    day: 'today',
    severity: 'high',
    category: 'qc',
    read: false,
    refId: 'QC-901',
    route: 'QC',
  },
  {
    id: 'n6',
    title: 'Approval Pending — PR-501',
    body: 'Purchase Request for Steel Coil 4mm (500 kg) awaiting manager approval.',
    time: '06:55',
    day: 'today',
    severity: 'medium',
    category: 'approval',
    read: true,
    route: 'Approvals',
  },
  // Yesterday
  {
    id: 'n7',
    title: 'Vendor Delay — Bombay Metals',
    body: 'PO-1053 shipment delayed by 3 days — Brass Rod 12mm (300 kg). Expected: 28 Apr → 01 May.',
    time: '16:30',
    day: 'yesterday',
    severity: 'high',
    category: 'vendor',
    read: true,
    refId: 'V03',
    route: 'Vendors',
  },
  {
    id: 'n8',
    title: 'Production Hold — Batch B19',
    body: 'Batch B19 on hold — awaiting sand casting material for Brake Drum. Line C idle.',
    time: '14:12',
    day: 'yesterday',
    severity: 'medium',
    category: 'production',
    read: true,
    refId: 'B19',
    route: 'ProductionLive',
  },
  {
    id: 'n9',
    title: 'QC Hold — Batch B13',
    body: 'Flange 6" placed on QC hold pending investigation. Inspector: D. Shah.',
    time: '11:05',
    day: 'yesterday',
    severity: 'medium',
    category: 'qc',
    read: false,
    refId: 'QC-906',
    route: 'QC',
  },
  {
    id: 'n10',
    title: 'Low Stock — Bearing 6203',
    body: 'Bearing 6203 stock at 28 pcs — below reorder level of 40 pcs. Warehouse WH-3.',
    time: '09:22',
    day: 'yesterday',
    severity: 'medium',
    category: 'stock',
    read: true,
    route: 'Inventory',
  },
  // Earlier
  {
    id: 'n11',
    title: 'Payment Pending — Mahindra Auto',
    body: 'Invoice INV-1022 of ₹4,41,600 pending for 5 days.',
    time: '21 Apr',
    day: 'earlier',
    severity: 'medium',
    category: 'payment',
    read: true,
    route: 'Invoices',
  },
  {
    id: 'n12',
    title: 'Machine Maintenance Overdue',
    body: 'VMC-01 scheduled maintenance overdue by 2 days. Downtime risk increasing.',
    time: '20 Apr',
    day: 'earlier',
    severity: 'high',
    category: 'machine',
    read: true,
    route: 'Machines',
  },
  {
    id: 'n13',
    title: 'Vendor Performance Alert',
    body: 'Pune Castings Co. reliability dropped to 78% — below 80% threshold.',
    time: '19 Apr',
    day: 'earlier',
    severity: 'low',
    category: 'vendor',
    read: true,
    refId: 'V04',
    route: 'Vendors',
  },
  {
    id: 'n14',
    title: 'Inventory Overstock',
    body: 'Aluminium Sheet 6mm at 940 kg — 213% above normal level. Review procurement.',
    time: '18 Apr',
    day: 'earlier',
    severity: 'low',
    category: 'stock',
    read: true,
    route: 'Inventory',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<Severity, { bg: string; fg: string; dot: string; label: string }> = {
  critical: { bg: colors.dangerBg,       fg: colors.danger,    dot: colors.danger,      label: 'CRITICAL' },
  high:     { bg: colors.alertOrangeBg,  fg: '#9A3412',        dot: colors.alertOrange, label: 'HIGH' },
  medium:   { bg: colors.warningBg,      fg: '#92400E',        dot: colors.warning,     label: 'MEDIUM' },
  low:      { bg: colors.infoBg,         fg: colors.info,      dot: colors.info,        label: 'LOW' },
};

const CAT_ICON: Record<Category, string> = {
  stock:      '📦',
  production: '⚙',
  qc:         '🔬',
  machine:    '🔧',
  dispatch:   '🚚',
  payment:    '💳',
  approval:   '✅',
  vendor:     '🏭',
};

const CAT_LABEL: Record<Category, string> = {
  stock:      'Stock Alert',
  production: 'Production',
  qc:         'QC Reject',
  machine:    'Machine',
  dispatch:   'Dispatch',
  payment:    'Payment',
  approval:   'Approval',
  vendor:     'Vendor',
};

const FILTER_CATS: Record<FilterChip, Category[]> = {
  All:         ['stock', 'production', 'qc', 'machine', 'dispatch', 'payment', 'approval', 'vendor'],
  Critical:    ['machine', 'payment'],
  Operational: ['production', 'dispatch', 'approval'],
  Financial:   ['payment', 'vendor'],
  Maintenance: ['machine'],
  Quality:     ['qc', 'stock'],
};

const FILTER_CHIPS: FilterChip[] = ['All', 'Critical', 'Operational', 'Financial', 'Maintenance', 'Quality'];

const DAY_LABEL: Record<Day, string> = {
  today:     'Today',
  yesterday: 'Yesterday',
  earlier:   'Earlier',
};
const DAY_ORDER: Day[] = ['today', 'yesterday', 'earlier'];

// ─── Notification Card ────────────────────────────────────────────────────────

const NotifCard: React.FC<{
  item: Notification;
  onAction: (action: 'view' | 'resolve' | 'snooze' | 'assign', item: Notification) => void;
}> = ({ item, onAction }) => {
  const s = SEVERITY_STYLE[item.severity];
  return (
    <View style={[styles.card, !item.read && styles.cardUnread, { borderLeftColor: s.dot }]}>
      {/* Header row */}
      <View style={styles.cardHead}>
        <View style={[styles.catChip, { backgroundColor: s.bg }]}>
          <Text style={styles.catIcon}>{CAT_ICON[item.category]}</Text>
          <Text style={[styles.catLabel, { color: s.fg }]}>{CAT_LABEL[item.category]}</Text>
        </View>
        <View style={styles.headRight}>
          <View style={[styles.severityPill, { backgroundColor: s.dot }]}>
            <Text style={styles.severityText}>{s.label}</Text>
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
      </View>

      {/* Body */}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>

      {/* Footer */}
      <View style={styles.cardFoot}>
        <Text style={styles.timeText}>{item.time}</Text>
        <View style={styles.actions}>
          <ActionBtn label="View"    onPress={() => onAction('view', item)}    color={colors.primary} />
          <ActionBtn label="Resolve" onPress={() => onAction('resolve', item)} color={colors.success} />
          <ActionBtn label="Snooze"  onPress={() => onAction('snooze', item)}  color={colors.steel} />
          <ActionBtn label="Assign"  onPress={() => onAction('assign', item)}  color={colors.accent} />
        </View>
      </View>
    </View>
  );
};

const ActionBtn: React.FC<{ label: string; onPress: () => void; color: string }> = ({
  label,
  onPress,
  color,
}) => (
  <TouchableOpacity style={[styles.actionBtn, { borderColor: color }]} onPress={onPress} activeOpacity={0.7}>
    <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Summary strip ────────────────────────────────────────────────────────────

const SummaryStrip: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  const unread    = notifications.filter((n) => !n.read).length;
  const critical  = notifications.filter((n) => n.severity === 'critical').length;
  const high      = notifications.filter((n) => n.severity === 'high').length;
  return (
    <View style={styles.strip}>
      <StripStat value={unread}   label="Unread"   color={colors.primary} />
      <View style={styles.stripDiv} />
      <StripStat value={critical} label="Critical" color={colors.danger} />
      <View style={styles.stripDiv} />
      <StripStat value={high}     label="High"     color={colors.alertOrange} />
      <View style={styles.stripDiv} />
      <StripStat value={notifications.length} label="Total" color={colors.accent} />
    </View>
  );
};

const StripStat: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <View style={styles.stripStat}>
    <Text style={[styles.stripVal, { color }]}>{value}</Text>
    <Text style={styles.stripLabel}>{label}</Text>
  </View>
);

// ─── Main screen ─────────────────────────────────────────────────────────────

export const NotificationsScreen: React.FC<{ tabMode?: boolean }> = ({ tabMode = false }) => {
  const { push } = useNav();
  const [filter, setFilter] = useState<FilterChip>('All');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const allowed = FILTER_CATS[filter];
  const visible = NOTIFICATIONS.filter(
    (n) => allowed.includes(n.category) && !dismissed.has(n.id),
  );

  const handleAction = (
    action: 'view' | 'resolve' | 'snooze' | 'assign',
    item: Notification,
  ) => {
    if (action === 'view' && item.route) {
      push(item.route as RouteName);
    } else if (action === 'resolve') {
      setDismissed((prev) => new Set([...prev, item.id]));
    }
  };

  return (
    <View style={styles.root}>
      {!tabMode && (
        <ScreenHeader
          title="Notifications"
          subtitle="Alerts & operational updates"
          rightIcon="⋯"
        />
      )}
      {tabMode && (
        <View style={styles.tabHeader}>
          <Text style={typography.h1}>Notifications</Text>
          <TouchableOpacity style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary strip */}
        <SummaryStrip notifications={visible} />

        {/* Filter chips */}
        <View style={styles.filterWrap}>
          {FILTER_CHIPS.map((f) => {
            const active = f === filter;
            const count = NOTIFICATIONS.filter(
              (n) => FILTER_CATS[f].includes(n.category) && !dismissed.has(n.id),
            ).length;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, active && styles.filterChipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f}
                </Text>
                <View style={[styles.filterCount, active && styles.filterCountActive]}>
                  <Text style={[styles.filterCountText, active && { color: colors.primary }]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Grouped notifications */}
        {DAY_ORDER.map((day) => {
          const group = visible.filter((n) => n.day === day);
          if (group.length === 0) return null;
          return (
            <View key={day} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={styles.groupLine} />
                <Text style={styles.groupLabel}>{DAY_LABEL[day]}</Text>
                <View style={styles.groupLine} />
              </View>
              {group.map((item) => (
                <NotifCard key={item.id} item={item} onAction={handleAction} />
              ))}
            </View>
          );
        })}

        {visible.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptyBody}>No notifications in this category.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  markAllBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  markAllText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },

  // Summary strip
  strip: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    ...shadow.soft,
  },
  stripStat: { flex: 1, alignItems: 'center' },
  stripVal:  { fontSize: 22, fontWeight: '900', lineHeight: 26 },
  stripLabel:{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginTop: 2 },
  stripDiv:  { width: 1, backgroundColor: colors.divider, marginVertical: 4 },

  // Filter chips
  filterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  filterChipTextActive: { color: '#fff' },
  filterCount: {
    marginLeft: 6,
    backgroundColor: colors.divider,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  filterCountText: { fontSize: 10, fontWeight: '800', color: colors.textMuted },

  // Group
  group: { marginBottom: spacing.md },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  groupLine:  { flex: 1, height: 1, backgroundColor: colors.divider },
  groupLabel: {
    marginHorizontal: spacing.md,
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Notification card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.border,
    ...shadow.card,
  },
  cardUnread: { backgroundColor: '#FAFBFF' },

  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  catIcon:  { fontSize: 12, marginRight: 4 },
  catLabel: { fontSize: 11, fontWeight: '800' },

  headRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  severityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  severityText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  cardTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 4 },
  cardBody:  { fontSize: 13, fontWeight: '500', color: colors.textMuted, lineHeight: 19 },

  cardFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  timeText: { fontSize: 11, fontWeight: '700', color: colors.textSubtle },
  actions:  { flexDirection: 'row', gap: 6 },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  actionBtnText: { fontSize: 11, fontWeight: '800' },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:  { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 6 },
  emptyBody:  { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
