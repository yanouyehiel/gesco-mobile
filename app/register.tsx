import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { colors } from '@/utils/colors'
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const SignupScreen = () => {
  const navigate = useNavigation()
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  return (
    <View style={styles.container}>
        {/* <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Animated.Image
            entering={FadeInUp.delay(200).duration(1000).springify()}
            source={require('../assets/images/logo_bleu_sans_bg.png')}
            style={{ width: 300, height: 170 }}
          />
        </View> */}

        <View>
          <View style={{marginBottom: 40}}>
            <Animated.Text 
              entering={FadeInLeft.duration(1000).springify()} 
              style={{color: 'gray', fontFamily: 'Regular', fontSize: 30, textAlign: 'center'}}
            >
              Inscription
            </Animated.Text>
          </View>

          {/* Formulaire */}
          <View>
            <Text style={{fontSize: 20, color: 'gray', fontFamily: 'Regular'}}>
              Veuillez entrer vos informations pour vous inscrire
            </Text>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Nom' 
                placeholderTextColor={'gray'}
                style={[error ? styles.error : styles.input]}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Prénom' 
                placeholderTextColor={'gray'} 
                style={[error ? styles.error : styles.input]}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Email' 
                placeholderTextColor={'gray'}
                style={[error ? styles.error : styles.input]}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={styles.containerInput}>
              <TextInput 
                placeholder='Mot de passe' 
                placeholderTextColor={'gray'}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={[error ? styles.error : {fontSize: 18, fontFamily: 'Regular'}]}
              />
              <MaterialCommunityIcons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={18}
                onPress={toggleShowPassword} 
              /> 
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Téléphone' 
                placeholderTextColor={'gray'}
                style={[error ? styles.error : styles.input]}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigate.navigate('onboarding')}>
                <Text style={{fontFamily: 'Regular', color: colors.BLANC, fontSize: 23}}>S'inscrire</Text>
              </TouchableOpacity>
            </Animated.View>
            <View style={{marginBottom: 40}}>
              <Text 
                style={{fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
              >Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={() => navigate.navigate('connexion')}>
                <Text  
                  style={{color: colors.BLEU, fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
                >Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <BottomContainer /> */}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    backgroundColor: colors.BLANC, 
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerInput: {
    flexDirection: 'row',
    backgroundColor: '#ebedee',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginTop: 20
  },
  input: {
    fontFamily: 'Regular',
    color: '#333',
    fontSize: 18,
    height: 50,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ebedee',
    borderRadius: 10
  },
  error: {
    fontFamily: 'Regular',
    color: '#333',
    fontSize: 18,
    height: 50,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ebedee',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1
  },
  btn: {
    height: 50,
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center'
  }
})

export default SignupScreen