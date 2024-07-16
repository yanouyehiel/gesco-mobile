import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData';
import { colors } from '@/utils/colors'
import { dateParser, longueurTexte } from '@/utils/fonctions';
import { showToast } from '@/utils/fonctions'
import BottomSheet from '@gorhom/bottom-sheet'
import { AntDesign } from '@expo/vector-icons'
import AjouterNote from '../../../../../components/AjouterNote'
import Heading from '@/components/Heading'
import ModalNote from './modal'

const NoteScreen = () => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const route = useRoute()
  const { student, user, headers } = route.params
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState({})

  useEffect(() => {
    getNotes().then(() => setLoading(false))
  }, [student])

  const getNotes = async () => {
    try {
      const res = await axios.get('https://test.comtheplug.com/api/get-notes-children/' + student.id, {headers: headers});
      setNotes(res.data.notes)
    } catch (error) {
      showToast(error.response.data.message)
    }
  }

  function handleShowNote(data) {
    setNote(data)
    setShowModal(true)
  }

  return (
    <ScrollView>
      <View style={styles.banner}>
        <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
          <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '10%'}}>
            <Text style={{color: colors.NOIR, fontSize: 18, fontFamily: 'Regular', marginBottom: 10}}>La gestion des devoirs permet de tenir au courant les parents des devoirs qu'ont leurs enfants et ainsi de les y aider mais aussi à l'enseignant de suivre de près l'évolution de ses élèves.</Text>
            <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 100}}>
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>Ici !</Text>
            </View>
          </View>
          <View style={{width: "30%"}}>
            <Image source={require("@/assets/images/ob4.png")} style={{width: 80, height: 80}} />
          </View>
        </View>
      </View>

      <View style={{margin: 15}}> 
        <Heading text={"Tous les notes"} />
        {!loading ? <FlatList
          data={notes}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleShowNote(item)}
            >
              <View style={styles.note}>
                <View style={styles.noteImage}>
                  <Image source={require("@/assets/images/matiere.png")} style={{width: 50, height: 50}} />
                </View>
                <View style={styles.noteDesc}>
                  <Text style={[styles.text, {fontFamily: 'Bold'}]}>{student.nom +' '+ student.prenom}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.text, {fontFamily: 'Bold'}]}>{longueurTexte(item.nom_matiere, 30)}</Text>
                    <Text style={styles.text}>{item.note} / 20</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.text, {fontFamily: 'Bold'}]}>Séquence : {item.sequence}</Text>
                    <Text style={[styles.text, {marginRight: 20}]}>{item.annee_scolaire}</Text>
                  </View>
                  <Text style={styles.text}>Enregistré le {dateParser(item.created_at)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        /> :
        [0, 1, 2, 3, 4].map((t, i) => (
          <View style={styles.note} key={i}>
            <View style={{marginRight: 10}}>
              <Skeleton 
                show={true}
                width={50}
                height={50} 
                colorMode='light'
              />
            </View>
            <View style={styles.noteDesc}>
              <View style={{marginBottom: 10}}>
                <Skeleton 
                  show={true}
                  width={150}
                  height={10} 
                  colorMode='light'
                />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
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
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
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
        {(!loading && notes.length) === 0 && 
          <NoData />
        }
      </View>

      <ModalNote note={note} visible={showModal} setVisible={setShowModal} student={student} />
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
  note: {
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
  noteDesc: {
    flexDirection: 'column',
    marginRight: 20
  },
  noteImage: {
    marginRight: 10
  },
  text: {
    fontFamily: 'Regular'
  }
})

export default NoteScreen