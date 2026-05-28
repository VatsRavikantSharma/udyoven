import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

// --- Types -------------------------------------------------------------------

type MessageRole = 'user' | 'assistant';
interface Message {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  actions?: { label: string; route?: string }[];
  cards?: InsightCard[];
}
interface InsightCard {
  tag: string; title: string; value: string; delta?: string; positive?: boolean;
}
type Language = 'English' | 'Hindi' | 'Marathi' | 'Tamil' | 'Telugu';

// --- AI Responses ------------------------------------------------------------

const AI_RESPONSES: Record<string, { text: string; actions?: Message['actions']; cards?: InsightCard[] }> = {
  'orders at risk': {
    text: 'Based on current production and dispatch data, 2 orders are at risk today:\n\n• Order A102 (Tata Forge) — dispatch delayed by 1 day. Batch B17 QC hold is the blocker.\n• Order A106 (Ashok Leyland) — Batch B19 is on hold due to material shortage.\n\nRecommendation: Expedite sand casting delivery for B19 and resolve B17 QC issue before 14:00.',
    actions: [
      { label: 'View Order A102', route: 'Orders' },
      { label: 'View Production', route: 'ProductionLive' },
    ],
    cards: [
      { tag: 'AT RISK', title: 'Order A102', value: '1 day delay',   delta: 'Tata Forge',    positive: false },
      { tag: 'AT RISK', title: 'Order A106', value: 'Material hold', delta: 'Ashok Leyland', positive: false },
    ],
  },
  'reorder stock': {
    text: 'Based on current consumption rates and reorder points, I recommend reordering:\n\n• Steel Coil 4mm — 210 kg remaining, 2.6 days left. Reorder: 500 kg from Jindal Steel.\n• Brass Rod 12mm — 84 kg remaining, 3.2 days left. Reorder: 300 kg from Bombay Metals.\n• Bearing 6203 — 28 pcs, below reorder level of 40 pcs. Order from SKF India.\n\nTotal procurement value: ~RS2.8L',
    actions: [
      { label: 'Open Procurement', route: 'Procurement' },
      { label: 'View Inventory',   route: 'Inventory' },
    ],
    cards: [
      { tag: 'URGENT', title: 'Steel Coil 4mm', value: '2.6 days left', delta: '210 kg / 500 kg', positive: false },
      { tag: 'URGENT', title: 'Brass Rod 12mm', value: '3.2 days left', delta: '84 kg / 200 kg',  positive: false },
      { tag: 'LOW',    title: 'Bearing 6203',   value: '28 pcs left',   delta: 'Min: 40 pcs',     positive: false },
    ],
  },
  'rejection increased': {
    text: 'Rejection rate increased from 1.4% last week to 1.7% this week.\n\n• Batch B17 (CNC Bracket 220mm) — 6.2% rejection due to surface finish defects on CNC-03.\n• CNC-03 elevated temperature (86C) and tooling wear.\n• Inspector M. Joshi logged "minor burrs" and "hardness deviation HRC 34 vs. target 28-32".\n\nRecommendation: Replace CNC-03 tooling immediately and re-inspect 200 pcs from Batch B17.',
    actions: [
      { label: 'View QC Batch B17', route: 'QC' },
      { label: 'View CNC-03',       route: 'Machines' },
    ],
    cards: [
      { tag: 'ROOT CAUSE', title: 'CNC-03 Tooling Wear', value: 'Replace now',    delta: 'Temp: 86C',       positive: false },
      { tag: 'IMPACT',     title: 'Batch B17',           value: '6.2% rejected', delta: '+4.6% vs. limit', positive: false },
    ],
  },
  'vendor delaying': {
    text: 'Current vendor delay analysis:\n\n• Bombay Metals — PO-1053 (Brass Rod 12mm) delayed 3 days. Expected 25 Apr, now 28 Apr. Reliability: 84%.\n• Pune Castings Co. — reliability dropped to 78%, below 80% threshold.\n\nRecommendation: Issue formal delay notice to Bombay Metals and evaluate alternate suppliers.',
    actions: [
      { label: 'View Vendors', route: 'Vendors' },
      { label: 'View PO-1053', route: 'Procurement' },
    ],
    cards: [
      { tag: 'DELAYED', title: 'Bombay Metals',     value: '+3 days', delta: 'PO-1053',     positive: false },
      { tag: 'RISK',    title: 'Pune Castings Co.', value: '78%',     delta: 'Reliability', positive: false },
    ],
  },
  'payment overdue': {
    text: 'Payment overdue summary as of today:\n\n• Tata Forge Ltd. — INV-7701, RS2,48,400 overdue 12 days (due 10 Apr).\n• Hero MotoCorp — INV-7705, RS1,76,000 overdue 10 days (due 12 Apr).\n\nTotal overdue: RS4,24,400  |  Total receivables: RS36.4L\n\nRecommendation: Send formal dunning notice today. Escalate Tata Forge if no response by 25 Apr.',
    actions: [{ label: 'View Invoices', route: 'Invoices' }],
    cards: [
      { tag: 'OVERDUE', title: 'Tata Forge Ltd.', value: 'RS2,48,400', delta: '12 days overdue', positive: false },
      { tag: 'OVERDUE', title: 'Hero MotoCorp',   value: 'RS1,76,000', delta: '10 days overdue', positive: false },
    ],
  },
  'machine downtime': {
    text: "Today's machine downtime analysis:\n\n• CNC-03 — Overheating at 86C. 0.4h downtime. Root cause: coolant flow restriction and tooling wear.\n• LAT-02 — Sensor fault. 8.0h downtime. Sensor replacement required.\n• FUR-02 — Scheduled maintenance. 3.8h downtime.\n\nTotal: 12.2 machine-hours lost today.\nRecommendation: CNC-03 needs immediate coolant check and tooling replacement.",
    actions: [{ label: 'View Machines', route: 'Machines' }],
    cards: [
      { tag: 'CRITICAL', title: 'CNC-03', value: '0.4h down', delta: 'Overheating 86C',     positive: false },
      { tag: 'FAULT',    title: 'LAT-02', value: '8.0h down', delta: 'Sensor fault',          positive: false },
      { tag: 'PLANNED',  title: 'FUR-02', value: '3.8h down', delta: 'Scheduled maintenance', positive: true  },
    ],
  },
};

