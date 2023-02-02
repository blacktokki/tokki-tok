
import { User, UserMembership } from '../types';
import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async(username:string, password:string) => {
    if(username.endsWith('.guest') && password.length == 0)
        password = 'guest'
    const r = await axios.post("/api-token-auth/", {username, password});
    if(r.status == 200){
        await AsyncStorage.setItem("Authorization", r.data)
        return await checkLogin()
    }
}

export const logout = async() => {
    axios.defaults.headers['Authorization'] = ''
    await AsyncStorage.removeItem("Authorization")
    return await axios.get("/api-auth/logout/")
}

export const guestLogin =  async() => {
    return await login('guest', 'guest')
}

export const checkLogin = async() => {
    axios.defaults.headers['Authorization'] = `JWT ${await AsyncStorage.getItem("Authorization")}`
    try{
        const value = (await axios.get("/api/v1/users/memberships/?_self=true"))?.data
        if (value && value.length){
            return value[0] as UserMembership
        }
        return null
    }
    catch(e){
        throw {
            error:e,
            isOffline:((e as any).code == "ERR_NETWORK" || (e as any).message && ((e as any).message as string).startsWith("Cannot read"))
        }
    }
}

export const getUserList = async (group_id:number)=>{
    return (await axios.get(`/api/v1/users/?group_id=${group_id}`) ).data as User[]
}

export const getUserMembershipList = async (group_id:number)=>{
    return (await axios.get(`/api/v1/users/memberships/?group_id=${group_id}`) ).data as UserMembership[]
}

// export const getGroup = async (user:User)=>{
//     return (await) axios.get(``)
// }

