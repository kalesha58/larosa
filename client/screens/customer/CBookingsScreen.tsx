import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CalendarClock } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useData } from '../../lib/data-context';
import BookingCard from '../../components/customer/BookingCard';
import { EmptyState } from '../../components/ui';

type Tab = 'upcoming' | 'completed' | 'cancelled';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'upcoming', label: 'Upcoming', emoji: '🗓️' },
  { key: 'completed', label: 'Completed', emoji: '✅' },
  { key: 'cancelled', label: 'Cancelled', emoji: '❌' },
];

const EMPTY_MESSAGES: Record<Tab, { title: string; subtitle: string }> = {
  upcoming: {
    title: 'No upcoming stays',
    subtitle: 'Your next adventure awaits. Explore farmhouses and villas to book your perfect getaway.',
  },
  completed: {
    title: 'No completed stays yet',
    subtitle: 'Once you complete a stay, it will appear here. Leave a review to help fellow travelers.',
  },
  cancelled: {
    title: 'No cancelled bookings',
    subtitle: 'Great news! You have no cancelled bookings.',
  },
};

export default function CBookingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const { customerBookings } = useData();

  const filtered = customerBookings.filter((b) => b.status === activeTab);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Bookings</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {customerBookings.length} total bookings
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {TABS.map((tab) => {
          const count = customerBookings.filter((b) => b.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={({ pressed }) => [
                styles.tab,
                isActive && [styles.activeTab, { backgroundColor: '#C9A14A' }],
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text style={[styles.tabText, { color: isActive ? '#111111' : theme.textSecondary }]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: isActive ? '#111111' : theme.border }]}>
                  <Text style={[styles.tabBadgeText, { color: isActive ? '#fff' : theme.textSecondary }]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, filtered.length === 0 && styles.emptyScroll]}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<CalendarClock size={48} color={theme.textMuted} />}
            title={EMPTY_MESSAGES[activeTab].title}
            subtitle={EMPTY_MESSAGES[activeTab].subtitle}
          />
        ) : (
          <View style={styles.list}>
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPress={() => navigation.navigate('CBookingDetail', { bookingId: booking.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 2 },
  tabBar: {
    flexDirection: 'row', marginHorizontal: 20, borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth, padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 12,
  },
  activeTab: {},
  tabText: { fontSize: 13, fontWeight: '700' },
  tabBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  tabBadgeText: { fontSize: 11, fontWeight: '700' },
  scroll: { paddingBottom: 100 },
  emptyScroll: { flexGrow: 1 },
  list: { paddingHorizontal: 20 },
});
