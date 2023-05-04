import React, { useEffect } from "react";
import {Button, View, Text} from "react-native";
import useAuthContext from "../../hooks/useAuthContext";

import useWebsocketContext from "./useWebsocketContext";
import { useLocalCam, camStyle} from "./webrtc";


export default (props:{isPlay?:boolean})=>{
  console.log(props.isPlay)
  const {auth} = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, renderRTCView, isPlay} = useLocalCam(sendJsonMessage)
  useEffect(()=>{
    auth.user && lastJsonMessage && websocketOnMessage(lastJsonMessage, auth.user)
  }, [lastJsonMessage, auth])
  useEffect(()=>{
    if(props.isPlay){
      auth.user && start(auth.user)
    }
    else if(props.isPlay!==undefined && props.isPlay==false){
      stop()
    }
  }, [auth, props.isPlay])
  return (
    <View style={camStyle.container}>
      {renderRTCView(camStyle.cam)}
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
          {/* <Text style={{flex:1}}>Username: {auth.user?.username}</Text> */}
        </View>
        <View style={camStyle.buttonBar}>
          {props.isPlay === undefined && !isPlay && <Button title="Start" onPress={()=>auth.user && start(auth.user)} />}
          {props.isPlay === undefined && isPlay && <Button title="Stop" onPress={stop} />}
        </View>
      </View>
    </View>
  );
}
