import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_URL, AUTH } from "@/utils/global"

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
    const response = await axios.get(`${API_URL}/get-matieres/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function login(data) {
    const response = await axios.post(`${API_URL}/${AUTH}/login`, data)
    return response.data;
}

export async function register(data) {
    const response = await axios.post(`${API_URL}/register-mobile`, data)
    return response.data;
}

export async function sendLinkResetPassword(data) {
    const response = await axios.post(`${API_URL}/${AUTH}/password/email`, data)
    return response.data;
}

export async function logout(headers) {
    const response = await axios.post(`${API_URL}/${AUTH}/logout`, {}, {headers: headers})
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

export async function getMyClasses(id, headers) {
    const response = await axios.get(`${API_URL}/get-classes-school/${parseInt(id)}`, {headers})
    return response.data;
}

export async function getAllClasses(id, headers) {
    const response = await axios.get(`${API_URL}/get-classes-school/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function getAllEvents(id, headers) {
    const response = await axios.get(`${API_URL}/get-events/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function getAllCalendars(id, headers) {
    const response = await axios.get(`${API_URL}/get-calendars/${parseInt(id)}`, {headers: headers})
    return response.data;
}

export async function getAllMatieres(id, headers) {
    const response = await axios.get(`${API_URL}/get-matieres/${parseInt(id)}`, {headers: headers});
    return response.data;
}

export async function addCours(cours, headers) {
    const response = await axios.post(`${API_URL}/add-cours`, cours, {headers});
    return response.data;
}

export async function getAllCoursClasse(id, headers) {
    const response = await axios.get(`${API_URL}/get-cours-classe/${parseInt(id)}`, headers);
    return response.data;
}

export async function getStudentsOfClasse(idSalle, idEcole, headers) {
    const response = await axios.get(`${API_URL}/my-students/classe_id=${parseInt(idSalle)}&ecole_id=${parseInt(idEcole)}`, {headers});
    return response.data;
}

export async function getAllPresences(id, headers) {
    const response = await axios.get(`${API_URL}/get-absences-classe/${parseInt(id)}`, {headers});
    return response.data;
}

export async function addAbsence(absence, headers) {
    const response = await axios.post(`${API_URL}/add-absence`, absence, {headers});
    return response.data;
}

export async function getAbsencesChildren(id, headers) {
    const response = await axios.get(`${API_URL}/get-absences-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getNotesChildren(id, headers) {
    const response = await axios.get(`${API_URL}/get-notes-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getDevoirsChildren(id, headers) {
    const response = await axios.get(`${API_URL}/get-devoirs-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function getMyChildren(id, headers) {
    const response = await axios.get(`${API_URL}/get-my-children/${parseInt(id)}`, {headers});
    return response.data;
}

export async function updateNote(data, headers) {
    const response = await axios.put(`${API_URL}/update-note`, data, {headers});
    return response.data;
}