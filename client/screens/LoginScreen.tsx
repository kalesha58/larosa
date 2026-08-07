import { LinearGradient } from '../components/LinearGradient';
import {
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  Phone,
  Shield,
  ShieldX,
  Sun,
  User as UserIcon,
  Sparkles,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';

type AuthMode = 'login' | 'signup';
type LoginRole = 'customer' | 'host' | 'admin';

const WIDE_BREAKPOINT = 768;

function RoleDropdown({
  value,
  onChange,
  theme,
}: {
  value: LoginRole;
  onChange: (role: LoginRole) => void;
  theme: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const roleOptions: { key: LoginRole; label: string; icon: any; desc: string }[] = [
    { key: 'customer', label: 'Guest', icon: UserIcon, desc: 'Book villas & luxury stays' },
    { key: 'host', label: 'Host', icon: Building2, desc: 'List & manage your properties' },
    { key: 'admin', label: 'Admin', icon: Shield, desc: 'System administration' },
  ];

  const currentOption = roleOptions.find((r) => r.key === value) || roleOptions[0];
  const IconComponent = currentOption.icon;

  return (
    <View style={{ zIndex: 30, marginBottom: 16 }}>
      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Role</Text>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={[
          styles.dropdownHeader,
          {
            backgroundColor: theme.surface,
            borderColor: isOpen ? theme.gold : theme.border,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <View style={[styles.roleIconContainer, { backgroundColor: 'rgba(35, 83, 71, 0.15)' }]}>
            <IconComponent size={18} color={theme.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
              {currentOption.label}
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 12 }} numberOfLines={1}>
              {currentOption.desc}
            </Text>
          </View>
        </View>
        <ChevronDown
          size={18}
          color={theme.textMuted}
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {isOpen && (
        <View
          style={[
            styles.dropdownMenu,
            {
              backgroundColor: theme.surfaceElevated || theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          {roleOptions.map((opt) => {
            const OptIcon = opt.icon;
            const isSelected = value === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  onChange(opt.key);
                  setIsOpen(false);
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  isSelected && { backgroundColor: 'rgba(35, 83, 71, 0.15)' },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <OptIcon size={16} color={isSelected ? theme.gold : theme.textMuted} />
                  <View>
                    <Text
                      style={{
                        color: isSelected ? theme.gold : theme.text,
                        fontSize: 14,
                        fontWeight: isSelected ? '700' : '600',
                      }}
                    >
                      {opt.label}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 11 }}>{opt.desc}</Text>
                  </View>
                </View>
                {isSelected && <Check size={16} color={theme.gold} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function LoginScreen() {
  const { theme, isDark, toggle } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;

  const {
    login,
    signupCustomer,
    isAuthenticating,
    authError,
    isAccessDenied,
    dismissAccessDenied,
  } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Input Focus States for highlight glow
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login form state
  const [role, setRole] = useState<LoginRole>('customer');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  // Sign Up form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [localError, setLocalError] = useState<string | null>(null);

  const handleLoginSubmit = async () => {
    setLocalError(null);
    if (!loginEmail || !loginPassword) {
      setLocalError('Please enter email and password');
      return;
    }

    const ok = await login(loginEmail, loginPassword);
    if (ok) {
      if (role === 'admin' || loginEmail.toLowerCase().includes('admin')) {
        navigation.replace('MainTabs');
      } else if (role === 'host' || loginEmail.toLowerCase().includes('host')) {
        navigation.replace('HostTabs');
      } else {
        navigation.replace('CustomerTabs');
      }
    }
  };

  const handleSignUpSubmit = async () => {
    setLocalError(null);
    if (!firstName || !lastName || !signUpPhone || !signUpEmail || !signUpPassword || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (signUpPassword.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const ok = await signupCustomer(firstName, lastName, signUpEmail, signUpPhone, signUpPassword);
    if (ok) {
      navigation.replace('CustomerTabs');
    }
  };

  const autofillDemo = (r: LoginRole) => {
    setAuthMode('login');
    setRole(r);
    if (r === 'admin') {
      setLoginEmail('admin@larosa.in');
      setLoginPassword('demo1234');
      setLoginPhone('9876500000');
    } else if (r === 'host') {
      setLoginEmail('host@larosa.in');
      setLoginPassword('demo1234');
      setLoginPhone('9876567890');
    } else {
      setLoginEmail('guest@larosa.in');
      setLoginPassword('demo1234');
      setLoginPhone('9876512345');
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

  const statusBarColor = theme.goldDim || '#16372F';

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      {Platform.OS !== 'web' && (
        <StatusBar
          barStyle="light-content"
          backgroundColor={statusBarColor}
          animated
        />
      )}

      {/* Styled Top Brand Header Banner */}
      <LinearGradient
        colors={[theme.goldDim || '#16372F', theme.gold || '#235347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBanner}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            {navigation.canGoBack() ? (
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.headerIconButton}
              >
                <ChevronLeft size={20} color="#FFFFFF" />
              </Pressable>
            ) : (
              <View style={{ width: 38 }} />
            )}

            <View style={styles.headerBrandTitleBlock}>
              <Text style={styles.headerBrandName}>LAROSA</Text>
              <View style={styles.headerBrandBadge}>
                <Sparkles size={10} color="#FFD700" />
                <Text style={styles.headerBrandBadgeText}>LUXURY STAYS</Text>
              </View>
            </View>

            <Pressable
              onPress={toggle}
              accessibilityRole="button"
              accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={styles.headerIconButton}
            >
              {isDark ? (
                <Sun size={18} color="#FFD700" strokeWidth={2} />
              ) : (
                <Moon size={18} color="#FFFFFF" strokeWidth={2} />
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
      {/* Accent Gold Stripe */}
      <View style={[styles.goldAccentStripe, { backgroundColor: theme.gold }]} />

      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              isWide && styles.scrollContainerWide,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.formWrapper, isWide && styles.formWrapperWide]}>
              {/* Brand Logo Header */}
              <View style={styles.headerBlock}>
                <View style={[styles.appBadge, { backgroundColor: theme.gold }]}>
                  <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900' }}>L</Text>
                </View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  {authMode === 'login' ? 'Sign in' : 'Sign up'}
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                  {authMode === 'login'
                    ? 'Sign in to access your LaRosa account'
                    : 'Create your LaRosa account'}
                </Text>
              </View>

              {/* Error Banner */}
              {(authError || localError) ? (
                <View style={[styles.errorBanner, { backgroundColor: theme.redSoft, borderColor: theme.red }]}>
                  <Text style={{ color: theme.red, fontSize: 13, fontWeight: '600', textAlign: 'center' }}>
                    {localError || (authError === 'invalid' ? 'Invalid email or password' : authError)}
                  </Text>
                </View>
              ) : null}

              {/* SIGN IN FORM */}
              {authMode === 'login' && (
                <View style={styles.formBody}>
                  {/* Role Selector */}
                  <RoleDropdown value={role} onChange={setRole} theme={theme} />

                  {/* Email Field */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email*</Text>
                    <View
                      style={[
                        styles.inputRow,
                        {
                          backgroundColor: theme.surface,
                          borderColor: focusedInput === 'loginEmail' ? theme.gold : theme.border,
                        },
                      ]}
                    >
                      <Mail color={focusedInput === 'loginEmail' ? theme.gold : theme.textMuted} size={18} />
                      <TextInput
                        value={loginEmail}
                        onChangeText={setLoginEmail}
                        onFocus={() => setFocusedInput('loginEmail')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="you@example.com"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Password Field */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password*</Text>
                    <View
                      style={[
                        styles.inputRow,
                        {
                          backgroundColor: theme.surface,
                          borderColor: focusedInput === 'loginPassword' ? theme.gold : theme.border,
                        },
                      ]}
                    >
                      <Lock color={focusedInput === 'loginPassword' ? theme.gold : theme.textMuted} size={18} />
                      <TextInput
                        value={loginPassword}
                        onChangeText={setLoginPassword}
                        onFocus={() => setFocusedInput('loginPassword')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="••••••••"
                        placeholderTextColor={theme.textMuted}
                        secureTextEntry={!showPassword}
                        style={[styles.input, { color: theme.text }]}
                      />
                      <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
                        {showPassword ? (
                          <EyeOff size={18} color={theme.textMuted} />
                        ) : (
                          <Eye size={18} color={theme.textMuted} />
                        )}
                      </Pressable>
                    </View>
                  </View>

                  {/* Remember Me & Forgot Password Row */}
                  <View style={styles.rememberForgotRow}>
                    <Pressable
                      onPress={() => setRememberMe(!rememberMe)}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: rememberMe ? theme.gold : theme.border,
                            backgroundColor: rememberMe ? theme.gold : 'transparent',
                          },
                        ]}
                      >
                        {rememberMe && <Check size={12} color="#fff" />}
                      </View>
                      <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Remember me</Text>
                    </Pressable>

                    <Pressable onPress={() => {}}>
                      <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700' }}>
                        Forgot Password?
                      </Text>
                    </Pressable>
                  </View>

                  {/* Phone Number Field */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Phone number</Text>
                    <View
                      style={[
                        styles.inputRow,
                        {
                          backgroundColor: theme.surface,
                          borderColor: focusedInput === 'loginPhone' ? theme.gold : theme.border,
                        },
                      ]}
                    >
                      <Phone color={focusedInput === 'loginPhone' ? theme.gold : theme.textMuted} size={18} />
                      <TextInput
                        value={loginPhone}
                        onChangeText={setLoginPhone}
                        onFocus={() => setFocusedInput('loginPhone')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="+91 98765 00000"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="phone-pad"
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Submit Button */}
                  <View style={{ marginTop: 12 }}>
                    <PrimaryButton
                      label={isAuthenticating ? 'Signing in…' : `Sign in`}
                      onPress={handleLoginSubmit}
                      loading={isAuthenticating}
                      disabled={!loginEmail || !loginPassword}
                    />
                  </View>

                  {/* Bottom Link Switcher */}
                  <View style={styles.switcherRow}>
                    <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                      Don't have an account?{' '}
                    </Text>
                    <Pressable onPress={() => { setAuthMode('signup'); setLocalError(null); }}>
                      <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '800' }}>
                        Sign up
                      </Text>
                    </Pressable>
                  </View>

                  {/* Demo Autofill Section */}
                  <View style={styles.demoSection}>
                    <Text style={{ color: theme.textMuted, fontSize: 11, textAlign: 'center', marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }}>
                      DEMO AUTOFILL
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Pressable
                        onPress={() => autofillDemo('customer')}
                        style={[styles.demoChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      >
                        <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>Guest Demo</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => autofillDemo('host')}
                        style={[styles.demoChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      >
                        <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>Host Demo</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => autofillDemo('admin')}
                        style={[styles.demoChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      >
                        <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>Admin Demo</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}

              {/* SIGN UP FORM */}
              {authMode === 'signup' && (
                <View style={styles.formBody}>
                  {/* First Name & Last Name Grid */}
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>First name*</Text>
                      <View
                        style={[
                          styles.inputRow,
                          {
                            backgroundColor: theme.surface,
                            borderColor: focusedInput === 'firstName' ? theme.gold : theme.border,
                          },
                        ]}
                      >
                        <UserIcon color={focusedInput === 'firstName' ? theme.gold : theme.textMuted} size={18} />
                        <TextInput
                          value={firstName}
                          onChangeText={setFirstName}
                          onFocus={() => setFocusedInput('firstName')}
                          onBlur={() => setFocusedInput(null)}
                          placeholder="First name"
                          placeholderTextColor={theme.textMuted}
                          style={[styles.input, { color: theme.text }]}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Last name*</Text>
                      <View
                        style={[
                          styles.inputRow,
                          {
                            backgroundColor: theme.surface,
                            borderColor: focusedInput === 'lastName' ? theme.gold : theme.border,
                          },
                        ]}
                      >
                        <UserIcon color={focusedInput === 'lastName' ? theme.gold : theme.textMuted} size={18} />
                        <TextInput
                          value={lastName}
                          onChangeText={setLastName}
                          onFocus={() => setFocusedInput('lastName')}
                          onBlur={() => setFocusedInput(null)}
                          placeholder="Last name"
                          placeholderTextColor={theme.textMuted}
                          style={[styles.input, { color: theme.text }]}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Email Field */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Email*</Text>
                    <View
                      style={[
                        styles.inputRow,
                        {
                          backgroundColor: theme.surface,
                          borderColor: focusedInput === 'signUpEmail' ? theme.gold : theme.border,
                        },
                      ]}
                    >
                      <Mail color={focusedInput === 'signUpEmail' ? theme.gold : theme.textMuted} size={18} />
                      <TextInput
                        value={signUpEmail}
                        onChangeText={setSignUpEmail}
                        onFocus={() => setFocusedInput('signUpEmail')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="you@example.com"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Phone Number Field */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Phone number</Text>
                    <View
                      style={[
                        styles.inputRow,
                        {
                          backgroundColor: theme.surface,
                          borderColor: focusedInput === 'signUpPhone' ? theme.gold : theme.border,
                        },
                      ]}
                    >
                      <Phone color={focusedInput === 'signUpPhone' ? theme.gold : theme.textMuted} size={18} />
                      <TextInput
                        value={signUpPhone}
                        onChangeText={setSignUpPhone}
                        onFocus={() => setFocusedInput('signUpPhone')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="+91 98765 00000"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="phone-pad"
                        style={[styles.input, { color: theme.text }]}
                      />
                    </View>
                  </View>

                  {/* Password & Confirm Password Grid */}
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Password*</Text>
                      <View
                        style={[
                          styles.inputRow,
                          {
                            backgroundColor: theme.surface,
                            borderColor: focusedInput === 'signUpPassword' ? theme.gold : theme.border,
                          },
                        ]}
                      >
                        <Lock color={focusedInput === 'signUpPassword' ? theme.gold : theme.textMuted} size={18} />
                        <TextInput
                          value={signUpPassword}
                          onChangeText={setSignUpPassword}
                          onFocus={() => setFocusedInput('signUpPassword')}
                          onBlur={() => setFocusedInput(null)}
                          placeholder="••••••••"
                          placeholderTextColor={theme.textMuted}
                          secureTextEntry={!showPassword}
                          style={[styles.input, { color: theme.text }]}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)} style={{ padding: 2 }}>
                          {showPassword ? (
                            <EyeOff size={16} color={theme.textMuted} />
                          ) : (
                            <Eye size={16} color={theme.textMuted} />
                          )}
                        </Pressable>
                      </View>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Confirm Password*</Text>
                      <View
                        style={[
                          styles.inputRow,
                          {
                            backgroundColor: theme.surface,
                            borderColor: focusedInput === 'confirmPassword' ? theme.gold : theme.border,
                          },
                        ]}
                      >
                        <Lock color={focusedInput === 'confirmPassword' ? theme.gold : theme.textMuted} size={18} />
                        <TextInput
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          onFocus={() => setFocusedInput('confirmPassword')}
                          onBlur={() => setFocusedInput(null)}
                          placeholder="••••••••"
                          placeholderTextColor={theme.textMuted}
                          secureTextEntry={!showConfirmPassword}
                          style={[styles.input, { color: theme.text }]}
                        />
                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 2 }}>
                          {showConfirmPassword ? (
                            <EyeOff size={16} color={theme.textMuted} />
                          ) : (
                            <Eye size={16} color={theme.textMuted} />
                          )}
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  {/* Submit Button */}
                  <View style={{ marginTop: 12 }}>
                    <PrimaryButton
                      label={isAuthenticating ? 'Creating Account…' : 'Sign up'}
                      onPress={handleSignUpSubmit}
                      loading={isAuthenticating}
                      disabled={
                        !firstName ||
                        !lastName ||
                        !signUpPhone ||
                        !signUpEmail ||
                        !signUpPassword ||
                        !confirmPassword
                      }
                    />
                  </View>

                  {/* Bottom Link Switcher */}
                  <View style={styles.switcherRow}>
                    <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                      Already have an account?{' '}
                    </Text>
                    <Pressable onPress={() => { setAuthMode('signup'); setLocalError(null); }}>
                      <Text style={{ color: theme.gold, fontSize: 14, fontWeight: '800' }}>
                        Sign In
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
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
  headerBanner: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 8 : 4,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrandTitleBlock: {
    alignItems: 'center',
    gap: 2,
  },
  headerBrandName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  headerBrandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBrandBadgeText: {
    color: '#FFD700',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  goldAccentStripe: {
    height: 2.5,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    alignItems: 'center',
  },
  scrollContainerWide: {
    justifyContent: 'center',
    paddingVertical: 48,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 420,
  },
  formWrapperWide: {
    maxWidth: 460,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#235347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  formBody: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 52,
  },
  roleIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownMenu: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rememberForgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  demoSection: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.15)',
    paddingTop: 16,
    width: '100%',
  },
  demoChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
});
