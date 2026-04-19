// components/ResultCard.tsx
// Card hiển thị đầy đủ kết quả phân tích AI: loại tiền, mệnh giá, thật/giả, top predictions
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PredictionResult } from '@/types/prediction';
import { CURRENCY_INFO, getDenomination } from '@/constants/currencies';

import { Colors } from '@/constants/colors';
import CurrencyBadge from './Currencybadge';
import ConfidenceBar from './ConfidenCard';

interface Props {
  result: PredictionResult;
}

export default function ResultCard({ result }: Props) {
  // ✅ đổi class_name → class (dùng alias vì "class" là từ khóa JS)
  const { class: class_name, confidence, currency_type, authenticity, top_predictions } = result;
  
  const isReal = authenticity === 'real';
  const currencyInfo = CURRENCY_INFO[currency_type];
  const denomination = getDenomination(class_name);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header: tên tiền + badge thật/giả */}
      <View style={styles.header}>
        <CurrencyBadge currencyCode={currency_type} size="lg" />
        <View style={[styles.authBadge, isReal ? styles.authReal : styles.authFake]}>
          <Text style={[styles.authText, { color: isReal ? Colors.green : Colors.red }]}>
            {isReal ? '✓ THẬT' : '✗ GIẢ'}
          </Text>
        </View>
      </View>

      {/* Mệnh giá lớn */}
      <View style={styles.denominationBox}>
        <Text style={styles.denominationLabel}>Mệnh giá</Text>
        <Text style={styles.denominationValue}>{denomination}</Text>
        <Text style={styles.denominationSub}>{currencyInfo?.country}</Text>
      </View>

      {/* Độ tin cậy tổng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Độ tin cậy</Text>
        <ConfidenceBar
          label="Xác suất chính xác"
          value={confidence}
          color={confidence > 0.85 ? Colors.green : confidence > 0.6 ? Colors.gold : Colors.red}
        />
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin tờ tiền</Text>
        <View style={styles.infoGrid}>
          <InfoRow label="Loại tiền" value={currency_type} />
          <InfoRow label="Quốc gia" value={currencyInfo?.country ?? '—'} />
          <InfoRow label="Mã nhận dạng" value={class_name} mono />
          <InfoRow
            label="Trạng thái"
            value={isReal ? 'Tiền thật' : 'Tiền giả'}
            valueColor={isReal ? Colors.green : Colors.red}
          />
        </View>
      </View>

      {/* Top predictions */}
      {top_predictions && top_predictions.length > 0 && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top dự đoán của model</Text>
            {top_predictions.slice(0, 5).map((pred, i) => (
            <View key={pred.class} style={styles.predRow}>  {/* ✅ đổi pred.class_name → pred.class */}
                <Text style={styles.predRank}>#{i + 1}</Text>
                <Text style={styles.predName} numberOfLines={1}>{pred.class}</Text>  {/* ✅ */}
                <ConfidenceBar
                label=""
                value={pred.confidence}
                color={i === 0 ? Colors.gold : Colors.textMuted}
                showPercent
                />
            </View>
            ))}
        </View>
        )}

      {/* Cảnh báo nếu là tiền giả */}
      {!isReal && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Cảnh báo</Text>
          <Text style={styles.warningText}>
            AI phát hiện đây có thể là tiền giả. Vui lòng kiểm tra lại tờ tiền bằng các phương pháp xác thực vật lý và báo cáo nếu cần thiết.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  mono,
}: {
  label: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
}) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text
        style={[
          infoStyles.value,
          valueColor ? { color: valueColor } : {},
          mono ? { fontFamily: 'monospace', fontSize: 11 } : {},
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.bgBorder,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  authReal: {
    backgroundColor: '#001a0d',
    borderColor: '#004a25',
  },
  authFake: {
    backgroundColor: '#1a0010',
    borderColor: '#4a0025',
  },
  authText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  denominationBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  denominationLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  denominationValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.gold,
    letterSpacing: 1,
  },
  denominationSub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  infoGrid: { gap: 0 },
  predRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  predRank: {
    fontSize: 11,
    color: Colors.textMuted,
    width: 22,
  },
  predName: {
    fontSize: 11,
    color: Colors.textSecondary,
    width: 130,
  },
  warningBox: {
    backgroundColor: '#1a0800',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#4a2000',
    padding: 14,
    gap: 6,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff9060',
  },
  warningText: {
    fontSize: 12,
    color: '#aa6644',
    lineHeight: 18,
  },
});