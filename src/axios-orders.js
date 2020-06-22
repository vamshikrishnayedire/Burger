import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-website-40e93.firebaseio.com/'
});

export default instance;