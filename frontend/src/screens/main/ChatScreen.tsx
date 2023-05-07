import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text,  View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import useMessengerContentList, { MessengerContentPage, useMessengerContentMutation } from '../../hooks/lists/useMessengerContent.List';
import useAuthContext from '../../hooks/useAuthContext';
import HeaderRight from '../../components/HeaderRight';
import useMessengerMemberList, { useMessengerMemberMutation } from '../../hooks/lists/useMessengerMemberList';
import { navigate } from '../../navigation';
import Colors from '../../constants/Colors';
import Hyperlink from 'react-native-hyperlink'
import useMessengerChannelList from '../../hooks/lists/useMessengerChannelList';
import LocalCam from '../../lib/react-native-webrtc/LocalCam';
import useIsMobile from '../../hooks/useIsMobile';
import LinkPreview from '../../components/LinkPreview';
import {default as useRtcContext, WebSocketProvider as RtcProvider} from "../../lib/react-native-webrtc/useWebsocketContext";
import RemoteCam from '../../lib/react-native-webrtc/RemoteCam';

type VideoCallProps = {channel_id:number, videoMode:'camera'|'display'|null}

const VideoCallContainer = ({channel_id, videoMode}:VideoCallProps)=>{
  const [guests, setGuests] = useState<{username:string, name:string, channel_name:string}[]>([])
  const { lastJsonMessage, sendJsonMessage } = useRtcContext()
  useEffect(()=>{
    if(lastJsonMessage !=null){
      if(lastJsonMessage['type']=='connection'){
        sendJsonMessage({'type':'broadcast', 'data':{'channel_id':channel_id}})
      }
      if(lastJsonMessage['type']=='broadcast'){
        const target = lastJsonMessage['data']['target']
        const channel_name = lastJsonMessage['data']['channel_name']
        if(target == 'host' || target == 'guest')
          setGuests([...guests, {
            username:lastJsonMessage['username'], 
            name:lastJsonMessage['data']['name'],
            channel_name
          }])
        if(target == 'disconnect'){
          const exist = guests.find(v=>v.channel_name == channel_name)
          exist && setGuests(guests.filter(v=>v.channel_name != channel_name))
        }
       }
    }
  }, [lastJsonMessage])
  return lastJsonMessage !==undefined ?<View style={[
      {flexDirection: 'row', justifyContent:'center', borderColor:Colors.borderColor, borderRadius:10, paddingTop:10, backgroundColor:'white'},
      videoMode!==null?{borderTopWidth:1}:{}]}>
      {guests.map((user, i)=><View key={i} style={{maxWidth:'33%', flexDirection: 'row', marginHorizontal:10, flex:1}}>
        <RemoteCam user={user}/>
      </View>)}
      <View style={{maxWidth:'33%', flexDirection: 'row', marginHorizontal:10, flex:1}}>
        <LocalCam mode={videoMode}/>
      </View>
    </View>:<></>
}

