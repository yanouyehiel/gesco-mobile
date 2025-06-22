import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Heading from '@/components/Heading';
import { colors } from '@/utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { showToast } from '@/utils/fonctions';
import { Ionicons } from '@expo/vector-icons';

const AjouterDevoir = ({ user, headers, classe, hideModal }) => {
  const [selectMatiere, setSelectMatiere] = useState(null);
  const [selectLivre, setSelectLivre] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [livres, setLivres] = useState([]);
  const ecole = user.ecole_id;
  const [loading, setLoading] = useState(true);
  const [numPage, setNumPage] = useState('');
  const [numExo, setNumExo] = useState('');
  const [error, setError] = useState(false);

  // États nécessaires pour DropDownPicker
  const [openMatiere, setOpenMatiere] = useState(false);
  const [openLivre, setOpenLivre] = useState(false);
  const [itemsMatieres, setItemsMatieres] = useState([]);
  const [itemsLivres, setItemsLivres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getMatieres(), getLivres()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  async function getMatieres() {
    try {
      const res = await axios.get(`${process.env.API_URL}/get-matieres/` + ecole, {
        headers: headers,
      });
      setMatieres(res.data);
      setItemsMatieres(
        res.data.map((matiere) => ({
          label: matiere.intitule,
          value: matiere.id,
        }))
      );
    } catch (error) {
      showToast(error.message);
    }
  }

  async function getLivres() {
    try {
      const res = await axios.get(`${process.env.API_URL}/get-livres/` + ecole, {
        headers: headers,
      });
      setLivres(res.data);
      setItemsLivres(
        res.data.map((livre) => ({
          label: livre.intitule,
          value: livre.id,
        }))
      );
    } catch (error) {
      showToast(error.message);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    if (!numExo || !numPage || !selectLivre || !selectMatiere) {
      setError(true);
      setLoading(false);
      return;
    }
    setError(false);

    const data = {
      livre_id: parseInt(selectLivre),
      matiere_id: parseInt(selectMatiere),
      ecole_id: ecole,
      classe_id: classe.id,
      num_exo: numExo,
      num_page: numPage,
    };

    try {
      const res = await axios.post(`${process.env.API_URL}/add-devoir`, data, {
        headers: headers,
      });
      showToast(res.data.message);
      setNumExo('');
      setNumPage('');
      setSelectLivre(null);
      setSelectMatiere(null);
    } catch (error) {
      showToast(error.message);
    }
    setLoading(false);
  }

  return (
    <View style={{ margin: 10 }}>
      <TouchableOpacity style={styles.header} onPress={() => hideModal()}>
        <Ionicons name="arrow-back-outline" size={30} color="black" />
        <Text style={styles.titleHeader}>Enregistrer un devoir</Text>
      </TouchableOpacity>

      <View style={{ margin: 10, zIndex: 1000 }}>
        <View style={{ marginTop: 20, paddingBottom: 20 }}>
          <Heading text={'Remplissez le formulaire'} />

          <Text style={{ fontFamily: 'SemiBold', fontSize: 20, marginBottom: 5 }}>Sélectionner la matière</Text>
          <DropDownPicker
            open={openMatiere}
            value={selectMatiere}
            items={itemsMatieres}
            setOpen={setOpenMatiere}
            setValue={setSelectMatiere}
            setItems={setItemsMatieres}
            placeholder="Sélectionner ici..."
            style={[styles.textArea, error && !selectMatiere ? styles.error : null]}
            dropDownContainerStyle={{ borderColor: colors.BLEU }}
            listItemLabelStyle={{ color: colors.BLEU }}
          />
          {error && !selectMatiere && <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>}

          <Text style={{ fontFamily: 'SemiBold', fontSize: 20, marginTop: 15, marginBottom: 5 }}>Sélectionner le livre</Text>
          <DropDownPicker
            open={openLivre}
            value={selectLivre}
            items={itemsLivres}
            setOpen={setOpenLivre}
            setValue={setSelectLivre}
            setItems={setItemsLivres}
            placeholder="Sélectionner ici..."
            style={[styles.textArea, error && !selectLivre ? styles.error : null]}
            dropDownContainerStyle={{ borderColor: colors.BLEU }}
            listItemLabelStyle={{ color: colors.BLEU }}
          />
          {error && !selectLivre && <Text style={styles.errorText}>Veuillez sélectionner un livre</Text>}

          <TextInput
            placeholder="Entrer le numéro de page"
            style={[error && !numPage ? styles.error : styles.textArea]}
            numberOfLines={1}
            multiline={false}
            onChangeText={(text) => setNumPage(text)}
            value={numPage}
            keyboardType="numeric"
          />
          {error && !numPage && <Text style={styles.errorText}>Veuillez entrer le numéro de page</Text>}

          <TextInput
            placeholder="Entrer le numéro de l'exercice"
            style={[error && !numExo ? styles.error : styles.textArea]}
            numberOfLines={1}
            multiline={false}
            onChangeText={(text) => setNumExo(text)}
            value={numExo}
            keyboardType="numeric"
          />
          {error && !numExo && <Text style={styles.errorText}>Veuillez entrer le numéro de l'exercice</Text>}

          <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.btn}>
            {loading ? (
              <ActivityIndicator color={colors.BLANC} />
            ) : (
              <Text style={{ fontFamily: 'Regular', color: colors.BLANC, fontSize: 23 }}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 10,
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
    marginBottom: 15,
  },
  btn: {
    height: 50,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.BLEU,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.ROUGE,
    fontSize: 15,
    marginTop: -15,
    marginBottom: 15,
  },
});

export default AjouterDevoir;