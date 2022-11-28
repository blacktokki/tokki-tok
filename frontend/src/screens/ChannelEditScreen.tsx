import React, {useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput, StyleSheet } from 'react-native';
import CommonSection from '../components/CommonSection';
import { View, Text } from '../components/Themed';
import CommonButton from '../components/CommonButton';
import useBoardChannelList, { useBoardChannelMutation } from '../hooks/lists/useBoardChannelList';
import useAuthContext from '../hooks/useAuthContext';
import { navigate } from '../navigation';
import { Channel } from '../types';
import useMessengerChannelList, { useMessengerChannelMutation } from '../hooks/lists/useMessengerChannelList';


export default function ChannelEditScreen({navigation, route}: StackScreenProps<any, 'ChannelEdit'>) {
  const id = route?.params?.id
  const type = route?.params?.type
  const {auth} = useAuthContext()
  const channelList = type=='messenger'?useMessengerChannelList(auth):useBoardChannelList(auth)
  const channelMutation = type=='messenger'?useMessengerChannelMutation():useBoardChannelMutation()
  const channel = channelList?.find(v=>v.id==id)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [contentHeight, setContentHeight] = useState<number>()
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.replace('Main')
      }
  }
  useEffect(()=>{
    if (channel){
      setName(channel.name)
      setDescription(channel?.description || '')
    }
  }, [channel])
  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    <View style={{justifyContent:'space-around'}}>
    <Text style={{fontSize:20}}>Edit Channel - {type}</Text>
    </View>
    <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <View style={styles.field}>
      <Text style={styles.text}>Name</Text><TextInput style={styles.textInput} value={name} onChangeText={setName}/>
    </View>
    <View style={styles.field}>
      <Text style={styles.text}>Description</Text><TextInput style={[styles.textInput, {height:contentHeight}]} value={description} onChangeText={setDescription}
         onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height + 2)} multiline/>
    </View>
    <View style={[styles.field, {justifyContent:'flex-end'}]}>
      <CommonButton title={'save'} onPress={()=>{
        if(auth?.user?.id && auth.groupId){
          const newChannel:Channel = {id, name, description, type, owner:auth?.user?.id, group:auth.groupId};
          id?channelMutation.update(newChannel):channelMutation.create(newChannel)
          navigate("Main", {screen:"HomeScreen", params: {tab:type=='messenger'?1:2}})
        }
      }}/>
      <CommonButton title={'cancel'} onPress={back}/>
    </View>
  </CommonSection>
}

const styles = StyleSheet.create({
  field:{
    width:'50%',
    flexDirection:'row',
    padding:10,
  },
  text:{
    flex:1,
    fontSize:16
  },
  textInput: {
    flex:2,
    fontSize:16,
    borderRadius:6,
    borderWidth:1,
    padding:1,
    borderColor:'#d0d7de',
  },
  separator: {
    marginBottom: 20,
    height: 1,
    width: '100%',
  },
})