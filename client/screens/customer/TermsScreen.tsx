import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, FileText, CheckCircle, Scale, ShieldAlert, Mail } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

export default function TermsScreen() {
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
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Hero Banner */}
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.heroIconBox, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
              <FileText size={28} color={theme.gold} />
            </View>
            <View style={styles.heroTextContent}>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Terms & Conditions</Text>
              <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
                Please read these terms carefully before booking farmhouses and luxury villas on LaRosa.
              </Text>
              <View style={[styles.dateBadge, { backgroundColor: theme.goldGlow }]}>
                <Text style={[styles.dateBadgeText, { color: theme.gold }]}>Effective: August 2026</Text>
              </View>
            </View>
          </View>

          {/* Section 1 */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <CheckCircle size={18} color={theme.gold} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Booking & Reservation Agreements</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              By making a booking on LaRosa, you agree to adhere to the property house rules, check-in/out times, and guest capacity limits set by the host.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Instant Bookings: Confirmed immediately upon successful payment.
            </Text>
            <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
              • Request Bookings: Pending host approval for up to 24 hours.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Scale size={18} color={theme.gold} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Fees & Security Deposits</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              A 10% platform service fee applies to all bookings. Refundable security deposits protect property owners against accidental damages and are refunded within 48 hours post check-out.
            </Text>
          </View>

          {/* Section 3 */}
          <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeaderRow}>
              <ShieldAlert size={18} color={theme.gold} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>3. Cancellation & Refunds</Text>
            </View>
            <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
              Free cancellation is available up to 7 days prior to check-in. Cancellations made within 3-7 days receive a 50% refund. Cancellations made under 72 hours are non-refundable.
            </Text>
          </View>

          {/* Section 4 */}
          <View style={[styles.contactCard, { backgroundColor: 'rgba(201,161,74,0.08)', borderColor: 'rgba(201,161,74,0.25)' }]}>
            <Mail size={20} color={theme.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.contactTitle, { color: theme.text }]}>Questions regarding terms?</Text>
              <Text style={[styles.contactSub, { color: theme.textSecondary }]}>
                Reach out to legal@larosa.in
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
