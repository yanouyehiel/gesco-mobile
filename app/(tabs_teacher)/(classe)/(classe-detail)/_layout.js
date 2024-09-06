import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import SideBar from '@/components/SideBar';
import { colors } from '@/utils/colors';
import { AntDesign, Feather, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

export default function HomeLayout({}) {
  const route = useRoute()
  const { user, classe, headers, ecole } = route.params

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <SideBar classe={classe} ecole={ecole} {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.BLEU
          },
          headerTitleAlign: 'center',
          headerTintColor: colors.BLANC
        }}
      >
        <Drawer.Screen
          name="classe"
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
          initialParams={{ classe: classe, user: user, headers: headers }}
        />
        <Drawer.Screen 
          name="(cours)/index" 
          initialParams={{ classe: classe, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <AntDesign name="book" size={24} color={colors.NOIR} />
            ),
            headerTitle: "Les Cours",
            drawerLabel: 'Gérer vos cours',
            drawerLabelStyle: {
              color: colors.NOIR,
              fontWeight: '600',
              fontSize: 18,
            }
          }}
        />
        <Drawer.Screen 
          name="(note)/index" 
          initialParams={{ classe: classe, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <SimpleLineIcons name="note" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Gérer les notes',
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
          initialParams={{ classe: classe, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <Feather name="watch" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Gérer les absences',
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
          initialParams={{ classe: classe, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <Octicons name="workflow" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Gérer les devoirs',
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
          initialParams={{ classe: classe, user: user, headers: headers }}
          options={{
            drawerIcon: ({ color, size }) => (
              <Octicons name="person" size={24} color={colors.NOIR} />
            ),
            drawerLabel: 'Gérer les élèves',
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