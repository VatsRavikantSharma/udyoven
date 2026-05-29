import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme";
import { Tab, useNav } from "../navigation/NavContext";

const { width: SW } = Dimensions.get("window");
const TABS: { key: Tab; label: string }[] = [
  { key: "Home",       label: "Home"     },
  { key: "Products",   label: "Products" },
  { key: "Quotations", label: "Quotes"   },
  { key: "Chat",       label: "Chat"     },
  { key: "Profile",    label: "Me"       },
];

const HomeIcon = ({ active }: { active: boolean }) => {
  const c = active ? colors.primary : "#94A3B8";
  return (
    <View style={{ width: 24, height: 22, alignItems: "center" }}>
      <View style={{ width: 0, height: 0, borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 10, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: c }} />
      <View style={{ width: 16, height: 11, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 2, borderColor: c, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    </View>
  );
};

const GridIcon = ({ active }: { active: boolean }) => {
  const c = active ? colors.primary : "#94A3B8";
  return (
    <View style={{ width: 20, height: 20, flexDirection: "row", flexWrap: "wrap", gap: 3 }}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: active ? c : "transparent", borderWidth: active ? 0 : 1.5, borderColor: c }} />
      ))}
    </View>
  );
};

const DocIcon = ({ active }: { active: boolean }) => {
  const c = active ? colors.primary : "#94A3B8";
  return (
    <View style={{ width: 18, height: 22, borderWidth: 1.5, borderColor: c, borderRadius: 3, padding: 3, justifyContent: "space-evenly" }}>
      {[0, 1, 2].map(i => (
        <View key={i} style={{ height: 1.5, backgroundColor: c, borderRadius: 1, width: i === 2 ? "60%" : "100%" }} />
      ))}
    </View>
  );
};

const ChatIcon = ({ active }: { active: boolean }) => {
  const c = active ? colors.primary : "#94A3B8";
  return (
    <View style={{ width: 22, height: 20 }}>
      <View style={{ width: 20, height: 16, borderWidth: 1.5, borderColor: c, borderRadius: 8 }} />
      <View style={{ position: "absolute", bottom: 0, left: 5, width: 0, height: 0, borderTopWidth: 5, borderTopColor: c, borderRightWidth: 5, borderRightColor: "transparent" }} />
    </View>
  );
};

const PersonIcon = ({ active }: { active: boolean }) => {
  const c = active ? colors.primary : "#94A3B8";
  return (
    <View style={{ width: 22, height: 22, alignItems: "center" }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: c, backgroundColor: active ? c + "30" : "transparent" }} />
      <View style={{ width: 18, height: 9, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderRightWidth: 1.5, borderColor: c, marginTop: 2 }} />
    </View>
  );
};

const TAB_ICONS = [HomeIcon, GridIcon, DocIcon, ChatIcon, PersonIcon];

export const BottomNav: React.FC = () => {
  const { tab, setTab } = useNav();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);
  const tabWidth = SW / TABS.length;
  const activeIndex = TABS.findIndex(t => t.key === tab);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <View style={styles.indicatorTrack}>
        <View style={[styles.indicator, { width: tabWidth, marginLeft: activeIndex * tabWidth }]} />
      </View>
      <View style={styles.row}>
        {TABS.map((t, i) => {
          const isActive = tab === t.key;
          const IconComp = TAB_ICONS[i];
          return (
            <TouchableOpacity key={t.key} style={styles.tabBtn} onPress={() => setTab(t.key)} activeOpacity={0.7}>
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <IconComp active={isActive} />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F1F5F9", elevation: 20, shadowColor: "#1E3A8A", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  indicatorTrack: { height: 3, backgroundColor: "transparent" },
  indicator: { height: 3, backgroundColor: colors.primary, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  row: { flexDirection: "row", height: 60 },
  tabBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconWrap: { width: 42, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  iconWrapActive: { backgroundColor: colors.primary + "12" },
  label: { fontSize: 10, fontWeight: "600", color: "#94A3B8", marginTop: 2 },
  labelActive: { color: colors.primary, fontWeight: "800" },
});
