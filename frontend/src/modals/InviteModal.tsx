import React, {useRef,MutableRefObject, useMemo, useState, useEffect } from 'react';
import { View, Text } from '../components/Themed';
import useAuthContext from '../hooks/useAuthContext';
import usePeopleUserList from '../hooks/lists/usePeopleUserList';
import { TabViewRecord, User } from '../types';
import CommonButton from '../components/CommonButton';
import useMessengerMemberList, { useMessengerMemberMutation } from '../hooks/lists/useMessengerMemberList';
import useModalsContext from '../hooks/useModalsContext';
import useExternalUserList from '../hooks/lists/useExternalUserList';
import TextField from '../components/TextField';
import useLocalSearch from '../hooks/useLocalSearch';
import TabView from '../components/TabView';
import { FlatList } from 'react-native-gesture-handler';
import useLangContext from '../hooks/useLangContext';
import MemberItem from '../components/MemberItem';
import ModalSection from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';
import CopyField from '../components/CopyField';

const InviteItem = (props:{item:User, selectedRef:MutableRefObject<Set<number>>})=>{
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
  selectedRef:MutableRefObject<Set<number>>
  userFilter:(user:User)=>boolean
}

const PeopleTabView = ({selectedRef, userFilter}:InviteTabViewProps)=>{
  const { lang } = useLangContext()
  const {auth} = useAuthContext()
  const userList = usePeopleUserList(auth)
  const rawData = useMemo(()=>{
    return userList?.filter(userFilter) || []
  }, [userList, userFilter])
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
  return <View style={{alignItems:'center', flex:1}}>
    <View style={{'width': '100%', flex:1}}>
      <TextField name={`${lang('Username')} & ${lang('Name')}`} placeholder={auth.user?.name} value={searchState.keyword} setValue={search} width={'80%'}/>
      {data && <FlatList contentContainerStyle={{flexGrow:1}} data={data} renderItem={({item})=><InviteItem item={item} selectedRef={selectedRef}/>}/>}
    </View>
  </View>
}

const DELAY = 500

export const ExternalMembershipTabView = ({selectedRef, userFilter, isChannel}:InviteTabViewProps & {isChannel:boolean})=>{
  const { lang } = useLangContext()
  const [value, setValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const {auth} = useAuthContext()
  const externalMemberList = useExternalUserList(keyword)
  const data = useMemo(()=>{
    return externalMemberList?.filter(userFilter) || []
  }, [externalMemberList, userFilter])
  useEffect(()=>{
    timeoutRef.current = setTimeout(()=>{
      setKeyword(value)
    }, DELAY)
    return ()=>{timeoutRef.current && clearTimeout(timeoutRef.current)}
  }, [value])
  const inviteLink = isChannel?location.href.replace('chat', 'invitee'):undefined
  return <View style={{alignItems:'center', flex:1}}>
  <View style={{'width': '100%', flex:1, paddingVertical:10}}>
    {inviteLink && <>
      <CopyField name={lang('invite link')} width={'80%'} value={inviteLink}/>
      <View style={{marginVertical: 10, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    </>}
    <TextField name={lang('Username')} placeholder={auth.user?.username} value={value} setValue={setValue} width={'80%'}/>
    {data && <FlatList contentContainerStyle={{flexGrow:1}} data={data} renderItem={({item})=><InviteItem item={item} selectedRef={selectedRef}/>}/>}
  </View>
</View>
}

export default function InviteModal({id}:{id:number}) {
  const { lang } = useLangContext()
  const selectedRef = useRef<Set<number>>(new Set())
  const messengerMemberList = useMessengerMemberList(id)
  const userFilter =  useMemo(()=>{
    const memberSet = new Set(messengerMemberList?.map(v=>v.user))
    return (user:User) => !memberSet.has(user.id);
  }, [messengerMemberList])
  const drawerTabs:TabViewRecord = {
    member:{
      title: 'People',
      component: ()=><PeopleTabView selectedRef={selectedRef} userFilter={userFilter}/>,
      icon: <></>
    },
    external:{
      title: 'External members',
      component: ()=><ExternalMembershipTabView selectedRef={selectedRef} userFilter={userFilter} isChannel/>,
      icon: <></>
    }
  }
  const messengerMemberMutation = useMessengerMemberMutation()
  const { setModal } = useModalsContext()
  const back = ()=>{
    setModal(InviteModal, null)
  }
  useModalEffect(back, [])
  return <ModalSection>
    <View style={{flex:1, width:'100%'}}>
      <View style={{width:'100%'}}>
        <Text style={{fontSize:20}}>{lang('invite')}</Text>
        <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
      </View>
      <TabView tabs={drawerTabs} tabBarPosition={"top"}/>
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
  </ModalSection>
}

