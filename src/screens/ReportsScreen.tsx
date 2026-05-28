import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, Badge, Card, SectionTitle, Sparkline } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';
import {
  collectionTrend,
  dispatchTrend,
  rawMaterialTrend,
  weeklyProduction,
} from '../data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
type ReportId =
  | 'production'
  | 'fulfillment'
  | 'inventory'
  | 'qc'
  | 'dispatch'
  | 'financial'
  | 'vendor'
  | 'machine';

interface KPI {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  tone: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const REPORTS: { id: ReportId; label: string; icon: string; desc: string }[] = [
  { id: 'production',  label: 'Daily Production',  icon: '⚙',  desc: 'Output, efficiency, batch status' },
  { id: 'fulfillment', label: 'Order Fulfillment',  icon: '📋', desc: 'On-time delivery, order pipeline' },
  { id: 'inventory',   label: 'Inventory Report',   icon: '📦', desc: 'Stock levels, movement, valuation' },
  { id: 'qc',          label: 'QC Report',           icon: '🔬', desc: 'Rejection rates, defect analysis' },
  { id: 'dispatch',    label: 'Dispatch Report',     icon: '🚚', desc: 'Dispatch log, delays, transit' },
  { id: 'financial',   label: 'Financial Summary',   icon: '💰', desc: 'Revenue, receivables, cash flow' },
  { id: 'vendor',      label: 'Vendor Performance',  icon: '🏭', desc: 'Lead time, reliability, spend' },
  { id: 'machine',     label: 'Machine Utilization', icon: '🔧', desc: 'Uptime, OEE, maintenance cost' },
];

const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const REPORT_KPIS: Record<ReportId, KPI[]> = {
  production: [
    { label: 'Units Produced',   value: '6,012',  delta: '+8.4%',  positive: true,  tone: 'primary' },
    { label: 'Efficiency',       value: '86%',    delta: '+2.1%',  positive: true,  tone: 'accent'  },
    { label: 'Rejection Rate',   value: '1.7%',   delta: '+0.3%',  positive: false, tone: 'warning' },
    { label: 'Active Lines',     value: '4 / 6',  delta: '−1',      positive: false, tone: 'info'    },
  ],
  fulfillment: [
    { label: 'Orders Fulfilled', value: '38',     delta: '+5',     positive: true,  tone: 'accent'  },
    { label: 'On-Time Rate',     value: '92%',    delta: '+3%',    positive: true,  tone: 'primary' },
    { label: 'Delayed Orders',   value: '4',      delta: '+1',     positive: false, tone: 'warning' },
    { label: 'Avg Lead Time',    value: '5.2d',   delta: '−0.4d',   positive: true,  tone: 'info'    },
  ],
  inventory: [
    { label: 'Total SKUs',       value: '142',    delta: '+3',     positive: true,  tone: 'primary' },
    { label: 'Low Stock Items',  value: '9',      delta: '+2',     positive: false, tone: 'warning' },
    { label: 'Stock Value',      value: '₹48.2L', delta: '+₹1.8L', positive: true,  tone: 'accent'  },
    { label: 'Dead Stock',       value: '₹2.4L',  delta: '−₹0.2L', positive: true,  tone: 'info'    },
  ],
  qc: [
    { label: 'Inspections',      value: '24',     delta: '+4',     positive: true,  tone: 'primary' },
    { label: 'Rejection Rate',   value: '1.7%',   delta: '+0.3%',  positive: false, tone: 'danger'  },
    { label: 'Rework Items',     value: '12',     delta: '−3',      positive: true,  tone: 'warning' },
    { label: 'First-Pass Yield', value: '94.8%',  delta: '+0.8%',  positive: true,  tone: 'accent'  },
  ],
  dispatch: [
    { label: 'Dispatched Today', value: '6',      delta: '+1',     positive: true,  tone: 'accent'  },
    { label: 'In Transit',       value: '11',     delta: '+2',     positive: true,  tone: 'primary' },
    { label: 'Delayed',          value: '3',      delta: '+1',     positive: false, tone: 'danger'  },
    { label: 'Delivered',        value: '28',     delta: '+6',     positive: true,  tone: 'info'    },
  ],
  financial: [
    { label: 'Revenue',          value: '₹84.6L', delta: '+12%',   positive: true,  tone: 'accent'  },
    { label: 'Receivables',      value: '₹36.4L', delta: '+₹4.2L', positive: false, tone: 'danger'  },
    { label: 'Collections',      value: '₹24.0L', delta: '+₹3.2L', positive: true,  tone: 'primary' },
    { label: 'Overdue',          value: '₹18.4L', delta: '+₹2.1L', positive: false, tone: 'warning' },
  ],
  vendor: [
    { label: 'Active Vendors',   value: '12',     delta: '0',      positive: true,  tone: 'primary' },
    { label: 'Avg Reliability',  value: '88%',    delta: '−1%',     positive: false, tone: 'warning' },
    { label: 'Delayed Supplies', value: '3',      delta: '+1',     positive: false, tone: 'danger'  },
    { label: 'Avg Lead Time',    value: '5.6d',   delta: '+0.4d',  positive: false, tone: 'info'    },
  ],
  machine: [
    { label: 'Machine Uptime',   value: '96%',    delta: '+1%',    positive: true,  tone: 'accent'  },
    { label: 'OEE',              value: '78%',    delta: '−2%',     positive: false, tone: 'warning' },
    { label: 'Alerts Today',     value: '3',      delta: '+1',     positive: false, tone: 'danger'  },
    { label: 'MTBF',             value: '184h',   delta: '+12h',   positive: true,  tone: 'primary' },
  ],
};

const AI_SUMMARIES: Record<ReportId, { insight: string; trend: string; variance?: string; forecast: string }> = {
  production: {
    insight:  'Production efficiency improved by 2.1% this week, driven by Line A performance gains after shift rescheduling.',
    trend:    'Weekly output has grown steadily over 7 days — up 18% from last Monday. Weekend shift utilization is improving.',
    variance: '⚠ Batch B19 shows 38% deviation from target output — sand casting delay is the primary driver.',
    forecast: 'If current pace holds, projected monthly output will exceed target by ~4% (est. 26,400 units vs. 25,400 target).',
  },
  fulfillment: {
    insight:  'Order fulfillment rate at 92% — 3-point improvement vs. last week. Top risk: 2 orders tied to Batch B19 hold.',
    trend:    'On-time delivery has improved every week for the past 4 weeks. Average lead time dropped 0.4 days.',
    forecast: 'At current fulfillment rate, month-end target of 95% is achievable if Batch B19 hold is resolved by 25 Apr.',
  },
  inventory: {
    insight:  'Steel Coil 4mm and Brass Rod 12mm are in critical low-stock state. Combined procurement exposure: ₹2.6L.',
    trend:    'Inventory value grew ₹1.8L this week on FG stock build-up. Raw material value declined due to consumption.',
    variance: '⚠ Aluminium Sheet 6mm is 213% over-stocked. Recommend pausing next procurement order.',
    forecast: 'At current consumption rate, Steel Coil 4mm will be exhausted in ~2.8 days. Expedite PO-1051.',
  },
  qc: {
    insight:  'First-pass yield improved to 94.8%. Batch B17 remains the primary drag — 6.2% rejection from surface finish issue.',
    trend:    'Rejection rates have been declining over the past 3 weeks. Batch B20 performed best this period.',
    variance: '⚠ Batch B17 rejection (6.2%) is 2x the weekly average. Inspector M. Joshi flagged tooling wear as root cause.',
    forecast: 'If B17 tooling is replaced, projected rejection rate for next batch: ~2.1% (within 3% threshold).',
  },
  dispatch: {
    insight:  '6 dispatches completed today. 3 delays tracked — primary cause: packaging delay and transporter no-show.',
    trend:    'Dispatch volumes trending upward — up 8 dispatches vs. last week. In-transit count at seasonal high.',
    forecast: 'If current dispatch pace continues, monthly dispatch target will be met 2 days ahead of schedule.',
  },
  financial: {
    insight:  'Revenue is up 12% week-over-week. However, outstanding receivables of ₹36.4L require immediate follow-up.',
    trend:    'Collections are improving — ₹24L collected this week vs. ₹18L last week. Tata Forge overdue is the key risk.',
    variance: '⚠ Receivables grew faster than revenue this period (+16% vs. +12%). Working capital pressure increasing.',
    forecast: 'If ₹18.4L overdue is collected this week, projected cash position improves by 26% by month-end.',
  },
  vendor: {
    insight:  'Average vendor reliability at 88% — slightly down from 89% last week. Bombay Metals delay is primary driver.',
    trend:    'Jindal Steel and SKF India maintain top reliability (92%, 96%). Pune Castings Co. trending downward.',
    variance: '⚠ Bombay Metals reliability dropped 6 points in 2 weeks. Consider qualifying alternate supplier.',
    forecast: 'Projected vendor spend for May: ₹42L — up 8% due to accelerated raw material procurement.',
  },
  machine: {
    insight:  'Machine uptime at 96% — strong performance. CNC-03 overheat alert is the critical open item.',
    trend:    'OEE declined 2% this week due to CNC-03 downtime. All other machines performing within targets.',
    variance: '⚠ CNC-03 MTBF has dropped from 220h to 184h over the past 3 maintenance cycles.',
    forecast: 'Scheduled maintenance for VMC-01 (overdue 2 days) could reduce uptime by 3-4% next week if not addressed.',
  },
};

const COMPARISON: Record<ReportId, { metric: string; current: string; prev: string; change: string; positive: boolean }[]> = {
  production: [
    { metric: 'Units Produced',    current: '6,012',  prev: '5,544',  change: '+8.4%',  positive: true  },
    { metric: 'Efficiency',        current: '86%',    prev: '83.9%',  change: '+2.1%',  positive: true  },
    { metric: 'Rejection Rate',    current: '1.7%',   prev: '1.4%',   change: '+0.3%',  positive: false },
    { metric: 'Downtime Hours',    current: '4.2h',   prev: '3.1h',   change: '+1.1h',  positive: false },
  ],
  fulfillment: [
    { metric: 'Orders Fulfilled',  current: '38',     prev: '33',     change: '+15.1%', positive: true  },
    { metric: 'On-Time Rate',      current: '92%',    prev: '89%',    change: '+3%',    positive: true  },
    { metric: 'Delayed Orders',    current: '4',      prev: '3',      change: '+1',     positive: false },
    { metric: 'Avg Lead Time',     current: '5.2d',   prev: '5.6d',   change: '−0.4d',   positive: true  },
  ],
  inventory: [
    { metric: 'Stock Value',       current: '₹48.2L', prev: '₹46.4L', change: '+₹1.8L', positive: true  },
    { metric: 'Low Stock Items',   current: '9',      prev: '7',      change: '+2',     positive: false },
    { metric: 'Stockouts',         current: '1',      prev: '0',      change: '+1',     positive: false },
    { metric: 'Inventory Turns',   current: '4.2x',   prev: '3.9x',   change: '+0.3x',  positive: true  },
  ],
  qc: [
    { metric: 'Inspections Done',  current: '24',     prev: '20',     change: '+20%',   positive: true  },
    { metric: 'Rejection Rate',    current: '1.7%',   prev: '2.1%',   change: '−0.4%',   positive: true  },
    { metric: 'First-Pass Yield',  current: '94.8%',  prev: '94.0%',  change: '+0.8%',  positive: true  },
    { metric: 'Rework Cost',       current: '₹22K',   prev: '₹18K',   change: '+₹4K',   positive: false },
  ],
  dispatch: [
    { metric: 'Total Dispatches',  current: '6',      prev: '5',      change: '+20%',   positive: true  },
    { metric: 'Delay Rate',        current: '33%',    prev: '20%',    change: '+13%',   positive: false },
    { metric: 'Avg Transit Days',  current: '2.8d',   prev: '2.4d',   change: '+0.4d',  positive: false },
    { metric: 'Delivery Accuracy', current: '97%',    prev: '98%',    change: '−1%',     positive: false },
  ],
  financial: [
    { metric: 'Revenue',           current: '₹84.6L', prev: '₹75.5L', change: '+12%',   positive: true  },
    { metric: 'Collections',       current: '₹24.0L', prev: '₹18.8L', change: '+27%',   positive: true  },
    { metric: 'Receivables',       current: '₹36.4L', prev: '₹31.2L', change: '+16%',   positive: false },
    { metric: 'Overdue Amount',    current: '₹18.4L', prev: '₹16.3L', change: '+13%',   positive: false },
  ],
  vendor: [
    { metric: 'Avg Reliability',   current: '88%',    prev: '89%',    change: '−1%',     positive: false },
    { metric: 'Delayed Supplies',  current: '3',      prev: '2',      change: '+1',     positive: false },
    { metric: 'Vendor Spend',      current: '₹38.9L', prev: '₹36.0L', change: '+8%',    positive: false },
    { metric: 'Avg Lead Time',     current: '5.6d',   prev: '5.2d',   change: '+0.4d',  positive: false },
  ],
  machine: [
    { metric: 'Uptime',            current: '96%',    prev: '97%',    change: '−1%',     positive: false },
    { metric: 'OEE',               current: '78%',    prev: '80%',    change: '−2%',     positive: false },
    { metric: 'Alerts',            current: '3',      prev: '1',      change: '+2',     positive: false },
    { metric: 'Maintenance Cost',  current: '₹14K',   prev: '₹10K',   change: '+₹4K',   positive: false },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const toneColorMap: Record<string, { bg: string; fg: string }> = {
  primary: { bg: '#E0E7FF', fg: colors.primary },
  accent:  { bg: colors.accentSoft, fg: colors.accent },
  info:    { bg: colors.infoBg, fg: colors.info },
  warning: { bg: colors.warningBg, fg: '#92400E' },
  danger:  { bg: colors.dangerBg, fg: colors.danger },
};

const KpiCard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  const t = toneColorMap[kpi.tone] || toneColorMap.primary;
  return (
    <View style={[styles.kpiCard, { borderTopColor: t.fg }]}>
      <Text style={styles.kpiValue}>{kpi.value}</Text>
      <Text style={styles.kpiLabel}>{kpi.label}</Text>
      <Text style={[styles.kpiDelta, { color: kpi.positive ? colors.success : colors.danger }]}>
        {kpi.delta}
      </Text>
    </View>
  );
};

const ComparisonTable: React.FC<{
  data: { metric: string; current: string; prev: string; change: string; positive: boolean }[];
}> = ({ data }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHead]}>
      <Text style={[styles.tableCell, styles.tableCellLabel, styles.tableHeadText]}>Metric</Text>
      <Text style={[styles.tableCell, styles.tableHeadText, { textAlign: 'center' }]}>Current</Text>
      <Text style={[styles.tableCell, styles.tableHeadText, { textAlign: 'center' }]}>Previous</Text>
      <Text style={[styles.tableCell, styles.tableHeadText, { textAlign: 'center' }]}>Change</Text>
    </View>
    {data.map((row, i) => (
      <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
        <Text style={[styles.tableCell, styles.tableCellLabel]}>{row.metric}</Text>
        <Text style={[styles.tableCell, styles.tableCellBold, { textAlign: 'center' }]}>{row.current}</Text>
        <Text style={[styles.tableCell, { textAlign: 'center', color: colors.textMuted }]}>{row.prev}</Text>
        <Text style={[
          styles.tableCell,
          { textAlign: 'center', fontWeight: '800', color: row.positive ? colors.success : colors.danger },
        ]}>
          {row.change}
        </Text>
      </View>
    ))}
  </View>
);

