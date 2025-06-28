import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/utils/colors'
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { register, storeData } from '@/services/MainService'
import { showToast } from '@/utils/fonctions'
import { useRouter } from 'expo-router'
import DropDownPicker from 'react-native-dropdown-picker';

const SignupScreen = () => {
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [tel, setTel] = useState("")
  const [ID, setID] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [items, setItems] = useState([
    {label: 'Enseignant', value: 2},
    {label: 'Parent', value: 3}
  ]);

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  async function handleSubmit() {
    setLoading(true)
    if (
      nom === "" ||
      prenom === "" ||
      email === "" ||
      tel === "" ||
      ID === "" ||
      password === "" ||
      selectedRole === null ||
      selectedRole === "" ||
      selectedRole < 0
    ) {
      setError(true)
      showToast("Veuillez remplir tous les champs.")
    } else {
      const data = {
        nom: nom,
        prenom: prenom,
        email: email,
        telephone: tel,
        matricule: ID,
        password: password,
        role_id: selectedRole
      }
      
      try {
        await register(data).then((res) => {
          showToast(res.message)
          storeData('tokenGesco', res).then()
          setTimeout(() => {
            setNom("")
            setPrenom("")
            setEmail("")
            setTel("")
            setPassword("")
            setID("")
            router.push({
              pathname: '/onboarding',
              params: { user: res.user }
            })
          }, 2500)
        }, (err) => {
          setError(true)
          showToast(err.response.data.message)
        })
      } catch (error: any) {
        console.log(error)
        setError(true)
        showToast(error.response?.data.message);
      }
    }
    setLoading(false)
  }

  return (
    <FlatList 
      style={styles.container} 
      data={[]}
      renderItem={null as any}
      ListHeaderComponent={
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
                onChangeText={(text) => setNom(text)}
                value={nom}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Prénom' 
                placeholderTextColor={'gray'} 
                style={[error ? styles.error : styles.input]}
                onChangeText={(text) => setPrenom(text)}
                value={prenom}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Email' 
                placeholderTextColor={'gray'}
                style={[error ? styles.error : styles.input]}
                onChangeText={(text) => setEmail(text)}
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
                style={{fontSize: 18, fontFamily: 'Regular', width: '90%'}}
                value={password}
              />
              <MaterialCommunityIcons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={18}
                onPress={toggleShowPassword} 
                style={{width: '10%'}}
              /> 
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Téléphone' 
                placeholderTextColor={'gray'}
                style={[error ? styles.error : styles.input]}
                onChangeText={setTel}
                value={tel}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <TextInput 
                placeholder='Identifiant de votre école' 
                placeholderTextColor={'gray'}
                style={[error ? styles.error : styles.input]}
                onChangeText={setID}
                value={ID}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <DropDownPicker
                open={open}
                value={selectedRole}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedRole}
                setItems={setItems}
                placeholder="Sélectionner votre rôle"
                style={styles.select}
              />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}>
              <TouchableOpacity
                style={styles.btn}
                onPress={handleSubmit}>
                {!loading ?
                  <Text style={{fontFamily: 'Regular', color: colors.BLANC, fontSize: 23}}>S'inscrire</Text>
                  : <ActivityIndicator color={colors.BLANC} size='large' />
                }
              </TouchableOpacity>
            </Animated.View>
            <View style={{marginBottom: 40}}>
              <Text 
                style={{fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
              >Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={() => router.push('/connexion')}>
                <Text  
                  style={{color: colors.BLEU, fontFamily: 'Regular', fontSize: 20, textAlign: 'center'}}
                >Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <BottomContainer /> */}
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20, 
    backgroundColor: colors.BLANC, 
    marginTop: 50
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
  },
  select: {
    height: 50,
    width: "100%",
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.BLANC,
    borderColor: colors.BLEU,
    borderWidth: 1,
    paddingHorizontal: 10
  }
})

export default SignupScreen