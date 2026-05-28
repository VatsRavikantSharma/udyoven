import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { useNav } from '../navigation/NavContext';

export const ScreenHeader: React.FC<{
  title: string;
  subtitle?: string;
  rightIcon?: string;
  onRightPress?: () => void;
  onBack?: () => void;
  showBack?: boolean;
}> = ({ title, subtitle, rightIcon, onRightPress, onBack, showBack = true }) => {
  const { pop } = useNav();
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          onPress={onBack || pop}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>‹</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.iconText, { fontSize: 18 }]}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22, color: colors.text, lineHeight: 24, fontWeight: '700' },
  title: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textAlign: 'center', marginTop: 2 },
});
