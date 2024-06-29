import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const OnboardingItem = ({ item }) => {
    const { width } = useWindowDimensions()

    return (
        <View style={[styles.container, {width}]}>
            <Image source={item.image}
                style={[styles.image, { width, resizeMode: 'contain'}]} 
            />

            <View style={{ flex: 0.3 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.BLANC
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
        height: 250
    },
    title: {
        fontWeight: '800',
        fontSize: 25,
        marginBottom: 10,
        color: colors.BLEU,
        textAlign: 'center'
    },
    description: {
        fontWeight: '300',
        color: colors.NOIR,
        textAlign: 'center',
        paddingHorizontal: 64
    }
})

export default OnboardingItem