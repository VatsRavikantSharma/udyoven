import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge, Button, Card, Divider, Gauge, Row, SectionTitle, Sparkline } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { collectionTrend } from '../data/mockData';

// ─────────────────────────────────────────────
//  Mock data
// ─────────────────────────────────────────────
type InvoiceItem = {
  id: string;
  party: string;          // client or vendor name
  partyType: 'Client' | 'Vendor';
  amount: number;         // INR
  tax: number;            // GST amount
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  linkedRef: string;      // PO or Order ref
  partialPaid?: number;
  creditNote?: number;
  debitNote?: number;
  invoiceDate: string;
  tab: 'Invoices' | 'Receivables' | 'Payables' | 'Pending Payments' | 'Completed Payments';
};

const invoices: InvoiceItem[] = [
  {
    id: 'INV-1047', party: 'Tata Forge Ltd.', partyType: 'Client', amount: 284000, tax: 51120,
    dueDate: 'Apr 25, 2026', status: 'Overdue', linkedRef: 'ORD-1024',
    invoiceDate: 'Apr 01, 2026', tab: 'Receivables', partialPaid: 100000,
  },
  {
    id: 'INV-1046', party: 'Bharat Steel Works', partyType: 'Client', amount: 142000, tax: 25560,
    dueDate: 'Apr 30, 2026', status: 'Pending', linkedRef: 'ORD-1018',
    invoiceDate: 'Apr 08, 2026', tab: 'Receivables',
  },
  {
    id: 'INV-1045', party: 'Mahindra Components', partyType: 'Client', amount: 680000, tax: 122400,
    dueDate: 'May 05, 2026', status: 'Partial', linkedRef: 'ORD-1009',
    invoiceDate: 'Apr 10, 2026', tab: 'Receivables', partialPaid: 340000,
    creditNote: 12000,
  },
  {
    id: 'INV-1044', party: 'Kirloskar Group', partyType: 'Client', amount: 319000, tax: 57420,
    dueDate: 'Apr 15, 2026', status: 'Paid', linkedRef: 'ORD-0998',
    invoiceDate: 'Mar 25, 2026', tab: 'Completed Payments',
  },
  {
    id: 'PO-INV-221', party: 'Agarwal Steel & Alloys', partyType: 'Vendor', amount: 96000, tax: 17280,
    dueDate: 'Apr 28, 2026', status: 'Pending', linkedRef: 'PO-0551',
    invoiceDate: 'Apr 05, 2026', tab: 'Payables',
  },
  {
    id: 'PO-INV-220', party: 'Shree Plastics Pvt.', partyType: 'Vendor', amount: 38500, tax: 6930,
    dueDate: 'Apr 22, 2026', status: 'Overdue', linkedRef: 'PO-0549',
    invoiceDate: 'Mar 28, 2026', tab: 'Payables',
  },
  {
    id: 'INV-1043', party: 'Bosch India Ltd.', partyType: 'Client', amount: 212000, tax: 38160,
    dueDate: 'May 10, 2026', status: 'Pending', linkedRef: 'ORD-1031',
    invoiceDate: 'Apr 12, 2026', tab: 'Pending Payments',
  },
  {
    id: 'INV-1040', party: 'Hero MotoCorp', partyType: 'Client', amount: 155000, tax: 27900,
    dueDate: 'Apr 10, 2026', status: 'Paid', linkedRef: 'ORD-1005',
    invoiceDate: 'Mar 20, 2026', tab: 'Completed Payments',
  },
];

const TABS = ['Invoices', 'Receivables', 'Payables', 'Pending Payments', 'Completed Payments'];

