import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Heading from '@/components/Heading';
import { colors } from '@/utils/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { addDevoir} from '@/services/MainService'
import { showToast } from '@/utils/fonctions';
import { Ionicons } from '@expo/vector-icons';

const AjouterDevoir = ({ user, headers, classe, hideModal }) => {
  // ✅ Parse les props si elles arrivent sous forme de string
  const parsedUser = typeof user === 'string' ? JSON.parse(user) : user;
  const parsedClasse = typeof classe === 'string' ? JSON.parse(classe) : classe;
  const parsedHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
  const parsedEcole = typeof parsedUser?.ecole_id === 'string' ? JSON.parse(parsedUser.ecole_id) : parsedUser?.ecole_id;
  //console.log(parsedEcole)
   
  const [selectMatiere, setSelectMatiere] = useState(null);
  const [selectLivre, setSelectLivre] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numPage, setNumPage] = useState('');
  const [numExo, setNumExo] = useState('');
  const [error, setError] = useState(false);

  // DropDownPicker states
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
    const res = await axios.get(`https://gesco-app.com/api/get-matieres/${parsedEcole}`, {
      headers: parsedHeaders,
    });
    //console.log(res.data);  // Log the data returned from your backend
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
    const res = await axios.get(`https://gesco-app.com/api/get-livres/${parsedEcole}`, {
      headers: parsedHeaders,
    });
    console.log(res.data); 
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
    ecole_id: parsedEcole,
    classe_id: parsedClasse.id,
    num_exo: numExo,
    num_page: numPage,
  };

  console.log("Data to submit:", data);

  try {
    const res = await addDevoir(data, parsedHeaders);

    if (res && res.success) {
      showToast(res.message || 'Devoir ajouté avec succès');
      
      setNumExo('');
      setNumPage('');
      setSelectLivre(null);
      setSelectMatiere(null);

      hideModal();
    } else {
      showToast(res.message || "Une erreur est survenue");
    }
  } catch (error) {
    console.log("Erreur API:", error);
    showToast(error.message || "Erreur inattendue");
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

          <Text style={styles.label}>Sélectionner la matière</Text>
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
          />
          {error && !selectMatiere && <Text style={styles.errorText}>Veuillez sélectionner une matière</Text>}

          <Text style={styles.label}>Sélectionner le livre</Text>
          <DropDownPicker
            open={openLivre}
            value={selectLivre}
            items={itemsLivres}
            setOpen={setOpenLivre}
            setValue={setSelectLivre}
            setItems={setItemsLivres}
            placeholder="Sélectionner ici..."
            style={[styles.textArea, error && !selectLivre && styles.error]}
            dropDownContainerStyle={{ borderColor: colors.BLEU }}
            listItemLabelStyle={{ color: colors.BLEU }}
          />
          {error && !selectLivre && <Text style={styles.errorText}>Veuillez sélectionner un livre</Text>}

          <TextInput
            placeholder="Entrer le numéro de page"
            style={[styles.textArea, error && !numPage && styles.error]}
            numberOfLines={1}
            onChangeText={(text) => setNumPage(text)}
            value={numPage}
            keyboardType="numeric"
          />
          {error && !numPage && <Text style={styles.errorText}>Veuillez entrer le numéro de page</Text>}

          <TextInput
            placeholder="Entrer le numéro de l'exercice"
            style={[styles.textArea, error && !numExo && styles.error]}
            numberOfLines={1}
            onChangeText={(text) => setNumExo(text)}
            value={numExo}
            keyboardType="numeric"
          />
          {error && !numExo && <Text style={styles.errorText}>Veuillez entrer le numéro de l'exercice</Text>}

          <TouchableOpacity onPress={handleSubmit} disabled={loading} style={styles.btn}>
            {loading ? (
              <ActivityIndicator color={colors.BLANC} />
            ) : (
              <Text style={styles.btnText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
     marginTop: 30,
  },
  titleHeader: {
    fontSize: 25,
    fontFamily: 'Bold',
    textAlign: 'center',
    color: colors.NOIR,
    marginLeft: 10,
  },
  label: {
    fontFamily: 'SemiBold',
    fontSize: 20,
    marginBottom: 5,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    fontSize: 16,
    borderColor: colors.BLEU,
    marginBottom: 15,
  },
  error: {
    borderColor: colors.ROUGE,
  },
  errorText: {
    color: colors.ROUGE,
    fontSize: 15,
    marginTop: -10,
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
  btnText: {
    fontFamily: 'Regular',
    color: colors.BLANC,
    fontSize: 23,
  },
});

export default AjouterDevoir;
