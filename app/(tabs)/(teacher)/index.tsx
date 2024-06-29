import { View, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView, StatusBar, TouchableOpacity, Animated, SafeAreaView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import Slider from '@/components/Slider'
import { slidesClasse } from '@/utils/slides'
import SlideClassItem from '@/components/SlideClassItem'
import { getAllClasses, getAllEvents, getHeaders, getMatieresSchool, getMyClasses, getUser } from '../../../services/MainService'
import SlideMatiereItem from '../../../components/SlideMatiereItem'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Heading from '../../../components/Heading'
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors'
import EventItem from '../../../components/Event'
import SkeletonComponent from '@/components/SkeletonComponent'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'
import Modal from 'react-native-modal';

const HomeScreen = () => {
  const [matieres, setMatieres] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [headers, setHeaders] = useState<any>(null)
  const [user, setUser] = useState<any>({})
  const [events, setEvents] = useState<any[]>([])
  const [event, setEvent] = useState<any>({})
  const [visible, setVisible] = useState<any>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingClasse, setLoadingClasse] = useState(true)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [loadingMatiere, setLoadingMatiere] = useState<any>(true)
  const scale = useRef<any>(new Animated.Value(0)).current
  const navigation = useNavigation()

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const { headers }: any | string = await getHeaders();
        setHeaders(headers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser()

    fetchHeaders().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchClasses().then(() => setLoadingClasse(false))
      fetchEvents().then(() => setLoadingEvent(false))
      fetchMatieres().then(() => setLoadingMatiere(false))
    }
  }, [isLoading])

  const fetchUser = async () => {
    await getUser().then(res => {
      setUser(res);
    });
  };

  const fetchClasses = async () => {
    if (user.ecole_id) {
      try {
        const res = await getAllClasses(user.ecole_id, headers);
        setClasses(res);
      } catch (error: any) {
        showToast(error.message)
      }
    }
  };

  const fetchEvents = async () => {
    try {
      if (user.ecole_id) {
        const res = await getAllEvents(user.ecole_id, headers)
        setEvents(res)
      }
    } catch (error: any) {
      showToast(error.message)
    }
  }

  const fetchMatieres = async () => {
    try {
      if (user.ecole_id) {
        const res = await getMatieresSchool(user.ecole_id, headers);
        setMatieres(res);
      }
    } catch (error: any) {
      showToast(error.message)
    }
  };

  function handleView(item: any) {
    setEvent(item)
    Alert.alert(event.title, event.description, [
      {
        text: 'Fermer'
      }
    ])
    setVisible(!visible)
  }

  const PopupEvent = ({event}: any) => {
    console.log(event)
    setVisible(!visible)
    return (
      <Modal isVisible={visible} style={{ flex: 1 }}>
        <View>
          <Animated.View style={[
            styles.popup, 
            {opacity: scale.interpolate({inputRange: [0, 1], outputRange: [0, 1]})},
            {
              transform: [{scale: scale}]
            }]}>
              <Text>{event?.title}</Text>
              <Text>{event?.description}</Text>
              <Text>{event?.start}</Text>
              <Text>{event?.end}</Text>
          </Animated.View>
        </View>
      </Modal>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor={colors.BLEU} />
      {/* Header */}
      <Header user={user} />
      {user ?
        <View style={{padding: 20}}>
          {/* Slider Classes */}
          <Slider 
            slider={classes} 
            headers={headers}
            user={user}
            loading={loadingClasse}
            Component={SlideClassItem} 
            titleHeading='Nos Classes' 
          />
          {/* Slider Matieres */}
          <Slider 
            slider={matieres} 
            headers={headers}
            user={user}
            loading={loadingMatiere}
            Component={SlideMatiereItem} 
            titleHeading='Nos Matières' 
            style={{ marginTop: 20 }}
          />

          <View>
            <Heading style={styles.headerEvent} text="Les prochains évènements" />
            {!loadingEvent ? <FlatList
              showsHorizontalScrollIndicator={false}
              data={events}
              //style={styles.events}
              renderItem={({item, index}) => (
                <EventItem key={index} event={item} />
              )}
              keyExtractor={(item, index) => index.toString()}
            /> :
            <View>
              {[0, 1, 2].map((t, i) => (
                <View key={i} style={styles.event}>
                  <View style={{display: 'flex',alignItems: 'center', justifyContent: 'center'}}>
                    <Skeleton
                      show={true}
                      width={50}
                      height={50} 
                      colorMode='light'
                    />
                  </View>
                  <View style={styles.eventItem}>
                    <View style={{marginBottom: 10}}>
                      <Skeleton 
                        show={true}
                        width={150}
                        height={15}
                        colorMode='light'
                      />
                    </View>
                    <View style={{marginBottom: 10}}>
                      <Skeleton 
                        show={true}
                        width={230}
                        height={10}
                        colorMode='light'
                      />
                    </View>
                    <View style={{marginBottom: 10}}>
                      <Skeleton 
                        show={true}
                        width={230}
                        height={10}
                        colorMode='light'
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>}
            {(!loadingEvent && events.length === 0) &&
              <NoData />
            }
          </View> 
               
          {/* <Modal animationType='slide' visible={visible} style={styles.popup}>
            <SafeAreaView style={{ flex: 1 }}>
              <Animated.View style={[
                {opacity: scale.interpolate({inputRange: [0, 1], outputRange: [0, 1]})},
                {
                  transform: [{scale: scale}]
                }]}>
                  <Text style={{color: colors.NOIR}}>{event.title}</Text>
                  <Text style={{color: colors.NOIR}}>{event.description}</Text>
                  <Text style={{color: colors.NOIR}}>{event.start}</Text>
                  <Text style={{color: colors.NOIR}}>{event.end}</Text>
              </Animated.View>
            </SafeAreaView>
          </Modal> */}
        </View>
        :
        <Text style={{ fontSize: 15, textAlign: 'center' }}>
            <ActivityIndicator color={colors.VERT} size='large' />
        </Text>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLANC
  },
  headerEvent: {
    marginTop: 20
  },
  event: {
    backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    height: 80
  },
  eventItem: {
    flexDirection: 'column',
    marginLeft: 20,
    height: 50
  },
  popup: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    elevation: 5,
    height: 400
  }
})

export default HomeScreen