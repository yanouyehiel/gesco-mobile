import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const NoData = () => {
  return (
    <View style={{marginTop: 15}}>
      <Text style={styles.textNoData}>Il n'y a aucune donnée retrouvée</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    textNoData: {
      color: colors.NOIR, 
      textAlign: 'center',
      fontFamily: 'SemiBold',
      fontSize: 25
    }
})

export default NoData