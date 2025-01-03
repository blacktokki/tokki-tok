import React from 'react';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { Ionicons } from '../lib/@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { BottomSheet } from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';
import useAuthContext from '../hooks/useAuthContext';
import { useMessengerChannelSorted } from '../hooks/lists/useMessengerChannelList';
import CommonItem from '../components/CommonItem';

export default function NotePickerModal({callback}:{callback:(editor:number)=>void}) {
  const { lang } = useLangContext()
  const theme = useColorScheme()
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const channelList = useMessengerChannelSorted('mycontent', auth);
  const back = ()=>{
    setModal(NotePickerModal, null)
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
        <Text style={{fontSize:20, textAlign:'center'}}>{lang('Note')}</Text>
      </View>
      <View style={{flex:1}}/>
    </View>
    <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <View style={{flex:1}}>
        {channelList?.map((item, index)=>{
          return <CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={()=>{
            item.id && callback?.(item.id)
            back()
          }}>
            <Text style={{marginLeft:20}}>{item.name}</Text>
          </CommonItem>
        })}
      </View>
    <View style={{flexDirection:'row'}}>
      <CommonButton title={lang('cancel')} onPress={()=>{
        back()
      }}/>
      
    </View>
  </BottomSheet>
}
