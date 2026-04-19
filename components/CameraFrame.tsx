// components/CameraFrame.tsx
// Khung ngắm hình chữ nhật với 4 góc vàng để căn tờ tiền khi chụp
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

const { width: SCREEN_W } = Dimensions.get('window');

const FRAME_W = SCREEN_W * 0.82;
const FRAME_H = FRAME_W * 0.58; // tỉ lệ tờ tiền
const CORNER = 22;
const THICKNESS = 3;

interface Props {
  hint?: string;
}

export default function CameraFrame({
  hint = 'Đưa tờ tiền vào giữa khung\nCanh đủ ánh sáng để kết quả chính xác',
}: Props) {
  // Animation nhấp nháy nhẹ border khi đang chờ chụp
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <View style={styles.wrapper}>
      {/* Viền mờ xung quanh frame */}
      <View style={styles.overlay} />

      {/* Frame chính */}
      <View style={[styles.frame, { width: FRAME_W, height: FRAME_H }]}>

        {/* 4 góc vàng */}
        {/* Trên trái */}
        <Animated.View style={[styles.corner, styles.cornerTL, pulseStyle]}>
          <View style={[styles.cornerH, { width: CORNER, height: THICKNESS }]} />
          <View style={[styles.cornerV, { width: THICKNESS, height: CORNER }]} />
        </Animated.View>

        {/* Trên phải */}
        <Animated.View style={[styles.corner, styles.cornerTR, pulseStyle]}>
          <View style={[styles.cornerH, { width: CORNER, height: THICKNESS }]} />
          <View style={[styles.cornerV, { width: THICKNESS, height: CORNER, alignSelf: 'flex-end' }]} />
        </Animated.View>

        {/* Dưới trái */}
        <Animated.View style={[styles.corner, styles.cornerBL, pulseStyle]}>
          <View style={[styles.cornerV, { width: THICKNESS, height: CORNER }]} />
          <View style={[styles.cornerH, { width: CORNER, height: THICKNESS }]} />
        </Animated.View>

        {/* Dưới phải */}
        <Animated.View style={[styles.corner, styles.cornerBR, pulseStyle]}>
          <View style={[styles.cornerV, { width: THICKNESS, height: CORNER, alignSelf: 'flex-end' }]} />
          <View style={[styles.cornerH, { width: CORNER, height: THICKNESS }]} />
        </Animated.View>
      </View>

      {/* Hint text bên dưới frame */}
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  frame: {
    borderRadius: 12,
    position: 'relative',
    // Đục lỗ overlay bằng cách dùng backgroundColor transparent
    backgroundColor: 'transparent',
    // Viền mỏng mờ làm nền
    borderWidth: 1,
    borderColor: 'rgba(240,192,64,0.25)',
  },
  corner: {
    position: 'absolute',
  },
  cornerTL: { top: -THICKNESS / 2, left: -THICKNESS / 2 },
  cornerTR: { top: -THICKNESS / 2, right: -THICKNESS / 2, alignItems: 'flex-end' },
  cornerBL: { bottom: -THICKNESS / 2, left: -THICKNESS / 2, justifyContent: 'flex-end' },
  cornerBR: { bottom: -THICKNESS / 2, right: -THICKNESS / 2, alignItems: 'flex-end', justifyContent: 'flex-end' },
  cornerH: {
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  cornerV: {
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  hint: {
    color: Colors.gold,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
    letterSpacing: 0.2,
  },
});