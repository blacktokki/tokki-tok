import React, {useCallback, useEffect, useRef} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import Profile from '../components/Profile';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { useMessengerChannelMutation } from '../hooks/lists/useMessengerChannelList';
import CommonButton from '../components/CommonButton';
import { Channel } from '../types';
import { navigate } from '../navigation';


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
    
    <Profile username={user?.username} name={user?.name} />
    <CommonButton title={'create messenger'} onPress={()=>{
      if(auth?.user?.id && auth.groupId){
        const newChannel:Channel = {name:`${auth.user.name}, ${user.name}`, type:'messenger', owner:auth?.user?.id, group:auth.groupId};
        channelMutation.create(newChannel).then(v=>navigate("Main", {screen:"MessengerScreen", params: {id:v.id}}))
      }
    }}/>
  </View>:<></>
}