import { Toast } from 'react-native-alert-notification'
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, ToastAndroid, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import CalendarPicker from 'react-native-calendar-picker'
import Heading from '@/components/Heading'
import { colors } from '@/utils/colors'
import { Picker } from '@react-native-picker/picker'
import { addAbsence, getStudentsOfClasse } from '@/services/MainService'
import axios from 'axios'
import { showToast } from '@/utils/fonctions'

const AjouterAbsence = ({hideModal, user, headers, classe}) => {
    const [timeListDebut, setTimeListDebut] = useState()
    const [timeListFin, setTimeListFin] = useState()
    const [selectedTimeDebut, setSelectedTimeDebut] = useState("")
    const [selectedTimeFin, setSelectedTimeFin] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState()
    const [error, setError] = useState(false)

    const getTime = () => {
        const timeList1 = []
        const timeList2 = []
        for (let i = 7; i <= 18; i++) {
            timeList1.push({
                time: i + ':00'
            })
        }
        for (let i = 7; i <= 18; i++) {
            timeList2.push({
                time: i + ':00'
            })
        }
        setTimeListDebut(timeList1)
        setTimeListFin(timeList2)
    }

    useEffect(() => {
        getTime()
        getStudents().then(() => setLoading(false))
    }, [])

    async function getStudents() {
        const res = await axios.get(`https://test.comtheplug.com/api/my-students/classe_id=${parseInt(classe.id)}&ecole_id=${parseInt(user.ecole_id)}`, {
            headers: headers
        })
        setStudents(res.data)
    }

    async function handleSubmit() {
        setLoading(true)
        if (selectedDate === "" || selectedStudent === "" || selectedTimeDebut === "" || selectedTimeFin === "") {
            setError(true)
        } else {
            const data = {
                student_id: selectedStudent,
                date: selectedDate,
                periode: selectedTimeDebut + ' - ' + selectedTimeFin,
                ecole_id: user.ecole_id,
                classe_id: classe.id
            }
            
            await addAbsence(data, headers).then((res) => {
                showToast(res.message)
            })
        }
        setLoading(false)
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView>
                <TouchableOpacity style={styles.header} onPress={() => hideModal()}>
                    <Ionicons name='arrow-back-outline' size={30} color="black" />
                    <Text style={styles.titleHeader}>Enregistrer une absence</Text>
                </TouchableOpacity>

                <View style={{margin: 15}}>
                    <Heading text={'Selectionnner une date'} />
                    <View style={styles.calendarContainer}>
                        <CalendarPicker 
                            onDateChange={setSelectedDate} 
                            width={340}
                            maxDate={Date.now()}
                            todayBackgroundColor={colors.BLANC}
                            todayTextStyle={colors.NOIR}
                            selectedDayColor={colors.VERT}
                            selectedDayStyle={colors.BLANC}
                            selectedDayTextColor={colors.BLANC}
                            selectedBackgroundColor={colors.VERT}
                        />
                    </View>
                    {error && <Text style={styles.errorText}>Veuillez sélectionner une date</Text>}

                    <View style={{marginTop: 20}}>
                        <Heading text={"Selectionner une tranche horaire"} />
                        <FlatList 
                            data={timeListDebut}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item, index}) => (
                                <TouchableOpacity 
                                    key={index} style={{marginRight: 10}}
                                    onPress={() => setSelectedTimeDebut(item.time)}
                                >
                                    <Text style={[
                                        selectedTimeDebut === item.time
                                            ? styles.selectedTimeDebut
                                            : styles.unselectedTime,
                                        ]}>{item.time}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        {error && <Text style={[styles.errorText, {marginBottom: 15}]}>Veuillez sélectionner un horaire de début</Text>}
                        <FlatList 
                            data={timeListFin}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item, index}) => (
                                <TouchableOpacity 
                                    key={index} style={{marginRight: 10}}
                                    onPress={() => setSelectedTimeFin(item.time)}
                                >
                                    <Text style={[
                                        selectedTimeFin === item.time
                                            ? styles.selectedTimeFin
                                            : styles.unselectedTime,
                                        ]}>{item.time}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        {error && <Text style={styles.errorText}>Veuillez sélectionner un horaire de fin</Text>}
                    </View>

                    <View style={{marginTop: 20}}>
                        <Text style={{fontFamily: 'SemiBold', fontSize: 20}}>Sélectionner un élève</Text>
                        <Picker
                            selectedValue={selectedStudent}
                            onValueChange={(itemValue) => setSelectedStudent(itemValue)}
                            style={styles.textArea} 
                            itemStyle={{color: colors.BLEU}}
                        >
                            <Picker.Item label={"Sélectionner ici..."} value={""} />
                            {students.map((student, i) => (
                            <Picker.Item label={student.nom + ' ' + student.prenom} value={student.id} key={i} />
                            ))}
                        </Picker>
                        {error && <Text style={styles.errorText}>Veuillez sélectionner un élève</Text>}
                    </View>

                    <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.btnSave}>
                        {loading ? <ActivityIndicator color={colors.BLANC} size={30} /> :
                            <Text style={{textAlign: 'center', color: colors.BLANC, fontSize: 18}}>Enregistrer</Text>
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 15,
        paddingLeft: 15
    },
    titleHeader: {
        fontSize: 25,
        fontFamily: 'Bold',
        textAlign: 'center'
    },
    calendarContainer: {
        backgroundColor: colors.BLEU_CLAIR,
        padding: 20,
        borderRadius: 15
    },
    selectedTimeDebut: {
        padding: 8,
        borderWidth: 1,
        borderColor: colors.BLEU,
        borderRadius: 99,
        paddingHorizontal: 18,
        backgroundColor: colors.BLEU,
        color: colors.BLANC
    },
    selectedTimeFin: {
        padding: 8,
        borderWidth: 1,
        borderColor: colors.VERT,
        borderRadius: 99,
        paddingHorizontal: 18,
        backgroundColor: colors.VERT,
        color: colors.BLANC
    },
    unselectedTime: {
        padding: 8,
        borderWidth: 1,
        borderColor: colors.BLEU,
        borderRadius: 99,
        paddingHorizontal: 18,
        color: colors.BLEU
    },
    textArea: {
        borderWidth: 1,
        borderColor: colors.BLEU
    },
    noteTextArea: {
        borderWidth: 1,
        borderRadius: 15,
        textAlignVertical: 'top',
        padding: 20,
        fontSize: 16,
        borderColor: colors.BLEU
    },
    btnSave: {
        textAlign: 'center',
        fontFamily: 'Regular',
        backgroundColor: colors.BLEU,
        color: colors.BLANC,
        padding: 13,
        borderRadius: 99,
        elevation: 2,
        marginTop: 30
    },
    errorText: {
        color: colors.ROUGE, 
        fontSize: 15,
    },
})

export default AjouterAbsence