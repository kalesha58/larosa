import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ShieldCheck, Lock, Database, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

export default function DataSafetyScreen() {
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
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>Data Safety & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Top Hero Banner */}
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.heroIconBox, { backgroundColor: 'rgba(46,125,50,0.12)' }]}>
              <ShieldCheck size={28} color="#2E7D32" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Google Play Data Safety</Text>
              <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
                Here is a transparent breakdown of how your data is collected, encrypted, and protected on LaRosa.
              </Text>
            </View>
          </View>

          {/* Feature 1: Data Encryption */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Lock size={18} color={theme.gold} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Data Transmitted in Transit</Text>
            </View>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              All data sent between the LaRosa mobile application and our dev/backend servers is encrypted using 256-bit SSL/TLS protocol.
            </Text>
            <View style={[styles.pill, { backgroundColor: 'rgba(46,125,50,0.08)' }]}>
              <CheckCircle2 size={14} color="#2E7D32" />
              <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '700' }}>Encrypted in Transit</Text>
            </View>
          </View>

          {/* Feature 2: Data Collected & Shared */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Database size={18} color={theme.gold} />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Data Types Collected</Text>
            </View>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              • Personal Info: Name, Email address, Phone number (for user account management).{'\n'}
              • Financial Info: Purchase/Booking transaction history (handled securely via Razorpay).{'\n'}
              • App Info & Performance: Crash logs and diagnostics for app stability.
            </Text>
          </View>

          {/* Feature 3: Data Deletion Policy */}
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Trash2 size={18} color="#E53935" />
              <Text style={[styles.cardTitle, { color: theme.text }]}>Data Deletion Guarantee</Text>
            </View>
            <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
              You have the right to request deletion of your account and all associated personal data at any time directly within the Profile screen under Account settings.
            </Text>
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
    alignItems: 'center',
    gap: 14,
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 18, fontWeight: '800' },
  heroSubtitle: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: '800' },
  cardDesc: { fontSize: 13, lineHeight: 19 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 4,
  },
});
