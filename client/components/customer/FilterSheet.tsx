import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft, Star } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface FilterState {
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  amenities: string[];
  category: string;
  bookingType: string;
  guests: number;
  sortBy?: string;
  ratingMin?: number;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

const CATEGORY_OPTIONS = ['All', 'Villa', 'Farmhouse', 'Cottage', 'Resort'];
const SORT_OPTIONS = ['Recommended', 'Top Rated', 'Low to High', 'High to Low'];
const AMENITY_OPTIONS = [
  'WiFi', 'Private Pool', 'Air Conditioning', 'Kitchen', 'BBQ Area',
  'Gym', 'Chef on Demand', 'Bonfire', 'Parking',
];

const RATING_PRESETS = [
  { label: '4.5 and above', val: 4.5, stars: 5 },
  { label: '4.0 - 4.5', val: 4.0, stars: 4 },
  { label: '3.5 - 4.0', val: 3.5, stars: 3 },
  { label: '3.0 - 3.5', val: 3.0, stars: 2 },
  { label: '2.5 - 3.0', val: 2.5, stars: 1 },
];

const PRICE_MARKERS = [
  { label: '₹0', val: 0 },
  { label: '₹25K', val: 25000 },
  { label: '₹50K', val: 50000 },
  { label: '₹100K', val: 100000 },
  { label: '₹150K', val: 150000 },
  { label: '₹200K+', val: 200000 },
];

export default function FilterSheet({ visible, onClose, filters, onApply }: FilterSheetProps) {
  const { theme, isDark } = useTheme();
  const [local, setLocal] = useState<FilterState>(filters);

  // Sync state when sheet becomes visible
  React.useEffect(() => {
    if (visible) {
      setLocal(filters);
    }
  }, [visible, filters]);

  const toggleAmenity = (a: string) => {
    setLocal((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleReset = () => {
    setLocal({
      priceMin: 0,
      priceMax: 200000,
      bedrooms: 0,
      amenities: [],
      category: 'All',
      bookingType: 'All',
      guests: 0,
      sortBy: 'Recommended',
      ratingMin: 0,
    });
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const renderStars = (count: number) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            fill={s <= count ? '#FFB300' : 'transparent'}
            color={s <= count ? '#FFB300' : theme.textMuted}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  const handleMarkerPress = (val: number) => {
    const distToMin = Math.abs(val - local.priceMin);
    const distToMax = Math.abs(val - local.priceMax);
    if (distToMin < distToMax) {
      setLocal((prev) => ({ ...prev, priceMin: Math.min(val, prev.priceMax) }));
    } else {
      setLocal((prev) => ({ ...prev, priceMax: Math.max(val, prev.priceMin) }));
    }
  };

  const minPercent = (local.priceMin / 200000) * 100;
  const maxPercent = (local.priceMax / 200000) * 100;

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable
            onPress={onClose}
            style={[styles.backBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
          >
            <ChevronLeft size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Filter</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {/* Property Type */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Property Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {CATEGORY_OPTIONS.map((c) => {
                const isSelected = local.category === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setLocal((prev) => ({ ...prev, category: c }))}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.gold : theme.surface,
                        borderColor: isSelected ? theme.gold : theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: isSelected ? theme.textInverse : theme.textSecondary }]}>
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Sort By */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {SORT_OPTIONS.map((s) => {
                const isSelected = local.sortBy === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setLocal((prev) => ({ ...prev, sortBy: s }))}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.gold : theme.surface,
                        borderColor: isSelected ? theme.gold : theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: isSelected ? theme.textInverse : theme.textSecondary }]}>
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Reviews</Text>
            <View style={styles.ratingList}>
              {RATING_PRESETS.map((r) => {
                const isSelected = local.ratingMin === r.val;
                return (
                  <Pressable
                    key={r.label}
                    onPress={() => setLocal((prev) => ({ ...prev, ratingMin: isSelected ? 0 : r.val }))}
                    style={[styles.ratingRow, { borderBottomColor: theme.borderSoft }]}
                  >
                    <View style={styles.ratingRowLeft}>
                      {renderStars(r.stars)}
                      <Text style={[styles.ratingLabel, { color: theme.textSecondary }]}>
                        {r.label}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        { borderColor: isSelected ? theme.gold : theme.border },
                      ]}
                    >
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.gold }]} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <View style={styles.priceHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Price Range</Text>
              <Text style={[styles.priceValues, { color: theme.gold }]}>
                ₹{local.priceMin.toLocaleString('en-IN')} - ₹{local.priceMax.toLocaleString('en-IN')}
              </Text>
            </View>

            {/* Slider track UI */}
            <View style={styles.sliderContainer}>
              <View style={[styles.sliderTrack, { backgroundColor: theme.border }]} />
              <View
                style={[
                  styles.sliderActiveTrack,
                  {
                    backgroundColor: theme.gold,
                    left: `${minPercent}%`,
                    right: `${100 - maxPercent}%`,
                  },
                ]}
              />
              {/* Knobs */}
              <View
                style={[
                  styles.sliderKnob,
                  {
                    left: `${minPercent}%`,
                    backgroundColor: theme.surface,
                    borderColor: theme.gold,
                  },
                ]}
              />
              <View
                style={[
                  styles.sliderKnob,
                  {
                    left: `${maxPercent}%`,
                    backgroundColor: theme.surface,
                    borderColor: theme.gold,
                  },
                ]}
              />
            </View>

            {/* Markers */}
            <View style={styles.markerRow}>
              {PRICE_MARKERS.map((m) => (
                <Pressable key={m.label} onPress={() => handleMarkerPress(m.val)} style={styles.markerBtn}>
                  <Text style={[styles.markerText, { color: theme.textMuted }]}>{m.label}</Text>
                </Pressable>
              ))}
            </View>

            {/* Adjuster Columns */}
            <View style={styles.priceAdjusters}>
              <View style={[styles.adjusterBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.adjusterLabel, { color: theme.textMuted }]}>Min Limit</Text>
                <View style={styles.adjusterControl}>
                  <Pressable
                    onPress={() => setLocal((prev) => ({ ...prev, priceMin: Math.max(0, prev.priceMin - 5000) }))}
                    style={styles.adjusterBtn}
                  >
                    <Text style={[styles.adjusterBtnText, { color: theme.gold }]}>-</Text>
                  </Pressable>
                  <Text style={[styles.adjusterValText, { color: theme.text }]}>₹{(local.priceMin / 1000).toFixed(0)}K</Text>
                  <Pressable
                    onPress={() => setLocal((prev) => ({ ...prev, priceMin: Math.min(prev.priceMax, prev.priceMin + 5000) }))}
                    style={styles.adjusterBtn}
                  >
                    <Text style={[styles.adjusterBtnText, { color: theme.gold }]}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={[styles.adjusterBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.adjusterLabel, { color: theme.textMuted }]}>Max Limit</Text>
                <View style={styles.adjusterControl}>
                  <Pressable
                    onPress={() => setLocal((prev) => ({ ...prev, priceMax: Math.max(prev.priceMin, prev.priceMax - 5000) }))}
                    style={styles.adjusterBtn}
                  >
                    <Text style={[styles.adjusterBtnText, { color: theme.gold }]}>-</Text>
                  </Pressable>
                  <Text style={[styles.adjusterValText, { color: theme.text }]}>₹{(local.priceMax / 1000).toFixed(0)}K</Text>
                  <Pressable
                    onPress={() => setLocal((prev) => ({ ...prev, priceMax: Math.min(200000, prev.priceMax + 5000) }))}
                    style={styles.adjusterBtn}
                  >
                    <Text style={[styles.adjusterBtnText, { color: theme.gold }]}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {AMENITY_OPTIONS.map((a) => {
                const isSelected = local.amenities.includes(a);
                return (
                  <Pressable
                    key={a}
                    onPress={() => toggleAmenity(a)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? theme.gold : theme.surface,
                        borderColor: isSelected ? theme.gold : theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: isSelected ? theme.textInverse : theme.textSecondary }]}>
                      {a}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <Pressable
            onPress={handleReset}
            style={[styles.resetBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
          >
            <Text style={[styles.resetText, { color: theme.textSecondary }]}>Reset Filter</Text>
          </Pressable>
          <Pressable onPress={handleApply} style={[styles.applyBtn, { backgroundColor: theme.gold }]}>
            <Text style={[styles.applyText, { color: theme.textInverse }]}>Apply</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  horizontalScroll: {
    paddingRight: 20,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ratingList: {
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  ratingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  priceValues: {
    fontSize: 14,
    fontWeight: '700',
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 10,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  sliderActiveTrack: {
    height: 4,
    position: 'absolute',
  },
  sliderKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    position: 'absolute',
    marginLeft: -10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  markerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  markerBtn: {
    paddingVertical: 4,
  },
  markerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceAdjusters: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  adjusterBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  adjusterLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  adjusterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  adjusterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjusterBtnText: {
    fontSize: 18,
    fontWeight: '800',
  },
  adjusterValText: {
    fontSize: 14,
    fontWeight: '700',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
  },
  resetBtn: {
    width: '40%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  applyBtn: {
    width: '56%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
