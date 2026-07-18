import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Check,
  X,
  Plus,
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { useData } from '../../lib/data-context';
import type { ThemeTokens } from '../../constants/colors';
import { Card, Chip, FieldLabel, PrimaryButton, SecondaryButton, Toggle } from '../../components/ui';
import { amenityOptions } from '../../lib/format';
import type { Room, RoomCategory, RoomStatus } from '../../types';

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

  const hostUsers = useMemo(() => users.filter((u) => u.role === 'host'), [users]);

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
  const [selectedHostId, setSelectedHostId] = useState<string | undefined>(
    existing?.hostId ?? (user?.role === 'host' ? user.id : hostUsers[0]?.id)
  );

  // Qualification State Fields
  const [bedrooms, setBedrooms] = useState<string>(existing?.bedrooms ? String(existing.bedrooms) : '3');
  const [hasSwimmingPool, setHasSwimmingPool] = useState<boolean>(existing?.hasSwimmingPool ?? false);
  const [hasLawn, setHasLawn] = useState<boolean>(existing?.hasLawn ?? false);
  const [hasOnPropertyStaff, setHasOnPropertyStaff] = useState<boolean>(existing?.hasOnPropertyStaff ?? false);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

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
        // If a host is saving a new listing, it is hidden by default pending approval
        status: isEdit ? status : (user?.role === 'host' ? 'hidden' as const : 'active' as const),
        airbnbIcalUrl,
        airbnbCalendarUrl,
        syncEnabled,
        deposit: Number(depositAmount) || Number(price) * 2,
        bookingType: bookingMode,
        hostId: user?.role === 'host' ? user.id : selectedHostId,
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 12,
          gap: 8,
        }}
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>
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
              backgroundColor: theme.gold,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Check color={theme.textInverse} size={18} strokeWidth={2.5} />
            <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>Save</Text>
          </View>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basics */}
          <Text style={sectionTitleStyle(theme)}>Basics</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View>
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Aqua Retreat"
                placeholderTextColor={theme.textMuted}
                style={inputStyle(theme)}
              />
            </View>
            {user?.role === 'admin' ? (
              <View>
                <FieldLabel>Host</FieldLabel>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {hostUsers.length === 0 ? (
                    <Text style={{ color: theme.textMuted, fontSize: 13 }}>No hosts available</Text>
                  ) : (
                    hostUsers.map((h) => (
                      <Chip
                        key={h.id}
                        label={h.name}
                        selected={selectedHostId === h.id}
                        onPress={() => setSelectedHostId(h.id)}
                      />
                    ))
                  )}
                </View>
              </View>
            ) : null}
            <View>
              <FieldLabel>Category</FieldLabel>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['villa', 'room'] as RoomCategory[]).map((c) => (
                  <Chip
                    key={c}
                    label={c === 'villa' ? 'Villa' : 'Room'}
                    selected={category === c}
                    onPress={() => setCategory(c)}
                  />
                ))}
              </View>
            </View>
            <View>
              <FieldLabel>Type</FieldLabel>
              <TextInput
                value={type}
                onChangeText={setType}
                placeholder="e.g. Villa, Suite"
                placeholderTextColor={theme.textMuted}
                style={inputStyle(theme)}
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
                style={[inputStyle(theme), { minHeight: 80, textAlignVertical: 'top' }]}
              />
            </View>
          </Card>

          {/* Pricing & capacity */}
          <Text style={sectionTitleStyle(theme)}>Pricing & capacity</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View>
              <FieldLabel>Price per night (₹)</FieldLabel>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="25000"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                style={inputStyle(theme)}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Capacity</FieldLabel>
                <TextInput
                  value={capacity}
                  onChangeText={setCapacity}
                  placeholder="6"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={inputStyle(theme)}
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
                  style={inputStyle(theme)}
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
                  style={inputStyle(theme)}
                />
              </View>
            </View>
            <View style={{ marginBottom: 12 }}>
              <FieldLabel>Size (sq ft) — optional</FieldLabel>
              <TextInput
                value={sizeSqFt}
                onChangeText={setSizeSqFt}
                placeholder="3500"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                style={inputStyle(theme)}
              />
            </View>

            <View style={{ marginBottom: 12 }}>
              <FieldLabel>Security Deposit Amount (₹)</FieldLabel>
              <TextInput
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder="e.g. 50000 (Defaults to 2x price)"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                style={inputStyle(theme)}
              />
            </View>

            <View>
              <FieldLabel>Booking Mode</FieldLabel>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {([
                  { id: 'instant', label: 'Instant Book' },
                  { id: 'request', label: 'Request to Book' },
                  { id: 'both', label: 'Both' },
                ] as { id: 'instant' | 'request' | 'both'; label: string }[]).map((mode) => (
                  <Chip
                    key={mode.id}
                    label={mode.label}
                    selected={bookingMode === mode.id}
                    onPress={() => setBookingMode(mode.id)}
                  />
                ))}
              </View>
            </View>
          </Card>

          {/* Admin Qualifications */}
          <Text style={sectionTitleStyle(theme)}>Admin Qualifications</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Swimming Pool</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Does this property have a swimming pool?</Text>
              </View>
              <Toggle value={hasSwimmingPool} onValueChange={setHasSwimmingPool} />
            </View>
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginVertical: 4 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Landscaped Lawn</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Does this property have a private lawn?</Text>
              </View>
              <Toggle value={hasLawn} onValueChange={setHasLawn} />
            </View>
            <View style={{ height: 1, backgroundColor: theme.borderSoft, marginVertical: 4 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>On-Property Assistance</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Dedicated caretaker or security guard on-property?</Text>
              </View>
              <Toggle value={hasOnPropertyStaff} onValueChange={setHasOnPropertyStaff} />
            </View>
          </Card>

          {/* Amenities */}
          <Text style={sectionTitleStyle(theme)}>Amenities</Text>
          <Card style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {amenityOptions.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  selected={amenities.includes(a)}
                  onPress={() => toggleAmenity(a)}
                />
              ))}
            </View>
          </Card>

          {/* Photos */}
          <Text style={sectionTitleStyle(theme)}>Photos</Text>
          <Card style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {existing?.images.map((uri, i) => (
                <View key={i} style={{ position: 'relative' }}>
                  <Image
                    source={{ uri }}
                    style={{ width: 100, height: 100, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X color="#fff" size={14} />
                  </Pressable>
                </View>
              ))}
              <Pressable
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: theme.border,
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus color={theme.textMuted} size={24} />
              </Pressable>
            </View>
          </Card>

          {/* Visibility */}
          <Text style={sectionTitleStyle(theme)}>Visibility</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View>
              <FieldLabel>Status</FieldLabel>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['active', 'hidden'] as RoomStatus[]).map((s) => (
                  <Chip
                    key={s}
                    label={s === 'active' ? 'Active' : 'Hidden'}
                    selected={status === s}
                    onPress={() => setStatus(s)}
                    color={s === 'active' ? theme.green : theme.textMuted}
                  />
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTopColor: theme.borderSoft,
                borderTopWidth: 1,
              }}
            >
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Featured</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Show on homepage</Text>
              </View>
              <Toggle value={featured} onValueChange={setFeatured} />
            </View>
          </Card>

          {/* Airbnb sync */}
          <Text style={sectionTitleStyle(theme)}>Airbnb sync</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View>
              <FieldLabel>iCal URL</FieldLabel>
              <TextInput
                value={airbnbIcalUrl}
                onChangeText={setAirbnbIcalUrl}
                placeholder="https://www.airbnb.com/calendar/ical/…"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                style={inputStyle(theme)}
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
                style={inputStyle(theme)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 8,
                borderTopColor: theme.borderSoft,
                borderTopWidth: 1,
              }}
            >
              <View>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Sync enabled</Text>
                <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>Auto-import Airbnb calendar</Text>
              </View>
              <Toggle value={syncEnabled} onValueChange={setSyncEnabled} />
            </View>
            {isEdit && existing?.syncStatus === 'ok' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 4 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: theme.green }} />
                <Text style={{ color: theme.green, fontSize: 12 }}>Synced · {existing.lastSyncedAt ? new Date(existing.lastSyncedAt).toLocaleString() : ''}</Text>
              </View>
            )}
          </Card>

          {/* Quick actions for edit mode */}
          {isEdit && (
            <View style={{ gap: 10, marginBottom: 20 }}>
              <SecondaryButton
                label="Open pricing"
                onPress={() => navigation.navigate('Pricing', { roomId: String(roomId) })}
              />
              <SecondaryButton
                label="Open calendar"
                onPress={() => navigation.navigate('Calendar', { roomId: String(roomId) })}
              />
            </View>
          )}

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save'}
            onPress={handleSave}
            loading={saving}
            disabled={!title || !price}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const sectionTitleStyle = (theme: ThemeTokens) => ({
  color: theme.textSecondary,
  fontSize: 12,
  fontWeight: '700' as const,
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  marginBottom: 10,
});

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
