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

export default function MessageModal({id, content}:{id:number, content:string}) {
  const { lang } = useLangContext()
  const { setModal } = useModalsContext()
  const theme = useColorScheme()
  const contentMutation = useMessengerContentMutation()
  const back = ()=>{
    setModal(MessageModal, null)
  }
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
      <CommonButton style={{height:40, width:'100%', maxWidth:320, justifyContent:'center'}} title={lang('copy')} onPress={()=>{Clipboard.setString(content);back()}}/>
      <CommonButton style={{height:40, width:'100%', maxWidth:320, justifyContent:'center'}} textStyle={{color:'red'}} title={lang('delete')} onPress={()=>{contentMutation.delete(id);back()}}/>
  </BottomSheet>
}
