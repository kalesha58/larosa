import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutGrid, CalendarDays, BookUser, Menu, Users,
  Home, Search, Heart, BookOpen, User, Plus, Building2,
} from 'lucide-react-native';

import { ThemeProvider, useTheme } from './lib/theme-context';
import { AuthProvider, useAuth } from './lib/auth-context';
import { DataProvider } from './lib/data-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WebHeader from './components/WebHeader';

// ─── Host Screens ─────────────────────────────────────────
import HostHomeScreen from './screens/host/HostHomeScreen';
import HostVillasScreen from './screens/host/HostVillasScreen';
import HostBookingsScreen from './screens/host/HostBookingsScreen';
import HostMoreScreen from './screens/host/HostMoreScreen';
import HostVerificationScreen from './screens/host/HostVerificationScreen';
import SplashScreen from './screens/SplashScreen';
import IntroScreen from './screens/IntroScreen';

// ─── Admin Screens ────────────────────────────────────────
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/admin/HomeScreen';
import BookingsScreen from './screens/admin/BookingsScreen';
import VillasScreen from './screens/admin/VillasScreen';
import MoreScreen from './screens/admin/MoreScreen';
import BookingDetailScreen from './screens/admin/BookingDetailScreen';
import CalendarScreen from './screens/admin/CalendarScreen';
import CampaignEditScreen from './screens/admin/CampaignEditScreen';
import CampaignsScreen from './screens/admin/CampaignsScreen';
import FeedbackScreen from './screens/admin/FeedbackScreen';
import NotificationsScreen from './screens/admin/NotificationsScreen';
import PricingScreen from './screens/admin/PricingScreen';
import SettingsScreen from './screens/admin/SettingsScreen';
import SyncLogsScreen from './screens/admin/SyncLogsScreen';
import UsersScreen from './screens/admin/UsersScreen';
import VillaEditScreen from './screens/admin/VillaEditScreen';
import SupportDisputesScreen from './screens/admin/SupportDisputesScreen';
import PaymentsScreen from './screens/admin/PaymentsScreen';

// ─── Customer Screens ─────────────────────────────────────
import CHomeScreen from './screens/customer/CHomeScreen';
import CFavoritesScreen from './screens/customer/CFavoritesScreen';
import CBookingsScreen from './screens/customer/CBookingsScreen';
import CProfileScreen from './screens/customer/CProfileScreen';
import SearchScreen from './screens/customer/SearchScreen';
import PropertyDetailScreen from './screens/customer/PropertyDetailScreen';
import BookingFlowScreen from './screens/customer/BookingFlowScreen';
import PaymentScreen from './screens/customer/PaymentScreen';
import BookingConfirmationScreen from './screens/customer/BookingConfirmationScreen';
import CBookingDetailScreen from './screens/customer/CBookingDetailScreen';
import ReviewsScreen from './screens/customer/ReviewsScreen';
import CNotificationsScreen from './screens/customer/CNotificationsScreen';
import CSettingsScreen from './screens/customer/CSettingsScreen';
import SupportScreen from './screens/customer/SupportScreen';
import PrivacyPolicyScreen from './screens/customer/PrivacyPolicyScreen';
import TermsScreen from './screens/customer/TermsScreen';
import OpenSourceLicensesScreen from './screens/customer/OpenSourceLicensesScreen';
import DataSafetyScreen from './screens/customer/DataSafetyScreen';
import PrivilegeClubScreen from './screens/customer/PrivilegeClubScreen';

// ─── Navigation Types ─────────────────────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  // Admin
  MainTabs: undefined;
  BookingDetail: { id: string };
  Calendar: { roomId?: string };
  CampaignEdit: undefined;
  Campaigns: undefined;
  Feedback: undefined;
  Notifications: undefined;
  Pricing: { roomId?: string };
  Settings: undefined;
  SyncLogs: undefined;
  Users: undefined;
  VillaEdit: { roomId?: string } | undefined;
  SupportDisputes: undefined;
  Payments: undefined;
  // Host
  HostTabs: undefined;
  HostVerification: undefined;
  // Customer
  CustomerTabs: undefined;
  PropertyDetail: { propertyId: string };
  BookingFlow: { propertyId: string; checkIn?: string | null; checkOut?: string | null; guests?: number };
  Payment: Record<string, unknown>;
  BookingConfirmation: Record<string, unknown>;
  CBookingDetail: { bookingId: string };
  Reviews: { propertyId: string };
  CNotifications: undefined;
  CSettings: undefined;
  Search: undefined;
  Support: undefined;
  EditProfile: undefined;
  Verification: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  OpenSourceLicenses: undefined;
  DataSafety: undefined;
  // Cross-navigation shortcuts from profile
  CFavoritesTab: undefined;
  CBookingsTab: undefined;
  CHomeTab: undefined;
};

export type AdminTabParamList = {
  HomeTab: undefined;
  VillasTab: undefined;
  AdminAddVillaTab: undefined;
  BookingsTab: undefined;
  MoreTab: undefined;
};

