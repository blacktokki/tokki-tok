import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, StyleProp, ViewStyle} from 'react-native';
import Colors from '../constants/Colors';
import { CustomButtonProps } from '../types';

const DefaultButton = (props:CustomButtonProps)=>{
    const [hover, setHover] = useState(false)
    return <Pressable
        onPress={()=>props.onPress()}
        //@ts-ignore
        onHoverIn={()=>setHover(true)}
        onHoverOut={()=>setHover(false)}
        style={[
            {
                paddingVertical:5, 
                paddingHorizontal:16
            },
            props.style,
            hover?{backgroundColor:props.color}:{}
        ]}>
            <Text selectable={false} style={[{fontSize:14}, props.textStyle]}>{props.title}</Text>
        </Pressable>
}

export default (props:CustomButtonProps)=>{
    const _props = {
        color:Colors.button.color,
        ...props,
        style:[
            styles.style,
            props.style,
        ] as StyleProp<ViewStyle>,
        textStyle:[
            styles.text, props.textStyle
        ]
    }
    return <DefaultButton {..._props}/>
}

const styles = StyleSheet.create({
    style:{
        borderRadius:6, 
        borderColor:Colors.button.borderColor, 
        borderWidth:1, 
        backgroundColor:Colors.button.backgroundColor
    },
    text:{
        color:'black', 
        textAlign:'center', 
        fontWeight:'600'
    }
});
