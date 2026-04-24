// app/choose.tsx — có nút chọn ngôn ngữ góc trên phải
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';
import i18n from '@/i18n';
import { Colors } from '@/constants/colors';

export default function ChooseScreen() {
  const { t } = useTranslation();
  const currentLang = LANGUAGES.find(l => l.code === i18n.language);

  const OPTIONS = [
    {
      id: 'camera',
      icon: '📷',
      title: t('choose.camera.title'),
      desc:  t('choose.camera.desc'),
      bg:    '#1a1a00',
      route: '/camera' as const,
    },
    {
      id: 'upload',
      icon: '🖼️',
      title: t('choose.upload.title'),
      desc:  t('choose.upload.desc'),
      bg:    '#001a2a',
      route: '/upload' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={{ width: 48 }} />
          <Text style={styles.topTitle}>CurrencyAI</Text>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => router.push('./language')}
            activeOpacity={0.75}
          >
            <Text style={styles.langFlag}>{currentLang?.flag ?? '🌐'}</Text>
            <Text style={styles.langCode}>{(i18n.language ?? 'vi').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🪙</Text>
          <Text style={styles.title}>{t('choose.title')}</Text>
          <Text style={styles.desc}>{t('choose.desc')}</Text>
        </View>

        {/* Options */}
        <View style={styles.cards}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push(opt.route)}
            >
              <View style={[styles.cardIcon, { backgroundColor: opt.bg }]}>
                <Text style={styles.cardIconText}>{opt.icon}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{opt.title}</Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.note}>
          <Text style={styles.noteText}>🔒 {t('choose.privacy')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: { flex: 1, paddingHorizontal: 24, gap: 20, paddingBottom: 24 },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 16,
  },
  topTitle: { fontSize: 16, fontWeight: '700', color: Colors.gold, letterSpacing: 1 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.bgCard, borderWidth: 0.5, borderColor: Colors.bgBorder,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  langFlag: { fontSize: 16 },
  langCode: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  header: { alignItems: 'center', gap: 8 },
  emoji: { fontSize: 48 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  cards: { gap: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.bgCard, borderRadius: 18,
    borderWidth: 0.5, borderColor: Colors.bgBorder, padding: 18,
  },
  cardIcon: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardIconText: { fontSize: 26 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  cardArrow: { fontSize: 22, color: Colors.gold, fontWeight: '300' },
  note: {
    backgroundColor: Colors.bgCard, borderRadius: 12,
    borderWidth: 0.5, borderColor: Colors.bgBorder, padding: 12, marginTop: 'auto',
  },
  noteText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 17 },
});