import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Platform, Image, useWindowDimensions,
  Modal, TextInput, TouchableOpacity, KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  User, Edit3, ShieldCheck, Heart, Calendar, Bell, HelpCircle,
  Lock, FileText, LogOut, ChevronRight, CheckCircle, AlertCircle,
  Star, Phone, Mail, Award, ArrowRight, Trash2, Code, ShieldAlert, ThumbsUp, Crown,
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
  isLast?: boolean;
}

function MenuItem({ icon, label, subtitle, onPress, badge, danger, isGrid, isLast }: MenuItemProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        isGrid && styles.menuItemGrid,
        !isLast && !isGrid && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
        pressed && { backgroundColor: 'rgba(201,161,74,0.06)' },
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: danger ? 'rgba(229,57,53,0.1)' : 'rgba(201,161,74,0.12)' }]}>
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
  const childrenArray = React.Children.toArray(children);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
      <View style={[
        styles.sectionCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
        isWebGrid && styles.gridRow
      ]}>
        {childrenArray.map((child, index) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as any, {
            isLast: index === childrenArray.length - 1,
            isGrid: isWebGrid,
          });
        })}
      </View>
    </View>
  );
}

export default function CProfileScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const { logout, user, updateUser } = useAuth();
  const profile = customerProfile;
  const isWeb = Platform.OS === 'web';
  const isWebGrid = isWeb && width >= 640;

  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const [name, setName] = useState(user?.name ?? profile.name);
  const [email, setEmail] = useState(user?.email ?? profile.email);
  const [phone, setPhone] = useState(user?.phone ?? profile.phone);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user?.avatarUrl ?? '');

  const handleDeleteAccount = () => {
    setIsDeleteModalVisible(false);
    logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };


  const verificationStatus = [
    { label: 'Email', verified: profile.isEmailVerified },
    { label: 'Phone', verified: profile.isPhoneVerified },
    { label: 'Identity', verified: profile.isIdentityVerified },
  ];
  const verifiedCount = verificationStatus.filter((v) => v.verified).length;

  const handleSaveProfile = () => {
    updateUser({
      name,
      email,
      phone,
      avatarUrl: selectedAvatarUrl,
    });
    setIsEditProfileVisible(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg }]} edges={['top']}>
      {isWeb && <WebHeader />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.bg }}
        contentContainerStyle={[styles.scroll, isWeb && styles.webScroll]}
      >

        {/* ══ HERO PROFILE HEADER CARD ═══════════════════════════════════════ */}
        <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Background villa image with luxury gradient */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.heroBgImage}
            resizeMode="cover"
          />
          <View style={[styles.heroGradient, { backgroundColor: isDark ? 'rgba(14,24,20,0.88)' : 'rgba(18,28,24,0.84)' }]} />

          {/* User Profile Details */}
          <View style={styles.heroTopContent}>
            <View style={styles.avatarSection}>
              <View style={[styles.avatar, { backgroundColor: '#142920', borderColor: '#C9A14A' }]}>
                {user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.avatarText, { color: '#C9A14A' }]}>
                    {(user?.name ?? 'A').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() => setIsEditProfileVisible(true)}
                style={({ pressed }) => [styles.editAvatarBtn, { backgroundColor: '#C9A14A' }, pressed && { opacity: 0.8 }]}
              >
                <Edit3 size={11} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.heroDetails}>
              <View style={styles.roleBadge}>
                <Star size={11} color="#C9A14A" fill="#C9A14A" />
                <Text style={styles.roleBadgeText}>
                  {user?.role === 'host' ? 'Host' : 'Guest Member'}
                </Text>
              </View>

              <Text style={styles.heroName} numberOfLines={1}>{user?.name ?? profile.name}</Text>

              <View style={styles.heroMetaRow}>
                <View style={styles.heroMetaItem}>
                  <Mail size={12} color="#C9A14A" />
                  <Text style={styles.heroMetaText} numberOfLines={1}>{user?.email ?? profile.email}</Text>
                </View>
                <View style={styles.heroMetaItem}>
                  <Phone size={12} color="#C9A14A" />
                  <Text style={styles.heroMetaText}>{profile.phone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Hero Card Footer Stats Bar */}
          <View style={styles.heroStatsContainer}>
            <View style={styles.heroStatCard}>
              <View style={styles.heroStatIconBox}>
                <Calendar size={16} color="#C9A14A" />
              </View>
              <View>
                <Text style={styles.heroStatVal}>{profile.totalBookings}</Text>
                <Text style={styles.heroStatLabel}>Stays</Text>
              </View>
            </View>

            <View style={styles.heroStatCard}>
              <View style={styles.heroStatIconBox}>
                <Heart size={16} color="#C9A14A" />
              </View>
              <View>
                <Text style={styles.heroStatVal}>2</Text>
                <Text style={styles.heroStatLabel}>Favorites</Text>
              </View>
            </View>

            <View style={styles.heroStatCard}>
              <View style={styles.heroStatIconBox}>
                <ShieldCheck size={16} color="#C9A14A" />
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
              { backgroundColor: 'rgba(201,161,74,0.12)', borderColor: 'rgba(201,161,74,0.3)' },
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={[styles.verifyIconBox, { backgroundColor: 'rgba(201,161,74,0.2)' }]}>
              <ShieldCheck size={20} color="#C9A14A" />
            </View>
            <View style={styles.verifyBannerText}>
              <Text style={[styles.verifyTitle, { color: theme.text }]}>Complete Identity Verification</Text>
              <Text style={[styles.verifySubtitle, { color: theme.textMuted }]}>
                Upload ID to unlock all booking features
              </Text>
            </View>
            <View style={[styles.verifyActionBtn, { backgroundColor: theme.gold }]}>
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
            onPress={() => setIsEditProfileVisible(true)}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<Crown size={18} color={theme.gold} />}
            label="LaRosa Privilege Club"
            subtitle="Gold Member · 1,250 PTS"
            onPress={() => navigation.navigate('PrivilegeClub')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<ShieldCheck size={18} color={theme.gold} />}
            label="Identity Verification"
            subtitle={`${verifiedCount} of 3 complete`}
            onPress={() => navigation.navigate('Verification')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<Trash2 size={18} color="#E53935" />}
            label="Delete Account & Data"
            subtitle="Permanently erase account & data"
            onPress={() => {
              setDeleteConfirmText('');
              setIsDeleteModalVisible(true);
            }}
            danger
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
          <MenuItem
            isGrid={isWebGrid}
            icon={<ThumbsUp size={18} color={theme.gold} />}
            label="Rate LaRosa App"
            subtitle="Share your feedback on Google Play"
            onPress={() => {
              setRatingSubmitted(false);
              setIsRateModalVisible(true);
            }}
          />
        </MenuSection>

        {/* ══ SUPPORT & LEGAL SECTION ══════════════════════════════════════════ */}
        <MenuSection title="SUPPORT & LEGAL" isWebGrid={isWebGrid}>
          <MenuItem
            isGrid={isWebGrid}
            icon={<HelpCircle size={18} color={theme.gold} />}
            label="Help & Support"
            subtitle="FAQs, contact us"
            onPress={() => navigation.navigate('Support')}
          />
          <MenuItem
            isGrid={isWebGrid}
            icon={<ShieldAlert size={18} color={theme.gold} />}
            label="Data Safety & Disclosures"
            subtitle="Google Play data security details"
            onPress={() => navigation.navigate('DataSafety')}
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
          <MenuItem
            isGrid={isWebGrid}
            icon={<Code size={18} color={theme.gold} />}
            label="Open Source Licenses"
            subtitle="Third-party software attributions"
            onPress={() => navigation.navigate('OpenSourceLicenses')}
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
          LaRosa v1.0.0 (Build 100) · Google Play Verified
        </Text>
      </ScrollView>

      {/* ══ DELETE ACCOUNT MODAL (Google Play Policy Mandate) ════════════════ */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.modalIconBox, { backgroundColor: 'rgba(229,57,53,0.1)' }]}>
              <Trash2 size={24} color="#E53935" />
            </View>
            <Text style={[styles.deleteModalTitle, { color: theme.text }]}>Delete Your Account?</Text>
            <Text style={[styles.deleteModalBody, { color: theme.textSecondary }]}>
              Warning: Account deletion is permanent and cannot be undone. In accordance with Google Play Developer policies, all your profile data, saved properties, and account records will be permanently erased.
            </Text>

            <Text style={[styles.deleteInputLabel, { color: theme.textMuted }]}>
              Type <Text style={{ fontWeight: '800', color: '#E53935' }}>DELETE</Text> to confirm:
            </Text>
            <TextInput
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder="DELETE"
              placeholderTextColor={theme.textMuted}
              style={[styles.deleteInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
              autoCapitalize="characters"
            />

            <View style={styles.deleteModalActions}>
              <Pressable
                onPress={() => setIsDeleteModalVisible(false)}
                style={[styles.modalBtn, { borderColor: theme.border }]}
              >
                <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                style={[
                  styles.modalBtn,
                  { backgroundColor: deleteConfirmText === 'DELETE' ? '#E53935' : 'rgba(229,57,53,0.4)' }
                ]}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Delete Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ══ RATE APP MODAL ═════════════════════════════════════════════════ */}
      <Modal
        visible={isRateModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsRateModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.modalIconBox, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
              <ThumbsUp size={24} color={theme.gold} />
            </View>
            <Text style={[styles.deleteModalTitle, { color: theme.text }]}>Rate LaRosa on Google Play</Text>
            <Text style={[styles.deleteModalBody, { color: theme.textSecondary }]}>
              Enjoying your luxury stays? Tap a star to rate your experience:
            </Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setSelectedRating(star)}>
                  <Star
                    size={32}
                    color={theme.gold}
                    fill={star <= selectedRating ? theme.gold : 'none'}
                  />
                </Pressable>
              ))}
            </View>

            {ratingSubmitted ? (
              <View style={[styles.ratingSubmittedBox, { backgroundColor: 'rgba(46,125,50,0.1)' }]}>
                <CheckCircle size={16} color="#2E7D32" />
                <Text style={{ fontSize: 13, color: '#2E7D32', fontWeight: '700' }}>Thank you for your 5-star review!</Text>
              </View>
            ) : (
              <View style={styles.deleteModalActions}>
                <Pressable
                  onPress={() => setIsRateModalVisible(false)}
                  style={[styles.modalBtn, { borderColor: theme.border }]}
                >
                  <Text style={[styles.modalBtnText, { color: theme.text }]}>Later</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setRatingSubmitted(true);
                    setTimeout(() => setIsRateModalVisible(false), 1500);
                  }}
                  style={[styles.modalBtn, { backgroundColor: theme.gold }]}
                >
                  <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Submit Rating</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isEditProfileVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {/* Modal Header */}
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
                <Pressable onPress={() => setIsEditProfileVisible(false)}>
                  <Text style={[styles.modalCancelLink, { color: theme.gold }]}>Cancel</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                {/* Profile Picture Option */}
                <Text style={[styles.modalSectionLabel, { color: theme.textSecondary }]}>PROFILE PICTURE</Text>
                <View style={styles.avatarSelectionContainer}>
                  <View style={[styles.modalAvatarPreview, { borderColor: theme.gold }]}>
                    {selectedAvatarUrl ? (
                      <Image source={{ uri: selectedAvatarUrl }} style={styles.modalAvatarImage} />
                    ) : (
                      <Text style={styles.modalAvatarInitials}>
                        {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.avatarTipText, { color: theme.textMuted }]}>
                    Select a preset picture or enter a custom URL
                  </Text>
                </View>

                {/* Preset Avatars Row */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetAvatarsRow}>
                  {[
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
                  ].map((url) => {
                    const isSelected = selectedAvatarUrl === url;
                    return (
                      <Pressable
                        key={url}
                        onPress={() => setSelectedAvatarUrl(url)}
                        style={[
                          styles.presetAvatarBtn,
                          isSelected && { borderColor: theme.gold, borderWidth: 3 }
                        ]}
                      >
                        <Image source={{ uri: url }} style={styles.presetAvatarImage} />
                      </Pressable>
                    );
                  })}
                  <Pressable
                    onPress={() => setSelectedAvatarUrl('')}
                    style={[
                      styles.presetAvatarBtn,
                      styles.presetAvatarClearBtn,
                      selectedAvatarUrl === '' && { borderColor: theme.gold, borderWidth: 3 }
                    ]}
                  >
                    <Text style={[styles.clearAvatarText, { color: theme.textSecondary }]}>Reset</Text>
                  </Pressable>
                </ScrollView>

                {/* Custom URL Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Custom Image URL</Text>
                  <TextInput
                    value={selectedAvatarUrl}
                    onChangeText={setSelectedAvatarUrl}
                    placeholder="https://example.com/avatar.jpg"
                    placeholderTextColor={theme.textMuted}
                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  />
                </View>

                {/* Form Fields */}
                <Text style={[styles.modalSectionLabel, { color: theme.textSecondary, marginTop: 24 }]}>PERSONAL INFO</Text>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Arjun Mehta"
                    placeholderTextColor={theme.textMuted}
                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="arjun@example.com"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+91 98765 12345"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="phone-pad"
                    style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={[styles.saveBtn, { backgroundColor: theme.gold }]}
                >
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(201,161,74,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(201,161,74,0.4)',
    marginBottom: 2,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C9A14A',
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
    color: 'rgba(255,255,255,0.85)',
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroStatIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(201,161,74,0.22)',
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
  verifyTitle: { fontSize: 14, fontWeight: '800' },
  verifySubtitle: { fontSize: 12, marginTop: 2 },
  verifyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemGrid: {
    flex: 1,
    minWidth: 280,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalCancelLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalScroll: {
    padding: 20,
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  avatarSelectionContainer: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  modalAvatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(201,161,74,0.1)',
  },
  modalAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  modalAvatarInitials: {
    fontSize: 28,
    fontWeight: '900',
    color: '#C9A14A',
  },
  avatarTipText: {
    fontSize: 12,
  },
  presetAvatarsRow: {
    gap: 12,
    paddingBottom: 16,
  },
  presetAvatarBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  presetAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  presetAvatarClearBtn: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  clearAvatarText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  saveBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalCard: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  deleteModalTitle: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteModalBody: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  deleteInputLabel: {
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  deleteInput: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 18,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 18,
  },
  ratingSubmittedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
});
