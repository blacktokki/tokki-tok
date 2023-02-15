import React, {useState, useEffect, useMemo} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import CommonSection from '../components/CommonSection';
import { View, Text } from '../components/Themed';
import CommonButton from '../components/CommonButton';
import useBoardChannelList from '../hooks/lists/useBoardChannelList';
import useAuthContext from '../hooks/useAuthContext';
import { navigate } from '../navigation';
import useBoardContentList, { useBoardContentMutation } from '../hooks/lists/useBoardContentList';
import { Board } from '../types';
import TextField from '../components/TextField';
import useIsMobile from '../hooks/useIsMobile';


export default function BoardEditScreen({navigation, route}: StackScreenProps<any, 'BoardEdit'>) {
  const id = route?.params?.id
  const channel_id = route?.params?.channel_id
  const {auth} = useAuthContext()
  const boardChannelList = useBoardChannelList(auth)
  const boardContentList = useBoardContentList(channel_id)
  const boardContentMutation = useBoardContentMutation()
  const channel = boardChannelList?.find(v=>v.id==channel_id)
  const board = useMemo(()=>boardContentList?.find(v=>v.id==id)?.board_set[0], [boardContentList])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const isMobile = useIsMobile()
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.replace('Main')
      }
  }
  useEffect(()=>{
    if (!(channel_id && channel) && boardChannelList)
      back()
  }, [boardChannelList])
  useEffect(()=>{
    if (board){
      setTitle(board.title)
      setContent(board.content)
    }
  }, [board])
  const minWidth = isMobile?270:720
  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    <View style={{justifyContent:'space-around'}}>
      <Text style={{fontSize:20}}>Edit Board</Text>
    </View>
    <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <View style={{width:isMobile?'50%':'80%', minWidth}}>
      <TextField name='Channel' disabled={true} value={channel?.name || ''} width={'100%'}/>
      <TextField name='Title' value={title} setValue={setTitle} width={'100%'}/>
      <TextField name='Content' value={content} setValue={setContent} multiline width={'100%'} minHeight={300}/>
    </View>
    <View style={[styles.field, {justifyContent:'flex-end', minWidth}]}>
      <CommonButton title={'save'} onPress={()=>{
        const newBoard:Board = {id:board?.id, title, content};
        id?boardContentMutation.update(newBoard):boardContentMutation.create({...newBoard, user:auth.user?.id, channel:channel_id})
        navigate("Main", {screen:"BoardScreen", params: {id:channel_id}})
      }}/>
      <CommonButton title={'cancel'} style={{marginHorizontal:5}} onPress={back}/>
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