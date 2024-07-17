import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/utils/colors';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        height: 60,
        paddingTop: 5,
        paddingBottom: 5
      },
      tabBarActiveTintColor: colors.BLEU,
      tabBarInactiveTintColor: colors.NOIR,
      tabBarLabelStyle: {
        fontFamily: 'Bold',
        fontSize: 17
      },
      headerShown: false,
    }}>
      <Tabs.Screen 
        name="(teacher)" 
        options={{
          title: "Accueil",
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="(classe)"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="google-classroom" size={size} color={color} />  
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="profile-teacher"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tabs>
  );
}
