import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notifications, AppNotification } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing } from '../theme';

const TYPE_ICON: Record<string, string> = {
  quotation: 'Q',
  chat: 'C',
  deal: 'D',
  inquiry: 'I',
  product: 'P',
  payment: '$',
};

const TYPE_COLOR: Record<string, string> = {
  quotation: colors.primary,
  chat: colors.accent,
  deal: colors.success,
  inquiry: colors.warning,
  product: colors.info,
  payment: colors.alertOrange,
};

export const NotificationsScreen: React.FC = () => {
  const { push } = useNav();
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<AppNotification[]>(notifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleTap = (item: AppNotification) => {
    markRead(item.id);
    if (item.screen) {
      push(item.screen as any);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBar}>
          <Text style={styles.unreadBarText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {items.map((item, i) => {
          const tcolor = TYPE_COLOR[item.type] || colors.primary;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notifRow,
                i < items.length - 1 && styles.notifBorder,
                !item.read && styles.notifUnread,
              ]}
              onPress={() => handleTap(item)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconCircle, { backgroundColor: tcolor + '18' }]}>
                <Text style={[styles.iconText, { color: tcolor }]}>
                  {TYPE_ICON[item.type] || 'N'}
                </Text>
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTopRow}>
                  <Text style={[styles.notifTitle, !item.read && { color: colors.text, fontWeight: '800' }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
                <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                <View style={styles.notifBottomRow}>
                  <View style={[styles.typePill, { backgroundColor: tcolor + '18' }]}>
                    <Text style={[styles.typeLabel, { color: tcolor }]}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Text>
                  </View>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>N</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyBody}>You are all caught up!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: colors.text },
  markAllBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.primary,
  },
  markAllText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  unreadBar: {
    backgroundColor: colors.primary + '12',
    paddingHorizontal: spacing.xl, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: colors.primary + '25',
  },
  unreadBarText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  notifRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.lg,
  },
  notifBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  notifUnread: { backgroundColor: colors.primary + '04' },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.lg, marginTop: 2,
  },
  iconText: { fontSize: 16, fontWeight: '900' },
  notifContent: { flex: 1 },
  notifTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  notifTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text, marginRight: 8 },
  notifTime: { fontSize: 11, fontWeight: '600', color: colors.textSubtle },
  notifBody: { fontSize: 13, fontWeight: '500', color: colors.textMuted, lineHeight: 18, marginBottom: 8 },
  notifBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  typeLabel: { fontSize: 11, fontWeight: '800' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 48, fontWeight: '900', color: colors.border, marginBottom: spacing.lg },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
  emptyBody: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
});
