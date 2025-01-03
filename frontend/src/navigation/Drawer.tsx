import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Profile from '../components/Profile';
import TextButton from '../components/TextButton';
import Colors from '../constants/Colors';
import useResizeContext from '../hooks/useResizeContext';
import TabView from '../components/TabView';
import { TabViewRecord, UserMembership } from '../types';
import useModalsContext from '../hooks/useModalsContext';
import ChannelEditModal from '../modals/ChannelEditModal';
import CommonItem from '../components/CommonItem';
import { Text } from '../components/Themed';
import useAuthContext, { Auth } from '../hooks/useAuthContext';
import { useMessengerChannelSorted } from '../hooks/lists/useMessengerChannelList';
import { navigate } from '.'
import { avatarFromChannel } from '../components/Avatar';
import useColorScheme from '../hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '../lib/@expo/vector-icons';
import RegistrationModal from '../modals/RegistrationModal';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import ProfileModal from '../modals/ProfileModal';


const MemberTabView = ()=>{
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const userList = useUserMembershipList(auth)
  return <View style={{flex:1}}>
    {userList?.map((item, index)=>{
      return <CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={()=>setModal(ProfileModal, {id:item.id})}>
        <Text style={{marginLeft:20}}>{item.name}</Text>
      </CommonItem>
    })}
  </View>
}

const MessengerTabView = ()=>{
  const {auth} = useAuthContext()
  const channelList = useMessengerChannelSorted('messenger', auth);
  return <View style={{flex:1}}>
    {channelList?.map((item, index)=>{
      const {name} = avatarFromChannel(item, auth.user)
      return <CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={()=>navigate("ChatScreen", {id:item.id})}>
        <Text style={{marginLeft:20}}>{name}</Text>
      </CommonItem>
    })}
  </View>
}

const NoteTabView = ()=>{
  const {auth} = useAuthContext()
  const channelList = useMessengerChannelSorted('mycontent', auth);
  return <View style={{flex:1}}>
    {channelList?.map((item, index)=>{
      return <CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={()=>navigate("NoteScreen", {id:item.id})}>
        <Text style={{marginLeft:20}}>{item.name}</Text>
      </CommonItem>
    })}
  </View>
}
const getDrawerTabs = (theme:'light'|'dark')=>{
  const color = Colors[theme].iconColor
  return {
    MemberTab:{
      title:'member',
      component:MemberTabView,
      icon:<MaterialCommunityIcons size={32} color={color} style={{ marginBottom: -3 }} name='account'/>,
    },
    ChatTab:{
        title:'chat',
        component:MessengerTabView,
        icon:<Ionicons size={30} color={color} style={{ marginBottom: -3 }} name='chatbox'/>
    },
    NoteTab:{
        title:'note',
        component:NoteTabView,
        icon:<MaterialCommunityIcons size={32} color={color} style={{ marginBottom: -3 }} name='pencil-box'/>
    }
  } as TabViewRecord
}

export default ({auth}:{auth:Auth})=> {
  const { colors } = useTheme();
  const theme = useColorScheme();
  const windowType = useResizeContext();
  const [index, setIndex] = useState<number>();
  const { setModal } = useModalsContext()
  
  const onAddList = [
    ()=>setModal(RegistrationModal, auth.user?.is_guest?{id:auth.user.id}:{}),
    ()=>setModal(ChannelEditModal, {type:'messenger'}),
    ()=>setModal(ChannelEditModal, {type:'mycontent'}),
  ]
  const drawerTabs = getDrawerTabs(theme)

  useEffect(()=>{
    if(index===undefined){
      setIndex(0)
    }
  }, [])
  return <View style={windowType=='landscape'?[
      styles.tabBar,
      {
        backgroundColor: Colors[theme].background,
        borderTopColor: colors.border,
      },
      // tabBarStyle,
    ]:{width:0}}
    pointerEvents={false ? 'none' : 'auto'}
  >
    {windowType=='landscape' && auth.user && index!==undefined && <>
      <Profile userId={auth.user.id} username={auth.user.username} name={auth.user.name}/>
      <View style={{flexDirection:'row-reverse'}}>
          <TextButton title='+' textStyle={{fontSize:20}} style={{borderRadius:20}} onPress={onAddList[index]}/>
      </View>
      <View accessibilityRole="tablist" style={styles.content}>
        {Object.keys(drawerTabs).length>1 ? 
          <TabView tabs={drawerTabs} tabBarPosition={"top"} onTab={setIndex} index={index}/>: 
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