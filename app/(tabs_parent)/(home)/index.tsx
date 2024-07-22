import { View, Text, ActivityIndicator, StyleSheet, FlatList, ScrollView, StatusBar, TouchableOpacity, RefreshControl, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { getAllCalendars, getAllEvents, getHeaders, getUser } from '../../../services/MainService'
import Heading from '../../../components/Heading'
import { colors } from '../../../utils/colors'
import Calendar from '../../../components/Calendar'
import { Skeleton } from 'moti/skeleton'
import NoData from '@/components/NoData'
import { showToast } from '@/utils/fonctions'
import "react-native-gesture-handler"
import ShowCalendar from '@/components/ShowCalendar'

const HomeScreen = () => {
  const [headers, setHeaders] = useState<any>(null)
  const [user, setUser] = useState<any>({})
  const [events, setEvents] = useState<any[]>([])
  const [event, setEvent] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [showEvent, setShowEvent] = useState<any>(false)
  const [refreshing, setRefreshing] = useState(false);

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
      fetchCalendars().then(() => setLoadingEvent(false))
    }
  }, [isLoading])

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
      setUser(res);
    });
  };

  function handleView(item: any) {
    setEvent(item)
    setShowEvent(!showEvent)
  }

  const onRefresh = React.useCallback(() => {
    setLoadingEvent(true)
    setRefreshing(true);
    fetchCalendars().then(() => setLoadingEvent(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
          progressBackgroundColor={colors.BLANC}
        />
      }
    >
      <StatusBar backgroundColor={colors.BLEU} />
      
      <Header user={user} />
      {user ?
        <View style={{padding: 20}}>
          <View>
            <Heading style={styles.headerEvent} text="Le calendrier de l'école" />
            {!loadingEvent ? <FlatList
              showsHorizontalScrollIndicator={false}
              data={events}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => handleView(item)}>
                  <Calendar key={index} calendar={item} />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            /> :
            <View>
              {[0, 1, 2, 3, 4].map((t, i) => (
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
        </View>
        :
        <Text style={{ fontSize: 15, textAlign: 'center' }}>
            <ActivityIndicator color={colors.VERT} size='large' />
        </Text>
      }

      <Modal
        animationType='slide'
        visible={showEvent}
      >
        <ShowCalendar hideModal={() => setShowEvent(false)} calendar={event} />
      </Modal>

    </ScrollView>
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
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})

export default HomeScreen