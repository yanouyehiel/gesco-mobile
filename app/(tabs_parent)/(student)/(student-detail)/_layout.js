import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { colors } from '@/utils/colors';
import { AntDesign, Feather, Octicons, SimpleLineIcons } from '@expo/vector-icons';
import SidebarStudent from '../../../../components/SidebarStudent';
import { useLocalSearchParams } from 'expo-router';


export default function HomeLayout({}) {
  const { user, headers, student } = useLocalSearchParams()
  const parsedStudent = JSON.parse(student);
  const parsedUser = JSON.parse(user);
  const parsedHeaders = JSON.parse(headers);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <SidebarStudent student={parsedStudent} {...props} />}
        screenOptions={{
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
          initialParams={{
            student: JSON.stringify(student),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
          }}
        />
        <Drawer.Screen 
          name="(cours)/index" 
           initialParams={{
            student: JSON.stringify(student),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
          }}
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
          initialParams={{
            student: JSON.stringify(student),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
          }}
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
           initialParams={{
            student: JSON.stringify(student),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
          }}
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
           initialParams={{
            student: JSON.stringify(student),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
          }}
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
           initialParams={{
            student: JSON.stringify(student),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
          }}
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
            headerTitle: parsedStudent?.nom +' '+ parsedStudent?.prenom
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}