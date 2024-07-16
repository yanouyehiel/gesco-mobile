import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { getAllPresences } from '@/services/MainService'
import { AntDesign } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { dateParser } from '@/utils/fonctions'
import AjouterAbsence from '@/components/AjouterAbsence'
import { useLocalSearchParams } from 'expo-router'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'

const AbsenceScreen = () => {
  const route = useRoute()
  const { student, user, headers } = route.params
  const [loading, setLoading] = useState(true)
  const [absences, setAbsences] = useState([])
  const [showModal, setShowModal] = useState(false)
  const { height: deviceHeight } = Dimensions.get('screen');

  useEffect(() => {
    getPresences().then(() => setLoading(false))
  }, [])

  async function getPresences() {
    const res = await axios.get('https://test.comtheplug.com/api/get-absences-children/' + student.classe_id, {
      headers: headers
    })
    setAbsences(res.data.absences)
  }

  return (
    <ScrollView>
      <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '10%'}}>
          <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>La gestion des présences permet de surveiller l'assiduité des élèves</Text>
          <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 100}}>
            <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>Ici !</Text>
          </View>
        </View>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/presence-remove.png")} style={{width: 80, height: 80}} />
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Toutes les absences"} />
        {!loading ?
          <FlatList
            data={absences}
            renderItem={({item, i}) => (
              <View key={i} style={styles.absence}>
                <View style={{margin: 10}}>
                  <AntDesign name="warning" size={30} color={colors.ROUGE} />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontSize: 18, fontWeight: '400'}}>{item.periode}</Text>
                  <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{student.nom + ' ' + student.prenom}</Text>
                  <Text>Enregistré le : <Text style={{fontFamily: 'SemiBold', fontSize: 18}}>{dateParser(item.created_at)}</Text></Text>
                </View>
              </View>
            )}
          /> :
          [0, 1, 2, 3, 4].map((t, i) => (
            <View key={i} style={styles.absence}>
              <Skeleton
                show={true}
                width={50}
                height={50} 
                colorMode='light'
              />
              <View style={{marginLeft: 10}}>
                <View style={{marginBottom: 10}}>
                  <Skeleton
                    show={true}
                    width={50}
                    height={10} 
                    colorMode='light'
                  />
                </View>
                <Skeleton
                  show={true}
                  width={100}
                  height={10} 
                  colorMode='light'
                />
                <View style={{marginTop: 10}}>
                  <Skeleton
                    show={true}
                    width={150}
                    height={10} 
                    colorMode='light'
                  />
                </View>
              </View>
            </View>
          ))
        }
        {(!loading && absences.length) === 0 &&
          <NoData />
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 150, 
    borderRadius: 15
  },
  absence: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.BLEU
  },
  addButton: {
    backgroundColor: colors.BLEU,
    width: 50,
    height: 50,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    bottom: 10,
    position: 'absolute'
  },
  modal: {
    height: 400,
    elevation: 5,
  },
})

export default AbsenceScreen