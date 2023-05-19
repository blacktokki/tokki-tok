import React from 'react';
import {View} from 'react-native'
import {Text} from './Themed';
import { ProfileProps } from '../types';
import Avatar from './Avatar';
import TextButton from './TextButton';
import CommonTextInput from './CommonTextInput';
import { patchUser } from '../apis';
import useAuthContext from '../hooks/useAuthContext';

export default (props:ProfileProps)=>{
    const [name, setName] = React.useState<string>()
    const { auth, dispatch } = useAuthContext()
    const isSelf = auth.user?.id == props.userId
    const onChange = ()=>{
        isSelf && patchUser({id:props.userId, name:name || ''}).finally(()=>{
            setName(undefined)
            dispatch({type:"REFRESH"})
        })
    }
    return <View style={{width:'100%', height:135, justifyContent:'space-evenly', alignItems:'center'}}>
        <Avatar {...props} size={75}/>
        {name===undefined?
            <TextButton textStyle={{fontWeight:'bold', fontSize:15}} onPress={()=>isSelf && setName(props.name)} title={props.name} disabled={!isSelf}/>:
            <CommonTextInput value={name} style={{textAlign:'center'}} setValue={setName} onBlur={onChange} onEndEditing={onChange} />}
        <Text style={{fontWeight:'normal', fontSize:14}}>{props.username}</Text>
    </View>
}