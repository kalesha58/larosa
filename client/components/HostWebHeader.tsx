import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import {
  LayoutGrid,
  Building2,
  BookUser,
  User,
  Plus,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../lib/theme-context';

type HostNavId = 'dashboard' | 'villas' | 'bookings' | 'account';

const NAV_ITEMS: {
  id: HostNavId;
  label: string;
  route: 'HostHomeTab' | 'HostVillasTab' | 'HostBookingsTab' | 'HostMoreTab';
  Icon: typeof LayoutGrid;
}[] = [
  { id: 'dashboard', label: 'Dashboard', route: 'HostHomeTab',    Icon: LayoutGrid },
  { id: 'villas',    label: 'My Villas', route: 'HostVillasTab',  Icon: Building2 },
  { id: 'bookings',  label: 'Bookings',  route: 'HostBookingsTab', Icon: BookUser },
  { id: 'account',   label: 'Account',   route: 'HostMoreTab',    Icon: User },
];

function routeToNavId(routeName?: string): HostNavId {
  switch (routeName) {
    case 'HostVillasTab':   return 'villas';
    case 'HostBookingsTab': return 'bookings';
    case 'HostMoreTab':     return 'account';
    default:                return 'dashboard';
  }
}

/** Host web header with brand bar + floating bottom dock (mirrors customer nav) */
export default function HostWebHeader() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isMobileWidth = width < 768;
  const G = theme.gold ?? '#C9A14A';

  let currentRouteName: string | undefined;
  try {
    currentRouteName = useNavigationState((state) => {
      if (!state) return undefined;
      let route: any = state.routes[state.index];
      while (route?.state && route.state.index !== undefined) {
        route = route.state.routes[route.state.index];
      }
      return route?.name as string | undefined;
    });
  } catch (_) {}

  const activeId = routeToNavId(currentRouteName);

  if (Platform.OS !== 'web') return null;

  return (
    <>
      {/* ══ BRAND TOP BAR ══════════════════════════════════════════════════════ */}
      <View
        style={[
          styles.bar,
          {
            backgroundColor: isDark ? 'rgba(17,28,24,0.96)' : 'rgba(255,255,255,0.96)',
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={[styles.inner, isMobileWidth && styles.innerCompact]}>
          {/* Brand */}
          <Pressable
            onPress={() => navigation.navigate('HostHomeTab')}
            style={({ pressed }) => [styles.brand, pressed && { opacity: 0.75 }]}
          >
            <View style={[styles.brandRing, { borderColor: G }]}>
              <Sparkles size={12} color={G} />
            </View>
            <View>
              <Text style={[styles.brandName, { color: theme.text }]}>larosa</Text>
              <Text style={[styles.brandSub, { color: theme.textMuted }]}>HOST</Text>
            </View>
          </Pressable>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Add Farmhouse CTA */}
          <Pressable
            onPress={() => navigation.navigate('VillaEdit')}
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: G },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Plus size={15} color="#fff" strokeWidth={2.5} />
            {!isMobileWidth && (
              <Text style={styles.addBtnText}>Add Farmhouse</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* ══ FLOATING BOTTOM NAVIGATION DOCK ═══════════════════════════════════ */}
      <View
        // @ts-ignore
        style={[
          styles.floatingDockWrap,
          {
            backgroundColor: isDark ? 'rgba(17,28,24,0.95)' : 'rgba(255,255,255,0.95)',
            borderColor: theme.border,
          },
        ]}
      >
        {NAV_ITEMS.map(({ id, label, route, Icon }) => {
          const active = activeId === id;
          return (
            <Pressable
              key={id}
              onPress={() => navigation.navigate(route)}
              style={({ pressed }) => [
                styles.dockItem,
                isMobileWidth && styles.dockItemMobile,
                active && [styles.dockItemActive, { backgroundColor: G + '1A', borderColor: G + '33' }],
                pressed && { opacity: 0.8 },
              ]}
            >
              <Icon size={isMobileWidth ? 15 : 16} color={active ? G : theme.textMuted} />
              <Text
                style={[
                  styles.dockLabel,
                  isMobileWidth && styles.dockLabelMobile,
                  { color: active ? theme.text : theme.textMuted, fontWeight: active ? '700' : '600' },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Brand bar
  bar: {
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 200,
    backdropFilter: 'blur(20px)' as any,
    WebkitBackdropFilter: 'blur(20px)' as any,
  },
  inner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  innerCompact: {
    paddingHorizontal: 16,
    height: 56,
    gap: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  brandRing: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 0,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Floating bottom dock
  floatingDockWrap: {
    position: 'fixed' as any,
    bottom: 16,
    left: '50%',
    transform: [{ translateX: '-50%' as any }],
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    backdropFilter: 'blur(16px)' as any,
    maxWidth: '96%',
  },
  dockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dockItemMobile: {
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 20,
  },
  dockItemActive: {
    borderRadius: 24,
  },
  dockLabel: {
    fontSize: 13,
  },
  dockLabelMobile: {
    fontSize: 11,
  },
});
