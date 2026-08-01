import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, RefreshControl,
  StyleSheet, Image, TextInput, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Search, Bell, MapPin, TrendingUp, Star, ArrowRight, Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import PropertyCard from '../../components/customer/PropertyCard';
import WebHeader from '../../components/WebHeader';
import { formatMoney } from '../../lib/format';

const CATEGORIES = ['All', 'Villa', 'Farmhouse', 'Cottage', 'Resort'];

const FEATURED_OFFERS = [
  {
    id: 'off1',
    title: 'Monsoon Magic',
    subtitle: 'Flat 20% off · Farmhouses',
    bg: '#1A2E1A',
    accent: '#5BAE7A',
    emoji: '🌧️',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'off2',
    title: 'Hilltop Escapes',
    subtitle: 'Starting ₹14,000 · Limited slots',
    bg: '#1A1A2E',
    accent: '#5B8FC4',
    emoji: '⛰️',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=500&q=80',
  },
];

export default function CHomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { properties, customerBookings } = useData();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['prop_1', 'prop_4']);

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

  const firstName = user?.name?.split(' ')[0] ?? 'Explorer';

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const filteredProperties = selectedCategory === 'All'
    ? properties
    : properties.filter((p) => p.category === selectedCategory.toLowerCase());

  const featuredProperties = properties.filter((p) => p.featured);
  const upcomingBooking = customerBookings.find((b) => b.status === 'upcoming');

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {Platform.OS === 'web' && <WebHeader />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.gold}
          />
        }
      >
        {/* ── Header ── */}
        {/* ── Header & Search Bar (Mobile only) ── */}
        {Platform.OS !== 'web' && (
          <>
            <View style={styles.header}>
              <View>
                <Text style={[styles.greeting, { color: theme.textMuted }]}>
                  {getGreeting()} 👋
                </Text>
                <Text style={[styles.userName, { color: theme.text }]}>{firstName}</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('CNotifications')}
                style={({ pressed }) => [styles.notifBtn, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && { opacity: 0.6 }]}
              >
                <Bell size={20} color={theme.text} />
                <View style={styles.notifDot} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => navigation.navigate('Search')}
              style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Search size={18} color={theme.gold} />
              <Text style={[styles.searchPlaceholder, { color: theme.textMuted }]}>
                Search destinations, villas…
              </Text>
              <View style={[styles.searchFilter, { backgroundColor: theme.gold }]}>
                <Text style={[styles.searchFilterText, { color: theme.textInverse }]}>Search</Text>
              </View>
            </Pressable>
          </>
        )}

        {/* ── Upcoming Stay Banner ── */}
        {upcomingBooking && (
          <Pressable
            onPress={() => navigation.navigate('CBookingDetail', { bookingId: upcomingBooking.id })}
            style={[styles.upcomingBanner, { backgroundColor: theme.goldGlow, borderColor: theme.goldSoft + '33' }]}
          >
            <View style={styles.upcomingLeft}>
              <Sparkles size={16} color={theme.gold} />
              <View style={styles.upcomingText}>
                <Text style={[styles.upcomingTitle, { color: theme.text }]}>
                  Upcoming Stay
                </Text>
                <Text style={[styles.upcomingSubtitle, { color: theme.textSecondary }]}>
                  {upcomingBooking.propertyTitle} · {upcomingBooking.checkIn}
                </Text>
              </View>
            </View>
            <ArrowRight size={18} color={theme.gold} />
          </Pressable>
        )}

        {/* ── Offers Carousel ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>✨ Special Offers</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offersRow}
        >
          {FEATURED_OFFERS.map((offer) => (
            <Pressable
              key={offer.id}
              style={({ pressed }) => [styles.offerCard, pressed && { opacity: 0.9 }]}
            >
              <Image source={{ uri: offer.image }} style={styles.offerImage} resizeMode="cover" />
              <View style={[styles.offerOverlay]} />
              <View style={styles.offerContent}>
                <Text style={styles.offerEmoji}>{offer.emoji}</Text>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Featured Properties ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <Star size={16} color={theme.gold} fill={theme.gold} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Stays</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Search')}>
            <Text style={[styles.seeAll, { color: theme.gold }]}>See all</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              horizontal
              onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
              isFavorited={favorites.includes(property.id)}
              onFavoriteToggle={() => toggleFavorite(property.id)}
            />
          ))}
        </ScrollView>

        {/* ── Category Filter ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <MapPin size={16} color={theme.gold} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore by Type</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={({ pressed }) => [
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === cat ? theme.gold : theme.surface,
                  borderColor: selectedCategory === cat ? theme.gold : theme.border,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === cat ? theme.textInverse : theme.textSecondary },
              ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── All Properties ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <TrendingUp size={16} color={theme.gold} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {selectedCategory === 'All' ? 'All Properties' : selectedCategory + 's'}
            </Text>
          </View>
          <Text style={[styles.countText, { color: theme.textMuted }]}>
            {filteredProperties.length} found
          </Text>
        </View>

        <View style={styles.propertiesList}>
          {filteredProperties.map((property) => (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingTop: Platform.OS === 'web' ? 16 : 0,
    paddingBottom: 100,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1280 : undefined,
    alignSelf: Platform.OS === 'web' ? 'center' : undefined,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: { fontSize: 13, fontWeight: '500' },
  userName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E53935', borderWidth: 1.5, borderColor: '#fff',
  },
  webSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 32,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'space-between',
  },
  webSearchSegment: {
    flex: 1,
    paddingHorizontal: 8,
  },
  webSearchLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  webSearchSub: {
    fontSize: 13,
    marginTop: 2,
  },
  webSearchDivider: {
    width: 1,
    height: 28,
  },
  webSearchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 20, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth,
    paddingLeft: 16, paddingRight: 6, paddingVertical: 6,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  searchPlaceholder: { flex: 1, fontSize: 14 },
  searchFilter: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12,
  },
  searchFilterText: { color: '#111111', fontSize: 13, fontWeight: '700' },
  upcomingBanner: {
    marginHorizontal: 20, borderRadius: 14, borderWidth: 1,
    padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20,
  },
  upcomingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  upcomingText: { flex: 1 },
  upcomingTitle: { fontSize: 14, fontWeight: '700' },
  upcomingSubtitle: { fontSize: 12, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 12, marginTop: 4,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  seeAll: { fontSize: 14, fontWeight: '600' },
  countText: { fontSize: 13 },
  offersRow: { paddingHorizontal: 20, gap: 12, paddingBottom: 8 },
  offerCard: {
    width: 220, height: 130, borderRadius: 18,
    overflow: 'hidden', position: 'relative',
  },
  offerImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  offerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  offerContent: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 14,
  },
  offerEmoji: { fontSize: 22, marginBottom: 4 },
  offerTitle: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  offerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  horizontalList: { paddingHorizontal: 20, gap: 14, paddingBottom: 8 },
  categoriesRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1,
  },
  categoryText: { fontSize: 13, fontWeight: '600' },
  propertiesList: {
    paddingHorizontal: 20,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
    gap: Platform.OS === 'web' ? 20 : 16,
  },
});
