import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { customerNotifications } from '../../lib/mockData';
import { formatRelativeTime } from '../../lib/format';
import { EmptyState } from '../../components/ui';
import type { CustomerNotification } from '../../types';

const TYPE_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  booking: { emoji: '🏡', color: '#C9A14A', bg: 'rgba(201,161,74,0.1)' },
  payment: { emoji: '💳', color: '#2E7D32', bg: 'rgba(46,125,50,0.1)' },
  reminder: { emoji: '⏰', color: '#5B8FC4', bg: 'rgba(91,143,196,0.1)' },
  offer: { emoji: '🎁', color: '#B04868', bg: 'rgba(176,72,104,0.1)' },
  system: { emoji: '🔔', color: '#6B5D4A', bg: 'rgba(107,93,74,0.1)' },
};

export default function CNotificationsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [notifs, setNotifs] = useState<CustomerNotification[]>(customerNotifications);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: '#C9A14A' }]}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <CheckCheck size={20} color="#C9A14A" />
          </Pressable>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, notifs.length === 0 && styles.emptyScroll]}>
        {notifs.length === 0 ? (
          <EmptyState
            icon={<Bell size={48} color={theme.textMuted} />}
            title="No notifications"
            subtitle="You're all caught up! We'll notify you about bookings, offers, and reminders."
          />
        ) : (
          <View style={styles.list}>
            {notifs.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.system;
              return (
                <Pressable
                  key={notif.id}
                  onPress={() => markRead(notif.id)}
                  style={({ pressed }) => [
                    styles.notifCard,
                    {
                      backgroundColor: notif.read ? theme.surface : `${cfg.color}08`,
                      borderColor: notif.read ? theme.border : `${cfg.color}33`,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                    <Text style={styles.notifEmoji}>{cfg.emoji}</Text>
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifHeader}>
                      <Text style={[styles.notifTitle, { color: theme.text }]} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      {!notif.read && <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />}
                    </View>
                    <Text style={[styles.notifMessage, { color: theme.textSecondary }]} numberOfLines={2}>
                      {notif.message}
                    </Text>
                    <Text style={[styles.notifTime, { color: theme.textMuted }]}>
                      {formatRelativeTime(notif.createdAt)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadBadgeText: { color: '#111111', fontSize: 12, fontWeight: '800' },
  scroll: { paddingBottom: 60 },
  emptyScroll: { flexGrow: 1 },
  list: { paddingHorizontal: 20, gap: 10 },
  notifCard: {
    flexDirection: 'row', gap: 12,
    borderRadius: 16, borderWidth: 1, padding: 14,
  },
  notifIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notifEmoji: { fontSize: 20 },
  notifContent: { flex: 1, gap: 4 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  notifTitle: { flex: 1, fontSize: 14, fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifMessage: { fontSize: 13, lineHeight: 18 },
  notifTime: { fontSize: 11 },
});
