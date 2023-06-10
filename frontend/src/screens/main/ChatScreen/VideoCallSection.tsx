import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { View as ThemedView } from '../../../components/Themed' 
import Colors from '../../../constants/Colors';
import {default as useRtcContext, WebSocketProvider as RtcProvider} from "../../../lib/react-native-webrtc/useWebsocketContext";
import LocalCam from '../../../lib/react-native-webrtc/LocalCam';
import RemoteCam from '../../../lib/react-native-webrtc/RemoteCam';
import useResizeContext from '../../../hooks/useResizeContext';
import useAuthContext from '../../../hooks/useAuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonButton from '../../../components/CommonButton';
import { Ionicons } from '@expo/vector-icons';

type VideoType = 'camera'|'display'|null
type VideoCallProps = {channel_id:number, setDisable:(disable:boolean)=>void, disable?:boolean}


const VideoView = (props:{
  scale:string,
  focusGuest?:string,
  setFocusGuest:(focusGuest?:string)=>void
  receiver?:string
  children:React.ReactNode
})=>{
  return <View style={[{maxWidth:props.scale, maxHeight:props.scale, borderWidth:1, borderColor:Colors.borderColor, backgroundColor:'gray', flexDirection:'row', flexGrow:1}, (props.focusGuest == undefined || props.focusGuest == props.receiver)?{height:'100%'}:{maxWidth:0, height:0}]}>
    <TouchableOpacity style={{flex:1}} containerStyle={{flex:1, justifyContent:'center'}} onPress={()=>props.setFocusGuest(props.focusGuest?undefined:props.receiver)}>
    {props.children}
    </TouchableOpacity>
  </View>
    
  
}

const VideoCallContainer = ({channel_id, disable, setDisable}:VideoCallProps)=>{
  const {auth} = useAuthContext()
  const [videoMode, setVideoMode] = useState<VideoType>(null)
  const [guests, setGuests] = useState<string[]>([])
  const [focusGuest, setFocusGuest] = useState<string>()
  const windowType = useResizeContext()
  const { lastJsonMessage, sendJsonMessage } = useRtcContext()
  useEffect(()=>{
    if(lastJsonMessage !=null){
      if(lastJsonMessage['type']=='connection'){
        sendJsonMessage({'type':'broadcast', 'data':{'channel_id':channel_id}})
      }
      if(lastJsonMessage['type']=='broadcast_guest' || lastJsonMessage['type']=='broadcast_host'){
        setGuests([...guests, lastJsonMessage['sender']])
      }
      if(lastJsonMessage['type']=='broadcast_disconnect'){
        const channel_name = lastJsonMessage['sender']
        const exist = guests.find(v=>v == channel_name)
        exist && setGuests(guests.filter(v=>v != channel_name))
      }
    }
  }, [lastJsonMessage])
  const scale = focusGuest?'100%':`${100 / Math.max(2, Math.ceil(Math.sqrt(guests.length + 1)))}%`
  const toggleVideoMode = (mode:VideoType)=>{
    setVideoMode(videoMode!=mode?mode:null)
  }
  return lastJsonMessage !==undefined ?
    <ThemedView style={[
      {aspectRatio:!disable?16/9:0, borderColor:Colors.borderColor, borderRadius:10},
      windowType=='landscape'?{flexShrink:1, flexGrow:0, height:'100%', borderLeftWidth:1, paddingBottom:65}:{maxHeight:'36%', width:'100%', borderBottomWidth:1}
    ]}>
      <View style={{aspectRatio:focusGuest?undefined:16/9, backgroundColor:'white', flexWrap:'wrap', flexDirection:'row', width:'100%', height:'100%'}}>
        {guests.map((receiver, i)=><VideoView scale={scale} focusGuest={focusGuest} setFocusGuest={setFocusGuest} receiver={receiver}>
          <RemoteCam receiver={receiver}/>
        </VideoView>
        )}
        <VideoView scale={scale} focusGuest={focusGuest} setFocusGuest={setFocusGuest} receiver={auth.user?.name}>
          <LocalCam user={auth.user} mode={videoMode}/>
        </VideoView>
      </View>
      <ThemedView style={[
          {position:'absolute', alignItems:'center', justifyContent:'flex-end', width:'100%',flexDirection:'row'},
          windowType=='landscape'?{bottom:0, paddingTop:15, paddingBottom:10, paddingHorizontal:19}:{backgroundColor:'transparent'}
        ]}>
        <CommonButton title={'⏺️'} style={{height:40, paddingTop:8}} onPress={()=>toggleVideoMode('camera')}/>
        <CommonButton title={'🖥️'} style={{height:40, paddingTop:8}} onPress={()=>toggleVideoMode('display')}/>
        <CommonButton title={''} style={{height:40, paddingTop:8}} onPress={()=>setDisable(true)}>
          <Ionicons size={20} name="arrow-back" color={'deepskyblue'}/>
        </CommonButton>
      </ThemedView>
    </ThemedView>:
  <></>
  }
  
export default React.memo(({channel_id, disable, setDisable}:VideoCallProps)=>{
  return <RtcProvider disable={disable}>
    <VideoCallContainer channel_id={channel_id} disable={disable} setDisable={setDisable}/>
  </RtcProvider>
})
