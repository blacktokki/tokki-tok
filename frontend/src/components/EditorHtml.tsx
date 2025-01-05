import React, { Suspense } from 'react'
import { View, Text } from "./Themed"
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import { ScrollView } from 'react-native';

const RenderHTML = React.lazy(()=> import('react-native-render-html'))

export const regexForStripHTML = /<\/?[^>]*>/gi;

export default React.memo(({content}:{content:string})=>{
    const theme = useColorScheme()
    return <ScrollView contentContainerStyle={{paddingHorizontal:15, backgroundColor:Colors[theme].background}}>
        <Suspense fallback={<Text>{content.replaceAll(regexForStripHTML, '')}</Text>}>
            <RenderHTML defaultTextProps={{selectable:true}} contentWidth={320} source={{'html':content}} baseStyle={{color:Colors[theme].text}}/>
        </Suspense>
    </ScrollView>
})