function getAIResponse(text: string): (typeof AI_RESPONSES)[string] {
  const l = text.toLowerCase();
  if (l.includes('risk') || l.includes('order'))                              return AI_RESPONSES['orders at risk'];
  if (l.includes('reorder') || l.includes('stock'))                           return AI_RESPONSES['reorder stock'];
  if (l.includes('rejection') || l.includes('reject') || l.includes('qc'))   return AI_RESPONSES['rejection increased'];
  if (l.includes('vendor') || l.includes('supply') || l.includes('delay'))   return AI_RESPONSES['vendor delaying'];
  if (l.includes('payment') || l.includes('overdue') || l.includes('invoice')) return AI_RESPONSES['payment overdue'];
  if (l.includes('machine') || l.includes('downtime'))                        return AI_RESPONSES['machine downtime'];
  return {
    text: 'I have analyzed your factory data. Based on today\'s operations:\n\n• Production efficiency at 86% — above last week\'s 83.9%.\n• 2 orders are at risk due to production delays.\n• 3 raw materials need reordering within 3 days.\n• RS4.24L in overdue payments require follow-up.\n\nWhat specific area would you like to drill into?',
    actions: [{ label: 'View Dashboard', route: 'Main' }],
  };
}

const SUGGESTED_PROMPTS = [
  { icon: '!', text: 'Which orders are at risk today?' },
  { icon: '#', text: 'What stock should I reorder?' },
  { icon: 'Q', text: 'Why did rejection increase this week?' },
  { icon: 'V', text: 'Which vendor is delaying supply?' },
  { icon: 'P', text: 'Show payment overdue summary' },
  { icon: 'M', text: 'What caused machine downtime today?' },
];

