import React from 'react';
import {
  View, Text, Image, Pressable, StyleSheet,
} from 'react-native';
import { Heart, Star, Users, BedDouble, Zap, Clock } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { Property } from '../../types';
import { formatMoney } from '../../lib/format';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  horizontal?: boolean;
}

export default function PropertyCard({
  property,
  onPress,
  isFavorited = false,
  onFavoriteToggle,
  horizontal = false,
}: PropertyCardProps) {
  const { theme } = useTheme();

  const cardWidth = horizontal ? 280 : undefined;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border, width: cardWidth },
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Gradient overlay bottom */}
        <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.18)' }]} />

        {/* Favorite button */}
        <Pressable
          onPress={onFavoriteToggle}
          hitSlop={8}
          style={[styles.favoriteBtn, { backgroundColor: 'rgba(0,0,0,0.35)' }]}
        >
          <Heart
            size={16}
            color={isFavorited ? '#E53935' : '#fff'}
            fill={isFavorited ? '#E53935' : 'transparent'}
          />
        </Pressable>

        {/* Booking type badge */}
        <View style={[
          styles.badgeContainer,
          { backgroundColor: property.bookingType === 'instant' ? 'rgba(46,125,50,0.9)' : 'rgba(201,161,74,0.9)' },
        ]}>
          {property.bookingType === 'instant' ? (
            <Zap size={10} color="#fff" fill="#fff" />
          ) : (
            <Clock size={10} color="#fff" />
          )}
          <Text style={styles.badgeText}>
            {property.bookingType === 'instant' ? 'Instant Book' : 'Request Book'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name + Rating */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.ratingPill}>
            <Star size={11} color="#C9A14A" fill="#C9A14A" />
            <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Location */}
        <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
          {property.location}
        </Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <BedDouble size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
            </Text>
          </View>
          <View style={[styles.metaDot, { backgroundColor: theme.border }]} />
          <View style={styles.metaItem}>
            <Users size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {property.capacity} Guests
            </Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.price, { color: theme.text }]}>
              <Text style={{ color: '#C9A14A', fontWeight: '800' }}>
                {formatMoney(property.pricePerNight)}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '400' }}>
                {' '}/night
              </Text>
            </Text>
          </View>
          <Text style={[styles.reviews, { color: theme.textMuted }]}>
            {property.reviewCount} reviews
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  content: {
    padding: 14,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    letterSpacing: -0.2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(201,161,74,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    color: '#C9A14A',
    fontSize: 12,
    fontWeight: '700',
  },
  location: {
    fontSize: 13,
    marginTop: 0,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 12,
  },
});
