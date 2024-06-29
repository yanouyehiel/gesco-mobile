import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Heading = (props) => {
  return (
    <View style={{...styles.style, ...props.style}}>
      <Text style={{fontSize: 22, fontFamily: 'SemiBold'}}>{props.text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  style: {
    marginBottom: 10
  }
})

export default Heading