import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const gestorApi = async () => {

    const { VITE_API_GESTIONURL } = await getEnvVariables();

    return axios.create({
        baseURL: VITE_API_GESTIONURL
    });
}


export default gestorApi;