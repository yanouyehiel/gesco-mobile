import { View, Text, FlatList, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { showToast } from '@/utils/fonctions'
import axios from 'axios'
import { useRoute } from '@react-navigation/native'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData';
import { colors } from '@/utils/colors'
import { dateParser, longueurTexte } from '@/utils/fonctions';
import Heading from '@/components/Heading'

const DevoirScreen = () => {
  const [loading, setLoading] = useState(true)
  const [devoirs, setDevoirs] = useState([])
  const route = useRoute()
  const { student, headers } = route.params

  useEffect(() => {
    getDevoirs().then(() => setLoading(false))
  }, [student])

  const getDevoirs = async () => {
    try {
      const res = await axios.get('https://gesco-app.com/gesco/api/get-devoirs-children/' + student.classe_id, {headers: headers});
      setDevoirs(res.data)
    } catch (error) {
      showToast(error.message)
    }
  }

  return (
    <ScrollView style={{backgroundColor: colors.BLANC}}>
      <View style={styles.banner}>
        <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
          <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
            <Text style={{color: colors.NOIR, fontSize: 16, fontFamily: 'Regular', marginBottom: 10}}>La gestion des devoirs permet de tenir au courant les parents des devoirs qu'ont leurs enfants, de les y aider mais aussi de suivre de près leur évolution.</Text>
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
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 20}}>
                    <Text style={[styles.text, {fontFamily: 'Bold'}]}>Num page : {item.num_page}</Text>
                    <Text style={[styles.text, {fontFamily: 'Bold'}]}>Num exo : {item.num_exo}</Text>
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
                    width={170}
                    height={10} 
                    colorMode='light'
                  />
                </View>
                <View style={{flexDirection: 'row', gap: 20, justifyContent: 'space-between', marginBottom: 10}}>
                  <Skeleton 
                    show={true}
                    width={90}
                    height={10} 
                    colorMode='light'
                  />
                  <Skeleton 
                    show={true}
                    width={90}
                    height={10} 
                    colorMode='light'
                  />
                </View>
                <View>
                  <Skeleton 
                    show={true}
                    width={190}
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

    </ScrollView>
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
    fontFamily: 'Regular',
    fontSize: 17
  }
})

export default DevoirScreen