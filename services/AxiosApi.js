import axios from 'axios';

export default axios.create({
    //baseURL: `${process.env.API_URL}`
    baseURL: "https://test.comtheplug.com/api"
});