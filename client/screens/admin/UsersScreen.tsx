import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Plus, Search, MoreVertical, Shield, User as UserIcon, AlertTriangle, Users as UsersIcon } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View, Switch, Platform, useWindowDimensions } from 'react-native';
import { Alert } from '../../lib/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import type { ThemeTokens } from '../../constants/colors';
import { Card, Chip, EmptyState, FieldLabel, PrimaryButton, SecondaryButton } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { formatDate } from '../../lib/format';
import type { AdminUser, UserRole } from '../../types';
import AdminWebHeader from '../../components/AdminWebHeader';

export default function UsersScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const isTab = route.name === 'UsersTab';
  const { users, addUser, deleteUser, approveHost, rejectHost, updateUserRole, suspendUser } = useData();
  const [query, setQuery] = useState<string>('');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 1024;
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPassword, setFormPassword] = useState<string>('');
  const [formRole, setFormRole] = useState<UserRole>('customer');

  // Host verification Modal States
  const [verificationModalOpen, setVerificationModalOpen] = useState<boolean>(false);
  const [selectedHost, setSelectedHost] = useState<AdminUser | null>(null);
  const [verifyIdentity, setVerifyIdentity] = useState<boolean>(false);
  const [verifyBank, setVerifyBank] = useState<boolean>(false);
  const [verifyDeeds, setVerifyDeeds] = useState<boolean>(false);
  const [hostRejectionReason, setHostRejectionReason] = useState<string>('');
  const [hostRejectionModalOpen, setHostRejectionModalOpen] = useState<boolean>(false);

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        if (query) {
          const q = query.toLowerCase();
          if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
        }
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        return true;
      }),
    [users, query, roleFilter]
  );

  const handleActions = useCallback(
    (u: AdminUser) => {
      const options: {
        text: string;
        style?: 'destructive' | 'cancel';
        onPress?: () => void;
      }[] = [
        { text: 'Edit Info', onPress: () => openEdit(u) },
      ];

      if (u.role !== 'admin') {
        options.push({
          text: u.isSuspended ? 'Restore Account' : 'Suspend Account',
          style: u.isSuspended ? undefined : 'destructive',
          onPress: () =>
            Alert.alert(
              u.isSuspended ? 'Restore ' + u.name + '?' : 'Suspend ' + u.name + '?',
              u.isSuspended
                ? 'They will regain access to Larosa.'
                : 'They will be blocked from booking or hosting until restored.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: u.isSuspended ? 'Restore' : 'Suspend',
                  style: u.isSuspended ? 'default' : 'destructive',
                  onPress: () => suspendUser(u.id, !u.isSuspended),
                },
              ]
            ),
        });
      }

      options.push({
        text: 'Delete Account',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Remove ' + u.name + '?', 'They will lose access to Larosa.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => deleteUser(u.id) },
          ]),
      });

      if (u.role === 'host' && u.hostVerificationStatus === 'pending') {
        options.unshift({
          text: 'Review Onboarding Documents',
          onPress: () => {
            setSelectedHost(u);
            setVerifyIdentity(false);
            setVerifyBank(false);
            setVerifyDeeds(false);
            setVerificationModalOpen(true);
          },
        });
      }

      Alert.alert(u.name, `Role: ${u.role === 'host' ? 'Property Host' : u.role === 'admin' ? 'Admin' : 'Guest'}`, [
        ...options,
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    [deleteUser, suspendUser]
  );

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPassword('');
    setFormRole(u.role);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('customer');
    setFormOpen(true);
  };

  const handleSaveUser = () => {
    if (editUser) {
      updateUserRole(editUser.id, formRole);
    } else {
      const newUser: AdminUser = {
        id: 'usr_' + Date.now(),
        name: formName,
        email: formEmail,
        role: formRole,
        createdAt: new Date().toISOString(),
        hostVerificationStatus: formRole === 'host' ? 'none' : undefined,
      };
      addUser(newUser);
    }
    setFormOpen(false);
  };

  // Role appearance
  const roleConfig = (role: AdminUser['role']) => {
    if (role === 'admin') return { bg: theme.gold + '22', border: theme.gold + '55', color: theme.gold, label: 'Admin' };
    if (role === 'host') return { bg: theme.amber + '18', border: theme.amber + '40', color: theme.amber, label: 'Host' };
    return { bg: theme.blue + '18', border: theme.blue + '40', color: theme.blue, label: 'Guest' };
  };

  const verificationStatusColor = (status?: string) => {
    if (status === 'verified') return theme.green;
    if (status === 'pending') return theme.amber;
    if (status === 'rejected') return theme.red;
    return theme.textMuted;
  };

  const widePad = isWide
    ? { maxWidth: 1120, width: '100%' as const, alignSelf: 'center' as const, paddingHorizontal: 32 }
    : { paddingHorizontal: 20 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={isWeb ? [] : ['top']}>
      {isWeb && isTab && <AdminWebHeader />}

      {/* ── Page Header ─────────────────────────────────── */}
      <View style={[{ paddingTop: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }, widePad]}>
        {!isTab ? (
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
            <ArrowLeft color={theme.gold} size={24} />
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }}>
          {isTab ? (
            <>
              <Text style={{ color: theme.gold, fontSize: 11, fontWeight: '700', letterSpacing: 3.5, textTransform: 'uppercase', marginBottom: 4 }}>
                Directory
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ color: theme.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 }}>
                  Guests & Hosts
                </Text>
                {/* User count pill */}
                <View style={{
                  backgroundColor: theme.gold + '18',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: theme.gold + '30',
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                }}>
                  <Text style={{ color: theme.gold, fontSize: 13, fontWeight: '700' }}>
                    {filtered.length}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>Guests & Hosts</Text>
          )}
        </View>
      </View>

      {/* ── Search ──────────────────────────────────────── */}
      <View style={[{ marginBottom: 12 }, widePad]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.border,
          paddingHorizontal: 16,
          height: 48,
          gap: 10,
        }}>
          <Search color={theme.textMuted} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or email…"
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
          />
        </View>
      </View>

      {/* ── Role Filter ─────────────────────────────────── */}
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }, widePad]}>
        <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginRight: 2 }}>
          Role
        </Text>
        {([
          { id: 'all', label: 'All' },
          { id: 'admin', label: 'Admins', color: theme.gold },
          { id: 'host', label: 'Hosts', color: theme.amber },
          { id: 'customer', label: 'Guests', color: theme.blue },
        ] as { id: 'all' | UserRole; label: string; color?: string }[]).map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={roleFilter === f.id}
            onPress={() => setRoleFilter(f.id)}
            color={f.color ?? theme.gold}
          />
        ))}
      </View>

      {/* ── Divider ─────────────────────────────────────── */}
      <View style={[{ height: 1, backgroundColor: theme.border, marginBottom: 16, opacity: 0.6 }, widePad]} />

      {/* ── User List ───────────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={isWeb}
        style={{ flex: 1 }}
        contentContainerStyle={[{ paddingBottom: isWeb ? 120 : 100 }, widePad]}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon={<UsersIcon color={theme.textMuted} size={36} />}
            title="No users found"
            subtitle="Try adjusting your search or role filter."
          />
        ) : (
          <View style={{ gap: 10 }}>
            {filtered.map((u) => {
              const rc = roleConfig(u.role);
              return (
                <View
                  key={u.id}
                  style={{
                    backgroundColor: theme.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: theme.border,
                    borderLeftWidth: 4,
                    borderLeftColor: rc.color + '80',
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                    {/* ── Avatar ── */}
                    <View style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: rc.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: rc.border,
                      flexShrink: 0,
                      shadowColor: rc.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 6,
                    }}>
                      {u.role === 'admin'
                        ? <Shield color={rc.color} size={20} />
                        : <Text style={{ color: rc.color, fontSize: 20, fontWeight: '800' }}>{u.name.charAt(0)}</Text>
                      }
                    </View>

                    {/* ── Info ── */}
                    <View style={{ flex: 1, minWidth: 0 }}>
                      {/* Name row with role pill */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                        <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }} numberOfLines={1}>
                          {u.name}
                        </Text>
                        {/* Role badge */}
                        <View style={{
                          backgroundColor: rc.bg,
                          borderRadius: 8,
                          paddingHorizontal: 9,
                          paddingVertical: 3,
                          borderWidth: 1,
                          borderColor: rc.border,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          {u.role === 'admin' && <Shield color={rc.color} size={10} />}
                          <Text style={{ color: rc.color, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {rc.label}
                          </Text>
                        </View>
                        {/* Suspended badge */}
                        {u.isSuspended && (
                          <View style={{
                            backgroundColor: theme.redSoft,
                            borderRadius: 7,
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <AlertTriangle color={theme.red} size={10} />
                            <Text style={{ color: theme.red, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                              Suspended
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={{ color: theme.textSecondary, fontSize: 13 }} numberOfLines={1}>{u.email}</Text>
                      {u.phone && <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 1 }}>📞 {u.phone}</Text>}
                      <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>Joined {formatDate(u.createdAt)}</Text>

                      {/* ── Host Verification Block ── */}
                      {u.role === 'host' && (
                        <View style={{
                          marginTop: 12,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: theme.border,
                          borderLeftWidth: 3,
                          borderLeftColor: verificationStatusColor(u.hostVerificationStatus),
                          backgroundColor: isDark ? theme.surfaceElevated : theme.bg,
                          overflow: 'hidden',
                        }}>
                          <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Verification
                              </Text>
                              <View style={{
                                backgroundColor: verificationStatusColor(u.hostVerificationStatus) + '22',
                                borderRadius: 6,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                              }}>
                                <Text style={{
                                  color: verificationStatusColor(u.hostVerificationStatus),
                                  fontSize: 11,
                                  fontWeight: '700',
                                  textTransform: 'uppercase',
                                }}>
                                  {u.hostVerificationStatus?.toUpperCase() || 'NONE'}
                                </Text>
                              </View>
                            </View>

                            {u.hostVerificationStatus === 'pending' && (
                              <Pressable
                                onPress={() => {
                                  setSelectedHost(u);
                                  setVerifyIdentity(false);
                                  setVerifyBank(false);
                                  setVerifyDeeds(false);
                                  setVerificationModalOpen(true);
                                }}
                                style={({ pressed }) => [{
                                  opacity: pressed ? 0.8 : 1,
                                  marginTop: 10,
                                  backgroundColor: theme.gold,
                                  borderRadius: 10,
                                  paddingVertical: 9,
                                  alignItems: 'center' as const,
                                }]}
                              >
                                <Text style={{ color: theme.textInverse, fontSize: 13, fontWeight: '700' }}>
                                  Review Onboarding Docs
                                </Text>
                              </Pressable>
                            )}
                          </View>
                        </View>
                      )}
                    </View>

                    {/* ── Actions Menu ── */}
                    <Pressable
                      onPress={() => handleActions(u)}
                      hitSlop={12}
                      style={({ pressed }) => [{
                        opacity: pressed ? 0.5 : 1,
                        padding: 6,
                        borderRadius: 8,
                        backgroundColor: pressed ? theme.surfaceElevated : 'transparent',
                      }]}
                    >
                      <MoreVertical color={theme.textMuted} size={18} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ── FAB — native ───────────────────────────────── */}
      {!isWeb && (
        <Pressable onPress={openCreate} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
          <View style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: theme.gold,
            borderRadius: 28,
            paddingHorizontal: 20,
            paddingVertical: 16,
            shadowColor: theme.gold,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}>
            <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
            <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add user</Text>
          </View>
        </Pressable>
      )}

      {/* ── FAB — web ───────────────────────────────────── */}
      {isWeb && isTab && (
        <Pressable
          onPress={openCreate}
          style={({ pressed }) => [{
            position: 'absolute',
            bottom: 100,
            right: 24,
            opacity: pressed ? 0.85 : 1,
            zIndex: 20,
          }]}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: theme.gold,
            borderRadius: 28,
            paddingHorizontal: 20,
            paddingVertical: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 20,
          }}>
            <Plus color="#fff" size={20} strokeWidth={2.5} />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Add user</Text>
          </View>
        </Pressable>
      )}

      {/* ── User Form Modal ─────────────────────────────── */}
      <Modal visible={formOpen} animationType="slide" transparent onRequestClose={() => setFormOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setFormOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: theme.borderSoft,
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 40,
              maxHeight: '85%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
              {editUser ? 'Edit user' : 'Add user'}
            </Text>

            <View style={{ marginTop: 24, gap: 16 }}>
              <View>
                <FieldLabel>Full name</FieldLabel>
                <TextInput value={formName} onChangeText={setFormName} placeholder="Full name" placeholderTextColor={theme.textMuted} style={inputStyle(theme)} />
              </View>
              <View>
                <FieldLabel>Email</FieldLabel>
                <TextInput value={formEmail} onChangeText={setFormEmail} placeholder="email@example.com" placeholderTextColor={theme.textMuted} keyboardType="email-address" autoCapitalize="none" style={inputStyle(theme)} />
              </View>
              <View>
                <FieldLabel>Password</FieldLabel>
                <TextInput value={formPassword} onChangeText={setFormPassword} placeholder="Enter password" placeholderTextColor={theme.textMuted} secureTextEntry style={inputStyle(theme)} />
              </View>
              <View>
                <FieldLabel>Role</FieldLabel>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {([
                    { id: 'admin' as UserRole, label: 'Admin', color: theme.gold },
                    { id: 'host' as UserRole, label: 'Host', color: theme.amber },
                    { id: 'customer' as UserRole, label: 'Guest', color: theme.blue },
                  ]).map((r) => (
                    <Chip
                      key={r.id}
                      label={r.label}
                      selected={formRole === r.id}
                      onPress={() => setFormRole(r.id)}
                      color={r.color}
                    />
                  ))}
                </View>
              </View>
              <View style={{ gap: 10, marginTop: 8 }}>
                <PrimaryButton label="Save user" onPress={handleSaveUser} disabled={!formName || !formEmail} />
                <SecondaryButton label="Cancel" onPress={() => setFormOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Host Verification Modal ─────────────────────── */}
      <Modal visible={verificationModalOpen} animationType="slide" transparent onRequestClose={() => setVerificationModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setVerificationModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: theme.borderSoft,
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 40,
              maxHeight: '90%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: 20 }} />

            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
              Host Onboarding Review
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 4 }}>
              Applicant: <Text style={{ color: theme.gold, fontWeight: '600' }}>{selectedHost?.name}</Text> ({selectedHost?.email})
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380, marginVertical: 16 }}>
              {/* Identity */}
              <Card style={{ marginBottom: 12, padding: 14, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>1. Verify Identity Details</Text>
                  <Switch value={verifyIdentity} onValueChange={setVerifyIdentity} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={verifyIdentity ? theme.textInverse : theme.textMuted} />
                </View>
                <View style={{ backgroundColor: theme.bg, padding: 10, borderRadius: 8, gap: 4 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Govt ID: <Text style={{ color: theme.text, fontWeight: '600' }}>{selectedHost?.govtId?.type || 'Aadhaar Card'}</Text></Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Document No: <Text style={{ color: theme.text, fontWeight: '600' }}>{selectedHost?.govtId?.number || '—'}</Text></Text>
                  <Pressable onPress={() => Alert.alert('Viewing Document', `Opening govt ID: ${selectedHost?.govtId?.documentUrl || 'govt_id_proof.png'}`)}>
                    <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600', marginTop: 4 }}>📄 View Government ID Scan</Text>
                  </Pressable>
                </View>
              </Card>

              {/* Bank */}
              <Card style={{ marginBottom: 12, padding: 14, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>2. Verify Bank Account</Text>
                  <Switch value={verifyBank} onValueChange={setVerifyBank} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={verifyBank ? theme.textInverse : theme.textMuted} />
                </View>
                <View style={{ backgroundColor: theme.bg, padding: 10, borderRadius: 8, gap: 4 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Holder: <Text style={{ color: theme.text, fontWeight: '600' }}>{selectedHost?.bankDetails?.accountHolderName || 'John Host'}</Text></Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>Account No: <Text style={{ color: theme.text, fontWeight: '600' }}>{selectedHost?.bankDetails?.bankAccountNumber || '—'}</Text></Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>IFSC: <Text style={{ color: theme.text, fontWeight: '600' }}>{selectedHost?.bankDetails?.ifscCode || '—'}</Text></Text>
                  {selectedHost?.bankDetails?.upiId && <Text style={{ color: theme.textSecondary, fontSize: 12 }}>UPI: <Text style={{ color: theme.text, fontWeight: '600' }}>{selectedHost.bankDetails.upiId}</Text></Text>}
                </View>
              </Card>

              {/* Deeds */}
              <Card style={{ marginBottom: 12, padding: 14, gap: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>3. Verify Property Ownership</Text>
                  <Switch value={verifyDeeds} onValueChange={setVerifyDeeds} trackColor={{ false: theme.border, true: theme.gold }} thumbColor={verifyDeeds ? theme.textInverse : theme.textMuted} />
                </View>
                <View style={{ backgroundColor: theme.bg, padding: 10, borderRadius: 8, gap: 4 }}>
                  <Pressable onPress={() => Alert.alert('Viewing Document', `Opening deed: ${selectedHost?.propertyProof?.ownershipProofUrl || 'deed_of_sale.pdf'}`)}>
                    <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>📄 View Ownership Deed PDF</Text>
                  </Pressable>
                  <Pressable style={{ marginTop: 4 }} onPress={() => Alert.alert('Viewing Document', `Opening bill: ${selectedHost?.propertyProof?.addressProofUrl || 'utility_bill.jpg'}`)}>
                    <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>📄 View Address/Utility Bill Scan</Text>
                  </Pressable>
                </View>
              </Card>
            </ScrollView>

            <View style={{ gap: 10 }}>
              <PrimaryButton
                label="Approve Host Onboarding"
                disabled={!verifyIdentity || !verifyBank || !verifyDeeds}
                onPress={() => {
                  if (selectedHost) {
                    approveHost(selectedHost.id);
                    setVerificationModalOpen(false);
                    Alert.alert('Host Approved', `${selectedHost.name} onboarding is successfully verified.`);
                  }
                }}
              />
              <SecondaryButton
                label="Reject Application"
                onPress={() => {
                  setVerificationModalOpen(false);
                  setHostRejectionReason('');
                  setHostRejectionModalOpen(true);
                }}
              />
              <SecondaryButton label="Cancel Review" onPress={() => setVerificationModalOpen(false)} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Host Rejection Modal ────────────────────────── */}
      <Modal visible={hostRejectionModalOpen} animationType="slide" transparent onRequestClose={() => setHostRejectionModalOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setHostRejectionModalOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: theme.borderSoft,
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 40,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View style={{ width: 42, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginBottom: 20 }} />

            <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
              Reject Host Onboarding
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Enter a feedback or document rejection reason for the host.
            </Text>

            <View style={{ marginTop: 20, gap: 16 }}>
              <View>
                <FieldLabel>Rejection Reason</FieldLabel>
                <TextInput
                  value={hostRejectionReason}
                  onChangeText={setHostRejectionReason}
                  placeholder="e.g. Bank Account IFSC code does not match Account Holder Name or Deeds are blurred."
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={{
                    backgroundColor: theme.bg,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: theme.text,
                    fontSize: 15,
                    minHeight: 100,
                  }}
                />
              </View>
              <View style={{ gap: 10 }}>
                <PrimaryButton
                  label="Confirm Rejection"
                  disabled={!hostRejectionReason.trim()}
                  onPress={() => {
                    if (selectedHost) {
                      rejectHost(selectedHost.id, hostRejectionReason);
                      setHostRejectionModalOpen(false);
                      Alert.alert('Onboarding Rejected', 'Rejection feedback has been saved and host is notified.');
                    }
                  }}
                  destructive
                />
                <SecondaryButton label="Cancel" onPress={() => setHostRejectionModalOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const inputStyle = (theme: ThemeTokens) => ({
  backgroundColor: theme.bg,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: theme.text,
  fontSize: 15,
  height: 50,
});
