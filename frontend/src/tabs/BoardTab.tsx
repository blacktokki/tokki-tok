import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import useBoardChannelList from "../hooks/lists/useBoardChannelList"
import useAuthContext from "../hooks/useAuthContext"
import { navigate } from "../navigation"

export default ()=>{
    const {auth} = useAuthContext()
    const channelList = useBoardChannelList(auth)
    return <View style={{flex:1, backgroundColor:'white'}}>
        {channelList?.map(item=><CommonItem key={item.id} bodyStyle={{flexDirection:'row', justifyContent:'flex-start'}} onPress={()=>navigate("BoardScreen", {id:item.id})}>
            <FontAwesome size={32} style={{ marginBottom: -3, marginRight:10 }} name='bars'/>
            <Text style={{fontSize:20, fontWeight:'400'}}>{item.name}</Text>
        </CommonItem>)}
    </View>
}

export const BoardIcon = <FontAwesome5 size={30} style={{ marginBottom: -3 }} name='clipboard-list'/>