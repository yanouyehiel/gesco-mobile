import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../utils/colors'
import { dateParser } from '../utils/fonctions'

const ModalNote = ({ note, visible, setVisible }) => {
  return (
    <Modal
      animationType='slide'
      visible={visible}
      transparent={false}
      onRequestClose={() => setVisible(false)}
    >
      <SafeAreaView style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setVisible(false)} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name='arrow-back-outline' size={24} color={colors.NOIR} />
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Détails de la Note</Text>
          <View style={{ width: 70 }} /> {/* Spacer for alignment */}
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Student Info Card */}
          <View style={[styles.card, { backgroundColor: colors.BLEU_CLAIR }]}>
            <Ionicons name="person-circle-outline" size={24} color={colors.BLEU} />
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>ÉTUDIANT</Text>
              <Text style={[styles.cardValue, { color: colors.BLEU }]}>
                {note.nom || '-'} {note.prenom || '-'}
              </Text>
            </View>
          </View>

          {/* Subject and Grade Row */}
          <View style={styles.row}>
            <View style={[styles.card, styles.halfCard, { backgroundColor: colors.VERT_CLAIR }]}>
              <Ionicons name="book-outline" size={20} color={colors.VERT} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>MATIÈRE</Text>
                <Text style={[styles.cardValue, { color: colors.VERT }]}>
                  {note.nom_matiere || '-'}
                </Text>
              </View>
            </View>

            <View style={[styles.card, styles.halfCard, { backgroundColor: colors.ROUGE_CLAIR }]}>
              <Ionicons name="school-outline" size={20} color={colors.ROUGE} />
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>NOTE</Text>
                <Text style={[styles.cardValue, { color: colors.ROUGE }]}>
                  {note.note || '0'} / 20
                </Text>
              </View>
            </View>
          </View>

          {/* Academic Info Card */}
          <View style={[styles.card, { backgroundColor: colors.JAUNE_CLAIR }]}>
            <Ionicons name="calendar-outline" size={24} color={colors.JAUNE} />
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>INFORMATIONS ACADÉMIQUES</Text>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Séquence:</Text>
                <Text style={styles.infoValue}>{note.sequence || '-'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Année scolaire:</Text>
                <Text style={styles.infoValue}>{note.annee_scolaire || '-'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Enregistré le:</Text>
                <Text style={styles.infoValue}>
                  {note.created_at ? dateParser(note.created_at) : '-'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLANC,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_CLAIR,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
    marginLeft: 5,
  },
  titleHeader: {
    fontSize: 18,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'SemiBold',
    color: colors.GRIS_FONCE,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'SemiBold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRIS_CLAIR,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'SemiBold',
    color: colors.NOIR,
  },
})

export default ModalNote