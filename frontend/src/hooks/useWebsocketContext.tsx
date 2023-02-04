import React, { createContext, useContext, useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
// @ts-ignore
import {API_URL} from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')

const WebSocketProviderInternal = ({token, children}:{token:string, children:React.ReactNode})=>{
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(`${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}/messenger/ws/`,{
    shouldReconnect: (closeEvent) => true,
    protocols: ['Authorization', token]
  })
  return <WebSocketContext.Provider value={{lastJsonMessage, sendJsonMessage}}>
  {children}
</WebSocketContext.Provider>
}

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  const [token, setToken] = useState<string|null>(null)
  useEffect(()=>{
    if(disable)
      setToken(null)
    else
      AsyncStorage.getItem('Authorization').then(setToken)
  },[disable])
  return (disable || token==null)?<>{children}</>:<WebSocketProviderInternal token={token}>
    {children}
  </WebSocketProviderInternal>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

