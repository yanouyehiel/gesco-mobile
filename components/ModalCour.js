import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import React from 'react';
import { colors } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { dateParser } from "../utils/fonctions";

const ModalCours = ({ visible, setVisible, cour }) => {
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
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Détails du Cours</Text>
          <View style={{ width: 90 }} /> 
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Title Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TITRE</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionText}>{cour.titre}</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
            <View style={[styles.sectionContent, styles.descriptionBox]}>
              <Text style={styles.sectionText}>
                {cour.description}
              </Text>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoRow}>
            {/* Subject Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.BLEU_CLAIR }]}>
              <Ionicons name="book-outline" size={20} color={colors.BLEU} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Matière</Text>
                <Text style={[styles.infoValue, { color: colors.BLEU }]}>
                  {cour.nom_matiere || '-'}
                </Text>
              </View>
            </View>

            {/* Teacher Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.VERT_CLAIR }]}>
              <Ionicons name="person-outline" size={20} color={colors.VERT} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Enseignant</Text>
                <Text style={[styles.infoValue, { color: colors.VERT }]}>
                  {cour.nom_teacher && cour.prenom_teacher 
                    ? `${cour.nom_teacher} ${cour.prenom_teacher}` 
                    : '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* Date Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DATE</Text>
            <View style={[styles.sectionContent, styles.dateContainer]}>
              <Ionicons name="calendar-outline" size={18} color={colors.GRIS_FONCE} />
              <Text style={[styles.sectionText, { marginLeft: 8 }]}>
                {cour.created_at ? dateParser(cour.created_at) : 'Date inconnue'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

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
    fontSize: 25,
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
  section: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 20,
    fontFamily: 'SemiBold',
    color: colors.GRIS_FONCE,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.GRIS_TRES_CLAIR,
    borderRadius: 10,
    padding: 16,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Regular',
    color: colors.NOIR,
    lineHeight: 24,
  },
  descriptionBox: {
    minHeight: 100,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  infoCard: {
    flex: 0.48,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 10,
  },
  infoLabel: {
    fontSize: 20,
    fontFamily: 'Regular',
    color: colors.GRIS_FONCE,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'SemiBold',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ModalCours;