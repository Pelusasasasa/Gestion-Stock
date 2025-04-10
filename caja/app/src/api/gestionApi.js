import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const { VITE_API_GESTIONURL } = getEnvVariables();

const gestorApi = axios.create({
    baseURL: VITE_API_GESTIONURL
});

export default gestorApi;