import React, { useState } from 'react';
import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import useResizeContext from '../../../hooks/useResizeContext';
import CommonChatSection from '../CommonChatSection';
import useChatSection from '../../../hooks/useChatSection';
import EditorSection from './EditorSection';


export default function NoteScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const windowType = useResizeContext()
  const [editMode, setEditMode] = useState<boolean>(true)
  useChatSection(navigation, route, channel_id, 'mycontent', true)
  return <View style={[
        {flex:1, alignItems:'center'},
        windowType=='landscape'?{flexDirection:'row-reverse', minWidth:480}:{flexDirection:'column'}
      ]}>
    <EditorSection channel_id={channel_id}  setDisable={(d)=>setEditMode(!d)} disable={!editMode}/>
    {editMode==false && <CommonChatSection
        channel_id={channel_id}
        style={[{flex:1}, windowType=='landscape'?{minWidth:320, height:'100%'}:{width:'100%'}]}
    />}
  </View>
}