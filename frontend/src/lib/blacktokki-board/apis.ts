import axios from "../../apis/axios"
import { Channel } from "../../types"
import { Board, BoardContent, EditBoard } from "./types"


export const getBoardChannelList = async (group_id:number)=>{
    return (await axios.get(`/api/v1/channels/?type=board&group=${group_id}`) ).data as Channel[]
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