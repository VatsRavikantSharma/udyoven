import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { Badge, Card, SectionTitle } from '../components/UI';
import { Product } from '../data/mockData';
import { useNav } from '../navigation/NavContext';
import { colors, radius, shadow, spacing, typography } from '../theme';

export const ProductDetailScreen: React.FC<{ params?: any }> = ({ params }) => {
  const product: Product = params || {
    id: 'P001',
    name: 'SS Seamless Pipe 2 inch',
    category: 'Steel & Metals',
    factory: 'Tata Steel Pipes',
    factoryCity: 'Mumbai',
    price: 'Rs.320-Rs.480/meter',
    moq: 100,
    moqUnit: 'meters',
    rating: 4.7,
    reviews: 84,
    tags: ['Stainless Steel', 'Pipe', 'Grade 304'],
    delivery: '5-7 days',
    inStock: true,
    gst: '18%',
    hsn: '7304',
    description: 'Premium grade SS seamless pipes suitable for industrial, chemical, and food-grade applications.',
    specs: [{ key: 'Grade', value: 'SS 304 / 316L' }],
    variants: ['2mm WT', '3mm WT', '4mm WT'],
    image: '',
  };

  const { push, pop } = useNav();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Product Details" subtitle={product.category} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product image area */}
        <View style={styles.imageArea}>
          <Text style={styles.imagePlaceholder}>{product.name.charAt(0)}</Text>
          <View style={styles.imageBadges}>
            <View style={[styles.imgBadge, { backgroundColor: product.inStock ? colors.successBg : colors.dangerBg }]}>
              <Text style={[styles.imgBadgeText, { color: product.inStock ? colors.success : colors.danger }]}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <View style={[styles.imgBadge, { backgroundColor: '#E0E7FF' }]}>
              <Text style={[styles.imgBadgeText, { color: colors.primary }]}>GST {product.gst}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Name & Rating */}
          <View style={styles.nameRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingStar}>*</Text>
              <Text style={styles.ratingVal}>{product.rating}</Text>
              <Text style={styles.ratingCount}>({product.reviews})</Text>
            </View>
          </View>

          {/* Factory */}
          <TouchableOpacity style={styles.factoryRow} onPress={() => {}}>
            <View style={styles.factoryIcon}>
              <Text style={styles.factoryIconText}>F</Text>
            </View>
            <View>
              <Text style={styles.factoryName}>{product.factory}</Text>
              <Text style={styles.factoryCity}>{product.factoryCity}</Text>
            </View>
            <Text style={styles.chevron}>></Text>
          </TouchableOpacity>

          {/* Price & MOQ */}
          <Card style={styles.priceCard}>
            <View style={styles.priceRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.priceLabel}>Pricing Range</Text>
                <Text style={styles.priceValue}>{product.price}</Text>
              </View>
              <View style={styles.divider} />
              <View style={{ flex: 1, paddingLeft: spacing.lg }}>
                <Text style={styles.priceLabel}>Min. Order Qty</Text>
                <Text style={styles.moqValue}>{product.moq} {product.moqUnit}</Text>
              </View>
            </View>
            <View style={[styles.priceRow, { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: spacing.md }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.priceLabel}>Delivery</Text>
                <Text style={styles.deliveryValue}>{product.delivery}</Text>
              </View>
              <View style={styles.divider} />
              <View style={{ flex: 1, paddingLeft: spacing.lg }}>
                <Text style={styles.priceLabel}>HSN Code</Text>
                <Text style={styles.moqValue}>{product.hsn}</Text>
              </View>
            </View>
          </Card>

          {/* Variants */}
          {product.variants.length > 0 && (
            <>
              <SectionTitle title="Variants" />
              <View style={styles.variantRow}>
                {product.variants.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.variantChip, selectedVariant === v && styles.variantChipActive]}
                    onPress={() => setSelectedVariant(v)}
                  >
                    <Text style={[styles.variantText, selectedVariant === v && styles.variantTextActive]}>
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Description */}
          <SectionTitle title="Product Description" />
          <Card>
            <Text style={styles.description}>{product.description}</Text>
          </Card>

          {/* Specifications */}
          <SectionTitle title="Specifications" />
          <Card padded={false}>
            {product.specs.map((spec, i) => (
              <View
                key={spec.key}
                style={[
                  styles.specRow,
                  i < product.specs.length - 1 && styles.specBorder,
                ]}
              >
                <Text style={styles.specKey}>{spec.key}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </Card>

          {/* Tags */}
          <SectionTitle title="Tags" />
          <View style={styles.tagsRow}>
            {product.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatBtnBottom}
          onPress={() => push('ChatDetail', { contact: product.factory, productRef: product.name })}
          activeOpacity={0.85}
        >
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quoteBtn}
          onPress={() => push('QuotationCreate', { product })}
          activeOpacity={0.85}
        >
          <Text style={styles.quoteBtnText}>Request Quotation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageArea: {
    height: 220,
    backgroundColor: colors.primaryLight + '12',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  imagePlaceholder: {
    fontSize: 72, fontWeight: '900', color: colors.primaryLight, opacity: 0.3,
  },
  imageBadges: {
    position: 'absolute', top: 16, right: 16,
    flexDirection: 'row',
  },
  imgBadge: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: radius.pill, marginLeft: 6,
  },
  imgBadgeText: { fontSize: 11, fontWeight: '800' },
  body: { padding: spacing.xl },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  productName: { flex: 1, fontSize: 22, fontWeight: '900', color: colors.text, lineHeight: 28, marginRight: 12 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', paddingTop: 4 },
  ratingStar: { fontSize: 14, fontWeight: '900', color: colors.warning },
  ratingVal: { fontSize: 16, fontWeight: '900', color: colors.text, marginLeft: 4 },
  ratingCount: { fontSize: 12, fontWeight: '600', color: colors.textSubtle, marginLeft: 2 },
  factoryRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg, padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1, borderColor: colors.border,
    ...shadow.soft,
  },
  factoryIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  factoryIconText: { fontSize: 18, fontWeight: '900', color: colors.primary },
  factoryName: { fontSize: 14, fontWeight: '800', color: colors.text },
  factoryCity: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  chevron: { fontSize: 18, color: colors.textSubtle, marginLeft: 'auto' },
  priceCard: { marginBottom: spacing.xl },
  priceRow: { flexDirection: 'row', alignItems: 'flex-start' },
  priceLabel: { fontSize: 11, fontWeight: '700', color: colors.textSubtle, marginBottom: 4 },
  priceValue: { fontSize: 18, fontWeight: '900', color: colors.primary },
  moqValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  deliveryValue: { fontSize: 14, fontWeight: '800', color: colors.accent },
  divider: { width: 1, backgroundColor: colors.border, marginHorizontal: 0, alignSelf: 'stretch' },
  variantRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xl },
  variantChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border,
    marginRight: 8, marginBottom: 8,
    backgroundColor: colors.surface,
  },
  variantChipActive: { borderColor: colors.primary, backgroundColor: '#E0E7FF' },
  variantText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  variantTextActive: { color: colors.primary },
  description: { fontSize: 14, fontWeight: '500', color: colors.text, lineHeight: 22 },
  specRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  specBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  specKey: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  specValue: { fontSize: 13, fontWeight: '800', color: colors.text, maxWidth: '60%', textAlign: 'right' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6,
    marginRight: 8, marginBottom: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  tagText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
    ...shadow.raised,
  },
  chatBtnBottom: {
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: radius.lg, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  chatBtnText: { fontSize: 14, fontWeight: '800', color: colors.primary },
  quoteBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: radius.lg,
    paddingVertical: 14,
    ...shadow.card,
  },
  quoteBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
