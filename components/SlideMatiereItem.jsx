import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'


const SlideMatiereItem = ({item}) => {
  return (
    <View style={styles.sliderItem}>
        <Image 
            source={require('../assets/images/matiere.png')} 
            style={styles.sliderImage} 
        />
        <View style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 18, paddingLeft: 10, color: colors.BLEU, paddingTop: 10 }}>{item.intitule}</Text>
            <View style={styles.flex}>
                <Text>Code:</Text>
                <Text style={{ fontSize: 15, fontWeight: 800, paddingLeft: 10 }}>{item.code}</Text>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    sliderItem: {
        maxWidth: 260,
        height: 100,
        marginRight: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        flexDirection: 'row',
    },
    sliderImage: {
        width: 80,
        height: 50,
        borderRadius: 20,
        objectFit: 'contain',
        marginTop: 20
    },
    flex: {
        flexDirection: 'row',
        margin: 10
    }
})

export default SlideMatiereItem