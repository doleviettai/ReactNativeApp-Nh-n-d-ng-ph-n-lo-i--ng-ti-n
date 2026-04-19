// app/(onboarding)/index.tsx
// Slide 1: Welcome — màn hình chào mừng đầu tiên
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/colors';

const { height: SCREEN_H } = Dimensions.get('window');

const CURRENCY_PILLS = [
  { code: 'VND', flag: '🇻🇳', color: '#2a1f00', textColor: '#f0c040' },
  { code: 'USD', flag: '🇺🇸', color: '#002a1a', textColor: '#4de8a0' },
  { code: 'IDR', flag: '🇮🇩', color: '#2a0010', textColor: '#ff6090' },
  { code: 'MYR', flag: '🇲🇾', color: '#001a2a', textColor: '#60c0ff' },
  { code: 'THB', flag: '🇹🇭', color: '#1a002a', textColor: '#c060ff' },
  { code: 'SGD', flag: '🇸🇬', color: '#002a2a', textColor: '#40e0d0' },
  { code: 'PHP', flag: '🇵🇭', color: '#1a1a00', textColor: '#d4e040' },
];

interface Props {
  onNext: () => void;
}

export default function WelcomeSlide({ onNext }: Props) {
  // Fade + slide up animations khi mount
  const logoOpacity = useSharedValue(0);
  const logoY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const pillsOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });

    titleOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(300, withTiming(0, { duration: 500 }));

    pillsOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const pillsStyle = useAnimatedStyle(() => ({ opacity: pillsOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Logo */}
        <Animated.View style={[styles.logoArea, logoStyle]}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>💵</Text>
          </View>
          <Text style={styles.logoText}>CurrencyAI</Text>
          <Text style={styles.logoSub}>NHẬN DIỆN TIỀN THÔNG MINH</Text>
        </Animated.View>

        {/* Title + description */}
        <Animated.View style={[styles.center, titleStyle]}>
          <Text style={styles.title}>Nhận diện tiền tệ{'\n'}bằng trí tuệ nhân tạo</Text>
          <Text style={styles.desc}>
            Phân loại 76 loại tờ tiền từ 7 quốc gia, phát hiện tiền giả chính xác và nhanh chóng
          </Text>

          {/* Currency pills */}
          <Animated.View style={[styles.pills, pillsStyle]}>
            {CURRENCY_PILLS.map((p) => (
              <View
                key={p.code}
                style={[styles.pill, { backgroundColor: p.color }]}
              >
                <Text style={styles.pillText}>{p.flag} {p.code}</Text>
              </View>
            ))}
          </Animated.View>
        </Animated.View>

        {/* Button */}
        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <PrimaryButton title="Bắt đầu ngay →" onPress={onNext} />
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 100, // chừa chỗ cho dot indicator
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    gap: 8,
    marginTop: SCREEN_H * 0.08,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: '#2a1f00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0c04040',
  },
  logoEmoji: { fontSize: 40 },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  center: {
    alignItems: 'center',
    gap: 14,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 36,
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 6,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  btnWrapper: {
    width: '100%',
    marginBottom: 16,
  },
});