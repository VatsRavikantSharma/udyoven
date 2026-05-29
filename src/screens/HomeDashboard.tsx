import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, Badge, SectionTitle } from "../components/UI";
import { factoryKpis, vendorKpis, recentActivity } from "../data/mockData";
import { useNav } from "../navigation/NavContext";
import { colors, spacing } from "../theme";

// Hamburger icon drawn with Views - no emoji
const HamburgerIcon = () => (
  <View style={{ gap: 5, paddingVertical: 2 }}>
    <View style={{ width: 20, height: 2, backgroundColor: "#fff", borderRadius: 1 }} />
    <View style={{ width: 14, height: 2, backgroundColor: "#fff", borderRadius: 1 }} />
    <View style={{ width: 20, height: 2, backgroundColor: "#fff", borderRadius: 1 }} />
  </View>
);

// Bell icon drawn with Views - no emoji
const BellIcon = () => (
  <View style={{ alignItems: "center" }}>
    <View style={{ width: 14, height: 12, borderRadius: 7, borderWidth: 2, borderColor: "#fff", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
    <View style={{ width: 16, height: 2, backgroundColor: "#fff", borderRadius: 1 }} />
    <View style={{ width: 5, height: 5, borderRadius: 3, borderWidth: 1.5, borderColor: "#fff", marginTop: 1 }} />
    <View style={{ position: "absolute", top: -4, right: -1, width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" }} />
  </View>
);

const TONE_PROPS: Record<string, { bg: string; accent: string }> = {
  primary: { bg: "#EEF2FF", accent: colors.primary },
  accent:  { bg: "#F0FDFA", accent: colors.accent  },
  warning: { bg: "#FFFBEB", accent: "#D97706"       },
  info:    { bg: "#EFF6FF", accent: colors.info     },
};

const ACTIVITY_COLORS: Record<string, string> = {
  info:    colors.info,
  success: colors.success,
  primary: colors.primary,
  accent:  colors.accent,
  warning: colors.warning,
};

const QUICK_ACTIONS = [
  { label: "Marketplace", letter: "M", bg: colors.primary,  tab: "Products"   },
  { label: "Quotations",  letter: "Q", bg: colors.accent,   tab: "Quotations" },
  { label: "Messages",    letter: "C", bg: "#7C3AED",       tab: "Chat"       },
  { label: "Vendors",     letter: "V", bg: "#F97316",       tab: "Products"   },
];

export const HomeDashboard: React.FC = () => {
  const { role, setTab, openMenu, push } = useNav();
  const insets = useSafeAreaInsets();
  const isFactory = role === "Factory Owner";
  const kpis = isFactory ? factoryKpis : vendorKpis;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* -- Header -- */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={openMenu} style={styles.iconBtn}>
          <HamburgerIcon />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.welcomeTxt}>Welcome back,</Text>
          <Text style={styles.userName}>Lakshit</Text>
        </View>

        <TouchableOpacity onPress={() => push("Notifications")} style={styles.iconBtn}>
          <BellIcon />
        </TouchableOpacity>
      </View>

      {/* -- Search Bar -- */}
      <View style={styles.searchOuter}>
        <TouchableOpacity style={styles.searchBar} onPress={() => setTab("Products")} activeOpacity={0.85}>
          <View style={styles.searchIcon}>
            <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.textMuted }} />
            <View style={{ position: "absolute", bottom: -1, right: -1, width: 5, height: 2, backgroundColor: colors.textMuted, borderRadius: 1, transform: [{ rotate: "45deg" }] }} />
          </View>
          <Text style={styles.searchPlaceholder}>Search products, vendors, factories...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* -- Marketplace Summary -- */}
        <View style={styles.statsStrip}>
          {[
            { n: "1,200+", l: "Factories" },
            { n: "8,400+", l: "Products" },
            { n: "Rs.240Cr+", l: "Deals" },
          ].map((s, i) => (
            <View key={i} style={[styles.statCell, i < 2 && { borderRightWidth: 1, borderRightColor: colors.border }]}>
              <Text style={styles.statNum}>{s.n}</Text>
              <Text style={styles.statLbl}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* -- KPI Grid -- */}
        <View style={styles.kpiRow}>
          {kpis.map((kpi, i) => {
            const tp = TONE_PROPS[kpi.tone] || TONE_PROPS.primary;
            const isPos = kpi.delta && kpi.delta !== "0" && kpi.delta.startsWith("+");
            const isNeutral = kpi.delta === "0";
            const trendColor = isNeutral ? colors.textMuted : isPos ? colors.success : colors.danger;
            return (
              <View key={kpi.id} style={[styles.kpiCard, { backgroundColor: tp.bg }]}>
                <View style={[styles.kpiIconBox, { backgroundColor: tp.accent + "20" }]}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: tp.accent }} />
                </View>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
                <Text style={styles.kpiLabel} numberOfLines={2}>{kpi.label}</Text>
                <View style={styles.kpiFooter}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: trendColor, marginRight: 4 }} />
                  <Text style={[styles.kpiDelta, { color: trendColor }]}>
                    {isNeutral ? "No change" : `${kpi.delta} this week`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* -- Quick Actions -- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={styles.actionItem} onPress={() => setTab(a.tab as any)} activeOpacity={0.85}>
              <View style={[styles.actionIconCircle, { backgroundColor: a.bg }]}>
                <Text style={styles.actionLetter}>{a.letter}</Text>
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* -- Recent Activity -- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {recentActivity.map((item, idx) => {
            const dotColor = ACTIVITY_COLORS[item.tone] || colors.textMuted;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.activityRow, idx < recentActivity.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                onPress={() => setTab(item.screen as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.activityDot, { backgroundColor: dotColor + "25", borderColor: dotColor }]}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: dotColor }} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityText} numberOfLines={2}>{item.text}</Text>
                  <Text style={styles.activityTime}>{item.time} ago</Text>
                </View>
                <View style={styles.activityArrow}>
                  <View style={{ width: 6, height: 6, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: colors.textMuted, transform: [{ rotate: "45deg" }] }} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* -- Promo Banner -- */}
        <View style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>List Your Products</Text>
            <Text style={styles.promoSub}>Reach 5,000+ verified buyers and factories across India.</Text>
            <TouchableOpacity style={styles.promoBtn} onPress={() => setTab("Products")} activeOpacity={0.85}>
              <Text style={styles.promoBtnTxt}>Get Started</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.promoRight}>
            <View style={[styles.promoCircle, { width: 50, height: 50 }]} />
            <View style={[styles.promoCircle, { width: 30, height: 30, marginTop: -20, marginLeft: 20 }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingBottom: 60, flexDirection: "row", alignItems: "center" },
  iconBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, marginHorizontal: 14 },
  welcomeTxt: { color: "rgba(255,255,255,0.72)", fontSize: 13, fontWeight: "600" },
  userName: { color: "#fff", fontSize: 20, fontWeight: "900" },
  searchOuter: { paddingHorizontal: 20, marginTop: -28 },
  searchBar: { backgroundColor: "#fff", height: 54, borderRadius: 16, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, shadowColor: "#1E3A8A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 8 },
  searchIcon: { width: 18, height: 18, alignItems: "center", justifyContent: "center", marginRight: 12 },
  searchPlaceholder: { color: colors.textMuted, fontSize: 14, flex: 1 },
  body: { padding: 20, marginTop: 20 },
  statsStrip: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, marginBottom: 24, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statNum: { fontSize: 17, fontWeight: "900", color: colors.text },
  statLbl: { fontSize: 11, color: colors.textMuted, fontWeight: "600", marginTop: 2 },
  kpiRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 8 },
  kpiCard: { width: "48%", borderRadius: 18, padding: 16, marginBottom: 14 },
  kpiIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  kpiValue: { fontSize: 26, fontWeight: "900", color: colors.text, marginBottom: 2 },
  kpiLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "600", lineHeight: 16, marginBottom: 8 },
  kpiFooter: { flexDirection: "row", alignItems: "center" },
  kpiDelta: { fontSize: 11, fontWeight: "700" },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: colors.text },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: "700" },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  actionItem: { width: "22%", alignItems: "center" },
  actionIconCircle: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  actionLetter: { fontSize: 22, fontWeight: "900", color: "#fff" },
  actionLabel: { fontSize: 11, color: colors.text, textAlign: "center", fontWeight: "700", lineHeight: 14 },
  activityCard: { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  activityRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  activityDot: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  activityText: { fontSize: 13, color: colors.text, fontWeight: "600", lineHeight: 18 },
  activityTime: { fontSize: 11, color: colors.textMuted, marginTop: 3, fontWeight: "500" },
  activityArrow: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  promoBanner: { backgroundColor: colors.primary, borderRadius: 20, padding: 22, flexDirection: "row", overflow: "hidden" },
  promoLeft: { flex: 1 },
  promoTitle: { color: "#fff", fontSize: 18, fontWeight: "900", marginBottom: 6 },
  promoSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, lineHeight: 18, marginBottom: 16 },
  promoBtn: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignSelf: "flex-start" },
  promoBtnTxt: { color: colors.primary, fontWeight: "800", fontSize: 13 },
  promoRight: { width: 70, justifyContent: "center", alignItems: "center" },
  promoCircle: { borderRadius: 999, backgroundColor: "rgba(255,255,255,0.12)" },
});
