import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const Button = (props) => {
  return (
    <TouchableOpacity
        onPress={props.onPress}
        style={{ ...styles.btn, ...props.style }}
    >
        <Text style={{
            fontFamily: "SemiBold",
            color: colors.BLANC,
            fontSize: 22
        }}>{props.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.BLEU,
        height: 50
    }
})

export default Button