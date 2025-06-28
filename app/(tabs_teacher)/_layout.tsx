import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '@/utils/colors';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute', // floating effect
          bottom: 15,
          left: 15,
          right: 15,
          elevation: 8,
          backgroundColor: colors.BLANC, // white background for tab bar
          borderRadius: 15,
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopWidth: 0, // remove default border
          shadowColor: colors.BLEU,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          borderWidth: 3,
          borderColor: colors.BLEU,
        },
        tabBarActiveTintColor: colors.BLEU,
        tabBarInactiveTintColor: colors.NOIR,
        tabBarLabelStyle: {
          fontFamily: 'Bold',
          fontSize: 14,
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(teacher)"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(classe)"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="google-classroom" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile-teacher"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
