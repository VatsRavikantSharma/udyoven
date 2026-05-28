import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Card, Divider, Gauge, Row, SectionTitle, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ─────────────────────────────────────────────
//  Mock data
// ─────────────────────────────────────────────
type DispatchItem = {
  id: string;
  orderId: string;
  client: string;
  qty: number;
  unit: string;
  vehicle: string;
  driver: string;
  route: string;
  eta: string;
  status: 'Queue' | 'Packed' | 'Scheduled' | 'In Transit' | 'Delivered' | 'Returned';
  priority: 'High' | 'Medium' | 'Low';
  delayed: boolean;
  eWayBill: boolean;
  invoice: boolean;
  challan: boolean;
  packingPct: number;
  timelineSteps: { step: string; done: boolean; time?: string }[];
};

const dispatches: DispatchItem[] = [
  {
    id: 'DIS-001', orderId: 'ORD-1024', client: 'Tata Forge Ltd.', qty: 480, unit: 'pcs',
    vehicle: 'MH12-AB-9021', driver: 'Ramesh Patil', route: 'Pune → Mumbai NH48',
    eta: 'Today 15:30', status: 'Queue', priority: 'High', delayed: true,
    eWayBill: true, invoice: true, challan: false, packingPct: 65,
    timelineSteps: [
      { step: 'Order Confirmed', done: true, time: '09:10' },
      { step: 'Packing Started', done: true, time: '10:45' },
      { step: 'Packed & Ready', done: false },
      { step: 'Vehicle Assigned', done: false },
      { step: 'Dispatched', done: false },
      { step: 'Delivered', done: false },
    ],
  },
  {
    id: 'DIS-002', orderId: 'ORD-1018', client: 'Bharat Steel Works', qty: 200, unit: 'kg',
    vehicle: 'GJ05-CD-3314', driver: 'Sunil Mehta', route: 'Pune → Surat NH48/NH48A',
    eta: 'Tomorrow 11:00', status: 'Scheduled', priority: 'Medium', delayed: false,
    eWayBill: true, invoice: true, challan: true, packingPct: 100,
    timelineSteps: [
      { step: 'Order Confirmed', done: true, time: '08:00' },
      { step: 'Packing Started', done: true, time: '09:20' },
      { step: 'Packed & Ready', done: true, time: '12:10' },
      { step: 'Vehicle Assigned', done: true, time: '13:00' },
      { step: 'Dispatched', done: false },
      { step: 'Delivered', done: false },
    ],
  },
  {
    id: 'DIS-003', orderId: 'ORD-1009', client: 'Mahindra Components', qty: 1200, unit: 'pcs',
    vehicle: 'MH14-EF-7763', driver: 'Anand Kumar', route: 'Pune → Nashik SH60',
    eta: 'Today 17:00', status: 'In Transit', priority: 'High', delayed: false,
    eWayBill: true, invoice: true, challan: true, packingPct: 100,
    timelineSteps: [
      { step: 'Order Confirmed', done: true, time: '07:00' },
      { step: 'Packing Started', done: true, time: '08:00' },
      { step: 'Packed & Ready', done: true, time: '10:30' },
      { step: 'Vehicle Assigned', done: true, time: '11:00' },
      { step: 'Dispatched', done: true, time: '11:45' },
      { step: 'Delivered', done: false },
    ],
  },
  {
    id: 'DIS-004', orderId: 'ORD-0998', client: 'Kirloskar Group', qty: 750, unit: 'kg',
    vehicle: 'MH12-GH-1122', driver: 'Pravin Shinde', route: 'Pune → Kolhapur NH48',
    eta: 'Yesterday 16:00', status: 'Delivered', priority: 'Low', delayed: false,
    eWayBill: true, invoice: true, challan: true, packingPct: 100,
    timelineSteps: [
      { step: 'Order Confirmed', done: true, time: '09:00' },
      { step: 'Packing Started', done: true, time: '10:00' },
      { step: 'Packed & Ready', done: true, time: '12:00' },
      { step: 'Vehicle Assigned', done: true, time: '12:30' },
      { step: 'Dispatched', done: true, time: '13:10' },
      { step: 'Delivered', done: true, time: '16:05' },
    ],
  },
  {
    id: 'DIS-005', orderId: 'ORD-1031', client: 'Bosch India Ltd.', qty: 300, unit: 'units',
    vehicle: 'KA09-JK-4455', driver: 'Vijay Rao', route: 'Pune → Bengaluru NH48',
    eta: 'Tomorrow 09:00', status: 'Packed', priority: 'High', delayed: false,
    eWayBill: false, invoice: true, challan: false, packingPct: 100,
    timelineSteps: [
      { step: 'Order Confirmed', done: true, time: '11:00' },
      { step: 'Packing Started', done: true, time: '13:00' },
      { step: 'Packed & Ready', done: true, time: '16:30' },
      { step: 'Vehicle Assigned', done: false },
      { step: 'Dispatched', done: false },
      { step: 'Delivered', done: false },
    ],
  },
  {
    id: 'DIS-006', orderId: 'ORD-1005', client: 'Hero MotoCorp', qty: 500, unit: 'pcs',
    vehicle: 'DL01-LM-9988', driver: 'Ravi Sharma', route: 'Pune → Delhi NH44',
    eta: 'Last Monday', status: 'Returned', priority: 'Medium', delayed: true,
    eWayBill: true, invoice: true, challan: true, packingPct: 100,
    timelineSteps: [
      { step: 'Order Confirmed', done: true, time: 'Mon 08:00' },
      { step: 'Packing Started', done: true, time: 'Mon 09:30' },
      { step: 'Packed & Ready', done: true, time: 'Mon 14:00' },
      { step: 'Vehicle Assigned', done: true, time: 'Mon 14:30' },
      { step: 'Dispatched', done: true, time: 'Mon 15:00' },
      { step: 'Returned', done: true, time: 'Wed 10:00' },
    ],
  },
];

