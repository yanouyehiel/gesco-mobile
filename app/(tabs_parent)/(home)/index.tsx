import {
  View, Text, ActivityIndicator, StyleSheet,
  FlatList, StatusBar, TouchableOpacity,
  RefreshControl, Modal
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getAllCalendars, getHeaders, getUser } from '../../../services/MainService'
import Heading from '../../../components/Heading'
import { colors } from '../../../utils/colors'
import Calendar from '../../../components/Calendar'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { showToast } from '@/utils/fonctions'
import "react-native-gesture-handler"
import ShowCalendar from '@/components/ShowCalendar'
import { BackHandler } from 'react-native'

const HomeScreen = () => {
  const [headers, setHeaders] = useState<any>(null)
  const [user, setUser] = useState<any>({})
  const [events, setEvents] = useState<any[]>([])
  const [event, setEvent] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [showEvent, setShowEvent] = useState<any>(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const { headers }: any | string = await getHeaders();
        setHeaders(headers);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser()
    fetchHeaders().then(() => setIsLoading(false));
  }, [])

  useEffect(() => {
    if (!isLoading) {
      fetchCalendars().then(() => setLoadingEvent(false))
    }
  }, [isLoading])

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    )

    return () => backHandler.remove()
  }, [])

  const fetchCalendars = async () => {
    try {
      if (user.ecole_id) {
        const res = await getAllCalendars(user.ecole_id, headers)
        setEvents(res)
      }
    } catch (error: any) {
      showToast(error.message)
    }
  }

  const fetchUser = async () => {
    await getUser().then(res => {
      setUser(res)
    })
  }

  function handleView(item: any) {
    setEvent(item)
    setShowEvent(true)
  }

  const onRefresh = () => {
    setLoadingEvent(true)
    setRefreshing(true)
    fetchCalendars().then(() => {
      setLoadingEvent(false)
      setRefreshing(false)
    })
  }

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity onPress={() => handleView(item)}>
      <Calendar key={index} calendar={item} />
    </TouchableOpacity>
  )

  const renderSkeleton = () => (
    [0, 1, 2, 3, 4].map((t, i) => (
      <View key={i} style={styles.event}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Skeleton show={true} width={50} height={50} colorMode='light' />
        </View>
        <View style={styles.eventItem}>
          <Skeleton show={true} width={150} height={15} colorMode='light' style={{ marginBottom: 10 }} />
          <Skeleton show={true} width={230} height={10} colorMode='light' style={{ marginBottom: 10 }} />
          <Skeleton show={true} width={230} height={10} colorMode='light' />
        </View>
      </View>
    ))
  )

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.BLEU} />
      {isLoading || !user ? (
        <ActivityIndicator color={colors.VERT} size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={loadingEvent ? [] : events}
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
          ListHeaderComponent={
            <>
              <Header user={user} />
              <View style={{ padding: 20 }}>
                <Heading style={styles.headerEvent} text="Le calendrier de l'école" />
                {loadingEvent && renderSkeleton()}
                {!loadingEvent && events.length === 0 && <NoData />}
              </View>
            </>
          }
          ListFooterComponent={<View style={{ height: 50 }} />}
        />
      )}

      <Modal
        animationType='slide'
        visible={showEvent}
        onRequestClose={() => setShowEvent(false)}
      >
        <ShowCalendar hideModal={() => setShowEvent(false)} calendar={event} />
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
  },
})

export default HomeScreen
