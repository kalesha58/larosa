import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Crown, Award, Gift, Sparkles, Clock, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';

export default function PrivilegeClubScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const isAndroid = Platform.OS === 'android';

  const memberPoints = 1250;
  const targetPoints = 2500;
  const progressPercent = Math.min(100, Math.round((memberPoints / targetPoints) * 100));

  const PERKS = [
    {
      title: 'Free Late Check-Out',
      subtitle: 'Extend stay up to 2:00 PM (subject to villa availability)',
      icon: <Clock size={20} color={theme.gold} />,
    },
    {
      title: 'Complimentary Welcome Hamper',
      subtitle: 'Artisanal local wine, gourmet snacks & fresh fruit basket on arrival',
      icon: <Gift size={20} color={theme.gold} />,
    },
    {
      title: 'Priority 24/7 Concierge',
      subtitle: 'Dedicated VIP phone line & instant caretaker dispatch',
      icon: <Sparkles size={20} color={theme.gold} />,
    },
    {
      title: '10% Bonus Reward Points',
      subtitle: 'Earn 10% bonus points on all villa & farmhouse bookings',
      icon: <Award size={20} color={theme.gold} />,
    },
  ];

  const POINT_HISTORY = [
    { id: '1', title: 'Aqua Retreat Stay', date: '15 Aug 2026', points: '+750 PTS', type: 'earned' },
    { id: '2', title: 'Monsoon Farmhouse Stay', date: '10 Jun 2026', points: '+500 PTS', type: 'earned' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isAndroid ? theme.gold : theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, isAndroid && { backgroundColor: theme.gold }]}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={isAndroid ? '#FFFFFF' : theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>LaRosa Privilege Club</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Member Pass Card */}
          <View style={[styles.passCard, { backgroundColor: '#0F1E19', borderColor: theme.gold }]}>
            <View style={styles.passCardGlow} />

            <View style={styles.passHeader}>
              <View style={styles.badgeRow}>
                <Crown size={16} color="#C9A14A" fill="#C9A14A" />
                <Text style={styles.badgeTitle}>GOLD MEMBER</Text>
              </View>
              <Text style={styles.passLogo}>LaRosa Privilege</Text>
            </View>

            <View style={styles.passUserRow}>
              <View>
                <Text style={styles.userName}>{user?.name ?? 'Valued Guest'}</Text>
                <Text style={styles.memberId}>Member ID: LR-89201</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsVal}>{memberPoints}</Text>
                <Text style={styles.pointsLabel}>REWARD PTS</Text>
              </View>
            </View>

            {/* Tier Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressText}>Progress to Platinum Tier</Text>
                <Text style={styles.progressVal}>{memberPoints} / {targetPoints} PTS</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${progressPercent}%` }]} />
              </View>
            </View>
          </View>

          {/* Member Perks Section */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Gold Tier Perks</Text>
          <View style={styles.perksList}>
            {PERKS.map((perk, i) => (
              <View key={i} style={[styles.perkCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.perkIconBox, { backgroundColor: theme.goldGlow }]}>
                  {perk.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.perkTitle, { color: theme.text }]}>{perk.title}</Text>
                  <Text style={[styles.perkSubtitle, { color: theme.textMuted }]}>{perk.subtitle}</Text>
                </View>
                <CheckCircle2 size={18} color="#2E7D32" />
              </View>
            ))}
          </View>

          {/* Points History */}
          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 8 }]}>Recent Activity</Text>
          <View style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {POINT_HISTORY.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={[styles.historyTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.historyDate, { color: theme.textMuted }]}>{item.date}</Text>
                </View>
                <Text style={[styles.historyPoints, { color: '#2E7D32' }]}>{item.points}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingBottom: 60, gap: 14, paddingTop: 10 },
  passCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    gap: 16,
    minHeight: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  passCardGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(201,161,74,0.15)',
  },
  passHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201,161,74,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,161,74,0.4)',
  },
  badgeTitle: { fontSize: 11, fontWeight: '800', color: '#C9A14A', letterSpacing: 0.5 },
  passLogo: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '700' },
  passUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  userName: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  memberId: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  pointsBadge: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pointsVal: { fontSize: 20, fontWeight: '900', color: '#C9A14A' },
  pointsLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  progressContainer: { zIndex: 2, gap: 6 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  progressVal: { fontSize: 11, color: '#C9A14A', fontWeight: '700' },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#C9A14A', borderRadius: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  perksList: { gap: 10 },
  perkCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  perkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTitle: { fontSize: 14, fontWeight: '800' },
  perkSubtitle: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  historyCard: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 12 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyLeft: { gap: 2 },
  historyTitle: { fontSize: 14, fontWeight: '700' },
  historyDate: { fontSize: 11 },
  historyPoints: { fontSize: 14, fontWeight: '800' },
});
