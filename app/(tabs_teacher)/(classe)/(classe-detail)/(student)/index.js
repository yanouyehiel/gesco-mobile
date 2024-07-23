import { View, Text, StyleSheet, Image, ScrollView, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'

const StudentScreen = () => {
  const route = useRoute()
  const { classe, user, headers } = route.params
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getStudents().then(() => setLoading(false))
  }, [])

  async function getStudents() {
    try {
      const res = await axios.get(`https://gesco-app.com/gesco/api/students/classe_id=${classe.id}&ecole_id=${user.ecole_id}`, {
        headers: headers
      })
      setStudents(res.data)
    } catch (error) {
      showToast(error.message)
    }
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getStudents().then(() => setLoading(false))
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
        <View style={{width: "30%"}}>
          <Image source={require("@/assets/images/ob2.png")} style={{width: 80, height: 80}} />
        </View>
        <View style={{flexDirection: 'column', marginRight: 15, width: '60%'}}>
          <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>La gestion des élèves essentielle pour suivre leurs progrès</Text>
          <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 100}}>
            <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>Ici !</Text>
          </View>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Tous les élèves"} value={students.length + ' élèves'} />
        {!loading ?
          <FlatList
            data={students}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item, i}) => (
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
                  <Text>{item.sexe}</Text>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text>Parent : <Text style={{fontFamily: 'Bold', fontSize: 17}}>{item.nom_parent + ' ' + item.prenom_parent}</Text></Text>
                    <Text>{item.tel_parent}</Text>
                  </View>
                </View>
              </View>
            )}
          /> :
          [0, 1, 2, 3, 4].map((t, i) => (
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
                <View style={{display: 'flex', gap: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                  <Skeleton 
                    show={true}
                    width={100}
                    height={10} 
                    colorMode='light'
                  />
                  <Skeleton 
                    show={true}
                    width={100}
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
                <View style={{display: 'flex', flexDirection: 'row', gap: 30, marginTop: 10, alignItems: 'center'}}>
                  <Skeleton 
                    show={true}
                    width={100}
                    height={10} 
                    colorMode='light'
                  />
                  <Skeleton 
                    show={true}
                    width={100}
                    height={10} 
                    colorMode='light'
                  />
                </View>
              </View>
            </View>
          ))
        }
        {(!loading && students.length) === 0 &&
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
  student: {
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
  studentImage: {
    marginRight: 10
  },
  studentDesc: {
    flexDirection: 'column'
  },
})

export default StudentScreen