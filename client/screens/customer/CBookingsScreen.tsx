import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Briefcase, Download, Calendar, CheckCircle, XCircle, Wallet, CalendarClock,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useData } from '../../lib/data-context';
import BookingCard from '../../components/customer/BookingCard';
import WebHeader from '../../components/WebHeader';
import { EmptyState } from '../../components/ui';
import { formatMoney } from '../../lib/format';

type Tab = 'upcoming' | 'completed' | 'cancelled';

const TABS: { key: Tab; label: string; Icon: any }[] = [
  { key: 'upcoming', label: 'Upcoming', Icon: Calendar },
  { key: 'completed', label: 'Completed', Icon: CheckCircle },
  { key: 'cancelled', label: 'Cancelled', Icon: XCircle },
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
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const { customerBookings } = useData();

  const isWeb = Platform.OS === 'web';
  const isSmallScreen = width < 640;
  const filtered = customerBookings.filter((b) => b.status === activeTab);

  const upcomingCount = customerBookings.filter((b) => b.status === 'upcoming').length;
  const completedCount = customerBookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = customerBookings.filter((b) => b.status === 'cancelled').length;
  const totalSpent = customerBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {isWeb && <WebHeader />}

      {/* Header Row */}
      <View style={[styles.headerRow, isWeb && styles.webWrap]}>
        <View style={styles.headerTitleGroup}>
          <View style={[styles.headerIconBox, { backgroundColor: 'rgba(27,77,62,0.1)' }]}>
            <Briefcase size={isSmallScreen ? 18 : 22} color="#1B4D3E" />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>My Bookings</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              {customerBookings.length} total bookings
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.downloadBtn,
            { backgroundColor: theme.surface, borderColor: theme.border },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Download size={14} color={theme.text} />
          <Text style={[styles.downloadText, { color: theme.text }]}>
            {isSmallScreen ? 'Summary' : 'Download Summary'}
          </Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[{ height: 50, flexShrink: 0, marginBottom: 16 }, isWeb && styles.webWrap]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabBarScroll, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          {TABS.map((tab) => {
            const count = customerBookings.filter((b) => b.status === tab.key).length;
            const isActive = activeTab === tab.key;
            const TabIcon = tab.Icon;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={({ pressed }) => [
                  styles.tab,
                  isActive && [styles.activeTab, { backgroundColor: '#1B4D3E' }],
                  pressed && { opacity: 0.75 },
                ]}
              >
                <TabIcon size={15} color={isActive ? '#FFFFFF' : theme.textMuted} />
                <Text style={[styles.tabText, { color: isActive ? '#FFFFFF' : theme.textSecondary }]}>
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: isActive ? '#FFFFFF' : theme.border }]}>
                    <Text style={[styles.tabBadgeText, { color: isActive ? '#1B4D3E' : theme.textSecondary }]}>
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          isWeb && styles.webWrap,
          filtered.length === 0 && styles.emptyScroll,
        ]}
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

        {/* Bottom Summary Stats Bar */}
        <View style={[styles.summaryBar, { backgroundColor: theme.surface, borderColor: theme.border }, isWeb && styles.webWrap]}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(27,77,62,0.1)' }]}>
              <Calendar size={18} color="#1B4D3E" />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Upcoming</Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>{upcomingCount}</Text>
            </View>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(46,125,50,0.1)' }]}>
              <CheckCircle size={18} color="#2E7D32" />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Completed</Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>{completedCount}</Text>
            </View>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(229,57,53,0.1)' }]}>
              <XCircle size={18} color="#E53935" />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Cancelled</Text>
              <Text style={[styles.summaryVal, { color: theme.text }]}>{cancelledCount}</Text>
            </View>
          </View>

          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
              <Wallet size={18} color={theme.gold} />
            </View>
            <View>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total Spent</Text>
              <Text style={[styles.summaryVal, { color: '#1B4D3E' }]}>{formatMoney(totalSpent)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webWrap: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 12, marginTop: 1 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  downloadText: { fontSize: 12, fontWeight: '600' },
  tabBarScroll: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  activeTab: {},
  tabText: { fontSize: 13, fontWeight: '700' },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: { fontSize: 11, fontWeight: '800' },
  scroll: { paddingBottom: 100 },
  emptyScroll: { flexGrow: 1 },
  list: { paddingHorizontal: 20, gap: 16 },

  // Summary Bar styles
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginTop: 20,
    marginHorizontal: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  summaryVal: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 1,
  },
  summaryDivider: {
    width: 1,
    height: 32,
  },
});
