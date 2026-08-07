import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions,
  NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AddOnSelector from '../../components/customer/AddOnSelector';
import {
  Share2, Heart, Star, ChevronLeft, ArrowLeft,
  MapPin, Compass, Navigation, Landmark,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { properties, reviews } from '../../lib/mockData';
import ImageGallery from '../../components/customer/ImageGallery';
import AmenitiesGrid from '../../components/customer/AmenitiesGrid';
import ReviewCard from '../../components/customer/ReviewCard';
import CalendarPicker from '../../components/customer/CalendarPicker';
import BookingWidget from '../../components/customer/BookingWidget';
import SleepingArrangements from '../../components/customer/SleepingArrangements';
import ReviewSummary from '../../components/customer/ReviewSummary';
import PropertyMap from '../../components/customer/PropertyMap';
import HostSection from '../../components/customer/HostSection';
import ThingsToKnow from '../../components/customer/ThingsToKnow';
import SectionNav, {
  SECTION_NAV_HEIGHT,
  SECTION_NAV_TABS,
  type SectionNavId,
} from '../../components/customer/SectionNav';

function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    villa: 'Entire villa',
    farmhouse: 'Entire farmhouse',
    cottage: 'Entire cottage',
    resort: 'Entire resort unit',
  };
  return map[category] ?? 'Entire rental unit';
}