const statusTone: Record<string, string> = {
  Paid: 'success', Partial: 'warning', Pending: 'info', Overdue: 'danger',
};

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString('en-IN')}`;

// ─────────────────────────────────────────────
//  Invoice Card
// ─────────────────────────────────────────────
const InvoiceCard: React.FC<{ item: InvoiceItem }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const remaining = item.partialPaid !== undefined ? item.amount - item.partialPaid : item.amount;
  const paidPct = item.partialPaid !== undefined ? (item.partialPaid / item.amount) * 100 : (item.status === 'Paid' ? 100 : 0);

  return (
    <Card style={[styles.card, item.status === 'Overdue' && styles.overdueCard]}>
      {item.status === 'Overdue' && (
        <View style={styles.overdueBar}>
          <Text style={styles.overdueText}>⚠ OVERDUE — Immediate action required</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.invoiceId}>{item.id}</Text>
          <Text style={[typography.bodyMuted, { marginTop: 2 }]}>
            {item.party}
            <Badge
              text={item.partyType === 'Client' ? 'RCV' : 'PAY'}
              tone={item.partyType === 'Client' ? 'accent' : 'orange'}
              style={{ marginLeft: 6 }}
            />
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.amount}>{fmt(item.amount)}</Text>
          <Badge text={item.status} tone={statusTone[item.status]} style={{ marginTop: 4 }} />
        </View>
      </View>

      <Divider style={{ marginVertical: spacing.sm }} />

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>INVOICE DATE</Text>
          <Text style={styles.infoVal}>{item.invoiceDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>DUE DATE</Text>
          <Text style={[styles.infoVal, item.status === 'Overdue' && { color: colors.danger }]}>
            {item.dueDate}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>GST/TAX</Text>
          <Text style={styles.infoVal}>{fmt(item.tax)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={typography.micro}>LINKED REF</Text>
          <Text style={[styles.infoVal, { color: colors.primary }]}>{item.linkedRef}</Text>
        </View>
      </View>

      {/* Partial payment tracker */}
      {(item.status === 'Partial' || paidPct > 0) && item.status !== 'Paid' && (
        <View style={styles.partialSection}>
          <View style={styles.partialRow}>
            <Text style={typography.micro}>PAYMENT COLLECTED</Text>
            <Text style={[typography.small, { color: colors.success }]}>
              {fmt(item.partialPaid ?? 0)} / {fmt(item.amount)}
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${paidPct}%`, backgroundColor: colors.success }]} />
          </View>
          <Text style={[typography.micro, { color: colors.textMuted, marginTop: 3 }]}>
            Balance: {fmt(remaining)}
          </Text>
        </View>
      )}

      {/* Credit/debit note */}
      {(item.creditNote || item.debitNote) && (
        <View style={styles.noteRow}>
          {item.creditNote && (
            <View style={[styles.noteBadge, { backgroundColor: colors.successBg }]}>
              <Text style={[typography.micro, { color: colors.success }]}>
                Credit Note: {fmt(item.creditNote)}
              </Text>
            </View>
          )}
          {item.debitNote && (
            <View style={[styles.noteBadge, { backgroundColor: colors.dangerBg }]}>
              <Text style={[typography.micro, { color: colors.danger }]}>
                Debit Note: {fmt(item.debitNote)}
              </Text>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={styles.expandBtn}
        activeOpacity={0.7}
      >
        <Text style={[typography.small, { color: colors.primary }]}>
          {expanded ? '▲ Collapse' : '▼ GST Preview & Actions'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <Divider style={{ marginVertical: spacing.sm }} />
          <View style={styles.gstBlock}>
            <Text style={[typography.h3, { marginBottom: spacing.sm }]}>GST Breakdown</Text>
            {[
              { label: 'Taxable Amount', value: fmt(item.amount - item.tax) },
              { label: 'CGST (9%)', value: fmt(item.tax / 2) },
              { label: 'SGST (9%)', value: fmt(item.tax / 2) },
              { label: 'Total Tax', value: fmt(item.tax) },
              { label: 'Total Invoice', value: fmt(item.amount), bold: true },
            ].map((r) => (
              <View key={r.label} style={styles.gstRow}>
                <Text style={typography.bodyMuted}>{r.label}</Text>
                <Text style={[typography.body, r.bold && { fontWeight: '800', color: colors.primary }]}>
                  {r.value}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Quick actions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.sm }}>
        <View style={styles.actionsRow}>
          {item.status !== 'Paid' && (
            <Button label="Record Payment" variant="primary" small style={styles.actionBtn} />
          )}
          <Button label="Send Reminder" variant="secondary" small style={styles.actionBtn} />
          <Button label="Download PDF" variant="secondary" small style={styles.actionBtn} />
          <Button label="View Ledger" variant="ghost" small style={styles.actionBtn} />
        </View>
      </ScrollView>
    </Card>
  );
};

// ─────────────────────────────────────────────
//  Advanced Blocks
// ─────────────────────────────────────────────
const AgingSummary: React.FC = () => (
  <Card style={styles.advCard}>
    <Text style={typography.h3}>Payment Aging Summary</Text>
    <Text style={[typography.bodyMuted, { marginBottom: spacing.md, marginTop: 4 }]}>
      Outstanding receivables by age
    </Text>
    {[
      { bucket: '0–30 days', amount: 854000, tone: 'success' },
      { bucket: '31–60 days', amount: 426000, tone: 'warning' },
      { bucket: '61–90 days', amount: 142000, tone: 'orange' },
      { bucket: '90+ days', amount: 284000, tone: 'danger' },
    ].map((b) => (
      <View key={b.bucket} style={styles.agingRow}>
        <View style={{ flex: 1 }}>
          <Text style={typography.body}>{b.bucket}</Text>
          <Text style={typography.bodyMuted}>{fmt(b.amount)}</Text>
        </View>
        <View style={{ width: 120 }}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(b.amount / 854000) * 100}%`,
                  backgroundColor:
                    b.tone === 'success' ? colors.success :
                    b.tone === 'warning' ? colors.warning :
                    b.tone === 'orange' ? colors.alertOrange : colors.danger,
                },
              ]}
            />
          </View>
        </View>
      </View>
    ))}
  </Card>
);

const AdvancedBlocks: React.FC = () => (
  <View>
    <SectionTitle title="Finance Intelligence" />
    <AgingSummary />

    {/* Collection forecast */}
    <Card style={styles.advCard}>
      <View style={styles.forecastHeader}>
        <View>
          <Text style={typography.h3}>Collection Forecast</Text>
          <Text style={[typography.bodyMuted, { marginTop: 4 }]}>Expected in next 30 days</Text>
        </View>
        <View style={styles.forecastBadge}>
          <Text style={styles.forecastVal}>₹28.4L</Text>
        </View>
      </View>
      <View style={{ marginTop: spacing.md }}>
        <Gauge value={74} label="Collection Confidence" color={colors.accent} />
      </View>
    </Card>

    {/* Revenue trend */}
    <Card style={styles.advCard}>
      <Text style={typography.h3}>Revenue Trend (7-Day)</Text>
      <Text style={[typography.bodyMuted, { marginTop: 4, marginBottom: spacing.md }]}>
        Weekly collection in ₹ Lakh
      </Text>
      <Sparkline data={collectionTrend} color={colors.primary} height={70} />
      <View style={styles.sparkLabels}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <Text key={d} style={[typography.micro, { flex: 1, textAlign: 'center' }]}>{d}</Text>
        ))}
      </View>
    </Card>

    {/* Overdue risk alert */}
    <Card style={[styles.advCard, { backgroundColor: colors.dangerBg }]}>
      <View style={styles.riskHeader}>
        <Text style={[typography.h3, { color: colors.danger }]}>🔴 Overdue Risk Alert</Text>
        <Badge text="₹4.26L at risk" tone="danger" />
      </View>
      {[
        { party: 'Tata Forge Ltd.', amount: '₹2.84L', days: '12 days overdue' },
        { party: 'Shree Plastics Pvt.', amount: '₹38.5K', days: '0 days overdue' },
      ].map((r) => (
        <View key={r.party} style={styles.riskRow}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.body, { color: colors.danger }]}>{r.party}</Text>
            <Text style={typography.bodyMuted}>{r.days}</Text>
          </View>
          <Text style={[typography.h3, { color: colors.danger }]}>{r.amount}</Text>
        </View>
      ))}
    </Card>

    {/* Cash flow summary */}
    <Card style={styles.advCard}>
      <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Cash Flow Summary</Text>
      <View style={styles.cashGrid}>
        {[
          { label: 'Total Receivables', value: '₹18.4L', tone: 'success' },
          { label: 'Total Payables', value: '₹6.8L', tone: 'danger' },
          { label: 'Net Position', value: '+₹11.6L', tone: 'accent' },
          { label: 'Overdue', value: '₹3.22L', tone: 'orange' },
        ].map((c) => (
          <View key={c.label} style={styles.cashItem}>
            <Text style={typography.micro}>{c.label}</Text>
            <Text
              style={[
                styles.cashVal,
                {
                  color:
                    c.tone === 'success' ? colors.success :
                    c.tone === 'danger' ? colors.danger :
                    c.tone === 'accent' ? colors.accent : colors.alertOrange,
                },
              ]}
            >
              {c.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>

    {/* Payment priority suggestion */}
    <Card style={[styles.advCard, { borderLeftWidth: 3, borderLeftColor: colors.primary }]}>
      <View style={styles.priorityHeader}>
        <Text style={typography.h3}>💡 Payment Priority Suggestion</Text>
        <Badge text="Smart" tone="primary" />
      </View>
      <Text style={[typography.bodyMuted, { marginTop: spacing.sm }]}>
        Clear <Text style={{ color: colors.danger, fontWeight: '700' }}>Shree Plastics</Text> (₹38.5K overdue) first
        to avoid penalty. Follow with <Text style={{ color: colors.warning, fontWeight: '700' }}>Agarwal Steel</Text> due Apr 28.
      </Text>
    </Card>

    {/* Smart reminders */}
    <Card style={styles.advCard}>
      <Text style={[typography.h3, { marginBottom: spacing.sm }]}>Smart Reminders</Text>
      {[
        { party: 'Tata Forge Ltd.', action: 'Send 2nd reminder — payment 12 days late', urgency: 'danger' },
        { party: 'Bharat Steel Works', action: 'Due in 8 days — send pre-due reminder', urgency: 'warning' },
        { party: 'Bosch India', action: 'Due in 18 days — schedule auto-reminder', urgency: 'info' },
      ].map((r) => (
        <View key={r.party} style={styles.reminderRow}>
          <View
            style={[
              styles.reminderDot,
              {
                backgroundColor:
                  r.urgency === 'danger' ? colors.danger :
                  r.urgency === 'warning' ? colors.warning : colors.info,
              },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={typography.body}>{r.party}</Text>
            <Text style={typography.bodyMuted}>{r.action}</Text>
          </View>
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={[typography.micro, { color: colors.primary }]}>SEND</Text>
          </TouchableOpacity>
        </View>
      ))}
    </Card>
  </View>
);

// ─────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────
export const AccountsPaymentsScreen: React.FC = () => {
  const { pop } = useNav();
  const [activeTab, setActiveTab] = useState('Invoices');

  const filtered =
    activeTab === 'Invoices'
      ? invoices
      : invoices.filter((inv) => inv.tab === activeTab);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Accounts & Payments"
        subtitle="Finance Module"
        showBack
        rightIcon="+"
      />

      {/* Quick action bar */}
      <View style={styles.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { icon: '🧾', label: 'Generate Invoice' },
            { icon: '💰', label: 'Record Payment' },
            { icon: '🔔', label: 'Send Reminder' },
            { icon: '📄', label: 'Download PDF' },
            { icon: '📒', label: 'View Ledger' },
            { icon: '✅', label: 'Approve Payment' },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.qAction} activeOpacity={0.8}>
              <Text style={styles.qIcon}>{a.icon}</Text>
              <Text style={styles.qLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Summary stat row */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Receivables', value: '₹18.4L', tone: colors.success },
            { label: 'Payables', value: '₹6.8L', tone: colors.danger },
            { label: 'Overdue', value: '₹3.22L', tone: colors.alertOrange },
          ].map((s) => (
            <View key={s.label} style={[styles.summaryItem, { borderLeftColor: s.tone }]}>
              <Text style={[styles.summaryVal, { color: s.tone }]}>{s.value}</Text>
              <Text style={typography.micro}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((t) => {
            const active = t === activeTab;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filtered.length === 0 ? (
          <Card style={styles.empty}>
            <Text style={[typography.bodyMuted, { textAlign: 'center' }]}>
              No records in this category.
            </Text>
          </Card>
        ) : (
          filtered.map((item) => <InvoiceCard key={item.id} item={item} />)
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
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  qAction: { alignItems: 'center', marginRight: spacing.lg, minWidth: 60 },
  qIcon: { fontSize: 20 },
  qLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 3 },
  summaryRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm },
  summaryItem: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, borderLeftWidth: 3, ...shadow.soft,
  },
  summaryVal: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  tabScroll: { marginTop: spacing.md },
  tabContainer: { paddingRight: spacing.lg },
  tabBtn: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill, marginRight: spacing.sm,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  card: { marginTop: spacing.md },
  overdueCard: { borderWidth: 1, borderColor: colors.danger },
  overdueBar: {
    backgroundColor: colors.dangerBg, marginHorizontal: -spacing.lg,
    marginTop: -spacing.lg, marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.xs,
    borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
  },
  overdueText: { fontSize: 11, fontWeight: '700', color: colors.danger },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  invoiceId: { fontSize: 15, fontWeight: '800', color: colors.text },
  amount: { fontSize: 18, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xs },
  infoItem: { width: '50%', marginBottom: spacing.sm },
  infoVal: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 },
  partialSection: { marginTop: spacing.xs, padding: spacing.sm, backgroundColor: colors.surfaceAlt, borderRadius: radius.sm },
  partialRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  progressBg: { height: 6, borderRadius: 4, backgroundColor: colors.divider, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  noteRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  noteBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.xs },
  expandBtn: { marginTop: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs },
  gstBlock: { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, padding: spacing.md },
  gstRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { marginRight: 8 },
  empty: { marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.xxl },
  advCard: { marginTop: spacing.md },
  agingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  forecastHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forecastBadge: {
    width: 64, height: 64, borderRadius: radius.lg,
    backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center',
  },
  forecastVal: { fontSize: 14, fontWeight: '900', color: colors.accent },
  sparkLabels: { flexDirection: 'row', marginTop: spacing.xs },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  riskRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm,
    paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(220,38,38,0.2)',
  },
  cashGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cashItem: {
    width: '47%', backgroundColor: colors.surfaceAlt, borderRadius: radius.sm,
    padding: spacing.md,
  },
  cashVal: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  priorityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reminderRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  reminderDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  sendBtn: {
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.xs, backgroundColor: '#E0E7FF',
  },
});
