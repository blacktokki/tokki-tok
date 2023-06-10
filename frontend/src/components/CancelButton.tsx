import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import Colors from "../constants/Colors"
import useColorScheme from "../hooks/useColorScheme"
import CommonButton from './CommonButton'
import { StyleProp, ViewStyle } from 'react-native'


export default (props:{onPress:()=>void, size:number, style:StyleProp<ViewStyle>})=>{
    const theme = useColorScheme()
    return <CommonButton title={''} onPress={props.onPress} style={props.style}>
        <Ionicons size={props.size} name="arrow-back" color={Colors[theme].text}/>
    </CommonButton>
}