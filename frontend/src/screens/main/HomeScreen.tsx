import React, {useLayoutEffect} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import {TabViewNavigator} from '../../navigation/DrawerNavigator';
import useResizeWindow from '../../hooks/useResizeWindow';
import { bottomTabs } from '../../tabs';
import CommonButton from '../../components/CommonButton';
import { postChannel, postMessengerMember } from '../../apis';
import useAuthContext from '../../hooks/useAuthContext';
import { useBoardChannelMutation } from '../../hooks/lists/useBoardChannelList';
import { useMessengerChannelMutation } from '../../hooks/lists/useMessengerChannelList';

const HeaderRight = (props:{onCreate:()=>void, onDelete:()=>void})=>{
  return<View style={{flexDirection:'row'}}>
        <CommonButton title={'create'} onPress={props.onCreate}/>
        <CommonButton title={'delete'} onPress={props.onDelete}/>
  </View>
}

// navigate("BoardEditScreen", {channel_id:item.channel, id:item.id})
// deleteBoardContent(item.id).then(()=>navigate('BoardScreen', {id:item.channel}))

export default function HomeScreen({navigation, route}: StackScreenProps<any, 'Home'>) {
  const windowType = useResizeWindow();
  const {auth} = useAuthContext()
  const boardChannelMutation = useBoardChannelMutation()
  const messengerChannelMutation = useMessengerChannelMutation()

  const createChannel = (type:'messenger'|'board')=>{
    if(auth?.user?.id == undefined || auth?.groupId == undefined)
      return
    if (type == 'board')
      boardChannelMutation.create({owner:auth.user.id, group:auth.groupId, type, name:'new'})
    if (type == 'messenger')
      messengerChannelMutation.create({owner:auth.user.id, group:auth.groupId, type, name:'new'})
  }
  const options = [
    {title:'member'},
    {title:'messenger', headerRight:()=><HeaderRight onCreate={()=>createChannel('messenger')} onDelete={()=>{}}/>},
    {title:'board', headerRight:()=><HeaderRight onCreate={()=>createChannel('board')} onDelete={()=>{}}/>},
    {title:'config'}
  ]
  
  useLayoutEffect(() => {
    const index = route?.params?.tab | 0
    navigation.setOptions(windowType == 'portrait'?options[index]:{
      title: 'home',
      headerRight: undefined
    });
  }, [navigation, route, windowType]);
  return windowType == 'landscape'?
    <View style={{padding:10}}></View>:
    <TabViewNavigator tabs={bottomTabs} tabBarPosition="bottom" index={parseInt(route.params?.['tab'] || 0)} onTab={(index)=>{navigation.setParams({tab:index})}}/>
}

