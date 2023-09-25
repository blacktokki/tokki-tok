import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import CommonSection from '../../../components/CommonSection';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import CommonButton from '../../../components/CommonButton';
import useMessengerContentList, { MessengerContentPage, useMessengerContentMutation } from '../../../hooks/lists/useMessengerContentList';
import useAuthContext from '../../../hooks/useAuthContext';
import HeaderRight from '../../../components/HeaderRight';
import useMessengerMemberList from '../../../hooks/lists/useMessengerMemberList';
import Colors from '../../../constants/Colors';
import useColorScheme from '../../../hooks/useColorScheme';
import { Text, View as ThemedView } from '../../../components/Themed' 
import Hyperlink from 'react-native-hyperlink'
import useMessengerChannelList from '../../../hooks/lists/useMessengerChannelList';
import useIsMobile from '../../../hooks/useIsMobile';
import LinkPreview from '../../../components/LinkPreview';
import Avatar, { avatarFromChannel } from '../../../components/Avatar';
import VideoCallSection from './VideoCallSection';
import useResizeContext from '../../../hooks/useResizeContext';
import FilePreview from '../../../components/FilePreview';
import useModalsContext from '../../../hooks/useModalsContext';
import InviteModal from '../../../modals/InviteModal';
import DateTimePickerModal from '../../../modals/DateTimePickerModal'
import useLangContext from '../../../hooks/useLangContext';
import { Entypo } from '../../../lib/@expo/vector-icons';
import TimerTags, { timerFormat, timerToString } from './TimerTags';
import MessageModal from '../../../modals/MessageModal';
import ChannelEditModal from '../../../modals/ChannelEditModal';


function uploadFile(){
  return new Promise<Blob|undefined>((resolve, reject)=>{
    if (Platform.OS == 'web'){
      var input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => { 
        resolve((e.target as any).files[0])
      }
      input.onabort = reject
      input.onerror = reject
      input.click();
    }
    else
      resolve(undefined)
  })
}

