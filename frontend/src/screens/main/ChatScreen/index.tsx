import React, { useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Platform, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import CommonButton from '../../../components/CommonButton';
import { useMessengerContentMutation } from '../../../hooks/lists/useMessengerContentList';
import useAuthContext from '../../../hooks/useAuthContext';
import HeaderRight from '../../../components/HeaderRight';
import useMessengerMemberList from '../../../hooks/lists/useMessengerMemberList';
import Colors from '../../../constants/Colors';
import useColorScheme from '../../../hooks/useColorScheme';
import { View as ThemedView } from '../../../components/Themed' 
import useMessengerChannelList from '../../../hooks/lists/useMessengerChannelList';
import useIsMobile from '../../../hooks/useIsMobile';
import { avatarFromChannel } from '../../../components/Avatar';
import VideoCallSection from './VideoCallSection';
import useResizeContext from '../../../hooks/useResizeContext';
import useModalsContext from '../../../hooks/useModalsContext';
import InviteModal from '../../../modals/InviteModal';
import DateTimePickerModal from '../../../modals/DateTimePickerModal'
import useLangContext from '../../../hooks/useLangContext';
import { Entypo } from '../../../lib/@expo/vector-icons';
import TimerTags, { timerFormat } from './TimerTags';
import ChannelEditModal from '../../../modals/ChannelEditModal';
import UploadTags from './UploadTags';
import Messages from './Messages';
import Editor from '../../../components/Editor';


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

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const { lang, locale } = useLangContext()
  const isMobile = useIsMobile()
  const channel_id = route?.params?.id
  const inputRef = useRef<TextInput>(null)
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const channel = useMessengerChannelList(auth)?.find(v=>v.id==parseInt(channel_id))
  const channelAvatar = channel?avatarFromChannel(channel, auth.user):undefined
  const memberList = useMessengerMemberList(channel_id)
  const member_id = useMemo(()=>memberList?.find(v=>v.user == auth.user?.id)?.id, [auth, memberList])
  const windowType = useResizeContext()
  const [value, setValue] = useState('')
  const [editorValue, setEditorValue] = useState('')
  const [timer, setTimer] = useState<string>()
  const [autoFocus, setAutoFocus] = useState<boolean|null>(null)
  const [videoMode, setVideoMode] = useState<boolean>(false)
  const [bottomTab, setBottomTab] = useState<boolean>(false)
  const [isEditor, setIsEditor] = useState<boolean>(false)
  const valueLines = useMemo(()=>bottomTab?1:value.split("\n").length, [value, bottomTab])

  const theme = useColorScheme()
  const postValue = ()=>{
    if (value.length>0){
      if(isEditor){
        contentMutation.create({channel:channel_id, user:auth.user?.id, content:'', timer, editor: {title:value, content:editorValue}})
      }
      else{
        contentMutation.create({channel:channel_id, user:auth.user?.id, content:value, timer})
      }
      setTimer(undefined)
      setBottomTab(false)
      setValue('')
      setAutoFocus(true)
      if(isEditor){
        setEditorValue('')
        setIsEditor(false)
      }
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
      (inputRef.current as any).focus?.()
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
      <Messages channel_id={channel_id} auth={auth} reverse/>
      <View style={{position:'absolute', flexDirection:'row'}}>
        <UploadTags channel_id={channel_id}/>
        <TimerTags channel_id={channel_id}/>
      </View>
      <ThemedView style={[{bottom:0, width:'100%', paddingTop:15, paddingBottom:10, paddingHorizontal:19}, isEditor?{height:windowType=='landscape'?'50%':'100%'}:{}]}>
        <View style={{alignItems:'center', width:'100%',flexDirection:'row'}}>
          <CommonButton title={''} style={{height:'100%', paddingTop:8, borderTopRightRadius:0, borderBottomRightRadius:0, justifyContent:'center'}} onPress={()=>{setBottomTab(!bottomTab)}}>
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
        <Editor theme={theme} active={isEditor} value={editorValue} setValue={setEditorValue} onReady={()=>setBottomTab(false)}/>
        {bottomTab && <View style={{alignItems:'center', width:'100%', flexDirection:'row', paddingTop:15, paddingBottom:5}}>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`📤\n ${lang('File')}`} onPress={()=>uploadFile().then(f=>{contentMutation.create({channel:channel_id, user:auth.user?.id, content:'', file:f});setBottomTab(false)})}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`✏️\n ${lang('Editor')}`} onPress={()=>{setIsEditor(!isEditor); isEditor && setBottomTab(false)}}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`⌚\n ${lang('Timer')}`} onPress={()=>{setModal(DateTimePickerModal, {datetime:timer, callback:(datetime:string)=>setTimer(datetime)});setBottomTab(false)}}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center'}} title={`📹\n ${lang('Video Call')}`} onPress={()=>{setVideoMode(!videoMode);setBottomTab(false)}} disabled={videoMode}/>
        </View>}
      </ThemedView>
    </View>
  </View>
}