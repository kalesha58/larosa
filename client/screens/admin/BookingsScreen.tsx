import { useNavigation } from '@react-navigation/native';
import { Search, SlidersHorizontal, ChevronDown, ChevronRight, CalendarDays, TrendingUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { Card, Chip, EmptyState, SourceChip, StatusBadge } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { formatMoney, formatDateRange, getHostLabel, UNASSIGNED_HOST_ID } from '../../lib/format';
import type { Booking, BookingStatus, BookingSource } from '../../types';
import AdminWebHeader from '../../components/AdminWebHeader';

type StatusFilter = 'all' | BookingStatus;
type SourceFilter = 'all' | BookingSource;

type HostGroup = {
  hostKey: string;
  hostName: string;
  villas: {
    roomId: number;
    roomTitle: string;
    bookings: Booking[];
  }[];
  bookingCount: number;
};

export default function BookingsScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { bookings, rooms, users } = useData();
  const [query, setQuery] = useState<string>('');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [hostFilter, setHostFilter] = useState<string>('all');
  const [collapsedHosts, setCollapsedHosts] = useState<Set<string>>(new Set());
  const [collapsedVillas, setCollapsedVillas] = useState<Set<string>>(new Set());

  const hostKeyForRoom = (roomId: number) => {
    const room = rooms.find((r) => r.roomId === roomId);
    return room?.hostId || UNASSIGNED_HOST_ID;
  };

  const hostOptions = useMemo(() => {
    const ids = new Set<string>();
    bookings.forEach((b) => ids.add(hostKeyForRoom(b.roomId)));
    users.filter((u) => u.role === 'host').forEach((u) => ids.add(u.id));
    return Array.from(ids).map((id) => ({
      id,
      label: id === UNASSIGNED_HOST_ID ? 'Unassigned' : getHostLabel(id, users),
    }));
  }, [bookings, rooms, users]);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => {
        const hKey = hostKeyForRoom(b.roomId);
        const hostName = getHostLabel(hKey === UNASSIGNED_HOST_ID ? undefined : hKey, users);
        if (query) {
          const q = query.toLowerCase();
          if (
            !b.guestName.toLowerCase().includes(q) &&
            !b.guestEmail.toLowerCase().includes(q) &&
            !b.roomTitle.toLowerCase().includes(q) &&
            !hostName.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        if (hostFilter !== 'all' && hKey !== hostFilter) return false;
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (sourceFilter !== 'all' && b.source !== sourceFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings, rooms, users, query, statusFilter, sourceFilter, hostFilter]);

  const grouped: HostGroup[] = useMemo(() => {
    const hostMap = new Map<string, Map<number, Booking[]>>();

    filtered.forEach((b) => {
      const hKey = hostKeyForRoom(b.roomId);
      if (!hostMap.has(hKey)) hostMap.set(hKey, new Map());
      const villaMap = hostMap.get(hKey)!;
      if (!villaMap.has(b.roomId)) villaMap.set(b.roomId, []);
      villaMap.get(b.roomId)!.push(b);
    });

    return Array.from(hostMap.entries())
      .map(([hKey, villaMap]) => {
        const villas = Array.from(villaMap.entries()).map(([roomId, villaBookings]) => ({
          roomId,
          roomTitle: villaBookings[0]?.roomTitle ?? rooms.find((r) => r.roomId === roomId)?.title ?? 'Villa',
          bookings: villaBookings,
        }));
        villas.sort((a, b) => a.roomTitle.localeCompare(b.roomTitle));
        const bookingCount = villas.reduce((sum, v) => sum + v.bookings.length, 0);
        return {
          hostKey: hKey,
          hostName: hKey === UNASSIGNED_HOST_ID ? 'Unassigned / Platform' : getHostLabel(hKey, users),
          villas,
          bookingCount,
        };
      })
      .sort((a, b) => {
        if (a.hostKey === UNASSIGNED_HOST_ID) return 1;
        if (b.hostKey === UNASSIGNED_HOST_ID) return -1;
        return a.hostName.localeCompare(b.hostName);
      });
  }, [filtered, rooms, users]);

  const totalVillas = useMemo(() => {
    const ids = new Set(filtered.map((b) => b.roomId));
    return ids.size;
  }, [filtered]);

  const toggleHost = (key: string) => {
    setCollapsedHosts((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const villaCollapseKey = (hostKey: string, roomId: number) => `${hostKey}:${roomId}`;

  const toggleVilla = (hostKey: string, roomId: number) => {
    const key = villaCollapseKey(hostKey, roomId);
    setCollapsedVillas((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const statusBorderColor = (status: BookingStatus) => {
    if (status === 'confirmed') return theme.green;
    if (status === 'cancelled') return theme.red;
    return theme.amber;
  };

  const outerPad = { paddingHorizontal: 20 };
  const widePad = isWide ? { maxWidth: 1120, width: '100%' as const, alignSelf: 'center' as const, paddingHorizontal: 32 } : outerPad;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <AdminWebHeader />}

      {/* ── Page Header ─────────────────────────────────── */}
      <View style={[{ paddingTop: 20, paddingBottom: 8 }, widePad]}>
        <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '700', letterSpacing: 3.5, textTransform: 'uppercase', marginBottom: 4 }}>
          Reservations
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 }}>
            Bookings
          </Text>
          {/* Summary pill */}
          {filtered.length > 0 && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: theme.gold + '18',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.gold + '30',
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}>
              <TrendingUp size={13} color={theme.gold} />
              <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700' }}>
                {filtered.length} · {totalVillas} villa{totalVillas !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Search ──────────────────────────────────────── */}
      <View style={[{ marginBottom: 14 }, widePad]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: 16,
          height: 48,
          gap: 10,
        }}>
          <Search color={theme.textMuted} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Guest, host, email, or villa…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
          />
        </View>
      </View>

      {/* ── Filters ─────────────────────────────────────── */}
      <View style={[{ marginBottom: 16 }, widePad]}>
        {/* Row 1: Status + Source combined */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginRight: 2 }}>Status</Text>
          {([
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed', color: theme.green },
            { id: 'pending', label: 'Pending', color: theme.amber },
            { id: 'cancelled', label: 'Cancelled', color: theme.red },
          ] as { id: StatusFilter; label: string; color?: string }[]).map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              selected={statusFilter === f.id}
              onPress={() => setStatusFilter(f.id)}
              color={f.color ?? theme.gold}
            />
          ))}
        </View>

        {/* Row 2: Source */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginRight: 2 }}>Source</Text>
          {([
            { id: 'all', label: 'All' },
            { id: 'website', label: 'Website', color: theme.blue },
            { id: 'airbnb', label: 'Airbnb', color: theme.red },
            { id: 'manual', label: 'Manual', color: theme.purple },
          ] as { id: SourceFilter; label: string; color?: string }[]).map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              selected={sourceFilter === f.id}
              onPress={() => setSourceFilter(f.id)}
              color={f.color ?? theme.gold}
            />
          ))}
        </View>

        {/* Row 3: Host (only if multiple hosts) */}
        {hostOptions.length > 1 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginRight: 2 }}>Host</Text>
            <Chip label="All hosts" selected={hostFilter === 'all'} onPress={() => setHostFilter('all')} />
            {hostOptions.map((h) => (
              <Chip
                key={h.id}
                label={h.label}
                selected={hostFilter === h.id}
                onPress={() => setHostFilter(h.id)}
              />
            ))}
          </View>
        )}
      </View>

      {/* ── Divider ─────────────────────────────────────── */}
      <View style={[{ height: 1, backgroundColor: theme.border, marginBottom: 16, opacity: 0.6 }, widePad]} />

      {/* ── List ────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={isWeb}
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingBottom: isWeb ? 120 : 40 },
          widePad,
        ]}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<SlidersHorizontal color={theme.textMuted} size={36} />}
            title="No bookings match your filters"
            subtitle="Try adjusting the status, source, or host filter above."
          />
        ) : (
          <View style={{ gap: 16 }}>
            {grouped.map((hostGroup) => {
              const hostExpanded = !collapsedHosts.has(hostGroup.hostKey);
              return (
                <View key={hostGroup.hostKey} style={{ gap: 8 }}>
                  {/* ── Host Accordion Header ── */}
                  <Pressable
                    onPress={() => toggleHost(hostGroup.hostKey)}
                    style={({ pressed }) => [{
                      opacity: pressed ? 0.8 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      backgroundColor: isDark ? theme.surface : theme.surface,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderLeftWidth: 3,
                      borderLeftColor: theme.gold,
                    }]}
                  >
                    {hostExpanded ? (
                      <ChevronDown color={theme.gold} size={18} />
                    ) : (
                      <ChevronRight color={theme.gold} size={18} />
                    )}
                    <Text style={{ flex: 1, color: theme.text, fontSize: 16, fontWeight: '700', letterSpacing: -0.2 }}>
                      {hostGroup.hostName}
                    </Text>
                    <View style={{
                      backgroundColor: theme.gold + '20',
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderWidth: 1,
                      borderColor: theme.gold + '35',
                    }}>
                      <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '700' }}>
                        {hostGroup.bookingCount} booking{hostGroup.bookingCount === 1 ? '' : 's'}
                      </Text>
                    </View>
                  </Pressable>

                  {hostExpanded
                    ? hostGroup.villas.map((villa) => {
                        const vKey = villaCollapseKey(hostGroup.hostKey, villa.roomId);
                        const villaExpanded = !collapsedVillas.has(vKey);
                        return (
                          <View key={vKey} style={{ marginLeft: 12, gap: 8 }}>
                            {/* ── Villa Sub-Header ── */}
                            <Pressable
                              onPress={() => toggleVilla(hostGroup.hostKey, villa.roomId)}
                              style={({ pressed }) => [{
                                opacity: pressed ? 0.8 : 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                                paddingVertical: 10,
                                paddingHorizontal: 14,
                                backgroundColor: theme.surfaceElevated,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: theme.borderSoft,
                                borderLeftWidth: 2,
                                borderLeftColor: theme.goldSoft,
                              }]}
                            >
                              {villaExpanded ? (
                                <ChevronDown color={theme.textSecondary} size={15} />
                              ) : (
                                <ChevronRight color={theme.textSecondary} size={15} />
                              )}
                              <CalendarDays color={theme.textMuted} size={14} />
                              <Text style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '600' }}>
                                {villa.roomTitle}
                              </Text>
                              <View style={{
                                backgroundColor: theme.borderSoft,
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                              }}>
                                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>
                                  {villa.bookings.length}
                                </Text>
                              </View>
                            </Pressable>

                            {villaExpanded ? (
                              <View style={{ gap: 10 }}>
                                {villa.bookings.map((b) => (
                                  <Pressable
                                    key={b.id}
                                    onPress={() => navigation.navigate('BookingDetail', { id: b.id })}
                                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                  >
                                    {/* Status-coloured left border on booking cards */}
                                    <View style={{
                                      backgroundColor: theme.surface,
                                      borderRadius: 14,
                                      borderWidth: 1,
                                      borderColor: theme.border,
                                      borderLeftWidth: 4,
                                      borderLeftColor: statusBorderColor(b.status),
                                      padding: 14,
                                      marginLeft: 4,
                                    }}>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1, marginRight: 12 }}>
                                          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                                            {b.guestName}
                                          </Text>
                                          {hostFilter === 'all' ? (
                                            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 1 }}>
                                              Host: {hostGroup.hostName}
                                            </Text>
                                          ) : null}
                                          <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 5 }}>
                                            {formatDateRange(b.checkIn, b.checkOut)}
                                          </Text>
                                          <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 1 }}>
                                            {b.nights} night{b.nights !== 1 ? 's' : ''} · {b.guests} guest{b.guests !== 1 ? 's' : ''}
                                          </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', gap: 8 }}>
                                          <Text style={{ color: theme.gold, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 }}>
                                            {formatMoney(b.totalPrice)}
                                          </Text>
                                          <StatusBadge status={b.status} />
                                        </View>
                                      </View>
                                      {/* Source chip row */}
                                      <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginTop: 12,
                                        paddingTop: 10,
                                        borderTopWidth: 1,
                                        borderTopColor: theme.borderSoft,
                                      }}>
                                        <SourceChip source={b.source} />
                                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                                          #{b.id.slice(-6).toUpperCase()}
                                        </Text>
                                      </View>
                                    </View>
                                  </Pressable>
                                ))}
                              </View>
                            ) : null}
                          </View>
                        );
                      })
                    : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
