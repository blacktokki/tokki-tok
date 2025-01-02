import React, { useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'react-native';
import VideoCallSection from './VideoCallSection';
import useResizeContext from '../../../hooks/useResizeContext';
import useLangContext from '../../../hooks/useLangContext';
import CommonChatSection from '../CommonChatSection';
import useChatSection from '../../../hooks/useChatSection';


export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const windowType = useResizeContext()
  const { lang } = useLangContext()
  const [isEditor, setIsEditor] = useState<boolean>(false)
  const [videoMode, setVideoMode] = useState<boolean>(false)
  useChatSection(navigation, route, channel_id, 'messenger', isEditor)
  
  return <View style={[
    {flex:1, alignItems:'center'},
    windowType=='landscape'?{flexDirection:'row-reverse', minWidth:480}:{flexDirection:'column'}
  ]}>
    <VideoCallSection channel_id={channel_id} setDisable={(d)=>setVideoMode(!d)} disable={!videoMode}/>
    <CommonChatSection 
      channel_id={channel_id} 
      isEditor={isEditor} 
      setIsEditor={setIsEditor} 
      style={[videoMode?{flexShrink:1}:{flex:1}, windowType=='landscape'?{minWidth:320, height:'100%'}:{width:'100%'}]}
      extraButtons={[{title:`📹\n ${lang('Video Call')}`, onPress:()=>setVideoMode(!videoMode), disabled:videoMode}]}
    />
  </View>
}