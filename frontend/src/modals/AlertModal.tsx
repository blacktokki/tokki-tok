import React from 'react';
import useAuthContext from '../hooks/useAuthContext';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { BottomSheet } from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';


export default function AlertModal({type}:{type:string}) {
  const { lang } = useLangContext()
  const { setModal } = useModalsContext()
  const {dispatch} = useAuthContext()
  const back = ()=>{
    setModal(AlertModal, null)
  }
  const messages = {
    "GUEST_LOGOUT":{
      message: 'Guest users cannot reconnect after logging out. Please create an account or log in.',
      title: 'sign out',
      onPress: ()=>dispatch({type:"LOGOUT_REQUEST"})
    }
  } as Record<string, {message:string, title:string, onPress:()=>void}>

  useModalEffect(back, [])
  return <BottomSheet>
    <Text>{lang(messages[type].message)}</Text>
    <View style={{width:'100%', flexDirection:'row', justifyContent:'flex-end'}}>
      <CommonButton title={lang(messages[type].title)} onPress={messages[type].onPress}/>
      <CommonButton title={lang('cancel')} onPress={()=>back()}/>
    </View>
  </BottomSheet>
}
