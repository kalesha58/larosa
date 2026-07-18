import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme-context';
import { formatMoney } from '../../lib/format';

interface PriceSummaryProps {
  nights: number;
  pricePerNight: number;
  deposit: number;
  platformFeePercent: number;
  couponDiscount?: number;
  couponCode?: string;
  securityDeposit?: number;
  showPayNow?: boolean;
}

export default function PriceSummary({
  nights,
  pricePerNight,
  deposit,
  platformFeePercent,
  couponDiscount = 0,
  couponCode,
  securityDeposit = 0,
  showPayNow = false,
}: PriceSummaryProps) {
  const { theme } = useTheme();

  const subtotal = nights * pricePerNight;
  const platformFee = Math.round(subtotal * (platformFeePercent / 100));
  const taxes = Math.round((subtotal + platformFee) * 0.018); // 1.8% GST on services
  const totalBeforeDiscount = subtotal + platformFee + taxes;
  const total = totalBeforeDiscount - couponDiscount;
  const payNow = deposit + platformFee + taxes - couponDiscount;
  const remaining = subtotal - deposit;

  const Row = ({
    label, value, bold, accent, muted, strike,
  }: {
    label: string;
    value: string;
    bold?: boolean;
    accent?: boolean;
    muted?: boolean;
    strike?: boolean;
  }) => (
    <View style={styles.row}>
      <Text style={[
        styles.rowLabel,
        { color: muted ? theme.textMuted : theme.textSecondary },
        bold && { color: theme.text, fontWeight: '700' },
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.rowValue,
        { color: muted ? theme.textMuted : theme.text },
        bold && { fontWeight: '800' },
        accent && { color: '#C9A14A' },
        strike && styles.strikethrough,
      ]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Price Summary</Text>

      <Row label={`${formatMoney(pricePerNight)} × ${nights} nights`} value={formatMoney(subtotal)} />
      <Row label={`Platform Fee (${platformFeePercent}%)`} value={formatMoney(platformFee)} />
      <Row label="GST & Taxes" value={formatMoney(taxes)} muted />

      {couponDiscount > 0 && (
        <Row
          label={`Coupon (${couponCode})`}
          value={`-${formatMoney(couponDiscount)}`}
          accent
        />
      )}

      {securityDeposit > 0 && (
        <Row
          label="Refundable Security Deposit"
          value={formatMoney(securityDeposit)}
          muted
        />
      )}

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <Row label="Grand Total" value={formatMoney(total + securityDeposit)} bold />

      {showPayNow && (
        <View style={[styles.payNowBox, { backgroundColor: 'rgba(201,161,74,0.08)', borderColor: 'rgba(201,161,74,0.3)' }]}>
          <View style={styles.payNowRow}>
            <Text style={[styles.payNowLabel, { color: theme.textSecondary }]}>Pay Now (Advance)</Text>
            <Text style={styles.payNowAmount}>{formatMoney(payNow)}</Text>
          </View>
          <View style={styles.payNowRow}>
            <Text style={[styles.payLaterLabel, { color: theme.textMuted }]}>Pay at Check-in</Text>
            <Text style={[styles.payLaterAmount, { color: theme.textMuted }]}>{formatMoney(remaining)}</Text>
          </View>
        </View>
      )}

      {/* Deposit breakdown */}
      <View style={[styles.depositNote, { backgroundColor: theme.surfaceElevated }]}>
        <Text style={[styles.depositNoteText, { color: theme.textSecondary }]}>
          💰 Deposit of {formatMoney(deposit)} is included in advance payment.
          Remaining {formatMoney(remaining)} is due at check-in.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  payNowBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  payNowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payNowLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  payNowAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#C9A14A',
  },
  payLaterLabel: {
    fontSize: 13,
  },
  payLaterAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  depositNote: {
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  depositNoteText: {
    fontSize: 12,
    lineHeight: 17,
  },
});
