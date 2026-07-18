import { LinearGradient } from '../../components/LinearGradient';
import { useNavigation } from '@react-navigation/native';
import {
  CalendarClock,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  XCircle,
  RefreshCw,
  Plus,
  Home,
  AlertCircle,
  Building,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { Card, SectionHeader, StatusBadge } from '../../components/ui';
import { formatMoney, formatDateRange, getGreeting } from '../../lib/format';

export default function HostHomeScreen() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { rooms, bookings, respondToBooking } = useData();
  const [refreshing, setRefreshing] = useState(false);

  // Filter listings and bookings owned by this host
  const hostRooms = useMemo(() => {
    return rooms.filter((r) => r.hostId === user?.id || !r.hostId); // default seed rooms also show for host demo
  }, [rooms, user]);

  const hostRoomIds = useMemo(() => hostRooms.map((r) => r.roomId), [hostRooms]);

  const hostBookings = useMemo(() => {
    return bookings.filter((b) => hostRoomIds.includes(b.roomId));
  }, [bookings, hostRoomIds]);

  const pendingBookings = useMemo(() => {
    return hostBookings.filter((b) => b.status === 'pending');
  }, [hostBookings]);

  // Statistics calculations
  const stats = useMemo(() => {
    const confirmed = hostBookings.filter((b) => b.status === 'confirmed');
    const cancelled = hostBookings.filter((b) => b.status === 'cancelled');
    const totalRevenue = confirmed.reduce((acc, b) => acc + b.totalPrice, 0);
    const pendingCount = pendingBookings.length;
    const occupancyRate = hostRooms.length > 0 ? 65 + (confirmed.length * 5) % 30 : 0;

    return {
      totalRevenue,
      occupancyRate,
      confirmedCount: confirmed.length,
      pendingCount,
      cancelledCount: cancelled.length,
    };
  }, [hostBookings, hostRooms, pendingBookings]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAcceptRequest = (bookingId: string) => {
    respondToBooking(bookingId, 'confirmed');
  };

  const handleRejectRequest = (bookingId: string) => {
    respondToBooking(bookingId, 'cancelled');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        alwaysBounceVertical
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: theme.gold }]}>
              {getGreeting()}, {user?.name?.split(' ')[0]} 🌾
            </Text>
            <Text style={{ color: theme.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
              Host Dashboard
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              Manage your premium farmhouses
            </Text>
          </View>
          <Pressable
            onPress={handleRefresh}
            hitSlop={12}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, marginTop: 8 }]}
          >
            <View style={[styles.refreshIconBox, { borderColor: theme.border }]}>
              <RefreshCw color={theme.gold} size={18} />
            </View>
          </Pressable>
        </View>

        {/* KPI Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <SectionHeader title="Overview" />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <Card style={{ flex: 1, padding: 14 }}>
              <View style={[styles.kpiIconBox, { backgroundColor: theme.gold + '22' }]}>
                <IndianRupee color={theme.gold} size={18} />
              </View>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 8 }}>
                {formatMoney(stats.totalRevenue)}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Earnings</Text>
            </Card>

            <Card style={{ flex: 1, padding: 14 }}>
              <View style={[styles.kpiIconBox, { backgroundColor: theme.blueSoft }]}>
                <TrendingUp color={theme.blue} size={18} />
              </View>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 8 }}>
                {stats.occupancyRate}%
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Occupancy</Text>
            </Card>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Card style={{ flex: 1, padding: 14 }}>
              <View style={[styles.kpiIconBox, { backgroundColor: theme.greenSoft }]}>
                <Building color={theme.green} size={18} />
              </View>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 8 }}>
                {hostRooms.length}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Farmhouses</Text>
            </Card>

            <Card style={{ flex: 1, padding: 14 }}>
              <View style={[styles.kpiIconBox, { backgroundColor: theme.amberSoft }]}>
                <CalendarClock color={theme.amber} size={18} />
              </View>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', marginTop: 8 }}>
                {stats.pendingCount}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Pending Requests</Text>
            </Card>
          </View>
        </View>

        {/* Actionable Booking Requests */}
        {pendingBookings.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <SectionHeader title="🚨 Urgent Action Required" />
            <View style={{ gap: 12 }}>
              {pendingBookings.map((b) => (
                <Card key={b.id} style={{ padding: 14, borderColor: theme.amber }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                        {b.guestName}
                      </Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                        {b.roomTitle} · {b.guests} Guests
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
                        {formatDateRange(b.checkIn, b.checkOut)} ({b.nights} nights)
                      </Text>
                      {b.specialRequests && (
                        <View style={[styles.specRequest, { backgroundColor: theme.surfaceElevated }]}>
                          <Text style={{ color: theme.textSecondary, fontSize: 11, fontStyle: 'italic' }}>
                            "{b.specialRequests}"
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: theme.gold, fontSize: 15, fontWeight: '700' }}>
                        {formatMoney(b.totalPrice)}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
                        Deposit: {formatMoney(b.deposit ?? b.pricePerNight * 2)}
                      </Text>
                    </View>
                  </View>

                  {/* Accept/Reject Buttons */}
                  <View style={styles.actionBtns}>
                    <Pressable
                      onPress={() => handleRejectRequest(b.id)}
                      style={[styles.rejectBtn, { borderColor: theme.border }]}
                    >
                      <Text style={{ color: theme.red, fontWeight: '600', fontSize: 13 }}>Decline</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleAcceptRequest(b.id)}
                      style={[styles.acceptBtn, { backgroundColor: theme.gold }]}
                    >
                      <Text style={{ color: '#111', fontWeight: '700', fontSize: 13 }}>Confirm Stay</Text>
                    </Pressable>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* My Farmhouses Quick List */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <SectionHeader
            title="My Farmhouses"
            action={
              <Pressable onPress={() => navigation.navigate('HostVillasTab')}>
                <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '600' }}>See all</Text>
              </Pressable>
            }
          />
          {hostRooms.length === 0 ? (
            <Card style={{ alignItems: 'center', padding: 20 }}>
              <Building size={32} color={theme.textMuted} />
              <Text style={{ color: theme.text, marginTop: 10, fontWeight: '600' }}>No listings created yet</Text>
              <Pressable
                onPress={() => navigation.navigate('HostVillasTab')}
                style={{ marginTop: 12, backgroundColor: theme.gold, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}
              >
                <Text style={{ color: '#111', fontWeight: '700', fontSize: 13 }}>Add First Farmhouse</Text>
              </Pressable>
            </Card>
          ) : (
            <View style={{ gap: 10 }}>
              {hostRooms.slice(0, 3).map((r) => (
                <Card key={r.roomId} style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{r.title}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                      ₹{formatMoney(r.price)}/night · Max {r.capacity} Guests
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {r.approvedByAdmin ? (
                      <View style={[styles.badge, { backgroundColor: theme.greenSoft }]}>
                        <Text style={{ color: theme.green, fontSize: 10, fontWeight: '800' }}>LIVE</Text>
                      </View>
                    ) : (
                      <View style={[styles.badge, { backgroundColor: theme.amberSoft }]}>
                        <Text style={{ color: theme.amber, fontSize: 10, fontWeight: '800' }}>PENDING APPROVAL</Text>
                      </View>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  refreshIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specRequest: {
    marginTop: 8,
    borderRadius: 8,
    padding: 8,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  rejectBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    flex: 2,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
