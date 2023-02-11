import React from 'react';

import { View, Text, TextProps, StyleProp } from 'react-native';

type Props = {
  name: string,
  width?:number,
  children: React.ReactNode
  textStyle?: StyleProp<TextProps>
}

export default function RowField(props:Props) {
  return (
    <View style={{flexDirection:'row', alignItems: 'center', justifyContent:'space-between', paddingVertical:5}}>
        <Text style={[{flex:1, paddingHorizontal: 15, fontSize:16}, props.textStyle]}>{props.name}</Text>
        <View style={{
        // backgroundColor: '#171717',
        flex: 6,
        justifyContent: 'center',
        paddingHorizontal: 15,
        }}>
          <View style={{width:props.width}}>
            {props.children}
          </View>
        </View>
    </View>
  )
}