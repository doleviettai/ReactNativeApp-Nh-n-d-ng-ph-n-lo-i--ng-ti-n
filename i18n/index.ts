// i18n/index.ts
// Setup i18next — hỗ trợ 10 ngôn ngữ Đông Nam Á + quốc tế
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import vi  from './locales/vi';
import en  from './locales/en';
import ja  from './locales/ja';
import ko  from './locales/ko';
import zh  from './locales/zh';
import id  from './locales/id';
import th  from './locales/th';
import ms  from './locales/ms';
import sg  from './locales/sg';
import fil from './locales/fil';

export const LANGUAGES = [
  // ── Đông Nam Á ──
  { code: 'vi',  name: 'Vietnamese',          flag: '🇻🇳', nativeName: 'Tiếng Việt'       },
  { code: 'th',  name: 'Thai',                flag: '🇹🇭', nativeName: 'ภาษาไทย'           },
  { code: 'ms',  name: 'Malay',               flag: '🇲🇾', nativeName: 'Bahasa Melayu'     },
  { code: 'sg',  name: 'English (Singapore)', flag: '🇸🇬', nativeName: 'English (SG)'      },
  { code: 'fil', name: 'Filipino',            flag: '🇵🇭', nativeName: 'Filipino'           },
  { code: 'id',  name: 'Indonesian',          flag: '🇮🇩', nativeName: 'Bahasa Indonesia'  },
  // ── Quốc tế ──
  { code: 'en',  name: 'English',             flag: '🇬🇧', nativeName: 'English'            },
  { code: 'ja',  name: 'Japanese',            flag: '🇯🇵', nativeName: '日本語'              },
  { code: 'ko',  name: 'Korean',              flag: '🇰🇷', nativeName: '한국어'              },
  { code: 'zh',  name: 'Chinese',             flag: '🇨🇳', nativeName: '中文'               },
] as const;

export type LangCode = typeof LANGUAGES[number]['code'];

export const LANG_STORAGE_KEY = '@currency_ai_language';

export async function getSavedLanguage(): Promise<LangCode> {
  try {
    const saved = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    return (saved as LangCode) ?? 'vi';
  } catch {
    return 'vi';
  }
}

export async function saveLanguage(code: LangCode) {
  await AsyncStorage.setItem(LANG_STORAGE_KEY, code);
}

i18n.use(initReactI18next).init({
  resources: { vi, en, ja, ko, zh, id, th, ms, sg, fil },
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;