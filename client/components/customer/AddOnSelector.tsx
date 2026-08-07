import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check, Sparkles, Utensils, Waves, Flame, Car } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { formatMoney } from '../../lib/format';

export interface AddOnItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  icon: React.ReactNode;
}

export const LUXURY_ADD_ONS: AddOnItem[] = [
  {
    id: 'addon_chef',
    title: 'Private Chef Experience',
    subtitle: 'Custom farm-to-table 3-course dinner prepared at villa',
    price: 3500,
    icon: <Utensils size={18} color="#C9A14A" />,
  },
  {
    id: 'addon_pool_bf',
    title: 'Floating Pool Breakfast',
    subtitle: 'Signature floating breakfast tray served in private pool',
    price: 1500,
    icon: <Waves size={18} color="#5B8FC4" />,
  },
  {
    id: 'addon_bonfire',
    title: 'Bonfire & Acoustic Night',
    subtitle: 'Private bonfire pit setup with firewood and ambient lighting',
    price: 2000,
    icon: <Flame size={18} color="#E53935" />,
  },
  {
    id: 'addon_transfer',
    title: 'Luxury Airport Transfer',
    subtitle: 'Chauffeur-driven SUV pickup & drop from nearest airport',
    price: 2500,
    icon: <Car size={18} color="#2E7D32" />,
  },
];

interface AddOnSelectorProps {
  selectedIds: string[];
  onToggleAddOn: (id: string) => void;
}

export default function AddOnSelector({ selectedIds, onToggleAddOn }: AddOnSelectorProps) {
  const { theme } = useTheme();

  const totalAddOnCost = LUXURY_ADD_ONS
    .filter((item) => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <Sparkles size={18} color={theme.gold} />
        <Text style={[styles.title, { color: theme.text }]}>Luxury Experience Add-ons</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Elevate your stay with curated on-demand villa services
      </Text>

      <View style={styles.list}>
        {LUXURY_ADD_ONS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => onToggleAddOn(item.id)}
              style={({ pressed }) => [
                styles.itemCard,
                {
                  backgroundColor: isSelected ? theme.goldGlow : theme.bg,
                  borderColor: isSelected ? theme.gold : theme.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={[styles.checkbox, isSelected && { backgroundColor: theme.gold, borderColor: theme.gold }]}>
                {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>

              <View style={styles.iconBox}>
                {item.icon}
              </View>

              <View style={styles.content}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textMuted }]}>{item.subtitle}</Text>
              </View>

              <Text style={[styles.itemPrice, { color: theme.gold }]}>
                +{formatMoney(item.price)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedIds.length > 0 && (
        <View style={[styles.totalBar, { backgroundColor: 'rgba(201,161,74,0.1)', borderColor: 'rgba(201,161,74,0.25)' }]}>
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Add-ons Total:</Text>
          <Text style={[styles.totalVal, { color: theme.gold }]}>{formatMoney(totalAddOnCost)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 6,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#9AA0A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
  },
  totalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '800',
  },
});
