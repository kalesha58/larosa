import React from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Image, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  User, Edit3, ShieldCheck, Heart, Calendar, Bell, HelpCircle,
  Lock, FileText, LogOut, ChevronRight, CheckCircle, AlertCircle,
  Star, Phone, Mail, Award, ArrowRight,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { customerProfile, customerBookings } from '../../lib/mockData';
import WebHeader from '../../components/WebHeader';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
  badge?: string | number;
  danger?: boolean;
  isGrid?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, badge, danger, isGrid }: MenuItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        isGrid && styles.menuItemGrid,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.8, transform: [{ translateY: -1 }] },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? 'rgba(229,57,53,0.1)' : theme.goldGlow }]}>
        {icon}
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: danger ? '#E53935' : theme.text }]} numberOfLines={1}>
          {label}
        </Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: theme.textMuted }]} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {badge !== undefined && (
        <View style={[styles.badge, { backgroundColor: theme.gold }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <ChevronRight size={16} color={danger ? '#E53935' : theme.textMuted} />
    </Pressable>
  );
}

function MenuSection({ title, children, isWebGrid }: { title: string; children: React.ReactNode; isWebGrid?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      <View style={[styles.sectionItems, isWebGrid && styles.gridRow]}>{children}</View>
    </View>
  );
}

export default function CProfileScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const { logout, user } = useAuth();
  const profile = customerProfile;
  const isWeb = Platform.OS === 'web';
  const isWebGrid = isWeb && width >= 640;

  const upcomingCount = customerBookings.filter((b) => b.status === 'upcoming').length;

  const verificationStatus = [
    { label: 'Email', verified: profile.isEmailVerified },
    { label: 'Phone', verified: profile.isPhoneVerified },
    { label: 'Identity', verified: profile.isIdentityVerified },
  ];
  const verifiedCount = verificationStatus.filter((v) => v.verified).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {isWeb && <WebHeader />}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, isWeb && styles.webScroll]}>

        {/* ══ HERO PROFILE HEADER CARD ═══════════════════════════════════════ */}
        <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Background villa image with luxury gradient */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.heroBgImage}
            resizeMode="cover"
          />
          <View style={[styles.heroGradient, { backgroundColor: theme.isDark ? 'rgba(14,24,20,0.88)' : 'rgba(18,28,24,0.84)' }]} />

          {/* User Profile Details */}
          <View style={styles.heroTopContent}>
            <View style={styles.avatarSection}>
              <View style={[styles.avatar, { backgroundColor: 'rgba(201,161,74,0.25)', borderColor: theme.gold }]}>
                <Text style={styles.avatarText}>
                  {(user?.name ?? 'A').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('EditProfile')}
                style={({ pressed }) => [styles.editAvatarBtn, { backgroundColor: theme.gold }, pressed && { opacity: 0.8 }]}
              >
                <Edit3 size={11} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.heroDetails}>
              <View style={[styles.roleBadge, { backgroundColor: theme.goldGlow, borderColor: theme.goldSoft + '44' }]}>
                <Star size={11} color={theme.gold} fill={theme.gold} />
                <Text style={[styles.roleBadgeText, { color: theme.gold }]}>
                  {user?.role === 'host' ? 'Host' : 'Guest Member'}
                </Text>
              </View>

              <Text style={styles.heroName} numberOfLines={1}>{user?.name ?? profile.name}</Text>

              <View style={styles.heroMetaRow}>
                <View style={styles.heroMetaItem}>
                  <Mail size={12} color="rgba(255,255,255,0.75)" />
                  <Text style={styles.heroMetaText} numberOfLines={1}>{user?.email ?? profile.email}</Text>
                </View>
                <View style={styles.heroMetaItem}>
                  <Phone size={12} color="rgba(255,255,255,0.75)" />
                  <Text style={styles.heroMetaText}>{profile.phone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Hero Card Footer Stats Bar */}
          <View style={styles.heroStatsContainer}>
            <View style={[styles.heroStatCard, { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.14)' }]}>
              <View style={[styles.heroStatIconBox, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
                <Calendar size={16} color={theme.gold} />
              </View>
              <View>
                <Text style={styles.heroStatVal}>{profile.totalBookings}</Text>
                <Text style={styles.heroStatLabel}>Stays</Text>
              </View>
            </View>

            <View style={[styles.heroStatCard, { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.14)' }]}>
              <View style={[styles.heroStatIconBox, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
                <Heart size={16} color={theme.gold} />
              </View>
              <View>
                <Text style={styles.heroStatVal}>2</Text>
                <Text style={styles.heroStatLabel}>Favorites</Text>
              </View>
            </View>

            <View style={[styles.heroStatCard, { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.14)' }]}>
              <View style={[styles.heroStatIconBox, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
                <ShieldCheck size={16} color={theme.gold} />
              </View>
              <View>
                <Text style={styles.heroStatVal}>{verifiedCount}/3</Text>
                <Text style={styles.heroStatLabel}>Verified</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ══ IDENTITY VERIFICATION BANNER ═══════════════════════════════════ */}
        {!profile.isIdentityVerified && (
          <Pressable
            onPress={() => navigation.navigate('Verification')}
            style={({ pressed }) => [
              styles.verifyBanner,
              { backgroundColor: 'rgba(229,57,53,0.08)', borderColor: 'rgba(229,57,53,0.25)' },
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={[styles.verifyIconBox, { backgroundColor: 'rgba(229,57,53,0.12)' }]}>
              <ShieldCheck size={20} color="#E53935" />
            </View>
            <View style={styles.verifyBannerText}>
              <Text style={styles.verifyTitle}>Complete Identity Verification</Text>
              <Text style={[styles.verifySubtitle, { color: theme.textMuted }]}>
                Upload ID to unlock all booking features
              </Text>
            </View>
            <View style={styles.verifyActionBtn}>
              <Text style={styles.verifyActionText}>Verify Now</Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </View>
          </Pressable>
        )}

        {/* ══ ACCOUNT SECTION ══════════════════════════════════════════════ */}
        <MenuSection title="ACCOUNT" isWebGrid={isWebGrid}>
          <MenuItem
            isGrid={isWebGrid}
            icon={<User size={18} color={theme.gold} />}
            label="Edit Profile"
            subtitle="Name, email, phone"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<ShieldCheck size={18} color={theme.gold} />}
            label="Identity Verification"
            subtitle={`${verifiedCount} of 3 complete`}
            onPress={() => navigation.navigate('Verification')}
          />
        </MenuSection>

        {/* ══ MY ACTIVITY SECTION ══════════════════════════════════════════ */}
        <MenuSection title="MY ACTIVITY" isWebGrid={isWebGrid}>
          <MenuItem
            isGrid={isWebGrid}
            icon={<Heart size={18} color={theme.gold} />}
            label="Saved Properties"
            subtitle="Your favorite properties"
            onPress={() => navigation.navigate('CFavoritesTab')}
            badge={2}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<Calendar size={18} color={theme.gold} />}
            label="My Bookings"
            subtitle="View all your reservations"
            onPress={() => navigation.navigate('CBookingsTab')}
            badge={upcomingCount > 0 ? upcomingCount : undefined}
          />
        </MenuSection>

        {/* ══ PREFERENCES SECTION ══════════════════════════════════════════ */}
        <MenuSection title="PREFERENCES" isWebGrid={isWebGrid}>
          <MenuItem
            isGrid={isWebGrid}
            icon={<Bell size={18} color={theme.gold} />}
            label="Notifications"
            subtitle="Booking alerts, offers, reminders"
            onPress={() => navigation.navigate('CNotifications')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<Star size={18} color={theme.gold} />}
            label="Settings"
            subtitle="Theme, language, preferences"
            onPress={() => navigation.navigate('CSettings')}
          />
        </MenuSection>

        {/* ══ SUPPORT SECTION ══════════════════════════════════════════════ */}
        <MenuSection title="SUPPORT" isWebGrid={isWebGrid}>
          <MenuItem
            isGrid={isWebGrid}
            icon={<HelpCircle size={18} color={theme.gold} />}
            label="Help & Support"
            subtitle="FAQs, contact us"
            onPress={() => navigation.navigate('Support')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<Lock size={18} color={theme.gold} />}
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<FileText size={18} color={theme.gold} />}
            label="Terms of Service"
            onPress={() => navigation.navigate('Terms')}
          />
        </MenuSection>

        {/* ══ SIGN OUT ═════════════════════════════════════════════════════ */}
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

        {/* Footer info */}
        <Text style={[styles.versionText, { color: theme.textMuted }]}>
          LaRosa v1.0.0 · Made with ❤️ in India
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 100, paddingTop: 16 },
  webScroll: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  // Hero Profile Header Card
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 24,
    zIndex: 2,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  heroDetails: {
    flex: 1,
    gap: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 2,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  // Hero Card Footer Stats Bar
  heroStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 2,
  },
  heroStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  heroStatIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  // Verification Banner
  verifyBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBannerText: { flex: 1 },
  verifyTitle: { fontSize: 14, fontWeight: '800', color: '#E53935' },
  verifySubtitle: { fontSize: 12, marginTop: 2 },
  verifyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E53935',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  verifyActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Menu Sections & Grid Layout
  section: { marginBottom: 20, marginHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, marginLeft: 4 },
  sectionItems: { gap: 10 },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItemGrid: {
    flex: 1,
    minWidth: 280,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  menuSubtitle: { fontSize: 12, marginTop: 2 },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  logoutSection: { marginBottom: 20, marginHorizontal: 20 },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 12,
    marginBottom: 24,
  },
});
