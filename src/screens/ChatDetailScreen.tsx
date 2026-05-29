/**
 * NegotiationWorkspace — enterprise B2B deal negotiation screen.
 * Phase tabs · Quote summary panel · Smart action toolbar · Chat messages
 */
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chatMessages, deals, DEAL_PHASES, DealPhase, quotations } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, shadow, spacing } from '../theme';

// ── Drawn icons ───────────────────────────────────────────────────────────
const BackArrow = () => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 8, height: 8, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#fff', transform: [{ rotate: '45deg' }], marginLeft: 4 }} />
  </View>
);
const SendIcon = ({ active }: { active: boolean }) => (
  <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 0, height: 0, borderTopWidth: 8, borderBottomWidth: 8, borderLeftWidth: 14, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: active ? '#fff' : '#94A3B8' }} />
  </View>
);
const ChevronDown = ({ up = false }: { up?: boolean }) => (
  <View style={{ width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 7, height: 7, borderRightWidth: 2, borderBottomWidth: 2, borderColor: colors.textMuted, transform: [{ rotate: up ? '-135deg' : '45deg' }], marginTop: up ? 4 : -4 }} />
  </View>
);

// ── helpers ───────────────────────────────────────────────────────────────
const PALETTE = ['#1E3A8A', '#0D9488', '#7C3AED', '#F97316', '#DC2626', '#0EA5E9'];
const avatarBg = (name: string) => PALETTE[name.charCodeAt(0) % PALETTE.length];
const fmt = (n: number) => `Rs.${n.toLocaleString()}`;

