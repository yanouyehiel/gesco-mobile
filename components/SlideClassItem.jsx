import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const SlideClassItem = ({ item }) => {
   
    return (
        <TouchableOpacity>
            <View style={styles.sliderItem}>
                <Image 
                    source={require('@/assets/images/classe.png')} 
                    style={styles.sliderImage} 
                />
                <View style={styles.sliderBottom}>
                    <Text style={{ fontSize: 20, color: colors.BLEU }}>{item.nom}</Text>
                    <Text style={{ fontSize: 15 }}>{item.effectif} élèves</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    sliderItem: {
        maxWidth: 250,
        height: 100,
        marginRight: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10
    },
    sliderImage: {
        width: 50,
        height: 50,
        //borderRadius: 20,
        objectFit: 'contain'
    },
    sliderBottom: {
        margin: 10,
        marginLeft: 20
    }
})

export default SlideClassItem