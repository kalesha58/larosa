import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Lock, Shield } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import BookingSummary from '../../components/customer/BookingSummary';
import PriceSummary from '../../components/customer/PriceSummary';
import PaymentCard, { PaymentMethod } from '../../components/customer/PaymentCard';
import { formatMoney } from '../../lib/format';

export default function PaymentScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params ?? {};

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    propertyId = 'prop_1',
    checkIn = '2026-08-15',
    checkOut = '2026-08-19',
    nights = 4,
    guests = 4,
    bedrooms = 3,
    purpose = 'Family Vacation',
    pricePerNight = 25000,
    subtotal = 100000,
    deposit = 50000,
    platformFee = 10000,
    taxes = 2700,
    couponDiscount = 0,
    couponCode = '',
    securityDeposit = 10000,
    total = 122700,
    specialRequests = '',
  } = params;

  const payNow = deposit + platformFee + taxes - couponDiscount;

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1800));
    setIsProcessing(false);
    navigation.replace('BookingConfirmation', {
      bookingId: `BK${Date.now()}`,
      propertyTitle: params.propertyTitle || 'Aqua Retreat',
      checkIn,
      checkOut,
      nights,
      guests,
      payNow,
      remaining: subtotal - deposit,
      total,
      paymentMethod: selectedMethod,
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Secure Payment</Text>
        <View style={[styles.secureChip, { backgroundColor: 'rgba(46,125,50,0.1)' }]}>
          <Lock size={12} color="#2E7D32" />
          <Text style={[styles.secureText, { color: '#2E7D32' }]}>Secure</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Booking summary */}
        <BookingSummary
          propertyTitle={params.propertyTitle || 'Aqua Retreat'}
          propertyLocation={params.propertyLocation || 'Kumarakom, Kerala'}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          guests={guests}
          bedrooms={bedrooms}
          purpose={purpose}
          pricePerNight={pricePerNight}
        />

        {/* Price breakdown */}
        <PriceSummary
          nights={nights}
          pricePerNight={pricePerNight}
          deposit={deposit}
          platformFeePercent={10}
          couponDiscount={couponDiscount}
          couponCode={couponCode}
          securityDeposit={securityDeposit}
          showPayNow
        />

        {/* Payment methods */}
        <View style={styles.paymentSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Choose Payment Method</Text>
          <PaymentCard
            selected={selectedMethod}
            onSelect={setSelectedMethod}
          />
        </View>

        {/* UPI ID input */}
        {selectedMethod === 'upi' && (
          <View style={[styles.upiCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.upiLabel, { color: theme.text }]}>UPI ID</Text>
            <TextInput
              value={upiId}
              onChangeText={setUpiId}
              placeholder="yourname@upi"
              placeholderTextColor={theme.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.upiInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
            />
            <Text style={[styles.upiHint, { color: theme.textMuted }]}>
              Enter your UPI ID to proceed. We'll send a payment request to your UPI app.
            </Text>
          </View>
        )}

        {/* Trust badges */}
        <View style={[styles.trustRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Shield size={16} color="#2E7D32" />
          <Text style={[styles.trustText, { color: theme.textSecondary }]}>
            100% secure payment. Your data is encrypted with 256-bit SSL.
          </Text>
        </View>

        {/* Pay now breakdown */}
        <View style={[styles.payNowSummary, { backgroundColor: '#C9A14A11', borderColor: 'rgba(201,161,74,0.3)' }]}>
          <View style={styles.payNowRow}>
            <Text style={[styles.payNowLabel, { color: theme.textSecondary }]}>Paying now</Text>
            <Text style={styles.payNowAmount}>{formatMoney(payNow)}</Text>
          </View>
          <View style={styles.payNowRow}>
            <Text style={[styles.payLaterLabel, { color: theme.textMuted }]}>Due at check-in</Text>
            <Text style={[styles.payLaterAmount, { color: theme.textMuted }]}>
              {formatMoney(subtotal - deposit)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Pay button */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.footerTotal, { color: '#C9A14A' }]}>{formatMoney(payNow)}</Text>
          <Text style={[styles.footerLabel, { color: theme.textMuted }]}>Pay now · advance</Text>
        </View>
        <Pressable
          onPress={handlePay}
          disabled={!selectedMethod || isProcessing}
          style={({ pressed }) => [
            styles.payBtn,
            (!selectedMethod || isProcessing) && { opacity: 0.5 },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Lock size={16} color="#111111" />
          <Text style={styles.payBtnText}>
            {isProcessing ? 'Processing…' : 'Pay Securely'}
          </Text>
        </Pressable>
      </View>
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
  secureChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  secureText: { fontSize: 12, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, gap: 16, paddingBottom: 100 },
  paymentSection: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  upiCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 10,
  },
  upiLabel: { fontSize: 15, fontWeight: '700' },
  upiInput: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 15,
  },
  upiHint: { fontSize: 12, lineHeight: 17 },
  trustRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14,
  },
  trustText: { flex: 1, fontSize: 13, lineHeight: 18 },
  payNowSummary: {
    borderWidth: 1, borderRadius: 16, padding: 16, gap: 8,
  },
  payNowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payNowLabel: { fontSize: 14, fontWeight: '600' },
  payNowAmount: { fontSize: 22, fontWeight: '900', color: '#C9A14A', letterSpacing: -0.5 },
  payLaterLabel: { fontSize: 13 },
  payLaterAmount: { fontSize: 14, fontWeight: '600' },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 20,
    paddingVertical: 12, paddingBottom: 24, gap: 12,
  },
  footerTotal: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  footerLabel: { fontSize: 12, marginTop: 1 },
  payBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#C9A14A', borderRadius: 16, paddingVertical: 14,
  },
  payBtnText: { color: '#111111', fontSize: 16, fontWeight: '800' },
});