const MessengerContentPageItem = React.memo((props:MessengerContentPage & {ownerId?:number})=>{
  const isMobile = useIsMobile()
  const { setModal } = useModalsContext()
  let nextPage = props.next;
    while(nextPage?.next && nextPage.current.length==0){
      nextPage = nextPage.next
    }
    const nextContent = nextPage?.current[0]
    return <View style={{flexDirection: 'column-reverse'}}>
      
      {props.current.map((content, index2)=>{
        const next = index2 + 1 < props.current.length?props.current[index2+1]:nextContent
        const created:string = content.created.slice(0, 16)
        const date = created.slice(0, 10)
        const isSystem = content.user == null
        const isFirst = next==undefined || (content.user != next.user || created != next.created.slice(0, 16))
        const isSelf = props.ownerId == content.user
        const dayChanged = next==undefined || date != next.created.slice(0, 10)
        const message = content.message_set[0]
        const openModal = ()=>setModal(MessageModal, {id:content.id, content:message.content, isOwner:isSelf, isTimer:content.timer?true:false})
        if (isSystem)
          return <View key={content.id} style={{flexDirection:'row', justifyContent:'center', width:'100%', marginVertical:5}}>
            <Text>{message.content}</Text>
          </View>
        return <View key={content.id}>
          {dayChanged?<View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}><Text>{date}</Text></View>:undefined}
          <View key={content.id} style={{flexDirection:'row', justifyContent:isSelf?'space-between':'flex-start', width:'100%'}}>
            {isFirst && !isSelf? <View style={{marginTop:3, marginLeft:12}}><Avatar name={content.name} userId={content.user} size={36}/></View>:<View style={{width:48}}/>}
            <CommonSection autoScale outerContainerStyle={{maxWidth:'90%'}} title={isFirst?content.name:undefined} titleStyle={{flex:undefined}} bodyStyle={{padding:10}} subtitle={`${created.slice(11)}`}>
              <TouchableOpacity onLongPress={openModal}>
                {content.timer && <View style={{flexDirection:'row', alignItems:'stretch'}}>
                  <Text style={{fontSize:12}}>⌚</Text>
                  <Text style={{fontSize:12}} selectable={!isMobile}>{timerToString(content.timer)}</Text>
                </View>}
                <View style={{width:"100%"}}>
                  {/* @ts-ignore */}
                  <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}}>
                    <Text selectable={!isMobile} style={{textAlign:isSelf?'right':'left'}}>{message.content}</Text>
                  </Hyperlink>
                </View>
              {content.file_set.map((file, fileIndex)=><FilePreview key={fileIndex} file={file} isMobile={isMobile} showBorder={content.file_set.length>1 || message.content.length>0}/>)}
              {content.link_set.map((link, linkIndex)=><LinkPreview key={linkIndex} link={link} isMobile={isMobile}/>)}
              </TouchableOpacity>        
            </CommonSection>
          </View>
        </View>
      })}
    </View>

})

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const { lang, locale } = useLangContext()
  const isMobile = useIsMobile()
  const channel_id = route?.params?.id
  const height = useRef(0)
  const inputRef = useRef<TextInput>(null)
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const channel = useMessengerChannelList(auth)?.find(v=>v.id==parseInt(channel_id))
  const channelAvatar = channel?avatarFromChannel(channel, auth.user):undefined
  const {data, fetchNextPage } = useMessengerContentList(channel_id)
  const memberList = useMessengerMemberList(channel_id)
  const member_id = useMemo(()=>memberList?.find(v=>v.user == auth.user?.id)?.id, [auth, memberList])
  const windowType = useResizeContext()
  const [value, setValue] = useState('')
  const [timer, setTimer] = useState<string>()
  const [autoFocus, setAutoFocus] = useState<boolean|null>(null)
  const [videoMode, setVideoMode] = useState<boolean>(false)
  const [bottomTab, setBottomTab] = useState<boolean>(false)
  const valueLines = useMemo(()=>bottomTab?1:value.split("\n").length, [value, bottomTab])

  const theme = useColorScheme()
  const postValue = ()=>{
    if (value.length>0){
      contentMutation.create({channel:channel_id, user:auth.user?.id, content:value, timer})
      setValue('')
      setTimer(undefined)
      setBottomTab(false)
      setAutoFocus(true)
    }
  }
  const contentMutation = useMessengerContentMutation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ()=> <HeaderRight extra={[
        {title:lang('invite'), onPress:()=>setModal(InviteModal, {id:channel_id})},
        {title:lang('setting'), onPress:()=>setModal(ChannelEditModal, {id:channel_id, type:'messenger', member_id})}
      ]}/>,
      title: channelAvatar?.name
    });
  }, [navigation, route, member_id, locale]);

  const renderItem = useCallback(({item, index}:{item:MessengerContentPage, index:number})=><MessengerContentPageItem {...item} ownerId={auth.user?.id}/>, [auth])
  
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.navigate('HomeScreen', {tab:2})
      }
  }
  const onKeyPress = (e:any) => {
    if (!isMobile){
      const event = e as KeyboardEvent;
        if (!event.shiftKey && event.key === "Enter"){
          postValue()
          event.preventDefault()
      }
    }
  }
  useEffect(()=>{
    setModal(null, null)
    if (!channel_id)
      back()
  }, [route])
  useEffect(()=>{
    if (memberList===null || (memberList!=undefined && memberList.find(v=>v.user==auth.user?.id)==undefined))
      back()
  }, [memberList])
  useEffect(()=>{
    if(autoFocus){
      (inputRef.current as any).focus()
      setAutoFocus(false)
    }
  }, [autoFocus])
  useEffect(()=>{
    if (autoFocus==null && !isMobile){
      const timeout = setTimeout(()=>setAutoFocus(true), 500)
      return ()=>clearTimeout(timeout)
    }
  })
  return <View style={[
    {flex:1, alignItems:'center'},
    windowType=='landscape'?{flexDirection:'row-reverse', minWidth:480}:{flexDirection:'column'}
  ]}>
    <VideoCallSection channel_id={channel_id} setDisable={(d)=>setVideoMode(!d)} disable={!videoMode}/>
    <View style={[videoMode?{flexShrink:1}:{flex:1}, windowType=='landscape'?{minWidth:320, height:'100%'}:{width:'100%'}]}>
      <FlatList
        style={{flexDirection: 'column-reverse'}}
        contentContainerStyle={{padding:10, flexGrow:1, flexDirection: 'column-reverse'}}
        data={data?.pages}
        renderItem={renderItem}
        onScroll={(e)=>{
          if (e.nativeEvent.contentOffset.y + e.nativeEvent.contentSize.height - height.current < 1)
            fetchNextPage()
        }}
        onLayout={(p)=>{height.current = p.nativeEvent.layout.height}}
      />
      <View style={{position:'absolute'}}>
        <TimerTags channel_id={channel_id}/>
      </View>
      <ThemedView style={{bottom:0, width:'100%', paddingTop:15, paddingBottom:10, paddingHorizontal:19}}>
        <View style={{alignItems:'center', width:'100%',flexDirection:'row'}}>
          <CommonButton title={''} style={{height:'100%', paddingTop:8, borderTopRightRadius:0, borderBottomRightRadius:0, justifyContent:'center'}} onPress={()=>setBottomTab(!bottomTab)}>
            <View style={{top:-2}}>
              <Entypo name={bottomTab?"cross":"plus"} size={24} color={Colors[theme].text}/>
            </View>
          </CommonButton>
          {timer && <CommonButton style={{height:'100%', paddingTop:8, borderRadius:0}} title={`⌚${timerFormat(timer)}`} onPress={()=>{setModal(DateTimePickerModal, {datetime:timer, callback:(datetime:string)=>setTimer(datetime)});setBottomTab(false)}}/>}
          <TextInput 
            ref={inputRef} 
            value={value} 
            onChangeText={setValue}
            onKeyPress={onKeyPress}
            style={{flex:1, borderWidth:1, minHeight:40, borderColor:Colors.borderColor, backgroundColor:Colors[theme].background, color:Colors[theme].text}}
            onFocus={()=>setBottomTab(false)}
            multiline 
            numberOfLines={valueLines}/>
          <CommonButton style={{height:'100%', paddingTop:8, borderTopLeftRadius:0, borderBottomLeftRadius:0, justifyContent:'center'}} title={'💬'} onPress={postValue}/>
        </View>

        {bottomTab && <View style={{alignItems:'center', width:'100%', flexDirection:'row', paddingTop:15, paddingBottom:5}}>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`📤\n ${lang('File')}`} onPress={()=>uploadFile().then(f=>{contentMutation.create({channel:channel_id, user:auth.user?.id, content:'', file:f});setBottomTab(false)})}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`⌚\n ${lang('Timer')}`} onPress={()=>{setModal(DateTimePickerModal, {datetime:timer, callback:(datetime:string)=>setTimer(datetime)});setBottomTab(false)}}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center'}} title={`📹\n ${lang('Video Call')}`} onPress={()=>{setVideoMode(!videoMode);setBottomTab(false)}} disabled={videoMode}/>
        </View>}
      </ThemedView>
    </View>
  </View>
}