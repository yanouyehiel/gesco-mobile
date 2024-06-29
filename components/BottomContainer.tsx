import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const BottomContainer = () => {
  return (
    <View style={styles.bottomContainer}>
        <Text 
            style={{fontFamily: 'Regular', fontSize: 18, textAlign: 'center'}}
        >En continuant, vous accepter nos</Text>
        <Text style={{fontFamily: 'SemiBold', fontSize: 20, textDecorationLine: 'underline'}}>Conditions d'utilisation</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    right: 16,
    left: 16,
    alignItems: 'center'
  }
})

export default BottomContainer