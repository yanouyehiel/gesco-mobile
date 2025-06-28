import React, { useEffect, useState } from 'react';
import { 
  View, Text, KeyboardAvoidingView, TouchableOpacity, StyleSheet, 
  TextInput, ActivityIndicator, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Heading from '@/components/Heading';
import { colors } from '@/utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { showToast } from '@/utils/fonctions';
import { addCours, getMatieresSchool } from '@/services/MainService';

const AjouterCours = ({ user, headers, classe, ecole, close }) => {
  // Parse JSON strings if needed
  const parsedEcole = typeof ecole === 'string' ? JSON.parse(ecole) : ecole;
  const parsedClasse = typeof classe === 'string' ? JSON.parse(classe) : classe;
  const parsedUser = typeof user === 'string' ? JSON.parse(user) : user;
  const parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;

  // Then use parsedEcole etc instead of ecole
  const [selectedValue, setSelectedValue] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titre, setTitre] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  // useEffect(() => {
  //   console.log("Parsed props:", { parsedUser, parsedHeaders, parsedClasse, parsedEcole });
  // }, []);

  useEffect(() => {
    if (parsedEcole && parsedEcole.id) {
      
      getMatieres().then(() => setLoading(false));
    } else {
    
    }
  }, [parsedEcole]);

  async function getMatieres() {
    try { 
      const res = await getMatieresSchool(parsedEcole.id, parsedHeaders);
      setMatieres(res);
      setItems(
        res.map((matiere) => ({
          label: matiere.intitule,
          value: matiere.id,
        }))
      );
    } catch (error) {
      
      showToast(error.message || "Erreur lors de la récupération des matières");
    }
    
  }

  async function handleSubmit() {
    setLoading(true);
    if (titre.trim() === '' || desc.trim() === '' || !selectedValue) {
      setError(true);
      setLoading(false);
      return;
    }
    setError(false);

    const data = {
      titre: titre.trim(),
      description: desc.trim(),
      matiere_id: selectedValue,
      teacher_id: parsedUser.id,
      ecole_id: parsedEcole.id,
      classe_id: parsedClasse.id,
    };

    try {
      const res = await addCours(data, parsedHeaders);
      showToast(res.message);
      setTitre('');
      setDesc('');
      setSelectedValue(null);
      close();
    } catch (error) {
      showToast(error.message);
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, margin: 15 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <TouchableOpacity style={styles.header} onPress={() => close()}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
          <Text style={styles.titleHeader}>Enregistrer un cours</Text>
        </TouchableOpacity>

        <View style={{ margin: 10, flex: 1 }}>
          <View style={{ marginTop: 20, paddingBottom: 20 }}>
            <Heading text={'Remplissez le formulaire'} />

            <TextInput
              placeholder="Entrer le titre du cours"
              style={[error && titre.trim() === '' ? styles.error : styles.textArea]}
              numberOfLines={1}
              multiline={false}
              onChangeText={(text) => setTitre(text)}
              value={titre}
            />
            {error && titre.trim() === '' && (
              <Text style={styles.errorText}>Veuillez entrer le titre du cours</Text>
            )}

            <TextInput
              placeholder="Entrer le résumé du cours"
              style={[error && desc.trim() === '' ? styles.error : styles.textArea]}
              numberOfLines={5}
              multiline={true}
              onChangeText={(text) => setDesc(text)}
              value={desc}
            />
            {error && desc.trim() === '' && (
              <Text style={styles.errorText}>Veuillez entrer une description du cours</Text>
            )}

            <View style={{ marginTop: 10, zIndex: 1000 }}>
              <Text style={{ fontFamily: 'SemiBold', fontSize: 20, marginBottom: 5 }}>
                Sélectionner la matière
              </Text>
              <DropDownPicker
                open={open}
                value={selectedValue}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedValue}
                setItems={setItems}
                placeholder="Sélectionner ici..."
                style={[styles.textArea, error && !selectedValue ? styles.error : null]}
                dropDownContainerStyle={{ borderColor: colors.BLEU }}
                listItemLabelStyle={{ color: colors.BLEU }}
              />
              {error && !selectedValue && (
                <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>
              )}
            </View>

            <TouchableOpacity onPress={handleSubmit} style={styles.btn} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.BLANC} size="large" />
              ) : (
                <Text style={{ fontFamily: 'Regular', color: colors.BLANC, fontSize: 23 }}>
                  Enregistrer
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,
  },
  titleHeader: {
    fontSize: 25,
    fontFamily: 'Bold',
    textAlign: 'center',
    color: colors.NOIR,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 15,
    textAlignVertical: 'top',
    padding: 10,
    fontSize: 16,
    borderColor: colors.BLEU,
    marginBottom: 15,
  },
  error: {
    borderWidth: 1,
    borderRadius: 15,
    textAlignVertical: 'top',
    padding: 10,
    fontSize: 16,
    borderColor: colors.ROUGE,
  },
  errorText: {
    color: colors.ROUGE,
    fontSize: 15,
    marginBottom: 15,
  },
  btn: {
    height: 50,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AjouterCours;
