import axios, { AxiosRequestConfig } from 'axios';
// @ts-ignore
import {API_URL} from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
const baseURL =  `${API_URL}/messenger/`
const defaultOption:AxiosRequestConfig = {
    baseURL,
    withCredentials: true,
    headers: {}
};
const _axios = axios.create(defaultOption);

_axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

_axios.interceptors.response.use(
    response => {
        // if((response.request.responseURL as string).indexOf('/task/login')>=0 && response.data.length != 0){
        //     // redirect login
        // }
        return response;
    },
    error => {
        if (error.response.status === 401) {
            getToken().then(async(token)=>{
                const r = await _axios.post("/api-token-refresh/", {token}, {headers:{'Authorization':''}})
                if (r.status == 200 && r.data !== ''){
                    setToken(r.data)
                }
            })
        }
        return Promise.reject(error)
    }
)

export const setToken = async (token:string|null)=>{
    _axios.defaults.headers['Authorization'] = `JWT ${token}`
    if (token)
        await AsyncStorage.setItem("Authorization", token)
    else
        AsyncStorage.removeItem("Authorization")
}
export const getToken = async ()=>{
    const token = await AsyncStorage.getItem("Authorization")
    _axios.defaults.headers['Authorization'] = `JWT ${token}`
    return token
}

export default _axios