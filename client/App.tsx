import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutGrid, CalendarDays, BookUser, Menu, Users,
  Home, Search, Heart, BookOpen, User,
} from 'lucide-react-native';

import { ThemeProvider, useTheme } from './lib/theme-context';
import { AuthProvider, useAuth } from './lib/auth-context';
import { DataProvider } from './lib/data-context';

// ─── Host Screens ─────────────────────────────────────────
import HostHomeScreen from './screens/host/HostHomeScreen';
import HostVillasScreen from './screens/host/HostVillasScreen';
import HostBookingsScreen from './screens/host/HostBookingsScreen';
import HostMoreScreen from './screens/host/HostMoreScreen';
import HostVerificationScreen from './screens/host/HostVerificationScreen';

// ─── Admin Screens ────────────────────────────────────────
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BookingsScreen from './screens/BookingsScreen';
import VillasScreen from './screens/VillasScreen';
import MoreScreen from './screens/MoreScreen';
import BookingDetailScreen from './screens/BookingDetailScreen';
import CalendarScreen from './screens/CalendarScreen';
import CampaignEditScreen from './screens/CampaignEditScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PricingScreen from './screens/PricingScreen';
import SettingsScreen from './screens/SettingsScreen';
import SyncLogsScreen from './screens/SyncLogsScreen';
import UsersScreen from './screens/UsersScreen';
import VillaEditScreen from './screens/VillaEditScreen';
import SupportDisputesScreen from './screens/SupportDisputesScreen';
import PaymentsScreen from './screens/PaymentsScreen';

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

// ─── Navigation Types ─────────────────────────────────────
export type RootStackParamList = {
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
  BookingFlow: { propertyId: string };
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
  // Cross-navigation shortcuts from profile
  CFavoritesTab: undefined;
  CBookingsTab: undefined;
  CHomeTab: undefined;
};

export type AdminTabParamList = {
  HomeTab: undefined;
  VillasTab: undefined;
  BookingsTab: undefined;
  UsersTab: undefined;
  MoreTab: undefined;
};

export type CustomerTabParamList = {
  CHomeTab: undefined;
  Search: undefined;
  CFavoritesTab: undefined;
  CBookingsTab: undefined;
  CProfileTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();

function TabBarIcon({ Icon, color, focused }: { Icon: React.ElementType; color: string; focused: boolean }) {
  return <Icon color={color} size={23} strokeWidth={focused ? 2.2 : 1.8} />;
}

// ─── Admin tab navigator ──────────────────────────────────
function AdminTabNavigator() {
  const { theme } = useTheme();
  return (
    <AdminTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.gold,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <AdminTab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={LayoutGrid} color={color} focused={focused} />,
        }}
      />
      <AdminTab.Screen
        name="VillasTab"
        component={VillasScreen}
        options={{
          title: 'Villas',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={CalendarDays} color={color} focused={focused} />,
        }}
      />
      <AdminTab.Screen
        name="BookingsTab"
        component={BookingsScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={BookUser} color={color} focused={focused} />,
        }}
      />
      <AdminTab.Screen
        name="UsersTab"
        component={UsersScreen}
        options={{
          title: 'People',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Users} color={color} focused={focused} />,
        }}
      />
      <AdminTab.Screen
        name="MoreTab"
        component={MoreScreen}
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Menu} color={color} focused={focused} />,
        }}
      />
    </AdminTab.Navigator>
  );
}

// ─── Customer tab navigator ───────────────────────────────
function CustomerTabNavigator() {
  const { theme } = useTheme();
  return (
    <CustomerTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#C9A14A',
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <CustomerTab.Screen
        name="CHomeTab"
        component={CHomeScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Home} color={color} focused={focused} />,
        }}
      />
      <CustomerTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Search} color={color} focused={focused} />,
        }}
      />
      <CustomerTab.Screen
        name="CFavoritesTab"
        component={CFavoritesScreen}
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Heart} color={color} focused={focused} />,
        }}
      />
      <CustomerTab.Screen
        name="CBookingsTab"
        component={CBookingsScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={BookOpen} color={color} focused={focused} />,
        }}
      />
      <CustomerTab.Screen
        name="CProfileTab"
        component={CProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={User} color={color} focused={focused} />,
        }}
      />
    </CustomerTab.Navigator>
  );
}

// ─── Host tab navigator ──────────────────────────────────
export type HostTabParamList = {
  HostHomeTab: undefined;
  HostVillasTab: undefined;
  HostBookingsTab: undefined;
  HostMoreTab: undefined;
};

const HostTab = createBottomTabNavigator<HostTabParamList>();

function HostTabNavigator() {
  const { theme } = useTheme();
  return (
    <HostTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.gold,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
      }}
    >
      <HostTab.Screen
        name="HostHomeTab"
        component={HostHomeScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={LayoutGrid} color={color} focused={focused} />,
        }}
      />
      <HostTab.Screen
        name="HostVillasTab"
        component={HostVillasScreen}
        options={{
          title: 'My Villas',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={CalendarDays} color={color} focused={focused} />,
        }}
      />
      <HostTab.Screen
        name="HostBookingsTab"
        component={HostBookingsScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={BookUser} color={color} focused={focused} />,
        }}
      />
      <HostTab.Screen
        name="HostMoreTab"
        component={HostMoreScreen}
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Menu} color={color} focused={focused} />,
        }}
      />
    </HostTab.Navigator>
  );
}

// ─── App content with role-based routing ─────────────────
function AppContent() {
  const { isDark, theme } = useTheme();
  const { isAuthenticated, role, user } = useAuth();

  const getInitialRoute = (): keyof RootStackParamList => {
    if (!isAuthenticated) return 'Login';
    if (role === 'admin') return 'MainTabs';
    if (role === 'host') {
      return user?.hostVerificationStatus === 'verified' ? 'HostTabs' : 'HostVerification';
    }
    return 'CustomerTabs';
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={getInitialRoute()}
          screenOptions={{ headerShown: false }}
        >
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
          <Stack.Screen
            name="PropertyDetail"
            component={PropertyDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="BookingFlow"
            component={BookingFlowScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="BookingConfirmation"
            component={BookingConfirmationScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="CBookingDetail"
            component={CBookingDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
          <Stack.Screen name="CNotifications" component={CNotificationsScreen} />
          <Stack.Screen name="CSettings" component={CSettingsScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />

          {/* Placeholder screens */}
          <Stack.Screen name="EditProfile" component={CProfileScreen} />
          <Stack.Screen name="Verification" component={HostVerificationScreen} />
          <Stack.Screen name="PrivacyPolicy" component={SupportScreen} />
          <Stack.Screen name="Terms" component={SupportScreen} />
          <Stack.Screen name="CHomeTab" component={CustomerTabNavigator} />
          <Stack.Screen name="CFavoritesTab" component={CustomerTabNavigator} />
          <Stack.Screen name="CBookingsTab" component={CustomerTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
