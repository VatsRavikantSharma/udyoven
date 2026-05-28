import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

type Line = { item: string; qty: string; rate: string };

export const QuotationCreateScreen: React.FC = () => {
  const { pop } = useNav();
  const [client, setClient] = useState('Tata Forge Ltd.');
  const [contact, setContact] = useState('+91 98765 43210');
  const [validity, setValidity] = useState('30 Apr 2026');
  const [discount, setDiscount] = useState('2');
  const [lines, setLines] = useState<Line[]>([
    { item: 'CNC Bracket 220mm', qty: '1200', rate: '184' },
    { item: 'Mounting Plate 6mm', qty: '600', rate: '92' },
  ]);

  const subtotal = lines.reduce((a, l) => a + Number(l.qty || 0) * Number(l.rate || 0), 0);
  const tax = subtotal * 0.18;
  const transport = 4500;
  const packing = 1800;
  const disc = subtotal * (Number(discount || 0) / 100);
  const total = subtotal + tax + transport + packing - disc;
  const cost = subtotal * 0.78;
  const margin = subtotal === 0 ? 0 : ((subtotal - cost) / subtotal) * 100;

  const updateLine = (i: number, k: keyof Line, v: string) => {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));
  };
  const addLine = () => setLines((ls) => [...ls, { item: '', qty: '', rate: '' }]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Create Quotation" subtitle="Q-2047 · Draft" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        <Card>
          <Text style={typography.h3}>Client details</Text>
          <Field label="Client name" value={client} onChange={setClient} />
          <Field label="Contact" value={contact} onChange={setContact} />
          <Field label="Validity" value={validity} onChange={setValidity} />
        </Card>

        <SectionTitle title="Line items" action="+ Add item" onAction={addLine} />
        {lines.map((l, i) => (
          <Card key={i} style={{ marginBottom: 10 }}>
            <Field label="Product" value={l.item} onChange={(v) => updateLine(i, 'item', v)} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Field label="Quantity" value={l.qty} onChange={(v) => updateLine(i, 'qty', v)} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Unit price ₹" value={l.rate} onChange={(v) => updateLine(i, 'rate', v)} keyboardType="numeric" />
              </View>
            </View>
            <Text style={[typography.small, { textAlign: 'right' }]}>
              Line total: ₹{(Number(l.qty || 0) * Number(l.rate || 0)).toLocaleString('en-IN')}
            </Text>
          </Card>
        ))}

        <SectionTitle title="Charges" />
        <Card>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Field label="Discount %" value={discount} onChange={setDiscount} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Tax %" value="18" onChange={() => {}} keyboardType="numeric" />
            </View>
          </View>
          <Row label="Sub-total"  value={`₹${subtotal.toLocaleString('en-IN')}`} />
          <Row label="GST (18%)"  value={`₹${tax.toFixed(0)}`} />
          <Row label="Transport"  value={`₹${transport}`} />
          <Row label="Packaging"  value={`₹${packing}`} />
          <Row label="Discount"   value={`− ₹${disc.toFixed(0)}`} />
          <Divider />
          <Row label="Grand total" value={`₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} bold />
        </Card>

        <SectionTitle title="Smart insights" subtitle="Powered by your data" />
        <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.accent }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={typography.h3}>Margin</Text>
              <Text style={typography.small}>Cost basis ₹{cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
            </View>
            <Badge
              text={`${margin.toFixed(1)} %`}
              tone={margin >= 18 ? 'success' : margin >= 12 ? 'warning' : 'danger'}
            />
          </View>
          <Divider />
          <Text style={typography.small}>💡 Suggested price band ₹178 – ₹196 / pc based on similar orders.</Text>
          <Text style={[typography.small, { marginTop: 6 }]}>📈 This client placed 4 orders avg ₹2.1 L · 92% on-time payment.</Text>
        </Card>

        <SectionTitle title="Terms & notes" />
        <Card>
          <Field label="Terms & conditions" value={'Payment 50% advance, 50% before dispatch.\nValidity 7 days from issue.'} onChange={() => {}} multiline />
          <Field label="Notes" value="Galvanized finish, wooden pallet packing." onChange={() => {}} multiline />
        </Card>

        <View style={{ flexDirection: 'row', marginTop: spacing.lg }}>
          <Button label="Save Draft" variant="secondary" style={{ flex: 1, marginRight: 8 }} onPress={pop} />
          <Button label="Send for approval" variant="secondary" style={{ flex: 1, marginRight: 8 }} />
          <Button label="Send to client" style={{ flex: 1 }} onPress={pop} />
        </View>
        <Button label="Generate branded PDF" icon="📄" variant="ghost" full style={{ marginTop: 10 }} />
      </ScrollView>
    </View>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}> = ({ label, value, onChange, keyboardType = 'default', multiline }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={fStyles.lbl}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[fStyles.input, multiline && { minHeight: 64, textAlignVertical: 'top' }]}
      placeholderTextColor={colors.textSubtle}
    />
  </View>
);

const fStyles = StyleSheet.create({
  lbl: { fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 4, letterSpacing: 0.3 },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, color: colors.text, fontWeight: '600',
  },
});

const styles = StyleSheet.create({});
