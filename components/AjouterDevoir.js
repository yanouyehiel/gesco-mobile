import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Heading from '@/components/Heading'
import { colors } from '@/utils/colors'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'

const AjouterDevoir = ({user, headers, classe, close}) => {
    const [selectMatiere, setSelectMatiere] = useState('');
    const [selectLivre, setSelectLivre] = useState('');
    const [matieres, setMatieres] = useState([])
    const [livres, setLivres] = useState([])
    const ecole = user.ecole_id
    const [loading, setLoading] = useState(true)
    const [numPage, setNumPage] = useState("")
    const [numExo, setNumExo] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        getMatieres().then(() => setLoading(false))
        getLivres().then(() => setLoading(false))
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

    async function getLivres() {
        try {
            const res = await axios.get('https://test.comtheplug.com/api/get-livres/' + ecole, {
                headers: headers
            })
            setLivres(res.data)
        } catch (error) {
            showToast(error.message)
        }
    }
    
    async function handleSubmit() {
        const data = {
            livre_id: parseInt(selectLivre),
            matiere_id: parseInt(selectMatiere),
            ecole_id: ecole,
            classe_id: classe.id,
            num_exo: parseInt(numExo),
            num_page: parseInt(numPage)
        }

        try {
            if (numExo !== "" && numPage !== "") {
                const res = await axios.post('https://test.comtheplug.com/api/add-devoir', data, {
                    headers: headers
                })
                //showToast(res.data.message)
                close()
            } else {
                setError(true)
            }
        } catch (error) {
            showToast(error.message)
        }
    }

    return (
        <View>
            <Text style={styles.titleHeader}>Enregistrer un devoir</Text>

            <View style={{margin: 10}}>
                <View style={{marginTop: 20, paddingBottom: 20}}>
                    <Heading text={"Remplissez le formulaire"} />
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner la matière</Text>
                        <Picker
                            selectedValue={selectMatiere}
                            onValueChange={(itemValue) => setSelectMatiere(itemValue)}
                            style={styles.textArea}
                            itemStyle={{color: colors.BLEU}}
                        >
                            {matieres.map((matiere, i) => (
                            <Picker.Item label={matiere.intitule} value={matiere.id} key={i} />
                            ))}
                        </Picker>
                    </View>
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner le livre</Text>
                        <Picker
                            selectedValue={selectLivre}
                            onValueChange={(itemValue) => setSelectLivre(itemValue)}
                            style={styles.textArea}
                            itemStyle={{color: colors.BLEU}}
                        >
                            {livres.map((livre, i) => (
                            <Picker.Item label={livre.intitule} value={livre.id} key={i} />
                            ))}
                        </Picker>
                    </View>
                    <TextInput
                        placeholder='Entrer le numéro de page'
                        style={[error ? styles.error : styles.textArea]}
                        numberOfLines={5} multiline={false}
                        onChangeText={(text) => setNumPage(text)}
                    />
                    {error && <Text style={{color: colors.ROUGE, fontSize: 15}}>Veuillez entrer le numéro de page</Text>}

                    <TextInput
                        placeholder="Entrer le numéro de l'exercice"
                        style={[error ? styles.error : styles.textArea]}
                        numberOfLines={5} multiline={false}
                        onChangeText={(text) => setNumExo(text)}
                    />
                    {error && <Text style={{color: colors.ROUGE, fontSize: 15}}>Veuillez entrer le numéro de l'exercice</Text>}

                    <TouchableOpacity onPress={handleSubmit}>
                        {loading ? <ActivityIndicator color={colors.BLANC} /> :
                            <Text style={styles.btnSave}>Enregistrer</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
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
        textAlign: 'center',
        color: colors.NOIR
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
    error: {
        borderWidth: 1,
        borderRadius: 15,
        textAlignVertical: 'top',
        padding: 10,
        fontSize: 16,
        borderColor: colors.ROUGE,
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

export default AjouterDevoir