const TABS = ['Dispatch Queue', 'Packed', 'Scheduled', 'In Transit', 'Delivered', 'Returned'];

const TAB_TO_STATUS: Record<string, DispatchItem['status']> = {
  'Dispatch Queue': 'Queue',
  'Packed': 'Packed',
  'Scheduled': 'Scheduled',
  'In Transit': 'In Transit',
  'Delivered': 'Delivered',
  'Returned': 'Returned',
};

const priorityTone: Record<string, string> = {
  High: 'danger', Medium: 'warning', Low: 'steel',
};

const statusTone: Record<string, string> = {
  Queue: 'steel', Packed: 'info', Scheduled: 'primary', 'In Transit': 'warning',
  Delivered: 'success', Returned: 'orange',
};

// ─────────────────────────────────────────────
//  Sub-components
// ─────────────────────────────────────────────
const DocIndicator: React.FC<{ label: string; done: boolean }> = ({ label, done }) => (
  <View style={docStyles.wrap}>
    <View style={[docStyles.icon, { backgroundColor: done ? colors.successBg : colors.dangerBg }]}>
      <Text style={{ fontSize: 10, color: done ? colors.success : colors.danger }}>
        {done ? '✓' : '✗'}
      </Text>
    </View>
    <Text style={[typography.micro, { color: done ? colors.success : colors.danger, marginTop: 2 }]}>
      {label}
    </Text>
  </View>
);

const docStyles = StyleSheet.create({
  wrap: { alignItems: 'center', marginRight: spacing.md },
  icon: {
    width: 22, height: 22, borderRadius: radius.xs,
    alignItems: 'center', justifyContent: 'center',
  },
});

const StatusTimeline: React.FC<{ steps: DispatchItem['timelineSteps'] }> = ({ steps }) => (
  <View style={{ marginTop: spacing.md }}>
    {steps.map((s, i) => (
      <View key={i} style={tlStyles.row}>
        <View style={tlStyles.dotCol}>
          <View style={[tlStyles.dot, s.done && tlStyles.dotDone]} />
          {i < steps.length - 1 && <View style={[tlStyles.line, s.done && tlStyles.lineDone]} />}
        </View>
        <View style={tlStyles.content}>
          <Text style={[typography.small, { color: s.done ? colors.text : colors.textSubtle }]}>
            {s.step}
          </Text>
          {s.time ? (
            <Text style={[typography.micro, { marginTop: 2 }]}>{s.time}</Text>
          ) : null}
        </View>
      </View>
    ))}
  </View>
);

