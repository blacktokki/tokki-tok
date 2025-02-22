import React from 'react';
import useAuthContext from '../hooks/useAuthContext';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { BottomSheet } from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';
import RegistrationModal from './RegistrationModal';


export default function AlertModal({type}:{type:string}) {
  const { lang } = useLangContext()
  const { setModal } = useModalsContext()
  const {auth, dispatch} = useAuthContext()
  const back = ()=>{
    setModal(AlertModal, null)
  }
  const messages = {
    "GUEST_LOGOUT":{
      message: 'Guest users cannot reconnect after logging out. Please create an account or log in.',
      buttons:[
        {
          title: 'Create User',
          onPress: ()=>{
            setModal(RegistrationModal, {})
          }
        },
        {
          title: 'sign out',
          onPress: ()=>dispatch({type:"LOGOUT_REQUEST"})
        }
      ]
    }
  } as Record<string, {message:string, buttons:{title:string, onPress:()=>void}[]}>

  useModalEffect(back, [])
  return <BottomSheet>
    <Text>{lang(messages[type].message)}</Text>
    <View style={{width:'100%', flexDirection:'row', justifyContent:'flex-end'}}>
    {messages[type].buttons.map((button, i)=><CommonButton key={i} style={{marginRight:10}} title={lang(button.title)} onPress={button.onPress}/>)}
    <CommonButton title={lang('cancel')} onPress={()=>back()}/>
    </View>
  </BottomSheet>
}
