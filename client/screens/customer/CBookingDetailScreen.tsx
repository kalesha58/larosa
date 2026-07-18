import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft, CheckCircle, Clock, XCircle, PhoneCall, MessageCircle,
  AlertCircle, Calendar, Users, BedDouble,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { customerBookings, properties } from '../../lib/mockData';
import { formatDate, formatMoney } from '../../lib/format';
import type { BookingTimelineEvent } from '../../types';

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  created: Clock,
  confirmed: CheckCircle,
  paid: CheckCircle,
  checkin: Calendar,
  checkout: CheckCircle,
  cancelled: XCircle,
  refunded: AlertCircle,
};

const TIMELINE_COLORS: Record<string, string> = {
  created: '#C9A14A',
  confirmed: '#2E7D32',
  paid: '#2E7D32',
  checkin: '#2E7D32',
  checkout: '#2E7D32',
  cancelled: '#E53935',
  refunded: '#E53935',
};

function TimelineItem({ event, isLast }: { event: BookingTimelineEvent; isLast: boolean }) {
  const { theme } = useTheme();
  const Icon = TIMELINE_ICONS[event.type] ?? Clock;
  const color = TIMELINE_COLORS[event.type] ?? '#C9A14A';

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: color, borderColor: `${color}33` }]}>
          <Icon size={12} color="#fff" />
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
  const { bookingId } = route.params ?? {};

  const booking = customerBookings.find((b) => b.id === bookingId) ?? customerBookings[0];
  const property = properties.find((p) => p.id === booking.propertyId);

  const statusColors = {
    upcoming: { text: '#C9A14A', bg: 'rgba(201,161,74,0.12)' },
    completed: { text: '#2E7D32', bg: 'rgba(46,125,50,0.12)' },
    cancelled: { text: '#E53935', bg: 'rgba(229,57,53,0.12)' },
  };
  const statusCfg = statusColors[booking.status];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Booking Details</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusText, { color: statusCfg.text }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Property card */}
        <View style={[styles.propertyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Image source={{ uri: booking.propertyImage }} style={styles.propertyImage} resizeMode="cover" />
          <View style={styles.propertyInfo}>
            <Text style={[styles.propertyTitle, { color: theme.text }]}>{booking.propertyTitle}</Text>
            <Text style={[styles.propertyLocation, { color: theme.textSecondary }]}>{booking.propertyLocation}</Text>
          </View>
        </View>

        {/* Stay details */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Stay Details</Text>
          <View style={styles.detailGrid}>
            {[
              { icon: Calendar, label: 'Check-in', value: formatDate(booking.checkIn) },
              { icon: Calendar, label: 'Check-out', value: formatDate(booking.checkOut) },
              { icon: Users, label: 'Guests', value: `${booking.guests} guests` },
              { icon: BedDouble, label: 'Bedrooms', value: `${booking.bedrooms} beds` },
            ].map((item) => (
              <View key={item.label} style={[styles.detailItem, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                <item.icon size={16} color="#C9A14A" />
                <Text style={[styles.detailLabel, { color: theme.textMuted }]}>{item.label}</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.purposeRow, { backgroundColor: 'rgba(201,161,74,0.08)', borderColor: 'rgba(201,161,74,0.2)' }]}>
            <Text style={[styles.purposeLabel, { color: theme.textMuted }]}>Purpose</Text>
            <Text style={[styles.purposeValue, { color: '#C9A14A' }]}>{booking.purpose}</Text>
          </View>
        </View>

        {/* Payment summary */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Payment Summary</Text>
          {[
            { label: 'Subtotal', value: formatMoney(booking.subtotal) },
            { label: 'Deposit', value: formatMoney(booking.deposit) },
            { label: 'Platform Fee', value: formatMoney(booking.platformFee) },
            { label: 'Taxes', value: formatMoney(booking.taxes) },
          ].map((row) => (
            <View key={row.label} style={styles.payRow}>
              <Text style={[styles.payLabel, { color: theme.textSecondary }]}>{row.label}</Text>
              <Text style={[styles.payValue, { color: theme.text }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.payRow}>
            <Text style={[styles.payLabelBold, { color: theme.text }]}>Total</Text>
            <Text style={[styles.payValueBold, { color: '#C9A14A' }]}>{formatMoney(booking.totalPrice)}</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={[styles.payLabel, { color: theme.textSecondary }]}>Paid</Text>
            <Text style={[styles.payValue, { color: '#2E7D32', fontWeight: '700' }]}>{formatMoney(booking.paidAmount)}</Text>
          </View>
          {booking.remainingAmount > 0 && (
            <View style={[styles.dueRow, { backgroundColor: 'rgba(229,57,53,0.08)', borderColor: 'rgba(229,57,53,0.2)' }]}>
              <AlertCircle size={16} color="#E53935" />
              <Text style={styles.dueLabel}>
                {formatMoney(booking.remainingAmount)} due at check-in
              </Text>
            </View>
          )}
          {booking.paymentStatus === 'paid' && (
            <View style={[styles.paidFullRow, { backgroundColor: 'rgba(46,125,50,0.08)' }]}>
              <CheckCircle size={14} color="#2E7D32" />
              <Text style={[styles.paidFullText, { color: '#2E7D32' }]}>Fully paid</Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Booking Timeline</Text>
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

        {/* Caretaker */}
        {property && (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Need Help?</Text>
            <Text style={[styles.caretakerInfo, { color: theme.textSecondary }]}>
              Your caretaker <Text style={{ color: theme.text, fontWeight: '700' }}>{property.caretakerName}</Text> is
              available to assist you during your stay.
            </Text>
            <View style={styles.caretakerActions}>
              <Pressable style={[styles.caretakerBtn, { backgroundColor: 'rgba(46,125,50,0.1)', borderColor: 'rgba(46,125,50,0.3)' }]}>
                <PhoneCall size={16} color="#2E7D32" />
                <Text style={{ color: '#2E7D32', fontSize: 14, fontWeight: '700' }}>Call</Text>
              </Pressable>
              <Pressable style={[styles.caretakerBtn, { backgroundColor: 'rgba(201,161,74,0.1)', borderColor: 'rgba(201,161,74,0.3)' }]}>
                <MessageCircle size={16} color="#C9A14A" />
                <Text style={{ color: '#C9A14A', fontSize: 14, fontWeight: '700' }}>Message</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Cancel option for upcoming */}
        {booking.status === 'upcoming' && (
          <Pressable style={[styles.cancelBtn, { borderColor: 'rgba(229,57,53,0.3)' }]}>
            <XCircle size={16} color="#E53935" />
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </Pressable>
        )}

        {/* Review for completed */}
        {booking.status === 'completed' && (
          <Pressable style={styles.reviewBtn}>
            <Text style={styles.reviewBtnText}>⭐ Leave a Review</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, gap: 14, paddingBottom: 100 },
  propertyCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden',
  },
  propertyImage: { width: '100%', height: 160 },
  propertyInfo: { padding: 14 },
  propertyTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  propertyLocation: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detailItem: {
    width: '47%', borderRadius: 12, borderWidth: StyleSheet.hairlineWidth,
    padding: 12, gap: 4, alignItems: 'flex-start',
  },
  detailLabel: { fontSize: 11 },
  detailValue: { fontSize: 14, fontWeight: '700' },
  purposeRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  purposeLabel: { fontSize: 13 },
  purposeValue: { fontSize: 14, fontWeight: '700' },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payLabel: { fontSize: 13 },
  payValue: { fontSize: 13 },
  payLabelBold: { fontSize: 15, fontWeight: '800' },
  payValueBold: { fontSize: 18, fontWeight: '900', letterSpacing: -0.3 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 2 },
  dueRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  dueLabel: { color: '#E53935', fontSize: 13, fontWeight: '700' },
  paidFullRow: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 8 },
  paidFullText: { fontSize: 13, fontWeight: '700' },
  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineLeft: { alignItems: 'center', width: 28 },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineLine: { flex: 1, width: 2, marginTop: 4, marginBottom: 4 },
  timelineContent: { flex: 1, paddingBottom: 16, paddingTop: 2 },
  timelineTitle: { fontSize: 14, fontWeight: '700' },
  timelineDesc: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  timelineTime: { fontSize: 11, marginTop: 4 },
  caretakerInfo: { fontSize: 14, lineHeight: 20 },
  caretakerActions: { flexDirection: 'row', gap: 10 },
  caretakerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 1, borderRadius: 12, paddingVertical: 10,
  },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14,
  },
  cancelText: { color: '#E53935', fontSize: 15, fontWeight: '700' },
  reviewBtn: {
    backgroundColor: '#C9A14A', borderRadius: 14, paddingVertical: 14,
    alignItems: 'center',
  },
  reviewBtnText: { color: '#111111', fontSize: 15, fontWeight: '800' },
});
