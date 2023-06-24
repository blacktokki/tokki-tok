import React from 'react';
import useAuthContext from '../hooks/useAuthContext';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { BottomSheet } from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';

export default function GuestLogoutModal({id}:{id:number}) {
  const { lang } = useLangContext()
  const { setModal } = useModalsContext()
  const {dispatch} = useAuthContext()
  const back = ()=>{
    setModal(GuestLogoutModal, null)
  }
  useModalEffect(back, [])
  return <BottomSheet>
    <Text>{lang('Guest users cannot reconnect after logging out. Please create an account or log in.')}</Text>
    <View style={{width:'100%', flexDirection:'row', justifyContent:'flex-end'}}>
      <CommonButton title={lang('sign out')} onPress={()=>dispatch({type:"LOGOUT_REQUEST"})}/>
      <CommonButton title={lang('cancel')} onPress={()=>back()}/>
    </View>
  </BottomSheet>
}
