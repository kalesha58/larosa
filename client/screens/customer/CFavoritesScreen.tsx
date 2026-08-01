import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Heart, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { properties } from '../../lib/mockData';
import PropertyCard from '../../components/customer/PropertyCard';
import WebHeader from '../../components/WebHeader';
import { EmptyState } from '../../components/ui';

const INITIAL_FAVORITES = ['prop_1', 'prop_4'];

export default function CFavoritesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [favorites, setFavorites] = useState<string[]>(INITIAL_FAVORITES);
  const [sortBy, setSortBy] = useState<'recent' | 'price_low' | 'price_high' | 'rating'>('recent');

  const isWeb = Platform.OS === 'web';

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

  const favoritedProperties = properties.filter((p) => favorites.includes(p.id));

  const sorted = [...favoritedProperties].sort((a, b) => {
    if (sortBy === 'price_low') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price_high') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const SORT_OPTIONS: { key: typeof sortBy; label: string }[] = [
    { key: 'recent', label: 'Recent' },
    { key: 'price_low', label: 'Price ↑' },
    { key: 'price_high', label: 'Price ↓' },
    { key: 'rating', label: 'Rating' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {isWeb && <WebHeader />}

      {/* Header */}
      <View style={[styles.header, isWeb && styles.webHeaderWrap]}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Saved Villas & Estates</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
          </Text>
        </View>
        <View style={[styles.headerRight, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Heart size={18} color="#E53935" fill="#E53935" />
        </View>
      </View>

      {/* Sort chips */}
      {favorites.length > 0 && (
        <View style={{ height: 48, flexShrink: 0, marginBottom: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.sortRow, isWeb && styles.webHeaderWrap]}
          >
            <View style={[styles.filterIconCircle, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <SlidersHorizontal size={14} color={theme.textMuted} />
            </View>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => setSortBy(opt.key)}
                style={({ pressed }) => [
                  styles.sortChip,
                  {
                    backgroundColor: sortBy === opt.key ? theme.gold : theme.surface,
                    borderColor: sortBy === opt.key ? theme.gold : theme.border,
                  },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[
                  styles.sortChipText,
                  { color: sortBy === opt.key ? theme.textInverse : theme.textSecondary },
                ]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
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
            {sorted.map((property) => (
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
});
