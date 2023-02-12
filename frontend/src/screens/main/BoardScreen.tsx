import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {FlatList, Image, Linking } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import Hyperlink from 'react-native-hyperlink'
import useBoardContentList, { useBoardContentMutation } from '../../hooks/lists/useBoardContentList';
import CommonSection from '../../components/CommonSection';
import { View, Text } from '../../components/Themed';
import CommonButton from '../../components/CommonButton';
import { BoardContent } from '../../types';
import HeaderRight from '../../components/HeaderRight';
import useBoardChannelList, { useBoardChannelMutation } from '../../hooks/lists/useBoardChannelList';
import useAuthContext from '../../hooks/useAuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useRescaleWindow from '../../hooks/useRescaleWindow';




export default function BoardScreen({navigation, route}: StackScreenProps<any, 'Board'>) {
  const channel_id = route?.params?.id
  const {auth} = useAuthContext()
  const channel = useBoardChannelList(auth)?.find(v=>v.id==parseInt(channel_id))
  const contentList = useBoardContentList(channel_id)
  const boardChannelMutation = useBoardChannelMutation()
  const contentMutation = useBoardContentMutation()
  const scaleType = useRescaleWindow()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ()=> <HeaderRight extra={[{title:'delete', onPress:()=>{boardChannelMutation.delete(channel_id);back()}}]}/>,
      title: channel?.name
    });
  }, [navigation, route]);
  
  const renderItem = useCallback(({item}:{item:BoardContent})=><CommonSection bodyStyle={{alignItems:'flex-start', paddingHorizontal:'5%'}}>
    <View style={{flexDirection:scaleType?'column': 'row', width:'100%', justifyContent:'space-between'}}>
      <View style={{flexDirection:'row'}}>
        <MaterialIcons size={38} style={{marginBottom: -3, marginRight:10 }} name='account-circle'/>
        <View>
          <Text style={{fontSize:16}}>{item.name}</Text>
          <Text style={{fontSize:14, opacity: 0.4}}>{item.created.split('.')[0].replace('T', ' ')}</Text>
        </View>
      </View>
      <View style={{flexDirection:'row', height:scaleType?'45%':'80%'}}>
        <CommonButton title={'edit'} onPress={()=>navigation.navigate("BoardEditScreen", {channel_id:item.channel, id:item.id})}/>
        <CommonButton title={'delete'} style={{marginHorizontal:5}} onPress={()=> contentMutation.delete(item.id)}/>
      </View>
    </View>
    <Text style={{fontSize:20}}>{item.board_set[0].title}</Text>
    {/* @ts-ignore */}
    <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}}>
      <Text style={{fontSize:14}}>{item.board_set[0].content}</Text>
    </Hyperlink>
    {item.link_set.map((link, linkIndex)=><CommonSection key={linkIndex} containerStyle={{marginHorizontal:0}} bodyStyle={{padding:0}}>
      <TouchableOpacity onPress={()=>Linking.openURL(link.url)} style={{flexDirection:'row'}} containerStyle={{width:'100%'}}>
          <Image source={{uri:link.image}} resizeMode="cover" style={{ width:'100%', maxWidth:scaleType?120:150, maxHeight:scaleType?120:150, borderWidth:1}}/>
          <View style={{flex:1, marginHorizontal:20}}>
            <Text style={{fontSize:20}}>{link.title}</Text>
            <Text style={{fontSize:14}}>{link.description}</Text>
            <Text style={{fontSize:12}}>{link.url}</Text>
          </View>
        </TouchableOpacity>
      </CommonSection>
    )}
  </CommonSection>
  , [navigation, contentMutation, scaleType])
  
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
        contentContainerStyle={{flexGrow:1}}
        ListHeaderComponent={()=><CommonSection bodyStyle={{flexDirection:'row', justifyContent:'flex-end', paddingVertical:0, borderWidth:0}}>
            <CommonButton title={'write'} style={{paddingHorizontal:32, paddingBottom:8}} onPress={()=>navigation.navigate("BoardEditScreen", {channel_id})}/>
        </CommonSection>}
      />
  </View>
}
// outerContainerStyle={{alignContent:'flex-end'}} containerStyle={{width:'50%'}}
