import React, {useRef,MutableRefObject, useMemo } from 'react';
import { View, Text } from '../components/Themed';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { TabViewRecord } from '../types';
import CommonButton from '../components/CommonButton';
import useMessengerMemberList, { useMessengerMemberMutation } from '../hooks/lists/useMessengerMemberList';
import useModalsContext from '../hooks/useModalsContext';
import TextField from '../components/TextField';
import useLocalSearch from '../hooks/useLocalSearch';
import TabView from '../components/TabView';
import { FlatList } from 'react-native-gesture-handler';
import useLangContext from '../hooks/useLangContext';
import ModalSection from '../components/ModalSection';
import useModalEffect from '../hooks/useModalEffect';
import { ExternalMembershipView, InviteItem } from './GroupInviteModal';


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
  useModalEffect(back, [])
  return <View style={{alignItems:'center', flex:1}}>
    <View style={{'width': '100%', flex:1}}>
      <TextField name={`${lang('Username')} & ${lang('Name')}`} placeholder={auth.user?.name} value={searchState.keyword} setValue={search} width={'80%'}/>
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


const ExternalMembershipTabView = ({id, selectedRef}:InviteTabViewProps)=>{
  const messengerMemberMutation = useMessengerMemberMutation()
  const { setModal } = useModalsContext()
  const back = ()=>{
    setModal(InviteModal, null)
  }
  const memberList = useMessengerMemberList(id)
  const memberSet = useMemo(()=>new Set(memberList?.map(v=>v.user)), [memberList])
  const inviteLink = location.href.replace('chat', 'invitee')
  return <ExternalMembershipView
    memberSet={memberSet}
    selectedRef={selectedRef}
    inviteLink={inviteLink}
    onInvite={()=>{
      messengerMemberMutation.invite({
        channel_id:id,
        user_ids:[...selectedRef.current]
      }).then(back)
    }}
    back={back}
  />
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

