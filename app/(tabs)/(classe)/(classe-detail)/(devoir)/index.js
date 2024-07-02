import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { showToast } from '@/utils/fonctions'
import axios from 'axios'
import { useRoute } from '@react-navigation/native'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData';
import { colors } from '@/utils/colors'
import { dateParser, longueurTexte } from '@/utils/fonctions';
import { AntDesign } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet'
import AjouterDevoir from '../../../../../components/AjouterDevoir'
import Heading from '@/components/Heading'

const DevoirScreen = () => {
  const [loading, setLoading] = useState(true)
  const [devoirs, setDevoirs] = useState([])
  const route = useRoute()
  const { classe, user, headers } = route.params
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '70%', '100%'], []);
  const handleOpenPress = () => bottomSheetModalRef.current?.expand();
  const handleClosePress = () => bottomSheetModalRef.current?.close()

  useEffect(() => {
    getDevoirs().then(() => setLoading(false))
  }, [classe])

  const getDevoirs = async () => {
    try {
      const res = await axios.get('https://test.comtheplug.com/api/devoirs-classe/' + classe.id, {headers: headers});
      setDevoirs(res.data)
    } catch (error) {
      showToast(error.response.message)
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.banner}>
        <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
          <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '10%'}}>
            <Text style={{color: colors.NOIR, fontSize: 18, fontFamily: 'Regular', marginBottom: 10}}>La gestion des devoirs permet de tenir au courant les parents des devoirs qu'ont leurs enfants et ainsi de les y aider mais aussi à l'enseignant de suivre de près l'évolution de ses élèves.</Text>
            <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 100}}>
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>Ici !</Text>
            </View>
          </View>
          <View style={{width: "30%"}}>
            <Image source={require("@/assets/images/ob3.png")} style={{width: 80, height: 80}} />
          </View>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Tous les devoirs"} />
        {!loading ? <FlatList 
            data={devoirs}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            renderItem={({item, index}) => (
              <View key={index} style={styles.devoir}>
                <View style={styles.devoirImage}>
                  <Image source={require("@/assets/images/matiere.png")} style={{width: 50, height: 50}} />
                </View>
                <View style={styles.devoirDesc}>
                  <Text style={{fontSize: 20, fontFamily: 'SemiBold'}}>{longueurTexte(item.nom_matiere, 35)}</Text>
                  <Text style={[styles.text, {fontSize: 18}]} numberOfLines={2} ellipsizeMode="tail">{item.nom_livre}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.text, {fontFamily: 'Bold'}]}>{item.num_page}</Text>
                    <Text style={styles.text}>{item.num_exo}</Text>
                  </View>
                  <Text style={styles.text}>Enregistré le {dateParser(item.created_at)}</Text>
                </View>
              </View>
            )}
          /> :
          [0, 1, 2, 3, 4].map((t, i) => (
            <View style={styles.devoir} key={i}>
              <View style={{marginRight: 10}}>
                <Skeleton 
                  show={true}
                  width={50}
                  height={50} 
                  colorMode='light'
                />
              </View>
              <View style={styles.devoirDesc}>
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
                <View style={{marginRight: 10}}>
                  <Skeleton 
                    show={true}
                    width={100}
                    height={10} 
                    colorMode='light'
                  />
                </View>
              </View>
            </View>
          ))}
          {(!loading && devoirs.length) === 0 && 
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
        <AjouterDevoir close={handleClosePress} user={user} headers={headers} classe={classe} />
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  banner: {},
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
  devoir: {
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
  devoirDesc: {
    flexDirection: 'column'
  },
  devoirImage: {
    marginRight: 10
  },
  text: {
    fontFamily: 'Regular'
  }
})

export default DevoirScreen