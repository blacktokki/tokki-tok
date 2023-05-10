import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, StyleProp, ViewStyle} from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
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
    const theme = useColorScheme()
    const _props = {
        color:Colors[theme].buttonColor,
        ...props,
        style:[
            styles.style,
            {
                backgroundColor:Colors[theme].buttonBackgroundColor
            },
            props.style,
        ] as StyleProp<ViewStyle>,
        textStyle:[
            styles.text, 
            {color:Colors[theme].text},
            props.textStyle
        ]
    }
    return <DefaultButton {..._props}/>
}

const styles = StyleSheet.create({
    style:{
        borderRadius:6, 
        borderColor:Colors.button.borderColor, 
        borderWidth:1, 
    },
    text:{
        textAlign:'center', 
        fontWeight:'600'
    }
});
