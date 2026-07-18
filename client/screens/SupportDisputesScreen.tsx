import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import { Card, Chip, EmptyState, ScreenHeader, PrimaryButton, SecondaryButton, FieldLabel } from '../components/ui';
import { useData } from '../lib/data-context';
import { formatDate } from '../lib/format';
import { LifeBuoy, AlertTriangle, ShieldAlert, CheckCircle, MessageCircle, Send, UserX, XCircle } from 'lucide-react-native';
import type { SupportTicket, ReportedItem } from '../types';

type Tab = 'tickets' | 'moderation';

export default function SupportDisputesScreen() {
  const { theme } = useTheme();
  const { supportTickets, reportedItems, resolveSupportTicket, replyToSupportTicket, moderateReportedItem } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('tickets');
  
  // Chat Modal States
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>('');

  const pendingTickets = supportTickets.filter((t) => t.status === 'open');
  const resolvedTickets = supportTickets.filter((t) => t.status === 'resolved');

  const pendingReports = reportedItems.filter((r) => r.status === 'pending');
  const resolvedReports = reportedItems.filter((r) => r.status === 'resolved');

  const handleSendChat = () => {
    if (selectedTicket && replyMessage.trim()) {
      replyToSupportTicket(selectedTicket.id, replyMessage);
      // Refresh local modal selection
      const updated = supportTickets.find((t) => t.id === selectedTicket.id);
      if (updated) {
        // Keep conversation sync
        setSelectedTicket({
          ...updated,
          messages: [
            ...updated.messages,
            { sender: 'Larosa Admin', text: replyMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        });
      }
      setReplyMessage('');
    }
  };

  const handleResolveTicket = (ticket: SupportTicket) => {
    Alert.alert(
      'Resolve Support Request?',
      'Are you sure you want to mark this ticket as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: () => {
            resolveSupportTicket(ticket.id);
            setChatOpen(false);
            Alert.alert('Ticket Resolved', 'The support ticket has been closed.');
          },
        },
      ]
    );
  };

  const handleReportAction = (report: ReportedItem, action: 'suspend' | 'dismiss') => {
    Alert.alert(
      action === 'suspend' ? 'Suspend Content?' : 'Dismiss Report?',
      action === 'suspend'
        ? `Are you sure you want to suspend this ${report.type} (${report.targetName})?`
        : `Dismiss report from ${report.reporterName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'suspend' ? 'Suspend' : 'Dismiss',
          style: action === 'suspend' ? 'destructive' : 'default',
          onPress: () => {
            moderateReportedItem(report.id, action);
            Alert.alert('Action Logged', `The reported ${report.type} has been processed.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScreenHeader title="Support Desk" subtitle="Disputes & Moderation" showBack />

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 10 }}>
        <Pressable
          onPress={() => setActiveTab('tickets')}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab === 'tickets' ? theme.gold + '22' : theme.surface,
            borderWidth: 1,
            borderColor: activeTab === 'tickets' ? theme.gold : theme.border,
          }}
        >
          <Text style={{ color: activeTab === 'tickets' ? theme.gold : theme.textSecondary, fontSize: 14, fontWeight: '700' }}>
            Tickets & Disputes ({pendingTickets.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('moderation')}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab === 'moderation' ? theme.gold + '22' : theme.surface,
            borderWidth: 1,
            borderColor: activeTab === 'moderation' ? theme.gold : theme.border,
          }}
        >
          <Text style={{ color: activeTab === 'moderation' ? theme.gold : theme.textSecondary, fontSize: 14, fontWeight: '700' }}>
            Reports & Content ({pendingReports.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Support Tickets Panel */}
        {activeTab === 'tickets' && (
          <View style={{ gap: 14 }}>
            {pendingTickets.length > 0 && <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Open Disputes & Help Request</Text>}
            
            {pendingTickets.map((t) => (
              <Card key={t.id} onPress={() => { setSelectedTicket(t); setReplyMessage(''); setChatOpen(true); }} style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{t.subject}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
                      From: <Text style={{ color: theme.gold, fontWeight: '600' }}>{t.user}</Text> ({t.role.toUpperCase()})
                    </Text>
                  </View>
                  <View style={{ backgroundColor: theme.amberSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ color: theme.amber, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{t.status}</Text>
                  </View>
                </View>
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 10, lineHeight: 20 }} numberOfLines={2}>
                  {t.message}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.borderSoft }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11 }}>Opened {formatDate(t.createdAt)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MessageCircle color={theme.gold} size={14} />
                    <Text style={{ color: theme.gold, fontSize: 12, fontWeight: '600' }}>View Messages ({t.messages.length})</Text>
                  </View>
                </View>
              </Card>
            ))}

            {pendingTickets.length === 0 && (
              <EmptyState icon={<LifeBuoy color={theme.textMuted} size={40} />} title="All tickets resolved" subtitle="No pending tickets or booking disputes currently." />
            )}

            {resolvedTickets.length > 0 && (
              <>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 16 }}>Resolved Tickets</Text>
                {resolvedTickets.map((t) => (
                  <Card key={t.id} style={{ padding: 16, opacity: 0.8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>{t.subject}</Text>
                      <View style={{ backgroundColor: theme.greenSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                        <Text style={{ color: theme.green, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>resolved</Text>
                      </View>
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>Completed by Admin. {t.messages.length} messages exchanged.</Text>
                  </Card>
                ))}
              </>
            )}
          </View>
        )}

        {/* Content Moderation / Reported Items Panel */}
        {activeTab === 'moderation' && (
          <View style={{ gap: 14 }}>
            {pendingReports.length > 0 && <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Pending Content Violations</Text>}

            {pendingReports.map((r) => (
              <Card key={r.id} style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <ShieldAlert color={theme.red} size={16} />
                      <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                        Reported {r.type === 'property' ? 'Listing' : 'Account'}
                      </Text>
                    </View>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 6 }}>
                      Target: <Text style={{ color: theme.text, fontWeight: '600' }}>{r.targetName}</Text> (ID: {r.targetId})
                    </Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                      Reporter: <Text style={{ color: theme.gold, fontWeight: '600' }}>{r.reporterName}</Text>
                    </Text>
                  </View>
                  <View style={{ backgroundColor: theme.redSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ color: theme.red, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>Pending</Text>
                  </View>
                </View>
                
                <View style={{ backgroundColor: theme.surfaceElevated, padding: 10, borderRadius: 8, marginTop: 10 }}>
                  <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '700' }}>VIOLATION REASON:</Text>
                  <Text style={{ color: theme.text, fontSize: 13, marginTop: 4 }}>{r.reason}</Text>
                </View>

                {/* Moderation Actions */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                  <Pressable
                    onPress={() => handleReportAction(r, 'suspend')}
                    style={{ flex: 1, backgroundColor: theme.red, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                  >
                    <UserX color="#fff" size={14} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Suspend Content</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleReportAction(r, 'dismiss')}
                    style={{ flex: 1, backgroundColor: theme.surfaceElevated, borderWidth: 1, borderColor: theme.border, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                  >
                    <CheckCircle color={theme.text} size={14} />
                    <Text style={{ color: theme.text, fontSize: 12, fontWeight: '600' }}>Dismiss Report</Text>
                  </Pressable>
                </View>
              </Card>
            ))}

            {pendingReports.length === 0 && (
              <EmptyState icon={<CheckCircle color={theme.textMuted} size={40} />} title="All clean!" subtitle="No reported properties or guest code violations pending." />
            )}

            {resolvedReports.length > 0 && (
              <>
                <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 16 }}>Resolved Violations Logs</Text>
                {resolvedReports.map((r) => (
                  <Card key={r.id} style={{ padding: 16, opacity: 0.8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: theme.text, fontSize: 14, fontWeight: '600' }}>{r.targetName} ({r.type})</Text>
                      <View style={{ backgroundColor: theme.greenSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                        <Text style={{ color: theme.green, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>Resolved</Text>
                      </View>
                    </View>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 4 }}>Report processed. Appropriate moderation rules applied.</Text>
                  </Card>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Chat / Support Response Modal */}
      <Modal visible={chatOpen} animationType="slide" transparent onRequestClose={() => setChatOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setChatOpen(false)}>
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
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>
                  Ticket Resolution chat
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                  User: <Text style={{ color: theme.gold, fontWeight: '600' }}>{selectedTicket?.user}</Text> ({selectedTicket?.role})
                </Text>
              </View>
              {selectedTicket?.status === 'open' && (
                <Pressable
                  onPress={() => handleResolveTicket(selectedTicket)}
                  style={{ backgroundColor: theme.green, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Resolve Ticket</Text>
                </Pressable>
              )}
            </View>

            {/* Conversation list */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 250, backgroundColor: theme.bg, borderRadius: 12, padding: 12, marginVertical: 16 }}>
              {selectedTicket?.messages.map((m, idx) => {
                const isAdmin = m.sender.includes('Admin');
                return (
                  <View
                    key={idx}
                    style={{
                      alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                      backgroundColor: isAdmin ? theme.gold + '22' : theme.surfaceElevated,
                      borderColor: isAdmin ? theme.gold : theme.border,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 12,
                      marginBottom: 10,
                      maxWidth: '85%',
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>{m.sender}</Text>
                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>{m.text}</Text>
                    <Text style={{ color: theme.textMuted, fontSize: 10, alignSelf: 'flex-end', marginTop: 4 }}>{m.time}</Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Chat Reply Input */}
            {selectedTicket?.status === 'open' ? (
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <TextInput
                  value={replyMessage}
                  onChangeText={setReplyMessage}
                  placeholder="Type official support reply…"
                  placeholderTextColor={theme.textMuted}
                  style={{
                    flex: 1,
                    backgroundColor: theme.bg,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    paddingHorizontal: 16,
                    height: 48,
                    color: theme.text,
                    fontSize: 14,
                  }}
                />
                <Pressable
                  onPress={handleSendChat}
                  disabled={!replyMessage.trim()}
                  style={({ pressed }) => [{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: theme.gold,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: !replyMessage.trim() ? 0.4 : pressed ? 0.7 : 1,
                  }]}
                >
                  <Send color={theme.textInverse} size={18} />
                </Pressable>
              </View>
            ) : (
              <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', fontStyle: 'italic', marginVertical: 8 }}>
                This support conversation is resolved and archived.
              </Text>
            )}

            <SecondaryButton label="Dismiss Window" onPress={() => setChatOpen(false)} style={{ marginTop: 12 }} />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
