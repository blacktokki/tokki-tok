import React, { useEffect, useState } from 'react';

import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import RowField from './RowField';

type Props = {
  name: string,
  value: any,
  setValue?: (value:any)=>void
  width?:any
  disabled?:boolean
  multiline?:boolean
  textStyle?:StyleProp<TextStyle>
  style?:StyleProp<ViewStyle>
}

export default function TextField(props:Props) {
  const [contentHeight, setContentHeight] = useState<number>()
  return (
    <RowField name={props.name} width={props.width} textStyle={props.textStyle}>
      <TextInput style={[{
          borderColor:'#d0d7de', 
          fontSize:16, 
          borderWidth:1, 
          borderRadius:6, 
          paddingHorizontal:10, 
          paddingVertical:3, 
          backgroundColor:props.disabled?'#EEE':undefined,
          height:props.multiline?contentHeight:30
        }, props.style]} editable={!props.disabled} value={props.value} onChangeText={props.setValue}
        onContentSizeChange={props.multiline?(e) => setContentHeight(e.nativeEvent.contentSize.height + 2):undefined} 
        multiline={props.multiline}
      ></TextInput>
   </RowField>
  )
}