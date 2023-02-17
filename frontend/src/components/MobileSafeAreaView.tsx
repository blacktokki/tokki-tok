import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, View } from 'react-native'
import useIsMobile from '../hooks/useIsMobile'

type ViewProps = {windowType:'landscape'|'portrait', children:React.ReactNode}

export default (props:ViewProps)=>{
    const isMobile = useIsMobile()
    const [height, setHeight] = useState(window.innerHeight + 1)
    useEffect(()=>{
        if(isMobile && Platform.OS == 'web'){
            const onChange = (e:any)=>{
                setHeight(window.innerHeight + 1)
            }
            Dimensions.addEventListener("change",onChange)
            return () => Dimensions.removeEventListener("change", onChange)
            
        }
    },[ isMobile])
    return <View style={{height:isMobile&&Platform.OS == 'web'?height:'100%'}}>
        {props.children}
    </View>

}
  