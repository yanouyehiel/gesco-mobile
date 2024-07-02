import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { colors } from '@/utils/colors'
import { Picker } from '@react-native-picker/picker'

const AjouterNote = ({user, headers, classe, close}) => {
    const [matieres, setMatieres] = useState([])
    const [students, setStudents] = useState([])
    const ecole = user.ecole_id
    const [loading, setLoading] = useState(true)
    const [selectMatiere, setSelectMatiere] = useState('');
    const [selectStudent, setSelectStudent] = useState('');
    const [selectSequence, setSelectSequence] = useState('');
    const [error, setError] = useState(false)
    const [note, setNote] = useState('')

    useEffect(() => {
        getMatieres().then()
        getStudents().then(() => setLoading(false))
    }, [classe])

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

    async function getStudents() {
        try {
            const res = await axios.get(`https://test.comtheplug.com/api/students/classe_id=${classe.id}&ecole_id=${ecole}`, {
                headers: headers
            })
            setStudents(res.data)
        } catch (error) {
            showToast(error.message)
        }
    }

    async function handleSubmit() {
        const data = {
            classe_id: classe.id,
            ecole_id: ecole,
            matiere_id: parseInt(selectMatiere),
            note: parseInt(note),
            student_id: parseInt(selectStudent),
            sequence: parseInt(selectSequence)
        }

        try {
            if (selectMatiere !== "" && note !== "" && selectSequence !== "" && selectStudent !== "") {
                const res = await axios.post('https://test.comtheplug.com/api/add-note', data, {
                    headers: headers
                })
                console.log(res.data.message)
                close()
            } else {
                setError(true)
            }
        } catch (error) {
            showToast(error.response.message)
        }
    }

    return (
        <View>
            <Text style={styles.titleHeader}>Enregistrer une note</Text>

            <View style={{margin: 10}}>
                <View style={{marginTop: 20, paddingBottom: 20}}>
                    <Heading text={"Remplissez le formulaire"} />
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner la matière</Text>
                        <Picker
                            selectedValue={selectMatiere}
                            onValueChange={(itemValue) => setSelectMatiere(itemValue)}
                            style={[error ? styles.error : styles.textArea]}
                            itemStyle={{color: colors.BLEU}}
                        >
                            {matieres.map((matiere, i) => (
                            <Picker.Item label={matiere.intitule} value={matiere.id} key={i} />
                            ))}
                        </Picker>
                    </View>
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner la séquence</Text>
                        <Picker
                            selectedValue={selectSequence}
                            onValueChange={(itemValue) => setSelectSequence(itemValue)}
                            style={[error ? styles.error : styles.textArea]}
                            itemStyle={{color: colors.BLEU}}
                        >
                            <Picker.Item label="Séquence 1" value={1} />
                            <Picker.Item label="Séquence 1" value={2} />
                            <Picker.Item label="Séquence 1" value={3} />
                            <Picker.Item label="Séquence 1" value={4} />
                            <Picker.Item label="Séquence 1" value={5} />
                            <Picker.Item label="Séquence 1" value={6} />
                        </Picker>
                    </View>
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner l'élève'</Text>
                        <Picker
                            selectedValue={selectStudent}
                            onValueChange={(itemValue) => setSelectStudent(itemValue)}
                            style={[error ? styles.error : styles.textArea]}
                            itemStyle={{color: colors.BLEU}}
                        >
                            {students.map((student, i) => (
                            <Picker.Item label={student.nom+' '+student.prenom} value={student.id} key={i} />
                            ))}
                        </Picker>
                    </View>
                    <TextInput
                        placeholder='Entrer la note'
                        style={[error ? styles.error : styles.textArea]}
                        numberOfLines={5} multiline={false}
                        onChangeText={(text) => setNote(text)}
                    />
                    {error && <Text style={{color: colors.ROUGE, fontSize: 15}}>Veuillez remplir tous les champs</Text>}

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

export default AjouterNote