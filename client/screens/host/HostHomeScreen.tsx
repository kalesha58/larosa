import { useNavigation } from '@react-navigation/native';
import { CalendarClock, IndianRupee, TrendingUp, RefreshCw, Building } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import {
  Pressable, ScrollView, Text, View, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { formatMoney, formatDateRange, getGreeting } from '../../lib/format';
import HostWebHeader from '../../components/HostWebHeader';

export default function HostHomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { rooms, bookings, respondToBooking } = useData();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
  const G = theme.gold ?? '#C9A14A';

  // Show all rooms tagged for the demo host (host_demo) regardless of who is logged in,
  // so the dashboard always displays populated mock data.
  const hostRooms = useMemo(() => {
    return rooms.filter((r) => r.hostId === 'host_demo' || !r.hostId);
  }, [rooms]);

  const hostRoomIds = useMemo(() => hostRooms.map((r) => r.roomId), [hostRooms]);

  const hostBookings = useMemo(() => {
    return bookings.filter((b) => hostRoomIds.includes(b.roomId));
  }, [bookings, hostRoomIds]);

  const pendingBookings = useMemo(() => {
    return hostBookings.filter((b) => b.status === 'pending');
  }, [hostBookings]);

  const stats = useMemo(() => {
    const confirmed = hostBookings.filter((b) => b.status === 'confirmed');
    const totalRevenue = confirmed.reduce((acc, b) => acc + b.totalPrice, 0);
    const occupancyRate = hostRooms.length > 0 ? 65 + (confirmed.length * 5) % 30 : 0;
    return {
      totalRevenue,
      occupancyRate,
      confirmedCount: confirmed.length,
      pendingCount: pendingBookings.length,
    };
  }, [hostBookings, hostRooms, pendingBookings]);

  const handleRefresh = useCallback(() => {}, []);
  const handleAcceptRequest = (bookingId: string) => respondToBooking(bookingId, 'confirmed');
  const handleRejectRequest = (bookingId: string) => respondToBooking(bookingId, 'cancelled');
  const goAddFarmhouse = () => navigation.navigate('VillaEdit');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <HostWebHeader />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, isWide && s.scrollWide]}
        alwaysBounceVertical
      >
        <View style={[s.shell, isWide && s.shellWide]}>

          {/* ── Page Header ── */}
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={[s.greeting, { color: G }]}>
                {getGreeting()}, {user?.name?.split(' ')[0]} 🌾
              </Text>
              <Text style={[s.pageTitle, { color: theme.text }]}>Host Dashboard</Text>
            </View>
            <Pressable
              onPress={handleRefresh}
              hitSlop={12}
              style={({ pressed }) => [s.refreshBtn, { borderColor: theme.border }, pressed && { opacity: 0.5 }]}
            >
              <RefreshCw color={G} size={16} />
            </Pressable>
          </View>

          {/* ── KPI Strip ── */}
          <View style={[s.kpiRow, isWide && s.kpiRowWide]}>
            {[
              { icon: <IndianRupee size={15} color={G} />, val: formatMoney(stats.totalRevenue), label: 'Earnings', bg: G + '22' },
              { icon: <TrendingUp size={15} color={theme.blue} />, val: `${stats.occupancyRate}%`, label: 'Occupancy', bg: theme.blueSoft },
              { icon: <Building size={15} color={theme.green} />, val: `${hostRooms.length}`, label: 'Listings', bg: theme.greenSoft },
              { icon: <CalendarClock size={15} color={theme.amber} />, val: `${stats.pendingCount}`, label: 'Pending', bg: theme.amberSoft },
            ].map((kpi) => (
              <View key={kpi.label} style={[s.kpiCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[s.kpiIcon, { backgroundColor: kpi.bg }]}>{kpi.icon}</View>
                <Text style={[s.kpiVal, { color: theme.text }]}>{kpi.val}</Text>
                <Text style={[s.kpiLabel, { color: theme.textMuted }]}>{kpi.label}</Text>
              </View>
            ))}
          </View>

          {/* ── Pending Requests ── */}
          {pendingBookings.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionHead}>
                <View style={[s.dot, { backgroundColor: theme.amber }]} />
                <Text style={[s.sectionTitle, { color: theme.text }]}>Action Required</Text>
                <View style={[s.badge, { backgroundColor: theme.amberSoft }]}>
                  <Text style={[s.badgeText, { color: theme.amber }]}>{pendingBookings.length}</Text>
                </View>
              </View>
              <View style={{ gap: 8 }}>
                {pendingBookings.map((b) => (
                  <View key={b.id} style={[s.pendingCard, { backgroundColor: theme.surface, borderColor: theme.amber + '55' }]}>
                    <View style={s.cardRow}>
                      <View style={[s.initials, { backgroundColor: G + '18' }]}>
                        <Text style={[s.initialsText, { color: G }]}>
                          {b.guestName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[s.guestName, { color: theme.text }]}>{b.guestName}</Text>
                        <Text style={[s.guestMeta, { color: theme.textMuted }]}>
                          {b.roomTitle} · {b.guests} guests · {b.nights}N
                        </Text>
                      </View>
                      <Text style={[s.price, { color: G }]}>{formatMoney(b.totalPrice)}</Text>
                    </View>
                    <View style={[s.dateChip, { backgroundColor: theme.surfaceElevated }]}>
                      <CalendarClock size={11} color={theme.textMuted} />
                      <Text style={[s.dateChipText, { color: theme.textSecondary }]}>
                        {formatDateRange(b.checkIn, b.checkOut)}
                      </Text>
                    </View>
                    <View style={s.actions}>
                      <Pressable
                        onPress={() => handleRejectRequest(b.id)}
                        style={({ pressed }) => [s.declineBtn, { borderColor: theme.border }, pressed && { opacity: 0.7 }]}
                      >
                        <Text style={[s.declineText, { color: theme.red }]}>Decline</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleAcceptRequest(b.id)}
                        style={({ pressed }) => [s.confirmBtn, { backgroundColor: G }, pressed && { opacity: 0.85 }]}
                      >
                        <Text style={s.confirmText}>✓ Confirm Stay</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── My Listings ── */}
          <View style={s.section}>
            <View style={s.sectionHead}>
              <Text style={[s.sectionTitle, { color: theme.text }]}>My Farmhouses</Text>
              <Pressable onPress={() => navigation.navigate('HostVillasTab')}>
                <Text style={[s.seeAll, { color: G }]}>See all →</Text>
              </Pressable>
            </View>

            {hostRooms.length === 0 ? (
              <View style={[s.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Building size={28} color={theme.textMuted} />
                <Text style={[s.emptyText, { color: theme.textMuted }]}>No listings created yet</Text>
                <Pressable onPress={goAddFarmhouse} style={[s.addBtn, { backgroundColor: G }]}>
                  <Text style={s.addBtnText}>+ Add First Farmhouse</Text>
                </Pressable>
              </View>
            ) : (
              <View style={[s.grid, isWide && s.gridWide]}>
                {hostRooms.slice(0, isWide ? 6 : 4).map((r) => (
                  <View
                    key={r.roomId}
                    style={[s.listingCard, isWide && s.listingCardWide, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[s.listingName, { color: theme.text }]} numberOfLines={1}>{r.title}</Text>
                      <Text style={[s.listingMeta, { color: theme.textMuted }]}>
                        ₹{r.price.toLocaleString('en-IN')}/night · {r.capacity} guests
                      </Text>
                    </View>
                    <View style={[s.chip, { backgroundColor: r.approvedByAdmin ? theme.greenSoft : theme.amberSoft }]}>
                      <Text style={[s.chipText, { color: r.approvedByAdmin ? theme.green : theme.amber }]}>
                        {r.approvedByAdmin ? 'LIVE' : 'PENDING'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 120 },
  scrollWide: { paddingBottom: 80 },
  shell: { paddingHorizontal: 20 },
  shellWide: { maxWidth: 1120, width: '100%', alignSelf: 'center', paddingHorizontal: 32 },

  header: { paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  pageTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },
  refreshBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },

  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  kpiRowWide: { flexWrap: 'nowrap' },
  kpiCard: { flex: 1, minWidth: 110, padding: 12, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, gap: 5 },
  kpiIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  kpiVal: { fontSize: 17, fontWeight: '900', letterSpacing: -0.5 },
  kpiLabel: { fontSize: 11, fontWeight: '600' },

  section: { marginBottom: 20 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '800', flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  seeAll: { fontSize: 13, fontWeight: '700' },

  pendingCard: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 9 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  initials: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontSize: 12, fontWeight: '900' },
  guestName: { fontSize: 14, fontWeight: '700' },
  guestMeta: { fontSize: 12, marginTop: 1 },
  price: { fontSize: 14, fontWeight: '800' },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7, alignSelf: 'flex-start' },
  dateChipText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  declineBtn: { flex: 1, height: 34, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  declineText: { fontSize: 13, fontWeight: '700' },
  confirmBtn: { flex: 2, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  confirmText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  grid: { gap: 8 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  listingCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 13, paddingVertical: 11 },
  listingCardWide: { flex: 1, minWidth: 260 },
  listingName: { fontSize: 13, fontWeight: '700' },
  listingMeta: { fontSize: 12, marginTop: 2 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  chipText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  emptyBox: { borderRadius: 16, borderWidth: 1, padding: 28, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, fontWeight: '600' },
  addBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
