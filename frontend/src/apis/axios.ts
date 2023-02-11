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
            AsyncStorage.getItem("Authorization").then(refreshToken)
        }
        return Promise.reject(error)
    }
)

export const refreshToken = async(token:string|null)=>{
    const r = await _axios.post("/api-token-refresh/", {token}, {headers:{'Authorization':''}})
    if (r.status == 200 && r.data !== ''){
        await AsyncStorage.setItem("Authorization", r.data)
        return r.data
    }
    return ''
}

export default _axios
