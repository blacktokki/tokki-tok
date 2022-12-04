import React from 'react';
import {View} from 'react-native'
import Profile from '../lib/react-native-paper/Profile';
import { ProfileProps } from '../types';

export default (props:ProfileProps)=>{
    return <View style={{width:'100%', height:135}}>
        <Profile {...props}/>
    </View>
}

