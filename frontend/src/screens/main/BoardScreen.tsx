import React, {useState, useEffect} from 'react';
import {FlatList } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import useBoardContentList from '../../hooks/lists/useBoardContentList';
import CommonSection from '../../components/CommonSection';
import { View, Text } from '../../components/Themed';
import CommonButton from '../../components/CommonButton';
import { deleteBoardContent } from '../../apis';
import { navigate } from '../../navigation';
import { BoardContent } from '../../types';

const renderItem = ({item}:{item:BoardContent})=><CommonSection bodyStyle={{alignItems:'flex-start', paddingHorizontal:35}}>
  <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
    <View style={{flexDirection:'row'}}>
      <MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>
      <View>
        <Text style={{fontSize:16}}>{item.name}</Text>
        <Text style={{fontSize:14, opacity: 0.4}}>{item.created}</Text>
      </View>
    </View>
    <View style={{flexDirection:'row'}}>
      <CommonButton title={'edit'} onPress={()=>navigate("BoardEditScreen", {channel_id:item.channel, id:item.id})}/>
      <CommonButton title={'delete'} onPress={()=>deleteBoardContent(item.id).then(()=>navigate('BoardScreen', {id:item.channel}))}/>
    </View>
  </View>
  <Text style={{fontSize:20}}>{item.board_set[0].title}</Text>
  <Text style={{fontSize:14}}>{item.board_set[0].content}</Text>
</CommonSection>


export default function BoardScreen({navigation, route}: StackScreenProps<any, 'Board'>) {
  const channel_id = route?.params?.id
  const back = ()=>{
    if(navigation.canGoBack())
        navigation.goBack()
      else{
        navigation.navigate('HomeScreen')
      }
  }
  useEffect(()=>{
    if (!(channel_id))
      back()
  }, [])
  if (!channel_id && navigation.canGoBack()) {
    navigation.goBack()
    return <></>
  }
  const contentList = useBoardContentList(channel_id, [route])
  return <View style={{flex:1, backgroundColor:'white'}}>
      <FlatList
        data={contentList}
        renderItem={renderItem}
        ListFooterComponent={()=><CommonSection bodyStyle={{flexDirection:'row', justifyContent:'flex-end', paddingVertical:0, borderWidth:0}}>
            <CommonButton title={'write'} onPress={()=>navigate("BoardEditScreen", {channel_id})}/>
        </CommonSection>}
      />
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
