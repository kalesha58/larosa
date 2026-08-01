import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, ScrollView } from 'react-native';
import {
  Star, Sparkles, CheckCircle2, KeyRound, MessageCircle, Map, Tag,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { Review } from '../../types';

interface ReviewSummaryProps {
  reviews: Review[];
  avgRating: string;
  reviewCount: number;
}

const CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness', Icon: Sparkles },
  { key: 'accuracy', label: 'Accuracy', Icon: CheckCircle2 },
  { key: 'checkin', label: 'Check-in', Icon: KeyRound },
  { key: 'communication', label: 'Communication', Icon: MessageCircle },
  { key: 'location', label: 'Location', Icon: Map },
  { key: 'value', label: 'Value', Icon: Tag },
] as const;

function avgAspect(reviews: Review[], getter: (r: Review) => number): number {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + getter(r), 0) / reviews.length;
}

export default function ReviewSummary({ reviews, avgRating, reviewCount }: ReviewSummaryProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = (Platform.OS === 'web' ? width : width) >= 768;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  const scores: Record<string, number> = {
    cleanliness: avgAspect(reviews, (r) => r.aspects.cleanliness),
    accuracy: avgAspect(reviews, (r) => (r.aspects.cleanliness + r.aspects.service) / 2),
    checkin: avgAspect(reviews, (r) => r.aspects.service),
    communication: avgAspect(reviews, (r) => r.aspects.service),
    location: avgAspect(reviews, (r) => r.aspects.location),
    value: avgAspect(reviews, (r) => r.aspects.value),
  };

  const tags = [
    { label: 'Hospitality', count: Math.max(1, Math.round(reviewCount * 0.4)), Icon: Sparkles },
    { label: 'Cleanliness', count: Math.max(1, Math.round(reviewCount * 0.25)), Icon: Sparkles },
    { label: 'Location', count: Math.max(1, Math.round(reviewCount * 0.25)), Icon: Map },
  ];

  const metrics = (
    <>
      <View style={[styles.overallCol, { borderRightColor: theme.border }]}>
        <Text style={[styles.metricLabel, { color: theme.text }]}>Overall rating</Text>
        {distribution.map((d) => (
          <View key={d.star} style={styles.distRow}>
            <Text style={[styles.distStar, { color: theme.text }]}>{d.star}</Text>
            <View style={[styles.distTrack, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.distFill,
                  {
                    width: `${(d.count / maxCount) * 100}%`,
                    backgroundColor: theme.text,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {CATEGORIES.map(({ key, label, Icon }, idx) => (
        <View
          key={key}
          style={[
            styles.catColBase,
            isWide ? styles.catColWide : styles.catColFixed,
            { borderRightColor: theme.border },
            idx === CATEGORIES.length - 1 && { borderRightWidth: 0 },
          ]}
        >
          <Text style={[styles.metricLabel, { color: theme.text }]}>{label}</Text>
          <Text style={[styles.catScore, { color: theme.text }]}>
            {(scores[key] || 0).toFixed(1)}
          </Text>
          <Icon size={28} color={theme.text} strokeWidth={1.4} style={{ marginTop: 12 }} />
        </View>
      ))}
    </>
  );

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Star size={22} color={theme.text} fill={theme.text} />
        <Text style={[styles.headerText, { color: theme.text }]}>
          {avgRating} · {reviewCount} reviews
        </Text>
      </View>
      <Text style={[styles.howLink, { color: theme.text }]}>How reviews work</Text>

      {isWide ? (
        <View style={styles.metricsRowDesktop}>{metrics}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsRowMobile}
        >
          {metrics}
        </ScrollView>
      )}

      <View style={styles.tagsRow}>
        {tags.map(({ label, count, Icon }) => (
          <View key={label} style={[styles.tag, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Icon size={14} color={theme.gold} />
            <Text style={[styles.tagText, { color: theme.text }]}>{label} {count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerText: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4 },
  howLink: {
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: -4,
  },
  metricsRowDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 12,
  },
  metricsRowMobile: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  overallCol: {
    width: 130,
    paddingRight: 16,
    borderRightWidth: StyleSheet.hairlineWidth,
    gap: 4,
    flexShrink: 0,
  },
  catColBase: {
    paddingHorizontal: 14,
    borderRightWidth: StyleSheet.hairlineWidth,
    flexShrink: 0,
  },
  catColFixed: {
    width: 108,
  },
  catColWide: {
    flex: 1,
    minWidth: 0,
  },
  metricLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  distStar: { fontSize: 11, width: 10 },
  distTrack: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: 2 },
  catScore: { fontSize: 18, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: { fontSize: 13, fontWeight: '600' },
});
