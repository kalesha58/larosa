import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Star } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { reviews, properties } from '../../lib/mockData';
import ReviewCard from '../../components/customer/ReviewCard';
import { EmptyState } from '../../components/ui';

export default function ReviewsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

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
                  color="#C9A14A"
                  fill={i <= Math.round(Number(avg)) ? '#C9A14A' : 'transparent'}
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
                <Star size={11} color="#C9A14A" fill="#C9A14A" />
                <View style={[styles.distBarBg, { backgroundColor: theme.border }]}>
                  <View style={[styles.distBarFill, { width: `${pct}%`, backgroundColor: '#C9A14A' }]} />
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
                  <View style={[styles.aspectBarFill, { width: `${(Number(aspect.value) / 5) * 100}%`, backgroundColor: '#C9A14A' }]} />
                </View>
                <Text style={[styles.aspectVal, { color: '#C9A14A' }]}>{aspect.value}</Text>
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
});
