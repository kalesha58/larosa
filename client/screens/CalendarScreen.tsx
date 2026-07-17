import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, CalendarDays } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import type { ThemeTokens } from '../constants/colors';
import { Card, EmptyState } from '../components/ui';
import { rooms, calendarEvents as seedEvents } from '../lib/mockData';
import type { CalendarEvent } from '../types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(key: string): { y: number; m: number; d: number } {
  const [y, m, d] = key.split('-').map(Number);
  return { y, m: m - 1, d };
}

const sourceColor = (theme: ThemeTokens): Record<string, string> => ({
  website: theme.blue,
  airbnb: theme.red,
  manual: theme.gold,
});

export default function CalendarScreen() {
  const { theme } = useTheme();
  const srcColor = sourceColor(theme);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const roomId = route.params?.roomId;
  const initialRoom = rooms.find((r) => r.roomId === Number(roomId)) ?? rooms[0];
  const [selectedRoomId, setSelectedRoomId] = useState<number>(initialRoom.roomId);
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(7);
  const [syncing, setSyncing] = useState<boolean>(false);

  const roomEvents = useMemo(
    () => seedEvents.filter((e) => e.roomId === selectedRoomId),
    [selectedRoomId]
  );

  // Build a map of day -> events that cover that day
  const dayEventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of roomEvents) {
      const start = parseDate(ev.start);
      const end = parseDate(ev.end);
      const startIdx = new Date(start.y, start.m, start.d).getTime();
      const endIdx = new Date(end.y, end.m, end.d).getTime();
      for (let t = startIdx; t < endIdx; t += 86400000) {
        const d = new Date(t);
        const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
        if (!map[key]) map[key] = [];
        map[key].push(ev);
      }
    }
    return map;
  }, [roomEvents]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      Alert.alert('Calendar updated', 'Airbnb sync completed successfully.');
    }, 1500);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

  const handleEventPress = (ev: CalendarEvent) => {
    if (ev.bookingId) {
      navigation.navigate('BookingDetail', { id: ev.bookingId });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Calendar</Text>
        </View>
        <Pressable
          onPress={handleSync}
          disabled={syncing}
          style={({ pressed }) => [{ opacity: syncing ? 0.5 : pressed ? 0.6 : 1 }]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: theme.surface,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <RefreshCw color={theme.gold} size={16} />
            <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600' }}>
              {syncing ? 'Syncing…' : 'Sync'}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Room picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 42, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {rooms.map((r) => (
          <Pressable
            key={r.roomId}
            onPress={() => setSelectedRoomId(r.roomId)}
            style={({ pressed }) => [
              {
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selectedRoomId === r.roomId ? theme.gold : theme.border,
                backgroundColor: selectedRoomId === r.roomId ? theme.gold + '22' : 'transparent',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text
              style={{
                color: selectedRoomId === r.roomId ? theme.gold : theme.textSecondary,
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              {r.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Month nav */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Pressable onPress={prevMonth} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <ChevronLeft color={theme.gold} size={24} />
          </Pressable>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>
            {MONTH_NAMES[month]} {year}
          </Text>
          <Pressable onPress={nextMonth} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <ChevronRight color={theme.gold} size={24} />
          </Pressable>
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.blue }} />
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Website</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.red }} />
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Airbnb</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.gold }} />
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Manual</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.textMuted }} />
            <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Blocked</Text>
          </View>
        </View>

        {/* Calendar grid */}
        <Card style={{ padding: 10, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            {WEEKDAYS.map((d) => (
              <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>{d}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <View key={`empty-${i}`} style={{ width: '14.28%', height: 56 }} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const key = dateKey(year, month, day);
              const events = dayEventMap[key] ?? [];
              const hasEvents = events.length > 0;
              const firstEvent = events[0];
              const isBlocked = firstEvent?.blocked;
              const dotColor = isBlocked ? theme.textMuted : firstEvent ? srcColor[firstEvent.source] ?? theme.gold : theme.gold;
              return (
                <View key={key} style={{ width: '14.28%', height: 56, padding: 2 }}>
                  <View
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      backgroundColor: hasEvents ? (isBlocked ? theme.surfaceElevated : (srcColor[firstEvent.source] ?? theme.gold) + '15') : 'transparent',
                      borderWidth: hasEvents ? 0 : 1,
                      borderColor: theme.borderSoft,
                      alignItems: 'center',
                      paddingTop: 6,
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>{day}</Text>
                    {hasEvents && (
                      <View style={{ flexDirection: 'row', gap: 3, marginTop: 4 }}>
                        {events.slice(0, 3).map((ev, idx) => (
                          <View
                            key={idx}
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: 3,
                              backgroundColor: ev.blocked ? theme.textMuted : srcColor[ev.source] ?? theme.gold,
                            }}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Events list for this month */}
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          Events
        </Text>
        {roomEvents.length === 0 ? (
          <EmptyState icon={<CalendarDays color={theme.textMuted} size={36} />} title="No events this month" />
        ) : (
          <View style={{ gap: 8 }}>
            {roomEvents.map((ev) => (
              <Pressable
                key={ev.id}
                onPress={() => handleEventPress(ev)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Card style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={{
                      width: 4,
                      height: 36,
                      borderRadius: 2,
                      backgroundColor: ev.blocked ? theme.textMuted : srcColor[ev.source] ?? theme.gold,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>
                      {ev.title}
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                      {new Date(ev.start).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – {new Date(ev.end).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: (ev.blocked ? theme.textMuted : srcColor[ev.source] ?? theme.gold) + '22',
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ color: ev.blocked ? theme.textMuted : srcColor[ev.source] ?? theme.gold, fontSize: 11, fontWeight: '600', textTransform: 'capitalize' }}>
                      {ev.blocked ? 'Blocked' : ev.source}
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
