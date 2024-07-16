import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import SideBar from '@/components/SideBar';
import { useLocalSearchParams } from 'expo-router';
import { colors } from '@/utils/colors';
import { AntDesign, Feather, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useParams } from 'react-router-dom';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import SidebarStudent from '../../../../components/SidebarStudent';


export default function HomeLayout({}) {
  const route = useRoute()
  const { user, headers, student } = route.params

  useEffect(() => {
    console.log(user, headers, student)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <SidebarStudent student={student} {...props} />}
        screenOptions={{
          //statusBarColor: colors.VERT,
          headerStyle: {
            backgroundColor: colors.BLEU
          },
          headerTitleAlign: 'center',
          headerTintColor: colors.BLANC
        }}
      >
        <Drawer.Screen
          name="student"
          options={{
            drawerIcon: ({ color, size }) => (
              <Feather name="list" size={24} color={colors.NOIR} />
            ),
            headerTitle: "Accueil",
            drawerLabel: 'Accueil',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            },
          }}
          initialParams={{ student: student, user: user, headers: headers }}
        />
        <Drawer.Screen 
          name="(cours)/index" 
          initialParams={{ student: student, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <AntDesign name="book" size={24} color={colors.NOIR} />
            ),
            headerTitle: "Les Cours",
            drawerLabel: 'Ses cours',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            }
          }}
        />
        <Drawer.Screen 
          name="(note)/index" 
          initialParams={{ student: student, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <SimpleLineIcons name="note" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Ses notes',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            },
            headerTitle: "Les notes"
          }}
        />
        <Drawer.Screen 
          name="(absence)/index" 
          initialParams={{ student: student, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <Feather name="watch" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Ses absences',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            },
            headerTitle: "Les Absences"
          }}
        />
        <Drawer.Screen 
          name="(devoir)/index" 
          initialParams={{ student: student, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <Octicons name="workflow" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Ses devoirs',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            },
            headerTitle: "Les Devoirs"
          }}
        />
        <Drawer.Screen 
          name="(student)/index" 
          initialParams={{ student: student, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <Octicons name="person" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Voir son profil',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            },
            headerTitle: "Les élèves"
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}