const QUICK_INSIGHTS: InsightCard[] = [
  { tag: 'PRODUCTION', title: 'Plant Efficiency',  value: '86%',     delta: '+2.1% WoW',  positive: true  },
  { tag: 'QUALITY',    title: 'Rejection Rate',    value: '1.7%',    delta: '+0.3% risk', positive: false },
  { tag: 'FINANCE',    title: 'Overdue Payments',  value: 'RS4.24L', delta: '2 invoices', positive: false },
  { tag: 'OPERATIONS', title: 'Orders at Risk',    value: '2',       delta: 'Act today',  positive: false },
];

const LANGUAGES: Language[] = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu'];

// --- SubComponents -----------------------------------------------------------

const InsightCardView: React.FC<{ card: InsightCard }> = ({ card }) => {
  const tagColor =
    card.tag === 'CRITICAL' || card.tag === 'OVERDUE' || card.tag === 'AT RISK' ? colors.danger :
    card.tag === 'URGENT'   || card.tag === 'RISK'    || card.tag === 'FAULT'   ? colors.alertOrange :
    card.tag === 'PLANNED'  || card.tag === 'ROOT CAUSE'                        ? colors.accent :
    colors.primary;
  return (
    <View style={[styles.insightCard, { borderLeftColor: tagColor }]}>
      <View style={[styles.insightTagWrap, { backgroundColor: tagColor + '22' }]}>
        <Text style={[styles.insightTagText, { color: tagColor }]}>{card.tag}</Text>
      </View>
      <Text style={styles.insightTitle}>{card.title}</Text>
      <Text style={styles.insightValue}>{card.value}</Text>
      {card.delta ? (
        <Text style={[styles.insightDelta, { color: card.positive ? colors.success : colors.danger }]}>
          {card.delta}
        </Text>
      ) : null}
    </View>
  );
};

