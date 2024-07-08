import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Heading = (props) => {
  return (
    <View style={{...styles.style, ...props.style}}>
      <Text style={{fontSize: 22, fontFamily: 'SemiBold'}}>{props.text}</Text>
      <Text style={{fontSize: 22, fontFamily: 'SemiBold'}}>{props?.value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  style: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default Heading