export default function PropertyDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { propertyId } = route.params ?? {};

  const isWeb = Platform.OS === 'web';
  const isDesktopWeb = isWeb && width >= 1024;

  const property = properties.find((p) => p.id === propertyId) ?? properties[0];
  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);

  const [isFav, setIsFav] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);

  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);
  const sectionRefs = useRef<Partial<Record<SectionNavId, View | null>>>({});
  const offsetsRef = useRef<Partial<Record<SectionNavId, number>>>({});
  const galleryBottomRef = useRef(0);

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [navVisible, setNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionNavId>('photos');
  const [webHeaderHeight, setWebHeaderHeight] = useState(56);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const avgRating = propertyReviews.length > 0
    ? (propertyReviews.reduce((s, r) => s + r.rating, 0) / propertyReviews.length).toFixed(1)
    : property.rating.toFixed(1);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
    );
  }, [checkIn, checkOut]);

  const cancellationHint = useMemo(() => {
    if (!checkIn) return property.cancellationPolicy?.split('.')[0] ?? undefined;
    const d = new Date(checkIn);
    d.setDate(d.getDate() - 1);
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
    return `Free cancellation before ${label}`;
  }, [checkIn, property.cancellationPolicy]);

  const host = property.hostProfile ?? {
    name: property.caretakerName,
    initials: property.caretakerName.split(' ').map((n) => n[0]).join('').slice(0, 2),
    isVerified: true,
    responseRate: 96,
    responseTime: 'Responds within a few hours',
    bioLines: [`Lives in ${property.city}, ${property.state}`],
  };

  const remasureSections = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    SECTION_NAV_TABS.forEach(({ id }) => {
      const node = sectionRefs.current[id];
      if (!node) return;
      node.measureLayout(
        content as any,
        (_x, y) => {
          offsetsRef.current[id] = y;
        },
        () => {},
      );
    });
  }, []);

  const setSectionRef = useCallback((id: SectionNavId) => (node: View | null) => {
    sectionRefs.current[id] = node;
  }, []);

  const onSectionLayout = useCallback((id: SectionNavId) => () => {
    const node = sectionRefs.current[id];
    const content = contentRef.current;
    if (!node || !content) return;
    node.measureLayout(
      content as any,
      (_x, y) => {
        offsetsRef.current[id] = y;
      },
      () => {},
    );
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Sticky section nav is web-only
    if (Platform.OS !== 'web') return;

    const y = e.nativeEvent.contentOffset.y;
    // Show once user scrolls past the photo gallery (fallback threshold 200)
    const threshold = galleryBottomRef.current > 0
      ? Math.max(120, galleryBottomRef.current - 40)
      : 200;
    const show = y > threshold;
    setNavVisible(show);

    if (!show) return;

    const probe = y + SECTION_NAV_HEIGHT + 64;
    let next: SectionNavId = 'photos';
    for (const { id } of SECTION_NAV_TABS) {
      const oy = offsetsRef.current[id];
      if (oy != null && oy <= probe) next = id;
    }
    setActiveSection((prev) => (prev === next ? prev : next));
  }, []);

  const scrollToSection = useCallback((id: SectionNavId) => {
    const y = offsetsRef.current[id];
    // Extra offset so sticky nav never covers section titles / map
    const pad = SECTION_NAV_HEIGHT + 24;
    if (y == null) {
      remasureSections();
      setTimeout(() => {
        const retry = offsetsRef.current[id];
        if (retry != null) {
          scrollRef.current?.scrollTo({ y: Math.max(0, retry - pad), animated: true });
        }
      }, 50);
      return;
    }
    setActiveSection(id);
    scrollRef.current?.scrollTo({ y: Math.max(0, y - pad), animated: true });
  }, [remasureSections]);

  const onGalleryLayout = (e: LayoutChangeEvent) => {
    const { y, height } = e.nativeEvent.layout;
    galleryBottomRef.current = y + height;
    remasureSections();
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('CustomerTabs');
  };

  const handleShare = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: property.title, text: property.shortDescription });
      } catch { /* cancelled */ }
    }
  };

  const handleReserve = () => {
    navigation.navigate('BookingFlow', {
      propertyId: property.id,
      checkIn,
      checkOut,
      guests,
    });
  };

  const divider = <View style={[styles.divider, { backgroundColor: theme.border }]} />;

  const overviewBlock = (
    <View style={styles.overview}>
      <Text style={[styles.overviewTitle, { color: theme.text }]}>
        {categoryLabel(property.category)} in {property.city}, {property.state}
      </Text>
      <Text style={[styles.overviewMeta, { color: theme.text }]}>
        {property.capacity} guests · {property.bedrooms} bedrooms · {property.bedrooms} beds · {property.bathrooms} bathrooms
      </Text>
      <Pressable
        onPress={() => navigation.navigate('Reviews', { propertyId: property.id })}
        style={styles.ratingLinkRow}
      >
        <Star size={14} color={theme.text} fill={theme.text} />
        <Text style={[styles.ratingLink, { color: theme.text }]}>
          {avgRating} · <Text style={styles.reviewsUnderline}>{property.reviewCount} reviews</Text>
        </Text>
      </Pressable>

      {divider}

      <View style={styles.hostedRow}>
        <View style={[styles.hostAvatar, { backgroundColor: theme.goldGlow }]}>
          <Text style={[styles.hostAvatarText, { color: theme.gold }]}>{host.initials}</Text>
        </View>
        <View>
          <Text style={[styles.hostedBy, { color: theme.text }]}>Hosted by {host.name.split(' ')[0]}</Text>
          <Text style={[styles.hostedSub, { color: theme.textMuted }]}>
            {host.isVerified ? 'Verified host' : 'Host'}
          </Text>
        </View>
      </View>

      {divider}

      <Text style={[styles.description, { color: theme.textSecondary }]}>{property.description}</Text>
    </View>
  );

  const mainColumn = (
    <View style={[styles.mainColumn, isDesktopWeb && styles.mainColumnDesktop]}>
      {overviewBlock}

      {divider}

      {property.sleepingArrangements && property.sleepingArrangements.length > 0 && (
        <>
          <View ref={setSectionRef('rooms')} collapsable={false} onLayout={onSectionLayout('rooms')}>
            <SleepingArrangements arrangements={property.sleepingArrangements} />
          </View>
          {divider}
        </>
      )}

      <View ref={setSectionRef('amenities')} collapsable={false} onLayout={onSectionLayout('amenities')}>
        <AmenitiesGrid
          amenities={property.amenities}
          showAll={showAllAmenities}
          onToggleShowAll={() => setShowAllAmenities((v) => !v)}
          maxVisible={10}
        />
      </View>

      {divider}

      {/* Point 2: Luxury Experience Add-ons */}
      <AddOnSelector selectedIds={selectedAddOns} onToggleAddOn={toggleAddOn} />

      {divider}

      <View style={styles.calendarSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {nights > 0
            ? `${nights} night${nights > 1 ? 's' : ''} in ${property.city}`
            : `Select check-in date`}
        </Text>
        {checkIn && checkOut && (
          <Text style={[styles.calendarSub, { color: theme.textMuted }]}>
            {checkIn} – {checkOut}
          </Text>
        )}
        <CalendarPicker
          checkIn={checkIn}
          checkOut={checkOut}
          onDatesChange={(cin, cout) => {
            setCheckIn(cin);
            setCheckOut(cout);
          }}
          minNights={property.minNights}
          dualMonth={isDesktopWeb}
        />
      </View>

      {divider}

      {propertyReviews.length > 0 && (
        <>
          <View>
            <ReviewSummary
              reviews={propertyReviews}
              avgRating={avgRating}
              reviewCount={property.reviewCount}
            />
            <View style={[styles.reviewsGrid, isDesktopWeb && styles.reviewsGridDesktop]}>
              {propertyReviews.slice(0, 6).map((review) => (
                <View
                  key={review.id}
                  style={[styles.reviewCell, isDesktopWeb && styles.reviewCellDesktop]}
                >
                  <ReviewCard review={review} listing />
                </View>
              ))}
            </View>
            <Pressable
              onPress={() => navigation.navigate('Reviews', { propertyId: property.id })}
              style={({ pressed }) => [
                styles.showAllReviewsBtn,
                { borderColor: theme.text },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.showAllReviewsText, { color: theme.text }]}>
                Show all {property.reviewCount} reviews
              </Text>
            </Pressable>
          </View>
          {divider}
        </>
      )}

      <View
        ref={setSectionRef('location')}
        collapsable={false}
        onLayout={onSectionLayout('location')}
        style={styles.locationAnchor}
      >
        <PropertyMap
          city={property.city}
          state={property.state}
          lat={property.lat}
          lng={property.lng}
        />
      </View>

      {/* Point 1: Neighborhood Guide */}
      <View style={[styles.neighborhoodCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.neighborhoodHeader}>
          <Compass size={18} color={theme.gold} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Neighborhood & Nearby Attractions</Text>
        </View>
        <Text style={[styles.neighborhoodSub, { color: theme.textMuted }]}>
          Explore popular spots around {property.city}, {property.state}
        </Text>
        <View style={styles.attractionsGrid}>
          <View style={[styles.attractionItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Landmark size={16} color={theme.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.attractionName, { color: theme.text }]}>{property.city} Promenade & Nature Trail</Text>
              <Text style={[styles.attractionDist, { color: theme.textMuted }]}>800 m away · 10 min walk</Text>
            </View>
          </View>
          <View style={[styles.attractionItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Navigation size={16} color={theme.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.attractionName, { color: theme.text }]}>Scenic Viewpoint & Sanctuary</Text>
              <Text style={[styles.attractionDist, { color: theme.textMuted }]}>2.5 km away · 8 min drive</Text>
            </View>
          </View>
          <View style={[styles.attractionItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <MapPin size={16} color={theme.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.attractionName, { color: theme.text }]}>International Airport & Station</Text>
              <Text style={[styles.attractionDist, { color: theme.textMuted }]}>45 km away · 60 min drive</Text>
            </View>
          </View>
        </View>
      </View>

      {divider}

      <View style={styles.hostAnchor}>
        <HostSection
          host={host}
          reviewCount={property.reviewCount}
          rating={parseFloat(avgRating)}
          onMessage={() => navigation.navigate('Support')}
        />
      </View>

      {divider}

      <View style={styles.thingsAnchor}>
        <ThingsToKnow
          cancellationPolicy={
            property.cancellationPolicy
            ?? 'Free cancellation before check-in. Review the full policy for details.'
          }
          checkInTime={property.checkInTime}
          checkOutTime={property.checkOutTime}
          maxGuests={property.capacity}
          houseRules={property.houseRules}
          safetyNotes={
            property.safetyNotes
            ?? ['Exterior security cameras on property', 'Smoke alarm not reported', 'Carbon monoxide alarm not reported']
          }
        />
      </View>
    </View>
  );

  const stickyTop = isWeb ? webHeaderHeight : insets.top;

  return (
    <View style={[styles.container, isWeb && styles.webContainer, { backgroundColor: theme.bg }]}>
      {/* Top chrome */}
      {isWeb ? (
        <View
          style={[styles.webHeaderBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
          onLayout={(e) => setWebHeaderHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.webHeaderInner}>
            <Pressable
              onPress={handleGoBack}
              style={({ pressed }) => [
                styles.webBackBtn,
                { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                pressed && { opacity: 0.7 },
              ]}
            >
              <ArrowLeft size={16} color={theme.text} />
              <Text style={[styles.webBackText, { color: theme.text }]}>Back to Explore</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <SafeAreaView edges={['top']} style={styles.floatingHeader}>
          <Pressable onPress={handleGoBack} style={styles.backBtn}>
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
          <View style={styles.floatingRight}>
            <Pressable style={styles.floatingActionBtn} onPress={handleShare}>
              <Share2 size={18} color="#fff" />
            </Pressable>
            <Pressable onPress={() => setIsFav((v) => !v)} style={styles.floatingActionBtn}>
              <Heart size={18} color={isFav ? '#E53935' : '#fff'} fill={isFav ? '#E53935' : 'transparent'} />
            </Pressable>
          </View>
        </SafeAreaView>
      )}

      {/* Sticky section nav — WEB ONLY (hidden on iOS / Android / mobile) */}
      {isWeb && navVisible && (
        <View
          style={[
            styles.sectionNavWrap,
            {
              top: stickyTop,
              backgroundColor: theme.surface,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <SectionNav
            visible
            activeId={activeSection}
            onPress={scrollToSection}
          />
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={isWeb}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onContentSizeChange={remasureSections}
        contentContainerStyle={[
          styles.scroll,
          isWeb && styles.webScroll,
          !isDesktopWeb && { paddingBottom: 100 },
        ]}
      >
        <View ref={contentRef} collapsable={false} onLayout={remasureSections}>
          {/* Title row (web) */}
          {isWeb && (
            <View style={styles.titleRow}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>{property.title}</Text>
              <View style={styles.titleActions}>
                <Pressable onPress={handleShare} style={styles.textAction}>
                  <Share2 size={15} color={theme.text} />
                  <Text style={[styles.textActionLabel, { color: theme.text }]}>Share</Text>
                </Pressable>
                <Pressable onPress={() => setIsFav((v) => !v)} style={styles.textAction}>
                  <Heart size={15} color={isFav ? '#E53935' : theme.text} fill={isFav ? '#E53935' : 'transparent'} />
                  <Text style={[styles.textActionLabel, { color: theme.text }]}>Save</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View
            ref={setSectionRef('photos')}
            collapsable={false}
            onLayout={(e) => {
              onGalleryLayout(e);
              onSectionLayout('photos')();
            }}
          >
            <ImageGallery images={property.images} />
          </View>

          {!isWeb && (
            <View style={styles.mobileTitleBlock}>
              <Text style={[styles.pageTitle, { color: theme.text }]}>{property.title}</Text>
              <View style={styles.titleActions}>
                <Pressable onPress={handleShare} style={styles.textAction}>
                  <Share2 size={15} color={theme.text} />
                  <Text style={[styles.textActionLabel, { color: theme.text }]}>Share</Text>
                </Pressable>
                <Pressable onPress={() => setIsFav((v) => !v)} style={styles.textAction}>
                  <Heart size={15} color={isFav ? '#E53935' : theme.text} fill={isFav ? '#E53935' : 'transparent'} />
                  <Text style={[styles.textActionLabel, { color: theme.text }]}>Save</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={[styles.content, isDesktopWeb && styles.desktopLayout]}>
            {mainColumn}

            {isDesktopWeb && (
              <View style={[styles.sidebar, navVisible && { top: SECTION_NAV_HEIGHT + 16 }]}>
                <BookingWidget
                  pricePerNight={property.pricePerNight}
                  nights={nights}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  maxGuests={property.capacity}
                  bookingType={property.bookingType}
                  cancellationHint={cancellationHint}
                  onCheckInPress={() => {}}
                  onCheckOutPress={() => {}}
                  onGuestsChange={setGuests}
                  onReserve={handleReserve}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {!isDesktopWeb && (
        <BookingWidget
          compact
          pricePerNight={property.pricePerNight}
          nights={nights}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          maxGuests={property.capacity}
          bookingType={property.bookingType}
          onGuestsChange={setGuests}
          onReserve={handleReserve}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webContainer: { height: '100%', overflow: 'hidden' },
  scrollView: { flex: 1, minHeight: 0 },
  scroll: { paddingBottom: 40 },
  webScroll: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionNavWrap: {
    // fixed on web so it stays visible while scrolling the page
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    left: 0,
    right: 0,
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  webHeaderBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 50,
  },
  webHeaderInner: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  webBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  webBackText: { fontSize: 14, fontWeight: '700' },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 50,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingRight: { flexDirection: 'row', gap: 8 },
  floatingActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  mobileTitleBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  pageTitle: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  titleActions: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingTop: 4 },
  textAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  textActionLabel: { fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },
  content: {
    paddingHorizontal: Platform.OS === 'web' ? 0 : 20,
    paddingTop: 24,
    gap: 0,
  },
  desktopLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 64,
    paddingTop: 36,
  },
  mainColumn: { gap: 0, flex: 1 },
  mainColumnDesktop: { flex: 1.6, minWidth: 0 },
  sidebar: {
    width: 372,
    position: 'sticky' as any,
    top: 24,
    zIndex: 5,
  },
  overview: { gap: 8 },
  overviewTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  overviewMeta: { fontSize: 15, marginTop: 2 },
  ratingLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  ratingLink: { fontSize: 14, fontWeight: '600' },
  reviewsUnderline: { textDecorationLine: 'underline' },
  hostedRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: { fontSize: 15, fontWeight: '800' },
  hostedBy: { fontSize: 16, fontWeight: '700' },
  hostedSub: { fontSize: 13, marginTop: 2 },
  description: { fontSize: 15, lineHeight: 24 },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginVertical: 28,
  },
  calendarSection: { gap: 8 },
  sectionTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  calendarSub: { fontSize: 14, marginBottom: 8 },
  reviewsGrid: { gap: 28, marginTop: 28 },
  reviewsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 40,
    rowGap: 36,
  },
  reviewCell: { width: '100%' },
  reviewCellDesktop: { width: '47%' },
  showAllReviewsBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginTop: 24,
  },
  showAllReviewsText: { fontSize: 15, fontWeight: '700' },
  locationAnchor: {
    paddingTop: 8,
  },
  hostAnchor: {
    paddingTop: 4,
  },
  thingsAnchor: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  neighborhoodCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 10,
    marginTop: 16,
  },
  neighborhoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  neighborhoodSub: {
    fontSize: 13,
    marginBottom: 4,
  },
  attractionsGrid: {
    gap: 10,
  },
  attractionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  attractionName: {
    fontSize: 13,
    fontWeight: '700',
  },
  attractionDist: {
    fontSize: 11,
    marginTop: 2,
  },
});
