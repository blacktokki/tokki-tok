import React from 'react'
import CommonSection from "./CommonSection"
import { View, Text } from "./Themed"
import { EditorContent } from "../types"
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

const RenderHTML = React.lazy(()=> import('react-native-render-html'))

export default ({content}:{content:EditorContent})=>{
    const theme = useColorScheme()
    return <View>
        <Text style={{fontSize:18, fontWeight:'600', minWidth:140}}>{content.title}</Text>
        <CommonSection containerStyle={{width:'100%', margin:0}} bodyStyle={{borderWidth:0, borderRadius:0, borderLeftWidth:2, padding:0, paddingLeft:5, alignItems:"flex-start"}}>
            <RenderHTML contentWidth={320} source={{'html':content.description}} baseStyle={{color:Colors[theme].text}}/>
        </CommonSection>
    </View>
}