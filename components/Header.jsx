import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    ToastAndroid,
    TextInput, 
    TouchableOpacity, 
    Modal, 
    SafeAreaView, 
    Animated, 
    Easing 
} from 'react-native'
import React, { useRef, useState } from 'react'
import {colors} from '@/utils/colors'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Skeleton } from 'moti/skeleton';

const Header = ({user}) => {  
    const [visible, setVisible] = useState(false)
    const navigation = useNavigation()
    const options = [
        {
            title: "Paramètres",
            icon: 'settings',
            action: () => navigation.navigate('settings')
        },
        {
            title: "Confidentialité",
            icon: 'lock',
            action: () => navigation.navigate('settings')
        },
        {
            title: "Publier un reel",
            icon: 'video',
            action: () => ToastAndroid.show('Reel', ToastAndroid.SHORT)
        },
        {
            title: "Lancer un direct",
            icon: 'plus',
            action: () => ToastAndroid.show('Direct', ToastAndroid.SHORT)
        }
    ]

    const scale = useRef(new Animated.Value(0)).current

    function resizeBox(to) {
        to === 1 && setVisible(true)
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.linear
        }).start(() => to === 0 && setVisible(false))
    }

    const PopupMenu = () => {
        return (
            <Modal transparent visible={visible}>
                <SafeAreaView 
                    style={{ flex: 1 }}
                    onTouchStart={() => resizeBox(0)}>
                    <Animated.View style={[
                        styles.popup, 
                        {opacity: scale.interpolate({inputRange: [0, 1], outputRange: [0, 1]})},
                        {
                            transform: [{scale: scale}]
                        }]}>
                        {options.map((op, i) => (
                            <TouchableOpacity 
                                key={i} 
                                onPress={() => op.action} 
                                style={[styles.option, {borderBottomWidth: i === options.length - 1 ? 0 : 1}]}
                            >
                                <Text>{op.title}</Text>
                                <Feather name={op.icon} size={26} color={'#212121'} style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            {/* Section Profile */}
            <View style={styles.profileMainContainer}>
                <View style={styles.profileContainer}>
                    <Image 
                        source={require("@/assets/images/user.jpeg")}
                        style={styles.userImage}
                    />
                    <View>
                        <Text style={{color: colors.BLANC, fontFamily: 'Bold'}}>Bienvenu</Text>
                        {(!user.nom && !user.prenom) ?
                            <Skeleton width={100} height={15} colorMode="light" radius={10} /> :
                            <Text 
                                style={{color: colors.BLANC, fontSize: 20, fontFamily: 'Regular'}}
                            >{user.nom + ' ' + user.prenom}</Text>
                        }
                    </View>
                </View>
                <TouchableOpacity onPress={() => resizeBox(1)}>
                    <Ionicons name="options-outline" size={24} color={colors.BLANC} />
                </TouchableOpacity>
                <PopupMenu />
            </View>

            {/* Section Searchbar */}
            <View style={styles.searchBarContainer}>
                <TextInput placeholder='Rechercher' style={styles.textInput} />
                <Ionicons name="search" size={24} color={colors.BLEU}  style={styles.searchBtn} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 20,
        paddingTop: 10,
        backgroundColor: colors.BLEU,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    profileMainContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 99
    },
    searchBarContainer: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10
    },
    textInput: {
        padding: 7,
        paddingHorizontal: 16,
        backgroundColor: colors.BLANC,
        borderRadius: 8,
        width: '85%',
        fontSize: 16,
        fontFamily: 'Regular'
    },
    searchBtn: {
        backgroundColor: colors.BLANC,
        padding: 10,
        borderRadius: 8
    },
    popup: {
        borderRadius: 8,
        borderColor: '#f2f2f2',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 45,
        right: 20
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc'
    }
})

export default Header