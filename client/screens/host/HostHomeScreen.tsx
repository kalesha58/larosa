import { useNavigation } from '@react-navigation/native';
import { CalendarClock, IndianRupee, TrendingUp, RefreshCw, Building, ChevronRight, Check } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import {
  Pressable, ScrollView, Text, View, StyleSheet, Platform, useWindowDimensions, Image,
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
  const G = '#C9A14A';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <HostWebHeader />}

      {/* ── Top Green Header Block (Android/Mobile) ── */}
      {Platform.OS === 'android' && (
        <View style={s.heroHeader}>
          <View style={s.heroHeaderInner}>
            <View style={{ flex: 1 }}>
              <Text style={s.heroGreeting}>
                {getGreeting().toUpperCase()}, {user?.name?.split(' ')[0]} 🌾
              </Text>
              <Text style={s.heroTitle}>Host Dashboard</Text>
            </View>
            <Pressable
              onPress={handleRefresh}
              hitSlop={12}
              style={({ pressed }) => [s.heroRefreshBtn, pressed && { opacity: 0.6 }]}
            >
              <RefreshCw color="#FFFFFF" size={18} />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── Main Body Content ── */}
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[s.scroll, isWide && s.scrollWide]}
          alwaysBounceVertical
        >
          <View style={[s.shell, isWide && s.shellWide]}>

            {/* ── Page Header (Non-Android / Web) ── */}
            {Platform.OS !== 'android' && (
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
                  style={({ pressed }) => [s.refreshBtn, { borderColor: theme.border, backgroundColor: theme.surface }, pressed && { opacity: 0.5 }]}
                >
                  <RefreshCw color={G} size={16} />
                </Pressable>
              </View>
            )}

            {/* ── Symmetrical 2x2 KPI Grid ── */}
            <View style={s.kpiGrid}>
              {[
                { icon: <IndianRupee size={18} color={G} />, val: formatMoney(stats.totalRevenue), label: 'Total Earnings', bg: G + '1A' },
                { icon: <TrendingUp size={18} color={theme.blue} />, val: `${stats.occupancyRate}%`, label: 'Occupancy Rate', bg: theme.blueSoft },
                { icon: <Building size={18} color={theme.green} />, val: `${hostRooms.length}`, label: 'Farmhouses', bg: theme.greenSoft },
                { icon: <CalendarClock size={18} color={theme.amber} />, val: `${stats.pendingCount}`, label: 'Pending Requests', bg: theme.amberSoft },
              ].map((kpi) => (
                <View key={kpi.label} style={[s.kpiCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={s.kpiCardTop}>
                    <View style={[s.kpiIconBox, { backgroundColor: kpi.bg }]}>{kpi.icon}</View>
                  </View>
                  <Text style={[s.kpiValueText, { color: theme.text }]}>{kpi.val}</Text>
                  <Text style={[s.kpiLabelText, { color: theme.textMuted }]}>{kpi.label}</Text>
                </View>
              ))}
            </View>

            {/* ── Pending Requests (Action Required) ── */}
            {pendingBookings.length > 0 && (
              <View style={s.section}>
                <View style={s.sectionHead}>
                  <View style={[s.dot, { backgroundColor: theme.amber }]} />
                  <Text style={[s.sectionTitle, { color: theme.text }]}>Action Required</Text>
                  <View style={[s.badge, { backgroundColor: theme.amberSoft }]}>
                    <Text style={[s.badgeText, { color: theme.amber }]}>{pendingBookings.length}</Text>
                  </View>
                </View>
                <View style={{ gap: 12 }}>
                  {pendingBookings.map((b) => (
                    <View key={b.id} style={[s.pendingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <View style={s.cardRow}>
                        <View style={[s.avatarCircle, { backgroundColor: G + '1A' }]}>
                          <Text style={[s.avatarText, { color: G }]}>
                            {b.guestName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.guestNameText, { color: theme.text }]}>{b.guestName}</Text>
                          <Text style={[s.guestMetaText, { color: theme.textMuted }]}>
                            {b.roomTitle} · {b.guests} Guests · {b.nights}N
                          </Text>
                        </View>
                        <Text style={[s.priceText, { color: G }]}>{formatMoney(b.totalPrice)}</Text>
                      </View>

                      <View style={[s.dateChip, { backgroundColor: theme.surfaceElevated }]}>
                        <CalendarClock size={12} color={theme.textMuted} />
                        <Text style={[s.dateChipText, { color: theme.textSecondary }]}>
                          {formatDateRange(b.checkIn, b.checkOut)}
                        </Text>
                      </View>

                      <View style={s.actionsRow}>
                        <Pressable
                          onPress={() => handleRejectRequest(b.id)}
                          style={({ pressed }) => [s.declinePillBtn, { borderColor: theme.border }, pressed && { opacity: 0.7 }]}
                        >
                          <Text style={[s.declinePillText, { color: theme.red }]}>Decline</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleAcceptRequest(b.id)}
                          style={({ pressed }) => [s.confirmPillBtn, { backgroundColor: G }, pressed && { opacity: 0.85 }]}
                        >
                          <Check color="#FFFFFF" size={15} strokeWidth={2.5} />
                          <Text style={s.confirmPillText}>Confirm Stay</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ── My Farmhouses Section ── */}
            <View style={s.section}>
              <View style={s.sectionHead}>
                <Text style={[s.sectionTitle, { color: theme.text }]}>My Farmhouses</Text>
                <Pressable onPress={() => navigation.navigate('HostVillasTab')}>
                  <Text style={[s.seeAllText, { color: G }]}>See all →</Text>
                </Pressable>
              </View>

              {hostRooms.length === 0 ? (
                <View style={[s.emptyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Building size={32} color={theme.textMuted} />
                  <Text style={[s.emptyText, { color: theme.textMuted }]}>No listings created yet</Text>
                  <Pressable onPress={goAddFarmhouse} style={[s.addBtn, { backgroundColor: G }]}>
                    <Text style={s.addBtnText}>+ Add First Farmhouse</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={s.farmhouseList}>
                  {hostRooms.slice(0, 4).map((r) => (
                    <Pressable
                      key={r.roomId}
                      onPress={() => navigation.navigate('VillaEdit', { roomId: String(r.roomId) })}
                      style={({ pressed }) => [
                        s.farmhouseCard,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        pressed && { opacity: 0.9 },
                      ]}
                    >
                      <Image
                        source={{ uri: r.images[0] ?? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' }}
                        style={s.farmhouseThumb}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[s.farmhouseTitle, { color: theme.text }]} numberOfLines={1}>{r.title}</Text>
                        <Text style={[s.farmhouseMeta, { color: theme.textMuted }]}>
                          ₹{r.price.toLocaleString('en-IN')}/night · {r.capacity} Guests
                        </Text>
                      </View>
                      <View style={[s.statusChip, { backgroundColor: r.approvedByAdmin ? theme.greenSoft : theme.amberSoft }]}>
                        <Text style={[s.statusChipText, { color: r.approvedByAdmin ? theme.green : theme.amber }]}>
                          {r.approvedByAdmin ? 'LIVE' : 'PENDING'}
                        </Text>
                      </View>
                      <ChevronRight size={18} color={theme.textMuted} />
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  heroHeader: {
    backgroundColor: '#235347',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroGreeting: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.75)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  heroRefreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: { paddingBottom: 120 },
  scrollWide: { paddingBottom: 80 },
  shell: { paddingHorizontal: 20 },
  shellWide: { maxWidth: 1120, width: '100%', alignSelf: 'center', paddingHorizontal: 32 },

  header: { paddingTop: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  pageTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },
  refreshBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },

  // Symmetrical 2x2 KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
    marginBottom: 22,
  },
  kpiCard: {
    width: '48%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  kpiCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValueText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  kpiLabelText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Action Required Section
  section: { marginBottom: 22 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '800', flex: 1, letterSpacing: -0.3 },
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  seeAllText: { fontSize: 13, fontWeight: '700' },

  pendingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '900' },
  guestNameText: { fontSize: 15, fontWeight: '800' },
  guestMetaText: { fontSize: 12, marginTop: 2 },
  priceText: { fontSize: 16, fontWeight: '900' },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start' },
  dateChipText: { fontSize: 12, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  declinePillBtn: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  declinePillText: { fontSize: 14, fontWeight: '700' },
  confirmPillBtn: { flex: 2, height: 44, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  confirmPillText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  // Farmhouses Section
  farmhouseList: { gap: 10 },
  farmhouseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  farmhouseThumb: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  farmhouseTitle: { fontSize: 15, fontWeight: '800' },
  farmhouseMeta: { fontSize: 12, marginTop: 3 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 },
  statusChipText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },

  emptyBox: { borderRadius: 18, borderWidth: 1, padding: 28, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 14, fontWeight: '600' },
  addBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
