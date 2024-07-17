import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { colors } from '@/utils/colors'
import { AntDesign, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getHeaders, removeStorge, getUser, getTokenId } from '@/services/MainService';
import { showToast } from '@/utils/fonctions';
import axios from 'axios';

const ProfileTeacher = () => {
    const navigation = useNavigation()
    const [headers, setHeaders] = useState()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const tokenId = getTokenId()

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
              const { headers } = await getHeaders();
              setHeaders(headers);
            } catch (error) {
              console.error(error);
            }
        };
        
        fetchHeaders()
        fetchUser(() => console.log(user))
    }, [])

    const fetchUser = async () => {
        await getUser().then(res => {
          setUser(res);
        });
    };

    const deconnexion = async () => {
        setLoading(true)
        const data = {
            token_id: tokenId
        }
        try {
            const res = await axios.post("https://test.comtheplug.com/api/auth/logout", data, {
                headers: headers
            })
            showToast(res.data.message)
            setTimeout(() => {
                removeStorge('tokenGesco').then(() => console.log('Tokens supprimes'))
                setLoading(false)
                navigation.navigate("connexion")
            }, 2000)
        } catch (error) {
            showToast(error.message)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}></View>
            <View style={styles.profil}>
                <View style={{marginTop: -80}}>
                    <View style={styles.containerImage}>
                        <Image source={require("@/assets/images/user.jpeg")} style={styles.profilImage} />
                    </View>
                </View>
                <View style={styles.infos}>
                    <Text style={styles.nom}>{user?.nom +' '+ user?.prenom}</Text>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Text style={styles.email}>{user?.email}</Text>
                        <Text style={styles.tel}>{user?.telephone}</Text>
                    </View>
                </View>
            </View>
            <View style={{borderWidth: 0.4, borderColor: colors.BLEU, marginTop: 20, marginBottom: 20}}></View>
            <View style={styles.sectionBody}>
                <View style={styles.rowWrapper}>
                    <TouchableOpacity
                        onPress={() => {

                        }}>
                        <View style={styles.row}>
                            <AntDesign name="edit" size={24} color="black" />
                            <Text style={styles.rowLabel}>Modifier le profil</Text>

                            <View style={styles.rowSpacer} />

                            <Feather 
                                name='chevron-right'
                                color='#ababab'
                                size={22}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                    <TouchableOpacity
                        onPress={() => {

                        }}>
                        <View style={styles.row}>
                            <MaterialIcons name="support-agent" size={24} color="black" />
                            <Text style={styles.rowLabel}>Aide et support</Text>

                            <View style={styles.rowSpacer} />

                            <Feather 
                                name='chevron-right'
                                color='#ababab'
                                size={22}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("settings")}>
                        <View style={styles.row}>
                            <Feather name="settings" size={24} color="black" />
                            <Text style={styles.rowLabel}>Paramètres</Text>

                            <View style={styles.rowSpacer} />

                            <Feather 
                                name='chevron-right'
                                color='#ababab'
                                size={22}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowWrapper}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("settings")}>
                        <View style={styles.row}>
                            <FontAwesome5 name="donate" size={24} color="black" />
                            <Text style={styles.rowLabel}>Faire un don</Text>

                            <View style={styles.rowSpacer} />

                            <Feather 
                                name='chevron-right'
                                color='#ababab'
                                size={22}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={deconnexion}
                disabled={loading}
            >
                {loading ? 
                    <View style={styles.btnDeconnect}>
                        <ActivityIndicator color={colors.BLANC} size='large' />
                    </View> :
                    <Text style={styles.btnDeconnect}>Déconnexion</Text>
                }
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLANC,
  },
  header: {
    height: 150,
    backgroundColor: colors.BLEU
  },
  profil: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerImage: {
    height: 135,
    width: 135,
    borderColor: colors.BLEU_CLAIR,
    borderWidth: 2,
    borderRadius: 99,
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  profilImage: {
    borderRadius: 99,
    height: 130,
    width: 130
  },
  infos: {
    marginTop: 10
  },
  nom: {
    fontSize: 30,
    fontFamily: 'Bold',
    textAlign: 'center'
  },
  email: {
    backgroundColor: colors.BLEU_CLAIR,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    color: colors.NOIR,
    textAlign: 'center'
  },
  tel: {
    backgroundColor: colors.VERT_CLAIR,
    padding: 10,
    borderRadius: 15,
    marginTop: 10,
    color: colors.NOIR,
    textAlign: 'center'
  },
  sectionBody: {

  },
  rowWrapper: {
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: colors.BLANC,
    marginBottom: 10
  },
  row: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 24
  },
  rowLabel: {
    marginLeft: 10,
    fontSize: 16
  },
  rowSpacer: {
    flex: 1
  },
  rowValue: {
    fontSize: 17,
    color: '#616161',
    marginRight: 4
  },
  btnDeconnect: {
    textAlign: 'center',
    fontFamily: 'Regular',
    fontSize: 20,
    backgroundColor: colors.BLEU_CLAIR,
    //borderColor: colors.ROUGE,
    //borderWidth: 1,
    color: colors.BLANC,
    padding: 13,
    borderRadius: 99,
    elevation: 2,
    margin: 20,
}
});

export default ProfileTeacher;