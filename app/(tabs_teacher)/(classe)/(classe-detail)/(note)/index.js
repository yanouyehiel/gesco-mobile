import { 
  View, 
  Text, 
  SafeAreaView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  RefreshControl, 
  Modal, 
  Animated, 
  TextInput 
} from 'react-native'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData';
import { colors } from '@/utils/colors'
import { dateParser, longueurTexte } from '@/utils/fonctions';
import { showToast } from '@/utils/fonctions'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import AjouterNote from '../../../../../components/AjouterNote'
import Heading from '@/components/Heading'
import { SimpleLineIcons } from '@expo/vector-icons';
import { updateNote, getNotesClasse } from "@/services/MainService";
import { Easing } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from 'expo-router';

const NoteScreen = () => {
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const params = useLocalSearchParams();
  const bottomSheetModalRef = useRef(null);
  const handleClosePress = () => bottomSheetModalRef.current?.close()
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false)
  const [note, setNote] = useState({})
  const [newData, setNewData] = useState({})
  const [newNote, setNewNote] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showModalUpdate, setShowModalUpdate] = useState(false)
  const [visibleOption, setVisibleOption] = useState(false)

  const parseDoubleJSON = (str) => {
    if (!str) return null;
    try {
      const once = JSON.parse(str);
      if (typeof once === 'string') {
        return JSON.parse(once);
      }
      return once;
    } catch {
      return null;
    }
  }

  const parsedClasse = useMemo(() => parseDoubleJSON(params?.classe), [params?.classe]);
  const parsedUser = useMemo(() => parseDoubleJSON(params?.user), [params?.user]);
  const parsedHeaders = useMemo(() => parseDoubleJSON(params?.headers), [params?.headers]);
  const parsedEcole = useMemo(() => parseDoubleJSON(params?.ecole), [params?.ecole]);

  useEffect(() => {
    handleClosePress()
    getNotes().then(() => setLoading(false))
  }, [parsedClasse])

  const getNotes = async () => {
    try {
      const res = await getNotesClasse(parsedClasse.id, parsedHeaders);
      setNotes(res.notes);
    } catch (error) {
      showToast(error.response?.data?.message || error.message);
    }
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getNotes().then(() => setLoading(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  function handleShowNote(data) {
    setNote(data)
    setShowModal(true)
  }

  function handleUpdateNote(data) {
    setNewData(data)
    setShowModalUpdate(true)
  }

  const scale = useRef(new Animated.Value(0)).current

  function resizeBox(to) {
    to === 1 && setVisibleOption(true)
    Animated.timing(scale, {
      toValue: to,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.linear
    }).start(() => to === 0 && setVisibleOption(false))
  }

  const handleSubmit = async () => {
    setLoading(true)

    const noteValue = parseFloat(newNote)

    if (!isNaN(noteValue) && noteValue > 0 && noteValue < 20) {
      const data = {
        id: newData.id,
        note: noteValue
      }

      try {
        const res = await updateNote(data, parsedHeaders)
        showToast(res.message)
        setShowModalUpdate(false)
        getNotes()
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la note :", error)
        showToast("Erreur lors de la mise à jour")
      }
    } else {
      showToast("Entrez une note valide entre 0 et 20")
    }

    setLoading(false)
  }

  //Modal popup option note
  const Popup = ({data}) => {
    return (
      <Modal transparent visible={visibleOption}>
        <SafeAreaView 
          style={{ flex: 1 }}
          onTouchStart={() => resizeBox(0)}>
          <Animated.View style={[
            styles.popup, 
            {opacity: scale.interpolate({inputRange: [0, 1], outputRange: [0, 1]})},
            {
              transform: [{scale: scale}]
            }]}> 
            <TouchableOpacity
              onPress={() => handleShowNote(data)}
              style={styles.option}
              activeOpacity={0.7}
            >
              <Ionicons name="eye" size={18} color={colors.BLEU} />
              <Text style={styles.optionText}>Voir détails</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleUpdateNote(data)} 
              style={styles.option}
              activeOpacity={0.7}
            >
              <Ionicons name="create" size={18} color={colors.VERT} />
              <Text style={styles.optionText}>Modifier note</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </Modal>
    )
  }

  const renderHeader = () => (
    <View>
      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
          <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
            <Text style={{color: colors.NOIR, fontSize: 17, fontFamily: 'Regular', marginBottom: 10}}>
              La gestion des notes assure une transparence totale auprès de l'administration et des parents d'élèves de l'exactitude des notes enregistrées.
            </Text>
          </View>
          <View style={{width: "30%"}}>
            <Image source={require("@/assets/images/ob4.png")} style={{width: 80, height: 80}} />
          </View>
        </View>
      </View>

      <View style={{margin: 15}}> 
        <Heading text={"Toutes les notes"} style={{marginBottom: 20}} />
        
        <TouchableOpacity 
          onPress={() => setVisible(true)} 
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <AntDesign name="plus" size={24} color={colors.BLANC} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderItem = ({item, index}) => (
    <View key={index}>
      <View style={styles.note}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={styles.noteImage}>
            <Image source={require("@/assets/images/matiere.png")} style={{width: 50, height: 50}} />
          </View>
          <View style={styles.noteDesc}>
            <Text style={[styles.text, {fontSize: 20}]}>{item.nom_student +' '+ item.prenom_student}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.text]}>{longueurTexte(item.nom_matiere, 25)}</Text>
              <Text style={styles.text}>{item.note} / 20</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 30}}>
              <Text style={[styles.text]}>{item.sequence}</Text>
              <Text style={styles.text}>{item.annee_scolaire}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => resizeBox(1)} activeOpacity={0.7}>
            <SimpleLineIcons name="options-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={{marginLeft: 15}}>Enregistré le {dateParser(item.created_at)}</Text>
      </View>
      <Popup data={item} />
    </View>
  )

    const renderSkeleton = () => (
      <View>
        {[0, 1, 2, 3, 4].map((t, i) => (
          <View style={styles.note} key={i}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                    width={190}
                    height={10} 
                    colorMode='light'
                  />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 20}}>
                  <Skeleton 
                    show={true}
                    width={100}
                    height={10} 
                    colorMode='light'
                  />
                  <Skeleton 
                    show={true}
                    width={50}
                    height={10} 
                    colorMode='light'
                  />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 20}}>
                  <Skeleton 
                    show={true}
                    width={90}
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
                    width={200}
                    height={10} 
                    colorMode='light'
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    )

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.BLANC}}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={loading ? [] : notes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          loading ? renderSkeleton() : 
          notes.length === 0 ? <NoData /> : null
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
            progressBackgroundColor={colors.BLANC}
          />
        }
        contentContainerStyle={{paddingBottom: 30}}
      />

      {/* Note Details Modal */}
      <Modal
        animationType='slide'
        visible={showModal}
        transparent={false}
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back-outline' size={24} color={colors.NOIR} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Détails de la note</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Content */}
          <FlatList
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
            data={[1]} // Dummy data for single item render
            renderItem={() => (
              <>
                {/* Student Info Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.VERT_CLAIR }]}>
                  <Ionicons name="person" size={24} color={colors.VERT} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>ÉLÈVE</Text>
                    <Text style={[styles.cardValue, { color: colors.BLEU }]}>
                      {note.nom_student || '-'} {note.prenom_student || '-'}
                    </Text>
                  </View>
                </View>

                {/* Note Details */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>INFORMATIONS SUR LA NOTE</Text>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Matière:</Text>
                    <Text style={styles.detailValue}>{note.nom_matiere || '-'}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Note:</Text>
                    <Text style={[styles.detailValue, { color: colors.BLEU }]}>
                      {note.note || '0'} / 20
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Séquence:</Text>
                    <Text style={styles.detailValue}>{note.sequence || '-'}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Année scolaire:</Text>
                    <Text style={styles.detailValue}>{note.annee_scolaire || '-'}</Text>
                  </View>
                </View>

                {/* Date Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>DATE</Text>
                  <View style={[styles.dateContainer]}>
                    <Ionicons name="calendar" size={18} color={colors.GRIS_FONCE} />
                    <Text style={[styles.detailValue, { marginLeft: 8 }]}>
                      {note.created_at ? dateParser(note.created_at) : 'Date inconnue'}
                    </Text>
                  </View>
                </View>
              </>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        animationType='slide'
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <AjouterNote
          close={() => setVisible(false)}
          user={parsedUser}
          headers={parsedHeaders}
          classe={parsedClasse}
          ecole={parsedEcole}
        />
      </Modal>

      {/* Update Note Modal */}
      <Modal 
        visible={showModalUpdate}
        animationType='slide'
        transparent={false}
        onRequestClose={() => setShowModalUpdate(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowModalUpdate(false)}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back-outline' size={24} color={colors.NOIR} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Modifier une note</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Content */}
          <View style={styles.updateModalContent}>
            {/* Student Info */}
            <View style={styles.studentInfo}>
              <Ionicons name="person" size={24} color={colors.BLEU} />
              <Text style={styles.studentName}>
                {newData.nom_student} {newData.prenom_student}
              </Text>
            </View>

            {/* Subject Info */}
            <View style={styles.subjectInfo}>
              <Ionicons name="book" size={20} color={colors.VERT} />
              <Text style={styles.subjectText}>{newData.nom_matiere}</Text>
            </View>

            {/* Current Grade */}
            <View style={styles.currentGrade}>
              <Text style={styles.gradeLabel}>Note actuelle:</Text>
              <Text style={styles.gradeValue}>{newData.note} / 20</Text>
            </View>

            {/* New Grade Input */}
            <TextInput
              placeholder='Entrer la nouvelle note (0-20)'
              placeholderTextColor={colors.GRIS}
              keyboardType='numeric'
              numberOfLines={1} 
              multiline={false}
              onChangeText={(text) => setNewNote(text)}
              style={styles.gradeInput}
            />

            {/* Update Button */}
            <TouchableOpacity 
              onPress={handleSubmit} 
              style={styles.updateButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.BLANC} />
              ) : (
                <Text style={styles.updateButtonText}>Mettre à jour</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    height: 200, 
    borderRadius: 15,
    elevation: 3,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    backgroundColor: colors.BLEU,
    borderRadius: 25,
    elevation: 5,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  note: {
    backgroundColor: colors.BLANC,
    marginBottom: 10,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.GRIS_CLAIR,
    elevation: 2,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteDesc: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 10,
  },
  noteImage: {
    marginTop: 10
  },
  text: {
    fontFamily: 'Regular',
    fontSize: 16
  },
  popup: {
    borderRadius: 8,
    borderColor: colors.GRIS_CLAIR,
    borderWidth: 1,
    backgroundColor: colors.BLANC,
    paddingHorizontal: 10,
    position: 'absolute',
    top: '45%',
    right: 20,
    elevation: 5,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_TRES_CLAIR,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Regular',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.BLANC,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_CLAIR,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Regular',
    marginLeft: 5,
    color: colors.NOIR,
  },
  modalTitle: {
    fontSize: 25,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
    textAlign: 'center',
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 12,
  },
  cardLabel: {
    fontSize: 20,
    fontFamily: 'SemiBold',
    color: colors.GRIS_FONCE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: 'SemiBold',
  },
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 20,
    fontFamily: 'SemiBold',
    color: colors.GRIS_FONCE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_TRES_CLAIR,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  // Update Modal Styles
  updateModalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
    marginLeft: 10,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectText: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
    marginLeft: 10,
  },
  currentGrade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_TRES_CLAIR,
    marginBottom: 20,
  },
  gradeLabel: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
  },
  gradeValue: {
    fontSize: 16,
    fontFamily: 'SemiBold',
    color: colors.BLEU,
  },
  gradeInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderColor: colors.BLEU,
    marginBottom: 25,
    backgroundColor: colors.GRIS_TRES_CLAIR,
  },
  updateButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  updateButtonText: {
    fontFamily: 'SemiBold',
    color: colors.BLANC,
    fontSize: 18,
  },
})

export default NoteScreen