export type CustomerTabParamList = {
  CHomeTab: undefined;
  Search: undefined;
  CFavoritesTab: undefined;
  CBookingsTab: undefined;
  CProfileTab: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();

function TabBarIcon({ Icon, color, focused }: { Icon: React.ElementType; color: string; focused: boolean }) {
  return <Icon color={color} size={23} strokeWidth={focused ? 2.2 : 1.8} />;
}

// ─── Admin tab navigator ──────────────────────────────────
// ─── Admin tab bar customization ─────────────────────────
function AdminTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();
  const G = '#C9A14A';

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === 'AdminAddVillaTab') {
            (navigation as any).navigate('VillaEdit');
            return;
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Render center circular hero button for AdminAddVillaTab (+ Add Villa)
        if (route.name === 'AdminAddVillaTab') {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.centerTabContainer}
            >
              <View style={[styles.centerCircleButton, { backgroundColor: G }]}>
                <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
              </View>
              <Text style={[styles.centerTabLabel, { color: G }]}>
                {label}
              </Text>
            </Pressable>
          );
        }

        // Render normal tab items
        let Icon = LayoutGrid;
        if (route.name === 'HomeTab') Icon = LayoutGrid;
        else if (route.name === 'VillasTab') Icon = Building2;
        else if (route.name === 'BookingsTab') Icon = BookUser;
        else if (route.name === 'MoreTab') Icon = User;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {/* Top active indicator line */}
            <View style={[
              styles.tabIndicator,
              { backgroundColor: isFocused ? G : 'transparent' }
            ]} />
            <View style={styles.tabItemContent}>
              <Icon
                color={isFocused ? G : theme.textMuted}
                size={23}
                strokeWidth={isFocused ? 2.2 : 1.8}
              />
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? G : theme.textMuted }
              ]}>
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function AdminTabNavigator() {
  return (
    <AdminTab.Navigator
      tabBar={(props) => <AdminTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <AdminTab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <AdminTab.Screen
        name="VillasTab"
        component={VillasScreen}
        options={{
          title: 'Villas',
        }}
      />
      <AdminTab.Screen
        name="AdminAddVillaTab"
        component={DummyAddVilla}
        options={{
          title: 'Add Villa',
        }}
      />
      <AdminTab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          title: 'Bookings',
        }}
      />
      <AdminTab.Screen
        name="MoreTab"
        component={MoreScreen}
        options={{
          title: 'Account',
        }}
      />
    </AdminTab.Navigator>
  );
}

// ─── Customer tab bar customization ──────────────────────
function CustomerTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Render center circular button for CFavoritesTab (Saved)
        if (route.name === 'CFavoritesTab') {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.centerTabContainer}
            >
              <View style={[styles.centerCircleButton, { backgroundColor: '#C9A14A' }]}>
                <Heart color="#FFFFFF" size={26} strokeWidth={2.2} fill={isFocused ? "#FFFFFF" : "none"} />
              </View>
              <Text style={[styles.centerTabLabel, { color: isFocused ? '#C9A14A' : theme.textMuted }]}>
                {label}
              </Text>
            </Pressable>
          );
        }

        // Render normal tab items
        let Icon = Home;
        if (route.name === 'CHomeTab') Icon = Home;
        else if (route.name === 'Search') Icon = Search;
        else if (route.name === 'CBookingsTab') Icon = BookOpen;
        else if (route.name === 'CProfileTab') Icon = User;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {/* Top active indicator line */}
            <View style={[
              styles.tabIndicator,
              { backgroundColor: isFocused ? '#C9A14A' : 'transparent' }
            ]} />
            <View style={styles.tabItemContent}>
              <Icon
                color={isFocused ? '#C9A14A' : theme.textMuted}
                size={23}
                strokeWidth={isFocused ? 2.2 : 1.8}
              />
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? '#C9A14A' : theme.textMuted }
              ]}>
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Customer tab navigator ───────────────────────────────
function CustomerTabNavigator() {
  return (
    <CustomerTab.Navigator
      tabBar={(props) => <CustomerTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <CustomerTab.Screen
        name="CHomeTab"
        component={CHomeScreen}
        options={{
          title: 'Explore',
        }}
      />
      <CustomerTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />
      <CustomerTab.Screen
        name="CFavoritesTab"
        component={CFavoritesScreen}
        options={{
          title: 'Saved',
        }}
      />
      <CustomerTab.Screen
        name="CBookingsTab"
        component={CBookingsScreen}
        options={{
          title: 'Bookings',
        }}
      />
      <CustomerTab.Screen
        name="CProfileTab"
        component={CProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </CustomerTab.Navigator>
  );
}

function DummyAddVilla() {
  return null;
}

// ─── Host tab bar customization ──────────────────────────
function HostTabBar({ state, descriptors, navigation }: any) {
  const { theme } = useTheme();
  const G = '#C9A14A';

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === 'HostAddVillaTab') {
            (navigation as any).navigate('VillaEdit');
            return;
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Render center circular hero button for HostAddVillaTab (+ Add Villa)
        if (route.name === 'HostAddVillaTab') {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.centerTabContainer}
            >
              <View style={[styles.centerCircleButton, { backgroundColor: G }]}>
                <Plus color="#FFFFFF" size={28} strokeWidth={2.5} />
              </View>
              <Text style={[styles.centerTabLabel, { color: G }]}>
                {label}
              </Text>
            </Pressable>
          );
        }

        // Render normal tab items
        let Icon = LayoutGrid;
        if (route.name === 'HostHomeTab') Icon = LayoutGrid;
        else if (route.name === 'HostVillasTab') Icon = Building2;
        else if (route.name === 'HostBookingsTab') Icon = BookUser;
        else if (route.name === 'HostMoreTab') Icon = User;

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {/* Top active indicator line */}
            <View style={[
              styles.tabIndicator,
              { backgroundColor: isFocused ? G : 'transparent' }
            ]} />
            <View style={styles.tabItemContent}>
              <Icon
                color={isFocused ? G : theme.textMuted}
                size={23}
                strokeWidth={isFocused ? 2.2 : 1.8}
              />
              <Text style={[
                styles.tabLabel,
                { color: isFocused ? G : theme.textMuted }
              ]}>
                {label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Host tab navigator ──────────────────────────────────
export type HostTabParamList = {
  HostHomeTab: undefined;
  HostVillasTab: undefined;
  HostAddVillaTab: undefined;
  HostBookingsTab: undefined;
  HostMoreTab: undefined;
};

const HostTab = createBottomTabNavigator<HostTabParamList>();

function HostTabNavigator() {
  return (
    <HostTab.Navigator
      tabBar={(props) => <HostTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <HostTab.Screen
        name="HostHomeTab"
        component={HostHomeScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <HostTab.Screen
        name="HostVillasTab"
        component={HostVillasScreen}
        options={{
          title: 'My Villas',
        }}
      />
      <HostTab.Screen
        name="HostAddVillaTab"
        component={DummyAddVilla}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            (navigation.getParent() as any)?.navigate('VillaEdit');
          },
        })}
        options={{
          title: 'Add Villa',
        }}
      />
      <HostTab.Screen
        name="HostBookingsTab"
        component={HostBookingsScreen}
        options={{
          title: 'Bookings',
        }}
      />
      <HostTab.Screen
        name="HostMoreTab"
        component={HostMoreScreen}
        options={{
          title: 'Account',
        }}
      />
    </HostTab.Navigator>
  );
}

