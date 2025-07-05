import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView,
  RefreshControl 
} from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { dateParserTime, dateParser } from '@/utils/fonctions'
import AjouterAbsence from '@/components/AjouterAbsence'
import axios from 'axios'
import { useLocalSearchParams } from 'expo-router';

const AbsenceScreen = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true)
  const [absences, setAbsences] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false)
  const [absence, setAbsence] = useState({})

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
    getPresences().then(() => setLoading(false))
  }, [])

  async function getPresences() {
    const url = 'https://gesco-app.com/api/get-absences-classe/' + parsedClasse.id;

    try {
      const res = await axios.get(url, {
        headers: parsedHeaders
      });
      //console.log('✅ Réponse reçue :', res.data);
      setAbsences(res.data);
    } catch (error) {
      console.log('❌ Erreur API :', error.response?.data || error.message);
    }
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
      style={{backgroundColor: colors.BLANC}}
    >
      {/* Header Card */}
      <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
          <Text style={{color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>
            La gestion des présences permet de surveiller l'assiduité des élèves
          </Text>
        </View>
        <View style={{width: "30%"}}>
          <Image 
            source={require("@/assets/images/presence-remove.png")} 
            style={{width: 80, height: 80}} 
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={{margin: 15}}>
        <Heading text={"Toutes les absences"} style={{marginBottom: 20}} />
        
        <TouchableOpacity 
          onPress={() => setShowModal(true)} 
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <AntDesign name="plus" size={24} color={colors.BLANC} />
        </TouchableOpacity>

        {!loading ? (
          <FlatList
            data={absences}
            scrollEnabled={false}
            renderItem={({item, i}) => (
              <TouchableOpacity 
                onPress={() => {
                  setAbsence(item)
                  setVisible(true)
                }} 
                key={i}
                activeOpacity={0.7}
              >
                <View style={styles.absence}>
                  <View style={{margin: 10}}>
                    <AntDesign name="warning" size={30} color={colors.ROUGE} />
                  </View>
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontSize: 20, fontFamily: 'Bold'}}>
                      {item.nom_student} {item.prenom_student}
                    </Text>
                    <Text style={{fontSize: 18, fontWeight: '400'}}>
                      Absent(e) à : {item.periode}
                    </Text>
                    <Text>
                      Enregistré le :{' '}
                      <Text style={{fontFamily: 'SemiBold', fontSize: 18}}>
                        {dateParserTime(item.created_at)}
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
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
                    width={200}
                    height={10} 
                    colorMode='light'
                  />
                </View>
                <Skeleton
                  show={true}
                  width={170}
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
        )}
        {(!loading && absences.length === 0) && <NoData />}
      </View>

      {/* Absence Details Modal */}
      <Modal
        visible={visible}
        animationType='slide'
        transparent={false}
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header with back button */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setVisible(false)}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back-outline' size={24} color={colors.NOIR} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Détails de l'absence</Text>
            <View style={{ width: 70 }} /> 
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Student Info Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.ROUGE_CLAIR }]}>
              <Ionicons name="warning" size={24} color={colors.ROUGE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>ÉLÈVE ABSENT</Text>
                <Text style={[styles.cardValue, { color: colors.ROUGE }]}>
                  {absence.nom_student || '-'} {absence.prenom_student || '-'}
                </Text>
              </View>
            </View>

            {/* Absence Details */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>DÉTAILS DE L'ABSENCE</Text>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Période:</Text>
                <Text style={styles.detailValue}>{absence.periode || 'Non spécifié'}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date d'enregistrement:</Text>
                <Text style={styles.detailValue}>
                  {absence.created_at ? dateParser(absence.created_at) : 'Date inconnue'}
                </Text>
              </View>
            </View>

            {/* Additional Information */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>INFORMATIONS COMPLÉMENTAIRES</Text>
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={colors.BLEU} />
                <Text style={styles.infoText}>
                  Cette absence a été enregistrée par l'enseignant et sera prise en compte dans le calcul de l'assiduité de l'élève.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Absence Modal */}
      <Modal
        animationType='slide'
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <AjouterAbsence 
          hideModal={() => setShowModal(false)} 
          user={parsedUser} 
          headers={parsedHeaders} 
          classe={parsedClasse} 
        />
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
    borderRadius: 15,
    elevation: 3,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  absence: {
    backgroundColor: colors.BLANC,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    merginTop:10,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.BLEU,
    elevation: 2,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButton: {
    position: 'absolute',
    backgroundColor: colors.BLEU,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    top: 0,
    elevation: 5,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
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
  infoBox: {
    backgroundColor: colors.BLEU_CLAIR,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Regular',
    color: colors.NOIR,
    marginLeft: 10,
    flex: 1,
  },
})

export default AbsenceScreen