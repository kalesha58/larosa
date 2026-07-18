import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CheckCircle, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cash';

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  available: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'upi',
    label: 'UPI',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM',
    icon: Smartphone,
    available: true,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, Rupay, Amex',
    icon: CreditCard,
    available: true,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    subtitle: 'All major Indian banks supported',
    icon: Building2,
    available: true,
  },
  {
    id: 'cash',
    label: 'Cash at Check-in',
    subtitle: 'Pay remaining balance in cash on arrival',
    icon: Wallet,
    available: true,
  },
];

interface PaymentCardProps {
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  hideCash?: boolean;
}

export default function PaymentCard({ selected, onSelect, hideCash = false }: PaymentCardProps) {
  const { theme } = useTheme();

  const options = hideCash
    ? PAYMENT_OPTIONS.filter((o) => o.id !== 'cash')
    : PAYMENT_OPTIONS;

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = selected === option.id;

        return (
          <Pressable
            key={option.id}
            onPress={() => option.available && onSelect(option.id)}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: isSelected ? 'rgba(201,161,74,0.08)' : theme.surface,
                borderColor: isSelected ? '#C9A14A' : theme.border,
              },
              !option.available && { opacity: 0.4 },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: isSelected ? 'rgba(201,161,74,0.15)' : theme.surfaceElevated }]}>
              <Icon size={20} color={isSelected ? '#C9A14A' : theme.textSecondary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionLabel, { color: theme.text }]}>{option.label}</Text>
              <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>{option.subtitle}</Text>
              {!option.available && (
                <Text style={{ color: theme.red, fontSize: 11, marginTop: 2 }}>Not available</Text>
              )}
            </View>
            <View style={[
              styles.radioCircle,
              {
                borderColor: isSelected ? '#C9A14A' : theme.border,
                backgroundColor: isSelected ? '#C9A14A' : 'transparent',
              },
            ]}>
              {isSelected && <CheckCircle size={12} color="#111111" fill="#111111" />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  optionSubtitle: {
    fontSize: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
