import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft, Star, Heart, Share2, MapPin, Users, BedDouble,
  Bath, Maximize, Phone, ShieldCheck, AlertTriangle,
  ChevronDown, ChevronUp,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { properties, reviews } from '../../lib/mockData';
import ImageGallery from '../../components/customer/ImageGallery';
import AmenitiesGrid from '../../components/customer/AmenitiesGrid';
import ReviewCard from '../../components/customer/ReviewCard';
import { SectionHeader } from '../../components/ui';
import { formatMoney } from '../../lib/format';

export default function PropertyDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { propertyId } = route.params ?? {};

  const property = properties.find((p) => p.id === propertyId) ?? properties[0];
  const propertyReviews = reviews.filter((r) => r.propertyId === property.id);

  const [isFav, setIsFav] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllRules, setShowAllRules] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const avgRating = propertyReviews.length > 0
    ? (propertyReviews.reduce((s, r) => s + r.rating, 0) / propertyReviews.length).toFixed(1)
    : property.rating.toFixed(1);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Floating back button */}
      <SafeAreaView edges={['top']} style={styles.floatingHeader}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <View style={styles.floatingRight}>
          <Pressable style={styles.floatingActionBtn}>
            <Share2 size={18} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => setIsFav((v) => !v)}
            style={styles.floatingActionBtn}
          >
            <Heart size={18} color={isFav ? '#E53935' : '#fff'} fill={isFav ? '#E53935' : 'transparent'} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Gallery */}
        <ImageGallery images={property.images} />

        <View style={styles.content}>
          {/* Title & Location */}
          <View style={styles.titleSection}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{property.category.toUpperCase()}</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{property.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={15} color="#C9A14A" />
              <Text style={[styles.location, { color: theme.textSecondary }]}>{property.location}</Text>
            </View>

            {/* Rating row */}
            <View style={styles.ratingRow}>
              <View style={styles.ratingLeft}>
                <Star size={16} color="#C9A14A" fill="#C9A14A" />
                <Text style={[styles.ratingValue, { color: theme.text }]}>{avgRating}</Text>
                <Text style={[styles.reviewCount, { color: theme.textMuted }]}>
                  ({property.reviewCount} reviews)
                </Text>
              </View>
              <View style={[
                styles.bookTypeBadge,
                { backgroundColor: property.bookingType === 'instant' ? 'rgba(46,125,50,0.12)' : 'rgba(201,161,74,0.12)' },
              ]}>
                <Text style={[
                  styles.bookTypeBadgeText,
                  { color: property.bookingType === 'instant' ? '#2E7D32' : '#C9A14A' },
                ]}>
                  {property.bookingType === 'instant' ? '⚡ Instant Book' : '🕐 Request Book'}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.statItem}>
              <BedDouble size={20} color="#C9A14A" />
              <Text style={[styles.statValue, { color: theme.text }]}>{property.bedrooms}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Beds</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Bath size={20} color="#C9A14A" />
              <Text style={[styles.statValue, { color: theme.text }]}>{property.bathrooms}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Baths</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Users size={20} color="#C9A14A" />
              <Text style={[styles.statValue, { color: theme.text }]}>{property.capacity}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Guests</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Maximize size={20} color="#C9A14A" />
              <Text style={[styles.statValue, { color: theme.text }]}>{property.sizeSqFt.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Sq ft</Text>
            </View>
          </View>

          {/* Description */}
          <View>
            <SectionHeader title="About" />
            <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={descExpanded ? undefined : 3}>
              {property.description}
            </Text>
            <Pressable onPress={() => setDescExpanded((v) => !v)} style={styles.expandBtn}>
              {descExpanded ? <ChevronUp size={16} color="#C9A14A" /> : <ChevronDown size={16} color="#C9A14A" />}
              <Text style={styles.expandText}>{descExpanded ? 'Show less' : 'Read more'}</Text>
            </Pressable>
          </View>

          {/* Amenities */}
          <View>
            <SectionHeader title="Amenities" />
            <AmenitiesGrid
              amenities={property.amenities}
              showAll={showAllAmenities}
              onToggleShowAll={() => setShowAllAmenities((v) => !v)}
              maxVisible={6}
            />
          </View>

          {/* House Rules */}
          <View>
            <SectionHeader title="House Rules" />
            <View style={[styles.rulesCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {(showAllRules ? property.houseRules : property.houseRules.slice(0, 3)).map((rule, i) => (
                <View key={i} style={styles.ruleRow}>
                  <AlertTriangle size={14} color="#C9A14A" />
                  <Text style={[styles.ruleText, { color: theme.textSecondary }]}>{rule}</Text>
                </View>
              ))}
              {property.houseRules.length > 3 && (
                <Pressable onPress={() => setShowAllRules((v) => !v)}>
                  <Text style={styles.ruleToggle}>
                    {showAllRules ? 'Show less ↑' : `Show all ${property.houseRules.length} rules ↓`}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Check-in/out info */}
          <View style={[styles.checkInCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.checkItem}>
              <Text style={[styles.checkLabel, { color: theme.textMuted }]}>Check-in</Text>
              <Text style={[styles.checkValue, { color: theme.text }]}>{property.checkInTime}</Text>
            </View>
            <View style={[styles.checkDivider, { backgroundColor: theme.border }]} />
            <View style={styles.checkItem}>
              <Text style={[styles.checkLabel, { color: theme.textMuted }]}>Check-out</Text>
              <Text style={[styles.checkValue, { color: theme.text }]}>{property.checkOutTime}</Text>
            </View>
            <View style={[styles.checkDivider, { backgroundColor: theme.border }]} />
            <View style={styles.checkItem}>
              <Text style={[styles.checkLabel, { color: theme.textMuted }]}>Min Stay</Text>
              <Text style={[styles.checkValue, { color: theme.text }]}>{property.minNights}N</Text>
            </View>
          </View>

          {/* Caretaker Info */}
          <View>
            <SectionHeader title="Caretaker" />
            <View style={[styles.caretakerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.caretakerAvatar, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
                <Text style={styles.caretakerInitial}>
                  {property.caretakerName.split(' ').map((n) => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.caretakerInfo}>
                <Text style={[styles.caretakerName, { color: theme.text }]}>{property.caretakerName}</Text>
                <Text style={[styles.caretakerRole, { color: theme.textMuted }]}>On-site Caretaker</Text>
              </View>
              <Pressable style={[styles.callBtn, { backgroundColor: 'rgba(46,125,50,0.1)', borderColor: 'rgba(46,125,50,0.3)' }]}>
                <Phone size={16} color="#2E7D32" />
                <Text style={styles.callBtnText}>Call</Text>
              </Pressable>
            </View>
          </View>

          {/* Security & Deposit */}
          <View>
            <SectionHeader title="Security & Pricing" />
            <View style={[styles.securityCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.secRow}>
                <ShieldCheck size={16} color="#C9A14A" />
                <Text style={[styles.secLabel, { color: theme.textSecondary }]}>Security Deposit</Text>
                <Text style={[styles.secValue, { color: theme.text }]}>{formatMoney(property.securityDeposit)}</Text>
              </View>
              <View style={[styles.secDivider, { backgroundColor: theme.border }]} />
              <View style={styles.secRow}>
                <ShieldCheck size={16} color="#C9A14A" />
                <Text style={[styles.secLabel, { color: theme.textSecondary }]}>Platform Fee</Text>
                <Text style={[styles.secValue, { color: theme.text }]}>{property.platformFeePercent}%</Text>
              </View>
              <View style={[styles.secDivider, { backgroundColor: theme.border }]} />
              <View style={styles.secRow}>
                <ShieldCheck size={16} color="#C9A14A" />
                <Text style={[styles.secLabel, { color: theme.textSecondary }]}>Refundable Deposit</Text>
                <Text style={[styles.secValue, { color: theme.text }]}>{formatMoney(property.deposit)}</Text>
              </View>
            </View>
          </View>

          {/* Reviews */}
          <View>
            <SectionHeader
              title={`Reviews (${propertyReviews.length})`}
              action={
                propertyReviews.length > 2 ? (
                  <Pressable onPress={() => navigation.navigate('Reviews', { propertyId: property.id })}>
                    <Text style={styles.seeAllReviews}>See all</Text>
                  </Pressable>
                ) : undefined
              }
            />
            {propertyReviews.slice(0, 2).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </View>

        {/* Bottom spacer for sticky bar */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Sticky Booking Bar ── */}
      <View style={[styles.bookingBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.bookingBarLeft}>
          <Text style={[styles.bookingPrice, { color: '#C9A14A' }]}>
            {formatMoney(property.pricePerNight)}
          </Text>
          <Text style={[styles.bookingPriceLabel, { color: theme.textMuted }]}>/night</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('BookingFlow', { propertyId: property.id })}
          style={({ pressed }) => [styles.bookingBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.bookingBtnText}>
            {property.bookingType === 'instant' ? 'Book Now' : 'Request Booking'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, zIndex: 10,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  floatingRight: { flexDirection: 'row', gap: 8 },
  floatingActionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingTop: 0 },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 24 },
  titleSection: { gap: 6 },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,161,74,0.12)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: { color: '#C9A14A', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, lineHeight: 32 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { fontSize: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingValue: { fontSize: 16, fontWeight: '800' },
  reviewCount: { fontSize: 13 },
  bookTypeBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  bookTypeBadgeText: { fontSize: 12, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', borderRadius: 16, borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  statLabel: { fontSize: 11 },
  statDivider: { width: StyleSheet.hairlineWidth, height: '80%', alignSelf: 'center' },
  description: { fontSize: 14, lineHeight: 22 },
  expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  expandText: { color: '#C9A14A', fontSize: 14, fontWeight: '600' },
  rulesCard: {
    borderRadius: 16, borderWidth: StyleSheet.hairlineWidth,
    padding: 14, gap: 10,
  },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  ruleText: { fontSize: 13, lineHeight: 19, flex: 1 },
  ruleToggle: { color: '#C9A14A', fontSize: 13, fontWeight: '600', marginTop: 4 },
  checkInCard: {
    flexDirection: 'row', borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16,
  },
  checkItem: { flex: 1, alignItems: 'center', gap: 4 },
  checkLabel: { fontSize: 11 },
  checkValue: { fontSize: 15, fontWeight: '700' },
  checkDivider: { width: StyleSheet.hairlineWidth, height: '80%', alignSelf: 'center' },
  caretakerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 14,
  },
  caretakerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  caretakerInitial: { color: '#C9A14A', fontSize: 16, fontWeight: '800' },
  caretakerInfo: { flex: 1 },
  caretakerName: { fontSize: 15, fontWeight: '700' },
  caretakerRole: { fontSize: 12, marginTop: 2 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
  },
  callBtnText: { color: '#2E7D32', fontSize: 13, fontWeight: '700' },
  securityCard: {
    borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 10,
  },
  secRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secLabel: { flex: 1, fontSize: 13 },
  secValue: { fontSize: 14, fontWeight: '700' },
  secDivider: { height: StyleSheet.hairlineWidth },
  seeAllReviews: { color: '#C9A14A', fontSize: 14, fontWeight: '600' },
  bookingBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 10,
  },
  bookingBarLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  bookingPrice: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  bookingPriceLabel: { fontSize: 14 },
  bookingBtn: {
    backgroundColor: '#C9A14A', borderRadius: 16,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  bookingBtnText: { color: '#111111', fontSize: 16, fontWeight: '800' },
});
