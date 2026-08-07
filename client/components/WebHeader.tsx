import React, { useState, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, Platform, ScrollView, useWindowDimensions, TextInput, Image,
} from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import {
  Search, Globe, User, Sparkles, Compass, Home as HomeIcon, Flame,
  ChevronLeft, ChevronRight, MapPin, Building2, Waves, Minus, Plus, Navigation,
  ChevronDown, Heart, BookOpen, X, Star,
} from 'lucide-react-native';
import { useTheme } from '../lib/theme-context';
import { useAuth } from '../lib/auth-context';
import { properties } from '../lib/mockData';
import { formatMoney } from '../lib/format';

const SUGGESTED_DESTINATIONS = [
  { id: 'near',  name: 'Nearby',                       sub: "Find what's around you",                    Icon: Navigation,  accentColor: '#235347' },
  { id: 'hyd',   name: 'Hyderabad, Telangana',          sub: 'For sights like Charminar',                 Icon: Building2,   accentColor: '#026AA2' },
  { id: 'puri',  name: 'Puri, Odisha',                  sub: 'For its seaside allure',                    Icon: Waves,       accentColor: '#175CD3' },
  { id: 'viz',   name: 'Visakhapatnam, Andhra Pradesh', sub: 'Gem of the Eastern Coast',                  Icon: Compass,     accentColor: '#5925DC' },
  { id: 'goa',   name: 'North Goa, Goa',                sub: 'For its bustling nightlife',                Icon: Sparkles,    accentColor: '#C01048' },
  { id: 'blr',   name: 'Bengaluru, Karnataka',          sub: 'For sights like Lalbagh Botanical Garden',  Icon: MapPin,      accentColor: '#027A48' },
  { id: 'pune',  name: 'Pune, Maharashtra',              sub: 'A hidden cultural gem',                     Icon: HomeIcon,    accentColor: '#C4320A' },
];

const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const FLEX_OPTIONS = [
  { id: 'exact',  label: 'Exact dates' },
  { id: '1day',   label: '± 1 day' },
  { id: '2days',  label: '± 2 days' },
  { id: '3days',  label: '± 3 days' },
  { id: '7days',  label: '± 1 week' },
  { id: '14days', label: '± 2 weeks' },
] as const;

