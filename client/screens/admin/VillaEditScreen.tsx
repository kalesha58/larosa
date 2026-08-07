import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Check,
  X,
  Plus,
  UserCheck,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import { FieldLabel, PrimaryButton, SecondaryButton, Toggle } from '../../components/ui';
import { amenityOptions } from '../../lib/format';
import type { RoomCategory, RoomStatus } from '../../types';

export default function VillaEditScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { rooms, users, addRoom, updateRoom } = useData();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const roomId = route.params?.roomId;
  const isEdit = Boolean(roomId);
  const existing = useMemo(
    () => rooms.find((r) => r.roomId === Number(roomId)),
    [rooms, roomId]
  );

  const [title, setTitle] = useState<string>(existing?.title ?? '');
  const [category, setCategory] = useState<RoomCategory>(existing?.category ?? 'villa');
  const [type, setType] = useState<string>(existing?.type ?? 'Villa');
  const [description, setDescription] = useState<string>(existing?.description ?? '');
  const [price, setPrice] = useState<string>(existing ? String(existing.price) : '');
  const [depositAmount, setDepositAmount] = useState<string>(existing?.deposit ? String(existing.deposit) : '');
  const [bookingMode, setBookingMode] = useState<'instant' | 'request' | 'both'>(existing?.bookingType ?? 'instant');
  const [capacity, setCapacity] = useState<string>(existing ? String(existing.capacity) : '');
  const [totalRooms, setTotalRooms] = useState<string>(existing ? String(existing.totalRooms) : '');
  const [sizeSqFt, setSizeSqFt] = useState<string>(existing?.sizeSqFt ? String(existing.sizeSqFt) : '');
  const [amenities, setAmenities] = useState<string[]>(existing?.amenities ?? []);
  const [featured, setFeatured] = useState<boolean>(existing?.featured ?? false);
  const [status, setStatus] = useState<RoomStatus>(existing?.status ?? 'active');
  const [airbnbIcalUrl, setAirbnbIcalUrl] = useState<string>(existing?.airbnbIcalUrl ?? '');
  const [airbnbCalendarUrl, setAirbnbCalendarUrl] = useState<string>(existing?.airbnbCalendarUrl ?? '');
  const [syncEnabled, setSyncEnabled] = useState<boolean>(existing?.syncEnabled ?? false);
  const [saving, setSaving] = useState<boolean>(false);

  // Qualification State Fields
  const [bedrooms, setBedrooms] = useState<string>(existing?.bedrooms ? String(existing.bedrooms) : '3');
  const [hasSwimmingPool, setHasSwimmingPool] = useState<boolean>(existing?.hasSwimmingPool ?? false);
  const [hasLawn, setHasLawn] = useState<boolean>(existing?.hasLawn ?? false);
  const [hasOnPropertyStaff, setHasOnPropertyStaff] = useState<boolean>(existing?.hasOnPropertyStaff ?? false);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const G = '#C9A14A';

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const roomPayload = {
        title,
        category,
        type,
        description,
        price: Number(price),
        capacity: Number(capacity),
        totalRooms: Number(totalRooms) || 1,
        sizeSqFt: Number(sizeSqFt) || undefined,
        amenities,
        featured,
        status: isEdit ? status : (user?.role === 'host' ? 'hidden' as const : 'active' as const),
        airbnbIcalUrl,
        airbnbCalendarUrl,
        syncEnabled,
        deposit: Number(depositAmount) || Number(price) * 2,
        bookingType: bookingMode,
        hostId: existing?.hostId ?? (user?.id ?? 'host_demo'),
        approvedByAdmin: existing?.approvedByAdmin ?? (user?.role === 'admin' ? true : false),
        images: existing?.images && existing.images.length > 0
          ? existing.images
          : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'],
        bedrooms: Number(bedrooms) || 0,
        hasSwimmingPool,
        hasLawn,
        hasOnPropertyStaff,
      };

      if (isEdit) {
        updateRoom(Number(roomId), roomPayload);
      } else {
        addRoom(roomPayload);
      }
      setSaving(false);
      navigation.goBack();
    }, 1000);
  };

  const renderSectionHeader = (titleText: string) => (
    <View style={styles.sectionHeaderRow}>
      <View style={[styles.sectionAccentBar, { backgroundColor: G }]} />
      <Text style={[styles.sectionHeaderText, { color: theme.textMuted }]}>{titleText}</Text>
    </View>
  );

  const renderPillChip = (label: string, isSelected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pillChip,
        {
          backgroundColor: isSelected ? G : theme.surface,
          borderColor: isSelected ? G : theme.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={2.5} />}
      <Text
        style={[
          styles.pillChipText,
          { color: isSelected ? '#FFFFFF' : theme.text, fontWeight: isSelected ? '700' : '600' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'android' ? 10 : 4,
          paddingBottom: 14,
          gap: 8,
          backgroundColor: Platform.OS === 'android' ? theme.gold : theme.bg,
          borderBottomLeftRadius: Platform.OS === 'android' ? 18 : 0,
          borderBottomRightRadius: Platform.OS === 'android' ? 18 : 0,
        }}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={Platform.OS === 'android' ? '#FFFFFF' : G} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: Platform.OS === 'android' ? '#FFFFFF' : theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>
            {isEdit ? 'Edit villa' : 'New villa'}
          </Text>
        </View>
        <Pressable
          onPress={handleSave}
          disabled={saving || !title || !price}
          style={({ pressed }) => [{ opacity: saving || !title || !price ? 0.4 : pressed ? 0.6 : 1 }]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: G,
              borderRadius: 20,
              paddingHorizontal: 18,
              paddingVertical: 9,
            }}
          >
            <Check color="#FFFFFF" size={16} strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Save</Text>
          </View>
        </Pressable>
      </View>

      {/* Main Content Body */}
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ══ SELF HOST BADGE ════════════════════════════════════════════ */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, backgroundColor: G + '15', borderWidth: 1, borderColor: G + '33', marginTop: 4, marginBottom: 8 }}>
              <UserCheck size={18} color={G} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: theme.text }}>
                  Self-Host Listing
                </Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                  This villa will be created & managed under your host profile ({user?.name ?? 'Demo Host'}).
                </Text>
              </View>
            </View>

            {/* ══ BASICS ════════════════════════════════════════════════════ */}
            {renderSectionHeader('BASICS')}
            <View style={styles.formGroupGap}>
              <View>
                <FieldLabel>Title</FieldLabel>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Aqua Retreat"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View>
                <FieldLabel>Category</FieldLabel>
                <View style={styles.chipRow}>
                  {(['villa', 'room'] as RoomCategory[]).map((c) =>
                    renderPillChip(c === 'villa' ? 'Villa' : 'Room', category === c, () => setCategory(c))
                  )}
                </View>
              </View>

              <View>
                <FieldLabel>Type</FieldLabel>
                <TextInput
                  value={type}
                  onChangeText={setType}
                  placeholder="e.g. Villa, Suite"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View>
                <FieldLabel>Description</FieldLabel>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe the property…"
                  placeholderTextColor={theme.textMuted}
                  multiline
                  style={[styles.modernInputArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>
            </View>

            {/* ══ PRICING & CAPACITY ════════════════════════════════════════ */}
            {renderSectionHeader('PRICING & CAPACITY')}
            <View style={styles.formGroupGap}>
              <View>
                <FieldLabel>Price per night (₹)</FieldLabel>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="25000"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <FieldLabel>Capacity</FieldLabel>
                  <TextInput
                    value={capacity}
                    onChangeText={setCapacity}
                    placeholder="6"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FieldLabel>Bedrooms</FieldLabel>
                  <TextInput
                    value={bedrooms}
                    onChangeText={setBedrooms}
                    placeholder="3"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FieldLabel>Total units</FieldLabel>
                  <TextInput
                    value={totalRooms}
                    onChangeText={setTotalRooms}
                    placeholder="1"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  />
                </View>
              </View>

              <View>
                <FieldLabel>Size (sq ft) — optional</FieldLabel>
                <TextInput
                  value={sizeSqFt}
                  onChangeText={setSizeSqFt}
                  placeholder="3500"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View>
                <FieldLabel>Security Deposit Amount (₹)</FieldLabel>
                <TextInput
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                  placeholder="e.g. 50000 (Defaults to 2x price)"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View>
                <FieldLabel>Booking Mode</FieldLabel>
                <View style={styles.chipRow}>
                  {([
                    { id: 'instant', label: 'Instant Book' },
                    { id: 'request', label: 'Request to Book' },
                    { id: 'both', label: 'Both' },
                  ] as { id: 'instant' | 'request' | 'both'; label: string }[]).map((mode) =>
                    renderPillChip(mode.label, bookingMode === mode.id, () => setBookingMode(mode.id))
                  )}
                </View>
              </View>
            </View>

            {/* ══ ADMIN QUALIFICATIONS ══════════════════════════════════════ */}
            {renderSectionHeader('ADMIN QUALIFICATIONS')}
            <View style={styles.formGroupGap}>
              <View style={[styles.toggleRowCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.toggleRowTitle, { color: theme.text }]}>Swimming Pool</Text>
                  <Text style={[styles.toggleRowSubtitle, { color: theme.textMuted }]}>Does this property have a swimming pool?</Text>
                </View>
                <Toggle value={hasSwimmingPool} onValueChange={setHasSwimmingPool} />
              </View>

              <View style={[styles.toggleRowCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.toggleRowTitle, { color: theme.text }]}>Landscaped Lawn</Text>
                  <Text style={[styles.toggleRowSubtitle, { color: theme.textMuted }]}>Does this property have a private lawn?</Text>
                </View>
                <Toggle value={hasLawn} onValueChange={setHasLawn} />
              </View>

              <View style={[styles.toggleRowCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.toggleRowTitle, { color: theme.text }]}>On-Property Assistance</Text>
                  <Text style={[styles.toggleRowSubtitle, { color: theme.textMuted }]}>Dedicated caretaker or security guard on-property?</Text>
                </View>
                <Toggle value={hasOnPropertyStaff} onValueChange={setHasOnPropertyStaff} />
              </View>
            </View>

            {/* ══ AMENITIES ═════════════════════════════════════════════════ */}
            {renderSectionHeader('AMENITIES')}
            <View style={[styles.chipRow, { marginBottom: 22 }]}>
              {amenityOptions.map((a) => renderPillChip(a, amenities.includes(a), () => toggleAmenity(a)))}
            </View>

            {/* ══ PHOTOS ════════════════════════════════════════════════════ */}
            {renderSectionHeader('PHOTOS')}
            <View style={styles.photoGrid}>
              {existing?.images.map((uri, i) => (
                <View key={i} style={styles.photoWrap}>
                  <Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
                  <Pressable style={styles.photoRemoveBtn}>
                    <X color="#FFFFFF" size={14} />
                  </Pressable>
                </View>
              ))}
              <Pressable style={[styles.photoAddBtn, { borderColor: theme.border }]}>
                <Plus color={theme.textMuted} size={24} />
              </Pressable>
            </View>

            {/* ══ VISIBILITY ═════════════════════════════════════════════════ */}
            {renderSectionHeader('VISIBILITY')}
            <View style={styles.formGroupGap}>
              <View>
                <FieldLabel>Status</FieldLabel>
                <View style={styles.chipRow}>
                  {(['active', 'hidden'] as RoomStatus[]).map((s) =>
                    renderPillChip(s === 'active' ? 'Active' : 'Hidden', status === s, () => setStatus(s))
                  )}
                </View>
              </View>

              <View style={[styles.toggleRowCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.toggleRowTitle, { color: theme.text }]}>Featured</Text>
                  <Text style={[styles.toggleRowSubtitle, { color: theme.textMuted }]}>Show on homepage explore list</Text>
                </View>
                <Toggle value={featured} onValueChange={setFeatured} />
              </View>
            </View>

            {/* ══ AIRBNB SYNC ════════════════════════════════════════════════ */}
            {renderSectionHeader('AIRBNB SYNC')}
            <View style={styles.formGroupGap}>
              <View>
                <FieldLabel>iCal URL</FieldLabel>
                <TextInput
                  value={airbnbIcalUrl}
                  onChangeText={setAirbnbIcalUrl}
                  placeholder="https://www.airbnb.com/calendar/ical/…"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View>
                <FieldLabel>Calendar URL</FieldLabel>
                <TextInput
                  value={airbnbCalendarUrl}
                  onChangeText={setAirbnbCalendarUrl}
                  placeholder="https://www.airbnb.com/rooms/…"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.modernInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              <View style={[styles.toggleRowCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={[styles.toggleRowTitle, { color: theme.text }]}>Sync Enabled</Text>
                  <Text style={[styles.toggleRowSubtitle, { color: theme.textMuted }]}>Auto-import Airbnb calendar</Text>
                </View>
                <Toggle value={syncEnabled} onValueChange={setSyncEnabled} />
              </View>

              {isEdit && existing?.syncStatus === 'ok' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 4 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.green }} />
                  <Text style={{ color: theme.green, fontSize: 12 }}>Synced · {existing.lastSyncedAt ? new Date(existing.lastSyncedAt).toLocaleString() : ''}</Text>
                </View>
              )}
            </View>

            {/* Quick actions for edit mode */}
            {isEdit && (
              <View style={{ gap: 10, marginVertical: 20 }}>
                <SecondaryButton
                  label="Open Pricing"
                  onPress={() => navigation.navigate('Pricing', { roomId: String(roomId) })}
                />
                <SecondaryButton
                  label="Open Calendar"
                  onPress={() => navigation.navigate('Calendar', { roomId: String(roomId) })}
                />
              </View>
            )}

            <View style={{ marginTop: 24 }}>
              <PrimaryButton
                label={saving ? 'Saving Villa…' : 'Save Villa Details'}
                onPress={handleSave}
                loading={saving}
                disabled={!title || !price}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 14,
  },
  sectionAccentBar: {
    width: 3.5,
    height: 14,
    borderRadius: 2,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  formGroupGap: {
    gap: 16,
    marginBottom: 16,
  },
  modernInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    height: 50,
  },
  modernInputArea: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  pillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
  },
  pillChipText: {
    fontSize: 14,
  },
  toggleRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  toggleRowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggleRowSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  photoWrap: {
    position: 'relative',
  },
  photoThumb: {
    width: 96,
    height: 96,
    borderRadius: 14,
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddBtn: {
    width: 96,
    height: 96,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
