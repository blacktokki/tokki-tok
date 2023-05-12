import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View} from '../components/Themed';
import Profile from '../components/Profile';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { useMessengerChannelMutation } from '../hooks/lists/useMessengerChannelList';
import CommonButton from '../components/CommonButton';
import { DirectChannel } from '../types';
import { navigate } from '../navigation';
import lang from '../lang'

export default function ProfileScreen({
  navigation, route
}: StackScreenProps<any, 'Profile'>) {
  const id = route?.params?.id
  const {auth} = useAuthContext()
  const userList = useUserMembershipList(auth)
  const user = userList?.find(v=>v.id==id)
  const channelMutation = useMessengerChannelMutation()
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.replace('Main')
      }
  }
  useEffect(()=>{
    if (!(id && user) && userList)
      back()
  }, [userList])
  return user?<View style={{padding:10}}>
    
    <Profile username={user.username} name={user.name} userId={user.id} />
    <CommonButton title={lang('create messenger')} onPress={()=>{
      if(auth?.user?.id && auth.groupId){
        const newChannel:DirectChannel = {name:auth.user.id!=user.id?`${auth.user.name}, ${user.name}`:auth.user.name, type:'messenger', owner:auth?.user?.id, group:auth.groupId, counterpart:user.id};
        channelMutation.direct(newChannel).then(v=>navigate("Main", {screen:"ChatScreen", params: {id:v.id}}))
      }
    }}/>
  </View>:<></>
}
