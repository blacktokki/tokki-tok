import React from 'react';
// import { MaterialIcons } from "@expo/vector-icons"
import Avatar from '../lib/react-native-paper/Avatar';
import { AvatarProps } from '../types';

export default (props:AvatarProps)=>{
    // return <MaterialIcons size={38} style={{ marginBottom: -3, marginRight:10 }} name='account-circle'/>
    return <Avatar {...props}/>
}

