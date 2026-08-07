import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';

export default function SplashScreen() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated, role, user } = useAuth();
  const navigation = useNavigation<any>();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo Fade and Scale In
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 950,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Logo subtle rotate animation to give organic premium feel
    Animated.timing(logoRotate, {
      toValue: 1,
      duration: 1800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // 3. Text (Brand name & Tagline) slide up & fade in
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. Loading indicator fade-in
    Animated.sequence([
      Animated.delay(1200),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Check status and route after animations finish
    const timer = setTimeout(async () => {
      let hasSeenIntro = false;
      try {
        if (Platform.OS === 'web') {
          hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
        }
      } catch (e) {
        console.warn('Error reading intro state', e);
      }

      if (isAuthenticated) {
        if (role === 'admin') {
          navigation.replace('MainTabs');
        } else if (role === 'host') {
          if (user?.hostVerificationStatus === 'verified') {
            navigation.replace('HostTabs');
          } else {
            navigation.replace('HostVerification');
          }
        } else {
          navigation.replace('CustomerTabs');
        }
      } else {
        if (hasSeenIntro) {
          navigation.replace('Login');
        } else {
          navigation.replace('Intro');
        }
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, role, user, navigation]);

  const spinLogo = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      <View style={styles.centerContainer}>
        {/* Animated Brand Emblem */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              borderColor: theme.gold,
              shadowColor: theme.gold,
              backgroundColor: theme.surface,
              transform: [{ scale: logoScale }, { rotate: spinLogo }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Text style={[styles.logoLetter, { color: theme.gold }]}>L</Text>
        </Animated.View>

        {/* Animated App Name and Tagline */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={[styles.brandTitle, { color: theme.text }]}>LaRosa</Text>
          <Text style={[styles.brandTagline, { color: theme.gold }]}>
            Premium Farmhouse Stays
          </Text>
        </Animated.View>
      </View>

      {/* Pulsing visual loading element */}
      <Animated.View style={[styles.footerContainer, { opacity: loaderOpacity }]}>
        <View style={[styles.pulseCircle, { backgroundColor: theme.goldGlow }]}>
          <View style={[styles.pulseInner, { backgroundColor: theme.gold }]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 52,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  brandTagline: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pulseCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
