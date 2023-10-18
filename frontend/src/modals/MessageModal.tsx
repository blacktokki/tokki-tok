import React from 'react';
import Clipboard from '@react-native-clipboard/clipboard/dist';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { BottomSheet } from '../components/ModalSection';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { Ionicons } from '../lib/@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { useMessengerContentMutation } from '../hooks/lists/useMessengerContentList';
import useModalEffect from '../hooks/useModalEffect';
import { EditorContent, MessengerContent } from '../types';
import { regexForStripHTML } from '../components/EditorPreview';



export default function MessageModal({content, isOwner, sendToScreen}:{content:MessengerContent, isOwner:boolean, sendToScreen?:(e:{value:string, editorValue:string})=>void}) {
  const message = content.message_set[0]
  const editorContents = (content.attatchment_set.filter(v=>v.type=='editor') as EditorContent[])
  const editor  = editorContents.length>0?editorContents[0]:undefined
  const fullContent = editor?editor.title.concat('\r\n', editor.description.replaceAll(regexForStripHTML, '')):message.content
  const { lang } = useLangContext()
  const { setModal } = useModalsContext()
  const theme = useColorScheme()
  const contentMutation = useMessengerContentMutation()
  const back = ()=>{
    setModal(MessageModal, null)
  }
  useModalEffect(back, [])
  return <BottomSheet>
    <View style={{flexDirection:'row', width:'100%'}}>
      <View style={{flex:1, flexDirection:'row'}}>
        <TouchableOpacity onPress={back}>
          <Ionicons size={20} name="arrow-back" color={Colors[theme].text}/>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}>
        <Text style={{fontSize:20, textAlign:'center'}}>{lang('Message')}</Text>
      </View>
      <View style={{flex:1}}/>
    </View>
    <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
      <CommonButton style={{height:40, width:'100%', maxWidth:320, justifyContent:'center'}} title={lang('copy')} onPress={()=>{Clipboard.setString(fullContent);back()}}/>
      {editor && sendToScreen && <CommonButton style={{height:40, width:'100%', maxWidth:320, justifyContent:'center'}} title={lang('move to editor')} onPress={()=>{sendToScreen({value:editor.title, editorValue:editor.description});back()}}/>}
      {isOwner && content.timer && <CommonButton style={{height:40, width:'100%', maxWidth:320, justifyContent:'center'}} textStyle={{color:'red'}} title={lang('delete timer')} onPress={()=>{contentMutation.patch({id:content.id, timer:null});back()}}/>}
      {isOwner && <CommonButton style={{height:40, width:'100%', maxWidth:320, justifyContent:'center'}} textStyle={{color:'red'}} title={lang('delete')} onPress={()=>{contentMutation.patch({id:content.id, is_archive:true});back()}}/>}
  </BottomSheet>
}
