import React, { useRef, useState } from 'react';
import {
  View, Text, Image, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { SleepingArrangement } from '../../types';

interface SleepingArrangementsProps {
  arrangements: SleepingArrangement[];
}

const CARD_W = 260;

export default function SleepingArrangements({ arrangements }: SleepingArrangementsProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const isDesktop = Platform.OS === 'web' && width >= 768;

  if (!arrangements.length) return null;

  const scrollTo = (next: number) => {
    const clamped = Math.max(0, Math.min(arrangements.length - 1, next));
    setIndex(clamped);
    scrollRef.current?.scrollTo({ x: clamped * (CARD_W + 14), animated: true });
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Where you'll sleep</Text>
        {isDesktop && arrangements.length > 1 && (
          <View style={styles.nav}>
            <Text style={[styles.counter, { color: theme.textSecondary }]}>
              {index + 1} / {arrangements.length}
            </Text>
            <Pressable
              onPress={() => scrollTo(index - 1)}
              style={[styles.navBtn, { borderColor: theme.border }]}
              disabled={index === 0}
            >
              <ChevronLeft size={16} color={index === 0 ? theme.textMuted : theme.text} />
            </Pressable>
            <Pressable
              onPress={() => scrollTo(index + 1)}
              style={[styles.navBtn, { borderColor: theme.border }]}
              disabled={index >= arrangements.length - 1}
            >
              <ChevronRight size={16} color={index >= arrangements.length - 1 ? theme.textMuted : theme.text} />
            </Pressable>
          </View>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        decelerationRate="fast"
        snapToInterval={CARD_W + 14}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 14));
          setIndex(i);
        }}
      >
        {arrangements.map((room) => (
          <View key={room.id} style={[styles.card, { borderColor: theme.border }]}>
            {room.image ? (
              <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={[styles.image, { backgroundColor: theme.surfaceElevated }]} />
            )}
            <Text style={[styles.label, { color: theme.text }]}>{room.label}</Text>
            <Text style={[styles.desc, { color: theme.textSecondary }]}>{room.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counter: { fontSize: 13, fontWeight: '600' },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { gap: 14, paddingRight: 8 },
  card: {
    width: CARD_W,
    gap: 8,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 14,
  },
  label: { fontSize: 15, fontWeight: '700' },
  desc: { fontSize: 13, lineHeight: 18 },
});
