import { View, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/utils/colors';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router'; // <-- Utilisation de useRouter
import { getHeaders, getUser } from '@/services/MainService';

const SplashScreenView = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const headersData = await getHeaders();
        const userData = await getUser();
        setUser(userData);

        setTimeout(() => {
          if (headersData !== "Pas de donnée stockée") {
            if (userData?.role_id === 2) {
              console.log("Nous sommes dans le Teacher");
              router.push("/(tabs_teacher)/(teacher)");
            } else if (userData?.role_id === 3) {
              console.log("Nous sommes dans le Parent");
              router.push("/(tabs_parent)/(home)");
            } else {
              console.log("Rôle inconnu, redirection vers connexion");
              router.push('/connexion');
            }
          } else {
            console.log("Pas de donnée stockée, redirection vers connexion");
            router.push("/connexion");
          }
        }, 3000);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        router.push("/connexion");
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(200).duration(1000).springify()}>
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
    backgroundColor: colors.BLEU,
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
});

export default SplashScreenView;