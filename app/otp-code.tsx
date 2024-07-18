import { View, Text, TouchableOpacity, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { colors } from '@/utils/colors'
import { useNavigation } from '@react-navigation/native'


const OTPCode = () => {
    const inputRefs = useRef([])
    const navigate = useNavigation()
    const [loading, setLoading] = useState(false)

    const handleChange = (text: string, index: number) => {
        if (text.length !== 0) {
            return inputRefs?.current[index + 1]?.focus()
        }

        return inputRefs?.current[index - 1]?.focus()
    }

    const handleBackSpace = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        const { nativeEvent } = event

        if (nativeEvent.key === 'Backspace') {
            handleChange('', index)
        }
    }

    function handleSubmit() {
        setLoading(true)
        navigate.navigate('phone-number-forgot')
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.BLANC, padding: 16 }}>

                <Text style={{color: '#333', fontSize: 25, fontFamily: 'SemiBold', textAlign: 'center', marginBottom: 20}}>Entrer le code de vérification</Text>
                <Text style={{fontSize: 20, fontFamily: 'Regular', textAlign: 'center'}}>Nous détectons automatiquement les SMS envoyés sur votre téléphone</Text>

                <View style={styles.containerOTPCode}>
                    {[...new Array(6)].map((item, i) => (
                        <TextInput
                            ref={ref => {
                                if (ref && !inputRefs.current.includes(ref)) {
                                    inputRefs.current = [...inputRefs.current, ref]
                                }
                            }} 
                            style={styles.input}
                            key={i}
                            maxLength={1}
                            contextMenuHidden
                            selectTextOnFocus
                            editable={true}
                            keyboardType='decimal-pad'
                            testID={`OTPInput-${i}`}
                            onChangeText={(text) => handleChange(text, i)}
                            onKeyPress={event => handleBackSpace(event, i)}
                        />
                    ))}
                </View>
                <View>
                <TouchableOpacity
                    style={styles.btnSend}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {!loading ?
                        <Text style={styles.btnText}>
                            Envoyer
                        </Text>
                        : <ActivityIndicator color={colors.BLANC} size='large' />
                    }
                    </TouchableOpacity>
                </View>

                {/* <BottomContainer /> */}
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: colors.BLANC,
        paddingTop: 30,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerLogo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 20
    },
    logo: {
        width: 300, 
        height: 170,
    },
    containerOTPCode: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 22,
        marginTop: 50
    },
    input: {
        fontSize: 24,
        color: colors.BLEU,
        textAlign: 'center',
        width: 45,
        height: 55,
        backgroundColor: colors.BLANC,
        borderColor: colors.BLEU,
        borderWidth: 1,
        borderRadius: 15
    },
    btnSend: {
        width: '100%',
        height: 45,
        borderRadius: 15,
        marginTop: 20,
        backgroundColor: colors.BLEU
    },
    btnText: {
        textAlign: 'center',
        color: colors.BLANC, 
        fontFamily: 'Regular', 
        fontSize: 22,
        paddingTop: 8
    }
})

export default OTPCode