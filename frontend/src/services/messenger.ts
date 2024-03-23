import { Channel, MessengerMember, MessengerContent, EditMessage, MessengerChannel, EditMessengerContent } from '../types';
import axios from './axios';

export const getChannelList = async (type:string, user_id?:number)=>{
    if(user_id==undefined)
        return Promise.resolve(null)
    return (await axios.get(`/api/v1/channels/messenger/?type=${type}&messenger_user_id=${user_id}`) ).data as MessengerChannel[]
}

export const postChannel = async(channel:Channel)=>{
    return (await axios.post(`/api/v1/channels/`, channel)).data as Channel
}

export const postDirectChannel = async(channel:Channel)=>{
    return (await axios.post(`/api/v1/channels/direct/`, channel)).data as Channel
}

export const putChannel = async(channel:Channel)=>{
    return (await axios.put(`/api/v1/channels/${channel.id}/`, channel)).data as Channel
}

export const deleteChannel = async(channel_id:number)=>{
    await axios.delete(`/api/v1/channels/${channel_id}/`)
}

export const getMessengerMemberList = async(channel_id:number)=>{
    try{
        return (await axios.get(`/api/v1/messengermembers/?channel=${channel_id}`) ).data as MessengerMember[]
    }
    catch(e:any){
        if (e.response.status==400 || e.response.status==403)
            return Promise.resolve(null)
        throw e
    }
}

export const postBulkMessengerMember = async(data:{channel_id:number, user_ids:number[]})=>{
    await axios.post(`/api/v1/messengermembers/bulk/`, {channel:data.channel_id, user_ids:data.user_ids})
}

export const deleteMessengerMember = async(member_id:number)=>{
    await axios.delete(`/api/v1/messengermembers/${member_id}/`)
}

export const getMessengerContentList = async (channel_id:number, id_lt?:number, isViewer?:boolean)=>{
    const id_lt_param = id_lt?`&id_lt=${id_lt}`:''
    const viewerPath = isViewer?'viewer/':''
    return (await axios.get(`/api/v1/messengercontents/${viewerPath}?limit=30&channel=${channel_id}${id_lt_param}`)).data.results as MessengerContent[]
}

export const getNewMessengerContentList = async (channel_id:number, updated_gte:string)=>{
    return (await axios.get(`/api/v1/messengercontents/?channel=${channel_id}&with_archive=true&updated_gte=${updated_gte}`)).data as MessengerContent[]
}

export const getTimerMessageContentList = async (channel_id:number, timer_gt:string)=>{
    return (await axios.get(`/api/v1/messengercontents/?channel=${channel_id}&timer_gt=${timer_gt}`)).data as MessengerContent[]
}

export const postMessage = async (message:EditMessage, callback?:(args:{channel:number, filename:string, progress:number})=>void)=>{
    if (message.file){
        const formData = new FormData(); // formData 객체를 생성한다.
        formData.append("file", message.file)
        Object.entries(message).forEach(value=>{
            formData.append(value[0], `${value[1]}`)
        })
        const filename = message.file.name
        await axios.post(`/api/v1/messengercontents/messages/`, formData, {
            headers:{
                ...(axios.defaults.headers as any), "Content-Type": "multipart/form-data",
            },
            onUploadProgress:(p)=>{
                callback?.({channel:message.channel, filename, progress:p.loaded/(p.total || 1)})
            }
        })
    }
    else{
        await axios.post(`/api/v1/messengercontents/messages/`, message)
    }
}

export const patchMessengerContent = async (content:EditMessengerContent)=>{
    return (await axios.patch(`/api/v1/messengercontents/${content.id}/`, content)).data as MessengerContent
}
