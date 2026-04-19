// components/ConfidenceBar.tsx
// Thanh hiển thị % độ tin cậy của kết quả AI, có animation fill khi mount
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

interface Props {
  label: string;
  value: number;   // 0 → 1
  color?: string;
  showPercent?: boolean;
}

export default function ConfidenceBar({
  label,
  value,
  color = Colors.green,
  showPercent = true,
}: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(value, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const percent = Math.round(value * 100);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {showPercent && (
          <Text style={[styles.percent, { color }]}>{percent}%</Text>
        )}
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle, { backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  percent: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    height: 5,
    backgroundColor: Colors.bgBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});