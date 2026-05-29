import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Badge, Button, Card, Divider, Row, SectionTitle } from '../components/UI';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, spacing, typography } from '../theme';

type Line = { item: string; qty: string; rate: string };
type CatRow = { id: number; category: string; item: string; qty: string; rate: string };

const CATEGORIES = ['Steel & Metals', 'Machinery Parts', 'Industrial Equipment', 'Hardware Tools', 'Electrical Components'];
const PRODUCTS: Record<string, string[]> = {
  'Steel & Metals': ['SS Seamless Pipe 2"', 'MS Round Bar 16mm', 'GI Sheet 0.5mm', 'Structural Angle 50x50'],
  'Machinery Parts': ['CNC Bracket 220mm', 'Bearing 6205', 'Hydraulic Pump', 'Gear Shaft'],
  'Industrial Equipment': ['Welding Rod E6013', 'Air Compressor', 'Industrial Hinge', 'Mounting Plate'],
  'Hardware Tools': ['Hex Bolt M16', 'Allen Key Set', 'Iron Sheet 4×8', 'Nut & Bolt Kit'],
  'Electrical Components': ['PVC Pipe 4"', 'Copper Wire 2.5mm', 'MCB 32A', 'Panel Board'],
};
const PAYMENT_TERMS = ['Advance', '50% Advance', 'COD', 'Net 30', 'Net 60', 'Letter of Credit'];
const CLIENTS = ['Tata Forge Ltd.', 'Rajesh Textiles', 'GlobalMart Industries', 'Patel Enterprises', 'Modi Steel Works', 'Bharat Manufacturing'];

const QUOTE_META: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  category: { label: 'Category Wise',   color: colors.primary,  bg: '#EFF6FF', desc: 'Quote for all products in a selected category' },
  client:   { label: 'Client Wise',     color: colors.success,  bg: '#F0FDF4', desc: 'Custom quotation tailored to a specific client' },
  multi:    { label: 'Multi Category',  color: '#7C3AED',        bg: '#F5F3FF', desc: 'Combined quotation across multiple categories'  },
  global:   { label: 'Global Quote',    color: '#D97706',        bg: '#FFFBEB', desc: 'Universal pricing applied to all categories'   },
};

// ── Reusable Field ─────────────────────────────────────────────────────────
const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; keyboardType?: 'default' | 'numeric'; multiline?: boolean; placeholder?: string }> =
  ({ label, value, onChange, keyboardType = 'default', multiline, placeholder }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={fS.lbl}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} keyboardType={keyboardType} multiline={multiline}
        placeholder={placeholder} placeholderTextColor={colors.textSubtle}
        style={[fS.input, multiline && { minHeight: 64, textAlignVertical: 'top' }]} />
    </View>
  );

