import React, { useState } from 'react';
import { TextInput } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { CustomTextInputProps } from '../types';

export default (props:CustomTextInputProps)=>{
    const [contentHeight, setContentHeight] = useState<number>()
    const minHeight = props.minHeight || 30
    const theme = useColorScheme()
    return <TextInput style={[{
            borderColor:'#d0d7de', 
            fontSize:16, 
            borderWidth:1, 
            borderRadius:6, 
            paddingHorizontal:10, 
            paddingVertical:3, 
            backgroundColor:Colors[theme].background,
            color:Colors[theme].text,
            height:props.multiline?contentHeight:minHeight,
        }, props.style]}
        placeholder={props.placeholder}
        editable={!props.disabled} 
        value={props.value} 
        onChangeText={props.setValue}
        onContentSizeChange={props.multiline?(e) => setContentHeight(Math.max(e.nativeEvent.contentSize.height, minHeight) + 2):undefined}
        onBlur={()=>props.onBlur?.(props.value)}
        onEndEditing={()=>props.onEndEditing?.(props.value)}
        multiline={props.multiline}
    />
}