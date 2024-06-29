import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/utils/colors'
import { settings } from '@/utils/settings'
import { Feather } from '@expo/vector-icons';

const Settings = () => {
    const [form, setForm] = useState<any>({
        language: 'Français',
        darkMode: false,
        wifi: true
    })

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6', marginTop: 30 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Paramètres</Text>
                    <Text style={styles.subtitle}>Mettez à jour vos préférences</Text>
                </View>

                {settings.map(({ header, items}) => (
                    <View style={styles.section} key={header}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{header}</Text>
                        </View>

                        <View style={styles.sectionBody}>
                            {items.map(({ label, id, icon, type }, index) => (
                                <View style={[
                                    styles.rowWrapper,
                                    index === 0 && {borderBottomWidth: 0}
                                ]} key={id}>
                                    <TouchableOpacity
                                        onPress={() => {

                                        }}>
                                        <View style={styles.row}>
                                            <Feather 
                                                name={icon} 
                                                size={22} 
                                                color="#616161" 
                                                style={{ marginRight: 22 }}
                                            />
                                            <Text style={styles.rowLabel}>{label}</Text>

                                            <View style={styles.rowSpacer} />

                                            {type === 'select' && (
                                                <Text style={styles.rowValue}>{form[id]}</Text>
                                            )}

                                            {type === 'toggle' && (
                                                <Switch
                                                    value={form[id]}
                                                    onValueChange={(value) => setForm({...form, value})}
                                                    thumbColor={form[id] ? colors.BLEU : colors.BLANC}
                                                />
                                            )}

                                            {['select', 'link'].includes(type) && (
                                                <Feather 
                                                    name='chevron-right'
                                                    color='#ababab'
                                                    size={22}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 12
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.NOIR,
        marginBottom: 6
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292'
    },
    section: {
        paddingTop: 12
    },
    sectionHeader: {
        paddingHorizontal: 24,
        paddingVertical: 8
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#929292',
        textTransform: 'uppercase',
        letterSpacing: 1.2
    },
    sectionBody: {

    },
    rowWrapper: {
        paddingLeft: 24,
        borderTopWidth: 1,
        borderColor: '#e3e3e3',
        backgroundColor: colors.BLANC
    },
    row: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 24
    },
    rowLabel: {

    },
    rowSpacer: {
        flex: 1
    },
    rowValue: {
        fontSize: 17,
        color: '#616161',
        marginRight: 4
    },
    btnDeconnect: {
        textAlign: 'center',
        fontFamily: 'Regular',
        fontSize: 20,
        backgroundColor: colors.ROUGE,
        color: colors.BLANC,
        padding: 13,
        borderRadius: 99,
        elevation: 2,
        margin: 20,
    }
})

export default Settings