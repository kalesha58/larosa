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
  Home,
  MoonStar,
  ShieldAlert,
  ShieldCheck,
  MessageSquareWarning,
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
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme-context';
import { PrimaryButton, SecondaryButton, SourceChip, StatusBadge } from '../../components/ui';
import { useData } from '../../lib/data-context';
import { Alert } from '../../lib/alert';
import { formatMoney, formatDateRange, formatDateTime } from '../../lib/format';

// ── InfoRow ──────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  valueColor?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
      <View style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: theme.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </Text>
        <Text style={{ color: valueColor ?? theme.text, fontSize: 15, fontWeight: '600', marginTop: 2 }}>
          {value ?? '—'}
        </Text>
      </View>
    </View>
  );
}

// ── Section heading ──────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  const { theme } = useTheme();
  return (
    <Text style={{
      color: theme.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 10,
      marginTop: 4,
    }}>
      {label}
    </Text>
  );
}

// ── Divider ──────────────────────────────────────────────
function Divider() {
  const { theme } = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 52 }} />;
}

// ── Section Card ─────────────────────────────────────────
function SectionCard({ children, accentColor }: { children: React.ReactNode; accentColor?: string }) {
  const { theme } = useTheme();
  return (
    <View style={{
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      borderLeftWidth: accentColor ? 4 : 1,
      borderLeftColor: accentColor ?? theme.border,
      marginBottom: 16,
      overflow: 'hidden',
      paddingHorizontal: 16,
    }}>
      {children}
    </View>
  );
}

// ── Payment row ──────────────────────────────────────────
function PaymentRow({
  label,
  value,
  bold,
  valueColor,
  labelColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
  labelColor?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 }}>
      <Text style={{ color: labelColor ?? theme.textSecondary, fontSize: bold ? 15 : 13, fontWeight: bold ? '700' : '500' }}>
        {label}
      </Text>
      <Text style={{ color: valueColor ?? theme.text, fontSize: bold ? 17 : 14, fontWeight: bold ? '800' : '600' }}>
        {value}
      </Text>
    </View>
  );
}

