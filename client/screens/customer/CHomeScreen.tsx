import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, RefreshControl,
  StyleSheet, Image, TextInput, Platform, useWindowDimensions, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Bell, MapPin, Star, ArrowRight, ChevronDown, Calendar, Users, BedDouble,
  Search, TrendingUp, Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import PropertyCard from '../../components/customer/PropertyCard';
import RedesignedPropertyCard from '../../components/customer/RedesignedPropertyCard';
import CalendarPicker from '../../components/customer/CalendarPicker';
import GuestCounter from '../../components/customer/GuestCounter';
import WebHeader from '../../components/WebHeader';

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

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80';

export default function CHomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { properties, customerBookings } = useData();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['prop_1', 'prop_4']);

  // --- Web Home Screen States & Logic ---
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const filteredProperties = selectedCategory === 'All'
    ? properties
    : properties.filter((p) => p.category === selectedCategory.toLowerCase());

  const featuredProperties = properties.filter((p) => p.featured);
  const upcomingBooking = customerBookings.find((b) => b.status === 'upcoming');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // --- Mobile Redesigned Home Screen States & Logic ---
  const [searchQuery, setSearchQuery] = useState('');
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Modal controls
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    navigation.navigate('Search', {
      query: searchQuery,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: String(adults + children),
      activeTab: 'results',
    });
  };

  const recommendedProperties = selectedCategory === 'All'
    ? properties.filter((p) => p.featured)
    : properties.filter((p) => p.category === selectedCategory.toLowerCase());

  const nearYouProperties = selectedCategory === 'All'
    ? properties.filter((p) => !p.featured)
    : properties.filter((p) => p.category === selectedCategory.toLowerCase());

  const formatDateLabel = () => {
    if (checkIn && checkOut) {
      const format = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      };
      return `${format(checkIn)} — ${format(checkOut)}`;
    }
    if (checkIn) {
      const d = new Date(checkIn);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return 'Check-in date — Check-out date';
  };

  // --- Render Web Home Screen ---
  const renderWebHome = () => {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg }]} edges={['top']}>
        {Platform.OS === 'web' && <WebHeader />}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          style={{ backgroundColor: theme.bg }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.gold}
            />
          }
        >
          {/* Header & Search Bar (Mobile only) */}
          {Platform.OS !== 'web' && (
            <>
              <View style={[styles.header, Platform.OS === 'android' && { backgroundColor: theme.gold }]}>
                <View>
                  <Text style={[styles.greeting, { color: Platform.OS === 'android' ? 'rgba(255,255,255,0.75)' : theme.textMuted }]}>
                    {getGreeting()} 👋
                  </Text>
                  <Text style={[styles.userName, { color: Platform.OS === 'android' ? '#FFFFFF' : theme.text }]}>{firstName}</Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate('CNotifications')}
                  style={({ pressed }) => [
                    styles.notifBtn,
                    {
                      backgroundColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.15)' : theme.surface,
                      borderColor: Platform.OS === 'android' ? 'rgba(255,255,255,0.25)' : theme.border
                    },
                    pressed && { opacity: 0.6 }
                  ]}
                >
                  <Bell size={20} color={Platform.OS === 'android' ? '#FFFFFF' : theme.text} />
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

          {/* Upcoming Stay Banner */}
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

          {/* Offers Carousel */}
          <View style={styles.sectionHeaderWeb}>
            <Text style={[styles.sectionTitleWeb, { color: theme.text }]}>✨ Special Offers</Text>
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

          {/* Featured Properties */}
          <View style={styles.sectionHeaderWeb}>
            <View style={styles.sectionLeft}>
              <Star size={16} color={theme.gold} fill={theme.gold} />
              <Text style={[styles.sectionTitleWeb, { color: theme.text }]}>Featured Stays</Text>
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

          {/* Category Filter */}
          <View style={styles.sectionHeaderWeb}>
            <View style={styles.sectionLeft}>
              <MapPin size={16} color={theme.gold} />
              <Text style={[styles.sectionTitleWeb, { color: theme.text }]}>Explore by Type</Text>
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

          {/* All Properties */}
          <View style={styles.sectionHeaderWeb}>
            <View style={styles.sectionLeft}>
              <TrendingUp size={16} color={theme.gold} />
              <Text style={[styles.sectionTitleWeb, { color: theme.text }]}>
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
  };

  // --- Render Mobile (Android & iOS) Home Screen ---
  const renderMobileHome = () => {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: '#1A5C4E' }]} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollMobile}
          style={{ backgroundColor: '#F8F9FB' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
        >
          {/* Curved Blue Banner */}
          <View style={styles.blueBanner}>
            <View style={styles.headerRow}>
              {/* User Profile Avatar */}
              <Image
                source={{ uri: user?.avatarUrl || DEFAULT_AVATAR }}
                style={styles.avatar}
              />

              {/* Location selector */}
              <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>Location</Text>
                <Pressable
                  onPress={() => navigation.navigate('Search')}
                  style={styles.locationSelectorRow}
                >
                  <MapPin size={12} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.locationValueText}>New York, USA</Text>
                  <ChevronDown size={12} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Bell Icon with red badge */}
              <Pressable
                onPress={() => navigation.navigate('CNotifications')}
                style={styles.bellBtn}
              >
                <Bell size={18} color="#111111" />
                <View style={styles.redBadge} />
              </Pressable>
            </View>
          </View>

          {/* Overlapping Search Card */}
          <View style={[styles.searchCard, { backgroundColor: '#FFFFFF' }]}>
            <Text style={styles.searchCardTitle}>
              Where do you <Text style={{ color: '#C9A14A', fontWeight: '800' }}>want to stay?</Text>
            </Text>

            {/* Search Input */}
            <View style={styles.inputRow}>
              <MapPin size={18} color="#9AA0A6" />
              <TextInput
                style={styles.textInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search Hotel.."
                placeholderTextColor="#9AA0A6"
              />
            </View>

            {/* Check-in Date */}
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.inputRow}
            >
              <Calendar size={18} color="#9AA0A6" />
              <Text style={[styles.inputText, !checkIn && { color: '#9AA0A6' }]}>
                {formatDateLabel()}
              </Text>
            </Pressable>

            {/* Guests & Rooms Row */}
            <View style={styles.splitRow}>
              {/* Guests Box */}
              <Pressable
                onPress={() => setShowGuestPicker(true)}
                style={[styles.inputRow, { flex: 1, marginTop: 0 }]}
              >
                <Users size={18} color="#9AA0A6" />
                <Text style={styles.inputText}>
                  {adults + children === 1 ? '1 Guest' : `${adults + children} Guests`}
                </Text>
              </Pressable>

              {/* Rooms Box */}
              <Pressable
                onPress={() => setShowGuestPicker(true)}
                style={[styles.inputRow, { flex: 1, marginTop: 0 }]}
              >
                <BedDouble size={18} color="#9AA0A6" />
                <Text style={styles.inputText}>
                  {rooms === 1 ? '1 Room' : `${rooms} Rooms`}
                </Text>
              </Pressable>
            </View>

            {/* Search Button */}
            <Pressable
              onPress={handleSearch}
              style={({ pressed }) => [
                styles.searchBtn,
                pressed && { opacity: 0.9 }
              ]}
            >
              <Text style={styles.searchBtnText}>Search</Text>
            </Pressable>
          </View>

          {/* Explore by Type Section */}
          <View style={[styles.sectionHeaderMobile, { marginTop: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="#1A5C4E" />
              <Text style={[styles.sectionTitleMobile, { color: theme.text }]}>Explore by Type</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mobileCategoriesRow}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={({ pressed }) => [
                    styles.mobileCategoryChip,
                    {
                      backgroundColor: isSelected ? '#1A5C4E' : theme.surface,
                      borderColor: isSelected ? '#1A5C4E' : theme.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.mobileCategoryText,
                      { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Recommended Hotel Section */}
          <View style={styles.sectionHeaderMobile}>
            <Text style={[styles.sectionTitleMobile, { color: theme.text }]}>Recommended Hotel</Text>
            <Pressable onPress={() => navigation.navigate('Search', { activeTab: 'results' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {recommendedProperties.map((property) => (
              <RedesignedPropertyCard
                key={property.id}
                property={property}
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
                isFavorited={favorites.includes(property.id)}
                onFavoriteToggle={() => toggleFavorite(property.id)}
              />
            ))}
          </ScrollView>

          {/* Hotel Near You Section */}
          <View style={[styles.sectionHeaderMobile, { marginTop: 12 }]}>
            <Text style={[styles.sectionTitleMobile, { color: theme.text }]}>Hotel Near You</Text>
            <Pressable onPress={() => navigation.navigate('Search', { activeTab: 'results' })}>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {nearYouProperties.map((property) => (
              <RedesignedPropertyCard
                key={property.id}
                property={property}
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
                isFavorited={favorites.includes(property.id)}
                onFavoriteToggle={() => toggleFavorite(property.id)}
              />
            ))}
          </ScrollView>
        </ScrollView>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Dates</Text>
              <CalendarPicker
                checkIn={checkIn}
                checkOut={checkOut}
                onDatesChange={(ci, co) => {
                  setCheckIn(ci);
                  setCheckOut(co);
                }}
              />
              <Pressable
                onPress={() => setShowDatePicker(false)}
                style={[styles.modalCloseBtn, { backgroundColor: '#C9A14A' }]}
              >
                <Text style={styles.modalCloseBtnText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Guest & Room Picker Modal */}
        <Modal
          visible={showGuestPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGuestPicker(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Guests & Rooms</Text>
              <View style={{ gap: 12 }}>
                <Text style={[styles.modalSectionLabel, { color: theme.textSecondary }]}>Guests</Text>
                <GuestCounter
                  adults={adults}
                  children={children}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                  maxCapacity={10}
                />
                
                <Text style={[styles.modalSectionLabel, { color: theme.textSecondary, marginTop: 8 }]}>Rooms</Text>
                <View style={styles.counterRow}>
                  <Text style={[styles.counterLabel, { color: theme.text }]}>Number of Rooms</Text>
                  <View style={styles.counterControls}>
                    <Pressable
                      onPress={() => setRooms(Math.max(1, rooms - 1))}
                      style={[styles.counterBtn, { borderColor: theme.border }]}
                    >
                      <Text style={{ fontSize: 18, color: theme.text }}>-</Text>
                    </Pressable>
                    <Text style={[styles.counterValue, { color: theme.text }]}>{rooms}</Text>
                    <Pressable
                      onPress={() => setRooms(rooms + 1)}
                      style={[styles.counterBtn, { borderColor: theme.border }]}
                    >
                      <Text style={{ fontSize: 18, color: theme.text }}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              
              <Pressable
                onPress={() => setShowGuestPicker(false)}
                style={[styles.modalCloseBtn, { backgroundColor: '#C9A14A', marginTop: 16 }]}
              >
                <Text style={styles.modalCloseBtnText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };

  return isWeb ? renderWebHome() : renderMobileHome();
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingTop: Platform.OS === 'web' ? 16 : 0,
    paddingBottom: 100,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1280 : undefined,
    alignSelf: Platform.OS === 'web' ? 'center' : undefined,
  },
  scrollMobile: {
    paddingBottom: 100,
    width: '100%',
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
  sectionHeaderWeb: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 12, marginTop: 4,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitleWeb: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
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

  // Mobile Redesigned Styles
  blueBanner: {
    backgroundColor: '#1A5C4E',
    height: 170,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    color: '#D0E3FF',
    fontSize: 11,
    fontWeight: '500',
  },
  locationSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationValueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  redBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  searchCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginTop: -65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    marginBottom: 20,
  },
  searchCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F4F6F9',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#202124',
    padding: 0,
  },
  inputText: {
    fontSize: 13,
    color: '#202124',
    flex: 1,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  searchBtn: {
    backgroundColor: '#C9A14A',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  searchBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeaderMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitleMobile: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    color: '#C9A14A',
    fontWeight: '600',
  },
  horizontalScrollContent: {
    paddingLeft: 20,
    paddingRight: 4,
    paddingBottom: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalCloseBtn: {
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    backgroundColor: '#FAFBFD',
  },
  counterLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  mobileCategoriesRow: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 8,
    paddingBottom: 14,
  },
  mobileCategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileCategoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

