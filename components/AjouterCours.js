import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Heading from '@/components/Heading'
import { colors } from '@/utils/colors'
import { Picker } from '@react-native-picker/picker'

import { addCours, getAllMatieres } from '@/services/MainService'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'

const AjouterCours = ({hideModal, user, headers, classe}) => {
    const [selectedValue, setSelectedValue] = useState('');
    const [matieres, setMatieres] = useState([])
    const ecole = user.ecole_id
    const [loading, setLoading] = useState(true)
    const [titre, setTitre] = useState("")
    const [desc, setDesc] = useState("")

    useEffect(() => {
        getMatieres().then(() => setLoading(false))
    }, [])

    async function getMatieres() {
        try {
            const res = await axios.get('https://test.comtheplug.com/api/get-matieres/' + ecole, {
                headers: headers
            })
            setMatieres(res.data)
        } catch (error) {
            showToast(error.message)
        }
    }

    async function handleSubmit() {
        const data = {
            titre: titre, 
            description: desc, 
            matiere_id: selectedValue, 
            teacher_id: user.id, 
            ecole_id: ecole, 
            classe_id: classe.id
        }
        
        try {
            const res = await axios.post('https://test.comtheplug.com/api/add-cours', data, {
                headers: headers
            })
            //showToast(res.message)
            /*setTimeout(() => {
                hideModal()
            }, 3000)*/
            hideModal()
        } catch (error) {
            showToast(error.message)
        }
    }

    return (
        <View style={{flex: 1}}>
            <KeyboardAvoidingView>
                <TouchableOpacity style={styles.header} onPress={() => hideModal()}>
                    <Ionicons name='arrow-back-outline' size={30} color="black" />
                    <Text style={styles.titleHeader}>Enregistrer un cours</Text>
                </TouchableOpacity>
            

                <View style={{margin: 10}}>
                    <View style={{marginTop: 20, paddingBottom: 20}}>
                        <Heading text={"Remplissez le formulaire"} />
                        <TextInput 
                            placeholder='Entrer le titre du cours' 
                            style={styles.textArea} 
                            numberOfLines={1} multiline={false} 
                            onChangeText={(text) => setTitre(text)}
                        />
                        <TextInput 
                            placeholder='Entrer le résumé du cours' 
                            style={styles.textArea} 
                            numberOfLines={5} multiline={false} 
                            onChangeText={(text) => setDesc(text)}
                        />
                        <View>
                            <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner la matière</Text>
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                                style={styles.textArea} 
                                itemStyle={{color: colors.BLEU}}
                            >
                                {matieres.map((matiere, i) => (
                                <Picker.Item label={matiere.intitule} value={matiere.id} key={i} />
                                ))}
                            </Picker>
                        </View>

                        <TouchableOpacity onPress={handleSubmit}>
                            {loading ? <ActivityIndicator color={colors.BLANC} /> :
                                <Text style={styles.btnSave}>Enregistrer</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    titleHeader: {
        fontSize: 25,
        fontFamily: 'Bold',
        textAlign: 'center'
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 15,
        textAlignVertical: 'top',
        padding: 10,
        fontSize: 16,
        borderColor: colors.BLEU,
        marginBottom: 15
    },
    btnSave: {
        textAlign: 'center',
        fontFamily: 'Regular',
        fontSize: 20,
        backgroundColor: colors.BLEU,
        color: colors.BLANC,
        padding: 13,
        borderRadius: 99,
        elevation: 2,
        marginTop: 10
    }
})

export default AjouterCours