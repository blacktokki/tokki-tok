import React from 'react'
import { Image, Linking } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import CommonSection from "./CommonSection"
import { View, Text } from "./Themed"
import { EditorContent, Link } from "../types"
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

const RenderHTML = React.lazy(()=> import('react-native-render-html'))

export default ({content}:{content:EditorContent})=>{
    const theme = useColorScheme()

    return <CommonSection containerStyle={{marginHorizontal:0}} bodyStyle={{padding:0}}>
        <RenderHTML contentWidth={320} source={{'html':content.description}} baseStyle={{color:Colors[theme].text}}/>
    </CommonSection>
}