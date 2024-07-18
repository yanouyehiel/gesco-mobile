import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import Heading from '@/components/Heading'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import { FontAwesome } from '@expo/vector-icons'
import { dateParser } from '@/utils/fonctions'

const StudentScreen = () => {
  const route = useRoute()
  const { student, headers } = route.params
  const [loading, setLoading] = useState(true)
  const [feesStudent, setFeesStudent] = useState(null)

  useEffect(() => {
    getFeesStudent().then(() => setLoading(false))
  }, [])

  async function getFeesStudent() {
    const res = await axios.get(`https://test.comtheplug.com/api/get-fees-student/${parseInt(student.id)}`, {
      headers: headers
    })
    setFeesStudent(res.data)
  }

  return (
    <ScrollView>
      <View style={styles.card}>
        <View style={{flexDirection: 'column', marginRight: 15}}>
          <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>{student.nom +' '+ student.prenom}</Text>
          <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 100}}>
            <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>{student.matricule}</Text>
          </View>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Ses tarifs"} />
        <View style={{margin: 15}}>
          <View style={styles.cardTarif}>
            <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Inscription</Text>
            <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 150}}>
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>
                {feesStudent?.tarifs.inscription}
              </Text>
            </View>
          </View>
          <View style={styles.cardTarif}>
            <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Première tranche</Text>
            <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 150}}>
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>
                {feesStudent?.tarifs.premiere_tranche}
              </Text>
            </View>
          </View>
          <View style={styles.cardTarif}>
            <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Deuxième tranche</Text>
            <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 150}}>
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>
                {feesStudent?.tarifs.deuxieme_tranche}
              </Text>
            </View>
          </View>
          <View style={styles.cardTarif}>
            <Text style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular', marginBottom: 10}}>Troisième tranche</Text>
            <View style={{backgroundColor: colors.BLANC, color: colors.NOIR, padding: 8, borderRadius: 10, width: 150}}>
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Regular'}}>
                {feesStudent?.tarifs.troisieme_tranche}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Résumé"} />
        <View style={{margin: 15, display: 'flex', flexDirection: 'row', gap: 15}}>
          <View style={styles.cardResume}>
            <Text style={{color: colors.BLANC, fontSize: 18, fontFamily: 'Regular', marginBottom: 10}}>
              Total
            </Text>
            <Text style={{textAlign: 'center', fontSize: 16, fontFamily: 'Regular'}}>
              {feesStudent?.total}
            </Text>
          </View>
          <View style={styles.cardResume}>
            <Text style={{color: colors.BLANC, fontSize: 18, fontFamily: 'Regular', marginBottom: 10}}>
              Déjà payé
            </Text>
            <Text style={{textAlign: 'center', fontSize: 16, fontFamily: 'Regular'}}>
              {feesStudent?.paye}
            </Text>
          </View>
          <View style={styles.cardResume}>
            <Text style={{color: colors.BLANC, fontSize: 18, fontFamily: 'Regular', marginBottom: 10}}>
              Reste à payer
            </Text>
            <Text style={{textAlign: 'center', fontSize: 16, fontFamily: 'Regular'}}>
              {feesStudent?.reste}
            </Text>
          </View>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Tous ses paiements"} />
        {!loading ?
          <FlatList
            data={feesStudent?.paiements}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item, i}) => (
              <View key={i} style={styles.student}>
                <View style={styles.studentImage}>
                  <FontAwesome name="money" size={50} color="black" />
                </View>
                <View style={styles.studentDesc}>
                  <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{item.code}</Text>
                  <Text style={{fontSize: 16, fontFamily: 'SemiBold'}}>{item.intitule}</Text>
                  <Text style={{fontSize: 18, fontFamily: 'Bold'}}>{item.montant} XAF</Text>
                  <Text>{item.annee_scolaire}</Text>
                  <Text style={{marginTop: 20}}>{dateParser(item.created_at)}</Text>
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
        {(!loading && feesStudent) &&
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
    borderRadius: 15,
    backgroundColor: colors.BLEU_CLAIR
  },
  cardTarif: {
    borderRadius: 15,
    backgroundColor: colors.BLEU_CLAIR,
    width: 200,
    height: 200,
    padding: 15
  },
  cardResume: {
    borderRadius: 15,
    backgroundColor: colors.VERT_CLAIR,
    width: 50,
    height: 50,
    padding: 15
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