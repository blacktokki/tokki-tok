import React, {useRef,MutableRefObject, useMemo, useState, useEffect } from 'react';
import CopyField from '../components/CopyField';
import ModalSection from '../components/ModalSection';
import TextField from '../components/TextField';
import { View, Text } from '../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import useExternalMembershipList from '../hooks/lists/useExternalMembershipList';
import useAuthContext from '../hooks/useAuthContext';
import useLangContext from "../hooks/useLangContext"
import { UserMembership } from '../types';
import MemberItem from '../components/MemberItem';
import CommonButton from '../components/CommonButton';
import useUserMembershipList, { useUserMembershipMutation } from '../hooks/lists/useUserMembershipList';
import useModalsContext from '../hooks/useModalsContext';

export const InviteItem = (props:{item:UserMembership, selectedRef:MutableRefObject<Set<number>>})=>{
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

const DELAY = 500
export const ExternalMembershipView = (props:{selectedRef:MutableRefObject<Set<number>>, memberSet:Set<number>, onInvite:()=>void, back:()=>void, inviteLink?:string})=>{
  const {auth} = useAuthContext()
  const { lang } = useLangContext()
  const [value, setValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const externalMemberList = useExternalMembershipList(keyword)
  const data = useMemo(()=>{
    return externalMemberList?.filter(v=>!props.memberSet.has(v.id)) || []
  }, [externalMemberList, props.memberSet])

  useEffect(()=>{
    timeoutRef.current = setTimeout(()=>{
      setKeyword(value)
    }, DELAY)
    return ()=>{timeoutRef.current && clearTimeout(timeoutRef.current)}
  }, [value])

  return <View style={{alignItems:'center', flex:1}}>
    <View style={{'width': '100%', flex:1, paddingVertical:10}}>
      <CopyField name={lang('invite link')} width={'80%'} value={props.inviteLink}/>
      <View style={{marginVertical: 10, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
      <TextField name={lang('Username')} placeholder={auth.user?.username} value={value} setValue={setValue} width={'80%'}/>
      {data && <FlatList contentContainerStyle={{flexGrow:1}} data={data} renderItem={({item})=><InviteItem item={item} selectedRef={props.selectedRef}/>}/>}
    </View>
    <View style={[{width:'100%', flexDirection:'row', padding:10,}, {justifyContent:'flex-end'}]}>
      <CommonButton title={lang('invite')} onPress={props.onInvite}/>
      <CommonButton title={lang('cancel')} onPress={props.back}/>
    </View>
  </View>
}


export default function GroupInviteModal() {
    const { lang } = useLangContext()
    const {auth} = useAuthContext()
    const { setModal } = useModalsContext()
    const back = ()=>{
        setModal(GroupInviteModal, null)
    }
    const selectedRef = useRef<Set<number>>(new Set())
    const userList = useUserMembershipList(auth)
    const memberSet = useMemo(()=>new Set(userList?.map(v=>v.id)), [userList])
    const userMembershipMutation = useUserMembershipMutation()
    const inviteLink = location.href.replace(/home.*/i, `group-invitee/?id=${auth.groupId}`)
    return <ModalSection>
      <View style={{flex:1, width:'100%'}}>
        <View style={{width:'100%'}}>
          <Text style={{fontSize:20}}>{lang('invite')}</Text>
          <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
        </View>
        <ExternalMembershipView
            selectedRef={selectedRef}
            inviteLink={inviteLink}
            memberSet={memberSet}
            onInvite={()=>{
                userMembershipMutation.setUserGroup({
                  user_ids:[...selectedRef.current],
                  invite_group_id: auth?.groupId
                }).then(back)
              }}
            back={back}
        />
      </View>
    </ModalSection>
  }