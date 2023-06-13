import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Profile from '../components/Profile';
import TextButton from '../components/TextButton';
import Colors from '../constants/Colors';
import useResizeContext from '../hooks/useResizeContext';
import TabView from '../components/TabView';
import { MessengerChannel, TabViewRecord, User, UserMembership } from '../types';
import useModalsContext from '../hooks/useModalsContext';
import ChannelEditModal from '../modals/ChannelEditModal';
import CommonItem from '../components/CommonItem';
import { Text } from '../components/Themed';
import useAuthContext, { Auth } from '../hooks/useAuthContext';
import { useMessengerChannelSorted } from '../hooks/lists/useMessengerChannelList';
import { navigate } from '.'
import { avatarFromChannel } from '../components/Avatar';

const DrawerTabView = (props:{auth:Auth, data:(MessengerChannel & {onPress?:()=>void})[]})=><View style={{flex:1}}>
    {props.data.map((item, index)=>{
      const {name} = avatarFromChannel(item, props.auth.user)
      return <CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={item.onPress}>
        <Text style={{marginLeft:20}}>{name}</Text>
      </CommonItem>
    })}
</View>

const MessengerTabView = ()=>{
  const {auth} = useAuthContext()
  const channelList = useMessengerChannelSorted(auth);
  return <DrawerTabView auth={auth} data={(channelList || []).map(item=>({...item, onPress:()=>navigate("ChatScreen", {id:item.id})}))}/>
}

const drawerTabs:TabViewRecord = {
  MessengerTab:{
      title:'messenger',
      component:MessengerTabView,
      icon:<></>
  },
}

export default ({user}:{user:UserMembership})=> {
  const { colors } = useTheme();
  const windowType = useResizeContext();
  const [index, setIndex] = useState(0);
  const { setModal } = useModalsContext()
  const onAddList = [
    ()=>setModal(ChannelEditModal, {type:'messenger'}),
    ()=>setModal(ChannelEditModal, {type:'board'})
  ]
  return <View style={windowType=='landscape'?[
      styles.tabBar,
      {
        backgroundColor: colors.card,
        borderTopColor: colors.border,
      },
      // tabBarStyle,
    ]:{width:0}}
    pointerEvents={false ? 'none' : 'auto'}
  >
    <Profile userId={user.id} username={user.username} name={user.name}/>
    {windowType=='landscape' && <>
      <View style={{flexDirection:'row-reverse'}}>
          <TextButton title='+' textStyle={{fontSize:20}} style={{borderRadius:20}} onPress={onAddList[index]}/>
      </View>
      <View accessibilityRole="tablist" style={styles.content}>
        {Object.keys(drawerTabs).length>1 ? 
          <TabView tabs={drawerTabs} tabBarPosition={"top"} onTab={setIndex}/>: 
          <View style={{borderTopWidth:1, flex:1, borderColor:colors.border}}>            
            {Object.values(drawerTabs).map(drawerTab=>{const Tab = drawerTab.component; return <Tab key={drawerTab.title}/>})}
          </View>
        }
      </View>
    </>}
  </View>
}

{/*<Text style={[styles.label, { color: d.isFocused ? colors.primary : '#222' }]}></Text> */}

const styles = StyleSheet.create({
    tabBar: {
      width:240,
      elevation: 8,
      borderRightWidth:1,
      borderColor:Colors.borderColor
    },
    content: {
      flex: 1,
      flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
  });