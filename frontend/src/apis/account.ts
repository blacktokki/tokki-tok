
import { User, UserMembership } from '../types';
import axios from './axios';

export const login = async(username:string, password:string) => {
    const r = await axios.get("/csrf/")
    var bodyFormData = new FormData();
    bodyFormData.append('csrfmiddlewaretoken', r.data)
    bodyFormData.append('username', username)
    bodyFormData.append('password', password)
    bodyFormData.append('submit', 'Log in')
    const r2 = await axios.post("/api-auth/login/", bodyFormData, {headers: {"Content-Type": "multipart/form-data"}})
    if(r2.status == 200){
        return await checkLogin()
    }
}

export const logout = async() => {
    return await axios.get("/api-auth/logout/")
}

export const guestLogin =  async() => {
    return await login('guest', 'guest')
}

export const checkLogin = async() => {
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

