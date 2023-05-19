import React, {useLayoutEffect} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import { Text as StyledText } from 'react-native-paper';
import {TabViewNavigator} from '../../navigation/DrawerNavigator';
import useResizeWindow from '../../hooks/useResizeWindow';
import { bottomTabs } from '../../tabs';
import { navigate } from '../../navigation';
import HeaderRight from '../../components/HeaderRight';
import TextButton from '../../components/TextButton';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import lang from '../../lang'

// navigate("BoardEditScreen", {channel_id:item.channel, id:item.id})
// deleteBoardContent(item.id).then(()=>navigate('BoardScreen', {id:item.channel}))

export default function HomeScreen({navigation, route}: StackScreenProps<any, 'Home'>) {
  const windowType = useResizeWindow();
  const theme = useColorScheme()
  const color = Colors[theme].text
  const options = [
    {title:lang('member'), headerRight:()=><HeaderRight/>},
    {title:lang('messenger'), headerRight:()=><HeaderRight extra={[{title:lang('create'), onPress:()=>navigate("ChannelEditScreen", {type:"messenger"})}]}/>},
    // {title:'board', headerRight:()=><HeaderRight extra={[{title:'create', onPress:()=>navigate("ChannelEditScreen", {type:"board"})}]}/>},
    {title:'config', headerRight:()=><HeaderRight/>}
  ]
  
  useLayoutEffect(() => {
    const index = route?.params?.tab | 0
    navigation.setOptions(windowType == 'portrait'?options[index]:{
      title: lang('home'),
      headerRight: ()=><HeaderRight/>
    });
  }, [navigation, route, windowType]);
  return <>
    {windowType == 'landscape'?
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <View style={{width:'80%', height:'80%'}}>
          <StyledText style={{fontSize:32, color}}>Tokki Tok</StyledText>
          <View style={{backgroundColor:Colors.borderColor, height:1, width:'100%'}}/>
          <View style={{flex:1, alignItems:'flex-start'}}>
            {/* <Text style={{fontSize:20, color:'gray'}}>Welcome! This is a messenger for teams.</Text>*/}
            <Text style={{fontSize:24}}> </Text>
            <Text style={{fontSize:24, fontWeight:'500', color}}>{lang('Quick Start')}</Text>
            <TextButton title={lang('+ New Messenger')} textStyle={{fontSize:20, color}} style={{paddingLeft:0, borderRadius:20}} onPress={()=>navigate("ChannelEditScreen", {type:"messenger"})}/>
            {/* <TextButton title='+ New Board' textStyle={{fontSize:20}} style={{paddingLeft:0, borderRadius:20}} onPress={()=>navigate("ChannelEditScreen", {type:"board"})}/> */}
          </View>
        </View>
      </View>:<></>}
      <View style={windowType == 'portrait'?{flex:1}:{width:0, flex:0}}>
        <TabViewNavigator tabs={bottomTabs} tabBarPosition="bottom" index={parseInt(route.params?.['tab'] || 0)} onTab={(index)=>{navigation.setParams({tab:index})}}/>
      </View>
  </>
}

