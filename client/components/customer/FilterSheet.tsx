import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, Modal, StyleSheet,
} from 'react-native';
import { X, SlidersHorizontal, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface FilterState {
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  amenities: string[];
  category: string;
  bookingType: string;
  guests: number;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

const AMENITY_OPTIONS = [
  'WiFi', 'Private Pool', 'Air Conditioning', 'Kitchen', 'BBQ Area',
  'Gym', 'Chef on Demand', 'Bonfire', 'Parking', 'Outdoor Shower',
];

const CATEGORY_OPTIONS = ['All', 'Villa', 'Farmhouse', 'Cottage', 'Resort'];
const BOOKING_TYPE_OPTIONS = ['All', 'Instant Book', 'Request Book'];
const PRICE_PRESETS = [
  { label: '< ₹10K', min: 0, max: 10000 },
  { label: '₹10K–20K', min: 10000, max: 20000 },
  { label: '₹20K–35K', min: 20000, max: 35000 },
  { label: '₹35K+', min: 35000, max: 200000 },
];

export default function FilterSheet({ visible, onClose, filters, onApply }: FilterSheetProps) {
  const { theme } = useTheme();
  const [local, setLocal] = useState<FilterState>(filters);

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
    });
  };

  const SectionTitle = ({ children }: { children: string }) => (
    <Text style={[styles.sectionTitle, { color: theme.text }]}>{children}</Text>
  );

  const Chip = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? '#C9A14A' : theme.surface,
          borderColor: selected ? '#C9A14A' : theme.border,
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? '#111111' : theme.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: theme.bg }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <SlidersHorizontal size={20} color="#C9A14A" />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Filters</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
              <Pressable onPress={onClose} style={[styles.closeBtn, { backgroundColor: theme.surface }]}>
                <X size={18} color={theme.text} />
              </Pressable>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Price */}
            <SectionTitle>Price Per Night</SectionTitle>
            <View style={styles.chipRow}>
              {PRICE_PRESETS.map((p) => (
                <Chip
                  key={p.label}
                  label={p.label}
                  selected={local.priceMin === p.min && local.priceMax === p.max}
                  onPress={() => setLocal((prev) => ({ ...prev, priceMin: p.min, priceMax: p.max }))}
                />
              ))}
            </View>

            {/* Category */}
            <SectionTitle>Property Type</SectionTitle>
            <View style={styles.chipRow}>
              {CATEGORY_OPTIONS.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={local.category === c}
                  onPress={() => setLocal((prev) => ({ ...prev, category: c }))}
                />
              ))}
            </View>

            {/* Bedrooms */}
            <SectionTitle>Bedrooms</SectionTitle>
            <View style={styles.chipRow}>
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <Chip
                  key={n}
                  label={n === 0 ? 'Any' : `${n}+`}
                  selected={local.bedrooms === n}
                  onPress={() => setLocal((prev) => ({ ...prev, bedrooms: n }))}
                />
              ))}
            </View>

            {/* Guests */}
            <SectionTitle>Guests</SectionTitle>
            <View style={styles.chipRow}>
              {[0, 2, 4, 6, 8, 10, 12].map((n) => (
                <Chip
                  key={n}
                  label={n === 0 ? 'Any' : `${n}+`}
                  selected={local.guests === n}
                  onPress={() => setLocal((prev) => ({ ...prev, guests: n }))}
                />
              ))}
            </View>

            {/* Booking type */}
            <SectionTitle>Booking Type</SectionTitle>
            <View style={styles.chipRow}>
              {BOOKING_TYPE_OPTIONS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={local.bookingType === t}
                  onPress={() => setLocal((prev) => ({ ...prev, bookingType: t }))}
                />
              ))}
            </View>

            {/* Amenities */}
            <SectionTitle>Amenities</SectionTitle>
            <View style={styles.chipRow}>
              {AMENITY_OPTIONS.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  selected={local.amenities.includes(a)}
                  onPress={() => toggleAmenity(a)}
                />
              ))}
            </View>
          </ScrollView>

          {/* Apply button */}
          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Pressable
              onPress={() => { onApply(local); onClose(); }}
              style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.85 }]}
            >
              <CheckCircle size={18} color="#111111" />
              <Text style={styles.applyText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resetText: {
    color: '#C9A14A',
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  applyBtn: {
    backgroundColor: '#C9A14A',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  applyText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },
});
