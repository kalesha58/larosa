import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Plus, MoreVertical, Megaphone, Image as ImageIcon } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import type { ThemeTokens } from '../../constants/colors';
import { Card, Chip, EmptyState } from '../../components/ui';
import { campaigns as seedCampaigns } from '../../lib/mockData';
import type { Campaign, CampaignStatus } from '../../types';

const accentColor = (theme: ThemeTokens): Record<string, string> => ({
  gold: theme.gold,
  navy: theme.blue,
  neutral: theme.textSecondary,
});

type Filter = 'all' | CampaignStatus;

export default function CampaignsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const acMap = accentColor(theme);
  const [filter, setFilter] = useState<Filter>('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);

  const filtered = useMemo(
    () => campaigns.filter((c) => filter === 'all' || c.status === filter),
    [campaigns, filter]
  );

  const handleActions = useCallback(
    (c: Campaign) => {
      Alert.alert(c.name, undefined, [
        { text: 'Edit', onPress: () => navigation.navigate('CampaignEdit', { campaignId: c.campaignId }) },
        {
          text: 'Archive',
          onPress: () =>
            setCampaigns((prev) =>
              prev.map((x) => (x.campaignId === c.campaignId ? { ...x, status: 'archived' as CampaignStatus } : x))
            ),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setCampaigns((prev) => prev.filter((x) => x.campaignId !== c.campaignId)),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    [navigation]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Campaigns</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        {([
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'draft', label: 'Draft' },
          { id: 'archived', label: 'Archived' },
        ] as { id: Filter; label: string }[]).map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
            color={f.id === 'active' ? theme.green : f.id === 'draft' ? theme.amber : f.id === 'archived' ? theme.textMuted : theme.gold}
          />
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Megaphone color={theme.textMuted} size={36} />} title="No campaigns yet" />
        ) : (
          <View style={{ gap: 14 }}>
            {filtered.map((c) => {
              const ac = acMap[c.accent] ?? theme.gold;
              return (
                <Pressable
                  key={c.campaignId}
                  onPress={() => navigation.navigate('CampaignEdit', { campaignId: c.campaignId })}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <Card style={{ padding: 0, overflow: 'hidden' }}>
                    {c.imageUrl ? (
                      <Image source={{ uri: c.imageUrl }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: 80,
                          backgroundColor: ac + '15',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon color={ac} size={28} />
                      </View>
                    )}
                    <View style={{ padding: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View
                            style={{
                              backgroundColor: c.type === 'showcase' ? theme.gold + '22' : theme.blueSoft,
                              borderRadius: 6,
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                            }}
                          >
                            <Text style={{ color: c.type === 'showcase' ? theme.gold : theme.blue, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                              {c.type}
                            </Text>
                          </View>
                          <View
                            style={{
                              backgroundColor: c.status === 'active' ? theme.greenSoft : c.status === 'draft' ? theme.amberSoft : theme.surfaceElevated,
                              borderRadius: 6,
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                            }}
                          >
                            <Text style={{ color: c.status === 'active' ? theme.green : c.status === 'draft' ? theme.amber : theme.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                              {c.status}
                            </Text>
                          </View>
                        </View>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation?.();
                            handleActions(c);
                          }}
                          hitSlop={12}
                          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, padding: 4 }]}
                        >
                          <MoreVertical color={theme.textSecondary} size={18} />
                        </Pressable>
                      </View>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700', marginTop: 10 }}>
                        {c.headline}
                      </Text>
                      {c.message ? (
                        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4, lineHeight: 18 }}>
                          {c.message}
                        </Text>
                      ) : null}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
                        <Text style={{ color: ac, fontSize: 12, fontWeight: '600' }}>Accent: {c.accent}</Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12 }}>Priority: {c.priority}</Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => navigation.navigate('CampaignEdit')}
        style={({ pressed }) => [{
          position: 'absolute',
          bottom: 24,
          right: 24,
          opacity: pressed ? 0.85 : 1
        }]}
      >
        <View
          style={{
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
          <Text style={{ color: theme.textInverse, fontSize: 15, fontWeight: '700' }}>New campaign</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
