// components/LanguagePicker.tsx
// Mini bottom-sheet chọn ngôn ngữ — dùng chung cho Welcome slide và choose screen
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, LangCode, saveLanguage } from '@/i18n';
import i18n from '@/i18n';
import { Colors } from '@/constants/colors';

const { height: SCREEN_H } = Dimensions.get('window');
const SHEET_H = SCREEN_H * 0.55;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LanguagePicker({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const slideY = useRef(new Animated.Value(SHEET_H)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Animate sheet lên/xuống
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: SHEET_H,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSelect = async (code: LangCode) => {
    await i18n.changeLanguage(code);
    await saveLanguage(code);
    onClose();
  };

  const currentCode = i18n.language as LangCode;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay mờ */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Bottom sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideY }] }]}
      >
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Title */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{t('language.screenTitle')}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Language list */}
        <FlatList
          data={LANGUAGES}
          keyExtractor={item => item.code}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => {
            const isActive = item.code === currentCode;
            return (
              <TouchableOpacity
                style={[styles.langItem, isActive && styles.langItemActive]}
                onPress={() => handleSelect(item.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.langFlag}>{item.flag}</Text>
                <View style={styles.langBody}>
                  <Text style={[styles.langNative, isActive && styles.langNativeActive]}>
                    {item.nativeName}
                  </Text>
                  <Text style={styles.langEnglish}>{item.name}</Text>
                </View>
                {isActive && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: SHEET_H,
    backgroundColor: '#12122a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 0.5,
    borderColor: Colors.bgBorder,
    paddingBottom: 32,
  },
  handle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: Colors.bgBorder,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.bgBorder,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bgCard,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 13, color: Colors.textSecondary },

  sep: { height: 0.5, backgroundColor: Colors.bgBorder, marginLeft: 72 },

  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  langItemActive: { backgroundColor: '#2a1f00' },
  langFlag: { fontSize: 28, width: 38, textAlign: 'center' },
  langBody: { flex: 1 },
  langNative: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  langNativeActive: { color: Colors.gold },
  langEnglish: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  checkText: { fontSize: 13, fontWeight: '700', color: '#1a0a00' },
});