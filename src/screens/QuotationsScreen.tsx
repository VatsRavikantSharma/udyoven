import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Card, SearchBar, Tabs } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { quotations } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const TABS = ['Draft', 'Sent', 'Approved', 'Negotiation', 'Rejected', 'Expired'];
const TONE: Record<string, string> = {
  Draft: 'steel', Sent: 'info', Approved: 'success', Negotiation: 'warning', Rejected: 'danger', Expired: 'orange',
};

export const QuotationsScreen: React.FC = () => {
  const { push } = useNav();
  const [tab, setTab] = useState('Sent');

  const list = useMemo(() => quotations.filter((q) => q.status === tab), [tab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Quotations" subtitle="42 active · ₹1.42 Cr pipeline" rightIcon="＋" onRightPress={() => push('QuotationCreate')} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl + 60 }}>
        <SearchBar placeholder="Search quotation, client, salesperson…" />
        <View style={{ height: spacing.md }} />
        <Tabs options={TABS} value={tab} onChange={setTab} />

        <View style={styles.summary}>
          <Mini n="42" l="Active" />
          <Mini n="₹1.42Cr" l="Pipeline" />
          <Mini n="68%" l="Conversion" />
          <Mini n="14" l="Avg margin %" />
        </View>

        <View style={{ marginTop: spacing.md }}>
          {list.length === 0 ? (
            <Card><Text style={typography.bodyMuted}>No quotations under {tab}.</Text></Card>
          ) : list.map((q) => (
            <Card key={q.id} style={{ marginBottom: 10 }} onPress={() => push('QuotationDetail', q)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={typography.h3}>{q.id} · {q.client}</Text>
                  <Text style={typography.small}>
                    {q.items} item{q.items > 1 ? 's' : ''} · valid till {q.validity} · rev {q.rev}
                  </Text>
                </View>
                <Badge text={q.status} tone={TONE[q.status]} />
              </View>
              <View style={styles.row}>
                <Cell label="Value" value={`₹${q.amount.toLocaleString('en-IN')}`} bold />
                <Cell label="Margin" value={`${q.margin}%`} tone={q.margin >= 15 ? 'success' : q.margin >= 10 ? 'warning' : 'danger'} />
                <View style={{ flexDirection: 'row' }}>
                  <Action label="PDF" />
                  <Action label="WhatsApp" />
                  <Action label="Convert →" tone />
                </View>
              </View>
              {q.status === 'Negotiation' ? (
                <View style={styles.flag}>
                  <Text style={styles.flagText}>🚩 Negotiation in progress · 3 revisions</Text>
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity activeOpacity={0.85} style={styles.fab} onPress={() => push('QuotationCreate')}>
        <Text style={styles.fabText}>＋ New Quote</Text>
      </TouchableOpacity>
    </View>
  );
};

const Mini: React.FC<{ n: string; l: string }> = ({ n, l }) => (
  <View style={styles.miniCard}>
    <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 2 }}>{l}</Text>
  </View>
);

const Cell: React.FC<{ label: string; value: string; bold?: boolean; tone?: string }> = ({ label, value, bold, tone }) => (
  <View style={{ marginRight: 14 }}>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{label}</Text>
    <Text style={{
      fontSize: 13, marginTop: 2,
      fontWeight: bold ? '900' : '700',
      color: tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : tone === 'danger' ? colors.danger : colors.text,
    }}>{value}</Text>
  </View>
);

const Action: React.FC<{ label: string; tone?: boolean }> = ({ label, tone }) => (
  <View style={{
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill,
    backgroundColor: tone ? colors.primary : colors.surfaceAlt,
    borderWidth: 1, borderColor: tone ? colors.primary : colors.border,
    marginLeft: 6,
  }}>
    <Text style={{ fontSize: 10, fontWeight: '800', color: tone ? '#fff' : colors.text }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  miniCard: {
    width: '23.5%', backgroundColor: colors.surface, padding: 12, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider, flexWrap: 'wrap',
  },
  flag: {
    backgroundColor: colors.warningBg, padding: 8, borderRadius: radius.sm, marginTop: 10,
  },
  flagText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  fab: {
    position: 'absolute', bottom: 24, right: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14, paddingHorizontal: 18,
    borderRadius: radius.pill,
    elevation: 6,
  },
  fabText: { color: '#fff', fontWeight: '800' },
});
