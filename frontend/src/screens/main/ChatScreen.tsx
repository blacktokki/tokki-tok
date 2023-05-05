import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, TextInput } from 'react-native-gesture-handler';
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

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const height = useRef(0)
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
    contentMutation.create({channel:channel_id, user:auth.user?.id, content:value})
    setValue('')
    setAutoFocus(true)
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
        <View style={[
          {flexDirection: 'row', justifyContent:'center', borderColor:Colors.borderColor, borderRadius:10, paddingTop:10, backgroundColor:'white'},
          videoMode!==null?{borderTopWidth:1}:{}]}>
          <View style={{maxWidth:'33%', flexDirection: 'row', marginHorizontal:10, flex:1}}>
            <LocalCam mode={videoMode}/>
          </View>
        </View>
        <View style={{bottom:0, width:'100%', backgroundColor:'white', alignItems:'center'}}>
          <View style={{width:'100%',flexDirection:'row', paddingTop:15, paddingBottom:10, paddingHorizontal:19}}>
            <TextInput ref={inputRef} value={value} onChangeText={setValue} style={{flex:1, borderWidth:1, height:40, borderRadius:6, borderColor:Colors.borderColor}} onSubmitEditing={postValue} blurOnSubmit={true}/>
            <CommonButton title={'💬'} onPress={postValue}/>
            <CommonButton title={'📹'} onPress={()=>setVideoMode(videoMode!='camera'?'camera':null)}/>
            <CommonButton title={'🖥️'} onPress={()=>setVideoMode(videoMode!='display'?'display':null)}/>
          </View>
        </View>
      </View>
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
