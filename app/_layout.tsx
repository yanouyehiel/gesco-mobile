import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  /*const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/CormorantGaramond-Regular.ttf'),
  });*/
  const [loaded] = useFonts({
    'Bold': require('@/assets/fonts/CormorantGaramond-Bold.ttf'),
    'Bold-Italic': require('@/assets/fonts/CormorantGaramond-BoldItalic.ttf'),
    'Italic': require('@/assets/fonts/CormorantGaramond-Italic.ttf'),
    'Light': require('@/assets/fonts/CormorantGaramond-Light.ttf'),
    'Light-Italic': require('@/assets/fonts/CormorantGaramond-LightItalic.ttf'),
    'Medium': require('@/assets/fonts/CormorantGaramond-Medium.ttf'),
    'Medium-Italic': require('@/assets/fonts/CormorantGaramond-MediumItalic.ttf'),
    'Regular': require('@/assets/fonts/CormorantGaramond-Regular.ttf'),
    'SemiBold': require('@/assets/fonts/CormorantGaramond-SemiBold.ttf'),
    'SemiBold-Italic': require('@/assets/fonts/CormorantGaramond-SemiBoldItalic.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="connexion" />
        <Stack.Screen name='onboarding' />
        <Stack.Screen name='register' />
        <Stack.Screen name='otp-code' />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
