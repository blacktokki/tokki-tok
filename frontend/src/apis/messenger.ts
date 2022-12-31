import { Board, EditBoard, BoardContent, Channel, MessengerMember, MessengerContent, EditMessage, MessengerChannel } from '../types';
import axios from './axios';

export const getBoardChannelList = async (group_id:number)=>{
    return (await axios.get(`/api/v1/channels/?type=board&group=${group_id}`) ).data as Channel[]
}

export const getMessengerChannelList = async (user_id:number)=>{
    return (await axios.get(`/api/v1/channels/messenger/?type=messenger&messenger_user_id=${user_id}`) ).data as MessengerChannel[]
}

export const postChannel = async(channel:Channel)=>{
    return (await axios.post(`/api/v1/channels/`, channel)).data as Channel
}

export const putChannel = async(channel:Channel)=>{
    return (await axios.put(`/api/v1/channels/${channel.id}/`, channel)).data as Channel
}

export const deleteChannel = async(channel_id:number)=>{
    await axios.delete(`/api/v1/channels/${channel_id}/`)
}

export const getBoardContentList = async (channel_id:number)=>{
    return (await axios.get(`/api/v1/boardcontents/?channel=${channel_id}`) ).data as BoardContent[]
}

export const postBoard = async (board:EditBoard)=>{
    await axios.post(`/api/v1/boardcontents/boards/`, board)
}

export const patchBoard = async (board:Board)=>{
    await axios.patch(`/api/v1/boardcontents/${board.id}/board/`, board)
}

export const deleteBoardContent = async (content_id:number)=>{
    await axios.delete(`/api/v1/boardcontents/${content_id}/`)
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
    await axios.post(`/api/v1/messengercontents/messages/`, message)
}

export const deleteMessengerContent = async (content_id:number)=>{
    await axios.delete(`/api/v1/messengercontents/${content_id}/`)
}