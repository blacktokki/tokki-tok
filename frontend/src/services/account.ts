
import { CreateUser, User } from '../types';
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
    const value = (await axios.get("/api/v1/users/?_self=true"))?.data
    if (value && value.length){
        return value[0] as User
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

export const getUserList = async ()=>{
    return [] as User[]
}

export const postUser = async (user:CreateUser)=>{
    await axios.post(`/api/v1/user/`, {
        imageUrl:user.imageUrl,
        inviteGroupId: user.inviteGroupId,
        isAdmin: user.is_staff,
        isGuest: user.is_guest,
        name: user.name,
        password: user.password,
        username: user.username
    }, {baseURL})
}

export const patchUser = async (user:{id:number, name:string, is_guest?:boolean, username?:string, password?:string})=>{
    console.log(user)
    await axios.patch(`/api/v1/user/`, {ids:[user.id], updated: {
        name:user.name, 
        isGuest:user.is_guest,
        username:user.username,
        password:user.password,
    }}, {baseURL})
}

export const deleteUser = async (userId:number)=>{
    await axios.delete(`/api/v1/user/${userId}/`, {baseURL})
}

export const getExternalUserList = async (username:string)=>{
    return (await axios.get(`/api/v1/users/?username=${username}`) ).data as User[]
}