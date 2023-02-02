import axios, { AxiosRequestConfig } from 'axios';
// @ts-ignore
import {API_URL} from "@env"

const defaultOption:AxiosRequestConfig = {
    baseURL: `${API_URL}/messenger/`,
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
            // redirect login
        }
        return Promise.reject(error)
    }
)

export default _axios
