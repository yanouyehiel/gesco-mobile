import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert } from 'react-native';
import { getData, storeData, getHeaders } from './MainService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null;

  while (true) {
    try {
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      if (!token) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      await storeData('pushToken', token);
      return token;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

export async function sendPushNotification(title, body) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { type: 'general' } },
      trigger: { seconds: 1 },
    });
  } catch (error) {
    Alert.alert(title, body);
  }
}

export async function sendPushTokenToBackend(title, body, type = 'INFORMATION', metaData = {}) {
  try {
    const headers = await getHeaders();
    const testToken = await getData('pushToken');
    if (!testToken) { 
      Alert.alert('Erreur', 'Aucun token de notification trouvé.');
      return;
    }

    const payload = {
      token: testToken,
      title,
      body,
      type,
      ...metaData,
    };

    const response = await fetch('https://gesco-app.com/api/notification/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notification failed:', errorText);
      Alert.alert('Erreur', 'Notification non envoyée.');
      return;
    }

    const result = await response.json();
    console.log('Notification envoyée avec succès:', result);
    Alert.alert('Succès', 'Notification envoyée avec succès.');
  } catch (error) {
    Alert.alert('Erreur', 'Une erreur est survenue.');
    await sendPushNotification(title, body);
  }
}
