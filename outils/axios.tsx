import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.92.40:5000/api', // Remplacez par l'IP de votre PC
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
