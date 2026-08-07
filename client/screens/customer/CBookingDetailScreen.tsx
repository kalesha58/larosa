import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Image, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft, CheckCircle, Clock, XCircle, PhoneCall, MessageCircle,
  AlertCircle, Calendar, Users, BedDouble, ShieldCheck, MapPin,
  FileText, Share2, Wifi, Tv, CheckSquare, Volume2, Key,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { customerBookings, properties } from '../../lib/mockData';
import { formatDate, formatMoney } from '../../lib/format';
import type { BookingTimelineEvent } from '../../types';

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  created: Clock,
  confirmed: CheckCircle,
  paid: ShieldCheck,
  checkin: Calendar,
  checkout: CheckCircle,
  cancelled: XCircle,
  refunded: AlertCircle,
};

const TIMELINE_COLORS: Record<string, string> = {
  created: '#C9A14A',
  confirmed: '#1B4D3E',
  paid: '#2E7D32',
  checkin: '#C9A14A',
  checkout: '#2E7D32',
  cancelled: '#E53935',
  refunded: '#E53935',
};

function TimelineItem({ event, isLast }: { event: BookingTimelineEvent; isLast: boolean }) {
  const { theme } = useTheme();
  const Icon = TIMELINE_ICONS[event.type] ?? Clock;
  const color = event.type === 'created' ? theme.gold : (TIMELINE_COLORS[event.type] ?? theme.gold);

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: color + '15', borderColor: color }]}>
          <Icon size={12} color={color} />
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineTitle, { color: theme.text }]}>{event.title}</Text>
        <Text style={[styles.timelineDesc, { color: theme.textSecondary }]}>{event.description}</Text>
        <Text style={[styles.timelineTime, { color: theme.textMuted }]}>{formatDate(event.timestamp)}</Text>
      </View>
    </View>
  );
}

