import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Text, Button, View} from 'react-native';
import CommonSection from '../../components/CommonSection';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import useMessengerContentList, { useMessengerContentMutation } from '../../hooks/lists/useMessengerContent.List';
import {MessengerContent} from '../../types'
import useAuthContext from '../../hooks/useAuthContext';
import { useMessengerChannelMutation } from '../../hooks/lists/useMessengerChannelList';
import HeaderRight from '../../components/HeaderRight';
import useMessengerMemberList from '../../hooks/lists/useMessengerMemberList';

export default function ChatScreen({navigation, route}: StackScreenProps<any, 'Chat'>) {
  const channel_id = route?.params?.id
  const height = useRef(0)
  const {auth} = useAuthContext()
  const {data, extraData, fetchNextPage } = useMessengerContentList(channel_id)
  const memberList = useMessengerMemberList(channel_id)
  const member_id = useMemo(()=>memberList?.find(v=>v.user == auth.user?.id)?.id, [auth, memberList])
  const messengerChannelMutation = useMessengerChannelMutation()
  const [value, setValue] = useState('')
  const postValue = ()=>{
    contentMutation.create({channel:channel_id, user:auth.user?.id, content:value})
    setValue('')
  }
  const contentMutation = useMessengerContentMutation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ()=> <HeaderRight extra={[{title:'leave', onPress:()=>{member_id && messengerChannelMutation.leave(member_id);back()}}]}/>
    });
  }, [navigation, route, member_id]);

  const renderItem = useCallback(({item, index}:{item:MessengerContent[], index:number})=>{
    return <View style={{flexDirection: 'column-reverse'}}>{item.map((content, index2)=>{
      const created = content.created.slice(0, 16)
      const isFirst = index2 + 1 == item.length || (content.user != item[index2+1].user || created != item[index2+1].created.slice(0, 16))
      const isSelf = auth.user?.id == content.user
      return<View key={content.id} style={{flexDirection:'row', justifyContent:isSelf?'space-between':'flex-start', width:'100%'}}>
        {isFirst && !isSelf?<MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>:<View style={{width:48}}/>}
        <CommonSection outerContainerStyle={{width:undefined}} title={isFirst?content.name:undefined} titleStyle={{flex:undefined}} bodyStyle={{padding:10}} subtitle={`${created.slice(11)}`}>
          <Text>{content.message_set[0].content}</Text>
        </CommonSection>
      </View>
    })}</View>
  }, [navigation, contentMutation])
  
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.navigate('HomeScreen', {tab:2})
      }
  }
  useEffect(()=>{
    if (!(channel_id))
      back()
  }, [])

  return <View style={{flex:1, alignItems:'center'}}>
    <FlatList
        style={{width:'100%', flexDirection: 'column-reverse', marginBottom:30}}
        contentContainerStyle={{padding:10, flexGrow:1, flexDirection: 'column-reverse'}}
        data={[extraData, ...(data?.pages || [])]}
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
