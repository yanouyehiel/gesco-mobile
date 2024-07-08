import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, Dimensions, FlatList, ScrollView, SafeAreaView, KeyboardAvoidingView, RefreshControl, StatusBar  } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { colors } from '@/utils/colors'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AjouterCours from '@/components/AjouterCours';
import { dateParser, longueurTexte } from '@/utils/fonctions';
import Heading from '@/components/Heading';
import { Skeleton } from 'moti/skeleton';
import NoData from '@/components/NoData';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import "react-native-gesture-handler"
import BottomSheet from '@gorhom/bottom-sheet';

const CourseScreen = () => {
  const route = useRoute()
  const { classe, user, headers } = route.params
  const [cours, setCours] = useState([])
  const [cour, setCour] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false)
  const [visibleC, setVisibleC] = useState(false)

  useEffect(() => {
    getCours().then(() => setLoading(false))
  }, [classe, user, headers])

  const getCours = async () => {
    try {
      const res = await axios.get('https://test.comtheplug.com/api/get-cours-classe/' + classe.id, {headers: headers});
      setCours(res.data.cours);
    } catch (error) {
      console.error('Erreur lors de la récupération des cours:', error);
    }
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getCours().then(() => setLoading(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <KeyboardAvoidingView>
        <ScrollView
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
              progressBackgroundColor={colors.BLANC}
            />
          }
        >
          <View style={styles.banner}>
            <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
              <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '10%'}}>
                <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>La gestion des cours permet de planifier et d'organiser les enseignements de manière efficace</Text>
                <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 100}}>
                  <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>Ici !</Text>
                </View>
              </View>
              <View style={{width: "30%"}}>
                <Image source={require("@/assets/images/ob5.png")} style={{width: 80, height: 80}} />
              </View>
            </View>
          </View>

          <View style={{margin: 15}}>
            <Heading text={"Tous les cours"} style={{marginBottom: 20}} />
            
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.addButton}>
              <AntDesign name="plus" size={24} color={colors.BLANC} />
            </TouchableOpacity>

            {!loading ? <FlatList
              data={cours}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              renderItem={({item, i}) => (
                <TouchableOpacity onPress={() => {
                  setCour(item)
                  setVisibleC(true)
                }} key={i}>
                  <View style={styles.cours}>
                    <View style={styles.coursImage}>
                      <Image source={require("@/assets/images/cours.png")} style={{width: 50, height: 50}} />
                    </View>
                    <View style={styles.coursDesc}>
                      <Text style={{fontSize: 20, fontFamily: 'SemiBold'}}>{item.titre}</Text>
                      <Text style={[styles.text, {fontSize: 18}]} numberOfLines={2} ellipsizeMode="tail">{longueurTexte(item.description, 35)}</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={[styles.text, {fontFamily: 'Bold'}]}>{longueurTexte(item.nom_matiere)}</Text>
                        <Text style={styles.text}>{item.nom_teacher + ' ' + item.prenom_teacher}</Text>
                      </View>
                      <Text style={styles.text}>Enregistré le {dateParser(item.created_at)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            /> :
            [0, 1, 2, 3, 4].map((t, i) => (
              <View style={styles.cours} key={i}>
                <View style={{marginRight: 10}}>
                  <Skeleton 
                    show={true}
                    width={50}
                    height={50} 
                    colorMode='light'
                  />
                </View>
                <View style={styles.coursDesc}>
                  <View style={{marginBottom: 10}}>
                    <Skeleton 
                      show={true}
                      width={150}
                      height={10} 
                      colorMode='light'
                    />
                  </View>
                  <View style={{marginBottom: 10}}>
                    <Skeleton 
                      show={true}
                      width={250}
                      height={10} 
                      colorMode='light'
                    />
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Skeleton 
                      show={true}
                      width={100}
                      height={10} 
                      colorMode='light'
                    />
                    <Skeleton 
                      show={true}
                      width={70}
                      height={10} 
                      colorMode='light'
                    />
                  </View>
                </View>
              </View>
            ))}
            {(!loading && cours.length) === 0 && 
              <NoData />
            }
          </View>

          <Modal 
            animationType='slide'
            visible={visibleC}
          >
            <View style={{flex: 1, margin: 15}}>
              <TouchableOpacity style={styles.header} onPress={() => setVisibleC(false)}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>Détails du cours</Text>
              </TouchableOpacity>

              <View>
                <View style={{marginBottom: 10}}>
                  <Text style={styles.title}>Titre :</Text>
                  <Text style={styles.titleContent}>{cour.titre}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                  <Text style={styles.title}>Description :</Text>
                  <Text style={styles.titleContent}>{cour.description}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                  <Text style={[styles.title, {marginBottom: 10}]}>Matière : <Text style={{color: colors.BLEU}}>{cour.nom_matiere}</Text></Text>
                  <Text style={styles.title}>Enseignant : <Text style={{color: colors.VERT}}>
                    {cour.nom_teacher + ' ' + cour.prenom_teacher}
                  </Text></Text>
                </View>
                <Text style={{fontFamily: 'Regular', fontSize: 20}}>Enregistré le {dateParser(cour.created_at)}</Text>
              </View>
            </View>
          </Modal>

          <Modal
            animationType='slide'
            visible={visible}
          >
            <AjouterCours close={() => setVisible(false)} user={user} headers={headers} classe={classe} />
          </Modal>
         
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  banner: {

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
  addButton: {
    position: 'absolute',
    right: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BLEU,
    borderRadius: 99,
    elevation: 5,
  },
  modal: {
    height: 400,
    elevation: 5,
  },
  cours: {
    backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.BLEU
  },
  coursImage: {
    marginRight: 10
  },
  coursDesc: {
    flexDirection: 'column'
  },
  text: {
    fontFamily: 'Regular'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  titleHeader: {
      fontSize: 25,
      fontFamily: 'Bold',
      textAlign: 'center',
      color: colors.NOIR
  },
  title: {
    textAlign: 'left',
    fontSize: 22,
    textDecorationLine: 'underline',
    fontFamily: 'Bold'
  },
  titleContent: {
    fontSize: 20,
    fontFamily: 'Regular'
  }
})

export default CourseScreen