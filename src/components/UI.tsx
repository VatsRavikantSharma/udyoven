import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../theme';

// ───── Card ─────
export const Card: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
}> = ({ children, style, onPress, padded = true }) => {
  const inner = (
    <View
      style={[
        styles.card,
        padded && { padding: spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
};

// ───── Section header ─────
export const SectionTitle: React.FC<{
  title: string;
  action?: string;
  onAction?: () => void;
  subtitle?: string;
}> = ({ title, action, onAction, subtitle }) => (
  <View style={styles.section}>
    <View style={{ flex: 1 }}>
      <Text style={typography.h2}>{title}</Text>
      {subtitle ? (
        <Text style={[typography.small, { marginTop: 2 }]}>{subtitle}</Text>
      ) : null}
    </View>
    {action ? (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

// ───── Badge ─────
const toneMap: Record<string, { bg: string; fg: string }> = {
  primary: { bg: '#E0E7FF', fg: colors.primary },
  info:    { bg: colors.infoBg, fg: colors.info },
  accent:  { bg: colors.accentSoft, fg: colors.accent },
  success: { bg: colors.successBg, fg: colors.success },
  warning: { bg: colors.warningBg, fg: '#92400E' },
  danger:  { bg: colors.dangerBg, fg: colors.danger },
  orange:  { bg: colors.alertOrangeBg, fg: '#9A3412' },
  steel:   { bg: '#E2E8F0', fg: colors.steel },
};
export const Badge: React.FC<{
  text: string;
  tone?: keyof typeof toneMap | string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  dot?: boolean;
}> = ({ text, tone = 'steel', style, textStyle, dot }) => {
  const t = toneMap[tone] || toneMap.steel;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: t.fg }]} /> : null}
      <Text style={[styles.badgeText, { color: t.fg }, textStyle]}>{text}</Text>
    </View>
  );
};

// ───── Button ─────
export const Button: React.FC<{
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: string;
  full?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ label, onPress, variant = 'primary', icon, full, small, style }) => {
  const v: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: colors.primary }
      : variant === 'secondary'
      ? { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
      : variant === 'danger'
      ? { backgroundColor: colors.danger }
      : { backgroundColor: 'transparent' };
  const tx: TextStyle =
    variant === 'primary' || variant === 'danger'
      ? { color: '#fff' }
      : { color: colors.text };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.btn,
        v,
        full && { alignSelf: 'stretch' },
        small && { paddingVertical: 9, paddingHorizontal: 14 },
        style,
      ]}
    >
      {icon ? <Text style={[styles.btnIcon, tx]}>{icon}</Text> : null}
      <Text style={[styles.btnText, tx, small && { fontSize: 13 }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ───── Progress bar ─────
export const Progress: React.FC<{
  value: number; // 0-100
  color?: string;
  height?: number;
}> = ({ value, color = colors.primary, height = 8 }) => (
  <View
    style={{
      height,
      borderRadius: height,
      backgroundColor: colors.divider,
      overflow: 'hidden',
    }}
  >
    <View
      style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        height: '100%',
        backgroundColor: color,
        borderRadius: height,
      }}
    />
  </View>
);

// ───── Progress ring (square gauge using stacked views) ─────
export const Gauge: React.FC<{
  value: number;
  label: string;
  suffix?: string;
  color?: string;
}> = ({ value, label, suffix = '%', color = colors.primary }) => {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.gauge}>
      <View style={styles.gaugeTrack}>
        <View
          style={[
            styles.gaugeFill,
            { width: `${v}%`, backgroundColor: color },
          ]}
        />
      </View>
      <View style={styles.gaugeRow}>
        <Text style={styles.gaugeValue}>
          {v}
          <Text style={styles.gaugeSuffix}>{suffix}</Text>
        </Text>
        <Text style={styles.gaugeLabel}>{label}</Text>
      </View>
    </View>
  );
};

