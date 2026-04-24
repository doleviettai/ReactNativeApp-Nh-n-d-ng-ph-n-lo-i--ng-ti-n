// app/(onboarding)/prepare.tsx
// Slide 3: Chuẩn bị — text đổi theo ngôn ngữ đã chọn
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

export default function PrepareSlide({ onNext, onBack }: Props) {
  const { t } = useTranslation();

  const checksOk = t('prepare.checksOk', { returnObjects: true }) as string[];
  const checksNo = t('prepare.checksNo', { returnObjects: true }) as string[];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('prepare.screenTitle')}</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Main card */}
        <View style={styles.card}>
          <Text style={styles.cardIcon}>💡</Text>
          <Text style={styles.cardTitle}>{t('prepare.cardTitle')}</Text>

          {/* OK checklist */}
          <View style={styles.list}>
            {checksOk.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <View style={[styles.dot, styles.dotOk]}>
                  <Text style={styles.dotTextOk}>✓</Text>
                </View>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* NO checklist */}
          <View style={styles.list}>
            {checksNo.map((item, i) => (
              <View key={i} style={styles.listItem}>
                <View style={[styles.dot, styles.dotNo]}>
                  <Text style={styles.dotTextNo}>✗</Text>
                </View>
                <Text style={[styles.listText, { color: '#aa8888' }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info bar */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{t('prepare.infoBar')}</Text>
        </View>

        {/* Button */}
        <View style={styles.btnWrapper}>
          <PrimaryButton title={t('prepare.btnStart')} onPress={onNext} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1, paddingHorizontal: 24,
    paddingBottom: 100, gap: 14,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.gold, fontSize: 14 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },

  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20, borderWidth: 0.5, borderColor: Colors.bgBorder,
    padding: 20, gap: 12, alignItems: 'center',
  },
  cardIcon: { fontSize: 44 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.green },

  list: { gap: 10, width: '100%' },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  dotOk: { backgroundColor: '#001a0d' },
  dotNo: { backgroundColor: '#1a0005' },
  dotTextOk: { color: Colors.green, fontSize: 12, fontWeight: '700' },
  dotTextNo: { color: Colors.red, fontSize: 12, fontWeight: '700' },
  listText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  divider: { height: 0.5, backgroundColor: Colors.bgBorder, width: '100%' },

  infoBox: {
    backgroundColor: '#1a1a00', borderRadius: 12,
    borderWidth: 0.5, borderColor: '#3a3000', padding: 12,
  },
  infoText: { fontSize: 11, color: '#aa9944', textAlign: 'center', lineHeight: 18 },
  btnWrapper: { marginTop: 'auto' },
});