// ─── App content with role-based routing ─────────────────
function AppContent() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated, role, user } = useAuth();

  const getInitialRoute = (): keyof RootStackParamList => {
    if (!isAuthenticated) return 'Login';
    if (role === 'admin') return 'MainTabs';
    if (role === 'host') {
      return user?.hostVerificationStatus === 'verified' ? 'HostTabs' : 'HostVerification';
    }
    return 'CustomerTabs';
  };

  const navigation = (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          // RN-web: stack cards need a bounded height so nested ScrollViews can scroll
          // (html/body/#root use overflow:hidden in index.html).
          ...(Platform.OS === 'web'
            ? { cardStyle: { flex: 1, height: '100%' } }
            : null),
        }}
      >
        {/* Entry screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Intro" component={IntroScreen} />

        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Host screens */}
        <Stack.Screen name="HostTabs" component={HostTabNavigator} />
        <Stack.Screen name="HostVerification" component={HostVerificationScreen} />

        {/* Admin screens */}
        <Stack.Screen name="MainTabs" component={AdminTabNavigator} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="CampaignEdit" component={CampaignEditScreen} />
        <Stack.Screen name="Campaigns" component={CampaignsScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="SyncLogs" component={SyncLogsScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="VillaEdit" component={VillaEditScreen} />
        <Stack.Screen name="SupportDisputes" component={SupportDisputesScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />

        {/* Customer: tab navigator */}
        <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />

        {/* Customer: stack screens */}
        <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
        <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
        <Stack.Screen name="CBookingDetail" component={CBookingDetailScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="CNotifications" component={CNotificationsScreen} />
        <Stack.Screen name="CSettings" component={CSettingsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />

        <Stack.Screen name="EditProfile" component={CProfileScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="OpenSourceLicenses" component={OpenSourceLicensesScreen} />
        <Stack.Screen name="DataSafety" component={DataSafetyScreen} />
        <Stack.Screen name="PrivilegeClub" component={PrivilegeClubScreen} />
        <Stack.Screen name="CHomeTab" component={CustomerTabNavigator} />
        <Stack.Screen name="CFavoritesTab" component={CustomerTabNavigator} />
        <Stack.Screen name="CBookingsTab" component={CustomerTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return (
    <SafeAreaProvider>
      {Platform.OS !== 'web' && (
        <StatusBar barStyle="light-content" backgroundColor={theme.gold} />
      )}
      {navigation}
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, height: '100%', width: '100%', ...(Platform.OS === 'web' ? { overflow: 'hidden' as const } : null) },
  tabBarContainer: {
    flexDirection: 'row',
    height: 72,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 15,
    overflow: 'visible',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    position: 'relative',
  },
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  tabIndicator: {
    width: 28,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    position: 'absolute',
    top: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  centerTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  centerCircleButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  centerTabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 38,
  },
});

export default App;