// ───── Bar chart ─────
export const BarChart: React.FC<{
  data: number[];
  color?: string;
  labels?: string[];
  height?: number;
}> = ({ data, color = colors.primary, labels, height = 120 }) => {
  const max = Math.max(...data, 1);
  return (
    <View>
      <View style={[styles.chartArea, { height }]}>
        {data.map((v, i) => (
          <View key={i} style={styles.barCol}>
            <View
              style={{
                width: '70%',
                height: `${(v / max) * 100}%`,
                backgroundColor: color,
                borderRadius: 4,
                opacity: 0.92,
              }}
            />
          </View>
        ))}
      </View>
      {labels ? (
        <View style={styles.chartLabels}>
          {labels.map((l, i) => (
            <Text key={i} style={styles.chartLabel}>{l}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

// ───── Sparkline (line via stacked bars) ─────
export const Sparkline: React.FC<{
  data: number[];
  color?: string;
  height?: number;
}> = ({ data, color = colors.accent, height = 60 }) => {
  const max = Math.max(...data, 1);
  return (
    <View style={[styles.spark, { height }]}>
      {data.map((v, i) => (
        <View key={i} style={styles.sparkCol}>
          <View
            style={{
              width: 4,
              height: `${(v / max) * 100}%`,
              borderRadius: 4,
              backgroundColor: color,
            }}
          />
        </View>
      ))}
    </View>
  );
};

// ───── Input (visual only) ─────
export const SearchBar: React.FC<{
  placeholder?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ placeholder = 'Search…', onPress, style }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.search, style]}
  >
    <Text style={styles.searchIcon}>🔍</Text>
    <Text style={styles.searchPlaceholder}>{placeholder}</Text>
  </TouchableOpacity>
);

// ───── Tabs (segmented) ─────
export const Tabs: React.FC<{
  options: string[];
  value: string;
  onChange: (v: string) => void;
  scroll?: boolean;
}> = ({ options, value, onChange }) => (
  <View style={styles.tabsWrap}>
    {options.map((o) => {
      const active = o === value;
      return (
        <TouchableOpacity
          key={o}
          onPress={() => onChange(o)}
          style={[styles.tab, active && styles.tabActive]}
        >
          <Text style={[styles.tabText, active && styles.tabTextActive]}>
            {o}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ───── Chip row ─────
export const Chips: React.FC<{
  options: string[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <View style={styles.chipRow}>
    {options.map((o) => {
      const active = o === value;
      return (
        <TouchableOpacity
          key={o}
          onPress={() => onChange(o)}
          style={[styles.chip, active && styles.chipActive]}
        >
          <Text style={[styles.chipText, active && styles.chipTextActive]}>
            {o}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ───── Divider ─────
export const Divider: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => <View style={[styles.divider, style]} />;

// ───── Row ─────
export const Row: React.FC<{
  label: string;
  value: string | React.ReactNode;
  bold?: boolean;
}> = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text style={typography.bodyMuted}>{label}</Text>
    {typeof value === 'string' ? (
      <Text style={[typography.body, bold && { fontWeight: '800' }]}>
        {value}
      </Text>
    ) : (
      value
    )}
  </View>
);

// ───── Empty stub for icons (uses emoji) ─────
export const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 18,
}) => <Text style={{ fontSize: size }}>{name}</Text>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.card,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionAction: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontWeight: '700', fontSize: 14, letterSpacing: 0.2 },
  btnIcon: { marginRight: 8, fontSize: 14 },
  gauge: {},
  gaugeTrack: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gaugeFill: { height: '100%', borderRadius: 8 },
  gaugeRow: { marginTop: 10 },
  gaugeValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  gaugeSuffix: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  gaugeLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    marginHorizontal: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  chartLabel: { flex: 1, fontSize: 10, color: colors.textMuted, textAlign: 'center', fontWeight: '600' },
  spark: { flexDirection: 'row', alignItems: 'flex-end' },
  sparkCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8, fontSize: 14 },
  searchPlaceholder: { color: colors.textSubtle, fontSize: 13, fontWeight: '500' },
  tabsWrap: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.steel },
  chipTextActive: { color: '#fff' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
});
