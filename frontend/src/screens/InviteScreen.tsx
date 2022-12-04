import React, {useRef,MutableRefObject, useMemo, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text } from '../components/Themed';
import CommonSection from '../components/CommonSection';
import useAuthContext from '../hooks/useAuthContext';
import useUserMembershipList from '../hooks/lists/useUserMembershipList';
import { UserMembership } from '../types';
import CommonButton from '../components/CommonButton';
import useMessengerMemberList, { useMessengerMemberMutation } from '../hooks/lists/useMessengerMemberList';
import { renderMemberItem } from '../tabs/MemberTab';
import { navigate } from '../navigation';


const InviteItem = (props:{item:UserMembership, selectedRef:MutableRefObject<Set<number>>})=>{
  const [selected, setSelected] = useState(props.selectedRef.current.has(props.item.id))
  return <View style={selected?{borderWidth:1, borderColor:'blue'}:{}}>
    {renderMemberItem(props.item, (item)=>{
      if (selected){
        setSelected(false)
        props.selectedRef.current.delete(item.id)
      }
      else{
        setSelected(true)
        props.selectedRef.current.add(item.id)
      }
    })}
  </View>

}

export default function InviteScreen({navigation, route}: StackScreenProps<any, 'Invite'>) {
  const id = route?.params?.id
  const {auth} = useAuthContext()
  const userList = useUserMembershipList(auth)
  const memberList = useMessengerMemberList(id)
  const messengerMemberMutation = useMessengerMemberMutation()
  const selectedRef = useRef<Set<number>>(new Set())
  const data = useMemo(()=>{
    const memberSet = new Set(memberList?.map(v=>v.user))
    return userList?.filter(v=>!memberSet.has(v.id))
  }, [userList, memberList])


  const back = ()=>{
    if(navigation.canGoBack())
      navigation.goBack()
    else if (id)
      navigate("ChatScreen", {id})
    else
      navigation.replace('Main')
  }

  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    {data?.map((item, index)=><InviteItem key={index} item={item} selectedRef={selectedRef}/>)}
    <View style={[{width:'50%', flexDirection:'row', padding:10,}, {justifyContent:'flex-end'}]}>
      <CommonButton title={'save'} onPress={()=>{
        messengerMemberMutation.invite({
          channel_id:id,
          user_ids:[...selectedRef.current]
        })
        back()
      }}/>
      <CommonButton title={'cancel'} onPress={back}/>
    </View>
  </CommonSection>
}

