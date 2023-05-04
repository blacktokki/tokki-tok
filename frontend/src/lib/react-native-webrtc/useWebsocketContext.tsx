import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebsocketContainer, WebsocketContextType } from "../../hooks/useWebsocketContext";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});

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
    <WebsocketContainer token={token} contextRef={contextRef} path={'messenger/ws/rtc/'}/>
      {children}
    </WebSocketContext.Provider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

