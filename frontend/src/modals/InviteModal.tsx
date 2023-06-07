import React, {useRef,MutableRefObject, useMemo, useState, useEffect } from 'react';
import Clipboard from '@react-native-clipboard/clipboard/dist';
import { View, Text } from '../components/Themed';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { TabViewRecord, UserMembership } from '../types';
import CommonButton from '../components/CommonButton';
import useMessengerMemberList, { useMessengerMemberMutation } from '../hooks/lists/useMessengerMemberList';
import useModalsContext from '../hooks/useModalsContext';
import useExternalMembershipList from '../hooks/lists/useExternalMembershipList';
import TextField from '../components/TextField';
import useLocalSearch from '../hooks/useLocalSearch';
import TabView from '../components/TabView';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import useLangContext from '../hooks/useLangContext';
import MemberItem from '../components/MemberItem';
import ModalSection from '../components/ModalSection';

const InviteItem = (props:{item:UserMembership, selectedRef:MutableRefObject<Set<number>>})=>{
  const [selected, setSelected] = useState(props.selectedRef.current.has(props.item.id))
  return <View style={selected?{borderWidth:1, borderColor:'blue'}:{}}>
    <MemberItem member={props.item} onPress={()=>{
      if (selected){
        setSelected(false)
        props.selectedRef.current.delete(props.item.id)
      }
      else{
        setSelected(true)
        props.selectedRef.current.add(props.item.id)
      }
    }}/>
  </View>

}
type InviteTabViewProps = {
  id:number,
  selectedRef:MutableRefObject<Set<number>>
}

const GroupTabView = ({id, selectedRef}:InviteTabViewProps)=>{
  const { lang } = useLangContext()
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const userList = useUserMembershipList(auth)
  const memberList = useMessengerMemberList(id)
  const messengerMemberMutation = useMessengerMemberMutation()
  const rawData = useMemo(()=>{
    const memberSet = new Set(memberList?.map(v=>v.user))
    return userList?.filter(v=>!memberSet.has(v.id)) || []
  }, [userList, memberList])
  const {data, dispatch:dispatchKeyword, searchState} = useLocalSearch(rawData, (v, keyword)=>(v.username.includes(keyword) || v.name.includes(keyword)))
  const search = (k:string)=>{
    if (k?.length>0){
      dispatchKeyword({type:'ENABLE_SEARCH'})
      dispatchKeyword({type:'SEARCH', keyword:k})
    }
    else{
      dispatchKeyword({type:'DISABLE_SEARCH'})
    }
  }
  const back = ()=>{
    setModal(InviteModal, null)
  }
  return <View style={{alignItems:'center', flex:1}}>
    <View style={{'width': '100%', flex:1}}>
      <TextField name={`${lang('Username')} & ${lang('Name')}`} value={searchState.keyword} setValue={search} width={'80%'}/>
      {id && data && <FlatList contentContainerStyle={{flexGrow:1}} data={data} renderItem={({item})=><InviteItem item={item} selectedRef={selectedRef}/>}/>}
    </View>
    <View style={[{width:'100%', flexDirection:'row', padding:10,}, {justifyContent:'flex-end'}]}>
      <CommonButton title={lang('invite')} onPress={()=>{
        messengerMemberMutation.invite({
          channel_id:id,
          user_ids:[...selectedRef.current]
        }).then(back)
      }}/>
      <CommonButton title={lang('cancel')} onPress={back}/>
    </View>
  </View>
}

const DELAY = 500

const ExternalMembershipTabView = ({id, selectedRef}:InviteTabViewProps)=>{
  const { lang } = useLangContext()
  const [value, setValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { setModal } = useModalsContext()
  const memberList = useMessengerMemberList(id)
  const externalMemberList = useExternalMembershipList(keyword)
  const data = useMemo(()=>{
    const memberSet = new Set(memberList?.map(v=>v.user))
    return externalMemberList?.filter(v=>!memberSet.has(v.id)) || []
  }, [externalMemberList, memberList])
  const messengerMemberMutation = useMessengerMemberMutation()
  useEffect(()=>{
    timeoutRef.current = setTimeout(()=>{
      setKeyword(value)
    }, DELAY)
    return ()=>{timeoutRef.current && clearTimeout(timeoutRef.current)}
  }, [value])
  const back = ()=>{
    setModal(InviteModal, null)
  }
  const inviteLink = location.href.replace('chat', 'invitee')
  return <View style={{alignItems:'center', flex:1}}>
  <TouchableOpacity style={{paddingVertical:10, flexDirection:"row"}} onPress={()=>{Clipboard.setString(inviteLink);setCopied(true)}}>
    <Text style={{fontSize:14}}>{lang('invite link')}{": "}</Text>
    <Text style={{fontSize:14, color:'#12b886'}}>{inviteLink}{" "}</Text>
    {copied && <Text style={{fontSize:12, color:'red'}}>{lang("copied")}</Text>}
  </TouchableOpacity>
  <View style={{'width': '100%', flex:1}}>
    <TextField name={lang('Username')} value={value} setValue={setValue} width={'80%'}/>
    {id && data && <FlatList contentContainerStyle={{flexGrow:1}} data={data} renderItem={({item})=><InviteItem item={item} selectedRef={selectedRef}/>}/>}
  </View>
  <View style={[{width:'100%', flexDirection:'row', padding:10,}, {justifyContent:'flex-end'}]}>
    <CommonButton title={lang('invite')} onPress={()=>{
      messengerMemberMutation.invite({
        channel_id:id,
        user_ids:[...selectedRef.current]
      }).then(back)
    }}/>
    <CommonButton title={lang('cancel')} onPress={back}/>
  </View>
</View>
}

export default function InviteModal({id}:{id:number}) {
  const { lang } = useLangContext()
  const selectedRef = useRef<Set<number>>(new Set())
  const drawerTabs:TabViewRecord = {
    group:{
      title: 'Group',
      component: ()=><GroupTabView id={id} selectedRef={selectedRef}/>,
      icon: <></>
    },
    external:{
      title: 'External members',
      component: ()=><ExternalMembershipTabView id={id} selectedRef={selectedRef}/>,
      icon: <></>
    }
  }
  return <ModalSection>
    <View style={{flex:1, width:'100%'}}>
      <View style={{width:'100%'}}>
        <Text style={{fontSize:20}}>{lang('invite')}</Text>
        <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
      </View>
      <TabView tabs={drawerTabs} tabBarPosition={"top"}/>
    </View>
  </ModalSection>
}

