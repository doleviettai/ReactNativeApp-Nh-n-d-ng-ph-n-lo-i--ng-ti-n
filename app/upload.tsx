// app/upload.tsx
// Màn hình chọn ảnh từ thư viện + xác nhận trước khi nhận diện
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/colors';
import { useTranslation } from 'react-i18next';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const { t } = useTranslation();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Cần quyền truy cập',
        'Vui lòng cấp quyền truy cập thư viện ảnh trong Cài đặt.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      // Lấy tên file từ URI
      const parts = asset.uri.split('/');
      setFileName(parts[parts.length - 1] ?? 'image.jpg');
    }
  };

  const handleRecognize = () => {
    if (!imageUri) return;

    Alert.alert(
      t('upload.confirmTitle'),
      t('upload.confirmMessage'),
      [
        {
          text: t('upload.confirmCancel'),
          style: 'cancel',
        },
        {
          text: t('upload.confirmOk'),
          onPress: () => {
            router.push({
              pathname: './result',
              params: { imageUri },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('upload.title')}</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Preview hoặc placeholder */}
        {imageUri ? (
          <View style={styles.previewCard}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewMeta}>
              <Text style={styles.previewName} numberOfLines={1}>{fileName}</Text>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.changeBtn}>{t('upload.change')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadZone} onPress={pickImage} activeOpacity={0.7}>
            <Text style={styles.uploadIcon}>🖼️</Text>
            <Text style={styles.uploadText}>{t('upload.zone')}</Text>
            <Text style={styles.uploadSub}>{t('upload.zoneSub')}</Text>
          </TouchableOpacity>
        )}

        {/* Tip */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 {t('upload.tipTitle')}</Text>
          <Text style={styles.tipText}>
            {t('upload.tip')}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.libraryBtn} onPress={pickImage}>
            <Text style={styles.libraryBtnText}>🖼️  {t('upload.btnLibrary')}</Text>
          </TouchableOpacity>

          {imageUri && (
            <PrimaryButton
              title={t('upload.btnRecognize') + " ✨"}
              onPress={handleRecognize}
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 32,
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
  uploadZone: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
    borderColor: Colors.bgBorder,
    borderStyle: 'dashed',
    borderRadius: 20,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadIcon: { fontSize: 44 },
  uploadText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  uploadSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  previewCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  previewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  previewName: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  changeBtn: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '500',
  },
  tipBox: {
    backgroundColor: '#1a1a00',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#3a3000',
    padding: 14,
    gap: 5,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gold,
  },
  tipText: {
    fontSize: 12,
    color: '#aa9944',
    lineHeight: 19,
  },
  btnGroup: {
    marginTop: 'auto',
    gap: 10,
  },
  libraryBtn: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  libraryBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});