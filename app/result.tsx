// app/result.tsx
// Màn hình kết quả AI + nút "Quy đổi mệnh giá" sang converter screen
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
import { getDenomination, CURRENCY_INFO } from '@/constants/currencies';
import { Colors } from '@/constants/colors';

// Lấy số thực từ class_name để gửi sang converter
// VD: "VN_100000" → 100000  |  "USD_100" → 100  |  "fake_VN_200000" → 200000
function extractAmount(className: string): number {
  const clean = className.replace('fake_', '');

  // VND: VN_100000
  const vndMatch = clean.match(/^VN_(\d+)$/);
  if (vndMatch) return parseInt(vndMatch[1], 10);

  // USD: USD_100
  const usdMatch = clean.match(/^USD_(\d+)$/);
  if (usdMatch) return parseInt(usdMatch[1], 10);

  // IDR: IDR_100000
  const idrMatch = clean.match(/^IDR_(\d+)$/);
  if (idrMatch) return parseInt(idrMatch[1], 10);

  // MYR: MYR_RM50 → 50  |  MYR_50_SEN → 0.5
  const myrRmMatch = clean.match(/^MYR_RM(\d+)$/);
  if (myrRmMatch) return parseInt(myrRmMatch[1], 10);
  const myrSenMatch = clean.match(/^MYR_(\d+)_SEN$/);
  if (myrSenMatch) return parseInt(myrSenMatch[1], 10) / 100;

  // THB: THB_1000_BAHT → 1000  |  THB_25_SATANG → 0.25
  const thbBahtMatch = clean.match(/^THB_(\d+)_BAHT$/);
  if (thbBahtMatch) return parseInt(thbBahtMatch[1], 10);
  const thbSatangMatch = clean.match(/^THB_(\d+)_SATANG$/);
  if (thbSatangMatch) return parseInt(thbSatangMatch[1], 10) / 100;

  // SGD: SGD_100_NOTE → 100  |  SGD_50_CENTS → 0.50
  const sgdNoteMatch = clean.match(/^SGD_(\d+)_NOTE$/);
  if (sgdNoteMatch) return parseInt(sgdNoteMatch[1], 10);
  const sgdCentsMatch = clean.match(/^SGD_(\d+)_CENTS$/);
  if (sgdCentsMatch) return parseInt(sgdCentsMatch[1], 10) / 100;
  const sgdCoinMatch = clean.match(/^SGD_(\d+)_COIN$/);
  if (sgdCoinMatch) return parseInt(sgdCoinMatch[1], 10);

  // PHP: PHP_1000_PESO → 1000  |  PHP_25_SENTIMO → 0.25
  const phpPesoMatch = clean.match(/^PHP_(\d+)_PESO$/);
  if (phpPesoMatch) return parseInt(phpPesoMatch[1], 10);
  const phpSentimoMatch = clean.match(/^PHP_(\d+)_SENTIMO$/);
  if (phpSentimoMatch) return parseInt(phpSentimoMatch[1], 10) / 100;

  return 0;
}

export default function ResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [loading, setLoading]   = useState(true);
  const [result, setResult]     = useState<PredictionResult | null>(null);
  const [error, setError]       = useState<string | null>(null);

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
      setError(
        e?.response?.data?.message ||
        e?.message ||
        'Không thể kết nối đến server. Kiểm tra lại kết nối mạng.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Điều hướng sang màn hình quy đổi với đầy đủ thông tin
  const handleConvert = () => {
    if (!result) return;
    const amount      = extractAmount(result.class);
    const denomination = getDenomination(result.class);
    const countryName  = CURRENCY_INFO[result.currency_type]?.country ?? '';

    router.push({
      pathname: './converter',
      params: {
        fromCurrency: result.currency_type,
        amount:       String(amount),
        denomination,
        countryName,
      },
    });
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

        {/* Thumbnail */}
        {imageUri && (
          <View style={styles.thumbRow}>
            <Image source={{ uri: imageUri as string }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.thumbInfo}>
              <Text style={styles.thumbLabel}>Ảnh đang phân tích</Text>
              <Text style={styles.thumbStatus}>
                {loading ? '⏳ Đang xử lý...' : result ? '✅ Hoàn thành' : '❌ Lỗi'}
              </Text>
            </View>
          </View>
        )}

        {/* Waiting */}
        {loading && (
          <View style={styles.centerBox}>
            <Text style={styles.waitText}>AI đang phân tích tờ tiền...</Text>
          </View>
        )}

        {/* Error */}
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

        {/* Result */}
        {result && !loading && <ResultCard result={result} />}

        {/* ── Footer buttons ── */}
        {!loading && (
          <View style={styles.footer}>
            {/* Nút quay lại */}
            <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
              <Text style={styles.btnBackText}>← Quay lại</Text>
            </TouchableOpacity>

            {/* Nút quy đổi — chỉ hiện khi có kết quả thành công */}
            {result && (
              <TouchableOpacity style={styles.btnConvert} onPress={handleConvert}>
                <Text style={styles.btnConvertIcon}>💱</Text>
                <Text style={styles.btnConvertText}>Quy đổi</Text>
              </TouchableOpacity>
            )}

            {/* Nút nhận diện tiếp */}
            <TouchableOpacity
              style={styles.btnNext}
              onPress={() => router.replace('/choose')}
            >
              <Text style={styles.btnNextText}>Nhận diện tiếp ✨</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Loading overlay */}
      <LoadingOverlay visible={loading} message="AI đang phân tích tờ tiền..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 16, gap: 12 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.gold, fontSize: 14 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },

  thumbRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 14, borderWidth: 0.5, borderColor: Colors.bgBorder,
    padding: 10,
  },
  thumb: { width: 64, height: 44, borderRadius: 8, backgroundColor: Colors.bgBorder },
  thumbInfo: { gap: 3 },
  thumbLabel: { fontSize: 12, color: Colors.textSecondary },
  thumbStatus: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },

  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  waitText: { fontSize: 14, color: Colors.textSecondary },

  errorBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24,
  },
  errorIcon: { fontSize: 48 },
  errorTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  errorMsg: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    marginTop: 8, backgroundColor: Colors.gold,
    paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12,
  },
  retryText: { color: '#1a0a00', fontWeight: '700', fontSize: 14 },

  // ── Footer 3 nút ──
  footer: { flexDirection: 'row', gap: 8, paddingTop: 4 },

  btnBack: {
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5, borderColor: Colors.bgBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  btnBackText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

  btnConvert: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#001a2a',
    borderWidth: 0.5, borderColor: '#004060',
    alignItems: 'center', justifyContent: 'center',
    gap: 6,
  },
  btnConvertIcon: { fontSize: 16 },
  btnConvertText: { fontSize: 13, color: Colors.blue, fontWeight: '700' },

  btnNext: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.gold,
    alignItems: 'center',
  },
  btnNextText: { fontSize: 13, color: '#1a0a00', fontWeight: '700' },
});