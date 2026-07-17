import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, Search, MoreVertical, Shield, User as UserIcon } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import type { ThemeTokens } from '../constants/colors';
import { Card, Chip, EmptyState, FieldLabel, PrimaryButton, SecondaryButton } from '../components/ui';
import { users as seedUsers } from '../lib/mockData';
import { formatDate } from '../lib/format';
import type { AdminUser, UserRole } from '../types';

export default function UsersScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [query, setQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [users, setUsers] = useState<AdminUser[]>(seedUsers);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formPassword, setFormPassword] = useState<string>('');
  const [formRole, setFormRole] = useState<UserRole>('user');

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
      Alert.alert(u.name, undefined, [
        { text: 'Edit', onPress: () => openEdit(u) },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Remove ' + u.name + '?', 'They will lose access.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', style: 'destructive', onPress: () => setUsers((prev) => prev.filter((x) => x.id !== u.id)) },
            ]),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    []
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
    setFormRole('user');
    setFormOpen(true);
  };

  const handleSaveUser = () => {
    if (editUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, name: formName, email: formEmail, role: formRole } : u))
      );
    } else {
      const newUser: AdminUser = {
        id: 'usr_' + Date.now(),
        name: formName,
        email: formEmail,
        role: formRole,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setFormOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Users</Text>
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 16,
            height: 48,
            gap: 10,
          }}
        >
          <Search color={theme.textMuted} size={20} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search users…" placeholderTextColor={theme.textMuted} style={{ flex: 1, color: theme.text, fontSize: 15 }} />
        </View>
      </View>

      {/* Role filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {([
          { id: 'all', label: 'All' },
          { id: 'admin', label: 'Admins' },
          { id: 'user', label: 'Guests' },
        ] as { id: 'all' | UserRole; label: string }[]).map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={roleFilter === f.id}
            onPress={() => setRoleFilter(f.id)}
            color={f.id === 'admin' ? theme.gold : f.id === 'user' ? theme.blue : theme.gold}
          />
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<UserIcon color={theme.textMuted} size={36} />} title="No users found" />
        ) : (
          <View style={{ gap: 10 }}>
            {filtered.map((u) => (
              <Card key={u.id} style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: u.role === 'admin' ? theme.gold + '22' : theme.surfaceElevated,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: u.role === 'admin' ? theme.gold : theme.border,
                  }}
                >
                  <Text style={{ color: u.role === 'admin' ? theme.gold : theme.text, fontSize: 18, fontWeight: '700' }}>
                    {u.name.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>{u.name}</Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>{u.email}</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>Joined {formatDate(u.createdAt)}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: u.role === 'admin' ? theme.gold + '22' : theme.blueSoft,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {u.role === 'admin' && <Shield color={theme.gold} size={11} />}
                  <Text style={{ color: u.role === 'admin' ? theme.gold : theme.blue, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                    {u.role === 'admin' ? 'Admin' : 'Guest'}
                  </Text>
                </View>
                <Pressable onPress={() => handleActions(u)} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, padding: 4 }]}>
                  <MoreVertical color={theme.textSecondary} size={18} />
                </Pressable>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable onPress={openCreate} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        <View
          style={{
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
          }}
        >
          <Plus color={theme.textInverse} size={22} strokeWidth={2.5} />
          <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Add user</Text>
        </View>
      </Pressable>

      {/* User form modal */}
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
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {(['admin', 'user'] as UserRole[]).map((r) => (
                    <Chip key={r} label={r === 'admin' ? 'Admin' : 'Guest'} selected={formRole === r} onPress={() => setFormRole(r)} color={r === 'admin' ? theme.gold : theme.blue} />
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
