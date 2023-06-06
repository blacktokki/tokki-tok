import { Ionicons, FontAwesome } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../../components/CommonItem"
import useAuthContext from "../../hooks/useAuthContext"
import { useMessengerChannelSorted } from "../../hooks/lists/useMessengerChannelList"
import { navigate } from "../../navigation"
import { ScrollView } from "react-native-gesture-handler"

export default ()=>{
    const {auth} = useAuthContext()
    const channelList = useMessengerChannelSorted(auth)
    const today = (new Date()).toISOString().slice(0, 10)
    return <ScrollView style={{flex:1, backgroundColor:'white'}}>
        {channelList?.map((item, index)=>{
            const date = item.last_message?.created.slice(0,10)
            return <CommonItem key={index} bodyStyle={{flexDirection:'row', justifyContent:'space-between'}} onPress={()=>navigate("ChatScreen", {id:item.id})}>
                <View style={{flexDirection:'row'}}>
                    <FontAwesome size={36} style={{ marginBottom: -3, marginRight:20 }} name='users'/>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:18}}>{item.name}</Text>
                            <Text style={{fontSize:18, opacity: 0.4, paddingLeft:5}}>{item.member_count}</Text>
                        </View>
                        <Text style={{fontSize:16, opacity: 0.4}}>{item.last_message?.content}</Text>
                    </View>
                </View>
                <View>
                    <Text style={{fontSize:14, opacity: 0.4, textAlign:'right'}}>{date==today?item.last_message?.created.slice(11,16):date}</Text>
                    <Text style={{fontSize:14, textAlign:'right'}}>{item.unread_count?item.unread_count:' '}</Text>
                </View>
            </CommonItem>
        })}
    </ScrollView>
}

export const MessengerIcon = <Ionicons size={30} style={{ marginBottom: -3 }} name='chatbox'/>