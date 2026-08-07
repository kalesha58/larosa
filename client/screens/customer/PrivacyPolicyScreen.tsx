import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Mail } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const isAndroid = Platform.OS === 'android';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isAndroid ? theme.gold : theme.bg }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, isAndroid && { backgroundColor: theme.gold }]}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={isAndroid ? '#FFFFFF' : theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Hero Banner */}
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.heroIconBox, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
              <ShieldCheck size={28} color={theme.gold} />
            </View>
            <View style={styles.heroTextContent}>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Your Privacy Matters</Text>
              <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
                LaRosa is committed to protecting your personal information and ensuring complete transparency.
              </Text>
              <View style={[styles.dateBadge, { backgroundColor: theme.goldGlow }]}>
                <Text style={[styles.dateBadgeText, { color: theme.gold }]}>Last Updated: August 2026</Text>
              </View>
            </View>
          </View>

          {/* Section 1 */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Eye size={18} color={theme.gold} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Information We Collect</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              We collect information you provide directly to us when creating an account, reserving a villa or farmhouse, contacting customer support, or completing identity verification.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Account Details: Full name, email address, phone number, and profile picture.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Booking & Payment Info: Stay dates, guest counts, transaction IDs (payments processed via Razorpay).
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Identity Proofs: Government identity scans for host and guest safety verification.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Lock size={18} color={theme.gold} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>2. How We Use Your Data</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              Your information is strictly used to facilitate booking reservations, process secure payments, provide 24/7 caretaker assistance, and prevent fraudulent activity.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Facilitating instant and host-approved stay reservations.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Sending automated SMS/Email booking confirmations and check-in details.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Mediating disputes and handling security deposit refunds.
            </Text>
          </View>

          {/* Section 3 */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <FileText size={18} color={theme.gold} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Data Security & Sharing</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              We enforce 256-bit SSL encryption across all data transmissions. We NEVER sell your personal information to third-party advertisers.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Caretakers receive only your name and phone number for check-in coordination.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Financial transactions are safely handled via PCI-DSS compliant gateways.
            </Text>
          </View>

          {/* Section 4: Contact */}
          <View style={[styles.contactCard, { backgroundColor: 'rgba(201,161,74,0.08)', borderColor: 'rgba(201,161,74,0.25)' }]}>
            <Mail size={20} color={theme.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactTitle, { color: theme.text }]}>Have questions about privacy?</Text>
              <Text style={[styles.contactSub, { color: theme.textSecondary }]}>
                Contact our Privacy Officer at privacy@larosa.in
              </Text>
            </View>
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
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextContent: { flex: 1 },
  heroTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  heroSubtitle: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  dateBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  dateBadgeText: { fontSize: 11, fontWeight: '700' },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  bodyText: { fontSize: 13, lineHeight: 19 },
  bulletPoint: { fontSize: 13, lineHeight: 19, paddingLeft: 4 },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  contactTitle: { fontSize: 14, fontWeight: '700' },
  contactSub: { fontSize: 12, marginTop: 2 },
});
