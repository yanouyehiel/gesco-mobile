import { View, Text, StyleSheet, FlatList, Image, BackHandler, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import PageHeading from '@/components/PageHeading'
import SingleClassItem from '@/components/SingleClassItem'
import { Skeleton } from 'moti/skeleton'
import { getAllClasses, getEcole, getHeaders, getUser } from '@/services/MainService'
import { showToast } from '@/utils/fonctions'
import { useRouter } from 'expo-router';

const ClasseScreen = () => {
  const [classes, setClasses] = useState<any[]>([])
  const [headers, setHeaders] = useState<any>({})
  const [user, setUser] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false);
  const [ecole, setEcole] = useState(null)
  
  useEffect(() => {
    setIsLoading(true);
    fetchUser()
    fetchHeaders()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
      })
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchClasses().then(() => setLoading(false))
    }
  }, [isLoading])

  useEffect(() => {
    const backAction = () => {
      router.back()
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const fetchHeaders = async () => {
    try {
      const response: any | string = await getHeaders()
      setHeaders(response.headers)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    await getUser().then(res => {
      setUser(res);
      setEcole(res.ecole)
    });
  };

  const fetchClasses = async () => {
    if (user) {
      try {
        const res = await getAllClasses(user.ecole_id, headers);
        setClasses(res);
      } catch (error: any) {
        showToast(error.message)
      }
    }
  };

  const onRefresh = React.useCallback(() => {
    setLoading(true)
    setRefreshing(true);
    fetchClasses().then(() => setLoading(false))
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView 
      style={{padding: 20, paddingTop: 40}}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
          progressBackgroundColor={colors.BLANC}
        />
      }
    >
      <PageHeading title={'Toutes les classes'} />

      {(classes.length > 0 && !loading) ?
        <FlatList 
          data={classes}
          renderItem={({item, index}) => (
            <SingleClassItem headers={headers} ecole={ecole} user={user} classe={item} key={index} />
          )}
          style={{marginTop: 20}}
          showsVerticalScrollIndicator={false}
        /> :
        [0, 1, 2, 3, 4].map((item, i) => (
          <View style={styles.container} key={i}>
            <Skeleton show={true} colorMode='light'>
              <Image style={styles.image} />
            </Skeleton>
            <View style={styles.subcontainer}>
              <Skeleton show={true} colorMode='light' height={20}>
                <Text style={[styles.text, {width: 50, marginBottom: 20}]}></Text>
              </Skeleton>
              <Skeleton show={true} colorMode='light' height={20}>
                <Text style={[styles.text, {width: 150, marginBottom: 20}]}></Text>
              </Skeleton>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Skeleton show={true} colorMode='light' height={15}>
                  <Text style={[styles.text, {width: 80}]}></Text>
                </Skeleton>
                <Skeleton show={true} colorMode='light' height={15}>
                  <Text style={[styles.text, {width: 120}]}></Text>
                </Skeleton>
              </View>
            </View>
          </View>
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: '50%',
    color: colors.GRAY
  },
  container: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.BLANC,
    borderRadius: 15,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  subcontainer: {
    display: 'flex',
    gap: 8,
    marginRight: 20
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 15
  },
  text: {
    height: 10
  }
})

export default ClasseScreen