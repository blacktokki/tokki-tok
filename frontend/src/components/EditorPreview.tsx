import React, { Suspense } from 'react'
import CommonSection from "./CommonSection"
import { View, Text } from "./Themed"
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

const RenderHTML = React.lazy(()=> import('react-native-render-html'))

export const regexForStripHTML = /<\/?[^>]*>/gi;

export default React.memo(({content}:{content:string})=>{
    const theme = useColorScheme()
    return <Suspense fallback={<Text>{content.replaceAll(regexForStripHTML, '')}</Text>}>
        <RenderHTML contentWidth={320} source={{'html':content}} baseStyle={{color:Colors[theme].text}}/>
    </Suspense>

})