const tlStyles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 2 },
  dotCol: { alignItems: 'center', width: 20, marginRight: spacing.sm },
  dot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.border, borderWidth: 1.5, borderColor: colors.steelLight,
  },
  dotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  lineDone: { backgroundColor: colors.accent },
  content: { flex: 1, paddingBottom: 10 },
});

const MapPreview: React.FC<{ route: string }> = ({ route }) => (
  <View style={mapStyles.wrap}>
    <View style={mapStyles.grid}>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <View
            key={`${r}-${c}`}
            style={[
              mapStyles.cell,
              (r === 1 && c >= 1 && c <= 5) && { backgroundColor: colors.accent, opacity: 0.5 },
              (r === 2 && c >= 3 && c <= 7) && { backgroundColor: colors.accent, opacity: 0.3 },
            ]}
          />
        ))
      )}
    </View>
    <View style={mapStyles.overlay}>
      <Badge text="📍 Route Preview" tone="primary" />
      <Text style={[typography.micro, { marginTop: 4, color: colors.textMuted }]}>{route}</Text>
    </View>
  </View>
);

const mapStyles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md, overflow: 'hidden', marginTop: spacing.md,
    backgroundColor: '#E8F4F8', borderWidth: 1, borderColor: colors.border,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.sm },
  cell: {
    width: '10%', height: 20, margin: 1,
    backgroundColor: colors.divider, borderRadius: 2,
  },
  overlay: {
    padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});

