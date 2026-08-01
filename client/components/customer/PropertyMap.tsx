import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface PropertyMapProps {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

export default function PropertyMap({ city, state, lat, lng }: PropertyMapProps) {
  const { theme } = useTheme();
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const locationLabel = `${city}, ${state}, India`;

  const delta = 0.04;
  const bbox = hasCoords
    ? `${lng! - delta},${lat! - delta},${lng! + delta},${lat! + delta}`
    : null;
  const mapSrc = bbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`
    : null;

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.text }]}>Where you'll be</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{locationLabel}</Text>

      {Platform.OS === 'web' && mapSrc ? (
        <View style={[styles.mapFrame, { borderColor: theme.border, backgroundColor: theme.surfaceElevated }]}>
          {React.createElement('iframe', {
            title: 'Property location',
            src: mapSrc,
            style: {
              border: 0,
              width: '100%',
              height: '100%',
              display: 'block',
            },
          })}
        </View>
      ) : (
        <View style={[styles.placeholder, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <View style={[styles.pin, { backgroundColor: theme.text }]}>
            <MapPin size={20} color={theme.bg} />
          </View>
          <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
            {locationLabel}
          </Text>
          {!hasCoords && (
            <Text style={[styles.placeholderHint, { color: theme.textMuted }]}>
              Exact location shared after booking
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    // Extra top space so sticky section nav never clips the map title
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 12,
  },
  mapFrame: {
    height: Platform.OS === 'web' ? 420 : 320,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  placeholder: {
    height: 280,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { fontSize: 15, fontWeight: '600' },
  placeholderHint: { fontSize: 13 },
});
