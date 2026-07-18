import { useNavigation } from '@react-navigation/native';
import { Plus, Search, Users, IndianRupee, MoreVertical, Tag, AlertTriangle, Check, X, ShieldAlert, ChevronDown, ChevronRight } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { Card, Chip, EmptyState, SyncDot, PrimaryButton, SecondaryButton, FieldLabel } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { formatMoney, getHostLabel, UNASSIGNED_HOST_ID } from '../../lib/format';
import type { Room } from '../../types';

type Filter = 'all' | 'active' | 'hidden' | 'featured' | 'pending';

export default function VillasScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [hostFilter, setHostFilter] = useState<string>('all');
  const [collapsedHosts, setCollapsedHosts] = useState<Set<string>>(new Set());
  const { rooms, users, deleteRoom, approveRoom, rejectRoom, suspendRoom } = useData();

  const [checklistModalOpen, setChecklistModalOpen] = useState<boolean>(false);
  const [selectedApprovalRoom, setSelectedApprovalRoom] = useState<Room | null>(null);
  const [checklistPool, setChecklistPool] = useState<boolean>(false);
  const [checklistLawn, setChecklistLawn] = useState<boolean>(false);
  const [checklistClean, setChecklistClean] = useState<boolean>(false);
  const [checklistStaff, setChecklistStaff] = useState<boolean>(false);

  const [rejectionModalOpen, setRejectionModalOpen] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const hostKey = (hostId?: string) => hostId || UNASSIGNED_HOST_ID;

  const hostOptions = useMemo(() => {
    const ids = new Set<string>();
    rooms.forEach((r) => ids.add(hostKey(r.hostId)));
    users.filter((u) => u.role === 'host').forEach((u) => ids.add(u.id));
    return Array.from(ids).map((id) => ({
      id,
      label: id === UNASSIGNED_HOST_ID ? 'Unassigned' : getHostLabel(id, users),
    }));
  }, [rooms, users]);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (query) {
        const q = query.toLowerCase();
        const hostName = getHostLabel(r.hostId, users).toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !hostName.includes(q)) return false;
      }
      if (hostFilter !== 'all' && hostKey(r.hostId) !== hostFilter) return false;
      if (filter === 'active') return r.status === 'active' && !!r.approvedByAdmin;
      if (filter === 'hidden') return r.status === 'hidden' && !!r.approvedByAdmin;
      if (filter === 'featured') return r.featured;
      if (filter === 'pending') return !r.approvedByAdmin;
      return true;
    });
  }, [rooms, users, query, filter, hostFilter]);

  const groupedByHost = useMemo(() => {
    const map = new Map<string, Room[]>();
    filtered.forEach((r) => {
      const key = hostKey(r.hostId);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const nameA = a[0] === UNASSIGNED_HOST_ID ? 'zzz' : getHostLabel(a[0], users);
      const nameB = b[0] === UNASSIGNED_HOST_ID ? 'zzz' : getHostLabel(b[0], users);
      return nameA.localeCompare(nameB);
    });
  }, [filtered, users]);

  const toggleHostSection = (key: string) => {
    setCollapsedHosts((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleDelete = useCallback(
    (room: Room) => {
      Alert.alert(
        'Delete villa?',
        `This removes ${room.title} from the catalog. Bookings are not deleted.`,
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

  const showActions = useCallback(
    (room: Room) => {
      const isSuspended = room.status === 'hidden' && room.approvedByAdmin;
      const options: {
        text: string;
        style?: 'destructive' | 'cancel';
        onPress?: () => void;
      }[] = [
        { text: 'Edit', onPress: () => navigation.navigate('VillaEdit', { roomId: String(room.roomId) }) },
        { text: 'Pricing', onPress: () => navigation.navigate('Pricing', { roomId: String(room.roomId) }) },
        { text: 'Calendar', onPress: () => navigation.navigate('Calendar', { roomId: String(room.roomId) }) },
      ];

      if (room.approvedByAdmin) {
        options.push({
          text: isSuspended ? 'Restore Listing' : 'Suspend Listing',
          style: isSuspended ? undefined : 'destructive',
          onPress: () =>
            Alert.alert(
              isSuspended ? 'Restore listing?' : 'Suspend listing?',
              isSuspended
                ? `${room.title} will be visible to guests again.`
                : `${room.title} will be hidden from guests until restored.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: isSuspended ? 'Restore' : 'Suspend',
                  style: isSuspended ? 'default' : 'destructive',
                  onPress: () => suspendRoom(room.roomId, !isSuspended),
                },
              ]
            ),
        });
      }

      options.push({
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDelete(room),
      });

      if (!room.approvedByAdmin) {
        options.unshift({
          text: 'Review Approval Checklist',
          onPress: () => {
            setSelectedApprovalRoom(room);
            setChecklistPool(room.hasSwimmingPool ?? room.amenities.some(a => a.toLowerCase().includes('pool') || a.toLowerCase().includes('swim')));
            setChecklistLawn(room.hasLawn ?? room.amenities.some(a => a.toLowerCase().includes('lawn') || a.toLowerCase().includes('garden')));
            setChecklistClean(room.cleanlinessScore !== undefined ? room.cleanlinessScore >= 4.5 : false);
            setChecklistStaff(room.hasOnPropertyStaff ?? (room.description.toLowerCase().includes('staff') || room.description.toLowerCase().includes('caretaker') || room.description.toLowerCase().includes('butler') || room.description.toLowerCase().includes('security')));
            setChecklistModalOpen(true);
          },
        });
      }

      Alert.alert(room.title, undefined, [...options, { text: 'Cancel', style: 'cancel' }]);
    },
    [handleDelete, navigation, suspendRoom]
  );

  const renderVillaCard = (room: Room) => (
    <Pressable
      key={room.roomId}
      onPress={() => navigation.navigate('VillaEdit', { roomId: String(room.roomId) })}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <View style={{ position: 'relative' }}>
          {room.images[0] ? (
            <Image source={{ uri: room.images[0] }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
          ) : (
            <View style={{ width: '100%', height: 140, backgroundColor: theme.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
              <Tag color={theme.textMuted} size={28} />
            </View>
          )}
          {room.featured && (
            <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: theme.gold, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: theme.textInverse, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>Featured</Text>
            </View>
          )}
          {!room.approvedByAdmin && (
            <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: theme.amber, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#111111', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>Pending Approval</Text>
            </View>
          )}
          {room.approvedByAdmin && room.status === 'hidden' && (
            <View style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: theme.text, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>Suspended</Text>
            </View>
          )}
        </View>

        <View style={{ padding: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>{room.title}</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {room.type} · {room.category === 'villa' ? 'Villa' : 'Room'}
              </Text>
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                showActions(room);
              }}
              hitSlop={12}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, padding: 4 }]}
            >
              <MoreVertical color={theme.textSecondary} size={20} />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 12, borderTopColor: theme.borderSoft, borderTopWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <IndianRupee color={theme.gold} size={15} />
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{formatMoney(room.price)}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>/night</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Users color={theme.textMuted} size={15} />
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{room.capacity}</Text>
            </View>
            <View style={{ marginLeft: 'auto' }}>
              <SyncDot status={room.syncStatus} />
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
        <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase' }}>Inventory</Text>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>Villas</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, borderRadius: 14, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, height: 48, gap: 10 }}>
          <Search color={theme.textMuted} size={20} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search villas or hosts…" placeholderTextColor={theme.textMuted} style={{ flex: 1, color: theme.text, fontSize: 15 }} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, height: 38, marginBottom: 10 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}>
        {([
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'hidden', label: 'Hidden' },
          { id: 'featured', label: 'Featured' },
          { id: 'pending', label: 'Pending Approval' },
        ] as { id: Filter; label: string }[]).map((f) => (
          <Chip key={f.id} label={f.label} selected={filter === f.id} onPress={() => setFilter(f.id)} />
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Host</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, height: 38, marginBottom: 16 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}>
        <Chip label="All hosts" selected={hostFilter === 'all'} onPress={() => setHostFilter('all')} />
        {hostOptions.map((h) => (
          <Chip key={h.id} label={h.label} selected={hostFilter === h.id} onPress={() => setHostFilter(h.id)} />
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Plus color={theme.textMuted} size={36} />} title="No villas yet" subtitle="Add your first property to get started." />
        ) : (
          <View style={{ gap: 18 }}>
            {groupedByHost.map(([hKey, hostRooms]) => {
              const expanded = !collapsedHosts.has(hKey);
              const hostUser = users.find((u) => u.id === hKey);
              const hostName = hKey === UNASSIGNED_HOST_ID ? 'Unassigned / Platform' : getHostLabel(hKey, users);
              return (
                <View key={hKey} style={{ gap: 10 }}>
                  <Pressable
                    onPress={() => toggleHostSection(hKey)}
                    style={({ pressed }) => [{
                      opacity: pressed ? 0.75 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: theme.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }]}
                  >
                    {expanded ? <ChevronDown color={theme.gold} size={18} /> : <ChevronRight color={theme.gold} size={18} />}
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{hostName}</Text>
                      {hostUser?.hostVerificationStatus ? (
                        <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2, textTransform: 'uppercase' }}>
                          {hostUser.hostVerificationStatus}
                        </Text>
                      ) : null}
                    </View>
                    <View style={{ backgroundColor: theme.gold + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '700' }}>
                        {hostRooms.length} villa{hostRooms.length === 1 ? '' : 's'}
                      </Text>
                    </View>
                  </Pressable>
                  {expanded ? <View style={{ gap: 14 }}>{hostRooms.map(renderVillaCard)}</View> : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Pressable onPress={() => navigation.navigate('VillaEdit')} style={({ pressed }) => [{ position: 'absolute', bottom: 24, right: 24, opacity: pressed ? 0.85 : 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.gold, borderRadius: 28, paddingHorizontal: 20, paddingVertical: 16, shadowColor: theme.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 }}>
          <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
          <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add villa</Text>
        </View>
      </Pressable>

      <Modal visible={checklistModalOpen} animationType="slide" transparent onRequestClose={() => setChecklistModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setChecklistModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderTopColor: theme.borderSoft, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, maxHeight: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 24 }}
          >
            <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: 20 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <ShieldAlert color={theme.gold} size={22} />
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>Property Approval</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16 }}>
              Review minimum qualifications for <Text style={{ color: theme.gold, fontWeight: '600' }}>{selectedApprovalRoom?.title}</Text>
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16, padding: 12, backgroundColor: theme.bg, borderRadius: 12 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: (selectedApprovalRoom?.bedrooms ?? 0) >= 3 ? theme.greenSoft : theme.redSoft, alignItems: 'center', justifyContent: 'center' }}>
                  {(selectedApprovalRoom?.bedrooms ?? 0) >= 3 ? <Check color={theme.green} size={15} strokeWidth={3} /> : <X color={theme.red} size={15} strokeWidth={3} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Minimum 3 bedrooms</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Current Count: {selectedApprovalRoom?.bedrooms ?? 0} bedrooms</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: 12, backgroundColor: theme.bg, borderRadius: 12 }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Swimming pool required</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Swimming pool is a mandatory qualification</Text>
                </View>
                <Switch value={checklistPool} onValueChange={setChecklistPool} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={checklistPool ? theme.textInverse : theme.textMuted} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: 12, backgroundColor: theme.bg, borderRadius: 12 }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Lawn required</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Private lawn is a mandatory qualification</Text>
                </View>
                <Switch value={checklistLawn} onValueChange={setChecklistLawn} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={checklistLawn ? theme.textInverse : theme.textMuted} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: 12, backgroundColor: theme.bg, borderRadius: 12 }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Very clean property</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Verified cleanliness qualification standards</Text>
                </View>
                <Switch value={checklistClean} onValueChange={setChecklistClean} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={checklistClean ? theme.textInverse : theme.textMuted} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: 12, backgroundColor: theme.bg, borderRadius: 12 }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>On-property assistance/security</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>Caretaker, butler, or security on site</Text>
                </View>
                <Switch value={checklistStaff} onValueChange={setChecklistStaff} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={checklistStaff ? theme.textInverse : theme.textMuted} />
              </View>
            </ScrollView>

            <View style={{ gap: 10, marginTop: 12 }}>
              <PrimaryButton
                label="Approve Listing"
                disabled={!checklistPool || !checklistLawn || !checklistClean || !checklistStaff || (selectedApprovalRoom?.bedrooms ?? 0) < 3}
                onPress={() => {
                  if (selectedApprovalRoom) {
                    approveRoom(selectedApprovalRoom.roomId);
                    setChecklistModalOpen(false);
                    Alert.alert('Approved', `${selectedApprovalRoom.title} is now live.`);
                  }
                }}
              />
              <SecondaryButton
                label="Reject Listing"
                onPress={() => {
                  setChecklistModalOpen(false);
                  setRejectionReason('');
                  setRejectionModalOpen(true);
                }}
              />
              <SecondaryButton label="Cancel" onPress={() => setChecklistModalOpen(false)} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={rejectionModalOpen} animationType="slide" transparent onRequestClose={() => setRejectionModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setRejectionModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{ backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderTopColor: theme.borderSoft, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 24 }}
          >
            <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: 20 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <AlertTriangle color={theme.red} size={22} />
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>Reject Listing</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>Enter a feedback or qualification rejection reason for the host.</Text>
            <View style={{ marginTop: 20, gap: 16 }}>
              <View>
                <FieldLabel>Rejection Reason</FieldLabel>
                <TextInput
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  placeholder="e.g. Missing required swimming pool and lawn size is too small."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={{ backgroundColor: theme.bg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, color: theme.text, fontSize: 15, minHeight: 100 }}
                />
              </View>
              <View style={{ gap: 10 }}>
                <PrimaryButton
                  label="Confirm Rejection"
                  disabled={!rejectionReason.trim()}
                  onPress={() => {
                    if (selectedApprovalRoom) {
                      rejectRoom(selectedApprovalRoom.roomId, rejectionReason);
                      setRejectionModalOpen(false);
                      Alert.alert('Listing Rejected', 'Rejection feedback has been saved.');
                    }
                  }}
                  destructive
                />
                <SecondaryButton label="Cancel" onPress={() => setRejectionModalOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
