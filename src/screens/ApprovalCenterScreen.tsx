import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ─────────────────────────────────────────────
//  Mock data
// ─────────────────────────────────────────────
type ApprovalItem = {
  id: string;
  type: 'Quotation' | 'Purchase Request' | 'Purchase Order' | 'Production Change' | 'Dispatch' | 'Payment' | 'Vendor';
  title: string;
  requestedBy: string;
  requestedAt: string;
  pendingSince: string;   // human-readable
  pendingHours: number;
  slaHours: number;       // SLA limit in hours
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  currentApprover: string;
  approverRole: string;
  approvalChain: { name: string; role: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Waiting' }[];
  amount?: string;
  detail: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'On Hold';
  risk: 'High' | 'Medium' | 'Low';
  history: { action: string; by: string; at: string; comment?: string }[];
};

const approvals: ApprovalItem[] = [
  {
    id: 'APR-201', type: 'Quotation', title: 'Quote for Tata Forge — 480 Flanges',
    requestedBy: 'Priya Mehta (Sales)', requestedAt: 'Apr 22, 08:30', pendingSince: '3h 20m',
    pendingHours: 3.3, slaHours: 4, priority: 'Critical', amount: '₹2,84,000',
    currentApprover: 'Ramesh Nair', approverRole: 'Sales Head',
    approvalChain: [
      { name: 'Priya Mehta', role: 'Sales Exec', status: 'Approved' },
      { name: 'Ramesh Nair', role: 'Sales Head', status: 'Pending' },
      { name: 'Suresh Iyer', role: 'MD', status: 'Waiting' },
    ],
    detail: 'Customer Tata Forge has requested a quotation for 480 precision flanges (Grade A). Delivery in 10 days. Margin: 22%. Requires MD approval due to order value > ₹2L.',
    status: 'Pending', risk: 'Low',
    history: [
      { action: 'Submitted', by: 'Priya Mehta', at: 'Apr 22, 08:30' },
      { action: 'Approved', by: 'Priya Mehta', at: 'Apr 22, 08:31', comment: 'Self-forwarded after review' },
    ],
  },
  {
    id: 'APR-202', type: 'Purchase Request', title: 'Steel Coil 4mm × 500kg Reorder',
    requestedBy: 'Anil Kumar (Stores)', requestedAt: 'Apr 21, 14:00', pendingSince: '18h',
    pendingHours: 18, slaHours: 12, priority: 'High', amount: '₹96,000',
    currentApprover: 'Vinod Shah', approverRole: 'Purchase Manager',
    approvalChain: [
      { name: 'Anil Kumar', role: 'Stores', status: 'Approved' },
      { name: 'Vinod Shah', role: 'Purchase Manager', status: 'Pending' },
      { name: 'Suresh Iyer', role: 'MD', status: 'Waiting' },
    ],
    detail: 'Steel Coil 4mm stock is at 210kg against reorder level of 500kg. Recommended vendor: Agarwal Steel & Alloys. Delivery time: 3 days. Pending for 18hrs — SLA breached.',
    status: 'Pending', risk: 'High',
    history: [
      { action: 'Submitted', by: 'Anil Kumar', at: 'Apr 21, 14:00' },
    ],
  },
  {
    id: 'APR-203', type: 'Purchase Order', title: 'PO to Agarwal Steel & Alloys',
    requestedBy: 'Vinod Shah (Purchase)', requestedAt: 'Apr 22, 09:00', pendingSince: '2h 45m',
    pendingHours: 2.75, slaHours: 6, priority: 'High', amount: '₹1,12,000',
    currentApprover: 'Suresh Iyer', approverRole: 'MD',
    approvalChain: [
      { name: 'Vinod Shah', role: 'Purchase Manager', status: 'Approved' },
      { name: 'Suresh Iyer', role: 'MD', status: 'Pending' },
    ],
    detail: 'PO for 600kg Steel Coil 4mm at ₹186.67/kg from Agarwal Steel & Alloys. Previous PO value: ₹96,000. Additional 100kg buffer included. Standard credit terms: Net 30.',
    status: 'Pending', risk: 'Low',
    history: [
      { action: 'Submitted', by: 'Vinod Shah', at: 'Apr 22, 09:00' },
      { action: 'Approved', by: 'Vinod Shah', at: 'Apr 22, 09:01' },
    ],
  },
  {
    id: 'APR-204', type: 'Production Change', title: 'Change Line 2 Shift Timing',
    requestedBy: 'Rohan Desai (Plant Ops)', requestedAt: 'Apr 21, 10:00', pendingSince: '1 day',
    pendingHours: 24, slaHours: 24, priority: 'Medium',
    currentApprover: 'Ramesh Nair', approverRole: 'Plant Head',
    approvalChain: [
      { name: 'Rohan Desai', role: 'Plant Ops', status: 'Approved' },
      { name: 'Ramesh Nair', role: 'Plant Head', status: 'Pending' },
    ],
    detail: 'Requesting shift of Line 2 operations to night shift (20:00–04:00) to improve batch output by 8%. Estimated OT cost: ₹18,000/week. Recommended by AI optimization engine.',
    status: 'Pending', risk: 'Medium',
    history: [
      { action: 'Submitted', by: 'Rohan Desai', at: 'Apr 21, 10:00' },
    ],
  },
  {
    id: 'APR-205', type: 'Dispatch', title: 'Dispatch DIS-001 — Tata Forge',
    requestedBy: 'Sunil Patil (Dispatch)', requestedAt: 'Apr 22, 11:00', pendingSince: '45m',
    pendingHours: 0.75, slaHours: 2, priority: 'Critical', amount: '₹2,84,000',
    currentApprover: 'Ramesh Nair', approverRole: 'Dispatch Head',
    approvalChain: [
      { name: 'Sunil Patil', role: 'Dispatch', status: 'Approved' },
      { name: 'Ramesh Nair', role: 'Dispatch Head', status: 'Pending' },
    ],
    detail: 'DIS-001 for Tata Forge (480 pcs, ORD-1024). Vehicle MH12-AB-9021, Driver Ramesh Patil. Challan missing — needs waiver approval. ETA: Today 15:30.',
    status: 'Pending', risk: 'High',
    history: [
      { action: 'Submitted', by: 'Sunil Patil', at: 'Apr 22, 11:00' },
    ],
  },
  {
    id: 'APR-206', type: 'Payment', title: 'Payment to Shree Plastics ₹38,500',
    requestedBy: 'Meena Joshi (Finance)', requestedAt: 'Apr 22, 10:30', pendingSince: '1h 15m',
    pendingHours: 1.25, slaHours: 4, priority: 'High', amount: '₹38,500',
    currentApprover: 'Suresh Iyer', approverRole: 'MD',
    approvalChain: [
      { name: 'Meena Joshi', role: 'Finance', status: 'Approved' },
      { name: 'Suresh Iyer', role: 'MD', status: 'Pending' },
    ],
    detail: 'Overdue payment to Shree Plastics Pvt. (PO-INV-220) for plastic components. Amount: ₹38,500. Due date was Apr 22, 2026. Vendor has sent final reminder.',
    status: 'Pending', risk: 'High',
    history: [
      { action: 'Submitted', by: 'Meena Joshi', at: 'Apr 22, 10:30' },
    ],
  },
  {
    id: 'APR-207', type: 'Vendor', title: 'New Vendor Onboarding — Kalyani Metals',
    requestedBy: 'Vinod Shah (Purchase)', requestedAt: 'Apr 20, 09:00', pendingSince: '2 days',
    pendingHours: 48, slaHours: 48, priority: 'Low',
    currentApprover: 'Suresh Iyer', approverRole: 'MD',
    approvalChain: [
      { name: 'Vinod Shah', role: 'Purchase', status: 'Approved' },
      { name: 'Ramesh Nair', role: 'Operations', status: 'Approved' },
      { name: 'Suresh Iyer', role: 'MD', status: 'Pending' },
    ],
    detail: 'Kalyani Metals Pvt. Ltd. — new vendor for cold-rolled steel sheets. Verified documents: GSTIN, PAN, Bank Mandate, Quality Certificate. Trial order planned: 200kg @ ₹192/kg.',
    status: 'Pending', risk: 'Low',
    history: [
      { action: 'Submitted', by: 'Vinod Shah', at: 'Apr 20, 09:00' },
      { action: 'Approved', by: 'Ramesh Nair', at: 'Apr 21, 10:00', comment: 'Vendor looks good' },
    ],
  },
];

const TABS = ['Quotation', 'Purchase Request', 'Purchase Order', 'Production Change', 'Dispatch', 'Payment', 'Vendor'];

const priorityTone: Record<string, string> = {
  Critical: 'danger', High: 'orange', Medium: 'warning', Low: 'steel',
};

const statusTone: Record<string, string> = {
  Pending: 'warning', Approved: 'success', Rejected: 'danger', 'On Hold': 'steel',
};

const chainStatusTone: Record<string, string> = {
  Approved: 'success', Pending: 'warning', Rejected: 'danger', Waiting: 'steel',
};

// SLA timer
const SLATimer: React.FC<{ pendingHours: number; slaHours: number }> = ({ pendingHours, slaHours }) => {
  const pct = Math.min(100, (pendingHours / slaHours) * 100);
  const breached = pendingHours >= slaHours;
  const color = breached ? colors.danger : pct > 70 ? colors.warning : colors.accent;
  return (
    <View style={slaStyles.wrap}>
      <View style={slaStyles.header}>
        <Text style={typography.micro}>SLA TIMER</Text>
        <Badge
          text={breached ? '⚠ SLA BREACHED' : `${Math.max(0, slaHours - pendingHours).toFixed(1)}h remaining`}
          tone={breached ? 'danger' : pct > 70 ? 'warning' : 'accent'}
        />
      </View>
      <View style={slaStyles.track}>
        <View style={[slaStyles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const slaStyles = StyleSheet.create({
  wrap: { marginTop: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  track: { height: 6, borderRadius: 4, backgroundColor: colors.divider, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
});

// Approval chain
const ApprovalChain: React.FC<{ chain: ApprovalItem['approvalChain'] }> = ({ chain }) => (
  <View style={chainStyles.wrap}>
    {chain.map((c, i) => (
      <View key={i} style={chainStyles.item}>
        <View style={[chainStyles.dot, { backgroundColor: c.status === 'Approved' ? colors.success : c.status === 'Rejected' ? colors.danger : c.status === 'Pending' ? colors.warning : colors.border }]} />
        {i < chain.length - 1 && <View style={chainStyles.line} />}
        <View style={chainStyles.info}>
          <Text style={[typography.small, { color: colors.text }]}>{c.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Text style={typography.micro}>{c.role}</Text>
            <Badge text={c.status} tone={chainStatusTone[c.status]} />
          </View>
        </View>
      </View>
    ))}
  </View>
);

const chainStyles = StyleSheet.create({
  wrap: { marginTop: spacing.sm },
  item: { flexDirection: 'row', marginBottom: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 3, marginRight: spacing.sm },
  line: { display: 'none' },
  info: { flex: 1 },
});

// ─────────────────────────────────────────────
//  Approval Card
// ─────────────────────────────────────────────
const ApprovalCard: React.FC<{ item: ApprovalItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState('');

  return (
    <Card style={[styles.card, item.priority === 'Critical' && { borderWidth: 1, borderColor: colors.danger }]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <View style={styles.idRow}>
            <Text style={styles.approvalId}>{item.id}</Text>
            <Badge text={item.priority} tone={priorityTone[item.priority]} dot />
          </View>
          <Text style={[typography.body, { marginTop: 4, fontWeight: '700' }]}>{item.title}</Text>
          <Text style={[typography.bodyMuted, { marginTop: 2 }]}>
            By {item.requestedBy} · {item.requestedAt}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Badge text={item.type} tone="primary" />
          {item.amount && (
            <Text style={[styles.amount, { marginTop: spacing.xs }]}>{item.amount}</Text>
          )}
        </View>
      </View>

      {/* Pending time + SLA */}
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Text style={typography.micro}>PENDING SINCE</Text>
          <Text style={[typography.body, { color: item.pendingHours >= item.slaHours ? colors.danger : colors.text }]}>
            {item.pendingSince}
          </Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={typography.micro}>CURRENT APPROVER</Text>
          <Text style={typography.body}>{item.currentApprover}</Text>
          <Text style={typography.bodyMuted}>{item.approverRole}</Text>
        </View>
      </View>

      <SLATimer pendingHours={item.pendingHours} slaHours={item.slaHours} />

      {/* Expand toggle */}
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={styles.expandBtn}
        activeOpacity={0.7}
      >
        <Text style={[typography.small, { color: colors.primary }]}>
          {expanded ? '▲ Collapse' : '▼ View Details & Act'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <Divider style={{ marginVertical: spacing.sm }} />

          {/* Detail */}
          <View style={styles.detailBlock}>
            <Text style={[typography.small, { fontWeight: '700', marginBottom: spacing.xs }]}>
              Detail
            </Text>
            <Text style={typography.bodyMuted}>{item.detail}</Text>
          </View>

          {/* Approval chain */}
          <View style={{ marginTop: spacing.md }}>
            <Text style={[typography.small, { fontWeight: '700', marginBottom: spacing.xs }]}>
              Approval Chain
            </Text>
            <ApprovalChain chain={item.approvalChain} />
          </View>

          {/* Approval history */}
          {item.history.length > 0 && (
            <View style={{ marginTop: spacing.sm }}>
              <Text style={[typography.small, { fontWeight: '700', marginBottom: spacing.xs }]}>
                History
              </Text>
              {item.history.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <Badge text={h.action} tone={h.action === 'Approved' ? 'success' : h.action === 'Rejected' ? 'danger' : 'steel'} />
                  <Text style={[typography.bodyMuted, { flex: 1, marginLeft: spacing.sm }]}>
                    {h.by} · {h.at}
                    {h.comment ? ` — "${h.comment}"` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Comment box */}
          <View style={{ marginTop: spacing.md }}>
            <Text style={[typography.small, { fontWeight: '700', marginBottom: spacing.xs }]}>
              Add Comment
            </Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Type your remarks or reason…"
              placeholderTextColor={colors.textSubtle}
              style={styles.commentInput}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.actionGrid}>
            <Button label="✓ Approve" variant="primary" style={styles.actionBtn} />
            <Button label="✗ Reject" variant="danger" style={styles.actionBtn} />
            <Button label="⏸ Hold" variant="secondary" style={styles.actionBtn} />
            <Button label="↩ Send Back" variant="ghost" style={styles.actionBtn} />
          </View>
        </>
      )}
    </Card>
  );
};

// ─────────────────────────────────────────────
//  Advanced Blocks
// ─────────────────────────────────────────────
const AdvancedBlocks: React.FC<{ items: ApprovalItem[] }> = ({ items }) => {
  const breached = items.filter((a) => a.pendingHours >= a.slaHours);
  const critical = items.filter((a) => a.priority === 'Critical' || a.priority === 'High');
  const lowRisk = items.filter((a) => a.risk === 'Low');

  return (
    <View>
      <SectionTitle title="Approval Intelligence" />

      {/* Urgency overview */}
      <View style={styles.urgencyRow}>
        {[
          { label: 'Critical', count: items.filter((a) => a.priority === 'Critical').length, color: colors.danger },
          { label: 'High', count: items.filter((a) => a.priority === 'High').length, color: colors.alertOrange },
          { label: 'SLA Breached', count: breached.length, color: colors.warning },
          { label: 'Pending', count: items.length, color: colors.info },
        ].map((u) => (
          <View key={u.label} style={[styles.urgencyItem, { borderTopColor: u.color }]}>
            <Text style={[styles.urgencyCount, { color: u.color }]}>{u.count}</Text>
            <Text style={typography.micro}>{u.label}</Text>
          </View>
        ))}
      </View>

      {/* Bottleneck alert */}
      {breached.length > 0 && (
        <Card style={[styles.advCard, { backgroundColor: colors.dangerBg }]}>
          <View style={styles.bottleneckHeader}>
            <Text style={[typography.h3, { color: colors.danger }]}>🚧 Approval Bottleneck</Text>
            <Badge text={`${breached.length} SLA Breached`} tone="danger" />
          </View>
          {breached.map((a) => (
            <View key={a.id} style={styles.bottleneckItem}>
              <Text style={[typography.body, { color: colors.danger }]}>{a.id} — {a.title}</Text>
              <Text style={typography.bodyMuted}>
                Pending {a.pendingSince} · {a.currentApprover} ({a.approverRole})
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* Bulk approval for low-risk */}
      {lowRisk.length > 0 && (
        <Card style={[styles.advCard, { borderWidth: 1, borderColor: colors.accent }]}>
          <View style={styles.bulkHeader}>
            <View style={{ flex: 1 }}>
              <Text style={typography.h3}>⚡ Quick Bulk Approval</Text>
              <Text style={[typography.bodyMuted, { marginTop: 4 }]}>
                {lowRisk.length} low-risk items can be approved in bulk
              </Text>
            </View>
            <Button label="Approve All Low-Risk" variant="primary" small />
          </View>
          {lowRisk.map((a) => (
            <View key={a.id} style={styles.bulkItem}>
              <Badge text={a.type} tone="steel" />
              <Text style={[typography.small, { flex: 1, marginLeft: spacing.sm }]}>{a.title}</Text>
              <Badge text={a.risk} tone="success" />
            </View>
          ))}
        </Card>
      )}

      {/* Smart urgency summary */}
      <Card style={styles.advCard}>
        <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Smart Urgency Overview</Text>
        {[
          { type: 'Dispatch', count: 1, note: 'Dispatch to Tata Forge — SLA in 1.25h' },
          { type: 'Purchase Request', count: 1, note: 'Steel Coil reorder — SLA breached 6h ago' },
          { type: 'Payment', count: 1, note: 'Shree Plastics vendor overdue payment' },
        ].map((s) => (
          <View key={s.type} style={styles.urgencySummaryRow}>
            <Badge text={s.type} tone="primary" />
            <Text style={[typography.bodyMuted, { flex: 1, marginLeft: spacing.sm }]}>{s.note}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
};

// ─────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────
export const ApprovalCenterScreen: React.FC = () => {
  const { pop } = useNav();
  const [activeTab, setActiveTab] = useState('Quotation');

  const filtered = approvals.filter((a) => a.type === activeTab);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Approval Center"
        subtitle="All Pending Approvals"
        showBack
        rightIcon="⚙"
      />

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
            const count = approvals.filter((a) => a.type === t).length;
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
              No pending approvals in this category.
            </Text>
          </Card>
        ) : (
          filtered.map((item) => <ApprovalCard key={item.id} item={item} />)
        )}

        <AdvancedBlocks items={approvals} />
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
    marginLeft: 5, backgroundColor: colors.border, borderRadius: radius.pill,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  tabCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabCountText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  card: { marginTop: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  approvalId: { fontSize: 14, fontWeight: '800', color: colors.textMuted },
  amount: { fontSize: 16, fontWeight: '900', color: colors.text },
  timeRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.md },
  timeItem: { flex: 1 },
  expandBtn: { marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs },
  detailBlock: {
    backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, padding: spacing.md,
  },
  historyItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  commentInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    padding: spacing.md, fontSize: 14, color: colors.text,
    backgroundColor: colors.surfaceAlt, minHeight: 60,
    textAlignVertical: 'top',
  },
  actionGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md,
  },
  actionBtn: { flex: 1, minWidth: '45%' },
  empty: { marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.xxl },
  advCard: { marginTop: spacing.md },
  urgencyRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  urgencyItem: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, borderTopWidth: 3, ...shadow.soft,
    alignItems: 'center',
  },
  urgencyCount: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  bottleneckHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm,
  },
  bottleneckItem: {
    paddingVertical: spacing.sm, borderBottomWidth: 1,
    borderBottomColor: 'rgba(220,38,38,0.2)',
  },
  bulkHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  bulkItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  urgencySummaryRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
});
