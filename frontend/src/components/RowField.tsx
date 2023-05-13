import React, { useMemo } from 'react';

import { TextProps, StyleProp } from 'react-native';
import {View, Text } from './Themed'
import useResizeWindow from '../hooks/useResizeWindow';

type Props = {
  name: string,
  width?:number,
  children: React.ReactNode
  textStyle?: StyleProp<TextProps>
}

export default function RowField(props:Props) {
  const windowType = useResizeWindow()
  const rowStyle = useMemo(()=>windowType=='landscape'?
    {flexDirection:'row', alignItems: 'center', justifyContent:'space-between'}:
    {flexDirection:'column', alignItems:'flex-start'} as any
  , [windowType])
  return (
    <View style={[{paddingVertical:5, width:'100%'}, rowStyle]}>
        <Text style={[windowType=='landscape'?{flex:1}:{width:'100%'},{paddingHorizontal: 15, fontSize:16}, props.textStyle]}>{props.name}</Text>
        <View style={[windowType=='landscape'?{flex:6}:{width:'100%'},{paddingHorizontal: 15}]}>
          <View style={{width:props.width}}>
            {props.children}
          </View>
        </View>
    </View>
  )
}