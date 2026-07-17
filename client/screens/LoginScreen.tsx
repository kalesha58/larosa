import { LinearGradient } from '../components/LinearGradient';
import { useNavigation } from '@react-navigation/native';
import { Lock, Mail, ShieldX } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../lib/theme-context';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { useAuth } from '../lib/auth-context';

export default function LoginScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { login, isAuthenticating, authError, isAccessDenied, dismissAccessDenied } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (ok) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  };

  // ─── Access Denied overlay ──────────────────────────
  if (isAccessDenied) {
    return (
      <LinearGradient
        colors={[theme.bg, '#1A0E0E']}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: theme.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <ShieldX color={theme.red} size={36} />
          </View>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            Access denied
          </Text>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 15,
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 22,
              maxWidth: 280,
            }}
          >
            This area is for administrators only.
          </Text>
          <View style={{ width: '100%', maxWidth: 340, marginTop: 32, gap: 12 }}>
            <PrimaryButton label="Sign out" onPress={dismissAccessDenied} />
            <SecondaryButton label="Go back" onPress={dismissAccessDenied} />
          </View>
        </View>
      </LinearGradient>
    );
  }

  // ─── Login form ──────────────────────────────────────
  return (
    <LinearGradient colors={[theme.bg, '#15110A']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 1.5,
                borderColor: theme.gold,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18,
              }}
            >
              <Text style={{ color: theme.gold, fontSize: 28, fontWeight: '800' }}>L</Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 36, fontWeight: '800', letterSpacing: 1 }}>
              LaRosa
            </Text>
            <Text
              style={{
                color: theme.gold,
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginTop: 6,
              }}
            >
              Admin
            </Text>
          </View>

          {/* Form card */}
          <View style={{ gap: 18 }}>
            {/* Email */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
                Email
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                }}
              >
                <Mail color={theme.textMuted} size={20} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@larosa.in"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ flex: 1, color: theme.text, fontSize: 16 }}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
                Password
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  paddingHorizontal: 16,
                  height: 54,
                  gap: 12,
                }}
              >
                <Lock color={theme.textMuted} size={20} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry
                  style={{ flex: 1, color: theme.text, fontSize: 16 }}
                />
              </View>
            </View>

            {/* Error */}
            {authError && (
              <Text style={{ color: theme.red, fontSize: 14, fontWeight: '500' }}>
                {authError === 'not_admin'
                  ? 'This account does not have admin access'
                  : 'Invalid email or password'}
              </Text>
            )}

            {/* CTA */}
            <PrimaryButton
              label={isAuthenticating ? 'Signing in…' : 'Sign in'}
              onPress={handleLogin}
              loading={isAuthenticating}
              disabled={!email || !password}
            />

            {/* Demo hint */}
            <Pressable
              onPress={() => {
                setEmail('admin@larosa.in');
                setPassword('demo1234');
              }}
              style={{ alignItems: 'center', marginTop: 4 }}
            >
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                Tap to autofill demo credentials
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
