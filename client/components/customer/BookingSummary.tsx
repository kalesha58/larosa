import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme-context';
import { formatMoney, formatDate } from '../../lib/format';
import { BedDouble, Users, Calendar, Target, MapPin } from 'lucide-react-native';

interface BookingSummaryProps {
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  bedrooms: number;
  purpose: string;
  pricePerNight: number;
}

export default function BookingSummary({
  propertyTitle,
  propertyLocation,
  checkIn,
  checkOut,
  nights,
  guests,
  bedrooms,
  purpose,
  pricePerNight,
}: BookingSummaryProps) {
  const { theme } = useTheme();

  const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.rowValue, { color: theme.text }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {/* Property info */}
      <View style={styles.propertyHeader}>
        <View style={styles.propertyInfo}>
          <Text style={[styles.propertyTitle, { color: theme.text }]}>{propertyTitle}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color={theme.textMuted} />
            <Text style={[styles.location, { color: theme.textSecondary }]}>{propertyLocation}</Text>
          </View>
        </View>
        <View style={[styles.pricePill, { backgroundColor: 'rgba(201,161,74,0.12)' }]}>
          <Text style={styles.priceAmount}>{formatMoney(pricePerNight)}</Text>
          <Text style={[styles.priceNight, { color: theme.textMuted }]}>/night</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Details */}
      <Row
        icon={<Calendar size={15} color="#C9A14A" />}
        label="Check-in"
        value={formatDate(checkIn)}
      />
      <Row
        icon={<Calendar size={15} color="#C9A14A" />}
        label="Check-out"
        value={formatDate(checkOut)}
      />
      <Row
        icon={<Calendar size={15} color="#C9A14A" />}
        label="Duration"
        value={`${nights} ${nights === 1 ? 'night' : 'nights'}`}
      />
      <Row
        icon={<Users size={15} color="#C9A14A" />}
        label="Guests"
        value={`${guests} ${guests === 1 ? 'guest' : 'guests'}`}
      />
      <Row
        icon={<BedDouble size={15} color="#C9A14A" />}
        label="Bedrooms"
        value={`${bedrooms} ${bedrooms === 1 ? 'bedroom' : 'bedrooms'}`}
      />
      <Row
        icon={<Target size={15} color="#C9A14A" />}
        label="Purpose"
        value={purpose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  propertyInfo: {
    flex: 1,
    gap: 4,
  },
  propertyTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
  },
  pricePill: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#C9A14A',
    letterSpacing: -0.3,
  },
  priceNight: {
    fontSize: 11,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
