import axios from 'axios';

const instance = axios.create({
  //192.168.231.40
  baseURL: 'http://192.168.0.180:5000/api', // Remplacez par l'IP de votre PC
  headers: {
    'Content-Type': 'application/json',
  },
});
export default instance;