// ── Category Quote Screen ──────────────────────────────────────────────────
const CategoryQuoteForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { pop } = useNav();
  const [category, setCategory] = useState('');
  const [client, setClient] = useState('');
  const [validity, setValidity] = useState('30');
  const [discount, setDiscount] = useState('2');
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setShowCatPicker(false);
    const prods = PRODUCTS[cat] || [];
    setLines(prods.slice(0, 3).map(p => ({ item: p, qty: '500', rate: '' })));
  };

  const updLine = (i: number, k: keyof Line, v: string) =>
    setLines(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  const addLine = () => setLines(ls => [...ls, { item: '', qty: '', rate: '' }]);
  const removeLine = (i: number) => setLines(ls => ls.filter((_, idx) => idx !== i));

  const subtotal = lines.reduce((a, l) => a + Number(l.qty || 0) * Number(l.rate || 0), 0);
  const tax = subtotal * 0.18;
  const disc = subtotal * (Number(discount || 0) / 100);
  const total = subtotal + tax - disc + 4500 + 1800;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
      <Card style={{ borderRadius: radius.xl }}>
        <Text style={[typography.h3, { marginBottom: 16 }]}>Category selection</Text>
        <TouchableOpacity style={[fS.input, { justifyContent: 'center', height: 48, marginBottom: 16 }]} onPress={() => setShowCatPicker(true)}>
          <Text style={{ color: category ? colors.text : colors.textSubtle, fontSize: 13, fontWeight: category ? '700' : '400' }}>
            {category || 'Tap to select category…'}
          </Text>
        </TouchableOpacity>
        <Field label="Client name" value={client} onChange={setClient} placeholder="Who is this quote for?" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="Validity (days)" value={validity} onChange={setValidity} keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="Discount %" value={discount} onChange={setDiscount} keyboardType="numeric" /></View>
        </View>
      </Card>

      {/* Category picker modal */}
      <Modal visible={showCatPicker} transparent animationType="slide" onRequestClose={() => setShowCatPicker(false)}>
        <Pressable style={pS.overlay} onPress={() => setShowCatPicker(false)}>
          <Pressable style={pS.sheet} onPress={() => {}}>
            <View style={pS.handle} />
            <Text style={pS.title}>Select Category</Text>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[pS.item, category === c && pS.itemActive]} onPress={() => selectCategory(c)}>
                <Text style={[pS.itemText, category === c && pS.itemTextActive]}>{c}</Text>
                {category === c && <Text style={{ color: colors.primary, fontWeight: '900' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {category !== '' && (
        <>
          <SectionTitle title={`Products — ${category}`} action="+ Add item" onAction={addLine} />
          {lines.map((l, i) => (
            <Card key={i} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={[typography.small, { color: colors.textMuted }]}>ITEM {i + 1}</Text>
                {lines.length > 1 && (
                  <TouchableOpacity onPress={() => removeLine(i)}>
                    <Text style={{ color: colors.danger, fontSize: 18, fontWeight: '800' }}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Field label="Product" value={l.item} onChange={v => updLine(i, 'item', v)} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}><Field label="Quantity" value={l.qty} onChange={v => updLine(i, 'qty', v)} keyboardType="numeric" /></View>
                <View style={{ flex: 1 }}><Field label="Unit price ₹" value={l.rate} onChange={v => updLine(i, 'rate', v)} keyboardType="numeric" /></View>
              </View>
              <Text style={[typography.small, { textAlign: 'right', color: colors.textMuted }]}>
                Line total: ₹{(Number(l.qty || 0) * Number(l.rate || 0)).toLocaleString('en-IN')}
              </Text>
            </Card>
          ))}

          <SectionTitle title="Summary" />
          <Card style={{ borderRadius: radius.xl }}>
            <Row label="Sub-total"   value={`₹${subtotal.toLocaleString('en-IN')}`} />
            <Row label="GST (18%)"   value={`₹${tax.toFixed(0)}`} />
            <Row label="Transport"   value="₹4,500" />
            <Row label="Packaging"   value="₹1,800" />
            <Row label={`Discount (${discount}%)`} value={`− ₹${disc.toFixed(0)}`} />
            <Divider />
            <Row label="Grand total" value={`₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} bold />
          </Card>

          <SectionTitle title="Terms & notes" />
          <Card style={{ borderRadius: radius.xl }}>
            <Field label="Notes" value={`Category-wide quote for ${category}. Valid for ${validity} days.`} onChange={() => {}} multiline />
          </Card>
        </>
      )}

      <View style={{ marginTop: spacing.xl, gap: 12 }}>
        <Button label="Send Quote" style={{ height: 54 }} onPress={onDone} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label="Save Draft" variant="secondary" style={{ flex: 1 }} onPress={pop} />
          <Button label="Cancel" variant="secondary" style={{ flex: 1 }} onPress={pop} />
        </View>
      </View>
    </ScrollView>
  );
};

// ── Client Wise Quote Screen ───────────────────────────────────────────────
const ClientQuoteForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { pop } = useNav();
  const [client, setClient] = useState('');
  const [contact, setContact] = useState('');
  const [validity, setValidity] = useState('7');
  const [buffer, setBuffer] = useState('10');
  const [discount, setDiscount] = useState('2');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ item: '', qty: '', rate: '' }]);

  const updLine = (i: number, k: keyof Line, v: string) =>
    setLines(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  const addLine = () => setLines(ls => [...ls, { item: '', qty: '', rate: '' }]);

  const subtotal = lines.reduce((a, l) => a + Number(l.qty || 0) * Number(l.rate || 0), 0);
  const tax = subtotal * 0.18;
  const disc = subtotal * (Number(discount || 0) / 100);
  const total = subtotal + tax - disc + 4500 + 1800;
  const margin = subtotal === 0 ? 0 : ((subtotal - subtotal * 0.78) / subtotal) * 100;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
      <Card style={{ borderRadius: radius.xl }}>
        <Text style={[typography.h3, { marginBottom: 16 }]}>Client details</Text>
        <TouchableOpacity style={[fS.input, { justifyContent: 'center', height: 48, marginBottom: 16 }]} onPress={() => setShowClientPicker(true)}>
          <Text style={{ color: client ? colors.text : colors.textSubtle, fontSize: 13, fontWeight: client ? '700' : '400' }}>
            {client || 'Tap to select client…'}
          </Text>
        </TouchableOpacity>
        {client !== '' && (
          <View style={{ padding: 12, backgroundColor: '#F0FDF4', borderRadius: radius.md, marginBottom: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.success, marginBottom: 6, letterSpacing: 0.5 }}>CLIENT HISTORY</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[['Orders', '42'], ['Value', '₹8.4L'], ['On-time', '94%']].map(([l, v]) => (
                <View key={l} style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>{v}</Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted }}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <Field label="Contact" value={contact} onChange={setContact} placeholder="+91 98765 43210" keyboardType="numeric" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Field label="Validity (days)" value={validity} onChange={setValidity} keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="Neg. Buffer %" value={buffer} onChange={setBuffer} keyboardType="numeric" /></View>
        </View>
      </Card>

      {/* Client picker */}
      <Modal visible={showClientPicker} transparent animationType="slide" onRequestClose={() => setShowClientPicker(false)}>
        <Pressable style={pS.overlay} onPress={() => setShowClientPicker(false)}>
          <Pressable style={pS.sheet} onPress={() => {}}>
            <View style={pS.handle} />
            <Text style={pS.title}>Select Client</Text>
            {CLIENTS.map(c => (
              <TouchableOpacity key={c} style={[pS.item, client === c && pS.itemActive]} onPress={() => { setClient(c); setShowClientPicker(false); }}>
                <Text style={[pS.itemText, client === c && pS.itemTextActive]}>{c}</Text>
                {client === c && <Text style={{ color: colors.success, fontWeight: '900' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <SectionTitle title="Line items" action="+ Add item" onAction={addLine} />
      {lines.map((l, i) => (
        <Card key={i} style={{ marginBottom: 10 }}>
          <Field label="Product" value={l.item} onChange={v => updLine(i, 'item', v)} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}><Field label="Quantity" value={l.qty} onChange={v => updLine(i, 'qty', v)} keyboardType="numeric" /></View>
            <View style={{ flex: 1 }}><Field label="Unit price ₹" value={l.rate} onChange={v => updLine(i, 'rate', v)} keyboardType="numeric" /></View>
          </View>
          <Text style={[typography.small, { textAlign: 'right', color: colors.textMuted }]}>
            Line total: ₹{(Number(l.qty || 0) * Number(l.rate || 0)).toLocaleString('en-IN')}
          </Text>
        </Card>
      ))}

      <SectionTitle title="Pricing" />
      <Card style={{ borderRadius: radius.xl }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Field label="Discount %" value={discount} onChange={setDiscount} keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="GST %" value="18" onChange={() => {}} keyboardType="numeric" /></View>
        </View>
        <Row label="Sub-total"   value={`₹${subtotal.toLocaleString('en-IN')}`} />
        <Row label="GST (18%)"   value={`₹${tax.toFixed(0)}`} />
        <Row label="Transport"   value="₹4,500" />
        <Row label="Packaging"   value="₹1,800" />
        <Row label="Discount"    value={`− ₹${disc.toFixed(0)}`} />
        <Divider />
        <Row label="Grand total" value={`₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} bold />
      </Card>

      <SectionTitle title="Smart insights" subtitle="Powered by your data" />
      <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.accent, borderRadius: radius.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={typography.h3}>Margin</Text>
            <Text style={typography.small}>Est. cost basis: ₹{(subtotal * 0.78).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
          </View>
          <Badge text={`${margin.toFixed(1)} %`} tone={margin >= 18 ? 'success' : margin >= 12 ? 'warning' : 'danger'} />
        </View>
        <Divider />
        <Text style={typography.small}>💡 Negotiation buffer: {buffer}% — floor price ₹{subtotal > 0 ? (subtotal * (1 - Number(buffer) / 100)).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—'}</Text>
      </Card>

      <SectionTitle title="Terms & notes" />
      <Card style={{ borderRadius: radius.xl }}>
        <Field label="Terms" value={`Payment 50% advance, 50% before dispatch.\nValidity ${validity} days from issue.`} onChange={() => {}} multiline />
      </Card>

      <View style={{ marginTop: spacing.xl, gap: 12 }}>
        <Button label="Send Quote" style={{ height: 54 }} onPress={onDone} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label="Save Draft" variant="secondary" style={{ flex: 1 }} onPress={pop} />
          <Button label="Cancel" variant="secondary" style={{ flex: 1 }} onPress={pop} />
        </View>
      </View>
    </ScrollView>
  );
};

// ── Multi-Category Quote Screen ────────────────────────────────────────────
const MultiCategoryForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { pop } = useNav();
  const [client, setClient] = useState('');
  const [discount, setDiscount] = useState('2');
  const [catRows, setCatRows] = useState<CatRow[]>([
    { id: 1, category: '', item: '', qty: '500', rate: '' },
  ]);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState<number | null>(null);

  const addRow = () => setCatRows(p => [...p, { id: Date.now(), category: '', item: '', qty: '', rate: '' }]);
  const removeRow = (id: number) => setCatRows(p => p.filter(r => r.id !== id));
  const updRow = (id: number, k: keyof CatRow, v: string) =>
    setCatRows(p => p.map(r => r.id === id ? { ...r, [k]: v } : r));
  const selectCat = (id: number, cat: string) => { updRow(id, 'category', cat); setShowCatPicker(null); };

  const subtotal = catRows.reduce((a, r) => a + Number(r.qty || 0) * Number(r.rate || 0), 0);
  const tax = subtotal * 0.18;
  const disc = subtotal * (Number(discount || 0) / 100);
  const total = subtotal + tax - disc + 4500 + 1800;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
      <Card style={{ borderRadius: radius.xl }}>
        <Text style={[typography.h3, { marginBottom: 16 }]}>Client & settings</Text>
        <TouchableOpacity style={[fS.input, { justifyContent: 'center', height: 48, marginBottom: 16 }]} onPress={() => setShowClientPicker(true)}>
          <Text style={{ color: client ? colors.text : colors.textSubtle, fontSize: 13, fontWeight: client ? '700' : '400' }}>
            {client || 'Tap to select client…'}
          </Text>
        </TouchableOpacity>
        <Field label="Overall Discount %" value={discount} onChange={setDiscount} keyboardType="numeric" />
      </Card>

      <Modal visible={showClientPicker} transparent animationType="slide" onRequestClose={() => setShowClientPicker(false)}>
        <Pressable style={pS.overlay} onPress={() => setShowClientPicker(false)}>
          <Pressable style={pS.sheet} onPress={() => {}}>
            <View style={pS.handle} /><Text style={pS.title}>Select Client</Text>
            {CLIENTS.map(c => (
              <TouchableOpacity key={c} style={[pS.item, client === c && pS.itemActive]} onPress={() => { setClient(c); setShowClientPicker(false); }}>
                <Text style={[pS.itemText, client === c && pS.itemTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <SectionTitle title={`Categories (${catRows.length})`} action={catRows.length < 5 ? '+ Add' : undefined} onAction={addRow} />
      {catRows.map((row, idx) => (
        <Card key={row.id} style={{ marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#7C3AED', borderRadius: radius.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#7C3AED', letterSpacing: 0.5 }}>CATEGORY {idx + 1}</Text>
            {catRows.length > 1 && (
              <TouchableOpacity onPress={() => removeRow(row.id)} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.danger, fontSize: 16, fontWeight: '800' }}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={[fS.input, { justifyContent: 'center', height: 48, marginBottom: 16 }]} onPress={() => setShowCatPicker(row.id)}>
            <Text style={{ color: row.category ? colors.text : colors.textSubtle, fontSize: 13, fontWeight: row.category ? '700' : '400' }}>
              {row.category || 'Select category…'}
            </Text>
          </TouchableOpacity>
          <Field label="Product / Item" value={row.item} onChange={v => updRow(row.id, 'item', v)} placeholder="Any product in this category" />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
            <View style={{ flex: 1 }}><Field label="Quantity" value={row.qty} onChange={v => updRow(row.id, 'qty', v)} keyboardType="numeric" /></View>
            <View style={{ flex: 1 }}><Field label="Unit price ₹" value={row.rate} onChange={v => updRow(row.id, 'rate', v)} keyboardType="numeric" /></View>
          </View>
          <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
            <Text style={{ fontSize: 14, color: '#7C3AED', fontWeight: '800' }}>
              ₹{(Number(row.qty || 0) * Number(row.rate || 0)).toLocaleString('en-IN')}
            </Text>
          </View>
        </Card>
      ))}

      <Modal visible={showCatPicker !== null} transparent animationType="slide" onRequestClose={() => setShowCatPicker(null)}>
        <Pressable style={pS.overlay} onPress={() => setShowCatPicker(null)}>
          <Pressable style={pS.sheet} onPress={() => {}}>
            <View style={pS.handle} /><Text style={pS.title}>Select Category</Text>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={pS.item} onPress={() => showCatPicker !== null && selectCat(showCatPicker, c)}>
                <Text style={pS.itemText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {subtotal > 0 && (
        <>
          <SectionTitle title="Summary" />
          <Card style={{ borderRadius: radius.xl }}>
            <Row label="Sub-total" value={`₹${subtotal.toLocaleString('en-IN')}`} />
            <Row label="GST (18%)" value={`₹${tax.toFixed(0)}`} />
            <Row label="Transport" value="₹4,500" />
            <Row label="Packaging" value="₹1,800" />
            <Row label={`Discount (${discount}%)`} value={`− ₹${disc.toFixed(0)}`} />
            <Divider />
            <Row label="Grand total" value={`₹${total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} bold />
          </Card>
        </>
      )}

      <SectionTitle title="Notes" />
      <Card style={{ borderRadius: radius.xl }}>
        <Field label="Combined quotation notes" value="" onChange={() => {}} multiline placeholder="Special requirements across all categories…" />
      </Card>

      <View style={{ marginTop: spacing.xl, gap: 12 }}>
        <Button label="Send Quote" style={{ height: 54 }} onPress={onDone} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label="Save Draft" variant="secondary" style={{ flex: 1 }} onPress={pop} />
          <Button label="Cancel" variant="secondary" style={{ flex: 1 }} onPress={pop} />
        </View>
      </View>
    </ScrollView>
  );
};

// ── Global Quote Screen ────────────────────────────────────────────────────
const GlobalQuoteForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { pop } = useNav();
  const [scope, setScope] = useState<'all' | 'specific'>('all');
  const [client, setClient] = useState('');
  const [markup, setMarkup] = useState('15');
  const [validity, setValidity] = useState('30');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [tiers, setTiers] = useState([
    { min: '1', max: '99', price: '' },
    { min: '100', max: '499', price: '' },
    { min: '500', max: '', price: '' },
  ]);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const updTier = (i: number, k: string, v: string) =>
    setTiers(p => p.map((t, idx) => idx === i ? { ...t, [k]: v } : t));

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      {/* Info banner */}
      <View style={{ padding: 14, backgroundColor: '#FFFBEB', borderRadius: radius.md, borderWidth: 1, borderColor: '#FDE68A', marginBottom: 16, flexDirection: 'row', gap: 10 }}>
        <Text style={{ fontSize: 20 }}>🌐</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 3 }}>Global Quote — Universal Pricing</Text>
          <Text style={{ fontSize: 12, color: '#78350F', lineHeight: 18 }}>Sets universal pricing rules across ALL product categories. Eligible clients or all active clients will receive this automatically.</Text>
        </View>
      </View>

      <Card style={{ borderRadius: radius.xl }}>
        <Text style={[typography.h3, { marginBottom: 16 }]}>Scope & settings</Text>
        {/* Scope toggle */}
        <View style={{ flexDirection: 'row', marginBottom: 12, backgroundColor: '#F1F5F9', borderRadius: radius.md, padding: 4 }}>
          {(['all', 'specific'] as const).map(s => (
            <TouchableOpacity key={s} style={[{ flex: 1, padding: 10, borderRadius: radius.sm, alignItems: 'center' }, scope === s && { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 }]} onPress={() => setScope(s)}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: scope === s ? colors.text : colors.textMuted }}>
                {s === 'all' ? 'All clients' : 'Specific client'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {scope === 'specific' && (
          <>
            <TouchableOpacity style={[fS.input, { justifyContent: 'center', height: 48, marginBottom: 16 }]} onPress={() => setShowClientPicker(true)}>
              <Text style={{ color: client ? colors.text : colors.textSubtle, fontSize: 13, fontWeight: client ? '700' : '400' }}>
                {client || 'Tap to select client…'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><Field label="Universal Markup % *" value={markup} onChange={setMarkup} keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Field label="Validity (days)" value={validity} onChange={setValidity} keyboardType="numeric" /></View>
        </View>
        {/* Auto dispatch toggle */}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }} onPress={() => setAutoDispatch(p => !p)}>
          <View style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: autoDispatch ? colors.primary : '#CBD5E1', justifyContent: 'center', paddingHorizontal: 2 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', alignSelf: autoDispatch ? 'flex-end' : 'flex-start' }} />
          </View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>Auto-dispatch to eligible factories</Text>
        </TouchableOpacity>
      </Card>

      <Modal visible={showClientPicker} transparent animationType="slide" onRequestClose={() => setShowClientPicker(false)}>
        <Pressable style={pS.overlay} onPress={() => setShowClientPicker(false)}>
          <Pressable style={pS.sheet} onPress={() => {}}>
            <View style={pS.handle} /><Text style={pS.title}>Select Client</Text>
            {CLIENTS.map(c => (
              <TouchableOpacity key={c} style={[pS.item, client === c && pS.itemActive]} onPress={() => { setClient(c); setShowClientPicker(false); }}>
                <Text style={[pS.itemText, client === c && pS.itemTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <SectionTitle title="Bulk Tier Pricing" subtitle="Applied universally across all categories" />
      <Card style={{ borderRadius: radius.xl }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          {['Min Qty', 'Max Qty', 'Price ₹/unit'].map(h => (
            <Text key={h} style={{ flex: 1, fontSize: 10, fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</Text>
          ))}
        </View>
        {tiers.map((t, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput value={t.min} onChangeText={v => updTier(i, 'min', v)} keyboardType="numeric" style={[fS.input, { flex: 1, marginBottom: 0 }]} placeholderTextColor={colors.textSubtle} />
            <TextInput value={t.max} onChangeText={v => updTier(i, 'max', v)} keyboardType="numeric" placeholder={i === tiers.length - 1 ? '∞' : 'Max'} placeholderTextColor={colors.textSubtle} style={[fS.input, { flex: 1, marginBottom: 0 }]} />
            <TextInput value={t.price} onChangeText={v => updTier(i, 'price', v)} keyboardType="numeric" placeholder="₹/unit" placeholderTextColor={colors.textSubtle} style={[fS.input, { flex: 1, marginBottom: 0 }]} />
          </View>
        ))}
      </Card>

      <SectionTitle title="Terms & notes" />
      <Card style={{ borderRadius: radius.xl }}>
        <Field label="Global notes & exclusions" value="" onChange={() => {}} multiline placeholder="Special conditions, excluded categories, validity conditions…" />
      </Card>

      <View style={{ marginTop: spacing.xl, gap: 12 }}>
        <Button label={autoDispatch ? 'Create & Dispatch' : 'Create Quote'} style={{ height: 54 }} onPress={onDone} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label="Save Draft" variant="secondary" style={{ flex: 1 }} onPress={pop} />
          <Button label="Cancel" variant="secondary" style={{ flex: 1 }} onPress={pop} />
        </View>
      </View>
    </ScrollView>
  );
};

// ── Success Overlay ────────────────────────────────────────────────────────
const SuccessView: React.FC<{ quoteType: string; onClose: () => void }> = ({ quoteType, onClose }) => {
  const meta = QUOTE_META[quoteType] || QUOTE_META.client;
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 36 }}>✓</Text>
      </View>
      <Text style={{ fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 8 }}>Quote Sent!</Text>
      <Badge text={meta.label} tone="success" style={{ marginBottom: 16 }} />
      <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 32, lineHeight: 20 }}>
        Your {meta.label} has been created and dispatched. Responses will arrive within 24–48 hours.
      </Text>
      <Button label="View Quotations" onPress={onClose} full />
    </View>
  );
};

// ── Main Export ────────────────────────────────────────────────────────────
export const QuotationCreateScreen: React.FC<{ params?: { quoteType?: string } }> = ({ params }) => {
  const { pop } = useNav();
  const quoteType = params?.quoteType ?? 'client';
  const meta = QUOTE_META[quoteType] || QUOTE_META.client;
  const [done, setDone] = useState(false);

  if (done) {
    return <SuccessView quoteType={quoteType} onClose={pop} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Create Quotation"
        subtitle={meta.label}
        showBack
        onBack={pop}
      />
      {/* Type badge strip */}
      <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12, backgroundColor: meta.bg, borderBottomWidth: 1, borderBottomColor: meta.color + '20' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: meta.color, marginRight: 8 }} />
          <Text style={{ fontSize: 14, fontWeight: '800', color: meta.color }}>{meta.label}</Text>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginLeft: 6 }}>· {meta.desc}</Text>
        </View>
      </View>

      {quoteType === 'category' && <CategoryQuoteForm onDone={() => setDone(true)} />}
      {quoteType === 'client'   && <ClientQuoteForm   onDone={() => setDone(true)} />}
      {quoteType === 'multi'    && <MultiCategoryForm  onDone={() => setDone(true)} />}
      {quoteType === 'global'   && <GlobalQuoteForm    onDone={() => setDone(true)} />}
    </View>
  );
};

// ── Shared styles ──────────────────────────────────────────────────────────
const fS = StyleSheet.create({
  lbl: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6, letterSpacing: 0.2 },
  input: {
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: colors.text, fontWeight: '500', marginBottom: 12,
  },
});

const pS = StyleSheet.create({
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  handle:       { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title:        { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 16 },
  item:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemActive:   { backgroundColor: '#F0FDF4', borderRadius: radius.sm, paddingHorizontal: 8 },
  itemText:     { fontSize: 14, fontWeight: '600', color: colors.text },
  itemTextActive: { color: colors.primary, fontWeight: '800' },
});

const styles = StyleSheet.create({});


