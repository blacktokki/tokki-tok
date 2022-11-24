import React, {useState, useEffect, useMemo} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput, StyleSheet } from 'react-native';
import CommonSection from '../components/CommonSection';
import { View, Text } from '../components/Themed';
import CommonButton from '../components/CommonButton';
import useBoardChannelList from '../hooks/lists/useBoardChannelList';
import useAuthContext from '../hooks/useAuthContext';
import { navigate } from '../navigation';
import useBoardContentList, { useBoardContentMutation } from '../hooks/lists/useBoardContentList';
import { Board } from '../types';


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
  const [contentHeight, setContentHeight] = useState<number>()
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
  return <CommonSection outerContainerStyle={{alignSelf:'center'}}>
    <View style={{justifyContent:'space-around'}}>
    <Text style={{fontSize:20}}>Edit Board</Text>
    </View>
    <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <View style={styles.field}>
      <Text style={styles.text}>Channel</Text><TextInput style={[styles.textInput, {backgroundColor:'#EEE'}]} editable={false} value={channel?.name || ''}/>
    </View>
    <View style={styles.field}>
      <Text style={styles.text}>Title</Text><TextInput style={styles.textInput} value={title} onChangeText={setTitle}/>
    </View>
    <View style={styles.field}>
      <Text style={styles.text}>Contnet</Text><TextInput style={[styles.textInput, {height:contentHeight}]} value={content} onChangeText={setContent}
         onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height + 2)} multiline/>
    </View>
    <View style={[styles.field, {justifyContent:'flex-end'}]}>
      <CommonButton title={'save'} onPress={()=>{
        const newBoard:Board = {id:board?.id, title, content};
        id?boardContentMutation.update(newBoard):boardContentMutation.create({...newBoard, user:auth.user?.id, channel:channel_id})
        navigate("Main", {screen:"BoardScreen", params: {id:channel_id}})
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