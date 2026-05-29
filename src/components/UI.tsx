import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors, radius, shadow, spacing, typography } from "../theme";

// ── Card ──────────────────────────────────────────────────────────────────
export const Card: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
}> = ({ children, style, onPress, padded = true }) => {
  const inner = (
    <View style={[styles.card, padded && { padding: spacing.lg }, style]}>
      {children}
    </View>
  );
  if (onPress) return <TouchableOpacity activeOpacity={0.85} onPress={onPress}>{inner}</TouchableOpacity>;
  return inner;
};

// ── Section Title ─────────────────────────────────────────────────────────
export const SectionTitle: React.FC<{
  title: string;
  action?: string;
  onAction?: () => void;
  subtitle?: string;
}> = ({ title, action, onAction, subtitle }) => (
  <View style={styles.section}>
    <View style={{ flex: 1 }}>
      <Text style={typography.h2}>{title}</Text>
      {subtitle ? <Text style={[typography.small, { marginTop: 2 }]}>{subtitle}</Text> : null}
    </View>
    {action ? (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

// ── Badge ─────────────────────────────────────────────────────────────────
const toneMap: Record<string, { bg: string; fg: string }> = {
  primary: { bg: "#E0E7FF", fg: colors.primary },
  info:    { bg: colors.infoBg,      fg: colors.info    },
  accent:  { bg: colors.accentSoft,  fg: colors.accent  },
  success: { bg: colors.successBg,   fg: colors.success },
  warning: { bg: colors.warningBg,   fg: "#92400E"      },
  danger:  { bg: colors.dangerBg,    fg: colors.danger  },
  orange:  { bg: colors.alertOrangeBg, fg: "#9A3412"    },
  steel:   { bg: "#F1F5F9",          fg: "#64748B"      },
};

export const Badge: React.FC<{
  /** content: pass either text or label */
  text?: string;
  label?: string;
  /** pass either tone or variant */
  tone?: string;
  variant?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}> = ({ text, label, tone, variant, style, textStyle }) => {
  const key = tone || variant || "steel";
  const t = toneMap[key] || toneMap.steel;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.badgeText, { color: t.fg }, textStyle]}>{text ?? label}</Text>
    </View>
  );
};

// ── Button ────────────────────────────────────────────────────────────────
export const Button: React.FC<{
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: string;
  full?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ label, onPress, variant = "primary", icon, full, small, style }) => {
  const bg =
    variant === "primary"   ? colors.primary :
    variant === "danger"    ? colors.danger  :
    variant === "secondary" ? colors.surface : "transparent";
  const textColor =
    variant === "primary" || variant === "danger" ? "#fff" : colors.text;
  const border =
    variant === "secondary" ? { borderWidth: 1, borderColor: colors.border } : {};
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.btn,
        { backgroundColor: bg },
        border,
        full  && { alignSelf: "stretch" },
        small && { paddingVertical: 9, paddingHorizontal: 14 },
        style,
      ]}
    >
      {icon ? <Text style={[styles.btnIcon, { color: textColor }]}>{icon}</Text> : null}
      <Text style={[styles.btnText, { color: textColor }, small && { fontSize: 13 }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ── SearchBar (real TextInput) ────────────────────────────────────────────
export const SearchBar: React.FC<{
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}> = ({ value, onChangeText, placeholder = "Search...", style, onPress }) => (
  <View style={[styles.searchWrap, style]}>
    {/* magnifier drawn with Views */}
    <View style={styles.searchIconBox}>
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.textMuted }} />
      <View style={{ position: "absolute", bottom: 1, right: 1, width: 4, height: 1.5, backgroundColor: colors.textMuted, borderRadius: 1, transform: [{ rotate: "45deg" }] }} />
    </View>
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor={colors.textSubtle}
      value={value}
      onChangeText={onChangeText}
      onPress={onPress}
      autoCorrect={false}
    />
  </View>
);

// ── Progress ──────────────────────────────────────────────────────────────
export const Progress: React.FC<{
  value: number;
  color?: string;
  height?: number;
}> = ({ value, color = colors.primary, height = 8 }) => (
  <View style={{ height, borderRadius: height, backgroundColor: colors.border, overflow: "hidden" }}>
    <View style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "100%", backgroundColor: color, borderRadius: height }} />
  </View>
);

