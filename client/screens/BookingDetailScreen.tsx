import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  CalendarDays,
  Users,
  Mail,
  Phone,
  IndianRupee,
  CheckCircle2,
  XCircle,
  CreditCard,
  RotateCcw,
  Clock,
  AlertTriangle,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme-context';
import { Card, PrimaryButton, SecondaryButton, SourceChip, StatusBadge, Toggle } from '../components/ui';
import { useData } from '../lib/data-context';
import {
  formatMoney,
  formatDateRange,
  formatDateTime,
} from '../lib/format';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <View style={{ width: 36, alignItems: 'center' }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.textMuted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500', marginTop: 1 }}>
          {value ?? '—'}
        </Text>
      </View>
    </View>
  );
}

export default function BookingDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { bookings, respondToBooking, updateBookingDispute } = useData();
  const id = route.params?.id;
  const booking = bookings.find((b) => b.id === id);

  const [cancelOpen, setCancelOpen] = useState<boolean>(false);
  const [issueRefund, setIssueRefund] = useState<boolean>(true);
  const [note, setNote] = useState<string>('');
  
  // Dispute Modal States
  const [disputeOpen, setDisputeOpen] = useState<boolean>(false);
  const [disputeAction, setDisputeAction] = useState<'raise' | 'resolve'>('raise');
  const [disputeNotes, setDisputeNotes] = useState<string>('');

  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textSecondary, fontSize: 16 }}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const status = booking.status;
  const isCancelled = status === 'cancelled';
  const isPending = status === 'pending';

  const handleConfirm = () => {
    respondToBooking(booking.id, 'confirmed');
    Alert.alert('Booking Confirmed', 'The booking has been successfully confirmed.');
  };

  const handleConfirmCancel = () => {
    setCancelOpen(false);
    respondToBooking(booking.id, 'cancelled');
    Alert.alert('Booking Cancelled', 'The booking has been cancelled.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 8 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft color={theme.gold} size={24} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.3 }}>
            {booking.guestName}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13 }}>{booking.id}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        {/* Status banner */}
        <Card style={{ marginBottom: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isCancelled ? theme.redSoft : isPending ? theme.surfaceElevated : theme.greenSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isCancelled ? (
              <XCircle color={theme.red} size={22} />
            ) : isPending ? (
              <Clock color={theme.gold} size={22} />
            ) : (
              <CheckCircle2 color={theme.green} size={22} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
              {isCancelled ? 'Booking cancelled' : isPending ? 'Awaiting confirmation' : 'Booking confirmed'}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
              Created {formatDateTime(booking.createdAt)}
            </Text>
          </View>
          <StatusBadge status={status} />
        </Card>

        {/* Guest */}
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Guest
        </Text>
        <Card style={{ marginBottom: 16 }}>
          <InfoRow icon={<Mail color={theme.textMuted} size={18} />} label="Email" value={booking.guestEmail} />
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <InfoRow icon={<Phone color={theme.textMuted} size={18} />} label="Phone" value={booking.guestPhone} />
          {booking.specialRequests ? (
            <>
              <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
              <InfoRow icon={<CalendarDays color={theme.textMuted} size={18} />} label="Special requests" value={booking.specialRequests} />
            </>
          ) : null}
        </Card>

        {/* Stay */}
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Stay
        </Text>
        <Card style={{ marginBottom: 16 }}>
          <InfoRow icon={<CalendarDays color={theme.gold} size={18} />} label="Dates" value={formatDateRange(booking.checkIn, booking.checkOut)} />
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <InfoRow icon={<Clock color={theme.textMuted} size={18} />} label="Nights" value={`${booking.nights}`} />
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <InfoRow icon={<Users color={theme.textMuted} size={18} />} label="Guests" value={`${booking.guests}`} />
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <InfoRow icon={<IndianRupee color={theme.gold} size={18} />} label="Rate / night" value={formatMoney(booking.pricePerNight)} />
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <InfoRow
            icon={<Users color={theme.textMuted} size={18} />}
            label="Property"
            value={`${booking.roomTitle} · ${booking.roomType}`}
          />
        </Card>

        {/* Payment */}
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
          Payment
        </Text>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 36, alignItems: 'center' }}>
                <IndianRupee color={theme.gold} size={18} />
              </View>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Total Price</Text>
            </View>
            <Text style={{ color: theme.gold, fontSize: 18, fontWeight: '800' }}>
              {formatMoney(booking.totalPrice)}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48, marginVertical: 4 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingLeft: 48 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Platform Service Fee (10%)</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '500' }}>
              {formatMoney(Math.round(booking.totalPrice * 0.1))}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingLeft: 48 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Host Payout (90%)</Text>
            <Text style={{ color: theme.green, fontSize: 13, fontWeight: '600' }}>
              {formatMoney(booking.totalPrice - Math.round(booking.totalPrice * 0.1))}
            </Text>
          </View>
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48, marginVertical: 4 }} />
          <InfoRow icon={<CreditCard color={theme.textMuted} size={18} />} label="Razorpay order" value={booking.razorpayOrderId ?? null} />
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <InfoRow icon={<CheckCircle2 color={theme.textMuted} size={18} />} label="Payment ID" value={booking.razorpayPaymentId ?? null} />
          {booking.razorpayRefundId ? (
            <>
              <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
              <InfoRow icon={<RotateCcw color={theme.red} size={18} />} label="Refund ID" value={booking.razorpayRefundId} />
            </>
          ) : null}
          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingLeft: 48 }}>
            <Text style={{ color: theme.textMuted, fontSize: 12 }}>Source</Text>
            <SourceChip source={booking.source} />
          </View>
        </Card>

        {/* Dispute Resolution Card */}
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 10 }}>
          Dispute Resolution
        </Text>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Dispute Status</Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                {booking.disputeStatus === 'open' ? '⚠️ Active dispute under review' : booking.disputeStatus === 'resolved' ? '✅ Dispute resolved' : 'No active disputes'}
              </Text>
            </View>
            <View style={{ backgroundColor: booking.disputeStatus === 'open' ? theme.redSoft : booking.disputeStatus === 'resolved' ? theme.greenSoft : theme.surfaceElevated, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: booking.disputeStatus === 'open' ? theme.red : booking.disputeStatus === 'resolved' ? theme.green : theme.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                {booking.disputeStatus ?? 'none'}
              </Text>
            </View>
          </View>
          {booking.disputeNotes ? (
            <View style={{ marginTop: 12, padding: 12, backgroundColor: theme.surfaceElevated, borderRadius: 10, borderWidth: 1, borderColor: theme.border }}>
              <Text style={{ color: theme.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>Remarks:</Text>
              <Text style={{ color: theme.text, fontSize: 14, marginTop: 4 }}>{booking.disputeNotes}</Text>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {booking.disputeStatus !== 'open' ? (
              <Pressable
                onPress={() => {
                  setDisputeAction('raise');
                  setDisputeNotes(booking.disputeNotes ?? '');
                  setDisputeOpen(true);
                }}
                style={{ flex: 1, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surfaceElevated, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>Raise Dispute</Text>
              </Pressable>
            ) : null}
            {booking.disputeStatus === 'open' ? (
              <Pressable
                onPress={() => {
                  setDisputeAction('resolve');
                  setDisputeNotes('');
                  setDisputeOpen(true);
                }}
                style={{ flex: 1, backgroundColor: theme.green, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Resolve Dispute</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>

        {isCancelled && booking.cancelledAt && (
          <Card style={{ marginBottom: 16, borderColor: theme.red + '40' }}>
            <Text style={{ color: theme.red, fontSize: 14, fontWeight: '600' }}>
              Cancelled {formatDateTime(booking.cancelledAt)}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
              Cancelled by: {booking.cancelledBy}
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Actions */}
      {!isCancelled && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 32,
            gap: 10,
          }}
        >
          {isPending && (
            <PrimaryButton label="Confirm booking" onPress={handleConfirm} />
          )}
          <SecondaryButton label="Cancel booking" onPress={() => setCancelOpen(true)} />
        </View>
      )}

      {/* Cancel sheet */}
      <Modal visible={cancelOpen} animationType="slide" transparent onRequestClose={() => setCancelOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setCancelOpen(false)}>
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
              Cancel booking
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8, lineHeight: 20 }}>
              {issueRefund ? 'A Razorpay refund will be initiated for the full amount.' : 'Booking will be cancelled without a refund.'}
            </Text>

            <View style={{ marginTop: 24, gap: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '600' }}>Issue Razorpay refund</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                    {formatMoney(booking.totalPrice)}
                  </Text>
                </View>
                <Switch
                  value={issueRefund}
                  onValueChange={setIssueRefund}
                  trackColor={{ false: theme.border, true: theme.gold }}
                  thumbColor={issueRefund ? theme.textInverse : theme.textMuted}
                />
              </View>

              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
                  Note (optional)
                </Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a cancellation note…"
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
                    minHeight: 70,
                  }}
                />
              </View>

              <View style={{ gap: 10 }}>
                <PrimaryButton
                  label={issueRefund ? 'Confirm cancellation' : 'Cancel without refund'}
                  onPress={handleConfirmCancel}
                  destructive
                />
                <SecondaryButton label="Dismiss" onPress={() => setCancelOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Dispute Management Sheet */}
      <Modal visible={disputeOpen} animationType="slide" transparent onRequestClose={() => setDisputeOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setDisputeOpen(false)}>
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
              {disputeAction === 'raise' ? 'Raise Dispute' : 'Resolve Dispute'}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8, lineHeight: 20 }}>
              {disputeAction === 'raise'
                ? 'Flag this booking as disputed. Platform payouts and host adjustments will be held.'
                : 'Mark this dispute as resolved. Enter remarks/adjustments applied.'}
            </Text>

            <View style={{ marginTop: 24, gap: 20 }}>
              <View>
                <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
                  Dispute Details & Remarks
                </Text>
                <TextInput
                  value={disputeNotes}
                  onChangeText={setDisputeNotes}
                  placeholder={disputeAction === 'raise' ? 'Describe the nature of the dispute…' : 'Enter resolution details…'}
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
                  label={disputeAction === 'raise' ? 'Confirm Dispute' : 'Mark Resolved'}
                  onPress={() => {
                    setDisputeOpen(false);
                    updateBookingDispute(booking.id, disputeAction === 'raise' ? 'open' : 'resolved', disputeNotes);
                    Alert.alert(
                      disputeAction === 'raise' ? 'Dispute Raised' : 'Dispute Resolved',
                      disputeAction === 'raise' ? 'The booking has been flagged as disputed.' : 'The dispute has been resolved.'
                    );
                  }}
                  destructive={disputeAction === 'raise'}
                />
                <SecondaryButton label="Cancel" onPress={() => setDisputeOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
