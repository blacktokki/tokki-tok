import React, {useState, useEffect, useLayoutEffect} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, View} from 'react-native';
import { Text as StyledText } from 'react-native-paper';
import { useColorScheme as useConfigColorScheme} from 'react-native-appearance';
import useResizeContext from '../../hooks/useResizeContext';
import TabView from '../../components/TabView';
import HeaderRight from '../../components/HeaderRight';
import TextButton from '../../components/TextButton';
import Colors from '../../constants/Colors';
import useColorScheme, { setColorScheme } from '../../hooks/useColorScheme';
import useModalsContext from '../../hooks/useModalsContext';
import ChannelEditModal from '../../modals/ChannelEditModal';
import useLangContext from '../../hooks/useLangContext';
import ContractFooter from '../../components/ContractFooter';
import { TabViewRecord } from '../../types';
import useAuthContext from '../../hooks/useAuthContext';
import useUserMembershipList from '../../hooks/lists/useUserMembershipList';
import { FontAwesome, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useMessengerChannelSorted } from '../../hooks/lists/useMessengerChannelList';
import { ScrollView } from 'react-native-gesture-handler';
import CommonItem from '../../components/CommonItem';
import MemberItem from '../../components/MemberItem';
import ProfileModal from '../../modals/ProfileModal';
import { navigate } from '../../navigation';

const MemberTabView = ()=>{
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const userList = useUserMembershipList(auth)
  const memberItem = React.useMemo(
      ()=>userList && userList.map((item, index)=><MemberItem key={index} member={item} onPress={()=>setModal(ProfileModal, {id:item.id})}/>), [userList])
  return <ScrollView style={{flex:1, backgroundColor:'white'}}>
      {memberItem}
  </ScrollView>
}

const MessengerTabView = ()=>{
  const {auth} = useAuthContext()
  const channelList = useMessengerChannelSorted(auth)
  const today = (new Date()).toISOString().slice(0, 10)
  return <ScrollView style={{flex:1, backgroundColor:'white'}}>
      {channelList?.map((item, index)=>{
          const date = item.last_message?.created.slice(0,10)
          return <CommonItem key={index} bodyStyle={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>navigate("ChatScreen", {id:item.id})}>
              <View style={{flexDirection:'row'}}>
                  <FontAwesome size={36} style={{ marginBottom: -3, marginRight:20 }} name='users'/>
                  <View>
                      <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:18}}>{item.name}</Text>
                          <Text style={{fontSize:18, opacity: 0.4, paddingLeft:5}}>{item.member_count}</Text>
                      </View>
                      <Text style={{fontSize:16, opacity: 0.4}}>{item.last_message?.content}</Text>
                  </View>
              </View>
              <View>
                  <Text style={{fontSize:14, opacity: 0.4, textAlign:'right'}}>{date==today?item.last_message?.created.slice(11,16):date}</Text>
                  <Text style={{fontSize:14, textAlign:'right'}}>{item.unread_count?item.unread_count:' '}</Text>
              </View>
          </CommonItem>
      })}
  </ScrollView>
}

const bottomTabs:TabViewRecord = {
  OneTab:{
      title:'member',
      component:MemberTabView,
      icon:<MaterialCommunityIcons size={32} style={{ marginBottom: -3 }} name='account'/>,
  },
  TwoTab:{
      title:'messenger',
      component:MessengerTabView,
      icon:<Ionicons size={30} style={{ marginBottom: -3 }} name='chatbox'/>
  },
  // ThreeTab:{
  //     title:'board',
  //     component:()=><></>,
  //     icon:<></>
  // },
  // FourTab:{
  //     title:'config',
  //     component:()=><></>,
  //     icon:<SimpleLineIcons size={30} style={{ marginBottom: -3 }} name='options'/>
  // }
}


export default function HomeScreen({navigation, route}: StackScreenProps<any, 'Home'>) {
  const { lang, locale, setLocale } = useLangContext()
  const windowType = useResizeContext();
  const theme = useColorScheme()
  const configTheme = useConfigColorScheme()
  const { setModal } = useModalsContext()
  const [ home, setHome ] = useState(windowType == 'landscape')
  const color = Colors[theme].text
  const options = [
    {title:lang('member'), headerRight:()=><HeaderRight/>},
    {title:lang('messenger'), headerRight:()=><HeaderRight extra={[{title:lang('create'), onPress:()=>setModal(ChannelEditModal, {type:'messenger'})}]}/>},
    // {title:'board', headerRight:()=><HeaderRight extra={[{title:'create', onPress:()=>setModal(ChannelEditModal, props:{type:'board'}}) }]}/>},
    {title:'config', headerRight:()=><HeaderRight/>}
  ]
  
  useLayoutEffect(() => {
    const index = route?.params?.tab | 0
    navigation.setOptions(windowType == 'portrait'?options[index]:{
      title: lang('home'),
      headerRight: ()=><HeaderRight/>
    });
  }, [navigation, route, windowType, locale]);
  useEffect(()=>{
    setHome(windowType == 'landscape')
  }, [windowType])
  return home?
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <View style={{width:'80%', flex:1, marginTop:72}}>
        <StyledText style={{fontSize:32, color}}>Tokki Tok</StyledText>
        <View style={{backgroundColor:Colors.borderColor, height:1, width:'100%'}}/>
        <View style={{flex:1, alignItems:'flex-start'}}>
          {/* <Text style={{fontSize:20, color:'gray'}}>Welcome! This is a messenger for teams.</Text>*/}
          <Text style={{fontSize:24}}> </Text>
          <Text style={{fontSize:24, fontWeight:'500', color}}>{lang('Quick Start')}</Text>
          <TextButton title={lang('+ New Messenger')} textStyle={{fontSize:20, color}} style={{paddingLeft:0, borderRadius:20}} onPress={()=>setModal(ChannelEditModal, {type:'messenger'})}/>
          <Text style={{fontSize:20, fontWeight:'500', color}}>{lang('* Language Settings')}</Text>
          <View style={{flexDirection:'row'}}>
            {[[lang('Auto'), 'auto'], ['한국어', 'ko'], ['English', 'en']].map(([title, l])=><TextButton 
              key={title} title={title || ''} textStyle={{fontSize:16, color, textDecorationLine:locale==l?'underline':'none'}} style={{borderRadius:20}} onPress={()=>setLocale(l)}/>)}
          </View>
          <Text style={{fontSize:20, fontWeight:'500', color}}>{lang('* Skin Settings')}</Text>
          <View style={{flexDirection:'row'}}>
            {[[lang('Auto'), 'no-preference'], [lang('Light'), 'light'], [lang('Dark'), 'dark']].map(([title, colorScheme])=><TextButton 
              key={title} title={title} textStyle={{fontSize:16, color, textDecorationLine:configTheme==colorScheme?'underline':'none'}} style={{borderRadius:20}} onPress={(
                )=>setColorScheme(colorScheme)}/>)}
          </View>
        </View>
      </View>
      <ContractFooter/>
    </View>:
    <TabView tabs={bottomTabs} tabBarPosition="bottom" index={parseInt(route.params?.['tab'] || 0)} onTab={(index)=>{navigation.setParams({tab:index})}}/>
}