// ────────────────────────────────────────────────────────
export default function BookingDetailScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { bookings, respondToBooking, updateBookingDispute } = useData();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = isWeb && width >= 768;

  const id = route.params?.id;
  const booking = bookings.find((b) => b.id === id);

  const [cancelOpen, setCancelOpen] = useState<boolean>(false);
  const [issueRefund, setIssueRefund] = useState<boolean>(true);
  const [note, setNote] = useState<string>('');

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
  const isConfirmed = status === 'confirmed';

  // Status colour set
  const statusColor = isCancelled ? theme.red : isPending ? theme.amber : theme.green;
  const statusSoft = isCancelled ? theme.redSoft : isPending ? theme.amberSoft : theme.greenSoft;
  const statusLabel = isCancelled ? 'Booking Cancelled' : isPending ? 'Awaiting Confirmation' : 'Booking Confirmed';

  const handleConfirm = () => {
    respondToBooking(booking.id, 'confirmed');
    Alert.alert('Booking Confirmed', 'The booking has been successfully confirmed.');
  };

  const handleConfirmCancel = () => {
    setCancelOpen(false);
    respondToBooking(booking.id, 'cancelled');
    Alert.alert('Booking Cancelled', 'The booking has been cancelled.');
  };

  const contentPad = isWide
    ? { maxWidth: 720, width: '100%' as const, alignSelf: 'center' as const, paddingHorizontal: 32 }
    : { paddingHorizontal: 20 };

  const serviceFee = Math.round(booking.totalPrice * 0.1);
  const hostPayout = booking.totalPrice - serviceFee;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>

      {/* ── Header ──────────────────────────────────────── */}
      <View style={[{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 14,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }, contentPad]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={({ pressed }) => [{
            opacity: pressed ? 0.5 : 1,
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: theme.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
          }]}
        >
          <ArrowLeft color={theme.gold} size={20} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 19, fontWeight: '800', letterSpacing: -0.4 }} numberOfLines={1}>
            {booking.guestName}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11, fontFamily: 'monospace', marginTop: 1, letterSpacing: 0.3 }}>
            #{booking.id.toUpperCase()}
          </Text>
        </View>

        <StatusBadge status={status} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingTop: 20, paddingBottom: 120 }, contentPad]}
      >
        {/* ── Status Banner ───────────────────────────────── */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          backgroundColor: statusSoft,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: statusColor + '35',
          borderLeftWidth: 4,
          borderLeftColor: statusColor,
          padding: 16,
          marginBottom: 20,
        }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: statusColor + '22',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isCancelled
              ? <XCircle color={statusColor} size={22} />
              : isPending
                ? <Clock color={statusColor} size={22} />
                : <CheckCircle2 color={statusColor} size={22} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: statusColor, fontSize: 15, fontWeight: '800' }}>{statusLabel}</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
              Created {formatDateTime(booking.createdAt)}
            </Text>
          </View>
          <SourceChip source={booking.source} />
        </View>

        {/* ── Guest ───────────────────────────────────────── */}
        <SectionLabel label="Guest" />
        <SectionCard accentColor={theme.blue + '80'}>
          <InfoRow icon={<Mail color={theme.blue} size={16} />} label="Email" value={booking.guestEmail} />
          <Divider />
          <InfoRow icon={<Phone color={theme.textMuted} size={16} />} label="Phone" value={booking.guestPhone} />
          {booking.specialRequests ? (
            <>
              <Divider />
              <InfoRow icon={<MessageSquareWarning color={theme.amber} size={16} />} label="Special Requests" value={booking.specialRequests} valueColor={theme.amber} />
            </>
          ) : null}
        </SectionCard>

        {/* ── Stay ────────────────────────────────────────── */}
        <SectionLabel label="Stay" />
        <SectionCard accentColor={theme.gold + '99'}>
          <InfoRow icon={<CalendarDays color={theme.gold} size={16} />} label="Dates" value={formatDateRange(booking.checkIn, booking.checkOut)} valueColor={theme.gold} />
          <Divider />
          <InfoRow icon={<MoonStar color={theme.textMuted} size={16} />} label="Nights" value={`${booking.nights} night${booking.nights !== 1 ? 's' : ''}`} />
          <Divider />
          <InfoRow icon={<Users color={theme.textMuted} size={16} />} label="Guests" value={`${booking.guests} guest${booking.guests !== 1 ? 's' : ''}`} />
          <Divider />
          <InfoRow icon={<IndianRupee color={theme.gold} size={16} />} label="Rate / Night" value={formatMoney(booking.pricePerNight)} valueColor={theme.gold} />
          <Divider />
          <InfoRow icon={<Home color={theme.textMuted} size={16} />} label="Property" value={`${booking.roomTitle} · ${booking.roomType}`} />
        </SectionCard>

        {/* ── Payment ─────────────────────────────────────── */}
        <SectionLabel label="Payment" />
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.border,
          borderLeftWidth: 4,
          borderLeftColor: theme.green + '99',
          marginBottom: 16,
          overflow: 'hidden',
          paddingHorizontal: 16,
        }}>
          {/* Total — prominent */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: theme.gold + '18',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IndianRupee color={theme.gold} size={16} />
              </View>
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Total Price</Text>
            </View>
            <Text style={{ color: theme.gold, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>
              {formatMoney(booking.totalPrice)}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />

          {/* Breakdown */}
          <View style={{ paddingLeft: 48 }}>
            <PaymentRow
              label="Platform Service Fee (10%)"
              value={formatMoney(serviceFee)}
              labelColor={theme.textMuted}
            />
            <View style={{ height: 1, backgroundColor: theme.borderSoft }} />
            <PaymentRow
              label="Host Payout (90%)"
              value={formatMoney(hostPayout)}
              valueColor={theme.green}
            />
          </View>

          {/* Razorpay IDs */}
          {(booking.razorpayOrderId || booking.razorpayPaymentId || booking.razorpayRefundId) && (
            <>
              <View style={{ height: 1, backgroundColor: theme.borderSoft, marginLeft: 48 }} />
              {booking.razorpayOrderId ? (
                <InfoRow icon={<CreditCard color={theme.textMuted} size={15} />} label="Razorpay Order" value={booking.razorpayOrderId} />
              ) : null}
              {booking.razorpayPaymentId ? (
                <>
                  <Divider />
                  <InfoRow icon={<CheckCircle2 color={theme.green} size={15} />} label="Payment ID" value={booking.razorpayPaymentId} valueColor={theme.green} />
                </>
              ) : null}
              {booking.razorpayRefundId ? (
                <>
                  <Divider />
                  <InfoRow icon={<RotateCcw color={theme.red} size={15} />} label="Refund ID" value={booking.razorpayRefundId} valueColor={theme.red} />
                </>
              ) : null}
            </>
          )}
        </View>

        {/* ── Cancellation notice ─────────────────────────── */}
        {isCancelled && booking.cancelledAt && (
          <View style={{
            backgroundColor: theme.redSoft,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: theme.red + '40',
            borderLeftWidth: 4,
            borderLeftColor: theme.red,
            padding: 14,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <XCircle color={theme.red} size={20} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.red, fontSize: 14, fontWeight: '700' }}>
                Cancelled {formatDateTime(booking.cancelledAt)}
              </Text>
              {booking.cancelledBy ? (
                <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 3 }}>
                  By: {booking.cancelledBy}
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {/* ── Dispute Resolution ───────────────────────────── */}
        <SectionLabel label="Dispute Resolution" />
        <View style={{
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.border,
          borderLeftWidth: 4,
          borderLeftColor:
            booking.disputeStatus === 'open' ? theme.red
            : booking.disputeStatus === 'resolved' ? theme.green
            : theme.borderSoft,
          marginBottom: 20,
          padding: 16,
        }}>
          {/* Status row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor:
                  booking.disputeStatus === 'open' ? theme.redSoft
                  : booking.disputeStatus === 'resolved' ? theme.greenSoft
                  : theme.surfaceElevated,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {booking.disputeStatus === 'open'
                  ? <ShieldAlert color={theme.red} size={18} />
                  : booking.disputeStatus === 'resolved'
                    ? <ShieldCheck color={theme.green} size={18} />
                    : <AlertTriangle color={theme.textMuted} size={18} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Dispute Status</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 2 }}>
                  {booking.disputeStatus === 'open'
                    ? 'Active dispute under review'
                    : booking.disputeStatus === 'resolved'
                      ? 'Dispute resolved'
                      : 'No active disputes'}
                </Text>
              </View>
            </View>

            {/* Status pill */}
            <View style={{
              backgroundColor:
                booking.disputeStatus === 'open' ? theme.redSoft
                : booking.disputeStatus === 'resolved' ? theme.greenSoft
                : theme.surfaceElevated,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 1,
              borderColor:
                booking.disputeStatus === 'open' ? theme.red + '40'
                : booking.disputeStatus === 'resolved' ? theme.green + '40'
                : theme.border,
            }}>
              <Text style={{
                color: booking.disputeStatus === 'open' ? theme.red
                  : booking.disputeStatus === 'resolved' ? theme.green
                  : theme.textMuted,
                fontSize: 11,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                {booking.disputeStatus ?? 'None'}
              </Text>
            </View>
          </View>

          {/* Remarks */}
          {booking.disputeNotes ? (
            <View style={{
              marginTop: 14,
              padding: 12,
              backgroundColor: isDark ? theme.surfaceElevated : theme.bg,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              borderLeftWidth: 3,
              borderLeftColor: theme.amber,
            }}>
              <Text style={{ color: theme.textMuted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Remarks
              </Text>
              <Text style={{ color: theme.text, fontSize: 14, lineHeight: 20 }}>{booking.disputeNotes}</Text>
            </View>
          ) : null}

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {booking.disputeStatus !== 'open' ? (
              <Pressable
                onPress={() => {
                  setDisputeAction('raise');
                  setDisputeNotes(booking.disputeNotes ?? '');
                  setDisputeOpen(true);
                }}
                style={({ pressed }) => [{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  borderWidth: 1,
                  borderColor: theme.red + '60',
                  backgroundColor: pressed ? theme.redSoft : 'transparent',
                  paddingVertical: 12,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                }]}
              >
                <ShieldAlert color={theme.red} size={14} />
                <Text style={{ color: theme.red, fontSize: 13, fontWeight: '700' }}>Raise Dispute</Text>
              </Pressable>
            ) : null}

            {booking.disputeStatus === 'open' ? (
              <Pressable
                onPress={() => {
                  setDisputeAction('resolve');
                  setDisputeNotes('');
                  setDisputeOpen(true);
                }}
                style={({ pressed }) => [{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: pressed ? theme.green + 'CC' : theme.green,
                  paddingVertical: 12,
                  borderRadius: 12,
                  opacity: pressed ? 0.85 : 1,
                }]}
              >
                <ShieldCheck color="#fff" size={14} />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Resolve Dispute</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* ── Action Bar ──────────────────────────────────── */}
      {!isCancelled && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 32,
          gap: 10,
        }}>
          {isWide ? (
            <View style={{ maxWidth: 720, width: '100%', alignSelf: 'center', gap: 10 }}>
              {isPending && <PrimaryButton label="Confirm booking" onPress={handleConfirm} />}
              <SecondaryButton label="Cancel booking" onPress={() => setCancelOpen(true)} />
            </View>
          ) : (
            <>
              {isPending && <PrimaryButton label="Confirm booking" onPress={handleConfirm} />}
              <SecondaryButton label="Cancel booking" onPress={() => setCancelOpen(true)} />
            </>
          )}
        </View>
      )}

      {/* ── Cancel Sheet ────────────────────────────────── */}
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

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <XCircle color={theme.red} size={22} />
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
                Cancel booking
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>
              {issueRefund
                ? 'A Razorpay refund will be initiated for the full amount.'
                : 'Booking will be cancelled without a refund.'}
            </Text>

            <View style={{ marginTop: 24, gap: 20 }}>
              {/* Refund toggle */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: theme.bg,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.border,
                padding: 16,
              }}>
                <View>
                  <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>Issue Razorpay Refund</Text>
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

              {/* Note */}
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
                  label={issueRefund ? 'Confirm cancellation & refund' : 'Cancel without refund'}
                  onPress={handleConfirmCancel}
                  destructive
                />
                <SecondaryButton label="Dismiss" onPress={() => setCancelOpen(false)} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Dispute Sheet ────────────────────────────────── */}
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

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {disputeAction === 'raise'
                ? <ShieldAlert color={theme.red} size={22} />
                : <ShieldCheck color={theme.green} size={22} />}
              <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
                {disputeAction === 'raise' ? 'Raise Dispute' : 'Resolve Dispute'}
              </Text>
            </View>
            <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>
              {disputeAction === 'raise'
                ? 'Flag this booking as disputed. Platform payouts and host adjustments will be held.'
                : 'Mark this dispute as resolved. Enter remarks / adjustments applied.'}
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
                      disputeAction === 'raise'
                        ? 'The booking has been flagged as disputed.'
                        : 'The dispute has been resolved.'
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
