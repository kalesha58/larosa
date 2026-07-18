import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Calendar, Users, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { CustomerBooking } from '../../types';
import { formatDate, formatMoney } from '../../lib/format';

interface BookingCardProps {
  booking: CustomerBooking;
  onPress: () => void;
}

const statusConfig = {
  upcoming: { color: '#C9A14A', bg: 'rgba(201,161,74,0.12)', icon: Clock, label: 'Upcoming' },
  completed: { color: '#2E7D32', bg: 'rgba(46,125,50,0.12)', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: '#E53935', bg: 'rgba(229,57,53,0.12)', icon: XCircle, label: 'Cancelled' },
};

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const { theme } = useTheme();
  const cfg = statusConfig[booking.status];
  const StatusIcon = cfg.icon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.9 },
      ]}
    >
      {/* Property image */}
      <Image
        source={{ uri: booking.propertyImage }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {booking.propertyTitle}
            </Text>
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              {booking.propertyLocation}
            </Text>
          </View>
          {/* Status badge */}
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <StatusIcon size={11} color={cfg.color} />
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {booking.guests} guests · {booking.nights}N
            </Text>
          </View>
        </View>

        {/* Price row */}
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Total</Text>
            <Text style={[styles.price, { color: '#C9A14A' }]}>
              {formatMoney(booking.totalPrice)}
            </Text>
          </View>
          {booking.remainingAmount > 0 && booking.status === 'upcoming' && (
            <View style={[styles.dueChip, { backgroundColor: 'rgba(229,57,53,0.1)' }]}>
              <Text style={styles.dueText}>Due: {formatMoney(booking.remainingAmount)}</Text>
            </View>
          )}
          <ChevronRight size={18} color={theme.textMuted} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  metaRow: {
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  priceLabel: {
    fontSize: 11,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dueChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dueText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '700',
  },
});
