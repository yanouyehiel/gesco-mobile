import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Heading from '@/components/Heading'
import { colors } from '@/utils/colors'
import { Picker } from '@react-native-picker/picker'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'
import { Ionicons } from '@expo/vector-icons'

const AjouterDevoir = ({user, headers, classe, hideModal}) => {
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
        setLoading(true)
        if (numExo === "" || numPage === "" || selectLivre === "" || selectLivre === "") {
            setError(true)
        } else {
            const data = {
                livre_id: parseInt(selectLivre),
                matiere_id: parseInt(selectMatiere),
                ecole_id: ecole,
                classe_id: classe.id,
                num_exo: parseInt(numExo),
                num_page: parseInt(numPage)
            }
    
            try {
                const res = await axios.post('https://test.comtheplug.com/api/add-devoir', data, {
                    headers: headers
                })
                showToast(res.data.message)
                setNumExo("")
                setNumPage("")
            } catch (error) {
                showToast(error.message)
            }
        }
        setLoading(false)
    }

    return (
        <View style={{margin: 10}}>
            <TouchableOpacity style={styles.header} onPress={() => hideModal()}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>Enregistrer un devoir</Text>
            </TouchableOpacity>

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
                            <Picker.Item label={"Sélectionner ici..."} value={""} />
                            {matieres.map((matiere, i) => (
                            <Picker.Item label={matiere.intitule} value={matiere.id} key={i} />
                            ))}
                        </Picker>
                        {error && <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>}
                    </View>
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner le livre</Text>
                        <Picker
                            selectedValue={selectLivre}
                            onValueChange={(itemValue) => setSelectLivre(itemValue)}
                            style={styles.picker}
                            itemStyle={{color: colors.BLEU}}
                        >
                            <Picker.Item label={"Sélectionner ici..."} value={""} />
                            {livres.map((livre, i) => (
                            <Picker.Item label={livre.intitule} value={livre.id} key={i} />
                            ))}
                        </Picker>
                        {error && <Text style={styles.errorText}>Veuillez sélectionner un livre</Text>}
                    </View>
                    <TextInput
                        placeholder='Entrer le numéro de page'
                        style={[error ? styles.error : styles.textArea]}
                        numberOfLines={1} multiline={false}
                        onChangeText={(text) => setNumPage(text)}
                    />
                    {error && <Text style={styles.errorText}>Veuillez entrer le numéro de page</Text>}

                    <TextInput
                        placeholder="Entrer le numéro de l'exercice"
                        style={[error ? styles.error : styles.textArea]}
                        numberOfLines={1} multiline={false}
                        onChangeText={(text) => setNumExo(text)}
                    />
                    {error && <Text style={styles.errorText}>Veuillez entrer le numéro de l'exercice</Text>}

                    <TouchableOpacity onPress={handleSubmit} disabled={loading}>
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
        padding: 10
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
    },
    errorText: {
        color: colors.ROUGE, 
        fontSize: 15,
        marginTop: -15,
        marginBottom: 15
    },
    picker: {
        borderWidth: 1,
        borderColor: colors.BLEU,
        borderRadius: 5,
    }
})

export default AjouterDevoir