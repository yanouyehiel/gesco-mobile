import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { getNotification, getHeaders, getData } from '@/services/MainService';

const colors = {
  BLEU: '#009AD7',
  BLANC: '#FFFFFF',
  GRIS: '#9CA3AF',
  GRIS_FONCE: '#4B5563',
  NOIR: '#111827',
};

const NotificationItem = ({ title, message, date, read = false, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, read && styles.read]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={read ? 'notifications-outline' : 'notifications'}
        size={24}
        color={read ? colors.GRIS : colors.BLEU}
        style={styles.icon}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={2} style={styles.message}>{message}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Notification = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
  try {
    const headers = await getHeaders(); 
    const token = await getData('tokenGesco');

    const userId = token?.user?.id;
    if (!userId) {
      console.warn('User ID not found in token');
      return;
    }

    const userData = { user_id: userId };
    console.log('Sending user_id:', userId);

    const response = await axios.post(`https://gesco-app.com/api/notification/${parseInt(userId)}`, { headers } );

    console.log('Fetched notifications:', response.data);
    setNotifications(response.data.notifications || []);
  } catch (err) {
    console.log("notification error:", JSON.stringify(err, null, 2));
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    // Debug: Show local storage values
    async function checkStorage() {
      const token = await getData('tokenGesco');
      const user = await getData('userGesco');
      const school = await getData('ecoleGesco');
    }

    checkStorage();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.BLANC} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.BLEU} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <NotificationItem
              title={item.title}
              message={item.message}
              date={item.date}
              read={item.read}
              onPress={() => console.log('Tapped:', item.title)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: colors.GRIS }}>
              Aucune notification
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.BLEU,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.BLANC,
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.BLANC,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'flex-start',
  },
  read: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.NOIR,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.GRIS_FONCE,
  },
  date: {
    fontSize: 12,
    color: colors.GRIS,
    marginTop: 6,
  },
});

export default Notification;
