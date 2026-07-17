import { useNavigation } from '@react-navigation/native';
import {
  Megaphone,
  CalendarDays,
  RefreshCw,
  Users,
  MessageSquareText,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from '../components/LinearGradient';
import { useTheme } from '../lib/theme-context';
import { Card } from '../components/ui';
import { useAuth } from '../lib/auth-context';
import { notifications } from '../lib/mockData';

const unreadCount = notifications.filter((n) => !n.read).length;

function RowItem({
  icon,
  label,
  onPress,
  badge,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  badge?: number;
  destructive?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 16,
          gap: 14,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: destructive ? theme.redSoft : theme.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            flex: 1,
            color: destructive ? theme.red : theme.text,
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
        {badge !== undefined && badge > 0 && (
          <View
            style={{
              backgroundColor: theme.gold,
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              paddingHorizontal: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: theme.textInverse, fontSize: 11, fontWeight: '700' }}>{badge}</Text>
          </View>
        )}
        <ChevronRight color={theme.textMuted} size={20} />
      </View>
    </Pressable>
  );
}

export default function MoreScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
          <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase' }}>
            Account
          </Text>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
            More
          </Text>
        </View>

        {/* Admin profile card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <LinearGradient
            colors={[theme.surfaceElevated, theme.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1}}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                borderWidth: 1.5,
                borderColor: theme.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: theme.gold, fontSize: 22, fontWeight: '800' }}>
                {user?.name?.charAt(0) ?? 'K'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}>
                {user?.name ?? 'Kalesha Baig'}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {user?.email ?? 'admin@larosa.in'}
              </Text>
            </View>
            <View style={{ backgroundColor: theme.gold + '22', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Admin
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Management section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            Management
          </Text>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <RowItem
              icon={<Megaphone color={theme.gold} size={18} />}
              label="Campaigns"
              onPress={() => navigation.navigate('Campaigns')}
            />
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 66 }} />
            <RowItem
              icon={<CalendarDays color={theme.gold} size={18} />}
              label="Calendar"
              onPress={() => navigation.navigate('Calendar')}
            />
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 66 }} />
            <RowItem
              icon={<RefreshCw color={theme.gold} size={18} />}
              label="Sync logs"
              onPress={() => navigation.navigate('SyncLogs')}
            />
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 66 }} />
            <RowItem
              icon={<Users color={theme.gold} size={18} />}
              label="Users"
              onPress={() => navigation.navigate('Users')}
            />
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 66 }} />
            <RowItem
              icon={<MessageSquareText color={theme.gold} size={18} />}
              label="Feedback"
              onPress={() => navigation.navigate('Feedback')}
            />
          </Card>
        </View>

        {/* System section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8, marginTop: 20 }}>
          <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            System
          </Text>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <RowItem
              icon={<Bell color={theme.gold} size={18} />}
              label="Notifications"
              badge={unreadCount}
              onPress={() => navigation.navigate('Notifications')}
            />
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 66 }} />
            <RowItem
              icon={<SettingsIcon color={theme.gold} size={18} />}
              label="Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          </Card>
        </View>

        {/* Sign out */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <RowItem
              icon={<LogOut color={theme.red} size={18} />}
              label="Sign out"
              onPress={handleLogout}
              destructive
            />
          </Card>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: 20, marginTop: 32, alignItems: 'center' }}>
          <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '700', letterSpacing: 2 }}>
            LaRosa
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
            Admin · Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
