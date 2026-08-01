import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Wifi, Waves, Wind, Tv, UtensilsCrossed, Car, Dumbbell, Flame,
  Droplets, Trees, Mountain, Eye, Coffee, Star, ChefHat, Laptop,
  ShieldAlert, Camera, ArrowUpFromLine,
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
  '75-inch TV': Tv,
  'Kitchen': UtensilsCrossed,
  'Free Parking': Car,
  'Free parking on premises': Car,
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
  'Dedicated workspace': Laptop,
  'Washing machine': Droplets,
  'Lift': ArrowUpFromLine,
  'Exterior security cameras on property': Camera,
  'Carbon monoxide alarm': ShieldAlert,
  'Smoke alarm': ShieldAlert,
};

const DEFAULT_ICON = Star;

export default function AmenitiesGrid({
  amenities,
  showAll = false,
  onToggleShowAll,
  maxVisible = 10,
}: AmenitiesGridProps) {
  const { theme } = useTheme();
  const displayed = showAll ? amenities : amenities.slice(0, maxVisible);
  const hasMore = amenities.length > maxVisible;

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.text }]}>What this place offers</Text>
      <View style={styles.grid}>
        {displayed.map((amenity) => {
          const Icon = AMENITY_ICON_MAP[amenity] || DEFAULT_ICON;
          return (
            <View key={amenity} style={styles.item}>
              <Icon size={22} color={theme.text} strokeWidth={1.6} />
              <Text style={[styles.label, { color: theme.text }]} numberOfLines={2}>
                {amenity}
              </Text>
            </View>
          );
        })}
      </View>

      {hasMore && onToggleShowAll && (
        <Pressable
          onPress={onToggleShowAll}
          style={({ pressed }) => [
            styles.toggleBtn,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.toggleText, { color: theme.text }]}>
            {showAll ? 'Show less' : `Show all ${amenities.length} amenities`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },
  heading: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  item: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingRight: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
    lineHeight: 20,
  },
  toggleBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
    marginTop: 4,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
