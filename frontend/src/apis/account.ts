
import { User, UserMembership } from '../types';
import axios, { getToken, setToken } from './axios';
import {accountURL as baseURL} from '../constants/Envs'

export const login = async(username:string, password:string) => {
    if(username.endsWith('.guest') && password.length == 0)
        password = 'guest'
    const r = await axios.post("/api-token-auth/", {username, password});
    if(r.status == 200){
        await setToken(r.data)
        return await checkLogin()
    }
}

export const logout = async() => {
    await setToken(null)
    return await axios.get("/api-auth/logout/")
}

export const guestLogin =  async() => {
    return await login('guest', 'guest')
}

const checkLoginToken = async ()=>{
    const value = (await axios.get("/api/v1/users/memberships/?_self=true"))?.data
    if (value && value.length){
        return value[0] as UserMembership
    }
    return null
}

export const checkLogin = async() => {
    const token = await getToken()
    if (token === null)
        return null
    try{
       return await checkLoginToken()
    }
    catch(e:any){
        let error = e
        if(e.response !== undefined && e.response.status==401){
            try{
                return await checkLoginToken()
            }
            catch(e2){
                error = e2
            }
        }
        const isOffline = ((error as any).code == "ERR_NETWORK" || (error as any).message && ((error as any).message as string).startsWith("Cannot read"))
        throw {error, isOffline}
    }
}

export const getUserList = async (group_id:number)=>{
    return (await axios.get(`/api/v1/users/?group_id=${group_id}`) ).data as User[]
}

export const patchUser = async (user:{id:number, name:string})=>{
    await axios.patch(`/api/v1/user/`, {ids:[user.id], updated: {name:user.name}}, {baseURL})
}

export const patchUserGroup = async (body:{user_ids:number[], invite_group_id?:number, leave_group_id?:number})=>{
    await axios.patch(`/api/v1/user/`, {ids:body.user_ids, updated: {inviteGroupId:body.invite_group_id, leaveGroupId:body.leave_group_id}}, {baseURL})
}

export const getUserMembershipList = async (group_id:number)=>{
    return (await axios.get(`/api/v1/users/memberships/?group_id=${group_id}`) ).data as UserMembership[]
}

export const getExternalMembershipList = async (username:string)=>{
    return (await axios.get(`/api/v1/users/memberships/?username=${username}`) ).data as UserMembership[]
}