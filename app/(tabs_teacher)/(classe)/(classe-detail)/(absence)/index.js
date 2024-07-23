import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { dateParserTime, dateParser } from '@/utils/fonctions'
import AjouterAbsence from '@/components/AjouterAbsence'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { RefreshControl } from 'react-native';

const AbsenceScreen = () => {
  const route = useRoute()
  const { classe, user, headers } = route.params
  const [loading, setLoading] = useState(true)
  const [absences, setAbsences] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false)
  const [absence, setAbsence] = useState({})

  useEffect(() => {
    getPresences().then(() => setLoading(false))
  }, [])

  async function getPresences() {
    const res = await axios.get('https://gesco-app.com/gesco/api/get-absences-classe/' + classe.id, {
      headers: headers
    })
    setAbsences(res.data)
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getPresences().then(() => setLoading(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
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
        <Heading text={"Toutes les absences"} style={{marginBottom: 20}} />
        
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addButton}>
          <AntDesign name="plus" size={24} color={colors.BLANC} />
        </TouchableOpacity>

        {!loading ?
          <FlatList
            data={absences}
            renderItem={({item, i}) => (
              <TouchableOpacity onPress={() => {
                setAbsence(item)
                setVisible(true)
              }} key={i}>
                <View style={styles.absence}>
                  <View style={{margin: 10}}>
                    <AntDesign name="warning" size={30} color={colors.ROUGE} />
                  </View>
                  <View style={{marginLeft: 10}}>
                  <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{item.nom_student + ' ' + item.prenom_student}</Text>
                    <Text style={{fontSize: 18, fontWeight: '400'}}>Absent(e) à : {item.periode}</Text>
                    <Text>Enregistré le : <Text style={{fontFamily: 'SemiBold', fontSize: 18}}>{dateParserTime(item.created_at)}</Text></Text>
                  </View>
                </View>
              </TouchableOpacity>
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
                    width={150}
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
                    width={80}
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

      <Modal
        visible={visible}
        animationType='slide'
      >
        <View style={{flex: 1, margin: 15}}>
          <TouchableOpacity style={styles.header} onPress={() => setVisible(false)}>
            <Ionicons name='arrow-back-outline' size={30} color="black" />
            <Text style={styles.titleHeader}>Détails de l'absence</Text>
          </TouchableOpacity>
          <View style={{marginBottom: 10}}>
            <Text style={styles.title}>Période :</Text>
            <Text style={styles.titleContent}>{absence.periode}</Text>
          </View>
          <View style={{marginBottom: 10}}>
            <Text style={styles.title}>Nom et prénom de l'élève :</Text>
            <Text style={styles.titleContent}>{absence.nom_student + ' ' + absence.prenom_student}</Text>
          </View>
          <Text style={{fontFamily: 'Regular', fontSize: 20}}>Enregistré le {dateParser(absence.created_at)}</Text>
        </View>
      </Modal>

      <Modal
        animationType='slide'
        visible={showModal}
        style={styles.modal}
      >
        <AjouterAbsence hideModal={() => setShowModal(false)} user={user} headers={headers} classe={classe} />
      </Modal>
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
    position: 'absolute',
    backgroundColor: colors.BLEU,
    width: 50,
    height: 50,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
  },
  modal: {
    height: 400,
    elevation: 5,
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
    fontSize: 24,
    fontFamily: 'SemiBold'
  }
})

export default AbsenceScreen