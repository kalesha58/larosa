import { useNavigation } from '@react-navigation/native';
import { Search, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { Card, Chip, EmptyState, SourceChip, StatusBadge } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { formatMoney, formatDateRange, getHostLabel, UNASSIGNED_HOST_ID } from '../../lib/format';
import type { Booking, BookingStatus, BookingSource } from '../../types';

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
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { bookings, rooms, users } = useData();
  const [query, setQuery] = useState<string>('');
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
        <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase' }}>
          Reservations
        </Text>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
          Bookings
        </Text>
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
            placeholder="Guest, host, email, or villa…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Host</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, height: 38, marginBottom: 12 }}
          contentContainerStyle={{ gap: 8, alignItems: 'center' }}
        >
          <Chip label="All hosts" selected={hostFilter === 'all'} onPress={() => setHostFilter('all')} />
          {hostOptions.map((h) => (
            <Chip
              key={h.id}
              label={h.label}
              selected={hostFilter === h.id}
              onPress={() => setHostFilter(h.id)}
            />
          ))}
        </ScrollView>

        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, height: 38, marginBottom: 12 }}
          contentContainerStyle={{ gap: 8, alignItems: 'center' }}
        >
          {([
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'pending', label: 'Pending' },
            { id: 'cancelled', label: 'Cancelled' },
          ] as { id: StatusFilter; label: string }[]).map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              selected={statusFilter === f.id}
              onPress={() => setStatusFilter(f.id)}
              color={f.id === 'confirmed' ? theme.green : f.id === 'pending' ? theme.gold : f.id === 'cancelled' ? theme.red : theme.gold}
            />
          ))}
        </ScrollView>
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Source</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, height: 38, marginBottom: 12 }}
          contentContainerStyle={{ gap: 8, alignItems: 'center' }}
        >
          {([
            { id: 'all', label: 'All' },
            { id: 'website', label: 'Website' },
            { id: 'airbnb', label: 'Airbnb' },
            { id: 'manual', label: 'Manual' },
          ] as { id: SourceFilter; label: string }[]).map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              selected={sourceFilter === f.id}
              onPress={() => setSourceFilter(f.id)}
              color={f.id === 'website' ? theme.blue : f.id === 'airbnb' ? theme.red : f.id === 'manual' ? theme.gold : theme.gold}
            />
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<SlidersHorizontal color={theme.textMuted} size={36} />}
            title="No bookings match your filters"
          />
        ) : (
          <View style={{ gap: 16 }}>
            {grouped.map((hostGroup) => {
              const hostExpanded = !collapsedHosts.has(hostGroup.hostKey);
              return (
                <View key={hostGroup.hostKey} style={{ gap: 10 }}>
                  <Pressable
                    onPress={() => toggleHost(hostGroup.hostKey)}
                    style={({ pressed }) => [{
                      opacity: pressed ? 0.75 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      backgroundColor: theme.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }]}
                  >
                    {hostExpanded ? (
                      <ChevronDown color={theme.gold} size={18} />
                    ) : (
                      <ChevronRight color={theme.gold} size={18} />
                    )}
                    <Text style={{ flex: 1, color: theme.text, fontSize: 15, fontWeight: '700' }}>
                      {hostGroup.hostName}
                    </Text>
                    <View
                      style={{
                        backgroundColor: theme.gold + '22',
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
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
                          <View key={vKey} style={{ marginLeft: 8, gap: 8 }}>
                            <Pressable
                              onPress={() => toggleVilla(hostGroup.hostKey, villa.roomId)}
                              style={({ pressed }) => [{
                                opacity: pressed ? 0.75 : 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 10,
                                backgroundColor: theme.surfaceElevated,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: theme.borderSoft,
                              }]}
                            >
                              {villaExpanded ? (
                                <ChevronDown color={theme.textSecondary} size={16} />
                              ) : (
                                <ChevronRight color={theme.textSecondary} size={16} />
                              )}
                              <Text style={{ flex: 1, color: theme.text, fontSize: 14, fontWeight: '600' }}>
                                {villa.roomTitle}
                              </Text>
                              <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                                {villa.bookings.length}
                              </Text>
                            </Pressable>

                            {villaExpanded ? (
                              <View style={{ gap: 10 }}>
                                {villa.bookings.map((b) => (
                                  <Pressable
                                    key={b.id}
                                    onPress={() => navigation.navigate('BookingDetail', { id: b.id })}
                                    style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                                  >
                                    <Card style={{ padding: 14 }}>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1 }}>
                                          <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                                            {b.guestName}
                                          </Text>
                                          {hostFilter === 'all' ? (
                                            <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                                              Host: {hostGroup.hostName}
                                            </Text>
                                          ) : null}
                                          <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
                                            {formatDateRange(b.checkIn, b.checkOut)} · {b.nights} nights
                                          </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', gap: 6 }}>
                                          <Text style={{ color: theme.gold, fontSize: 15, fontWeight: '700' }}>
                                            {formatMoney(b.totalPrice)}
                                          </Text>
                                          <StatusBadge status={b.status} />
                                        </View>
                                      </View>
                                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                                        <SourceChip source={b.source} />
                                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                                          {b.guests} guests
                                        </Text>
                                      </View>
                                    </Card>
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
