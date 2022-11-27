import React, {useCallback, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import useMessengerContentList, { useMessengerContentMutation } from '../../hooks/lists/useMessengerContent.List';
import {MessengerContent} from '../../types'
import useAuthContext from '../../hooks/useAuthContext';

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const height = useRef(0)
  const {auth} = useAuthContext()
  const {data, fetchNextPage } = useMessengerContentList(channel_id)
  const [value, setValue] = useState('')
  const postValue = ()=>{
    contentMutation.create({channel:channel_id, user:auth.user?.id, content:value})
    setValue('')
  }
  const contentMutation = useMessengerContentMutation()
  const renderItem = useCallback(({item}:{item:MessengerContent[]})=>{
    return <View style={{flexDirection: 'column-reverse'}}>{item.map((content, index)=>{
      const isFirst = index + 1 == item.length || content.user != item[index+1].user
      const isSelf = auth.user?.id == content.user
      return<View key={content.id} style={{flexDirection:'row', justifyContent:isSelf?'space-between':'flex-start', width:'100%'}}>
        {isFirst && !isSelf?<MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>:<View style={{width:48}}/>}
        <CommonSection outerContainerStyle={{width:undefined}} title={isFirst?content.name:undefined} titleStyle={{flex:undefined}} bodyStyle={{padding:10}} subtitle={`${content.id} ${isFirst} ${isSelf}`}>
          <Text>{content.message_set[0].content}</Text>
        </CommonSection>
      </View>
    })}</View>
  }, [navigation, contentMutation])
  
  return <View style={{flex:1, alignItems:'center'}}>
    <FlatList
        style={{width:'100%', flexDirection: 'column-reverse'}}
        contentContainerStyle={{padding:10, flexGrow:1, flexDirection: 'column-reverse'}}
        data={data?.pages}
        renderItem={renderItem}
        onScroll={(e)=>{
          if (e.nativeEvent.contentOffset.y + e.nativeEvent.contentSize.height - height.current == 0)
            fetchNextPage()
        }}
        onLayout={(p)=>{height.current = p.nativeEvent.layout.height}}
      />
      <CommonSection containerStyle={{margin: 0}} bodyStyle={{position:'absolute', top:-30, flexDirection:'row', paddingVertical:0, borderWidth:0}}>
        <TextInput value={value} onChangeText={setValue} style={{borderWidth:1}} onSubmitEditing={postValue}/><CommonButton title={'write'} onPress={postValue}/>
      </CommonSection>
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
