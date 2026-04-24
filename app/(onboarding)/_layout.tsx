// app/(onboarding)/_layout.tsx
// FlatList swipe ngang 3 slide — tự re-render khi useTranslation phát hiện ngôn ngữ đổi
import React, { useRef, useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet,
  useWindowDimensions, ViewToken,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next'; // import để component re-render khi đổi lang

import WelcomeSlide     from './index';
import InstructionSlide from './instruction';
import PrepareSlide     from './prepare';
import DotIndicator     from '@/components/DotIndicator';

const SLIDES = ['welcome', 'instruction', 'prepare'] as const;

export default function OnboardingLayout() {
  const { width } = useWindowDimensions();
  // useTranslation ở đây giúp layout re-render khi ngôn ngữ thay đổi,
  // kéo theo tất cả slide con cũng re-render với text mới
  useTranslation();

  const flatRef    = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX    = useSharedValue(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }, []
  );

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const goNext = useCallback(() => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      router.replace('/choose');
    }
  }, [activeIndex]);

  const goBack = useCallback(() => {
    if (activeIndex > 0) {
      flatRef.current?.scrollToIndex({ index: activeIndex - 1, animated: true });
    }
  }, [activeIndex]);

  const renderSlide = ({ item }: { item: typeof SLIDES[number] }) => (
    <View style={{ width }}>
      {item === 'welcome' && (
        <WelcomeSlide onNext={goNext} />
      )}
      {item === 'instruction' && (
        <InstructionSlide onNext={goNext} onBack={goBack} currentIndex={1} total={3} />
      )}
      {item === 'prepare' && (
        <PrepareSlide onNext={goNext} onBack={goBack} currentIndex={2} total={3} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={[...SLIDES]}
        keyExtractor={item => item}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={e => { scrollX.value = e.nativeEvent.contentOffset.x; }}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width, offset: width * index, index,
        })}
      />

      {/* Dot indicator */}
      <View style={styles.dots}>
        <DotIndicator count={SLIDES.length} scrollX={scrollX} slideWidth={width} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  dots: {
    position: 'absolute',
    bottom: 44, left: 0, right: 0,
    alignItems: 'center',
  },
});