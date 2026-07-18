import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface BedroomCounterProps {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  label?: string;
}

export default function BedroomCounter({
  value,
  onChange,
  max = 10,
  label = 'Bedrooms',
}: BedroomCounterProps) {
  const { theme } = useTheme();

  const options = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={styles.chips}>
        {options.map((n) => (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: value === n ? '#C9A14A' : theme.surface,
                borderColor: value === n ? '#C9A14A' : theme.border,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: value === n ? '#111111' : theme.textSecondary },
              ]}
            >
              {n}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.stepper, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <Pressable
          onPress={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          style={({ pressed }) => [styles.stepBtn, value <= 1 && { opacity: 0.3 }, pressed && { opacity: 0.6 }]}
        >
          <Minus size={16} color={theme.text} />
        </Pressable>
        <Text style={[styles.stepValue, { color: theme.text }]}>{value} {value === 1 ? 'Bedroom' : 'Bedrooms'}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          style={({ pressed }) => [styles.stepBtn, value >= max && { opacity: 0.3 }, pressed && { opacity: 0.6 }]}
        >
          <Plus size={16} color="#C9A14A" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
  },
  stepBtn: {
    padding: 4,
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});
