import { LinearGradient } from '../../components/LinearGradient';
import { useNavigation } from '@react-navigation/native';
import { CalendarClock, CheckCircle2, IndianRupee, TrendingUp, XCircle, RefreshCw } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { Card, EmptyState, SectionHeader, StatusBadge } from '../../components/ui';
import { bookings, dashboardStats, revenueByMonth } from '../../lib/mockData';
import { formatMoney, formatDateRange, getGreeting, formatRelativeTime } from '../../lib/format';
import { useAuth } from '../../lib/auth-context';
import { currentAdmin } from '../../lib/mockData';

const recentBookings = [...bookings]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);

function KpiCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tint: string;
}) {
  const { theme } = useTheme();
  return (
    <Card style={{ flex: 1, minHeight: 100, padding: 14 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: tint + '22',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        {icon}
      </View>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
        {value}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>{label}</Text>
    </Card>
  );
}

function RevenueChart() {
  const { theme, isDark } = useTheme();
  const max = Math.max(...revenueByMonth.map((d) => d.total));
  const goldDim = isDark ? '#A88840' : '#E2D9C8';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 120, paddingTop: 8 }}>
      {revenueByMonth.map((d) => {
        const h = (d.total / max) * 100;
        return (
          <View key={d.month} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
              <LinearGradient
                colors={[theme.gold, goldDim]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: '80%',
                  height: Math.max(h, 4),
                  borderRadius: 6,
                }}
              />
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600' }}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function StatusSegment() {
  const { theme } = useTheme();
  const segs = [
    { label: 'Confirmed', count: dashboardStats.confirmed, color: theme.green },
    { label: 'Pending', count: dashboardStats.pending, color: theme.gold },
    { label: 'Cancelled', count: dashboardStats.cancelled, color: theme.red },
  ];
  return (
    <View>
      <View
        style={{
          height: 10,
          borderRadius: 5,
          flexDirection: 'row',
          overflow: 'hidden',
          backgroundColor: theme.border,
        }}
      >
        {segs.map((s) => (
          <View
            key={s.label}
            style={{
              flex: s.count,
              backgroundColor: s.color,
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
        {segs.map((s) => (
          <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: s.color }} />
            <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>
              {s.label} {s.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const adminName = user?.name ?? currentAdmin.name;
  const firstName = adminName.split(' ')[0];
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        alwaysBounceVertical
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase' }}>
              {getGreeting()}, {firstName}
            </Text>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }}>
              Dashboard
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>{today}</Text>
          </View>
          <Pressable
            onPress={handleRefresh}
            hitSlop={12}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, marginTop: 8 }]}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RefreshCw color={theme.gold} size={18} />
            </View>
          </Pressable>
        </View>

        {/* KPI Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <SectionHeader title="Overview" />
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <KpiCard
              icon={<IndianRupee color={theme.gold} size={18} />}
              label="Total revenue"
              value={formatMoney(dashboardStats.totalRevenue)}
              tint={theme.gold}
            />
            <KpiCard
              icon={<TrendingUp color={theme.blue} size={18} />}
              label="Occupancy"
              value={`${dashboardStats.occupancyRate}%`}
              tint={theme.blue}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <KpiCard
              icon={<CheckCircle2 color={theme.green} size={18} />}
              label="Confirmed"
              value={`${dashboardStats.confirmed}`}
              tint={theme.green}
            />
            <KpiCard
              icon={<XCircle color={theme.red} size={18} />}
              label="Cancelled"
              value={`${dashboardStats.cancelled}`}
              tint={theme.red}
            />
          </View>
        </View>

        {/* Revenue chart */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <SectionHeader title="Revenue" />
          <Card>
            <RevenueChart />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 14,
                paddingTop: 14,
                borderTopColor: theme.borderSoft,
                borderTopWidth: 1,
              }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>Last 6 months</Text>
              <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '700' }}>
                {formatMoney(revenueByMonth.reduce((a, b) => a + b.total, 0))}
              </Text>
            </View>
          </Card>
        </View>

        {/* Status breakdown */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Card>
            <StatusSegment />
          </Card>
        </View>

        {/* Recent bookings */}
        <View style={{ paddingHorizontal: 20 }}>
          <SectionHeader
            title="Recent bookings"
            action={
              <Pressable onPress={() => navigation.navigate('BookingsTab')}>
                <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '600' }}>See all</Text>
              </Pressable>
            }
          />
          {recentBookings.length === 0 ? (
            <EmptyState icon={<CalendarClock color={theme.textMuted} size={36} />} title="No bookings yet" />
          ) : (
            <View style={{ gap: 10 }}>
              {recentBookings.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => navigation.navigate('BookingDetail', { id: b.id })}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <Card style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                          {b.guestName}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                          {b.roomTitle} · {formatDateRange(b.checkIn, b.checkOut)}
                        </Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>
                          {formatRelativeTime(b.createdAt)}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', gap: 6 }}>
                        <Text style={{ color: theme.gold, fontSize: 15, fontWeight: '700' }}>
                          {formatMoney(b.totalPrice)}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                          <StatusBadge status={b.status} />
                        </View>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
