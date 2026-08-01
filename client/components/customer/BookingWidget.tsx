import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Gem, ChevronDown, Flag, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { formatMoney } from '../../lib/format';

interface BookingWidgetProps {
  pricePerNight: number;
  nights: number;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  maxGuests: number;
  bookingType: 'instant' | 'request';
  cancellationHint?: string;
  onCheckInPress?: () => void;
  onCheckOutPress?: () => void;
  onGuestsChange: (guests: number) => void;
  onReserve: () => void;
  compact?: boolean;
}

function formatShortDate(iso: string | null): string {
  if (!iso) return 'Add date';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function BookingWidget({
  pricePerNight,
  nights,
  checkIn,
  checkOut,
  guests,
  maxGuests,
  bookingType,
  cancellationHint,
  onCheckInPress,
  onCheckOutPress,
  onGuestsChange,
  onReserve,
  compact = false,
}: BookingWidgetProps) {
  const { theme } = useTheme();
  const [guestsOpen, setGuestsOpen] = useState(false);
  const total = nights > 0 ? nights * pricePerNight : pricePerNight;

  if (compact) {
    return (
      <View style={[styles.compactBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.compactPrice, { color: theme.text }]}>
            {formatMoney(total)}
            <Text style={[styles.compactUnit, { color: theme.textMuted }]}>
              {nights > 0 ? ` for ${nights} night${nights > 1 ? 's' : ''}` : ' / night'}
            </Text>
          </Text>
          {(checkIn || checkOut) && (
            <Text style={[styles.compactDates, { color: theme.textSecondary }]}>
              {formatShortDate(checkIn)} – {formatShortDate(checkOut)}
            </Text>
          )}
        </View>
        <Pressable
          onPress={onReserve}
          style={({ pressed }) => [styles.compactBtn, { backgroundColor: theme.gold }, pressed && { opacity: 0.88 }]}
        >
          <Text style={[styles.compactBtnText, { color: theme.textInverse }]}>
            {bookingType === 'instant' ? 'Reserve' : 'Request'}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.feesPill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Gem size={14} color={theme.gold} />
        <Text style={[styles.feesText, { color: theme.text }]}>Prices include all fees</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.priceLine, { color: theme.text }]}>
          {formatMoney(total)}
          <Text style={[styles.priceSub, { color: theme.text }]}>
            {nights > 0 ? ` for ${nights} night${nights > 1 ? 's' : ''}` : ' / night'}
          </Text>
        </Text>

        <View style={[styles.dateBox, { borderColor: theme.text }]}>
          <View style={styles.dateRow}>
            <Pressable style={[styles.dateCell, { borderRightColor: theme.border }]} onPress={onCheckInPress}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>CHECK-IN</Text>
              <Text style={[styles.fieldValue, { color: theme.text }]}>{formatShortDate(checkIn)}</Text>
            </Pressable>
            <Pressable style={styles.dateCell} onPress={onCheckOutPress}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>CHECKOUT</Text>
              <Text style={[styles.fieldValue, { color: theme.text }]}>{formatShortDate(checkOut)}</Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.guestsCell, { borderTopColor: theme.border }]}
            onPress={() => setGuestsOpen((v) => !v)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: theme.text }]}>GUESTS</Text>
              <Text style={[styles.fieldValue, { color: theme.text }]}>
                {guests} guest{guests !== 1 ? 's' : ''}
              </Text>
            </View>
            <ChevronDown size={16} color={theme.text} />
          </Pressable>
        </View>

        {guestsOpen && (
          <View style={[styles.guestPicker, { borderColor: theme.border, backgroundColor: theme.surfaceElevated }]}>
            <Text style={[styles.guestPickerLabel, { color: theme.text }]}>Guests</Text>
            <View style={styles.counterRow}>
              <Pressable
                onPress={() => onGuestsChange(Math.max(1, guests - 1))}
                style={[styles.counterBtn, { borderColor: theme.border }]}
              >
                <Minus size={14} color={theme.text} />
              </Pressable>
              <Text style={[styles.counterVal, { color: theme.text }]}>{guests}</Text>
              <Pressable
                onPress={() => onGuestsChange(Math.min(maxGuests, guests + 1))}
                style={[styles.counterBtn, { borderColor: theme.border }]}
              >
                <Plus size={14} color={theme.text} />
              </Pressable>
            </View>
            <Text style={[styles.guestHint, { color: theme.textMuted }]}>Maximum {maxGuests} guests</Text>
          </View>
        )}

        {cancellationHint ? (
          <View style={[styles.cancelNote, { backgroundColor: theme.surfaceElevated }]}>
            <Text style={[styles.cancelNoteText, { color: theme.textSecondary }]}>{cancellationHint}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={onReserve}
          style={({ pressed }) => [styles.reserveBtn, { backgroundColor: theme.gold }, pressed && { opacity: 0.88 }]}
        >
          <Text style={[styles.reserveText, { color: theme.textInverse }]}>
            {bookingType === 'instant' ? 'Reserve' : 'Request to book'}
          </Text>
        </Pressable>

        <Text style={[styles.disclaimer, { color: theme.textMuted }]}>You won't be charged yet</Text>
      </View>

      <Pressable style={styles.reportRow}>
        <Flag size={13} color={theme.textMuted} />
        <Text style={[styles.reportText, { color: theme.textMuted }]}>Report this listing</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  feesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  feesText: { fontSize: 13, fontWeight: '600' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  priceLine: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  priceSub: { fontSize: 16, fontWeight: '600' },
  dateBox: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dateRow: { flexDirection: 'row' },
  dateCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  guestsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fieldLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6, marginBottom: 4 },
  fieldValue: { fontSize: 14, fontWeight: '500' },
  guestPicker: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  guestPickerLabel: { fontSize: 14, fontWeight: '700' },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterVal: { fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  guestHint: { fontSize: 12 },
  cancelNote: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelNoteText: { fontSize: 13, lineHeight: 18 },
  reserveBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveText: { fontSize: 16, fontWeight: '800' },
  disclaimer: { textAlign: 'center', fontSize: 13 },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  reportText: { fontSize: 13, textDecorationLine: 'underline' },
  compactBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 50,
  },
  compactPrice: { fontSize: 16, fontWeight: '800' },
  compactUnit: { fontSize: 13, fontWeight: '500' },
  compactDates: { fontSize: 12, marginTop: 2, textDecorationLine: 'underline' },
  compactBtn: {
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  compactBtnText: { fontSize: 15, fontWeight: '800' },
});
