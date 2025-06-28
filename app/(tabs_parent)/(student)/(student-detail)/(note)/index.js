import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState, useEffect,useMemo } from 'react'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData';
import { colors } from '@/utils/colors'
import { dateParser, longueurTexte } from '@/utils/fonctions';
import { showToast } from '@/utils/fonctions'
import Heading from '@/components/Heading'
import ModalNote from '../../../../../components/ModalNote'
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';


const NoteScreen = () => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState({})
   const params = useLocalSearchParams();
     
    const parseDoubleJSON = (str) => {
      if (!str) return null;
      try {
        const once = JSON.parse(str);
        if (typeof once === 'string') return JSON.parse(once);
        return once;
      } catch {
        return null;
      }
    };
  
    const parsedStudent = useMemo(() => parseDoubleJSON(params?.student), [params?.student]);
    const parsedUser = useMemo(() => parseDoubleJSON(params?.user), [params?.user]);
    const parsedHeaders = useMemo(() => parseDoubleJSON(params?.headers), [params?.headers]);

  useEffect(() => {
    getNotes().then(() => setLoading(false))
  }, [parsedStudent])

  const getNotes = async () => {
  try {
    const res = await axios.get(
      `https://gesco-app.com/api/get-notes-children/${parseInt(parsedStudent.id)}`,
      { headers: parsedHeaders }
    );
    console.log("✅ Notes fetched successfully:", res.data.notes);
    setNotes(res.data.notes);
  } catch (error) {
    showToast(error.message);
  }
};

  function handleShowNote(data) {
    setNote(data)
    setShowModal(true)
  }

  return (
  <View style={{ flex: 1, backgroundColor: colors.BLANC }}>
    <FlatList
      data={notes}
      showsVerticalScrollIndicator={false}
      horizontal={false}
      ListHeaderComponent={
        <>
          <View style={styles.banner}>
            <View style={[styles.card, { backgroundColor: colors.BLEU_CLAIR }]}>
              <View style={{ flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%' }}>
                <Text style={{ color: colors.NOIR, fontSize: 18, fontFamily: 'Regular', marginBottom: 10 }}>
                  La gestion des notes assure une transparence totale auprès de l'administration et des parents d'élèves de l'exactitude des notes enregistrées.
                </Text>
              </View>
              <View style={{ width: "30%" }}>
                <Image source={require("@/assets/images/ob4.png")} style={{ width: 80, height: 80 }} />
              </View>
            </View>
          </View>

          <View style={{ margin: 15 }}>
            <Heading text={"Toutes les notes"} />
          </View>
        </>
      }
      renderItem={({ item, index }) => (
        <TouchableOpacity key={index} onPress={() => handleShowNote(item)}>
          <View style={styles.note}>
            <View style={styles.noteImage}>
              <Image source={require("@/assets/images/matiere.png")} style={{ width: 50, height: 50 }} />
            </View>
            <View style={styles.noteDesc}>
              <Text style={[styles.text, { fontFamily: 'Bold' }]}>{parsedHeaders?.nom + ' ' + parsedHeaders?.prenom}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.text, { fontFamily: 'Bold' }]}>{longueurTexte(item.nom_matiere, 30)}</Text>
                <Text style={styles.text}>{item.note} / 20</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.text, { fontFamily: 'Bold' }]}>{item.sequence}</Text>
                <Text style={[styles.text, { marginRight: 20 }]}>{item.annee_scolaire}</Text>
              </View>
              <Text style={styles.text}>Enregistré le {dateParser(item.created_at)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={!loading && <NoData />}
    />
    {loading && (
      [0, 1, 2, 3, 4].map((t, i) => (
        <View style={styles.note} key={i}>
          <View style={{ marginRight: 10 }}>
            <Skeleton show={true} width={50} height={50} colorMode='light' />
          </View>
          <View style={styles.noteDesc}>
            <View style={{ marginBottom: 10 }}>
              <Skeleton show={true} width={190} height={10} colorMode='light' />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 20 }}>
              <Skeleton show={true} width={100} height={10} colorMode='light' />
              <Skeleton show={true} width={70} height={10} colorMode='light' />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 20 }}>
              <Skeleton show={true} width={100} height={10} colorMode='light' />
              <Skeleton show={true} width={70} height={10} colorMode='light' />
            </View>
            <View>
              <Skeleton show={true} width={190} height={10} colorMode='light' />
            </View>
          </View>
        </View>
      ))
    )}

    <ModalNote note={note} visible={showModal} setVisible={setShowModal} student={parsedStudent} />
  </View>
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
    fontFamily: 'Regular',
    fontSize: 17
  }
})

export default NoteScreen