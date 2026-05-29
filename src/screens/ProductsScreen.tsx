import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Card, SearchBar, SectionTitle } from "../components/UI";
import { categories, products } from "../data/mockData";
import { useNav } from "../navigation/NavContext";
import { colors, radius, shadow, spacing, typography } from "../theme";

export const ProductsScreen: React.FC = () => {
  const { push } = useNav();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                       p.factory.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCat === "All" || p.category === activeCat;
    return matchSearch && matchCat;
  });

  const renderProduct = ({ item: p }: { item: typeof products[0] }) => (
    <Card
      key={p.id}
      padded={false}
      style={styles.productCard}
      onPress={() => push("ProductDetail", p)}
    >
      <View style={styles.imgPlaceholder}>
        <Text style={styles.imgText}>{p.name.charAt(0)}</Text>
        <View style={styles.stockBadge}>
          <Text style={styles.stockText}>{p.inStock ? "IN STOCK" : "OUT OF STOCK"}</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
          <Text style={styles.rating}>? {p.rating}</Text>
        </View>
        <Text style={styles.factoryName}>{p.factory} · {p.factoryCity}</Text>
        
        <View style={styles.priceRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.priceLabel}>Price Range</Text>
            <Text style={styles.priceValue}>{p.price}</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border, height: 20, marginHorizontal: 10 }} />
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.priceLabel}>MOQ</Text>
            <Text style={styles.moqValue}>{p.moq} {p.moqUnit}</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          {p.tags.slice(0, 2).map(t => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.chatBtn}
            onPress={() => push("ChatDetail", { contact: p.factory, productRef: p.name })}
          >
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quoteBtn}
            onPress={() => push("QuotationCreate", p)}
          >
            <Text style={styles.quoteBtnText}>Quote</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.header}>
        <SearchBar 
          placeholder="Search items or factories..." 
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={{ height: 50, marginBottom: spacing.md }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {["All", ...categories].map((c) => (
            <TouchableOpacity 
              key={c}
              style={[styles.catChip, activeCat === c && styles.catChipActive]}
              onPress={() => setActiveCat(c)}
            >
              <Text style={[styles.catText, activeCat === c && styles.catTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { padding: spacing.lg, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  catScroll: { paddingHorizontal: spacing.xl, alignItems: "center" },
  catChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surfaceAlt, marginRight: 8 },
  catChipActive: { backgroundColor: colors.primary },
  catText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  catTextActive: { color: "#fff" },
  productCard: { marginBottom: spacing.lg, backgroundColor: colors.surface, borderRadius: 16, overflow: "hidden" },
  imgPlaceholder: { height: 140, backgroundColor: "#E2E8F0", alignItems: "center", justifyContent: "center" },
  imgText: { fontSize: 32, fontWeight: "800", color: "#94A3B8" },
  stockBadge: { position: "absolute", top: 12, right: 12, backgroundColor: "rgba(255,255,255,0.9)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  stockText: { fontSize: 10, fontWeight: "800", color: colors.success },
  cardInfo: { padding: spacing.lg },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  prodName: { fontSize: 17, fontWeight: "800", color: colors.text, flex: 1 },
  rating: { fontSize: 13, fontWeight: "700", color: "#F59E0B" },
  factoryName: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
  priceRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceAlt, padding: 12, borderRadius: 12, marginBottom: 16 },
  priceLabel: { fontSize: 10, color: colors.textMuted, marginBottom: 2, textTransform: "uppercase" },
  priceValue: { fontSize: 14, fontWeight: "700", color: colors.text },
  moqValue: { fontSize: 14, fontWeight: "700", color: colors.text },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  tag: { backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 6 },
  tagText: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  cardActions: { flexDirection: "row", gap: 10 },
  chatBtn: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  chatBtnText: { color: colors.primary, fontWeight: "700" },
  quoteBtn: { flex: 2, height: 44, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  quoteBtnText: { color: "#fff", fontWeight: "700" },
});
