import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Deal, DEAL_PHASES, DealPhase,
  NegotiationEntry, QuoteVersion,
} from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ── Drawn icons ──────────────────────────────────────────────────────────
const BackArrow = () => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 8, height: 8, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#fff', transform: [{ rotate: '45deg' }], marginLeft: 4 }} />
  </View>
);
const CheckMark = ({ size = 10, color = '#fff' }: { size?: number; color?: string }) => (
  <View style={{ width: size + 2, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size * 0.4, height: size * 0.7, borderBottomWidth: 2, borderRightWidth: 2, borderColor: color, transform: [{ rotate: '45deg' }], marginTop: -(size * 0.15) }} />
  </View>
);

// ── Helpers ───────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 100000 ? `Rs.${(n / 100000).toFixed(2)}L` : `Rs.${n.toLocaleString()}`;

const ENTRY_COLORS: Record<NegotiationEntry['type'], { bg: string; dot: string }> = {
  message:      { bg: '#EFF6FF', dot: colors.primary  },
  quote_change: { bg: '#F0FDF4', dot: colors.success  },
  approval:     { bg: '#F0FDF4', dot: '#16A34A'       },
  rejection:    { bg: '#FFF1F2', dot: colors.danger   },
  payment:      { bg: '#FEFCE8', dot: '#CA8A04'       },
  phase_change: { bg: '#F5F3FF', dot: '#7C3AED'       },
};

