import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { CalendarX, KeyRound, Shield } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface ThingsToKnowProps {
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  maxGuests: number;
  houseRules: string[];
  safetyNotes: string[];
}

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export default function ThingsToKnow({
  cancellationPolicy,
  checkInTime,
  checkOutTime,
  maxGuests,
  safetyNotes,
}: ThingsToKnowProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' ? width >= 900 : width >= 700;

  // Keep policy readable — first 2 sentences max for the card body
  const policyPreview = cancellationPolicy
    .split(/(?<=\.)\s+/)
    .slice(0, 2)
    .join(' ');

  const ruleLines = [
    `Check-in after ${formatTime(checkInTime)}`,
    `Checkout before ${formatTime(checkOutTime)}`,
    `${maxGuests} guests maximum`,
  ];

  const columns = [
    {
      Icon: CalendarX,
      title: 'Cancellation policy',
      lines: [policyPreview],
    },
    {
      Icon: KeyRound,
      title: 'House rules',
      lines: ruleLines,
    },
    {
      Icon: Shield,
      title: 'Safety & property',
      lines: safetyNotes.slice(0, 3),
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.text }]}>Things to know</Text>
      <View style={[styles.grid, isWide && styles.gridWide]}>
        {columns.map(({ Icon, title, lines }) => (
          <View
            key={title}
            style={[
              styles.col,
              isWide && styles.colWide,
              !isWide && [styles.colStacked, { borderBottomColor: theme.border }],
            ]}
          >
            <Icon size={24} color={theme.text} strokeWidth={1.5} />
            <Text style={[styles.colTitle, { color: theme.text }]}>{title}</Text>
            <View style={styles.lines}>
              {lines.map((line) => (
                <Text key={line} style={[styles.line, { color: theme.textSecondary }]}>
                  {line}
                </Text>
              ))}
            </View>
            <Pressable hitSlop={8}>
              <Text style={[styles.learnMore, { color: theme.text }]}>Learn more</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 28,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  grid: {
    gap: 0,
  },
  gridWide: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'flex-start',
  },
  col: {
    gap: 12,
  },
  colWide: {
    flex: 1,
    minWidth: 0,
  },
  colStacked: {
    paddingVertical: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  colTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  lines: {
    gap: 6,
    minHeight: 72,
  },
  line: {
    fontSize: 14,
    lineHeight: 21,
  },
  learnMore: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
