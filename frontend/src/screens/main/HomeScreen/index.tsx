import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { View, ScrollView, useWindowDimensions} from 'react-native';
import { Text as StyledText } from 'react-native-paper';
import { Text } from '../../../components/Themed'
import useResizeContext from '../../../hooks/useResizeContext';
import TabView from '../../../components/TabView';
import HeaderRight from '../../../components/HeaderRight';
import TextButton from '../../../components/TextButton';
import Colors from '../../../constants/Colors';
import useColorScheme  from '../../../hooks/useColorScheme';
import useModalsContext from '../../../hooks/useModalsContext';
import ChannelEditModal from '../../../modals/ChannelEditModal';
import useLangContext from '../../../hooks/useLangContext';
import ContractFooter from '../../../components/ContractFooter';
import { MessengerChannel, TabViewRecord, UserMembership } from '../../../types';
import useAuthContext from '../../../hooks/useAuthContext';
import useUserMembershipList from '../../../hooks/lists/useUserMembershipList';
import { FontAwesome, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '../../../lib/@expo/vector-icons';
import { useMessengerChannelSorted } from '../../../hooks/lists/useMessengerChannelList';
import CommonItem from '../../../components/CommonItem';
import MemberItem from '../../../components/MemberItem';
import ProfileModal from '../../../modals/ProfileModal';
import { navigate } from '../../../navigation';
import CommonSection from '../../../components/CommonSection';
import ConfigSections from './ConfigSections';
import Avatar, { avatarFromChannel } from '../../../components/Avatar';
import RegistrationModal from '../../../modals/RegistrationModal';
import { useNavigation } from '@react-navigation/native';


const useHeaderSetter = (options:any[]) =>{
  const tempref = useRef<NodeJS.Timer>()
  const indexRef = useRef<number>()
  const {width } = useWindowDimensions()
  const navigation = useNavigation()
  useEffect(()=>{
    return ()=>{
      clearInterval(tempref.current)
    }
  }, [])
  return (ref:any)=>{
      clearInterval(tempref.current)
      /*@ts-ignore */
      tempref.current=setInterval(()=>{ref?.measure((fx, fy, _, height, px, py)=>{
        const i = Math.round(-px/width)
        if (indexRef.current != i){
          indexRef.current = i
          navigation.setOptions(options[i])
        }
      })
    }, 300)
  }
}

const renderIndexDetector= (Component:React.ComponentType<any>, headerIndexRef:(ref:any)=>void)=>{
  return (props:any)=><View style={{flex:1}} ref={headerIndexRef}>
    <Component {...props}/>
  </View>
}

const MemberTabView = ()=>{
  const {auth} = useAuthContext()
  const theme = useColorScheme()
  const { setModal } = useModalsContext()
  const userList = useUserMembershipList(auth)
  const memberItem = React.useMemo(
      ()=>userList && userList.map((item, index)=><MemberItem key={index} member={item} onPress={()=>setModal(ProfileModal, {id:item.id})}/>), [userList])
  return <ScrollView style={{flex:1, backgroundColor:Colors[theme].background}}>
      {memberItem}
  </ScrollView>
}

const MessengerTabView = ()=>{
  const {auth} = useAuthContext()
  const channelList = useMessengerChannelSorted('messenger', auth)
  const theme = useColorScheme()

  const today = (new Date()).toISOString().slice(0, 10)
  return <ScrollView style={{flex:1, backgroundColor:Colors[theme].background}}>
      {channelList?.map((item, index)=>{
          const {avatar, name} = avatarFromChannel(item, auth.user)
          const date = item.last_message?.created.slice(0,10)
          const content = item.last_message?.preview_content || item.last_message?.content || ''
          return <CommonItem key={index} bodyStyle={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>navigate("ChatScreen", {id:item.id})}>
              <View style={{flexDirection:'row', flexShrink:1}}>
                  {avatar?
                    <View style={{ marginRight:20}}>
                      <Avatar name={avatar.name} size={44} userId={avatar.id}/>
                    </View>:
                    <FontAwesome size={40} color={Colors[theme].iconColor} style={{ marginBottom: -3, marginRight:20 }} name='users'/>}
                  <View>
                      <View style={{flexDirection:'row'}}>
                          <Text style={{fontSize:18}}>{name}</Text>
                          {item.type=='messenger' && <Text style={{fontSize:18, opacity: 0.4, paddingLeft:5}}>{item.member_count}</Text>}
                      </View>
                      <Text style={{fontSize:16, opacity: 0.4}}>{content.replaceAll('\n', ' ')}</Text>
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


const ConfigTabView = ()=>{
  const theme = useColorScheme()
  return <ScrollView style={{flex:1, backgroundColor:Colors[theme].background}}>
    <ConfigSections/>
  </ScrollView>
}

const getBottomTabs = (theme:'light'|'dark', headerSetter:(ref:any)=>void)=>{
  const color = Colors[theme].iconColor
  return {
    OneTab:{
        title:'member',
        component:renderIndexDetector(MemberTabView, headerSetter),
        icon:<MaterialCommunityIcons size={32} color={color} style={{ marginBottom: -3 }} name='account'/>,
    },
    TwoTab:{
        title:'chat',
        component:MessengerTabView,
        icon:<Ionicons size={30} color={color} style={{ marginBottom: -3 }} name='chatbox'/>
    },
    // ThreeTab:{
    //   title:'my messages',
    //   component:MyMessageTabView,
    //   icon:<MaterialCommunityIcons size={32} color={color} style={{ marginBottom: -3 }} name='pencil-box'/>
    // },
    FourTab:{
        title:'config',
        component:ConfigTabView,
        icon:<SimpleLineIcons size={30} color={color} style={{ marginBottom: -3 }} name='options'/>
    }
  } as TabViewRecord
}


export default function HomeScreen({navigation, route}: StackScreenProps<any, 'Home'>) {
  const { lang, locale } = useLangContext()
  const windowType = useResizeContext();
  const theme = useColorScheme()
  const { setModal } = useModalsContext()
  const {auth} = useAuthContext()
  const [ home, setHome ] = useState(windowType == 'landscape')
  const color = Colors[theme].text
  const options = [
    {title:lang('member'), headerRight:()=><HeaderRight extra={[{title:lang('create'), onPress:()=>setModal(RegistrationModal, auth.user?.is_guest?{id:auth.user.id}:{})}]}/>},
    {title:lang('chat'), headerRight:()=><HeaderRight extra={[{title:lang('create'), onPress:()=>setModal(ChannelEditModal, {type:'messenger'})}]}/>},
    // {title:lang('my messages'), headerRight:()=><HeaderRight extra={[{title:lang('create'), onPress:()=>setModal(ChannelEditModal, {type:'mycontent'})}]}/>},
    {title:lang('config'), headerRight:()=><HeaderRight/>}
  ]
  const headerSetter = useHeaderSetter(options)
  
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
    <ScrollView contentContainerStyle={{flex:1, alignItems:'center'}}>
      <View style={{flexGrow:1, width:'80%', marginTop:72}}>
        <StyledText style={{fontSize:32, color}}>Tokki Tok</StyledText>
        <View style={{backgroundColor:Colors.borderColor, height:1, width:'100%'}}/>
        {/* <Text style={{fontSize:20, color:'gray'}}>Welcome! This is a messenger for teams.</Text>*/}
        <View style={{height:24}}/>
        <CommonSection bodyStyle={{alignItems:'flex-start', backgroundColor:theme=='light'?'transparent':"black"}}>
          <TextButton title={lang('+ New chat')} textStyle={{fontSize:20, color}} style={{paddingLeft:0, borderRadius:20}} onPress={()=>setModal(ChannelEditModal, {type:'messenger'})}/>
        </CommonSection>
        <ConfigSections/>
      </View>
      <ContractFooter theme={theme}/>
    </ScrollView>:
    <TabView tabs={getBottomTabs(theme, headerSetter)} tabBarPosition="bottom" index={parseInt(route.params?.['tab'] || 0)} onTab={(index)=>{navigation.setParams({tab:index})}}/>
}

