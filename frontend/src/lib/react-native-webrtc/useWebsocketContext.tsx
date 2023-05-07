import React, { createContext, useContext } from "react"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { WebSocketInternalProvider } from "../../hooks/useWebsocketContext";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:undefined, sendJsonMessage:()=>{}});

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  return disable?<></>:<WebSocketInternalProvider path={'messenger/ws/rtc/'} Context={WebSocketContext} useBackground>
    {children}
  </WebSocketInternalProvider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

