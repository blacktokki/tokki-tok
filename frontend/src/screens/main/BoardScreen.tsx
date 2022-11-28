import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {FlatList } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import useBoardContentList, { useBoardContentMutation } from '../../hooks/lists/useBoardContentList';
import CommonSection from '../../components/CommonSection';
import { View, Text } from '../../components/Themed';
import CommonButton from '../../components/CommonButton';
import { BoardContent } from '../../types';
import HeaderRight from '../../components/HeaderRight';
import { useBoardChannelMutation } from '../../hooks/lists/useBoardChannelList';




export default function BoardScreen({navigation, route}: StackScreenProps<any, 'Board'>) {
  const channel_id = route?.params?.id
  const contentList = useBoardContentList(channel_id)
  const boardChannelMutation = useBoardChannelMutation()
  const contentMutation = useBoardContentMutation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ()=> <HeaderRight extra={[{title:'delete', onPress:()=>{boardChannelMutation.delete(channel_id);back()}}]}/>
    });
  }, [navigation, route]);
  
  const renderItem = useCallback(({item}:{item:BoardContent})=><CommonSection bodyStyle={{alignItems:'flex-start', paddingHorizontal:35}}>
    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
      <View style={{flexDirection:'row'}}>
        <MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>
        <View>
          <Text style={{fontSize:16}}>{item.name}</Text>
          <Text style={{fontSize:14, opacity: 0.4}}>{item.created}</Text>
        </View>
      </View>
      <View style={{flexDirection:'row'}}>
        <CommonButton title={'edit'} onPress={()=>navigation.navigate("BoardEditScreen", {channel_id:item.channel, id:item.id})}/>
        <CommonButton title={'delete'} onPress={()=> contentMutation.delete(item.id)}/>
      </View>
    </View>
    <Text style={{fontSize:20}}>{item.board_set[0].title}</Text>
    <Text style={{fontSize:14}}>{item.board_set[0].content}</Text>
  </CommonSection>
  , [navigation, contentMutation])
  
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
  return <View style={{flex:1, backgroundColor:'white'}}>
      <FlatList
        data={contentList}
        renderItem={renderItem}
        ListFooterComponent={()=><CommonSection bodyStyle={{flexDirection:'row', justifyContent:'flex-end', paddingVertical:0, borderWidth:0}}>
            <CommonButton title={'write'} onPress={()=>navigation.navigate("BoardEditScreen", {channel_id})}/>
        </CommonSection>}
      />
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
