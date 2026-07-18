import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../lib/theme-context';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'detail' | 'profile';
  count?: number;
}

function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          width: width || '100%',
          height,
          borderRadius,
          backgroundColor: theme.surfaceElevated,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: theme.border,
          opacity: 0.5,
        }}
      />
    </View>
  );
}

function PropertyCardSkeleton() {
  const { theme } = useTheme();
  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <SkeletonBox height={200} borderRadius={0} />
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <SkeletonBox width="65%" height={16} borderRadius={6} />
          <SkeletonBox width="20%" height={16} borderRadius={6} />
        </View>
        <SkeletonBox width="45%" height={12} borderRadius={5} />
        <View style={styles.metaRow}>
          <SkeletonBox width="30%" height={12} borderRadius={5} />
          <SkeletonBox width="30%" height={12} borderRadius={5} />
        </View>
        <SkeletonBox width="40%" height={18} borderRadius={6} />
      </View>
    </View>
  );
}

function ListSkeleton() {
  const { theme } = useTheme();
  return (
    <View style={[styles.listContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <SkeletonBox height={100} borderRadius={0} />
      <View style={styles.listContent}>
        <SkeletonBox width="70%" height={14} borderRadius={5} />
        <SkeletonBox width="50%" height={12} borderRadius={5} />
        <View style={styles.metaRow}>
          <SkeletonBox width="60%" height={12} borderRadius={5} />
          <SkeletonBox width="25%" height={20} borderRadius={6} />
        </View>
      </View>
    </View>
  );
}

function ProfileSkeleton() {
  const { theme } = useTheme();
  return (
    <View style={styles.profileContainer}>
      <SkeletonBox width={80} height={80} borderRadius={40} style={{ alignSelf: 'center' }} />
      <SkeletonBox width="50%" height={20} borderRadius={8} style={{ alignSelf: 'center' }} />
      <SkeletonBox width="70%" height={14} borderRadius={6} style={{ alignSelf: 'center' }} />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={[styles.menuSkeleton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <SkeletonBox width={40} height={40} borderRadius={12} />
          <SkeletonBox width="60%" height={14} borderRadius={5} />
        </View>
      ))}
    </View>
  );
}

export default function SkeletonLoader({ type = 'card', count = 3 }: SkeletonLoaderProps) {
  if (type === 'profile') return <ProfileSkeleton />;

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={styles.wrapper}>
      {items.map((i) => (
        type === 'list'
          ? <ListSkeleton key={i} />
          : <PropertyCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
    paddingHorizontal: 20,
  },
  cardContainer: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 14,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  listContainer: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  profileContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  menuSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