// ─────────────────────────────────────────────
//  Dispatch Card
// ─────────────────────────────────────────────
const DispatchCard: React.FC<{ item: DispatchItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={styles.card}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.idRow}>
            <Text style={styles.dispatchId}>{item.id}</Text>
            <Badge text={item.priority} tone={priorityTone[item.priority]} dot />
            {item.delayed && <Badge text="⚠ DELAYED" tone="danger" style={{ marginLeft: 4 }} />}
          </View>
          <Text style={[typography.small, { marginTop: 2 }]}>
            {item.orderId} · {item.client}
          </Text>
        </View>
        <Badge text={item.status} tone={statusTone[item.status]} />
      </View>

      <Divider style={{ marginVertical: spacing.sm }} />

      {/* Core info */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>QTY</Text>
          <Text style={styles.infoVal}>{item.qty} {item.unit}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>VEHICLE</Text>
          <Text style={styles.infoVal}>{item.vehicle}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>DRIVER</Text>
          <Text style={styles.infoVal}>{item.driver}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>ETA</Text>
          <Text style={[styles.infoVal, { color: item.delayed ? colors.danger : colors.text }]}>
            {item.eta}
          </Text>
        </View>
      </View>

      {/* Packing progress */}
      {item.status !== 'Delivered' && item.status !== 'Returned' && (
        <View style={{ marginTop: spacing.sm }}>
          <View style={styles.packingRow}>
            <Text style={typography.micro}>PACKING STATUS</Text>
            <Text style={[typography.micro, { color: item.packingPct === 100 ? colors.success : colors.warning }]}>
              {item.packingPct}%
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.packingPct}%`,
                  backgroundColor: item.packingPct === 100 ? colors.success : colors.warning,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Document checklist */}
      <View style={styles.docRow}>
        <DocIndicator label="e-Way Bill" done={item.eWayBill} />
        <DocIndicator label="Invoice" done={item.invoice} />
        <DocIndicator label="Challan" done={item.challan} />
      </View>

      {/* Expand toggle */}
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={styles.expandBtn}
        activeOpacity={0.7}
      >
        <Text style={[typography.small, { color: colors.primary }]}>
          {expanded ? '▲ Hide Details' : '▼ View Timeline & Map'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <Divider style={{ marginVertical: spacing.sm }} />
          <Text style={[typography.small, { fontWeight: '700', color: colors.text }]}>
            Delivery Timeline
          </Text>
          <StatusTimeline steps={item.timelineSteps} />
          <Text style={[typography.small, { fontWeight: '700', color: colors.text, marginTop: spacing.sm }]}>
            Route
          </Text>
          <MapPreview route={item.route} />
        </>
      )}

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        {item.status === 'Queue' && (
          <>
            <Button label="Mark Packed" variant="secondary" small style={styles.actionBtn} />
            <Button label="Assign Vehicle" variant="primary" small style={styles.actionBtn} />
          </>
        )}
        {item.status === 'Packed' && (
          <>
            <Button label="Print Slip" variant="secondary" small style={styles.actionBtn} />
            <Button label="Mark Shipped" variant="primary" small style={styles.actionBtn} />
          </>
        )}
        {item.status === 'Scheduled' && (
          <>
            <Button label="Print Slip" variant="secondary" small style={styles.actionBtn} />
            <Button label="Mark Shipped" variant="primary" small style={styles.actionBtn} />
          </>
        )}
        {item.status === 'In Transit' && (
          <Button label="Confirm Delivery" variant="primary" small style={[styles.actionBtn, { flex: 1 }]} />
        )}
        {(item.status === 'Delivered' || item.status === 'Returned') && (
          <Button label="View Proof" variant="ghost" small style={[styles.actionBtn, { flex: 1 }]} />
        )}
      </View>
    </Card>
  );
};

// ─────────────────────────────────────────────
//  Advanced Blocks
// ─────────────────────────────────────────────
const AdvancedBlocks: React.FC = () => (
  <View>
    <SectionTitle title="Logistics Intelligence" />
    {/* On-time dispatch score */}
    <Card style={styles.advCard}>
      <View style={styles.scoreRow}>
        <View style={{ flex: 1 }}>
          <Text style={typography.h3}>On-Time Dispatch Score</Text>
          <Text style={[typography.bodyMuted, { marginTop: 4 }]}>
            84% of dispatches this week departed on schedule.
          </Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreVal}>84%</Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.md }}>
        <Gauge value={84} label="On-Time Rate" color={colors.accent} />
      </View>
    </Card>

    {/* Delay summary */}
    <Card style={styles.advCard}>
      <Text style={typography.h3}>Logistics Delay Summary</Text>
      <View style={styles.delaySummary}>
        {[
          { label: 'Due to Packing', count: 2, tone: 'warning' },
          { label: 'Vehicle Unavailable', count: 1, tone: 'danger' },
          { label: 'Doc Incomplete', count: 1, tone: 'orange' },
          { label: 'Route Issue', count: 0, tone: 'steel' },
        ].map((d) => (
          <View key={d.label} style={styles.delayRow}>
            <Text style={typography.bodyMuted}>{d.label}</Text>
            <Badge text={`${d.count} delay${d.count !== 1 ? 's' : ''}`} tone={d.count > 0 ? d.tone : 'steel'} />
          </View>
        ))}
      </View>
    </Card>

    {/* Route efficiency */}
    <Card style={styles.advCard}>
      <Text style={typography.h3}>Daily Route Efficiency</Text>
      <View style={styles.routeGrid}>
        {[
          { route: 'Pune → Mumbai', efficiency: 91, trips: 8 },
          { route: 'Pune → Nashik', efficiency: 87, trips: 4 },
          { route: 'Pune → Surat', efficiency: 78, trips: 3 },
          { route: 'Pune → Delhi', efficiency: 72, trips: 2 },
        ].map((r) => (
          <View key={r.route} style={styles.routeItem}>
            <View style={styles.routeInfo}>
              <Text style={typography.body}>{r.route}</Text>
              <Text style={typography.bodyMuted}>{r.trips} trips today</Text>
            </View>
            <View style={{ width: 80 }}>
              <View style={styles.progressBg}>
                <View
                  style={[styles.progressFill, { width: `${r.efficiency}%`, backgroundColor: colors.accent }]}
                />
              </View>
              <Text style={[typography.micro, { textAlign: 'right', marginTop: 2 }]}>
                {r.efficiency}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>

    {/* High-priority alerts */}
    <Card style={[styles.advCard, { backgroundColor: colors.dangerBg }]}>
      <View style={styles.alertHeader}>
        <Text style={[typography.h3, { color: colors.danger }]}>🚨 High-Priority Alerts</Text>
        <Badge text="2 Active" tone="danger" />
      </View>
      {[
        { id: 'DIS-001', msg: 'DIS-001 packing 35% incomplete — dispatch in 2hrs' },
        { id: 'DIS-005', msg: 'DIS-005 missing e-Way Bill — cannot dispatch' },
      ].map((a) => (
        <View key={a.id} style={styles.alertItem}>
          <Text style={styles.alertDot}>●</Text>
          <Text style={[typography.body, { flex: 1, color: colors.danger }]}>{a.msg}</Text>
        </View>
      ))}
    </Card>

    {/* Pending packing */}
    <Card style={styles.advCard}>
      <View style={styles.pendingRow}>
        <View>
          <Text style={typography.h3}>Pending Packing</Text>
          <Text style={[typography.bodyMuted, { marginTop: 4 }]}>
            3 orders awaiting packing completion
          </Text>
        </View>
        <Badge text="3 Orders" tone="warning" dot />
      </View>
    </Card>
  </View>
);

// ─────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────
export const DispatchLogisticsScreen: React.FC = () => {
  const { pop } = useNav();
  const [activeTab, setActiveTab] = useState('Dispatch Queue');

  const statusKey = TAB_TO_STATUS[activeTab];
  const filtered = dispatches.filter((d) => d.status === statusKey);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Dispatch & Logistics"
        subtitle="Plant 1 — Pune"
        showBack
        rightIcon="+"
      />

      {/* Quick action bar */}
      <View style={styles.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { icon: '📅', label: 'Schedule' },
            { icon: '🚛', label: 'Assign Vehicle' },
            { icon: '🖨', label: 'Print Slip' },
            { icon: '📦', label: 'Mark Packed' },
            { icon: '✈', label: 'Mark Shipped' },
            { icon: '✅', label: 'Confirm Delivery' },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.qAction} activeOpacity={0.8}>
              <Text style={styles.qIcon}>{a.icon}</Text>
              <Text style={styles.qLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((t) => {
            const active = t === activeTab;
            const count = dispatches.filter((d) => d.status === TAB_TO_STATUS[t]).length;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
                {count > 0 && (
                  <View style={[styles.tabCount, active && styles.tabCountActive]}>
                    <Text style={[styles.tabCountText, active && { color: colors.primary }]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Cards */}
        {filtered.length === 0 ? (
          <Card style={styles.empty}>
            <Text style={[typography.bodyMuted, { textAlign: 'center' }]}>
              No dispatches in this category.
            </Text>
          </Card>
        ) : (
          filtered.map((item) => <DispatchCard key={item.id} item={item} />)
        )}

        <AdvancedBlocks />

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

// ─────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  quickBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  qAction: {
    alignItems: 'center',
    marginRight: spacing.lg,
    minWidth: 60,
  },
  qIcon: { fontSize: 20 },
  qLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 3 },
  tabScroll: { marginTop: spacing.md },
  tabContainer: { paddingRight: spacing.lg },
  tabBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill, marginRight: spacing.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  tabCount: {
    marginLeft: 5, backgroundColor: colors.border,
    borderRadius: radius.pill, paddingHorizontal: 6, paddingVertical: 1,
  },
  tabCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabCountText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  card: { marginTop: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dispatchId: { fontSize: 15, fontWeight: '800', color: colors.text },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  infoItem: { width: '50%', marginBottom: spacing.sm },
  infoVal: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 },
  packingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressBg: {
    height: 6, borderRadius: 4, backgroundColor: colors.divider, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  docRow: { flexDirection: 'row', marginTop: spacing.md },
  expandBtn: { marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs },
  actionsRow: { flexDirection: 'row', marginTop: spacing.sm, gap: 8 },
  actionBtn: { flex: 1 },
  empty: { marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.xxl },
  advCard: { marginTop: spacing.md },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  scoreBadge: {
    width: 56, height: 56, borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreVal: { fontSize: 18, fontWeight: '900', color: colors.accent },
  delaySummary: { marginTop: spacing.sm },
  delayRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  routeGrid: { marginTop: spacing.sm },
  routeItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  routeInfo: { flex: 1 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  alertItem: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.xs },
  alertDot: { color: colors.danger, marginRight: spacing.sm, marginTop: 1 },
  pendingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
