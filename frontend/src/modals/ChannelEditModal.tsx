import React, {useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import CommonSection from '../components/CommonSection';
import { View, Text } from '../components/Themed';
import CommonButton from '../components/CommonButton';
// import useBoardChannelList, { useBoardChannelMutation } from '../hooks/lists/useBoardChannelList';
import useAuthContext from '../hooks/useAuthContext';
import { navigate } from '../navigation';
import { Channel } from '../types';
import useMessengerChannelList, { useMessengerChannelMutation } from '../hooks/lists/useMessengerChannelList';
import TextField from '../components/TextField';
import useModalsContext from '../hooks/useModalsContext';
import useLangContext from '../hooks/useLangContext';

export default function ChannelEditModal({id, type}: {id?:number, type:string}) {
  const { lang } = useLangContext()
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const channelList = useMessengerChannelList(auth)
  const channelMutation = useMessengerChannelMutation()
  const channel = channelList?.find(v=>v.id==id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const back = ()=>{
    setModal(ChannelEditModal, null)
  }
  useEffect(()=>{
    if (channel){
      setName(channel.name)
      setDescription(channel?.description || '')
    }
  }, [channel])
  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    <View style={{justifyContent:'space-around'}}>
    <Text style={{fontSize:20}}>{lang('Channel')}</Text>
    </View>
    <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <View style={{width:'100%'}}>
      <TextField name={lang('Channel Name')} value={name} setValue={setName} width={'60%'}/>
      <TextField name={lang('Description')} value={description} setValue={setDescription} multiline width={'60%'}/>
    </View>
    <View style={{width:'100%', flexDirection:'row', justifyContent:'flex-end'}}>
      <CommonButton title={lang('save')} onPress={()=>{
        if(auth?.user?.id && auth.groupId){
          const newChannel:Channel = {id, name, description, type, owner:auth?.user?.id, group:auth.groupId};
          (id?channelMutation.update(newChannel):channelMutation.create(newChannel)).then(v=>navigate("Main", {
            screen:v.type == 'messenger'?'ChatScreen':'BoardScreen',
            params:{id:v.id}
          }))
        }
      }}/>
      <CommonButton title={lang('cancel')} style={{marginHorizontal:5}} onPress={back}/>
    </View>
  </CommonSection>
}

const styles = StyleSheet.create({
  field:{
    width:'50%',
    flexDirection:'row',
    padding:10,
  },
  separator: {
    marginBottom: 20,
    height: 1,
    width: '100%',
  },
})