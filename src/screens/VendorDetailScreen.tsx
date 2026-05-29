import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Card, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { vendors } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

export const VendorDetailScreen: React.FC<{ params?: any }> = ({ params }) => {
  const { push } = useNav();
  const v = params || vendors[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={v.name} subtitle={`${v.category} · ${v.city}`} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <Card style={{ marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {v.name.split(' ').map((s: string) => s[0]).slice(0, 2).join('')}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={typography.h2}>{v.name}</Text>
              <Text style={[typography.small, { marginTop: 4 }]}>{v.category} · {v.city}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
                <Badge text={`${v.rating} ★`} tone="warning" />
                <Badge text={v.status} tone={v.status === 'Active' ? 'success' : 'steel'} />
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City</Text>
            <Text style={styles.infoValue}>{v.city}</Text>
          </View>
          <View style={[styles.infoRow, styles.rowBorder]}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{v.category}</Text>
          </View>
          <View style={[styles.infoRow, styles.rowBorder]}>
            <Text style={styles.infoLabel}>Active Quotes</Text>
            <Text style={styles.infoValue}>{v.activeQuotes}</Text>
          </View>
          <View style={[styles.infoRow, styles.rowBorder]}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: v.status === 'Active' ? colors.success : colors.danger }]}>
              {v.status}
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <SectionTitle title="Actions" />
        <Card padded={false} style={{ marginBottom: spacing.xl }}>
          <TouchableOpacity
            style={[styles.actionRow, styles.rowBorderBottom]}
            onPress={() => push('QuotationCreate', { vendor: v.name })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.actionIconText, { color: colors.primary }]}>Q</Text>
            </View>
            <Text style={styles.actionLabel}>Create Quotation</Text>
            <Text style={styles.actionChevron}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => push('ChatDetail', { contact: v.name, contactRole: 'Vendor', productRef: v.category })}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.accent + '15' }]}>
              <Text style={[styles.actionIconText, { color: colors.accent }]}>C</Text>
            </View>
            <Text style={styles.actionLabel}>Send Message</Text>
            <Text style={styles.actionChevron}>{'>'}</Text>
          </TouchableOpacity>
        </Card>

        {/* Recent Quotations with this vendor */}
        <SectionTitle title="Recent Quotations" />
        <Card style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted }}>
            No recent quotations with this vendor.
          </Text>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => push('QuotationCreate', { vendor: v.name })}
          >
            <Text style={styles.viewAllText}>+ New Quotation</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: colors.primary },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  rowBorder: {
    borderTopWidth: 1, borderTopColor: colors.divider,
    paddingTop: spacing.md, marginTop: spacing.md,
  },
  infoLabel: { fontSize: 12, fontWeight: '700', color: colors.textSubtle },
  infoValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.lg,
  },
  rowBorderBottom: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  actionIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  actionIconText: { fontSize: 14, fontWeight: '900' },
  actionLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },
  actionChevron: { fontSize: 16, fontWeight: '700', color: colors.textSubtle },
  viewAllBtn: { marginTop: spacing.md, alignSelf: 'flex-start' },
  viewAllText: { fontSize: 13, fontWeight: '800', color: colors.primary },
});
