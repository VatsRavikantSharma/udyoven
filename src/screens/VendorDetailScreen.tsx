import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge, BarChart, Button, Card, Divider, Row, SectionTitle, Sparkline } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { vendors } from '../data/mockData';
import { colors, radius, spacing, typography } from '../theme';

export const VendorDetailScreen: React.FC<{ params?: any }> = ({ params }) => {
  const v = params || vendors[0];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={v.name} subtitle={`${v.category} · ${v.city}`} rightIcon="↗" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.avatar]}><Text style={styles.avatarText}>{v.name.split(' ').map((s: string) => s[0]).slice(0, 2).join('')}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={typography.h2}>{v.name}</Text>
              <Text style={typography.small}>{v.item} · GST 27ABCDE1234F1Z5</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Badge text={`★ ${v.rating}`} tone="warning" />
                <View style={{ width: 6 }} />
                <Badge text="APPROVED" tone="success" />
                <View style={{ width: 6 }} />
                <Badge text={v.status} tone={v.status === 'Active' ? 'primary' : 'steel'} />
              </View>
            </View>
          </View>
          <Divider />
          <Row label="Contact" value="Mr. R. Saxena · +91 90232 11234" />
          <Row label="Email" value={`ops@${v.name.split(' ')[0].toLowerCase()}.com`} />
          <Row label="Payment terms" value="30 days net" />
          <Row label="Lead time" value={`${v.leadTime} days avg`} />
          <Row label="Pending orders" value={`${v.pendingOrders}`} />
          <Row label="Payment status" value={v.payment} />
        </Card>

        <SectionTitle title="Performance scorecard" />
        <Card>
          <Row label="On-time delivery"  value={`${v.reliability}%`} bold />
          <Row label="Quality acceptance" value="97.2%" />
          <Row label="Pricing competitiveness" value="Good" />
          <Row label="Responsiveness" value="Excellent" />
          <Divider />
          <Text style={[typography.small, { marginBottom: 6 }]}>12-month delivery consistency</Text>
          <BarChart data={[88, 90, 92, 89, 94, 91, 96, 95, 93, 90, 92, 94]} color={colors.accent} />
        </Card>

        <SectionTitle title="Quality issues" />
        <Card>
          <Sparkline data={[2, 1, 3, 1, 0, 2, 1, 2, 1, 0, 1, 0]} color={colors.danger} />
          <Text style={[typography.small, { marginTop: 8 }]}>Reject rate trending down · current 0.6%</Text>
        </Card>

        <SectionTitle title="Order history" />
        {[
          { id: 'PO-1051', d: '21 Apr', a: '₹78,000', s: 'In Transit' },
          { id: 'PO-1042', d: '02 Apr', a: '₹62,000', s: 'Received' },
          { id: 'PO-1031', d: '18 Mar', a: '₹84,000', s: 'Received' },
          { id: 'PO-1019', d: '01 Mar', a: '₹56,400', s: 'Received' },
        ].map((p) => (
          <Card key={p.id} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={typography.body}>{p.id} · {p.d}</Text>
              <Text style={typography.body}>{p.a}</Text>
            </View>
            <Badge text={p.s} tone={p.s === 'Received' ? 'success' : 'info'} style={{ marginTop: 8 }} />
          </Card>
        ))}

        <SectionTitle title="Documents" />
        <Card>
          {['Vendor Agreement.pdf', 'GST Certificate.pdf', 'MSME Certificate.pdf', 'Quality ISO 9001.pdf'].map((d) => (
            <Row key={d} label={`📎 ${d}`} value="Download" />
          ))}
        </Card>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.lg }}>
          <Button label="Send RFQ"     full style={{ flex: 1, marginRight: 8 }} />
          <Button label="Create PO"    variant="secondary" full style={{ flex: 1, marginRight: 8 }} />
          <Button label="Call vendor"  variant="ghost" full style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 60, height: 60, borderRadius: radius.lg,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 18 },
});
