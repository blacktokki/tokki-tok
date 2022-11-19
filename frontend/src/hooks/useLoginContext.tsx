import React, { createContext, useContext, useEffect, useState } from "react"
import { checkLogin } from "../apis"
import { UserMembership } from "../types"

const LoginContext = createContext<{user?:UserMembership|null, setUser:(user?:UserMembership|null)=>void}>({setUser:()=>{}});


export const LoginProvider = ({children}:{children:React.ReactNode})=>{
  const [user, setUser] = useState<UserMembership|null>();
  useEffect(()=>{
    if(user===undefined){
      checkLogin().then((user)=>{
        setUser(user)
      }).catch((e)=>{
        console.log(e)
        setUser(null)
      })
    }
  }, [user])
  return <LoginContext.Provider value={{user, setUser}}>
    {children}
  </LoginContext.Provider>
}

export default ()=>{
  const user = useContext(LoginContext)
  return user
}
