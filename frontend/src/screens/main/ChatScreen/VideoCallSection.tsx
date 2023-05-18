import React, {useEffect, useState} from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../../../constants/Colors';
import {default as useRtcContext, WebSocketProvider as RtcProvider} from "../../../lib/react-native-webrtc/useWebsocketContext";
import LocalCam from '../../../lib/react-native-webrtc/LocalCam';
import RemoteCam from '../../../lib/react-native-webrtc/RemoteCam';
import VirtualCam from '../../../lib/react-native-webrtc/VirtualCam';
import useResizeWindow from '../../../hooks/useResizeWindow';
import useAuthContext from '../../../hooks/useAuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonButton from '../../../components/TextButton';
import { Text } from '../../../components/Themed';

export type VideoType = 'camera'|'display'|'virtual'
type VideoCallProps = {channel_id:number, videoMode:VideoType|null}


const VideoView = (props:{
  scale:string,
  focusGuest?:string,
  setFocusGuest:(focusGuest?:string)=>void
  receiver?:string
  useBackButton?:boolean,
  children:React.ReactNode
})=>{
  const activeBackButton = props.useBackButton && props.focusGuest!=undefined
  const buttonStyle:StyleProp<ViewStyle> = [
    {position:'absolute', right:0},
    activeBackButton?{width:'10%', height:'10%', borderWidth:1}:{width:'100%', height:'100%'}
  ]
  return <View style={[{maxWidth:props.scale, maxHeight:props.scale, borderWidth:1, borderColor:Colors.borderColor, backgroundColor:'gray', flexDirection:'row'}, (props.focusGuest == undefined || props.focusGuest == props.receiver)?{}:{width:0, height:0}]}>
      {props.children}
      {/* {<CommonButton style={{position:'absolute', right:0}} title={"🔙"} onPress={()=>props.setFocusGuest(undefined)}/>} */}
      <TouchableOpacity style={buttonStyle} containerStyle={buttonStyle} onPress={()=>props.setFocusGuest(props.focusGuest?undefined:props.receiver)}>
        {activeBackButton && <Text style={{textAlign:'center', textAlignVertical:'center'}}>🔙</Text>}
      </TouchableOpacity>
  </View>
}

const VideoCallContainer = ({channel_id, videoMode}:VideoCallProps)=>{
    const {auth} = useAuthContext()
    const [guests, setGuests] = useState<string[]>([])
    const [focusGuest, setFocusGuest] = useState<string>()
    const windowType = useResizeWindow()
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

    return lastJsonMessage !==undefined ?<View style={[
        {aspectRatio:16/9, backgroundColor:'white', flexWrap:'wrap', flexDirection:'row'},
        windowType=='landscape'?{height:'100%'}:{maxHeight:'100%'}
      ]}>
        {guests.map((receiver, i)=><VideoView scale={scale} focusGuest={focusGuest} setFocusGuest={setFocusGuest} receiver={receiver}>
            <RemoteCam receiver={receiver}/>
          </VideoView>
          )}
          <VideoView scale={scale} focusGuest={focusGuest} setFocusGuest={setFocusGuest} receiver={auth.user?.name} useBackButton>
            {videoMode=='virtual'?<VirtualCam mode={'virtual'}/>:<LocalCam user={auth.user} mode={videoMode}/>}
          </VideoView>
      </View>:<></>
  }
  
export default React.memo(({channel_id, videoMode}:VideoCallProps)=>{
    return <RtcProvider disable={videoMode==null}>
      <VideoCallContainer channel_id={channel_id} videoMode={videoMode}/>
    </RtcProvider>
  })
  {/* <ScrollView style={{flex:1, padding:10, backgroundColor:'white'}} contentContainerStyle={{
      flexWrap:'wrap',
      width:'100%',
      flexDirection:windowType=='landscape'?'column':'row'
    }}></ScrollView> */}