const AISummaryCard: React.FC<{ summary: (typeof AI_SUMMARIES)[ReportId] }> = ({ summary }) => (
  <View style={styles.aiCard}>
    <View style={styles.aiHeader}>
      <Text style={styles.aiPillText}>✨  AI SUMMARY</Text>
      <Text style={styles.aiPowered}>FactoryOps AI</Text>
    </View>
    <View style={styles.aiSection}>
      <Text style={styles.aiTag}>KEY INSIGHT</Text>
      <Text style={styles.aiText}>{summary.insight}</Text>
    </View>
    {summary.variance ? (
      <View style={[styles.aiSection, styles.aiVariance]}>
        <Text style={[styles.aiTag, { color: colors.danger }]}>VARIANCE ALERT</Text>
        <Text style={[styles.aiText, { color: '#7f1d1d' }]}>{summary.variance}</Text>
      </View>
    ) : null}
    <View style={styles.aiSection}>
      <Text style={styles.aiTag}>TREND</Text>
      <Text style={styles.aiText}>{summary.trend}</Text>
    </View>
    <View style={[styles.aiSection, { borderBottomWidth: 0, paddingBottom: spacing.md }]}>
      <Text style={[styles.aiTag, { color: colors.accent }]}>FORECAST</Text>
      <Text style={styles.aiText}>{summary.forecast}</Text>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const ReportsScreen: React.FC<{ tabMode?: boolean }> = ({ tabMode = false }) => {
  const { push } = useNav();
  const [period, setPeriod] = useState<Period>('Weekly');
  const [activeReport, setActiveReport] = useState<ReportId>('production');
  const [showAI, setShowAI] = useState(false);

  const kpis        = REPORT_KPIS[activeReport];
  const aiSummary   = AI_SUMMARIES[activeReport];
  const comparison  = COMPARISON[activeReport];
  const reportMeta  = REPORTS.find((r) => r.id === activeReport)!;
  const chartData   =
    activeReport === 'production'  ? weeklyProduction  :
    activeReport === 'inventory'   ? rawMaterialTrend  :
    activeReport === 'dispatch'    ? dispatchTrend     :
    activeReport === 'financial'   ? collectionTrend   : weeklyProduction;

  return (
    <View style={styles.root}>
      {!tabMode ? (
        <ScreenHeader title="Reports & Analytics" subtitle="Enterprise dashboards" rightIcon="⤓" />
      ) : (
        <View style={styles.tabHeader}>
          <View>
            <Text style={typography.h1}>Reports</Text>
            <Text style={[typography.small, { marginTop: 2 }]}>Analytics & dashboards</Text>
          </View>
          <View style={styles.tabHeaderActions}>
            <TouchableOpacity style={styles.headerActionBtn}>
              <Text style={styles.headerActionText}>⤓ PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionBtn}>
              <Text style={styles.headerActionText}>⤡ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Report selector grid */}
        <View style={styles.reportGrid}>
          {REPORTS.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => { setActiveReport(r.id); setShowAI(false); }}
              style={[styles.reportCard, activeReport === r.id && styles.reportCardActive]}
              activeOpacity={0.8}
            >
              <Text style={styles.reportIcon}>{r.icon}</Text>
              <Text
                style={[styles.reportLabel, activeReport === r.id && styles.reportLabelActive]}
                numberOfLines={2}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active report header */}
        <View style={styles.reportHeadRow}>
          <View style={{ flex: 1 }}>
            <Text style={typography.h2}>{reportMeta.icon}  {reportMeta.label}</Text>
            <Text style={[typography.small, { marginTop: 2 }]}>{reportMeta.desc} · {period}</Text>
          </View>
          <View style={styles.downloadRow}>
            <TouchableOpacity style={styles.dlBtn}>
              <Text style={styles.dlBtnText}>⤓ PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dlBtn}>
              <Text style={styles.dlBtnText}>⤓ XLS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* KPI grid */}
        <View style={styles.kpiGrid}>
          {kpis.map((k, i) => <KpiCard key={i} kpi={k} />)}
        </View>

        {/* Trend chart */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHead}>
            <View>
              <Text style={typography.h3}>{reportMeta.label} — Trend</Text>
              <Text style={typography.small}>{period} · Udyoven Industries</Text>
            </View>
            <Badge text={kpis[0].delta} tone={kpis[0].positive ? 'accent' : 'warning'} />
          </View>
          <BarChart
            data={chartData}
            color={colors.primary}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            height={140}
          />
          <View style={styles.sparkRow}>
            <View style={styles.sparkItem}>
              <Text style={typography.small}>Current period</Text>
              <Sparkline data={chartData} color={colors.primary} height={44} />
            </View>
            <View style={styles.sparkItem}>
              <Text style={typography.small}>Previous period</Text>
              <Sparkline
                data={chartData.map((v) => Math.round(v * 0.88 + 2))}
                color={colors.steelLight}
                height={44}
              />
            </View>
          </View>
        </Card>

        {/* Period comparison table */}
        <SectionTitle
          title="Period Comparison"
          subtitle={`Current ${period.toLowerCase()} vs. previous`}
        />
        <Card style={{ marginBottom: spacing.md }}>
          <ComparisonTable data={comparison} />
        </Card>

        {/* AI toggle */}
        <TouchableOpacity
          style={[styles.aiToggle, showAI && styles.aiToggleActive]}
          onPress={() => setShowAI(!showAI)}
          activeOpacity={0.8}
        >
          <Text style={styles.aiToggleText}>
            {showAI ? '▲  Hide AI Summary' : '✨  Generate AI Summary'}
          </Text>
          <View style={styles.aiTogglePill}>
            <Text style={styles.aiTogglePillText}>BETA</Text>
          </View>
        </TouchableOpacity>

        {showAI && (
          <>
            <AISummaryCard summary={aiSummary} />

            {/* Forecast widget */}
            <Card style={styles.forecastCard}>
              <View style={styles.forecastHead}>
                <Text style={typography.h3}>Forecast — Next {period}</Text>
                <Badge text="AI Predicted" tone="accent" />
              </View>
              <View style={styles.forecastGrid}>
                {kpis.map((k, i) => (
                  <View key={i} style={styles.forecastItem}>
                    <Text style={styles.forecastVal}>{k.value}</Text>
                    <Text style={styles.forecastLabel}>{k.label}</Text>
                    <Text style={[styles.forecastDelta, { color: colors.accent }]}>est. next period</Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        )}

        {/* Ask AI CTA */}
        <TouchableOpacity
          style={styles.askAiBtn}
          onPress={() => push('AIAssistant')}
          activeOpacity={0.85}
        >
          <Text style={styles.askAiIcon}>✨</Text>
          <Text style={styles.askAiText}>Ask AI about this report</Text>
          <Text style={styles.askAiChev}>›</Text>
        </TouchableOpacity>
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
  tabHeaderActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerActionText: { fontSize: 12, fontWeight: '700', color: colors.primary },

  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },

  periodRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginVertical: spacing.md,
  },
  periodChip:       { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.md },
  periodChipActive: { backgroundColor: colors.primary },
  periodText:       { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  periodTextActive: { color: '#fff' },

  reportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  reportCard: {
    width: '22.5%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  reportCardActive:  { backgroundColor: colors.primary, borderColor: colors.primary },
  reportIcon:        { fontSize: 20 },
  reportLabel:       { fontSize: 9, fontWeight: '700', color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  reportLabelActive: { color: '#fff' },

  reportHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  downloadRow: { flexDirection: 'row', gap: 8 },
  dlBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dlBtnText: { fontSize: 11, fontWeight: '700', color: colors.primary },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  kpiCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderTopWidth: 3,
    ...shadow.soft,
  },
  kpiValue: { fontSize: 20, fontWeight: '900', color: colors.text },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, marginTop: 2 },
  kpiDelta: { fontSize: 12, fontWeight: '800', marginTop: 4 },

  chartCard: { marginBottom: spacing.md },
  chartHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sparkRow:  { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  sparkItem: { flex: 1 },

  table:          { borderRadius: radius.md, overflow: 'hidden' },
  tableRow:       { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 4 },
  tableRowAlt:    { backgroundColor: colors.surfaceAlt },
  tableHead:      { backgroundColor: colors.primary + '18', borderRadius: radius.sm },
  tableCell:      { flex: 1, fontSize: 12, fontWeight: '600', color: colors.text },
  tableCellLabel: { flex: 1.4 },
  tableCellBold:  { fontWeight: '800' },
  tableHeadText:  { fontWeight: '800', color: colors.primary, fontSize: 11 },

  aiToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginVertical: spacing.md,
    gap: 8,
  },
  aiToggleActive:      { backgroundColor: colors.accentSoft },
  aiToggleText:        { fontSize: 14, fontWeight: '800', color: colors.accent },
  aiTogglePill:        { backgroundColor: colors.accent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  aiTogglePillText:    { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },

  aiCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  aiPillText:  { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  aiPowered:   { color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '600' },
  aiSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  aiVariance:  { backgroundColor: '#FEF2F2' },
  aiTag:       { fontSize: 9, fontWeight: '900', color: colors.accent, letterSpacing: 0.8, marginBottom: 4 },
  aiText:      { fontSize: 13, fontWeight: '600', color: colors.text, lineHeight: 19 },

  forecastCard: { marginBottom: spacing.md },
  forecastHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  forecastGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  forecastItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  forecastVal:   { fontSize: 18, fontWeight: '900', color: colors.accent },
  forecastLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, marginTop: 2 },
  forecastDelta: { fontSize: 10, fontWeight: '800', marginTop: 2 },

  askAiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    marginTop: spacing.md,
    ...shadow.raised,
  },
  askAiIcon: { fontSize: 18, marginRight: spacing.sm },
  askAiText: { flex: 1, fontSize: 14, fontWeight: '800', color: '#fff' },
  askAiChev: { fontSize: 20, color: '#fff', opacity: 0.7 },
});
