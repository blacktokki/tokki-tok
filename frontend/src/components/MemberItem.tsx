import React from "react"
import CommonItem from "./CommonItem"
import { User } from "../types"
import Avatar from "./Avatar"
import { Text, View } from "./Themed"

export default ({member:item, onPress}:{member:User, onPress?:()=>void})=> {
    return <CommonItem key={item.id} bodyStyle={{flexDirection:'row', justifyContent:'flex-start'}} onPress={onPress}>
        <View style={{marginTop:4, marginRight:12}}><Avatar name={item.name} userId={item.id} size={44}/></View>
        <Text style={{fontSize:20, fontWeight:'400'}}>{item.name}</Text>
    </CommonItem>
}