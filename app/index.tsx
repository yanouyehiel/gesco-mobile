import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/utils/colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from "@react-navigation/native";
import { getHeaders, getUser } from '@/services/MainService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreenView = () => {
    const navigation = useNavigation();
    const user: any = getUser().then()

    useEffect(() => {
      const fetchHeaders = async () => {
        try {
          const headersData = await getHeaders();
          return headersData
        } catch (error) {
          console.error(error);
        }
      };
      AsyncStorage.removeItem('tokenGesco').then()
      fetchHeaders().then((res: any) => {
        if (res !== "Pas de donnée stockée") {
          setTimeout(() => {
            if (user._j.role_id === 2) {
              console.log("Nous sommes dans le Teacher")
              navigation.navigate("(tabs_teacher)")
            } else if (user._j.role_id === 3) {
              console.log("Nous sommes dans le Parent")
              navigation.navigate("(tabs_parent)")
            }
          }, 3000)
        } else {
          setTimeout(() => {
            console.log("Nous sommes dans le login")
            navigation.navigate('connexion');
          }, 3000)
        }
      });
    }, []);

    return (
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.delay(200).duration(1000).springify()}
        >
          <Image source={require("@/assets/images/logo_blanc.png")} style={styles.image} />
        </Animated.View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BLEU
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'cover'
  }
});

export default SplashScreenView;