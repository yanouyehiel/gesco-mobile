import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';
import { getData, storeData, getHeaders } from './MainService';

// Default notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//Helper: Fetch with timeout (to avoid hanging forever)
function fetchWithTimeout(url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(' Request timeout')), timeout)
    ),
  ]);
}

//Register device and get Expo token
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log(' Push notifications only work on physical devices.');
    return null;
  }

  while (true) {
    try {
      console.log(' Checking notification permissions...');
      let { status } = await Notifications.getPermissionsAsync();

      if (status !== 'granted') {
        console.log(' Requesting notification permissions...');
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        console.warn('❗ Permission not granted. Retrying in 3s...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      console.log('Permission granted. Fetching Expo push token...');
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      if (!token) {
        console.warn('❌ Push token is empty. Retrying in 3s...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      console.log('✅ Expo Push Token:', token);
      await storeData('pushToken', token);
      console.log(' Push token stored successfully.');
      return token;
    } catch (error) {
      console.error(' Error registering for push notifications:', error);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Send a local push notification
export async function sendPushNotification(title, body) {
  try {
    console.log(' Scheduling local notification:', { title, body });
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'general' },
      },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    console.error('Failed to schedule local notification:', error);
    Alert.alert(title, body);
  }
}

// Send push token + message to your backend
export async function sendPushTokenToBackend(title, body, type = 'INFORMATION') {
  try {
    const headers = await getHeaders();
    const token = await getData('pushToken');

    if (!token) {
      console.warn('No push token found in storage.');
      Alert.alert('Erreur', 'Aucun token de notification trouvé.');
      return;
    }else if (!headers || !headers.headers || !headers.headers.authorization) {
      console.warn('No headers found in storage.');
      Alert.alert('Erreur', 'Aucun en-tête trouvé.');
      return;
    }

    const payload = {
      token,
      title,
      body,
      type,
      user_id,
    };

    console.log(' Sending push notification to backend...');
    console.log(' Payload:', payload);

    const response = await fetchWithTimeout('https://gesco-app.com/api/notification/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    }, 10000); // 10s timeout

    console.log(' Response status:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(' Backend error:', errorText);
      Alert.alert('Erreur', 'Notification non envoyée.');
      return;
    }

    const result = await response.json();
    console.log(' Backend notification success:', result);
    Alert.alert('Succès', 'Notification envoyée avec succès.');
  } catch (error) {
    console.error(' Error sending push notification to backend:', error.message);
    Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi.');
    await sendPushNotification(title, body); // fallback local notification
  }
}
