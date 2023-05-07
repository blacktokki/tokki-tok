import React, { useState, useEffect, } from "react";
import {Button,Text, TextInput, View} from "react-native";
import useWebsocketContext from "./useWebsocketContext";
import { useRemoteCam, camStyle} from "./webrtc";

export default (props:{user?:{username:string, name:string}})=>{
  const [username, setUsername] = useState('')
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, CustomRTCView, isPlay} = useRemoteCam(sendJsonMessage)
  useEffect(()=>{
    lastJsonMessage && websocketOnMessage(lastJsonMessage)
  }, [lastJsonMessage])
  useEffect(()=>{
    if(props.user){
      start(props.user.username)
    }
    return ()=>stop()
  }, [props.user])
  return (
    <View style={camStyle.container}>
      <CustomRTCView style={camStyle.cam}/>
      <View style={camStyle.bottonContainer}>
        <View style={camStyle.buttonBar}>
        </View>
        {(props.user ===undefined || isPlay) &&
          <View style={{flexDirection:'row'}}>{
            (props.user || isPlay)?
            <Text style={camStyle.label}>{props.user?.name||username}</Text>:
            <>
              <Text style={{borderWidth:1}}>Username:&nbsp;</Text>
              <TextInput style={{borderWidth:1, flex:1}} value={username} onChangeText={setUsername}/>
            </> 
          }</View>}
        <View style={camStyle.buttonBar}>
          {props.user === undefined && !isPlay && <Button title="Start" onPress={()=>start(username)} />}
          {props.user === undefined && isPlay && <Button title="Stop" onPress={stop} />}
        </View>
      </View>
    </View>
  );
}

