import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Star, Camera, CheckCircle, Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { reviews, properties } from '../../lib/mockData';
import ReviewCard from '../../components/customer/ReviewCard';
import { EmptyState } from '../../components/ui';

export default function ReviewsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isAndroid = Platform.OS === 'android';
  const { propertyId } = route.params ?? {};

  const property = properties.find((p) => p.id === propertyId) ?? properties[0];
  const propertyReviews = reviews.filter((r) => r.propertyId === propertyId || propertyId === undefined);

  const avg = propertyReviews.length > 0
    ? (propertyReviews.reduce((s, r) => s + r.rating, 0) / propertyReviews.length).toFixed(1)
    : property.rating.toFixed(1);

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: propertyReviews.filter((r) => r.rating === star).length,
    pct: propertyReviews.length > 0
      ? (propertyReviews.filter((r) => r.rating === star).length / propertyReviews.length) * 100
      : 0,
  }));

  const avgAspects = propertyReviews.length > 0 ? {
    cleanliness: (propertyReviews.reduce((s, r) => s + r.aspects.cleanliness, 0) / propertyReviews.length).toFixed(1),
    location: (propertyReviews.reduce((s, r) => s + r.aspects.location, 0) / propertyReviews.length).toFixed(1),
    value: (propertyReviews.reduce((s, r) => s + r.aspects.value, 0) / propertyReviews.length).toFixed(1),
    service: (propertyReviews.reduce((s, r) => s + r.aspects.service, 0) / propertyReviews.length).toFixed(1),
  } : null;

  const [showWriteReview, setShowWriteReview] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
  ]);

  const handleSubmitReview = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowWriteReview(false);
      setReviewComment('');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isAndroid ? theme.gold : theme.bg }]} edges={['top']}>
      <View style={[styles.header, isAndroid && { backgroundColor: theme.gold }]}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={isAndroid ? '#FFFFFF' : theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>Reviews</Text>
        <Pressable
          onPress={() => setShowWriteReview(true)}
          style={({ pressed }) => [
            styles.writeReviewHeaderBtn,
            { backgroundColor: isAndroid ? 'rgba(255,255,255,0.2)' : theme.goldGlow, borderColor: theme.gold },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Camera size={14} color={isAndroid ? '#FFFFFF' : theme.gold} />
          <Text style={[styles.writeReviewHeaderBtnText, { color: isAndroid ? '#FFFFFF' : theme.gold }]}>Write Review</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Overview card */}
        <View style={[styles.overviewCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.overviewLeft}>
            <Text style={[styles.ratingLarge, { color: theme.text }]}>{avg}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={18}
                  color={theme.gold}
                  fill={i <= Math.round(Number(avg)) ? theme.gold : 'transparent'}
                />
              ))}
            </View>
            <Text style={[styles.reviewCount, { color: theme.textMuted }]}>
              {propertyReviews.length} reviews
            </Text>
          </View>
          <View style={styles.overviewRight}>
            {dist.map(({ star, count, pct }) => (
              <View key={star} style={styles.distRow}>
                <Text style={[styles.distStar, { color: theme.textMuted }]}>{star}</Text>
                <Star size={11} color={theme.gold} fill={theme.gold} />
                <View style={[styles.distBarBg, { backgroundColor: theme.border }]}>
                  <View style={[styles.distBarFill, { width: `${pct}%`, backgroundColor: theme.gold }]} />
                </View>
                <Text style={[styles.distCount, { color: theme.textMuted }]}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Aspects card */}
        {avgAspects && (
          <View style={[styles.aspectsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {[
              { label: 'Cleanliness', value: avgAspects.cleanliness, emoji: '🧹' },
              { label: 'Location', value: avgAspects.location, emoji: '📍' },
              { label: 'Value', value: avgAspects.value, emoji: '💰' },
              { label: 'Service', value: avgAspects.service, emoji: '🤝' },
            ].map((aspect) => (
              <View key={aspect.label} style={styles.aspectItem}>
                <Text style={styles.aspectEmoji}>{aspect.emoji}</Text>
                <Text style={[styles.aspectLabel, { color: theme.textSecondary }]}>{aspect.label}</Text>
                <View style={[styles.aspectBarBg, { backgroundColor: theme.border }]}>
                  <View style={[styles.aspectBarFill, { width: `${(Number(aspect.value) / 5) * 100}%`, backgroundColor: theme.gold }]} />
                </View>
                <Text style={[styles.aspectVal, { color: theme.gold }]}>{aspect.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews list */}
        <Text style={[styles.listTitle, { color: theme.text }]}>All Reviews</Text>
        {propertyReviews.length === 0 ? (
          <EmptyState
            icon={<Star size={40} color={theme.textMuted} />}
            title="No reviews yet"
            subtitle="Be the first to leave a review after your stay."
          />
        ) : (
          propertyReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </ScrollView>

      {/* ══ WRITE PHOTO REVIEW MODAL ══════════════════════════════════════ */}
      <Modal
        visible={showWriteReview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWriteReview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Write a Review</Text>
              <Pressable onPress={() => setShowWriteReview(false)}>
                <Text style={[styles.cancelText, { color: theme.gold }]}>Cancel</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>YOUR RATING</Text>
              <View style={styles.ratingStarsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => setUserRating(star)}>
                    <Star
                      size={28}
                      color={theme.gold}
                      fill={star <= userRating ? theme.gold : 'transparent'}
                    />
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>ATTACH PHOTOS OF YOUR STAY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                {selectedPhotos.map((url, idx) => (
                  <View key={idx} style={styles.photoThumbContainer}>
                    <Image source={{ uri: url }} style={styles.photoThumb} />
                  </View>
                ))}
                <Pressable style={[styles.addPhotoBtn, { borderColor: theme.border, backgroundColor: theme.bg }]}>
                  <Camera size={20} color={theme.gold} />
                  <Text style={[styles.addPhotoText, { color: theme.textMuted }]}>Add Photo</Text>
                </Pressable>
              </ScrollView>

              <Text style={[styles.label, { color: theme.textSecondary, marginTop: 16 }]}>YOUR EXPERIENCE</Text>
              <TextInput
                value={reviewComment}
                onChangeText={setReviewComment}
                placeholder="Share your stay experience, highlight favorite amenities..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={4}
                style={[styles.reviewInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
              />

              {submitted ? (
                <View style={[styles.submittedBox, { backgroundColor: 'rgba(46,125,50,0.1)' }]}>
                  <CheckCircle size={18} color="#2E7D32" />
                  <Text style={{ fontSize: 14, color: '#2E7D32', fontWeight: '700' }}>Review submitted with photos!</Text>
                </View>
              ) : (
                <Pressable
                  onPress={handleSubmitReview}
                  style={({ pressed }) => [
                    styles.submitReviewBtn,
                    { backgroundColor: theme.gold },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.submitReviewBtnText}>Post Review</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  writeReviewHeaderBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1,
  },
  writeReviewHeaderBtnText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 60, gap: 14 },
  overviewCard: {
    flexDirection: 'row', borderRadius: 18, borderWidth: StyleSheet.hairlineWidth,
    padding: 18, gap: 16,
  },
  overviewLeft: { alignItems: 'center', gap: 6, justifyContent: 'center', minWidth: 90 },
  ratingLarge: { fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewCount: { fontSize: 12 },
  overviewRight: { flex: 1, gap: 6, justifyContent: 'center' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  distStar: { fontSize: 12, width: 10, textAlign: 'center' },
  distBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  distBarFill: { height: '100%', borderRadius: 3 },
  distCount: { fontSize: 11, width: 16, textAlign: 'right' },
  aspectsCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12,
  },
  aspectItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aspectEmoji: { fontSize: 16, width: 22 },
  aspectLabel: { fontSize: 13, width: 80 },
  aspectBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  aspectBarFill: { height: '100%', borderRadius: 3 },
  aspectVal: { fontSize: 13, fontWeight: '700', width: 28, textAlign: 'right' },
  listTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1,
    paddingBottom: 34, maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECEFF1',
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  cancelText: { fontSize: 14, fontWeight: '600' },
  modalScroll: { padding: 20 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  ratingStarsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  photoRow: { gap: 10, paddingBottom: 8 },
  photoThumbContainer: { width: 64, height: 64, borderRadius: 12, overflow: 'hidden' },
  photoThumb: { width: '100%', height: '100%' },
  addPhotoBtn: {
    width: 64, height: 64, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  addPhotoText: { fontSize: 10, fontWeight: '600' },
  reviewInput: {
    borderWidth: 1, borderRadius: 14, padding: 12, fontSize: 14, minHeight: 90, textAlignVertical: 'top',
  },
  submitReviewBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 18,
  },
  submitReviewBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  submittedBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginTop: 18,
  },
});
