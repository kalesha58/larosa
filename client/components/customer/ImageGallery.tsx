import React, { useState } from 'react';
import {
  View, Image, Pressable, StyleSheet, Modal, Text, Platform, useWindowDimensions,
} from 'react-native';
import { X, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react-native';
import { useTheme } from '../../lib/theme-context';

interface ImageGalleryProps {
  images: string[];
  onPress?: (index: number) => void;
}

export default function ImageGallery({ images, onPress }: ImageGalleryProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isDesktop = Platform.OS === 'web' && width >= 768;
  const photos = images.length > 0 ? images : [];

  const openFullscreen = (index: number) => {
    setCurrentIndex(index);
    setFullScreenVisible(true);
    onPress?.(index);
  };

  const prev = () => setCurrentIndex((c) => Math.max(0, c - 1));
  const next = () => setCurrentIndex((c) => Math.min(photos.length - 1, c + 1));

  if (photos.length === 0) return null;

  return (
    <>
      {isDesktop ? (
        <View style={styles.mosaic}>
          <Pressable style={styles.mosaicHero} onPress={() => openFullscreen(0)}>
            <Image source={{ uri: photos[0] }} style={styles.fillImg} resizeMode="cover" />
          </Pressable>
          <View style={styles.mosaicGrid}>
            {[1, 2, 3, 4].map((i) => {
              const uri = photos[i] ?? photos[i % photos.length];
              const isLast = i === 4;
              return (
                <Pressable
                  key={i}
                  style={[
                    styles.mosaicCell,
                    i === 1 && styles.mosaicTopLeft,
                    i === 2 && styles.mosaicTopRight,
                    i === 3 && styles.mosaicBottomLeft,
                    i === 4 && styles.mosaicBottomRight,
                  ]}
                  onPress={() => openFullscreen(Math.min(i, photos.length - 1))}
                >
                  <Image source={{ uri }} style={styles.fillImg} resizeMode="cover" />
                  {isLast && (
                    <Pressable
                      onPress={() => openFullscreen(0)}
                      style={[styles.showAllBtn, { backgroundColor: theme.surface }]}
                    >
                      <Grid2x2 size={14} color={theme.text} />
                      <Text style={[styles.showAllText, { color: theme.text }]}>Show all photos</Text>
                    </Pressable>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.mobileHeroWrap}>
          <Pressable style={styles.mobileHero} onPress={() => openFullscreen(0)}>
            <Image source={{ uri: photos[0] }} style={styles.fillImg} resizeMode="cover" />
          </Pressable>
          <Pressable
            onPress={() => openFullscreen(0)}
            style={[styles.showAllBtnMobile, { backgroundColor: theme.surface }]}
          >
            <Grid2x2 size={14} color={theme.text} />
            <Text style={[styles.showAllText, { color: theme.text }]}>Show all photos</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={fullScreenVisible} transparent animationType="fade">
        <View style={styles.fullScreenOverlay}>
          <Pressable style={styles.closeBtn} onPress={() => setFullScreenVisible(false)}>
            <X size={22} color="#fff" />
          </Pressable>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {photos.length}
            </Text>
          </View>
          <Image
            source={{ uri: photos[currentIndex] }}
            style={[styles.fullImage, { width: Math.min(width, 1200), height: width > 768 ? 560 : width * 0.7 }]}
            resizeMode="contain"
          />
          {currentIndex > 0 && (
            <Pressable style={[styles.navBtn, styles.navLeft]} onPress={prev}>
              <ChevronLeft size={28} color="#fff" />
            </Pressable>
          )}
          {currentIndex < photos.length - 1 && (
            <Pressable style={[styles.navBtn, styles.navRight]} onPress={next}>
              <ChevronRight size={28} color="#fff" />
            </Pressable>
          )}
          <View style={styles.dots}>
            {photos.map((_, i) => (
              <Pressable key={i} onPress={() => setCurrentIndex(i)}>
                <View style={[styles.dot, { backgroundColor: i === currentIndex ? theme.gold : 'rgba(255,255,255,0.45)' }]} />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mosaic: {
    flexDirection: 'row',
    height: 420,
    gap: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mosaicHero: {
    flex: 2,
    overflow: 'hidden',
  },
  mosaicGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mosaicCell: {
    width: '48.5%',
    height: '48.5%',
    overflow: 'hidden',
    position: 'relative',
  },
  mosaicTopLeft: { borderTopLeftRadius: 0 },
  mosaicTopRight: { borderTopRightRadius: 12 },
  mosaicBottomLeft: {},
  mosaicBottomRight: { borderBottomRightRadius: 12 },
  fillImg: {
    width: '100%',
    height: '100%',
  },
  showAllBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  showAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  mobileHeroWrap: {
    position: 'relative',
    height: 280,
    borderRadius: 0,
    overflow: 'hidden',
  },
  mobileHero: {
    width: '100%',
    height: '100%',
  },
  showAllBtnMobile: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
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
    top: 56,
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
    maxWidth: '100%',
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
    marginTop: -24,
  },
  navLeft: { left: 16 },
  navRight: { right: 16 },
  dots: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
