import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@/utils/colors';
import { useNavigation } from '@react-navigation/native';

const PhoneNumberForgot = () => {
    const [areas, setAreas] = useState([])
    const [selectedArea, setSelectedArea] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [tel, setTel] = useState("")

    function verify() {
        setLoading(true)
        if (tel === "") {
            setError(true)
            setLoading(false)
        } else {
            navigation.navigate("otp-code")
        }
        //console.log(selectedArea.callingCode)
    }

    useEffect(() => {
        fetch("https://restcountries.com/v2/all")
        .then(response => response.json())
        .then(data => {
            let areaData = data.map((item: any) => {
                return {
                    code: item.alpha2Code,
                    item: item.name,
                    callingCode: `+${item.callingCodes[0]}`,
                    flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
                }
            })

            setAreas(areaData)

            if (areaData.length > 0) {
                let defaultData = areaData.filter((a: any) => a.code === "CM")
                
                if (defaultData.length > 0) {
                    setSelectedArea(defaultData[0])
                }
            }
        })

        
    }, [])

    const renderAreasCodeModal = () => {

        const renderItem = ({ item }: any) => {
            return (
                <TouchableOpacity 
                    onPress={() => {
                        setSelectedArea(item)
                        setModalVisible(false)
                    }}
                    style={{
                        flexDirection: 'row',
                        padding: 10
                    }}
                >
                    <Image 
                        source={{ uri: item.flag }}
                        resizeMode='contain'
                        style={{
                            height: 30,
                            width: 30,
                            marginRight: 10,
                            backgroundColor: 'transparent'
                        }}
                    />
                    <Text style={{
                        color: colors.BLANC
                    }}>{item.item}</Text>
                </TouchableOpacity>
            )
        }
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: colors.BLEU
                        }}>
                            {/* Close button for modal */}
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    top: 22,
                                    right: 22,
                                    width: 42,
                                    height: 42,
                                    backgroundColor: colors.BLANC,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 50
                                }}
                                onPress={() => setModalVisible(false)}
                            >
                                <AntDesign 
                                    name="close" 
                                    style={{
                                        tintColor: colors.BLEU
                                    }}
                                    size={20}
                                />
                            </TouchableOpacity>

                            <FlatList 
                                data={areas}
                                renderItem={renderItem}
                                horizontal={false}
                                keyExtractor={item => item.code}
                                style={{ padding: 20, marginBottom: 20 }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <View style={styles.body}>
            <View style={{marginTop: '50%'}}>
                <View style={styles.containerForm}>
                    <Text style={{color: '#333', fontSize: 23, fontFamily: 'SemiBold', textAlign: 'center'}}>Entrer votre numéro de téléphone</Text>
                    <Text style={{fontSize: 20, fontFamily: 'Regular', textAlign: 'center'}}>On vous enverra un code de vérification</Text>

                    <View style={[error ? styles.error : styles.inputContainer]}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={styles.selectFlagContainer}
                        >
                            <View style={{ justifyContent: 'center' }}>
                                <AntDesign name="down" size={15} color="black" />
                            </View>
                            <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                                <Image 
                                    source={{ uri: selectedArea?.flag}}
                                    resizeMode='contain'
                                    style={styles.flagIcon}
                                />
                            </View>
                            <View style={{ justifyContent: 'center', marginLeft: 5 }}>
                                <Text style={{ color: colors.NOIR, fontSize: 14 }}>{selectedArea?.callingCode}</Text>
                            </View>
                        </TouchableOpacity>
                        <TextInput 
                            placeholder='Entrer votre téléphone'
                            style={styles.input}
                            placeholderTextColor={colors.NOIR}
                            selectionColor={colors.NOIR}
                            keyboardType='numeric'
                            onChangeText={(text) => setTel(text)}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={verify}
                        disabled={loading}
                    >
                        {!loading ?
                            <Text 
                                style={{fontFamily: 'Regular', color: colors.BLANC, fontSize: 20}}
                            >Vérifier</Text>
                            : <ActivityIndicator color={colors.BLANC} size='large' />
                        }
                    </TouchableOpacity>
                </View>

                {/* <BottomContainer /> */}

                {renderAreasCodeModal()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerForm: {
        marginTop: 50
    },
    inputContainer: {
        flexDirection: 'row',
        borderBlockColor: colors.VERT,
        borderBottomWidth: .4,
        height: 58,
        alignItems: 'center',
        marginVertical: 32
    },
    error: {
        flexDirection: 'row',
        borderBlockColor: colors.ROUGE,
        borderBottomWidth: .4,
        height: 58,
        alignItems: 'center',
        marginVertical: 32
    },
    selectFlagContainer: {
        width: 90,
        height: 50,
        marginHorizontal: 10,
        flexDirection: 'row'
    },
    flagIcon: {
        width: 30,
        height: 30
    },
    input: {
        flex: 1,
        marginVertical: 10,
        height: 40,
        fontSize: 18,
        color: colors.NOIR,
        fontFamily: 'Regular'
    },
    btn: {
        marginTop: 30,
        marginBottom: 30,
        height: 50,
        width: '100%',
        borderRadius: 10,
        backgroundColor: colors.BLEU,
        display: 'flex',
        justifyContent:'center',
        alignItems: 'center'
    }
})

export default PhoneNumberForgot