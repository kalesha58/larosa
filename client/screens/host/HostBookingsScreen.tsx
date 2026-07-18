import { useNavigation } from '@react-navigation/native';
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  User,
  IndianRupee,
  MessageSquare,
  CreditCard,
  Check,
  X,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { Card, Chip, EmptyState, StatusBadge } from '../../components/ui';
import { formatMoney, formatDateRange } from '../../lib/format';
import type { Booking } from '../../types';

type FilterType = 'pending' | 'confirmed' | 'all';

export default function HostBookingsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { rooms, bookings, respondToBooking } = useData();
  const [filter, setFilter] = useState<FilterType>('pending');

  const hostRooms = useMemo(() => {
    return rooms.filter((r) => r.hostId === user?.id || !r.hostId);
  }, [rooms, user]);

  const hostRoomIds = useMemo(() => hostRooms.map((r) => r.roomId), [hostRooms]);

  const hostBookings = useMemo(() => {
    return bookings.filter((b) => hostRoomIds.includes(b.roomId));
  }, [bookings, hostRoomIds]);

  const filteredBookings = useMemo(() => {
    return hostBookings.filter((b) => {
      if (filter === 'pending') return b.status === 'pending';
      if (filter === 'confirmed') return b.status === 'confirmed';
      return true;
    });
  }, [hostBookings, filter]);

  const handleAccept = (booking: Booking) => {
    Alert.alert(
      'Confirm Booking Request',
      `Confirm booking for ${booking.guestName} check-in on ${booking.checkIn}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            respondToBooking(booking.id, 'confirmed');
            Alert.alert('Booking Confirmed', 'Guest has been notified.');
          },
        },
      ]
    );
  };

  const handleReject = (booking: Booking) => {
    Alert.alert(
      'Decline Booking Request',
      `Decline booking for ${booking.guestName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            respondToBooking(booking.id, 'cancelled');
            Alert.alert('Booking Declined', 'Guest has been notified.');
          },
        },
      ]
    );
  };

  // Remaining balance payment mode helper
  const getBalancePaymentType = (booking: Booking) => {
    // If Airbnb, it is online check-in. If manual/website, guest pays deposit online, and balance at check-in (cash or online)
    if (booking.source === 'airbnb') return 'Paid Online';
    if (booking.source === 'website') return 'Cash at Check-in';
    return 'Collect Cash / UPI';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          Stays & Requests
        </Text>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', marginTop: 4 }}>
          Bookings
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {([
          { id: 'pending', label: 'Requests' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'all', label: 'All Bookings' },
        ] as { id: FilterType; label: string }[]).map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setFilter(tab.id)}
            style={[
              styles.tabBtn,
              {
                borderBottomColor: filter === tab.id ? theme.gold : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.tabBtnText,
                {
                  color: filter === tab.id ? theme.gold : theme.textMuted,
                  fontWeight: filter === tab.id ? '700' : '600',
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 }}
      >
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays color={theme.textMuted} size={36} />}
            title={`No ${filter} bookings`}
            subtitle="Bookings for your properties will appear here."
          />
        ) : (
          <View style={{ gap: 14 }}>
            {filteredBookings.map((b) => {
              const deposit = b.deposit ?? b.pricePerNight * 2;
              const remaining = Math.max(0, b.totalPrice - deposit);

              return (
                <Card key={b.id} style={{ padding: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
                        {b.guestName}
                      </Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                        {b.roomTitle} · {b.guests} Guests
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
                        {formatDateRange(b.checkIn, b.checkOut)} ({b.nights} nights)
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '700' }}>
                        {formatMoney(b.totalPrice)}
                      </Text>
                      <StatusBadge status={b.status} />
                    </View>
                  </View>

                  {/* Financial Tracker */}
                  <View style={[styles.financeTracker, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                    <View style={styles.financeItem}>
                      <Text style={styles.financeLabel}>Deposit Paid</Text>
                      <Text style={[styles.financeVal, { color: theme.green }]}>
                        ₹{formatMoney(deposit)}
                      </Text>
                    </View>
                    
                    <View style={styles.financeLine} />

                    <View style={styles.financeItem}>
                      <Text style={styles.financeLabel}>Remaining Balance</Text>
                      <Text style={[styles.financeVal, { color: theme.text }]}>
                        ₹{formatMoney(remaining)}
                      </Text>
                    </View>

                    <View style={styles.financeLine} />

                    <View style={[styles.financeItem, { alignItems: 'flex-end' }]}>
                      <Text style={styles.financeLabel}>Collect Mode</Text>
                      <Text style={[styles.financeVal, { color: theme.gold, fontSize: 12 }]}>
                        {getBalancePaymentType(b)}
                      </Text>
                    </View>
                  </View>

                  {/* Guest Contact Details */}
                  <View style={{ gap: 6, marginTop: 12 }}>
                    <View style={styles.contactRow}>
                      <Phone size={14} color={theme.textMuted} />
                      <Text style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 6 }}>{b.guestPhone}</Text>
                    </View>
                    <View style={styles.contactRow}>
                      <Mail size={14} color={theme.textMuted} />
                      <Text style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 6 }}>{b.guestEmail}</Text>
                    </View>
                    {b.specialRequests && (
                      <View style={[styles.specRequest, { backgroundColor: theme.bg }]}>
                        <MessageSquare size={12} color={theme.gold} style={{ marginTop: 2 }} />
                        <Text style={{ color: theme.textSecondary, fontSize: 12, flex: 1 }}>
                          "{b.specialRequests}"
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Incoming Request Actions */}
                  {b.status === 'pending' && (
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => handleReject(b)}
                        style={[styles.actionBtn, { borderColor: theme.red }]}
                      >
                        <X color={theme.red} size={16} />
                        <Text style={{ color: theme.red, fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Decline</Text>
                      </Pressable>
                      
                      <Pressable
                        onPress={() => handleAccept(b)}
                        style={[styles.actionBtn, { backgroundColor: theme.gold }]}
                      >
                        <Check color="#111" size={16} strokeWidth={2.5} />
                        <Text style={{ color: '#111', fontWeight: '700', fontSize: 13, marginLeft: 6 }}>Confirm Stay</Text>
                      </Pressable>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  tabBtnText: {
    fontSize: 13,
  },
  financeTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 12,
    justifyContent: 'space-between',
  },
  financeItem: {
    flex: 1.5,
  },
  financeLabel: {
    color: '#888',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  financeVal: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  financeLine: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specRequest: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
