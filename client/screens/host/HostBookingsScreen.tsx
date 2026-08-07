import { CalendarDays, Phone, Mail, MessageSquare, Check, X, Users, ChevronRight, UserCheck } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Pressable, ScrollView, Text, View, StyleSheet, Platform, useWindowDimensions, Modal,
} from 'react-native';
import { Alert } from '../../lib/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { EmptyState } from '../../components/ui';
import { formatMoney, formatDateRange } from '../../lib/format';
import type { Booking } from '../../types';
import HostWebHeader from '../../components/HostWebHeader';

type FilterType = 'pending' | 'confirmed' | 'all';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: 'amberSoft',  fg: 'amber' },
  confirmed: { label: 'Confirmed', bg: 'greenSoft',  fg: 'green' },
  cancelled: { label: 'Cancelled', bg: 'redSoft',    fg: 'red' },
} as const;

export default function HostBookingsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { rooms, bookings, respondToBooking } = useData();
  const [filter, setFilter] = useState<FilterType>('pending');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
  const G = theme.gold ?? '#C9A14A';

  // Show all rooms tagged for the demo host regardless of logged-in user id.
  const hostRooms = useMemo(() => {
    return rooms.filter((r) => r.hostId === 'host_demo' || !r.hostId);
  }, [rooms]);

  const hostRoomIds = useMemo(() => hostRooms.map((r) => r.roomId), [hostRooms]);

  const hostBookings = useMemo(() => {
    return bookings.filter((b) => hostRoomIds.includes(b.roomId));
  }, [bookings, hostRoomIds]);

  const filteredBookings = useMemo(() => {
    return hostBookings.filter((b) => {
      if (filter === 'pending')   return b.status === 'pending';
      if (filter === 'confirmed') return b.status === 'confirmed';
      return true;
    });
  }, [hostBookings, filter]);

  const counts = useMemo(() => ({
    pending:   hostBookings.filter((b) => b.status === 'pending').length,
    confirmed: hostBookings.filter((b) => b.status === 'confirmed').length,
    all:       hostBookings.length,
  }), [hostBookings]);

  const handleAccept = (booking: Booking) => {
    Alert.alert('Confirm Booking Request', `Confirm booking for ${booking.guestName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => respondToBooking(booking.id, 'confirmed') },
    ]);
  };

  const handleReject = (booking: Booking) => {
    Alert.alert('Decline Booking', `Decline ${booking.guestName}'s request?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: () => respondToBooking(booking.id, 'cancelled') },
    ]);
  };

  const TABS: { id: FilterType; label: string }[] = [
    { id: 'pending',   label: 'Requests' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'all',       label: 'All' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <HostWebHeader />}

      {/* Top Green Header Block (Android/Mobile) */}
      {Platform.OS === 'android' && (
        <View style={{ backgroundColor: theme.gold, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 8 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 }}>STAYS & REQUESTS</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 2 }}>Bookings</Text>
        </View>
      )}

      {/* Main Body Content in theme.bg */}
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[s.topWrap, isWide && s.topWrapWide]}>
          {Platform.OS !== 'android' && (
            <View style={s.pageHead}>
              <Text style={[s.pageSuper, { color: G }]}>STAYS & REQUESTS</Text>
              <Text style={[s.pageTitle, { color: theme.text }]}>Bookings</Text>
            </View>
          )}

        <View style={[s.tabBar, { borderBottomColor: theme.border }]}>
          {TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setFilter(tab.id)}
                style={[s.tabBtn, { borderBottomColor: active ? G : 'transparent' }]}
              >
                <Text style={[s.tabLabel, { color: active ? theme.text : theme.textMuted, fontWeight: active ? '700' : '500' }]}>
                  {tab.label}
                </Text>
                {counts[tab.id] > 0 && (
                  <View style={[s.tabCount, { backgroundColor: active ? G + '22' : theme.surfaceElevated }]}>
                    <Text style={[s.tabCountText, { color: active ? G : theme.textMuted }]}>{counts[tab.id]}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Booking Cards ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={[s.listContent, isWide && s.listContentWide]}
      >
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={<CalendarDays color={theme.textMuted} size={32} />}
            title={`No ${filter === 'all' ? '' : filter} bookings`}
            subtitle="Guest bookings will appear here."
          />
        ) : (
          <View style={[s.cardList, isWide && s.cardListWide]}>
            {filteredBookings.map((b) => {
              const cfg = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
              const isPending = b.status === 'pending';
              return (
                <Pressable
                  key={b.id}
                  onPress={() => {
                    setSelectedBooking(b);
                    setShowBookingSheet(true);
                  }}
                  style={({ pressed }) => [
                    s.bookingCard,
                    { backgroundColor: theme.surface, borderColor: isPending ? theme.amber + '44' : theme.border },
                    pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                  ]}
                >
                  {/* ── Top: guest + price ── */}
                  <View style={s.cardTop}>
                    <View style={[s.initials, { backgroundColor: G + '18' }]}>
                      <Text style={[s.initialsText, { color: G }]}>
                        {b.guestName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.guestName, { color: theme.text }]}>{b.guestName}</Text>
                      <Text style={[s.roomName, { color: theme.textMuted }]} numberOfLines={1}>{b.roomTitle}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={[s.totalPrice, { color: G }]}>{formatMoney(b.totalPrice)}</Text>
                      <View style={[s.statusBadge, { backgroundColor: (theme as any)[cfg.bg] }]}>
                        <Text style={[s.statusText, { color: (theme as any)[cfg.fg] }]}>{cfg.label}</Text>
                      </View>
                    </View>
                  </View>

                  {/* ── Info chips ── */}
                  <View style={s.chipsRow}>
                    <View style={[s.chip, { backgroundColor: theme.surfaceElevated }]}>
                      <CalendarDays size={11} color={theme.textMuted} />
                      <Text style={[s.chipText, { color: theme.textSecondary }]}>
                        {formatDateRange(b.checkIn, b.checkOut)} · {b.nights}N
                      </Text>
                    </View>
                    <View style={[s.chip, { backgroundColor: theme.surfaceElevated }]}>
                      <Users size={11} color={theme.textMuted} />
                      <Text style={[s.chipText, { color: theme.textSecondary }]}>{b.guests} guests</Text>
                    </View>
                    <View style={[s.chip, { backgroundColor: theme.surfaceElevated }]}>
                      <Text style={[s.chipText, { color: theme.textSecondary }]}>
                        ₹{formatMoney(b.pricePerNight)}/night
                      </Text>
                    </View>
                  </View>

                  {/* ── Contact ── */}
                  <View style={s.contactRow}>
                    <View style={s.contactItem}>
                      <Phone size={12} color={theme.textMuted} />
                      <Text style={[s.contactText, { color: theme.textSecondary }]}>{b.guestPhone}</Text>
                    </View>
                    <View style={s.contactItem}>
                      <Mail size={12} color={theme.textMuted} />
                      <Text style={[s.contactText, { color: theme.textSecondary }]} numberOfLines={1}>{b.guestEmail}</Text>
                    </View>
                  </View>

                  {/* ── Special request ── */}
                  {b.specialRequests && (
                    <View style={[s.requestBubble, { backgroundColor: theme.bg }]}>
                      <MessageSquare size={11} color={G} />
                      <Text style={[s.requestText, { color: theme.textSecondary }]} numberOfLines={2}>
                        {b.specialRequests}
                      </Text>
                    </View>
                  )}

                  {/* ── Actions (pending only) ── */}
                  {isPending && (
                    <View style={s.actionRow}>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleReject(b);
                        }}
                        style={({ pressed }) => [s.declineBtn, { borderColor: theme.border }, pressed && { opacity: 0.7 }]}
                      >
                        <X color={theme.red} size={14} strokeWidth={2.5} />
                        <Text style={[s.declineText, { color: theme.red }]}>Decline</Text>
                      </Pressable>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAccept(b);
                        }}
                        style={({ pressed }) => [s.confirmBtn, { backgroundColor: G }, pressed && { opacity: 0.85 }]}
                      >
                        <Check color="#fff" size={14} strokeWidth={2.5} />
                        <Text style={s.confirmText}>Confirm Stay</Text>
                      </Pressable>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
      </View>

      {/* ══ BOOKING DETAIL BOTTOM SHEET MODAL ══════════════════════════════════ */}
      <Modal
        visible={showBookingSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingSheet(false)}
      >
        <View style={s.modalOverlay}>
          <Pressable style={s.backdropPressable} onPress={() => setShowBookingSheet(false)} />
          <View style={[s.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[s.handleBar, { backgroundColor: theme.textMuted + '44' }]} />

            {selectedBooking && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.sheetContent}>
                {/* Header */}
                <View style={[s.sheetHeader, { borderBottomColor: theme.border }]}>
                  <View style={[s.sheetInitials, { backgroundColor: G + '20' }]}>
                    <Text style={[s.sheetInitialsText, { color: G }]}>
                      {selectedBooking.guestName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.sheetGuestName, { color: theme.text }]}>{selectedBooking.guestName}</Text>
                    <Text style={[s.sheetRoomTitle, { color: theme.textMuted }]} numberOfLines={1}>
                      {selectedBooking.roomTitle}
                    </Text>
                  </View>
                  <Pressable onPress={() => setShowBookingSheet(false)} style={[s.closeBtn, { backgroundColor: theme.bg }]}>
                    <X size={18} color={theme.textMuted} />
                  </Pressable>
                </View>

                {/* Stay summary grid */}
                <View style={s.detailGrid}>
                  <View style={[s.detailBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[s.detailBoxLabel, { color: theme.textMuted }]}>CHECK-IN / OUT</Text>
                    <Text style={[s.detailBoxVal, { color: theme.text }]}>
                      {formatDateRange(selectedBooking.checkIn, selectedBooking.checkOut)}
                    </Text>
                  </View>

                  <View style={[s.detailBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[s.detailBoxLabel, { color: theme.textMuted }]}>GUESTS & DURATION</Text>
                    <Text style={[s.detailBoxVal, { color: theme.text }]}>
                      {selectedBooking.guests} Guests · {selectedBooking.nights} Nights
                    </Text>
                  </View>

                  <View style={[s.detailBox, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[s.detailBoxLabel, { color: theme.textMuted }]}>TOTAL PAYOUT</Text>
                    <Text style={[s.detailBoxVal, { color: G, fontWeight: '900' }]}>
                      {formatMoney(selectedBooking.totalPrice)}
                    </Text>
                  </View>
                </View>

                {/* Guest Contact Section */}
                <Text style={[s.sectionLabel, { color: theme.textMuted }]}>GUEST CONTACT INFO</Text>
                <View style={[s.contactCard, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                  <View style={s.contactRowItem}>
                    <Phone size={16} color={G} />
                    <Text style={[s.contactVal, { color: theme.text }]}>{selectedBooking.guestPhone}</Text>
                  </View>
                  <View style={[s.divider, { backgroundColor: theme.border }]} />
                  <View style={s.contactRowItem}>
                    <Mail size={16} color={G} />
                    <Text style={[s.contactVal, { color: theme.text }]}>{selectedBooking.guestEmail}</Text>
                  </View>
                </View>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <>
                    <Text style={[s.sectionLabel, { color: theme.textMuted }]}>SPECIAL REQUESTS</Text>
                    <View style={[s.notesCard, { backgroundColor: G + '12', borderColor: G + '33' }]}>
                      <MessageSquare size={16} color={G} />
                      <Text style={[s.notesText, { color: theme.text }]}>
                        {selectedBooking.specialRequests}
                      </Text>
                    </View>
                  </>
                )}

                {/* Sheet Actions for Pending Bookings */}
                {selectedBooking.status === 'pending' && (
                  <View style={s.sheetActionRow}>
                    <Pressable
                      onPress={() => {
                        setShowBookingSheet(false);
                        handleReject(selectedBooking);
                      }}
                      style={({ pressed }) => [s.sheetDeclineBtn, { borderColor: theme.border }, pressed && { opacity: 0.7 }]}
                    >
                      <X color={theme.red} size={16} strokeWidth={2.5} />
                      <Text style={[s.sheetDeclineText, { color: theme.red }]}>Decline</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setShowBookingSheet(false);
                        handleAccept(selectedBooking);
                      }}
                      style={({ pressed }) => [s.sheetConfirmBtn, { backgroundColor: G }, pressed && { opacity: 0.85 }]}
                    >
                      <Check color="#fff" size={16} strokeWidth={2.5} />
                      <Text style={s.sheetConfirmText}>Confirm Stay</Text>
                    </Pressable>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  // Header
  topWrap: { paddingHorizontal: 20 },
  topWrapWide: { maxWidth: 1120, width: '100%', alignSelf: 'center', paddingHorizontal: 32 },
  pageHead: { paddingTop: 16, paddingBottom: 10 },
  pageSuper: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  pageTitle: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, marginTop: 2 },

  // Tabs
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: 0 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 4, borderBottomWidth: 2, marginRight: 20 },
  tabLabel: { fontSize: 14 },
  tabCount: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  tabCountText: { fontSize: 11, fontWeight: '700' },

  // List
  listContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 120 },
  listContentWide: { maxWidth: 1120, width: '100%', alignSelf: 'center', paddingHorizontal: 32 },
  cardList: { gap: 10 },
  cardListWide: { flexDirection: 'row', flexWrap: 'wrap' },

  // Booking card
  bookingCard: {
    borderRadius: 16, borderWidth: 1, padding: 14, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  initials: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontSize: 13, fontWeight: '900' },
  guestName: { fontSize: 14, fontWeight: '700' },
  roomName: { fontSize: 12, marginTop: 1 },
  totalPrice: { fontSize: 15, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  statusText: { fontSize: 10, fontWeight: '800' },

  chipsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  chipText: { fontSize: 11, fontWeight: '600' },

  contactRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  contactText: { fontSize: 12 },

  requestBubble: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, padding: 9, borderRadius: 10 },
  requestText: { flex: 1, fontSize: 12, fontStyle: 'italic' },

  actionRow: { flexDirection: 'row', gap: 8 },
  declineBtn: { flex: 1, height: 36, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  declineText: { fontSize: 13, fontWeight: '700' },
  confirmBtn: { flex: 2, height: 36, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  confirmText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Bottom Sheet Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    maxHeight: '85%',
    width: '100%',
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 14,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetInitials: {
    width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center',
  },
  sheetInitialsText: {
    fontSize: 16, fontWeight: '900',
  },
  sheetGuestName: {
    fontSize: 17, fontWeight: '800',
  },
  sheetRoomTitle: {
    fontSize: 13, marginTop: 2,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  detailGrid: {
    gap: 10,
  },
  detailBox: {
    padding: 12, borderRadius: 12, borderWidth: 1, gap: 4,
  },
  detailBoxLabel: {
    fontSize: 10, fontWeight: '800', letterSpacing: 0.8,
  },
  detailBoxVal: {
    fontSize: 14, fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginTop: 4,
  },
  contactCard: {
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6,
  },
  contactRowItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10,
  },
  contactVal: {
    fontSize: 14, fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  notesCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1,
  },
  notesText: {
    flex: 1, fontSize: 13, lineHeight: 18,
  },
  sheetActionRow: {
    flexDirection: 'row', gap: 10, marginTop: 8,
  },
  sheetDeclineBtn: {
    flex: 1, height: 46, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  sheetDeclineText: {
    fontSize: 14, fontWeight: '700',
  },
  sheetConfirmBtn: {
    flex: 2, height: 46, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  sheetConfirmText: {
    color: '#fff', fontSize: 14, fontWeight: '800',
  },
});
