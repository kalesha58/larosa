import { useNavigation } from '@react-navigation/native';
import {
  User,
  ShieldCheck,
  Building,
  CreditCard,
  LogOut,
  Mail,
  Smartphone,
  ChevronRight,
  HelpCircle,
  FileText,
  Sun,
  Moon,
  Bell,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { Card, SectionHeader, Toggle } from '../../components/ui';

export default function HostMoreScreen() {
  const { theme, toggle, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  // Settings & Notifications States
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const maskAccountNumber = (num?: string) => {
    if (!num) return 'Not linked';
    if (num.length <= 4) return num;
    return '•••• •••• ' + num.slice(-4);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
            Account
          </Text>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', marginTop: 4 }}>
            Host Settings
          </Text>
        </View>

        {/* Profile Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Card style={styles.profileCard}>
            <View style={[styles.avatarBox, { backgroundColor: theme.gold + '22', borderColor: theme.gold }]}>
              <Text style={{ color: theme.gold, fontSize: 24, fontWeight: '800' }}>
                {user?.name?.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>{user?.name}</Text>
                {user?.hostVerificationStatus === 'verified' && (
                  <ShieldCheck color={theme.green} size={18} />
                )}
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>Property Host</Text>
            </View>
          </Card>
        </View>

        {/* Verification Status Banner */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Card style={[styles.statusBanner, { borderColor: theme.green }]}>
            <ShieldCheck color={theme.green} size={22} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>Verification Complete</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                Your account is verified. All your active listings are visible to guests.
              </Text>
            </View>
          </Card>
        </View>

        {/* Bank Account Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionHeader title="Linked Bank Account" />
          <Card style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <CreditCard color={theme.gold} size={20} />
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Account Holder Name</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginTop: 2 }}>
                  {user?.bankDetails?.accountHolderName || user?.name}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Building color={theme.gold} size={20} />
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11 }}>Bank Account Number</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginTop: 2 }}>
                  {maskAccountNumber(user?.bankDetails?.bankAccountNumber)}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Building color={theme.gold} size={20} />
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 11 }}>IFSC Code</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginTop: 2 }}>
                  {user?.bankDetails?.ifscCode || 'Not provided'}
                </Text>
              </View>
            </View>

            {user?.bankDetails?.upiId && (
              <>
                <View style={styles.separator} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Smartphone color={theme.gold} size={20} />
                  <View>
                    <Text style={{ color: theme.textSecondary, fontSize: 11 }}>UPI ID</Text>
                    <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', marginTop: 2 }}>
                      {user.bankDetails.upiId}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </Card>
        </View>

        {/* Appearance Settings */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionHeader title="Appearance" />
          <Card style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 10 }}>
                {isDark ? <Moon color={theme.gold} size={20} /> : <Sun color={theme.gold} size={20} />}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>Dark Mode</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>
                    {isDark ? 'Champagne gold on dark themes' : 'Bronze gold accents on light themes'}
                  </Text>
                </View>
              </View>
              <Toggle value={isDark} onValueChange={toggle} />
            </View>
          </Card>
        </View>

        {/* Notifications Settings */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <SectionHeader title="Notification Settings" />
          <Card style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 10 }}>
                <Smartphone color={theme.gold} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>SMS Alerts</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Instant SMS messages for guest stay requests</Text>
                </View>
              </View>
              <Toggle value={smsEnabled} onValueChange={setSmsEnabled} />
            </View>

            <View style={styles.separator} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 10 }}>
                <Mail color={theme.gold} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>Email Alerts</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Receive booking invoices and checkout reports</Text>
                </View>
              </View>
              <Toggle value={emailEnabled} onValueChange={setEmailEnabled} />
            </View>

            <View style={styles.separator} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 10 }}>
                <Bell color={theme.gold} size={20} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>Push Notifications</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>Real-time check-in alerts and updates</Text>
                </View>
              </View>
              <Toggle value={pushEnabled} onValueChange={setPushEnabled} />
            </View>
          </Card>
        </View>

        {/* Support Links */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24, gap: 10 }}>
          <SectionHeader title="Support & Info" />
          {[
            { label: 'Host Guidelines & Rules', icon: FileText, route: 'Support' },
            { label: 'Larosa Support Desk', icon: HelpCircle, route: 'Support' },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={() => navigation.navigate(item.route)}
              style={({ pressed }) => [styles.linkItem, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && { opacity: 0.7 }]}
            >
              <item.icon color={theme.gold} size={18} />
              <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600', flex: 1, marginLeft: 12 }}>
                {item.label}
              </Text>
              <ChevronRight color={theme.textMuted} size={16} />
            </Pressable>
          ))}
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutBtn, { borderColor: theme.red }, pressed && { backgroundColor: theme.redSoft + '11' }]}
          >
            <LogOut color={theme.red} size={18} />
            <Text style={{ color: theme.red, fontSize: 15, fontWeight: '700', marginLeft: 10 }}>
              Sign Out of Host Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderLeftWidth: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
  },
});
