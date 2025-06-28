import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

// Dummy colors – adjust as needed
const colors = {
  BLEU: '#009AD7',
  BLANC: '#FFFFFF',
  GRIS: '#9CA3AF',
  GRIS_FONCE: '#4B5563',
  NOIR: '#111827',
};

// Static list of notifications
const notifications = [
  {
    id: '1',
    title: 'Nouvel événement scolaire',
    message: 'Réunion de parents prévue le 28 juin à 10h.',
    date: 'Aujourd\'hui à 09:00',
    read: false,
  },
  {
    id: '2',
    title: 'Devoir disponible',
    message: 'Le devoir de mathématiques pour la 5e A est disponible.',
    date: 'Hier à 17:30',
    read: true,
  },
   {
    id: '3',
    title: 'Résultats trimestriels publiés',
    message: 'Consultez les résultats de votre enfant sur le portail.',
    date: '20 juin à 14:00',
    read: false,
  },
  {
    id: '4',
    title: 'Absence enregistrée',
    message: 'Votre enfant a été absent le 19 juin.',
    date: '19 juin à 18:15',
    read: true,
  },
  {
    id: '5',
    title: 'Message de l’enseignant',
    message: 'Veuillez vérifier le cahier de correspondance de votre enfant.',
    date: '18 juin à 09:40',
    read: true,
  },
  {
    id: '6',
    title: 'Mise à jour du règlement',
    message: 'Veuillez lire la mise à jour du règlement intérieur.',
    date: '14 juin à 11:10',
    read: true,
  },
  {
    id: '7',
    title: 'Journée sportive',
    message: 'La journée sportive aura lieu le 30 juin. Prévoir une tenue adaptée.',
    date: '13 juin à 10:15',
    read: false,
  },
];

// Notification item component
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

// Main component
const Notification = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.BLANC} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for spacing */}
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
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
      />
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
