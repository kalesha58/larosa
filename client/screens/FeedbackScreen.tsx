import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import { Card, Chip, EmptyState, ScreenHeader, Stars, PrimaryButton, SecondaryButton, FieldLabel } from '../components/ui';
import { useData } from '../lib/data-context';
import { formatDate } from '../lib/format';
import { MessageSquare, Trash2, Reply, Star } from 'lucide-react-native';
import type { Review } from '../types';

type RatingFilter = 'all' | '5' | '4' | '3' | 'lower';

export default function FeedbackScreen() {
  const { theme } = useTheme();
  const { reviews, deleteReview, replyToReview, properties } = useData();
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [query, setQuery] = useState<string>('');
  
  // Reply Modal States
  const [replyModalOpen, setReplyModalOpen] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Map property IDs to titles for easy display
  const propertyMap = useMemo(() => {
    const map: Record<string, string> = {};
    properties.forEach((p) => {
      map[p.id] = p.title;
    });
    return map;
  }, [properties]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const propTitle = propertyMap[r.propertyId] || '';
      // Query filter
      if (
        query &&
        !r.reviewerName.toLowerCase().includes(query.toLowerCase()) &&
        !r.comment.toLowerCase().includes(query.toLowerCase()) &&
        !propTitle.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }

      // Rating filter
      if (ratingFilter === '5') return r.rating === 5;
      if (ratingFilter === '4') return r.rating === 4;
      if (ratingFilter === '3') return r.rating === 3;
      if (ratingFilter === 'lower') return r.rating < 3;

      return true;
    });
  }, [reviews, ratingFilter, query, propertyMap]);

  const handleDeleteReview = (review: Review) => {
    Alert.alert(
      'Remove Review?',
      `Are you sure you want to delete this review by ${review.reviewerName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteReview(review.id);
            Alert.alert('Review Removed', 'The review was deleted successfully.');
          },
        },
      ]
    );
  };

  const handleReplySubmit = () => {
    if (selectedReview && replyText.trim()) {
      replyToReview(selectedReview.id, replyText);
      setReplyModalOpen(false);
      setReplyText('');
      Alert.alert('Reply Sent', 'Your official response has been added to the review.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScreenHeader title="Guest Reviews" subtitle="Moderation & Feedback" showBack />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by reviewer, property, or comment…"
          placeholderTextColor={theme.textMuted}
          style={{
            backgroundColor: theme.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 16,
            height: 48,
            color: theme.text,
            fontSize: 15,
          }}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {([
          { id: 'all', label: 'All Reviews' },
          { id: '5', label: '★ 5 Stars' },
          { id: '4', label: '★ 4 Stars' },
          { id: '3', label: '★ 3 Stars' },
          { id: 'lower', label: '★ Under 3' },
        ] as { id: RatingFilter; label: string }[]).map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={ratingFilter === f.id}
            onPress={() => setRatingFilter(f.id)}
            color={f.id === '5' ? theme.green : f.id === 'lower' ? theme.red : theme.gold}
          />
        ))}
      </ScrollView>

      {/* Reviews List */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {filteredReviews.length === 0 ? (
          <EmptyState icon={<Star color={theme.textMuted} size={40} />} title="No reviews found" subtitle="No reviews match the selected filter criteria." />
        ) : (
          <View style={{ gap: 14 }}>
            {filteredReviews.map((r) => (
              <Card key={r.id} style={{ padding: 16 }}>
                {/* Review Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>{r.reviewerName}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      Property: <Text style={{ color: theme.gold, fontWeight: '600' }}>{propertyMap[r.propertyId] || 'Aqua Retreat'}</Text>
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>Stay duration: {r.stayDuration || 'N/A'}</Text>
                  </View>
                  <Stars rating={r.rating} size={15} />
                </View>

                {/* Comment */}
                <View style={{ marginTop: 10, paddingVertical: 8 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700', marginBottom: 4 }}>"{r.title}"</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>{r.comment}</Text>
                </View>

                {/* Footer and moderation options */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.borderSoft }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11 }}>Published {formatDate(r.createdAt)}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable
                      onPress={() => {
                        setSelectedReview(r);
                        setReplyText('');
                        setReplyModalOpen(true);
                      }}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.gold + '22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                    >
                      <Reply color={theme.gold} size={14} />
                      <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>Reply</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteReview(r)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.redSoft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                    >
                      <Trash2 color={theme.red} size={14} />
                      <Text style={{ color: theme.red, fontSize: 12, fontWeight: '600' }}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Reply Modal */}
      <Modal visible={replyModalOpen} animationType="slide" transparent onRequestClose={() => setReplyModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setReplyModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: theme.borderSoft,
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: 20 }} />
            
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
              Reply to Guest Review
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>
              To: <Text style={{ color: theme.gold, fontWeight: '600' }}>{selectedReview?.reviewerName}</Text> for {selectedReview ? propertyMap[selectedReview.propertyId] : ''}
            </Text>

            <View style={{ marginTop: 20, gap: 16 }}>
              <View>
                <FieldLabel>Official Admin Reply</FieldLabel>
                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholder="Thank you for sharing your feedback. We look forward to hosting you again!"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={{
                    backgroundColor: theme.bg,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: theme.text,
                    fontSize: 15,
                    minHeight: 120,
                  }}
                />
              </View>
              <View style={{ gap: 10 }}>
                <PrimaryButton
                  label="Submit Reply"
                  disabled={!replyText.trim()}
                  onPress={handleReplySubmit}
                />
                <SecondaryButton label="Cancel" onPress={() => setReplyModalOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
