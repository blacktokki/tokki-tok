import React, { MutableRefObject } from 'react'
import { Image, Linking } from "react-native"
import {TouchableOpacity} from "react-native-gesture-handler"
import CommonSection from "./CommonSection"
import { FontAwesome } from '../lib/@expo/vector-icons'; 
import { View, Text } from "./Themed"
import { File } from "../types"
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

function humanFileSize(size:number) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }
  

export default ({file, isMobile, showBorder, touchableRef}:{file:File, isMobile:boolean, showBorder:ConstrainBoolean, touchableRef:MutableRefObject<()=>boolean>})=>{
    const theme = useColorScheme()
    return <CommonSection containerStyle={{marginHorizontal:0}} bodyStyle={showBorder?{padding:10}:{borderWidth:0, padding:0}}>
    <TouchableOpacity 
        onPress={()=>touchableRef.current() && Linking.openURL(file.file)} 
        onLongPress={()=>{}}
        style={{flexDirection:'row', alignItems:'flex-start', width:'100%'}} 
    >
        {   file.thumbnail?
            <Image source={{uri:file.thumbnail}} resizeMode="cover" style={{width:isMobile?120:150, height:isMobile?120:150, borderWidth:1}}/>:
            <FontAwesome name="file-o" size={20} color={Colors[theme].iconColor} />}
        <View style={{flex:1, marginHorizontal:10}}>
            <Text style={{fontSize:18}}>{file.filename}</Text>
            <Text style={{fontSize:14}}>{humanFileSize(file.filesize)}</Text>
        </View>
    </TouchableOpacity>
    </CommonSection>
}