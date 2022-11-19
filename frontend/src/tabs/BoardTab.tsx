import { FontAwesome } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import useBoardChannelList from "../hooks/lists/useBoardChannelList"
import useLoginContext from "../hooks/useLoginContext"
import { navigate } from "../navigation"

export default ()=>{
    const {user} = useLoginContext()
    const channelList = useBoardChannelList(user)
    return <View style={{flex:1, backgroundColor:'white'}}>
        {channelList?.map(item=><CommonItem key={item.id} bodyStyle={{flexDirection:'row', justifyContent:'flex-start'}} onPress={()=>navigate("BoardScreen", {id:item.id})}>
            <FontAwesome size={32} style={{ marginBottom: -3, marginRight:10 }} name='bars'/>
            <Text style={{fontSize:20, fontWeight:'400'}}>{item.name}</Text>
        </CommonItem>)}
    </View>
}