import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '@/utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Heading from '@/components/Heading';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '@/utils/fonctions';
import { sendPushTokenToBackend } from '@/services/notification';
import { addNote, getStudents, getMatieresSchool, getSequences } from "@/services/MainService";
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const AjouterNote = ({ user, headers, classe, ecole, close }) => {
  const parsedUser = typeof user === 'string' ? JSON.parse(user) : user;
  const parsedClasse = typeof classe === 'string' ? JSON.parse(classe) : classe;
  const parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
  const parsedEcole = typeof ecole === 'string' ? JSON.parse(ecole) : ecole;

  const [ecoleId] = useState(parsedEcole?.id || null);
  const [classeId] = useState(parsedClasse?.id || null);

  const [loading, setLoading] = useState(true);
  const [selectMatiere, setSelectMatiere] = useState(null);
  const [selectStudent, setSelectStudent] = useState(null);
  const [selectSequence, setSelectSequence] = useState(null);
  const [annee_scolaire, setAnneeScolaire] = useState(null);
  const [note, setNote] = useState('');
  const [appreciation, setAppreciation] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [openMatiere, setOpenMatiere] = useState(false);
  const [openSequence, setOpenSequence] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [openAnnee, setOpenAnnee] = useState(false);

  const [itemsMatieres, setItemsMatieres] = useState([]);
  const [itemsSequences, setItemsSequences] = useState([]);
  const [itemsStudents, setItemsStudents] = useState([]);
  const [itemsAnnees, setItemsAnnees] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const previousYear = currentYear - 1;
    setItemsAnnees([
      { label: `${previousYear}-${currentYear}`, value: `${previousYear}-${currentYear}` },
      { label: `${currentYear}-${nextYear}`, value: `${currentYear}-${nextYear}` },
      { label: `${nextYear}-${nextYear + 1}`, value: `${nextYear}-${nextYear + 1}` },
    ]);
  }, []);

  useEffect(() => {
    if (ecoleId && classeId) {
      getMatieres();
      getStudentsClasse();
      getAllSequences();
    }
  }, [ecoleId, classeId]);

  async function getAllSequences() {
    try {
      const res = await getSequences(ecoleId, parsedHeaders);
      setItemsSequences(res.map(seq => ({
        label: seq.intitule,
        value: seq.id
      })));
    } catch (error) {
      showToast(error.message || "Erreur lors de la récupération des séquences");
    }
  }

  async function getMatieres() {
    try {
      const res = await getMatieresSchool(ecoleId, parsedHeaders);
      setItemsMatieres(res.map(matiere => ({
        label: matiere.intitule,
        value: matiere.id
      })));
    } catch (error) {
      showToast(error.message || "Erreur lors de la récupération des matières");
    }
  }

  async function getStudentsClasse() {
    try {
      const res = await getStudents(classeId, ecoleId, parsedHeaders);
      setItemsStudents(res.map(student => ({
        label: student.nom + ' ' + student.prenom,
        value: student.id
      })));
    } catch (error) {
      showToast(error.message || "Erreur lors de la récupération des étudiants");
    }
    setLoading(false);
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setLoading(true);

    if (!selectMatiere || !selectSequence || !selectStudent || note === "" || !annee_scolaire) {
      setError(true);
      showToast("Veuillez remplir tous les champs.");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    if (parseInt(note) > 20) {
      setError(true);
      showToast("Entrer une note inférieure ou égale à 20");
      setLoading(false);
      setSubmitting(false);
      return;
    }

    setError(false);

    const data = {
      classe_id: parseInt(classeId),
      ecole_id: parseInt(ecoleId),
      matiere_id: parseInt(selectMatiere),
      note: parseInt(note),
      student_id: parseInt(selectStudent),
      sequence_id: parseInt(selectSequence),
      appreciation,
      annee_scolaire
    };

    try {
      const res = await addNote(data, parsedHeaders);
      showToast(res.message);

      await sendPushTokenToBackend(
        'Nouvelle note enregistrée',
        `L'élève a reçu une note de ${data.note}/20 pour la matière sélectionnée.`,
        'INFORMATION',
        parsedUser?.user?.id || parsedUser.id
      );

      setNote('');
      setAppreciation('');
      setSelectMatiere(null);
      setSelectStudent(null);
      setSelectSequence(null);
      setAnneeScolaire(null);
      close();
    } catch (error) {
      showToast(error.response?.message || error.message);
    }

    setLoading(false);
    setSubmitting(false);
  }

  const formItems = [
    <TouchableOpacity style={styles.header} onPress={close}>
      <Ionicons name='arrow-back-outline' size={30} color="black" />
      <Text style={styles.titleHeader}>Enregistrer une note</Text>
    </TouchableOpacity>,
    <Heading text="Remplissez le formulaire" />,

    <Text style={styles.label}>Sélectionner la matière</Text>,
    <DropDownPicker
      open={openMatiere}
      value={selectMatiere}
      items={itemsMatieres}
      setOpen={setOpenMatiere}
      setValue={setSelectMatiere}
      setItems={setItemsMatieres}
      placeholder="Sélectionner ici..."
      style={[styles.textArea, error && !selectMatiere && styles.error]}
      dropDownContainerStyle={{ borderColor: colors.BLEU }}
      listItemLabelStyle={{ color: colors.BLEU }}
      zIndex={3000}
      zIndexInverse={1000}
    />,
    error && !selectMatiere && <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>,

    <Text style={styles.label}>Sélectionner la séquence</Text>,
    <DropDownPicker
      open={openSequence}
      value={selectSequence}
      items={itemsSequences}
      setOpen={setOpenSequence}
      setValue={setSelectSequence}
      setItems={setItemsSequences}
      placeholder="Sélectionner ici..."
      style={[styles.textArea, error && !selectSequence && styles.error]}
      dropDownContainerStyle={{ borderColor: colors.BLEU }}
      listItemLabelStyle={{ color: colors.BLEU }}
      zIndex={2500}
      zIndexInverse={900}
    />,
    error && !selectSequence && <Text style={styles.errorText}>Veuillez sélectionner une séquence</Text>,

    <Text style={styles.label}>Sélectionner l'élève</Text>,
    <DropDownPicker
      open={openStudent}
      value={selectStudent}
      items={itemsStudents}
      setOpen={setOpenStudent}
      setValue={setSelectStudent}
      setItems={setItemsStudents}
      placeholder="Sélectionner ici..."
      style={[styles.textArea, error && !selectStudent && styles.error]}
      dropDownContainerStyle={{ borderColor: colors.BLEU }}
      listItemLabelStyle={{ color: colors.BLEU }}
      zIndex={2000}
      zIndexInverse={800}
    />,
    error && !selectStudent && <Text style={styles.errorText}>Veuillez sélectionner un élève</Text>,

    <TextInput
      placeholder='Entrer la note'
      style={[styles.textArea, error && (note === "" || parseInt(note) > 20) && styles.error]}
      keyboardType="numeric"
      value={note}
      onChangeText={setNote}
    />,
    error && note === "" && <Text style={styles.errorText}>Veuillez entrer une note</Text>,
    error && note !== "" && parseInt(note) > 20 && <Text style={styles.errorText}>Entrer une note ≤ 20</Text>,

    <TextInput
      placeholder='Entrer une appréciation'
      style={styles.textArea}
      value={appreciation}
      onChangeText={setAppreciation}
    />,

    <Text style={styles.label}>Sélectionner l'année scolaire</Text>,
    <DropDownPicker
      open={openAnnee}
      value={annee_scolaire}
      items={itemsAnnees}
      setOpen={setOpenAnnee}
      setValue={setAnneeScolaire}
      setItems={setItemsAnnees}
      placeholder="Sélectionner ici..."
      style={[styles.textArea, error && !annee_scolaire && styles.error]}
      dropDownContainerStyle={{ borderColor: colors.BLEU }}
      listItemLabelStyle={{ color: colors.BLEU }}
      zIndex={1500}
      zIndexInverse={700}
    />,
    error && !annee_scolaire && <Text style={styles.errorText}>Veuillez sélectionner une année scolaire</Text>,

    <TouchableOpacity onPress={handleSubmit} style={styles.btn} disabled={loading || submitting}>
      {loading ? <ActivityIndicator color={colors.BLANC} /> :
        <Text style={{ fontFamily: 'Regular', color: colors.BLANC, fontSize: 23 }}>Enregistrer</Text>}
    </TouchableOpacity>
  ];

  return (
    <KeyboardAwareFlatList
      data={formItems}
      renderItem={({ item }) => <View style={{ marginBottom: 10 }}>{item}</View>}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ padding: 15 }}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  titleHeader: {
    fontSize: 25,
    fontFamily: 'Bold',
    textAlign: 'center',
    color: colors.NOIR
  },
  label: {
    fontFamily: 'SemiBold',
    fontSize: 20,
    marginBottom: 5,
    marginTop: 1
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    borderColor: colors.BLEU,
    marginBottom: 1
  },
  error: {
    borderColor: colors.ROUGE
  },
  errorText: {
    color: colors.ROUGE,
    fontSize: 15,
    marginTop: -10,
    marginBottom: 15
  },
  btn: {
    height: 50,
    width: "100%",
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AjouterNote;
