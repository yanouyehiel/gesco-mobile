import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import { dateParser, dateParserTime } from '@/utils/fonctions'

const ShowEvent = ({ hideModal, event }) => {
    //const scale = useRef(new Animated.Value(0)).current

    return (
        <ScrollView>
            <TouchableOpacity style={styles.header} onPress={() => hideModal()}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>{event.title}</Text>
            </TouchableOpacity>

            <Animated.View>
                <View style={{margin: 15}}>
                    <Text style={styles.title}>Titre :</Text>
                    <Text style={styles.text}>{event.title}</Text>
                </View>
                <View style={{margin: 15}}>
                    <Text style={styles.title}>Description :</Text>
                    <Text style={styles.text}>{event.description}</Text>
                </View>
                <View style={{margin: 15}}>
                <Text style={styles.title}>Date :</Text>
                    <Text style={styles.text}>Début : {dateParser(event.start)}</Text>
                    <Text style={styles.text}>Fin : {dateParser(event.end)}</Text>
                </View>
            </Animated.View>
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
        marginTop: 20,
        paddingLeft: 20
    },
    titleHeader: {
        fontSize: 25,
        fontFamily: 'Bold',
        textAlign: 'center'
    },
    title: {
        textAlign: 'left',
        fontSize: 20,
        textDecorationLine: 'underline',
        fontFamily: 'Regular'
    },
    text: {
        textAlign: 'left',
        fontSize: 18
    },
})

export default ShowEvent