import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/utils/colors'
import { useNavigation } from 'expo-router'

const SingleClassItem = ({classe, headers, user, ecole}) => {
    const navigation = useNavigation()

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={() => navigation.navigate('(classe-detail)', {
                classe: classe, user: user, headers: headers, ecole: ecole
            })}
        >
            <Image 
                source={require('@/assets/images/classe.png')} 
                style={styles.image}
            />
            <View style={styles.subcontainer}>
                <Text style={{fontFamily: 'Bold', fontSize: 20, color: colors.GRAY}}>{classe.nom}</Text>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                    <Text style={{fontSize: 18}}>Titulaire :</Text>
                    <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                        <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{classe.nom_teacher}</Text>
                        <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{classe.prenom_teacher}</Text>
                    </View>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                    <Text style={{fontSize: 20, fontFamily: 'Bold'}}>{classe.effectif} élèves</Text>
                    <Text style={{color: colors.BLANC, backgroundColor: colors.BLEU, fontSize: 15, borderRadius: 5, padding: 5, fontFamily: 'Bold'}}>{ecole.nom}</Text>
                </View>
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

export default SingleClassItem
