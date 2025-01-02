import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import useResizeContext from '../../hooks/useResizeContext';
import CommonChatSection from './CommonChatSection';
import useChatSection from '../../hooks/useChatSection';


export default function NoteScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const windowType = useResizeContext()
  const [isEditor, setIsEditor] = useState<boolean>(false)
  useChatSection(navigation, route, channel_id, 'mycontent', isEditor)
  return <CommonChatSection
      channel_id={channel_id} 
      isEditor={isEditor} 
      setIsEditor={setIsEditor} 
      style={[{flex:1}, windowType=='landscape'?{minWidth:320, height:'100%'}:{width:'100%'}]}
  />
}