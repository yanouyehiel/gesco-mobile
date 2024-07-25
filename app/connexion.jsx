import { View, Text,  TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { getHeaders, login, storeData } from '@/services/MainService'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { showToast } from '@/utils/fonctions'
import axios from 'axios'
import { API_URL, AUTH } from '@/utils/global'


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

  async function handleSubmit() {  
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
          await login(data).then((res) => {
            setEmail("")
            setPassword("")
            if (res.status_code === 401) {
              showToast(res.message)
            } else {
              if (res.user.role_id === 2) {
                storeData('tokenGesco', res).then(() => navigation.navigate("(tabs_teacher)"))
              } else if (res.user.role_id === 3) {
                storeData('tokenGesco', res).then(() => navigation.navigate("(tabs_parent)"))         
              }  else {
                showToast("Vous n'avez pas les accès.")
              } 
            }          
          }, (err) => {
            showToast(err.response?.data.message)
          })
        } catch (err) {
          showToast(err.response?.data.message);
        }
      } else {
        setError(true)
        showToast("L'email est incorrect")
      }
    }
    setLoading(false);
  }

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 


  return (
    <View style={styles.container}>
      <View>
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
                value={email}
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
                value={password}
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