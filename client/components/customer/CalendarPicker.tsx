import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface CalendarPickerProps {
  checkIn: string | null;
  checkOut: string | null;
  onDatesChange: (checkIn: string | null, checkOut: string | null) => void;
  minNights?: number;
  blockedDates?: string[];
  dualMonth?: boolean;
  showClear?: boolean;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function MonthGrid({
  year,
  month,
  checkIn,
  checkOut,
  blockedDates,
  today,
  theme,
  onDayPress,
}: {
  year: number;
  month: number;
  checkIn: string | null;
  checkOut: string | null;
  blockedDates: string[];
  today: Date;
  theme: any;
  onDayPress: (year: number, month: number, day: number) => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.monthBlock}>
      <Text style={[styles.monthLabel, { color: theme.text }]}>
        {MONTHS[month]} {year}
      </Text>
      <View style={styles.daysRow}>
        {DAYS.map((d, i) => (
          <Text key={`${d}-${i}`} style={[styles.dayLabel, { color: theme.textMuted }]}>{d}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e-${month}-${i}`} style={styles.cell} />;
          const dateStr = toDateStr(new Date(year, month, day));
          const selected = dateStr === checkIn || dateStr === checkOut;
          const inRange = !!(checkIn && checkOut && dateStr > checkIn && dateStr < checkOut);
          const past = dateStr < toDateStr(today);
          const blocked = blockedDates.includes(dateStr);
          const disabled = past || blocked;

          return (
            <Pressable
              key={`d-${month}-${day}`}
              onPress={() => !disabled && onDayPress(year, month, day)}
              style={[
                styles.cell,
                inRange && { backgroundColor: theme.goldGlow },
                selected && { backgroundColor: theme.text, borderRadius: 20 },
                disabled && { opacity: 0.25 },
              ]}
            >
              <Text style={[
                styles.dayText,
                { color: theme.text },
                selected && { color: theme.bg, fontWeight: '800' },
                inRange && { fontWeight: '600' },
              ]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function CalendarPicker({
  checkIn,
  checkOut,
  onDatesChange,
  minNights = 1,
  blockedDates = [],
  dualMonth,
  showClear = true,
}: CalendarPickerProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const showDual = dualMonth ?? (Platform.OS === 'web' && width >= 768);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const nextMonthDate = new Date(year, month + 1, 1);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayPress = (y: number, m: number, day: number) => {
    const dateStr = toDateStr(new Date(y, m, day));
    if (dateStr < toDateStr(today)) return;
    if (blockedDates.includes(dateStr)) return;

    if (!checkIn || (checkIn && checkOut)) {
      onDatesChange(dateStr, null);
    } else if (dateStr <= checkIn) {
      onDatesChange(dateStr, null);
    } else {
      onDatesChange(checkIn, dateStr);
    }
  };

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={prevMonth} style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <ChevronLeft size={20} color={theme.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={nextMonth} style={({ pressed }) => [styles.navBtn, pressed && { opacity: 0.5 }]}>
          <ChevronRight size={20} color={theme.text} />
        </Pressable>
      </View>

      <View style={[styles.monthsRow, !showDual && { flexDirection: 'column' }]}>
        <MonthGrid
          year={year}
          month={month}
          checkIn={checkIn}
          checkOut={checkOut}
          blockedDates={blockedDates}
          today={today}
          theme={theme}
          onDayPress={handleDayPress}
        />
        {showDual && (
          <MonthGrid
            year={nextMonthDate.getFullYear()}
            month={nextMonthDate.getMonth()}
            checkIn={checkIn}
            checkOut={checkOut}
            blockedDates={blockedDates}
            today={today}
            theme={theme}
            onDayPress={handleDayPress}
          />
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.nightsText, { color: theme.textSecondary }]}>
          {nights > 0
            ? `${nights} night${nights > 1 ? 's' : ''}${minNights > 1 ? ` · ${minNights} night minimum` : ''}`
            : minNights > 1
              ? `${minNights} night minimum stay`
              : 'Select check-in and checkout'}
        </Text>
        {showClear && (checkIn || checkOut) && (
          <Pressable onPress={() => onDatesChange(null, null)}>
            <Text style={[styles.clearText, { color: theme.text }]}>Clear dates</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  navBtn: { padding: 6 },
  monthsRow: {
    flexDirection: 'row',
    gap: 32,
  },
  monthBlock: {
    flex: 1,
    gap: 10,
    minWidth: 260,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  daysRow: { flexDirection: 'row' },
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
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  nightsText: { fontSize: 13 },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
