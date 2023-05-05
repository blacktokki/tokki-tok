import React, { createContext, MutableRefObject, useContext, useEffect, useMemo, useRef, useState } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
// @ts-ignore
import {API_URL} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";

export type WebsocketContextType = {lastJsonMessage:any, sendJsonMessage:SendJsonMessage }
const WebSocketContext = createContext<WebsocketContextType>({lastJsonMessage:null, sendJsonMessage:()=>{}});
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')

export const WebsocketContainer = (props:{token:string, contextRef:MutableRefObject<WebsocketContextType>, path:string})=>{
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)
  const InternalContainer = useMemo(()=>{
    return appState == 'active'?()=>{
      const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/${props.path}`,{
        shouldReconnect: (closeEvent) => true,
        protocols: ['Authorization', props.token],
        onOpen: (e)=>{console.log('success websocket connection')},
      })
      props.contextRef.current.lastJsonMessage = lastJsonMessage
      props.contextRef.current.sendJsonMessage = sendJsonMessage
      return <></>
    }:()=>{
      props.contextRef.current.lastJsonMessage = undefined
      props.contextRef.current.sendJsonMessage = ()=>{}
      return <></>
    }
  }, [appState])
  useEffect(()=>{
    const onChange = (nextState:AppStateStatus)=>setAppState(nextState)
    AppState.addEventListener("change", onChange)
    return ()=>AppState.removeEventListener("change", onChange)
  })
  return <InternalContainer/>
}


export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  const [token, setToken] = useState<string|null>(null)
  const contextRef = useRef<WebsocketContextType>({lastJsonMessage:undefined, sendJsonMessage:()=>{}})
  useEffect(()=>{
    if(disable)
      setToken(null)
    else
      AsyncStorage.getItem('Authorization').then(setToken)   
  },[disable])

  return (disable || token==null)?<>{children}</>:<WebSocketContext.Provider value={contextRef.current}>
    <WebsocketContainer token={token} contextRef={contextRef} path={'messenger/ws/'}/>
      {children}
    </WebSocketContext.Provider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