export default function CBookingDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const { bookingId } = route.params ?? {};

  const isWeb = Platform.OS === 'web';
  const isAndroid = Platform.OS === 'android';
  const isWebLarge = isWeb && width >= 900;

  const booking = customerBookings.find((b) => b.id === bookingId) ?? customerBookings[0];
  const property = properties.find((p) => p.id === booking.propertyId);

  const statusColors = {
    upcoming: { text: theme.gold, bg: theme.gold + '15', border: theme.gold + '40' },
    completed: { text: '#2E7D32', bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.25)' },
    cancelled: { text: '#E53935', bg: 'rgba(229,57,53,0.1)', border: 'rgba(229,57,53,0.25)' },
  };
  const statusCfg = statusColors[booking.status];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isAndroid ? theme.gold : theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, isWeb && styles.webHeaderWrap, isAndroid && { backgroundColor: theme.gold }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backCircle,
            {
              backgroundColor: isAndroid ? 'rgba(255, 255, 255, 0.15)' : theme.surface,
              borderColor: isAndroid ? 'rgba(255, 255, 255, 0.25)' : theme.border
            },
            pressed && { opacity: 0.6 }
          ]}
        >
          <ArrowLeft size={18} color={isAndroid ? '#FFFFFF' : theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>Booking Details</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
          <Text style={[styles.statusText, { color: statusCfg.text }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, isWeb && styles.webScroll]}
      >
        {/* Modern Hero Image Banner with text overlay */}
        <View style={[styles.heroContainer, { borderColor: theme.border }]}>
          <Image source={{ uri: booking.propertyImage }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroGradient} />
          <View style={styles.heroContent}>
            <View style={styles.heroTextGroup}>
              <Text style={styles.heroTitle}>{booking.propertyTitle}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#C9A14A" />
                <Text style={styles.heroLocation}>{booking.propertyLocation}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Responsive Content Grid */}
        <View style={isWebLarge ? styles.gridRow : styles.gridColumn}>
          {/* LEFT COLUMN: Stay Details & Booking Timeline */}
          <View style={isWebLarge ? styles.leftCol : styles.fullCol}>
            {/* Stay details */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Stay Details</Text>
                <View style={[styles.stayBadge, { backgroundColor: theme.gold + '15' }]}>
                  <Text style={[styles.stayBadgeText, { color: theme.gold }]}>Confirmed Stay</Text>
                </View>
              </View>
              <View style={styles.detailGrid}>
                {[
                  { icon: Calendar, label: 'Check-in', value: formatDate(booking.checkIn) },
                  { icon: Calendar, label: 'Check-out', value: formatDate(booking.checkOut) },
                  { icon: Users, label: 'Guests', value: `${booking.guests} guests` },
                  { icon: BedDouble, label: 'Bedrooms', value: `${booking.bedrooms} beds` },
                ].map((item) => (
                  <View key={item.label} style={[styles.detailItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <View style={[styles.iconCircle, { backgroundColor: theme.gold + '08' }]}>
                      <item.icon size={15} color={theme.gold} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailLabel, { color: theme.textMuted }]}>{item.label}</Text>
                      <Text style={[styles.detailValue, { color: theme.text }]}>{item.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
              <View style={[styles.purposeRow, { backgroundColor: theme.gold + '08', borderColor: theme.gold + '22' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.purposeLabel, { color: theme.textMuted }]}>Occasion</Text>
                </View>
                <Text style={[styles.purposeValue, { color: theme.gold }]}>{booking.purpose}</Text>
              </View>
            </View>

            {/* Point 3: Digital House Manual */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Digital House Manual</Text>
                <View style={[styles.stayBadge, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
                  <Text style={[styles.stayBadgeText, { color: theme.gold }]}>Guest Access</Text>
                </View>
              </View>
              <View style={styles.manualList}>
                <View style={[styles.manualItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Wifi size={16} color={theme.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.manualLabel, { color: theme.textMuted }]}>Wi-Fi Network & Password</Text>
                    <Text style={[styles.manualValue, { color: theme.text }]}>LaRosa_Guest_5G · <Text style={{ color: theme.gold, fontWeight: '800' }}>luxurystay2026</Text></Text>
                  </View>
                </View>
                <View style={[styles.manualItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Key size={16} color={theme.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.manualLabel, { color: theme.textMuted }]}>Smart Door Passcode</Text>
                    <Text style={[styles.manualValue, { color: theme.text }]}>Door Pin: <Text style={{ color: theme.gold, fontWeight: '800' }}>4892#</Text></Text>
                  </View>
                </View>
                <View style={[styles.manualItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <Volume2 size={16} color={theme.gold} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.manualLabel, { color: theme.textMuted }]}>Quiet Hours</Text>
                    <Text style={[styles.manualValue, { color: theme.text }]}>10:00 PM – 8:00 AM (Respect neighborhood)</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Point 3: Invite Travel Companions */}
            <Pressable
              style={({ pressed }) => [
                styles.shareCompanionBtn,
                { backgroundColor: theme.goldGlow, borderColor: theme.gold + '40' },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Share2 size={16} color={theme.gold} />
              <Text style={[styles.shareCompanionText, { color: theme.gold }]}>Invite Travel Companions & Split Bill</Text>
            </Pressable>

            {/* Timeline */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 8 }]}>Booking Timeline</Text>
              <View style={styles.timeline}>
                {booking.bookingTimeline.map((event, i) => (
                  <TimelineItem
                    key={event.id}
                    event={event}
                    isLast={i === booking.bookingTimeline.length - 1}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN: Payment Summary & Support */}
          <View style={isWebLarge ? styles.rightCol : styles.fullCol}>
            {/* Payment summary */}
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>Payment Summary</Text>
              <View style={styles.payList}>
                {[
                  { label: 'Subtotal', value: formatMoney(booking.subtotal) },
                  { label: 'Deposit (Refundable)', value: formatMoney(booking.deposit) },
                  { label: 'Platform Fee', value: formatMoney(booking.platformFee) },
                  { label: 'Taxes', value: formatMoney(booking.taxes) },
                ].map((row) => (
                  <View key={row.label} style={styles.payRow}>
                    <Text style={[styles.payLabel, { color: theme.textSecondary }]}>{row.label}</Text>
                    <Text style={[styles.payValue, { color: theme.text }]}>{row.value}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <View style={styles.payList}>
                <View style={styles.payRow}>
                  <Text style={[styles.payLabelBold, { color: theme.text }]}>Total Amount</Text>
                  <Text style={[styles.payValueBold, { color: theme.gold }]}>{formatMoney(booking.totalPrice)}</Text>
                </View>
                <View style={styles.payRow}>
                  <Text style={[styles.payLabel, { color: theme.textSecondary }]}>Amount Paid</Text>
                  <Text style={[styles.payValuePaid, { color: '#2E7D32' }]}>{formatMoney(booking.paidAmount)}</Text>
                </View>
              </View>

              {booking.remainingAmount > 0 && (
                <View style={[styles.dueRow, { backgroundColor: 'rgba(229,57,53,0.06)', borderColor: 'rgba(229,57,53,0.15)' }]}>
                  <AlertCircle size={15} color="#E53935" />
                  <Text style={styles.dueLabel}>
                    {formatMoney(booking.remainingAmount)} due at check-in
                  </Text>
                </View>
              )}
              {booking.remainingAmount === 0 && (
                <View style={[styles.paidFullRow, { backgroundColor: 'rgba(46,125,50,0.06)', borderColor: 'rgba(46,125,50,0.15)' }]}>
                  <CheckCircle size={15} color="#2E7D32" />
                  <Text style={[styles.paidFullText, { color: '#2E7D32' }]}>Paid in Full</Text>
                </View>
              )}
            </View>

            {/* Caretaker / Support */}
            {property && (
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Need Help?</Text>
                <Text style={[styles.caretakerInfo, { color: theme.textSecondary }]}>
                  Your caretaker <Text style={{ color: theme.text, fontWeight: '700' }}>{property.caretakerName}</Text> is
                  available to assist you during your stay.
                </Text>
                <View style={styles.caretakerActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.caretakerBtn,
                      { backgroundColor: 'rgba(46,125,50,0.08)', borderColor: 'rgba(46,125,50,0.2)' },
                      pressed && { opacity: 0.7 }
                    ]}
                  >
                    <PhoneCall size={14} color="#2E7D32" />
                    <Text style={{ color: '#2E7D32', fontSize: 13, fontWeight: '700' }}>Call Caretaker</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.caretakerBtn,
                      { backgroundColor: theme.gold + '10', borderColor: theme.gold + '30' },
                      pressed && { opacity: 0.7 }
                    ]}
                  >
                    <MessageCircle size={14} color={theme.gold} />
                    <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700' }}>Message Chat</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Cancel booking option */}
            {booking.status === 'upcoming' && (
              <Pressable
                style={({ pressed }) => [
                  styles.cancelBtn,
                  { borderColor: 'rgba(229,57,53,0.2)' },
                  pressed && { opacity: 0.7 }
                ]}
              >
                <XCircle size={15} color="#E53935" />
                <Text style={styles.cancelText}>Cancel Booking</Text>
              </Pressable>
            )}

            {/* Review options for completed stay */}
            {booking.status === 'completed' && (
              <Pressable
                style={({ pressed }) => [
                  styles.reviewBtn,
                  { backgroundColor: theme.gold },
                  pressed && { opacity: 0.85 }
                ]}
              >
                <Text style={[styles.reviewBtnText, { color: theme.textInverse }]}>Leave a Review</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  webHeaderWrap: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  webScroll: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  heroContainer: {
    height: 240,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
  },
  heroTextGroup: {
    gap: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroLocation: {
    fontSize: 14,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 20,
  },
  gridColumn: {
    flexDirection: 'column',
    gap: 16,
  },
  leftCol: {
    flex: 1.5,
    gap: 16,
  },
  rightCol: {
    flex: 1,
    gap: 16,
  },
  fullCol: {
    width: '100%',
    gap: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  stayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stayBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  purposeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
  },
  purposeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  purposeValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  payList: {
    gap: 12,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  payValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  payLabelBold: {
    fontSize: 16,
    fontWeight: '800',
  },
  payValueBold: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  payValuePaid: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
  },
  dueLabel: {
    color: '#E53935',
    fontSize: 13,
    fontWeight: '700',
  },
  paidFullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
  },
  paidFullText: {
    fontSize: 13,
    fontWeight: '700',
  },
  timeline: {
    gap: 0,
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  timelineDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  timelineTime: {
    fontSize: 11,
    marginTop: 6,
  },
  caretakerInfo: {
    fontSize: 14,
    lineHeight: 22,
  },
  caretakerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  caretakerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    width: '100%',
  },
  cancelText: {
    color: '#E53935',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  reviewBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  manualList: {
    gap: 10,
  },
  manualItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  manualLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  manualValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  shareCompanionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
  },
  shareCompanionText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
