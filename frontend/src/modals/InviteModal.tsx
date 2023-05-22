import React, {useRef,MutableRefObject, useMemo, useState } from 'react';
import { View, Text } from '../components/Themed';
import CommonSection from '../components/CommonSection';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { UserMembership } from '../types';
import CommonButton from '../components/CommonButton';
import useMessengerMemberList, { useMessengerMemberMutation } from '../hooks/lists/useMessengerMemberList';
import { renderMemberItem } from '../tabs/MemberTab';
import lang from  '../lang'
import useModalsContext from '../hooks/useModalsContext';

const InviteItem = (props:{item:UserMembership, selectedRef:MutableRefObject<Set<number>>})=>{
  const [selected, setSelected] = useState(props.selectedRef.current.has(props.item.id))
  return <View style={selected?{borderWidth:1, borderColor:'blue'}:{}}>
    {renderMemberItem(props.item, ()=>{
      if (selected){
        setSelected(false)
        props.selectedRef.current.delete(props.item.id)
      }
      else{
        setSelected(true)
        props.selectedRef.current.add(props.item.id)
      }
    })}
  </View>

}

export default function InviteModal({id}:{id:number}) {
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const userList = useUserMembershipList(auth)
  const memberList = useMessengerMemberList(id)
  const messengerMemberMutation = useMessengerMemberMutation()
  const selectedRef = useRef<Set<number>>(new Set())
  const data = useMemo(()=>{
    const memberSet = new Set(memberList?.map(v=>v.user))
    return userList?.filter(v=>!memberSet.has(v.id))
  }, [userList, memberList])


  const back = ()=>{
    setModal(InviteModal, null)
  }

  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    <View style={{justifyContent:'space-around'}}>
    <Text style={{fontSize:20}}>{lang('invite')}</Text>
    </View>
    <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <View style={{backgroundColor:'white', 'width': '50%'}}>
    {id && data?.map((item, index)=><InviteItem key={index} item={item} selectedRef={selectedRef}/>)}
    </View>
    <View style={[{width:'50%', flexDirection:'row', padding:10,}, {justifyContent:'flex-end'}]}>
      <CommonButton title={lang('invite')} onPress={()=>{
        messengerMemberMutation.invite({
          channel_id:id,
          user_ids:[...selectedRef.current]
        })
        back()
      }}/>
      <CommonButton title={lang('cancel')} onPress={back}/>
    </View>
  </CommonSection>
}

