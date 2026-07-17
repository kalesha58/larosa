import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutGrid, CalendarDays, BookUser, Menu } from 'lucide-react-native';

import { ThemeProvider, useTheme } from './lib/theme-context';
import { AuthProvider } from './lib/auth-context';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import BookingsScreen from './screens/BookingsScreen';
import VillasScreen from './screens/VillasScreen';
import MoreScreen from './screens/MoreScreen';
import LoginScreen from './screens/LoginScreen';
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

// Types for navigation
export type RootStackParamList = {
  Login: undefined;
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
};

export type TabParamList = {
  HomeTab: undefined;
  VillasTab: undefined;
  BookingsTab: undefined;
  MoreTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabBarIcon({ Icon, color, focused }: { Icon: React.ElementType; color: string; focused: boolean }) {
  return <Icon color={color} size={23} strokeWidth={focused ? 2.2 : 1.8} />;
}

function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={LayoutGrid} color={color} focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="VillasTab" 
        component={VillasScreen} 
        options={{
          title: 'Villas',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={CalendarDays} color={color} focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsScreen} 
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={BookUser} color={color} focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="MoreTab" 
        component={MoreScreen} 
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Menu} color={color} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
          />
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabNavigator} 
          />
          <Stack.Screen 
            name="BookingDetail" 
            component={BookingDetailScreen} 
          />
          <Stack.Screen 
            name="Calendar" 
            component={CalendarScreen} 
          />
          <Stack.Screen 
            name="CampaignEdit" 
            component={CampaignEditScreen} 
          />
          <Stack.Screen 
            name="Campaigns" 
            component={CampaignsScreen} 
          />
          <Stack.Screen 
            name="Feedback" 
            component={FeedbackScreen} 
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
          />
          <Stack.Screen 
            name="Pricing" 
            component={PricingScreen} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
          />
          <Stack.Screen 
            name="SyncLogs" 
            component={SyncLogsScreen} 
          />
          <Stack.Screen 
            name="Users" 
            component={UsersScreen} 
          />
          <Stack.Screen 
            name="VillaEdit" 
            component={VillaEditScreen} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
