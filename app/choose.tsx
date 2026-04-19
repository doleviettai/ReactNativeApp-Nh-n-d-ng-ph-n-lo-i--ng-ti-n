// app/choose.tsx
// Màn hình chọn phương thức nhập ảnh: Camera hoặc Upload từ thư viện
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const OPTIONS = [
  {
    id: 'camera',
    icon: '📷',
    title: 'Chụp ảnh trực tiếp',
    desc: 'Dùng camera điện thoại chụp tờ tiền ngay lúc này',
    bg: '#1a1a00',
    route: '/camera' as const,
  },
  {
    id: 'upload',
    icon: '🖼️',
    title: 'Tải từ thư viện ảnh',
    desc: 'Chọn hình ảnh có sẵn trong bộ nhớ điện thoại',
    bg: '#001a2a',
    route: '/upload' as const,
  },
];

export default function ChooseScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🪙</Text>
          <Text style={styles.title}>Nhận diện tờ tiền</Text>
          <Text style={styles.desc}>Chọn phương thức phù hợp với bạn</Text>
        </View>

        {/* Options */}
        <View style={styles.cards}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push(opt.route as any)}
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

        {/* Privacy note */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            🔒 Ảnh được gửi lên server an toàn qua HTTPS và không được lưu lại
          </Text>
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
    paddingTop: 40,
    gap: 24,
  },
  header: { alignItems: 'center', gap: 8 },
  emoji: { fontSize: 48 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cards: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 18,
  },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 26 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  cardArrow: {
    fontSize: 22,
    color: Colors.gold,
    fontWeight: '300',
  },
  note: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 12,
    marginTop: 'auto',
    marginBottom: 24,
  },
  noteText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
});