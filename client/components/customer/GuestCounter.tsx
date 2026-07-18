import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface CounterProps {
  label: string;
  subtitle?: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

function Counter({ label, subtitle, value, onIncrement, onDecrement, min = 0, max = 20 }: CounterProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
      </View>
      <View style={styles.controls}>
        <Pressable
          onPress={onDecrement}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.btn,
            { borderColor: theme.border, backgroundColor: theme.surface },
            value <= min && { opacity: 0.35 },
            pressed && { opacity: 0.6 },
          ]}
        >
          <Minus size={16} color={theme.text} />
        </Pressable>
        <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
        <Pressable
          onPress={onIncrement}
          disabled={value >= max}
          style={({ pressed }) => [
            styles.btn,
            { borderColor: '#C9A14A', backgroundColor: 'rgba(201,161,74,0.1)' },
            value >= max && { opacity: 0.35 },
            pressed && { opacity: 0.6 },
          ]}
        >
          <Plus size={16} color="#C9A14A" />
        </Pressable>
      </View>
    </View>
  );
}

interface GuestCounterProps {
  adults: number;
  children: number;
  onAdultsChange: (v: number) => void;
  onChildrenChange: (v: number) => void;
  maxCapacity?: number;
}

export default function GuestCounter({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  maxCapacity = 20,
}: GuestCounterProps) {
  const { theme } = useTheme();
  const totalGuests = adults + children;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Counter
        label="Adults"
        subtitle="Age 13+"
        value={adults}
        onIncrement={() => totalGuests < maxCapacity && onAdultsChange(adults + 1)}
        onDecrement={() => onAdultsChange(Math.max(1, adults - 1))}
        min={1}
        max={maxCapacity}
      />
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <Counter
        label="Children"
        subtitle="Age 2–12"
        value={children}
        onIncrement={() => totalGuests < maxCapacity && onChildrenChange(children + 1)}
        onDecrement={() => onChildrenChange(Math.max(0, children - 1))}
        min={0}
        max={maxCapacity}
      />
      {maxCapacity < 20 && (
        <Text style={[styles.capacity, { color: theme.textMuted }]}>
          Max {maxCapacity} guests · {totalGuests} selected
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  capacity: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: -8,
  },
});
