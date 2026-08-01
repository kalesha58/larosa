import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../lib/theme-context';

export type SectionNavId = 'photos' | 'amenities' | 'rooms' | 'location';

export const SECTION_NAV_TABS: { id: SectionNavId; label: string }[] = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'location', label: 'Location' },
];

export const SECTION_NAV_HEIGHT = 52;

interface SectionNavProps {
  visible: boolean;
  activeId: SectionNavId;
  onPress: (id: SectionNavId) => void;
}

/** Sticky section jump nav — intended for web only */
export default function SectionNav({ visible, activeId, onPress }: SectionNavProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.inner}
      >
        {SECTION_NAV_TABS.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <Pressable
              key={id}
              onPress={() => onPress(id)}
              style={[
                styles.tab,
                active && { borderBottomColor: theme.gold },
                !active && { borderBottomColor: 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: theme.text },
                  active && styles.tabLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: SECTION_NAV_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  inner: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    height: SECTION_NAV_HEIGHT,
  },
  tab: {
    paddingHorizontal: 4,
    paddingRight: 28,
    justifyContent: 'center',
    borderBottomWidth: 2,
    height: SECTION_NAV_HEIGHT,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
