import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { Ionicons } from '@expo/vector-icons'
import { dateParser } from "../utils/fonctions"

const ModalCours = ({visible, setVisible, cour}) => {
    return (
        <Modal 
            animationType='slide'
            visible={visible}
          >
            <View style={{flex: 1, margin: 15}}>
              <TouchableOpacity style={styles.header} onPress={() => setVisible(false)}>
                <Ionicons name='arrow-back-outline' size={30} color="black" />
                <Text style={styles.titleHeader}>Détails du cours</Text>
              </TouchableOpacity>

              <View>
                <View style={{marginBottom: 10}}>
                  <Text style={styles.title}>Titre :</Text>
                  <Text style={styles.titleContent}>{cour.titre}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                  <Text style={styles.title}>Description :</Text>
                  <Text style={styles.titleContent}>{cour.description}</Text>
                </View>
                <View style={{marginBottom: 10}}>
                  <Text style={[styles.title, {marginBottom: 10}]}>Matière : <Text style={{color: colors.BLEU}}>{cour.nom_matiere}</Text></Text>
                  <Text style={styles.title}>Enseignant : <Text style={{color: colors.VERT}}>
                    {cour.nom_teacher + ' ' + cour.prenom_teacher}
                  </Text></Text>
                </View>
                <Text style={{fontFamily: 'Regular', fontSize: 20}}>Enregistré le {dateParser(cour.created_at)}</Text>
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

export default ModalCours