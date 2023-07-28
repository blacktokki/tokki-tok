import React, { Context, createContext,  useContext, useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
import {websockerURL } from "../constants/Envs"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";

type WebsocketContextType = {lastJsonMessage:any, sendJsonMessage:SendJsonMessage }
const defaultContext = {lastJsonMessage:undefined, sendJsonMessage:()=>{}}
const WebSocketContext = createContext<WebsocketContextType>(defaultContext);

export const WebSocketInternalProvider = ({children, path, Context, useBackground}:{children:React.ReactNode, path:string, Context:Context<WebsocketContextType>, useBackground?:boolean})=>{
  const [token, setToken] = useState<string|null>(null)
  const [isActive, setIsActive] = useState<boolean>(useBackground || AppState.currentState == 'active')
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${websockerURL}/${path}`,{
    shouldReconnect: (closeEvent) => true,
    protocols: token?['Authorization',  token]:undefined,
    onOpen: (e)=>{console.log(`success websocket connection(${path})`)},
    onClose: (e)=> {console.log(`closed websocket connection(${path})`)},
  }, isActive && token!=null)
  useEffect(()=>{
    AsyncStorage.getItem('Authorization').then(setToken)
    const onChange = (nextState:AppStateStatus)=>setIsActive(useBackground || nextState == 'active')
    const listener = AppState.addEventListener("change", onChange)
    return ()=> listener.remove()
  }, [])
  return <Context.Provider value={token!=null?{lastJsonMessage, sendJsonMessage}:defaultContext}>
      {children}
    </Context.Provider>
}

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  return disable?<>{children}</>:<WebSocketInternalProvider path={'messenger/ws/'} Context={WebSocketContext}>
    {children}
  </WebSocketInternalProvider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

