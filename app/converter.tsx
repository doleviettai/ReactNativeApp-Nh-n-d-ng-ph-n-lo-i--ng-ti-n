// app/converter.tsx
// Màn hình quy đổi tiền tệ
// - Nhận fromCurrency + amount từ params (từ result screen)
// - Search + scroll picker chọn nước đích
// - Gọi ExchangeRate-API free (không cần key) để quy đổi
import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Modal,
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { convertCurrency } from '@/services/currency';
import { ALL_CURRENCIES, CurrencyOption } from '@/constants/allCurrencies';
import { Colors } from '@/constants/colors';
import { useTranslation } from 'react-i18next';

// Format số đẹp theo locale
function fmt(num: number, code: string): string {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: code === 'JPY' || code === 'KRW' || code === 'VND' || code === 'IDR' ? 0 : 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)} ${code}`;
  }
}

function fmtRate(rate: number): string {
  if (rate >= 1000) return rate.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
  if (rate >= 1)    return rate.toFixed(4);
  return rate.toFixed(6);
}

export default function ConverterScreen() {
  const params = useLocalSearchParams<{
    fromCurrency: string;
    amount: string;
    denomination: string;
    countryName: string;
  }>();

  const { t } = useTranslation();

  const fromCurrency  = params.fromCurrency  ?? 'VND';
  const rawAmount     = parseFloat(params.amount ?? '0');
  const denomination  = params.denomination  ?? '0';
  const countryName   = params.countryName   ?? '';

  // Picker state
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch]               = useState('');
  const [toCurrency, setToCurrency]       = useState<CurrencyOption>(
    ALL_CURRENCIES.find(c => c.code === 'USD') ?? ALL_CURRENCIES[0]
  );

  // Result state
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<number | null>(null);
  const [rate, setRate]         = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [error, setError]       = useState('');

  // Animate kết quả
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Lọc danh sách theo search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      c =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [search]);

  const handleConvert = useCallback(async () => {
    if (!rawAmount || rawAmount <= 0) return;
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setResult(null);
    fadeAnim.setValue(0);

    try {
      const { result: converted, rate: r, updatedAt: ua } =
        await convertCurrency(fromCurrency, toCurrency.code, rawAmount);

      setResult(converted);
      setRate(r);
      setUpdatedAt(ua);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (e: any) {
      setError(e?.message ?? 'Lỗi kết nối. Kiểm tra mạng và thử lại.');
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, rawAmount]);

  const selectCurrency = (c: CurrencyOption) => {
    setToCurrency(c);
    setPickerVisible(false);
    setSearch('');
    setResult(null);
    setError('');
  };

  const fromInfo = ALL_CURRENCIES.find(c => c.code === fromCurrency);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← {t('result.btnBack')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('converter.title')}</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* ── FROM card ── */}
        <View style={styles.fromCard}>
          <Text style={styles.cardLabel}>{t('converter.from')}</Text>
          <View style={styles.fromRow}>
            <Text style={styles.fromFlag}>{fromInfo?.flag ?? '💵'}</Text>
            <View style={styles.fromInfo}>
              <Text style={styles.fromCode}>{fromCurrency}</Text>
              <Text style={styles.fromCountry}>{countryName || fromInfo?.country}</Text>
            </View>
            <View style={styles.fromAmountBox}>
              <Text style={styles.fromAmountLabel}>{t('converter.denomination')}</Text>
              <Text style={styles.fromAmount} numberOfLines={1} adjustsFontSizeToFit>
                {denomination}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Arrow ── */}
        <View style={styles.arrowRow}>
          <View style={styles.arrowLine} />
          <View style={styles.arrowCircle}>
            <Text style={styles.arrowText}>⇅</Text>
          </View>
          <View style={styles.arrowLine} />
        </View>

        {/* ── TO picker button ── */}
        <View style={styles.toCard}>
          <Text style={styles.cardLabel}>{t('converter.to')}</Text>
          <TouchableOpacity
            style={styles.pickerBtn}
            onPress={() => setPickerVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.pickerFlag}>{toCurrency.flag}</Text>
            <View style={styles.pickerInfo}>
              <Text style={styles.pickerCode}>{toCurrency.code}</Text>
              <Text style={styles.pickerCountry}>{toCurrency.country}</Text>
            </View>
            <Text style={styles.pickerArrow}>▾ {t('changeTo')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Convert button ── */}
        <TouchableOpacity
          style={[styles.convertBtn, loading && styles.convertBtnLoading]}
          onPress={handleConvert}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1a0a00" />
          ) : (
            <Text style={styles.convertBtnText}>
              {t('converter.btnConvert')} {fromCurrency} → {toCurrency.code}
            </Text>
          )}
        </TouchableOpacity>

        {/* ── Kết quả ── */}
        {result !== null && !loading && (
          <Animated.View style={[styles.resultCard, { opacity: fadeAnim }]}>
            <Text style={styles.resultLabel}>{t('converter.resultLabel')}</Text>

            <View style={styles.resultMain}>
              <Text style={styles.resultFrom} numberOfLines={1} adjustsFontSizeToFit>
                {fmt(rawAmount, fromCurrency)}
              </Text>
              <Text style={styles.resultEq}>=</Text>
              <Text style={styles.resultTo} numberOfLines={1} adjustsFontSizeToFit>
                {fmt(result, toCurrency.code)}
              </Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>{t('converter.rate')}</Text>
              <Text style={styles.rateVal}>
                1 {fromCurrency} = {fmtRate(rate!)} {toCurrency.code}
              </Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>{t('converter.source')}</Text>
              <Text style={styles.rateSource}>ExchangeRate-API</Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>{t('converter.updated')}</Text>
              <Text style={styles.rateDate} numberOfLines={1}>
                {updatedAt ? new Date(updatedAt).toLocaleDateString('vi-VN') : '—'}
              </Text>
            </View>

            <View style={styles.warningRow}>
              <Text style={styles.warningText}>
                {t('converter.disclaimer')}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ── Lỗi ── */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

      </View>

      {/* ── Currency Picker Modal ── */}
      <Modal
        visible={pickerVisible}
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalContainer}>

            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('converter.pickTitle')}</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => { setPickerVisible(false); setSearch(''); }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search box */}
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder={t('converter.searchPlaceholder')}
                placeholderTextColor={Colors.textMuted}
                value={search}
                onChangeText={setSearch}
                autoCapitalize="characters"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>

            {/* List */}
            <FlatList
              data={filtered}
              keyExtractor={c => c.code}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    item.code === toCurrency.code && styles.currencyItemActive,
                  ]}
                  onPress={() => selectCurrency(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.currencyFlag}>{item.flag}</Text>
                  <View style={styles.currencyBody}>
                    <Text style={styles.currencyCode}>{item.code}</Text>
                    <Text style={styles.currencyName}>{item.country} · {item.name}</Text>
                  </View>
                  {item.code === toCurrency.code && (
                    <Text style={styles.currencyCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>{t('converter.notFound', { query: search })}</Text>
                </View>
              }
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d1a' },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
    gap: 12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: Colors.gold, fontSize: 14 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },

  // FROM card
  fromCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 16,
    gap: 8,
  },
  cardLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  fromRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fromFlag: { fontSize: 32 },
  fromInfo: { flex: 1 },
  fromCode: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  fromCountry: { fontSize: 12, color: Colors.textSecondary },
  fromAmountBox: { alignItems: 'flex-end', maxWidth: 160 },
  fromAmountLabel: { fontSize: 10, color: Colors.textMuted },
  fromAmount: { fontSize: 20, fontWeight: '700', color: Colors.gold },

  // Arrow
  arrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8 },
  arrowLine: { flex: 1, height: 0.5, backgroundColor: Colors.bgBorder },
  arrowCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5, borderColor: Colors.bgBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  arrowText: { fontSize: 16, color: Colors.gold },

  // TO picker
  toCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    padding: 16,
    gap: 8,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pickerFlag: { fontSize: 32 },
  pickerInfo: { flex: 1 },
  pickerCode: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  pickerCountry: { fontSize: 12, color: Colors.textSecondary },
  pickerArrow: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: '#2a1f00',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Convert button
  convertBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 2,
  },
  convertBtnLoading: { opacity: 0.7 },
  convertBtnText: { color: '#1a0a00', fontSize: 15, fontWeight: '700' },

  // Result card
  resultCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: '#3a3000',
    padding: 18,
    gap: 10,
  },
  resultLabel: { fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  resultMain: { alignItems: 'center', gap: 4 },
  resultFrom: { fontSize: 18, color: Colors.textSecondary, fontWeight: '500', maxWidth: '100%' },
  resultEq: { fontSize: 20, color: Colors.textMuted },
  resultTo: { fontSize: 30, fontWeight: '700', color: Colors.gold, maxWidth: '100%' },
  resultDivider: { height: 0.5, backgroundColor: Colors.bgBorder },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rateLabel: { fontSize: 12, color: Colors.textSecondary },
  rateVal: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  rateSource: { fontSize: 12, color: Colors.blue },
  rateDate: { fontSize: 11, color: Colors.textMuted, flex: 1, textAlign: 'right' },
  warningRow: {
    backgroundColor: '#1a1200',
    borderRadius: 8,
    padding: 8,
    marginTop: 2,
  },
  warningText: { fontSize: 10, color: '#aa9944', textAlign: 'center', lineHeight: 15 },

  // Error
  errorBox: {
    backgroundColor: '#1a0008',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#4a0020',
    padding: 12,
  },
  errorText: { fontSize: 13, color: Colors.red, textAlign: 'center', lineHeight: 20 },

  // Modal
  modalSafe: { flex: 1, backgroundColor: '#0d0d1a' },
  modalContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  modalClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgCard,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCloseText: { fontSize: 14, color: Colors.textSecondary },

  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    paddingVertical: 12,
    fontFamily: undefined,
  },

  // List item
  separator: { height: 0.5, backgroundColor: Colors.bgBorder, marginLeft: 68 },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderRadius: 12,
    gap: 14,
  },
  currencyItemActive: { backgroundColor: '#2a1f00' },
  currencyFlag: { fontSize: 28, width: 40, textAlign: 'center' },
  currencyBody: { flex: 1 },
  currencyCode: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  currencyName: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  currencyCheck: { color: Colors.gold, fontSize: 18, fontWeight: '700' },

  // Empty
  emptyBox: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
});