import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, spacing, typography } from '../theme';

export const QuotationDetailScreen: React.FC<{ params?: any }> = ({ params }) => {
  const q = params || { id: 'Q-2041', client: 'Tata Forge Ltd.', amount: 248400, validity: '28 Apr', status: 'Sent', margin: 18, items: 4, rev: 1 };
  const { push } = useNav();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={q.id} subtitle={q.client} rightIcon="↗" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={typography.h2}>₹{q.amount.toLocaleString('en-IN')}</Text>
            <Badge text={q.status} tone="primary" />
          </View>
          <Text style={typography.small}>Valid till {q.validity} · Revision {q.rev}</Text>
          <Divider />
          <Row label="Margin" value={`${q.margin}%`} />
          <Row label="Line items" value={`${q.items}`} />
          <Row label="Salesperson" value="A. Kapoor" />
        </Card>

        <SectionTitle title="Line items" />
        <Card padded={false}>
          {[
            { i: 'CNC Bracket 220mm', q: 1200, r: 184 },
            { i: 'Mounting Plate 6mm', q: 600, r: 92 },
            { i: 'Bushing OD 18mm', q: 300, r: 48 },
            { i: 'M12 Bolts (set)',  q: 80,  r: 220 },
          ].map((it, i, a) => (
            <View key={it.i} style={{ padding: spacing.lg, borderBottomWidth: i !== a.length - 1 ? 1 : 0, borderBottomColor: colors.divider }}>
              <Text style={typography.body}>{it.i}</Text>
              <Text style={typography.small}>{it.q} pcs × ₹{it.r} = ₹{(it.q * it.r).toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </Card>

        <SectionTitle title="Revision history" />
        <Card>
          {[
            { d: '20 Apr', a: 'Created by A. Kapoor' },
            { d: '21 Apr', a: 'Sent to client (email)' },
            { d: '21 Apr', a: 'Client requested 5% discount' },
          ].map((h) => (
            <View key={h.d} style={{ paddingVertical: 6 }}>
              <Text style={typography.body}>{h.a}</Text>
              <Text style={typography.small}>{h.d}</Text>
            </View>
          ))}
        </Card>

        <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
          <Button label="Download PDF" variant="secondary" style={{ flex: 1, marginRight: 10 }} />
          <Button label="Convert to Order" style={{ flex: 1 }} onPress={() => push('Orders')} />
        </View>
      </ScrollView>
    </View>
  );
};
