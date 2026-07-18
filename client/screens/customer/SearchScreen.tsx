import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Search, SlidersHorizontal, MapPin, X,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { properties } from '../../lib/mockData';
import PropertyCard from '../../components/customer/PropertyCard';
import FilterSheet from '../../components/customer/FilterSheet';
import CalendarPicker from '../../components/customer/CalendarPicker';
import GuestCounter from '../../components/customer/GuestCounter';
import { EmptyState } from '../../components/ui';

const PURPOSES = ['Family Vacation', 'Honeymoon', 'Corporate Retreat', 'Friends Trip', 'Birthday', 'Anniversary'];

interface FilterState {
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  amenities: string[];
  category: string;
  bookingType: string;
  guests: number;
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: 0,
  priceMax: 200000,
  bedrooms: 0,
  amenities: [],
  category: 'All',
  bookingType: 'All',
  guests: 0,
};

type SearchTab = 'dates' | 'guests' | 'purpose' | 'results';

export default function SearchScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('results');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [purpose, setPurpose] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['prop_1', 'prop_4']);

  const activeFilterCount =
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.category !== 'All' ? 1 : 0) +
    (filters.bookingType !== 'All' ? 1 : 0) +
    (filters.priceMax < 200000 ? 1 : 0);

  const filtered = properties.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.city.toLowerCase().includes(query.toLowerCase());
    const matchesPrice = p.pricePerNight >= filters.priceMin && p.pricePerNight <= filters.priceMax;
    const matchesBeds = filters.bedrooms === 0 || p.bedrooms >= filters.bedrooms;
    const matchesGuests = filters.guests === 0 || p.capacity >= filters.guests;
    const matchesCategory = filters.category === 'All' || p.category === filters.category.toLowerCase();
    const matchesBookingType =
      filters.bookingType === 'All' ||
      (filters.bookingType === 'Instant Book' && p.bookingType === 'instant') ||
      (filters.bookingType === 'Request Book' && p.bookingType === 'request');
    return matchesQuery && matchesPrice && matchesBeds && matchesGuests && matchesCategory && matchesBookingType;
  });

  const TAB_LABELS: { key: SearchTab; label: string; emoji: string }[] = [
    { key: 'dates', label: 'Dates', emoji: '📅' },
    { key: 'guests', label: 'Guests', emoji: '👥' },
    { key: 'purpose', label: 'Purpose', emoji: '🎯' },
    { key: 'results', label: 'Results', emoji: '🏡' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <View style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Search size={16} color="#C9A14A" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search destinations…"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <X size={16} color={theme.textMuted} />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setShowFilter(true)}
          style={[styles.filterBtn, { backgroundColor: activeFilterCount > 0 ? '#C9A14A' : theme.surface, borderColor: activeFilterCount > 0 ? '#C9A14A' : theme.border }]}
        >
          <SlidersHorizontal size={18} color={activeFilterCount > 0 ? '#111111' : theme.text} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Search tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {TAB_LABELS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: activeTab === tab.key ? '#C9A14A' : theme.surface,
                borderColor: activeTab === tab.key ? '#C9A14A' : theme.border,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text>{tab.emoji}</Text>
            <Text style={[styles.tabText, { color: activeTab === tab.key ? '#111111' : theme.textSecondary }]}>
              {tab.label}
            </Text>
            {tab.key === 'dates' && checkIn && (
              <View style={styles.tabDot} />
            )}
            {tab.key === 'guests' && (adults + children > 1) && (
              <View style={styles.tabDot} />
            )}
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Dates tab */}
        {activeTab === 'dates' && (
          <View style={[styles.tabContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.tabHeading, { color: theme.text }]}>Select your dates</Text>
            <CalendarPicker
              checkIn={checkIn}
              checkOut={checkOut}
              onDatesChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
              minNights={1}
            />
          </View>
        )}

        {/* Guests tab */}
        {activeTab === 'guests' && (
          <View style={[styles.tabContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.tabHeading, { color: theme.text }]}>How many guests?</Text>
            <GuestCounter
              adults={adults}
              children={children}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              maxCapacity={12}
            />
          </View>
        )}

        {/* Purpose tab */}
        {activeTab === 'purpose' && (
          <View style={[styles.tabContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.tabHeading, { color: theme.text }]}>What's the occasion?</Text>
            <View style={styles.purposeGrid}>
              {PURPOSES.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPurpose(p === purpose ? '' : p)}
                  style={({ pressed }) => [
                    styles.purposeChip,
                    {
                      backgroundColor: purpose === p ? '#C9A14A' : theme.bg,
                      borderColor: purpose === p ? '#C9A14A' : theme.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.purposeText, { color: purpose === p ? '#111111' : theme.textSecondary }]}>
                    {p}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Results tab */}
        {activeTab === 'results' && (
          <View style={styles.results}>
            <View style={styles.resultsHeader}>
              <View style={styles.resultsHeaderLeft}>
                <MapPin size={15} color="#C9A14A" />
                <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
                  <Text style={{ color: theme.text, fontWeight: '800' }}>{filtered.length}</Text>
                  {' '}properties found
                </Text>
              </View>
              {(checkIn || adults > 2) && (
                <View style={[styles.activeSearchPill, { backgroundColor: 'rgba(201,161,74,0.1)', borderColor: 'rgba(201,161,74,0.3)' }]}>
                  <Text style={styles.activeSearchText}>
                    {adults + children} guests {checkIn ? `· ${checkIn}` : ''}
                  </Text>
                </View>
              )}
            </View>
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Search size={48} color={theme.textMuted} />}
                title="No properties found"
                subtitle="Try adjusting your filters or search for a different location."
              />
            ) : (
              filtered.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
                  isFavorited={favorites.includes(property.id)}
                  onFavoriteToggle={() => setFavorites((prev) =>
                    prev.includes(property.id) ? prev.filter((f) => f !== property.id) : [...prev, property.id]
                  )}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      <FilterSheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={(f) => setFilters(f)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  searchInput: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: StyleSheet.hairlineWidth, borderRadius: 14,
    paddingHorizontal: 14, height: 46,
  },
  input: { flex: 1, fontSize: 15 },
  filterBtn: {
    width: 46, height: 46, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  filterBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center',
  },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  tabs: { paddingHorizontal: 20, gap: 8, paddingBottom: 12, flexDirection: 'row' },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, position: 'relative',
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabDot: {
    position: 'absolute', top: 5, right: 5,
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#2E7D32',
  },
  scroll: { paddingBottom: 100 },
  tabContent: {
    margin: 20, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth,
    padding: 18, gap: 16,
  },
  tabHeading: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  purposeChip: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1,
  },
  purposeText: { fontSize: 14, fontWeight: '600' },
  results: { paddingHorizontal: 20 },
  resultsHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultsCount: { fontSize: 14 },
  activeSearchPill: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  activeSearchText: { color: '#C9A14A', fontSize: 12, fontWeight: '600' },
});
