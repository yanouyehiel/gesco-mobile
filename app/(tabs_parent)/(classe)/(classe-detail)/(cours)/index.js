import { View, Text, StyleSheet, Button, Image, Modal, TouchableOpacity, Dimensions, FlatList, ScrollView, SafeAreaView, KeyboardAvoidingView  } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { colors } from '@/utils/colors'
import { AntDesign } from '@expo/vector-icons';
import AjouterCours from '@/components/AjouterCours';
import { getAllCoursClasse } from '@/services/MainService';
import { dateParser, longueurTexte } from '@/utils/fonctions';
import Heading from '@/components/Heading';
import { Skeleton } from 'moti/skeleton';
import NoData from '@/components/NoData';
import { useRoute } from '@react-navigation/native';
import AxiosApi from '@/services/AxiosApi';
import axios from 'axios';
import "react-native-gesture-handler"
import BottomSheet from '@gorhom/bottom-sheet';

const CourseScreen = () => {
  const route = useRoute()
  const { classe, user, headers } = route.params
  const [showModal, setShowModal] = useState(false)
  const { height: deviceHeight } = Dimensions.get('screen');
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '70%', '100%'], []);
  const handleOpenPress = () => bottomSheetModalRef.current?.expand();
  const handleClosePress = () => bottomSheetModalRef.current?.close()

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

  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
        <ScrollView>
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
            <Heading text={"Tous les cours"} />
            {!loading ? <FlatList
              data={cours}
              showsVerticalScrollIndicator={false}
              horizontal={false}
              renderItem={({item, i}) => (
                <View key={i} style={styles.cours}>
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

          <TouchableOpacity onPress={handleOpenPress} style={styles.addButton}>
            <AntDesign name="plus" size={24} color={colors.BLANC} />
          </TouchableOpacity>
          
          <BottomSheet 
            index={1} 
            ref={bottomSheetModalRef} 
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: colors.BLEU }}
          >
            <AjouterCours close={handleClosePress} user={user} headers={headers} classe={classe} />
          </BottomSheet>
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
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
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
  }
})

export default CourseScreen