import React, {useRef, useMemo } from 'react';
import { View, Text } from '../components/Themed';
import useAuthContext from '../hooks/useAuthContext';
import usePeopleUserList, { usePeopleMutation } from '../hooks/lists/usePeopleUserList';
import { User } from '../types';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import useLangContext from '../hooks/useLangContext';
import ModalSection from '../components/ModalSection';
import { ExternalMembershipTabView } from './InviteModal';

export default function AddPeopleModal(){
  const { lang } = useLangContext()
  const selectedRef = useRef<Set<number>>(new Set())
  const { auth } = useAuthContext()
  const userList = usePeopleUserList(auth);
  const peopleMutation = usePeopleMutation()
  const userFilter =  useMemo(()=>{
    const memberSet = new Set(userList?.map(v=>v.id))
    return (user:User) => !memberSet.has(user.id);
  }, [userList])
  const { setModal } = useModalsContext()
  const back = ()=>{
    setModal(AddPeopleModal, null)
  }
  return <ModalSection>
  <View style={{flex:1, width:'100%'}}>
    <View style={{width:'100%'}}>
      <Text style={{fontSize:20}}>{lang('Add people')}</Text>
      <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    </View>
    <ExternalMembershipTabView selectedRef={selectedRef} userFilter={userFilter} isChannel={false}/>
    <View style={[{width:'100%', flexDirection:'row', padding:10,}, {justifyContent:'flex-end'}]}>
        <CommonButton title={lang('add')} onPress={()=>{
          peopleMutation.create({
            user_ids:[...selectedRef.current]
          }).then(back)
        }}/>
        <CommonButton title={lang('cancel')} onPress={back}/>
      </View>
    </View>
  </ModalSection>
}

