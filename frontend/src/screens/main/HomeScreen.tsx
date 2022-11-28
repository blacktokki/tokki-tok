import React, {useLayoutEffect} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import {TabViewNavigator} from '../../navigation/DrawerNavigator';
import useResizeWindow from '../../hooks/useResizeWindow';
import { bottomTabs } from '../../tabs';
import { navigate } from '../../navigation';
import HeaderRight from '../../components/HeaderRight';

// navigate("BoardEditScreen", {channel_id:item.channel, id:item.id})
// deleteBoardContent(item.id).then(()=>navigate('BoardScreen', {id:item.channel}))

export default function HomeScreen({navigation, route}: StackScreenProps<any, 'Home'>) {
  const windowType = useResizeWindow();

  const options = [
    {title:'member', headerRight:()=><HeaderRight/>},
    {title:'messenger', headerRight:()=><HeaderRight extra={[{title:'create', onPress:()=>navigate("ChannelEditScreen", {type:"messenger"})}]}/>},
    {title:'board', headerRight:()=><HeaderRight extra={[{title:'create', onPress:()=>navigate("ChannelEditScreen", {type:"board"})}]}/>},
    {title:'config', headerRight:()=><HeaderRight/>}
  ]
  
  useLayoutEffect(() => {
    const index = route?.params?.tab | 0
    navigation.setOptions(windowType == 'portrait'?options[index]:{
      title: 'home',
      headerRight: ()=><HeaderRight/>
    });
  }, [navigation, route, windowType]);
  return windowType == 'landscape'?
    <View style={{padding:10}}></View>:
    <TabViewNavigator tabs={bottomTabs} tabBarPosition="bottom" index={parseInt(route.params?.['tab'] || 0)} onTab={(index)=>{navigation.setParams({tab:index})}}/>
}

