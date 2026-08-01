import { useNavigation } from '@react-navigation/native';
import {
  UploadCloud,
  ShieldCheck,
  FileText,
  Check,
  Smartphone,
  Mail,
  LogOut,
  Sparkles,
} from 'lucide-react-native';
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
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { Card, PrimaryButton, SecondaryButton } from '../../components/ui';
import { Alert } from '../../lib/alert';

type Step = 'contact' | 'govId' | 'bank' | 'property' | 'pending';

export default function HostVerificationScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { user, updateUser, logout } = useAuth();
  const { submitHostVerification, approveHost } = useData();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 768;

  const [currentStep, setCurrentStep] = useState<Step>(
    user?.hostVerificationStatus === 'pending' ? 'pending' : 'contact'
  );

  // Step 1: Contact
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(user?.isEmailVerified ?? false);

  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(user?.isPhoneVerified ?? false);

  // Step 2: Govt ID
  const [idType, setIdType] = useState('Aadhar Card');
  const [idNumber, setIdNumber] = useState('');
  const [idFileUploaded, setIdFileUploaded] = useState(false);

  // Step 3: Bank Details
  const [holderName, setHolderName] = useState(user?.name ?? '');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');

  // Step 4: Property Proof
  const [ownershipUploaded, setOwnershipUploaded] = useState(false);
  const [addressProofUploaded, setAddressProofUploaded] = useState(false);

  const handleVerifyEmail = () => {
    if (emailCode === '123456' || emailCode.length > 3) {
      setEmailVerified(true);
      setEmailCodeSent(false);
      Alert.alert('Success', 'Email verified successfully!');
    } else {
      Alert.alert('Error', 'Invalid verification code. Try 123456');
    }
  };

  const handleVerifyPhone = () => {
    if (phoneCode === '123456' || phoneCode.length > 3) {
      setPhoneVerified(true);
      setPhoneCodeSent(false);
      Alert.alert('Success', 'Phone number verified successfully!');
    } else {
      Alert.alert('Error', 'Invalid OTP code. Try 123456');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'contact') {
      if (!emailVerified || !phoneVerified) {
        Alert.alert('Verification Required', 'Please verify both email and phone number to continue.');
        return;
      }
      setCurrentStep('govId');
    } else if (currentStep === 'govId') {
      if (!idNumber || !idFileUploaded) {
        Alert.alert('Information Missing', 'Please enter ID number and upload Government ID document photo.');
        return;
      }
      setCurrentStep('bank');
    } else if (currentStep === 'bank') {
      if (!holderName || !accountNumber || !ifscCode) {
        Alert.alert('Information Missing', 'Please enter account holder name, account number, and IFSC code.');
        return;
      }
      setCurrentStep('property');
    } else if (currentStep === 'property') {
      if (!ownershipUploaded || !addressProofUploaded) {
        Alert.alert('Proofs Required', 'Please upload both property ownership proof and address proof documents.');
        return;
      }
      handleSubmitAll();
    }
  };

  const handleSubmitAll = () => {
    if (!user) return;
    
    const govtIdData = { type: idType, number: idNumber, documentUrl: 'mock_govt_id.jpg' };
    const bankDetailsData = { accountHolderName: holderName, bankAccountNumber: accountNumber, ifscCode, upiId };
    const propertyProofData = { ownershipProofUrl: 'ownership_deed.pdf', addressProofUrl: 'property_tax_bill.jpg' };

    // Update in data context (for admin to see)
    submitHostVerification(user.id, govtIdData, bankDetailsData, propertyProofData);

    // Update in auth state
    updateUser({
      isEmailVerified: true,
      isPhoneVerified: true,
      hostVerificationStatus: 'pending',
      govtId: govtIdData,
      bankDetails: bankDetailsData,
      propertyProof: propertyProofData,
    });

    setCurrentStep('pending');
  };

  const handleDevApprove = () => {
    if (!user) return;
    
    // Auto verify in context
    approveHost(user.id);

    // Auto verify in auth state
    updateUser({
      hostVerificationStatus: 'verified',
    });

    Alert.alert('Developer Mode', 'Host status approved! Navigating to dashboard...', [
      {
        text: 'OK',
        onPress: () => {
          navigation.replace('HostTabs');
        },
      },
    ]);
  };

  const renderProgress = () => {
    const steps: { key: Step; label: string }[] = [
      { key: 'contact', label: 'Verify' },
      { key: 'govId', label: 'ID' },
      { key: 'bank', label: 'Bank' },
      { key: 'property', label: 'Property' },
    ];

    if (currentStep === 'pending') return null;

    const activeIdx = steps.findIndex((s) => s.key === currentStep);

    return (
      <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.progressContainer}>
          {steps.map((s, idx) => {
            const isActive = currentStep === s.key;
            const isDone = activeIdx > idx;

            return (
              <React.Fragment key={s.key}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isDone
                          ? theme.green
                          : isActive
                          ? theme.gold
                          : theme.surfaceElevated,
                        borderColor: isActive || isDone ? 'transparent' : theme.border,
                      },
                    ]}
                  >
                    {isDone ? (
                      <Check color={theme.textInverse} size={14} strokeWidth={3} />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumber,
                          { color: isActive ? theme.textInverse : theme.textMuted },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isActive ? theme.text : theme.textMuted,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
                {idx < steps.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: isDone ? theme.green : theme.border },
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
        <Text style={[styles.progressHint, { color: theme.textMuted }]}>
          Step {activeIdx + 1} of {steps.length}
        </Text>
      </View>
    );
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            isWide && styles.scrollWide,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.shell, isWide && styles.shellWide]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.brandPill, { backgroundColor: theme.goldGlow }]}>
                  <Sparkles size={12} color={theme.gold} />
                  <Text style={[styles.brandPillText, { color: theme.gold }]}>Host onboarding</Text>
                </View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  Host Verification
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  A few quick steps so guests can trust your listings.
                </Text>
              </View>
              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [
                  styles.logoutBtn,
                  { borderColor: theme.border, backgroundColor: theme.surface },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <LogOut size={15} color={theme.textMuted} />
                <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>Exit</Text>
              </Pressable>
            </View>

            {renderProgress()}

          {/* ──────────────── STEP 1: CONTACT VERIFICATION ──────────────── */}
          {currentStep === 'contact' && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Verify your email and phone so we can secure your host account.
              </Text>

              {/* Email Card */}
              <Card elevated style={styles.verifCard}>
                <View style={styles.verifHeader}>
                  <View style={[styles.iconBubble, { backgroundColor: emailVerified ? theme.greenSoft : theme.goldGlow }]}>
                    <Mail color={emailVerified ? theme.green : theme.gold} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.verifTitle, { color: theme.text }]}>Email Address</Text>
                    <Text style={[styles.verifValue, { color: theme.textSecondary }]}>{user?.email}</Text>
                  </View>
                  {emailVerified && (
                    <View style={[styles.badge, { backgroundColor: theme.greenSoft }]}>
                      <Check color={theme.green} size={12} strokeWidth={3} />
                      <Text style={{ color: theme.green, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>Verified</Text>
                    </View>
                  )}
                </View>

                {!emailVerified && (
                  <View style={[styles.verifBody, { borderTopColor: theme.borderSoft }]}>
                    {!emailCodeSent ? (
                      <Pressable
                        onPress={() => setEmailCodeSent(true)}
                        style={({ pressed }) => [
                          styles.sendBtn,
                          { backgroundColor: theme.gold },
                          pressed && { opacity: 0.88 },
                        ]}
                      >
                        <Text style={[styles.sendBtnText, { color: theme.textInverse }]}>
                          Send verification code
                        </Text>
                      </Pressable>
                    ) : (
                      <View style={{ gap: 12 }}>
                        <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
                          Enter the 6-digit code we sent to your email. Use <Text style={{ fontWeight: '700', color: theme.text }}>123456</Text> in demo.
                        </Text>
                        <View style={styles.otpRow}>
                          <TextInput
                            value={emailCode}
                            onChangeText={setEmailCode}
                            placeholder="6-digit code"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                          />
                          <Pressable
                            onPress={handleVerifyEmail}
                            style={[styles.verifyCodeBtn, { backgroundColor: theme.gold }]}
                          >
                            <Text style={{ color: theme.textInverse, fontWeight: '700' }}>Verify</Text>
                          </Pressable>
                        </View>
                        <Pressable onPress={() => setEmailCodeSent(false)}>
                          <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', fontWeight: '600' }}>
                            Cancel
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </Card>

              {/* Phone Card */}
              <Card elevated style={styles.verifCard}>
                <View style={styles.verifHeader}>
                  <View style={[styles.iconBubble, { backgroundColor: phoneVerified ? theme.greenSoft : theme.goldGlow }]}>
                    <Smartphone color={phoneVerified ? theme.green : theme.gold} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.verifTitle, { color: theme.text }]}>Phone Number</Text>
                    <Text style={[styles.verifValue, { color: theme.textSecondary }]}>
                      {user?.phone || 'Not provided'}
                    </Text>
                  </View>
                  {phoneVerified && (
                    <View style={[styles.badge, { backgroundColor: theme.greenSoft }]}>
                      <Check color={theme.green} size={12} strokeWidth={3} />
                      <Text style={{ color: theme.green, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>Verified</Text>
                    </View>
                  )}
                </View>

                {!phoneVerified && (
                  <View style={[styles.verifBody, { borderTopColor: theme.borderSoft }]}>
                    {!phoneCodeSent ? (
                      <Pressable
                        onPress={() => setPhoneCodeSent(true)}
                        style={({ pressed }) => [
                          styles.sendBtn,
                          { backgroundColor: theme.gold },
                          pressed && { opacity: 0.88 },
                        ]}
                      >
                        <Text style={[styles.sendBtnText, { color: theme.textInverse }]}>
                          Send phone OTP
                        </Text>
                      </Pressable>
                    ) : (
                      <View style={{ gap: 12 }}>
                        <Text style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
                          Enter the OTP sent to your phone. Use <Text style={{ fontWeight: '700', color: theme.text }}>123456</Text> in demo.
                        </Text>
                        <View style={styles.otpRow}>
                          <TextInput
                            value={phoneCode}
                            onChangeText={setPhoneCode}
                            placeholder="6-digit OTP"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
                          />
                          <Pressable
                            onPress={handleVerifyPhone}
                            style={[styles.verifyCodeBtn, { backgroundColor: theme.gold }]}
                          >
                            <Text style={{ color: theme.textInverse, fontWeight: '700' }}>Verify</Text>
                          </Pressable>
                        </View>
                        <Pressable onPress={() => setPhoneCodeSent(false)}>
                          <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', fontWeight: '600' }}>
                            Cancel
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </Card>

              <PrimaryButton
                label="Continue"
                onPress={handleNextStep}
                disabled={!emailVerified || !phoneVerified}
                style={{ marginTop: 8 }}
              />
            </View>
          )}

          {/* ──────────────── STEP 2: GOVERNMENT ID ──────────────── */}
          {currentStep === 'govId' && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Upload a government-issued photo identity proof (Aadhar, PAN, or Passport).
              </Text>

              <Card elevated style={{ gap: 16, padding: 18 }}>
                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Document Type</Text>
                  <View style={styles.chipWrap}>
                    {['Aadhar Card', 'PAN Card', 'Passport'].map((type) => (
                      <Pressable
                        key={type}
                        onPress={() => setIdType(type)}
                        style={[
                          styles.chipTab,
                          {
                            backgroundColor: idType === type ? theme.goldGlow : theme.bg,
                            borderColor: idType === type ? theme.gold : theme.border,
                          },
                        ]}
                      >
                        <Text style={{ color: idType === type ? theme.gold : theme.textSecondary, fontWeight: '600', fontSize: 13 }}>
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Document ID Number</Text>
                  <TextInput
                    value={idNumber}
                    onChangeText={setIdNumber}
                    placeholder={`Enter ${idType} Number`}
                    placeholderTextColor={theme.textMuted}
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Upload Document Image</Text>
                  {idFileUploaded ? (
                    <View style={[styles.uploadBox, { borderColor: theme.green, borderStyle: 'solid', backgroundColor: theme.greenSoft + '11' }]}>
                      <ShieldCheck color={theme.green} size={28} />
                      <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14, marginTop: 8 }}>
                        {idType} Uploaded
                      </Text>
                      <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                        doc_file_scan_ref.jpg (Tap to replace)
                      </Text>
                      <Pressable onPress={() => setIdFileUploaded(false)} style={{ marginTop: 10 }}>
                        <Text style={{ color: theme.red, fontSize: 12, fontWeight: '600' }}>Remove</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setIdFileUploaded(true)}
                      style={[styles.uploadBox, { borderColor: theme.border, borderStyle: 'dashed' }]}
                    >
                      <UploadCloud color={theme.textMuted} size={32} />
                      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 14, marginTop: 8 }}>
                        Upload ID document front & back
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>
                        Supports JPG, PNG or PDF (Max 5MB)
                      </Text>
                    </Pressable>
                  )}
                </View>
              </Card>

              <View style={styles.btnRow}>
                <SecondaryButton label="Back" onPress={() => setCurrentStep('contact')} style={{ flex: 1 }} />
                <PrimaryButton label="Continue" onPress={handleNextStep} style={{ flex: 1 }} />
              </View>
            </View>
          )}

          {/* ──────────────── STEP 3: BANK DETAILS ──────────────── */}
          {currentStep === 'bank' && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Provide bank account details for security deposit routing and booking payouts.
              </Text>

              <Card elevated style={{ gap: 16, padding: 18 }}>
                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Account Holder Name</Text>
                  <TextInput
                    value={holderName}
                    onChangeText={setHolderName}
                    placeholder="As listed in bank statement"
                    placeholderTextColor={theme.textMuted}
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Bank Account Number</Text>
                  <TextInput
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    placeholder="Enter account number"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="number-pad"
                    secureTextEntry
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>IFSC Code</Text>
                  <TextInput
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="e.g. HDFC0001234"
                    placeholderTextColor={theme.textMuted}
                    autoCapitalize="characters"
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>

                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>UPI ID (Optional)</Text>
                  <TextInput
                    value={upiId}
                    onChangeText={setUpiId}
                    placeholder="e.g. name@upi"
                    placeholderTextColor={theme.textMuted}
                    autoCapitalize="none"
                    style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                  />
                </View>
              </Card>

              <View style={styles.btnRow}>
                <SecondaryButton label="Back" onPress={() => setCurrentStep('govId')} style={{ flex: 1 }} />
                <PrimaryButton label="Continue" onPress={handleNextStep} style={{ flex: 1 }} />
              </View>
            </View>
          )}

          {/* ──────────────── STEP 4: PROPERTY PROOF ──────────────── */}
          {currentStep === 'property' && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Provide documents demonstrating ownership or authorization to lease property.
              </Text>

              <Card elevated style={{ gap: 16, padding: 18 }}>
                {/* Proof 1: Ownership */}
                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Ownership Deed or permission authorization letter</Text>
                  {ownershipUploaded ? (
                    <View style={[styles.uploadBox, { borderColor: theme.green, borderStyle: 'solid', backgroundColor: theme.greenSoft + '11', height: 100 }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <FileText color={theme.green} size={22} />
                        <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>deed_ownership_signed.pdf</Text>
                      </View>
                      <Pressable onPress={() => setOwnershipUploaded(false)} style={{ marginTop: 8 }}>
                        <Text style={{ color: theme.red, fontSize: 12, fontWeight: '600' }}>Remove</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setOwnershipUploaded(true)}
                      style={[styles.uploadBox, { borderColor: theme.border, borderStyle: 'dashed', height: 110 }]}
                    >
                      <UploadCloud color={theme.textMuted} size={24} />
                      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 13, marginTop: 4 }}>
                        Upload Title Deed / Lease Authorization
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* Proof 2: Address Proof */}
                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Address Proof (Electricity / Water bill or Tax Receipt)</Text>
                  {addressProofUploaded ? (
                    <View style={[styles.uploadBox, { borderColor: theme.green, borderStyle: 'solid', backgroundColor: theme.greenSoft + '11', height: 100 }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <FileText color={theme.green} size={22} />
                        <Text style={{ color: theme.text, fontWeight: '700', fontSize: 14 }}>utility_bill_electricity.jpg</Text>
                      </View>
                      <Pressable onPress={() => setAddressProofUploaded(false)} style={{ marginTop: 8 }}>
                        <Text style={{ color: theme.red, fontSize: 12, fontWeight: '600' }}>Remove</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setAddressProofUploaded(true)}
                      style={[styles.uploadBox, { borderColor: theme.border, borderStyle: 'dashed', height: 110 }]}
                    >
                      <UploadCloud color={theme.textMuted} size={24} />
                      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 13, marginTop: 4 }}>
                        Upload Property Tax Bill / Utility Bill
                      </Text>
                    </Pressable>
                  )}
                </View>
              </Card>

              <View style={styles.btnRow}>
                <SecondaryButton label="Back" onPress={() => setCurrentStep('bank')} style={{ flex: 1 }} />
                <PrimaryButton label="Submit Verification" onPress={handleNextStep} style={{ flex: 1 }} />
              </View>
            </View>
          )}

          {/* ──────────────── STEP 5: PENDING ADMIN APPROVAL ──────────────── */}
          {currentStep === 'pending' && (
            <View style={[styles.stepContent, styles.pendingWrap]}>
              <View style={[styles.largeIconBox, { backgroundColor: theme.goldGlow, borderColor: theme.gold }]}>
                <ShieldCheck color={theme.gold} size={44} />
              </View>

              <Text style={[styles.pendingTitle, { color: theme.text }]}>
                Under admin review
              </Text>

              <Text style={[styles.pendingBody, { color: theme.textSecondary }]}>
                Your documents were submitted successfully. Approvals usually take about 24 hours before listings can go live.
              </Text>

              <Card elevated style={{ width: '100%', marginTop: 8, gap: 14, padding: 18 }}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.borderSoft, paddingBottom: 10 }}>
                  Verification overview
                </Text>

                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Email & Phone</Text>
                  <Text style={{ color: theme.green, fontSize: 13, fontWeight: '700' }}>Verified</Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Government ID</Text>
                  <Text style={{ color: theme.amber, fontSize: 13, fontWeight: '600' }}>Pending review</Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Bank account</Text>
                  <Text style={{ color: theme.amber, fontSize: 13, fontWeight: '600' }}>Pending</Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Property proofs</Text>
                  <Text style={{ color: theme.amber, fontSize: 13, fontWeight: '600' }}>Pending review</Text>
                </View>
              </Card>

              <View style={{ width: '100%', marginTop: 24, gap: 12 }}>
                <PrimaryButton
                  label="Admin auto-approve (dev)"
                  onPress={handleDevApprove}
                />
                <SecondaryButton
                  label="Log out"
                  onPress={handleLogout}
                />
              </View>
            </View>
          )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  scrollWide: {
    paddingHorizontal: 32,
    paddingTop: 32,
    alignItems: 'center',
  },
  shell: {
    width: '100%',
    gap: 0,
  },
  shellWide: {
    maxWidth: 560,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  brandPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 4,
  },
  brandPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  progressCard: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 24,
    gap: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressHint: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
    minWidth: 52,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 11,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginTop: -16,
    borderRadius: 1,
  },
  stepContent: {
    gap: 14,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  verifCard: {
    padding: 16,
    gap: 0,
  },
  verifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  verifValue: {
    fontSize: 13,
    marginTop: 2,
  },
  verifBody: {
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 14,
  },
  sendBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  verifyCodeBtn: {
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderRadius: 16,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  largeIconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingWrap: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 20,
    letterSpacing: -0.3,
  },
  pendingBody: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 340,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
