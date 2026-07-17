import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Check } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import type { ThemeTokens } from '../constants/colors';
import { Card, Chip, FieldLabel, PrimaryButton, Toggle } from '../components/ui';
import { campaigns as seedCampaigns } from '../lib/mockData';
import type { CampaignAccent, CampaignStatus, CampaignType } from '../types';

export default function CampaignEditScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { campaignId } = route.params || {};
  const isEdit = Boolean(campaignId);
  const existing = useMemo(
    () => seedCampaigns.find((c) => c.campaignId === campaignId),
    [campaignId]
  );

  const [name, setName] = useState<string>(existing?.name ?? '');
  const [type, setType] = useState<CampaignType>(existing?.type ?? 'showcase');
  const [status, setStatus] = useState<CampaignStatus>(existing?.status ?? 'draft');
  const [headline, setHeadline] = useState<string>(existing?.headline ?? '');
  const [message, setMessage] = useState<string>(existing?.message ?? '');
  const [ctaLabel, setCtaLabel] = useState<string>(existing?.ctaLabel ?? '');
  const [ctaUrl, setCtaUrl] = useState<string>(existing?.ctaUrl ?? '');
  const [accent, setAccent] = useState<CampaignAccent>(existing?.accent ?? 'gold');
  const [priority, setPriority] = useState<string>(existing ? String(existing.priority) : '0');
  const [dismissible, setDismissible] = useState<boolean>(existing?.dismissible ?? true);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>
            {isEdit ? 'Edit campaign' : 'New campaign'}
          </Text>
        </View>
        <Pressable
          onPress={handleSave}
          disabled={saving || !name || !headline}
          style={({ pressed }) => [{ opacity: saving || !name || !headline ? 0.4 : pressed ? 0.6 : 1 }]}
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
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Content */}
          <Text style={sectionTitleStyle(theme)}>Content</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View>
              <FieldLabel>Name</FieldLabel>
              <TextInput value={name} onChangeText={setName} placeholder="Campaign name" placeholderTextColor={theme.textMuted} style={inputStyle(theme)} />
            </View>
            <View>
              <FieldLabel>Type</FieldLabel>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['strip', 'showcase'] as CampaignType[]).map((t) => (
                  <Chip key={t} label={t === 'strip' ? 'Strip' : 'Showcase'} selected={type === t} onPress={() => setType(t)} />
                ))}
              </View>
            </View>
            <View>
              <FieldLabel>Status</FieldLabel>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {(['draft', 'active', 'archived'] as CampaignStatus[]).map((s) => (
                  <Chip
                    key={s}
                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                    selected={status === s}
                    onPress={() => setStatus(s)}
                    color={s === 'active' ? theme.green : s === 'draft' ? theme.amber : theme.textMuted}
                  />
                ))}
              </View>
            </View>
            <View>
              <FieldLabel>Headline</FieldLabel>
              <TextInput value={headline} onChangeText={setHeadline} placeholder="Headline text" placeholderTextColor={theme.textMuted} style={inputStyle(theme)} />
            </View>
            <View>
              <FieldLabel>Message</FieldLabel>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Supporting message"
                placeholderTextColor={theme.textMuted}
                multiline
                style={[inputStyle(theme), { minHeight: 70, textAlignVertical: 'top' }]}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>CTA label</FieldLabel>
                <TextInput value={ctaLabel} onChangeText={setCtaLabel} placeholder="Book now" placeholderTextColor={theme.textMuted} style={inputStyle(theme)} />
              </View>
              <View style={{ flex: 1 }}>
                <FieldLabel>CTA URL</FieldLabel>
                <TextInput value={ctaUrl} onChangeText={setCtaUrl} placeholder="/villas" placeholderTextColor={theme.textMuted} style={inputStyle(theme)} />
              </View>
            </View>
          </Card>

          {/* Schedule */}
          <Text style={sectionTitleStyle(theme)}>Schedule</Text>
          <Card style={{ marginBottom: 20, gap: 16 }}>
            <View>
              <FieldLabel>Priority (higher = shown first)</FieldLabel>
              <TextInput value={priority} onChangeText={setPriority} placeholder="0" placeholderTextColor={theme.textMuted} keyboardType="numeric" style={inputStyle(theme)} />
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
              <Text style={{ color: theme.text, fontSize: 15 }}>Dismissible</Text>
              <Toggle value={dismissible} onValueChange={setDismissible} />
            </View>
          </Card>

          {/* Style */}
          <Text style={sectionTitleStyle(theme)}>Style</Text>
          <Card style={{ marginBottom: 20 }}>
            <FieldLabel>Accent color</FieldLabel>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {([
                { id: 'gold', label: 'Gold', color: theme.gold },
                { id: 'navy', label: 'Navy', color: theme.blue },
                { id: 'neutral', label: 'Neutral', color: theme.textSecondary },
              ] as { id: CampaignAccent; label: string; color: string }[]).map((a) => (
                <Chip key={a.id} label={a.label} selected={accent === a.id} onPress={() => setAccent(a.id)} color={a.color} />
              ))}
            </View>
          </Card>

          <PrimaryButton label={saving ? 'Saving…' : 'Save campaign'} onPress={handleSave} loading={saving} disabled={!name || !headline} />
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
