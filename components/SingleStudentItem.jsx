import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { colors } from '@/utils/colors'
import { useRouter } from 'expo-router'

const SingleStudentItem = ({student, headers, user}) => {
    const router = useRouter()

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={() => router.push('/(tabs_parent)/(student)/(student-detail)/student', {
                student: student, user: user, headers: headers
            })}
        >
            <Image 
                source={require('@/assets/images/user.jpeg')} 
                style={styles.image}
            />
            <View style={styles.subcontainer}>
                <Text style={{fontFamily: 'Bold', fontSize: 20, color: colors.GRAY}}>{student.nom +' '+ student.prenom}</Text>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                    <Text style={{fontSize: 18, fontFamily: 'Bold'}}>{student.matricule}</Text>
                    <Text style={{fontSize: 18, fontFamily: 'Bold', color: colors.VERT}}>{student.nom_classe}</Text>
                </View>
                <Text style={{color: colors.BLANC, backgroundColor: colors.BLEU, fontSize: 15, borderRadius: 5, padding: 5, fontFamily: 'Bold', width: 80}}>{student.sexe}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: colors.BLANC,
        borderRadius: 15,
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    subcontainer: {
        display: 'flex',
        gap: 8
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 15
    }
})

export default SingleStudentItem