// ── Phase tabs ────────────────────────────────────────────────────────────
const PhaseTabs: React.FC<{
  phases: DealPhase[];
  currentIndex: number;
  selected: number;
  onChange: (i: number) => void;
}> = ({ phases, currentIndex, selected, onChange }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border }}
    contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
  >
    {phases.map((phase, idx) => {
      const done   = idx < currentIndex;
      const active = idx === selected;
      const cur    = idx === currentIndex;
      return (
        <TouchableOpacity
          key={phase}
          onPress={() => onChange(idx)}
          activeOpacity={0.8}
          style={[
            ptStyles.chip,
            active && ptStyles.chipActive,
            cur && !active && ptStyles.chipCurrent,
            done && !active && ptStyles.chipDone,
          ]}
        >
          <View style={[ptStyles.dot, { backgroundColor: done ? colors.success : cur ? colors.primary : '#CBD5E1' }]} />
          <Text style={[ptStyles.label, active && ptStyles.labelActive, done && !active && ptStyles.labelDone]}>{phase}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);
const ptStyles = StyleSheet.create({
  chip:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F8FAFC', marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  chipActive:  { backgroundColor: colors.primary, borderColor: colors.primary },
  chipCurrent: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  chipDone:    { backgroundColor: '#F0FDF4' },
  dot:         { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  label:       { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  labelActive: { color: '#fff' },
  labelDone:   { color: colors.success },
});

// ── Quote panel ───────────────────────────────────────────────────────────
const QuotePanel: React.FC<{
  quotationId: string;
  collapsed: boolean;
  onToggle: () => void;
  onViewFull: () => void;
}> = ({ quotationId, collapsed, onToggle, onViewFull }) => {
  const q = quotations.find(x => x.id === quotationId) || quotations[0];
  const deal = deals.find(d => d.quotationId === quotationId);
  const subtotal = q.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const gst      = q.items.reduce((s, i) => s + i.qty * i.rate * i.gst / 100, 0);
  return (
    <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <TouchableOpacity style={qpS.row} onPress={onToggle} activeOpacity={0.85}>
        <View style={qpS.docBox}>
          {[18, 18, 10].map((w, i) => <View key={i} style={{ width: w, height: 2, backgroundColor: colors.primary, borderRadius: 1, marginVertical: 1.5 }} />)}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={qpS.qId}>{q.id} · Rev {q.rev} · {q.status}</Text>
          <Text style={qpS.qAmt}>{fmt(q.amount)}</Text>
        </View>
        {!collapsed && (
          <TouchableOpacity style={qpS.viewBtn} onPress={onViewFull}>
            <Text style={qpS.viewBtnTxt}>View Full</Text>
          </TouchableOpacity>
        )}
        <ChevronDown up={!collapsed} />
      </TouchableOpacity>
      {!collapsed && (
        <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
          {q.items.map((item, i) => (
            <View key={i} style={qpS.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={qpS.itemName} numberOfLines={1}>{item.product}</Text>
                <Text style={qpS.itemMeta}>{item.qty} {item.unit} × {fmt(item.rate)}</Text>
              </View>
              <Text style={qpS.itemTotal}>{fmt(item.qty * item.rate)}</Text>
            </View>
          ))}
          <View style={qpS.totals}>
            <View style={qpS.totalRow}><Text style={qpS.tLabel}>Subtotal</Text><Text style={qpS.tVal}>{fmt(subtotal)}</Text></View>
            <View style={qpS.totalRow}><Text style={qpS.tLabel}>GST</Text><Text style={qpS.tVal}>{fmt(gst)}</Text></View>
            <View style={[qpS.totalRow, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4, paddingTop: 6 }]}>
              <Text style={{ fontSize: 13, fontWeight: '900', color: colors.text }}>Total</Text>
              <Text style={{ fontSize: 15, fontWeight: '900', color: colors.primary }}>{fmt(q.amount)}</Text>
            </View>
          </View>
          {deal && (
            <View style={qpS.readRow}>
              <View style={[qpS.readPill, { backgroundColor: deal.paymentReady ? '#F0FDF4' : '#FFF7ED' }]}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: deal.paymentReady ? colors.success : '#C2410C' }}>
                  Payment {deal.paymentReady ? 'Ready' : 'Pending'}
                </Text>
              </View>
              <View style={[qpS.readPill, { backgroundColor: deal.deliveryReady ? '#F0FDF4' : '#FFF7ED' }]}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: deal.deliveryReady ? colors.success : '#C2410C' }}>
                  Delivery {deal.deliveryReady ? 'Ready' : 'Pending'}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
const qpS = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', padding: 12 },
  docBox:    { width: 32, height: 36, backgroundColor: '#EFF6FF', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  qId:       { fontSize: 12, fontWeight: '800', color: colors.primary },
  qAmt:      { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  viewBtn:   { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 8 },
  viewBtnTxt:{ fontSize: 11, fontWeight: '800', color: colors.primary },
  itemRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  itemName:  { fontSize: 12, fontWeight: '700', color: colors.text },
  itemMeta:  { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  itemTotal: { fontSize: 13, fontWeight: '800', color: colors.text },
  totals:    { paddingTop: 8, borderTopWidth: 2, borderTopColor: '#F1F5F9', marginTop: 4 },
  totalRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  tLabel:    { fontSize: 12, color: colors.textMuted },
  tVal:      { fontSize: 12, fontWeight: '700', color: colors.text },
  readRow:   { flexDirection: 'row', gap: 8, marginTop: 10 },
  readPill:  { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 8 },
});

// ── Actions sheet ─────────────────────────────────────────────────────────
const ACTIONS = [
  { label: 'Request Revision',         bg: '#EFF6FF', fg: colors.primary,  type: 'quote_change' },
  { label: 'Accept Quote',              bg: '#F0FDF4', fg: colors.success,  type: 'approval'     },
  { label: 'Counter Offer',             bg: '#F5F3FF', fg: '#7C3AED',       type: 'quote_change' },
  { label: 'Move to Next Phase',        bg: '#EFF6FF', fg: colors.primary,  type: 'phase_change' },
  { label: 'Finalize Deal',             bg: '#F0FDF4', fg: '#16A34A',       type: 'approval'     },
  { label: 'Confirm Payment Readiness', bg: '#FEFCE8', fg: '#CA8A04',       type: 'payment'      },
  { label: 'Lock Pricing',              bg: '#EFF6FF', fg: colors.primary,  type: 'approval'     },
  { label: 'Approve Terms',             bg: '#F0FDF4', fg: colors.success,  type: 'approval'     },
  { label: 'Reject Line Item',          bg: '#FFF1F2', fg: colors.danger,   type: 'rejection'    },
  { label: 'Generate Final PDF',        bg: '#F5F3FF', fg: '#7C3AED',       type: 'phase_change' },
];

const ActionsSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSelect: (label: string, type: string) => void;
}> = ({ visible, onClose, onSelect }) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={asS.overlay} onPress={onClose}>
      <Pressable style={asS.sheet} onPress={() => {}}>
        <View style={asS.handle} />
        <Text style={asS.title}>Smart Actions</Text>
        <View style={asS.grid}>
          {ACTIONS.map(a => (
            <TouchableOpacity
              key={a.label}
              style={[asS.btn, { backgroundColor: a.bg }]}
              onPress={() => { onSelect(a.label, a.type); onClose(); }}
              activeOpacity={0.85}
            >
              <Text style={[asS.btnText, { color: a.fg }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={{ alignItems: 'center', paddingTop: 16 }} onPress={onClose}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textMuted }}>Close</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);
const asS = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  handle:  { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  title:   { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 14 },
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn:     { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '800' },
});

// ── Message types ─────────────────────────────────────────────────────────
type Msg = {
  id: string; sender: 'me' | 'them'; text: string; time: string;
  type: 'text' | 'attachment' | 'quotation';
  attachmentName?: string; read: boolean;
  isAction?: boolean; actionLabel?: string; actionType?: string;
};

const Bubble: React.FC<{ msg: Msg }> = ({ msg }) => {
  const isMe = msg.sender === 'me';

  if (msg.isAction) {
    const c = msg.actionType === 'approval' ? { bg: '#F0FDF4', fg: colors.success }
      : msg.actionType === 'rejection' ? { bg: '#FFF1F2', fg: colors.danger }
      : msg.actionType === 'payment'   ? { bg: '#FEFCE8', fg: '#CA8A04' }
      : { bg: '#F5F3FF', fg: '#7C3AED' };
    return (
      <View style={[bS.wrap, isMe && bS.wrapMe]}>
        <View style={[bS.actionBubble, { backgroundColor: c.bg }]}>
          <Text style={[bS.actionLabel, { color: c.fg }]}>{msg.actionLabel}</Text>
          <Text style={[bS.actionBody, { color: c.fg + 'BB' }]}>{msg.text}</Text>
        </View>
        <Text style={[bS.time, isMe && { textAlign: 'right' }]}>{msg.time}</Text>
      </View>
    );
  }

  if (msg.type === 'quotation') return (
    <View style={[bS.wrap, isMe && bS.wrapMe]}>
      <View style={bS.qBubble}>
        <View style={bS.qTag}><Text style={bS.qTagTxt}>QUOTATION UPDATE</Text></View>
        <Text style={bS.qText}>{msg.text}</Text>
        <Text style={bS.qTap}>Tap to review full quote</Text>
      </View>
      <Text style={[bS.time, isMe && { textAlign: 'right' }]}>{msg.time}</Text>
    </View>
  );

  if (msg.type === 'attachment') return (
    <View style={[bS.wrap, isMe && bS.wrapMe]}>
      <View style={[bS.attachBubble, isMe && bS.attachBubbleMe]}>
        <View style={[bS.attachIcon, isMe && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <View style={{ width: 12, height: 16, borderWidth: 1.5, borderColor: isMe ? '#fff' : colors.primary, borderRadius: 2 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[bS.attachName, isMe && { color: '#fff' }]} numberOfLines={1}>{msg.attachmentName || 'Document'}</Text>
          <Text style={[bS.attachSub, isMe && { color: 'rgba(255,255,255,0.7)' }]}>Tap to open</Text>
        </View>
      </View>
      <Text style={[bS.time, isMe && { textAlign: 'right' }]}>{msg.time}</Text>
    </View>
  );

  return (
    <View style={[bS.wrap, isMe && bS.wrapMe]}>
      <View style={[bS.bubble, isMe ? bS.bubbleMe : bS.bubbleThem]}>
        <Text style={[bS.text, isMe && { color: '#fff' }]}>{msg.text}</Text>
      </View>
      <View style={[bS.meta, isMe && { justifyContent: 'flex-end' }]}>
        <Text style={bS.time}>{msg.time}</Text>
        {isMe && (
          <View style={{ flexDirection: 'row', marginLeft: 4 }}>
            {[0, 1].map(i => (
              <View key={i} style={{ width: 5, height: 9, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderColor: msg.read ? colors.primary : colors.textMuted, transform: [{ rotate: '45deg' }], marginLeft: i === 0 ? 4 : -3 }} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const bS = StyleSheet.create({
  wrap:         { marginBottom: 12, maxWidth: '80%', alignSelf: 'flex-start' },
  wrapMe:       { alignSelf: 'flex-end' },
  bubble:       { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderBottomLeftRadius: 4 },
  bubbleThem:   { backgroundColor: '#fff', ...shadow.soft },
  bubbleMe:     { backgroundColor: colors.primary, borderBottomLeftRadius: 18, borderBottomRightRadius: 4 },
  text:         { fontSize: 14, color: colors.text, lineHeight: 20 },
  meta:         { flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingHorizontal: 4 },
  time:         { fontSize: 10, color: colors.textMuted },
  attachBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 14 },
  attachBubbleMe: { backgroundColor: colors.primary + 'E0' },
  attachIcon:   { width: 32, height: 32, backgroundColor: '#DBEAFE', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  attachName:   { fontSize: 13, fontWeight: '700', color: colors.text },
  attachSub:    { fontSize: 11, color: colors.textMuted },
  qBubble:      { backgroundColor: colors.accent, borderRadius: 16, padding: 14 },
  qTag:         { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  qTagTxt:      { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 0.6 },
  qText:        { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 4 },
  qTap:         { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  actionBubble: { borderRadius: 14, padding: 12 },
  actionLabel:  { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  actionBody:   { fontSize: 13, fontWeight: '600', lineHeight: 18 },
});

// ── MAIN ──────────────────────────────────────────────────────────────────
export const ChatDetailScreen: React.FC<{ params?: any }> = ({ params }) => {
  const contact     = params?.contact     || 'Rajesh Kumar';
  const contactRole = params?.contactRole || 'Vendor';
  const productRef  = params?.productRef  || 'SS Pipe 2 inch';
  const quotationId = params?.quotationId || 'Q-1041';

  const { pop, push } = useNav();
  const insets  = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const deal = deals.find(d => d.quotationId === quotationId);

  const [messages, setMessages]     = useState<Msg[]>(chatMessages as Msg[]);
  const [input, setInput]           = useState('');
  const [selPhase, setSelPhase]     = useState(deal?.phaseIndex || 2);
  const [collapsed, setCollapsed]   = useState(true);
  const [showActions, setShowActions] = useState(false);

  const send = (text: string, extra?: Partial<Msg>) => {
    if (!text.trim()) return;
    setMessages(p => [
      ...p,
      { id: 'm' + (p.length + 1), sender: 'me', text: text.trim(), time: 'Now', type: 'text', read: true, ...extra },
    ]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const onAction = (label: string, type: string) =>
    send(`Action taken: ${label}`, { isAction: true, actionLabel: label, actionType: type });

  const bg = avatarBg(contact);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F8FAFC' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.backBtn} onPress={pop} activeOpacity={0.7}><BackArrow /></TouchableOpacity>
        <View style={[s.avatar, { backgroundColor: bg + '40' }]}>
          <Text style={s.avatarL}>{contact.charAt(0)}</Text>
          <View style={s.onlineDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.name} numberOfLines={1}>{contact}</Text>
          <Text style={s.role}>{contactRole} · {quotationId}</Text>
        </View>
        {deal && (
          <TouchableOpacity style={s.hBtn} onPress={() => push('DealDetail', deal)} activeOpacity={0.85}>
            <Text style={s.hBtnTxt}>Deal</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[s.hBtn, { marginLeft: 8 }]} onPress={() => push('QuotationDetail', {})} activeOpacity={0.85}>
          <Text style={s.hBtnTxt}>Quote</Text>
        </TouchableOpacity>
      </View>

      {/* Phase tabs */}
      <PhaseTabs phases={DEAL_PHASES} currentIndex={deal?.phaseIndex || 2} selected={selPhase} onChange={setSelPhase} />

      {/* Quote panel */}
      <QuotePanel quotationId={quotationId} collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} onViewFull={() => push('QuotationDetail', {})} />

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View style={s.refBanner}>
          <View style={s.refDot} />
          <Text style={s.refTxt} numberOfLines={1}>Re: {productRef}</Text>
          <TouchableOpacity onPress={() => push('ProductDetail', {})}>
            <Text style={s.refLink}>View</Text>
          </TouchableOpacity>
        </View>
        <View style={s.dateRow}>
          <View style={s.dateLine} /><Text style={s.dateText}>Today</Text><View style={s.dateLine} />
        </View>
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
      </ScrollView>

      {/* Quick action row */}
      <View style={s.quickBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
          {[
            { l: 'Request Revision',  bg: '#EFF6FF', fg: colors.primary, t: 'quote_change' },
            { l: 'Accept Quote',       bg: '#F0FDF4', fg: colors.success, t: 'approval'     },
            { l: 'Counter Offer',      bg: '#F5F3FF', fg: '#7C3AED',      t: 'quote_change' },
            { l: 'Confirm Payment',    bg: '#FEFCE8', fg: '#CA8A04',      t: 'payment'      },
          ].map(a => (
            <TouchableOpacity key={a.l} style={[s.qBtn, { backgroundColor: a.bg }]} onPress={() => onAction(a.l, a.t)} activeOpacity={0.85}>
              <Text style={[s.qBtnTxt, { color: a.fg }]}>{a.l}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[s.qBtn, { backgroundColor: '#FFF1F2' }]} onPress={() => setShowActions(true)} activeOpacity={0.85}>
            <Text style={[s.qBtnTxt, { color: colors.danger }]}>More Actions</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Input bar */}
      <View style={[s.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={s.attachBtn} activeOpacity={0.7}>
          <View style={{ width: 16, height: 20, borderRadius: 3, borderWidth: 1.5, borderColor: colors.textMuted, borderBottomColor: 'transparent' }} />
        </TouchableOpacity>
        <TextInput
          style={s.input}
          placeholder="Type message or negotiation note..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[s.sendBtn, input.trim() ? s.sendActive : s.sendInactive]}
          onPress={() => send(input)}
          activeOpacity={0.85}
        >
          <SendIcon active={!!input.trim()} />
        </TouchableOpacity>
      </View>

      <ActionsSheet visible={showActions} onClose={() => setShowActions(false)} onSelect={onAction} />
    </KeyboardAvoidingView>
  );
};

const s = StyleSheet.create({
  header:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 14, paddingBottom: 12 },
  backBtn:    { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatar:     { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarL:    { fontSize: 17, fontWeight: '900', color: '#fff' },
  onlineDot:  { position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E', borderWidth: 2, borderColor: colors.primary },
  name:       { fontSize: 15, fontWeight: '800', color: '#fff' },
  role:       { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  hBtn:       { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  hBtnTxt:    { fontSize: 12, fontWeight: '800', color: '#fff' },
  refBanner:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDFA', borderRadius: 12, padding: 10, marginBottom: 16 },
  refDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginRight: 10 },
  refTxt:     { flex: 1, fontSize: 13, fontWeight: '700', color: colors.accent },
  refLink:    { fontSize: 12, fontWeight: '800', color: colors.accent },
  dateRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dateLine:   { flex: 1, height: 1, backgroundColor: colors.border },
  dateText:   { fontSize: 11, fontWeight: '700', color: colors.textMuted, marginHorizontal: 12 },
  quickBar:   { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  qBtn:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  qBtnTxt:    { fontSize: 12, fontWeight: '800' },
  inputBar:   { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  attachBtn:  { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  input:      { flex: 1, minHeight: 42, maxHeight: 100, backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 10, fontSize: 14, color: colors.text, marginRight: 8 },
  sendBtn:    { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sendActive: { backgroundColor: colors.primary },
  sendInactive:{ backgroundColor: '#CBD5E1' },
});
