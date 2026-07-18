import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  CheckCircle, Home, Calendar, Share2, Star, ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { formatMoney, formatDate } from '../../lib/format';

export default function BookingConfirmationScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [showContent, setShowContent] = useState(false);

  const {
    bookingId = `BK${Date.now()}`,
    propertyTitle = 'Aqua Retreat',
    checkIn = '2026-08-15',
    checkOut = '2026-08-19',
    nights = 4,
    guests = 4,
    payNow = 62700,
    remaining = 50000,
    total = 112700,
    paymentMethod = 'upi',
  } = route.params ?? {};

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const PAYMENT_LABELS: Record<string, string> = {
    upi: 'UPI',
    card: 'Credit/Debit Card',
    netbanking: 'Net Banking',
    cash: 'Cash at Check-in',
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Success Animation area */}
        <View style={styles.heroSection}>
          <View style={[styles.successRing, { borderColor: 'rgba(46,125,50,0.15)' }]}>
            <View style={[styles.successInner, { borderColor: 'rgba(46,125,50,0.3)' }]}>
              <View style={[styles.successCircle, { backgroundColor: '#2E7D32' }]}>
                <CheckCircle size={48} color="#fff" fill="#fff" />
              </View>
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: theme.text }]}>Booking Confirmed!</Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Get ready for an unforgettable stay at{'\n'}
            <Text style={{ color: '#C9A14A', fontWeight: '700' }}>{propertyTitle}</Text>
          </Text>

          {/* Booking ID */}
          <View style={[styles.bookingIdPill, { backgroundColor: 'rgba(201,161,74,0.12)', borderColor: 'rgba(201,161,74,0.3)' }]}>
            <Text style={[styles.bookingIdLabel, { color: theme.textMuted }]}>Booking ID</Text>
            <Text style={[styles.bookingIdValue, { color: '#C9A14A' }]}>{bookingId}</Text>
          </View>
        </View>

        {/* Details card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Calendar size={16} color="#C9A14A" />
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Check-in</Text>
            </View>
            <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(checkIn)}</Text>
          </View>
          <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Calendar size={16} color="#C9A14A" />
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Check-out</Text>
            </View>
            <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(checkOut)}</Text>
          </View>
          <View style={[styles.detailDivider, { backgroundColor: theme.border }]} />
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Text style={{ fontSize: 15 }}>🌙</Text>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Duration</Text>
            </View>
            <Text style={[styles.detailValue, { color: theme.text }]}>{nights} nights · {guests} guests</Text>
          </View>
        </View>

        {/* Payment summary */}
        <View style={[styles.paymentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.paymentTitle, { color: theme.text }]}>Payment Summary</Text>
          <View style={styles.paymentRow}>
            <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Paid Now</Text>
            <Text style={styles.paymentPaid}>{formatMoney(payNow)}</Text>
          </View>
          {remaining > 0 && (
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Due at Check-in</Text>
              <Text style={[styles.paymentDue, { color: '#E53935' }]}>{formatMoney(remaining)}</Text>
            </View>
          )}
          <View style={[styles.paymentDivider, { backgroundColor: theme.border }]} />
          <View style={styles.paymentRow}>
            <Text style={[styles.paymentLabel, { color: theme.textSecondary }]}>Grand Total</Text>
            <Text style={[styles.paymentTotal, { color: theme.text }]}>{formatMoney(total)}</Text>
          </View>
          <View style={[styles.methodChip, { backgroundColor: 'rgba(201,161,74,0.1)' }]}>
            <Text style={{ color: '#C9A14A', fontSize: 13, fontWeight: '600' }}>
              via {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
            </Text>
          </View>
        </View>

        {/* What's next */}
        <View style={[styles.nextCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.nextTitle, { color: theme.text }]}>What's next?</Text>
          {[
            { emoji: '📧', text: 'Booking confirmation sent to your email' },
            { emoji: '📱', text: 'Caretaker will contact you 24h before check-in' },
            { emoji: '💳', text: remaining > 0 ? `Pay remaining ${formatMoney(remaining)} at check-in` : 'Full payment completed!' },
            { emoji: '⭐', text: 'Leave a review after your stay to help others' },
          ].map((item, i) => (
            <View key={i} style={styles.nextItem}>
              <Text style={styles.nextEmoji}>{item.emoji}</Text>
              <Text style={[styles.nextText, { color: theme.textSecondary }]}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Rate & Review reminder */}
        <View style={[styles.reviewReminder, { backgroundColor: 'rgba(201,161,74,0.06)', borderColor: 'rgba(201,161,74,0.2)' }]}>
          <Star size={18} color="#C9A14A" fill="#C9A14A" />
          <Text style={[styles.reviewReminderText, { color: theme.textSecondary }]}>
            After your stay, share your experience. Your reviews help fellow travelers discover amazing places!
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate('CBookingDetail', { bookingId })}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Calendar size={18} color="#111111" />
            <Text style={styles.primaryBtnText}>View Booking Details</Text>
          </Pressable>
          <View style={styles.secondaryActions}>
            <Pressable
              onPress={() => navigation.navigate('CHomeTab')}
              style={({ pressed }) => [styles.secondaryBtn, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && { opacity: 0.7 }]}
            >
              <Home size={16} color={theme.text} />
              <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Go Home</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && { opacity: 0.7 }]}
            >
              <Share2 size={16} color={theme.text} />
              <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Share</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  heroSection: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  successRing: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 12, alignItems: 'center', justifyContent: 'center',
  },
  successInner: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 8, alignItems: 'center', justifyContent: 'center',
  },
  successCircle: {
    width: 84, height: 84, borderRadius: 42,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginTop: 8 },
  heroSubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  bookingIdPill: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8,
  },
  bookingIdLabel: { fontSize: 12, fontWeight: '600' },
  bookingIdValue: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  detailsCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12, marginBottom: 14,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '700' },
  detailDivider: { height: StyleSheet.hairlineWidth },
  paymentCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12, marginBottom: 14,
  },
  paymentTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLabel: { fontSize: 14 },
  paymentPaid: { fontSize: 18, fontWeight: '800', color: '#2E7D32' },
  paymentDue: { fontSize: 16, fontWeight: '700' },
  paymentDivider: { height: StyleSheet.hairlineWidth },
  paymentTotal: { fontSize: 18, fontWeight: '800' },
  methodChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  nextCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12, marginBottom: 14,
  },
  nextTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  nextItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  nextEmoji: { fontSize: 18, marginTop: -1 },
  nextText: { flex: 1, fontSize: 14, lineHeight: 20 },
  reviewReminder: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 24,
  },
  reviewReminderText: { flex: 1, fontSize: 13, lineHeight: 19 },
  actions: { gap: 12 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#C9A14A', borderRadius: 16, paddingVertical: 16,
  },
  primaryBtnText: { color: '#111111', fontSize: 16, fontWeight: '800' },
  secondaryActions: { flexDirection: 'row', gap: 12 },
  secondaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, paddingVertical: 14,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600' },
});
