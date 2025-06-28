import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { colors } from '@/utils/colors';
import { dateParser, longueurTexte, showToast } from '@/utils/fonctions';
import Heading from '@/components/Heading';
import { Skeleton } from 'moti/skeleton';
import NoData from '@/components/NoData';
import axios from 'axios';
import "react-native-gesture-handler";
import ModalCours from '@/components/ModalCour';
import { useLocalSearchParams } from 'expo-router';

const CourseScreen = () => {
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

  const [showModal, setShowModal] = useState(false);
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cour, setCour] = useState({});

  useEffect(() => {
    if (parsedStudent?.classe_id && parsedHeaders) {
      getCours().then(() => setLoading(false));
    }
  }, [parsedStudent]);

  const getCours = async () => {
    try {
      const res = await axios.get(`https://gesco-app.com/api/get-cours-children/${parsedStudent.classe_id}`, {
        headers: parsedHeaders,
      });
      setCours(res.data.cours);
    } catch (error) {
      showToast(error.message);
    }
  };

  function handleShowCours(data) {
    setCour(data);
    setShowModal(true);
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.BLANC, flex: 1 }}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.banner}>
            <View style={[styles.card, { backgroundColor: colors.BLEU_CLAIR }]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.cardText}>
                  La gestion des cours permet de planifier et d'organiser les enseignements de manière efficace
                </Text>
              </View>
              <Image source={require('@/assets/images/ob5.png')} style={styles.bannerImage} />
            </View>
          </View>

          <View style={styles.courseContainer}>
            <Heading text="Tous les cours" />
            {!loading ? (
              <FlatList
                data={cours}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleShowCours(item)} activeOpacity={0.7} style={styles.coursCard}>
                    <Image source={require('@/assets/images/cours.png')} style={styles.coursIcon} />
                    <View style={styles.coursInfo}>
                      <Text style={styles.coursTitle}>{item.titre}</Text>
                      <Text style={styles.coursDesc}>{longueurTexte(item.description, 45)}</Text>
                      <View style={styles.coursRow}>
                        <Text style={styles.matiereText}>{longueurTexte(item.nom_matiere)}</Text>
                        <Text style={styles.teacherText}>{item.nom_teacher + ' ' + item.prenom_teacher}</Text>
                      </View>
                      <Text style={styles.dateText}>Enregistré le {dateParser(item.created_at)}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<NoData />}
                scrollEnabled={false}
              />
            ) : (
              [0, 1, 2, 3].map((_, i) => (
                <View style={styles.coursCard} key={i}>
                  <Skeleton show={true} width={50} height={50} colorMode="light" style={styles.coursIcon} />
                  <View style={styles.coursInfo}>
                    <Skeleton show={true} width={180} height={12} colorMode="light" style={{ marginBottom: 8 }} />
                    <Skeleton show={true} width={200} height={10} colorMode="light" style={{ marginBottom: 8 }} />
                    <Skeleton show={true} width={150} height={10} colorMode="light" style={{ marginBottom: 4 }} />
                    <Skeleton show={true} width={100} height={10} colorMode="light" />
                  </View>
                </View>
              ))
            )}
          </View>

          <ModalCours visible={showModal} setVisible={setShowModal} cour={cour} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    height: 140,
  },
  bannerImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
  },
  courseContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  coursCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.BLEU_CLAIR,
  },
  coursIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  coursInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  coursTitle: {
    fontSize: 18,
    fontFamily: 'SemiBold',
    marginBottom: 4,
    color: colors.NOIR,
  },
  coursDesc: {
    fontSize: 15,
    fontFamily: 'Regular',
    color: '#555',
    marginBottom: 6,
  },
  coursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matiereText: {
    fontFamily: 'Bold',
    color: colors.BLEU,
  },
  teacherText: {
    fontFamily: 'Regular',
    color: '#333',
  },
  dateText: {
    fontFamily: 'Regular',
    fontSize: 13,
    color: '#777',
  },
});

export default CourseScreen;
