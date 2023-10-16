import React, {useState} from "react"
import {View, TouchableOpacity} from 'react-native'
import { Text } from "../../../components/Themed";
import useUploadContext from "../../../hooks/useUploadContext";

const UploadTag = (props:{data:{filename:string, progress?:number}, index:number, isExpand:boolean, setExpand:(index?:number)=>void})=>{
    return <View style={{backgroundColor:'lightgray', borderRadius:20, overflow:'hidden', margin:5}}>
        <View style={{backgroundColor:'darkgray', position:'absolute', width:`${(props.data.progress || 0)*100}%`, height:'100%'}}/>
        <View style={{paddingVertical:5, paddingHorizontal:5, flexDirection:'row'}}>
            <Text>📤</Text>
            <View style={{paddingHorizontal:5}}><Text>{props.data.filename}</Text></View>
        </View>
    </View>
}


export default (props:{channel_id:number})=>{
    const { upload } = useUploadContext()
    const [expand, setExpand] = useState<number>()
    const uploadData = upload[props.channel_id]
    return <View style={{flexDirection:'row', paddingTop:5, paddingHorizontal:(uploadData?.length || 0)>0?20:0}}>
        {uploadData?.map((f,i)=><UploadTag key={i} data={f} index={i} isExpand={i==expand} setExpand={setExpand}/>)}
    </View>
}