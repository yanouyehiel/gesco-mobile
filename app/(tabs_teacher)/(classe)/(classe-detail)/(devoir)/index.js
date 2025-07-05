import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, Modal } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { showToast } from '@/utils/fonctions'
import axios from 'axios'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData';
import { colors } from '@/utils/colors'
import { dateParser, longueurTexte } from '@/utils/fonctions';
import { AntDesign } from '@expo/vector-icons'
import AjouterDevoir from '../../../../../components/AjouterDevoir'
import Heading from '@/components/Heading'
import { useLocalSearchParams, useRouter } from 'expo-router'

const DevoirScreen = () => {
  const [loading, setLoading] = useState(true)
  const [devoirs, setDevoirs] = useState([])
  const route = useRouter()
  const params = useLocalSearchParams()
  const [refreshing, setRefreshing] = useState(false);
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
    getDevoirs().then(() => setLoading(false))
  }, [parsedClasse])

  const getDevoirs = async () => {
    try {
      const res = await axios.get('https://gesco-app.com/api/devoirs-classe/' + parsedClasse.id, {headers: parsedHeaders});
      setDevoirs(res.data)
    } catch (error) {
      showToast(error.response.message)
    }
  }

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    getDevoirs().then(() => setLoading(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderHeader = () => (
    <View>
      <View style={styles.banner}>
        <View style={[styles.card, {backgroundColor: colors.BLEU_CLAIR}]}>
          <View style={{flexDirection: 'column', marginRight: 15, width: '60%', margin: '3%'}}>
            <Text style={{color: colors.NOIR, fontSize: 14, fontFamily: 'Regular', marginBottom: 10}}>
              La gestion des devoirs permet de tenir au courant les parents des devoirs qu'ont leurs enfants et ainsi de les y aider mais aussi à l'enseignant de suivre de près l'évolution de ses élèves.
            </Text>
          </View>
          <View style={{width: "30%"}}>
            <Image source={require("@/assets/images/ob4.png")} style={{width: 80, height: 80}} />
          </View>
        </View>
      </View>

      <View style={{margin: 15}}>
        <Heading text={"Tous les devoirs"} style={{marginBottom: 20}} />
        <TouchableOpacity onPress={() => setVisible(true)} style={styles.addButton}>
          <AntDesign name="plus" size={24} color={colors.BLANC} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderItem = ({item, index}) => (
    <View key={index} style={styles.devoir}>
      <View style={styles.devoirImage}>
        <Image source={require("@/assets/images/matiere.png")} style={{width: 50, height: 50}} />
      </View>
      <View style={styles.devoirDesc}>
        <Text style={{fontSize: 20, fontFamily: 'SemiBold'}}>{longueurTexte(item.nom_matiere, 35)}</Text>
        <Text style={[styles.text, {fontSize: 18}]} numberOfLines={2} ellipsizeMode="tail">{item.nom_livre}</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text style={[styles.text, {fontFamily: 'Bold'}]}>Page : {item.num_page}</Text>
          <Text style={[styles.text, {fontFamily: 'Bold'}]}>Numéro : {item.num_exo}</Text>
        </View>
        <Text style={styles.text}>Enregistré le {dateParser(item.created_at)}</Text>
      </View>
    </View>
  )

  const renderSkeleton = () => (
    <View>
      {[0, 1, 2, 3, 4].map((t, i) => (
        <View style={styles.devoir} key={i}>
          <View style={{marginRight: 10}}>
            <Skeleton 
              show={true}
              width={50}
              height={50} 
              colorMode='light'
            />
          </View>
          <View style={styles.devoirDesc}>
            <View style={{marginBottom: 10}}>
              <Skeleton 
                show={true}
                width={150}
                height={10} 
                colorMode='light'
              />
            </View>
            <View style={{marginBottom: 10}}>
              <Skeleton 
                show={true}
                width={180}
                height={10} 
                colorMode='light'
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
              <Skeleton 
                show={true}
                width={80}
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
                width={190}
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
        data={loading ? [] : devoirs}
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
          devoirs.length === 0 ? <NoData /> : null
        }
        contentContainerStyle={{paddingBottom: 30}}
      />
     
      <Modal
        animationType='slide'
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <AjouterDevoir 
          hideModal={() => setVisible(false)} 
          user={parsedUser}
          headers={parsedHeaders}
          classe={parsedClasse}
        />
      </Modal>
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
  devoir: {
    backgroundColor: colors.BLANC,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.GRIS_CLAIR,
    elevation: 2,
    shadowColor: colors.NOIR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: 15
  },
  devoirDesc: {
    flexDirection: 'column',
    flex: 1
  },
  devoirImage: {
    marginRight: 10
  },
  text: {
    fontFamily: 'Regular',
    fontSize: 18
  }
})

export default DevoirScreen