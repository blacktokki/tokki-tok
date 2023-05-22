import React from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import CommonSection from "./CommonSection"
import { Linking, TextStyle } from "react-native"
import { FontAwesome } from '@expo/vector-icons'; 
import { View, Text } from "./Themed"
import { File } from "../types"
import useColorScheme from '../hooks/useColorScheme';

function humanFileSize(size:number) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }
  

export default ({file, isMobile, showBorder}:{file:File, isMobile:boolean, showBorder:boolean})=>{
    const theme = useColorScheme()
    return <CommonSection containerStyle={{marginHorizontal:0}} bodyStyle={showBorder?{padding:10}:{borderWidth:0, padding:0}}>
    <TouchableOpacity onPress={()=>Linking.openURL(file.file)} style={{flexDirection:'row', alignItems:'flex-start'}} containerStyle={{width:'100%'}}>
        <FontAwesome name="file-o" size={20} color={theme=='light'?'black':'white'} />
        <View style={{flex:1, marginHorizontal:10}}>
            <Text style={{fontSize:18}}>{file.filename}</Text>
            <Text style={{fontSize:14}}>{humanFileSize(file.filesize)}</Text>
        </View>
    </TouchableOpacity>
    </CommonSection>
}