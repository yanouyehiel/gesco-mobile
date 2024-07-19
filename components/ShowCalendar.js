import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import { dateParser, dateParserTime } from '@/utils/fonctions'

const ShowCalendar = ({ hideModal, calendar }) => {
    return (
        <ScrollView>
            <TouchableOpacity style={styles.header} onPress={() => hideModal()}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>Détail du calendrier</Text>
            </TouchableOpacity>

            <Animated.View>
                <View style={{margin: 15}}>
                    <Text style={styles.title}>Titre :</Text>
                    <Text style={styles.text}>{calendar.titre}</Text>
                </View>
                <View style={{margin: 15}}>
                    <Text style={styles.title}>Date :</Text>
                    <Text style={styles.text}>{calendar.date}</Text>
                </View>
                <View style={{margin: 15}}>
                    <Text style={styles.title}>Année scolaire :</Text>
                    <Text style={styles.text}>{calendar.annee_scolaire}</Text>
                </View>
                <Text style={[{margin: 15}, styles.text]}>Enregistré le {dateParserTime(calendar.created_at)}</Text>
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

export default ShowCalendar