import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Bell, Moon, Globe, ShieldCheck, Smartphone,
  ChevronRight, Sun,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import { Toggle } from '../../components/ui';

export default function CSettingsScreen() {
  const { theme, toggle, isDark } = useTheme();
  const navigation = useNavigation<any>();

  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [offerNotifs, setOfferNotifs] = useState(true);
  const [reminderNotifs, setReminderNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [savedLocation, setSavedLocation] = useState(true);

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {children}
        </View>
      </View>
    );
  }

  function ToggleRow({ icon, label, subtitle, value, onChange }: {
    icon: React.ReactNode; label: string; subtitle?: string; value: boolean; onChange: (v: boolean) => void;
  }) {
    return (
      <View style={[styles.row, { borderBottomColor: theme.border }]}>
        <View style={[styles.rowIcon, { backgroundColor: 'rgba(201,161,74,0.1)' }]}>{icon}</View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
          {subtitle && <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
        </View>
        <Toggle value={value} onValueChange={onChange} />
      </View>
    );
  }

  function NavRow({ icon, label, subtitle, onPress }: {
    icon: React.ReactNode; label: string; subtitle?: string; onPress: () => void;
  }) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, { borderBottomColor: theme.border }, pressed && { opacity: 0.7 }]}
      >
        <View style={[styles.rowIcon, { backgroundColor: 'rgba(201,161,74,0.1)' }]}>{icon}</View>
        <View style={styles.rowContent}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
          {subtitle && <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
        </View>
        <ChevronRight size={16} color={theme.textMuted} />
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Appearance */}
        <Section title="APPEARANCE">
          <View style={[styles.row, { borderBottomColor: theme.border }]}>
            <View style={[styles.rowIcon, { backgroundColor: 'rgba(201,161,74,0.1)' }]}>
              {isDark ? <Moon size={18} color="#C9A14A" /> : <Sun size={18} color="#C9A14A" />}
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                {isDark ? 'Dark theme is on' : 'Light theme is on'}
              </Text>
            </View>
            <Toggle value={isDark} onValueChange={toggle} />
          </View>
          <NavRow
            icon={<Globe size={18} color="#C9A14A" />}
            label="Language"
            subtitle="English (India)"
            onPress={() => {}}
          />
        </Section>

        {/* Notifications */}
        <Section title="NOTIFICATIONS">
          <ToggleRow
            icon={<Bell size={18} color="#C9A14A" />}
            label="Booking Alerts"
            subtitle="Confirmations, reminders, updates"
            value={bookingAlerts}
            onChange={setBookingAlerts}
          />
          <ToggleRow
            icon={<Bell size={18} color="#C9A14A" />}
            label="Offers & Deals"
            subtitle="Special discounts and promotions"
            value={offerNotifs}
            onChange={setOfferNotifs}
          />
          <ToggleRow
            icon={<Bell size={18} color="#C9A14A" />}
            label="Reminders"
            subtitle="Check-in, check-out, review reminders"
            value={reminderNotifs}
            onChange={setReminderNotifs}
          />
        </Section>

        {/* Privacy */}
        <Section title="PRIVACY & SECURITY">
          <ToggleRow
            icon={<ShieldCheck size={18} color="#C9A14A" />}
            label="Two-Factor Auth"
            subtitle="Extra security for your account"
            value={twoFactor}
            onChange={setTwoFactor}
          />
          <ToggleRow
            icon={<Smartphone size={18} color="#C9A14A" />}
            label="Biometric Login"
            subtitle="Use Face ID or fingerprint"
            value={biometric}
            onChange={setBiometric}
          />
          <ToggleRow
            icon={<Globe size={18} color="#C9A14A" />}
            label="Save Search Location"
            subtitle="Remember your last search"
            value={savedLocation}
            onChange={setSavedLocation}
          />
        </Section>

        {/* About */}
        <Section title="ABOUT">
          {[
            { label: 'App Version', value: '1.0.0' },
            { label: 'Build', value: '2026.07.17' },
            { label: 'Region', value: 'India (IN)' },
          ].map((item) => (
            <View key={item.label} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.infoValue, { color: theme.textMuted }]}>{item.value}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  scroll: { paddingBottom: 80 },
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    paddingHorizontal: 24, marginBottom: 6,
  },
  sectionCard: {
    marginHorizontal: 20, borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, marginTop: 1 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14 },
});
