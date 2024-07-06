import { View, Text, Image, ToastAndroid, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { colors } from '@/utils/colors'
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp, FadeOut } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { login, storeData } from '@/services/MainService'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '@/utils/fonctions'


const LoginScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  function isEmailValid(email) {
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function handleSubmit() {  
    setError(false)
    if (email === '' || password === '') {
      setError(true)
      setLoading(false)
      showToast("Veuillez remplir tous les champs")
    } else {
      setError(false)
      if (isEmailValid(email)) {
        const data = {
          email: email,
          password: password
        }
        setLoading(true) 
        try {
          login(data).then((res) => {
            setLoading(false)
            if (res.status_code === 401) {
              showToast(res.message)
            } else {
              storeData('tokenGesco', res).then((res) => console.log(res))
              if (res.user.role_id === 2) {
                console.log("Nous sommes dans le Teacher")
                navigation.navigate("(tabs_teacher)")
              } else if (res.user.role_id === 3) {
                console.log("Nous sommes dans le Parent")
                navigation.navigate("(tabs_parent)")
              }  
            }          
          }, (err) => {
            showToast(err.response.data.message)
          })
        } catch (err) {
          setLoading(false);
          showToast(err.response?.data.message);
        }
      } else {
        setError(true)
        showToast("L'email est incorrect")
      }
    }
  }

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 


  return (
    <View style={styles.container}>
      <View>
        {/* <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Animated.Image
            entering={FadeInUp.delay(200).duration(1000).springify()}
            source={require('@/assets/images/logo_bleu_sans_bg.png')}
            style={{ width: 300, height: 170 }}
          />
        </View> */}

        <View>
          <View style={{marginBottom: 40}}>
            <Animated.Text 
              entering={FadeInLeft.duration(1000).springify()} 
              style={{color: 'gray', fontFamily: 'Regular', fontSize: 30, textAlign: 'center'}}
            >
              Connexion
            </Animated.Text>
          </View>

          {/* Formulaire */}
          <View>
            <Text style={{fontSize: 20, color: 'gray', fontFamily: 'Regular'}}>
              Veuillez entrer votre email et votre mot de passe pour vous connecter
            </Text>
            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
              style={{ height: 80 }}>
              <TextInput 
                placeholder='Email' 
                placeholderTextColor={'gray'} 
                onChangeText={setEmail}
                style={[error ? styles.containerError : styles.input]}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={error ? styles.containerError : styles.containerInput}>
              <TextInput 
                placeholder='Mot de passe' 
                placeholderTextColor={'gray'}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={{fontSize: 18, fontFamily: 'Regular'}}
              />
              <MaterialCommunityIcons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={18}
                style={styles.icon}
                onPress={toggleShowPassword} 
              /> 
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
              <TouchableOpacity
                style={styles.btn}
                onPress={handleSubmit}
                disabled={loading}
              >
                
                {!loading ?
                  <Text style={{fontFamily: 'Regular', color: colors.BLANC, fontSize: 23}}>
                    Se connecter
                  </Text>
                  : <ActivityIndicator color={colors.BLANC} size='large' />
                }
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={() => navigation.navigate('password-forgot')}>
              <Text 
                style={{color: colors.BLEU, fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
              >Mot de passe oublié ?</Text>
            </TouchableOpacity>
            <View>
              <Text style={{fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}>Vous n'avez pas de compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('register')}>
                <Text 
                  style={{color: colors.BLEU, fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
                >S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    marginTop: 10
  },
  containerError: {
    flexDirection: 'row',
    backgroundColor: '#ebedee',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginTop: 20,
    borderColor: 'red',
    borderWidth: 1,
    fontSize: 18,
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
  icon: {
      //marginTop: 10,
  },
  btn: {
    marginTop: 30,
    marginBottom: 30,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center'
  }
})

export default LoginScreen