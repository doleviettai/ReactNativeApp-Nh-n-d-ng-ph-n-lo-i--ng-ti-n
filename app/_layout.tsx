// app/_layout.tsx
// Root layout - setup Stack navigator cho toàn bộ app
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
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
        <Stack.Screen
          name="result"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});