import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Calendar, Users, ChevronRight, Clock, CheckCircle, XCircle, MapPin, Heart, Moon } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { CustomerBooking } from '../../types';
import { formatDate, formatMoney } from '../../lib/format';

interface BookingCardProps {
  booking: CustomerBooking;
  onPress: () => void;
}

const statusConfig = {
  upcoming: { color: '#C9A14A', bg: '#FFF8E7', icon: Clock, label: 'Upcoming' },
  completed: { color: '#2E7D32', bg: '#E8F5E9', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: '#E53935', bg: '#FFEBEE', icon: XCircle, label: 'Cancelled' },
};

export default function BookingCard({ booking, onPress }: BookingCardProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [isFav, setIsFav] = useState(false);

  const isWebHorizontal = Platform.OS === 'web' && width >= 640;
  const cfg = statusConfig[booking.status];
  const StatusIcon = cfg.icon;

  if (isWebHorizontal) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.webContainer,
          { backgroundColor: theme.surface, borderColor: theme.border },
          pressed && { opacity: 0.94, transform: [{ translateY: -1 }] },
        ]}
      >
        {/* Left Villa Image Container */}
        <View style={styles.webImageWrap}>
          <Image
            source={{ uri: booking.propertyImage }}
            style={styles.webImage}
            resizeMode="cover"
          />

          {/* Floating Status Badge - Top Left */}
          <View style={[styles.statusBadgeTop, { backgroundColor: cfg.bg }]}>
            <StatusIcon size={12} color={cfg.color} />
            <Text style={[styles.statusBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>

          {/* Floating Location Pill - Bottom Left */}
          <View style={styles.locationPillBottom}>
            <MapPin size={12} color="#FFFFFF" />
            <Text style={styles.locationPillText} numberOfLines={1}>
              {booking.propertyLocation}
            </Text>
          </View>
        </View>

        {/* Right Content Details Container */}
        <View style={styles.webContent}>
          {/* Header Row: Title & Heart Favorite */}
          <View style={styles.headerRow}>
            <Text style={[styles.webTitle, { color: theme.text }]} numberOfLines={1}>
              {booking.propertyTitle}
            </Text>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setIsFav((v) => !v);
              }}
              style={({ pressed }) => [
                styles.heartBtn,
                { borderColor: theme.border, backgroundColor: theme.surface },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Heart
                size={16}
                color={isFav ? '#E53935' : theme.textMuted}
                fill={isFav ? '#E53935' : 'transparent'}
              />
            </Pressable>
          </View>

          {/* Meta Info Chips Row */}
          <View style={styles.webMetaRow}>
            <View style={styles.metaItem}>
              <Calendar size={15} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
              </Text>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />

            <View style={styles.metaItem}>
              <Users size={15} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {booking.guests} guests
              </Text>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />

            <View style={styles.metaItem}>
              <Moon size={15} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {booking.nights} Nights
              </Text>
            </View>
          </View>

          {/* Bottom Row: Price Boxes & Action Button */}
          <View style={styles.webFooterRow}>
            <View style={styles.priceBoxesGroup}>
              {/* Total Price Box */}
              <View style={[styles.priceBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                <Text style={[styles.priceBoxLabel, { color: theme.textMuted }]}>Total Price</Text>
                <Text style={[styles.priceBoxVal, { color: '#1B4D3E' }]}>
                  {formatMoney(booking.totalPrice)}
                </Text>
              </View>

              {/* Amount Due Box */}
              {booking.remainingAmount > 0 && booking.status === 'upcoming' && (
                <View style={[styles.priceBox, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
                  <Text style={[styles.priceBoxLabel, { color: '#DC2626' }]}>Amount Due</Text>
                  <Text style={[styles.priceBoxVal, { color: '#DC2626' }]}>
                    {formatMoney(booking.remainingAmount)}
                  </Text>
                </View>
              )}
            </View>

            {/* Manage Booking Action CTA Button */}
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                styles.manageBookingBtn,
                { backgroundColor: '#1B4D3E' },
                pressed && { opacity: 0.88 },
              ]}
            >
              <Text style={styles.manageBookingText}>Manage Booking</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  }

  // Mobile layout
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: booking.propertyImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.badgeFloating, { backgroundColor: cfg.bg }]}>
          <StatusIcon size={11} color={cfg.color} />
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        <View style={styles.locationPillBottom}>
          <MapPin size={11} color="#FFFFFF" />
          <Text style={styles.locationPillText} numberOfLines={1}>
            {booking.propertyLocation}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {booking.propertyTitle}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

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

        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.priceLabel, { color: theme.textMuted }]}>Total Price</Text>
            <Text style={[styles.price, { color: '#1B4D3E' }]}>
              {formatMoney(booking.totalPrice)}
            </Text>
          </View>
          {booking.remainingAmount > 0 && booking.status === 'upcoming' && (
            <View style={[styles.dueChip, { backgroundColor: '#FEF2F2' }]}>
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
    marginBottom: 16,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: 170,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeFloating: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  locationPillBottom: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    maxWidth: '85%',
  },
  locationPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  badgeText: {
    fontSize: 12,
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
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dueChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dueText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Web Horizontal Layout Styles ──
  webContainer: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  webImageWrap: {
    position: 'relative',
    width: 340,
    height: 220,
  },
  webImage: {
    width: '100%',
    height: '100%',
  },
  statusBadgeTop: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  webContent: {
    flex: 1,
    padding: 22,
    justifyContent: 'space-between',
  },
  webTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  metaDivider: {
    width: 1,
    height: 16,
  },
  webFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceBoxesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  priceBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceBoxVal: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  manageBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
  },
  manageBookingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
