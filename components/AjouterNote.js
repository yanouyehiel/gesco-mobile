import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import { Picker } from '@react-native-picker/picker'
import Heading from '@/components/Heading'
import { Ionicons } from '@expo/vector-icons'
import { showToast } from '@/utils/fonctions'
import { addNote, getStudents, getMatieresSchool, getSequences } from "@/services/MainService";

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
    const [sequences, setSequences] = useState([])

    useEffect(() => {
        getMatieres().then()
        getStudentsClasse().then(() => setLoading(false))
        getAllSequences().then(() => setLoading(false))
    }, [classe])

    async function getAllSequences() {
        const res = await getSequences(ecole, headers)
        setSequences(res)
    }

    async function getMatieres() {
        try {
            const res = await getMatieresSchool(ecole, headers)
            setMatieres(res)
        } catch (error) {
            showToast(error.message)
        }
    }

    async function getStudentsClasse() {
        try {
            const res = await getStudents(classe.id, ecole, headers)
            setStudents(res)
        } catch (error) {
            showToast(error.message)
        }
    }

    async function handleSubmit() {
        setLoading(true)
        if (selectMatiere === "" || selectSequence === "" || selectStudent === "" || note === "") {
            setError(true)
            showToast("Veuillez remplir tous les champs.")
        } else if (parseInt(note) > 20) {
            setError(true)
            showToast("Entrer une note inférieure ou égale à 20")
        } else {
            const data = {
                classe_id: classe.id,
                ecole_id: ecole,
                matiere_id: parseInt(selectMatiere),
                note: parseInt(note),
                student_id: parseInt(selectStudent),
                sequence_id: parseInt(selectSequence)
            }
    
            try {
                const res = await addNote(data, headers)
                showToast(res.message)
            } catch (error) {
                showToast(error.response.message)
            }
        }
        setLoading(false)
    }

    return (
        <ScrollView style={{margin: 10}}>
            <TouchableOpacity style={styles.header} onPress={() => close()}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>Enregistrer une note</Text>
            </TouchableOpacity>

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
                            <Picker.Item label={"Sélectionner ici..."} value={""} />
                            {matieres.map((matiere, i) => (
                            <Picker.Item label={matiere.intitule} value={matiere.id} key={i} />
                            ))}
                        </Picker>
                        {error && <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>}
                    </View>
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner la séquence</Text>
                        <Picker
                            selectedValue={selectSequence}
                            onValueChange={(itemValue) => setSelectSequence(itemValue)}
                            style={[error ? styles.error : styles.textArea]}
                            itemStyle={{color: colors.BLEU}}
                        >
                            <Picker.Item label={"Sélectionner ici..."} value={""} />
                            {sequences.length > 0 && sequences.map((seq, i) => (
                                <Picker.Item key={i} label={seq.intitule} value={seq.id} />
                            ))}
                        </Picker>
                        {error && <Text style={styles.errorText}>Veuillez sélectionner une séquence</Text>}
                    </View>
                    <View>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner l'élève'</Text>
                        <Picker
                            selectedValue={selectStudent}
                            onValueChange={(itemValue) => setSelectStudent(itemValue)}
                            style={[error ? styles.error : styles.textArea]}
                            itemStyle={{color: colors.BLEU}}
                        >
                            <Picker.Item label={"Sélectionner ici..."} value={""} />
                            {students.map((student, i) => (
                            <Picker.Item label={student.nom+' '+student.prenom} value={student.id} key={i} />
                            ))}
                        </Picker>
                        {error && <Text style={styles.errorText}>Veuillez sélectionner un élève</Text>}
                    </View>
                    <TextInput
                        placeholder='Entrer la note'
                        style={[error ? styles.error : styles.textArea]}
                        numberOfLines={1} multiline={false}
                        onChangeText={(text) => setNote(text)}
                    />
                    {error && <Text style={{color: colors.ROUGE, fontSize: 15}}>Veuillez entrer une note</Text>}

                    <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
                        {loading ? <ActivityIndicator color={colors.BLANC} /> :
                            <Text style={{fontFamily: 'Regular', color: colors.BLANC, fontSize: 23}}>Enregistrer</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
    errorText: {
        color: colors.ROUGE, 
        fontSize: 15,
        marginTop: -15,
        marginBottom: 15
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

export default AjouterNote