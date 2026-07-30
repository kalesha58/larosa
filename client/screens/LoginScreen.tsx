import { LinearGradient } from '../components/LinearGradient';
import { Lock, Mail, Moon, Phone, Shield, Smartphone, ShieldX, Sun, User as UserIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';
import loginBackground from '../assets/images/starry-night-lake.png';

type LoginRole = 'admin' | 'customer' | 'host';
type CustomerLoginMethod = 'phone' | 'email';
type OtpStep = 'input' | 'otp';

const WIDE_BREAKPOINT = 768;
const FORM_MAX_WIDTH = 420;

const imageSource =
  typeof loginBackground === 'number' ? loginBackground : { uri: loginBackground };

function LoginHero({
  variant,
}: {
  variant: 'side' | 'banner';
}) {
  const { theme } = useTheme();
  const isSide = variant === 'side';

  return (
    <View style={[styles.hero, isSide ? styles.heroSide : styles.heroBanner]}>
      <Image source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: isSide ? 'rgba(15,17,26,0.42)' : 'rgba(15,17,26,0.5)' },
        ]}
      />
      <View style={[styles.heroCopy, isSide ? styles.heroCopySide : styles.heroCopyBanner]}>
        {isSide ? (
          <>
            <View style={[styles.heroLogo, { borderColor: theme.gold }]}>
              <Text style={{ color: theme.gold, fontSize: 28, fontWeight: '800' }}>L</Text>
            </View>
            <Text style={styles.heroTitle}>LaRosa</Text>
            <Text style={[styles.heroTagline, { color: theme.gold }]}>
              Premium Farmhouse Stays
            </Text>
            <Text style={styles.heroSubtitle}>
              Escape to curated villas and forest retreats across India.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.heroTitleCompact}>LaRosa</Text>
            <Text style={[styles.heroTaglineCompact, { color: theme.gold }]}>
              Premium Farmhouse Stays
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const { theme, isDark, toggle } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const { login, loginAsCustomer, signupHost, isAuthenticating, authError, isAccessDenied, dismissAccessDenied } = useAuth();

  const [role, setRole] = useState<LoginRole>('customer');
  const [customerMethod, setCustomerMethod] = useState<CustomerLoginMethod>('phone');
  const [otpStep, setOtpStep] = useState<OtpStep>('input');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [hostAction, setHostAction] = useState<'login' | 'signup'>('login');
  const [hostName, setHostName] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPassword, setHostPassword] = useState('');

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

  const formContent = (
    <View style={[styles.formColumn, { alignItems: isWide ? 'flex-start' : 'center' }]}>
      {/* Theme toggle + brand */}
      <View style={[styles.brandHeaderRow, { alignSelf: isWide ? 'stretch' : 'center' }]}>
        <View style={[styles.brandBlock, { alignItems: isWide ? 'flex-start' : 'center', flex: 1 }]}>
          <View style={[styles.brandLogo, { borderColor: theme.gold }]}>
            <Text style={{ color: theme.gold, fontSize: 22, fontWeight: '800' }}>L</Text>
          </View>
          <Text style={[styles.brandTitle, { color: theme.text, textAlign: isWide ? 'left' : 'center' }]}>
            Welcome back
          </Text>
          <Text style={[styles.brandSubtitle, { color: theme.textSecondary, textAlign: isWide ? 'left' : 'center' }]}>
            Sign in to continue to LaRosa
          </Text>
        </View>
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={[
            styles.themeToggle,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {isDark ? (
            <Sun size={18} color={theme.gold} strokeWidth={2} />
          ) : (
            <Moon size={18} color={theme.gold} strokeWidth={2} />
          )}
        </Pressable>
      </View>

      {/* Role switcher */}
      <View style={[styles.roleSwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable
          onPress={() => setRole('customer')}
          style={[styles.roleTab, role === 'customer' && { backgroundColor: theme.gold }]}
        >
          <Text style={[styles.roleTabText, { color: role === 'customer' ? '#111111' : theme.textSecondary }]}>
            Guest
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setRole('host')}
          style={[styles.roleTab, role === 'host' && { backgroundColor: theme.gold }]}
        >
          <Text style={[styles.roleTabText, { color: role === 'host' ? '#111111' : theme.textSecondary }]}>
            Host
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setRole('admin')}
          style={[styles.roleTab, role === 'admin' && { backgroundColor: theme.gold }]}
        >
          <Text style={[styles.roleTabText, { color: role === 'admin' ? '#111111' : theme.textSecondary }]}>
            Admin
          </Text>
        </Pressable>
      </View>

      {/* Admin */}
      {role === 'admin' && (
        <View style={styles.formSection}>
          <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Admin Sign In</Text>

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

          {authError ? (
            <Text style={{ color: theme.red, fontSize: 13 }}>
              {authError === 'invalid' ? 'Invalid email or password' : authError}
            </Text>
          ) : null}

          <PrimaryButton
            label={isAuthenticating ? 'Signing in…' : 'Sign In as Admin'}
            onPress={handleAdminLogin}
            loading={isAuthenticating}
            disabled={!email || !password}
          />

          <Pressable
            onPress={() => { setEmail('admin@larosa.in'); setPassword('demo1234'); }}
            style={styles.demoLink}
          >
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap to autofill demo credentials</Text>
          </Pressable>
        </View>
      )}

      {/* Host */}
      {role === 'host' && (
        <View style={styles.formSection}>
          {hostAction === 'login' ? (
            <>
              <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Property Host Sign In</Text>

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

              {authError ? (
                <Text style={{ color: theme.red, fontSize: 13 }}>
                  {authError === 'invalid' ? 'Invalid email or password' : authError}
                </Text>
              ) : null}

              <PrimaryButton
                label={isAuthenticating ? 'Signing in…' : 'Sign In as Host'}
                onPress={handleHostLogin}
                loading={isAuthenticating}
                disabled={!hostEmail || !hostPassword}
              />

              <View style={{ gap: 8, marginTop: 4 }}>
                <Pressable
                  onPress={() => { setHostEmail('host@larosa.in'); setHostPassword('demo1234'); }}
                  style={styles.demoLink}
                >
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap to autofill verified host (demo)</Text>
                </Pressable>
                <Pressable
                  onPress={() => { setHostEmail('newhost@larosa.in'); setHostPassword('demo1234'); }}
                  style={styles.demoLink}
                >
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap to autofill new unverified host (demo)</Text>
                </Pressable>
                <Pressable
                  onPress={() => setHostAction('signup')}
                  style={[styles.demoLink, { marginTop: 8 }]}
                >
                  <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '600' }}>Need an account? Sign up as Host</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Property Host Registration</Text>

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
                style={[styles.demoLink, { marginTop: 8 }]}
              >
                <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '600' }}>Already have an account? Sign in</Text>
              </Pressable>
            </>
          )}
        </View>
      )}

      {/* Customer */}
      {role === 'customer' && (
        <View style={styles.formSection}>
          <Text style={[styles.formTitle, { color: theme.textSecondary }]}>Guest Sign In</Text>

          <View style={[styles.methodSwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => { setCustomerMethod('phone'); setOtpStep('input'); }}
              style={[styles.methodTab, customerMethod === 'phone' && { backgroundColor: 'rgba(201,161,74,0.15)' }]}
            >
              <Smartphone size={15} color={customerMethod === 'phone' ? theme.gold : theme.textMuted} />
              <Text style={[styles.methodTabText, { color: customerMethod === 'phone' ? theme.gold : theme.textMuted }]}>
                Phone OTP
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { setCustomerMethod('email'); setOtpStep('input'); }}
              style={[styles.methodTab, customerMethod === 'email' && { backgroundColor: 'rgba(201,161,74,0.15)' }]}
            >
              <Mail size={15} color={customerMethod === 'email' ? theme.gold : theme.textMuted} />
              <Text style={[styles.methodTabText, { color: customerMethod === 'email' ? theme.gold : theme.textMuted }]}>
                Email
              </Text>
            </Pressable>
          </View>

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
                      {phone.length === 10 ? <Shield size={16} color="#2E7D32" /> : null}
                    </View>
                  </View>
                  <PrimaryButton
                    label="Send OTP"
                    onPress={handleSendOtp}
                    disabled={phone.length < 10}
                  />
                  <Pressable onPress={() => setPhone('9876543210')} style={styles.demoLink}>
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
                      <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600' }}>Change</Text>
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
                  {authError === 'invalid_otp' ? (
                    <Text style={{ color: theme.red, fontSize: 13 }}>Invalid OTP. Please try again.</Text>
                  ) : null}
                  <PrimaryButton
                    label={isAuthenticating ? 'Verifying…' : 'Verify & Sign In'}
                    onPress={handleVerifyOtp}
                    loading={isAuthenticating}
                    disabled={otp.length < 6}
                  />
                  <Pressable onPress={() => setOtp('123456')} style={styles.demoLink}>
                    <Text style={{ color: theme.textMuted, fontSize: 13 }}>Use demo OTP: 123456</Text>
                  </Pressable>
                </>
              )}
            </>
          )}

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
              {authError ? (
                <Text style={{ color: theme.red, fontSize: 13 }}>Invalid email or password</Text>
              ) : null}
              <PrimaryButton
                label={isAuthenticating ? 'Signing in…' : 'Sign In'}
                onPress={handleCustomerEmailLogin}
                loading={isAuthenticating}
                disabled={!customerEmail || !customerPassword}
              />
              <Pressable
                onPress={() => { setCustomerEmail('guest@larosa.in'); setCustomerPassword('demo1234'); }}
                style={styles.demoLink}
              >
                <Text style={{ color: theme.textMuted, fontSize: 13 }}>Use demo guest credentials</Text>
              </Pressable>
            </>
          )}
        </View>
      )}

      {/* Trust badges */}
      <View style={styles.trustRow}>
        {['Secure', 'India', 'Verified'].map((t) => (
          <View key={t} style={[styles.trustChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.trustText, { color: theme.textMuted }]}>{t}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.bg, flexDirection: isWide ? 'row' : 'column' }]}>
      {/* Image left (wide) / banner top (narrow) */}
      <LoginHero variant={isWide ? 'side' : 'banner'} />

      <SafeAreaView
        style={[styles.formPanel, { backgroundColor: theme.bg }, isWide && styles.formPanelWide]}
        edges={isWide ? ['top', 'bottom', 'right'] : ['bottom']}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              isWide && styles.scrollContentWide,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {formContent}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  formPanel: {
    flex: 1,
  },
  formPanelWide: {
    flex: 0.48,
    minWidth: 360,
    maxWidth: 560,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  scrollContentWide: {
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 48,
  },
  formColumn: {
    width: '100%',
    maxWidth: FORM_MAX_WIDTH,
    alignSelf: 'center',
  },
  brandHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 28,
    width: '100%',
  },
  brandBlock: {
    gap: 6,
  },
  brandLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  themeToggle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  roleSwitcher: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    width: '100%',
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTabText: { fontSize: 13, fontWeight: '700' },
  formSection: {
    gap: 14,
    width: '100%',
  },
  formTitle: { fontSize: 14, fontWeight: '600', letterSpacing: 0.3 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  input: { flex: 1, fontSize: 16 },
  methodSwitcher: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  methodTabText: { fontSize: 13, fontWeight: '600' },
  otpSentBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  demoLink: { alignItems: 'center', marginTop: 2 },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    width: '100%',
  },
  trustChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  trustText: { fontSize: 12, fontWeight: '500' },
  hero: {
    overflow: 'hidden',
    backgroundColor: '#0F111A',
  },
  heroSide: {
    flex: 0.52,
    minWidth: 320,
  },
  heroBanner: {
    height: 200,
    width: '100%',
  },
  heroCopy: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  heroCopySide: {
    padding: 40,
    paddingBottom: 48,
  },
  heroCopyBanner: {
    padding: 20,
    paddingBottom: 18,
    alignItems: 'center',
  },
  heroLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTagline: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 320,
  },
  heroTitleCompact: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTaglineCompact: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
});
