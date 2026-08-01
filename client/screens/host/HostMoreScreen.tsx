import { useNavigation } from '@react-navigation/native';
import {
  ShieldCheck, Building2, CreditCard, LogOut, Mail, Phone,
  Smartphone, ChevronRight, HelpCircle, FileText, Sun, Moon,
  Bell, Star, IndianRupee, Calendar, Edit3, ArrowRight,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable, ScrollView, Text, View, StyleSheet,
  Platform, useWindowDimensions, Image,
} from 'react-native';
import { Alert } from '../../lib/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { Toggle } from '../../components/ui';
import HostWebHeader from '../../components/HostWebHeader';
import { useData } from '../../lib/data-context';
import { formatMoney } from '../../lib/format';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  isGrid?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, danger, isGrid }: MenuItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        mStyles.menuItem,
        isGrid && mStyles.menuItemGrid,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && { opacity: 0.8, transform: [{ translateY: -1 }] },
      ]}
    >
      <View style={[mStyles.menuIcon, { backgroundColor: danger ? 'rgba(229,57,53,0.1)' : theme.goldGlow }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[mStyles.menuLabel, { color: danger ? '#E53935' : theme.text }]} numberOfLines={1}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[mStyles.menuSub, { color: theme.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <ChevronRight size={16} color={danger ? '#E53935' : theme.textMuted} />
    </Pressable>
  );
}

function MenuSection({ title, children, isGrid }: { title: string; children: React.ReactNode; isGrid?: boolean }) {
  const { theme } = useTheme();
  return (
    <View style={mStyles.section}>
      <Text style={[mStyles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      <View style={[mStyles.sectionItems, isGrid && mStyles.sectionGrid]}>{children}</View>
    </View>
  );
}

export default function HostMoreScreen() {
  const { theme, toggle, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { rooms, bookings } = useData();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 640;
  const G = theme.gold ?? '#C9A14A';

  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Always show host_demo data regardless of logged-in user id.
  const hostRooms = rooms.filter((r) => r.hostId === 'host_demo' || !r.hostId);
  const hostBookings = bookings.filter((b) => hostRooms.some((r) => r.roomId === b.roomId));
  const confirmedBookings = hostBookings.filter((b) => b.status === 'confirmed');
  const thisMonthEarnings = confirmedBookings
    .filter((b) => new Date(b.createdAt).getMonth() === new Date().getMonth())
    .reduce((acc, b) => acc + b.totalPrice, 0);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && <HostWebHeader />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[mStyles.scroll, isWide && mStyles.scrollWide]}
      >

        {/* ══ HERO PROFILE CARD ══════════════════════════════════════════════ */}
        <View style={[mStyles.heroCard, { borderColor: theme.border }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' }}
            style={mStyles.heroBgImage}
            resizeMode="cover"
          />
          <View style={[mStyles.heroGradient, { backgroundColor: isDark ? 'rgba(14,24,20,0.88)' : 'rgba(18,28,24,0.85)' }]} />

          {/* Profile content */}
          <View style={mStyles.heroTopContent}>
            <View style={mStyles.avatarWrap}>
              <View style={[mStyles.avatar, { backgroundColor: 'rgba(201,161,74,0.25)', borderColor: G }]}>
                <Text style={mStyles.avatarText}>
                  {(user?.name ?? 'H').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [mStyles.editAvatarBtn, { backgroundColor: G }, pressed && { opacity: 0.8 }]}
              >
                <Edit3 size={11} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              {/* Host verified badge */}
              {user?.hostVerificationStatus === 'verified' && (
                <View style={[mStyles.verifiedBadge, { backgroundColor: theme.goldGlow, borderColor: G + '44' }]}>
                  <ShieldCheck size={11} color={G} />
                  <Text style={[mStyles.verifiedBadgeText, { color: G }]}>Verified Host</Text>
                </View>
              )}

              <Text style={mStyles.heroName} numberOfLines={1}>{user?.name ?? 'Host'}</Text>

              <View style={{ gap: 4 }}>
                <View style={mStyles.heroMetaRow}>
                  <Mail size={12} color="rgba(255,255,255,0.75)" />
                  <Text style={mStyles.heroMetaText} numberOfLines={1}>{user?.email}</Text>
                </View>
                {user?.phone && (
                  <View style={mStyles.heroMetaRow}>
                    <Phone size={12} color="rgba(255,255,255,0.75)" />
                    <Text style={mStyles.heroMetaText}>{user.phone}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Stats footer */}
          <View style={mStyles.heroStatsRow}>
            <View style={[mStyles.heroStatCard, { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.14)' }]}>
              <View style={[mStyles.heroStatIcon, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
                <Building2 size={15} color={G} />
              </View>
              <View>
                <Text style={mStyles.heroStatVal}>{hostRooms.length}</Text>
                <Text style={mStyles.heroStatLabel}>Listings</Text>
              </View>
            </View>

            <View style={[mStyles.heroStatCard, { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.14)' }]}>
              <View style={[mStyles.heroStatIcon, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
                <Calendar size={15} color={G} />
              </View>
              <View>
                <Text style={mStyles.heroStatVal}>{confirmedBookings.length}</Text>
                <Text style={mStyles.heroStatLabel}>Bookings</Text>
              </View>
            </View>

            <View style={[mStyles.heroStatCard, { backgroundColor: 'rgba(255,255,255,0.09)', borderColor: 'rgba(255,255,255,0.14)' }]}>
              <View style={[mStyles.heroStatIcon, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
                <IndianRupee size={15} color={G} />
              </View>
              <View>
                <Text style={mStyles.heroStatVal}>{thisMonthEarnings > 0 ? formatMoney(thisMonthEarnings) : '₹0'}</Text>
                <Text style={mStyles.heroStatLabel}>This Month</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ══ BANK ACCOUNT DETAILS ═══════════════════════════════════════════ */}
        {user?.bankDetails && (
          <View style={mStyles.bankCard}>
            <View style={[mStyles.bankCardInner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={mStyles.bankHeader}>
                <View style={[mStyles.bankIconBox, { backgroundColor: theme.goldGlow }]}>
                  <CreditCard size={18} color={G} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[mStyles.bankTitle, { color: theme.text }]}>Linked Bank Account</Text>
                  <Text style={[mStyles.bankSub, { color: theme.textMuted }]}>Earnings are settled within 2 business days</Text>
                </View>
              </View>

              <View style={[mStyles.bankDivider, { backgroundColor: theme.border }]} />

              <View style={mStyles.bankGrid}>
                <View style={mStyles.bankField}>
                  <Text style={[mStyles.bankFieldLabel, { color: theme.textMuted }]}>Account Holder</Text>
                  <Text style={[mStyles.bankFieldVal, { color: theme.text }]}>{user.bankDetails.accountHolderName}</Text>
                </View>
                <View style={mStyles.bankField}>
                  <Text style={[mStyles.bankFieldLabel, { color: theme.textMuted }]}>Account Number</Text>
                  <Text style={[mStyles.bankFieldVal, { color: theme.text }]}>{maskAccountNumber(user.bankDetails.bankAccountNumber)}</Text>
                </View>
                <View style={mStyles.bankField}>
                  <Text style={[mStyles.bankFieldLabel, { color: theme.textMuted }]}>IFSC Code</Text>
                  <Text style={[mStyles.bankFieldVal, { color: theme.text }]}>{user.bankDetails.ifscCode || 'Not provided'}</Text>
                </View>
                {user.bankDetails.upiId && (
                  <View style={mStyles.bankField}>
                    <Text style={[mStyles.bankFieldLabel, { color: theme.textMuted }]}>UPI ID</Text>
                    <Text style={[mStyles.bankFieldVal, { color: theme.text }]}>{user.bankDetails.upiId}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ══ ACCOUNT MENU SECTIONS ══════════════════════════════════════════ */}
        <MenuSection title="LISTINGS" isGrid={isWide}>
          <MenuItem
            isGrid={isWide}
            icon={<Building2 size={18} color={G} />}
            label="My Farmhouses"
            subtitle="Manage your active listings"
            onPress={() => navigation.navigate('HostVillasTab')}
          />
          <MenuItem
            isGrid={isWide}
            icon={<Star size={18} color={G} />}
            label="Add New Listing"
            subtitle="List a new property on LaRosa"
            onPress={() => navigation.navigate('VillaEdit')}
          />
        </MenuSection>

        <MenuSection title="PREFERENCES" isGrid={isWide}>
          <Pressable
            onPress={toggle}
            style={({ pressed }) => [
              mStyles.menuItem,
              isWide && mStyles.menuItemGrid,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[mStyles.menuIcon, { backgroundColor: theme.goldGlow }]}>
              {isDark ? <Moon size={18} color={G} /> : <Sun size={18} color={G} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[mStyles.menuLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[mStyles.menuSub, { color: theme.textMuted }]}>
                {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              </Text>
            </View>
            <Toggle value={isDark} onValueChange={toggle} />
          </Pressable>

          <Pressable
            onPress={() => setSmsEnabled(!smsEnabled)}
            style={({ pressed }) => [
              mStyles.menuItem,
              isWide && mStyles.menuItemGrid,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[mStyles.menuIcon, { backgroundColor: theme.goldGlow }]}>
              <Bell size={18} color={G} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[mStyles.menuLabel, { color: theme.text }]}>Notifications</Text>
              <Text style={[mStyles.menuSub, { color: theme.textMuted }]}>Booking alerts, guest messages</Text>
            </View>
            <Toggle value={smsEnabled} onValueChange={setSmsEnabled} />
          </Pressable>
        </MenuSection>

        <MenuSection title="SUPPORT" isGrid={isWide}>
          <MenuItem
            isGrid={isWide}
            icon={<FileText size={18} color={G} />}
            label="Host Guidelines & Rules"
            subtitle="LaRosa hosting policies"
            onPress={() => navigation.navigate('Support')}
          />
          <MenuItem
            isGrid={isWide}
            icon={<HelpCircle size={18} color={G} />}
            label="Larosa Support Desk"
            subtitle="Get help from our team"
            onPress={() => navigation.navigate('Support')}
          />
        </MenuSection>

        {/* ══ SIGN OUT ═══════════════════════════════════════════════════════ */}
        <View style={mStyles.section}>
          <MenuItem
            icon={<LogOut size={18} color="#E53935" />}
            label="Sign Out of Host Account"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text style={[mStyles.versionText, { color: theme.textMuted }]}>
          LaRosa Host v1.0.0 · Verified Partner
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const mStyles = StyleSheet.create({
  scroll: { paddingBottom: 120, paddingTop: 20 },
  scrollWide: { paddingHorizontal: 20, maxWidth: 1280, width: '100%', alignSelf: 'center' },

  // Hero card
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
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  heroGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  heroTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 24,
    zIndex: 2,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2,
  },
  avatarText: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, marginBottom: 2,
  },
  verifiedBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.4 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  heroStatsRow: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 20, zIndex: 2,
  },
  heroStatCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, borderWidth: 1,
  },
  heroStatIcon: {
    width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  heroStatVal: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },

  // Bank card
  bankCard: { marginHorizontal: 20, marginBottom: 20 },
  bankCardInner: {
    borderRadius: 20, borderWidth: 1, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  bankHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  bankIconBox: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  bankTitle: { fontSize: 15, fontWeight: '700' },
  bankSub: { fontSize: 12, marginTop: 2 },
  bankDivider: { height: 1, marginBottom: 14 },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  bankField: { minWidth: '45%', flex: 1 },
  bankFieldLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, marginBottom: 3 },
  bankFieldVal: { fontSize: 14, fontWeight: '700' },

  // Menu sections
  section: { marginBottom: 20, marginHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, marginLeft: 4 },
  sectionItems: { gap: 10 },
  sectionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
  },
  menuItemGrid: { flex: 1, minWidth: 280 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  menuSub: { fontSize: 12, marginTop: 2 },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 12, marginBottom: 24 },
});