const MessageBubble: React.FC<{ message: Message; onAction: (route?: string) => void }> = ({
  message, onAction,
}) => {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
      {!isUser && (
        <View style={styles.aiAvatar}><Text style={styles.aiAvatarText}>AI</Text></View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{message.text}</Text>
        <Text style={[styles.bubbleTime, isUser && { color: 'rgba(255,255,255,0.6)' }]}>{message.time}</Text>
        {message.cards && message.cards.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardScroll}
            contentContainerStyle={styles.cardScrollContent}
          >
            {message.cards.map((c, i) => <InsightCardView key={i} card={c} />)}
          </ScrollView>
        )}
        {message.actions && message.actions.length > 0 && (
          <View style={styles.actionRow}>
            {message.actions.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionChip}
                onPress={() => onAction(a.route)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionChipText}>{a.label} ›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

// --- Main Screen -------------------------------------------------------------

export const AIAssistantScreen: React.FC<{ tabMode?: boolean }> = ({ tabMode = false }) => {
  const { push } = useNav();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      role: 'assistant',
      text: 'Good morning! I am your FactoryOps AI — smart industrial business assistant.\n\nI can help you analyze production, identify risks, manage inventory, track vendors, review financials, and much more.\n\nWhat would you like to know today?',
      time: now,
      cards: QUICK_INSIGHTS,
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const aiResp = getAIResponse(text);
    setMessages((prev) => [
      ...prev,
      { id: `u${Date.now()}`, role: 'user',      text: text.trim(), time: ts },
      { id: `a${Date.now()}`, role: 'assistant', time: ts, ...aiResp },
    ]);
    setInput('');
  };

  const handleAction = (route?: string) => { if (route) push(route as any); };

  return (
    <View style={styles.root}>
      {!tabMode ? (
        <ScreenHeader title="AI Assistant" subtitle="Smart industrial insights" rightIcon="+" />
      ) : (
        <View style={styles.tabHeader}>
          <View>
            <Text style={typography.h1}>AI Assistant</Text>
            <Text style={[typography.small, { marginTop: 2 }]}>Smart industrial business insights</Text>
          </View>
          <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangPicker(!showLangPicker)}>
            <Text style={styles.langBtnText}>Lang: {language}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showLangPicker && (
        <View style={styles.langPicker}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.langOption, language === l && styles.langOptionActive]}
              onPress={() => { setLanguage(l); setShowLangPicker(false); }}
            >
              <Text style={[styles.langOptionText, language === l && { color: '#fff' }]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!tabMode && (
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangPicker(!showLangPicker)}>
            <Text style={styles.langBtnText}>Lang: {language}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn}>
            <Text style={styles.exportBtnText}>Export Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={tabMode ? 80 : 0}
      >
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onAction={handleAction} />
          ))}
        </ScrollView>

        {messages.length <= 1 && (
          <View style={styles.promptsSection}>
            <Text style={styles.promptsLabel}>SUGGESTED PROMPTS</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promptsRow}
            >
              {SUGGESTED_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.promptChip}
                  onPress={() => sendMessage(p.text)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptIcon}>{p.icon}</Text>
                  <Text style={styles.promptText}>{p.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.voiceBtn}>
            <Text style={styles.voiceBtnIcon}>Mic</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask about production, inventory, vendors..."
            placeholderTextColor={colors.textSubtle}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            activeOpacity={0.8}
            disabled={!input.trim()}
          >
            <Text style={styles.sendBtnIcon}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  tabHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  langBtn: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6,
  },
  langBtnText: { fontSize: 12, fontWeight: '700', color: colors.text },
  langPicker: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  langOption: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
  },
  langOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langOptionText: { fontSize: 12, fontWeight: '700', color: colors.text },
  exportBtn: {
    backgroundColor: colors.accent + '22', borderRadius: radius.pill,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  exportBtnText: { fontSize: 12, fontWeight: '700', color: colors.accent },
  messagesScroll: { flex: 1 },
  messagesContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  msgRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  aiAvatarText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  bubble: { maxWidth: '82%', borderRadius: radius.lg, padding: 12 },
  bubbleUser: { backgroundColor: colors.primary, borderTopRightRadius: 4 },
  bubbleAI: {
    backgroundColor: colors.surface, borderTopLeftRadius: 4,
    borderWidth: 1, borderColor: colors.border,
    ...shadow.soft,
  },
  bubbleText: { fontSize: 13, fontWeight: '500', color: colors.text, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: colors.textSubtle, marginTop: 4 },
  cardScroll: { marginTop: 8 },
  cardScrollContent: { paddingRight: 8 },
  insightCard: {
    width: 140, borderLeftWidth: 3, borderRadius: radius.md,
    backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
    padding: 10, marginRight: 8,
  },
  insightTagWrap: { borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4 },
  insightTagText: { fontSize: 8, fontWeight: '900' },
  insightTitle: { fontSize: 10, fontWeight: '700', color: colors.text, marginBottom: 2 },
  insightValue: { fontSize: 16, fontWeight: '900', color: colors.text },
  insightDelta: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  actionChip: {
    backgroundColor: colors.primary + '15', borderRadius: radius.pill,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.primary + '44',
  },
  actionChipText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  promptsSection: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  promptsLabel: { fontSize: 10, fontWeight: '900', color: colors.textSubtle, marginBottom: 8 },
  promptsRow: { paddingRight: spacing.lg },
  promptChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8,
    ...shadow.soft,
  },
  promptIcon: { fontSize: 14, marginRight: 6 },
  promptText: { fontSize: 11, fontWeight: '700', color: colors.text, maxWidth: 160 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  voiceBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  voiceBtnIcon: { fontSize: 10, fontWeight: '700', color: colors.textSubtle },
  input: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, color: colors.text, maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnIcon: { fontSize: 10, fontWeight: '900', color: '#fff' },
});
