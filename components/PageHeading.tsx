import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const PageHeading = ({title}) => {
    const navigation = useNavigation()
    
    return (
        <View>
            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    titleHeader: {
        fontSize: 25,
        fontFamily: 'Bold'
    }
})

export default PageHeading