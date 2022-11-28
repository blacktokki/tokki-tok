import { FontAwesome } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import useAuthContext from "../hooks/useAuthContext"
import useMessengerChannelList from "../hooks/lists/useMessengerChannelList"
import { navigate } from "../navigation"

export default ()=>{
    const {auth} = useAuthContext()
    const channelList = useMessengerChannelList(auth)

    return <View style={{flex:1, backgroundColor:'white'}}>
        {channelList?.map((item, index)=><CommonItem key={index} bodyStyle={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>navigate("ChatScreen", {id:item.id})}>
            <View style={{flexDirection:'row'}}>
                <FontAwesome size={36} style={{ marginBottom: -3, marginRight:20 }} name='users'/>
                <View>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:18}}>{item.name}</Text>
                        <Text style={{fontSize:18, opacity: 0.4, paddingLeft:5}}>3</Text>
                    </View>
                    <Text style={{fontSize:16, opacity: 0.4}}>Hello world!</Text>
                </View>
            </View>
            <View>
                <Text style={{fontSize:14, opacity: 0.4}}>12:00</Text>
                <Text style={{fontSize:14}}>10</Text>
            </View>
        </CommonItem>)}
    </View>
}