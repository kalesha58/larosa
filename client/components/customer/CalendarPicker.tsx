import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface CalendarPickerProps {
  checkIn: string | null;
  checkOut: string | null;
  onDatesChange: (checkIn: string | null, checkOut: string | null) => void;
  minNights?: number;
  blockedDates?: string[];
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export default function CalendarPicker({
  checkIn,
  checkOut,
  onDatesChange,
  minNights = 1,
  blockedDates = [],
}: CalendarPickerProps) {
  const { theme } = useTheme();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayPress = (day: number) => {
    const dateStr = toDateStr(new Date(year, month, day));
    const todayStr = toDateStr(today);
    if (dateStr < todayStr) return;
    if (blockedDates.includes(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      onDatesChange(dateStr, null);
    } else {
      if (dateStr <= checkIn) {
        onDatesChange(dateStr, null);
      } else {
        onDatesChange(checkIn, dateStr);
      }
    }
  };

  const isSelected = (day: number) => {
    const dateStr = toDateStr(new Date(year, month, day));
    return dateStr === checkIn || dateStr === checkOut;
  };

  const isInRange = (day: number) => {
    const dateStr = toDateStr(new Date(year, month, day));
    if (!checkIn || !checkOut) return false;
    return dateStr > checkIn && dateStr < checkOut;
  };

  const isPast = (day: number) => {
    const dateStr = toDateStr(new Date(year, month, day));
    return dateStr < toDateStr(today);
  };

  const isBlocked = (day: number) => {
    const dateStr = toDateStr(new Date(year, month, day));
    return blockedDates.includes(dateStr);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={prevMonth} style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <ChevronLeft size={20} color={theme.text} />
        </Pressable>
        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {MONTHS[month]} {year}
        </Text>
        <Pressable onPress={nextMonth} style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <ChevronRight size={20} color={theme.text} />
        </Pressable>
      </View>

      {/* Day labels */}
      <View style={styles.daysRow}>
        {DAYS.map((d) => (
          <Text key={d} style={[styles.dayLabel, { color: theme.textMuted }]}>{d}</Text>
        ))}
      </View>

      {/* Dates grid */}
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`empty-${i}`} style={styles.cell} />;

          const selected = isSelected(day);
          const inRange = isInRange(day);
          const past = isPast(day);
          const blocked = isBlocked(day);
          const disabled = past || blocked;

          const isCheckIn = checkIn === toDateStr(new Date(year, month, day));
          const isCheckOut = checkOut === toDateStr(new Date(year, month, day));

          return (
            <Pressable
              key={`day-${day}`}
              onPress={() => !disabled && handleDayPress(day)}
              style={[
                styles.cell,
                inRange && { backgroundColor: 'rgba(201,161,74,0.15)' },
                selected && { backgroundColor: '#C9A14A' },
                disabled && { opacity: 0.25 },
              ]}
            >
              <Text style={[
                styles.dayText,
                { color: theme.text },
                selected && { color: '#111111', fontWeight: '800' },
                inRange && { color: '#C9A14A', fontWeight: '600' },
              ]}>
                {day}
              </Text>
              {(isCheckIn || isCheckOut) && (
                <View style={styles.dateDot} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Legend */}
      <View style={[styles.legend, { borderTopColor: theme.border }]}>
        {checkIn && (
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            Check-in: <Text style={{ color: '#C9A14A', fontWeight: '700' }}>{checkIn}</Text>
          </Text>
        )}
        {checkOut && (
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            Check-out: <Text style={{ color: '#C9A14A', fontWeight: '700' }}>{checkOut}</Text>
          </Text>
        )}
        {checkIn && checkOut && (
          <Text style={[styles.legendText, { color: theme.textMuted }]}>
            {Math.ceil(
              (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
            )} nights
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  navBtn: {
    padding: 6,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  daysRow: {
    flexDirection: 'row',
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111111',
    position: 'absolute',
    bottom: 4,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  legendText: {
    fontSize: 13,
  },
});
