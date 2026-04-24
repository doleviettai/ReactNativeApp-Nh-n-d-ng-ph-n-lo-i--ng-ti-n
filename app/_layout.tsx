// app/_layout.tsx
// Root layout — load ngôn ngữ đã lưu từ AsyncStorage khi khởi động
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { I18nextProvider } from 'react-i18next';
import i18n, { getSavedLanguage } from '@/i18n';
import '@/i18n'; // khởi tạo i18n

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    async function init() {
      const savedLang = await getSavedLanguage();
      await i18n.changeLanguage(savedLang);
      setI18nReady(true);
      SplashScreen.hideAsync();
    }
    init();
  }, []);

  if (!i18nReady) return <View style={{ flex: 1, backgroundColor: '#0d0d1a' }} />;

  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" backgroundColor="#0d0d1a" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0d0d1a' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="choose" />
          <Stack.Screen name="camera" />
          <Stack.Screen name="upload" />
          <Stack.Screen name="result"    options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="converter" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="language"  options={{ animation: 'slide_from_bottom' }} />
        </Stack>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });