import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { ShieldCheck, Lightbulb, GraduationCap } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';
import type { HostProfile } from '../../types';

interface HostSectionProps {
  host: HostProfile;
  reviewCount: number;
  rating: number;
  onMessage?: () => void;
}

export default function HostSection({ host, reviewCount, rating, onMessage }: HostSectionProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' ? width >= 900 : width >= 700;

  const firstName = host.name.split(' ')[0];

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.text }]}>Meet your host</Text>

      <View style={[styles.body, isWide && styles.bodyWide]}>
        {/* Left: profile card + bio */}
        <View style={[styles.leftCol, isWide && styles.leftColWide]}>
          <View style={[styles.hostCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardTop}>
              <View style={styles.avatarBlock}>
                <View style={styles.avatarWrap}>
                  <View style={[styles.avatar, { backgroundColor: theme.goldGlow }]}>
                    <Text style={[styles.avatarText, { color: theme.gold }]}>{host.initials}</Text>
                  </View>
                  {host.isVerified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: theme.gold, borderColor: theme.surface }]}>
                      <ShieldCheck size={14} color={theme.textInverse} />
                    </View>
                  )}
                </View>
                <Text style={[styles.hostName, { color: theme.text }]} numberOfLines={1}>
                  {firstName}
                </Text>
                <Text style={[styles.hostRole, { color: theme.textMuted }]}>Host</Text>
              </View>

              <View style={styles.statsCol}>
                <View style={styles.statBlock}>
                  <Text style={[styles.statNum, { color: theme.text }]}>{reviewCount}</Text>
                  <Text style={[styles.statLabel, { color: theme.text }]}>Reviews</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                <View style={styles.statBlock}>
                  <Text style={[styles.statNum, { color: theme.text }]}>
                    {rating.toFixed(1)}{' '}
                    <Text style={styles.star}>★</Text>
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.text }]}>Rating</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bioList}>
            {host.bioLines.map((line, i) => (
              <View key={i} style={styles.bioRow}>
                {i === 0 ? (
                  <Lightbulb size={20} color={theme.text} strokeWidth={1.6} />
                ) : (
                  <GraduationCap size={20} color={theme.text} strokeWidth={1.6} />
                )}
                <Text style={[styles.bioText, { color: theme.text }]}>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Right: co-hosts + details */}
        <View style={[styles.rightCol, isWide && styles.rightColWide]}>
          {host.coHostName ? (
            <View style={styles.block}>
              <Text style={[styles.blockTitle, { color: theme.text }]}>Co-Hosts</Text>
              <View style={styles.coHostRow}>
                <View style={[styles.coAvatar, { backgroundColor: theme.goldGlow }]}>
                  <Text style={[styles.coAvatarText, { color: theme.gold }]}>
                    {host.coHostInitials ?? host.coHostName.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.coName, { color: theme.text }]}>{host.coHostName}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.block}>
            <Text style={[styles.blockTitle, { color: theme.text }]}>Host details</Text>
            <Text style={[styles.detailLine, { color: theme.text }]}>
              Response rate: {host.responseRate}%
            </Text>
            <Text style={[styles.detailLine, { color: theme.text }]}>{host.responseTime}</Text>
          </View>

          <Pressable
            onPress={onMessage}
            style={({ pressed }) => [
              styles.messageBtn,
              { backgroundColor: theme.surfaceElevated },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={[styles.messageText, { color: theme.text }]}>Message host</Text>
          </Pressable>

          <View style={[styles.securityNote, { borderTopColor: theme.border }]}>
            <ShieldCheck size={18} color={theme.gold} />
            <Text style={[styles.securityText, { color: theme.textMuted }]}>
              To help protect your payment, always use Larosa to send money and communicate with hosts.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  body: {
    gap: 32,
  },
  bodyWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 56,
  },
  leftCol: {
    gap: 20,
  },
  leftColWide: {
    width: 340,
    flexShrink: 0,
  },
  rightCol: {
    gap: 24,
    flex: 1,
  },
  rightColWide: {
    paddingTop: 8,
    maxWidth: 420,
  },
  hostCard: {
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 28,
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  avatarBlock: {
    alignItems: 'center',
    width: 120,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
  },
  verifiedBadge: {
    position: 'absolute',
    right: -2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  hostName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  hostRole: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },
  statsCol: {
    flex: 1,
    gap: 14,
    paddingLeft: 4,
  },
  statBlock: {
    gap: 2,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  star: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statDivider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  bioList: {
    gap: 14,
    paddingHorizontal: 4,
  },
  bioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bioText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  block: {
    gap: 12,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  coHostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coAvatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  coName: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailLine: {
    fontSize: 15,
    lineHeight: 24,
  },
  messageBtn: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 4,
  },
  messageText: {
    fontSize: 15,
    fontWeight: '700',
  },
  securityNote: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
