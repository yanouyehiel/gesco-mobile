import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView, RefreshControl, Modal } from 'react-native'
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

const NoteScreen = () => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const route = useRoute()
  const { classe, user, headers } = route.params
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '70%', '100%'], []);
  const handleOpenPress = () => bottomSheetModalRef.current?.expand();
  const handleClosePress = () => bottomSheetModalRef.current?.close()
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    handleClosePress()
    getNotes().then(() => setLoading(false))
  }, [classe])

  const getNotes = async () => {
    try {
      const res = await axios.get('https://test.comtheplug.com/api/get-notes-classe/' + classe.id, {headers: headers});
      setNotes(res.data.notes)
    } catch (error) {
      showToast(error.response.message)
    }
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getNotes().then(() => setLoading(false))
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
        <Heading text={"Tous les notes"} style={{marginBottom: 20}} />
        
        <TouchableOpacity onPress={() => setVisible(true)} style={styles.addButton}>
          <AntDesign name="plus" size={24} color={colors.BLANC} />
        </TouchableOpacity>

        {!loading ? <FlatList
          data={notes}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          renderItem={({item, index}) => (
            <View key={index} style={styles.note}>
              <View style={styles.noteImage}>
                <Image source={require("@/assets/images/matiere.png")} style={{width: 50, height: 50}} />
              </View>
              <View style={styles.noteDesc}>
                <Text style={[styles.text, {fontSize: 18}]}>{item.nom_student +' '+ item.prenom_student}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[styles.text]}>{longueurTexte(item.nom_matiere, 35)}</Text>
                  <Text style={styles.text}>{item.note} / 20</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={[styles.text]}>Séquence : {item.sequence}</Text>
                  <Text style={styles.text}>{item.annee_scolaire}</Text>
                </View>
                <Text >Enregistré le {dateParser(item.created_at)}</Text>
              </View>
            </View>
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
        {(!loading && notes.length) === 0 && 
          <NoData />
        }
      </View>

      <Modal
        animationType='slide'
        visible={visible}
      >
        <AjouterNote close={() => setVisible(false)} user={user} headers={headers} classe={classe} />
      </Modal>

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
    flexDirection: 'column'
  },
  noteImage: {
    marginRight: 10
  },
  text: {
    fontFamily: 'Regular',
    fontFamily: 'Bold',
    fontSize: 16
  }
})

export default NoteScreen