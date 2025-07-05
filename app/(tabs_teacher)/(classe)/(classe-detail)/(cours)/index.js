import { 
  View, Text, StyleSheet, Image, Modal, TouchableOpacity, FlatList,
  SafeAreaView, KeyboardAvoidingView, RefreshControl, StatusBar, Platform, ScrollView
} from 'react-native'
import React, { useEffect, useState, useMemo  } from 'react'
import { colors } from '@/utils/colors'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AjouterCours from '@/components/AjouterCours';
import { dateParser, longueurTexte, showToast } from '@/utils/fonctions';
import Heading from '@/components/Heading';
import { Skeleton } from 'moti/skeleton';
import NoData from '@/components/NoData';
import { getAllCoursClasse } from '@/services/MainService';
import { useLocalSearchParams, useRouter } from 'expo-router';

const CourseScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  
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

  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cour, setCour] = useState({});
  const [visibleC, setVisibleC] = useState(false);

  const getCours = async () => {
    try {
      if (!parsedClasse?.id) throw new Error("Classe ID non défini");
      const res = await getAllCoursClasse(parsedClasse.id, parsedHeaders);
      //console.log("✅ Cours récupérés:", res.cours);
      setCours(res.cours);
    } catch (error) {
      console.error("❌ Erreur getAllCoursClasse:", error);
      showToast(error.message || "Erreur lors de la récupération des cours");
    }
  };

  useEffect(() => {
    if (parsedClasse?.id && parsedHeaders) {
      setLoading(true);
      getCours().then(() => setLoading(false));
    }
  }, [parsedClasse?.id, parsedHeaders]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getCours().then(() => {
      setRefreshing(false);
      setLoading(false);
    });
  }, []);

  const ListHeader = () => (
    <>
      <View style={styles.banner}>
        <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
          <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%'}}>
            <Text style={{color: colors.NOIR, fontSize: 18, fontFamily: 'Regular', marginBottom: 10}}>
              La gestion des cours permet de planifier et d'organiser les enseignements de manière efficace
            </Text>
          </View>
          <View style={{width: "30%"}}>
            <Image source={require("@/assets/images/ob5.png")} style={{width: 80, height: 80}} />
          </View>
        </View>
      </View>

      <View style={{margin: 15, marginBottom: 10}}>
        <Heading text={"Tous les cours"} style={{marginBottom: 20}} />

        <TouchableOpacity onPress={() => setVisible(true)} style={styles.addButton}>
          <AntDesign name="plus" size={24} color={colors.BLANC} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCours = ({item}) => (
    <TouchableOpacity onPress={() => {
      setCour(item)
      setVisibleC(true)
    }}>
      <View style={styles.cours}>
        <View style={styles.coursImage}>
          <Image source={require("@/assets/images/cours.png")} style={{width: 50, height: 50}} />
        </View>
        <View style={styles.coursDesc}>
          <Text style={{fontSize: 20, fontFamily: 'SemiBold'}}>{item.titre}</Text>
          <Text style={[styles.text, {fontSize: 18}]} numberOfLines={2} ellipsizeMode="tail">
            {longueurTexte(item.description, 35)}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.text, {fontFamily: 'Bold'}]}>{longueurTexte(item.nom_matiere)}</Text>
            <Text style={styles.text}>{item.nom_teacher + ' ' + item.prenom_teacher}</Text>
          </View>
          <Text style={styles.text}>Enregistré le {dateParser(item.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View>
      {[0, 1, 2, 3, 4].map((t, i) => (
        <View style={styles.cours} key={i}>
          <View style={{marginRight: 10}}>
            <Skeleton show={true} width={50} height={50} colorMode='light' />
          </View>
          <View style={styles.coursDesc}>
            {[180, 210, 90, 70, 160].map((w, j) => (
              <View key={j} style={{marginBottom: 10}}>
                <Skeleton show={true} width={w} height={10} colorMode='light' />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.BLANC, flex: 1 }}>
      <StatusBar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={loading ? [] : cours}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeader}
          renderItem={loading ? null : renderCours}
          ListEmptyComponent={loading ? renderSkeleton : NoData}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 15 }}
        />

        {/* Course Details Modal */}
        <Modal animationType="slide" visible={visibleC} transparent={false}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setVisibleC(false)} style={styles.backButton}>
                <Ionicons name="arrow-back-outline" size={28} color={colors.NOIR} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Détails du cours</Text>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.contentCard}>
                {/* Title */}
                <View style={styles.section}>
                  <Text style={styles.label}>Titre :</Text>
                  <Text style={styles.value}>{cour.titre || '-'}</Text>
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.label}>Description :</Text>
                  <Text style={styles.value}>{cour.description || '-'}</Text>
                </View>

                {/* Subject & Teacher */}
                <View style={styles.sectionRow}>
                  <View style={styles.halfSection}>
                    <Text style={styles.label}>Matière :</Text>
                    <Text style={[styles.value, { color: colors.BLEU }]}>{cour.nom_matiere || '-'}</Text>
                  </View>
                  <View style={styles.halfSection}>
                    <Text style={styles.label}>Enseignant :</Text>
                    <Text style={[styles.value, { color: colors.VERT }]}>
                      {cour.nom_teacher && cour.prenom_teacher ? `${cour.nom_teacher} ${cour.prenom_teacher}` : '-'}
                    </Text>
                  </View>
                </View>

                {/* Date */}
                <View style={styles.section}>
                  <Text style={styles.label}>Enregistré le :</Text>
                  <Text style={styles.value}>{cour.created_at ? dateParser(cour.created_at) : '-'}</Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Add Course Modal */}
        <Modal animationType='slide' visible={visible}>
          <AjouterCours 
            close={() => setVisible(false)} 
            user={parsedUser} 
            headers={parsedHeaders} 
            classe={parsedClasse} 
            ecole={parsedEcole}
          />
        </Modal>
      </KeyboardAvoidingView>
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
    right: 20,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BLEU,
    borderRadius: 99,
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
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,
    
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
    fontSize: 20,
    fontFamily: 'Regular'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.BLANC,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 10, // larger tap area
  },
  modalTitle: {
    fontSize: 26,
    fontFamily: 'Bold',
    color: colors.NOIR,
    flex: 1,
    textAlign: 'center',
    marginRight: 30,
  },
  modalContent: {
    paddingBottom: 40,
  },
  contentCard: {
    backgroundColor: colors.BLANC,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 20,
    fontFamily: 'Bold',
    color: colors.NOIR,
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Regular',
    color: '#333',
    lineHeight: 28,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  halfSection: {
    flex: 0.48,
  },
})

export default CourseScreen;
