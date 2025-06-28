import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { AntDesign } from '@expo/vector-icons'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { dateParser } from '@/utils/fonctions'
import axios from 'axios'
import { showToast } from '../../../../../utils/fonctions'
import { useLocalSearchParams } from 'expo-router'

const AbsenceScreen = () => {
  const params = useLocalSearchParams()

  const parseDoubleJSON = (str) => {
    if (!str) return null
    try {
      const once = JSON.parse(str)
      if (typeof once === 'string') return JSON.parse(once)
      return once
    } catch {
      return null
    }
  }

  const parsedStudent = useMemo(() => parseDoubleJSON(params?.student), [params?.student])
  const parsedHeaders = useMemo(() => parseDoubleJSON(params?.headers), [params?.headers])
  const [loading, setLoading] = useState(true)
  const [absences, setAbsences] = useState([])

  useEffect(() => {
    if (parsedStudent) {
      getPresences().then(() => setLoading(false))
    }
  }, [parsedStudent])

  async function getPresences() {
    try {
      const res = await axios.get(
        'https://gesco-app.com/api/get-absences-children/' + parsedStudent.id,
        {
          headers: parsedHeaders,
        }
      )
      setAbsences(res.data.absences)
    } catch (error) {
      showToast(error.message)
    }
  }

  const renderHeader = () => (
    <>
      <View style={[styles.card, { backgroundColor: colors.BLEU_CLAIR }]}>
        <View style={{ flexDirection: 'column', marginRight: 15, width: '60%', margin: '5%' }}>
          <Text style={{ color: colors.NOIR, fontSize: 20, fontFamily: 'Regular', marginBottom: 10 }}>
            La gestion des présences permet de surveiller l'assiduité des élèves
          </Text>
        </View>
        <View style={{ width: '30%' }}>
          <Image
            source={require('@/assets/images/presence-remove.png')}
            style={{ width: 80, height: 80 }}
          />
        </View>
      </View>

      <View style={{ margin: 15 }}>
        <Heading text={'Toutes les absences'} />
      </View>
    </>
  )

  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.absence}>
      <View style={{ margin: 10 }}>
        <AntDesign name="warning" size={30} color={colors.ROUGE} />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 20, fontFamily: 'Bold' }}>
          {parsedStudent?.nom + ' ' + parsedStudent?.prenom}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '400' }}>Absent(e) à : {item.periode}</Text>
        <Text>
          Enregistré le :{' '}
          <Text style={{ fontFamily: 'SemiBold', fontSize: 18 }}>{dateParser(item.created_at)}</Text>
        </Text>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.BLANC }}>
      {!loading ? (
        <FlatList
          data={absences}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoData />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        [0, 1, 2, 3, 4].map((t, i) => (
          <View key={i} style={styles.absence}>
            <Skeleton show={true} width={50} height={50} colorMode="light" />
            <View style={{ marginLeft: 10 }}>
              <View style={{ marginBottom: 10 }}>
                <Skeleton show={true} width={200} height={10} colorMode="light" />
              </View>
              <Skeleton show={true} width={180} height={10} colorMode="light" />
              <View style={{ marginTop: 10 }}>
                <Skeleton show={true} width={190} height={10} colorMode="light" />
              </View>
            </View>
          </View>
        ))
      )}
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
    borderColor: colors.BLEU,
  },
})

export default AbsenceScreen
