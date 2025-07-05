import { View, Text, StyleSheet, Image, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'
import ModalStudent from '../../../../../components/ModalStudent'
import { useLocalSearchParams, useRouter } from 'expo-router'

const StudentScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [student, setStudent] = useState({})
  const [visible, setVisible] = useState(false)

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
    getStudents().then(() => setLoading(false))
  }, [])

  async function getStudents() {
    try {
      const res = await axios.get(
        `https://gesco-app.com/api/students/classe_id=${parsedClasse.id}&ecole_id=${parsedEcole.id}`,
        { headers: parsedHeaders }
      );
      setStudents(res.data);
    } catch (error) {
      showToast("Erreur serveur: " + error.message);
    }
  }

  function viewStudent(item) {
    setStudent(item)
    setVisible(true)
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getStudents().then(() => setLoading(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderHeader = () => (
    <View>
      <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/ob2.png")} style={{width: 80, height: 80}} />
        </View>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%'}}>
          <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>
            La gestion des élèves essentielle pour suivre leurs progrès
          </Text>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Tous les élèves"} value={students.length + ' élèves'} />
      </View>
    </View>
  )

  const renderItem = ({item, i}) => (
    <TouchableOpacity onPress={() => viewStudent(item)}>
      <View key={i} style={styles.student}>
        <View style={styles.studentImage}>
          <Image 
            source={require("@/assets/images/user.jpeg")} 
            style={{width: 50, height: 50}}
          />
        </View>
        <View style={styles.studentDesc}>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{item.nom + ' ' + item.prenom}</Text>
            <Text style={{fontSize: 13, marginLeft: 5}}>{item.matricule}</Text>
          </View>
          <Text>Sexe : {item.sexe}</Text>
          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text>Date de naissance : {item.date_naissance}</Text>
            <Text>{item.tel_parent}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderSkeleton = () => (
    <View>
      {[0, 1, 2, 3, 4].map((t, i) => (
        <View key={i} style={styles.student}>
          <View style={styles.studentImage}>
            <Skeleton 
              show={true}
              width={50}
              height={50} 
              colorMode='light'
            />
          </View>
          <View style={styles.studentDesc}>
            <View style={{display: 'flex', gap: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
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
            <Skeleton 
              show={true}
              width={100}
              height={10} 
              colorMode='light'
            />
            <View style={{display: 'flex', flexDirection: 'row', gap: 15, marginTop: 10, alignItems: 'center'}}>
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
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View style={{flex: 1, backgroundColor: colors.BLANC}}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={loading ? [] : students}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
            progressBackgroundColor={colors.BLANC}
          />
        }
        ListEmptyComponent={
          loading ? renderSkeleton() : 
          students.length === 0 ? <NoData /> : null
        }
        contentContainerStyle={{paddingBottom: 30}}
      />

      <ModalStudent 
        headers={parsedHeaders} 
        visible={visible} 
        setVisible={setVisible} 
        student={student} 
      />
    </View>
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
  student: {
    backgroundColor: colors.BLANC,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 15,
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
  studentImage: {
    marginRight: 10
  },
  studentDesc: {
    flexDirection: 'column',
    flex: 1
  },
})

export default StudentScreen