import React, { createContext, useContext } from "react"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { WebSocketInternalProvider } from "../../hooks/useWebsocketContext";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  return <WebSocketInternalProvider disable={disable} path={'messenger/ws/rtc/'} Context={WebSocketContext} useBackground>
    {children}
  </WebSocketInternalProvider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

