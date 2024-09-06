import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export async function getHeaders() {
    const data = await AsyncStorage.getItem('tokenGesco')
    if (data === null) {
        return "Pas de donnée stockée"
    } else {
        const json = JSON.parse(data)
        
        return {headers: {
            access_token: json.access_token,
            authorization: `Bearer ${json.access_token}`,
            accept: 'application/json'
        }}
    }
}

export async function getTokenId() {
    const data = await AsyncStorage.getItem('tokenGesco')
    if (data === null) {
        return "Pas de token stocké"
    } else {
        const json = JSON.parse(data)
        
        return parseInt(json.token_id)
    }
}

export const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('Erreur de stockage de la data : ' + e)
    }
};

export const removeStorge = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log('Erreur lors de la suppression du storage : ' + error)
    }
}

export const getData = (key) => {
    try {
      const jsonValue = AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log('Erreur de lecture de la data : ' + e)
    }
};


export async function getMatieresSchool(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-matieres/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function login(data) {
    const response = await axios.post('https://gesco-app.com/gesco/api/auth/login', data)
    return response.data;
}

export async function register(data) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/register-mobile`, data)
    return response.data;
}

export async function sendLinkResetPassword(data) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/auth/password/email`, data)
    return response.data;
}

export async function logout(headers) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/auth/logout`, {}, {headers: headers})
    return response.data;
}

export async function getUser() {
    const data = await AsyncStorage.getItem('tokenGesco')
    if (data === null) {
        return "Pas de donnée stockée"
    } else {
        const json = JSON.parse(data)
        
        return json.user
    }
}

export async function getEcole() {
    const data = await AsyncStorage.getItem('ecoleGesco')
    if (data === null) {
        return "Pas de donnée stockée"
    } else {
        const json = JSON.parse(data)
        return json.ecole
    }
}

export async function getMyClasses(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-classes-school/${parseInt(id)}`, {headers})
    return response.data;
}

export async function getAllClasses(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-classes-school/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function getAllEvents(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-events/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function getAllCalendars(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-calendars/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function getAllMatieres(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-matieres/${parseInt(id)}`, {headers: headers});
    return response.data;
}

export async function getAllLivres(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-livres/${parseInt(id)}`, {headers: headers});
    return response.data;
}

export async function getFees(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-fees-student/${parseInt(id)}`, {headers: headers});
    return response.data;
}

export async function addCours(cours, headers) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/add-cours`, cours, {headers});
    return response.data;
}

export async function addDevoir(devoir, headers) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/add-devoir`, devoir, {headers});
    return response.data;
}

export async function addNote(note, headers) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/add-note`, note, {headers});
    return response.data;
}

export async function getAllCoursClasse(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-cours-classe/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getStudents(idClasse, idEcole, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/students/classe_id=${idClasse}&ecole_id=${idEcole}`, {headers});
    return response.data;
}

export async function getStudentsOfClasse(idSalle, idEcole, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/my-students/classe_id=${parseInt(idSalle)}&ecole_id=${parseInt(idEcole)}`, {headers});
    return response.data;
}

export async function getAllPresences(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-absences-classe/${parseInt(id)}`, {headers});
    return response.data;
}

export async function addAbsence(absence, headers) {
    const response = await axios.post(`https://gesco-app.com/gesco/api/add-absence`, absence, {headers});
    return response.data;
}

export async function getAbsencesClasse(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-absences-classe/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getAbsencesChildren(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-absences-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getNotesClasse(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-notes-classe/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getNotesChildren(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-notes-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getDevoirsClasse(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/devoirs-classe/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getDevoirsChildren(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-devoirs-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getMyChildren(id, headers) {
    const response = await axios.get(`https://gesco-app.com/gesco/api/get-my-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function updateNote(data, headers) {
    const response = await axios.put(`https://gesco-app.com/gesco/api/update-note`, data, {headers});
    return response.data;
}

export async function getSequences(id, headers) {
    const response = await axios.get('https://gesco-app.com/gesco/api/get-sequences/'+parseInt(id), {headers});
    return response.data;
}