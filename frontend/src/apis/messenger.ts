import { Channel, MessengerMember, MessengerContent, EditMessage, MessengerChannel, DirectChannel } from '../types';
import axios from './axios';

export const getMessengerChannelList = async (user_id:number)=>{
    return (await axios.get(`/api/v1/channels/messenger/?type=messenger&messenger_user_id=${user_id}`) ).data as MessengerChannel[]
}

export const postChannel = async(channel:Channel)=>{
    return (await axios.post(`/api/v1/channels/`, channel)).data as Channel
}

export const postDirectChannel = async(channel:DirectChannel)=>{
    return (await axios.post(`/api/v1/channels/direct/`, channel)).data as Channel
}

export const putChannel = async(channel:Channel)=>{
    return (await axios.put(`/api/v1/channels/${channel.id}/`, channel)).data as Channel
}

export const deleteChannel = async(channel_id:number)=>{
    await axios.delete(`/api/v1/channels/${channel_id}/`)
}

export const getMessengerMemberList = async(channel_id:number)=>{
    return (await axios.get(`/api/v1/messengermembers/?channel=${channel_id}`) ).data as MessengerMember[]
}

export const postBulkMessengerMember = async(data:{channel_id:number, user_ids:number[]})=>{
    await axios.post(`/api/v1/messengermembers/bulk/`, {channel:data.channel_id, user_ids:data.user_ids})
}

export const deleteMessengerMember = async(member_id:number)=>{
    await axios.delete(`/api/v1/messengermembers/${member_id}/`)
}

export const getMessengerContentList = async (channel_id:number, id_lt?:number)=>{
    const id_lt_param = id_lt?`&id_lt=${id_lt}`:''
    return (await axios.get(`/api/v1/messengercontents/?limit=30&channel=${channel_id}${id_lt_param}`)).data.results as MessengerContent[]
}

export const postMessage = async (message:EditMessage)=>{
    if (message.file){
        const formData = new FormData(); // formData 객체를 생성한다.
        formData.append("file", message.file)
        Object.entries(message).forEach(value=>{
            formData.append(value[0], `${value[1]}`)
        })
        await axios.post(`/api/v1/messengercontents/messages/`, formData, {headers:{
            ...(axios.defaults.headers as any), "Content-Type": "multipart/form-data",
        }})
    }
    else{
        await axios.post(`/api/v1/messengercontents/messages/`, message)
    }
}

export const deleteMessengerContent = async (content_id:number)=>{
    await axios.delete(`/api/v1/messengercontents/${content_id}/`)
}