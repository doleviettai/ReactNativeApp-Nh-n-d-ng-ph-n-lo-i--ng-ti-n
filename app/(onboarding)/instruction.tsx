// app/(onboarding)/instruction.tsx
// Slide 2: Hướng dẫn sử dụng
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/colors';

const STEPS = [
  {
    num: '1',
    icon: '🌞',
    text: 'Đặt tờ tiền trên nền phẳng, đủ ánh sáng, không bị che khuất',
  },
  {
    num: '2',
    icon: '📸',
    text: 'Chụp ảnh trực tiếp bằng camera hoặc tải ảnh từ thư viện điện thoại',
  },
  {
    num: '3',
    icon: '⚡',
    text: 'Chờ AI phân tích — thường dưới 3 giây',
  },
  {
    num: '4',
    icon: '✅',
    text: 'Xem kết quả: quốc gia, mệnh giá, độ tin cậy và trạng thái thật/giả',
  },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
  currentIndex: number;
  total: number;
}

export default function InstructionSlide({ onNext, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hướng dẫn</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Illustration */}
        <View style={styles.illus}>
          <Text style={styles.illusIcon}>📖</Text>
          <Text style={styles.illusTitle}>Cách sử dụng</Text>
          <Text style={styles.illusDesc}>
            Chỉ cần vài giây để nhận diện bất kỳ tờ tiền nào
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((step) => (
            <View key={step.num} style={styles.stepItem}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.num}</Text>
              </View>
              <Text style={styles.stepIcon}>{step.icon}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        {/* Button */}
        <View style={styles.btnWrapper}>
          <PrimaryButton title="Tiếp tục →" onPress={onNext} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 100,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.gold, fontSize: 14 },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  illus: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  illusIcon: { fontSize: 52 },
  illusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  illusDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  steps: { gap: 12 },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 14,
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2a1f00',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.gold + '60',
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gold,
  },
  stepIcon: { fontSize: 18, marginTop: 2 },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    paddingTop: 3,
  },
  btnWrapper: { marginTop: 'auto' },
});