// ── Section wrapper ───────────────────────────────────────────────────────
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// ── Phase Stepper ─────────────────────────────────────────────────────────
const PhaseStepper: React.FC<{ currentIndex: number; status: Deal['status'] }> = ({ currentIndex, status }) => {
  const isCancelled = status === 'Cancelled';
  return (
    <View style={styles.stepper}>
      {DEAL_PHASES.map((phase, idx) => {
        const done    = idx < currentIndex;
        const current = idx === currentIndex && !isCancelled;
        const rejected = isCancelled && idx === currentIndex;
        const pending  = idx > currentIndex;
        return (
          <View key={phase} style={styles.stepRow}>
            {/* connector */}
            {idx > 0 && (
              <View style={[styles.connector, done && styles.connectorDone]} />
            )}
            {/* node */}
            <View style={[
              styles.stepNode,
              done    && styles.stepNodeDone,
              current && styles.stepNodeActive,
              rejected && styles.stepNodeRejected,
              pending && styles.stepNodePending,
            ]}>
              {done ? (
                <CheckMark size={10} color="#fff" />
              ) : (
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: current ? '#fff' : (rejected ? '#fff' : '#CBD5E1') }} />
              )}
            </View>
            {/* label */}
            <View style={styles.stepLabel}>
              <Text style={[
                styles.stepText,
                done    && styles.stepTextDone,
                current && styles.stepTextActive,
                rejected && { color: colors.danger },
              ]}>{phase}</Text>
              {current && !isCancelled && (
                <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>CURRENT</Text></View>
              )}
              {rejected && (
                <View style={[styles.currentBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.currentBadgeText, { color: colors.danger }]}>CANCELLED</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ── Timeline Entry ────────────────────────────────────────────────────────
const TimelineEntry: React.FC<{ entry: NegotiationEntry; isLast: boolean }> = ({ entry, isLast }) => {
  const cfg = ENTRY_COLORS[entry.type];
  const actorColor = entry.actor === 'Factory' ? colors.primary : entry.actor === 'Vendor' ? colors.accent : colors.textMuted;
  return (
    <View style={styles.tlRow}>
      <View style={styles.tlLeft}>
        <View style={[styles.tlDot, { backgroundColor: cfg.dot }]} />
        {!isLast && <View style={styles.tlLine} />}
      </View>
      <View style={[styles.tlCard, { backgroundColor: cfg.bg }]}>
        <View style={styles.tlCardHeader}>
          <Text style={[styles.tlActor, { color: actorColor }]}>{entry.actorName}</Text>
          <Text style={styles.tlTime}>{entry.timestamp}</Text>
        </View>
        <Text style={styles.tlAction}>{entry.action}</Text>
        <Text style={styles.tlDetail}>{entry.detail}</Text>
      </View>
    </View>
  );
};

// ── Quote Version Card ────────────────────────────────────────────────────
const VersionCard: React.FC<{ v: QuoteVersion; isFinal: boolean }> = ({ v, isFinal }) => (
  <View style={[styles.vCard, isFinal && styles.vCardFinal]}>
    <View style={styles.vCardHeader}>
      <Text style={styles.vLabel}>V{v.version}</Text>
      {isFinal && <View style={styles.finalBadge}><Text style={styles.finalBadgeText}>FINAL</Text></View>}
      <Text style={styles.vDate}>{v.date}</Text>
    </View>
    <Text style={styles.vAmount}>{fmt(v.amount)}</Text>
    <Text style={styles.vBy}>By: {v.changedBy}</Text>
    <Text style={styles.vChanges}>{v.changes}</Text>
  </View>
);

// ── Action Buttons ─────────────────────────────────────────────────────────
const ActionBtn: React.FC<{
  label: string; bg: string; fg?: string; onPress?: () => void;
}> = ({ label, bg, fg = '#fff', onPress }) => (
  <TouchableOpacity
    style={[styles.actionBtn, { backgroundColor: bg }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Text style={[styles.actionBtnText, { color: fg }]}>{label}</Text>
  </TouchableOpacity>
);

// ── Main Screen ───────────────────────────────────────────────────────────
export const DealDetailScreen: React.FC<{ params?: Deal }> = ({ params }) => {
  const { pop, push } = useNav();
  const insets = useSafeAreaInsets();
  const deal = params!;
  const [activeTab, setActiveTab] = useState<'timeline' | 'versions' | 'details'>('timeline');

  const totalVersions = deal.quoteVersions.length;

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={pop} activeOpacity={0.8}>
          <BackArrow />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{deal.id}</Text>
          <Text style={styles.headerSub}>{deal.quotationId} · {deal.vendor}</Text>
        </View>
        <View style={[styles.statusPill, {
          backgroundColor: deal.status === 'Confirmed' ? '#F0FDF4' :
            deal.status === 'Cancelled' ? '#FFF1F2' :
            deal.status === 'Negotiating' ? '#FFF7ED' : '#EFF6FF',
        }]}>
          <Text style={[styles.statusPillText, {
            color: deal.status === 'Confirmed' ? colors.success :
              deal.status === 'Cancelled' ? colors.danger :
              deal.status === 'Negotiating' ? '#C2410C' : colors.primary,
          }]}>{deal.status}</Text>
        </View>
      </View>

      {/* ── Summary strip ── */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Deal Value</Text>
          <Text style={styles.summaryVal}>{fmt(deal.finalAmount)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Qty</Text>
          <Text style={styles.summaryVal}>{deal.qty.toLocaleString()} {deal.unit}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Revisions</Text>
          <Text style={styles.summaryVal}>{totalVersions} versions</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryVal}>{deal.deliveryDate}</Text>
        </View>
      </View>

      {/* ── Readiness ── */}
      <View style={styles.readinessRow}>
        <View style={[styles.readinessPill, { backgroundColor: deal.paymentReady ? '#F0FDF4' : '#FFF7ED' }]}>
          <View style={[styles.readinessDot, { backgroundColor: deal.paymentReady ? colors.success : '#F97316' }]} />
          <Text style={[styles.readinessText, { color: deal.paymentReady ? colors.success : '#C2410C' }]}>
            Payment {deal.paymentReady ? 'Ready' : 'Pending'}
          </Text>
        </View>
        <View style={[styles.readinessPill, { backgroundColor: deal.deliveryReady ? '#F0FDF4' : '#FFF7ED' }]}>
          <View style={[styles.readinessDot, { backgroundColor: deal.deliveryReady ? colors.success : '#F97316' }]} />
          <Text style={[styles.readinessText, { color: deal.deliveryReady ? colors.success : '#C2410C' }]}>
            Delivery {deal.deliveryReady ? 'Ready' : 'Pending'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => push('ChatDetail', { contact: deal.vendor, contactRole: 'Vendor', productRef: deal.product })}
        >
          <Text style={styles.chatBtnText}>Open Chat</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tab nav ── */}
      <View style={styles.tabs}>
        {(['timeline', 'versions', 'details'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]} onPress={() => setActiveTab(t)}>
            <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
              {t === 'timeline' ? 'Timeline' : t === 'versions' ? `Quote Versions (${totalVersions})` : 'Details'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>

        {/* ── TIMELINE tab ── */}
        {activeTab === 'timeline' && (
          <>
            {/* Phase stepper */}
            <Section title="Negotiation Phases">
              <PhaseStepper currentIndex={deal.phaseIndex} status={deal.status} />
            </Section>

            {/* Activity feed */}
            <Section title="Activity Feed">
              {deal.timeline.map((entry, idx) => (
                <TimelineEntry key={entry.id} entry={entry} isLast={idx === deal.timeline.length - 1} />
              ))}
            </Section>
          </>
        )}

        {/* ── VERSIONS tab ── */}
        {activeTab === 'versions' && (
          <Section title="Quote Version History">
            {deal.quoteVersions.map((v, idx) => (
              <VersionCard key={v.version} v={v} isFinal={idx === totalVersions - 1} />
            ))}
            {totalVersions > 1 && (
              <View style={styles.compareCard}>
                <Text style={styles.compareTitle}>Price Movement</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  {deal.quoteVersions.map(v => (
                    <View key={v.version} style={{ alignItems: 'center' }}>
                      <Text style={styles.compareLabel}>V{v.version}</Text>
                      <Text style={styles.compareVal}>{fmt(v.amount)}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.movementBar}>
                  {deal.quoteVersions.map((v, i) => {
                    const maxA = Math.max(...deal.quoteVersions.map(x => x.amount));
                    const pct = (v.amount / maxA) * 100;
                    return (
                      <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: 60 }}>
                        <View style={{ width: 28, height: `${pct}%` as any, backgroundColor: i === totalVersions - 1 ? colors.primary : '#CBD5E1', borderRadius: 6 }} />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </Section>
        )}

        {/* ── DETAILS tab ── */}
        {activeTab === 'details' && (
          <>
            <Section title="Deal Information">
              {[
                { l: 'Deal ID',       v: deal.id           },
                { l: 'Quotation Ref', v: deal.quotationId  },
                { l: 'Factory',       v: deal.factory       },
                { l: 'Vendor',        v: deal.vendor        },
                { l: 'Vendor City',   v: deal.vendorCity    },
                { l: 'Product',       v: deal.product       },
                { l: 'Quantity',      v: `${deal.qty.toLocaleString()} ${deal.unit}` },
                { l: 'Final Value',   v: fmt(deal.finalAmount) },
                { l: 'Created On',    v: deal.createdOn     },
                { l: 'Last Updated',  v: deal.lastUpdated   },
                { l: 'Delivery Date', v: deal.deliveryDate  },
              ].map(row => (
                <View key={row.l} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row.l}</Text>
                  <Text style={styles.detailValue}>{row.v}</Text>
                </View>
              ))}
            </Section>

            {deal.notes ? (
              <Section title="Notes">
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{deal.notes}</Text>
                </View>
              </Section>
            ) : null}
          </>
        )}

        {/* ── Action bar ── */}
        {deal.status !== 'Cancelled' && deal.status !== 'Closed' && (
          <View style={styles.actionRow}>
            {deal.status === 'Negotiating' && (
              <>
                <ActionBtn label="Request Revision"   bg={colors.primary} />
                <ActionBtn label="Accept Quote"        bg={colors.success} />
                <ActionBtn label="Counter Offer"       bg="#7C3AED" />
              </>
            )}
            {deal.status === 'Payment Pending' && (
              <>
                <ActionBtn label="Confirm Payment Ready" bg={colors.success} />
                <ActionBtn label="Lock Pricing"          bg={colors.primary} />
              </>
            )}
            {deal.status === 'Confirmed' && (
              <>
                <ActionBtn label="Track Delivery"      bg={colors.accent} />
                <ActionBtn label="Generate PDF"        bg="#7C3AED" />
                <ActionBtn label="Close Deal"          bg={colors.textMuted} />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#F0F4FA' },
  header:        { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingBottom: 14 },
  backBtn:       { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle:   { fontSize: 17, fontWeight: '900', color: '#fff' },
  headerSub:     { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statusPill:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  statusPillText:{ fontSize: 11, fontWeight: '800' },
  summaryStrip:  { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryItem:   { flex: 1, alignItems: 'center' },
  summaryLabel:  { fontSize: 10, fontWeight: '600', color: colors.textMuted },
  summaryVal:    { fontSize: 13, fontWeight: '800', color: colors.text, marginTop: 2 },
  summaryDivider:{ width: 1, backgroundColor: colors.border, marginVertical: 4 },
  readinessRow:  { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border, gap: 8 },
  readinessPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flex: 1 },
  readinessDot:  { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  readinessText: { fontSize: 11, fontWeight: '700' },
  chatBtn:       { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.primary, borderRadius: 10 },
  chatBtnText:   { fontSize: 12, fontWeight: '800', color: '#fff' },
  tabs:          { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border },
  tabBtn:        { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive:  { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabBtnText:    { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tabBtnTextActive: { color: colors.primary },
  section:       { marginBottom: 20 },
  sectionTitle:  { fontSize: 12, fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },

  // Stepper
  stepper:       { },
  stepRow:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  connector:     { position: 'absolute', top: -10, left: 10, width: 2, height: 24, backgroundColor: '#E2E8F0' },
  connectorDone: { backgroundColor: colors.success },
  stepNode:      { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginBottom: 12, zIndex: 1 },
  stepNodeDone:  { backgroundColor: colors.success },
  stepNodeActive:{ backgroundColor: colors.primary },
  stepNodeRejected: { backgroundColor: colors.danger },
  stepNodePending:{ backgroundColor: '#E2E8F0' },
  stepLabel:     { flex: 1, paddingTop: 2, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  stepText:      { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginRight: 8 },
  stepTextDone:  { color: colors.text, fontWeight: '700' },
  stepTextActive:{ color: colors.primary, fontWeight: '800' },
  currentBadge:  { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  currentBadgeText: { fontSize: 9, fontWeight: '900', color: colors.primary, letterSpacing: 0.5 },

  // Timeline
  tlRow:         { flexDirection: 'row', marginBottom: 16 },
  tlLeft:        { width: 28, alignItems: 'center' },
  tlDot:         { width: 12, height: 12, borderRadius: 6, marginTop: 3 },
  tlLine:        { flex: 1, width: 2, backgroundColor: '#E2E8F0', marginTop: 4 },
  tlCard:        { flex: 1, marginLeft: 10, borderRadius: 12, padding: 12 },
  tlCardHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tlActor:       { fontSize: 12, fontWeight: '800' },
  tlTime:        { fontSize: 11, color: colors.textMuted },
  tlAction:      { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  tlDetail:      { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  // Quote versions
  vCard:         { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  vCardFinal:    { borderColor: colors.primary, borderWidth: 2 },
  vCardHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  vLabel:        { fontSize: 16, fontWeight: '900', color: colors.text, marginRight: 8 },
  finalBadge:    { backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 'auto' },
  finalBadgeText:{ fontSize: 10, fontWeight: '900', color: colors.primary },
  vDate:         { fontSize: 11, color: colors.textMuted },
  vAmount:       { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 2 },
  vBy:           { fontSize: 12, color: colors.primary, fontWeight: '700', marginBottom: 4 },
  vChanges:      { fontSize: 12, color: colors.textMuted, lineHeight: 17 },

  compareCard:   { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginTop: 4 },
  compareTitle:  { fontSize: 13, fontWeight: '800', color: colors.text },
  compareLabel:  { fontSize: 11, color: colors.textMuted, marginBottom: 4 },
  compareVal:    { fontSize: 12, fontWeight: '700', color: colors.text },
  movementBar:   { flexDirection: 'row', height: 70, marginTop: 12, alignItems: 'flex-end', justifyContent: 'space-around' },

  // Details
  detailRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel:   { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  detailValue:   { fontSize: 13, fontWeight: '700', color: colors.text, maxWidth: '55%', textAlign: 'right' },
  notesBox:      { backgroundColor: '#FFF7ED', borderRadius: 10, padding: 12 },
  notesText:     { fontSize: 13, color: '#92400E', lineHeight: 19 },

  // Actions
  actionRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  actionBtn:     { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  actionBtnText: { fontSize: 13, fontWeight: '800' },
});
