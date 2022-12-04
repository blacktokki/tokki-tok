import * as React from 'react';
import {View, Text} from 'react-native';
import { Avatar } from 'react-native-paper';
import Colors from '../../constants/Colors';
import { ProfileProps } from '../../types';

export default (props:ProfileProps) => (
    <View style={{width:'100%', height:135, justifyContent:'space-evenly', alignItems:'center'}}>
        <Avatar.Text style={{backgroundColor:Colors.header}} size={75} label={props.name.split(' ').map(v=>v[0]).join().toUpperCase()} />
        <Text style={{fontWeight:'bold', fontSize:15}}>{props.name}</Text>
        <Text style={{fontWeight:'normal', fontSize:14}}>{props.username}</Text>
    </View>
);