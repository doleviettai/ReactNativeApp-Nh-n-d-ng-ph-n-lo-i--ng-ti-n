// constants/allCurrencies.ts
// Danh sách tất cả các tiền tệ hỗ trợ bởi ExchangeRate-API
// Dùng trong màn hình CurrencyConverter để chọn nước muốn quy đổi

export interface CurrencyOption {
  code: string;   // 'USD', 'EUR', ...
  name: string;   // 'US Dollar'
  country: string; // 'United States'
  flag: string;   // '🇺🇸'
}

export const ALL_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'US Dollar',          country: 'Hoa Kỳ',          flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',               country: 'Liên minh Châu Âu', flag: '🇪🇺' },
  { code: 'VND', name: 'Vietnamese Dong',    country: 'Việt Nam',         flag: '🇻🇳' },
  { code: 'JPY', name: 'Japanese Yen',       country: 'Nhật Bản',         flag: '🇯🇵' },
  { code: 'KRW', name: 'South Korean Won',   country: 'Hàn Quốc',         flag: '🇰🇷' },
  { code: 'CNY', name: 'Chinese Yuan',       country: 'Trung Quốc',       flag: '🇨🇳' },
  { code: 'GBP', name: 'British Pound',      country: 'Anh',              flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar',  country: 'Úc',               flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar',    country: 'Canada',           flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc',        country: 'Thụy Sĩ',          flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar',   country: 'Singapore',        flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar',   country: 'Hồng Kông',        flag: '🇭🇰' },
  { code: 'THB', name: 'Thai Baht',          country: 'Thái Lan',         flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit',  country: 'Malaysia',         flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah',  country: 'Indonesia',        flag: '🇮🇩' },
  { code: 'PHP', name: 'Philippine Peso',    country: 'Philippines',      flag: '🇵🇭' },
  { code: 'INR', name: 'Indian Rupee',       country: 'Ấn Độ',            flag: '🇮🇳' },
  { code: 'TWD', name: 'Taiwan Dollar',      country: 'Đài Loan',         flag: '🇹🇼' },
  { code: 'NZD', name: 'New Zealand Dollar', country: 'New Zealand',      flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona',      country: 'Thụy Điển',        flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone',    country: 'Na Uy',            flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone',       country: 'Đan Mạch',         flag: '🇩🇰' },
  { code: 'AED', name: 'UAE Dirham',         country: 'UAE',              flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal',        country: 'Ả Rập Saudi',      flag: '🇸🇦' },
  { code: 'BRL', name: 'Brazilian Real',     country: 'Brazil',           flag: '🇧🇷' },
  { code: 'MXN', name: 'Mexican Peso',       country: 'Mexico',           flag: '🇲🇽' },
  { code: 'ZAR', name: 'South African Rand', country: 'Nam Phi',          flag: '🇿🇦' },
  { code: 'RUB', name: 'Russian Ruble',      country: 'Nga',              flag: '🇷🇺' },
  { code: 'TRY', name: 'Turkish Lira',       country: 'Thổ Nhĩ Kỳ',      flag: '🇹🇷' },
  { code: 'PLN', name: 'Polish Zloty',       country: 'Ba Lan',           flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna',       country: 'Séc',              flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint',   country: 'Hungary',          flag: '🇭🇺' },
  { code: 'ILS', name: 'Israeli Shekel',     country: 'Israel',           flag: '🇮🇱' },
  { code: 'EGP', name: 'Egyptian Pound',     country: 'Ai Cập',           flag: '🇪🇬' },
  { code: 'NGN', name: 'Nigerian Naira',     country: 'Nigeria',          flag: '🇳🇬' },
  { code: 'PKR', name: 'Pakistani Rupee',    country: 'Pakistan',         flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka',   country: 'Bangladesh',       flag: '🇧🇩' },
  { code: 'KHR', name: 'Cambodian Riel',     country: 'Campuchia',        flag: '🇰🇭' },
  { code: 'LAK', name: 'Lao Kip',            country: 'Lào',              flag: '🇱🇦' },
  { code: 'MMK', name: 'Myanmar Kyat',       country: 'Myanmar',          flag: '🇲🇲' },
  { code: 'BND', name: 'Brunei Dollar',      country: 'Brunei',           flag: '🇧🇳' },
  { code: 'XAU', name: 'Gold (troy oz)',     country: 'Vàng',             flag: '🥇' },
];