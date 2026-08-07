import React, { useState, useRef } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Compass, ShieldCheck, Waves, Flame, CreditCard, Headset } from 'lucide-react-native';
import { useTheme } from '../lib/theme-context';

// Import slide images
import villaForest from '../assets/images/villa_forest.png';
import villaLake from '../assets/images/villa_lake.png';
import villaInterior from '../assets/images/villa_interior.png';

interface Slide {
  id: string;
  image: any;
  title: string;
  subtitle: string;
  highlights: { icon: any; text: string }[];
}

export default function IntroScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: Slide[] = [
    {
      id: '1',
      image: villaForest,
      title: 'Exquisite Forest Retreats',
      subtitle: 'Discover handpicked premium farmhouses and luxury glass villas nestled deep in India\'s most serene nature reserves.',
      highlights: [
        { icon: Compass, text: 'Scenic Locations' },
        { icon: ShieldCheck, text: 'Secure Estates' },
      ],
    },
    {
      id: '2',
      image: villaLake,
      title: 'Immersive Experiences',
      subtitle: 'Unwind with private infinity pools, curated bonfire nights, and local organic culinary spreads crafted by personal chefs.',
      highlights: [
        { icon: Waves, text: 'Private Pools' },
        { icon: Flame, text: 'Bonfire Lounge' },
      ],
    },
    {
      id: '3',
      image: villaInterior,
      title: 'Seamless Bookings',
      subtitle: 'Book your bespoke escape in seconds. Access real-time availability, instant confirmations, and dedicated 24/7 concierge support.',
      highlights: [
        { icon: CreditCard, text: 'Secure Payments' },
        { icon: Headset, text: '24/7 Concierge' },
      ],
    },
  ];

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / screenWidth);
    if (index !== activeIndex && index >= 0 && index < slides.length) {
      setActiveIndex(index);
    }
  };

  const handleNext = async () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (activeIndex + 1) * screenWidth,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    } else {
      await finishOnboarding();
    }
  };

  const handleSkip = async () => {
    await finishOnboarding();
  };

  const finishOnboarding = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('hasSeenIntro', 'true');
      }
    } catch (e) {
      console.warn('Error saving onboarding state', e);
    }
    navigation.replace('Login');
  };

  const imageSource = (src: any) => (typeof src === 'number' ? src : { uri: src });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      {/* Top Header - Skip button */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={[styles.logoDot, { backgroundColor: theme.gold }]} />
          <Text style={[styles.logoText, { color: theme.text }]}>LaRosa</Text>
        </View>
        {activeIndex < slides.length - 1 && (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Slide Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={{ height: '100%' }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width: screenWidth, height: '100%' }}>
            {/* Image Container (Top 52% of available space) */}
            <View style={styles.imageContainer}>
              <Image
                source={imageSource(slide.image)}
                style={styles.slideImage}
                resizeMode="cover"
              />
              <View style={[styles.imageOverlay, { backgroundColor: isDark ? 'rgba(10, 17, 14, 0.15)' : 'rgba(0, 0, 0, 0.05)' }]} />
            </View>

            {/* Content Container (Bottom 48% of available space) */}
            <View style={[styles.contentContainer, { backgroundColor: theme.surface }]}>
              <View style={styles.textSection}>
                <Text style={[styles.slideTitle, { color: theme.text }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.slideSubtitle, { color: theme.textSecondary }]}>
                  {slide.subtitle}
                </Text>

                {/* Highlight Chips Row */}
                <View style={styles.highlightsContainer}>
                  {slide.highlights.map((highlight, idx) => {
                    const IconComponent = highlight.icon;
                    return (
                      <View
                        key={idx}
                        style={[
                          styles.highlightChip,
                          {
                            backgroundColor: isDark ? 'rgba(35, 83, 71, 0.08)' : 'rgba(35, 83, 71, 0.04)',
                            borderColor: isDark ? 'rgba(35, 83, 71, 0.18)' : 'rgba(35, 83, 71, 0.1)',
                          },
                        ]}
                      >
                        <IconComponent size={14} color={theme.gold} strokeWidth={2} />
                        <Text style={[styles.highlightText, { color: theme.text }]}>
                          {highlight.text}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Control Bar */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopWidth: 0 }]}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {slides.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? theme.gold : theme.border,
                    width: isActive ? 22 : 8,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action Button */}
        <Pressable
          onPress={handleNext}
          style={[
            styles.actionButton,
            { backgroundColor: theme.gold },
            activeIndex === slides.length - 1 ? styles.actionButtonWide : null,
          ]}
        >
          {activeIndex === slides.length - 1 ? (
            <Text style={[styles.actionButtonText, { color: theme.textInverse }]}>
              Get Started
            </Text>
          ) : (
            <ChevronRight color={theme.textInverse} size={24} strokeWidth={2.5} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: '54%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },
  contentContainer: {
    height: '46%',
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 36,
  },
  textSection: {
    flex: 1,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    lineHeight: 34,
  },
  slideSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 10,
    height: 90,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'width 0.2s ease', // Smooth stretching indicator CSS (Web support)
  } as any,
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  actionButtonWide: {
    width: 140,
    borderRadius: 28,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 24,
  },
  highlightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