// ── Tabs ──────────────────────────────────────────────────────────────────
export const Tabs: React.FC<{
  options: string[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <View style={styles.tabsWrap}>
    {options.map(o => {
      const active = o === value;
      return (
        <TouchableOpacity key={o} onPress={() => onChange(o)} style={[styles.tab, active && styles.tabActive]}>
          <Text style={[styles.tabText, active && styles.tabTextActive]}>{o}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ── Chips ─────────────────────────────────────────────────────────────────
export const Chips: React.FC<{
  options: string[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <View style={styles.chipRow}>
    {options.map(o => {
      const active = o === value;
      return (
        <TouchableOpacity key={o} onPress={() => onChange(o)} style={[styles.chip, active && styles.chipActive]}>
          <Text style={[styles.chipText, active && styles.chipTextActive]}>{o}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ── Divider ───────────────────────────────────────────────────────────────
export const Divider: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ── Row ───────────────────────────────────────────────────────────────────
export const Row: React.FC<{
  label: string;
  value: string | React.ReactNode;
  bold?: boolean;
}> = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text style={typography.bodyMuted}>{label}</Text>
    {typeof value === "string" ? (
      <Text style={[typography.body, bold && { fontWeight: "800" as const }]}>{value}</Text>
    ) : value}
  </View>
);

// ── Icon (emoji / text fallback) ──────────────────────────────────────────
export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name, size = 18, color,
}) => (
  <Text style={{ fontSize: size, color }}>{name}</Text>
);

// ── Gauge (flat progress) ─────────────────────────────────────────────────
export const Gauge: React.FC<{
  value: number;
  label: string;
  suffix?: string;
  color?: string;
}> = ({ value, label, suffix = "%", color = colors.primary }) => {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View>
      <View style={{ height: 8, backgroundColor: colors.border, borderRadius: 8, overflow: "hidden" }}>
        <View style={{ width: `${v}%`, height: "100%", backgroundColor: color, borderRadius: 8 }} />
      </View>
      <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={typography.small}>{label}</Text>
        <Text style={{ fontSize: 13, fontWeight: "800", color }}>{v}{suffix}</Text>
      </View>
    </View>
  );
};

// ── BarChart ──────────────────────────────────────────────────────────────
export const BarChart: React.FC<{
  data: number[];
  color?: string;
  labels?: string[];
  height?: number;
}> = ({ data, color = colors.primary, labels, height = 120 }) => {
  const max = Math.max(...data, 1);
  return (
    <View>
      <View style={{ height, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        {data.map((v, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <View style={{ width: "70%", height: `${(v / max) * 100}%`, backgroundColor: color, borderRadius: 4, opacity: 0.9 }} />
          </View>
        ))}
      </View>
      {labels && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
          {labels.map((l, i) => <Text key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: colors.textMuted }}>{l}</Text>)}
        </View>
      )}
    </View>
  );
};

// ── Sparkline ─────────────────────────────────────────────────────────────
export const Sparkline: React.FC<{
  data: number[];
  color?: string;
  height?: number;
}> = ({ data, color = colors.accent, height = 60 }) => {
  const max = Math.max(...data, 1);
  return (
    <View style={{ height, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
      {data.map((v, i) => (
        <View key={i} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
          <View style={{ width: 4, height: `${(v / max) * 100}%`, borderRadius: 4, backgroundColor: color }} />
        </View>
      ))}
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionAction: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.2 },
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontWeight: "700", fontSize: 14, letterSpacing: 0.2 },
  btnIcon: { marginRight: 8, fontSize: 14 },
  searchWrap: {
    height: 50,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIconBox: { width: 18, height: 18, alignItems: "center", justifyContent: "center", marginRight: 10 },
  searchInput: { flex: 1, height: "100%", fontSize: 14, color: colors.text },
  tabsWrap: { flexDirection: "row", backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, padding: 3 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: radius.xs },
  tabActive: { backgroundColor: colors.surface, ...shadow.soft },
  tabText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  tabTextActive: { color: colors.text, fontWeight: "700" },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  chipTextActive: { color: "#fff" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
});
