import { useNavigation } from '@react-navigation/native';
import { Plus, Search, Users, IndianRupee, MoreVertical, Tag, ShieldAlert } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { Card, Chip, EmptyState } from '../../components/ui';
import { formatMoney } from '../../lib/format';
import type { Room } from '../../types';

type Filter = 'all' | 'live' | 'pending' | 'hidden';

export default function HostVillasScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { rooms, deleteRoom, updateRoom } = useData();
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  // Scope listing query to host ID or seed rooms (for testing)
  const hostRooms = useMemo(() => {
    return rooms.filter((r) => r.hostId === user?.id || !r.hostId);
  }, [rooms, user]);

  const filtered = useMemo(() => {
    return hostRooms.filter((r) => {
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === 'live') return r.status === 'active' && r.approvedByAdmin;
      if (filter === 'pending') return !r.approvedByAdmin;
      if (filter === 'hidden') return r.status === 'hidden' && r.approvedByAdmin;
      return true;
    });
  }, [hostRooms, query, filter]);

  const handleDelete = useCallback(
    (room: Room) => {
      Alert.alert(
        'Delete farmhouse listing?',
        `This will remove ${room.title} permanently from the catalog. Current bookings will remain unaffected.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteRoom(room.roomId),
          },
        ]
      );
    },
    [deleteRoom]
  );

  const toggleVisibility = useCallback(
    (room: Room) => {
      const nextStatus = room.status === 'active' ? 'hidden' : 'active';
      updateRoom(room.roomId, { status: nextStatus });
      Alert.alert('Listing Updated', `${room.title} is now ${nextStatus === 'active' ? 'visible' : 'hidden'} to guests.`);
    },
    [updateRoom]
  );

  const showActions = useCallback(
    (room: Room) => {
      Alert.alert(
        room.title,
        undefined,
        [
          { text: 'Edit Details', onPress: () => navigation.navigate('VillaEdit', { roomId: String(room.roomId) }) },
          { text: room.status === 'active' ? 'Hide Listing' : 'Make Active', onPress: () => toggleVisibility(room) },
          { text: 'Set Calendar Pricing', onPress: () => navigation.navigate('Pricing', { roomId: String(room.roomId) }) },
          { text: 'Availability Calendar', onPress: () => navigation.navigate('Calendar', { roomId: String(room.roomId) }) },
          { text: 'Delete Listing', style: 'destructive', onPress: () => handleDelete(room) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    },
    [handleDelete, toggleVisibility, navigation]
  );

  const getBookingModeLabel = (type?: string) => {
    if (type === 'instant') return 'Instant Book';
    if (type === 'request') return 'Request to Book';
    return 'Instant & Request';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          My Farmhouses
        </Text>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', marginTop: 4 }}>
          Listings
        </Text>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <View style={[styles.searchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Search color={theme.textMuted} size={20} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search farmhouses…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
          />
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {([
          { id: 'all', label: 'All Listings' },
          { id: 'live', label: 'Live' },
          { id: 'pending', label: 'Pending Approval' },
          { id: 'hidden', label: 'Hidden' },
        ] as { id: Filter; label: string }[]).map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Plus color={theme.textMuted} size={36} />}
            title="No listings found"
            subtitle="Add a farmhouse or adjust filters to view listings."
          />
        ) : (
          <View style={{ gap: 14 }}>
            {filtered.map((room) => (
              <Pressable
                key={room.roomId}
                onPress={() => navigation.navigate('VillaEdit', { roomId: String(room.roomId) })}
                style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
              >
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Image */}
                  <View style={{ position: 'relative' }}>
                    {room.images && room.images[0] ? (
                      <Image source={{ uri: room.images[0] }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
                    ) : (
                      <View style={{ width: '100%', height: 140, backgroundColor: theme.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
                        <Tag color={theme.textMuted} size={28} />
                      </View>
                    )}
                    
                    {/* Live Badge */}
                    {room.approvedByAdmin && room.status === 'active' && (
                      <View style={[styles.badgePosition, { backgroundColor: theme.green }]}>
                        <Text style={styles.badgeText}>LIVE</Text>
                      </View>
                    )}

                    {/* Pending Admin Approval Badge */}
                    {!room.approvedByAdmin && (
                      <View style={[styles.badgePosition, { backgroundColor: theme.amber }]}>
                        <Text style={[styles.badgeText, { color: '#111' }]}>PENDING APPROVAL</Text>
                      </View>
                    )}

                    {/* Hidden Badge */}
                    {room.approvedByAdmin && room.status === 'hidden' && (
                      <View style={[styles.badgePosition, { backgroundColor: theme.textMuted }]}>
                        <Text style={styles.badgeText}>HIDDEN</Text>
                      </View>
                    )}
                  </View>

                  {/* Body info */}
                  <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>{room.title}</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                          {room.type} · Max {room.capacity} Guests
                        </Text>
                      </View>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          showActions(room);
                        }}
                        hitSlop={12}
                        style={{ padding: 4 }}
                      >
                        <MoreVertical color={theme.textSecondary} size={20} />
                      </Pressable>
                    </View>

                    {/* Financial details & Booking type */}
                    <View style={[styles.footerRow, { borderTopColor: theme.borderSoft }]}>
                      <View>
                        <Text style={styles.footerLabel}>Price per Night</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 }}>
                          <IndianRupee color={theme.gold} size={14} />
                          <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>
                            {formatMoney(room.price)}
                          </Text>
                        </View>
                      </View>

                      <View>
                        <Text style={styles.footerLabel}>Security Deposit</Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                          ₹{formatMoney(room.deposit ?? room.price * 2)}
                        </Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.footerLabel}>Booking Mode</Text>
                        <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '700', marginTop: 2 }}>
                          {getBookingModeLabel(room.bookingType)}
                        </Text>
                      </View>
                    </View>

                    {/* Pending admin approval warning banner */}
                    {!room.approvedByAdmin && (
                      <View style={[styles.pendingWarning, { backgroundColor: theme.amberSoft + '22', borderColor: theme.amberSoft }]}>
                        <ShieldAlert color={theme.amber} size={16} />
                        <Text style={{ color: theme.amber, fontSize: 12, flex: 1 }}>
                          Requires Admin review to go live in Explore results.
                        </Text>
                      </View>
                    )}
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <Pressable
        onPress={() => navigation.navigate('VillaEdit')}
        style={({ pressed }) => [styles.fab, { backgroundColor: theme.gold }, pressed && { opacity: 0.85 }]}
      >
        <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
        <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add Farmhouse</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
  },
  badgePosition: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pendingWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
