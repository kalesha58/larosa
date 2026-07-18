import { LinearGradient } from '../../components/LinearGradient';
import { useNavigation } from '@react-navigation/native';
import {
  CheckCircle,
  Circle,
  UploadCloud,
  ShieldCheck,
  Building,
  CreditCard,
  FileText,
  Check,
  AlertCircle,
  Smartphone,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  LogOut,
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
  Alert,
} from 'react-native';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { Card, PrimaryButton, SecondaryButton } from '../../components/ui';

type Step = 'contact' | 'govId' | 'bank' | 'property' | 'pending';

export default function HostVerificationScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { user, updateUser, logout } = useAuth();
  const { submitHostVerification, approveHost } = useData();

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

    return (
      <View style={styles.progressContainer}>
        {steps.map((s, idx) => {
          const isActive = currentStep === s.key;
          const isDone =
            (currentStep === 'govId' && idx < 1) ||
            (currentStep === 'bank' && idx < 2) ||
            (currentStep === 'property' && idx < 3);

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
                    <Check color={theme.bg} size={14} strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        { color: isActive ? '#111111' : theme.textMuted },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: isActive ? theme.gold : theme.textSecondary },
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
    );
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={[theme.bg, '#15110A']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
                Onboarding
              </Text>
              <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', marginTop: 4 }}>
                Host Verification
              </Text>
            </View>
            <Pressable
              onPress={handleLogout}
              style={[styles.logoutBtn, { borderColor: theme.border }]}
            >
              <LogOut size={16} color={theme.red} />
              <Text style={{ color: theme.red, fontSize: 13, fontWeight: '600' }}>Exit</Text>
            </Pressable>
          </View>

          {renderProgress()}

          {/* ──────────────── STEP 1: CONTACT VERIFICATION ──────────────── */}
          {currentStep === 'contact' && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Let's secure your account by verifying your email and phone number.
              </Text>

              {/* Email Card */}
              <Card style={styles.verifCard}>
                <View style={styles.verifHeader}>
                  <Mail color={emailVerified ? theme.green : theme.gold} size={22} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>Email Address</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>{user?.email}</Text>
                  </View>
                  {emailVerified && (
                    <View style={[styles.badge, { backgroundColor: theme.greenSoft }]}>
                      <Check color={theme.green} size={12} strokeWidth={3} />
                      <Text style={{ color: theme.green, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>VERIFIED</Text>
                    </View>
                  )}
                </View>

                {!emailVerified && (
                  <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: theme.borderSoft, paddingTop: 14 }}>
                    {!emailCodeSent ? (
                      <SecondaryButton
                        label="Send Verification Code"
                        onPress={() => setEmailCodeSent(true)}
                      />
                    ) : (
                      <View style={{ gap: 12 }}>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Enter the 6-digit code sent to your email:</Text>
                        <View style={styles.otpRow}>
                          <TextInput
                            value={emailCode}
                            onChangeText={setEmailCode}
                            placeholder="Enter Code (e.g. 123456)"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                          />
                          <Pressable
                            onPress={handleVerifyEmail}
                            style={[styles.verifyCodeBtn, { backgroundColor: theme.gold }]}
                          >
                            <Text style={{ color: '#111', fontWeight: '700' }}>Verify</Text>
                          </Pressable>
                        </View>
                        <Pressable onPress={() => setEmailCodeSent(false)}>
                          <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: 'center' }}>Cancel</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                )}
              </Card>

              {/* Phone Card */}
              <Card style={styles.verifCard}>
                <View style={styles.verifHeader}>
                  <Smartphone color={phoneVerified ? theme.green : theme.gold} size={22} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>Phone Number</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      {user?.phone || 'Not provided'}
                    </Text>
                  </View>
                  {phoneVerified && (
                    <View style={[styles.badge, { backgroundColor: theme.greenSoft }]}>
                      <Check color={theme.green} size={12} strokeWidth={3} />
                      <Text style={{ color: theme.green, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>VERIFIED</Text>
                    </View>
                  )}
                </View>

                {!phoneVerified && (
                  <View style={{ marginTop: 14, borderTopWidth: 1, borderTopColor: theme.borderSoft, paddingTop: 14 }}>
                    {!phoneCodeSent ? (
                      <SecondaryButton
                        label="Send Phone OTP"
                        onPress={() => setPhoneCodeSent(true)}
                      />
                    ) : (
                      <View style={{ gap: 12 }}>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Enter the OTP sent to your phone number:</Text>
                        <View style={styles.otpRow}>
                          <TextInput
                            value={phoneCode}
                            onChangeText={setPhoneCode}
                            placeholder="Enter OTP (e.g. 123456)"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="number-pad"
                            maxLength={6}
                            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                          />
                          <Pressable
                            onPress={handleVerifyPhone}
                            style={[styles.verifyCodeBtn, { backgroundColor: theme.gold }]}
                          >
                            <Text style={{ color: '#111', fontWeight: '700' }}>Verify</Text>
                          </Pressable>
                        </View>
                        <Pressable onPress={() => setPhoneCodeSent(false)}>
                          <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: 'center' }}>Cancel</Text>
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
                style={{ marginTop: 24 }}
              />
            </View>
          )}

          {/* ──────────────── STEP 2: GOVERNMENT ID ──────────────── */}
          {currentStep === 'govId' && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Upload a government-issued photo identity proof (Aadhar, PAN, or Passport).
              </Text>

              <Card style={{ gap: 16 }}>
                <View>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Document Type</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {['Aadhar Card', 'PAN Card', 'Passport'].map((type) => (
                      <Pressable
                        key={type}
                        onPress={() => setIdType(type)}
                        style={[
                          styles.chipTab,
                          {
                            backgroundColor: idType === type ? theme.gold + '22' : theme.bg,
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

              <Card style={{ gap: 16 }}>
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

              <Card style={{ gap: 16 }}>
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
            <View style={[styles.stepContent, { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }]}>
              <View style={[styles.largeIconBox, { backgroundColor: theme.gold + '15', borderColor: theme.gold }]}>
                <ShieldCheck color={theme.gold} size={48} />
              </View>

              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 24 }}>
                Under Admin Review
              </Text>
              
              <Text style={{ color: theme.textSecondary, fontSize: 15, textAlign: 'center', marginTop: 12, lineHeight: 22, maxWidth: 300 }}>
                Your documents have been submitted successfully. Admin review and approval is required before your listings go live. This usually takes 24 hours.
              </Text>

              {/* Details card */}
              <Card style={{ width: '100%', marginTop: 32, gap: 14 }}>
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: 15, borderBottomWidth: 1, borderBottomColor: theme.borderSoft, paddingBottom: 10 }}>
                  Verification Overview
                </Text>
                
                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Email & Phone</Text>
                  <Text style={{ color: theme.green, fontSize: 13, fontWeight: '700' }}>✓ Verified</Text>
                </View>
                
                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Government ID</Text>
                  <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600' }}>⌛ Pending Review</Text>
                </View>
                
                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Bank account linked</Text>
                  <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600' }}>⌛ Pending Linkage</Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Property proofs</Text>
                  <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '600' }}>⌛ Pending Review</Text>
                </View>
              </Card>

              {/* Dev Approver shortcut */}
              <View style={{ width: '100%', marginTop: 40, gap: 12 }}>
                <PrimaryButton
                  label="🚀 Admin Auto-Approve (Dev Mode)"
                  onPress={handleDevApprove}
                  style={{ backgroundColor: '#2E7D32' }}
                />
                
                <SecondaryButton
                  label="Log out / Return to Sign In"
                  onPress={handleLogout}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 6,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginTop: -16,
  },
  stepContent: {
    gap: 16,
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  verifCard: {
    padding: 14,
  },
  verifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  verifyCodeBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
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
    marginTop: 20,
  },
  largeIconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
