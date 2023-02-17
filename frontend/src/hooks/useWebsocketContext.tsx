import React, { createContext, useContext, useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
// @ts-ignore
import {API_URL} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')

const WebSocketProviderInternal = ({token, children}:{token:string, children:React.ReactNode})=>{
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/messenger/ws/`,{
    shouldReconnect: (closeEvent) => true,
    protocols: ['Authorization', token],
    onOpen: (e)=>{console.log('success websocket connection')}
  })
  return <WebSocketContext.Provider value={{lastJsonMessage, sendJsonMessage}}>
  {children}
</WebSocketContext.Provider>
}

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  const [token, setToken] = useState<string|null>(null)
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)
  useEffect(()=>{
    if(disable)
      setToken(null)
    else
      AsyncStorage.getItem('Authorization').then(setToken)   
  },[disable])
  useEffect(()=>{
    const onChange = (nextState:AppStateStatus)=>setAppState(nextState)
    AppState.addEventListener("change", onChange)
    return ()=>AppState.removeEventListener("change", onChange)
  })

  return (disable || token==null || appState!='active')?<>{children}</>:<WebSocketProviderInternal token={token}>
    {children}
  </WebSocketProviderInternal>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

