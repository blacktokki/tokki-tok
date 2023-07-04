import React from 'react';
import {View} from 'react-native'
import {Text} from './Themed';
import { ProfileProps } from '../types';
import Avatar from './Avatar';

export default (props:ProfileProps)=>{
    return <View style={{width:'100%', height:135, justifyContent:'space-evenly', alignItems:'center'}}>
        <Avatar {...props} size={75}/>
        <Text style={{fontWeight:'bold', fontSize:15}}>{props.name}</Text>
        <Text style={{fontWeight:'normal', fontSize:14}}>{props.username}</Text>
    </View>
}