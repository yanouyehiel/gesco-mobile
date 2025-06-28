import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

type PageHeadingProps = {
    title: string;
};

const PageHeading: React.FC<PageHeadingProps> = ({ title }) => {
    const router = useRouter()
    
    return (
        <View>
            <TouchableOpacity style={styles.header} onPress={() => router.back()}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 25,
    },
    titleHeader: {
        fontSize: 25,
        fontFamily: 'Bold'
    }
})

export default PageHeading