// app/(onboarding)/instruction.tsx
// Slide 2: Hướng dẫn — text đổi theo ngôn ngữ đã chọn
import React from 'react';
import {
  View, Text, StyleSheet,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/colors';

interface Props {
  onNext: () => void;
  onBack: () => void;
  currentIndex: number;
  total: number;
}

export default function InstructionSlide({ onNext, onBack }: Props) {
  const { t } = useTranslation();

  // Lấy mảng steps từ i18n — hỗ trợ tất cả 6 ngôn ngữ
  const steps = t('instruction.steps', { returnObjects: true }) as string[];

  const STEP_ICONS = ['🌞', '📸', '⚡', '✅'];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('instruction.screenTitle')}</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Illustration */}
        <View style={styles.illus}>
          <Text style={styles.illusIcon}>📖</Text>
          <Text style={styles.illusTitle}>{t('instruction.illusTitle')}</Text>
          <Text style={styles.illusDesc}>{t('instruction.illusDesc')}</Text>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepIcon}>{STEP_ICONS[i]}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Button */}
        <View style={styles.btnWrapper}>
          <PrimaryButton title={t('instruction.btnContinue')} onPress={onNext} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1, paddingHorizontal: 24,
    paddingBottom: 100, gap: 16,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.gold, fontSize: 14 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },

  illus: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20, borderWidth: 0.5, borderColor: Colors.bgBorder,
    padding: 24, alignItems: 'center', gap: 8,
  },
  illusIcon: { fontSize: 52 },
  illusTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  illusDesc: {
    fontSize: 13, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 20,
  },

  steps: { gap: 10 },
  stepItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 14, borderWidth: 0.5, borderColor: Colors.bgBorder,
    padding: 14,
  },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#2a1f00', alignItems: 'center', justifyContent: 'center',
    borderWidth: 0.5, borderColor: Colors.gold + '60',
  },
  stepNumText: { fontSize: 12, fontWeight: '700', color: Colors.gold },
  stepIcon: { fontSize: 18, marginTop: 2 },
  stepText: {
    flex: 1, fontSize: 13, color: Colors.textSecondary,
    lineHeight: 20, paddingTop: 3,
  },
  btnWrapper: { marginTop: 'auto' },
});