import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, Card, Chips, SectionTitle } from '../components/UI';
import { notifications, smartAlerts } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

const CATS = ['All', 'Low Stock', 'Delayed Production', 'QC Rejection', 'Machine Fault', 'Payment Pending', 'Dispatch Delay'];

export const AlertsScreen: React.FC = () => {
  const { push } = useNav();
  const [cat, setCat] = useState('All');

  const list = cat === 'All' ? notifications : notifications.filter((n) => n.type === cat);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
      <Text style={typography.display}>Alerts</Text>
      <Text style={[typography.bodyMuted, { marginBottom: spacing.lg }]}>
        Real-time notifications across your plant.
      </Text>

      <View style={styles.summary}>
        <Sum n="3" l="Critical" tone={colors.danger} />
        <Sum n="6" l="Warnings" tone={colors.alertOrange} />
        <Sum n="12" l="Info" tone={colors.info} />
        <Sum n="4" l="Resolved" tone={colors.success} />
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <Chips options={CATS} value={cat} onChange={setCat} />
      </View>

      <SectionTitle title="Active alerts" subtitle={`${list.length} item${list.length === 1 ? '' : 's'}`} />

      {list.map((n) => (
        <Card key={n.id} style={{ marginBottom: 10 }} onPress={() => push(n.screen as any)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.bar, {
              backgroundColor:
                n.tone === 'danger' ? colors.danger
                : n.tone === 'orange' ? colors.alertOrange
                : colors.warning,
            }]} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Badge
                  text={n.type}
                  tone={n.tone === 'danger' ? 'danger' : n.tone === 'orange' ? 'orange' : 'warning'}
                />
                <Text style={[typography.small, { marginLeft: 8 }]}>{n.time} ago</Text>
              </View>
              <Text style={[typography.body, { marginTop: 6 }]}>{n.text}</Text>
            </View>
            <Text style={{ color: colors.textSubtle, fontSize: 22, marginLeft: 6 }}>›</Text>
          </View>
        </Card>
      ))}

      <SectionTitle title="Smart alerts (AI)" subtitle="Predicted before they hurt" />
      {smartAlerts.map((a) => (
        <Card key={a.id} style={{ marginBottom: 10, borderLeftWidth: 4, borderLeftColor:
          a.tone === 'danger' ? colors.danger : a.tone === 'orange' ? colors.alertOrange : colors.warning,
        }} onPress={() => push(a.screen as any)}>
          <Text style={typography.body}>{a.text}</Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const Sum: React.FC<{ n: string; l: string; tone: string }> = ({ n, l, tone }) => (
  <View style={[styles.sumCard, { borderTopColor: tone }]}>
    <Text style={{ fontSize: 22, fontWeight: '900', color: colors.text }}>{n}</Text>
    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginTop: 2 }}>{l}</Text>
  </View>
);

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', justifyContent: 'space-between' },
  sumCard: {
    width: '23.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
    borderTopWidth: 3,
  },
  bar: { width: 4, height: 38, borderRadius: 4, marginRight: 12 },
});
