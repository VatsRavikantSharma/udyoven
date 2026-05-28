import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BarChart, Badge, Card, Gauge, SearchBar, SectionTitle, Sparkline,
} from '../components/UI';
import {
  aiInsights, collectionTrend, company, dispatchTrend, kpis, liveStatus,
  quickActions, rawMaterialTrend, smartAlerts, weeklyProduction,
} from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

const KPI_TONE: Record<string, { bg: string; fg: string }> = {
  primary: { bg: '#E0E7FF', fg: colors.primary },
  info:    { bg: colors.infoBg, fg: colors.info },
  accent:  { bg: colors.accentSoft, fg: colors.accent },
  warning: { bg: colors.warningBg, fg: '#92400E' },
  orange:  { bg: colors.alertOrangeBg, fg: '#9A3412' },
  danger:  { bg: colors.dangerBg, fg: colors.danger },
};

export const HomeDashboard: React.FC = () => {
  const { push, role, setTab, openMenu } = useNav();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
    >
      {/* Top Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.heroTop}>
          <TouchableOpacity style={styles.menuBtn} onPress={openMenu} activeOpacity={0.7}>
            <View style={styles.menuBar} />
            <View style={[styles.menuBar, { width: 16 }]} />
            <View style={styles.menuBar} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greet}>Good morning,</Text>
            <Text style={styles.role}>{role}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => push('Notifications')}>
              <Text style={styles.iconBtnText}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { marginLeft: 10 }]} onPress={() => push('AIAssistant')}>
              <Text style={styles.iconBtnText}>✨</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.unitPill}>
          <Text style={styles.unitText}>{company.unit}</Text>
          <Text style={styles.unitChevron}>▾</Text>
        </TouchableOpacity>
        <Text style={styles.shiftText}>22 Apr 2026 · {company.shift}</Text>

        <View style={{ marginTop: spacing.md }}>
          <SearchBar
            placeholder="Search orders, materials, vendors, dispatch IDs…"
            onPress={() => push('Orders')}
          />
        </View>
      </View>

      <View style={styles.body}>
        {/* KPI grid */}
        <SectionTitle title="Today at a glance" subtitle="Live operational KPIs" action="See all" />
        <View style={styles.kpiGrid}>
          {kpis.map((k) => {
            const t = KPI_TONE[k.tone] || KPI_TONE.primary;
            return (
              <TouchableOpacity
                key={k.id}
                activeOpacity={0.85}
                style={styles.kpiCard}
                onPress={() => {
                  if (k.id === 'orders') push('Orders');
                  else if (k.id === 'jobs') push('ProductionLive');
                  else if (k.id === 'lowStock') push('Inventory');
                  else if (k.id === 'quotes') push('Quotations');
                  else if (k.id === 'dispatch') push('Dispatch');
                  else if (k.id === 'payments') push('Invoices');
                  else if (k.id === 'qc') push('QC');
                  else push('Machines');
                }}
              >
                <View style={[styles.kpiIcon, { backgroundColor: t.bg }]}>
                  <View style={[styles.kpiIconDot, { backgroundColor: t.fg }]} />
                </View>
                <Text style={styles.kpiValue}>{k.value}</Text>
                <Text style={styles.kpiLabel} numberOfLines={1}>{k.label}</Text>
                <Text style={[styles.kpiDelta, { color: t.fg }]}>{k.delta}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Live status gauges */}
        <SectionTitle title="Plant performance" subtitle="Live status across operations" />
        <Card>
          <View style={styles.gaugeGrid}>
            {liveStatus.map((g, i) => (
              <View key={g.id} style={styles.gaugeCell}>
                <Gauge
                  value={g.value as number}
                  label={g.label}
                  suffix={g.suffix}
                  color={colors.chart[i % colors.chart.length]}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* Charts row */}
        <SectionTitle title="Trends this week" action="Reports" onAction={() => setTab('Reports')} />
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.chartHead}>
            <View>
              <Text style={typography.h3}>Weekly Production</Text>
              <Text style={typography.small}>Units produced · last 7 days</Text>
            </View>
            <Badge text="+12% WoW" tone="accent" />
          </View>
          <BarChart
            data={weeklyProduction}
            color={colors.primary}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          />
        </Card>

        <View style={styles.row2}>
          <Card style={[styles.halfCard, { marginRight: spacing.md }]}>
            <Text style={styles.miniTitle}>Raw Material Use</Text>
            <Text style={styles.miniValue}>62 t</Text>
            <Sparkline data={rawMaterialTrend} color={colors.accent} />
          </Card>
          <Card style={styles.halfCard}>
            <Text style={styles.miniTitle}>Dispatch Trend</Text>
            <Text style={styles.miniValue}>187</Text>
            <Sparkline data={dispatchTrend} color={colors.alertOrange} />
          </Card>
        </View>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.chartHead}>
            <View>
              <Text style={typography.h3}>Payment Collection</Text>
              <Text style={typography.small}>₹ Lakh · last 7 days</Text>
            </View>
            <Badge text="₹135 L" tone="primary" />
          </View>
          <BarChart
            data={collectionTrend}
            color={colors.accent}
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          />
        </Card>

        {/* Quick actions */}
        <SectionTitle title="Quick actions" subtitle="Most common operations" />
        <View style={styles.qaGrid}>
          {quickActions.map((q) => (
            <TouchableOpacity
              key={q.id}
              activeOpacity={0.85}
              style={styles.qaCell}
              onPress={() => push(q.screen as any)}
            >
              <View style={styles.qaIcon}>
                <Text style={{ fontSize: 22 }}>{q.icon}</Text>
              </View>
              <Text style={styles.qaLabel} numberOfLines={2}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Smart alerts */}
        <SectionTitle title="Smart alerts" action="View all" onAction={() => setTab('Alerts')} />
        <Card padded={false}>
          {smartAlerts.map((a, i) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => push(a.screen as any)}
              style={[
                styles.alertRow,
                i !== smartAlerts.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
              ]}
            >
              <View style={[styles.alertDot, { backgroundColor:
                a.tone === 'danger' ? colors.danger
                : a.tone === 'orange' ? colors.alertOrange
                : colors.warning,
              }]} />
              <Text style={styles.alertText} numberOfLines={2}>{a.text}</Text>
              <Text style={styles.alertChev}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* AI insights */}
        <SectionTitle title="AI insights" subtitle="Recommendations from your data" action="Open" onAction={() => push('AIAssistant')} />
        <View>
          {aiInsights.map((ai) => (
            <Card key={ai.id} style={styles.aiCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>{ai.tag}</Text>
                </View>
                <Text style={styles.aiSparkle}>✨</Text>
              </View>
              <Text style={styles.aiText}>{ai.text}</Text>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 8,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  menuBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  menuBar: { width: 20, height: 2, backgroundColor: '#fff', borderRadius: 2, marginVertical: 2 },
  greet: { color: '#CBD5E1', fontSize: 13, fontWeight: '600' },
  role: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnText: { fontSize: 18 },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.alertOrange,
  },
  unitPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.pill, alignSelf: 'flex-start', marginTop: spacing.lg,
  },
  unitText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  unitChevron: { color: '#fff', fontSize: 12, marginLeft: 8 },
  shiftText: { color: '#CBD5E1', fontSize: 11, fontWeight: '600', marginTop: 6 },

  body: { paddingHorizontal: spacing.lg, marginTop: -spacing.md },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  kpiCard: {
    width: '23.5%',
    minWidth: '23.5%',
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  kpiIcon: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  kpiIconDot: { width: 10, height: 10, borderRadius: 5 },
  kpiValue: { fontSize: 16, fontWeight: '900', color: colors.text },
  kpiLabel: { fontSize: 9.5, color: colors.textMuted, fontWeight: '700', marginTop: 2 },
  kpiDelta: { fontSize: 10, fontWeight: '800', marginTop: 4 },

  gaugeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  gaugeCell: { width: '50%', paddingVertical: 8, paddingRight: 12 },

  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },

  row2: { flexDirection: 'row' },
  halfCard: { flex: 1 },
  miniTitle: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  miniValue: { fontSize: 22, fontWeight: '900', color: colors.text, marginVertical: 6 },

  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  qaCell: {
    width: '23.5%',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  qaIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  qaLabel: { fontSize: 10, color: colors.text, fontWeight: '700', textAlign: 'center', marginTop: 6 },

  alertRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: spacing.lg,
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  alertText: { flex: 1, fontSize: 13, color: colors.text, fontWeight: '600' },
  alertChev: { fontSize: 22, color: colors.textSubtle, marginLeft: 8 },

  aiCard: { marginBottom: spacing.md, borderLeftWidth: 4, borderLeftColor: colors.accent },
  aiBadge: {
    backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: radius.pill,
  },
  aiBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  aiSparkle: { marginLeft: 8, fontSize: 14 },
  aiText: { marginTop: 8, fontSize: 13, color: colors.text, fontWeight: '600', lineHeight: 19 },
});
