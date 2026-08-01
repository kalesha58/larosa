import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { ThumbsUp, Quote } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { Review } from '../../types';
import { formatDate } from '../../lib/format';

interface ReviewCardProps {
  review: Review;
  /** Compact quote card for carousels */
  compact?: boolean;
  /** Airbnb listing-style grid cell */
  listing?: boolean;
  style?: object;
}

function StarRow({ rating, size = 13, color = '#C9A14A' }: { rating: number; size?: number; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ color: i <= rating ? color : '#E0D5C5', fontSize: size }}>
          ★
        </Text>
      ))}
    </View>
  );
}

function AspectBar({ label, value }: { label: string; value: number }) {
  const { theme } = useTheme();
  return (
    <View style={styles.aspectRow}>
      <Text style={[styles.aspectLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={[styles.barBg, { backgroundColor: theme.border }]}>
        <View style={[styles.barFill, { width: `${(value / 5) * 100}%`, backgroundColor: theme.gold }]} />
      </View>
      <Text style={[styles.aspectValue, { color: theme.gold }]}>{value.toFixed(1)}</Text>
    </View>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 7) return `${Math.max(1, days)} day${days === 1 ? '' : 's'} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) === 1 ? '' : 's'} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? '' : 's'} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) === 1 ? '' : 's'} ago`;
}

function tenureLabel(iso: string): string {
  const months = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30)));
  if (months < 2) return 'New to Larosa';
  if (months < 12) return `${months} months on Larosa`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} on Larosa`;
}

export default function ReviewCard({ review, compact = false, listing = false, style }: ReviewCardProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  if (listing) {
    const long = review.comment.length > 160;
    return (
      <View style={[styles.listingCard, style]}>
        <View style={styles.listingHeader}>
          <View style={[styles.listingAvatar, { backgroundColor: theme.goldGlow }]}>
            <Text style={[styles.listingAvatarText, { color: theme.gold }]}>{review.reviewerInitials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.listingName, { color: theme.text }]}>{review.reviewerName}</Text>
            <Text style={[styles.listingTenure, { color: theme.textMuted }]}>{tenureLabel(review.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.listingMeta}>
          <StarRow rating={review.rating} size={11} color={theme.text} />
          <Text style={[styles.listingDot, { color: theme.textMuted }]}>·</Text>
          <Text style={[styles.listingWhen, { color: theme.textMuted }]}>{relativeTime(review.createdAt)}</Text>
        </View>
        <Text style={[styles.listingComment, { color: theme.text }]} numberOfLines={expanded ? undefined : 4}>
          {review.comment}
        </Text>
        {long && (
          <Pressable onPress={() => setExpanded((v) => !v)}>
            <Text style={[styles.showMore, { color: theme.text }]}>
              {expanded ? 'Show less' : 'Show more'}
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (compact) {
    return (
      <View
        style={[
          styles.compactCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
          style,
        ]}
      >
        <View style={styles.compactQuoteWrap}>
          <Quote size={18} color={theme.gold} strokeWidth={2} />
        </View>
        <StarRow rating={review.rating} size={12} color={theme.gold} />
        <Text style={[styles.compactTitle, { color: theme.text }]} numberOfLines={1}>
          {review.title}
        </Text>
        <Text style={[styles.compactComment, { color: theme.textSecondary }]} numberOfLines={4}>
          {review.comment}
        </Text>
        <View style={[styles.compactFooter, { borderTopColor: theme.border }]}>
          <View style={[styles.compactAvatar, { backgroundColor: theme.goldGlow }]}>
            <Text style={[styles.compactAvatarText, { color: theme.gold }]}>
              {review.reviewerInitials}
            </Text>
          </View>
          <View style={styles.compactMeta}>
            <Text style={[styles.compactName, { color: theme.text }]} numberOfLines={1}>
              {review.reviewerName}
            </Text>
            <Text style={[styles.compactDate, { color: theme.textMuted }]}>
              {formatDate(review.createdAt)}
              {review.purpose ? ` · ${review.purpose}` : ''}
            </Text>
          </View>
          <View style={[styles.compactScore, { backgroundColor: theme.gold }]}>
            <Text style={[styles.compactScoreText, { color: theme.textInverse }]}>{review.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.goldGlow }]}>
          <Text style={[styles.avatarText, { color: theme.gold }]}>{review.reviewerInitials}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.name, { color: theme.text }]}>{review.reviewerName}</Text>
          <View style={styles.ratingDateRow}>
            <StarRow rating={review.rating} color={theme.gold} />
            <Text style={[styles.date, { color: theme.textMuted }]}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: theme.gold }]}>
          <Text style={[styles.ratingBadgeText, { color: theme.textInverse }]}>{review.rating.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{review.title}</Text>
      <Text style={[styles.comment, { color: theme.textSecondary }]}>{review.comment}</Text>

      {(review.stayDuration || review.purpose) && (
        <View style={[styles.stayRow, { borderTopColor: theme.border }]}>
          {review.stayDuration && (
            <View style={[styles.stayChip, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.stayChipText, { color: theme.textSecondary }]}>
                📅 {review.stayDuration}
              </Text>
            </View>
          )}
          {review.purpose && (
            <View style={[styles.stayChip, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.stayChipText, { color: theme.textSecondary }]}>
                🎯 {review.purpose}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={[styles.aspectsSection, { borderTopColor: theme.border }]}>
        <AspectBar label="Cleanliness" value={review.aspects.cleanliness} />
        <AspectBar label="Location" value={review.aspects.location} />
        <AspectBar label="Value" value={review.aspects.value} />
        <AspectBar label="Service" value={review.aspects.service} />
      </View>

      <View style={styles.helpfulRow}>
        <ThumbsUp size={13} color={theme.textMuted} />
        <Text style={[styles.helpfulText, { color: theme.textMuted }]}>
          {review.helpful} found helpful
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listingCard: { gap: 10, flex: 1, minWidth: 0 },
  listingHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  listingAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingAvatarText: { fontSize: 15, fontWeight: '800' },
  listingName: { fontSize: 15, fontWeight: '700' },
  listingTenure: { fontSize: 13, marginTop: 2 },
  listingMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  listingDot: { fontSize: 12 },
  listingWhen: { fontSize: 12, fontWeight: '500' },
  listingComment: { fontSize: 15, lineHeight: 22 },
  showMore: { fontSize: 14, fontWeight: '700', textDecorationLine: 'underline', marginTop: 2 },

  container: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 14,
    gap: 12,
  },
  compactCard: {
    width: Platform.OS === 'web' ? 300 : 280,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 10,
  },
  compactQuoteWrap: { marginBottom: 2 },
  compactTitle: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  compactComment: { fontSize: 13, lineHeight: 20, flexGrow: 1 },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  compactAvatar: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  compactAvatarText: { fontSize: 12, fontWeight: '800' },
  compactMeta: { flex: 1, gap: 2 },
  compactName: { fontSize: 13, fontWeight: '700' },
  compactDate: { fontSize: 11 },
  compactScore: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  compactScoreText: { fontSize: 13, fontWeight: '800' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800' },
  headerContent: { flex: 1, gap: 4 },
  name: { fontSize: 15, fontWeight: '700' },
  ratingDateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: { fontSize: 11 },
  ratingBadge: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  ratingBadgeText: { fontSize: 13, fontWeight: '800' },
  title: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  comment: { fontSize: 14, lineHeight: 21 },
  stayRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth,
  },
  stayChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  stayChipText: { fontSize: 12, fontWeight: '600' },
  aspectsSection: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, gap: 8 },
  aspectRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aspectLabel: { fontSize: 12, width: 80 },
  barBg: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  aspectValue: { fontSize: 12, fontWeight: '700', width: 28, textAlign: 'right' },
  helpfulRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpfulText: { fontSize: 12 },
});
