import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Search, IndianRupee } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { Card, Chip, EmptyState } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { formatMoney, formatDateRange } from '../../lib/format';
import type { Booking } from '../../types';

type PaymentFilter = 'all' | 'paid' | 'refunded' | 'disputed';

function paymentLabel(b: Booking): { label: string; colorKey: 'green' | 'red' | 'gold' | 'blue' | 'muted' } {
  if (b.disputeStatus === 'open') return { label: 'Disputed', colorKey: 'red' };
  if (b.status === 'cancelled' || b.razorpayRefundId) return { label: 'Refunded', colorKey: 'red' };
  if (b.status === 'confirmed' && b.razorpayPaymentId) return { label: 'Paid', colorKey: 'green' };
  if (b.status === 'pending') return { label: 'Pending', colorKey: 'gold' };
  if (b.razorpayPaymentId) return { label: 'Paid', colorKey: 'green' };
  return { label: 'Unpaid', colorKey: 'muted' };
}

export default function PaymentsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { bookings } = useData();
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<PaymentFilter>('all');

  const colorFor = (key: ReturnType<typeof paymentLabel>['colorKey']) => {
    if (key === 'green') return theme.green;
    if (key === 'red') return theme.red;
    if (key === 'gold') return theme.gold;
    if (key === 'blue') return theme.blue;
    return theme.textMuted;
  };

  const softFor = (key: ReturnType<typeof paymentLabel>['colorKey']) => {
    if (key === 'green') return theme.greenSoft;
    if (key === 'red') return theme.redSoft;
    if (key === 'gold') return theme.gold + '22';
    if (key === 'blue') return theme.blueSoft;
    return theme.surfaceElevated;
  };

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        if (query) {
          const q = query.toLowerCase();
          if (
            !b.guestName.toLowerCase().includes(q) &&
            !b.roomTitle.toLowerCase().includes(q) &&
            !(b.razorpayPaymentId ?? '').toLowerCase().includes(q) &&
            !(b.razorpayOrderId ?? '').toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        if (filter === 'paid') {
          return b.status !== 'cancelled' && !!b.razorpayPaymentId && b.disputeStatus !== 'open';
        }
        if (filter === 'refunded') {
          return b.status === 'cancelled' || !!b.razorpayRefundId;
        }
        if (filter === 'disputed') {
          return b.disputeStatus === 'open';
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, query, filter]);

  const totals = useMemo(() => {
    const paid = filtered.filter(
      (b) => b.status !== 'cancelled' && b.razorpayPaymentId && b.disputeStatus !== 'open'
    );
    const gross = paid.reduce((sum, b) => sum + b.totalPrice, 0);
    const fee = paid.reduce((sum, b) => sum + Math.round(b.totalPrice * 0.1), 0);
    return { gross, fee, host: gross - fee };
  }, [filtered]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Payments</Text>
        </View>
      </View>

      {/* Summary */}
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <Card style={{ padding: 14 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 10 }}>
            Filtered totals (paid, non-disputed)
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textMuted, fontSize: 11 }}>Gross</Text>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{formatMoney(totals.gross)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textMuted, fontSize: 11 }}>Service fee (10%)</Text>
              <Text style={{ color: theme.gold, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{formatMoney(totals.fee)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textMuted, fontSize: 11 }}>Host payout</Text>
              <Text style={{ color: theme.green, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{formatMoney(totals.host)}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 16,
            height: 48,
            gap: 10,
          }}
        >
          <Search color={theme.textMuted} size={20} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Guest, villa, or Razorpay ID…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {([
          { id: 'all', label: 'All' },
          { id: 'paid', label: 'Paid' },
          { id: 'refunded', label: 'Refunded' },
          { id: 'disputed', label: 'Disputed' },
        ] as { id: PaymentFilter; label: string }[]).map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
            color={f.id === 'paid' ? theme.green : f.id === 'refunded' || f.id === 'disputed' ? theme.red : theme.gold}
          />
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<IndianRupee color={theme.textMuted} size={36} />}
            title="No payments match your filters"
          />
        ) : (
          <View style={{ gap: 10 }}>
            {filtered.map((b) => {
              const serviceFee = Math.round(b.totalPrice * 0.1);
              const hostPayout = b.totalPrice - serviceFee;
              const status = paymentLabel(b);
              return (
                <Pressable
                  key={b.id}
                  onPress={() => navigation.navigate('BookingDetail', { id: b.id })}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <Card style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{b.guestName}</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>{b.roomTitle}</Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
                          {formatDateRange(b.checkIn, b.checkOut)}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 6 }}>
                        <Text style={{ color: theme.gold, fontSize: 15, fontWeight: '700' }}>
                          {formatMoney(b.totalPrice)}
                        </Text>
                        <View
                          style={{
                            backgroundColor: softFor(status.colorKey),
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                          }}
                        >
                          <Text
                            style={{
                              color: colorFor(status.colorKey),
                              fontSize: 11,
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            {status.label}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: theme.borderSoft,
                        gap: 6,
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>Service fee (10%)</Text>
                        <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{formatMoney(serviceFee)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>Host payout (90%)</Text>
                        <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>{formatMoney(hostPayout)}</Text>
                      </View>
                      {b.razorpayPaymentId ? (
                        <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }} numberOfLines={1}>
                          Pay: {b.razorpayPaymentId}
                        </Text>
                      ) : null}
                      {b.razorpayRefundId ? (
                        <Text style={{ color: theme.red, fontSize: 11 }} numberOfLines={1}>
                          Refund: {b.razorpayRefundId}
                        </Text>
                      ) : null}
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
