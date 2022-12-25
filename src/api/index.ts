import axios from 'axios';
import { setAuth, setUser } from '../store/userSlice';
import { store } from '../store';



export const API_URL = `https://${window.location.host.split(':')[0]}:7000/api`;
const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});



$api.interceptors.request.use((config: any) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

$api.interceptors.response.use((config) => {
    //const { dispatch } = store;
    //dispatch(setAuth(true));
    //console.log('config',config)
    return config;
}, async (error) => {
    const { dispatch } = store;
    const originalRequest = error.config;
    if(error.response.status === 401 && error.config && !error.config._isRetry){
        try {
            originalRequest._isRetry = true;
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true,});
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return $api.request(originalRequest);
        } catch (error) {
            console.log('НЕ АВТОРИЗОВАН');
            dispatch(setAuth(false));
        }
    }
    if(error.config._isRetry){
        dispatch(setAuth(false));
    }
    if(error.response.status == 400){
        throw error;
    }
})

export default $api;
