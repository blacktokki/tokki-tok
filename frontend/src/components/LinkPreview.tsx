import React from 'react'
import { Image, Linking } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import CommonSection from "./CommonSection"
import { View, Text } from "./Themed"
import { Link } from "../types"



export default ({link, isMobile}:{link:Link, isMobile:boolean})=>{
    return <CommonSection containerStyle={{marginHorizontal:0}} bodyStyle={{padding:0}}>
    <TouchableOpacity 
        onPress={()=>Linking.openURL(link.url)}
        onLongPress={()=>{}}
        style={{width:'100%', flexDirection:'row'}}
    >
        {link.image && <Image source={{uri:link.image}} resizeMode="cover" style={{ width:'100%', maxWidth:isMobile?120:150, maxHeight:isMobile?120:150, borderWidth:1}}/>}
        <View style={{flex:1, marginHorizontal:20}}>
        <Text style={{fontSize:18}}>{link.title}</Text>
        <Text style={{fontSize:14}}>{link.description}</Text>
        <Text style={{fontSize:12}}>{link.url}</Text>
        </View>
    </TouchableOpacity>
    </CommonSection>
}