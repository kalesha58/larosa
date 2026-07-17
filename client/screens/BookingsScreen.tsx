import { useNavigation } from '@react-navigation/native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import { Card, Chip, EmptyState, SourceChip, StatusBadge } from '../components/ui';
import { bookings as seedBookings } from '../lib/mockData';
import { formatMoney, formatDateRange } from '../lib/format';
import type { BookingStatus, BookingSource } from '../types';

type StatusFilter = 'all' | BookingStatus;
type SourceFilter = 'all' | BookingSource;

export default function BookingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');

  const filtered = useMemo(() => {
    return seedBookings
      .filter((b) => {
        if (query) {
          const q = query.toLowerCase();
          if (
            !b.guestName.toLowerCase().includes(q) &&
            !b.guestEmail.toLowerCase().includes(q) &&
            !b.roomTitle.toLowerCase().includes(q)
          )
            return false;
        }
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (sourceFilter !== 'all' && b.source !== sourceFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [query, statusFilter, sourceFilter]);

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
            placeholder="Guest, email, or villa…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
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
          <View style={{ gap: 10 }}>
            {filtered.map((b) => (
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
                      <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                        {b.roomTitle}
                      </Text>
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
