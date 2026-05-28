import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, Card, Chips, SearchBar, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { vendors } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

export const VendorsScreen: React.FC = () => {
  const { push } = useNav();
  const [cat, setCat] = useState('All');
  const cats = ['All', 'Raw Material', 'Spare Parts', 'Casting', 'Packaging'];

  const list = cat === 'All' ? vendors : vendors.filter((v) => v.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Vendors" subtitle="42 active · 8 categories" rightIcon="＋" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <SearchBar placeholder="Search vendor, city, item…" />
        <View style={{ height: spacing.md }} />
        <Chips options={cats} value={cat} onChange={setCat} />

        <View style={styles.summary}>
          <Mini n="42" l="Active" />
          <Mini n="4.4" l="Avg rating" />
          <Mini n="89%" l="On-time" />
          <Mini n="2.8%" l="Reject %" tone={colors.warning} />
        </View>

        <SectionTitle title={`Vendors · ${list.length}`} action="Sort" />
        {list.map((v) => (
          <Card key={v.id} style={{ marginBottom: 10 }} onPress={() => push('VendorDetail', v)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.avatar, { backgroundColor: colors.chart[parseInt(v.id.slice(1)) % colors.chart.length] }]}>
                <Text style={styles.avatarText}>{v.name.split(' ').map((s) => s[0]).slice(0, 2).join('')}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={typography.h3}>{v.name}</Text>
                <Text style={typography.small}>{v.category} · {v.city}</Text>
              </View>
              <Badge text={v.status} tone={v.status === 'Active' ? 'success' : 'steel'} />
            </View>
            <View style={styles.row}>
              <Cell l="Rating" v={`★ ${v.rating}`} tone={colors.warning} />
              <Cell l="Lead time" v={`${v.leadTime}d`} />
              <Cell l="Reliability" v={`${v.reliability}%`} tone={v.reliability >= 90 ? colors.success : v.reliability >= 80 ? colors.warning : colors.danger} />
              <Cell l="Pending" v={`${v.pendingOrders}`} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={typography.small}>Item: {v.item} · Payment {v.payment}</Text>
              <Text style={[typography.small, { color: colors.primary, fontWeight: '800' }]}>View profile →</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const Mini: React.FC<{ n: string; l: string; tone?: string }> = ({ n, l, tone }) => (
  <View style={{ width: '23.5%', backgroundColor: colors.surface, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
    <Text style={{ fontSize: 14, fontWeight: '900', color: tone || colors.text }}>{n}</Text>
    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginTop: 2 }}>{l}</Text>
  </View>
);
const Cell: React.FC<{ l: string; v: string; tone?: string }> = ({ l, v, tone }) => (
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '700' }}>{l}</Text>
    <Text style={{ fontSize: 13, color: tone || colors.text, fontWeight: '800', marginTop: 2 }}>{v}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  row: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
});
