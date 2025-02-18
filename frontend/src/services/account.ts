
import { CreateUser, User } from '../types';
import account, { getToken, setToken } from './axios';
import axios from './messenger';

export const login = async(username:string, password:string) => {
    if(username.endsWith('.guest') && password.length == 0)
        password = 'guest'
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const r = await account.post("/login", formData);
    const token:string = r.headers['authorization']
    if(r.status == 200 && token){
        await setToken(token.split(' ')[1])
        return await checkLogin()
    }
}

export const logout = async() => {
    await setToken(null)
    return await account.get("/logout")
}

export const guestLogin =  async() => {
    return await login('guest', 'guest')
}

const checkLoginToken = async () => {
    const value = (await account.get('/api/v1/user/?self=true'))?.data?.value;
    if (value) {
      return value[0] as User;
    }
    return null;
  };

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
    await account.post(`/api/v1/user/`, {
        imageUrl:user.imageUrl,
        inviteGroupId: user.inviteGroupId,
        isAdmin: user.is_staff,
        isGuest: user.is_guest,
        name: user.name,
        password: user.password,
        username: user.username
    })
}

export const patchUser = async (user:{id:number, name:string, is_guest?:boolean, username?:string, password?:string})=>{
    await account.patch(`/api/v1/user/`, {ids:[user.id], updated: {
        name:user.name, 
        isGuest:user.is_guest,
        username:user.username,
        password:user.password,
    }})
}

export const deleteUser = async (userId:number)=>{
    await account.delete(`/api/v1/user/${userId}/`)
}

export const getExternalUserList = async (username:string)=>{
    return (await axios.get(`/api/v1/users/?username=${username}`) ).data as User[]
}