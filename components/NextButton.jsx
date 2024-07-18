import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { colors } from '@/utils/colors'
import { AntDesign } from '@expo/vector-icons';

const NextButton = ({ percentage, scrollTo }) => {
    const size = 128
    const strokeWidth = 2
    const center = size / 2
    const radius = size / 2 - strokeWidth / 2
    const circonference = 2 * Math.PI * radius

    const progressAnimation = useRef(new Animated.Value(0)).current
    const progressRef = useRef(null)

    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: true
        }).start()
    }

    useEffect(() => {
        animation(percentage)
    }, [percentage])

    useEffect(() => {
        progressAnimation.addListener(
            (value) => {
                const strokeDashoffset = circonference - (circonference * value.value) / 100

                if (progressRef?.current) {
                    progressRef.current.setNativeProps({
                        strokeDashoffset
                    })
                }
            },
            [percentage]
        )

        return () => {
            progressAnimation.removeAllListeners()
        }
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={scrollTo}>
                <AntDesign name="arrowright" size={32} color={colors.BLANC} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20
    },
    button: {
        position: 'absolute',
        backgroundColor: colors.BLEU,
        borderRadius: 100,
        padding: 20
    }
})

export default NextButton