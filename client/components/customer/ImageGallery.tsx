import React, { useState } from 'react';
import {
  View, Image, Pressable, StyleSheet, Modal, Text, ScrollView, Dimensions,
} from 'react-native';
import { X, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  onPress?: (index: number) => void;
}

export default function ImageGallery({ images, onPress }: ImageGalleryProps) {
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setFullScreenVisible(true);
    onPress?.(index);
  };

  const prev = () => setCurrentIndex((c) => Math.max(0, c - 1));
  const next = () => setCurrentIndex((c) => Math.min(images.length - 1, c + 1));

  return (
    <>
      {/* Grid layout */}
      <View style={styles.grid}>
        {/* Hero image */}
        <Pressable
          style={styles.heroImage}
          onPress={() => openFullscreen(0)}
        >
          <Image source={{ uri: images[0] }} style={styles.heroImg} resizeMode="cover" />
        </Pressable>

        {/* Right thumbnails */}
        {images.length > 1 && (
          <View style={styles.thumbsColumn}>
            {images.slice(1, 3).map((uri, i) => (
              <Pressable
                key={i}
                style={styles.thumbWrapper}
                onPress={() => openFullscreen(i + 1)}
              >
                <Image source={{ uri }} style={styles.thumbImg} resizeMode="cover" />
                {i === 1 && images.length > 3 && (
                  <View style={styles.moreOverlay}>
                    <Grid2x2 size={18} color="#fff" />
                    <Text style={styles.moreText}>+{images.length - 3} more</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Horizontal scroll row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {images.map((uri, i) => (
          <Pressable key={i} onPress={() => openFullscreen(i)}>
            <Image
              source={{ uri }}
              style={[styles.scrollThumb, i === 0 && { borderColor: '#C9A14A', borderWidth: 2 }]}
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Full screen modal */}
      <Modal visible={fullScreenVisible} transparent animationType="fade">
        <View style={styles.fullScreenOverlay}>
          {/* Close */}
          <Pressable onPress={() => setFullScreenVisible(false)} style={styles.closeBtn}>
            <X size={22} color="#fff" />
          </Pressable>

          {/* Counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>{currentIndex + 1} / {images.length}</Text>
          </View>

          {/* Image */}
          <Image
            source={{ uri: images[currentIndex] }}
            style={styles.fullImage}
            resizeMode="contain"
          />

          {/* Nav buttons */}
          {currentIndex > 0 && (
            <Pressable onPress={prev} style={[styles.navBtn, styles.navLeft]}>
              <ChevronLeft size={28} color="#fff" />
            </Pressable>
          )}
          {currentIndex < images.length - 1 && (
            <Pressable onPress={next} style={[styles.navBtn, styles.navRight]}>
              <ChevronRight size={28} color="#fff" />
            </Pressable>
          )}

          {/* Dots */}
          <View style={styles.dots}>
            {images.map((_, i) => (
              <Pressable key={i} onPress={() => setCurrentIndex(i)}>
                <View style={[styles.dot, { backgroundColor: i === currentIndex ? '#C9A14A' : 'rgba(255,255,255,0.5)' }]} />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    height: 260,
    gap: 4,
  },
  heroImage: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  thumbsColumn: {
    flex: 1,
    gap: 4,
  },
  thumbWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  moreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollRow: {
    paddingHorizontal: 20,
    gap: 8,
    paddingTop: 8,
  },
  scrollThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  counter: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  counterText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  fullImage: {
    width: SCREEN_W,
    height: SCREEN_H * 0.75,
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -24 }],
  },
  navLeft: {
    left: 16,
  },
  navRight: {
    right: 16,
  },
  dots: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
