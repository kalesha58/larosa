import { useNavigation } from '@react-navigation/native';
import {
  Plus, Search, Users, IndianRupee, MoreVertical, Tag,
  AlertTriangle, Check, X, ShieldAlert, ChevronDown, ChevronRight,
  Building2, Star, SlidersHorizontal, RotateCcw,
} from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable, ScrollView, Text, TextInput, View, Image,
  Modal, Switch, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { Card, Chip, EmptyState, SyncDot, PrimaryButton, SecondaryButton, FieldLabel } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { formatMoney, getHostLabel, UNASSIGNED_HOST_ID } from '../../lib/format';
import { Alert } from '../../lib/alert';
import type { Room } from '../../types';
import AdminWebHeader from '../../components/AdminWebHeader';

type Filter = 'all' | 'active' | 'hidden' | 'featured' | 'pending';

export default function VillasScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [hostFilter, setHostFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [collapsedHosts, setCollapsedHosts] = useState<Set<string>>(new Set());

  const activeFilterCount =
    (filter !== 'all' ? 1 : 0) +
    (hostFilter !== 'all' ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0);

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
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
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (filter === 'active') return r.status === 'active' && !!r.approvedByAdmin;
      if (filter === 'hidden') return r.status === 'hidden' && !!r.approvedByAdmin;
      if (filter === 'featured') return r.featured;
      if (filter === 'pending') return !r.approvedByAdmin;
      return true;
    });
  }, [rooms, users, query, filter, hostFilter, categoryFilter]);

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
          { text: 'Delete', style: 'destructive', onPress: () => deleteRoom(room.roomId) },
        ]
      );
    },
    [deleteRoom]
  );

  const showActions = useCallback(
    (room: Room) => {
      const isSuspended = room.status === 'hidden' && room.approvedByAdmin;
      const options: { text: string; style?: 'destructive' | 'cancel'; onPress?: () => void }[] = [
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

      options.push({ text: 'Delete', style: 'destructive', onPress: () => handleDelete(room) });

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

  // ── Status colour for left border on villa card ──────
  const villaStatusColor = (room: Room) => {
    if (!room.approvedByAdmin) return theme.amber;
    if (room.status === 'hidden') return theme.red;
    if (room.featured) return theme.gold;
    return theme.green;
  };

  const widePad = isWide
    ? { maxWidth: 1120, width: '100%' as const, alignSelf: 'center' as const, paddingHorizontal: 32 }
    : { paddingHorizontal: 20 };

  // ── Villa Card ───────────────────────────────────────
  const renderVillaCard = (room: Room) => {
    const statusColor = villaStatusColor(room);
    return (
      <Pressable
        key={room.roomId}
        onPress={() => navigation.navigate('VillaEdit', { roomId: String(room.roomId) })}
        style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
      >
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.border,
          borderLeftWidth: 4,
          borderLeftColor: statusColor,
          overflow: 'hidden',
        }}>
          {/* ── Hero Image ── */}
          <View style={{ position: 'relative' }}>
            {room.images[0] ? (
              <Image source={{ uri: room.images[0] }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
            ) : (
              <View style={{ width: '100%', height: 160, backgroundColor: theme.surfaceElevated, alignItems: 'center', justifyContent: 'center' }}>
                <Building2 color={theme.textMuted} size={32} />
              </View>
            )}

            {/* Overlay badges */}
            <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 }}>
              {room.featured && (
                <View style={{ backgroundColor: theme.gold, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Star size={10} color={theme.textInverse} fill={theme.textInverse} />
                  <Text style={{ color: theme.textInverse, fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>Featured</Text>
                </View>
              )}
              {!room.approvedByAdmin && (
                <View style={{ backgroundColor: theme.amber, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: '#111', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>Pending</Text>
                </View>
              )}
              {room.approvedByAdmin && room.status === 'hidden' && (
                <View style={{ backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>Suspended</Text>
                </View>
              )}
            </View>
          </View>

          {/* ── Card Body ── */}
          <View style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', letterSpacing: -0.2 }} numberOfLines={1}>
                  {room.title}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 3 }}>
                  {room.type} · {room.category === 'villa' ? 'Villa' : 'Room'}
                </Text>
              </View>
              <Pressable
                onPress={(e) => { e.stopPropagation?.(); showActions(room); }}
                hitSlop={12}
                style={({ pressed }) => [{
                  opacity: pressed ? 0.5 : 1,
                  padding: 6,
                  borderRadius: 8,
                  backgroundColor: pressed ? theme.surfaceElevated : 'transparent',
                }]}
              >
                <MoreVertical color={theme.textMuted} size={18} />
              </Pressable>
            </View>

            {/* ── Meta row ── */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: theme.borderSoft,
            }}>
              {/* Price */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <IndianRupee color={theme.gold} size={14} />
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700', letterSpacing: -0.2 }}>
                  {formatMoney(room.price)}
                </Text>
                <Text style={{ color: theme.textMuted, fontSize: 12 }}>/night</Text>
              </View>

              {/* Capacity */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Users color={theme.textMuted} size={13} />
                <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{room.capacity}</Text>
              </View>

              {/* Sync status */}
              <View style={{ marginLeft: 'auto' }}>
                <SyncDot status={room.syncStatus} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const pendingCount = rooms.filter((r) => !r.approvedByAdmin).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <AdminWebHeader />}

      {/* ── Page Header ─────────────────────────────────── */}
      <View style={[{ paddingTop: 16, paddingBottom: 8 }, widePad]}>
        <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '700', letterSpacing: 3.5, textTransform: 'uppercase', marginBottom: 4 }}>
          Inventory
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 }}>
            Villas
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* Pending badge if any */}
            {pendingCount > 0 && (
              <View style={{
                backgroundColor: theme.amber + '22',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.amber + '44',
                paddingHorizontal: 10,
                paddingVertical: 6,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
                <AlertTriangle size={12} color={theme.amber} />
                <Text style={{ color: theme.amber, fontSize: 12, fontWeight: '700' }}>
                  {pendingCount} pending
                </Text>
              </View>
            )}

            {/* Filter Button Icon */}
            <Pressable
              onPress={() => setFilterModalOpen(true)}
              style={({ pressed }) => [{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                height: 36,
                paddingHorizontal: 14,
                borderRadius: 18,
                backgroundColor: activeFilterCount > 0 ? theme.gold : theme.surface,
                borderWidth: 1,
                borderColor: activeFilterCount > 0 ? theme.gold : theme.border,
                opacity: pressed ? 0.8 : 1,
              }]}
            >
              <SlidersHorizontal color={activeFilterCount > 0 ? '#FFFFFF' : theme.gold} size={16} strokeWidth={2.2} />
              <Text style={{ color: activeFilterCount > 0 ? '#FFFFFF' : theme.text, fontSize: 13, fontWeight: '700' }}>
                Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Text>
            </Pressable>

            {/* Total count */}
            <View style={{
              backgroundColor: theme.gold + '18',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.gold + '30',
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}>
              <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '700' }}>
                {filtered.length} villa{filtered.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Search & Filter Icon Bar ───────────────────── */}
      <View style={[{ marginBottom: 10 }, widePad]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
          <View style={{
            flex: 1,
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
              placeholder="Search villas or hosts…"
              placeholderTextColor={theme.textMuted}
              style={{ flex: 1, color: theme.text, fontSize: 15 }}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <X color={theme.textMuted} size={16} />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => setFilterModalOpen(true)}
            style={({ pressed }) => [{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: activeFilterCount > 0 ? theme.gold : theme.surface,
              borderWidth: 1,
              borderColor: activeFilterCount > 0 ? theme.gold : theme.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 1,
            }]}
          >
            <SlidersHorizontal color={activeFilterCount > 0 ? '#FFFFFF' : theme.text} size={20} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* ── Active Filters Chips Strip ──────────────────── */}
      {activeFilterCount > 0 && (
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }, widePad]}>
          {filter !== 'all' && (
            <Chip label={`Status: ${filter}`} selected color={theme.gold} onPress={() => setFilter('all')} />
          )}
          {hostFilter !== 'all' && (
            <Chip label={`Host: ${getHostLabel(hostFilter, users)}`} selected color={theme.gold} onPress={() => setHostFilter('all')} />
          )}
          {categoryFilter !== 'all' && (
            <Chip label={`Type: ${categoryFilter}`} selected color={theme.gold} onPress={() => setCategoryFilter('all')} />
          )}
          <Pressable onPress={() => { setFilter('all'); setHostFilter('all'); setCategoryFilter('all'); }} style={{ marginLeft: 4 }}>
            <Text style={{ color: theme.red, fontSize: 12, fontWeight: '700' }}>Clear all</Text>
          </Pressable>
        </View>
      )}

      {/* ── Divider ─────────────────────────────────────── */}
      <View style={[{ height: 1, backgroundColor: theme.border, marginBottom: 14, opacity: 0.6 }, widePad]} />

      {/* ── List ────────────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={isWeb}
        style={{ flex: 1 }}
        contentContainerStyle={[{ paddingBottom: isWeb ? 120 : 100 }, widePad]}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 color={theme.textMuted} size={36} />}
            title="No villas found"
            subtitle="Try a different filter, or add a new villa from the top bar."
          />
        ) : (
          <View style={{ gap: 18 }}>
            {groupedByHost.map(([hKey, hostRooms]) => {
              const expanded = !collapsedHosts.has(hKey);
              const hostUser = users.find((u) => u.id === hKey);
              const hostName = hKey === UNASSIGNED_HOST_ID ? 'Unassigned / Platform' : getHostLabel(hKey, users);
              const verifStatus = hostUser?.hostVerificationStatus;

              const verifColor =
                verifStatus === 'verified' ? theme.green
                : verifStatus === 'pending' ? theme.amber
                : verifStatus === 'rejected' ? theme.red
                : theme.textMuted;

              return (
                <View key={hKey} style={{ gap: 10 }}>
                  {/* ── Host Accordion Header ── */}
                  <Pressable
                    onPress={() => toggleHostSection(hKey)}
                    style={({ pressed }) => [{
                      opacity: pressed ? 0.8 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      backgroundColor: theme.surface,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderLeftWidth: 3,
                      borderLeftColor: theme.gold,
                    }]}
                  >
                    {expanded ? <ChevronDown color={theme.gold} size={18} /> : <ChevronRight color={theme.gold} size={18} />}

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', letterSpacing: -0.2 }}>
                        {hostName}
                      </Text>
                      {verifStatus ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: verifColor }} />
                          <Text style={{ color: verifColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {verifStatus}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={{
                      backgroundColor: theme.gold + '20',
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderWidth: 1,
                      borderColor: theme.gold + '35',
                    }}>
                      <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '700' }}>
                        {hostRooms.length} villa{hostRooms.length === 1 ? '' : 's'}
                      </Text>
                    </View>
                  </Pressable>

                  {expanded ? (
                    <View style={{ gap: 14 }}>{hostRooms.map(renderVillaCard)}</View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ── FAB — native ───────────────────────────────── */}
      {!isWeb && (
        <Pressable
          onPress={() => navigation.navigate('VillaEdit')}
          style={({ pressed }) => [{ position: 'absolute', bottom: 24, right: 24, opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: theme.gold,
            borderRadius: 28,
            paddingHorizontal: 20,
            paddingVertical: 16,
            shadowColor: theme.gold,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
            <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add villa</Text>
          </View>
        </Pressable>
      )}

      {/* ── Approval Checklist Modal ────────────────────── */}
      <Modal visible={checklistModalOpen} animationType="slide" transparent onRequestClose={() => setChecklistModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setChecklistModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderWidth: 1,
              borderColor: theme.border,
              borderBottomWidth: 0,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Platform.OS === 'ios' ? 24 : 12,
              maxHeight: '90%',
              width: '100%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: theme.textMuted + '44', alignSelf: 'center', marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <ShieldAlert color={theme.gold} size={22} />
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>Property Approval</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16 }}>
              Review minimum qualifications for{' '}
              <Text style={{ color: theme.gold, fontWeight: '600' }}>{selectedApprovalRoom?.title}</Text>
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              {/* Bedrooms check */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.borderSoft }}>
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>3+ Bedrooms Required</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Listing has {selectedApprovalRoom?.bedrooms ?? 0} bedrooms
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: (selectedApprovalRoom?.bedrooms ?? 0) >= 3 ? theme.greenSoft : theme.amberSoft }}>
                  <Text style={{ color: (selectedApprovalRoom?.bedrooms ?? 0) >= 3 ? theme.green : theme.amber, fontSize: 12, fontWeight: '700' }}>
                    {(selectedApprovalRoom?.bedrooms ?? 0) >= 3 ? 'PASSED' : 'FAILED'}
                  </Text>
                </View>
              </View>

              {/* Swimming Pool Check */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.borderSoft }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Swimming Pool</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Operational swimming pool on premise</Text>
                </View>
                <Switch value={checklistPool} onValueChange={setChecklistPool} trackColor={{ true: theme.green }} />
              </View>

              {/* Lawn Check */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.borderSoft }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Landscaped Lawn</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Maintained private garden / lawn</Text>
                </View>
                <Switch value={checklistLawn} onValueChange={setChecklistLawn} trackColor={{ true: theme.green }} />
              </View>

              {/* Caretaker / Security Staff */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.borderSoft }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>On-Property Assistance</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Dedicated caretaker or security guard</Text>
                </View>
                <Switch value={checklistStaff} onValueChange={setChecklistStaff} trackColor={{ true: theme.green }} />
              </View>

              {/* General Cleanliness */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Hygiene & Safety Passed</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>First-aid kit, clean water, fire safety verified</Text>
                </View>
                <Switch value={checklistClean} onValueChange={setChecklistClean} trackColor={{ true: theme.green }} />
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

      {/* ── Rejection Modal ─────────────────────────────── */}
      <Modal visible={rejectionModalOpen} animationType="slide" transparent onRequestClose={() => setRejectionModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setRejectionModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderWidth: 1,
              borderColor: theme.border,
              borderBottomWidth: 0,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Platform.OS === 'ios' ? 24 : 12,
              maxHeight: '85%',
              width: '100%',
            }}
          >
            <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: theme.textMuted + '44', alignSelf: 'center', marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <AlertTriangle color={theme.red} size={22} />
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>Reject Listing</Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Enter a feedback or qualification rejection reason for the host.
            </Text>

            <View style={{ marginTop: 20, gap: 16 }}>
              <View>
                <FieldLabel>Rejection Reason</FieldLabel>
                <TextInput
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  placeholder="e.g. Missing required swimming pool and lawn size is too small."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={{
                    backgroundColor: theme.bg,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: theme.text,
                    fontSize: 15,
                    minHeight: 100,
                  }}
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

      {/* ── Filter Bottom Sheet Modal ────────────────────── */}
      <Modal visible={filterModalOpen} animationType="slide" transparent onRequestClose={() => setFilterModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setFilterModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderWidth: 1,
              borderColor: theme.border,
              borderBottomWidth: 0,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: Platform.OS === 'ios' ? 24 : 12,
              maxHeight: '85%',
              width: '100%',
            }}
          >
            <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: theme.textMuted + '44', alignSelf: 'center', marginBottom: 16 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal color={theme.gold} size={20} />
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Filter Inventory</Text>
              </View>
              <Pressable onPress={() => setFilterModalOpen(false)} hitSlop={10}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <X color={theme.textMuted} size={16} />
                </View>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {/* Status Filter */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                  Status
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { id: 'all', label: 'All Statuses' },
                    { id: 'active', label: 'Active', color: theme.green },
                    { id: 'pending', label: 'Pending Approval', color: theme.amber },
                    { id: 'featured', label: 'Featured', color: theme.gold },
                    { id: 'hidden', label: 'Suspended', color: theme.red },
                  ].map((s) => (
                    <Chip
                      key={s.id}
                      label={s.label}
                      selected={filter === s.id}
                      onPress={() => setFilter(s.id as Filter)}
                      color={s.color ?? theme.gold}
                    />
                  ))}
                </View>
              </View>

              {/* Host Filter */}
              {hostOptions.length > 1 && (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                    Host Profile
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <Chip label="All Hosts" selected={hostFilter === 'all'} onPress={() => setHostFilter('all')} />
                    {hostOptions.map((h) => (
                      <Chip key={h.id} label={h.label} selected={hostFilter === h.id} onPress={() => setHostFilter(h.id)} />
                    ))}
                  </View>
                </View>
              )}

              {/* Property Type Filter */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                  Property Category
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'villa', label: 'Villa' },
                    { id: 'farmhouse', label: 'Farmhouse' },
                    { id: 'room', label: 'Room' },
                  ].map((c) => (
                    <Chip
                      key={c.id}
                      label={c.label}
                      selected={categoryFilter === c.id}
                      onPress={() => setCategoryFilter(c.id)}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: theme.borderSoft }}>
              <View style={{ flex: 1 }}>
                <SecondaryButton
                  label="Reset"
                  onPress={() => {
                    setFilter('all');
                    setHostFilter('all');
                    setCategoryFilter('all');
                  }}
                />
              </View>
              <View style={{ flex: 2 }}>
                <PrimaryButton
                  label={`Show ${filtered.length} Villa${filtered.length !== 1 ? 's' : ''}`}
                  onPress={() => setFilterModalOpen(false)}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
