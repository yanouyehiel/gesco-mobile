import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp, FadeOut } from 'react-native-reanimated'
import { colors } from '@/utils/colors'
import { useNavigation } from '@react-navigation/native'

const PasswordForgot = () => {
  const navigate = useNavigation()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    navigate.navigate('otp-code')
  }
    
  return (
    <View style={styles.container}>
      <View>
        <View style={{marginBottom: 40}}>
          <Animated.Text 
            entering={FadeInLeft.duration(1000).springify()} 
            style={{color: 'gray', fontFamily: 'Regular', fontSize: 30, textAlign: 'center'}}
          >
            Mot de passe oublié
          </Animated.Text>
        </View>

        <View>
            <Text style={{fontSize: 20, color: 'gray', fontFamily: 'Regular'}}>
              Veuillez entrer votre adresse email, vous recevrez un code par mail.
            </Text>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Email' 
                placeholderTextColor={'gray'} 
                style={[error ? styles.containerError : styles.input]}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {!loading ?
                    <Text 
                      style={{fontFamily: 'Regular', color: colors.BLANC, fontSize: 20}}
                    >Envoyer le code</Text>
                    : <ActivityIndicator color={colors.BLANC} size='large' />
                  }
                </TouchableOpacity>
            </Animated.View>
            <View>
                <Text 
                  style={{fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
                >Vous vous souvenez de vos identifiants ?</Text>
                <TouchableOpacity onPress={() => navigate.navigate('connexion')}>
                    <Text 
                      style={{color: colors.BLEU, fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
                    >connectez-vous</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 30, 
    backgroundColor: colors.BLANC, 
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerError: {
    flexDirection: 'row',
    backgroundColor: '#ebedee',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    marginTop: 20,
    borderColor: 'red',
    borderWidth: 1
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
    fontSize: 22,
    height: 60,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ebedee',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1
  },
  btn: {
    marginTop: 30,
    marginBottom: 30,
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center'
  }
})

export default PasswordForgot