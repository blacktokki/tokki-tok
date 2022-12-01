import React, { createContext, useContext } from "react"
import useWebSocket from "react-use-websocket"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"

const WebSocketContext = createContext<{lastJsonMessage:any, sendJsonMessage:SendJsonMessage }>({lastJsonMessage:null, sendJsonMessage:()=>{}});

const WebSocketProviderInternal = ({children}:{children:React.ReactNode})=>{
  const { lastJsonMessage, sendJsonMessage } = useWebSocket('ws://localhost:9000/messenger/ws/',{
    shouldReconnect: (closeEvent) => true
  })
  return <WebSocketContext.Provider value={{lastJsonMessage, sendJsonMessage}}>
  {children}
</WebSocketContext.Provider>
}

export const WebSocketProvider = ({disable, children}:{disable?:boolean, children:React.ReactNode})=>{
  return disable?<>{children}</>:<WebSocketProviderInternal>
    {children}
  </WebSocketProviderInternal>
}

export default ()=>{
  const webSocketContext = useContext(WebSocketContext)
  return webSocketContext
}

