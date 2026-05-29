import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge, Card, SearchBar, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { deals, quotations, QuotationStatus } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ─── NewQuote type selector modal ────────────────────────────────────────────
const QUOTE_TYPES = [
  {
    key: 'category',
    label: 'Category Wise',
    description: 'Select category, add products, apply pricing & taxes',
    bg: '#EFF6FF',
    accent: colors.primary,
    letter: 'C',
  },
  {
    key: 'client',
    label: 'Client Wise',
    description: 'Select vendor, auto-fill history, custom negotiation pricing',
    bg: '#F0FDF4',
    accent: colors.success,
    letter: 'V',
  },
  {
    key: 'multi',
    label: 'Multi Category',
    description: 'Select multiple categories, combine into one quotation',
    bg: '#F5F3FF',
    accent: '#7C3AED',
    letter: 'M',
  },
  {
    key: 'global',
    label: 'Global Quote',
    description: 'Apply to ALL categories — universal pricing rules & bulk send',
    bg: '#FFF7ED',
    accent: '#D97706',
    letter: 'G',
  },
];

const NewQuoteModal: React.FC<{ visible: boolean; onClose: () => void; onSelect: (type: string) => void }> = ({
  visible, onClose, onSelect,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={mqStyles.overlay} onPress={onClose}>
      <Pressable style={mqStyles.sheet} onPress={() => {}}>
        {/* handle */}
        <View style={mqStyles.handle} />
        <Text style={mqStyles.title}>New Quotation</Text>
        <Text style={mqStyles.subtitle}>Choose quote type to get started</Text>
        {QUOTE_TYPES.map(qt => (
          <TouchableOpacity
            key={qt.key}
            style={[mqStyles.typeCard, { backgroundColor: qt.bg }]}
            onPress={() => onSelect(qt.key)}
            activeOpacity={0.85}
          >
            <View style={[mqStyles.typeIcon, { backgroundColor: qt.accent }]}>
              <Text style={mqStyles.typeIconText}>{qt.letter}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[mqStyles.typeLabel, { color: qt.accent }]}>{qt.label}</Text>
              <Text style={mqStyles.typeDesc}>{qt.description}</Text>
            </View>
            <View style={{ width: 6, height: 6, borderRightWidth: 2, borderTopWidth: 2, borderColor: qt.accent, transform: [{ rotate: '45deg' }] }} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={mqStyles.cancelBtn} onPress={onClose}>
          <Text style={mqStyles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

const mqStyles = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  handle:     { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title:      { fontSize: 20, fontWeight: '900', color: colors.text, marginBottom: 4 },
  subtitle:   { fontSize: 13, color: colors.textMuted, marginBottom: 20 },
  typeCard:   { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 12 },
  typeIcon:   { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  typeIconText: { fontSize: 18, fontWeight: '900', color: '#fff' },
  typeLabel:  { fontSize: 15, fontWeight: '800', marginBottom: 3 },
  typeDesc:   { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  cancelBtn:  { alignItems: 'center', paddingVertical: 14 },
  cancelText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
});

const ALL_STATUSES: QuotationStatus[] = [
  'Draft', 'Sent', 'Viewed', 'Negotiating', 'Revised',
  'Accepted', 'Rejected', 'Payment Pending', 'Confirmed', 'Closed',
];

const STATUS_TONE: Record<string, string> = {
  Draft: 'steel',
  Sent: 'info',
  Viewed: 'primary',
  Negotiating: 'warning',
  Revised: 'orange',
  Accepted: 'success',
  Rejected: 'danger',
  'Payment Pending': 'warning',
  Confirmed: 'success',
  Closed: 'steel',
};

const STATUS_COLOR: Record<string, string> = {
  Draft: colors.textMuted,
  Sent: colors.info,
  Viewed: colors.primary,
  Negotiating: colors.warning,
  Revised: colors.alertOrange,
  Accepted: colors.success,
  Rejected: colors.danger,
  'Payment Pending': colors.warning,
  Confirmed: colors.success,
  Closed: colors.textMuted,
};

export const QuotationsScreen: React.FC = () => {
  const { push } = useNav();
  const insets = useSafeAreaInsets();
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);

  const handleQuoteType = (type: string) => {
    setShowNewQuoteModal(false);
    push('QuotationCreate', { quoteType: type });
  };

  const filtered = useMemo(() => {
    if (activeStatus === 'All') return quotations;
    return quotations.filter((q) => q.status === activeStatus);
  }, [activeStatus]);

  const totalValue = quotations.reduce((s, q) => s + q.amount, 0);
  const activeCount = quotations.filter((q) =>
    ['Sent', 'Viewed', 'Negotiating', 'Revised'].includes(q.status)
  ).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NewQuoteModal
        visible={showNewQuoteModal}
        onClose={() => setShowNewQuoteModal(false)}
        onSelect={handleQuoteType}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary + deal tracking shortcut */}
        <View style={styles.summaryHeader}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryN}>{quotations.length}</Text>
            <Text style={styles.summaryL}>Total Quotes</Text>
          </View>
          <View style={styles.sumDiv} />
          <View style={styles.summaryCell}>
            <Text style={styles.summaryN}>{activeCount}</Text>
            <Text style={styles.summaryL}>Active</Text>
          </View>
          <View style={styles.sumDiv} />
          <View style={styles.summaryCell}>
            <Text style={styles.summaryN}>Rs.{Math.round(totalValue / 100000)}L</Text>
            <Text style={styles.summaryL}>Pipeline</Text>
          </View>
        </View>

        {/* Deal tracking banner */}
        <TouchableOpacity style={styles.dealBanner} onPress={() => push('DealTracking')} activeOpacity={0.88}>
          <View style={styles.dealBannerLeft}>
            <View style={styles.dealBannerDot} />
            <View>
              <Text style={styles.dealBannerTitle}>Deal Tracking</Text>
              <Text style={styles.dealBannerSub}>{deals.length} deals · {deals.filter(d => d.status === 'Negotiating' || d.status === 'Active').length} in negotiation</Text>
            </View>
          </View>
          <Text style={styles.dealBannerArrow}>View All</Text>
        </TouchableOpacity>

        {/* Status filter horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {['All', ...ALL_STATUSES].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, activeStatus === s && styles.filterChipActive]}
              onPress={() => setActiveStatus(s)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, activeStatus === s && styles.filterTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quotation list */}
        <View style={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>Q</Text>
              <Text style={styles.emptyTitle}>No quotations</Text>
              <Text style={styles.emptyBody}>No quotes with status "{activeStatus}".</Text>
            </View>
          ) : filtered.map((q) => {
            const sc = STATUS_COLOR[q.status] || colors.textMuted;
            const subtotal = q.items.reduce((s, it) => s + it.qty * it.rate, 0);
            return (
              <TouchableOpacity
                key={q.id}
                style={styles.quoteCard}
                onPress={() => push('QuotationDetail', q)}
                activeOpacity={0.87}
              >
                {/* Left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: sc }]} />

                <View style={styles.quoteCardBody}>
                  <View style={styles.quoteTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.quoteId}>{q.id}</Text>
                      <Text style={styles.quoteVendor} numberOfLines={1}>{q.vendor}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sc + '18' }]}>
                      <Text style={[styles.statusText, { color: sc }]}>{q.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.quoteFactory} numberOfLines={1}>Factory: {q.factory}</Text>

                  <View style={styles.quoteMetaRow}>
                    <Text style={styles.quoteAmount}>Rs.{q.amount.toLocaleString('en-IN')}</Text>
                    <Text style={styles.quoteMeta}>
                      Rev {q.rev} · Valid {q.validity}
                    </Text>
                  </View>

                  <View style={styles.quoteItemsRow}>
                    <Text style={styles.quoteItemsText}>
                      {q.items.length} item{q.items.length > 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.quoteDate}>Updated {q.lastUpdated}</Text>
                  </View>

                  {/* Action chips */}
                  <View style={styles.quoteActions}>
                    {q.status === 'Negotiating' || q.status === 'Sent' ? (
                      <>
                        <TouchableOpacity
                          style={[styles.actionChip, { backgroundColor: colors.primary }]}
                          onPress={() => push('QuotationDetail', q)}
                        >
                          <Text style={[styles.actionChipText, { color: '#fff' }]}>Review</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionChip}
                          onPress={() => push('ChatDetail', { contact: q.vendor, productRef: q.id })}
                        >
                          <Text style={styles.actionChipText}>Chat</Text>
                        </TouchableOpacity>
                      </>
                    ) : q.status === 'Accepted' ? (
                      <TouchableOpacity
                        style={[styles.actionChip, { backgroundColor: colors.success }]}
                        onPress={() => push('QuotationDetail', q)}
                      >
                        <Text style={[styles.actionChipText, { color: '#fff' }]}>Confirm Deal</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.actionChip}
                        onPress={() => push('QuotationDetail', q)}
                      >
                        <Text style={styles.actionChipText}>View Details</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowNewQuoteModal(true)} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>New Quote</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  summaryCell: { flex: 1, alignItems: 'center' },
  summaryN: { fontSize: 24, fontWeight: '900', color: '#fff' },
  summaryL: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.65)', marginTop: 3 },
  sumDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface, marginRight: 8,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  filterTextActive: { color: '#fff' },
  list: { padding: spacing.lg },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, fontWeight: '900', color: colors.border, marginBottom: spacing.lg },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  emptyBody: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  quoteCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
    ...shadow.card,
  },
  accentBar: { width: 4, borderRadius: 4 },
  quoteCardBody: { flex: 1, padding: spacing.lg },
  quoteTopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  quoteId: { fontSize: 14, fontWeight: '900', color: colors.primary },
  quoteVendor: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  quoteFactory: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginBottom: spacing.sm },
  quoteMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  quoteAmount: { fontSize: 18, fontWeight: '900', color: colors.text },
  quoteMeta: { fontSize: 11, fontWeight: '600', color: colors.textSubtle },
  quoteItemsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  quoteItemsText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  quoteDate: { fontSize: 11, fontWeight: '600', color: colors.textSubtle },
  quoteActions: { flexDirection: 'row' },
  actionChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surfaceAlt, marginRight: 8,
  },
  actionChipText: { fontSize: 11, fontWeight: '800', color: colors.text },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: radius.pill,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  fabIcon: { fontSize: 18, fontWeight: '900', color: '#fff', marginRight: 6 },
  fabText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  dealBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: spacing.lg, marginBottom: spacing.md, marginTop: spacing.sm,
    backgroundColor: '#F0FDF4', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  dealBannerLeft:  { flexDirection: 'row', alignItems: 'center' },
  dealBannerDot:   { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success, marginRight: 12 },
  dealBannerTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  dealBannerSub:   { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  dealBannerArrow: { fontSize: 13, fontWeight: '800', color: colors.success },
});
