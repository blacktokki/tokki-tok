import React, { useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import useIsMobile from '../hooks/useIsMobile'

type ViewProps = {windowType:'landscape'|'portrait', children:React.ReactNode}

export default (props:ViewProps)=>{
    const isMobile = useIsMobile()
    const [height, setHeight] = useState(window.innerHeight + 1)
    useEffect(()=>{
        if(isMobile && Platform.OS == 'web'){
            const onScroll = (e:any)=>{
                setHeight(window.innerHeight + 1)
            }
            window.addEventListener("touchmove", onScroll)
            return () => window.removeEventListener("touchmove", onScroll)
        }
    },[ isMobile])
    useEffect(()=>{
        setHeight(window.innerHeight + 1)
    }, [props.windowType])
    return <View style={{height:isMobile&&Platform.OS == 'web'?height:'100%'}}>
        {props.children}
    </View>

}
  