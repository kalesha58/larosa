import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2, XCircle, Download, Upload, Clock } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import { Card, Chip, EmptyState } from '../components/ui';
import { syncLogs, rooms } from '../lib/mockData';
import { formatDateTime, formatDuration } from '../lib/format';

export default function SyncLogsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [roomFilter, setRoomFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return syncLogs
      .filter((l) => roomFilter === 'all' || l.roomId === Number(roomFilter))
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [roomFilter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>Sync logs</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>Airbnb import</Text>
        </View>
      </View>

      {/* Room filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 38, marginBottom: 16 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
      >
        <Chip label="All rooms" selected={roomFilter === 'all'} onPress={() => setRoomFilter('all')} />
        {rooms.map((r) => (
          <Chip
            key={r.roomId}
            label={r.title}
            selected={roomFilter === String(r.roomId)}
            onPress={() => setRoomFilter(String(r.roomId))}
          />
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Clock color={theme.textMuted} size={36} />} title="No sync runs yet" />
        ) : (
          <View style={{ gap: 10 }}>
            {filtered.map((log) => {
              const room = rooms.find((r) => r.roomId === log.roomId);
              return (
                <Card key={log.id} style={{ padding: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      {log.success ? (
                        <CheckCircle2 color={theme.green} size={20} />
                      ) : (
                        <XCircle color={theme.red} size={20} />
                      )}
                      <View>
                        <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>
                          {room?.title ?? `Room ${log.roomId}`}
                        </Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                          {formatDateTime(log.startedAt)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor: log.success ? theme.greenSoft : theme.redSoft,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ color: log.success ? theme.green : theme.red, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                        {log.success ? 'Success' : 'Failed'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 16,
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopColor: theme.borderSoft,
                      borderTopWidth: 1,
                    }}
                  >
                    {log.success ? (
                      <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <Download color={theme.green} size={14} />
                          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{log.eventsImported} imported</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <Upload color={theme.red} size={14} />
                          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>{log.eventsRemoved} removed</Text>
                        </View>
                      </>
                    ) : (
                      <Text style={{ color: theme.red, fontSize: 13 }}>
                        Error: {log.errorMessage}
                      </Text>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
                      <Clock color={theme.textMuted} size={14} />
                      <Text style={{ color: theme.textMuted, fontSize: 13 }}>
                        {formatDuration(log.startedAt, log.finishedAt)}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
