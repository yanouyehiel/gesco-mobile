import { View, Text, StyleSheet, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import PageHeading from '@/components/PageHeading'
import SingleStudentItem from '@/components/SingleStudentItem'
import { Skeleton } from 'moti/skeleton'
import { getHeaders, getMyChildren, getUser } from '@/services/MainService'
import { showToast } from '@/utils/fonctions'
import NoData from '@/components/NoData'

const ClasseScreen = () => {
  const [students, setStudents] = useState<any[]>([])
  const [headers, setHeaders] = useState<any>({})
  const [user, setUser] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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
      fetchStudents().then(() => setLoading(false))
    }
  }, [isLoading])

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
    });
  };

  const fetchStudents = async () => {
    try {
      if (user) {
        const res = await getMyChildren(user.id, headers);
        setStudents(res.students);
      }
    } catch (error: any) {
      showToast(error.message)
    }
  };

  return (
    <View style={{padding: 20, paddingTop: 40}}>
      <PageHeading title={'Tous mes enfants'} />

      {(students.length > 0 && !loading) ?
        <FlatList 
          data={students}
          renderItem={({item, index}) => (
            <SingleStudentItem headers={headers} user={user} student={item} key={index} />
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
              <Skeleton show={true} colorMode='light'>
                <Text style={[styles.text, {width: 200, marginBottom: 20}]}></Text>
              </Skeleton>
              <View style={{flexDirection: 'row', gap: 20}}>
                <Skeleton show={true} colorMode='light'>
                  <Text style={[styles.text, {width: 80}]}></Text>
                </Skeleton>
                <Skeleton show={true} colorMode='light'>
                  <Text style={[styles.text, {width: 20}]}></Text>
                </Skeleton>
              </View>
              <Skeleton show={true} colorMode='light'>
                <Text style={[styles.text, {width: 50, marginBottom: 20}]}></Text>
              </Skeleton>
            </View>
          </View>
        ))
      }
      {(!loading && students.length === 0) &&
        <NoData />
      }
    </View>
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
    gap: 8
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