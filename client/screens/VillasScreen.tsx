import { useNavigation } from '@react-navigation/native';
import { Plus, Search, Users, IndianRupee, MoreVertical, Tag } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import { Card, Chip, EmptyState, SyncDot } from '../components/ui';
import { rooms as seedRooms } from '../lib/mockData';
import { formatMoney } from '../lib/format';
import type { Room } from '../types';

type Filter = 'all' | 'active' | 'hidden' | 'featured';

export default function VillasScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<Filter>('all');
  const [rooms, setRooms] = useState<Room[]>(seedRooms);

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === 'active') return r.status === 'active';
      if (filter === 'hidden') return r.status === 'hidden';
      if (filter === 'featured') return r.featured;
      return true;
    });
  }, [rooms, query, filter]);

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
            onPress: () => setRooms((prev) => prev.filter((r) => r.roomId !== room.roomId)),
          },
        ]
      );
    },
    []
  );

  const showActions = useCallback(
    (room: Room) => {
      Alert.alert(
        room.title,
        undefined,
        [
          { text: 'Edit', onPress: () => navigation.navigate('VillaEdit', { roomId: String(room.roomId) }) },
          { text: 'Pricing', onPress: () => navigation.navigate('Pricing', { roomId: String(room.roomId) }) },
          { text: 'Calendar', onPress: () => navigation.navigate('Calendar', { roomId: String(room.roomId) }) },
          { text: 'Delete', style: 'destructive', onPress: () => handleDelete(room) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    },
    [handleDelete, navigation]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
        <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase' }}>
          Inventory
        </Text>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
          Villas
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
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
            placeholder="Search villas…"
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
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'hidden', label: 'Hidden' },
          { id: 'featured', label: 'Featured' },
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
            title="No villas yet"
            subtitle="Add your first property to get started."
          />
        ) : (
          <View style={{ gap: 14 }}>
            {filtered.map((room) => (
              <Pressable
                key={room.roomId}
                onPress={() => navigation.navigate('VillaEdit', { roomId: String(room.roomId) })}
                style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
              >
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Image */}
                  <View style={{ position: 'relative' }}>
                    {room.images[0] ? (
                      <Image
                        source={{ uri: room.images[0] }}
                        style={{ width: '100%', height: 140 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: 140,
                          backgroundColor: theme.surfaceElevated,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Tag color={theme.textMuted} size={28} />
                      </View>
                    )}
                    {room.featured && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: theme.gold,
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                        }}
                      >
                        <Text style={{ color: theme.textInverse, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                          Featured
                        </Text>
                      </View>
                    )}
                    {room.status === 'hidden' && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                        }}
                      >
                        <Text style={{ color: theme.text, fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                          Hidden
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Body */}
                  <View style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>
                          {room.title}
                        </Text>
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

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16,
                        marginTop: 12,
                        paddingTop: 12,
                        borderTopColor: theme.borderSoft,
                        borderTopWidth: 1,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <IndianRupee color={theme.gold} size={15} />
                        <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>
                          {formatMoney(room.price)}
                        </Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>/night</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Users color={theme.textMuted} size={15} />
                        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                          {room.capacity}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 'auto' }}>
                        <SyncDot status={room.syncStatus} />
                      </View>
                    </View>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => navigation.navigate('VillaEdit')}
        style={({ pressed }) => [{
          position: 'absolute',
          bottom: 24,
          right: 24,
          opacity: pressed ? 0.85 : 1
        }]}
      >
        <View
          style={{
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
          }}
        >
          <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
          <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add villa</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
