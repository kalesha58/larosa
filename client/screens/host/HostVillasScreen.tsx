import { useNavigation } from '@react-navigation/native';
import { Plus, Search, IndianRupee, MoreVertical, Tag, ShieldAlert, Edit3, Eye, EyeOff, Calendar, Trash2, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Alert } from '../../lib/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { Card, Chip, EmptyState } from '../../components/ui';
import { formatMoney } from '../../lib/format';
import type { Room } from '../../types';
import HostWebHeader from '../../components/HostWebHeader';

type Filter = 'all' | 'live' | 'pending' | 'hidden';

export default function HostVillasScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { rooms, deleteRoom, updateRoom } = useData();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Show all rooms tagged for the demo host regardless of logged-in user id.
  const hostRooms = useMemo(() => {
    return rooms.filter((r) => r.hostId === 'host_demo' || !r.hostId);
  }, [rooms]);

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
      setSelectedRoom(room);
      setShowActionSheet(true);
    },
    []
  );

  const getBookingModeLabel = (type?: string) => {
    if (type === 'instant') return 'Instant Book';
    if (type === 'request') return 'Request to Book';
    return 'Instant & Request';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <HostWebHeader />}

      {/* Top Green Header Block (Android/Mobile) */}
      {Platform.OS === 'android' && (
        <View style={{ backgroundColor: theme.gold, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 12 }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
            My Farmhouses
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900', marginTop: 2 }}>
            Listings
          </Text>
        </View>
      )}

      {/* Main Body Content in theme.bg */}
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={[styles.shell, isWide && styles.shellWide]}>
          {Platform.OS !== 'android' && (
            <View style={styles.header}>
              <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
                My Farmhouses
              </Text>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', marginTop: 4 }}>
                Listings
              </Text>
            </View>
          )}

        <View style={{ marginBottom: 14 }}>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
          contentContainerStyle={{ gap: 8, alignItems: 'center' }}
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={isWeb}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.listScroll,
          isWide && styles.listScrollWide,
        ]}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Plus color={theme.textMuted} size={36} />}
            title="No listings found"
            subtitle="Add a farmhouse or adjust filters to view listings."
          />
        ) : (
          <View style={[styles.list, isWide && styles.listWide]}>
            {filtered.map((room) => (
              <Pressable
                key={room.roomId}
                onPress={() => navigation.navigate('VillaEdit', { roomId: String(room.roomId) })}
                style={({ pressed }) => [
                  isWide && styles.cardWrapWide,
                  { opacity: pressed ? 0.95 : 1 },
                ]}
              >
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <View style={{ position: 'relative' }}>
                    {room.images && room.images[0] ? (
                      <Image source={{ uri: room.images[0] }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
                    ) : (
                      <View style={{ width: '100%', height: 140, backgroundColor: theme.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
                        <Tag color={theme.textMuted} size={28} />
                      </View>
                    )}

                    {room.approvedByAdmin && room.status === 'active' && (
                      <View style={[styles.badgePosition, { backgroundColor: theme.green }]}>
                        <Text style={styles.badgeText}>LIVE</Text>
                      </View>
                    )}

                    {!room.approvedByAdmin && (
                      <View style={[styles.badgePosition, { backgroundColor: theme.amber }]}>
                        <Text style={[styles.badgeText, { color: '#111' }]}>PENDING APPROVAL</Text>
                      </View>
                    )}

                    {room.approvedByAdmin && room.status === 'hidden' && (
                      <View style={[styles.badgePosition, { backgroundColor: theme.textMuted }]}>
                        <Text style={styles.badgeText}>HIDDEN</Text>
                      </View>
                    )}
                  </View>

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

      {/* FAB — native only; web uses HostWebHeader CTA */}
      {!isWeb && (
        <Pressable
          onPress={() => navigation.navigate('VillaEdit')}
          style={({ pressed }) => [styles.fab, { backgroundColor: theme.gold }, pressed && { opacity: 0.85 }]}
        >
          <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
          <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add Farmhouse</Text>
        </Pressable>
      )}
      </View>

      {/* ══ FARMHOUSE ACTION BOTTOM SHEET MODAL ══════════════════════════════════ */}
      <Modal
        visible={showActionSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowActionSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdropPressable} onPress={() => setShowActionSheet(false)} />
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.handleBar, { backgroundColor: theme.textMuted + '44' }]} />
            
            {selectedRoom && (
              <>
                {/* Villa Preview Header */}
                <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                  <Image
                    source={{ uri: selectedRoom.images[0] ?? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' }}
                    style={styles.sheetImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sheetTitle, { color: theme.text }]} numberOfLines={1}>{selectedRoom.title}</Text>
                    <Text style={[styles.sheetSub, { color: theme.textMuted }]}>
                      ₹{selectedRoom.price.toLocaleString('en-IN')}/night · {selectedRoom.type}
                    </Text>
                    <View style={[styles.sheetChip, { backgroundColor: selectedRoom.approvedByAdmin ? theme.greenSoft : theme.amberSoft }]}>
                      <Text style={[styles.sheetChipText, { color: selectedRoom.approvedByAdmin ? theme.green : theme.amber }]}>
                        {selectedRoom.approvedByAdmin ? (selectedRoom.status === 'active' ? 'LIVE LISTING' : 'HIDDEN') : 'PENDING APPROVAL'}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setShowActionSheet(false)} style={[styles.closeBtn, { backgroundColor: theme.bg }]}>
                    <X size={18} color={theme.textMuted} />
                  </Pressable>
                </View>

                {/* Action List */}
                <View style={styles.actionList}>
                  <Pressable
                    style={({ pressed }) => [styles.actionItem, { borderBottomColor: theme.border }, pressed && { backgroundColor: 'rgba(201, 161, 74, 0.08)' }]}
                    onPress={() => {
                      setShowActionSheet(false);
                      navigation.navigate('VillaEdit', { roomId: String(selectedRoom.roomId) });
                    }}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: 'rgba(201, 161, 74, 0.12)' }]}>
                      <Edit3 size={18} color="#C9A14A" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.actionLabel, { color: theme.text }]}>Edit Farmhouse Details</Text>
                      <Text style={[styles.actionSub, { color: theme.textMuted }]}>Update photos, title, pricing & description</Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.actionItem, { borderBottomColor: theme.border }, pressed && { backgroundColor: theme.goldGlow }]}
                    onPress={() => {
                      setShowActionSheet(false);
                      toggleVisibility(selectedRoom);
                    }}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: 'rgba(33, 150, 243, 0.12)' }]}>
                      {selectedRoom.status === 'active' ? (
                        <EyeOff size={18} color="#2196F3" />
                      ) : (
                        <Eye size={18} color="#2196F3" />
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.actionLabel, { color: theme.text }]}>
                        {selectedRoom.status === 'active' ? 'Hide Listing from Guests' : 'Make Listing Active'}
                      </Text>
                      <Text style={[styles.actionSub, { color: theme.textMuted }]}>
                        {selectedRoom.status === 'active' ? 'Temporarily unpublish from search' : 'Show listing to guests'}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.actionItem, { borderBottomColor: theme.border }, pressed && { backgroundColor: theme.goldGlow }]}
                    onPress={() => {
                      setShowActionSheet(false);
                      navigation.navigate('Pricing', { roomId: String(selectedRoom.roomId) });
                    }}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: 'rgba(156, 39, 176, 0.12)' }]}>
                      <Tag size={18} color="#9C27B0" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.actionLabel, { color: theme.text }]}>Set Custom Calendar Pricing</Text>
                      <Text style={[styles.actionSub, { color: theme.textMuted }]}>Configure weekend rates & seasonal pricing</Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.actionItem, { borderBottomColor: theme.border }, pressed && { backgroundColor: theme.goldGlow }]}
                    onPress={() => {
                      setShowActionSheet(false);
                      navigation.navigate('Calendar', { roomId: String(selectedRoom.roomId) });
                    }}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: 'rgba(76, 175, 80, 0.12)' }]}>
                      <Calendar size={18} color="#4CAF50" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.actionLabel, { color: theme.text }]}>Availability Calendar</Text>
                      <Text style={[styles.actionSub, { color: theme.textMuted }]}>Block dates or manage bookings schedule</Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [styles.actionItem, { borderBottomColor: 'transparent' }, pressed && { backgroundColor: 'rgba(244, 67, 54, 0.08)' }]}
                    onPress={() => {
                      setShowActionSheet(false);
                      handleDelete(selectedRoom);
                    }}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: 'rgba(244, 67, 54, 0.12)' }]}>
                      <Trash2 size={18} color="#F44336" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.actionLabel, { color: '#F44336' }]}>Delete Farmhouse Listing</Text>
                      <Text style={[styles.actionSub, { color: theme.textMuted }]}>Permanently remove from catalog</Text>
                    </View>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 20,
  },
  shellWide: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
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
  listScroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listScrollWide: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  list: {
    gap: 14,
  },
  listWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapWide: {
    width: '48.5%',
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
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sheetSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sheetChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  sheetChipText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionList: {
    paddingVertical: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionSub: {
    fontSize: 12,
    marginTop: 2,
  },
});