const VideoCallSection = React.memo(({channel_id, videoMode}:VideoCallProps)=>{
  return <RtcProvider disable={videoMode==null}>
    <VideoCallContainer channel_id={channel_id} videoMode={videoMode}/>
  </RtcProvider>
})

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const height = useRef(0)
  const isMobile = useIsMobile()
  const inputRef = useRef<TextInput>(null)
  const {auth} = useAuthContext()
  const channel = useMessengerChannelList(auth)?.find(v=>v.id==parseInt(channel_id))
  const {data, fetchNextPage } = useMessengerContentList(channel_id)
  const memberList = useMessengerMemberList(channel_id)
  const member_id = useMemo(()=>memberList?.find(v=>v.user == auth.user?.id)?.id, [auth, memberList])
  const messengerMemberMutation = useMessengerMemberMutation()
  const [value, setValue] = useState('')
  const [autoFocus, setAutoFocus] = useState(true)
  const [videoMode, setVideoMode] = useState<'camera'|'display'|null>(null)
  const postValue = ()=>{
    if (value.length>0){
      contentMutation.create({channel:channel_id, user:auth.user?.id, content:value})
      setValue('')
      setAutoFocus(true)
    }
  }
  const toggleVideoMode = (mode:'camera'|'display')=>{
    setVideoMode(videoMode!=mode?mode:null)
  }
  const contentMutation = useMessengerContentMutation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ()=> <HeaderRight extra={[
        {title:'invite', onPress:()=>{navigate("InviteScreen", {id:channel_id})}},
        {title:'leave', onPress:()=>{member_id && messengerMemberMutation.leave(member_id);back()}}
      ]}/>,
      title: channel?.name
    });
  }, [navigation, route, member_id]);

  const renderItem = useCallback(({item, index}:{item:MessengerContentPage, index:number})=>{
    let nextPage = item.next;
    while(nextPage?.next && nextPage.current.length==0){
      nextPage = nextPage.next
    }
    const nextContent = nextPage?.current[0]
    return <View style={{flexDirection: 'column-reverse'}}>
      
      {item.current.map((content, index2)=>{
        const next = index2 + 1 < item.current.length?item.current[index2+1]:nextContent
        const created:string = content.created.slice(0, 16)
        const date = created.slice(0, 10)
        const isSystem = content.user == null
        const isFirst = next==undefined || (content.user != next.user || created != next.created.slice(0, 16))
        const isSelf = auth.user?.id == content.user
        const dayChanged = next==undefined || date != next.created.slice(0, 10)
        if (isSystem)
          return <View key={content.id} style={{flexDirection:'row', justifyContent:'center', width:'100%', marginVertical:5}}>
            <Text>{content.message_set[0].content}</Text>
          </View>
        return <View key={content.id}>
          {dayChanged?<View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}><Text>{date}</Text></View>:undefined}
          <View key={content.id} style={{flexDirection:'row', justifyContent:isSelf?'space-between':'flex-start', width:'100%'}}>
            {isFirst && !isSelf?<MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>:<View style={{width:48}}/>}
            <CommonSection outerContainerStyle={{width:undefined, maxWidth:'90%'}} title={isFirst?content.name:undefined} titleStyle={{flex:undefined}} bodyStyle={{padding:10}} subtitle={`${created.slice(11)}`}>
              {/* @ts-ignore */}
              <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}}>
                <Text>{content.message_set[0].content}</Text>
              </Hyperlink>
              {content.link_set.map((link, linkIndex)=><LinkPreview key={linkIndex} link={link} isMobile={isMobile}/>)}
            </CommonSection>
          </View>
        </View>
      })}
    </View>
  }, [navigation, contentMutation])
  
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.navigate('HomeScreen', {tab:2})
      }
  }
  useEffect(()=>{
    if (!(channel_id))
      back()
  }, [])
  useEffect(()=>{
    if(autoFocus){
      (inputRef.current as any).focus()
      setAutoFocus(false)
    }
  }, [autoFocus])

  return <View style={{flex:1, alignItems:'center'}}>
        <FlatList
          style={{width:'100%', flexDirection: 'column-reverse'}}
          contentContainerStyle={{padding:10, flexGrow:1, flexDirection: 'column-reverse'}}
          data={data?.pages}
          renderItem={renderItem}
          onScroll={(e)=>{
            if (e.nativeEvent.contentOffset.y + e.nativeEvent.contentSize.height - height.current < 1)
              fetchNextPage()
          }}
          onLayout={(p)=>{height.current = p.nativeEvent.layout.height}}
        />
      <View style={{width:'100%'}}>
        <VideoCallSection channel_id={channel_id} videoMode={videoMode}/>
        <View style={{bottom:0, width:'100%', backgroundColor:'white', alignItems:'center'}}>
          <View style={{width:'100%',flexDirection:'row', paddingTop:15, paddingBottom:10, paddingHorizontal:19}}>
            <TextInput ref={inputRef} value={value} onChangeText={setValue} style={{flex:1, borderWidth:1, height:40, borderRadius:6, borderColor:Colors.borderColor}} onSubmitEditing={postValue} blurOnSubmit={true}/>
            <CommonButton title={'💬'} onPress={postValue}/>
            <CommonButton title={'📹'} onPress={()=>toggleVideoMode('camera')}/>
            <CommonButton title={'🖥️'} onPress={()=>toggleVideoMode('display')}/>
          </View>
        </View>
      </View>
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
