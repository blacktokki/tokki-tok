import React from 'react'
import CommonSection from "./CommonSection";
import useResizeContext from '../hooks/useResizeContext';

export default (props:{children?: React.ReactNode})=>{
    const windowType = useResizeContext();
    return <CommonSection
        outerContainerStyle={{flex:1, alignSelf:'center', backgroundColor:'#8888', maxWidth:undefined, flexShrink:1}}
        containerStyle={{flex:1, margin:0, justifyContent:'center', alignItems:'center'}}
        bodyStyle={windowType=='landscape'?{width:'90%', height:'90%', padding:'5%'}:{width:'100%', height:'100%', maxWidth:1080}}
    >
        {props.children}
    </CommonSection>
}

export const BottomSheet = (props:{children?: React.ReactNode})=><CommonSection
    outerContainerStyle={{flex:1, alignSelf:'center', backgroundColor:'#8888', maxWidth:undefined}}
    containerStyle={{flex:1, margin:0, justifyContent:'flex-end'}}
>
    {props.children}
</CommonSection>