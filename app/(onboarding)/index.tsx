// app/(onboarding)/index.tsx
// Slide 1: Welcome — có nút chọn ngôn ngữ góc trên phải, text đổi live
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import i18n, { LANGUAGES } from '@/i18n';
import PrimaryButton from '@/components/PrimaryButton';
import LanguagePicker from '@/components/LanguagePicker';
import { Colors } from '@/constants/colors';

const { height: SCREEN_H } = Dimensions.get('window');

const CURRENCY_PILLS = [
  {
    code: 'VND',
    flag: '🇻🇳',
    bg: '#2a1f00',
    country: 'Vietnam',
    currency: 'Vietnamese Dong',
    locale: 'vi-VN'
  },
  {
    code: 'USD',
    flag: '🇺🇸',
    bg: '#002a1a',
    country: 'United States',
    currency: 'US Dollar',
    locale: 'en-US'
  },
  {
    code: 'IDR',
    flag: '🇮🇩',
    bg: '#2a0010',
    country: 'Indonesia',
    currency: 'Indonesian Rupiah',
    locale: 'id-ID'
  },
  {
    code: 'MYR',
    flag: '🇲🇾',
    bg: '#001a2a',
    country: 'Malaysia',
    currency: 'Malaysian Ringgit',
    locale: 'ms-MY'
  },
  {
    code: 'THB',
    flag: '🇹🇭',
    bg: '#1a002a',
    country: 'Thailand',
    currency: 'Thai Baht',
    locale: 'th-TH'
  },
  {
    code: 'SGD',
    flag: '🇸🇬',
    bg: '#002a2a',
    country: 'Singapore',
    currency: 'Singapore Dollar',
    locale: 'en-SG'
  },
  {
    code: 'PHP',
    flag: '🇵🇭',
    bg: '#1a1a00',
    country: 'Philippines',
    currency: 'Philippine Peso',
    locale: 'en-PH'
  }
];

interface Props {
  onNext: () => void;
}

export default function WelcomeSlide({ onNext }: Props) {
  const { t } = useTranslation();
  const [pickerVisible, setPickerVisible] = useState(false);

  // Tìm thông tin ngôn ngữ hiện tại để hiện trên nút
  const currentLang = LANGUAGES.find(l => l.code === i18n.language)
    ?? LANGUAGES[0];

  // Animations
  const logoOpacity  = useSharedValue(0);
  const logoY        = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const titleY       = useSharedValue(20);
  const pillsOpacity = useSharedValue(0);
  const btnOpacity   = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value  = withTiming(1, { duration: 600 });
    logoY.value        = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    titleY.value       = withDelay(300, withTiming(0, { duration: 500 }));
    pillsOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    btnOpacity.value   = withDelay(900, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle  = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const pillsStyle = useAnimatedStyle(() => ({ opacity: pillsOpacity.value }));
  const btnStyle   = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Top bar: nút chọn ngôn ngữ góc phải ── */}
        <View style={styles.topBar}>
          {/* Placeholder trái để căn giữa */}
          <View style={styles.topPlaceholder} />

          {/* Nút ngôn ngữ — bấm để mở bottom sheet */}
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setPickerVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.langFlag}>{currentLang.flag}</Text>
            <Text style={styles.langName}>{currentLang.nativeName}</Text>
            <Text style={styles.langChevron}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* ── Logo ── */}
        <Animated.View style={[styles.logoArea, logoStyle]}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>💵</Text>
          </View>
          <Text style={styles.logoText}>CurrencyAI</Text>
          <Text style={styles.logoSub}>{t('welcome.tagline')}</Text>
        </Animated.View>

        {/* ── Title + desc + pills ── */}
        <Animated.View style={[styles.center, titleStyle]}>
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.desc}>{t('welcome.desc')}</Text>

          <Animated.View style={[styles.pills, pillsStyle]}>
            {CURRENCY_PILLS.map((p) => (
              <View key={p.code} style={[styles.pill, { backgroundColor: p.bg }]}>
                <Text style={styles.pillText}>{p.flag} {p.code}</Text>
              </View>
            ))}
          </Animated.View>
        </Animated.View>

        {/* ── Button bắt đầu ── */}
        <Animated.View style={[styles.btnWrapper, btnStyle]}>
          <PrimaryButton title={t('welcome.btnStart')} onPress={onNext} />
        </Animated.View>

      </View>

      {/* ── Language Bottom Sheet ── */}
      <LanguagePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Top bar
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
  },
  topPlaceholder: { flex: 1 },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  langFlag: { fontSize: 16 },
  langName: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  langChevron: { fontSize: 10, color: Colors.gold },

  // Logo
  logoArea: {
    alignItems: 'center',
    gap: 8,
    marginTop: SCREEN_H * 0.04,
  },
  logoIcon: {
    width: 80, height: 80,
    borderRadius: 22,
    backgroundColor: '#2a1f00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f0c04040',
  },
  logoEmoji: { fontSize: 40 },
  logoText: { fontSize: 24, fontWeight: '700', color: Colors.gold, letterSpacing: 2 },
  logoSub: { fontSize: 11, color: Colors.textMuted, letterSpacing: 1.5, textAlign: 'center' },

  // Center content
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
  pillText: { fontSize: 12, fontWeight: '500', color: Colors.textPrimary },

  btnWrapper: { width: '100%', marginBottom: 16 },
});