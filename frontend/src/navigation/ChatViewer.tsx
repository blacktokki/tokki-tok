import React from 'react';
import Messages from '../screens/main/ChatScreen/Messages';
import { View, useWindowDimensions } from 'react-native';

function getChannelId(l:Location){
    var params = l.search.slice(1).split('&').filter(v=>v.startsWith('id='))
    if (params.length>0)
        return parseInt(params[0].split('=')[1])
}


export default ()=>{
    const channel_id = getChannelId(window.location)
    const dimensions = useWindowDimensions()
    return channel_id ? <View style={{height:dimensions.height}}>
        <Messages channel_id={channel_id}/>
    </View>:<></>
}
