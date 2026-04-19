// components/CurrencyBadge.tsx
// Badge hiển thị loại tiền tệ kèm cờ quốc gia
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CURRENCY_INFO } from '@/constants/currencies';
import { Colors } from '@/constants/colors';

interface Props {
  currencyCode: string; // 'VND', 'USD', 'IDR', ...
  size?: 'sm' | 'md' | 'lg';
}

export default function CurrencyBadge({ currencyCode, size = 'md' }: Props) {
  const info = CURRENCY_INFO[currencyCode];

  if (!info) return null;

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, isSm && styles.badgeSm, isLg && styles.badgeLg]}>
      <Text style={[styles.flag, isSm && styles.flagSm, isLg && styles.flagLg]}>
        {info.flag}
      </Text>
      <View>
        <Text style={[styles.code, isSm && styles.codeSm, isLg && styles.codeLg]}>
          {currencyCode}
        </Text>
        {!isSm && (
          <Text style={[styles.country, isLg && styles.countryLg]}>
            {info.country}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.bgBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    borderRadius: 7,
  },
  badgeLg: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    borderRadius: 14,
  },
  flag: { fontSize: 20 },
  flagSm: { fontSize: 14 },
  flagLg: { fontSize: 30 },
  code: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  codeSm: { fontSize: 11 },
  codeLg: { fontSize: 18 },
  country: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  countryLg: { fontSize: 12 },
});