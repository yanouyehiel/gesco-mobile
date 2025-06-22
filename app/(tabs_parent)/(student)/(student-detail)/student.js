import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableOpacity, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/utils/colors';
import { useRouter } from 'expo-router';

const items = [
  {
    icon: require("@/assets/images/cours.png"),
    text: 'Cours',
    link: '(cours)/index'
  },
  {
    icon: require("@/assets/images/presence.jpg"),
    text: 'Devoirs',
    link: '(devoir)/index'
  },
  {
    icon: require("@/assets/images/presence-remove.png"),
    text: 'Présences',
    link: '(absence)/index'
  },
  {
    icon: require("@/assets/images/note.png"),
    text: 'Notes',
    link: '(note)/index'
  },
  {
    icon: require("@/assets/images/classe.png"),
    text: 'Elèves',
    link: '(student)/index'
  }
]

const HomeDetail = () => {
  const router = useRouter()

  useEffect(() => {
    const backAction = () => {
      router.push("/(tabs_parent)/home")
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
          renderItem={(({item, index}) => (
            <TouchableOpacity onPress={() => router.push(item.link)}>
              <View style={styles.item} key={index}>
                <Image source={item.icon} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        />
      </View>
      <View style={[styles.card, {backgroundColor: colors.VERT_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
          <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Restez informés de tout ce qui se passe dans la classe de votre enfant</Text>
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
          <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Suivez les progrès de votre enfant à travers ses devoirs</Text>
        </View>
      </View>
      <View style={[styles.card, {backgroundColor: colors.VERT_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
          <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Suivez l'assiduité de votre enfant en analysant ses présences en classe</Text>
        </View>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/presence-remove.png")} style={{width: 80, height: 80}} />
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
        <View style={{flexDirection: 'column', width: '60%', margin: '5%'}}>
          <Text style={{color: colors.NOIR, fontSize: 17, fontFamily: 'Regular', marginBottom: 10}}>La gestion des cours permet de planifier et d'organiser les enseignements de manière efficace</Text>
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

export default HomeDetail