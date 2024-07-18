import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../../../utils/colors'
import { dateParser } from '../../../../../utils/fonctions'

const ModalNote = ({note, visible, setVisible}) => {
    return (
        <Modal
            animationType='slide'
            visible={visible}
        >
            <View style={{flex: 1, margin: 15}}>
                <TouchableOpacity style={styles.header} onPress={() => setVisible(false)}>
                    <Ionicons name='arrow-back-outline' size={30} color="black" />
                    <Text style={styles.titleHeader}>Détails de la note</Text>
                </TouchableOpacity>

                <View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.title}>Noms et prénoms :</Text>
                        <Text style={styles.titleContent}>{note.nom +' '+ note.prenom}</Text>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.title}>Matière :</Text>
                        <Text style={styles.titleContent}>{note.nom_matiere}</Text>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.title}>Note :</Text>
                        <Text style={styles.titleContent}>{note.note} / 20</Text>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.title}>Séquence :</Text>
                        <Text style={styles.titleContent}>{note.sequence}</Text>
                    </View>
                    <View style={{marginBottom: 10}}>
                        <Text style={styles.title}>Année scolaire :</Text>
                        <Text style={styles.titleContent}>{note.annee_scolaire}</Text>
                    </View>
                    <Text style={{fontFamily: 'Regular', fontSize: 20}}>Enregistré le {dateParser(note.created_at)}</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    header: {
      display: 'flex',
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginBottom: 20
    },
    titleHeader: {
      fontSize: 25,
      fontFamily: 'Bold',
      textAlign: 'center',
      color: colors.NOIR
    },
    title: {
      textAlign: 'left',
      fontSize: 22,
      textDecorationLine: 'underline',
      fontFamily: 'Bold'
    },
    titleContent: {
      fontSize: 20,
      fontFamily: 'Regular'
    }
})

export default ModalNote