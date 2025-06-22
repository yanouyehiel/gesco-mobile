import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import DropDownPicker from 'react-native-dropdown-picker'
import Heading from '@/components/Heading'
import { Ionicons } from '@expo/vector-icons'
import { showToast } from '@/utils/fonctions'
import { addNote, getStudents, getMatieresSchool, getSequences } from "@/services/MainService"

const AjouterNote = ({user, headers, classe, close}) => {
    const ecole = user.ecole_id
    const [loading, setLoading] = useState(true)
    const [selectMatiere, setSelectMatiere] = useState(null)
    const [selectStudent, setSelectStudent] = useState(null)
    const [selectSequence, setSelectSequence] = useState(null)
    const [error, setError] = useState(false)
    const [note, setNote] = useState('')
    const [appreciation, setAppreciation] = useState('')

    // Etats pour DropDownPicker
    const [openMatiere, setOpenMatiere] = useState(false)
    const [openSequence, setOpenSequence] = useState(false)
    const [openStudent, setOpenStudent] = useState(false)
    const [itemsMatieres, setItemsMatieres] = useState([])
    const [itemsSequences, setItemsSequences] = useState([])
    const [itemsStudents, setItemsStudents] = useState([])

    useEffect(() => {
        getMatieres()
        getStudentsClasse()
        getAllSequences()
    }, [classe.id])

    async function getAllSequences() {
        const res = await getSequences(ecole, headers)
        setItemsSequences(
            res.map(seq => ({
                label: seq.intitule,
                value: seq.id
            }))
        )
    }

    async function getMatieres() {
        try {
            const res = await getMatieresSchool(ecole, headers)
            setItemsMatieres(
                res.map(matiere => ({
                    label: matiere.intitule,
                    value: matiere.id
                }))
            )
        } catch (error) {
            showToast(error.message)
        }
    }

    async function getStudentsClasse() {
        try {
            const res = await getStudents(classe.id, ecole, headers)
            setItemsStudents(
                res.map(student => ({
                    label: student.nom + ' ' + student.prenom,
                    value: student.id
                }))
            )
        } catch (error) {
            showToast(error.message)
        }
        setLoading(false)
    }

    async function handleSubmit() {
        setLoading(true)
        if (!selectMatiere || !selectSequence || !selectStudent || note === "") {
            setError(true)
            showToast("Veuillez remplir tous les champs.")
        } else if (parseInt(note) > 20) {
            setError(true)
            showToast("Entrer une note inférieure ou égale à 20")
        } else {
            setError(false)
            const data = {
                classe_id: parseInt(classe.id),
                ecole_id: parseInt(ecole),
                matiere_id: parseInt(selectMatiere),
                note: parseInt(note),
                student_id: parseInt(selectStudent),
                sequence_id: parseInt(selectSequence),
                appreciation: appreciation
            }
            try {
                const res = await addNote(data, headers)
                showToast(res.message)
                setNote('')
                setAppreciation('')
                setSelectMatiere(null)
                setSelectStudent(null)
                setSelectSequence(null)
            } catch (error) {
                showToast(error.response?.message || error.message)
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

            <View style={{margin: 10, zIndex: 1000}}>
                <View style={{marginTop: 20, paddingBottom: 20}}>
                    <Heading text={"Remplissez le formulaire"} />
                    
                    <Text style={{fontFamily: 'SemiBold', fontSize: 20, marginBottom: 5}}>Sélectionner la matière</Text>
                    <DropDownPicker
                        open={openMatiere}
                        value={selectMatiere}
                        items={itemsMatieres}
                        setOpen={setOpenMatiere}
                        setValue={setSelectMatiere}
                        setItems={setItemsMatieres}
                        placeholder="Sélectionner ici..."
                        style={[styles.textArea, error && !selectMatiere ? styles.error : null]}
                        dropDownContainerStyle={{borderColor: colors.BLEU}}
                        listItemLabelStyle={{color: colors.BLEU}}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                    {error && !selectMatiere && <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>}

                    <Text style={{fontFamily: 'SemiBold', fontSize: 20, marginBottom: 5, marginTop: 15}}>Sélectionner la séquence</Text>
                    <DropDownPicker
                        open={openSequence}
                        value={selectSequence}
                        items={itemsSequences}
                        setOpen={setOpenSequence}
                        setValue={setSelectSequence}
                        setItems={setItemsSequences}
                        placeholder="Sélectionner ici..."
                        style={[styles.textArea, error && !selectSequence ? styles.error : null]}
                        dropDownContainerStyle={{borderColor: colors.BLEU}}
                        listItemLabelStyle={{color: colors.BLEU}}
                        zIndex={2500}
                        zIndexInverse={900}
                    />
                    {error && !selectSequence && <Text style={styles.errorText}>Veuillez sélectionner une séquence</Text>}

                    <Text style={{fontFamily: 'SemiBold', fontSize: 20, marginBottom: 5, marginTop: 15}}>Sélectionner l'élève</Text>
                    <DropDownPicker
                        open={openStudent}
                        value={selectStudent}
                        items={itemsStudents}
                        setOpen={setOpenStudent}
                        setValue={setSelectStudent}
                        setItems={setItemsStudents}
                        placeholder="Sélectionner ici..."
                        style={[styles.textArea, error && !selectStudent ? styles.error : null]}
                        dropDownContainerStyle={{borderColor: colors.BLEU}}
                        listItemLabelStyle={{color: colors.BLEU}}
                        zIndex={2000}
                        zIndexInverse={800}
                    />
                    {error && !selectStudent && <Text style={styles.errorText}>Veuillez sélectionner un élève</Text>}

                    <TextInput
                        placeholder='Entrer la note'
                        style={[error && (note === "" || parseInt(note) > 20) ? styles.error : styles.textArea]}
                        numberOfLines={1}
                        multiline={false}
                        onChangeText={(text) => setNote(text)}
                        value={note}
                        keyboardType="numeric"
                    />
                    {error && note === "" && <Text style={styles.errorText}>Veuillez entrer une note</Text>}
                    {error && note !== "" && parseInt(note) > 20 && <Text style={styles.errorText}>Entrer une note ≤ 20</Text>}

                    <TextInput
                        placeholder='Entrer une appréciation'
                        style={styles.textArea}
                        numberOfLines={1}
                        multiline={false}
                        onChangeText={(text) => setAppreciation(text)}
                        value={appreciation}
                    />

                    <TouchableOpacity onPress={handleSubmit} style={styles.btn} disabled={loading}>
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