import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThumbsUp } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { Review } from '../../types';
import { formatDate } from '../../lib/format';

interface ReviewCardProps {
  review: Review;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{ color: i <= rating ? '#C9A14A' : '#E0D5C5', fontSize: 13 }}
        >
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
        <View style={[styles.barFill, { width: `${(value / 5) * 100}%`, backgroundColor: '#C9A14A' }]} />
      </View>
      <Text style={[styles.aspectValue, { color: '#C9A14A' }]}>{value.toFixed(1)}</Text>
    </View>
  );
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: '#C9A14A22' }]}>
          <Text style={styles.avatarText}>{review.reviewerInitials}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.name, { color: theme.text }]}>{review.reviewerName}</Text>
          <View style={styles.ratingDateRow}>
            <StarRow rating={review.rating} />
            <Text style={[styles.date, { color: theme.textMuted }]}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: '#C9A14A' }]}>
          <Text style={styles.ratingBadgeText}>{review.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>{review.title}</Text>

      {/* Comment */}
      <Text style={[styles.comment, { color: theme.textSecondary }]}>{review.comment}</Text>

      {/* Stay info */}
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

      {/* Aspects */}
      <View style={[styles.aspectsSection, { borderTopColor: theme.border }]}>
        <AspectBar label="Cleanliness" value={review.aspects.cleanliness} />
        <AspectBar label="Location" value={review.aspects.location} />
        <AspectBar label="Value" value={review.aspects.value} />
        <AspectBar label="Service" value={review.aspects.service} />
      </View>

      {/* Helpful */}
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
  container: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#C9A14A',
    fontSize: 15,
    fontWeight: '800',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  ratingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 11,
  },
  ratingBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadgeText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '800',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  comment: {
    fontSize: 14,
    lineHeight: 21,
  },
  stayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  stayChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  stayChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  aspectsSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
    gap: 8,
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aspectLabel: {
    fontSize: 12,
    width: 80,
  },
  barBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  aspectValue: {
    fontSize: 12,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontSize: 12,
  },
});
