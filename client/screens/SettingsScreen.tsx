import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Building2, CreditCard, Lock, Bell, Radio, Sun, Moon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import type { ThemeTokens } from '../constants/colors';
import { Card, FieldLabel, PrimaryButton, Toggle } from '../components/ui';
import { settings as seedSettings } from '../lib/mockData';
import type { AppSettings } from '../types';

type Tab = 'appearance' | 'property' | 'billing' | 'security' | 'notifications' | 'channel';

const tabList = [
  { id: 'appearance' as Tab, label: 'Appearance', Icon: Sun },
  { id: 'property' as Tab, label: 'Property', Icon: Building2 },
  { id: 'billing' as Tab, label: 'Billing', Icon: CreditCard },
  { id: 'security' as Tab, label: 'Security', Icon: Lock },
  { id: 'notifications' as Tab, label: 'Alerts', Icon: Bell },
  { id: 'channel' as Tab, label: 'Channels', Icon: Radio },
];

export default function SettingsScreen() {
  const { theme, toggle, isDark } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<Tab>('appearance');
  const [s, setS] = useState<AppSettings>(seedSettings);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    backgroundColor: theme.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.text,
    fontSize: 15,
    height: 50,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Settings</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 40, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {tabList.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              style={({ pressed }) => [
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isActive ? theme.gold : theme.border,
                  backgroundColor: isActive ? theme.gold + '22' : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <t.Icon color={isActive ? theme.gold : theme.textSecondary} size={16} />
              <Text style={{ color: isActive ? theme.gold : theme.textSecondary, fontSize: 13, fontWeight: '600' }}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Appearance */}
        {activeTab === 'appearance' && (
          <Card style={{ gap: 20 }}>
            <View>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', marginBottom: 4 }}>Theme</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
                Switch between dark and light appearance. Your choice is saved automatically.
              </Text>
            </View>

            {/* Theme selector */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => { if (isDark) toggle(); }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: !isDark ? theme.gold : theme.border,
                    backgroundColor: !isDark ? theme.gold + '15' : theme.surfaceElevated,
                    padding: 18,
                    alignItems: 'center',
                    gap: 10,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#FAF6F0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#E2D9C8',
                  }}
                >
                  <Sun color="#A88840" size={24} />
                </View>
                <Text style={{ color: !isDark ? theme.gold : theme.text, fontSize: 14, fontWeight: '700' }}>Light</Text>
                {!isDark && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.gold }} />
                    <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '600' }}>Active</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => { if (!isDark) toggle(); }}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: isDark ? theme.gold : theme.border,
                    backgroundColor: isDark ? theme.gold + '15' : theme.surfaceElevated,
                    padding: 18,
                    alignItems: 'center',
                    gap: 10,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#0E0B07',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#2A2118',
                  }}
                >
                  <Moon color="#C9A961" size={24} />
                </View>
                <Text style={{ color: isDark ? theme.gold : theme.text, fontSize: 14, fontWeight: '700' }}>Dark</Text>
                {isDark && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.gold }} />
                    <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '600' }}>Active</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Quick toggle */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 16,
                borderTopColor: theme.borderSoft,
                borderTopWidth: 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {isDark ? <Moon color={theme.gold} size={18} /> : <Sun color={theme.gold} size={18} />}
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>
                    {isDark ? 'Dark mode' : 'Light mode'}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    Tap to switch to {isDark ? 'light' : 'dark'}
                  </Text>
                </View>
              </View>
              <Toggle value={isDark} onValueChange={toggle} />
            </View>
          </Card>
        )}

        {/* Property */}
        {activeTab === 'property' && (
          <Card style={{ gap: 16 }}>
            <View>
              <FieldLabel>Property name</FieldLabel>
              <TextInput value={s.property.propertyName} onChangeText={(v) => setS({ ...s, property: { ...s.property, propertyName: v } })} style={inputStyle} />
            </View>
            <View>
              <FieldLabel>Address</FieldLabel>
              <TextInput value={s.property.address} onChangeText={(v) => setS({ ...s, property: { ...s.property, address: v } })} style={inputStyle} />
            </View>
            <View>
              <FieldLabel>Timezone</FieldLabel>
              <TextInput value={s.property.timezone} onChangeText={(v) => setS({ ...s, property: { ...s.property, timezone: v } })} style={inputStyle} />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Check-in time</FieldLabel>
                <TextInput value={s.property.checkInTime} onChangeText={(v) => setS({ ...s, property: { ...s.property, checkInTime: v } })} style={inputStyle} />
              </View>
              <View style={{ flex: 1 }}>
                <FieldLabel>Check-out time</FieldLabel>
                <TextInput value={s.property.checkOutTime} onChangeText={(v) => setS({ ...s, property: { ...s.property, checkOutTime: v } })} style={inputStyle} />
              </View>
            </View>
            <View>
              <FieldLabel>Support email</FieldLabel>
              <TextInput value={s.property.supportEmail} onChangeText={(v) => setS({ ...s, property: { ...s.property, supportEmail: v } })} style={inputStyle} />
            </View>
            <View>
              <FieldLabel>Support phone</FieldLabel>
              <TextInput value={s.property.supportPhone} onChangeText={(v) => setS({ ...s, property: { ...s.property, supportPhone: v } })} style={inputStyle} />
            </View>
          </Card>
        )}

        {/* Billing */}
        {activeTab === 'billing' && (
          <Card style={{ gap: 16 }}>
            <View>
              <FieldLabel>Currency</FieldLabel>
              <TextInput value={s.billing.currency} onChangeText={(v) => setS({ ...s, billing: { ...s.billing, currency: v } })} style={inputStyle} />
            </View>
            <View>
              <FieldLabel>Razorpay Key ID</FieldLabel>
              <TextInput value={s.billing.razorpayKeyId} onChangeText={(v) => setS({ ...s, billing: { ...s.billing, razorpayKeyId: v } })} style={inputStyle} />
            </View>
            <View>
              <FieldLabel>Webhook URL</FieldLabel>
              <TextInput value={s.billing.webhookUrl} onChangeText={(v) => setS({ ...s, billing: { ...s.billing, webhookUrl: v } })} style={inputStyle} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTopColor: theme.borderSoft, borderTopWidth: 1 }}>
              <View>
                <Text style={{ color: theme.text, fontSize: 15 }}>Webhook secret set</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Razorpay webhook signature</Text>
              </View>
              <Toggle
                value={s.billing.webhookSecretSet}
                onValueChange={(v) => setS({ ...s, billing: { ...s.billing, webhookSecretSet: v } })}
              />
            </View>
          </Card>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <Card style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15 }}>Require admin 2FA</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Enforce two-factor for admins</Text>
              </View>
              <Toggle
                value={s.security.requireAdmin2fa}
                onValueChange={(v) => setS({ ...s, security: { ...s.security, requireAdmin2fa: v } })}
              />
            </View>
            <View style={{ paddingTop: 8, borderTopColor: theme.borderSoft, borderTopWidth: 1 }}>
              <FieldLabel>Session timeout (minutes)</FieldLabel>
              <TextInput
                value={String(s.security.sessionTimeoutMinutes)}
                onChangeText={(v) => setS({ ...s, security: { ...s.security, sessionTimeoutMinutes: Number(v) || 0 } })}
                keyboardType="numeric"
                style={inputStyle}
              />
            </View>
          </Card>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <Card style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.text, fontSize: 15 }}>MSG91 auth key set</Text>
              <Toggle
                value={s.notifications.msg91AuthKeySet}
                onValueChange={(v) => setS({ ...s, notifications: { ...s.notifications, msg91AuthKeySet: v } })}
              />
            </View>
            <View>
              <FieldLabel>MSG91 Flow ID</FieldLabel>
              <TextInput value={s.notifications.msg91FlowId} onChangeText={(v) => setS({ ...s, notifications: { ...s.notifications, msg91FlowId: v } })} style={inputStyle} />
            </View>
            <View>
              <FieldLabel>Admin alert phones (comma-separated)</FieldLabel>
              <TextInput
                value={s.notifications.adminAlertPhones.join(', ')}
                onChangeText={(v) => setS({ ...s, notifications: { ...s.notifications, adminAlertPhones: v.split(',').map((x) => x.trim()) } })}
                style={inputStyle}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTopColor: theme.borderSoft, borderTopWidth: 1 }}>
              <Text style={{ color: theme.text, fontSize: 15 }}>Email alerts</Text>
              <Toggle
                value={s.notifications.emailAlertsEnabled}
                onValueChange={(v) => setS({ ...s, notifications: { ...s.notifications, emailAlertsEnabled: v } })}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.text, fontSize: 15 }}>SMS alerts</Text>
              <Toggle
                value={s.notifications.smsAlertsEnabled}
                onValueChange={(v) => setS({ ...s, notifications: { ...s.notifications, smsAlertsEnabled: v } })}
              />
            </View>
          </Card>
        )}

        {/* Channel */}
        {activeTab === 'channel' && (
          <Card style={{ gap: 16, alignItems: 'center', paddingVertical: 30 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.gold + '22',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              <Radio color={theme.gold} size={26} />
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>Channel Manager</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20, maxWidth: 280 }}>
              {s.channel.statusMessage}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Toggle
                value={s.channel.syncEnabled}
                onValueChange={(v) => setS({ ...s, channel: { ...s.channel, syncEnabled: v } })}
              />
              <Text style={{ color: theme.text, fontSize: 15 }}>Enable sync</Text>
            </View>
          </Card>
        )}

        <View style={{ marginTop: 24 }}>
          <PrimaryButton
            label={saved ? 'Saved!' : 'Save settings'}
            onPress={handleSave}
            disabled={saved}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
