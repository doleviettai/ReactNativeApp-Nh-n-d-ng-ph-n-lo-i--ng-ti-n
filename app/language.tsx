// app/language.tsx
// Màn hình chọn ngôn ngữ — hiển thị danh sách 6 ngôn ngữ, lưu AsyncStorage
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, LangCode, saveLanguage } from '@/i18n';
import i18n from '@/i18n';
import { Colors } from '@/constants/colors';

export default function LanguageScreen() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LangCode>(i18n.language as LangCode);
  const [saving, setSaving] = useState(false);

  const handleSelect = async (code: LangCode) => {
    if (saving) return;
    setSaving(true);
    setSelected(code);

    // Đổi ngôn ngữ live ngay lập tức
    await i18n.changeLanguage(code);
    // Lưu vào AsyncStorage để nhớ khi mở lại app
    await saveLanguage(code);

    setSaving(false);

    // Feedback nhẹ rồi quay lại
    Alert.alert(
      t('language.saved'),
      '',
      [{ text: t('common.ok'), onPress: () => router.back() }],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('language.screenTitle')}</Text>
          <View style={{ width: 80 }} />
        </View>

        <Text style={styles.desc}>{t('language.desc')}</Text>

        <FlatList
          data={LANGUAGES}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => {
            const isActive = selected === item.code;
            return (
              <TouchableOpacity
                style={[styles.item, isActive && styles.itemActive]}
                onPress={() => handleSelect(item.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.itemBody}>
                  <Text style={[styles.nativeName, isActive && styles.nativeNameActive]}>
                    {item.nativeName}
                  </Text>
                  <Text style={styles.englishName}>{item.name}</Text>
                </View>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: { flex: 1, paddingHorizontal: 18 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 6,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.gold, fontSize: 14 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  list: { gap: 0 },
  sep: { height: 0.5, backgroundColor: Colors.bgBorder, marginLeft: 72 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 14,
  },
  itemActive: { backgroundColor: '#2a1f00' },
  flag: { fontSize: 32, width: 42, textAlign: 'center' },
  itemBody: { flex: 1 },
  nativeName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  nativeNameActive: { color: Colors.gold },
  englishName: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: Colors.bgBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.gold },
  radioDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.gold,
  },
});