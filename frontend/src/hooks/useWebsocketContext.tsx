import React, { createContext, useContext } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
import { Auth } from "./useAuthContext";

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  const { lastJsonMessage, sendJsonMessage } = useWebSocket('ws://localhost:8000/ws/',{
    shouldReconnect: (closeEvent) => true
  })
  return disable?<>{children}</>:<WebSocketContext.Provider value={{lastJsonMessage, sendJsonMessage}}>
    {children}
  </WebSocketContext.Provider>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

