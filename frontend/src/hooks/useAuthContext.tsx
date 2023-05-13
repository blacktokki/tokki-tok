import React, { createContext, useContext, useEffect, useReducer, useMemo, Dispatch } from "react"
import { checkLogin, login, logout } from "../apis"
import { getNotification, putNotification } from "../apis/notification"
import { UserMembership } from "../types"

type AuthAction = {type:string, username?:string, password?:string, user?:UserMembership|null}

export type Auth = {user?:UserMembership|null, groupId?:number}

type AuthState ={user?:UserMembership|null, request?:{username:string, password:string}|null}

const AuthContext = createContext<{auth:Auth, dispatch:Dispatch<AuthAction>}>({auth:{}, dispatch:()=>{}});

const authReducer =(initialState:AuthState, action:AuthAction)=>{
  switch (action.type){
      case 'LOGIN_REQUEST':
        return {
          ...initialState,
          request:{username:action.username, password:action.password},
        } as AuthState
      case 'LOGIN_GUEST':
        return {
          ...initialState,
          request:{username:'guest', password:'guest'},
        } as AuthState
      case 'LOGIN_SUCCESS':
          return{
              ...initialState,
              user:action.user,
              request:undefined
          }
      case 'LOGIN_FAILED':
          return{
              ...initialState,
              request:undefined
          }
      case 'LOGOUT_REQUEST':
          return{
              ...initialState,
              request:null
          }
      case 'LOGOUT_SUCCESS':
          return {
            ...initialState,
            user:null,
            request:undefined
          }
      case 'REFRESH':
        return {
          ...initialState,
          user:undefined
        }
      default:
          throw new Error( `Unhandled action type: ${action.type}`)
  }
}


export const AuthProvider = ({children}:{children:React.ReactNode})=>{
  const [authState, dispatch] = useReducer(authReducer, {} as Auth)
  const auth = useMemo(()=>({
    user:authState.user,
    groupId: authState.user?.membership_set.find(g=>g.root_group_id==null)?.group
  }), [authState])
  useEffect(()=>{
    if(authState.user===undefined){
      checkLogin().then((user)=>{
        dispatch({type:"LOGIN_SUCCESS", user})
      }).catch((e)=>{
        console.log(e)
        dispatch({type:"LOGOUT_SUCCESS"})
      })
    }
    else if(authState.user===null && authState.request){
      login(authState.request.username, authState.request.password).then(user=>{
        dispatch({type:"LOGIN_SUCCESS", user})
      }).catch(()=>{
        dispatch({type:"LOGIN_FAILED"})
      })
    }
    else if(authState.user && authState.request===null){
      getNotification(authState.user.id).then(noti=>{
        noti && putNotification({...noti, token:''}).then(()=>{
          logout().then(()=>dispatch({type:"LOGOUT_SUCCESS"}))
        })
      })
    }
  }, [authState])
  return <AuthContext.Provider value={{auth, dispatch}}>
    {children}
  </AuthContext.Provider>
}

export default ()=>{
  const authContext = useContext(AuthContext)
  return authContext
}
