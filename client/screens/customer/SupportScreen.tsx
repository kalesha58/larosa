import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Phone, Mail, MessageSquare, ChevronDown, ChevronUp,
  HelpCircle, Clock, CheckCircle,
} from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

const FAQS = [
  {
    q: 'How does the booking process work?',
    a: 'Browse properties, select your dates, choose number of guests, and proceed to payment. Instant Book properties confirm immediately. Request Book properties require host approval within 24 hours.',
  },
  {
    q: 'What is the deposit and platform fee?',
    a: 'A refundable deposit is charged at booking to secure your reservation. A 10% platform fee covers our service, payment processing, and 24/7 support. The remaining balance is due at check-in.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Free cancellation up to 7 days before check-in. 50% refund within 3–7 days. No refund within 3 days of check-in. Cancellations can be made from the Booking Details screen.',
  },
  {
    q: 'How do I contact the caretaker?',
    a: 'Caretaker details (name and phone) are available in your Booking Details screen and on the Property Detail page. You can call or message them directly.',
  },
  {
    q: 'Is my payment secure?',
    a: 'Yes! All payments are processed through Razorpay with 256-bit SSL encryption. We support UPI, Cards, and Net Banking. Your payment information is never stored on our servers.',
  },
  {
    q: 'Can I modify my booking dates?',
    a: 'Date modifications depend on property availability. Contact our support team at least 48 hours in advance and we\'ll do our best to accommodate the change.',
  },
];

export default function SupportScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (message.length > 0) {
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: 'rgba(201,161,74,0.08)', borderColor: 'rgba(201,161,74,0.2)' }]}>
          <Text style={styles.heroEmoji}>🤝</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>How can we help you?</Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Our team is available 24/7 to assist you with bookings, payments, and property queries.
          </Text>
          <View style={[styles.responseTime, { backgroundColor: 'rgba(46,125,50,0.12)' }]}>
            <Clock size={13} color="#2E7D32" />
            <Text style={[styles.responseTimeText, { color: '#2E7D32' }]}>
              Average response: &lt;2 hours
            </Text>
          </View>
        </View>

        {/* Quick contacts */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Us</Text>
        <View style={styles.contactGrid}>
          {[
            { emoji: '📞', label: 'Call', sub: '+91 98765 43210', bg: 'rgba(46,125,50,0.08)', border: 'rgba(46,125,50,0.2)', color: '#2E7D32' },
            { emoji: '✉️', label: 'Email', sub: 'support@larosa.in', bg: 'rgba(201,161,74,0.08)', border: 'rgba(201,161,74,0.2)', color: '#C9A14A' },
            { emoji: '💬', label: 'WhatsApp', sub: 'Chat with us', bg: 'rgba(91,143,196,0.08)', border: 'rgba(91,143,196,0.2)', color: '#5B8FC4' },
          ].map((c) => (
            <Pressable
              key={c.label}
              style={({ pressed }) => [
                styles.contactCard,
                { backgroundColor: c.bg, borderColor: c.border },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.contactEmoji}>{c.emoji}</Text>
              <Text style={[styles.contactLabel, { color: c.color }]}>{c.label}</Text>
              <Text style={[styles.contactSub, { color: theme.textMuted }]}>{c.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Send a message */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Send a Message</Text>
        <View style={[styles.messageCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue or question…"
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={4}
            style={[styles.messageInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
          />
          {sent ? (
            <View style={[styles.sentRow, { backgroundColor: 'rgba(46,125,50,0.1)' }]}>
              <CheckCircle size={16} color="#2E7D32" />
              <Text style={[styles.sentText, { color: '#2E7D32' }]}>Message sent! We'll respond within 2 hours.</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleSend}
              disabled={message.length === 0}
              style={({ pressed }) => [
                styles.sendBtn,
                message.length === 0 && { opacity: 0.4 },
                pressed && { opacity: 0.8 },
              ]}
            >
              <MessageSquare size={16} color="#111111" />
              <Text style={styles.sendBtnText}>Send Message</Text>
            </Pressable>
          )}
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, i) => (
            <Pressable
              key={i}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
              style={[styles.faqCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View style={styles.faqHeader}>
                <HelpCircle size={16} color="#C9A14A" />
                <Text style={[styles.faqQ, { color: theme.text }]}>{faq.q}</Text>
                {expandedFaq === i
                  ? <ChevronUp size={16} color={theme.textMuted} />
                  : <ChevronDown size={16} color={theme.textMuted} />
                }
              </View>
              {expandedFaq === i && (
                <Text style={[styles.faqA, { color: theme.textSecondary }]}>{faq.a}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingBottom: 60, gap: 14 },
  hero: {
    borderRadius: 18, borderWidth: 1, padding: 20, gap: 8, alignItems: 'center',
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center' },
  heroSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  responseTime: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 4,
  },
  responseTimeText: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  contactGrid: { flexDirection: 'row', gap: 10 },
  contactCard: {
    flex: 1, borderRadius: 16, borderWidth: 1, padding: 14,
    alignItems: 'center', gap: 4,
  },
  contactEmoji: { fontSize: 24 },
  contactLabel: { fontSize: 14, fontWeight: '700' },
  contactSub: { fontSize: 11, textAlign: 'center' },
  messageCard: {
    borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12,
  },
  messageInput: {
    borderWidth: 1, borderRadius: 12, padding: 12,
    fontSize: 14, minHeight: 100, textAlignVertical: 'top',
  },
  sentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 10 },
  sentText: { fontSize: 14, fontWeight: '600', flex: 1 },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#C9A14A', borderRadius: 14, paddingVertical: 14,
  },
  sendBtnText: { color: '#111111', fontSize: 15, fontWeight: '700' },
  faqList: { gap: 8 },
  faqCard: {
    borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 10,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 19 },
  faqA: { fontSize: 13, lineHeight: 20, paddingLeft: 24 },
});