export default function WebHeader() {
  const { theme, isDark } = useTheme();
  const { user, updateUser, isAuthenticated, role } = useAuth();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();

  const isMobileWidth = width < 768;

  const [activeCategory, setActiveCategory] = useState<'homes'|'experiences'|'services'>('homes');
  const [activeField, setActiveField]       = useState<'destination'|'arrival'|'departure'|'guests'|null>(null);
  const [isScrolled, setIsScrolled]         = useState(false);
  const [forceExpand, setForceExpand]       = useState(false);
  const isCollapsed = isScrolled && !forceExpand;

  const [selectedWhere, setSelectedWhere] = useState('');
  const [checkInDay, setCheckInDay]       = useState<number|null>(null);
  const [checkOutDay, setCheckOutDay]     = useState<number|null>(null);
  const [dateTab, setDateTab]             = useState<'dates'|'flexible'>('dates');
  const [flexibility, setFlexibility]     = useState<'exact'|'1day'|'2days'|'3days'|'7days'|'14days'>('exact');
  const [monthOffset, setMonthOffset]     = useState(0);
  const [adults, setAdults]               = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount]   = useState(0);
  const [petsCount, setPetsCount]         = useState(0);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery]   = useState('');
  const [selectedCategory, setSelectedCategory]   = useState<string>('all');

  const filteredModalProperties = properties.filter((prop) => {
    const query = (modalSearchQuery || selectedWhere || '').toLowerCase().trim();
    const matchesQuery =
      !query ||
      prop.title.toLowerCase().includes(query) ||
      prop.location.toLowerCase().includes(query) ||
      prop.city.toLowerCase().includes(query) ||
      prop.state.toLowerCase().includes(query);
    const matchesCat =
      selectedCategory === 'all' || prop.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  let currentRouteName: string | undefined;
  try {
    currentRouteName = useNavigationState((state) => {
      if (!state) return undefined;
      let route = state.routes[state.index];
      while (route.state && route.state.index !== undefined) {
        route = (route.state.routes as any)[route.state.index];
      }
      return route.name;
    });
  } catch (_) {}

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const win = (globalThis as any).window;
    const doc = (globalThis as any).document;
    if (!win || !doc) return;

    const onScroll = (e?: any) => {
      const target = e?.target;
      const targetScroll = target && typeof target.scrollTop === 'number' ? target.scrollTop : 0;
      const docScroll = doc?.documentElement?.scrollTop || doc?.body?.scrollTop || 0;
      const winScroll = win.scrollY || win.pageYOffset || 0;
      const y = Math.max(winScroll, docScroll, targetScroll);

      setIsScrolled(y > 15);
    };

    const onClickOutside = (e: any) => {
      const el = doc?.getElementById?.('larosa-search-fields');
      if (el && !el.contains(e.target)) {
        setActiveField(null);
        setForceExpand(false);
      }
    };

    win.addEventListener('scroll', onScroll, { capture: true, passive: true });
    doc.addEventListener('scroll', onScroll, { capture: true, passive: true });
    win.addEventListener('click', onClickOutside, { capture: true });

    return () => {
      win.removeEventListener('scroll', onScroll, { capture: true, passive: true });
      doc.removeEventListener('scroll', onScroll, { capture: true, passive: true });
      win.removeEventListener('click', onClickOutside, { capture: true });
    };
  }, []);

  if (Platform.OS !== 'web') return null;
  const isCustomerHome =
    currentRouteName === 'CHomeTab' ||
    currentRouteName === 'CustomerTabs' ||
    currentRouteName === 'CHomeScreen' ||
    (!currentRouteName && role === 'customer');
  if (currentRouteName === 'Login') return null;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('CHomeTab');
    }
  };

  const handleBecomeHost = () => {
    if (!isAuthenticated) { navigation.navigate('Login'); return; }
    // Guests who become hosts start unverified with no listings (correct empty Overview).
    // Use host@larosa.in / demo1234 for a populated demo host dashboard.
    const alreadyVerified = user?.hostVerificationStatus === 'verified';
    updateUser({
      role: 'host',
      hostVerificationStatus: alreadyVerified ? 'verified' : 'none',
    });
    navigation.navigate(alreadyVerified ? 'HostTabs' : 'HostVerification');
  };

  const getDateLabel = () => {
    if (checkInDay && checkOutDay) return `Jul ${checkInDay} – ${checkOutDay}`;
    if (checkInDay) return `Jul ${checkInDay}`;
    return null;
  };
  const getGuestLabel = () => {
    const total = adults + childrenCount;
    const parts: string[] = [];
    if (total > 0) parts.push(`${total} guest${total > 1 ? 's' : ''}`);
    if (infantsCount > 0) parts.push(`${infantsCount} infant${infantsCount > 1 ? 's' : ''}`);
    if (petsCount > 0) parts.push(`${petsCount} pet${petsCount > 1 ? 's' : ''}`);
    return parts.join(', ') || null;
  };
  const getSearchSummary = () => {
    const parts: string[] = [];
    if (selectedWhere) parts.push(selectedWhere.split(',')[0]);
    const dl = getDateLabel(); if (dl) parts.push(dl);
    const gl = getGuestLabel(); if (gl) parts.push(gl);
    return parts.length ? parts.join('  ·  ') : 'Search villas & estates';
  };

  const renderMonthGrid = (monthIdx: number, year: number, startOffset: number, totalDays: number) => {
    const cells: (number|null)[] = [
      ...Array(startOffset).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
    return (
      <View style={s.calMonth}>
        <Text style={[s.calMonthTitle, { color: theme.text }]}>
          {MONTH_NAMES[monthIdx % 12]} {year}
        </Text>
        <View style={s.calDayHeaders}>
          {DAYS_SHORT.map((d, i) => (
            <Text key={i} style={[s.calDayHeader, { color: theme.textMuted }]}>{d}</Text>
          ))}
        </View>
        <View style={s.calGrid}>
          {cells.map((day, idx) => {
            if (day === null) return <View key={idx} style={s.calCellEmpty} />;
            const isStart = day === checkInDay;
            const isEnd   = day === checkOutDay;
            const inRange = !!(checkInDay && checkOutDay && day > checkInDay && day < checkOutDay);
            return (
              <Pressable
                key={idx}
                onPress={() => {
                  if (!checkInDay || (checkInDay && checkOutDay)) {
                    setCheckInDay(day); setCheckOutDay(null);
                  } else if (day > checkInDay) {
                    setCheckOutDay(day);
                  } else {
                    setCheckInDay(day); setCheckOutDay(null);
                  }
                }}
                style={[
                  s.calCell,
                  inRange && { backgroundColor: theme.gold + '18' },
                  (isStart || isEnd) && { backgroundColor: theme.gold, borderRadius: 8 },
                ]}
              >
                <Text style={[
                  s.calCellText,
                  { color: theme.text },
                  (isStart || isEnd) && { color: '#FFFFFF', fontWeight: '700' },
                ]}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const G = theme.gold;
  const headerBg = theme.surface;

  const NAV_ITEMS = [
    { id: 'explore'   as const, label: 'Explore',  route: 'CHomeTab',     Icon: HomeIcon },
    { id: 'search'    as const, label: 'Search',   route: 'Search',        Icon: Search },
    { id: 'saved'     as const, label: 'Saved',    route: 'CFavoritesTab', Icon: Heart },
    { id: 'bookings'  as const, label: 'Bookings', route: 'CBookingsTab',  Icon: BookOpen },
    { id: 'profile'   as const, label: 'Profile',  route: 'CProfileTab',   Icon: User },
  ];

  const GUEST_ROWS = [
    { label: 'Adults',   sub: 'Ages 13+', value: adults,       set: setAdults },
    { label: 'Children', sub: 'Ages 2–12',value: childrenCount, set: setChildrenCount },
    { label: 'Infants',  sub: 'Under 2',  value: infantsCount,  set: setInfantsCount },
    { label: 'Pets',     sub: null,        value: petsCount,     set: setPetsCount },
  ] as const;

  return (
    <>
      {/* ══ EXPANDED HEADER ══════════════════════════════════════════════════ */}
      <View
        style={[
          s.outerWrap,
          { backgroundColor: headerBg, borderBottomColor: theme.border },
          {
            maxHeight: isCollapsed ? 0 : 300,
            opacity: isCollapsed ? 0 : 1,
            pointerEvents: isCollapsed ? 'none' : 'auto',
            overflow: isCollapsed ? 'hidden' : 'visible',
            transform: isCollapsed ? 'translateY(-12px) scale(0.96)' : 'translateY(0px) scale(1)',
            transition: 'max-height 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
          } as any,
        ]}
      >
        {/* Gold accent stripe */}
        <View style={[s.accentStripe, { backgroundColor: G }]} />

        <View style={[s.innerWrap, { paddingHorizontal: isMobileWidth ? 16 : 32 }]}>
          {/* ── Top row: Brand | Nav | Actions ── */}
          <View style={s.topRow}>
            {/* Brand */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {!isCustomerHome && (
                <Pressable
                  onPress={handleGoBack}
                  style={({ pressed }) => [
                    s.headerBackBtn,
                    { borderColor: theme.border, backgroundColor: theme.surfaceElevated },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <ChevronLeft size={16} color={theme.text} />
                  <Text style={[s.headerBackText, { color: theme.text }]}>Back</Text>
                </Pressable>
              )}
              <Pressable onPress={() => navigation.navigate('CHomeTab')} style={s.brand}>
                <View style={[s.brandRing, { borderColor: G }]}>
                  <Sparkles size={13} color={G} />
                </View>
                <Text style={[s.brandName, { color: theme.text }]}>larosa</Text>
                <Text style={[s.brandSub, { color: theme.textMuted }]}>VILLAS</Text>
              </Pressable>
            </View>

            {/* Right actions */}
            <View style={s.actions}>
              {!isMobileWidth && (
                <Pressable
                  onPress={handleBecomeHost}
                  style={({ pressed }) => [s.hostBtn, { borderColor: theme.border }, pressed && { opacity: 0.7 }]}
                >
                  <Text style={[s.hostBtnText, { color: theme.text }]}>Become a host</Text>
                </Pressable>
              )}
              <Pressable style={({ pressed }) => [s.iconCircle, { borderColor: theme.border }, pressed && { opacity: 0.7 }]}>
                <Globe size={16} color={theme.text} />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('CProfileTab')}
                style={({ pressed }) => [s.userBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }, pressed && { opacity: 0.8 }]}
              >
                <View style={[s.userAvatar, { backgroundColor: G + '22' }]}>
                  <User size={13} color={G} />
                </View>
                <ChevronDown size={12} color={theme.textMuted} />
              </Pressable>
            </View>
          </View>

          {/* ── Open Search Bar ── */}
          {isMobileWidth ? (
            <Pressable
              onPress={() => navigation.navigate('Search')}
              style={({ pressed }) => [
                s.mobileSearchBar,
                { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                pressed && { opacity: 0.9 },
              ]}
            >
              <Search size={18} color={G} style={{ marginRight: 10 }} />
              <View style={s.mobileSearchTextContainer}>
                <Text style={[s.mobileSearchTitle, { color: theme.text }]} numberOfLines={1}>
                  {selectedWhere ? selectedWhere.split(',')[0] : 'Where to?'}
                </Text>
                <Text style={[s.mobileSearchSub, { color: theme.textMuted }]} numberOfLines={1}>
                  {getSearchSummary()}
                </Text>
              </View>
              <View style={[s.mobileSearchIconCircle, { backgroundColor: G }]}>
                <Search size={14} color="#FFFFFF" />
              </View>
            </Pressable>
          ) : (
            <View
              // @ts-ignore
              id="larosa-search-fields"
              style={[s.searchBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
            >
              {/* Destination */}
              <Pressable
                onPress={() => setActiveField(activeField === 'destination' ? null : 'destination')}
                style={[s.searchField, activeField === 'destination' && [s.searchFieldActive, { backgroundColor: theme.surface }]]}
              >
                <Text style={[s.fieldLabel, { color: theme.textMuted }]}>DESTINATION</Text>
                <Text style={[s.fieldValue, { color: selectedWhere ? theme.text : theme.textMuted }]} numberOfLines={1}>
                  {selectedWhere || 'Where are you going?'}
                </Text>
              </Pressable>

              <View style={[s.fieldRule, { backgroundColor: theme.border }]} />

              {/* Arrival */}
              <Pressable
                onPress={() => setActiveField(activeField === 'arrival' ? null : 'arrival')}
                style={[s.searchField, activeField === 'arrival' && [s.searchFieldActive, { backgroundColor: theme.surface }]]}
              >
                <Text style={[s.fieldLabel, { color: theme.textMuted }]}>ARRIVAL</Text>
                <Text style={[s.fieldValue, { color: checkInDay ? theme.text : theme.textMuted }]}>
                  {checkInDay ? `Jul ${checkInDay}` : 'Add date'}
                </Text>
              </Pressable>

              <View style={[s.fieldRule, { backgroundColor: theme.border }]} />

              {/* Departure */}
              <Pressable
                onPress={() => setActiveField(activeField === 'departure' ? null : 'departure')}
                style={[s.searchField, activeField === 'departure' && [s.searchFieldActive, { backgroundColor: theme.surface }]]}
              >
                <Text style={[s.fieldLabel, { color: theme.textMuted }]}>DEPARTURE</Text>
                <Text style={[s.fieldValue, { color: checkOutDay ? theme.text : theme.textMuted }]}>
                  {checkOutDay ? `Jul ${checkOutDay}` : 'Add date'}
                </Text>
              </Pressable>

              <View style={[s.fieldRule, { backgroundColor: theme.border }]} />

              {/* Guests */}
              <Pressable
                onPress={() => setActiveField(activeField === 'guests' ? null : 'guests')}
                style={[s.searchFieldGuests, activeField === 'guests' && [s.searchFieldActive, { backgroundColor: theme.surface }]]}
              >
                <Text style={[s.fieldLabel, { color: theme.textMuted }]}>GUESTS</Text>
                <Text style={[s.fieldValue, { color: getGuestLabel() ? theme.text : theme.textMuted }]} numberOfLines={1}>
                  {getGuestLabel() || 'Add guests'}
                </Text>
              </Pressable>

              {/* Search button */}
              <Pressable
                onPress={() => { setActiveField(null); setIsSearchModalOpen(true); }}
                style={({ pressed }) => [s.searchBtn, { backgroundColor: G }, pressed && { opacity: 0.85 }]}
              >
                <Search size={16} color="#FFFFFF" />
                <Text style={s.searchBtnText}>Search</Text>
              </Pressable>
            </View>
          )}

            {/* ── Popover: Destination ── */}
            {activeField === 'destination' && (
              <View style={[s.popover, s.popoverLeft, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[s.popoverHeading, { color: theme.textMuted }]}>Suggested destinations</Text>
                <View style={[s.popoverDivider, { backgroundColor: theme.border }]} />
                <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
                  {SUGGESTED_DESTINATIONS.map((item) => {
                    const { Icon } = item;
                    const sel = selectedWhere === item.name;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => { setSelectedWhere(item.name); setActiveField('arrival'); }}
                        style={({ pressed }) => [
                          s.destRow,
                          (pressed || sel) && { backgroundColor: theme.surfaceElevated },
                        ]}
                      >
                        <View style={[s.destIcon, { backgroundColor: item.accentColor + '18' }]}>
                          <Icon size={18} color={item.accentColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.destName, { color: theme.text }]}>{item.name}</Text>
                          <Text style={[s.destSub, { color: theme.textMuted }]}>{item.sub}</Text>
                        </View>
                        {sel && <View style={[s.selectedDot, { backgroundColor: G }]} />}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* ── Popover: Arrival / Departure ── */}
            {(activeField === 'arrival' || activeField === 'departure') && (
              <View style={[s.popover, s.popoverCenter, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={s.calToggleRow}>
                  {(['dates', 'flexible'] as const).map((tab) => (
                    <Pressable
                      key={tab}
                      onPress={() => setDateTab(tab)}
                      style={[
                        s.calToggleBtn,
                        dateTab === tab && [s.calToggleBtnActive, { borderColor: G }],
                      ]}
                    >
                      <Text style={[s.calToggleText, { color: dateTab === tab ? G : theme.textMuted }]}>
                        {tab === 'dates' ? 'Exact dates' : 'Flexible'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View style={[s.popoverDivider, { backgroundColor: theme.border }]} />
                <View style={s.calDualRow}>
                  <Pressable onPress={() => setMonthOffset(p => p - 1)} style={s.calNavBtn}>
                    <ChevronLeft size={16} color={theme.text} />
                  </Pressable>
                  <Pressable onPress={() => setMonthOffset(p => p + 1)} style={[s.calNavBtn, s.calNavBtnRight]}>
                    <ChevronRight size={16} color={theme.text} />
                  </Pressable>
                  {renderMonthGrid(6 + monthOffset, 2026, 3, 31)}
                  <View style={[s.calMonthDivider, { backgroundColor: theme.border }]} />
                  {renderMonthGrid(7 + monthOffset, 2026, 6, 31)}
                </View>
                {dateTab === 'dates' && (
                  <>
                    <View style={[s.popoverDivider, { backgroundColor: theme.border, marginTop: 16 }]} />
                    <View style={s.flexRow}>
                      {FLEX_OPTIONS.map((opt) => (
                        <Pressable
                          key={opt.id}
                          onPress={() => setFlexibility(opt.id as any)}
                          style={[
                            s.flexPill,
                            { borderColor: theme.border },
                            flexibility === opt.id && { backgroundColor: G + '18', borderColor: G },
                          ]}
                        >
                          <Text style={[s.flexPillText, { color: flexibility === opt.id ? G : theme.textMuted }]}>
                            {opt.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}

            {/* ── Popover: Guests ── */}
            {activeField === 'guests' && (
              <View style={[s.popover, s.popoverRight, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[s.popoverHeading, { color: theme.textMuted }]}>Guests</Text>
                <View style={[s.popoverDivider, { backgroundColor: theme.border }]} />
                {GUEST_ROWS.map(({ label, sub, value, set }, rowIdx, arr) => (
                  <View key={label}>
                    <View style={s.guestRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={[s.guestLabel, { color: theme.text }]}>{label}</Text>
                        {sub && <Text style={[s.guestSub, { color: theme.textMuted }]}>{sub}</Text>}
                      </View>
                      <View style={s.counter}>
                        <Pressable
                          onPress={() => set((v: number) => Math.max(0, v - 1))}
                          disabled={value === 0}
                          style={[s.counterBtn, { borderColor: theme.border }, value === 0 && { opacity: 0.25 }]}
                        >
                          <Minus size={13} color={theme.text} />
                        </Pressable>
                        <Text style={[s.counterVal, { color: theme.text }]}>{value}</Text>
                        <Pressable
                          onPress={() => set((v: number) => v + 1)}
                          style={[s.counterBtn, { borderColor: G, backgroundColor: G + '12' }]}
                        >
                          <Plus size={13} color={G} />
                        </Pressable>
                      </View>
                    </View>
                    {rowIdx < arr.length - 1 && (
                      <View style={[s.popoverDivider, { backgroundColor: theme.border }]} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

      {/* ══ COLLAPSED / COMPACT BAR ══════════════════════════════════════════ */}
      <View
        style={[
          s.compactBar,
          {
            backgroundColor: isDark ? 'rgba(17,28,24,0.92)' : 'rgba(255,255,255,0.92)',
            borderBottomColor: theme.border,
            opacity: isCollapsed ? 1 : 0,
            transform: isCollapsed ? 'translateY(0px) scale(1)' : 'translateY(-24px) scale(0.92)',
            pointerEvents: isCollapsed ? 'auto' : 'none',
            transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(20px)',
          } as any,
        ]}
      >
        <View style={[s.accentStripe, { backgroundColor: G }]} />
        <View style={s.compactInner}>
          {/* Left Brand Container */}
          <View style={s.compactLeftWrap}>
            <Pressable onPress={() => navigation.navigate('CHomeTab')} style={s.compactBrand}>
              <View style={[s.brandRingSmall, { borderColor: G }]}>
                <Sparkles size={10} color={G} />
              </View>
              <Text style={[s.compactBrandName, { color: theme.text }]}>larosa</Text>
            </Pressable>
          </View>

          {/* Center Search summary - Airbnb style 3-part pill */}
          <Pressable
            onPress={() => { setForceExpand(true); setActiveField('destination'); }}
            style={({ pressed }) => [
              s.compactSummary,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Text style={[s.compactPillItem, { color: theme.text, fontWeight: '700' }]} numberOfLines={1}>
              {selectedWhere ? selectedWhere.split(',')[0] : 'Anywhere'}
            </Text>

            <View style={[s.compactPillDivider, { backgroundColor: theme.border }]} />

            <Text style={[s.compactPillItem, { color: theme.textSecondary, fontWeight: '600' }]} numberOfLines={1}>
              {getDateLabel() || 'Any week'}
            </Text>

            <View style={[s.compactPillDivider, { backgroundColor: theme.border }]} />

            <Text style={[s.compactPillItem, { color: theme.textMuted, fontWeight: '500' }]} numberOfLines={1}>
              {getGuestLabel() || 'Add guests'}
            </Text>

            <View style={[s.compactSearchCircle, { backgroundColor: G }]}>
              <Search size={12} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Right User Container */}
          <View style={s.compactRightWrap}>
            <Pressable
              onPress={() => navigation.navigate('CProfileTab')}
              style={({ pressed }) => [s.userBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }, pressed && { opacity: 0.8 }]}
            >
              <View style={[s.userAvatar, { backgroundColor: G + '22' }]}>
                <User size={13} color={G} />
              </View>
              <ChevronDown size={12} color={theme.textMuted} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ══ WEB FLOATING BOTTOM NAVIGATION DOCK ═══════════════════════════════ */}
      <View
        // @ts-ignore
        style={[
          s.floatingDockWrap,
          {
            backgroundColor: isDark ? 'rgba(17,28,24,0.95)' : 'rgba(255,255,255,0.95)',
            borderColor: theme.border,
          },
        ]}
      >
        {NAV_ITEMS.map(({ id, label, route, Icon }) => {
          const active = currentRouteName === route || (route === 'CHomeTab' && isCustomerHome);
          return (
            <Pressable
              key={id}
              onPress={() => {
                if (route === 'Search') {
                  setIsSearchModalOpen(true);
                } else {
                  navigation.navigate(route);
                }
              }}
              style={({ pressed }) => [
                s.floatingDockItem,
                isMobileWidth && s.floatingDockItemMobile,
                active && [s.floatingDockItemActive, { backgroundColor: G + '1A', borderColor: G + '33' }],
                pressed && { opacity: 0.8 },
              ]}
            >
              <Icon size={isMobileWidth ? 15 : 16} color={active ? G : theme.textMuted} />
              <Text style={[
                s.floatingDockText,
                isMobileWidth && s.floatingDockTextMobile,
                { color: active ? theme.text : theme.textMuted, fontWeight: active ? '700' : '600' }
              ]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ══ INTERACTIVE SEARCH & RESULTS MODAL OVERLAY ═════════════════════ */}
      {isSearchModalOpen && (
        <View style={s.modalOverlay}>
          <Pressable style={s.modalBackdrop} onPress={() => setIsSearchModalOpen(false)} />
          
          <View style={[s.modalContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Modal Header */}
            <View style={s.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[s.modalTitle, { color: theme.text }]}>Search Villas & Estates</Text>
                <Text style={[s.modalSub, { color: theme.textMuted }]}>
                  {filteredModalProperties.length} matching properties
                </Text>
              </View>
              <Pressable
                onPress={() => setIsSearchModalOpen(false)}
                style={({ pressed }) => [s.modalCloseBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }, pressed && { opacity: 0.7 }]}
              >
                <X size={18} color={theme.text} />
              </Pressable>
            </View>

            {/* Modal Search Bar Input */}
            <View style={[s.modalSearchInputRow, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <Search size={18} color={G} />
              <TextInput
                value={modalSearchQuery}
                onChangeText={setModalSearchQuery}
                placeholder="Search by villa name, location, city..."
                placeholderTextColor={theme.textMuted}
                style={[s.modalSearchInput, { color: theme.text }]}
                autoFocus
              />
              {modalSearchQuery !== '' && (
                <Pressable onPress={() => setModalSearchQuery('')}>
                  <X size={16} color={theme.textMuted} />
                </Pressable>
              )}
            </View>

            {/* Category Filter Pills */}
            <View style={s.modalFilterBar}>
              {['all', 'villa', 'farmhouse', 'cottage', 'resort'].map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={({ pressed }) => [
                      s.modalFilterChip,
                      { backgroundColor: active ? G : theme.surfaceElevated, borderColor: active ? G : theme.border },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={[s.modalFilterText, { color: active ? '#FFFFFF' : theme.textSecondary }]}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Matching Results Grid / ScrollView */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.modalResultsScroll}>
              {filteredModalProperties.length === 0 ? (
                <View style={s.modalEmptyState}>
                  <Search size={44} color={theme.textMuted} />
                  <Text style={[s.modalEmptyTitle, { color: theme.text }]}>No matching properties found</Text>
                  <Text style={[s.modalEmptySub, { color: theme.textMuted }]}>
                    Try searching for keywords like "Kerala", "Coorg", "Goa", or "Villa"
                  </Text>
                </View>
              ) : (
                <View style={s.modalResultsGrid}>
                  {filteredModalProperties.map((prop) => (
                    <Pressable
                      key={prop.id}
                      onPress={() => {
                        setIsSearchModalOpen(false);
                        navigation.navigate('PropertyDetail', { propertyId: prop.id });
                      }}
                      style={({ pressed }) => [
                        s.modalPropertyCard,
                        { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
                        pressed && { opacity: 0.92, transform: [{ translateY: -2 }] },
                      ]}
                    >
                      <Image
                        source={{ uri: prop.images[0] }}
                        style={s.modalCardImage}
                        resizeMode="cover"
                      />
                      <View style={s.modalCardBadge}>
                        <Sparkles size={10} color="#FFFFFF" />
                        <Text style={s.modalCardBadgeText}>
                          {prop.bookingType === 'instant' ? 'Instant Book' : 'Request Book'}
                        </Text>
                      </View>

                      <View style={s.modalCardContent}>
                        <View style={s.modalCardRow}>
                          <Text style={[s.modalCardTitle, { color: theme.text }]} numberOfLines={1}>
                            {prop.title}
                          </Text>
                          <View style={s.modalCardRating}>
                            <Star size={12} color={G} fill={G} />
                            <Text style={[s.modalCardRatingVal, { color: theme.text }]}>{prop.rating}</Text>
                          </View>
                        </View>

                        <Text style={[s.modalCardLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                          {prop.location}
                        </Text>

                        <View style={s.modalCardMeta}>
                          <Text style={[s.modalCardMetaText, { color: theme.textMuted }]}>
                            {prop.bedrooms} Beds · {prop.capacity} Guests
                          </Text>
                        </View>

                        <View style={s.modalCardFooter}>
                          <Text style={[s.modalCardPrice, { color: G }]}>
                            {formatMoney(prop.pricePerNight)}
                            <Text style={{ fontSize: 12, fontWeight: '500', color: theme.textMuted }}> /night</Text>
                          </Text>

                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              setIsSearchModalOpen(false);
                              navigation.navigate('PropertyDetail', { propertyId: prop.id });
                            }}
                            style={({ pressed }) => [s.modalCardViewBtn, { backgroundColor: G }, pressed && { opacity: 0.8 }]}
                          >
                            <Text style={s.modalCardViewBtnText}>View Details →</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  outerWrap: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 200,
  },
  accentStripe: {
    width: '100%',
    height: 3,
  },
  innerWrap: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 16,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 160,
  },
  brandRing: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 3,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  },
  navLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    position: 'relative',
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  navUnderline: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  newChip: {
    position: 'absolute',
    top: -6,
    right: -22,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  newChipText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 160,
    justifyContent: 'flex-end',
  },
  hostBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  hostBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  userAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'visible',
    position: 'relative',
  },
  searchField: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchFieldGuests: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 160,
  },
  searchFieldActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  fieldRule: {
    width: 1,
    height: 32,
    flexShrink: 0,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 6,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
  },
  searchBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  // Popovers
  popover: {
    position: 'absolute',
    top: '110%' as any,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 16,
    zIndex: 1000,
    maxWidth: '92vw' as any,
  },
  popoverLeft: {
    left: 0,
    width: 400,
  },
  popoverCenter: {
    left: '50%' as any,
    // @ts-ignore
    transform: [{ translateX: '-50%' }],
    width: 680,
  },
  popoverRight: {
    right: 0,
    width: 360,
  },
  popoverHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase' as any,
    marginBottom: 16,
  },
  popoverDivider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 2,
  },
  destIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  destSub: {
    fontSize: 12,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calToggleRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  calToggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calToggleBtnActive: {},
  calToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  calDualRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  calNavBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    padding: 4,
  },
  calNavBtnRight: {
    left: undefined,
    right: 0,
  },
  calMonth: {
    flex: 1,
    paddingHorizontal: 8,
  },
  calMonthTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  calDayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calDayHeader: {
    width: 36,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCellEmpty: {
    width: 36,
    height: 36,
  },
  calCell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  calCellText: {
    fontSize: 13,
    fontWeight: '500',
  },
  calMonthDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: 16,
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  flexPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  flexPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  guestLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  guestSub: {
    fontSize: 12,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterVal: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 18,
    textAlign: 'center',
  },
  // Compact bar
  compactBar: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 300,
    borderBottomWidth: 1,
    backdropFilter: 'blur(16px)' as any,
    WebkitBackdropFilter: 'blur(16px)' as any,
  },
  compactInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 10,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  compactLeftWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  compactRightWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  compactBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 4,
  },
  brandRingSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBrandName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  compactSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    gap: 12,
  },
  compactPillItem: {
    fontSize: 13,
  },
  compactPillDivider: {
    width: 1,
    height: 14,
  },
  compactSearchCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  compactCategories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    flex: 1,
    justifyContent: 'center',
  },
  compactCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    position: 'relative',
  },
  compactCatText: {
    fontSize: 13,
    fontWeight: '600',
  },
  compactCatDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  headerBackText: {
    fontSize: 13,
    fontWeight: '700',
  },
  mobileSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginVertical: 4,
  },
  mobileSearchTextContainer: {
    flex: 1,
  },
  mobileSearchTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  mobileSearchSub: {
    fontSize: 12,
    marginTop: 1,
  },
  mobileSearchIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  floatingDockWrap: {
    position: 'fixed' as any,
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)' as any,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 32,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(16px)',
    maxWidth: '96%',
  },
  floatingDockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  floatingDockItemMobile: {
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 20,
  },
  floatingDockItemActive: {
    borderRadius: 24,
  },
  floatingDockText: {
    fontSize: 13,
  },
  floatingDockTextMobile: {
    fontSize: 11,
  },

  // Search Modal styles
  modalOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(12px)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 960,
    maxHeight: '88vh' as any,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  modalSub: {
    fontSize: 13,
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSearchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    outlineStyle: 'none' as any,
  },
  modalFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  modalFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalFilterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalResultsScroll: {
    paddingBottom: 20,
  },
  modalEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  modalEmptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalEmptySub: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 360,
  },
  modalResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  modalPropertyCard: {
    width: 'calc(33.333% - 11px)' as any,
    minWidth: 260,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  modalCardImage: {
    width: '100%',
    height: 160,
  },
  modalCardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1B4D3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalCardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  modalCardContent: {
    padding: 14,
    gap: 6,
  },
  modalCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    flex: 1,
  },
  modalCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  modalCardRatingVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalCardLocation: {
    fontSize: 12,
  },
  modalCardMeta: {
    marginVertical: 2,
  },
  modalCardMetaText: {
    fontSize: 12,
  },
  modalCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.15)',
  },
  modalCardPrice: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  modalCardViewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalCardViewBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
