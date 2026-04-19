// constants/currencies.ts
export const CURRENCY_INFO: Record<string, { country: string; flag: string }> = {
  VND: { country: 'Việt Nam', flag: '🇻🇳' },
  USD: { country: 'United States', flag: '🇺🇸' },
  IDR: { country: 'Indonesia', flag: '🇮🇩' },
  MYR: { country: 'Malaysia', flag: '🇲🇾' },
  THB: { country: 'Thailand', flag: '🇹🇭' },
  SGD: { country: 'Singapore', flag: '🇸🇬' },
  PHP: { country: 'Philippines', flag: '🇵🇭' },
};

// Parse tên hiển thị đẹp từ class_name trong file JSON
// VD: "VN_100000" → "100.000 ₫"  |  "USD_100" → "100 $"  |  "fake_VN_100000" → "100.000 ₫ (GIẢ)"
export function getDenomination(className: string): string {
  const isFake = className.startsWith('fake_');
  const name = isFake ? className.replace('fake_', '') : className;

  // VND: VN_100000
  if (name.startsWith('VN_')) {
    const raw = name.replace('VN_', '');
    const num = parseInt(raw, 10);
    if (num === 0) return isFake ? '0 ₫ (GIẢ)' : '0 ₫';
    const formatted = num.toLocaleString('vi-VN') + ' ₫';
    return isFake ? `${formatted} (GIẢ)` : formatted;
  }

  // USD: USD_100
  if (name.startsWith('USD_')) {
    const val = name.replace('USD_', '');
    return isFake ? `$${val} (GIẢ)` : `$${val}`;
  }

  // IDR: IDR_100000
  if (name.startsWith('IDR_')) {
    const raw = name.replace('IDR_', '');
    const num = parseInt(raw, 10);
    return `Rp ${num.toLocaleString('id-ID')}`;
  }

  // MYR: MYR_RM100 hoặc MYR_50_SEN
  if (name.startsWith('MYR_')) {
    const val = name.replace('MYR_', '');
    if (val.startsWith('RM')) return val;
    return val.replace('_', ' ');
  }

  // THB: THB_1000_BAHT hoặc THB_25_SATANG
  if (name.startsWith('THB_')) {
    const parts = name.replace('THB_', '').split('_');
    return `${parts[0]} ${parts[1] ?? ''}`.trim();
  }

  // SGD: SGD_100_NOTE hoặc SGD_50_CENTS
  if (name.startsWith('SGD_')) {
    const parts = name.replace('SGD_', '').split('_');
    return `${parts[0]} ${parts[1] ?? ''}`.replace('NOTE', 'SGD').replace('CENTS', '¢').trim();
  }

  // PHP: PHP_1000_PESO hoặc PHP_25_SENTIMO
  if (name.startsWith('PHP_')) {
    const parts = name.replace('PHP_', '').split('_');
    return `${parts[0]} ${parts[1] ?? ''}`.replace('PESO', '₱').replace('SENTIMO', '¢').trim();
  }

  return name;
}