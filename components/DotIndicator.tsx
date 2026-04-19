// components/DotIndicator.tsx
// Hiển thị các chấm tròn chỉ vị trí slide hiện tại trong onboarding swipe
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import type { SharedValue } from 'react-native-reanimated';

interface Props {
  count: number;           // tổng số slide
  scrollX: SharedValue<number>; // ✅ sửa lại ở đây
  slideWidth: number;      
}

export default function DotIndicator({ count, scrollX, slideWidth }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [
            (index - 1) * slideWidth,
            index * slideWidth,
            (index + 1) * slideWidth,
          ];

          const width = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP
          );

          return { width, opacity };
        });

        return (
          <Animated.View key={index} style={[styles.dot, animatedStyle]} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
});