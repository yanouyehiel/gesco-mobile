import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '@/hooks/useColorScheme';
import { registerForPushNotificationsAsync } from '@/services/notification'; // Make sure this path is correct


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    'SemiBold-Italic': require('@/assets/fonts/CormorantGaramond-SemiBoldItalic.ttf'),
  });

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function setupNotifications() {
      const token = await registerForPushNotificationsAsync();
      if (token) setExpoPushToken(token);
    }

    setupNotifications();

    // Listen to notifications received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification responses (when user taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped notification:', response);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="connexion" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="register" />
        <Stack.Screen name="otp-code" />
        <Stack.Screen name="phone-number-forgot" />
        <Stack.Screen name="(tabs_teacher)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}
