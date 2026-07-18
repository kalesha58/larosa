import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  User, Edit3, ShieldCheck, Heart, Calendar, Bell, HelpCircle,
  Lock, FileText, LogOut, ChevronRight, CheckCircle, AlertCircle,
  Star, Phone,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { customerProfile, customerBookings } from '../../lib/mockData';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
  badge?: string | number;
  danger?: boolean;
  verified?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, badge, danger, verified }: MenuItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.75 },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? 'rgba(229,57,53,0.1)' : 'rgba(201,161,74,0.1)' }]}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: danger ? '#E53935' : theme.text }]}>{label}</Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
      </View>
      {badge !== undefined && (
        <View style={[styles.badge, { backgroundColor: '#C9A14A' }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {verified !== undefined && (
        verified
          ? <CheckCircle size={16} color="#2E7D32" fill="#2E7D32" />
          : <AlertCircle size={16} color="#E53935" />
      )}
      <ChevronRight size={16} color={theme.textMuted} />
    </Pressable>
  );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      <View style={styles.sectionItems}>{children}</View>
    </View>
  );
}

export default function CProfileScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { logout, user } = useAuth();
  const profile = customerProfile;

  const upcomingCount = customerBookings.filter((b) => b.status === 'upcoming').length;

  const verificationStatus = [
    { label: 'Email', verified: profile.isEmailVerified },
    { label: 'Phone', verified: profile.isPhoneVerified },
    { label: 'Identity', verified: profile.isIdentityVerified },
  ];
  const verifiedCount = verificationStatus.filter((v) => v.verified).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: '#C9A14A22', borderColor: '#C9A14A' }]}>
              <Text style={styles.avatarText}>
                {(user?.name ?? 'A').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('EditProfile')}
              style={[styles.editAvatarBtn, { backgroundColor: '#C9A14A' }]}
            >
              <Edit3 size={12} color="#111111" />
            </Pressable>
          </View>

          <Text style={[styles.profileName, { color: theme.text }]}>{user?.name ?? profile.name}</Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{user?.email ?? profile.email}</Text>
          <View style={styles.profileMeta}>
            <Phone size={13} color={theme.textMuted} />
            <Text style={[styles.profilePhone, { color: theme.textMuted }]}>{profile.phone}</Text>
          </View>

          {/* Stats */}
          <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{profile.totalBookings}</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Stays</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>2</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Favorites</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{verifiedCount}/3</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Verification status banner */}
        {!profile.isIdentityVerified && (
          <Pressable
            onPress={() => navigation.navigate('Verification')}
            style={[styles.verifyBanner, { backgroundColor: 'rgba(229,57,53,0.08)', borderColor: 'rgba(229,57,53,0.3)' }]}
          >
            <AlertCircle size={18} color="#E53935" />
            <View style={styles.verifyBannerText}>
              <Text style={styles.verifyTitle}>Complete Identity Verification</Text>
              <Text style={[styles.verifySubtitle, { color: theme.textMuted }]}>
                Upload ID to unlock all booking features
              </Text>
            </View>
            <ChevronRight size={16} color="#E53935" />
          </Pressable>
        )}

        {/* Account section */}
        <MenuSection title="ACCOUNT">
          <MenuItem
            icon={<User size={18} color="#C9A14A" />}
            label="Edit Profile"
            subtitle="Name, email, phone"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <MenuItem
            icon={<ShieldCheck size={18} color="#C9A14A" />}
            label="Identity Verification"
            subtitle={`${verifiedCount} of 3 complete`}
            onPress={() => navigation.navigate('Verification')}
          />
        </MenuSection>

        {/* My activity */}
        <MenuSection title="MY ACTIVITY">
          <MenuItem
            icon={<Heart size={18} color="#C9A14A" />}
            label="Saved Properties"
            subtitle="Your favorited properties"
            onPress={() => navigation.navigate('CFavoritesTab')}
            badge={2}
          />
          <MenuItem
            icon={<Calendar size={18} color="#C9A14A" />}
            label="My Bookings"
            subtitle="View all your reservations"
            onPress={() => navigation.navigate('CBookingsTab')}
            badge={upcomingCount > 0 ? upcomingCount : undefined}
          />
        </MenuSection>

        {/* Preferences */}
        <MenuSection title="PREFERENCES">
          <MenuItem
            icon={<Bell size={18} color="#C9A14A" />}
            label="Notifications"
            subtitle="Booking alerts, offers, reminders"
            onPress={() => navigation.navigate('CNotifications')}
          />
          <MenuItem
            icon={<Star size={18} color="#C9A14A" />}
            label="Settings"
            subtitle="Theme, language, preferences"
            onPress={() => navigation.navigate('CSettings')}
          />
        </MenuSection>

        {/* Support */}
        <MenuSection title="SUPPORT">
          <MenuItem
            icon={<HelpCircle size={18} color="#C9A14A" />}
            label="Help & Support"
            subtitle="FAQs, contact us"
            onPress={() => navigation.navigate('Support')}
          />
          <MenuItem
            icon={<Lock size={18} color="#C9A14A" />}
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <MenuItem
            icon={<FileText size={18} color="#C9A14A" />}
            label="Terms of Service"
            onPress={() => navigation.navigate('Terms')}
          />
        </MenuSection>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <MenuItem
            icon={<LogOut size={18} color="#E53935" />}
            label="Sign Out"
            onPress={() => {
              logout();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }}
            danger
          />
        </View>

        {/* Version */}
        <Text style={[styles.versionText, { color: theme.textMuted }]}>
          LaRosa v1.0.0 · Made with ❤️ in India
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 100 },
  profileCard: {
    margin: 20, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth,
    padding: 20, alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatarSection: { position: 'relative', marginBottom: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: { color: '#C9A14A', fontSize: 28, fontWeight: '900' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  profileName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  profileEmail: { fontSize: 14 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  profilePhone: { fontSize: 13 },
  statsRow: {
    flexDirection: 'row', width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth, marginTop: 12, paddingTop: 14,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  statLabel: { fontSize: 12 },
  statDivider: { width: StyleSheet.hairlineWidth, height: '80%', alignSelf: 'center' },
  verifyBanner: {
    marginHorizontal: 20, marginBottom: 8, borderRadius: 14, borderWidth: 1,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  verifyBannerText: { flex: 1 },
  verifyTitle: { fontSize: 14, fontWeight: '700', color: '#E53935' },
  verifySubtitle: { fontSize: 12, marginTop: 2 },
  section: { marginTop: 8, marginHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  sectionItems: { gap: 8 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 14,
  },
  menuIcon: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  menuSubtitle: { fontSize: 12, marginTop: 1 },
  badge: {
    minWidth: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  badgeText: { color: '#111111', fontSize: 11, fontWeight: '800' },
  logoutSection: { marginTop: 8, marginHorizontal: 20 },
  versionText: {
    textAlign: 'center', fontSize: 12, marginTop: 24, marginBottom: 20,
  },
});
