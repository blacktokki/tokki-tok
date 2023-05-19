import React, { useEffect } from "react";
import {Button, View, Text} from "react-native";
import useWebsocketContext from "./useWebsocketContext";
import { useLocalCam, camStyle} from "./webrtc";


export default (props:{user?:{name:string}|null, mode?:'camera'|'display'|null})=>{
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, CustomRTCView, isPlay} = useLocalCam(sendJsonMessage)
  useEffect(()=>{
    props.user && lastJsonMessage && websocketOnMessage(lastJsonMessage, props.user)
  }, [lastJsonMessage, props.user])
  useEffect(()=>{
    if(props.mode && !isPlay){
      props.user && start(props.user, undefined, props.mode)
    }
    else if(props.mode===null && isPlay){
      stop()
    }
    return ()=>{isPlay && stop()}
  }, [isPlay, props.user, props.mode])
  return (
    <View style={camStyle.container}>
      <CustomRTCView style={camStyle.cam}/>
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>  
        </View>
        <View style={{flexDirection:'row'}}><Text style={camStyle.label}>{props.user?.name}</Text></View>
        <View style={camStyle.buttonBar}>
          {props.mode === undefined && !isPlay && <Button title="Start" onPress={()=>props.user && start(props.user)} />}
          {props.mode === undefined && isPlay && <Button title="Stop" onPress={stop} />}
        </View>
      </View>
    </View>
  );
}
