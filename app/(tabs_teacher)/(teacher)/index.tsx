import {
  View, Text, ActivityIndicator, StyleSheet,
  FlatList, StatusBar, TouchableOpacity, Modal, RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Slider from '@/components/Slider'
import SlideClassItem from '@/components/SlideClassItem'
import { getAllClasses, getAllEvents, getHeaders, getMatieresSchool, getUser } from '../../../services/MainService'
import SlideMatiereItem from '../../../components/SlideMatiereItem'
import Heading from '../../../components/Heading'
import { colors } from '../../../utils/colors'
import EventItem from '../../../components/Event'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { showToast } from '@/utils/fonctions'
import "react-native-gesture-handler"
import ShowEvent from "@/components/ShowEvent"
import { BackHandler } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

const HomeScreen = () => {
  const [matieres, setMatieres] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [headers, setHeaders] = useState<any>(null)
  const [user, setUser] = useState<any>({})
  const [events, setEvents] = useState<any[]>([])
  const [event, setEvent] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadingClasse, setLoadingClasse] = useState(true)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [loadingMatiere, setLoadingMatiere] = useState<any>(true)
  const [showEvent, setShowEvent] = useState<any>(false)
  const [refreshing, setRefreshing] = useState(false)

  const route = useRouter()
  const routeName = useLocalSearchParams<{ name: string }>()

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const { headers }: any = await getHeaders()
        setHeaders(headers)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
    fetchHeaders().then(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!isLoading) {
      fetchClasses().then(() => setLoadingClasse(false))
      fetchEvents().then(() => setLoadingEvent(false))
      fetchMatieres().then(() => setLoadingMatiere(false))
    }
  }, [isLoading])

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => backHandler.remove()
  }, [])

  const fetchUser = async () => {
    const res = await getUser()
    setUser(res)
  }

  const fetchClasses = async () => {
    if (user.ecole_id) {
      try {
        const res = await getAllClasses(user.ecole_id, headers)
        setClasses(res)
      } catch (error: any) {
        showToast(error.message)
      }
    }
  }

  const fetchEvents = async () => {
    if (user.ecole_id) {
      try {
        const res = await getAllEvents(user.ecole_id, headers)
        setEvents(res)
      } catch (error: any) {
        showToast(error.message)
      }
    }
  }

  const fetchMatieres = async () => {
    if (user.ecole_id) {
      try {
        const res = await getMatieresSchool(user.ecole_id, headers)
        setMatieres(res)
      } catch (error: any) {
        showToast(error.message)
      }
    }
  }

  const handleView = (item: any) => {
    setEvent(item)
    setShowEvent(true)
  }

  const onRefresh = () => {
    setRefreshing(true)
    Promise.all([
      fetchClasses().then(() => setLoadingClasse(false)),
      fetchEvents().then(() => setLoadingEvent(false)),
      fetchMatieres().then(() => setLoadingMatiere(false))
    ]).finally(() => setRefreshing(false))
  }

  const renderSkeleton = () =>
    [0, 1, 2].map((t, i) => (
      <View key={i} style={styles.event}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Skeleton show={true} width={50} height={50} colorMode='light' />
        </View>
        <View style={styles.eventItem}>
          <Skeleton show={true} width={200} height={15} colorMode='light' style={{ marginBottom: 10 }} />
          <Skeleton show={true} width={150} height={10} colorMode='light' style={{ marginBottom: 10 }} />
          <Skeleton show={true} width={130} height={10} colorMode='light' />
        </View>
      </View>
    ))

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.BLEU} />
      {isLoading || !user ? (
        <ActivityIndicator color={colors.VERT} size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={loadingEvent ? [] : events}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleView(item)}>
              <EventItem event={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
              progressBackgroundColor={colors.BLANC}
            />
          }
          ListHeaderComponent={
            <>
              <Header user={user} />
              <View style={{ padding: 20 }}>
                <Slider
                  slider={classes}
                  headers={headers}
                  user={user}
                  loading={loadingClasse}
                  Component={SlideClassItem}
                  titleHeading='Nos Classes'
                  style={{}}
                />
                <Slider
                  slider={matieres}
                  headers={headers}
                  user={user}
                  loading={loadingMatiere}
                  Component={SlideMatiereItem}
                  titleHeading='Nos Matières'
                  style={{ marginTop: 20 }}
                />
                <Heading style={styles.headerEvent} text="Notre agenda scolaire" />
                {loadingEvent && renderSkeleton()}
                {!loadingEvent && events.length === 0 && <NoData />}
              </View>
            </>
          }
          ListFooterComponent={<View style={{ height: 60 }} />}
        />
      )}

      <Modal
        animationType='slide'
        visible={showEvent}
        onRequestClose={() => setShowEvent(false)}
      >
        <ShowEvent hideModal={() => setShowEvent(false)} event={event} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLANC
  },
  headerEvent: {
    marginTop: 20
  },
  event: {
    backgroundColor: '#f2f2f2',
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
  }
})

export default HomeScreen
