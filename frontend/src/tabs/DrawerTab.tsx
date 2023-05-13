import React from "react"
import { View, Text } from "../components/Themed"
import CommonItem from "../components/CommonItem"
// import useBoardChannelList from "../lib/blacktokki-board/useBoardChannelList"
import { useMessengerChannelSorted } from "../hooks/lists/useMessengerChannelList"
import useAuthContext from "../hooks/useAuthContext"
import { navigate } from "../navigation"

const DrawerTab = (props:{data:{name:string, onPress?:()=>void}[]})=><View style={{flex:1}}>
    {props.data.map((item, index)=><CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={item.onPress}>
        <Text style={{marginLeft:20}}>{item.name}</Text>
    </CommonItem>
    )}
</View>

export default {
    Messenger:()=>{
        const {auth} = useAuthContext()
        const channelList = useMessengerChannelSorted(auth);
        return <DrawerTab data={(channelList || []).map(item=>({...item, onPress:()=>navigate("ChatScreen", {id:item.id})}))}/>
    },
    // Board:()=>{
    //     const {auth} = useAuthContext()
    //     const channelList = useBoardChannelList(auth);
    //     return <DrawerTab data={(channelList || []).map(item=>({...item, onPress:()=>navigate("BoardScreen", {id:item.id})}))}/>
    // },
}