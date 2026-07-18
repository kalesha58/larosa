import { LinearGradient } from '../components/LinearGradient';
import { Lock, Mail, Phone, Shield, Smartphone, ShieldX, User as UserIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useTheme } from '../lib/theme-context';
import { darkTheme } from '../constants/colors';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../lib/auth-context';

type LoginRole = 'admin' | 'customer' | 'host';
type CustomerLoginMethod = 'phone' | 'email';
type OtpStep = 'input' | 'otp';

export default function LoginScreen() {
  const theme = darkTheme;
  const navigation = useNavigation<any>();
  const { login, loginAsCustomer, signupHost, isAuthenticating, authError, isAccessDenied, dismissAccessDenied } = useAuth();

  const [role, setRole] = useState<LoginRole>('customer');
  const [customerMethod, setCustomerMethod] = useState<CustomerLoginMethod>('phone');
  const [otpStep, setOtpStep] = useState<OtpStep>('input');

  // Admin fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Host fields
  const [hostAction, setHostAction] = useState<'login' | 'signup'>('login');
  const [hostName, setHostName] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPassword, setHostPassword] = useState('');

  // Customer fields
  const [phone, setPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [otp, setOtp] = useState('');

  const handleAdminLogin = async () => {
    const ok = await login(email, password);
    if (ok) {
      navigation.replace('MainTabs');
    }
  };

  const handleHostLogin = async () => {
    const ok = await login(hostEmail, hostPassword);
    if (ok) {
      if (hostEmail.toLowerCase().trim() === 'host@larosa.in') {
        navigation.replace('HostTabs');
      } else {
        navigation.replace('HostVerification');
      }
    }
  };

  const handleHostSignup = async () => {
    const ok = await signupHost(hostName, hostEmail, hostPhone, hostPassword);
    if (ok) {
      navigation.replace('HostVerification');
    }
  };

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      setOtpStep('otp');
    }
  };

  const handleVerifyOtp = async () => {
    const ok = await loginAsCustomer(phone, otp);
    if (ok) {
      navigation.replace('CustomerTabs');
    }
  };

  const handleCustomerEmailLogin = async () => {
    const ok = await login(customerEmail, customerPassword);
    if (ok) {
      navigation.replace('CustomerTabs');
    }
  };

  // ─── Access Denied overlay ──────────────────────────
  if (isAccessDenied) {
    return (
      <LinearGradient colors={[theme.bg, '#1A0E0E']} style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.redSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <ShieldX color={theme.red} size={36} />
          </View>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>Access denied</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 15, textAlign: 'center', marginTop: 10, lineHeight: 22, maxWidth: 280 }}>
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

  return (
    <ImageBackground
      source={require('../assets/images/starry-night-lake.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15, 17, 26, 0.82)' }]} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderColor: theme.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Text style={{ color: theme.gold, fontSize: 28, fontWeight: '800' }}>L</Text>
            </View>
            <Text style={{ color: theme.text, fontSize: 36, fontWeight: '800', letterSpacing: 1 }}>LaRosa</Text>
            <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase', marginTop: 5 }}>
              Premium Farmhouse Stays
            </Text>
          </View>

          {/* ── Role switcher ── */}
          <View style={[styles.roleSwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => setRole('customer')}
              style={[styles.roleTab, role === 'customer' && { backgroundColor: '#C9A14A' }]}
            >
              <Text style={[styles.roleTabText, { color: role === 'customer' ? '#111111' : theme.textSecondary }]}>
                🏡 Guest
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRole('host')}
              style={[styles.roleTab, role === 'host' && { backgroundColor: '#C9A14A' }]}
            >
              <Text style={[styles.roleTabText, { color: role === 'host' ? '#111111' : theme.textSecondary }]}>
                🧑‍🌾 Host
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRole('admin')}
              style={[styles.roleTab, role === 'admin' && { backgroundColor: '#C9A14A' }]}
            >
              <Text style={[styles.roleTabText, { color: role === 'admin' ? '#111111' : theme.textSecondary }]}>
                🔐 Admin
              </Text>
            </Pressable>
          </View>

          {/* ── ADMIN LOGIN ── */}
          {role === 'admin' && (
            <View style={{ gap: 16, marginTop: 8 }}>
              <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Admin Sign In</Text>

              {/* Email */}
              <View>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email</Text>
                <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Mail color={theme.textMuted} size={20} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="admin@larosa.in"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.input, { color: theme.text }]}
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password</Text>
                <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Lock color={theme.textMuted} size={20} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry
                    style={[styles.input, { color: theme.text }]}
                  />
                </View>
              </View>

              {authError && (
                <Text style={{ color: theme.red, fontSize: 13 }}>
                  {authError === 'invalid' ? '❌ Invalid email or password' : authError}
                </Text>
              )}

              <PrimaryButton
                label={isAuthenticating ? 'Signing in…' : 'Sign In as Admin'}
                onPress={handleAdminLogin}
                loading={isAuthenticating}
                disabled={!email || !password}
              />

              <Pressable
                onPress={() => { setEmail('admin@larosa.in'); setPassword('demo1234'); }}
                style={{ alignItems: 'center', marginTop: 2 }}
              >
                <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap to autofill demo credentials</Text>
              </Pressable>
            </View>
          )}

          {/* ── HOST LOGIN / SIGNUP ── */}
          {role === 'host' && (
            <View style={{ gap: 16, marginTop: 8 }}>
              {hostAction === 'login' ? (
                <>
                  <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Property Host Sign In</Text>

                  {/* Email */}
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Mail color={theme.textMuted} size={20} />
                      <TextInput
                        value={hostEmail}
                        onChangeText={setHostEmail}
                        placeholder="host@larosa.in"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Password */}
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Lock color={theme.textMuted} size={20} />
                      <TextInput
                        value={hostPassword}
                        onChangeText={setHostPassword}
                        placeholder="Enter password"
                        placeholderTextColor={theme.textMuted}
                        secureTextEntry
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {authError && (
                    <Text style={{ color: theme.red, fontSize: 13 }}>
                      {authError === 'invalid' ? '❌ Invalid email or password' : authError}
                    </Text>
                  )}

                  <PrimaryButton
                    label={isAuthenticating ? 'Signing in…' : 'Sign In as Host'}
                    onPress={handleHostLogin}
                    loading={isAuthenticating}
                    disabled={!hostEmail || !hostPassword}
                  />

                  <View style={{ gap: 8, marginTop: 4 }}>
                    <Pressable
                      onPress={() => { setHostEmail('host@larosa.in'); setHostPassword('demo1234'); }}
                      style={{ alignItems: 'center' }}
                    >
                      <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap to autofill verified host (demo)</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => { setHostEmail('newhost@larosa.in'); setHostPassword('demo1234'); }}
                      style={{ alignItems: 'center' }}
                    >
                      <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap to autofill new unverified host (demo)</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setHostAction('signup')}
                      style={{ alignItems: 'center', marginTop: 8 }}
                    >
                      <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '600' }}>Need an account? Sign up as Host</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Property Host Registration</Text>

                  {/* Name */}
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Full Name</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <UserIcon color={theme.textMuted} size={20} />
                      <TextInput
                        value={hostName}
                        onChangeText={setHostName}
                        placeholder="John Doe"
                        placeholderTextColor={theme.textMuted}
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Email */}
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Mail color={theme.textMuted} size={20} />
                      <TextInput
                        value={hostEmail}
                        onChangeText={setHostEmail}
                        placeholder="you@example.com"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Phone */}
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Phone color={theme.textMuted} size={20} />
                      <TextInput
                        value={hostPhone}
                        onChangeText={setHostPhone}
                        placeholder="98765 43210"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="phone-pad"
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Password */}
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Lock color={theme.textMuted} size={20} />
                      <TextInput
                        value={hostPassword}
                        onChangeText={setHostPassword}
                        placeholder="Min. 6 characters"
                        placeholderTextColor={theme.textMuted}
                        secureTextEntry
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  <PrimaryButton
                    label={isAuthenticating ? 'Creating account…' : 'Register & Continue'}
                    onPress={handleHostSignup}
                    loading={isAuthenticating}
                    disabled={!hostName || !hostEmail || !hostPhone || hostPassword.length < 6}
                  />

                  <Pressable
                    onPress={() => setHostAction('login')}
                    style={{ alignItems: 'center', marginTop: 8 }}
                  >
                    <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '600' }}>Already have an account? Sign in</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {/* ── CUSTOMER LOGIN ── */}
          {role === 'customer' && (
            <View style={{ gap: 16, marginTop: 8 }}>
              <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Guest Sign In</Text>

              {/* Method switcher */}
              <View style={[styles.methodSwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Pressable
                  onPress={() => { setCustomerMethod('phone'); setOtpStep('input'); }}
                  style={[styles.methodTab, customerMethod === 'phone' && { backgroundColor: 'rgba(201,161,74,0.15)' }]}
                >
                  <Smartphone size={15} color={customerMethod === 'phone' ? '#C9A14A' : theme.textMuted} />
                  <Text style={[styles.methodTabText, { color: customerMethod === 'phone' ? '#C9A14A' : theme.textMuted }]}>
                    Phone OTP
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => { setCustomerMethod('email'); setOtpStep('input'); }}
                  style={[styles.methodTab, customerMethod === 'email' && { backgroundColor: 'rgba(201,161,74,0.15)' }]}
                >
                  <Mail size={15} color={customerMethod === 'email' ? '#C9A14A' : theme.textMuted} />
                  <Text style={[styles.methodTabText, { color: customerMethod === 'email' ? '#C9A14A' : theme.textMuted }]}>
                    Email
                  </Text>
                </Pressable>
              </View>

              {/* Phone OTP */}
              {customerMethod === 'phone' && (
                <>
                  {otpStep === 'input' && (
                    <>
                      <View>
                        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                        <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                          <Text style={{ color: theme.textMuted, fontSize: 15, fontWeight: '600' }}>+91</Text>
                          <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="98765 43210"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={[styles.input, { color: theme.text }]}
                          />
                          {phone.length === 10 && (
                            <Shield size={16} color="#2E7D32" />
                          )}
                        </View>
                      </View>
                      <PrimaryButton
                        label="Send OTP"
                        onPress={handleSendOtp}
                        disabled={phone.length < 10}
                      />
                      <Pressable
                        onPress={() => setPhone('9876543210')}
                        style={{ alignItems: 'center' }}
                      >
                        <Text style={{ color: theme.textMuted, fontSize: 13 }}>Use demo phone number</Text>
                      </Pressable>
                    </>
                  )}
                  {otpStep === 'otp' && (
                    <>
                      <View style={[styles.otpSentBanner, { backgroundColor: 'rgba(46,125,50,0.08)', borderColor: 'rgba(46,125,50,0.2)' }]}>
                        <Text style={{ color: '#2E7D32', fontSize: 13, fontWeight: '600' }}>
                          OTP sent to +91 {phone}
                        </Text>
                        <Pressable onPress={() => setOtpStep('input')}>
                          <Text style={{ color: '#C9A14A', fontSize: 13, fontWeight: '600' }}>Change</Text>
                        </Pressable>
                      </View>
                      <View>
                        <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Enter OTP</Text>
                        <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                          <Smartphone color={theme.textMuted} size={20} />
                          <TextInput
                            value={otp}
                            onChangeText={setOtp}
                            placeholder="Enter 6-digit OTP"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={[styles.input, { color: theme.text, letterSpacing: 4, fontSize: 18 }]}
                          />
                        </View>
                      </View>
                      {authError === 'invalid_otp' && (
                        <Text style={{ color: theme.red, fontSize: 13 }}>❌ Invalid OTP. Please try again.</Text>
                      )}
                      <PrimaryButton
                        label={isAuthenticating ? 'Verifying…' : 'Verify & Sign In'}
                        onPress={handleVerifyOtp}
                        loading={isAuthenticating}
                        disabled={otp.length < 6}
                      />
                      <Pressable onPress={() => setOtp('123456')} style={{ alignItems: 'center' }}>
                        <Text style={{ color: theme.textMuted, fontSize: 13 }}>Use demo OTP: 123456</Text>
                      </Pressable>
                    </>
                  )}
                </>
              )}

              {/* Email login for customers */}
              {customerMethod === 'email' && (
                <>
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Mail color={theme.textMuted} size={20} />
                      <TextInput
                        value={customerEmail}
                        onChangeText={setCustomerEmail}
                        placeholder="you@example.com"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>
                  <View>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password</Text>
                    <View style={[styles.inputRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Lock color={theme.textMuted} size={20} />
                      <TextInput
                        value={customerPassword}
                        onChangeText={setCustomerPassword}
                        placeholder="Enter password"
                        placeholderTextColor={theme.textMuted}
                        secureTextEntry
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>
                  {authError && (
                    <Text style={{ color: theme.red, fontSize: 13 }}>❌ Invalid email or password</Text>
                  )}
                  <PrimaryButton
                    label={isAuthenticating ? 'Signing in…' : 'Sign In'}
                    onPress={handleCustomerEmailLogin}
                    loading={isAuthenticating}
                    disabled={!customerEmail || !customerPassword}
                  />
                  <Pressable
                    onPress={() => { setCustomerEmail('guest@larosa.in'); setCustomerPassword('demo1234'); }}
                    style={{ alignItems: 'center' }}
                  >
                    <Text style={{ color: theme.textMuted, fontSize: 13 }}>Use demo guest credentials</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {/* Trust badges */}
          <View style={[styles.trustRow, { marginTop: 32 }]}>
            {['🔒 Secure', '🇮🇳 India', '✅ Verified'].map((t) => (
              <View key={t} style={[styles.trustChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.trustText, { color: theme.textMuted }]}>{t}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  roleSwitcher: {
    flexDirection: 'row', borderRadius: 16, borderWidth: 1,
    padding: 4, marginBottom: 8,
  },
  roleTab: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  roleTabText: { fontSize: 13, fontWeight: '700' },
  formTitle: { fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    borderWidth: 1, paddingHorizontal: 16, height: 54, gap: 12,
  },
  input: { flex: 1, fontSize: 16 },
  methodSwitcher: {
    flexDirection: 'row', borderRadius: 12, borderWidth: 1,
    overflow: 'hidden',
  },
  methodTab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10,
  },
  methodTabText: { fontSize: 13, fontWeight: '600' },
  otpSentBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  trustRow: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  trustChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1,
  },
  trustText: { fontSize: 12, fontWeight: '500' },
});
