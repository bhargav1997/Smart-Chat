import axios from 'axios';

const API_ROOT = process.env.REACT_APP_SERVER_URI

axios.defaults.baseURL = API_ROOT;

export const fetchUsers = () => {
    return axios.get(`http://localhost:8002/users`)
    .then(res => res.data.data)
}