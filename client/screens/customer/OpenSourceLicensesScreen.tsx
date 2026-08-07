import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Code, ExternalLink, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface LicenseItem {
  name: string;
  version: string;
  license: string;
  description: string;
  repository: string;
}

const LICENSES: LicenseItem[] = [
  {
    name: 'React Native',
    version: '0.85.0',
    license: 'MIT License',
    description: 'A framework for building native applications using React.',
    repository: 'https://github.com/facebook/react-native',
  },
  {
    name: 'React',
    version: '19.2.3',
    license: 'MIT License',
    description: 'A JavaScript library for building user interfaces.',
    repository: 'https://github.com/facebook/react',
  },
  {
    name: '@react-navigation/native',
    version: '7.3.11',
    license: 'MIT License',
    description: 'Routing and navigation for React Native apps.',
    repository: 'https://github.com/react-navigation/react-navigation',
  },
  {
    name: 'lucide-react-native',
    version: '1.25.0',
    license: 'ISC License',
    description: 'Beautiful & consistent icon toolkit for React Native.',
    repository: 'https://github.com/lucide-icons/lucide',
  },
  {
    name: 'react-native-safe-area-context',
    version: '5.5.2',
    license: 'MIT License',
    description: 'A flexible way to handle safe area insets in React Native.',
    repository: 'https://github.com/th3rdwave/react-native-safe-area-context',
  },
  {
    name: 'react-native-gesture-handler',
    version: '2.28.0',
    license: 'MIT License',
    description: 'Declarative API for gestures in React Native.',
    repository: 'https://github.com/software-mansion/react-native-gesture-handler',
  },
  {
    name: 'TypeScript',
    version: '5.8.3',
    license: 'Apache License 2.0',
    description: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
    repository: 'https://github.com/microsoft/TypeScript',
  },
];

export default function OpenSourceLicensesScreen() {
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
        <Text style={[styles.headerTitle, { color: isAndroid ? '#FFFFFF' : theme.text }]}>Open Source Licenses</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Top Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(201,161,74,0.15)' }]}>
              <Code size={24} color={theme.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoTitle, { color: theme.text }]}>Third-Party Software</Text>
              <Text style={[styles.infoSubtitle, { color: theme.textSecondary }]}>
                LaRosa is built using open-source software libraries. We are grateful to the open-source community for their contributions.
              </Text>
            </View>
          </View>

          {/* Licenses List */}
          <View style={styles.licenseList}>
            {LICENSES.map((item) => (
              <View key={item.name} style={[styles.licenseCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pkgName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.pkgVersion, { color: theme.textMuted }]}>v{item.version}</Text>
                  </View>
                  <View style={[styles.licenseBadge, { backgroundColor: theme.goldGlow }]}>
                    <Text style={[styles.licenseBadgeText, { color: theme.gold }]}>{item.license}</Text>
                  </View>
                </View>
                <Text style={[styles.pkgDesc, { color: theme.textSecondary }]}>{item.description}</Text>
              </View>
            ))}
          </View>

          {/* Compliance Disclaimer */}
          <View style={[styles.disclaimerCard, { backgroundColor: 'rgba(46,125,50,0.08)', borderColor: 'rgba(46,125,50,0.2)' }]}>
            <ShieldCheck size={18} color="#2E7D32" />
            <Text style={[styles.disclaimerText, { color: theme.textSecondary }]}>
              All open-source components adhere to Google Play Developer Distribution Policy & licensing regulations.
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
  infoBanner: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: { fontSize: 16, fontWeight: '800' },
  infoSubtitle: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  licenseList: { gap: 10 },
  licenseCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pkgName: { fontSize: 15, fontWeight: '800' },
  pkgVersion: { fontSize: 12, marginTop: 1 },
  licenseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  licenseBadgeText: { fontSize: 11, fontWeight: '700' },
  pkgDesc: { fontSize: 13, lineHeight: 18 },
  disclaimerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  disclaimerText: { fontSize: 12, flex: 1, lineHeight: 17 },
});
