import React from 'react'
import CommonSection from "./CommonSection";
import useResizeContext from '../hooks/useResizeContext';

export default (props:{children?: React.ReactNode})=>{
    const windowType = useResizeContext();
    return <CommonSection
        autoScale
        outerContainerStyle={{flex:1, alignSelf:'center', backgroundColor:'#8888', flexShrink:1, width:'100%'}}
        containerStyle={{flex:1, margin:0, justifyContent:'center', alignItems:'center'}}
        bodyStyle={windowType=='landscape'?{width:'90%', height:'90%', padding:'5%'}:{width:'100%', height:'100%', maxWidth:1080}}
    >
        {props.children}
    </CommonSection>
}

export const BottomSheet = (props:{children?: React.ReactNode})=><CommonSection
    autoScale
    outerContainerStyle={{flex:1, alignSelf:'center', backgroundColor:'#8888', width:'100%'}}
    containerStyle={{flex:1, margin:0, justifyContent:'flex-end'}}
>
    {props.children}
</CommonSection>