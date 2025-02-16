import React, { useEffect } from 'react';
import Profile from '../components/Profile';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { useMessengerChannelMutation } from '../hooks/lists/useMessengerChannelList';
import CommonButton from '../components/CommonButton';
import { Channel } from '../types';
import { navigate } from '../navigation';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { Ionicons } from '../lib/@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { BottomSheet } from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';
import RegistrationModal from './RegistrationModal';

export default function ProfileModal({id}:{id:number}) {
  const { lang } = useLangContext()
  const theme = useColorScheme()
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const userList = useUserMembershipList(auth)
  const user = userList?.find(v=>v.id==id)
  const isSelf = auth.user && user && (auth.user?.id==user?.id)
  const channelMutation = useMessengerChannelMutation('messenger')
  const back = ()=>{
    setModal(ProfileModal, null)
  }
  useEffect(()=>{
    if (!(id && user) && userList)
      back()
  }, [userList])
  useModalEffect(back, [])
  return user?<BottomSheet>
    <View style={{flexDirection:'row', width:'100%'}}>
      <View style={{flex:1, flexDirection:'row'}}>
        <TouchableOpacity onPress={back}>
          <Ionicons size={20} name="arrow-back" color={Colors[theme].text}/>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}>
        <Text style={{fontSize:20, textAlign:'center'}}>{lang('profile')}</Text>
      </View>
      <View style={{flex:1}}/>
    </View>
    <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    
    <Profile username={user.username} name={user.name} userId={user.id} />
    {isSelf && !auth.user?.is_guest && <CommonButton title={lang('Account Settings')} onPress={()=>{setModal(RegistrationModal, {id:auth.user?.id})}}/>}
    <CommonButton title={lang(isSelf?'Chat with me':'1:1 Chat')} onPress={()=>{
      if(auth?.user?.id && auth.groupId){
        const newChannel:Channel = {name:"", type:'messenger', owner:auth?.user?.id, group:auth.groupId, subowner:isSelf?undefined:user.id};
        channelMutation.direct(newChannel).then(v=>navigate("Main", {screen:"ChatScreen", params: {id:v.id}}))
      }
    }}/>
  </BottomSheet>:<></>
}
