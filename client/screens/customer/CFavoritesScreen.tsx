import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Heart, SlidersHorizontal, Check, X } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { properties } from '../../lib/mockData';
import PropertyCard from '../../components/customer/PropertyCard';
import WebHeader from '../../components/WebHeader';
import { EmptyState } from '../../components/ui';

const INITIAL_FAVORITES = ['prop_1', 'prop_4'];

const SORT_OPTIONS = [
  { key: 'all', label: 'All (Default)' },
  { key: 'recent', label: 'Recent' },
  { key: 'price_low', label: 'Price: Low to High' },
  { key: 'price_high', label: 'Price: High to Low' },
  { key: 'rating', label: 'Rating: High to Low' },
] as const;

export default function CFavoritesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'all' | 'recent' | 'price_low' | 'price_high' | 'rating'>('all');
  const [showSortModal, setShowSortModal] = useState<boolean>(false);

  const isFilterActive = sortBy !== 'all' || selectedCity !== 'All';

  const isWeb = Platform.OS === 'web';
  const isAndroid = Platform.OS === 'android';

  const getWebCardStyle = () => {
    if (!isWeb) return undefined;
    const padding = width < 640 ? 32 : 48;
    const containerWidth = Math.min(width, 1280) - padding;
    if (width < 640) {
      return { width: '100%' };
    } else if (width < 960) {
      return { width: Math.floor((containerWidth - 20) / 2) };
    } else if (width < 1280) {
      return { width: Math.floor((containerWidth - 40) / 3) };
    } else {
      return { width: Math.floor((containerWidth - 60) / 4) };
    }
  };

  const favoritedProperties = useMemo(() => {
    return properties.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  const cities = useMemo(() => {
    const uniqueCities = new Set<string>();
    favoritedProperties.forEach((p) => {
      if (p.city) {
        uniqueCities.add(p.city);
      }
    });
    return ['All', ...Array.from(uniqueCities)];
  }, [favoritedProperties]);

  useEffect(() => {
    if (!cities.includes(selectedCity)) {
      setSelectedCity('All');
    }
  }, [cities, selectedCity]);

  const displayProperties = useMemo(() => {
    let list = selectedCity === 'All'
      ? favoritedProperties
      : favoritedProperties.filter((p) => p.city === selectedCity);

    if (sortBy === 'price_low') {
      return [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    }
    if (sortBy === 'price_high') {
      return [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [favoritedProperties, selectedCity, sortBy]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isAndroid ? theme.gold : theme.bg }]} edges={['top']}>
      {isWeb && <WebHeader />}

      {/* Header */}
      <View style={[styles.header, isWeb && styles.webHeaderWrap, isAndroid && { backgroundColor: theme.gold }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={[styles.title, { color: isAndroid ? '#FFFFFF' : theme.text }]} numberOfLines={1}>Saved Villas & Estates</Text>
          <Text style={[styles.subtitle, { color: isAndroid ? 'rgba(255,255,255,0.75)' : theme.textMuted }]}>
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Pressable
            onPress={() => setShowSortModal(true)}
            style={({ pressed }) => [
              styles.headerRight,
              {
                backgroundColor: isAndroid
                  ? 'rgba(255,255,255,0.15)'
                  : (isFilterActive ? theme.gold + '20' : theme.surface),
                borderColor: isAndroid
                  ? (isFilterActive ? '#FFFFFF' : 'rgba(255,255,255,0.25)')
                  : (isFilterActive ? theme.gold : theme.border),
              },
              pressed && { opacity: 0.7 }
            ]}
          >
            <SlidersHorizontal size={18} color={isAndroid ? '#FFFFFF' : (isFilterActive ? theme.gold : theme.text)} />
            {isFilterActive && (
              <View style={[styles.filterBadgeDot, { backgroundColor: isAndroid ? '#FFFFFF' : theme.gold }]} />
            )}
          </Pressable>
          <View style={[
            styles.headerRightBadge,
            {
              backgroundColor: isAndroid ? 'rgba(255,255,255,0.15)' : 'rgba(229,57,53,0.06)',
              borderColor: isAndroid ? 'rgba(255,255,255,0.25)' : 'rgba(229,57,53,0.15)'
            }
          ]}>
            <Heart size={16} color={isAndroid ? '#FFFFFF' : '#E53935'} fill={isAndroid ? '#FFFFFF' : '#E53935'} />
            <Text style={[styles.headerRightBadgeText, { color: isAndroid ? '#FFFFFF' : '#E53935' }]}>{favorites.length}</Text>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.bg }}
        contentContainerStyle={[
          styles.scroll,
          isWeb && styles.webScroll,
          favorites.length === 0 && styles.emptyCenterScroll,
        ]}
      >
        {favorites.length === 0 ? (
          <EmptyState
            icon={<Heart size={48} color={theme.textMuted} />}
            title="No favorites yet"
            subtitle="Tap the ♡ on any property to save it here for quick access."
          />
        ) : (
          <View style={isWeb ? styles.webListGrid : styles.list}>
            {displayProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                style={getWebCardStyle()}
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
                isFavorited={favorites.includes(property.id)}
                onFavoriteToggle={() => toggleFavorite(property.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sort & Filter Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSortModal(false)} />
          <View style={[styles.modalSheet, { backgroundColor: theme.surface, borderColor: theme.border, maxHeight: '90%' }]}>
            {/* Handle bar for visual indicator */}
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Filters & Sort</Text>
              <Pressable
                onPress={() => setShowSortModal(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
              >
                <X size={20} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '100%' }}>
              {/* Location Section */}
              <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Filter by Location</Text>
              <View style={styles.modalChipsContainer}>
                {cities.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <Pressable
                      key={city}
                      onPress={() => setSelectedCity(city)}
                      style={({ pressed }) => [
                        styles.modalChip,
                        {
                          backgroundColor: isSelected ? theme.gold : theme.surface,
                          borderColor: isSelected ? theme.gold : theme.border,
                        },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={[
                        styles.modalChipText,
                        { color: isSelected ? theme.textInverse : theme.textSecondary }
                      ]}>
                        {city}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

              {/* Sort Section */}
              <Text style={[styles.modalSectionTitle, { color: theme.text }]}>Sort By</Text>
              <View style={styles.optionsList}>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.key;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setSortBy(opt.key)}
                      style={({ pressed }) => [
                        styles.optionRow,
                        { borderColor: theme.border },
                        isSelected && { backgroundColor: theme.gold + '10' },
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={[
                        styles.optionText,
                        { color: isSelected ? theme.gold : theme.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}>
                        {opt.label}
                      </Text>
                      {isSelected && (
                        <Check size={18} color={theme.gold} />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => {
                    setSelectedCity('All');
                    setSortBy('all');
                  }}
                  style={({ pressed }) => [
                    styles.actionBtnSecondary,
                    { borderColor: theme.border },
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <Text style={[styles.actionBtnSecondaryText, { color: theme.textSecondary }]}>Reset All</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowSortModal(false)}
                  style={({ pressed }) => [
                    styles.actionBtnPrimary,
                    { backgroundColor: theme.gold },
                    pressed && { opacity: 0.8 }
                  ]}
                >
                  <Text style={[styles.actionBtnPrimaryText, { color: theme.textInverse }]}>Apply Filters</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  webHeaderWrap: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 2 },
  headerRight: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center', justifyContent: 'center',
  },
  filterIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  sortRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  scroll: { paddingBottom: 100 },
  webScroll: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  emptyCenterScroll: { flexGrow: 1 },
  list: { paddingHorizontal: 20 },
  webListGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  filterBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  optionsList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  modalChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  modalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalDivider: {
    height: 1,
    marginVertical: 16,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    marginBottom: 8,
  },
  actionBtnPrimary: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  headerRightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  headerRightBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
