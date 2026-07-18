import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import {
  Wifi, Waves, Wind, Tv, UtensilsCrossed, Car, Dumbbell, Flame,
  Droplets, Trees, Mountain, Eye, Coffee, Star, ChefHat,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface AmenitiesGridProps {
  amenities: string[];
  showAll?: boolean;
  onToggleShowAll?: () => void;
  maxVisible?: number;
}

const AMENITY_ICON_MAP: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'Wifi': Wifi,
  'Private Pool': Waves,
  'Private swimming pool': Waves,
  'Infinity Pool': Waves,
  'Heated Infinity Pool': Waves,
  'Air Conditioning': Wind,
  'Smart TV': Tv,
  'Kitchen': UtensilsCrossed,
  'Free Parking': Car,
  'Gym': Dumbbell,
  'Bonfire': Flame,
  'Bonfire Pit': Flame,
  'Campfire': Flame,
  'Outdoor Shower': Droplets,
  'Outdoor Bath': Droplets,
  'Landscaped Gardens': Trees,
  'Tropical Gardens': Trees,
  'Spice Garden': Trees,
  'Mountain Views': Mountain,
  'Valley Views': Mountain,
  'Lake Views': Eye,
  'Sea Views': Eye,
  'River Frontage': Eye,
  'Forest Views': Trees,
  'Coffee Estate Tour': Coffee,
  'Coffee Estate Walk': Coffee,
  'Chef on Demand': ChefHat,
  'Resident Cook': ChefHat,
  'Butler Service': Star,
};

const DEFAULT_ICON = Star;

export default function AmenitiesGrid({
  amenities,
  showAll = false,
  onToggleShowAll,
  maxVisible = 6,
}: AmenitiesGridProps) {
  const { theme } = useTheme();
  const displayed = showAll ? amenities : amenities.slice(0, maxVisible);
  const hasMore = amenities.length > maxVisible;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {displayed.map((amenity) => {
          const Icon = AMENITY_ICON_MAP[amenity] || DEFAULT_ICON;
          return (
            <View
              key={amenity}
              style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={[styles.iconBox, { backgroundColor: 'rgba(201,161,74,0.12)' }]}>
                <Icon size={18} color="#C9A14A" />
              </View>
              <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={2}>
                {amenity}
              </Text>
            </View>
          );
        })}
      </View>

      {hasMore && onToggleShowAll && (
        <Pressable
          onPress={onToggleShowAll}
          style={({ pressed }) => [styles.toggleBtn, { borderColor: theme.border }, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.toggleText}>
            {showAll ? 'Show fewer amenities ↑' : `Show all ${amenities.length} amenities ↓`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 17,
  },
  toggleBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  toggleText: {
    color: '#C9A14A',
    fontSize: 14,
    fontWeight: '600',
  },
});
