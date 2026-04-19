// components/LoadingOverlay.tsx
// Overlay toàn màn hình khi đang gửi ảnh lên ML server và chờ kết quả
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface Props {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  visible,
  message = 'AI đang phân tích tờ tiền...',
}: Props) {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      rotate.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1
      );
    } else {
      rotate.value = 0;
      scale.value = 1;
    }
  }, [visible]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Spinner */}
          <Animated.View style={[styles.spinnerWrapper, pulseStyle]}>
            <Animated.View style={[styles.spinner, spinStyle]}>
              <View style={styles.spinnerInner} />
            </Animated.View>
            <Text style={styles.icon}>💵</Text>
          </Animated.View>

          <Text style={styles.title}>Đang nhận diện</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Dots animation */}
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <AnimatedDot key={i} delay={i * 200} />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function AnimatedDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1
      );
    }, delay);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  spinnerWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  spinner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.bgBorder,
    borderTopColor: Colors.gold,
    position: 'absolute',
  },
  spinnerInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.bgBorder,
    borderBottomColor: Colors.green,
  },
  icon: {
    fontSize: 24,
    position: 'absolute',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
});