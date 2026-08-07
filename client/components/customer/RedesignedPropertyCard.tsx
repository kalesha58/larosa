import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Heart, Star, MapPin } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { Property } from '../../types';
import { formatMoney } from '../../lib/format';

interface RedesignedPropertyCardProps {
  property: Property;
  onPress: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  style?: any;
}

export default function RedesignedPropertyCard({
  property,
  onPress,
  isFavorited = false,
  onFavoriteToggle,
  style,
}: RedesignedPropertyCardProps) {
  const { theme } = useTheme();

  // Dynamic discount badge for visual completeness
  const discountText = property.pricePerNight > 22000 ? '25% OFF' : '15% OFF';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
        style,
        pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] },
      ]}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Discount Badge (Top Left) */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discountText}</Text>
        </View>

        {/* Favorite Button (Top Right) - White circular button with red/empty heart */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            if (onFavoriteToggle) onFavoriteToggle();
          }}
          hitSlop={8}
          style={({ pressed }) => [
            styles.favoriteBtn,
            pressed && { transform: [{ scale: 0.9 }] }
          ]}
        >
          <Heart
            size={14}
            color={isFavorited ? '#E53935' : '#757575'}
            fill={isFavorited ? '#E53935' : 'transparent'}
          />
        </Pressable>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Title & Rating */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFB300" fill="#FFB300" />
            <Text style={[styles.ratingText, { color: theme.text }]}>
              {property.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Location with Pin */}
        <View style={styles.locationRow}>
          <MapPin size={12} color={theme.textMuted} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        {/* Price Row: Bold Sky Blue */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            <Text style={styles.priceVal}>{formatMoney(property.pricePerNight)}</Text>
            <Text style={[styles.priceUnit, { color: theme.textMuted }]}>/night</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginRight: 16,
    marginBottom: 8,
  },
  imageContainer: {
    height: 130,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 10,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    flex: 1,
  },
  priceRow: {
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
  },
  priceVal: {
    color: '#1A5C4E',
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 11,
  },
});
