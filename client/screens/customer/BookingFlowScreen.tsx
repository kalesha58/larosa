import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { properties } from '../../lib/mockData';
import CalendarPicker from '../../components/customer/CalendarPicker';
import GuestCounter from '../../components/customer/GuestCounter';
import BedroomCounter from '../../components/customer/BedroomCounter';
import BookingSummary from '../../components/customer/BookingSummary';
import PriceSummary from '../../components/customer/PriceSummary';
import { formatMoney } from '../../lib/format';

type Step = 'dates' | 'guests' | 'purpose' | 'summary';

const STEPS: Step[] = ['dates', 'guests', 'purpose', 'summary'];
const STEP_LABELS = ['Dates', 'Guests', 'Purpose', 'Summary'];

const PURPOSES = [
  '🎉 Birthday Celebration',
  '💍 Honeymoon / Anniversary',
  '👨‍👩‍👧‍👦 Family Vacation',
  '🏢 Corporate Retreat',
  '👫 Friends Trip',
  '🧘 Wellness Retreat',
  '📸 Photography',
  '🌿 Nature Escape',
];

export default function BookingFlowScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { propertyId } = route.params ?? {};

  const property = properties.find((p) => p.id === propertyId) ?? properties[0];

  const [step, setStep] = useState<Step>('dates');
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [bedrooms, setBedrooms] = useState(property.bedrooms);
  const [purpose, setPurpose] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const currentStepIndex = STEPS.indexOf(step);

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotal = nights * property.pricePerNight;
  const platformFee = Math.round(subtotal * (property.platformFeePercent / 100));
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const taxes = Math.round((subtotal + platformFee) * 0.018);
  const total = subtotal + platformFee + taxes - couponDiscount + property.securityDeposit;

  const canProceed = () => {
    if (step === 'dates') return checkIn !== null && checkOut !== null && nights >= property.minNights;
    if (step === 'guests') return adults >= 1;
    if (step === 'purpose') return purpose.length > 0;
    return true;
  };

  const goNext = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx]);
    } else {
      // Go to payment
      navigation.navigate('Payment', {
        propertyId: property.id,
        checkIn,
        checkOut,
        nights,
        guests: adults + children,
        bedrooms,
        purpose: purpose.replace(/^[^ ]+ /, ''),
        pricePerNight: property.pricePerNight,
        subtotal,
        deposit: property.deposit,
        platformFee,
        taxes,
        couponDiscount,
        couponCode: couponApplied ? couponCode : '',
        securityDeposit: property.securityDeposit,
        total,
        specialRequests,
      });
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setStep(STEPS[currentStepIndex - 1]);
    } else {
      navigation.goBack();
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'LAROSA10') {
      setCouponApplied(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {STEP_LABELS[currentStepIndex]}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
            Step {currentStepIndex + 1} of {STEPS.length}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`, backgroundColor: '#C9A14A' },
          ]}
        />
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicators}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepIndicatorItem}>
            <View style={[
              styles.stepCircle,
              {
                backgroundColor: i < currentStepIndex ? '#2E7D32' : i === currentStepIndex ? '#C9A14A' : theme.surface,
                borderColor: i <= currentStepIndex ? 'transparent' : theme.border,
              },
            ]}>
              {i < currentStepIndex
                ? <Check size={12} color="#fff" />
                : <Text style={[styles.stepCircleText, { color: i === currentStepIndex ? '#111111' : theme.textMuted }]}>
                    {i + 1}
                  </Text>
              }
            </View>
            <Text style={[styles.stepLabel, { color: i === currentStepIndex ? '#C9A14A' : theme.textMuted }]}>
              {STEP_LABELS[i]}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Step: Dates */}
        {step === 'dates' && (
          <View style={styles.stepContent}>
            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.stepCardTitle, { color: theme.text }]}>Select your stay dates</Text>
              <Text style={[styles.stepCardSubtitle, { color: theme.textMuted }]}>
                Minimum stay: {property.minNights} night{property.minNights > 1 ? 's' : ''}
              </Text>
              <CalendarPicker
                checkIn={checkIn}
                checkOut={checkOut}
                onDatesChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }}
                minNights={property.minNights}
              />
            </View>
            {nights > 0 && nights < property.minNights && (
              <Text style={[styles.warningText, { color: '#E53935' }]}>
                ⚠️ Minimum stay is {property.minNights} nights. Please select at least {property.minNights} nights.
              </Text>
            )}
            {nights >= property.minNights && (
              <View style={[styles.nightsBadge, { backgroundColor: 'rgba(46,125,50,0.1)', borderColor: 'rgba(46,125,50,0.3)' }]}>
                <Check size={14} color="#2E7D32" />
                <Text style={[styles.nightsBadgeText, { color: '#2E7D32' }]}>
                  {nights} nights selected · {formatMoney(nights * property.pricePerNight)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Step: Guests */}
        {step === 'guests' && (
          <View style={styles.stepContent}>
            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.stepCardTitle, { color: theme.text }]}>Who's coming?</Text>
              <GuestCounter
                adults={adults}
                children={children}
                onAdultsChange={setAdults}
                onChildrenChange={setChildren}
                maxCapacity={property.capacity}
              />
            </View>
            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <BedroomCounter
                value={bedrooms}
                onChange={setBedrooms}
                max={property.bedrooms}
              />
            </View>
            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.stepCardTitle, { color: theme.text }]}>Special Requests</Text>
              <TextInput
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="Dietary requirements, accessibility, celebrations…"
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                style={[styles.textarea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
              />
            </View>
          </View>
        )}

        {/* Step: Purpose */}
        {step === 'purpose' && (
          <View style={styles.stepContent}>
            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.stepCardTitle, { color: theme.text }]}>What's the occasion?</Text>
              <Text style={[styles.stepCardSubtitle, { color: theme.textMuted }]}>
                This helps us personalize your experience
              </Text>
              <View style={styles.purposeGrid}>
                {PURPOSES.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPurpose(p)}
                    style={({ pressed }) => [
                      styles.purposeChip,
                      {
                        backgroundColor: purpose === p ? '#C9A14A' : theme.bg,
                        borderColor: purpose === p ? '#C9A14A' : theme.border,
                      },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={[styles.purposeChipText, { color: purpose === p ? '#111111' : theme.textSecondary }]}>
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Step: Summary */}
        {step === 'summary' && (
          <View style={styles.stepContent}>
            <BookingSummary
              propertyTitle={property.title}
              propertyLocation={property.location}
              checkIn={checkIn!}
              checkOut={checkOut!}
              nights={nights}
              guests={adults + children}
              bedrooms={bedrooms}
              purpose={purpose.replace(/^[^ ]+ /, '')}
              pricePerNight={property.pricePerNight}
            />
            <PriceSummary
              nights={nights}
              pricePerNight={property.pricePerNight}
              deposit={property.deposit}
              platformFeePercent={property.platformFeePercent}
              couponDiscount={couponDiscount}
              couponCode={couponApplied ? couponCode : undefined}
              securityDeposit={property.securityDeposit}
              showPayNow
            />
            {/* Coupon */}
            <View style={[styles.couponCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.couponLabel, { color: theme.text }]}>Have a coupon?</Text>
              <View style={styles.couponRow}>
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Enter code (try LAROSA10)"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="characters"
                  style={[styles.couponInput, { color: theme.text, borderColor: couponApplied ? '#2E7D32' : theme.border, backgroundColor: theme.bg }]}
                  editable={!couponApplied}
                />
                <Pressable
                  onPress={applyCoupon}
                  disabled={couponApplied || couponCode.length === 0}
                  style={[styles.couponBtn, { backgroundColor: couponApplied ? '#2E7D32' : '#C9A14A' }]}
                >
                  {couponApplied
                    ? <Check size={16} color="#fff" />
                    : <Text style={styles.couponBtnText}>Apply</Text>
                  }
                </Pressable>
              </View>
              {couponApplied && (
                <Text style={{ color: '#2E7D32', fontSize: 13, fontWeight: '600', marginTop: 4 }}>
                  ✅ 10% discount applied!
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        {step === 'summary' && (
          <View style={styles.ctaLeft}>
            <Text style={[styles.ctaTotal, { color: '#C9A14A' }]}>{formatMoney(total)}</Text>
            <Text style={[styles.ctaTotalLabel, { color: theme.textMuted }]}>Grand Total</Text>
          </View>
        )}
        <Pressable
          onPress={goNext}
          disabled={!canProceed()}
          style={({ pressed }) => [
            styles.ctaBtn,
            !canProceed() && { opacity: 0.4 },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.ctaBtnText}>
            {step === 'summary' ? 'Proceed to Payment' : 'Continue'}
          </Text>
          <ChevronRight size={18} color="#111111" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 1 },
  progressBar: {
    height: 3, marginHorizontal: 20, borderRadius: 2,
    overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 2 },
  stepIndicators: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 8,
  },
  stepIndicatorItem: { alignItems: 'center', gap: 4, flex: 1 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleText: { fontSize: 12, fontWeight: '700' },
  stepLabel: { fontSize: 10, fontWeight: '600' },
  scroll: { paddingBottom: 100 },
  stepContent: { paddingHorizontal: 20, gap: 14 },
  stepCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 18, gap: 12,
  },
  stepCardTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  stepCardSubtitle: { fontSize: 13, marginTop: -6 },
  warningText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  nightsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderRadius: 12, padding: 12,
  },
  nightsBadgeText: { fontSize: 14, fontWeight: '700' },
  textarea: {
    borderWidth: 1, borderRadius: 12, padding: 12,
    fontSize: 14, minHeight: 80, textAlignVertical: 'top',
  },
  purposeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  purposeChip: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1,
  },
  purposeChipText: { fontSize: 14, fontWeight: '600' },
  couponCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 10,
  },
  couponLabel: { fontSize: 15, fontWeight: '700' },
  couponRow: { flexDirection: 'row', gap: 8 },
  couponInput: {
    flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 46,
    fontSize: 14, letterSpacing: 1,
  },
  couponBtn: {
    width: 80, height: 46, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  couponBtnText: { color: '#111111', fontSize: 14, fontWeight: '700' },
  ctaBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 20,
    paddingVertical: 12, paddingBottom: 24,
  },
  ctaLeft: { gap: 2 },
  ctaTotal: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  ctaTotalLabel: { fontSize: 12 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#C9A14A', borderRadius: 16,
    paddingHorizontal: 24, paddingVertical: 14, flex: 1, marginLeft: 12,
    justifyContent: 'center',
  },
  ctaBtnText: { color: '#111111', fontSize: 16, fontWeight: '800' },
});
