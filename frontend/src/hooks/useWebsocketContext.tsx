import React, { Context, createContext,  useContext, useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
// @ts-ignore
import {API_URL} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";

type WebsocketContextType = {lastJsonMessage:any, sendJsonMessage:SendJsonMessage }
const WebSocketContext = createContext<WebsocketContextType>({lastJsonMessage:null, sendJsonMessage:()=>{}});
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')

export const WebSocketInternalProvider = ({disable, children, path, Context, useBackground}:{disable?:boolean, children:React.ReactNode, path:string, Context:Context<WebsocketContextType>, useBackground?:boolean})=>{
  const [token, setToken] = useState<string|null>(null)
  const [isActive, setIsActive] = useState<boolean>(useBackground || AppState.currentState == 'active')
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/${path}`,{
    shouldReconnect: (closeEvent) => true,
    protocols: token?['Authorization',  token]:undefined,
    onOpen: (e)=>{console.log(`success websocket connection(${path})`)},
  }, isActive)
  useEffect(()=>{
    const onChange = (nextState:AppStateStatus)=>setIsActive(useBackground || nextState == 'active')
    AppState.addEventListener("change", onChange)
    return ()=>AppState.removeEventListener("change", onChange)
  })
  useEffect(()=>{
    if(disable)
      setToken(null)
    else
      AsyncStorage.getItem('Authorization').then(setToken)   
  },[disable])

  return (disable || token==null)?<>{children}</>:<Context.Provider value={{lastJsonMessage, sendJsonMessage}}>
      {children}
    </Context.Provider>
}

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  return <WebSocketInternalProvider disable={disable} path={'messenger/ws/'} Context={WebSocketContext}>
    {children}
  </WebSocketInternalProvider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

