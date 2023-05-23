import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Platform, StyleSheet, View } from 'react-native';
import CommonSection from '../../../components/CommonSection';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import CommonButton from '../../../components/CommonButton';
import useMessengerContentList, { MessengerContentPage, useMessengerContentMutation } from '../../../hooks/lists/useMessengerContent.List';
import useAuthContext from '../../../hooks/useAuthContext';
import HeaderRight from '../../../components/HeaderRight';
import useMessengerMemberList, { useMessengerMemberMutation } from '../../../hooks/lists/useMessengerMemberList';
import { navigate } from '../../../navigation';
import Colors from '../../../constants/Colors';
import useColorScheme from '../../../hooks/useColorScheme';
import { Text, View as ThemedView } from '../../../components/Themed' 
import Hyperlink from 'react-native-hyperlink'
import useMessengerChannelList from '../../../hooks/lists/useMessengerChannelList';
import useIsMobile from '../../../hooks/useIsMobile';
import LinkPreview from '../../../components/LinkPreview';
import lang from '../../../lang'
import Avatar from '../../../components/Avatar';
import VideoCallSection from './VideoCallSection';
import useResizeWindow from '../../../hooks/useResizeWindow';
import FilePreview from '../../../components/FilePreview';
import useModalsContext from '../../../hooks/useModalsContext';
import InviteModal from '../../../modals/InviteModal';


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
        if (isSystem)
          return <View key={content.id} style={{flexDirection:'row', justifyContent:'center', width:'100%', marginVertical:5}}>
            <Text>{message.content}</Text>
          </View>
        return <View key={content.id}>
          {dayChanged?<View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}><Text>{date}</Text></View>:undefined}
          <View key={content.id} style={{flexDirection:'row', justifyContent:isSelf?'space-between':'flex-start', width:'100%'}}>
            {isFirst && !isSelf? <View style={{marginTop:3, marginLeft:12}}><Avatar name={content.name} userId={content.user} size={36}/></View>:<View style={{width:48}}/>}
            <CommonSection outerContainerStyle={{width:undefined, maxWidth:'90%'}} title={isFirst?content.name:undefined} titleStyle={{flex:undefined}} bodyStyle={{padding:10}} subtitle={`${created.slice(11)}`}>
              {/* @ts-ignore */}
              <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}}>
                <Text selectable>{message.content}</Text>
              </Hyperlink>
              {content.file_set.map((file, fileIndex)=><FilePreview key={fileIndex} file={file} isMobile={isMobile} showBorder={content.file_set.length>1 || message.content.length>0}/>)}
              {content.link_set.map((link, linkIndex)=><LinkPreview key={linkIndex} link={link} isMobile={isMobile}/>)}              
            </CommonSection>
          </View>
        </View>
      })}
    </View>

})

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const height = useRef(0)
  const inputRef = useRef<TextInput>(null)
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const channel = useMessengerChannelList(auth)?.find(v=>v.id==parseInt(channel_id))
  const {data, fetchNextPage } = useMessengerContentList(channel_id)
  const memberList = useMessengerMemberList(channel_id)
  const member_id = useMemo(()=>memberList?.find(v=>v.user == auth.user?.id)?.id, [auth, memberList])
  const windowType = useResizeWindow()
  const messengerMemberMutation = useMessengerMemberMutation()
  const [value, setValue] = useState('')
  const [autoFocus, setAutoFocus] = useState(true)
  const [videoMode, setVideoMode] = useState<boolean>(false)
  const theme = useColorScheme()
  const postValue = ()=>{
    if (value.length>0){
      contentMutation.create({channel:channel_id, user:auth.user?.id, content:value})
      setValue('')
      setAutoFocus(true)
    }
  }
  const contentMutation = useMessengerContentMutation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ()=> <HeaderRight extra={[
        {title:lang('invite'), onPress:()=>setModal(InviteModal, {id:channel_id})},
        {title:lang('leave'), onPress:()=>{member_id && messengerMemberMutation.leave(member_id).then(back)}}
      ]}/>,
      title: channel?.name
    });
  }, [navigation, route, member_id]);

  const renderItem = useCallback(({item, index}:{item:MessengerContentPage, index:number})=><MessengerContentPageItem {...item} ownerId={auth.user?.id}/>, [auth])
  
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

  return <View style={{flex:1, alignItems:'center', flexDirection:windowType=='landscape'?'row-reverse':'column'}}>
    <VideoCallSection channel_id={channel_id} setDisable={(d)=>setVideoMode(!d)} disable={!videoMode}/>
    <View style={[{flex:videoMode?undefined:1, flexShrink:1}, windowType=='landscape'?{minWidth:320, height:'100%'}:{width:'100%'}]}>
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
      <ThemedView style={{bottom:0, alignItems:'center', width:'100%',flexDirection:'row', paddingTop:15, paddingBottom:10, paddingHorizontal:19}}>
        <TextInput ref={inputRef} value={value} onChangeText={setValue} style={{
          flex:1, borderWidth:1, height:40, borderRadius:6, borderColor:Colors.borderColor, backgroundColor:Colors[theme].background, color:Colors[theme].text
        }} onSubmitEditing={postValue} blurOnSubmit={true}/>
        <CommonButton title={'💬'} onPress={postValue}/>
        <CommonButton title={'📤'} onPress={()=>uploadFile().then(f=>{
          contentMutation.create({channel:channel_id, user:auth.user?.id, content:'', file:f})
        })}/>
        {!videoMode && <CommonButton title={'📹'} onPress={()=>setVideoMode(!videoMode)}/>}
      </ThemedView>
    </View>
  </View>
}