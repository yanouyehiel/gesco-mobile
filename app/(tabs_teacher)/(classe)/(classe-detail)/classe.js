import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/utils/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';

const items = [
  {
    icon: require("@/assets/images/cours.png"),
    text: 'Cours',
    path: '(cours)/index'
  },
  {
    icon: require("@/assets/images/presence.jpg"),
    text: 'Devoirs',
    path: '(devoir)/index'
  },
  {
    icon: require("@/assets/images/presence-remove.png"),
    text: 'Présences',
    path: '(absence)/index'
  },
  {
    icon: require("@/assets/images/note.png"),
    text: 'Notes',
    path: '(note)/index'
  },
  {
    icon: require("@/assets/images/classe.png"),
    text: 'Elèves',
    path: '(student)/index'
  }
]


const ClasseScreen = () => {
  const router = useRouter()
const { classe, user, headers, ecole } = useLocalSearchParams();

const parsedClasse = JSON.parse(classe);
const parsedUser = JSON.parse(user);
const parsedHeaders = JSON.parse(headers);
const parsedEcole = JSON.parse(ecole);

// useEffect(() => {
//   console.log("✅ Parsed params in ClasseScreen:", {
//     parsedClasse,
//     parsedUser,
//     parsedHeaders,
//     parsedEcole
//   });
// }, []);
 

  useEffect(() => {
    const backAction = () => {
      router.back()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FlatList
          data={items}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push({
                pathname: `/(tabs_teacher)/(classe)/(classe-detail)/${item.path}`,
                params: { classe, user, headers, ecole }
              })}
            >
              <View style={styles.item}>
                <Image source={item.icon} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          )}

        />
      </View>
      <View style={[styles.card, {backgroundColor: colors.VERT_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 10, width: '60%', margin: '10%'}}>
          <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Gérer efficacement votre classe</Text>
        </View>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/ob3.png")} style={{width: 80, height: 80}} />
        </View>
      </View>
      <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/ob2.png")} style={{width: 80, height: 80}} />
        </View>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%'}}>
          <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>La gestion des élèves essentielle pour suivre leurs progrès</Text>
        </View>
      </View>
      <View style={[styles.card, {backgroundColor: colors.VERT_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 10, width: '60%', margin: '5%'}}>
          <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>La gestion des présences permet de surveiller l'assiduité des élèves</Text>
        </View>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/presence-remove.png")} style={{width: 90, height: 90}} />
        </View>
      </View>
      <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/ob4.png")} style={{width: 80, height: 80}} />
        </View>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%'}}>
          <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>La gestion des notes permet de suivre les performances des élèves</Text>
        </View>
      </View>
      <View style={[styles.card, {backgroundColor: colors.VERT_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
          <Text style={{color: colors.NOIR, fontSize: 16, fontFamily: 'Regular', marginBottom: 10}}>La gestion des cours permet de planifier et d'organiser les enseignements de manière efficace</Text>
        </View>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/ob5.png")} style={{width: 80, height: 80}} />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLANC,
    marginTop: 10
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
    marginRight: 15,
    backgroundColor: colors.BLEU_CLAIR,
    borderRadius: 40,
    padding: 10
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  itemText: {
    fontSize: 20,
    color: colors.BLANC, 
    fontFamily: 'Regular'
  },
  card: {
    margin: 15,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 150, 
    borderRadius: 15
  },
  textView: {
    backgroundColor: colors.BLANC, 
    color: colors.NOIR, 
    padding: 8, 
    borderRadius: 10, 
    width: 100
  }
});

export default ClasseScreen