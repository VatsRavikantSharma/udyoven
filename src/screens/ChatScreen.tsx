import React, { useState } from "react";
import {
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { chatThreads } from "../data/mockData";
import { useNav } from "../navigation/NavContext";
import { colors, spacing } from "../theme";

// Deterministic avatar colour per contact
const AVATAR_PALETTE = ["#1E3A8A", "#0D9488", "#7C3AED", "#F97316", "#DC2626", "#0EA5E9", "#16A34A"];
const avatarColor = (name: string) => AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];

// Online status dot
const OnlineDot = ({ online }: { online: boolean }) => (
  <View
    style={{
      position: "absolute", bottom: 1, right: 1,
      width: 11, height: 11, borderRadius: 6,
      backgroundColor: online ? "#22C55E" : "#94A3B8",
      borderWidth: 2, borderColor: "#fff",
    }}
  />
);

// Compose FAB icon (pencil + line drawn with Views)
const ComposeIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: "center", justifyContent: "center" }}>
    <View style={{ width: 14, height: 14, borderWidth: 2, borderColor: "#fff", borderRadius: 3, transform: [{ rotate: "45deg" }] }} />
    <View style={{ position: "absolute", bottom: 0, left: 0, width: 8, height: 2, backgroundColor: "#fff", borderRadius: 1 }} />
  </View>
);

export const ChatScreen: React.FC = () => {
  const { push } = useNav();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const totalUnread = chatThreads.reduce((s, t) => s + t.unread, 0);
  const filtered = search.trim()
    ? chatThreads.filter(t =>
        t.contact.toLowerCase().includes(search.toLowerCase()) ||
        t.productRef.toLowerCase().includes(search.toLowerCase())
      )
    : chatThreads;

  const pinned = filtered.filter(t => t.unread > 0);
  const others = filtered.filter(t => t.unread === 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSub}>
            {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {totalUnread > 0 && (
            <View style={styles.unreadPill}>
              <Text style={styles.unreadPillTxt}>{totalUnread}</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchIconBox}>
          <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.textMuted }} />
          <View style={{ position: "absolute", bottom: 3, right: 3, width: 4, height: 1.5, backgroundColor: colors.textMuted, borderRadius: 1, transform: [{ rotate: "45deg" }] }} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts or products..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearBtn}>
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#CBD5E1", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 9, color: "#fff", fontWeight: "900" }}>x</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Pinned / Unread ── */}
        {pinned.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionLabel}>UNREAD</Text>
            </View>
            {pinned.map((thread, i) => (
              <ThreadCard key={thread.id} thread={thread} onPress={() =>
                push("ChatDetail", { contact: thread.contact, contactRole: thread.contactRole, productRef: thread.productRef })
              } />
            ))}
          </>
        )}

        {/* ── All / Recent ── */}
        {others.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>RECENT</Text>
            </View>
            {others.map((thread, i) => (
              <ThreadCard key={thread.id} thread={thread} onPress={() =>
                push("ChatDetail", { contact: thread.contact, contactRole: thread.contactRole, productRef: thread.productRef })
              } />
            ))}
          </>
        )}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <View style={{ width: 36, height: 28, borderWidth: 2.5, borderColor: "#CBD5E1", borderRadius: 12 }} />
              <View style={{ position: "absolute", bottom: 0, left: 10, width: 0, height: 0, borderTopWidth: 8, borderTopColor: "#CBD5E1", borderRightWidth: 7, borderRightColor: "transparent" }} />
            </View>
            <Text style={styles.emptyTitle}>No conversations</Text>
            <Text style={styles.emptySub}>Start a chat from any product or quotation page.</Text>
          </View>
        )}
      </ScrollView>

      {/* ── New Chat FAB ── */}
      <TouchableOpacity style={[styles.fab, { bottom: 80 + Math.max(insets.bottom, 0) }]} activeOpacity={0.85}>
        <ComposeIcon />
      </TouchableOpacity>
    </View>
  );
};

// ── Thread Card ──────────────────────────────────────────────────────────
const ThreadCard: React.FC<{ thread: typeof chatThreads[0]; onPress: () => void }> = ({ thread, onPress }) => {
  const bg = avatarColor(thread.contact);
  const hasUnread = thread.unread > 0;
  return (
    <TouchableOpacity style={styles.threadCard} onPress={onPress} activeOpacity={0.8}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: bg }]}>
          <Text style={styles.avatarLetter}>{thread.contact.charAt(0)}</Text>
        </View>
        <OnlineDot online={thread.online} />
      </View>

      {/* Content */}
      <View style={styles.threadBody}>
        <View style={styles.threadTopRow}>
          <Text style={[styles.contactName, hasUnread && styles.contactNameBold]} numberOfLines={1}>
            {thread.contact}
          </Text>
          <Text style={[styles.timeText, hasUnread && { color: colors.primary }]}>
            {thread.time}
          </Text>
        </View>

        <View style={styles.productTagRow}>
          <View style={styles.productTag}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, marginRight: 4 }} />
            <Text style={styles.productTagText} numberOfLines={1}>{thread.productRef}</Text>
          </View>
          <Text style={styles.roleText}>{thread.contactRole}</Text>
        </View>

        <View style={styles.threadBottomRow}>
          <Text
            style={[styles.lastMsg, hasUnread && styles.lastMsgBold]}
            numberOfLines={1}
          >
            {thread.lastMessage}
          </Text>
          {hasUnread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{thread.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 24, fontWeight: "900", color: colors.text },
  headerSub: { fontSize: 13, color: colors.textMuted, marginTop: 2, fontWeight: "500" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  unreadPill: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  unreadPillTxt: { color: "#fff", fontSize: 12, fontWeight: "800" },
  searchWrap: { flexDirection: "row", alignItems: "center", margin: 16, backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: colors.border },
  searchIconBox: { width: 18, height: 18, alignItems: "center", justifyContent: "center", marginRight: 10 },
  searchInput: { flex: 1, height: "100%", fontSize: 14, color: colors.text },
  clearBtn: { padding: 4 },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 8 },
  sectionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: 8 },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 },
  threadCard: { backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 8, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "flex-start", shadowColor: "#000", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  avatarWrap: { marginRight: 14 },
  avatar: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 20, fontWeight: "900", color: "#fff" },
  threadBody: { flex: 1 },
  threadTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  contactName: { fontSize: 15, fontWeight: "600", color: colors.text, flex: 1 },
  contactNameBold: { fontWeight: "900" },
  timeText: { fontSize: 11, color: colors.textMuted, fontWeight: "600", marginLeft: 8 },
  productTagRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  productTag: { flexDirection: "row", alignItems: "center", backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, maxWidth: "70%" },
  productTagText: { fontSize: 11, color: colors.accent, fontWeight: "700" },
  roleText: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  threadBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  lastMsg: { flex: 1, fontSize: 13, color: colors.textMuted, fontWeight: "500" },
  lastMsgBold: { color: colors.text, fontWeight: "700" },
  unreadBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginLeft: 8 },
  unreadBadgeText: { fontSize: 11, fontWeight: "900", color: "#fff" },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { width: 60, height: 48, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: colors.textMuted, textAlign: "center", lineHeight: 20 },
  fab: { position: "absolute", right: 20, width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
});
