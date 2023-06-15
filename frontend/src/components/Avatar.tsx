import React from 'react';
import Avatar from '../lib/react-native-paper/Avatar';
import { AvatarProps, MessengerChannel, User } from '../types';

export function avatarFromChannel(item:MessengerChannel, user?:User|null){
    let avatar;
    let name = item.name
    if (item.member_count<3){
        avatar = (item.member_count==1 || user?.id == item.subowner.id)?item.owner:item.subowner
        name = name.length>0?name:avatar.name 
    }
    return {avatar, name}
}

export default (props:AvatarProps)=>{
    return <Avatar {...props}/>
}

