// app/result.tsx
// Màn hình kết quả AI — nhận imageUri, gửi lên server, hiển thị kết quả phân tích
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { predictCurrency } from '@/services/api';
import { PredictionResult } from '@/types/prediction';
import ResultCard from '@/components/ResultCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Colors } from '@/constants/colors';

export default function ResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUri) return;
    callPredict();
  }, [imageUri]);

  const callPredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await predictCurrency(imageUri as string);
      setResult(data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Không thể kết nối đến server. Kiểm tra lại kết nối mạng.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả phân tích AI</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Thumbnail ảnh đã chụp/chọn */}
        {imageUri && (
          <View style={styles.thumbRow}>
            <Image
              source={{ uri: imageUri as string }}
              style={styles.thumb}
              resizeMode="cover"
            />
            <View style={styles.thumbInfo}>
              <Text style={styles.thumbLabel}>Ảnh đang phân tích</Text>
              <Text style={styles.thumbStatus}>
                {loading ? '⏳ Đang xử lý...' : result ? '✅ Hoàn thành' : '❌ Lỗi'}
              </Text>
            </View>
          </View>
        )}

        {/* Nội dung chính */}
        {loading && (
          <View style={styles.centerBox}>
            <Text style={styles.waitText}>AI đang phân tích tờ tiền...</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Không thể phân tích</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={callPredict}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {result && !loading && (
          <ResultCard result={result} />
        )}

        {/* Footer buttons */}
        {!loading && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => router.back()}
            >
              <Text style={styles.btnSecondaryText}>← Quay lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => router.replace('./choose')}
            >
              <Text style={styles.btnPrimaryText}>Nhận diện tiếp ✨</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Loading overlay toàn màn hình */}
      <LoadingOverlay visible={loading} message="AI đang phân tích tờ tiền..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
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
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  thumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 10,
  },
  thumb: {
    width: 64,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.bgBorder,
  },
  thumbInfo: { gap: 3 },
  thumbLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  thumbStatus: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  errorIcon: { fontSize: 48 },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  errorMsg: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: Colors.gold,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#1a0a00',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  btnPrimary: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: Colors.gold,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 13,
    color: '#1a0a00',
    fontWeight: '700',
  },
});