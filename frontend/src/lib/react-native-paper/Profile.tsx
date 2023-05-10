import * as React from 'react';
import {View} from 'react-native';
import {Text} from '../../components/Themed';
import { Avatar } from 'react-native-paper';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { ProfileProps } from '../../types';

export default (props:ProfileProps) => {
    const theme = useColorScheme()
    return <View style={{width:'100%', height:135, justifyContent:'space-evenly', alignItems:'center'}}>
        <Avatar.Text style={{backgroundColor:Colors[theme].header}} size={75} label={props.name.split(' ').map(v=>v[0]).join().toUpperCase()} />
        <Text style={{fontWeight:'bold', fontSize:15}}>{props.name}</Text>
        <Text style={{fontWeight:'normal', fontSize:14}}>{props.username}</Text>
    </View>
};