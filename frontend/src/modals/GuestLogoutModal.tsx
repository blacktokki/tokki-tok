import React, { useEffect } from 'react';
import Profile from '../components/Profile';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { useMessengerChannelMutation } from '../hooks/lists/useMessengerChannelList';
import CommonButton from '../components/CommonButton';
import lang from '../lang'
import useModalsContext from '../hooks/useModalsContext';
import CommonSection from '../components/CommonSection';
import { Text, View } from '../components/Themed';

export default function GuestLogoutModal({id}:{id:number}) {
  const { setModal } = useModalsContext()
  const {dispatch} = useAuthContext()
  const back = ()=>{
    setModal(GuestLogoutModal, null)
  }
  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    <Text>{lang('Guest users cannot reconnect after logging out. Please create an account or log in.')}</Text>
    <View style={{width:'100%', flexDirection:'row', justifyContent:'flex-end'}}>
      <CommonButton title={lang('sign out')} onPress={()=>dispatch({type:"LOGOUT_REQUEST"})}/>
      <CommonButton title={lang('cancel')} onPress={()=>back()}/>
    </View>
  </CommonSection>
}
