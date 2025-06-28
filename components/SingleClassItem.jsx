import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '@/utils/colors';
import { useRouter } from 'expo-router';

const SingleClassItem = ({ classe, headers, user, ecole }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        router.push({
          pathname: '/(tabs_teacher)/(classe)/(classe-detail)/classe',
          params: {
            classe: JSON.stringify(classe),
            user: JSON.stringify(user),
            headers: JSON.stringify(headers),
            ecole: JSON.stringify(ecole),
          },
        });
      }}
    >
      <Image
        source={require('@/assets/images/classe.png')}
        style={styles.image}
      />
      <View style={styles.subcontainer}>
        <Text style={{ fontFamily: 'Bold', fontSize: 20, color: colors.GRAY }}>
          {classe.nom}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={{ fontSize: 18 }}>Titulaire :</Text>
          <Text style={{ fontSize: 20, fontFamily: 'Bold' }}>
            {classe.nom_teacher} {classe.prenom_teacher}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text style={{ fontSize: 20, fontFamily: 'Bold' }}>
            {classe.effectif} élèves
          </Text>
          <Text
            style={{
              color: colors.BLANC,
              backgroundColor: colors.BLEU,
              fontSize: 15,
              borderRadius: 5,
              padding: 5,
              fontFamily: 'Bold',
            }}
          >
            {ecole.nom}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.BLANC,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    gap: 10,
  },
  subcontainer: {
    justifyContent: 'center',
    gap: 8,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 15,
  },
});

export default SingleClassItem;
