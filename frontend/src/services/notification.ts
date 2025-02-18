import { Notification } from '../types';
import axios from './messenger';

export const getNotification = async (user_id:number)=>{
    const data = (await axios.get(`/api/v1/notifications/?type=WEB&user=${user_id}`) ).data as Notification[]
    return data.length?data[0]:undefined
}

export const postNotification = async(notification:Notification)=>{
    return (await axios.post(`/api/v1/notifications/`, notification)).data as Notification
}

export const putNotification = async(notification:Notification)=>{
    return (await axios.put(`/api/v1/notifications/${notification.id}/`, notification)).data as Notification
}