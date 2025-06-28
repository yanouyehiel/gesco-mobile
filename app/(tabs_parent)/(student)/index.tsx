import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  BackHandler,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/utils/colors';
import PageHeading from '@/components/PageHeading';
import SingleStudentItem from '@/components/SingleStudentItem';
import { Skeleton } from 'moti/skeleton';
import { getHeaders, getMyChildren, getUser } from '@/services/MainService';
import { showToast } from '@/utils/fonctions';
import NoData from '@/components/NoData';
import { useRouter } from 'expo-router';

const ClasseScreen = () => {
  const [students, setStudents] = useState([]);
  const [headers, setHeaders] = useState({});
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    fetchUser();
    fetchHeaders()
      .then(() => setIsLoading(false))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchStudents().then(() => setLoading(false));
    }
  }, [isLoading]);

  useEffect(() => {
    const backAction = () => {
      router.push('/(tabs_parent)/(home)');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const fetchHeaders = async () => {
    const response = await getHeaders();
    setHeaders(response.headers);
  };

  const fetchUser = async () => {
    const res = await getUser();
    setUser(res);
  };

  const fetchStudents = async () => {
    try {
      if (user) {
        const res = await getMyChildren(user.id, headers);
        setStudents(res.students);
      }
    } catch (error) {
      showToast(error.message);
    }
  };

  const onRefresh = () => {
    setLoading(true);
    setRefreshing(true);
    fetchStudents().then(() => setLoading(false));
    setTimeout(() => setRefreshing(false), 2000);
  };

  const renderSkeleton = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <View style={styles.container} key={i}>
        <Skeleton show={true} colorMode="light">
          <Image style={styles.image} />
        </Skeleton>
        <View style={styles.subcontainer}>
          <Skeleton show={true} colorMode="light" height={15}>
            <Text style={{ width: 170 }}></Text>
          </Skeleton>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Skeleton show={true} colorMode="light" height={15}>
              <Text style={{ width: 90 }}></Text>
            </Skeleton>
            <Skeleton show={true} colorMode="light" height={15}>
              <Text style={{ width: 70 }}></Text>
            </Skeleton>
          </View>
          <Skeleton show={true} colorMode="light" height={20}>
            <Text style={{ width: 50 }}></Text>
          </Skeleton>
        </View>
      </View>
    ));

  return (
    <FlatList
      data={students}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <SingleStudentItem
          student={item}
          headers={headers}
          user={user}
        />
      )}
      ListHeaderComponent={<PageHeading title="Tous mes enfants" />}
      ListEmptyComponent={loading ? renderSkeleton : <NoData />}
      contentContainerStyle={{ padding: 20, paddingTop: 40, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.BLEU, colors.VERT, colors.BLEU_CLAIR]}
          progressBackgroundColor={colors.BLANC}
        />
      }
    />

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.BLANC,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 10,
  },
  subcontainer: {
    gap: 8,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 15,
  },
});

export default ClasseScreen;