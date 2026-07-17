import { LinearGradient } from './LinearGradient';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../lib/theme-context';
import type { BookingStatus, SyncStatus } from '../types';

// ─── Card ──────────────────────────────────────────────
export function Card({
  children,
  style,
  onPress,
  elevated,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
}) {
  const { theme } = useTheme();
  const content = (
    <View
      style={[
        {
          backgroundColor: elevated ? theme.surfaceElevated : theme.surface,
          borderRadius: 16,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.border,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

// ─── SectionHeader ─────────────────────────────────────
export function SectionHeader({
  title,
  action,
  style,
}: {
  title: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, style]}>
      <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 }}>
        {title}
      </Text>
      {action}
    </View>
  );
}

// ─── StatusBadge ───────────────────────────────────────
export function StatusBadge({ status }: { status: BookingStatus }) {
  const { theme } = useTheme();
  const map: Record<BookingStatus, { bg: string; fg: string; label: string }> = {
    pending: { bg: theme.amberSoft, fg: theme.amber, label: 'Pending' },
    confirmed: { bg: theme.greenSoft, fg: theme.green, label: 'Confirmed' },
    cancelled: { bg: theme.redSoft, fg: theme.red, label: 'Cancelled' },
  };
  const c = map[status];
  return (
    <View style={{ backgroundColor: c?.bg || theme.amberSoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text style={{ color: c?.fg || theme.amber, fontSize: 11, fontWeight: '700', letterSpacing: 0.3, textTransform: 'uppercase' }}>
        {c?.label || 'Pending'}
      </Text>
    </View>
  );
}

// ─── SyncDot ───────────────────────────────────────────
export function SyncDot({ status }: { status?: SyncStatus }) {
  const { theme } = useTheme();
  const map: Record<SyncStatus, { color: string; label: string }> = {
    idle: { color: theme.textMuted, label: 'Idle' },
    syncing: { color: theme.blue, label: 'Syncing…' },
    ok: { color: theme.green, label: 'Synced' },
    error: { color: theme.red, label: 'Sync error' },
  };
  const c = status ? map[status] || map.idle : map.idle;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: c.color }} />
      <Text style={{ color: c.color, fontSize: 11, fontWeight: '600' }}>{c.label}</Text>
    </View>
  );
}

// ─── SourceChip ────────────────────────────────────────
export function SourceChip({ source }: { source: 'website' | 'airbnb' | 'manual' }) {
  const { theme } = useTheme();
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    website: { bg: theme.blueSoft, fg: theme.blue, label: 'Website' },
    airbnb: { bg: theme.redSoft, fg: theme.red, label: 'Airbnb' },
    manual: { bg: theme.purpleSoft, fg: theme.purple, label: 'Manual' },
  };
  const c = map[source] || map.manual;
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Text style={{ color: c.fg, fontSize: 10, fontWeight: '600' }}>{c.label}</Text>
    </View>
  );
}

// ─── PrimaryButton ─────────────────────────────────────
export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  style,
  destructive,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  destructive?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={destructive ? [theme.red, '#B04848'] : [theme.gold, theme.goldDim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 14,
          paddingVertical: 15,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 50,
        }}
      >
        {loading ? (
          <ActivityIndicator color={destructive ? '#fff' : theme.textInverse} size="small" />
        ) : (
          <Text
            style={{
              color: destructive ? '#fff' : theme.textInverse,
              fontSize: 16,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

// ─── SecondaryButton ───────────────────────────────────
export function SecondaryButton({
  label,
  onPress,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          borderRadius: 14,
          paddingVertical: 14,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 50,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.border,
          backgroundColor: theme.surface,
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

// ─── Chip ──────────────────────────────────────────────
export function Chip({
  label,
  selected,
  onPress,
  color,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: selected ? (color ?? theme.gold) : theme.border,
          backgroundColor: selected ? (color ?? theme.gold) + '22' : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? (color ?? theme.gold) : theme.textSecondary,
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── ScreenHeader ──────────────────────────────────────
export function ScreenHeader({
  title,
  subtitle,
  showBack,
  right,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs');
    }
  }, [navigation]);

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
          >
            <ChevronLeft color={theme.gold} size={26} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
              {subtitle}
            </Text>
          )}
        </View>
        {right}
      </View>
    </View>
  );
}

// ─── EmptyState ────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 }}>
      <View style={{ marginBottom: 16, opacity: 0.4 }}>{icon}</View>
      <Text style={{ color: theme.text, fontSize: 17, fontWeight: '600', textAlign: 'center' }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 6, textAlign: 'center', lineHeight: 20 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

// ─── ScreenScroll ──────────────────────────────────────
export function ScreenScroll({
  children,
  style,
  contentContainerStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={[{ paddingBottom: 40 }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical
    >
      {children}
    </ScrollView>
  );
}

// ─── FieldLabel ────────────────────────────────────────
export function FieldLabel({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  const { theme } = useTheme();
  return (
    <Text style={[{ color: theme.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8, letterSpacing: 0.3 }, style]}>
      {children}
    </Text>
  );
}

// ─── Toggle ────────────────────────────────────────────
export function Toggle({
  value,
  onValueChange,
  label,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  label?: string;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {label && <Text style={{ color: theme.text, fontSize: 15 }}>{label}</Text>}
        <View
          style={{
            width: 48,
            height: 28,
            borderRadius: 14,
            backgroundColor: value ? theme.gold : theme.border,
            padding: 3,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: value ? theme.textInverse : theme.textMuted,
              transform: [{ translateX: value ? 20 : 0 }],
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}

// ─── Stars ─────────────────────────────────────────────
export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            color: i <= rating ? theme.gold : theme.border,
            fontSize: size,
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}
